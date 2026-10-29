// =============================================================================
// 1. コンパイル時定数・デフォルト定義
//    （Python側の build_kernel 実行時には #define で上書きされます）
// =============================================================================
#ifndef DIM
#define DIM 2
#endif

#ifndef ENABLE_LEARNING
#define ENABLE_LEARNING 0.0h
#endif
#ifndef USE_LEARNING
#define USE_LEARNING 0
#endif

#ifndef ENABLE_DOPAMINE
#define ENABLE_DOPAMINE 0.0h
#endif
#ifndef USE_DOPAMINE
#define USE_DOPAMINE 0
#endif

#ifndef ENABLE_SLEEP
#define ENABLE_SLEEP 0.0h
#endif
#ifndef USE_SLEEP
#define USE_SLEEP 0
#endif

#ifndef INITIAL_ENERGY
#define INITIAL_ENERGY 0.20f
#endif

#ifndef METABOLIC_COST
#define METABOLIC_COST 0.0001f
#endif

#ifndef GEN_COST_RATE
#define GEN_COST_RATE 0.005f
#endif

#ifndef SOLAR_GAIN_RATE
#define SOLAR_GAIN_RATE 0.012f
#endif

#ifndef SUN_CYCLE_PERIOD
#define SUN_CYCLE_PERIOD 50.0f
#endif

// =============================================================================
// 2. 空間グリッド定数・入出力セル座標の定義
//    ・内部ニューロン空間 : N × N × N       (各軸 0 .. N-1)
//    ・外周膜込み空間(Np2): (N+2)×(N+2)×(N+2) (内部座標に対し -1 .. N)
// =============================================================================
#define N           (1 << DIM)
#define MASK        (N - 1)

#define SHIFT_X     (0)
#define SHIFT_Y     (DIM)
#define SHIFT_Z     (DIM * 2)

#define TOTAL_N     (N * N * N)
#define INHIB_STRIDE ((TOTAL_N + 31) / 32)
#define P2          (N + 2)
#define TOTAL_NP2   ((N + 2) * (N + 2) * (N + 2))
#define TOTAL_NP2H2 (TOTAL_NP2 >> 1)

#define MAX_WAVE    (64)
#define INNER_STEPS (1000)

// =============================================================================
// 3. パラメータ構造体 ＆ シナプスデータ管理構造体
// =============================================================================
struct ResourceParams {
    half base_output;
    half beta;
    half k_refill;
}

struct ResourceParamsAll {
    StructuredBuffer<half> base_output;
    StructuredBuffer<half> beta;
    StructuredBuffer<half> k_refill;
}

struct Link27thParams {
    uint multiplier;
    uint bias;
}

struct Link27thParamsAll {
    StructuredBuffer<uint> multiplier;
    StructuredBuffer<uint> bias;
}

struct LearningParams {
    half learning_rate;
    half forget_rate;
    half learning_threshold;
    half tag_decay;
}

struct LearningParamsAll {
    StructuredBuffer<half> learning_rate;
    StructuredBuffer<half> forget_rate;
    StructuredBuffer<half> learning_threshold;
    StructuredBuffer<half> tag_decay;
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
}

struct InoutParamsFiAll {
    StructuredBuffer<int3> light_in_fi;
    StructuredBuffer<int3> battery_in_fi;
    StructuredBuffer<int3> gen_neg_out_fi;
    StructuredBuffer<int3> gen_pos_out_fi;
}

// 各ニューロンが持つ28個のシナプス（近傍3x3x3=27個 ＋ 長距離27thリンク1個）
struct SynapseData {
    half weights[28];
    half tags[28];

    [ForceInline]
    static uint relCoordToSlot(int3 coord_rel) {
        return 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1);
    }

    // --- 近傍27シナプス (dx, dy, dz in -1..1) ---
    [ForceInline]
    half get_weight(int3 coord_rel) {
        return weights[relCoordToSlot(coord_rel)];
    }

    [ForceInline]
    half get_tag(int3 coord_rel) {
        return tags[relCoordToSlot(coord_rel)];
    }

    [mutating]
    [ForceInline]
    void set_weights(int3 coord_rel, half val) {
        weights[relCoordToSlot(coord_rel)] = val;
    }

    [mutating]
    [ForceInline]
    void set_tags(int3 coord_rel, half val) {
        tags[relCoordToSlot(coord_rel)] = val;
    }

    // --- インデックス直接指定 ---
    [ForceInline]
    half get_weight_idx(int idx) { return weights[idx]; }

    [ForceInline]
    half get_tag_idx(int idx) { return tags[idx]; }

    [mutating]
    [ForceInline]
    void set_weights_idx(int idx, half val) { weights[idx] = val; }

    [mutating]
    [ForceInline]
    void set_tags_idx(int idx, half val) { tags[idx] = val; }

    // --- 長距離シナプス (スロット27) ---
    [ForceInline]
    half get_weight_27th() { return weights[27]; }

    [ForceInline]
    half get_tag_27th() { return tags[27]; }

    [mutating]
    [ForceInline]
    void set_weights_27th(half val) { weights[27] = val; }

    [mutating]
    [ForceInline]
    void set_tags_27th(half val) { tags[27] = val; }

    // --- シナプスタグの8bit×4パック入出力 (28個 = uint32 × 7要素) ---
    [ForceInline]
    uint get_tag_idx_ui7(int idx_ui7) {
        int base_idx = idx_ui7 * 4;
        return pack_u8(uint4(
            uint(round(tags[base_idx + 0] * 255.0h)),
            uint(round(tags[base_idx + 1] * 255.0h)),
            uint(round(tags[base_idx + 2] * 255.0h)),
            uint(round(tags[base_idx + 3] * 255.0h))
        ));
    }

    [mutating]
    [ForceInline]
    void set_tags_idx_ui7(int idx_ui7, uint val) {
        half4 unpacked_val = half4(unpack_u8u32(val)) * (1.0h / 255.0h);
        int base_idx = idx_ui7 * 4;
        tags[base_idx + 0] = unpacked_val.x;
        tags[base_idx + 1] = unpacked_val.y;
        tags[base_idx + 2] = unpacked_val.z;
        tags[base_idx + 3] = unpacked_val.w;
    }
}

// =============================================================================
// 4. グループ共有メモリ (1グループ = 1個体)
// =============================================================================
groupshared half  outputs_s[TOTAL_NP2];         // ニューロン出力＆外周感覚膜
groupshared half4 sig_pre_map_s[TOTAL_NP2];     // シナプス前シグネチャ
groupshared half4 sig_post_map_s[TOTAL_NP2];    // シナプス後シグネチャ

groupshared half  dopamine_wave_sums[MAX_WAVE]; // Wave単位のドーパミン部分和
groupshared half  my_dopamine_sum;              // 個体全体のドーパミン総量
groupshared half  sleep_wave_sums[MAX_WAVE];    // Wave単位の睡眠シグナル部分和
groupshared half  my_sleep_sum;                 // 個体全体の睡眠シグナル総量

groupshared float my_energy_s; // 個体の現在エネルギー残量
groupshared InoutParams inout_params_s;


// =============================================================================
// 5. 座標変換 ＆ 共有メモリアクセス関数
// =============================================================================
[ForceInline]
uint3 indexToCoordN(uint index) {
    uint x = (index >> SHIFT_X) & MASK;
    uint y = (index >> SHIFT_Y) & MASK;
    uint z = (index >> SHIFT_Z) & MASK;
    return uint3(x, y, z);
}

[ForceInline]
uint coordToIndexN(uint3 coord) {
    return (coord.z << SHIFT_Z) | (coord.y << SHIFT_Y) | (coord.x << SHIFT_X);
}

[ForceInline]
uint3 indexToCoordNp2(uint index) {
    uint x = index % P2;
    uint y = (index / P2) % P2;
    uint z = (index / (P2 * P2)) % P2;
    return uint3(x, y, z);
}

[ForceInline]
uint coordToIndexNp2(uint3 coord) {
    return (P2 * P2) * coord.z + P2 * coord.y + coord.x;
}

// 内部座標 (-1 .. N) から共有メモリ outputs_s への読み書き
[ForceInline]
half get_output_s(int3 coord) {
    uint3 target_coord_np2 = uint3(clamp(coord + 1, 0, int(P2 - 1)));
    return outputs_s[coordToIndexNp2(target_coord_np2)];
}

[ForceInline]
void set_output_s(int3 coord, half val) {
    uint3 target_coord_np2 = uint3(clamp(coord + 1, 0, int(P2 - 1)));
    outputs_s[coordToIndexNp2(target_coord_np2)] = val;
}

// 内部座標 (-1 .. N) から共有メモリ シグネチャへの読み込み
[ForceInline]
half4 get_sig_pre(int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_pre_map_s[coordToIndexNp2(coord_np2)];
}

[ForceInline]
half4 get_sig_post(int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_post_map_s[coordToIndexNp2(coord_np2)];
}

// half2パック配列用のインデックス変換ヘルパー
[ForceInline]
uint2 idxNp2h2x_to_indexNp2_01(uint idx_np2h2x) {
    return uint2(idx_np2h2x << 1, (idx_np2h2x << 1) | 1);
}

[ForceInline]
uint3 idxNp2h2_to_coordNp2(uint2 index_np2h2) {
    uint index_np2 = (index_np2h2.x << 1) | index_np2h2.y;
    return indexToCoordNp2(index_np2);
}

[ForceInline]
bool is_internal(uint2 index_np2h2) {
    uint3 coord_np2 = idxNp2h2_to_coordNp2(index_np2h2);
    return ((((coord_np2.x - 1) | (coord_np2.y - 1) | (coord_np2.z - 1)) & ~MASK) == 0);
}

void merge_outputs_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint index_np2h2_x) {
    uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(index_np2h2_x);
    half2 current_out = half2(outputs_s[idx_np2_01.x], outputs_s[idx_np2_01.y]);
    half2 memb_val = membrane_all[group_id_x * TOTAL_NP2H2 + index_np2h2_x];
    outputs_s[idx_np2_01.x] = is_internal(uint2(index_np2h2_x, 0)) ? current_out.x : memb_val.x;
    outputs_s[idx_np2_01.y] = is_internal(uint2(index_np2h2_x, 1)) ? current_out.y : memb_val.y;
}

void set_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint3 coord_np2, half val) {
    uint idx_np2 = coordToIndexNp2(coord_np2);
    uint2 idx_np2h2 = uint2(idx_np2 >> 1, idx_np2 & 1);
    half2 current = membrane_all[group_id_x * TOTAL_NP2H2 + idx_np2h2.x];
    membrane_all[group_id_x * TOTAL_NP2H2 + idx_np2h2.x] = (idx_np2h2.y == 0)
        ? half2(val, current.y)
        : half2(current.x, val);
}

// PCG乱数ユーティリティ
uint pcg_hash(uint input) {
    uint state = input * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

half2 rand_half2(uint input) {
    uint h1 = pcg_hash(input);
    uint h2 = pcg_hash(h1 + 1u);
    return half2(
        half(float(h1) / 4294967295.0),
        half(float(h2) / 4294967295.0)
    );
}

// =============================================================================
// 6. シミュレーション各フェーズのインライン補助関数
// =============================================================================

// シナプス初期重みをプリ・ポストのシグネチャ内積から計算
[ForceInline]
void init_synapse_weights(
    uint3 groupThreadID,
    uint groupIndex,
    Link27thParams link27th_params,
    inout SynapseData synapse_data
) {
    [unroll]
    for (uint idx_ui7 = 0; idx_ui7 < 7; idx_ui7++) {
        synapse_data.set_tags_idx_ui7(idx_ui7, 0u);
    }

    half4 my_post = get_sig_post(groupThreadID);

    // 近傍 3x3x3 シナプス重みの初期化
    [unroll]
    for (int dz = -1; dz <= 1; dz++) {
        [unroll]
        for (int dy = -1; dy <= 1; dy++) {
            [unroll]
            for (int dx = -1; dx <= 1; dx++) {
                int3 offset = int3(dx, dy, dz);
                half4 target_sig_pre = get_sig_pre(int3(groupThreadID) + offset);
                half weight = saturate(0.25h * dot(my_post, target_sig_pre));
                synapse_data.set_weights(offset, weight);
            }
        }
    }

    // 28番目（長距離リンク）シナプス重みの初期化
    uint3 sig_27th_coord = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
    half4 sig_27th_pre = get_sig_pre(sig_27th_coord);
    half weight_27th = saturate(0.25h * dot(my_post, sig_27th_pre));
    synapse_data.set_weights_27th(weight_27th);
}

// ドーパミン・睡眠シグナルのWave横断リダクション集計
[ForceInline]
void reduce_neuromodulators(
    uint groupIndex,
    half my_output,
    half my_dopamine_map,
    half my_sleep_map
) {
#if USE_DOPAMINE || USE_SLEEP
    half my_dopamine = abs(my_output) * my_dopamine_map;
    half my_sleep    = abs(my_output) * my_sleep_map;

    half dopamine_wave_sum = WaveActiveSum(my_dopamine);
    half sleep_wave_sum    = WaveActiveSum(my_sleep);

    uint waveIndex = groupIndex / WaveGetLaneCount();
    if (WaveIsFirstLane()) {
        dopamine_wave_sums[waveIndex] = dopamine_wave_sum;
        sleep_wave_sums[waveIndex]    = sleep_wave_sum;
    }

    GroupMemoryBarrierWithGroupSync();

    uint num_waves = (TOTAL_N + WaveGetLaneCount() - 1) / WaveGetLaneCount();
    half local_dopamine_sum = (groupIndex < num_waves) ? dopamine_wave_sums[groupIndex] : 0.0h;
    half local_sleep_sum    = (groupIndex < num_waves) ? sleep_wave_sums[groupIndex]    : 0.0h;

    half final_dopamine_sum = WaveActiveSum(local_dopamine_sum);
    half final_sleep_sum    = saturate(WaveActiveSum(local_sleep_sum));

    if (groupIndex == 0) {
        my_dopamine_sum = final_dopamine_sum * half(ENABLE_DOPAMINE);
        my_sleep_sum    = saturate(final_sleep_sum * half(ENABLE_SLEEP));
    }
    GroupMemoryBarrierWithGroupSync();
#endif
}

// 太陽光サイクル・発電コスト・エネルギー収支の更新と感覚入力膜への書き込み (Thread 0 が実行)
[ForceInline]
void update_solar_energy_and_sensors(uint inner_step) {
    float current_sunlight = saturate(sinpi(inner_step * (1.0 / SUN_CYCLE_PERIOD)));
    half generator_power = saturate(get_output_s(inout_params_s.gen_pos_out) - get_output_s(inout_params_s.gen_neg_out));

    if (my_energy_s > 0.0f) {
        my_energy_s -= METABOLIC_COST;
        my_energy_s -= float(abs(generator_power)) * GEN_COST_RATE;
        my_energy_s += SOLAR_GAIN_RATE * abs(generator_power) * current_sunlight;
        my_energy_s = saturate(my_energy_s);
    } else {
        my_energy_s = 0.0f;
    }

    // 外周膜の感覚セルへ現在のエネルギーと日照量を書き込む
    set_output_s(inout_params_s.battery_in, half(my_energy_s));
    set_output_s(inout_params_s.light_in, half(current_sunlight));
}

// =============================================================================
// 7. メインコンピュートシェーダー (1 Group = 1 Agent, 1 Thread = 1 Neuron)
// =============================================================================
[WaveSize(32)]
[shader("compute")]
[numthreads(N, N, N)]
void computeMain(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    StructuredBuffer<half> dopamine_map_all,
    StructuredBuffer<half> sleep_map_all,
    StructuredBuffer<uint> inhib_map_all,
    RWStructuredBuffer<half2> global_poutputs_all,
    RWStructuredBuffer<half2> membrane_all,
    RWStructuredBuffer<uint> synapse_tag_all,
    StructuredBuffer<half4> signature_pre_map_np2,
    StructuredBuffer<half4> signature_post_map_np2,
    uniform ResourceParamsAll resource_params_all,
    uniform Link27thParamsAll link27th_params_all,
    uniform LearningParamsAll learning_params_all,
    uniform InoutParamsFiAll inout_params_fi_all,
    RWStructuredBuffer<half> dopamine_sum,
    RWStructuredBuffer<half> sleep_sum,
    RWStructuredBuffer<float> mutation_rate_all,
    uniform half dt,
    uniform uint step
)
{
    uint agent_id = groupID.x;

    // --- Step 1: 共有メモリと個体パラメータの初期化 ---
    if (groupIndex == 0) {
        my_energy_s = INITIAL_ENERGY;
        inout_params_s = InoutParams::load_face_index(
            inout_params_fi_all.light_in_fi[agent_id],
            inout_params_fi_all.battery_in_fi[agent_id],
            inout_params_fi_all.gen_neg_out_fi[agent_id],
            inout_params_fi_all.gen_pos_out_fi[agent_id]
        );
    }

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        sig_pre_map_s[idx_np2]  = signature_pre_map_np2[agent_id * TOTAL_NP2 + idx_np2];
        sig_post_map_s[idx_np2] = signature_post_map_np2[agent_id * TOTAL_NP2 + idx_np2];
    }
    GroupMemoryBarrierWithGroupSync();

#if USE_DOPAMINE
    half my_dopamine_map = dopamine_map_all[TOTAL_N * agent_id + groupIndex];
#else
    half my_dopamine_map = 0.0h;
#endif

#if USE_SLEEP
    half my_sleep_map = sleep_map_all[TOTAL_N * agent_id + groupIndex];
#else
    half my_sleep_map = 0.0h;
#endif

    uint packed_val = inhib_map_all[(agent_id * INHIB_STRIDE) + (groupIndex >> 5)];
    bool is_inhib   = bool((packed_val >> (groupIndex & 31)) & 1);
    int  my_inhib   = is_inhib ? -1 : 1;

    my_dopamine_sum = 0.0h;
    my_sleep_sum    = 0.0h;

    ResourceParams resource_params;
    resource_params.base_output = resource_params_all.base_output[agent_id];
    resource_params.beta        = resource_params_all.beta[agent_id];
    resource_params.k_refill    = resource_params_all.k_refill[agent_id];

    Link27thParams link27th_params;
    link27th_params.bias       = link27th_params_all.bias[agent_id];
    link27th_params.multiplier = link27th_params_all.multiplier[agent_id];

    LearningParams learning_params;
#if USE_LEARNING
    learning_params.forget_rate        = learning_params_all.forget_rate[agent_id];
    learning_params.learning_rate      = learning_params_all.learning_rate[agent_id];
    learning_params.learning_threshold = learning_params_all.learning_threshold[agent_id];
    learning_params.tag_decay          = learning_params_all.tag_decay[agent_id];
#else
    learning_params.forget_rate        = 0.0h;
    learning_params.learning_rate      = 0.0h;
    learning_params.learning_threshold = 0.0h;
    learning_params.tag_decay          = 0.0h;
#endif

    // --- Step 2: シナプス重みとニューロン初期状態のセットアップ ---
    SynapseData synapse_data;
    init_synapse_weights(groupThreadID, groupIndex, link27th_params, synapse_data);

    half R = 1.0h;

    // 外周膜は 0.0h、内部ニューロンは 0.5h で初期化（oneSim.py と完全一致）
    [unroll]
    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        outputs_s[idx_np2] = 0.0h;
    }
    GroupMemoryBarrierWithGroupSync();

    set_output_s(groupThreadID, 0.5h);
    GroupMemoryBarrierWithGroupSync();

    uint3 coord_27th = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);

    // --- Step 3: 1000ステップの神経・環境ダイナミクスループ ---
    for (uint inner_step = 0; inner_step < INNER_STEPS; inner_step++) {
        half net = 0.0h;

        // 3.1 近傍 3x3x3 シナプスからの入力集計（および生涯学習）
        [unroll]
        for (int dz = -1; dz <= 1; dz++) {
            [unroll]
            for (int dy = -1; dy <= 1; dy++) {
                [unroll]
                for (int dx = -1; dx <= 1; dx++) {
                    int3 offset = int3(dx, dy, dz);
                    half my_weight = synapse_data.get_weight(offset);
                    half delta_net = get_output_s(groupThreadID + offset) * my_weight;
                    net += delta_net;

#if USE_LEARNING
                    half tag = half(synapse_data.get_tag(offset));
                    tag = saturate((tag + saturate(abs(delta_net))) * (1.0h - learning_params.tag_decay));
                    half bistable = my_weight * (1.0h - my_weight) * (my_weight - learning_params.learning_threshold);
                    half delta_weight = half(ENABLE_LEARNING) * learning_params.forget_rate * (my_dopamine_sum * tag + learning_params.learning_rate * bistable);
                    synapse_data.set_tags(offset, tag);
                    synapse_data.set_weights(offset, clamp(my_weight + delta_weight, 0.0h, 1.0h));
#endif
                }
            }
        }

        // 3.2 長距離（27th）シナプスからの入力集計（および生涯学習）
        half my_weight_27th = synapse_data.get_weight_27th();
        half delta_net_27th = get_output_s(coord_27th) * my_weight_27th;
        net += delta_net_27th;

#if USE_LEARNING
        half tag_27th = half(synapse_data.get_tag_27th());
        tag_27th = saturate((tag_27th + saturate(abs(delta_net_27th))) * (1.0h - learning_params.tag_decay));
        half bistable_27th = my_weight_27th * (1.0h - my_weight_27th) * (my_weight_27th - learning_params.learning_threshold);
        half delta_weight_27th = half(ENABLE_LEARNING) * learning_params.learning_rate * (my_dopamine_sum * tag_27th + learning_params.learning_rate * bistable_27th);
        synapse_data.set_tags_27th(tag_27th);
        synapse_data.set_weights_27th(clamp(my_weight_27th + delta_weight_27th, 0.0h, 1.0h));
#endif

        // 3.3 ニューロン発火率・出力の計算とシナプス資源 R の更新
        half scaled_net  = clamp(net * resource_params.beta, -20.0h, 20.0h);
        half output_rate = min(1.0h, resource_params.base_output * exp2(scaled_net));
        half my_output   = (1.0h - my_sleep_sum) * half(my_inhib) * output_rate * R;

        // Warp間の競合を防ぐため、全スレッドの読み取り完了を待ってから出力を書き込む
        GroupMemoryBarrierWithGroupSync();
        set_output_s(groupThreadID, my_output);
        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_params.k_refill);

        // 3.4 神経修飾物質（ドーパミン・睡眠）の全体集計
        reduce_neuromodulators(groupIndex, my_output, my_dopamine_map, my_sleep_map);

        // 3.5 太陽光発電・代謝コスト計算と感覚入力の更新
        if (groupIndex == 0) {
            update_solar_energy_and_sensors(inner_step);
        }
        GroupMemoryBarrierWithGroupSync();
    }

    // --- Step 4: 最終状態のグローバルバッファへの書き戻し ---
    if (groupIndex == 0) {
        dopamine_sum[agent_id]      = my_dopamine_sum;
        sleep_sum[agent_id]         = my_sleep_sum;
        mutation_rate_all[agent_id] = saturate(my_energy_s);
    }

    for (uint idx_h2 = groupIndex; idx_h2 < TOTAL_NP2H2; idx_h2 += TOTAL_N) {
        uint2 idx01   = idxNp2h2x_to_indexNp2_01(idx_h2);
        half2 out_pair = half2(outputs_s[idx01.x], outputs_s[idx01.y]);
        membrane_all[agent_id * TOTAL_NP2H2 + idx_h2]        = out_pair;
        global_poutputs_all[agent_id * TOTAL_NP2H2 + idx_h2] = out_pair;
    }

    for (uint idx_ui7 = 0; idx_ui7 < 7; idx_ui7++) {
        synapse_tag_all[agent_id * (TOTAL_N * 7) + groupIndex * 7 + idx_ui7] = synapse_data.get_tag_idx_ui7(idx_ui7);
    }
}