#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

#define TOTAL_N (N * N * N)
#define P2 (N + 2)
#define TOTAL_NP2 ((N+2)*(N+2)*(N+2))
#define TOTAL_NP2H2 (TOTAL_NP2 >> 1) 

groupshared half outputs_s[(N + 2) * (N + 2) * (N + 2)];
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

half get_weight(uint group_id_x, StructuredBuffer<half> weights, int3 center_coord, int3 coord_rel) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    return weights[group_id_x * (TOTAL_N * 28) + weight_index];
}

half get_weight_27th(uint group_id_x, StructuredBuffer<half> weights, int3 center_coord) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    return weights[group_id_x * (TOTAL_N * 28) + weight_index];
}

half get_output_s(int3 coord) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    return outputs_s[index];
} 

void set_output_s(int3 coord, half val) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    outputs_s[index] = val;
}

uint3 idxNp2h2_to_coordNp2(uint2 index_np2h2) {
    uint index_np2 = index_np2h2.x << 1 | index_np2h2.y;
    return indexToCoordNp2(index_np2);
}

uint2 idxNp2h2x_to_indexNp2_01(uint idx_np2h2x) {
    return uint2(idx_np2h2x << 1, (idx_np2h2x << 1) | 1);
}

bool is_internal(uint2 index_np2h2) {
    uint3 coord_np2 = idxNp2h2_to_coordNp2(index_np2h2);
    return ((((coord_np2.x - 1) | (coord_np2.y - 1) | (coord_np2.z - 1)) & ~MASK) == 0);
}

void merge_outputs_membrane(uint index_np2h2_x) {
    uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(index_np2h2_x);
    half2 current_out = half2(
        outputs_s[idx_np2_01.x],
        outputs_s[idx_np2_01.y]
    );
    half2 memb_val = half2(0.0h, 0.0h); //membraneNp2[index_np2h2_x];
    bool is_internal0 = is_internal(uint2(index_np2h2_x, 0));
    bool is_internal1 = is_internal(uint2(index_np2h2_x, 1));
    outputs_s[idx_np2_01.x] = is_internal0 ? current_out.x : memb_val.x;
    outputs_s[idx_np2_01.y] = is_internal1 ? current_out.y : memb_val.y;
}

struct ResourceParams {
    half base_output;
    half beta;
    half k_refill;
}

struct ResourceParamsAll {
    StructuredBuffer<half> base_output;
    StructuredBuffer<half> beta;
    StructuredBuffer<half> k_refill;
}

struct Link27thParams {
    uint multiplier;
    uint bias;
}

struct Link27thParamsAll {
    StructuredBuffer<uint> multiplier;
    StructuredBuffer<uint> bias;
}

struct LearningParams {
    half learning_rate;
    half forget_rate;
    half learning_threshold;
    half tag_decay;
}

struct LearningParamsAll {
    StructuredBuffer<half> learning_rate;
    StructuredBuffer<half> forget_rate;
    StructuredBuffer<half> learning_threshold;
    StructuredBuffer<half> tag_decay;
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
    RWStructuredBuffer<half2> global_poutputs_all,
    uniform ResourceParamsAll resource_params_all,
    uniform Link27thParamsAll link27th_params_all,
    uniform LearningParamsAll learning_params_all,
)
{
    dopamine_map[groupIndex] = dopamine_map_all[N * N * N * groupID.x + groupIndex];
    sleep_map[groupIndex] = sleep_map_all[N * N * N * groupID.x + groupIndex];
    inhib_map[groupIndex] = inhib_map_all[N * N * N * groupID.x + groupIndex];
    weights[groupIndex] = weights_map_all[N * N * N * groupID.x + groupIndex];

    ResourceParams resource_params;
    resource_params.base_output = resource_params_all.base_output[groupID.x];
    resource_params.beta = resource_params_all.beta[groupID.x];
    resource_params.k_refill = resource_params_all.k_refill[groupID.x];

    Link27thParams link27th_params;
    link27th_params.bias = link27th_params_all.bias[groupID.x];
    link27th_params.multiplier = link27th_params_all.multiplier[groupID.x];

    LearningParams learning_params;
    learning_params.forget_rate = learning_params_all.forget_rate[groupID.x];
    learning_params.learning_rate = learning_params_all.learning_rate[groupID.x];
    learning_params.learning_threshold = learning_params_all.learning_threshold[groupID.x];
    learning_params.tag_decay = learning_params_all.tag_decay[groupID.x];

    half R = 1.0h;
    uint tag = 0;

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += N * N * N) {
        outputs_s[idx_np2] = 0.5h;
    }

    GroupMemoryBarrierWithGroupSync();

    for (uint i = 0; i <= 100; i++) {
        half net = 0.0h;
        for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_NP2H2; idx_np2h2 += N * N * N) {
            merge_outputs_membrane(idx_np2h2);
        }
        for (int dz = -1; dz <= 1; dz++) {
            for (int dy = -1; dy <= 1; dy++) {
                for (int dx = -1; dx <= 1; dx++) {
                    net += get_output_s(groupThreadID + int3(dx, dy, dz)) * get_weight(groupID.x, weights_map_all, groupThreadID, int3(dx, dy, dz));
                }
            }
        }
        uint3 coord_27th = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
        net += get_output_s(coord_27th) * get_weight_27th(groupID.x, weights_map_all, groupThreadID);

        half output_rate = min(1.0h, resource_params.base_output * exp2(net * resource_params.beta));

        GroupMemoryBarrierWithGroupSync();

        set_output_s(groupThreadID, output_rate * R);

        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_params.k_refill);

        for (uint idx_np2h2x = groupIndex; idx_np2h2x < TOTAL_NP2H2; idx_np2h2x += TOTAL_NP2H2) {
            uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(idx_np2h2x);
            global_poutputs_all[TOTAL_NP2H2 * groupID.x + idx_np2h2x] = half2(
            outputs_s[idx_np2_01.x],
            outputs_s[idx_np2_01.y]
            );
        }
    }
}