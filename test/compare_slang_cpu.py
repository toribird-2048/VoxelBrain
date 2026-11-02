import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
import slangpy as spy
from sim_cpu import SolarBrainCPU, get_default_inout_fi
import sim_config

def test_compare():
    device = spy.create_device(enable_debug_layers=False)
    
    # 共通定数
    DIM = 2
    N = 1 << DIM
    P = N + 2
    TOTAL_N = N * N * N
    TOTAL_NP2 = P * P * P
    
    # Slang カーネルのコンパイル
    with open("reasoningSim.slang", "r", encoding="utf-8") as f:
        code = f.read()
    
    # 餓死しないように発電ゲインを大きくしてテスト
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
    # 10ステップでの完全一致テスト
    test_code = code.replace("#define INNER_STEPS (1000)", "#define INNER_STEPS (10)")
    source_code = macros_defines + test_code
    mod = device.load_module_from_source("reasoningSim", source_code)
    entry = mod.entry_point("computeMain")
    program = device.link_program([mod], [entry])
    kernel = device.create_compute_kernel(program)
    
    # テストデータ (Agent 0 の 1個体分)
    rng = np.random.default_rng(12345)
    sig_pre = rng.uniform(-1.0, 1.0, size=(P, P, P, 4)).astype(np.float16)
    sig_post = rng.uniform(-1.0, 1.0, size=(P, P, P, 4)).astype(np.float16)
    neuromod_gen_map = rng.uniform(0.0, 0.5, size=(TOTAL_N, 4)).astype(np.float16)
    
    # inhib: 0 or 1
    inhib_raw = rng.integers(0, 2, size=(TOTAL_N,), dtype=np.uint32)
    inhib_stride = (TOTAL_N + 31) // 32
    inhib_packed = np.zeros(inhib_stride, dtype=np.uint32)
    for i in range(TOTAL_N):
        if inhib_raw[i]:
            inhib_packed[i >> 5] |= (1 << (i & 31))
            
    # パラメータ
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
    
    # --- GPU バッファの準備 ---
    b_inhib = device.create_buffer(data=inhib_packed, usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    b_poutputs = device.create_buffer(data=np.zeros(TOTAL_NP2 // 2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access)
    b_membrane = device.create_buffer(data=np.zeros(TOTAL_NP2 // 2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access)
    b_sig_pre = device.create_buffer(data=sig_pre.reshape(-1, 4), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    b_sig_post = device.create_buffer(data=sig_post.reshape(-1, 4), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    b_nm_gen = device.create_buffer(data=neuromod_gen_map, usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    
    # 構造体バッファ
    b_res_base = device.create_buffer(data=np.array([base_output], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
    b_res_beta = device.create_buffer(data=np.array([beta], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
    b_res_k = device.create_buffer(data=np.array([k_refill], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
    
    b_link_mul = device.create_buffer(data=np.array([multiplier], dtype=np.uint32), usage=spy.BufferUsage.shader_resource)
    b_link_bias = device.create_buffer(data=np.array([bias], dtype=np.uint32), usage=spy.BufferUsage.shader_resource)
    
    b_in_fi = device.create_buffer(data=in_ports_fi.reshape(1, sim_config.NUM_IN_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    b_out_fi = device.create_buffer(data=out_ports_fi.reshape(1, sim_config.NUM_OUT_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
    
    b_nm_rel = device.create_buffer(data=nm_rel_matrix.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource)
    b_nm_react = device.create_buffer(data=nm_reaction.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource)
    b_nm_diff = device.create_buffer(data=np.array([nm_diff], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
    
    b_mut_rate = device.create_buffer(data=np.zeros(1, dtype=np.float32), usage=spy.BufferUsage.unordered_access)
    
    gpu_args = {
        "inhib_map_all": b_inhib,
        "global_poutputs_all": b_poutputs,
        "membrane_all": b_membrane,
        "signature_pre_map_np2": b_sig_pre,
        "signature_post_map_np2": b_sig_post,
        "neuromod_gen_map": b_nm_gen,
        "resource_params_all": {
            "base_output": b_res_base,
            "beta": b_res_beta,
            "k_refill": b_res_k,
        },
        "link28th_params_all": {
            "multiplier": b_link_mul,
            "bias": b_link_bias,
        },
        "inout_params_fi_all": {
            "in_ports_fi": b_in_fi,
            "out_ports_fi": b_out_fi,
        },
        "neuromod_params_all": {
            "neuromod_rel_matrix": b_nm_rel,
            "neuromod_weight_reaction": b_nm_react,
            "diff": b_nm_diff,
        },
        "mutation_rate_all": b_mut_rate,
        "dt": np.float16(0.01),
        "step": np.uint32(0),
    }
    
    # GPU 実行 (1000 ステップ)
    kernel.dispatch(thread_count=(N, N, N), **gpu_args)
    device.wait()
    
    gpu_mut_rate = b_mut_rate.to_numpy().view(np.float32)[0]
    gpu_outputs = b_poutputs.to_numpy().view(np.float16).reshape(P, P, P)
    
    # --- CPU 実行 (1000 ステップ) ---
    params = {
        "base_output": base_output,
        "beta": beta,
        "k_refill": k_refill,
        "multiplier": multiplier,
        "bias": bias,
        "in_ports_fi": in_ports_fi,
        "out_ports_fi": out_ports_fi,
        "neuromod_rel_matrix": nm_rel_matrix,
        "neuromod_weight_reaction": nm_reaction,
        "neuromod_diff": nm_diff,
        "initial_energy": 0.8,
        "metabolic_cost": 0.00001,
        "gen_cost_rate": 0.001,
        "solar_gain_rate": 0.05,
        "sun_cycle_period": 50.0,
        "speed_gain": 0.05,
        "rotate_gain": 0.1,
    }
    
    spec = {
        "dim": DIM,
        "n": N,
        "p": P,
        "total_n": TOTAL_N,
        "center": (N - 1) / 2.0,
    }
    
    cpu_sim = SolarBrainCPU(
        sig_pre=sig_pre,
        sig_post=sig_post,
        neuromod_map=neuromod_gen_map,
        inhib=inhib_packed,
        params=params,
        spec=spec,
        generation_step=0,
        agent_id=0,
    )
    
    cpu_energy = cpu_sim.run(inner_steps=10)
    
    print(f"GPU final energy (mutation_rate): {gpu_mut_rate:.6f}")
    print(f"CPU final energy:                {cpu_energy:.6f}")
    diff_energy = abs(gpu_mut_rate - cpu_energy)
    print(f"Energy difference:               {diff_energy:.6e}")
    
    # 内部ニューロン出力の比較
    cpu_out = cpu_sim.outputs_np2
    max_out_diff = np.max(np.abs(gpu_outputs - cpu_out))
    mean_out_diff = np.mean(np.abs(gpu_outputs - cpu_out))
    print(f"Max outputs diff:                {max_out_diff:.6e}")
    print(f"Mean outputs diff:               {mean_out_diff:.6e}")

if __name__ == "__main__":
    test_compare()
