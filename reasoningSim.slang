#ifndef DIM
#error "Config.dim is not defined! Please pass 'dim' in compilation defines."
#endif

#define N (1 << DIM)
#define MASK (N - 1)

#define SHIFT_X (0)
#define SHIFT_Y (DIM)
#define SHIFT_Z (DIM * 2)

#define TOTAL_N (N * N * N)
#define P2 (N + 2)
#define TOTAL_NP2 ((N+2)*(N+2)*(N+2))
#define TOTAL_NP2H2 (TOTAL_NP2 >> 1) 

#define MAX_WAVE (64)

groupshared half outputs_s[TOTAL_NP2];
groupshared half4 sig_pre_map_s[TOTAL_NP2];
groupshared half4 sig_post_map_s[TOTAL_NP2];
groupshared half dopamine_wave_sums[MAX_WAVE];
groupshared half my_dopamine_sum;
groupshared half sleep_wave_sums[MAX_WAVE];
groupshared half my_sleep_sum;



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

struct SynapseData {
    half weights[28];
    half tags[28];

    [ForceInline]
    half get_weight(int3 coord_rel) {
        uint idx = 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + coord_rel.x + 1;
        return weights[idx];
    }

    [ForceInline]
    half get_tag(int3 coord_rel) {
        uint idx = 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + coord_rel.x + 1;
        return get_tag_idx(idx);
    }

    [ForceInline]
    half get_weight_idx(int idx) {
        return weights[idx];
    }

    [ForceInline]
    half get_tag_idx(int idx) {
        return tags[idx];
    }

    [ForceInline]
    uint get_tag_idx_ui7(int idx_ui7) {
        return pack_u8(uint4(
            uint(round(tags[idx_ui7 * 4] * 255.0h)),
            uint(round(tags[idx_ui7 * 4 + 1] * 255.0h)),
            uint(round(tags[idx_ui7 * 4 + 2] * 255.0h)),
            uint(round(tags[idx_ui7 * 4 + 3] * 255.0h))
        ));
    }

    [mutating]
    [ForceInline]
    void set_weights(int3 coord_rel, half val) {
        uint idx = 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + coord_rel.x + 1;
        set_weights_idx(idx, val);
    }

    [mutating]
    [ForceInline]
    void set_tags(int3 coord_rel, half val) {
        uint idx = 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + coord_rel.x + 1;
        set_tags_idx(idx, val);
    }

    [mutating]
    [ForceInline]
    void set_weights_idx(int idx, half val) {
        weights[idx] = val;
    }

    [mutating]
    [ForceInline]
    void set_tags_idx(int idx, half val) {
        tags[idx] = val;
    }

    [mutating]
    [ForceInline]
    void set_tags_idx_ui7(int idx_ui7, uint val) {
        half4 unpacked_val = half4(unpack_u8u32(val)) * (1.0h / 255.0h);
        tags[4 * idx_ui7] = unpacked_val.x;
        tags[4 * idx_ui7 + 1] = unpacked_val.y;
        tags[4 * idx_ui7 + 2] = unpacked_val.z;
        tags[4 * idx_ui7 + 3] = unpacked_val.w;
    }

    [ForceInline]
    half get_weight_27th() {
        return weights[27];
    }

    [ForceInline]
    half get_tag_27th() {
        return tags[27];
    }

    [mutating]
    [ForceInline]
    void set_weights_27th(half val) {
        weights[27] = val;
    }

    [mutating]
    [ForceInline]
    void set_tags_27th(half val) {
        tags[27] = val;
    }

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

half get_output_s(int3 coord) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    return outputs_s[index];
} 

void set_output_s(int3 coord, half val) {
    uint3 target_coord_np2 = coord + 1;
    uint index = coordToIndexNp2(target_coord_np2);
    outputs_s[index] = val;
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

void merge_outputs_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint index_np2h2_x) {
    uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(index_np2h2_x);
    half2 current_out = half2(
        outputs_s[idx_np2_01.x],
        outputs_s[idx_np2_01.y]
    );
    half2 memb_val = membrane_all[group_id_x * TOTAL_NP2H2 + index_np2h2_x];
    bool is_internal0 = is_internal(uint2(index_np2h2_x, 0));
    bool is_internal1 = is_internal(uint2(index_np2h2_x, 1));
    outputs_s[idx_np2_01.x] = is_internal0 ? current_out.x : memb_val.x;
    outputs_s[idx_np2_01.y] = is_internal1 ? current_out.y : memb_val.y;
}

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

void set_membrane(uint group_id_x, RWStructuredBuffer<half2> membrane_all, uint3 coord_np2, half val) {
    uint idx_np2 = coordToIndexNp2(coord_np2);
    uint2 idx_np2h2 = uint2(idx_np2 >> 1, idx_np2 & 1);
    half2 current = membrane_all[group_id_x * TOTAL_NP2H2 + idx_np2h2.x];
    membrane_all[group_id_x * TOTAL_NP2H2 + (idx_np2h2.x)] = (idx_np2h2.y == 0)
        ? half2(val, current.y)
        : half2(current.x, val);
}

half4 get_sig_pre(int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_pre_map_s[coordToIndexNp2(coord_np2)];
}

half4 get_sig_post(int3 coord) {
    uint3 coord_np2 = uint3(coord + 1);
    return sig_post_map_s[coordToIndexNp2(coord_np2)];
}

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
    RWStructuredBuffer<half> dopamine_sum,
    RWStructuredBuffer<half> sleep_sum,

    
    RWStructuredBuffer<float2> object_pos_all,
    RWStructuredBuffer<float2> position_all,
    RWStructuredBuffer<uint> bool_passed_all,
    RWStructuredBuffer<uint> goal_count_all,
    uniform half dt, // second
    uniform uint step
)
{
    uint agent_id = groupID.x;
    float world_size = 100.0h;
    float2 my_pos = 0.0h;
    float2 my_obj_pos = (-1.0h + 2.0h * rand_half2(agent_id * 10007u + 1u)) * world_size;
    bool is_me_passed = false;

    

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += TOTAL_N) {
        sig_pre_map_s[idx_np2] = signature_pre_map_np2[groupID.x * TOTAL_NP2 + idx_np2];
        sig_post_map_s[idx_np2] = signature_post_map_np2[groupID.x * TOTAL_NP2 + idx_np2];
    }

    GroupMemoryBarrierWithGroupSync();

    SynapseData synapse_data;
    [unroll]
    for (uint idx_ui7 = 0; idx_ui7 < 7; idx_ui7++) {
        synapse_data.set_tags_idx_ui7(idx_ui7, 0u);
    }

    half my_dopamine_map = dopamine_map_all[N * N * N * groupID.x + groupIndex];
    half my_sleep_map = sleep_map_all[N * N * N * groupID.x + groupIndex];
    uint packed_val = inhib_map_all[(groupID.x * 16) + (groupIndex >> 5)];
    bool is_inhib = bool((packed_val >> (groupIndex & 31)) & 1);
    int my_inhib = is_inhib ? -1 : 1;


    my_dopamine_sum = 0.0h;
    my_sleep_sum = 0.0h;

    ResourceParams resource_params;
    resource_params.base_output = resource_params_all.base_output[groupID.x];
    resource_params.beta = resource_params_all.beta[groupID.x];
    resource_params.k_refill = resource_params_all.k_refill[groupID.x];

    Link27thParams link27th_params;
    link27th_params.bias = link27th_params_all.bias[groupID.x];
    link27th_params.multiplier = link27th_params_all.multiplier[groupID.x];

    LearningParams learning_params;
    learning_params.forget_rate = learning_params_all.forget_rate[groupID.x];
    learning_params.learning_rate = learning_params_all.learning_rate[groupID.x];
    learning_params.learning_threshold = learning_params_all.learning_threshold[groupID.x];
    learning_params.tag_decay = learning_params_all.tag_decay[groupID.x];

    uint my_goal_count = 0;
    
    half4 my_post = get_sig_post(groupThreadID);
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
                half4 target_sig_pre = get_sig_pre(target_sig_coord);
                half val = saturate(0.25h * dot(my_post, target_sig_pre));
                synapse_data.set_weights(int3(dx, dy, dz), val);
            }
        }
    }
    uint3 sig_27th_coord = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
    half4 sig_27th_pre = get_sig_pre(sig_27th_coord);
    half val_27th = saturate(0.25h * dot(my_post, sig_27th_pre));
    synapse_data.set_weights_27th(val_27th);
    
    half R = 1.0h;

    [unroll]
    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += N * N * N) {
        outputs_s[idx_np2] = 0.5h;
    }
    GroupMemoryBarrierWithGroupSync();

    [unroll]
    for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_NP2H2; idx_np2h2 += N * N * N) {
        merge_outputs_membrane(groupID.x, membrane_all, idx_np2h2);
    }

    GroupMemoryBarrierWithGroupSync();

    
    for (uint inner_step = 0; inner_step < 1000; inner_step++) {
        half net = 0.0h;
        [unroll]
        for (int dz = -1; dz <= 1; dz++) {
            [unroll]
            for (int dy = -1; dy <= 1; dy++) {
                [unroll]
                for (int dx = -1; dx <= 1; dx++) {
                    half my_weight = synapse_data.get_weight(int3(dx, dy, dz));
                    half tag = half(synapse_data.get_tag(int3(dx, dy, dz)));
                    half delta_net = get_output_s(groupThreadID + int3(dx, dy, dz)) * my_weight;
                    net += delta_net;
                    tag = saturate((tag + saturate(abs(delta_net))) * (1.0h - learning_params.tag_decay));

                    half delta_weight = learning_params.learning_rate * (my_dopamine_sum * tag + learning_params.learning_rate * my_weight * (1.0h - my_weight) * (my_weight - learning_params.learning_threshold));

                    synapse_data.set_tags(int3(dx, dy, dz), tag);
                    synapse_data.set_weights(int3(dx, dy, dz), my_weight + delta_weight);
                }
            }
        }
        uint3 coord_27th = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
        half my_weight_27th = synapse_data.get_weight_27th();
        half tag_27th = half(synapse_data.get_tag_27th());
        half delta_net = get_output_s(coord_27th) * my_weight_27th;
        net += delta_net;

        tag_27th = saturate((tag_27th + saturate(abs(delta_net))) * (1.0h - learning_params.tag_decay));

        half delta_weight_27th = learning_params.learning_rate * (my_dopamine_sum * tag_27th + learning_params.learning_rate * my_weight_27th * (1.0h - my_weight_27th) * (my_weight_27th - learning_params.learning_threshold));
        synapse_data.set_tags_27th(tag_27th);
        synapse_data.set_weights_27th(my_weight_27th + delta_weight_27th);

        half output_rate = min(1.0h, resource_params.base_output * exp2(net * resource_params.beta));

        half my_output = (1 - my_sleep_sum) * half(my_inhib) * output_rate * R;

        set_output_s(groupThreadID, my_output);

        GroupMemoryBarrierWithGroupSync();

        R = saturate(R - output_rate * R + resource_params.k_refill);

        half my_dopamine = abs(my_output) * my_dopamine_map;
        half my_sleep = abs(my_output) * my_sleep_map;

        half dopamine_wave_sum = WaveActiveSum(my_dopamine);
        half sleep_wave_sum = WaveActiveSum(my_sleep);

        uint waveIndex = groupIndex / WaveGetLaneCount();
        if (WaveIsFirstLane()) {
            dopamine_wave_sums[waveIndex] = dopamine_wave_sum;
            sleep_wave_sums[waveIndex] = sleep_wave_sum;
        }

        GroupMemoryBarrierWithGroupSync();

        uint num_waves = TOTAL_N / WaveGetLaneCount();
        half local_dopamine_sum = 0.0h;
        half local_sleep_sum = 0.0h;

        if (groupIndex < num_waves) {
            local_dopamine_sum = dopamine_wave_sums[groupIndex];
            local_sleep_sum = sleep_wave_sums[groupIndex];
        }

        half final_dopamine_sum = WaveActiveSum(local_dopamine_sum);
        half final_sleep_sum = saturate(WaveActiveSum(local_sleep_sum));

        if (groupIndex == 0) {
            my_dopamine_sum = final_dopamine_sum;
            my_sleep_sum = final_sleep_sum;
        }












        if (groupIndex == 0) {

            half2 speed = 10 * half2(
                get_output_s(uint3(3, 2, 1)) - get_output_s(uint3(1, 2, 1)),
                get_output_s(uint3(2, 3, 1)) - get_output_s(uint3(2, 1, 1))
            );
            
            my_pos = clamp(my_pos + speed * dt, -100.0h, 100.0h);

            float2 diff = my_pos - my_obj_pos;

            half K = 100.0h;

            float2 diff_thoreshold = float2(5.0h, 5.0h);

            float2 norm_threshold = diff_thoreshold / (diff_thoreshold + K);

            float2 normalized_diff = diff / (abs(diff) + K);

            int2 diff_sign = int2(
                normalized_diff.x >= 0 ? 1 : -1,
                normalized_diff.y >= 0 ? 1 : -1
            );

            float2 normalized_diff_abs = abs(normalized_diff);

            my_obj_pos = normalized_diff_abs.x <= norm_threshold.x && normalized_diff_abs.y <= norm_threshold.y
                ? clamp((- 1 + 2 * rand_half2(agent_id + step * 10000u + inner_step * 13u)) * world_size, -world_size, world_size)
                : my_obj_pos;

            my_goal_count += (normalized_diff_abs.x <= norm_threshold.x && normalized_diff_abs.y <= norm_threshold.y) ? 1 : 0;

            set_output_s(uint3(4 + diff_sign.x, 1, 4), half(normalized_diff_abs.x));
            set_output_s(uint3(4, 1, 4 + diff_sign.y), half(normalized_diff_abs.y));
        }
    GroupMemoryBarrierWithGroupSync();
    }






    if (groupIndex == 0) {
        dopamine_sum[groupID.x] = my_dopamine_sum;
        sleep_sum[groupID.x] = my_sleep_sum;

        position_all[agent_id] = my_pos;
        object_pos_all[agent_id] = my_obj_pos;
        goal_count_all[agent_id] = my_goal_count;
        bool_passed_all[agent_id] = my_goal_count >= 1 ? 1 : 0;
    }

    for (uint idx_h2 = groupIndex; idx_h2 < TOTAL_NP2H2; idx_h2 += TOTAL_N) {
        uint2 idx01 = idxNp2h2x_to_indexNp2_01(idx_h2);
        membrane_all[groupID.x * TOTAL_NP2H2 + idx_h2] = half2(
            outputs_s[idx01.x],
            outputs_s[idx01.y]
        );
    }

    if (groupIndex < TOTAL_NP2H2) {
            uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(groupIndex);
            global_poutputs_all[TOTAL_NP2H2 * groupID.x + groupIndex] = half2(
            outputs_s[idx_np2_01.x],
            outputs_s[idx_np2_01.y]
            );
        }

    for (uint idx_ui7 = 0; idx_ui7 < 7; idx_ui7++) {
        synapse_tag_all[groupID.x * (TOTAL_N * 7) + groupIndex * 7 + idx_ui7] = synapse_data.get_tag_idx_ui7(idx_ui7);
    }
}