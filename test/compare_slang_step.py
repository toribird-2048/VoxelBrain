import os
import sys
import numpy as np
import slangpy as spy

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import sim_config
def get_default_inout_fi(dim: int) -> dict[str, np.ndarray]:
    in_defaults = np.zeros((sim_config.NUM_IN_PORTS, 3), dtype=np.int32)
    out_defaults = np.zeros((sim_config.NUM_OUT_PORTS, 3), dtype=np.int32)

    if dim == 1:
        if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 1, 0]
        if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 0, 0]
        if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [5, 1, 0]
        if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [5, 0, 0]
    elif dim == 2:
        if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 3, 2]
        if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 1, 2]
        if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
        if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]
    else:
        if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 5, 4]
        if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 3, 4]
        if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
        if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]

    return {
        "in_ports_fi": in_defaults,
        "out_ports_fi": out_defaults,
    }

def test_compare_batch_vs_step():
    device = spy.create_device(enable_debug_layers=False)
    
    DIM = 2
    N = 1 << DIM
    P = N + 2
    TOTAL_N = N * N * N
    TOTAL_NP2 = P * P * P
    TOTAL_NP2H2 = TOTAL_NP2 // 2
    
    with open("reasoningSim.slang", "r", encoding="utf-8") as f:
        code = f.read()
    
    macros_defines = (
        f"#define DIM {DIM}\n"
        f"#define NUM_IN_PORTS {sim_config.NUM_IN_PORTS}\n"
        f"#define NUM_OUT_PORTS {sim_config.NUM_OUT_PORTS}\n"
        f"#define INITIAL_ENERGY 0.8f\n"
        f"#define METABOLIC_COST 0.00001f\n"
        f"#define GEN_COST_RATE 0.001f\n"
        f"#define SOLAR_GAIN_RATE 0.05f\n"
        f"#define SUN_CYCLE_PERIOD 50.0f\n"
        f"#define SPEED_GAIN 0.05f\n"
        f"#define ROTATE_GAIN 0.1f\n"
    )
    
    STEPS = 50
    
    # 1. バッチ版 (ONE_SIM=0, INNER_STEPS=STEPS)
    code_batch = macros_defines + code.replace("#define INNER_STEPS (1000)", f"#define INNER_STEPS ({STEPS})")
    mod_batch = device.load_module_from_source("batch_sim", code_batch)
    kernel_batch = device.create_compute_kernel(device.link_program([mod_batch], [mod_batch.entry_point("computeMain")]))
    
    # 2. ステップ版 (ONE_SIM=1)
    code_step = "#define ONE_SIM 1\n" + macros_defines + code
    mod_step = device.load_module_from_source("step_sim", code_step)
    kernel_step = device.create_compute_kernel(device.link_program([mod_step], [mod_step.entry_point("computeMain")]))
    
    # 共通テストデータ
    rng = np.random.default_rng(12345)
    sig_pre = rng.uniform(-1.0, 1.0, size=(P, P, P, 4)).astype(np.float16)
    sig_post = rng.uniform(-1.0, 1.0, size=(P, P, P, 4)).astype(np.float16)
    neuromod_gen_map = rng.uniform(0.0, 0.5, size=(TOTAL_N, 4)).astype(np.float16)
    
    inhib_raw = rng.integers(0, 2, size=(TOTAL_N,), dtype=np.uint32)
    inhib_stride = (TOTAL_N + 31) // 32
    inhib_packed = np.zeros(inhib_stride, dtype=np.uint32)
    for i in range(TOTAL_N):
        if inhib_raw[i]:
            inhib_packed[i >> 5] |= (1 << (i & 31))
            
    base_output = np.float16(0.4)
    beta = np.float16(1.2)
    k_refill = np.float16(0.15)
    multiplier = np.uint32(3)
    bias = np.uint32(7)
    
    defaults_fi = get_default_inout_fi(DIM)
    in_ports_fi = defaults_fi["in_ports_fi"].copy()
    out_ports_fi = defaults_fi["out_ports_fi"].copy()
    
    nm_rel_matrix = rng.uniform(-0.5, 0.5, size=(4, 4)).astype(np.float16)
    nm_reaction = rng.uniform(-0.2, 0.2, size=(4, 4)).astype(np.float16)
    nm_diff = np.float16(0.02)
    
    def create_common_buffers():
        return {
            "inhib_map_all": device.create_buffer(data=inhib_packed, usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource),
            "global_outputs_all": device.create_buffer(data=np.zeros(TOTAL_NP2H2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access),
            "membrane_all": device.create_buffer(data=np.zeros(TOTAL_NP2H2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access),
            "signature_pre_map_np2": device.create_buffer(data=sig_pre.reshape(-1, 4), usage=spy.BufferUsage.shader_resource),
            "signature_post_map_np2": device.create_buffer(data=sig_post.reshape(-1, 4), usage=spy.BufferUsage.shader_resource),
            "neuromod_gen_map": device.create_buffer(data=neuromod_gen_map, usage=spy.BufferUsage.shader_resource),
            "resource_params_all": {
                "base_output": device.create_buffer(data=np.array([base_output], dtype=np.float16), usage=spy.BufferUsage.shader_resource),
                "beta": device.create_buffer(data=np.array([beta], dtype=np.float16), usage=spy.BufferUsage.shader_resource),
                "k_refill": device.create_buffer(data=np.array([k_refill], dtype=np.float16), usage=spy.BufferUsage.shader_resource),
            },
            "link28th_params_all": {
                "multiplier": device.create_buffer(data=np.array([multiplier], dtype=np.uint32), usage=spy.BufferUsage.shader_resource),
                "bias": device.create_buffer(data=np.array([bias], dtype=np.uint32), usage=spy.BufferUsage.shader_resource),
            },
            "inout_params_fi_all": {
                "in_ports_fi": device.create_buffer(data=in_ports_fi.reshape(1, sim_config.NUM_IN_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource),
                "out_ports_fi": device.create_buffer(data=out_ports_fi.reshape(1, sim_config.NUM_OUT_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource),
            },
            "neuromod_params_all": {
                "neuromod_rel_matrix": device.create_buffer(data=nm_rel_matrix.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource),
                "neuromod_weight_reaction": device.create_buffer(data=nm_reaction.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource),
                "diff": device.create_buffer(data=np.array([nm_diff], dtype=np.float16), usage=spy.BufferUsage.shader_resource),
            },
            "mutation_rate_all": device.create_buffer(data=np.zeros(1, dtype=np.float32), usage=spy.BufferUsage.unordered_access),
            "dt": np.float16(0.01),
            "step": np.uint32(0),
        }
    
    # ------------------
    # A. バッチ実行
    # ------------------
    args_batch = create_common_buffers()
    kernel_batch.dispatch(thread_count=(N, N, N), **args_batch)
    device.wait()
    
    batch_mut_rate = args_batch["mutation_rate_all"].to_numpy().view(np.float32)[0]
    batch_outputs = args_batch["membrane_all"].to_numpy().view(np.float16).reshape(P, P, P)
    
    # ------------------
    # B. ステップ実行
    # ------------------
    args_step = create_common_buffers()
    
    # 乱数で目標座標(obj)を決定（Slang内の rand_half と同じシード式）
    # Slang: float obj_rand = 2 * (float)rand_half(12277 * step + 67 * agent_id);
    # obj = (cospi(obj_rand), sinpi(obj_rand))
    # ここでは step=0, agent_id=0: seed = 0
    # rand_half(0):
    # uint st = 0 * 747796405u + 2891336453u;
    # uint word = ((st >> ((st >> 28u) + 4u)) ^ st) * 277803737u;
    # uint res = (word >> 22u) ^ word;
    # return half(res & 0xFFFFu) / 65535.0h;
    def get_slang_init_obj(step, agent_id):
        seed = np.uint32(12277 * step + 67 * agent_id)
        st = np.uint32(seed * np.uint32(747796405) + np.uint32(2891336453))
        rot = (st >> np.uint32((st >> np.uint32(28)) + np.uint32(4))) & np.uint32(31)
        word = np.uint32((st >> rot) ^ st) * np.uint32(277803737)
        res = np.uint32((word >> np.uint32(22)) ^ word)
        h = np.float32((res & np.uint32(0xFFFF)) / 65535.0)
        obj_rand = 2.0 * h
        return np.cos(np.pi * obj_rand), np.sin(np.pi * obj_rand)
    
    init_obj_x, init_obj_y = get_slang_init_obj(0, 0)
    
    # 初期状態バッファ: [energy, pos.x, pos.y, angle, obj.x, obj.y]
    body_state = np.array([0.8, 0.0, 0.0, 0.0, init_obj_x, init_obj_y], dtype=np.float32)
    b_body_state = device.create_buffer(data=body_state, usage=spy.BufferUsage.unordered_access)
    b_r = device.create_buffer(data=np.zeros(TOTAL_N, dtype=np.float16), usage=spy.BufferUsage.unordered_access)
    b_nm_state = device.create_buffer(data=np.zeros((TOTAL_N, 4), dtype=np.float16), usage=spy.BufferUsage.unordered_access)
    b_synapse = device.create_buffer(data=np.zeros(TOTAL_N * 28, dtype=np.float16), usage=spy.BufferUsage.unordered_access)
    
    args_step["body_state_all"] = b_body_state
    args_step["r_all"] = b_r
    args_step["neuromod_state_all"] = b_nm_state
    args_step["synapse_weights_all"] = b_synapse
    
    # 1. 初期化ディスパッチ (is_init = 1)
    args_step["inner_step_val"] = np.uint32(0)
    args_step["is_init"] = np.uint32(1)
    kernel_step.dispatch(thread_count=(N, N, N), **args_step)
    device.wait()
    
    # 2. 10ステップ進める (is_init = 0)
    args_step["is_init"] = np.uint32(0)
    for s in range(STEPS):
        args_step["inner_step_val"] = np.uint32(s)
        kernel_step.dispatch(thread_count=(N, N, N), **args_step)
        device.wait()
        
    step_body_state = b_body_state.to_numpy().view(np.float32)
    step_mut_rate = args_step["mutation_rate_all"].to_numpy().view(np.float32)[0]
    step_outputs = args_step["membrane_all"].to_numpy().view(np.float16).reshape(P, P, P)
    
    print("=== 結果比較 ===")
    print(f"Batch final energy (mut_rate): {batch_mut_rate:.8f}")
    print(f"Step  final energy (mut_rate): {step_mut_rate:.8f}")
    print(f"Energy diff:                  {abs(batch_mut_rate - step_mut_rate):.8e}")
    
    max_out_diff = np.max(np.abs(batch_outputs - step_outputs))
    mean_out_diff = np.mean(np.abs(batch_outputs - step_outputs))
    print(f"Max outputs diff:             {max_out_diff:.8e}")
    print(f"Mean outputs diff:            {mean_out_diff:.8e}")
    
    assert abs(batch_mut_rate - step_mut_rate) < 1e-6, "Energy mismatch!"
    assert max_out_diff < 1e-4, f"Output mismatch! max_out_diff={max_out_diff}"
    print(">>> 判定: 完全一致テスト合格！(SUCCESS) <<<")

if __name__ == "__main__":
    test_compare_batch_vs_step()
