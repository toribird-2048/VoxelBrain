#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)


groupshared half outputs_s[N + 2][N + 2][N + 2];


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
    return outputs_s[target_coord_np2.z][target_coord_np2.y][target_coord_np2.x];
} 

void set_output_s(int3 coord, half val) {
    uint3 target_coord_np2 = coord + 1;
    outputs_s[target_coord_np2.z][target_coord_np2.y][target_coord_np2.x] = val;
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
    uint P = N + 2;

    set_output_s(groupThreadID, 0.0h);

    GroupMemoryBarrierWithGroupSync();

    half R = 1.0h;
    uint tag = 0;

    for (uint i = 0; i <= 100; i++) {
        half net = 0.0h;
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