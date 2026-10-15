#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

groupshared half2 outputs_s[(N + 2) * (N + 2) * (N + 2) >> 1];
groupshared half dopamine_map[N * N * N];
groupshared half sleep_map[N * N * N];
groupshared int inhib_map[N * N * N];
groupshared half weights[N * N * N];
globallycoherent RWStructuredBuffer<half2> membraneNp2;


uint3 indexToCoordN(uint index)
{
    uint x = (index >> SHIFT_X) & MASK;
    uint y = (index >> SHIFT_Y) & MASK;
    uint z = (index >> SHIFT_Z) & MASK;
    return uint3(x, y, z);
}

uint coordToIndexN(uint3 coord)
{
    uint index = (coord.z << SHIFT_Z) | (coord.y << SHIFT_Y) | (coord.x << SHIFT_X);
    return index;
}

uint3 indexToCoordNp2(uint index)
{
    uint x = index % (N+2);
    uint y = (index / (N+2)) % (N+2);
    uint z = (index / ((N+2) * (N+2))) % (N+2);
    return uint3(x, y, z);
}

uint coordToIndexNp2(uint3 coord)
{
    uint index = ((N+2) * (N+2)) * coord.z + (N+2) * coord.y + coord.x;
    return index;
}

half get_weight(StructuredBuffer<half> weights, int3 center_coord, int3 coord_rel) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    return weights[weight_index];
}

half get_weight_27th(StructuredBuffer<half> weights, int3 center_coord) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    return weights[weight_index];
}

half get_output_s(int3 coord) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    return outputs_s[index >> 1][index & 1];
} 

void set_output_s(int3 coord, half val) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    outputs_s[index >> 1][index & 1] = val;
}

uint3 idxNp2h2_to_coordNp2(uint2 index_np2h2) {
    uint index_np2 = index_np2h2.x << 1 | index_np2h2.y;
    return indexToCoordNp2(index_np2);
}

bool is_internal(uint2 index_np2h2) {
    uint3 coord_np2 = idxNp2h2_to_coordNp2(index_np2h2);
    return ((((coord_np2.x - 1) | (coord_np2.y - 1) | (coord_np2.z - 1)) & ~MASK) == 0);
}

void merge_outputs_membrane(uint index_np2h2_x) {
    half2 current_out = outputs_s[index_np2h2_x];
    half2 memb_val = membraneNp2[index_np2h2_x];
    bool is_internal0 = is_internal(uint2(index_np2h2_x, 0));
    bool is_internal1 = is_internal(uint2(index_np2h2_x, 1));
    outputs_s[index_np2h2_x] = half2(
        is_internal0 ? current_out.x : memb_val.x,
        is_internal1 ? current_out.y : memb_val.y
    );
}

struct ResourceParams {
    half base_output;
    half beta;
    half k_refill;
}

struct Link27thParams {
    uint multiplier;
    uint bias;
}

struct LearningParams {
    half learning_rate;
    half forget_rate;
    half learning_threshold;
    half tag_decay;
}

[shader("compute")]
[numthreads(N, N, N)]
void main(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    StructuredBuffer<half> dopamine_map_all,
    StructuredBuffer<half> sleep_map_all,
    StructuredBuffer<int> inhib_map_all,
    StructuredBuffer<half> weights_map_all,
    RWStructuredBuffer<half2> global_poutputs,
    uniform ResourceParams resource_params,
    uniform Link27thParams link27th_params,
    uniform LearningParams learning_params,
)
{
    dopamine_map[groupIndex] = dopamine_map_all[N * N * N * groupID.x + groupIndex];
    sleep_map[groupIndex] = sleep_map_all[N * N * N * groupID.x + groupIndex];
    inhib_map[groupIndex] = inhib_map_all[N * N * N * groupID.x + groupIndex];
    weights[groupIndex] = weights_map_all[N * N * N * groupID.x + groupIndex];
    
    half R = 1.0h;
    uint tag = 0;
    uint TOTAL_np2h2 = (N + 2) * (N + 2) * (N + 2) >> 1;

    for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_np2h2; idx_np2h2 += N * N * N) {
        outputs_s[idx_np2h2] = half2(0.5h, 0.5h);
    }

    GroupMemoryBarrierWithGroupSync();

    for (uint i = 0; i <= 100; i++) {
        half net = 0.0h;
        for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_np2h2; idx_np2h2 += N * N * N) {
            merge_outputs_membrane(idx_np2h2);
        }
        for (int dz = -1; dz <= 1; dz++) {
            for (int dy = -1; dy <= 1; dy++) {
                for (int dx = -1; dx <= 1; dx++) {
                    net += get_output_s(groupThreadID + int3(dx, dy, dz)) * get_weight(weights_map, groupThreadID, int3(dx, dy, dz));
                }
            }
        }
        uint3 coord_27th = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
        net += get_output_s(coord_27th) * get_weight_27th(weights_map, groupThreadID);

        half output_rate = min(1.0h, resource_params.base_output * exp2(net * resource_params.beta));

        GroupMemoryBarrierWithGroupSync();

        set_output_s(groupThreadID, output_rate * R);

        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_params.k_refill);

        for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_np2h2; idx_np2h2 += (N+2) * (N+2) * (N+2) >> 1)
            global_poutputs[TOTAL_np2h2 * groupIndex + idx_np2h2] = outputs_s[idx_np2h2];

    }
}