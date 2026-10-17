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

uint3 idxNp2h2_to_coordNp2(uint2 index_np2h2) {
    uint index_np2 = index_np2h2.x << 1 | index_np2h2.y;
    return indexToCoordNp2(index_np2);
}

uint2 idxNp2h2x_to_indexNp2_01(uint idx_np2h2x) {
    return uint2(idx_np2h2x << 1, (idx_np2h2x << 1) | 1);
}

half get_output(uint group_id_x, uint group_index, StructuredBuffer<half2> outputs_all, uint3 coord_np2) {
    uint idx_np2 = coordToIndexNp2(coord_np2);
    return outputs_all[(group_id_x * 256 + group_index) * TOTAL_NP2H2 + (idx_np2 >> 1)][idx_np2 & 1];
}

void set_membrane(uint group_id_x, uint group_index, RWStructuredBuffer<half2> membrane_all, uint3 coord_np2, half val) {
    uint idx_np2 = coordToIndexNp2(coord_np2);
    uint2 idx_np2h2 = uint2(idx_np2 >> 1, idx_np2 & 1);
    half2 current = membrane_all[(group_id_x * 256 + group_index) * TOTAL_NP2H2 + idx_np2h2.x];
    membrane_all[(group_id_x * 256 + group_index) * TOTAL_NP2H2 + (idx_np2h2.x)] = (idx_np2h2.y == 0)
        ? half2(val, current.y)
        : half2(current.x, val);
}

uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

half2 rand_half2(uint input) {
    return half(float(pcg_hash(input)) / 4294967295.0);
}


[numthreads(256, 1, 1)]
[shader("compute")]
void main(
    uint3 groupID: SV_GroupID,
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    StructuredBuffer<half2> global_poutputs_all,
    RWStructuredBuffer<float2> object_pos_all,
    RWStructuredBuffer<half2> membrane_all,
    RWStructuredBuffer<float2> position_all,
    RWStructuredBuffer<uint> goal_count_all,
    uniform half dt, // second
    uniform uint step
) {
    uint agent_id = (256 * groupID.x + groupIndex);

    float world_size = 100.0h;

    half2 speed = 10 * half2(
        get_output(groupID.x, groupIndex, global_poutputs_all, uint3(3, 2, 1)) - get_output(groupID.x, groupIndex, global_poutputs_all, uint3(1, 2, 1)),
        get_output(groupID.x, groupIndex, global_poutputs_all, uint3(2, 3, 1)) - get_output(groupID.x, groupIndex, global_poutputs_all, uint3(2, 1, 1)),
    );
    
    position_all[agent_id] = clamp(position_all[agent_id] + speed * dt, -100.0h, 100.0h);

    float2 diff = position_all[agent_id] - object_pos_all[agent_id];

    half K = 100.0h;

    float2 diff_thoreshold = float2(5.0h, 5.0h);

    float2 norm_threshold = diff_thoreshold / (diff_thoreshold + K);

    float2 normalized_diff = diff / (diff + K);

    int2 diff_sign = int2(
        normalized_diff.x >= 0 ? 1 : -1,
        normalized_diff.y >= 0 ? 1 : -1
    );

    float2 normalized_diff_abs = abs(normalized_diff);

    object_pos_all[agent_id] = normalized_diff_abs.x <= norm_threshold.x && normalized_diff_abs.y <= norm_threshold.y
        ? clamp((- 1 + 2 * rand_half2(agent_id + step)) * world_size, -world_size, world_size)
        : object_pos_all[agent_id];

    goal_count_all[agent_id] += normalized_diff_abs.x <= norm_threshold.x && normalized_diff_abs.y <= norm_threshold.y ? 1 : 0;

    set_membrane(groupID.x, groupIndex, membrane_all, uint3(4 + diff_sign.x, 1, 4), half(normalized_diff_abs.x));
    set_membrane(groupID.x, groupIndex, membrane_all, uint3(4, 1, 4 + diff_sign.y), half(normalized_diff_abs.y));
}