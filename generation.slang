#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

#define TOTAL_N (N * N * N)
#define INHIB_STRIDE ((TOTAL_N + 31) / 32)
#define P2 (N + 2)
#define TOTAL_NP2 ((N+2)*(N+2)*(N+2))

groupshared float inhib_map_np2[2][TOTAL_NP2];

struct SigPerlinGenes {
    StructuredBuffer<uint4> seeds;
    StructuredBuffer<float4> biases;
    StructuredBuffer<float4> freqs;
    StructuredBuffer<float4> cutoffs;
};

struct PerlinGenes {
    StructuredBuffer<uint> seed;
    StructuredBuffer<float> bias;
    StructuredBuffer<float> freq;
    StructuredBuffer<float> cutoff;
};

struct InhibGenes {
    StructuredBuffer<uint> seed;
    StructuredBuffer<float> speed;
    StructuredBuffer<float> cutoff;
    StructuredBuffer<uint> steps;
    StructuredBuffer<float> base;
    StructuredBuffer<float> threshold;
};

uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

float rand_float(uint input) {
    return float(pcg_hash(input)) / 4294967295.0;
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

void sig_gen(RWStructuredBuffer<half4> sig_map_np2, SigPerlinGenes genes, uint group_id_x, uint group_index) {
    uint4 seed = genes.seeds[group_id_x];
    float4 bias = genes.biases[group_id_x];
    float4 freq = genes.freqs[group_id_x];
    float4 cutoff = genes.cutoffs[group_id_x];

    for (uint idx_np2 = group_index; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        uint3 coord = indexToCoordNp2(idx_np2);

        float4 sum_xyzw = float4(
            perlin_gen(coord, freq.x, seed.x),
            perlin_gen(coord, freq.y, seed.y),
            perlin_gen(coord, freq.z, seed.z),
            perlin_gen(coord, freq.w, seed.w)
        );

        sig_map_np2[group_id_x * TOTAL_NP2 + idx_np2] = half4(clamp((sum_xyzw - cutoff) / (1.0f - cutoff) + bias, -1.0f, 1.0f));
    }
}

void dop_sleep_gen(RWStructuredBuffer<half> map, PerlinGenes genes, uint group_id_x, uint group_index, uint3 group_thread_id) {
    uint seed = genes.seed[group_id_x];
    float bias = genes.bias[group_id_x];
    float freq = genes.freq[group_id_x];
    float cutoff = genes.cutoff[group_id_x];

    float sum = perlin_gen(group_thread_id, freq, seed);

    map[group_id_x * N * N * N + group_index] = half(clamp((sum - cutoff) / (1.0f - cutoff) + bias, -1.0f, 1.0f));
}

float get_inhib(int3 coord_np2, uint step) {
    return inhib_map_np2[step & 1][coordToIndexNp2(coord_np2)];
}

void set_inhib(int3 coord_np2, uint step, float val) {
    inhib_map_np2[step & 1][coordToIndexNp2(coord_np2)] = val;
}

[WaveSize(32)]
[shader("compute")]
[numthreads(N, N, N)]
void computeMain(
    uint groupIndex: SV_GroupIndex,
    uint3 groupThreadID: SV_GroupThreadID,
    uint3 groupID: SV_GroupID,
    RWStructuredBuffer<half4> sig_pre_map_np2_pout,
    RWStructuredBuffer<half4> sig_post_map_np2_pout,
    RWStructuredBuffer<half> dopamine_map_pout,
    RWStructuredBuffer<half> sleep_map_pout,
    RWStructuredBuffer<uint> inhib_sign_map_pout,
    uniform SigPerlinGenes sig_pre_genes,
    uniform SigPerlinGenes sig_post_genes,
    uniform PerlinGenes dopamine_genes,
    uniform PerlinGenes sleep_genes,
    uniform InhibGenes inhib_genes
) {
    sig_gen(sig_pre_map_np2_pout, sig_pre_genes, groupID.x, groupIndex);
    sig_gen(sig_post_map_np2_pout, sig_post_genes, groupID.x, groupIndex);

    dop_sleep_gen(dopamine_map_pout, dopamine_genes, groupID.x, groupIndex, groupThreadID);
    dop_sleep_gen(sleep_map_pout, sleep_genes, groupID.x, groupIndex, groupThreadID);

    uint seed_inhib = inhib_genes.seed[groupID.x];
    float base_inhib = inhib_genes.base[groupID.x];
    float speed_inhib = inhib_genes.speed[groupID.x];
    float cutoff_inhib = inhib_genes.cutoff[groupID.x];
    uint step_inhib = inhib_genes.steps[groupID.x];
    float threshold_inhib = inhib_genes.threshold[groupID.x];

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += N * N * N) {
        inhib_map_np2[0][idx_np2] = base_inhib;
        inhib_map_np2[1][idx_np2] = base_inhib;
    }

    GroupMemoryBarrierWithGroupSync();

    set_inhib(groupThreadID + 1, 1, rand_float(seed_inhib + groupIndex));

    GroupMemoryBarrierWithGroupSync();

    int3 center_coord_np2 = int3(groupThreadID + 1);
    for (int i = 0; i < step_inhib; i++) {
        float max_val = 0;
        uint write_slot = i & 1;
        uint read_slot = write_slot ^ 1;
        float center_val = get_inhib(center_coord_np2, read_slot);
        [unroll]
        for (int dz = -1; dz <= 1; dz++) {
            [unroll]
            for (int dy = -1; dy <= 1; dy++) {
                [unroll]
                for (int dx = -1; dx <= 1; dx++) {
                    int3 coord_np2 = center_coord_np2 + int3(dx, dy, dz);
                    if (dx == 0 && dy == 0 && dz == 0) continue;
                    max_val = max(max_val, get_inhib(coord_np2, read_slot));
                }
            }
        }
        set_inhib(center_coord_np2, write_slot, saturate(speed_inhib * (center_val - cutoff_inhib * max_val)));
        GroupMemoryBarrierWithGroupSync();
    }
    bool my_inhib = get_inhib(center_coord_np2, step_inhib - 1) > threshold_inhib ? true : false;

    uint4 ballot = WaveActiveBallot(my_inhib);

    if (WaveIsFirstLane()) {
        uint packed_index = (groupID.x * INHIB_STRIDE) + (groupIndex / WaveGetLaneCount());
        inhib_sign_map_pout[packed_index] = ballot.x;
    }
}