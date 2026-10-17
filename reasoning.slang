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

groupshared half outputs_s[(N + 2) * (N + 2) * (N + 2)];
groupshared half dopamine_map[N * N * N];
groupshared half sleep_map[N * N * N];
groupshared int inhib_map[N * N * N];
groupshared half dopamine_wave_sums[MAX_WAVE];
groupshared half my_dopamine_sum;
groupshared half sleep_wave_sums[MAX_WAVE];
groupshared half my_sleep_sum;


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

half get_weight(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord, int3 coord_rel) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    return weights[group_id_x * (TOTAL_N * 28) + weight_index];
}

half get_weight_27th(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    return weights[group_id_x * (TOTAL_N * 28) + weight_index];
}

void set_weight(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord, int3 coord_rel, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    weights[group_id_x * (TOTAL_N * 28) + weight_index] = val;
}

void set_weight_27th(uint group_id_x, RWStructuredBuffer<half> weights, int3 center_coord, half val) {
    uint weight_index = uint(coordToIndexN(center_coord) * 28 + 27);
    weights[group_id_x * (TOTAL_N * 28) + weight_index] = val;
}

half get_synapse_tag(uint group_id_x, RWStructuredBuffer<half> tags, int3 center_coord, int3 coord_rel) {
    uint tag_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    return tags[group_id_x * (TOTAL_N * 28) + tag_index];
}

half get_synapse_tag_27th(uint group_id_x, RWStructuredBuffer<half> tags, int3 center_coord) {
    uint tag_index = uint(coordToIndexN(center_coord) * 28 + 27);
    return tags[group_id_x * (TOTAL_N * 28) + tag_index];
}

void set_synapse_tag(uint group_id_x, RWStructuredBuffer<half> tags, int3 center_coord, int3 coord_rel, half val) {
    uint tag_index = uint(coordToIndexN(center_coord) * 28 + 9 * (coord_rel.z + 1) + 3 * (coord_rel.y + 1) + (coord_rel.x + 1));
    tags[group_id_x * (TOTAL_N * 28) + tag_index] = val;
}

void set_synapse_tag_27th(uint group_id_x, RWStructuredBuffer<half> tags, int3 center_coord, half val) {
    uint tag_index = uint(coordToIndexN(center_coord) * 28 + 27);
    tags[group_id_x * (TOTAL_N * 28) + tag_index] = val;
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

void merge_outputs_membrane(uint group_id_x, StructuredBuffer<half2> membrane_all, uint index_np2h2_x) {
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

[shader("compute")]
[numthreads(N, N, N)]
void main(
    uint3 groupThreadID: SV_GroupThreadID,
    uint groupIndex: SV_GroupIndex,
    uint3 groupID: SV_GroupID,
    StructuredBuffer<half> dopamine_map_all,
    StructuredBuffer<half> sleep_map_all,
    StructuredBuffer<int> inhib_map_all,
    RWStructuredBuffer<half> weights_map_all,
    RWStructuredBuffer<half2> global_poutputs_all,
    StructuredBuffer<half2> membrane_all,
    RWStructuredBuffer<half> synapse_tag_all,
    uniform ResourceParamsAll resource_params_all,
    uniform Link27thParamsAll link27th_params_all,
    uniform LearningParamsAll learning_params_all,
    RWStructuredBuffer<half> dopamine_sum,
    RWStructuredBuffer<half> sleep_sum
)
{
    dopamine_map[groupIndex] = dopamine_map_all[N * N * N * groupID.x + groupIndex];
    sleep_map[groupIndex] = sleep_map_all[N * N * N * groupID.x + groupIndex];
    int my_inhib = inhib_map_all[N * N * N * groupID.x + groupIndex];

    my_dopamine_sum = dopamine_sum[groupID.x];
    my_sleep_sum = sleep_sum[groupID.x];

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

    half R = 1.0h;
    uint tag = 0;

    for (uint idx_np2 = groupIndex; idx_np2 < TOTAL_NP2; idx_np2 += N * N * N) {
        outputs_s[idx_np2] = 0.5h;
    }

    GroupMemoryBarrierWithGroupSync();

    half net = 0.0h;
    for (uint idx_np2h2 = groupIndex; idx_np2h2 < TOTAL_NP2H2; idx_np2h2 += N * N * N) {
        merge_outputs_membrane(groupID.x, membrane_all, idx_np2h2);
    }
    for (int dz = -1; dz <= 1; dz++) {
        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                half my_weight = get_weight(groupID.x, weights_map_all, groupThreadID, int3(dx, dy, dz));
                half tag = get_synapse_tag(groupID.x, synapse_tag_all, groupThreadID, int3(dx, dy, dz));
                half delta_net = get_output_s(groupThreadID + int3(dx, dy, dz)) * my_weight;
                net += delta_net;
                tag = saturate((tag + saturate(abs(delta_net))) * (1.0h - learning_params.tag_decay));

                half delta_weight = learning_params.learning_rate * (my_dopamine_sum * tag + learning_params.learning_rate * my_weight * (1.0h - my_weight) * (my_weight - learning_params.learning_threshold));

                set_synapse_tag(groupID.x, synapse_tag_all, groupThreadID, int3(dx, dy, dz), tag);
                set_weight(groupID.x, weights_map_all, groupThreadID, int(dx, dy, dz), my_weight);
            }
        }
    }
    uint3 coord_27th = indexToCoordN(groupIndex * link27th_params.multiplier + link27th_params.bias);
    half my_weight_27th = get_weight_27th(groupID.x, weights_map_all, groupThreadID);
    half tag_27th = get_synapse_tag(groupID.x, synapse_tag_all, groupThreadID);
    half delta_net = get_output_s(coord_27th) * my_weight_27th;
    net += delta_net;

    tag_27th = saturate((tag_27th + saturate(abs(delta_net))) * (1.0h - learning_params.tag_decay));

    half delta_weight = learning_params.learning_rate * (my_dopamine_sum * tag_27th + learning_params.learning_rate * my_weight_27th * (1.0h - my_weight_27th) * (my_weight_27th - learning_params.learning_threshold));
    set_synapse_tag_27th(groupID.x, synapse_tag_all, groupThreadID, tag_27th);
    set_weight_27th(groupID.x, weights_map_all, groupThreadID, my_weight_27th);

    half output_rate = min(1.0h, resource_params.base_output * exp2(net * resource_params.beta));

    GroupMemoryBarrierWithGroupSync();

    set_output_s(groupThreadID, (1 - my_sleep_sum) * half(my_inhib) * output_rate * R);

    GroupMemoryBarrierWithGroupSync();

    R = saturate(R - output_rate * R + resource_params.k_refill);

    for (uint idx_np2h2x = groupIndex; idx_np2h2x < TOTAL_NP2H2; idx_np2h2x += TOTAL_NP2H2) {
        uint2 idx_np2_01 = idxNp2h2x_to_indexNp2_01(idx_np2h2x);
        global_poutputs_all[TOTAL_NP2H2 * groupID.x + idx_np2h2x] = half2(
        outputs_s[idx_np2_01.x],
        outputs_s[idx_np2_01.y]
        );
    }

    half my_dopamine = abs(get_output_s(groupThreadID)) * dopamine_map[groupIndex];
    half my_sleep = abs(get_output_s(groupThreadID)) * sleep_map[groupIndex];

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
        my_dopamine_sum[groupID.x] = final_dopamine_sum;
        my_sleep_sum[groupID.x] = final_sleep_sum;
    }
}