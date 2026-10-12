#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)


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

half4 get_sig_pre(StructuredBuffer<half4> sig_pre_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_pre_map_np2[coordToIndexNp2(coord_np2)];
}

half4 get_sig_post(StructuredBuffer<half4> sig_post_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_post_map_np2[coordToIndexNp2(coord_np2)];
}


[shader("compute")]
[numthreads(N, N, N)]
void main(
    StructuredBuffer<half4> signature_pre_map_np2,
    StructuredBuffer<half4> signature_post_map_np2,
    RWStructuredBuffer<half> weight_map_output,
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uniform uint multiplier,
    uniform uint bias
)
{
    half4 my_post = get_sig_post(signature_post_map_np2, groupThreadID);
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
                int3 target_sign_coord = int3(groupThreadID) + int3(dx, dy, dz);
                weight_map_output[weight_index] = saturate(0.25h * dot(my_post, get_sig_pre(signature_pre_map_np2, target_sign_coord)));
            }
        }
    }
    uint3 sign_27th_coord = indexToCoordN(groupIndex * multiplier + bias);
    weight_map_output[base_offset + 27] = saturate(0.25h * dot(my_post, get_sig_pre(signature_pre_map_np2, sign_27th_coord)));
}

