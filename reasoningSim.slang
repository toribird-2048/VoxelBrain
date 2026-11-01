// =============================================================================
// 1. コンパイル時定数・デフォルト定義
//    （Python側の build_kernel 実行時には #define で上書きされます）
// =============================================================================
#ifndef DIM
#define DIM 2
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

#define NEUROMOD_NUM (4)

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

struct Link28thParams {
    uint multiplier;
    uint bias;
}

struct Link28thParamsAll {
    StructuredBuffer<uint> multiplier;
    StructuredBuffer<uint> bias;
}

#ifndef NUM_IN_PORTS
#define NUM_IN_PORTS 2
#endif
#ifndef NUM_OUT_PORTS
#define NUM_OUT_PORTS 2
#endif
#ifndef SPEED_GAIN
#define SPEED_GAIN 0.05f
#endif
#ifndef ROTATE_GAIN
#define ROTATE_GAIN 0.1f
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

    int3 get_in_coord(uint idx) {
        return faceIndex_to_coordIn(in_coords_fi[idx]);
    }

    int3 get_out_coord(uint idx) {
        return faceIndex_to_coordOut(out_coords_fi[idx]);
    }

    static InoutParamsFi load(uint agent_id, InoutParamsFiAll lpf_all) {
        InoutParamsFi p;
        p.in_coords_fi = lpf_all.in_ports_fi[agent_id];
        p.out_coords_fi = lpf_all.out_ports_fi[agent_id];
        return p;
    }
};

struct NeuromodParamsAll {
    StructuredBuffer<half4x4> neuromod_rel_matrix;
    StructuredBuffer<half4[NEUROMOD_NUM]> neuromod_weight_reaction;
    StructuredBuffer<half> diff;
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
}

// 各ニューロンが持つ28個のシナプス（近傍3x3x3=27個 ＋ 長距離27thリンク1個）
struct SynapseData {
    half weights[28];

    [ForceInline]
    static uint relCoordToSlot(int3 coord_rel) {
        return 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1);
    }

    // --- 近傍27シナプス (dx, dy, dz in -1..1) ---
    [ForceInline]
    half get_weight(int3 coord_rel) {
        return weights[relCoordToSlot(coord_rel)];
    }

    [mutating]
    [ForceInline]
    void set_weights(int3 coord_rel, half val) {
        weights[relCoordToSlot(coord_rel)] = val;
    }

    // --- インデックス直接指定 ---
    [ForceInline]
    half get_weight_idx(int idx) { return weights[idx]; }

    [mutating]
    [ForceInline]
    void set_weights_idx(int idx, half val) { weights[idx] = val; }

    // --- 長距離シナプス (スロット27) ---
    [ForceInline]
    half get_weight_27th() { return weights[27]; }

    [mutating]
    [ForceInline]
    void set_weights_27th(half val) { weights[27] = val; }
}

struct Half8All {
    StructuredBuffer<half4> hi_vec;
    StructuredBuffer<half4> lo_vec;
}

struct Half8 {
    half4 hi_vec;
    half4 lo_vec;

    static Half8 load(uint agent_id, Half8All h8_all) {
        Half8 h8;
        h8.hi_vec = h8_all.hi_vec[agent_id];
        h8.lo_vec = h8_all.lo_vec[agent_id];
        return h8;
    }
}

Half8 saturate(Half8 h8) {
    Half8 r;
    r.hi_vec = saturate(h8.hi_vec);
    r.lo_vec = saturate(h8.lo_vec);
    return r;
}

struct Half88 {
    half4 ri_row[8]; // right
    half4 le_row[8]; // left
}

Half88 saturate(Half88 h88) {
    Half88 r;
    for (uint i = 0; i < 8; i++) {
        r.le_row[i] = saturate(h88.le_row[i]);
        r.ri_row[i] = saturate(h88.ri_row[i]);
    }
    return r;
}

Half8 mul88x8(Half88 h88, Half8 h8) {
    half r[8];

    [unroll]
    for (uint i = 0; i < 8; i++) {
        r[i] = dot(h88.ri_row[i], h8.hi_vec) + dot(h88.le_row[i], h8.lo_vec);
    }

    Half8 result;
    result.hi_vec = half4(r[0], r[1], r[2], r[3]);
    result.lo_vec = half4(r[4], r[5], r[6], r[7]);

    return result;
}



// =============================================================================
// 4. グループ共有メモリ (1グループ = 1個体)
// =============================================================================
groupshared half  outputs_s[TOTAL_NP2];         // ニューロン出力＆外周感覚膜
groupshared half4 sig_pre_map_s[TOTAL_NP2];     // シナプス前シグネチャ
groupshared half4 sig_post_map_s[TOTAL_NP2];    // シナプス後シグネチャ

groupshared half4 neuromod_map_s[TOTAL_N][2]; // 神経修飾物質
groupshared NeuromodParams neuromod_params;

groupshared float my_energy_s; // 個体の現在エネルギー残量
groupshared InoutParamsFi inout_params_s;

groupshared float2 my_pos_s;
groupshared float my_angle_s;
groupshared float2 my_obj_s;


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
int3 indexToCoordNp2(uint index) {
    int x = int(index % P2) - 1;
    int y = int((index / P2) % P2) - 1;
    int z = int(index / (P2 * P2)) - 1;
    return int3(x, y, z);
}

[ForceInline]
uint coordToIndexNp2(int3 coord) {
    uint3 c = uint3(clamp(coord + 1, 0, int(P2 - 1)));
    return (P2 * P2) * c.z + P2 * c.y + c.x;
}

// 内部座標 (-1 .. N) から共有メモリ outputs_s への読み書き
[ForceInline]
half get_output_s(int3 coord) {
    return outputs_s[coordToIndexNp2(coord)];
}

[ForceInline]
void set_output_s(int3 coord, half val) {
    outputs_s[coordToIndexNp2(coord)] = val;
}

// 内部座標 (-1 .. N) から共有メモリ シグネチャへの読み込み
[ForceInline]
half4 get_sig_pre(int3 coord) {
    return sig_pre_map_s[coordToIndexNp2(coord)];
}

[ForceInline]
half4 get_sig_post(int3 coord) {
    return sig_post_map_s[coordToIndexNp2(coord)];
}

// half2パック配列用のインデックス変換ヘルパー
[ForceInline]
uint2 idxNp2h2x_to_indexNp2_01(uint idx_np2h2x) {
    return uint2(idx_np2h2x << 1, (idx_np2h2x << 1) | 1);
}

[ForceInline]
int3 idxNp2h2_to_coordNp2(uint2 index_np2h2) {
    uint index_np2 = (index_np2h2.x << 1) | index_np2h2.y;
    return indexToCoordNp2(index_np2);
}

[ForceInline]
bool is_internal(uint2 index_np2h2) {
    int3 coord = idxNp2h2_to_coordNp2(index_np2h2);
    return all(0 <= coord) && all(coord < int(N));
}

void merge_outputs_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint index_np2h2_x) {
    uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(index_np2h2_x);
    half2 current_out = half2(outputs_s[idx_np2_01.x], outputs_s[idx_np2_01.y]);
    half2 memb_val = membrane_all[group_id_x * TOTAL_NP2H2 + index_np2h2_x];
    outputs_s[idx_np2_01.x] = is_internal(uint2(index_np2h2_x, 0)) ? current_out.x : memb_val.x;
    outputs_s[idx_np2_01.y] = is_internal(uint2(index_np2h2_x, 1)) ? current_out.y : memb_val.y;
}

void set_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, int3 coord, half val) {
    uint idx_np2 = coordToIndexNp2(coord);
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

half rand_half(uint input) {
    uint h1 = pcg_hash(input);
    return half(float(h1) / 4294967295.0);
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
    Link28thParams link28th_params,
    inout SynapseData synapse_data
) {
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
    uint3 sig_27th_coord = indexToCoordN(groupIndex * link28th_params.multiplier + link28th_params.bias);
    half4 sig_27th_pre = get_sig_pre(sig_27th_coord);
    half weight_27th = saturate(0.25h * dot(my_post, sig_27th_pre));
    synapse_data.set_weights_27th(weight_27th);
}

// 太陽光サイクル・発電コスト・エネルギー収支の更新と感覚入力膜への書き込み (Thread 0 が実行)
[ForceInline]
void update_solar_energy_and_sensors(uint inner_step) {
    float current_sunlight = saturate(sinpi(inner_step * (1.0 / SUN_CYCLE_PERIOD)));
    
    // 出力スロット 0: gen_pos, 1: gen_neg, 2: speed_out, 3: rotate_out
    half generator_power = 0.0h;
    if (NUM_OUT_PORTS >= 2) {
        generator_power = saturate(get_output_s(inout_params_s.get_out_coord(0)) - get_output_s(inout_params_s.get_out_coord(1)));
    } else if (NUM_OUT_PORTS == 1) {
        generator_power = saturate(get_output_s(inout_params_s.get_out_coord(0)));
    }

    if (my_energy_s > 0.0f) {
        my_angle_s += (float)get_output_s(inout_params_s.get_out_coord(3)) * ROTATE_GAIN;
        float my_speed = (float)get_output_s(inout_params_s.get_out_coord(2)) * SPEED_GAIN;
        my_pos_s += float2(cos(my_angle_s), sin(my_angle_s)) * my_speed;
        my_pos_s = clamp(my_pos_s, -2.0, 2.0);

        float2 diff = my_pos_s - my_obj_s;
        float dist_dot = dot(diff, diff);

        // float energy_coefficient = 2.0 / (1.0 + 0.5 * dist_dot);
        float energy_coefficient = 1.0h;

        my_energy_s -= METABOLIC_COST;
        my_energy_s -= float(abs(generator_power)) * GEN_COST_RATE;
        my_energy_s += SOLAR_GAIN_RATE * abs(generator_power) * current_sunlight * energy_coefficient;
        my_energy_s = saturate(my_energy_s);
    } else {
        my_energy_s = 0.0f;
    }

    // 外周膜の感覚セルへ書き込む (スロット 0: sunlight, 1: battery)
    if (NUM_IN_PORTS >= 1) {
        set_output_s(inout_params_s.get_in_coord(0), half(current_sunlight));
    }
    if (NUM_IN_PORTS >= 2) {
        set_output_s(inout_params_s.get_in_coord(1), half(my_energy_s));
    }
}

half4 get_neuromod(uint3 center_coord, int3 coord_rel, uint step) {
    int3 target_coord = center_coord + coord_rel;
    bool is_inside = all(0 <= target_coord) && all(target_coord <= N - 1);
    return is_inside
        ? neuromod_map_s[coordToIndexN(uint3(target_coord))][step & 1u]
        : neuromod_map_s[coordToIndexN(center_coord)][step & 1u];
}

half4 get_idx_neuromod(uint idx, uint step) {
    return neuromod_map_s[idx][step & 1u];
}

void set_idx_neuromod(uint idx, uint step, half4 val) {
    neuromod_map_s[idx][step & 1u] = val;
}

void set_neuromod(uint3 center_coord, uint step, half4 val) {
    neuromod_map_s[coordToIndexN(center_coord)][step & 1u] = val;
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
                neighbor_sum += get_neuromod(center_coord, int3(dx, dy, dz), step);
            }
        }
    }
    half4 current_val = get_neuromod(center_coord, int3(0, 0, 0), step);
    return neighbor_sum - 27.0h * current_val;
}

// 1ステップ分のラプラシアン拡散 (N グリッド)
void diffuse_step_n(uint groupIndex, uint step, half diff) {
    const half dt = 1.0h / 54.0h;
    uint3 coord = indexToCoordN(groupIndex);
    half4 current_val = get_neuromod(coord, int3(0, 0, 0), step);
    half4 laplacian = compute_laplacian_n(coord, step);
    set_neuromod(coord, step + 1, current_val + (diff * laplacian) * dt);
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
    StructuredBuffer<uint> inhib_map_all,
    RWStructuredBuffer<half2> global_poutputs_all,
    RWStructuredBuffer<half2> membrane_all,
    StructuredBuffer<half4> signature_pre_map_np2,
    StructuredBuffer<half4> signature_post_map_np2,
    StructuredBuffer<half4> neuromod_gen_map,
    uniform ResourceParamsAll resource_params_all,
    uniform Link28thParamsAll link28th_params_all,
    uniform InoutParamsFiAll inout_params_fi_all,
    uniform NeuromodParamsAll neuromod_params_all,
    RWStructuredBuffer<float> mutation_rate_all,
    uniform half dt,
    uniform uint step
)
{
    uint agent_id = groupID.x;

    uint inner_step = 0u;

    // --- Step 1: 共有メモリと個体パラメータの初期化 ---
    if (groupIndex == 0) {
        neuromod_params = NeuromodParams.load(agent_id, neuromod_params_all);

        my_energy_s = INITIAL_ENERGY;
        my_pos_s = float2(0.0, 0.0);
        my_angle_s = 0.0;
        float obj_rand = 2 * (float)rand_half(12277 * step + 67 * agent_id);
        my_obj_s = float2(cospi(obj_rand), sinpi(obj_rand));
        inout_params_s = InoutParamsFi.load(agent_id, inout_params_fi_all);
    }

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        sig_pre_map_s[idx_np2]  = signature_pre_map_np2[agent_id * TOTAL_NP2 + idx_np2];
        sig_post_map_s[idx_np2] = signature_post_map_np2[agent_id * TOTAL_NP2 + idx_np2];
    }
    GroupMemoryBarrierWithGroupSync();

    set_neuromod(groupThreadID, 0u, 0.0h);
    set_neuromod(groupThreadID, 0u, 0.0h);

    uint packed_val = inhib_map_all[(agent_id * INHIB_STRIDE) + (groupIndex >> 5)];
    bool is_inhib   = bool((packed_val >> (groupIndex & 31)) & 1);
    int  my_inhib   = is_inhib ? -1 : 1;

    ResourceParams resource_params;
    resource_params.base_output = resource_params_all.base_output[agent_id];
    resource_params.beta        = resource_params_all.beta[agent_id];
    resource_params.k_refill    = resource_params_all.k_refill[agent_id];

    Link28thParams link28th_params;
    link28th_params.bias       = link28th_params_all.bias[agent_id];
    link28th_params.multiplier = link28th_params_all.multiplier[agent_id];

    // --- Step 2: シナプス重みとニューロン初期状態のセットアップ ---
    SynapseData synapse_data;
    init_synapse_weights(groupThreadID, groupIndex, link28th_params, synapse_data);

    half R = 1.0h;

    // 外周膜は 0.0h、内部ニューロンは 0.5h で初期化（oneSim.py と完全一致）
    [unroll]
    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        outputs_s[idx_np2] = 0.0h;
    }
    GroupMemoryBarrierWithGroupSync();

    set_output_s(groupThreadID, 0.5h);
    GroupMemoryBarrierWithGroupSync();

    uint3 coord_27th = indexToCoordN(groupIndex * link28th_params.multiplier + link28th_params.bias);

    half my_output = 0.0h;
    // --- Step 3: 1000ステップの神経・環境ダイナミクスループ ---
    for (uint inner_step = 0; inner_step < INNER_STEPS; inner_step++) {

        // 神経修飾物質の拡散、生成、反応
        diffuse_step_n(groupIndex, inner_step, neuromod_params.diff);
        GroupMemoryBarrierWithGroupSync();

        half4 cur_nm = get_idx_neuromod(groupIndex, inner_step + 1);
        cur_nm += my_output * neuromod_gen_map[agent_id * TOTAL_N + groupIndex];
        cur_nm = max(0.0h, mul(neuromod_params.neuromod_rel_matrix, cur_nm));
        set_idx_neuromod(groupIndex, inner_step + 1, cur_nm);

        GroupMemoryBarrierWithGroupSync();

        half net = 0.0h;
        // 近傍 3x3x3 シナプスからの入力集計（および生涯学習）
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
                    half4 neighbor_neuromod = get_neuromod(groupThreadID, offset, inner_step + 1);
                    half new_weight = 0;
                    for (uint i = 0; i < NEUROMOD_NUM; i++) {
                        new_weight += dot(
                            half4(cur_nm[i], neighbor_neuromod[i], my_weight, 1.0h),
                            neuromod_params.neuromod_weight_reaction[i]
                        );
                    }
                    synapse_data.set_weights(offset, saturate(new_weight));
                }
            }
        }

        // 長距離（27th）シナプスからの入力集計（および生涯学習）
        half my_weight_27th = synapse_data.get_weight_27th();
        half delta_net_27th = get_output_s(coord_27th) * my_weight_27th;
        net += delta_net_27th;

        // ニューロン発火率・出力の計算とシナプス資源 R の更新
        half scaled_net  = clamp(net * resource_params.beta, -20.0h, 20.0h);
        half output_rate = min(1.0h, resource_params.base_output * exp2(scaled_net));
        my_output   = half(my_inhib) * output_rate * R;

        // Warp間の競合を防ぐため、全スレッドの読み取り完了を待ってから出力を書き込む
        GroupMemoryBarrierWithGroupSync();
        set_output_s(groupThreadID, my_output);
        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_params.k_refill);

        // 3.5 太陽光発電・代謝コスト計算と感覚入力の更新
        if (groupIndex == 0) {
            update_solar_energy_and_sensors(inner_step);
        }
        GroupMemoryBarrierWithGroupSync();
    }

    // --- Step 4: 最終状態のグローバルバッファへの書き戻し ---
    if (groupIndex == 0) {
        mutation_rate_all[agent_id] = saturate(my_energy_s);
    }

    for (uint idx_h2 = groupIndex; idx_h2 < TOTAL_NP2H2; idx_h2 += TOTAL_N) {
        uint2 idx01   = idxNp2h2x_to_indexNp2_01(idx_h2);
        half2 out_pair = half2(outputs_s[idx01.x], outputs_s[idx01.y]);
        membrane_all[agent_id * TOTAL_NP2H2 + idx_h2]        = out_pair;
        global_poutputs_all[agent_id * TOTAL_NP2H2 + idx_h2] = out_pair;
    }
}