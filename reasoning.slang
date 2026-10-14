#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

groupshared half2 outputs_s[(N + 2) * (N + 2) * (N + 2) >> 1];
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
    uint2 index0_np2h2 = uint2(index_np2h2_x, 0);
    uint2 index1_np2h2 = uint2(index_np2h2_x, 1);
    bool is_internal0 = is_internal(index0_np2h2);
    bool is_internal1 = is_internal(index1_np2h2);
    outputs_s[index0_np2h2.x][index0_np2h2.y] = half(uint(is_internal0)) * outputs_s[index0_np2h2.x][index0_np2h2.y] + half(uint(!is_internal0)) * membraneNp2[index0_np2h2.x][index0_np2h2.y];
    outputs_s[index1_np2h2.x][index1_np2h2.y] = half(uint(is_internal1)) * outputs_s[index1_np2h2.x][index1_np2h2.y] + half(uint(!is_internal1)) * membraneNp2[index1_np2h2.x][index1_np2h2.y];
}

[shader("compute")]
[numthreads(N, N, N)]
void main(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    StructuredBuffer<half> dopamine_map,
    StructuredBuffer<half> sleep_map,
    StructuredBuffer<int> inhib_map,
    StructuredBuffer<half> weights_map,
    uniform half resource_base_output,
    uniform half resource_beta,
    uniform half resource_k_refill,
    uniform uint link27th_multiplier,
    uniform uint link27th_bias,
    uniform half learning_learning_rate,
    uniform half learning_forget_rate,
    uniform half learning_learning_threshold,
    uniform half learning_tag_decay,
)
{
    half R = 1.0h;
    uint tag = 0;
    uint TOTAL_np2h2 = (N + 2) * (N + 2) * (N + 2) >> 1;

    for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_np2h2; idx_np2h2 += N * N * N) {
        outputs_s[idx_np2h2] = half2(0.0h, 0.0h);
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
        uint3 coord_27th = indexToCoordN(groupIndex * link27th_multiplier + link27th_bias);
        net += get_output_s(coord_27th) * get_weight_27th(weights_map, groupThreadID);

        half output_rate = min(1.0h, resource_base_output * exp2(net * resource_beta));

        GroupMemoryBarrierWithGroupSync();

        set_output_s(groupThreadID, output_rate * R);

        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_k_refill);
    }
}