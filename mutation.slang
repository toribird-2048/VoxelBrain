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
#define TOTAL_NP2H2 (TOTAL_NP2 >> 1) 

#define MIN_WAVE (16)
#define MAX_WAVE_SLOTS ((TOTAL_N + MIN_WAVE - 1) / MIN_WAVE)

#define MUT_LINEAR(buf, v_min, v_max, threshold) \
    buf[groupID.x] = mutate_linear(buf[base_id_s], v_min, v_max, seed, threshold)

#define MUT_HALF4(buf, v_min, v_max, threshold) \
    buf[groupID.x] = mutate_half4(buf[base_id_s], v_min, v_max, seed, threshold)

#define MUT_LOG(buf, v_min, v_max, threshold) \
    buf[groupID.x] = mutate_log(buf[base_id_s], v_min, v_max, seed, threshold)

#define MUT_UINT(buf, v_min, v_max, threshold) \
    buf[groupID.x] = mutate_uint(buf[base_id_s], v_min, v_max, seed, threshold)


groupshared int wave_passed_max_s[MAX_WAVE_SLOTS];
groupshared half2x4 mutation_map_np2[TOTAL_NP2];
groupshared half2 mutation_map[TOTAL_N];
groupshared uint s_min_passed_idx;
groupshared uint base_id_s;

struct ResourceParams {
    half base_output;
    half beta;
    half k_refill;
}

struct ResourceParamsAll {
    RWStructuredBuffer<half> base_output;
    RWStructuredBuffer<half> beta;
    RWStructuredBuffer<half> k_refill;
}

struct Link27thParams {
    uint multiplier;
    uint bias;
}

struct Link27thParamsAll {
    RWStructuredBuffer<uint> multiplier;
    RWStructuredBuffer<uint> bias;
}

struct LearningParams {
    half learning_rate;
    half forget_rate;
    half learning_threshold;
    half tag_decay;
}

struct LearningParamsAll {
    RWStructuredBuffer<half> learning_rate;
    RWStructuredBuffer<half> forget_rate;
    RWStructuredBuffer<half> learning_threshold;
    RWStructuredBuffer<half> tag_decay;
}

struct SigMutationParams {
    half4 threshold;
    uint steps;
    half4 max;
    half4 diff;
}

struct DopSlpMutationParams {
    half threshold;
    uint steps;
    half max;
    half diff;
}

struct InhibMutationParams {
    half threshold;
}

struct MutationParamsAll {
    RWStructuredBuffer<half4> sig_pre_threshold;
    RWStructuredBuffer<half4> sig_post_threshold;
    RWStructuredBuffer<half4> other_threshold; // dopamine / sleep / inhib / None
    RWStructuredBuffer<uint4> steps; //sig_pre / sig_post / dopamine / sleep
    RWStructuredBuffer<half4> sig_pre_diff;
    RWStructuredBuffer<half4> sig_post_diff;
    RWStructuredBuffer<half4> other_diff; // dopamine / sleep / None / None
    RWStructuredBuffer<half4> sig_pre_max;
    RWStructuredBuffer<half4> sig_post_max;
    RWStructuredBuffer<half4> other_max; // dopamine / sleep / None / None
    RWStructuredBuffer<half4> resource_threshold; // base / beta / refill
    RWStructuredBuffer<half2> link27th_threshold; // multi / bias
    RWStructuredBuffer<half4> learning_threshold; // learning_rate / forget_rate / learning_threshold / tag_decay
    RWStructuredBuffer<half4> mutate_threshold; //threshold / steps / diff / max
}

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

bool is_internal(uint2 index_np2h2) {
    uint3 coord_np2 = idxNp2h2_to_coordNp2(index_np2h2);
    return ((((coord_np2.x - 1) | (coord_np2.y - 1) | (coord_np2.z - 1)) & ~MASK) == 0);
}

uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

half rand_half(uint input, half threshold = 0.0h) {
    uint h1 = pcg_hash(input);
    half rand = half(float(h1) / 4294967295.0);
    return rand >= threshold ? rand : 0.0h;
}

half4 rand_half4pm(uint input, half4 thresholds) {
    uint h1 = pcg_hash(input);
    uint h2 = pcg_hash(h1 + 1u);
    uint h3 = pcg_hash(h2 + 1u);
    uint h4 = pcg_hash(h3 + 1u);
    half4 rand = half4(
        2.0h * half(float(h1) / 4294967295.0) - 1.0h,
        2.0h * half(float(h2) / 4294967295.0) - 1.0h,
        2.0h * half(float(h3) / 4294967295.0) - 1.0h,
        2.0h * half(float(h4) / 4294967295.0) - 1.0h,
    );
    return half4(
        abs(rand.x) >= thresholds.x ? rand.x : 0.0h,
        abs(rand.y) >= thresholds.y ? rand.y : 0.0h,
        abs(rand.z) >= thresholds.z ? rand.z : 0.0h,
        abs(rand.w) >= thresholds.w ? rand.w : 0.0h,
    );
}

void set_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint3 coord_np2, half val) {
    uint idx_np2 = coordToIndexNp2(coord_np2);
    uint2 idx_np2h2 = uint2(idx_np2 >> 1, idx_np2 & 1);
    half2 current = membrane_all[group_id_x * TOTAL_NP2H2 + idx_np2h2.x];
    membrane_all[group_id_x * TOTAL_NP2H2 + (idx_np2h2.x)] = (idx_np2h2.y == 0)
        ? half2(val, current.y)
        : half2(current.x, val);
}

int calc_max_int(uint group_idx, int my_val) {
    int local_wave_max = WaveActiveMax(my_val);

    uint laneCount = WaveGetLaneCount();
    uint waveIndex = group_idx / laneCount;
    uint waveCount = (TOTAL_N + laneCount - 1) / laneCount;

    if (WaveIsFirstLane()) {
        wave_passed_max_s[waveIndex] = local_wave_max;
    }

    GroupMemoryBarrierWithGroupSync();

    if (waveIndex == 0) {
        int lane_max = -1;

        for (uint i = group_idx; i < waveCount; i += laneCount) {
            lane_max = max(lane_max, wave_passed_max_s[i]);
        }

        int group_max = WaveActiveMax(lane_max);

        if (group_idx == 0) {
            wave_passed_max_s[0] = group_max;
        }
    }
    GroupMemoryBarrierWithGroupSync();
    return wave_passed_max_s[0];
}

half4 get_sig_prepost_mut(uint3 center_coord_np2, int3 coord_rel, uint step) {
    int3 target_coord_np2 = center_coord_np2 + coord_rel;
    bool is_valid = all(0 <= target_coord_np2) && all(target_coord_np2 <= (N + 1));
    return is_valid
        ? mutation_map_np2[coordToIndexNp2(uint3(target_coord_np2))][step & 1u]
        : mutation_map_np2[coordToIndexNp2(center_coord_np2)][step & 1u];
}

void set_sig_prepost_mut(uint3 center_coord_np2, uint step, half4 val) {
    mutation_map_np2[coordToIndexNp2(center_coord_np2)][step & 1u] = val;
}

half get_sig_dopslp_mut(uint3 center_coord, int3 coord_rel, uint step) {
    int3 target_coord = center_coord + coord_rel;
    bool is_valid = all(0 <= target_coord) && all(target_coord <= N - 1);
    return is_valid
        ? mutation_map[coordToIndexN(uint3(target_coord))][step & 1u]
        : mutation_map[coordToIndexN(center_coord)][step & 1u];
}

void set_sig_dopslp_mut(uint3 center_coord, uint step, half val) {
    mutation_map[coordToIndexN(center_coord)][step & 1u] = val;
}

half mutate_linear(half base_val, half val_min, half val_max, inout uint seed, half threshold) {
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= threshold;
    return do_mut 
        ? (val_max - val_min) * rand_half(seed) + val_min
        : base_val;
}

half mutate_log(half base_val, half val_min, half val_max, inout uint seed, half threshold) {
    half val_min_log = log2(val_min);
    half val_max_log = log2(val_max);
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= threshold;
    return do_mut
        ? exp2((val_max_log - val_min_log) * rand + val_min_log)
        : base_val;
}

uint mutate_uint(uint base_val, uint val_min, uint val_max, inout uint seed, half threshold) {
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= threshold;
    half noise_half = do_mut
        ? ((half)val_max + 1.0h - (half)val_min) * rand + (half)val_min
        : (half)base_val;
    return (uint)floor(noise_half);
}

uint mutate_odd(uint base_val, uint val_min, uint val_max, inout uint seed, half threshold) {
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= threshold;
    int delta = do_mut 
        ? (int(pcg_hash(seed++) % 5) - 2) * 2
        : 0;
    int next_val = clamp((int)base_val + delta, int(val_min), int(val_max));
    return uint(next_val | 1);
}

half4 mutate_half4(half4 base_val, half val_min, half val_max, inout uint seed, half threshold) {
    return half4(
        mutate_linear(base_val.x, val_min, val_max, seed, threshold),
        mutate_linear(base_val.y, val_min, val_max, seed, threshold),
        mutate_linear(base_val.z, val_min, val_max, seed, threshold),
        mutate_linear(base_val.w, val_min, val_max, seed, threshold)
    );
}

bool mutation_bool(uint group_id_x, uint step, float rate) {
    return rand_half(group_id_x * 10007 + step) <= rate;
}

[WaveSize(32)]
[shader("compute")]
[numthreads(N, N, N)]
void computeMain(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    RWStructuredBuffer<half> dopamine_map_all,
    RWStructuredBuffer<half> sleep_map_all,
    RWStructuredBuffer<uint> inhib_map_all,
    RWStructuredBuffer<half4> signature_pre_map_np2,
    RWStructuredBuffer<half4> signature_post_map_np2,
    uniform ResourceParamsAll resource_params_all,
    uniform Link27thParamsAll link27th_params_all,
    uniform LearningParamsAll learning_params_all,
    uniform MutationParamsAll mutation_params_all,
    RWStructuredBuffer<float> mutation_rate_all,
    uniform uint step,
    uniform uint total
) {
    SigMutationParams sig_pre_mutation_params;
    SigMutationParams sig_post_mutation_params;
    DopSlpMutationParams dopamine_mutation_params;
    DopSlpMutationParams sleep_mutation_params;
    InhibMutationParams inhib_mutation_params;

    sig_pre_mutation_params.diff = mutation_params_all.sig_pre_diff[groupID.x];
    sig_pre_mutation_params.max = mutation_params_all.sig_pre_max[groupID.x];
    sig_pre_mutation_params.steps = mutation_params_all.steps[groupID.x].x;
    sig_pre_mutation_params.threshold = mutation_params_all.sig_pre_threshold[groupID.x];
    
    sig_post_mutation_params.diff = mutation_params_all.sig_post_diff[groupID.x];
    sig_post_mutation_params.max = mutation_params_all.sig_post_max[groupID.x];
    sig_post_mutation_params.steps = mutation_params_all.steps[groupID.x].y;
    sig_post_mutation_params.threshold = mutation_params_all.sig_post_threshold[groupID.x];
    
    dopamine_mutation_params.diff = mutation_params_all.other_diff[groupID.x].x;
    dopamine_mutation_params.max = mutation_params_all.other_max[groupID.x].x;
    dopamine_mutation_params.steps = mutation_params_all.steps[groupID.x].z;
    dopamine_mutation_params.threshold = mutation_params_all.other_threshold[groupID.x].x;
    
    sleep_mutation_params.diff = mutation_params_all.other_diff[groupID.x].y;
    sleep_mutation_params.max = mutation_params_all.other_max[groupID.x].y;
    sleep_mutation_params.steps = mutation_params_all.steps[groupID.x].w;
    sleep_mutation_params.threshold = mutation_params_all.other_threshold[groupID.x].y;
    
    inhib_mutation_params.threshold = mutation_params_all.other_threshold[groupID.x].z;

    bool is_me_passed = mutation_bool(groupID.x, step, mutation_rate_all[groupID.x]);
    if (!is_me_passed) {
        if (groupIndex == 0) {
            s_min_passed_idx = 0xFFFFFFFFu;
        }
        GroupMemoryBarrierWithGroupSync();
        uint search_count = 0;
        uint target_idx = groupID.x + groupIndex;
        while (s_min_passed_idx == 0xFFFFFFFFu && search_count < 40) {
            bool target_mutation_bool = mutation_bool(target_idx % total, step, mutation_rate_all[target_idx % total]);
            int my_passed_index = target_mutation_bool ? target_idx : -1;
            if (target_mutation_bool) {
                InterlockedMin(s_min_passed_idx, my_passed_index);
            }
            GroupMemoryBarrierWithGroupSync();
            if (s_min_passed_idx != 0xFFFFFFFFu) {
                break;
            }
            target_idx = target_idx + TOTAL_N;
            search_count++;
        }
        if (groupIndex == 0) {
            base_id_s = (s_min_passed_idx != 0xFFFFFFFFu) ? (uint)s_min_passed_idx % total : groupID.x;
        }
        GroupMemoryBarrierWithGroupSync();
        
        if (groupIndex == 0) {
            uint seed = groupID.x * 10007u + 42u * step;
            half threshold_threshold = mutation_params_all.mutate_threshold[groupID.x].x;

            MUT_HALF4(mutation_params_all.sig_pre_threshold, 0.5h, 0.99h, threshold_threshold);
            MUT_HALF4(mutation_params_all.sig_post_threshold, 0.5h, 0.99h, threshold_threshold);
            MUT_HALF4(mutation_params_all.other_threshold, 0.5h, 0.99h, threshold_threshold);

            uint4 cur_steps = mutation_params_all.steps[base_id_s];
            half steps_threshold = mutation_params_all.mutate_threshold[groupID.x].y;
            mutation_params_all.steps[groupID.x] = uint4(
                mutate_uint(cur_steps.x, 0, 10, seed, steps_threshold),
                mutate_uint(cur_steps.y, 0, 10, seed, steps_threshold),
                mutate_uint(cur_steps.z, 0, 10, seed, steps_threshold),
                mutate_uint(cur_steps.w, 0, 10, seed, steps_threshold)
            );

            half diff_threshold = mutation_params_all.mutate_threshold[groupID.x].z;
            MUT_HALF4(mutation_params_all.sig_pre_diff, 0.001h, 0.037h, diff_threshold);
            MUT_HALF4(mutation_params_all.sig_post_diff, 0.001h, 0.037h, diff_threshold);
            MUT_HALF4(mutation_params_all.other_diff, 0.001h, 0.037h, diff_threshold);

            half max_threshold = mutation_params_all.mutate_threshold[groupID.x].w;
            MUT_HALF4(mutation_params_all.sig_pre_max, 0.005h, 0.2h, max_threshold);
            MUT_HALF4(mutation_params_all.sig_post_max, 0.005h, 0.2h, max_threshold);
            MUT_HALF4(mutation_params_all.other_max, 0.005h, 0.2h, max_threshold);

            // --- ResourceParamsAll の変異 ---
            half4 resource_threshold = mutation_params_all.resource_threshold[groupID.x];
            MUT_LOG(resource_params_all.base_output, 0.0005h, 0.1h, resource_threshold.x);
            MUT_LINEAR(resource_params_all.beta, 15.0h, 30.0h, resource_threshold.y);
            MUT_LINEAR(resource_params_all.k_refill, 0.01h, 0.5h, resource_threshold.z);

            // --- Link27thParamsAll の変異 (上限を TOTAL_N - 1 に動的化) ---
            half2 link27th_threshold = mutation_params_all.link27th_threshold[groupID.x];
            link27th_params_all.multiplier[groupID.x] = mutate_odd(link27th_params_all.multiplier[base_id_s], 1, TOTAL_N - 1, seed, link27th_threshold.x);
            MUT_UINT(link27th_params_all.bias, 0, TOTAL_N - 1, link27th_threshold.y);

            half4 learning_threshold = mutation_params_all.learning_threshold[groupID.x];
            MUT_LINEAR(learning_params_all.learning_rate, 0.0h, 1.0h, learning_threshold.x);
            MUT_LINEAR(learning_params_all.forget_rate, 0.0h, 1.0h, learning_threshold.y);
            MUT_LINEAR(learning_params_all.learning_threshold, 0.0h, 1.0h, learning_threshold.z);
            MUT_LINEAR(learning_params_all.tag_decay, 0.5h, 0.999h, learning_threshold.w);
        }

        // sig_pre_generation
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x, sig_pre_mutation_params.threshold);
        }
        GroupMemoryBarrierWithGroupSync();
        
        for (uint step = 0; step < sig_pre_mutation_params.steps; step++) {
            for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
                half4 neighbor_sum = half4(0.0h, 0.0h, 0.0h, 0.0h);
                half4 current_val = get_sig_prepost_mut(indexToCoordNp2(idx_np2), int3(0, 0, 0), step);
                [unroll]
                for (int dz = -1; dz <= 1; dz++) {
                    [unroll]
                    for (int dy = -1; dy <= 1; dy++) {
                        [unroll]
                        for (int dx = -1; dx <= 1; dx++) {
                            neighbor_sum += get_sig_prepost_mut(indexToCoordNp2(idx_np2), int3(dx, dy, dz), step);
                        }
                    }
                }
                half4 laplacian = neighbor_sum - 27.0h * current_val;
                half dt = 1.0h / 54.0h;
                set_sig_prepost_mut(indexToCoordNp2(idx_np2), step + 1, current_val + (sig_pre_mutation_params.diff * laplacian) * dt);
            }
            GroupMemoryBarrierWithGroupSync();
        }
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            signature_pre_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(signature_pre_map_np2[base_id_s * TOTAL_NP2 + idx_np2] + sig_pre_mutation_params.max * mutation_map_np2[idx_np2][sig_pre_mutation_params.steps & 1u], -1.0h, 1.0h);
        }

        GroupMemoryBarrierWithGroupSync();

        // sig_post_generation
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x + 1, sig_post_mutation_params.threshold);
        }
        GroupMemoryBarrierWithGroupSync();
        
        for (uint step = 0; step < sig_post_mutation_params.steps; step++) {
            for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
                half4 neighbor_sum = half4(0.0h, 0.0h, 0.0h, 0.0h);
                half4 current_val = get_sig_prepost_mut(indexToCoordNp2(idx_np2), int3(0, 0, 0), step);
                [unroll]
                for (int dz = -1; dz <= 1; dz++) {
                    [unroll]
                    for (int dy = -1; dy <= 1; dy++) {
                        [unroll]
                        for (int dx = -1; dx <= 1; dx++) {
                            neighbor_sum += get_sig_prepost_mut(indexToCoordNp2(idx_np2), int3(dx, dy, dz), step);
                        }
                    }
                }
                half4 laplacian = neighbor_sum - 27.0h * current_val;
                half dt = 1.0h / 54.0h;
                set_sig_prepost_mut(indexToCoordNp2(idx_np2), step + 1, current_val + (sig_post_mutation_params.diff * laplacian) * dt);
            }
            GroupMemoryBarrierWithGroupSync();
        }
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            signature_post_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(signature_post_map_np2[base_id_s * TOTAL_NP2 + idx_np2] + sig_post_mutation_params.max * mutation_map_np2[idx_np2][sig_post_mutation_params.steps & 1u], -1.0h, 1.0h);
        }

        // dopamine_generation
        GroupMemoryBarrierWithGroupSync();
        mutation_map[groupIndex][0] = rand_half(groupIndex + groupID.x + 2, dopamine_mutation_params.threshold);
        GroupMemoryBarrierWithGroupSync();
            
        for (uint step = 0; step < dopamine_mutation_params.steps; step++) {
            half neighbor_sum = 0.0h;
            half current_val = get_sig_dopslp_mut(indexToCoordN(groupIndex), int3(0, 0, 0), step);
            [unroll]
            for (int dz = -1; dz <= 1; dz++) {
                [unroll]
                for (int dy = -1; dy <= 1; dy++) {
                    [unroll]
                    for (int dx = -1; dx <= 1; dx++) {
                        neighbor_sum += get_sig_dopslp_mut(indexToCoordN(groupIndex), int3(dx, dy, dz), step);
                    }
                }
            }
            half laplacian = neighbor_sum - 27.0h * current_val;
            half dt = 1.0h / 54.0h;
            set_sig_dopslp_mut(indexToCoordN(groupIndex), step + 1, current_val + (dopamine_mutation_params.diff * laplacian) * dt);
            GroupMemoryBarrierWithGroupSync();
        }
        dopamine_map_all[groupID.x * TOTAL_N + groupIndex] = saturate(dopamine_map_all[base_id_s * TOTAL_N + groupIndex] + dopamine_mutation_params.max * mutation_map[groupIndex][dopamine_mutation_params.steps & 1u]);

        // sleep_generation
        GroupMemoryBarrierWithGroupSync();
        mutation_map[groupIndex][0] = rand_half(groupIndex + groupID.x + 3, sleep_mutation_params.threshold);
        GroupMemoryBarrierWithGroupSync();

        for (uint step = 0; step < sleep_mutation_params.steps; step++) {
            half neighbor_sum = 0.0h;
            half current_val = get_sig_dopslp_mut(indexToCoordN(groupIndex), int3(0, 0, 0), step);
            [unroll]
            for (int dz = -1; dz <= 1; dz++) {
                [unroll]
                for (int dy = -1; dy <= 1; dy++) {
                    [unroll]
                    for (int dx = -1; dx <= 1; dx++) {
                        neighbor_sum += get_sig_dopslp_mut(indexToCoordN(groupIndex), int3(dx, dy, dz), step);
                    }
                }
            }
            half laplacian = neighbor_sum - 27.0h * current_val;
            half dt = 1.0h / 54.0h;
            set_sig_dopslp_mut(indexToCoordN(groupIndex), step + 1, current_val + (sleep_mutation_params.diff * laplacian) * dt);
            GroupMemoryBarrierWithGroupSync();
        }
        sleep_map_all[groupID.x * TOTAL_N + groupIndex] = saturate(sleep_map_all[base_id_s * TOTAL_N + groupIndex] + sleep_mutation_params.max * mutation_map[groupIndex][sleep_mutation_params.steps & 1u]);

        GroupMemoryBarrierWithGroupSync();

        uint packed_val = inhib_map_all[(base_id_s * INHIB_STRIDE) + (groupIndex >> 5)];
        bool is_me_inhib = bool((packed_val >> (groupIndex & 31)) & 1);
        bool mutation = rand_half(groupIndex + groupID.x + 4, inhib_mutation_params.threshold) > 0.0h;

        bool my_inhib = is_me_inhib ^ mutation;
        uint4 ballot = WaveActiveBallot(my_inhib);

        if (WaveIsFirstLane()) {
            uint packed_index = (groupID.x * INHIB_STRIDE) + (groupIndex / WaveGetLaneCount());
            inhib_map_all[packed_index] = ballot.x;
        }
        GroupMemoryBarrierWithGroupSync();
    }
}