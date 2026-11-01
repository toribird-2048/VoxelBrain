#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

// =============================================================================
// 定数定義 (Constants)
// =============================================================================

#define N (1 << DIM)
#define MASK (N - 1)

// 3D座標と1Dインデックスの変換用ビットシフト量
#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

// グリッドサイズ定数
#define TOTAL_N (N * N * N)
#define INHIB_STRIDE ((TOTAL_N + 31) / 32)
#define P2 (N + 2)
#define TOTAL_NP2 ((N + 2) * (N + 2) * (N + 2))
#define NEUROMOD_NUM (4)

// =============================================================================
// 変異ヘルパーマクロ (Mutation Macros)
// base_id_s の値から groupID.x のバッファへ変異適用を行う
// =============================================================================

#define MUT_LINEAR(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_linear(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_HALF4(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_half4(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_HALF2(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_half2(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_LOG(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_log(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_UINT(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_uint(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_IN_INT3(buf, rate) \
    buf[groupID.x] = mutate_in_int3(buf[base_id_s], seed, rate)

#define MUT_OUT_INT3(buf, rate) \
    buf[groupID.x] = mutate_out_int3(buf[base_id_s], seed, rate)

// =============================================================================
// スレッドグループ共有メモリ (Groupshared Memory)
// =============================================================================

// 拡散計算用のダブルバッファ (奇数/偶数ステップで交互に使用)
groupshared half2x4 mutation_map_np2[TOTAL_NP2]; // sig_pre / sig_post 用 (4要素 half)
groupshared half2x4 mutation_map[TOTAL_N];       // neuromod 用 (4要素 half)

groupshared uint s_min_passed_idx; // 生存個体の最小インデックス (探索用)

groupshared SigMutationParams sig_mutation_params_s;
groupshared NeuromodMapMutationParams neuromod_mutation_params_s;
groupshared InhibMutationParams inhib_mutation_params_s;
groupshared CopyMutationParams copy_mutation_params_s;
groupshared CopyMutation copy_mutation_s;

groupshared uint base_id_s;


// =============================================================================
// パラメータ構造体定義 (Struct Definitions)
// =============================================================================


// =============================================================================
// 座標・インデックス変換ヘルパー (Coordinate Helpers)
// =============================================================================

// N x N x N グリッド
uint3 indexToCoordN(uint index) {
    uint x = (index >> SHIFT_X) & MASK;
    uint y = (index >> SHIFT_Y) & MASK;
    uint z = (index >> SHIFT_Z) & MASK;
    return uint3(x, y, z);
}

uint coordToIndexN(uint3 coord) {
    return (coord.z << SHIFT_Z) | (coord.y << SHIFT_Y) | (coord.x << SHIFT_X);
}

// (N+2) x (N+2) x (N+2) パディング付きグリッド (-1 .. N)
int3 indexToCoordNp2(uint index) {
    uint P = N + 2;
    int x = int(index % P) - 1;
    int y = int((index / P) % P) - 1;
    int z = int(index / (P * P)) - 1;
    return int3(x, y, z);
}

uint coordToIndexNp2(int3 coord) {
    uint P = N + 2;
    uint3 c = uint3(clamp(coord + 1, 0, int(P - 1)));
    return (P * P) * c.z + P * c.y + c.x;
}

// -1 ~ N
bool is_valid_indexNp2m(int3 coord) {
    return all(-1 <= coord) && all(coord <= int(N));
}


// =============================================================================
// 乱数生成ヘルパー (PRNG: PCG Hash Helpers)
// =============================================================================

uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

// [0.0, 1.0) の乱数 (1.0 - rate 未満なら 0.0、確率 rate で乱数を返す)
half rand_half(uint input, half rate = 1.0h) {
    uint h1 = pcg_hash(input);
    half rand = half(float(h1) / 4294967296.0);
    return rand >= (1.0h - rate) ? rand : 0.0h;
}

half4 rand_half4(uint input, half4 rates) {
    uint h1 = pcg_hash(input);
    uint h2 = pcg_hash(h1 + 1u);
    uint h3 = pcg_hash(h2 + 1u);
    uint h4 = pcg_hash(h3 + 1u);

    half4 rand = half4(
        half(float(h1) / 4294967296.0),
        half(float(h2) / 4294967296.0),
        half(float(h3) / 4294967296.0),
        half(float(h4) / 4294967296.0)
    );
    
    half4 thresholds = 1.0h - rates;
    return half4(
        abs(rand.x) >= thresholds.x ? rand.x : 0.0h,
        abs(rand.y) >= thresholds.y ? rand.y : 0.0h,
        abs(rand.z) >= thresholds.z ? rand.z : 0.0h,
        abs(rand.w) >= thresholds.w ? rand.w : 0.0h
    );
}

// [-1.0, 1.0) の4成分乱数 (絶対値が各成分の 1.0 - rate 未満なら 0.0)
half4 rand_half4pm(uint input, half4 rates) {
    uint h1 = pcg_hash(input);
    uint h2 = pcg_hash(h1 + 1u);
    uint h3 = pcg_hash(h2 + 1u);
    uint h4 = pcg_hash(h3 + 1u);

    half4 rand = half4(
        2.0h * half(float(h1) / 4294967296.0) - 1.0h,
        2.0h * half(float(h2) / 4294967296.0) - 1.0h,
        2.0h * half(float(h3) / 4294967296.0) - 1.0h,
        2.0h * half(float(h4) / 4294967296.0) - 1.0h
    );

    half4 thresholds = 1.0h - rates;
    return half4(
        abs(rand.x) >= thresholds.x ? rand.x : 0.0h,
        abs(rand.y) >= thresholds.y ? rand.y : 0.0h,
        abs(rand.z) >= thresholds.z ? rand.z : 0.0h,
        abs(rand.w) >= thresholds.w ? rand.w : 0.0h
    );
}

// val_min <= n <= val_max
int randint(int val_min, int val_max, uint input) {
    uint h = pcg_hash(input);
    uint range = val_max - val_min + 1;
    return (h % range) + val_min;
}

int3 randint3(int val_min, int val_max, uint input) {
    return int3(
        randint(val_min, val_max, input),
        randint(val_min, val_max, input + 1),
        randint(val_min, val_max, input + 2)
    );
}

bool randbool(uint input) {
    return rand_half(input) <= 0.5;
}

bool3 randbool3(uint input) {
    return bool3(
        randbool(input),
        randbool(input + 1),
        randbool(input + 2)
    );
}

// =============================================================================
// パラメータ変異ヘルパー (Parameter Mutation Functions)
// =============================================================================

half mutate_linear(half base_val, half val_min, half val_max, inout uint seed, half rate) {
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= 1.0h - rate;
    return do_mut 
        ? (val_max - val_min) * rand_half(seed) + val_min
        : base_val;
}

half mutate_log(half base_val, half val_min, half val_max, inout uint seed, half rate) {
    half val_min_log = log2(val_min);
    half val_max_log = log2(val_max);
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= 1.0h - rate;
    return do_mut
        ? exp2((val_max_log - val_min_log) * rand + val_min_log)
        : base_val;
}

// val_min <= n <= val_max
uint mutate_uint(uint base_val, uint val_min, uint val_max, inout uint seed, half rate) {
    uint h = pcg_hash(seed++);
    bool do_mut = rand_half(seed++) >= 1.0h - rate;
    if (!do_mut) return base_val;
    uint range = val_max - val_min + 1;
    return (h % range) + val_min;
}

uint4 mutate_uint4(uint4 base_val, uint val_min, uint val_max, inout uint seed, half rate) {
    return uint4(
        mutate_uint(base_val.x, val_min, val_max, seed, rate),
        mutate_uint(base_val.y, val_min, val_max, seed, rate),
        mutate_uint(base_val.z, val_min, val_max, seed, rate),
        mutate_uint(base_val.w, val_min, val_max, seed, rate),
    );
}

// val_min <= n <= val_max (符号付き整数)
int mutate_inout(int base_val, int val_min, int val_max, inout uint seed, half rate) {
    uint h = pcg_hash(seed++);
    bool do_mut = rand_half(seed++) >= 1.0h - rate;
    if (!do_mut) return base_val;
    uint range = uint(val_max - val_min + 1);
    return int(h % range) + val_min;
}

uint mutate_odd(uint base_val, uint val_min, uint val_max, inout uint seed, half rate) {
    half rand = rand_half(seed++);
    bool do_mut = rand_half(seed++) >= 1.0h - rate;
    int delta = do_mut 
        ? (int(pcg_hash(seed++) % 5) - 2) * 2
        : 0;
    int next_val = clamp((int)base_val + delta, int(val_min), int(val_max));
    return uint(next_val | 1);
}

half4 mutate_half4(half4 base_val, half val_min, half val_max, inout uint seed, half rate) {
    return half4(
        mutate_linear(base_val.x, val_min, val_max, seed, rate),
        mutate_linear(base_val.y, val_min, val_max, seed, rate),
        mutate_linear(base_val.z, val_min, val_max, seed, rate),
        mutate_linear(base_val.w, val_min, val_max, seed, rate)
    );
}

half4x4 mutate_half4x4(half4x4 base_val, half val_min, half val_max, inout uint seed, half rate) {
    return half4x4(
        mutate_half4(base_val[0], val_min, val_max, seed, rate),
        mutate_half4(base_val[1], val_min, val_max, seed, rate),
        mutate_half4(base_val[2], val_min, val_max, seed, rate),
        mutate_half4(base_val[3], val_min, val_max, seed, rate)
    );
}

half2 mutate_half2(half2 base_val, half val_min, half val_max, inout uint seed, half rate) {
    return half2(
        mutate_linear(base_val.x, val_min, val_max, seed, rate),
        mutate_linear(base_val.y, val_min, val_max, seed, rate)
    );
}

// 入力セル用 face_index 変異: 面(0..5), 面内座標(-1..N)
int3 mutate_in_int3(int3 base_val, inout uint seed, half rate) {
    return int3(
        mutate_inout(base_val.x, 0, 5, seed, rate),
        mutate_inout(base_val.y, -1, N, seed, rate),
        mutate_inout(base_val.z, -1, N, seed, rate)
    );
}

// 出力セル用 face_index 変異: 面(0..5), 面内座標(0..N-1)
int3 mutate_out_int3(int3 base_val, inout uint seed, half rate) {
    return int3(
        mutate_inout(base_val.x, 0, 5, seed, rate),
        mutate_inout(base_val.y, 0, N - 1, seed, rate),
        mutate_inout(base_val.z, 0, N - 1, seed, rate)
    );
}

// rand <= rate ? true : false
bool mutation_bool(uint group_id_x, uint step, float rate) {
    // uint stepにinoutを付けてはならない、この関数は決定論的であることを想定されている。
    return rand_half(group_id_x * 10007 + step) <= rate;
}


struct SigMutationParamsAll {
    RWStructuredBuffer<half4> rate;
    RWStructuredBuffer<uint> steps;
    RWStructuredBuffer<half4> max;
    RWStructuredBuffer<half4> diff;

    [ForceInline]
    void store(uint agent_id, SigMutationParams smp) {
        rate[agent_id] = smp.rate;
        steps[agent_id] = smp.steps;
        max[agent_id] = smp.max;
        diff[agent_id] = smp.diff;
    }
}

struct SigMutationParams {
    half4 rate;
    uint steps;
    half4 max;
    half4 diff;

    static SigMutationParams load(uint agent_id, SigMutationParamsAll smp_all) {
        SigMutationParams p;
        p.rate = smp_all.rate[agent_id];
        p.steps = smp_all.steps[agent_id];
        p.max = smp_all.max[agent_id];
        p.diff = smp_all.diff[agent_id];
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_half4(rate, 0.01h, 0.5h, seed, mmp.rate);
        steps = mutate_uint(steps, 0, 10, seed, mmp.steps);
        max = mutate_half4(max, 0.005h, 0.2h, seed, mmp.max);
        diff = mutate_half4(diff, 0.001h, 0.037h, seed, mmp.diff);
    }
}

struct NeuromodMapMutationParamsAll {
    RWStructuredBuffer<half4> rate;
    RWStructuredBuffer<uint> steps;
    RWStructuredBuffer<half4> max;
    RWStructuredBuffer<half4> diff;

    [ForceInline]
    void store(uint agent_id, NeuromodMapMutationParams nmp) {
        rate[agent_id] = nmp.rate;
        steps[agent_id] = nmp.steps;
        max[agent_id] = nmp.max;
        diff[agent_id] = nmp.diff;
    }
}

struct NeuromodMapMutationParams {
    half4 rate;
    uint steps;
    half4 max;
    half4 diff;

    static NeuromodMapMutationParams load(uint agent_id, NeuromodMapMutationParamsAll nmp_all) {
        NeuromodMapMutationParams nmp;
        nmp.rate = nmp_all.rate[agent_id];
        nmp.steps = nmp_all.steps[agent_id];
        nmp.max = nmp_all.max[agent_id];
        nmp.diff = nmp_all.diff[agent_id];
        return nmp;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_half4(rate, 0.01h, 0.5h, seed, mmp.rate);
        steps = mutate_uint(steps, 0, 10, seed, mmp.steps);
        max = mutate_half4(max, 0.005h, 0.2h, seed, mmp.max);
        diff = mutate_half4(diff, 0.001h, 0.037h, seed, mmp.diff);
    }
}

struct NeuromodParamsMutationParamsAll {
    RWStructuredBuffer<half4> rate; // matrix / reaction / diff / unused

    void store(uint agent_id, NeuromodParamsMutationParams npmp) {
        rate[agent_id] = npmp.rate;
    }
}

struct NeuromodParamsMutationParams {
    half4 rate;

    static NeuromodParamsMutationParams load(uint agent_id, NeuromodParamsMutationParamsAll npmp_all) {
        NeuromodParamsMutationParams npmp;
        npmp.rate = npmp_all.rate[agent_id];
        return npmp;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_half4(rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct InhibInoutCopyMutationAll {
    RWStructuredBuffer<half4> iicu_rate; // iicu = inhib_inout_copy_unused

    [ForceInline]
    void store(uint agent_id, InhibMutationParams ihmp, InoutMutationParams iomp, CopyMutationParams cmp) {
        iicu_rate[agent_id] = half4(
            ihmp.rate,
            iomp.rate,
            cmp.rate,
            0.0h
        );
    }
}

struct InhibMutationParams {
    half rate;

    static InhibMutationParams load(uint agent_id, InhibInoutCopyMutationAll iicu_all) {
        InhibMutationParams p;
        p.rate = iicu_all.iicu_rate[agent_id].x;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_linear(rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct InoutMutationParams {
    half rate;

    static InoutMutationParams load(uint agent_id, InhibInoutCopyMutationAll iicu_all) {
        InoutMutationParams p;
        p.rate = iicu_all.iicu_rate[agent_id].y;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_linear(rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct CopyMutationParams {
    half rate;

    static CopyMutationParams load(uint agent_id, InhibInoutCopyMutationAll iicu_all) {
        CopyMutationParams p;
        p.rate = iicu_all.iicu_rate[agent_id].z;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        rate = mutate_linear(rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct ResourceLinkMutateMutationAll {
    RWStructuredBuffer<half4> resource_rate; // base / beta / refill
    RWStructuredBuffer<half2> link28th_rate; // multiplier / bias
    RWStructuredBuffer<half4> mutate_rate;   // rate / steps / diff / max

    [ForceInline]
    void store(uint agent_id, ResourceMutationParams rmp, Link28thMutationParams lmp, MutateMutationParams mmp) {
        resource_rate[agent_id] = half4(
            rmp.base_rate,
            rmp.beta_rate,
            rmp.refill_rate,
            0.0h
        );
        link28th_rate[agent_id] = half2(
            lmp.multi_rate,
            lmp.bias_rate
        );
        mutate_rate[agent_id] = half4(
            mmp.rate,
            mmp.steps,
            mmp.diff,
            mmp.max
        );
    }
}

struct ResourceMutationParams {
    half base_rate;
    half beta_rate;
    half refill_rate;

    static ResourceMutationParams load(uint agent_id, ResourceLinkMutateMutationAll rlmu_all) {
        ResourceMutationParams p;
        p.base_rate = rlmu_all.resource_rate[agent_id].x;
        p.beta_rate = rlmu_all.resource_rate[agent_id].y;
        p.refill_rate = rlmu_all.resource_rate[agent_id].z;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        base_rate = mutate_linear(base_rate, 0.01h, 0.5h, seed, mmp.rate);
        beta_rate = mutate_linear(beta_rate, 0.01h, 0.5h, seed, mmp.rate);
        refill_rate = mutate_linear(refill_rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct Link28thMutationParams {
    half multi_rate;
    half bias_rate;

    static Link28thMutationParams load(uint agent_id, ResourceLinkMutateMutationAll rlmu_all) {
        Link28thMutationParams p;
        p.multi_rate = rlmu_all.link28th_rate[agent_id].x;
        p.bias_rate = rlmu_all.link28th_rate[agent_id].y;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(MutateMutationParams mmp, inout uint seed) {
        multi_rate = mutate_linear(multi_rate, 0.01h, 0.5h, seed, mmp.rate);
        bias_rate = mutate_linear(bias_rate, 0.01h, 0.5h, seed, mmp.rate);
    }
}

struct MutateMutationParams {
    half rate;
    half steps;
    half max;
    half diff;

    static MutateMutationParams load(uint agent_id, ResourceLinkMutateMutationAll rlmu_all) {
        MutateMutationParams p;
        p.rate = rlmu_all.mutate_rate[agent_id].x;
        p.steps = rlmu_all.mutate_rate[agent_id].y;
        p.max = rlmu_all.mutate_rate[agent_id].z;
        p.diff = rlmu_all.mutate_rate[agent_id].w;
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(inout uint seed) {
        rate = mutate_linear(rate, 0.05h, 0.50h, seed, 0.5h);
        steps = mutate_linear(steps, 0.05h, 0.50h, seed, 0.5h);
        max = mutate_linear(max, 0.05h, 0.50h, seed, 0.5h);
        diff = mutate_linear(diff, 0.05h, 0.50h, seed, 0.5h);
    }
}

struct NeuromodParamsAll {
    RWStructuredBuffer<half4x4> neuromod_rel_matrix;
    RWStructuredBuffer<half4[NEUROMOD_NUM]> neuromod_weight_reaction;
    RWStructuredBuffer<half> diff;

    void store(uint agent_id, NeuromodParams np) {
        neuromod_rel_matrix[agent_id] = np.neuromod_rel_matrix;
        neuromod_weight_reaction[agent_id] = np.neuromod_weight_reaction;
        diff[agent_id] = np.diff;
    }
}

struct NeuromodParams {
    half4x4 neuromod_rel_matrix;
    half4[NEUROMOD_NUM] neuromod_weight_reaction;
    half diff;

    static NeuromodParams load(uint agent_id, NeuromodParamsAll np_map) {
        NeuromodParams np;
        np.neuromod_rel_matrix = np_map.neuromod_rel_matrix[agent_id];
        np.neuromod_weight_reaction = np_map.neuromod_weight_reaction[agent_id];
        np.diff = np_map.diff[agent_id];
        return np;
    }

    [mutating]
    [ForceInline]
    void mutate(NeuromodParamsMutationParams npmp, inout uint seed) {
        neuromod_rel_matrix = mutate_half4x4(neuromod_rel_matrix, -1.0h, 1.0h, seed, npmp.rate.x);
        for (uint i = 0; i < NEUROMOD_NUM; i++) {
            neuromod_weight_reaction[i] = mutate_half4(neuromod_weight_reaction[i], -1.0h, 1.0h, seed, npmp.rate.y);
        }
        diff = mutate_linear(diff, 0.001h, 0.8h, seed, npmp.rate.z);
    }
}

struct ResourceParamsAll {
    RWStructuredBuffer<half> base_output;
    RWStructuredBuffer<half> beta;
    RWStructuredBuffer<half> k_refill;

    [ForceInline]
    void store(uint agent_id, ResourceParams rp) {
        base_output[agent_id] = rp.base_output;
        beta[agent_id] = rp.beta;
        k_refill[agent_id] = rp.k_refill;
    }
}

struct ResourceParams {
    half base_output;
    half beta;
    half k_refill;

    static ResourceParams load(uint agent_id, ResourceParamsAll mut_all) {
        ResourceParams p;
        p.base_output = mut_all.base_output[agent_id];
        p.beta = mut_all.beta[agent_id];
        p.k_refill = mut_all.k_refill[agent_id];

        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(ResourceMutationParams rmp, inout uint seed) {
        base_output = mutate_log(base_output, 0.0005h, 0.1h, seed, rmp.base_rate);
        beta = mutate_linear(beta, 15.0h, 30.0h, seed, rmp.beta_rate);
        k_refill = mutate_linear(k_refill, 0.01h, 0.5h, seed, rmp.refill_rate);
    }
}

struct Link28thParamsAll {
    RWStructuredBuffer<uint> multiplier;
    RWStructuredBuffer<uint> bias;

    [ForceInline]
    void store(uint agent_id, Link28thParams lp) {
        multiplier[agent_id] = lp.multiplier;
        bias[agent_id] = lp.bias;
    }
}

struct Link28thParams {
    uint multiplier;
    uint bias;

    static Link28thParams load(uint agent_id, Link28thParamsAll mut_all) {
        Link28thParams p;
        p.multiplier = mut_all.multiplier[agent_id];
        p.bias = mut_all.bias[agent_id];

        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(Link28thMutationParams lmp, inout uint seed) {
        multiplier = mutate_odd(multiplier, 1, TOTAL_N - 1, seed, lmp.multi_rate);
        bias = mutate_uint(bias, 0, TOTAL_N - 1, seed, lmp.bias_rate);
    }
}

#ifndef NUM_IN_PORTS
#define NUM_IN_PORTS 2
#endif
#ifndef NUM_OUT_PORTS
#define NUM_OUT_PORTS 4
#endif

struct InoutParamsFiAll {
    RWStructuredBuffer<int3[NUM_IN_PORTS]> in_ports_fi;
    RWStructuredBuffer<int3[NUM_OUT_PORTS]> out_ports_fi;

    [ForceInline]
    void store(uint agent_id, InoutParamsFi ipf) {
        in_ports_fi[agent_id] = ipf.in_coords_fi;
        out_ports_fi[agent_id] = ipf.out_coords_fi;
    }
};

struct InoutParamsFi {
    int3 in_coords_fi[NUM_IN_PORTS];
    int3 out_coords_fi[NUM_OUT_PORTS];

    // 入力セル用: 外周膜の6面 (面座標 = -1 または N, 面内座標 = -1 .. N)
    static int3 faceIndex_to_coordIn(int3 face_index) {
        int u = clamp(face_index.y, -1, int(N));
        int v = clamp(face_index.z, -1, int(N));
        int3 table[6] = {
            int3(-1, u, v),
            int3(N,  u, v),
            int3(u, -1, v),
            int3(u, N,  v),
            int3(u, v, -1),
            int3(u, v, N)
        };
        return table[clamp(face_index.x, 0, 5)];
    }

    // 出力セル用: 内部ニューロン表面の6面 (面座標 = 0 または N-1, 面内座標 = 0 .. N-1)
    static int3 faceIndex_to_coordOut(int3 face_index) {
        int u = clamp(face_index.y, 0, int(N - 1));
        int v = clamp(face_index.z, 0, int(N - 1));
        int3 table[6] = {
            int3(0,     u, v),
            int3(N - 1, u, v),
            int3(u, 0,     v),
            int3(u, N - 1, v),
            int3(u, v, 0),
            int3(u, v, N - 1)
        };
        return table[clamp(face_index.x, 0, 5)];
    }

    static InoutParamsFi load(uint agent_id, InoutParamsFiAll lpf_all) {
        InoutParamsFi p;
        p.in_coords_fi = lpf_all.in_ports_fi[agent_id];
        p.out_coords_fi = lpf_all.out_ports_fi[agent_id];
        return p;
    }

    [mutating]
    [ForceInline]
    void mutate(InoutMutationParams imp, inout uint seed) {
        [unroll]
        for (uint i = 0; i < NUM_IN_PORTS; i++) {
            in_coords_fi[i] = mutate_in_int3(in_coords_fi[i], seed, imp.rate);
        }
        for (uint j = 0; j < NUM_OUT_PORTS; j++) {
            out_coords_fi[j] = mutate_out_int3(out_coords_fi[j], seed, imp.rate);
        }
    }
};



struct CopyMutation {
    int3 start_base;
    uint3 size;
    int3 end_base;
    bool3 reverse_xyz;
    half overwrite_rate;

    static CopyMutation generate(inout uint seed) {
        CopyMutation cm;
        uint h = pcg_hash(seed);
        uint h2 = pcg_hash(h + 1u);
        uint h3 = pcg_hash(h2 + 1u);
        uint h4 = pcg_hash(h3 + 1u);
        uint h5 = pcg_hash(h4 + 1u);
        cm.end_base = randint3(-1, N, h);
        cm.start_base = randint3(-1, N, h2);
        cm.reverse_xyz = randbool3(h3);
        cm.size = randint3(1, N + 2, h4);
        cm.overwrite_rate = rand_half(h5);
        return cm;
    }
}




int3[2] calc_coord_copymut(CopyMutation copy_mutation, uint index) {
    int3 size = (int3)copy_mutation.size;
    bool3 reverse_xyz = copy_mutation.reverse_xyz;
    int3 start_base = copy_mutation.start_base;
    int3 end_base = copy_mutation.end_base;
    int3 pre_coord = int3(
        index % size.x,
        (index % (size.x * size.y)) / size.x,
        index / (size.x * size.y)
    );
    int3 reversed_coord = int3(
        reverse_xyz.x ? (size.x - pre_coord.x - 1) : pre_coord.x,
        reverse_xyz.y ? (size.y - pre_coord.y - 1) : pre_coord.y,
        reverse_xyz.z ? (size.z - pre_coord.z - 1) : pre_coord.z
    );
    int3 result[2] = {
        start_base + pre_coord,
        end_base + reversed_coord
    };
    return result; 
}

// =============================================================================
// ラプラシアン拡散ヘルパー (Laplacian Diffusion Helpers)
// =============================================================================

// --- NP2 グリッド (half4) アクセサ (-1 .. N) ---
half4 get_sig_prepost_mut(int3 center_coord_np2, int3 coord_rel, uint step) {
    int3 target_coord_np2 = center_coord_np2 + coord_rel;
    bool is_valid = is_valid_indexNp2m(target_coord_np2);
    return is_valid
        ? mutation_map_np2[coordToIndexNp2(target_coord_np2)][step & 1u]
        : mutation_map_np2[coordToIndexNp2(center_coord_np2)][step & 1u];
}

void set_sig_prepost_mut(int3 center_coord_np2, uint step, half4 val) {
    mutation_map_np2[coordToIndexNp2(center_coord_np2)][step & 1u] = val;
}

// 3x3x3 近傍のラプラシアンを計算 (NP2 グリッド)
half4 compute_laplacian_np2(int3 center_coord_np2, uint step) {
    half4 neighbor_sum = half4(0.0h, 0.0h, 0.0h, 0.0h);
    [unroll]
    for (int dz = -1; dz <= 1; dz++) {
        [unroll]
        for (int dy = -1; dy <= 1; dy++) {
            [unroll]
            for (int dx = -1; dx <= 1; dx++) {
                neighbor_sum += get_sig_prepost_mut(center_coord_np2, int3(dx, dy, dz), step);
            }
        }
    }
    half4 current_val = get_sig_prepost_mut(center_coord_np2, int3(0, 0, 0), step);
    return neighbor_sum - 27.0h * current_val;
}

// 1ステップ分のラプラシアン拡散 (NP2 グリッド)
void diffuse_step_np2(uint groupIndex, uint step, half4 diff) {
    const half dt = 1.0h / 54.0h;
    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        int3 coord = indexToCoordNp2(idx_np2);
        half4 current_val = get_sig_prepost_mut(coord, int3(0, 0, 0), step);
        half4 laplacian = compute_laplacian_np2(coord, step);
        set_sig_prepost_mut(coord, step + 1, current_val + (diff * laplacian) * dt);
    }
}

// --- N グリッド (half) アクセサ ---
half4 get_neuromod_mut(uint3 center_coord, int3 coord_rel, uint step) {
    int3 target_coord = center_coord + coord_rel;
    bool is_valid = all(0 <= target_coord) && all(target_coord <= N - 1);
    return is_valid
        ? mutation_map[coordToIndexN(uint3(target_coord))][step & 1u]
        : mutation_map[coordToIndexN(center_coord)][step & 1u];
}

void set_neuromod_mut(uint3 center_coord, uint step, half4 val) {
    mutation_map[coordToIndexN(center_coord)][step & 1u] = val;
}

// 3x3x3 近傍のラプラシアンを計算 (N グリッド)
half4 compute_laplacian_n(uint3 center_coord, uint step) {
    half4 neighbor_sum = 0.0h;
    [unroll]
    for (int dz = -1; dz <= 1; dz++) {
        [unroll]
        for (int dy = -1; dy <= 1; dy++) {
            [unroll]
            for (int dx = -1; dx <= 1; dx++) {
                neighbor_sum += get_neuromod_mut(center_coord, int3(dx, dy, dz), step);
            }
        }
    }
    half4 current_val = get_neuromod_mut(center_coord, int3(0, 0, 0), step);
    return neighbor_sum - 27.0h * current_val;
}

// 1ステップ分のラプラシアン拡散 (N グリッド)
void diffuse_step_n(uint groupIndex, uint step, half4 diff) {
    const half dt = 1.0h / 54.0h;
    uint3 coord = indexToCoordN(groupIndex);
    half4 current_val = get_neuromod_mut(coord, int3(0, 0, 0), step);
    half4 laplacian = compute_laplacian_n(coord, step);
    set_neuromod_mut(coord, step + 1, current_val + (diff * laplacian) * dt);
}


// =============================================================================
// コンピュートシェーダー エントリポイント
// =============================================================================

[WaveSize(32)]
[shader("compute")]
[numthreads(N, N, N)]
void computeMain(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    RWStructuredBuffer<half4> neuromod_map_all,
    RWStructuredBuffer<uint> inhib_map_all,
    RWStructuredBuffer<half4> signature_pre_map_np2,
    RWStructuredBuffer<half4> signature_post_map_np2,
    uniform NeuromodParamsAll neuromod_params_all,
    uniform ResourceParamsAll resource_params_all,
    uniform Link28thParamsAll link28th_params_all,
    uniform InoutParamsFiAll inout_params_fi_all, //fi: face_index
    uniform SigMutationParamsAll sig_mutation_params_all,
    uniform NeuromodMapMutationParamsAll neuromod_map_mutation_params_all,
    uniform NeuromodParamsMutationParamsAll neuromod_params_mutation_params_all,
    uniform InhibInoutCopyMutationAll iicu_mutation_params_all,
    uniform ResourceLinkMutateMutationAll rlmu_mutation_params_all,
    RWStructuredBuffer<float> mutation_rate_all,
    uniform uint step,
    uniform uint total
) {
    // -------------------------------------------------------------------------
    // 1. 各変異パラメータの読み込み
    // -------------------------------------------------------------------------
    uint agent_id = groupID.x;
    // -------------------------------------------------------------------------
    // 2. 個体の生存判定とベース個体 (親) の探索
    // -------------------------------------------------------------------------
    bool is_me_passed = mutation_bool(groupID.x, step, mutation_rate_all[groupID.x]);

    // 生存しなかった場合のみ、生存した他個体を親としてコピー・変異を行う
    if (!is_me_passed) {
        if (groupIndex == 0) {
            s_min_passed_idx = 0xFFFFFFFFu;
        }
        GroupMemoryBarrierWithGroupSync();

        // 全スレッドでリング状に生存個体を探索
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

        // 親個体のIDを決定 (生存個体が見つからなければ自身 groupID.x)
        if (groupIndex == 0) {
            base_id_s = (s_min_passed_idx != 0xFFFFFFFFu) ? ((uint)s_min_passed_idx % total) : groupID.x;
        }
        GroupMemoryBarrierWithGroupSync();
        
        // ---------------------------------------------------------------------
        // 3. スカラーパラメータ・変異設定の変異適用 (スレッド0のみ実行)
        // ---------------------------------------------------------------------
        if (groupIndex == 0) {
            // 元データのロード
            sig_mutation_params_s = SigMutationParams.load(base_id_s, sig_mutation_params_all);
            neuromod_mutation_params_s = NeuromodMapMutationParams.load(base_id_s, neuromod_map_mutation_params_all);
            inhib_mutation_params_s = InhibMutationParams.load(base_id_s, iicu_mutation_params_all);
            copy_mutation_params_s = CopyMutationParams.load(base_id_s, iicu_mutation_params_all);
            NeuromodParamsMutationParams neuromod_params_mutation_params = NeuromodParamsMutationParams.load(base_id_s, neuromod_params_mutation_params_all);
            InoutMutationParams inout_mutation_params = InoutMutationParams.load(base_id_s, iicu_mutation_params_all);
            ResourceMutationParams resource_mutation_params = ResourceMutationParams.load(base_id_s, rlmu_mutation_params_all);
            Link28thMutationParams link28th_mutation_params = Link28thMutationParams.load(base_id_s, rlmu_mutation_params_all);
            MutateMutationParams mutate_mutation_params = MutateMutationParams.load(base_id_s, rlmu_mutation_params_all);

            NeuromodParams neuromod_params = NeuromodParams.load(base_id_s, neuromod_params_all);
            ResourceParams resource_params = ResourceParams.load(base_id_s, resource_params_all);
            Link28thParams link28th_params = Link28thParams.load(base_id_s, link28th_params_all);
            InoutParamsFi inout_params_fi = InoutParamsFi.load(base_id_s, inout_params_fi_all);


            uint seed = groupID.x * 10007u + 42u * step;

            // 遺伝子の変異
            mutate_mutation_params.mutate(seed);
            sig_mutation_params_s.mutate(mutate_mutation_params, seed);
            neuromod_mutation_params_s.mutate(mutate_mutation_params, seed);
            neuromod_params_mutation_params.mutate(mutate_mutation_params, seed);
            inhib_mutation_params_s.mutate(mutate_mutation_params, seed);
            resource_mutation_params.mutate(mutate_mutation_params, seed);
            link28th_mutation_params.mutate(mutate_mutation_params, seed);
            inout_mutation_params.mutate(mutate_mutation_params, seed);

            neuromod_params.mutate(neuromod_params_mutation_params, seed);
            resource_params.mutate(resource_mutation_params, seed);
            link28th_params.mutate(link28th_mutation_params, seed);
            inout_params_fi.mutate(inout_mutation_params, seed);

            copy_mutation_s = CopyMutation.generate(seed);

            // 変異した遺伝子の保存
            sig_mutation_params_all.store(agent_id, sig_mutation_params_s);
            neuromod_map_mutation_params_all.store(agent_id, neuromod_mutation_params_s);
            neuromod_params_mutation_params_all.store(agent_id, neuromod_params_mutation_params);
            iicu_mutation_params_all.store(agent_id, inhib_mutation_params_s, inout_mutation_params, copy_mutation_params_s);
            rlmu_mutation_params_all.store(agent_id, resource_mutation_params, link28th_mutation_params, mutate_mutation_params);
            neuromod_params_all.store(agent_id, neuromod_params);
            resource_params_all.store(agent_id, resource_params);
            link28th_params_all.store(agent_id, link28th_params);
            inout_params_fi_all.store(agent_id, inout_params_fi);
        }
        GroupMemoryBarrierWithGroupSync();

        // ---------------------------------------------------------------------
        // 4. シナプス前シグネチャ (Signature Pre) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        // 初期ノイズ生成
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x, sig_mutation_params_s.rate);
        }
        GroupMemoryBarrierWithGroupSync();
        
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < sig_mutation_params_s.steps; step_idx++) {
            diffuse_step_np2(groupIndex, step_idx, sig_mutation_params_s.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            half4 mut_val = mutation_map_np2[idx_np2][sig_mutation_params_s.steps & 1u];
            half4 base_val = signature_pre_map_np2[base_id_s * TOTAL_NP2 + idx_np2];
            signature_pre_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(base_val + sig_mutation_params_s.max * mut_val, -1.0h, 1.0h);
        }
        GroupMemoryBarrierWithGroupSync();

        // ---------------------------------------------------------------------
        // 5. シナプス後シグネチャ (Signature Post) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        // 初期ノイズ生成 (シードオフセット: +1)
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x + 1, sig_mutation_params_s.rate);
        }
        GroupMemoryBarrierWithGroupSync();
        
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < sig_mutation_params_s.steps; step_idx++) {
            diffuse_step_np2(groupIndex, step_idx, sig_mutation_params_s.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            half4 mut_val = mutation_map_np2[idx_np2][sig_mutation_params_s.steps & 1u];
            half4 base_val = signature_post_map_np2[base_id_s * TOTAL_NP2 + idx_np2];
            signature_post_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(base_val + sig_mutation_params_s.max * mut_val, -1.0h, 1.0h);
        }

        // ---------------------------------------------------------------------
        // 6. 神経修飾物質（Neuromod）の変異生成 & 拡散
        // ---------------------------------------------------------------------
        GroupMemoryBarrierWithGroupSync();
        // 初期ノイズ生成 (シードオフセット: +2)
        mutation_map[groupIndex][0] = rand_half4pm(groupIndex + groupID.x + 2, neuromod_mutation_params_s.rate);
        GroupMemoryBarrierWithGroupSync();
            
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < neuromod_mutation_params_s.steps; step_idx++) {
            diffuse_step_n(groupIndex, step_idx, neuromod_mutation_params_s.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        half4 neuromod_mut = mutation_map[groupIndex][neuromod_mutation_params_s.steps & 1u];
        half4 neuromod_base = neuromod_map_all[base_id_s * TOTAL_N + groupIndex];
        neuromod_map_all[groupID.x * TOTAL_N + groupIndex] = saturate(neuromod_base + neuromod_mutation_params_s.max * neuromod_mut);
        
        GroupMemoryBarrierWithGroupSync();

        // -------------------------------------------------------------------------
        // 8. 抑制フラグマップ (Inhibition) の変異ビット反転
        // -------------------------------------------------------------------------
        uint packed_val = inhib_map_all[(base_id_s * INHIB_STRIDE) + (groupIndex >> 5)];
        bool is_me_inhib = bool((packed_val >> (groupIndex & 31)) & 1);
        bool mutation = rand_half(groupIndex + groupID.x + 4, inhib_mutation_params_s.rate) > 0.0h;

        bool my_inhib = is_me_inhib ^ mutation;
        uint4 ballot = WaveActiveBallot(my_inhib);

        if (WaveIsFirstLane()) {
            uint packed_index = (groupID.x * INHIB_STRIDE) + (groupIndex / WaveGetLaneCount());
            inhib_map_all[packed_index] = ballot.x;
        }
        GroupMemoryBarrierWithGroupSync();

        // -------------------------------------------------------------------------
        // SigPrePost コピー型変異
        // -------------------------------------------------------------------------
        if (rand_half(agent_id * 11447u + step * 6803u, 1.0h) <= copy_mutation_params_s.rate) {
            uint3 size = copy_mutation_s.size;
            if (groupIndex < size.x * size.y * size.z) {
                int3 my_startend_coord[2] = calc_coord_copymut(copy_mutation_s, groupIndex);
                bool is_valid_start_idx = is_valid_indexNp2m(my_startend_coord[0]);
                bool is_valid_end_idx = is_valid_indexNp2m(my_startend_coord[1]);
                if (is_valid_start_idx & is_valid_end_idx) {
                    uint start_idx = base_id_s * TOTAL_NP2 + coordToIndexNp2(my_startend_coord[0]);
                    uint end_idx   = groupID.x * TOTAL_NP2 + coordToIndexNp2(my_startend_coord[1]);
                    half4 my_pre_val       = signature_pre_map_np2[start_idx];
                    half4 my_post_val      = signature_post_map_np2[start_idx];
                    half4 current_end_pre  = signature_pre_map_np2[end_idx];
                    half4 current_end_post = signature_post_map_np2[end_idx];
                    half overwrite_rate    = copy_mutation_s.overwrite_rate;
                    signature_pre_map_np2[end_idx]
                        = current_end_pre * (1.0h - overwrite_rate) + my_pre_val * overwrite_rate;
                    signature_post_map_np2[end_idx]
                        = current_end_post * (1.0h - overwrite_rate) + my_post_val * overwrite_rate;
                }
            }
        }
    }
}