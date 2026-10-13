#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

[ForceInline]
uint3 indexToCoordN(uint index)
{
    uint x = (index >> SHIFT_X) & MASK;
    uint y = (index >> SHIFT_Y) & MASK;
    uint z = (index >> SHIFT_Z) & MASK;
    return uint3(x, y, z);
}

[ForceInline]
uint coordToIndexN(uint3 coord)
{
    uint index = (coord.z << SHIFT_Z) | (coord.y << SHIFT_Y) | (coord.x << SHIFT_X);
    return index;
}

[ForceInline]
uint3 indexToCoordNp2(uint index)
{
    uint x = index % (N+2);
    uint y = (index / (N+2)) % (N+2);
    uint z = (index / ((N+2) * (N+2))) % (N+2);
    return uint3(x, y, z);
}

[ForceInline]
uint coordToIndexNp2(uint3 coord)
{
    uint index = ((N+2) * (N+2)) * coord.z + (N+2) * coord.y + coord.x;
    return index;
}

[ForceInline]
half4 get_sig_pre(StructuredBuffer<half4> sig_pre_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_pre_map_np2[coordToIndexNp2(coord_np2)];
}

[ForceInline]
half4 get_sig_post(StructuredBuffer<half4> sig_post_map_np2, int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_post_map_np2[coordToIndexNp2(coord_np2)];
}

[ForceInline]
uint set_weight(RWStructuredBuffer<half> weights, int3 center_coord, int3 coord_rel, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    weights[weight_index] = val;
    return 0;
}

[ForceInline]
uint set_weight_27th(RWStructuredBuffer<half> weights, int3 center_coord, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    weights[weight_index] = val;
    return 0;
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
                half4 target_sig_pre = get_sig_pre(signature_pre_map_np2, target_sig_coord);
                half val = saturate(0.25h * dot(my_post, target_sig_pre));
                set_weight(weight_map_output, groupThreadID, int3(dx, dy, dz), val);
            }
        }
    }
    uint3 sig_27th_coord = indexToCoordN(groupIndex * multiplier + bias);
    half4 sig_27th_pre = get_sig_pre(signature_pre_map_np2, sig_27th_coord);
        half val_27th = saturate(0.25h * dot(my_post, sig_27th_pre));
    set_weight_27th(weight_map_output, groupThreadID, val_27th);
}