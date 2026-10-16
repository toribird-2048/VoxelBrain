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

half4 get_sig_pre(uint group_id_x, StructuredBuffer<half4> sig_pre_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_pre_map_np2[group_id_x * TOTAL_NP2 + coordToIndexNp2(coord_np2)];
}

half4 get_sig_post(uint group_id_x, StructuredBuffer<half4> sig_post_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_post_map_np2[group_id_x * TOTAL_NP2 + coordToIndexNp2(coord_np2)];
}

uint set_weight(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord, int3 coord_rel, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    weights[group_id_x * (TOTAL_N * 28) + weight_index] = val;
    return 0;
}

uint set_weight_27th(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    weights[group_id_x * (TOTAL_N * 28) + weight_index] = val;
    return 0;
}


[shader("compute")]
[numthreads(N, N, N)]
void main(
    StructuredBuffer<half4> signature_pre_map_np2,
    StructuredBuffer<half4> signature_post_map_np2,
    RWStructuredBuffer<half> weight_map_poutput,
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    StructuredBuffer<uint> multipliers,
    StructuredBuffer<uint> biases
)
{
    uint multiplier = multipliers[groupID.x];
    uint bias = biases[groupID.x];

    half4 my_post = get_sig_post(groupID.x, signature_post_map_np2, groupThreadID);
    [unroll]
    for (int dz = -1; dz <= 1; dz++)
    {
        [unroll]
        for (int dy = -1; dy <= 1; dy++)
        {
            [unroll]
            for (int dx = -1; dx <= 1; dx++)
            {
                int3 target_sig_coord = int3(groupThreadID) + int3(dx, dy, dz);
                half4 target_sig_pre = get_sig_pre(groupID.x, signature_pre_map_np2, target_sig_coord);
                half val = saturate(0.25h * dot(my_post, target_sig_pre));
                set_weight(groupID.x, weight_map_poutput, groupThreadID, int3(dx, dy, dz), val);
            }
        }
    }
    uint3 sig_27th_coord = indexToCoordN(groupIndex * multiplier + bias);
    half4 sig_27th_pre = get_sig_pre(groupID.x, signature_pre_map_np2, sig_27th_coord);
        half val_27th = saturate(0.25h * dot(my_post, sig_27th_pre));
    set_weight_27th(groupID.x, weight_map_poutput, groupThreadID, val_27th);
}