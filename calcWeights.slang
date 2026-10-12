#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)


uint3 indexToCoord(uint index)
{
    uint x = (index >> SHIFT_X) & MASK;
    uint y = (index >> SHIFT_Y) & MASK;
    uint z = (index >> SHIFT_Z) & MASK;
    return uint3(x, y, z);
}

uint coordToIndex(uint3 coord)
{
    uint index = (coord.z << SHIFT_Z) | (coord.y << SHIFT_Y) | (coord.x << SHIFT_X);
    return index;
}

[shader("compute")]
[numthreads(N, N, N)]
void main(
    StructuredBuffer<half3> signature_pre_map,
    StructuredBuffer<half3> signature_post_map,
    RWStructuredBuffer<half> weight_map_output,
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uniform uint multiplier,
    uniform uint bias
)
{
    uint3 my_sig_coord = groupThreadID + 1;
    uint P = N + 2;
    uint my_sig_index = (P * P) * my_sig_coord.z + P * my_sig_coord.y + my_sig_coord.x;
    half3 my_post = signature_post_map[my_sig_index];
    uint base_offset = groupIndex * 28;
    [unroll]
    for (int dz = -1; dz <= 1; dz++)
    {
        [unroll]
        for (int dy = -1; dy <= 1; dy++)
        {
            [unroll]
            for (int dx = -1; dx <= 1; dx++)
            {
                uint weight_index = base_offset + 9 * (dz + 1) + 3 * (dy + 1) + (dx + 1);
                int3 target_sign_coord = int3(my_sig_coord) + int3(dx, dy, dz);
                int target_sign_index = (P * P) * target_sign_coord.z + P * target_sign_coord.y + target_sign_coord.x;
                weight_map_output[weight_index] = saturate(dot(my_post, signature_pre_map[target_sign_index]));
            }
        }
    }
    uint3 sign_27th_coord = indexToCoord(groupIndex * multiplier + bias) + 1;
    uint sign_27th_index = (P * P) * sign_27th_coord.z + P * sign_27th_coord.y + sign_27th_coord.x;
    weight_map_output[base_offset + 27] = saturate(dot(my_post, signature_pre_map[sign_27th_index]));
}

