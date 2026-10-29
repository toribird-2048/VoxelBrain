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

// =============================================================================
// 変異ヘルパーマクロ (Mutation Macros)
// base_id_s の値から groupID.x のバッファへ変異適用を行う
// =============================================================================

#define MUT_LINEAR(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_linear(buf[base_id_s], v_min, v_max, seed, rate)

#define MUT_HALF4(buf, v_min, v_max, rate) \
    buf[groupID.x] = mutate_half4(buf[base_id_s], v_min, v_max, seed, rate)

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
groupshared half2   mutation_map[TOTAL_N];       // dopamine / sleep 用 (スカラー half)

groupshared uint s_min_passed_idx; // 生存個体の最小インデックス (探索用)
groupshared uint base_id_s;        // 変異の元となる親個体のID


// =============================================================================
// パラメータ構造体定義 (Struct Definitions)
// =============================================================================


struct ResourceParamsAll {
    RWStructuredBuffer<half> base_output;
    RWStructuredBuffer<half> beta;
    RWStructuredBuffer<half> k_refill;
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
}

struct Link27thParamsAll {
    RWStructuredBuffer<uint> multiplier;
    RWStructuredBuffer<uint> bias;
}

struct Link27thParams {
    uint multiplier;
    uint bias;

    static Link27thParams load(uint agent_id, Link27thParamsAll mut_all) {
        Link27thParams p;
        p.multiplier = mut_all.multiplier[agent_id];
        p.bias = mut_all.bias[agent_id];

        return p;
    }
}
struct LearningParamsAll {
    RWStructuredBuffer<half> learning_rate;
    RWStructuredBuffer<half> forget_rate;
    RWStructuredBuffer<half> learning_threshold;
    RWStructuredBuffer<half> tag_decay;
}

struct LearningParams {
    half learning_rate;
    half forget_rate;
    half learning_threshold;
    half tag_decay;

    static LearningParams load(uint agent_id, LearningParamsAll mut_all) {
        LearningParams p;
        p.learning_rate = mut_all.learning_rate[agent_id];
        p.forget_rate = mut_all.forget_rate[agent_id];
        p.learning_threshold = mut_all.learning_threshold[agent_id];
        p.tag_decay = mut_all.tag_decay[agent_id];

        return p;
    }
}

struct InoutParamsFiAll {
    RWStructuredBuffer<int3> light_in_fi;
    RWStructuredBuffer<int3> battery_in_fi;
    RWStructuredBuffer<int3> gen_neg_out_fi;
    RWStructuredBuffer<int3> gen_pos_out_fi;
}

struct InoutParams {
    int3 light_in;
    int3 battery_in;
    int3 gen_neg_out;
    int3 gen_pos_out;

    static InoutParams load(
        int3 light_in,
        int3 battery_in,
        int3 gen_neg_out,
        int3 gen_pos_out
    ) {
        InoutParams p;
        p.light_in    = light_in;
        p.battery_in  = battery_in;
        p.gen_neg_out = gen_neg_out;
        p.gen_pos_out = gen_pos_out;
        return p;
    }

    // 入力セル用: 外周膜の6面 (面座標 = -1 または N, 面内座標 = -1 .. N)
    static int3 faceIndex_to_coordIn(int3 face_index) {
        int3 table[6] = {
            int3(-1, face_index.y, face_index.z),
            int3(N,  face_index.y, face_index.z),
            int3(face_index.y, -1, face_index.z),
            int3(face_index.y, N,  face_index.z),
            int3(face_index.y, face_index.z, -1),
            int3(face_index.y, face_index.z, N)
        };
        return table[clamp(face_index.x, 0, 5)];
    }

    // 出力セル用: 内部ニューロン表面の6面 (面座標 = 0 または N-1, 面内座標 = 0 .. N-1)
    static int3 faceIndex_to_coordOut(int3 face_index) {
        int3 table[6] = {
            int3(0,     face_index.y, face_index.z),
            int3(N - 1, face_index.y, face_index.z),
            int3(face_index.y, 0,     face_index.z),
            int3(face_index.y, N - 1, face_index.z),
            int3(face_index.y, face_index.z, 0),
            int3(face_index.y, face_index.z, N - 1)
        };
        return table[clamp(face_index.x, 0, 5)];
    }

    static InoutParams load_face_index(
        int3 light_in_fi,
        int3 battery_in_fi,
        int3 gen_neg_out_fi,
        int3 gen_pos_out_fi
    ) {
        InoutParams p;
        p.light_in    = faceIndex_to_coordIn(light_in_fi);
        p.battery_in  = faceIndex_to_coordIn(battery_in_fi);
        p.gen_neg_out = faceIndex_to_coordOut(gen_neg_out_fi);
        p.gen_pos_out = faceIndex_to_coordOut(gen_pos_out_fi);
        return p;
    }

    static InoutParams load(uint agent_id, InoutParamsFiAll inout_all) {
        InoutParams p = InoutParams.load_face_index(
            inout_all.light_in_fi[agent_id],
            inout_all.battery_in_fi[agent_id],
            inout_all.gen_neg_out_fi[agent_id],
            inout_all.gen_pos_out_fi[agent_id]
        );
        return p;
    }
}



struct CopyMutation {
    int3 start_base;
    uint3 size;
    int3 end_base;
    bool3 reverse_xyz;
    half overwrite_rate;
}

struct MutationParamsAll {
    RWStructuredBuffer<half4> sig_pre_rate;
    RWStructuredBuffer<half4> sig_post_rate;
    RWStructuredBuffer<half4> other_rate;    // dopamine / sleep / inhib / unused
    RWStructuredBuffer<uint4> steps;              // sig_pre / sig_post / dopamine / sleep
    RWStructuredBuffer<half4> sig_pre_diff;
    RWStructuredBuffer<half4> sig_post_diff;
    RWStructuredBuffer<half4> other_diff;         // dopamine / sleep / unused / unused
    RWStructuredBuffer<half4> sig_pre_max;
    RWStructuredBuffer<half4> sig_post_max;
    RWStructuredBuffer<half4> other_max;          // dopamine / sleep / unused / unused
    RWStructuredBuffer<half4> resource_rate; // base / beta / refill
    RWStructuredBuffer<half2> link27th_rate; // multiplier / bias
    RWStructuredBuffer<half4> learning_rate; // rate / forget / rate / tag_decay
    RWStructuredBuffer<half4> mutate_rate;   // rate / steps / diff / max
    RWStructuredBuffer<half2> inout_copy_rate; // inout / copy
}

struct SigMutationParams {
    half4 rate;
    uint steps;
    half4 max;
    half4 diff;

    static SigMutationParams load_pre(uint agent_id, MutationParamsAll mut_all) {
        SigMutationParams p;
        p.rate = mut_all.sig_pre_rate[agent_id];
        p.steps = mut_all.steps[agent_id].x;
        p.max = mut_all.sig_pre_max[agent_id];
        p.diff = mut_all.sig_pre_diff[agent_id];

        return p;
    }

    static SigMutationParams load_post(uint agent_id, MutationParamsAll mut_all) {
        SigMutationParams p;
        p.rate = mut_all.sig_post_rate[agent_id];
        p.steps = mut_all.steps[agent_id].y;
        p.max = mut_all.sig_post_max[agent_id];
        p.diff = mut_all.sig_post_diff[agent_id];

        return p;
    }
}

struct DopSlpMutationParams {
    half rate;
    uint steps;
    half max;
    half diff;

    static DopSlpMutationParams load_dop(uint agent_id, MutationParamsAll mut_all) {
        DopSlpMutationParams p;
        p.rate = mut_all.other_rate[agent_id].x;
        p.steps = mut_all.steps[agent_id].z;
        p.max = mut_all.other_max[agent_id].x;
        p.diff = mut_all.other_diff[agent_id].x;
        return p;
    }

    static DopSlpMutationParams load_slp(uint agent_id, MutationParamsAll mut_all) {
        DopSlpMutationParams p;
        p.rate = mut_all.other_rate[agent_id].y;
        p.steps = mut_all.steps[agent_id].w;
        p.max = mut_all.other_max[agent_id].y;
        p.diff = mut_all.other_diff[agent_id].y;
        return p;
    }
}

struct InhibMutationParams {
    half rate;

    static InhibMutationParams load(uint agent_id, MutationParamsAll mut_all) {
        InhibMutationParams p;
        p.rate = mut_all.other_rate[agent_id].z;
        return p;
    }
}

struct InoutMutationParams {
    half rate;

    static InoutMutationParams load(uint agent_id, MutationParamsAll mut_all) {
        InoutMutationParams p;
        p.rate = mut_all.inout_copy_rate[agent_id].x;
        return p;
    }
}

struct CopyMutationParams {
    half rate;

    static CopyMutationParams load(uint agent_id, MutationParamsAll mut_all) {
        CopyMutationParams p;
        p.rate = mut_all.inout_copy_rate[agent_id].y;
        return p;
    }
}


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

// (N+2) x (N+2) x (N+2) パディング付きグリッド
uint3 indexToCoordNp2(uint index) {
    uint P = N + 2;
    uint x = index % P;
    uint y = (index / P) % P;
    uint z = (index / (P * P)) % P;
    return uint3(x, y, z);
}

uint coordToIndexNp2(uint3 coord) {
    uint P = N + 2;
    return (P * P) * coord.z + P * coord.y + coord.x;
}

//-1 ~ N
bool is_valid_indexNp2m(int3 coord) {
    bool3 tf_xyz = (-1 <= coord) & (coord <= N);
    return all(tf_xyz);
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

CopyMutation mutation_copy(uint seed) {
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

// --- NP2 グリッド (half4) アクセサ ---
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

// 3x3x3 近傍のラプラシアンを計算 (NP2 グリッド)
half4 compute_laplacian_np2(uint3 center_coord_np2, uint step) {
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
        uint3 coord = indexToCoordNp2(idx_np2);
        half4 current_val = get_sig_prepost_mut(coord, int3(0, 0, 0), step);
        half4 laplacian = compute_laplacian_np2(coord, step);
        set_sig_prepost_mut(coord, step + 1, current_val + (diff * laplacian) * dt);
    }
}

// --- N グリッド (half) アクセサ ---
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

// 3x3x3 近傍のラプラシアンを計算 (N グリッド)
half compute_laplacian_n(uint3 center_coord, uint step) {
    half neighbor_sum = 0.0h;
    [unroll]
    for (int dz = -1; dz <= 1; dz++) {
        [unroll]
        for (int dy = -1; dy <= 1; dy++) {
            [unroll]
            for (int dx = -1; dx <= 1; dx++) {
                neighbor_sum += get_sig_dopslp_mut(center_coord, int3(dx, dy, dz), step);
            }
        }
    }
    half current_val = get_sig_dopslp_mut(center_coord, int3(0, 0, 0), step);
    return neighbor_sum - 27.0h * current_val;
}

// 1ステップ分のラプラシアン拡散 (N グリッド)
void diffuse_step_n(uint groupIndex, uint step, half diff) {
    const half dt = 1.0h / 54.0h;
    uint3 coord = indexToCoordN(groupIndex);
    half current_val = get_sig_dopslp_mut(coord, int3(0, 0, 0), step);
    half laplacian = compute_laplacian_n(coord, step);
    set_sig_dopslp_mut(coord, step + 1, current_val + (diff * laplacian) * dt);
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
    RWStructuredBuffer<half> dopamine_map_all,
    RWStructuredBuffer<half> sleep_map_all,
    RWStructuredBuffer<uint> inhib_map_all,
    RWStructuredBuffer<half4> signature_pre_map_np2,
    RWStructuredBuffer<half4> signature_post_map_np2,
    uniform ResourceParamsAll resource_params_all,
    uniform Link27thParamsAll link27th_params_all,
    uniform LearningParamsAll learning_params_all,
    uniform InoutParamsFiAll inout_params_fi_all, //fi: face_index
    uniform MutationParamsAll mutation_params_all,
    RWStructuredBuffer<float> mutation_rate_all,
    uniform uint step,
    uniform uint total
) {
    // -------------------------------------------------------------------------
    // 1. 各変異パラメータの読み込み
    // -------------------------------------------------------------------------
    uint agent_id = groupID.x;
    SigMutationParams sig_pre_mutation_params = SigMutationParams.load_pre(agent_id, mutation_params_all);

    SigMutationParams sig_post_mutation_params = SigMutationParams.load_post(agent_id, mutation_params_all);

    DopSlpMutationParams dopamine_mutation_params = DopSlpMutationParams.load_dop(agent_id, mutation_params_all);

    DopSlpMutationParams sleep_mutation_params = DopSlpMutationParams.load_slp(agent_id, mutation_params_all);

    InhibMutationParams inhib_mutation_params = InhibMutationParams.load(agent_id, mutation_params_all);

    InoutMutationParams inout_mutation_params = InoutMutationParams.load(agent_id, mutation_params_all);

    CopyMutationParams copy_mutation_params = CopyMutationParams.load(agent_id, mutation_params_all);

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
            uint seed = groupID.x * 10007u + 42u * step;

            // 変異率 (rate) パラメータの変異 (旧 threshold 0.5~0.99 の 1-x ➔ 0.01~0.50)
            half threshold_rate = mutation_params_all.mutate_rate[groupID.x].x;
            MUT_HALF4(mutation_params_all.sig_pre_rate, 0.01h, 0.50h, threshold_rate);
            MUT_HALF4(mutation_params_all.sig_post_rate, 0.01h, 0.50h, threshold_rate);
            MUT_HALF4(mutation_params_all.other_rate, 0.01h, 0.50h, threshold_rate);

            // ステップ数パラメータの変異
            uint4 cur_steps = mutation_params_all.steps[base_id_s];
            half steps_rate = mutation_params_all.mutate_rate[groupID.x].y;
            mutation_params_all.steps[groupID.x] = uint4(
                mutate_uint(cur_steps.x, 0, 10, seed, steps_rate),
                mutate_uint(cur_steps.y, 0, 10, seed, steps_rate),
                mutate_uint(cur_steps.z, 0, 10, seed, steps_rate),
                mutate_uint(cur_steps.w, 0, 10, seed, steps_rate)
            );

            // 拡散係数 (diff) パラメータの変異
            half diff_rate = mutation_params_all.mutate_rate[groupID.x].z;
            MUT_HALF4(mutation_params_all.sig_pre_diff, 0.001h, 0.037h, diff_rate);
            MUT_HALF4(mutation_params_all.sig_post_diff, 0.001h, 0.037h, diff_rate);
            MUT_HALF4(mutation_params_all.other_diff, 0.001h, 0.037h, diff_rate);

            // 最大振幅 (max) パラメータの変異
            half max_rate = mutation_params_all.mutate_rate[groupID.x].w;
            MUT_HALF4(mutation_params_all.sig_pre_max, 0.005h, 0.2h, max_rate);
            MUT_HALF4(mutation_params_all.sig_post_max, 0.005h, 0.2h, max_rate);
            MUT_HALF4(mutation_params_all.other_max, 0.005h, 0.2h, max_rate);

            // ResourceParams の変異
            half4 resource_rate = mutation_params_all.resource_rate[groupID.x];
            MUT_LOG(resource_params_all.base_output, 0.0005h, 0.1h, resource_rate.x);
            MUT_LINEAR(resource_params_all.beta, 15.0h, 30.0h, resource_rate.y);
            MUT_LINEAR(resource_params_all.k_refill, 0.01h, 0.5h, resource_rate.z);

            // Link27thParams の変異
            half2 link27th_rate = mutation_params_all.link27th_rate[groupID.x];
            link27th_params_all.multiplier[groupID.x] = mutate_odd(link27th_params_all.multiplier[base_id_s], 1, TOTAL_N - 1, seed, link27th_rate.x);
            MUT_UINT(link27th_params_all.bias, 0, TOTAL_N - 1, link27th_rate.y);

            // LearningParams の変異
            half4 learning_rate = mutation_params_all.learning_rate[groupID.x];
            MUT_LINEAR(learning_params_all.learning_rate, 0.0h, 1.0h, learning_rate.x);
            MUT_LINEAR(learning_params_all.forget_rate, 0.0h, 1.0h, learning_rate.y);
            MUT_LINEAR(learning_params_all.learning_threshold, 0.0h, 1.0h, learning_rate.z);
            MUT_LINEAR(learning_params_all.tag_decay, 0.5h, 0.999h, learning_rate.w);

            // InoutParams の変異
            half inout_copy_rate = mutation_params_all.inout_copy_rate[groupID.x].x;
            MUT_IN_INT3(inout_params_fi_all.light_in_fi, inout_copy_rate);
            MUT_IN_INT3(inout_params_fi_all.battery_in_fi, inout_copy_rate);
            MUT_OUT_INT3(inout_params_fi_all.gen_neg_out_fi, inout_copy_rate);
            MUT_OUT_INT3(inout_params_fi_all.gen_pos_out_fi, inout_copy_rate);
        }

        // ---------------------------------------------------------------------
        // 4. シナプス前シグネチャ (Signature Pre) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        // 初期ノイズ生成
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x, sig_pre_mutation_params.rate);
        }
        GroupMemoryBarrierWithGroupSync();
        
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < sig_pre_mutation_params.steps; step_idx++) {
            diffuse_step_np2(groupIndex, step_idx, sig_pre_mutation_params.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            half4 mut_val = mutation_map_np2[idx_np2][sig_pre_mutation_params.steps & 1u];
            half4 base_val = signature_pre_map_np2[base_id_s * TOTAL_NP2 + idx_np2];
            signature_pre_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(base_val + sig_pre_mutation_params.max * mut_val, -1.0h, 1.0h);
        }
        GroupMemoryBarrierWithGroupSync();

        // ---------------------------------------------------------------------
        // 5. シナプス後シグネチャ (Signature Post) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        // 初期ノイズ生成 (シードオフセット: +1)
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            mutation_map_np2[idx_np2][0] = rand_half4pm(idx_np2 + groupID.x + 1, sig_post_mutation_params.rate);
        }
        GroupMemoryBarrierWithGroupSync();
        
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < sig_post_mutation_params.steps; step_idx++) {
            diffuse_step_np2(groupIndex, step_idx, sig_post_mutation_params.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
            half4 mut_val = mutation_map_np2[idx_np2][sig_post_mutation_params.steps & 1u];
            half4 base_val = signature_post_map_np2[base_id_s * TOTAL_NP2 + idx_np2];
            signature_post_map_np2[groupID.x * TOTAL_NP2 + idx_np2] = clamp(base_val + sig_post_mutation_params.max * mut_val, -1.0h, 1.0h);
        }

        // ---------------------------------------------------------------------
        // 6. ドーパミンマップ (Dopamine) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        GroupMemoryBarrierWithGroupSync();
        // 初期ノイズ生成 (シードオフセット: +2)
        mutation_map[groupIndex][0] = rand_half(groupIndex + groupID.x + 2, dopamine_mutation_params.rate);
        GroupMemoryBarrierWithGroupSync();
            
        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < dopamine_mutation_params.steps; step_idx++) {
            diffuse_step_n(groupIndex, step_idx, dopamine_mutation_params.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        half dop_mut = mutation_map[groupIndex][dopamine_mutation_params.steps & 1u];
        half dop_base = dopamine_map_all[base_id_s * TOTAL_N + groupIndex];
        dopamine_map_all[groupID.x * TOTAL_N + groupIndex] = saturate(dop_base + dopamine_mutation_params.max * dop_mut);

        // ---------------------------------------------------------------------
        // 7. 睡眠マップ (Sleep) の変異生成 & 拡散
        // ---------------------------------------------------------------------
        GroupMemoryBarrierWithGroupSync();
        // 初期ノイズ生成 (シードオフセット: +3)
        mutation_map[groupIndex][0] = rand_half(groupIndex + groupID.x + 3, sleep_mutation_params.rate);
        GroupMemoryBarrierWithGroupSync();

        // ラプラシアン拡散
        for (uint step_idx = 0; step_idx < sleep_mutation_params.steps; step_idx++) {
            diffuse_step_n(groupIndex, step_idx, sleep_mutation_params.diff);
            GroupMemoryBarrierWithGroupSync();
        }

        // 親データに変異量を加算して反映
        half slp_mut = mutation_map[groupIndex][sleep_mutation_params.steps & 1u];
        half slp_base = sleep_map_all[base_id_s * TOTAL_N + groupIndex];
        sleep_map_all[groupID.x * TOTAL_N + groupIndex] = saturate(slp_base + sleep_mutation_params.max * slp_mut);

        GroupMemoryBarrierWithGroupSync();

        // -------------------------------------------------------------------------
        // 8. 抑制フラグマップ (Inhibition) の変異ビット反転
        // -------------------------------------------------------------------------
        uint packed_val = inhib_map_all[(base_id_s * INHIB_STRIDE) + (groupIndex >> 5)];
        bool is_me_inhib = bool((packed_val >> (groupIndex & 31)) & 1);
        bool mutation = rand_half(groupIndex + groupID.x + 4, inhib_mutation_params.rate) > 0.0h;

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
        if (rand_half(agent_id * 11447u + step * 6803u, 1.0h) <= copy_mutation_params.rate) {
            CopyMutation copy_mutation = mutation_copy(12277u * agent_id + 17u * step);
            uint3 size = copy_mutation.size;
            if (groupIndex < size.x * size.y * size.z) {
                int3 my_startend_coord[2] = calc_coord_copymut(copy_mutation, groupIndex);
                bool is_valid_start_idx = is_valid_indexNp2m(my_startend_coord[0]);
                bool is_valid_end_idx = is_valid_indexNp2m(my_startend_coord[1]);
                if (is_valid_start_idx & is_valid_end_idx) {
                    half4 my_pre_val = signature_pre_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[0] + 1))];
                    half4 my_post_val = signature_post_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[0] + 1))];
                    half4 current_end_pre = signature_pre_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[1] + 1))];
                    half4 current_end_post = signature_post_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[1] + 1))];
                    half overwrite_rate = copy_mutation.overwrite_rate;
                    signature_pre_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[1] + 1))]
                        = current_end_pre * (1.0h - overwrite_rate) + my_pre_val * overwrite_rate;
                    signature_post_map_np2[base_id_s * TOTAL_NP2 + coordToIndexNp2(uint3(my_startend_coord[1] + 1))]
                        = current_end_post * (1.0h - overwrite_rate) + my_post_val * overwrite_rate;
                }
            }
        }
    }
}