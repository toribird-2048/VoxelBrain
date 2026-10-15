#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

float3 get_GRADIENT(uint3 grid_coord, uint seed) {
    uint h = seed
        ^ (grid_coord.x * 73856093u)
        ^ (grid_coord.y * 19349663u)
        ^ (grid_coord.z * 83492791u);

    uint rx = pcg_hash(h);
    uint ry = pcg_hash(rx);
    uint rz = pcg_hash(ry);

    float3 v = float3(
        float(rx) * (1.0 / 4294967295.0),
        float(ry) * (1.0 / 4294967295.0),
        float(rz) * (1.0 / 4294967295.0),
    ) * 2.0 - 1.0;

    return normalize(v + float3(1e-5, 0.0, 0.0));
}

float3 fade(float3 t) {
    return t * t * t *(t * (t * 6.0 - 15.0) + 10.0);
}

uint3 indexToCoordNp2(uint index) {
    uint P = N + 2;
    return uint3(
        index % P,
        (index / P) % P,
        (index / (P * P)) % P
    );
}

uint coordToIndexNp2(uint3 coord) {
    uint P = N + 2;
    return (P * P) * coord.z + P * coord.y + coord.x;
}

float perlin_gen(float3 coord, float freq, uint seed) {
    float3 my_pos = (coord + 0.5f) * freq;

    float sum = 0.0f;
    float3 my_mod = frac(my_pos);
    float3 f = fade(my_mod);

    for (uint dz = 0; dz <= 1; dz++) {
        for (uint dy = 0; dy <= 1; dy++) {
            for (uint dx = 0; dx <= 1; dx++) {
                float3 grad = get_GRADIENT(int3(floor(my_pos)) + int3(dx, dy, dz), seed);
                float dot_grad = dot(grad, my_mod - float3(dx, dy, dz));
                sum += dot_grad 
                    * (dx == 0 ? (1.0f - f.x) : f.x) 
                    * (dy == 0 ? (1.0f - f.y) : f.y) 
                    * (dz == 0 ? (1.0f - f.z) : f.z);
            }
        }
    }
    return sum;
}

float get_inhib(RWStructuredBuffer<float> map, int3 coord_np2) {
    return map[coordToIndexNp2(coord_np2 + 1)];
}

struct PerlinGenes {
    StructuredBuffer<uint4> seeds;
    StructuredBuffer<float4> biases;
    StructuredBuffer<float4> freqs;
    StructuredBuffer<float4> cutoffs;
};

struct InhibGenes {
    StructuredBuffer<uint> seeds;
    StructuredBuffer<float> speeds;
    StructuredBuffer<float> cutoffs;
    StructuredBuffer<uint> steps;
    StructuredBuffer<float> bases;
    StructuredBuffer<float> threshold;
}

[shader("compute")]
[numthreads(N, N, N)]
void main(
    uint groupIndex: SV_GroupIndex,
    uint3 groupThreadID: SV_GroupThreadID,
    uint3 groupID: SV_GroupID,
    RWStructuredBuffer<float4> sig_pre_map_np2,
    RWStructuredBuffer<float4> sig_post_map_np2,
    RWStructuredBuffer<float4> sleep_map,
    RWStructuredBuffer<float> inhib_map_np2,
    uniform uint count,
    uniform PerlinGenes sig_pre_genes,
    uniform PerlinGenes sig_post_genes,
    uniform PerlinGenes sleep_genes,
    uniform InhibGenes inhib_genes
) {
    uint P = N + 2;
    uint total_np2 = P * P * P;

    uint4 seed_pre = sig_pre_genes.seeds[groupID.x];
    float4 bias_pre = sig_pre_genes.biases[groupID.x];
    float4 freq_pre = sig_pre_genes.freqs[groupID.x];
    float4 cutoff_pre = sig_pre_genes.cutoffs[groupID.x];

    for (uint idx = groupIndex; idx < total_np2; idx += N * N * N) {
        uint3 coord = uint3((idx / (P * P)) % P, (idx / P) % P, idx % P);

        float4 sum_xyzw_pre = float4(
            perlin_gen(coord, freq_pre.x, seed_pre.x),
            perlin_gen(coord, freq_pre.y, seed_pre.y),
            perlin_gen(coord, freq_pre.z, seed_pre.z),
            perlin_gen(coord, freq_pre.w, seed_pre.w)
        );

        sig_pre_map_np2[groupID.x * total_np2 + idx] = clamp((sum_xyzw_pre - cutoff_pre) / (1.0f - cutoff_pre) + bias_pre, -1.0, 1.0);
    }


    uint4 seed_post = sig_pre_genes.seeds[groupID.x];
    float4 bias_post = sig_pre_genes.biases[groupID.x];
    float4 freq_post = sig_pre_genes.freqs[groupID.x];
    float4 cutoff_post = sig_pre_genes.cutoffs[groupID.x];

    for (uint idx = groupIndex; idx < total_np2; idx += N * N * N) {
        uint3 coord = uint3((idx / (P * P)) % P, (idx / P) % P, idx % P);

        float4 sum_xyzw_post = float4(
            perlin_gen(coord, freq_post.x, seed_post.x),
            perlin_gen(coord, freq_post.y, seed_post.y),
            perlin_gen(coord, freq_post.z, seed_post.z),
            perlin_gen(coord, freq_post.w, seed_post.w)
        );

        sig_post_map_np2[groupID.x * total_np2 + idx] = clamp((sum_xyzw_post - cutoff_post) / (1.0f - cutoff_post) + bias_post, -1.0, 1.0);
    }



    uint4 seed_sleep = sleep_genes.seeds[groupID.x];
    float4 bias_sleep = sleep_genes.biases[groupID.x];
    float4 freq_sleep = sleep_genes.freqs[groupID.x];
    float4 cutoff_sleep = sleep_genes.cutoffs[groupID.x];

    float4 sum_xyzw_sleep = float4(
        perlin_gen(groupThreadID, freq_sleep.x, seed_sleep.x),
        perlin_gen(groupThreadID, freq_sleep.y, seed_sleep.y),
        perlin_gen(groupThreadID, freq_sleep.z, seed_sleep.z),
        perlin_gen(groupThreadID, freq_sleep.w, seed_sleep.w)
    );

    sleep_map[groupID.x * N * N * N + groupIndex] = clamp((sum_xyzw_sleep - cutoff_sleep) / (1.0f - cutoff_sleep) + bias_sleep, -1.0, 1.0);



    uint seed = inhib_genes.seeds[groupID.x];
    float base = inhib_genes.bases[groupID.x];
    float speed = inhib_genes.speeds[groupID.x];
    float cutoff = inhib_genes.cutoffs[groupID.x];
    uint step = inhib_genes.steps[groupID.x];
    float threshold = inhib_genes.threshold[groupID.x];

    inhib_map_np2[groupID.x * N * N * N + groupIndex] = base;

    for (uint i = 0; i < step; i++) {
        for (uint idx = groupIndex; idx < total_np2; idx += N * N * N) {
            float max_val = 0;
            for (int dz = -1; dz <= 1; dz++) {
                for (int dy = -1; dy <= 1; dy++) {
                    for (int dx = -1; dx <= 1; dx++) {
                        int3 coord_np2 = indexToCoordNp2(idx) + int3(dx, dy, dz);
                        max_val = (dx == dy & dy == dz & dz == 0 ? max_val : max(max_val, get_inhib(inhib_map_np2, coord_np2)));
                        
                    }
                }
            }
        }
    }
}