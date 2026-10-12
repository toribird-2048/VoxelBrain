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

groupshared half s_outputs[N + 2][N + 2][N + 2];

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

    uint3 my_coord = groupThreadID + 1;
    uint3 my_index = coordToIndexNp2(my_coord);
    s_outputs[my_coord.z][my_coord.y][my_coord.x] = 0.0h;

    for (uint i = 0; i <= 100; i++) {
        half net = 0.0h;
        half rate = 0.0h;
        half R = 1.0h;
        uint tag = 0;
        for (int dz = -1; dz <= 1; dz++) {
            for (int dy = -1; dy <= 1; dy++) {
                for (int dx = -1; dx <= 1; dx++) {
                    half weight = weights_map[]
                    net += 
                }
            }
        }
    }
}