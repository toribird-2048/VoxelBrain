import numpy as np
from jaxtyping import Float64, Float16, Int8
from dataclasses import dataclass, field, fields
import vnoise #type: ignore
from typing import Annotated, get_type_hints, Protocol, runtime_checkable, Any
import slangpy as spy
import dataclasses
import time
import os
import signal
import glob
import csv
from datetime import datetime
import sys
import argparse

from elite_manager import EliteManager

try:
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
except Exception:
    pass

from sim_config import (
    NUM_IN_PORTS,
    NUM_OUT_PORTS,
    INITIAL_ENERGY,
    METABOLIC_COST,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SUN_CYCLE_PERIOD,
    SPEED_GAIN,
    ROTATE_GAIN,
)

# ---------------------------------------------------------
# コマンドライン引数の解析 (未指定時は環境変数またはデフォルト値)
# ---------------------------------------------------------
parser = argparse.ArgumentParser(description="VoxelBrain Evolution Simulation")
parser.add_argument("--steps", "-n", type=int, default=None, help="総世代数 / ステップ数 (デフォルト: 50000 または VB_TOTAL_STEPS)")
parser.add_argument("--inner-steps", type=int, default=None, help="1世代あたりの推論ステップ数 (デフォルト: 30 または VB_INNER_STEPS)")
parser.add_argument("--sub-inner-steps", type=int, default=None, help="VRAM書き戻し間隔 (デフォルト: inner_steps または VB_SUB_INNER_STEPS)")
parser.add_argument("--dim", type=int, default=None, help="ボクセル解像度次元 1, 2, or 3 (デフォルト: 2 または VB_DIM)")
parser.add_argument("--m", type=int, default=None, help="個体群サイズ (デフォルト: 32768 または VB_M)")
parser.add_argument("--wait-interval", type=int, default=None, help="GPU同期・ログ出力間隔 (デフォルト: 1 または VB_WAIT_INTERVAL)")
parser.add_argument("--stop-file", type=str, default=None, help="安全停止用トリガーファイルパス")

args, unknown_args = parser.parse_known_args()

if args.dim is not None:
    os.environ["VB_DIM"] = str(args.dim)
if args.m is not None:
    os.environ["VB_M"] = str(args.m)
if args.inner_steps is not None:
    os.environ["VB_INNER_STEPS"] = str(args.inner_steps)
if args.sub_inner_steps is not None:
    os.environ["VB_SUB_INNER_STEPS"] = str(args.sub_inner_steps)


stop_requested = False

def force_exit_handler(signum, frame):
    global stop_requested
    if not stop_requested:
        print("\n[!] Ctrl+C を検知しました！現在のステップ完了後に上位20体を保存して終了します...")
        print("    (※ GPUを待たずに今すぐ強制終了したい場合は、もう一度 Ctrl+C を押してください)")
        stop_requested = True
    else:
        print("\n[!!] 2回目の Ctrl+C を検知しました。即時強制終了します！")
        os._exit(1)

signal.signal(signal.SIGINT, force_exit_handler)

@runtime_checkable
class Generatable(Protocol):
    val_type: type
    val_min: float | int
    val_max: float | int
    def generate(self, count: int, seed: int) -> Any:
        ...

@dataclass(frozen=True, slots=True)
class R:
    val_type: type
    val_min: float | int
    val_max: float | int
    odd: bool = False
    log: bool = False
    
    def __post_init__(self):
        if type(self.val_min) != self.val_type or type(self.val_max) != self.val_type:
            raise TypeError(f"""
                            val_minとval_maxはval_typeと型が同じでなければなりませんが、
                            val_min: {type(self.val_min)} 
                            val_max: {type(self.val_max)}
                            val_type: {self.val_type}
                            でした。
                            """)
        if self.val_type is int and self.log == True:
            raise TypeError()
        
    def generate(self, count: int, seed: int) -> np.ndarray:
        rng = np.random.default_rng(seed=seed)
        if self.val_type == float:
            if self.log == True:
                return np.exp(rng.uniform(np.log(self.val_min), np.log(self.val_max), size=count))
            return rng.uniform(self.val_min, self.val_max, size=count)
        if self.val_type == int:
            if self.odd == True:
                k_min = (int(self.val_min) + 1) // 2 if self.val_min % 2 == 0 else int(self.val_min) // 2
                k_max = (int(self.val_max) - 1) // 2
                return 2 * rng.integers(k_min, k_max + 1, size=count) + 1
            return rng.integers(self.val_min, self.val_max, size=count, endpoint=True)
        raise ValueError("Unexpected Error")
    
@dataclass(frozen=True, slots=True)
class R4:
    val_type: type
    val_min: float | int
    val_max: float | int
    odd: bool = False
    log: bool = False
    
    def __post_init__(self):
        if type(self.val_min) != self.val_type or type(self.val_max) != self.val_type:
            raise TypeError(f"""
                            val_minとval_maxはval_typeと型が同じでなければなりませんが、
                            val_min: {type(self.val_min)} 
                            val_max: {type(self.val_max)}
                            val_type: {self.val_type}
                            でした。
                            """)
        if self.val_type is int and self.log == True:
            raise TypeError()
    
    def generate(self, count: int, seed: int) -> np.ndarray:
        rng = np.random.default_rng(seed=seed)
        if self.val_type == float:
            if self.log == True:
                return np.exp(rng.uniform(np.log(self.val_min), np.log(self.val_max), size=(count, 4)))
            return rng.uniform(self.val_min, self.val_max, size=(count, 4))
        if self.val_type == int:
            if self.odd == True:
                k_min = (int(self.val_min) + 1) // 2 if self.val_min % 2 == 0 else int(self.val_min) // 2
                k_max = (int(self.val_max) - 1) // 2
                return 2 * rng.integers(k_min, k_max + 1, size=(count, 4)) + 1
            return rng.integers(self.val_min, self.val_max, size=(count, 4), endpoint=True)
        raise ValueError("Unexpected Error")

@dataclass(frozen=True, slots=True)
class RInoutFi:
    val_type: type = int
    val_min: int = -1
    val_max: int = 5
    is_output: bool = False

    def generate(self, count: int, seed: int) -> np.ndarray:
        rng = np.random.default_rng(seed=seed)
        face = rng.integers(0, 5, size=count, endpoint=True, dtype=np.int32)
        if self.is_output:
            u = rng.integers(0, Config.N - 1, size=count, endpoint=True, dtype=np.int32)
            v = rng.integers(0, Config.N - 1, size=count, endpoint=True, dtype=np.int32)
        else:
            u = rng.integers(-1, Config.N, size=count, endpoint=True, dtype=np.int32)
            v = rng.integers(-1, Config.N, size=count, endpoint=True, dtype=np.int32)
        return np.stack([face, u, v], axis=-1).astype(np.int32)

class Config:
    dim: int = int(os.environ.get("VB_DIM", "2"))  # dim=1 -> N=2, dim=2 -> N=4, dim=3 -> N=8
    N: int = 1 << dim
    P: int = N + 2
    shift_x: int = 0
    shift_y: int = dim
    shift_z: int = dim * 2
    total_cells: int = 1 << (dim * 3)
    inhib_stride: int = (total_cells + 31) // 32  # 1個体あたりのuint32要素数
    mask: int = N - 1
    
    m: int = int(os.environ.get("VB_M", str(1 << 15)))
    world_size: float = 100.0
    
    # 1世代あたりの総推論ステップ数 (デフォルト: 30)
    inner_steps: int = int(os.environ.get("VB_INNER_STEPS", "30"))
    # VRAM書き戻し間隔 (何inner_stepごとにVRAMへ書き戻すか。デフォルト: inner_steps = 一括実行)
    sub_inner_steps: int = int(os.environ.get("VB_SUB_INNER_STEPS", str(inner_steps)))
    # VRAM書き戻しモードの判定
    is_vram_sync_mode: bool = sub_inner_steps < inner_steps
    
    class Seed:
        sigpre: int = 1
        sigpost: int = 2
        neuromod: int = 3
        inhib: int = 5
        link: int = 6
        res: int = 7
        inout: int = 9


class SigRange:
    seeds = R4(int, 0, 1<<20)
    biases = R4(float, -0.5, 0.5)
    freqs = R4(float, 0.0, 1.0)
    cutoffs = R4(float, 0.0, 0.95)


class InhibRange:
    seed = R(int, 0, 1<<20)
    speed = R(float, 1.0, 2.0)
    cutoff = R(float, 0.0, 1.5)
    steps = R(int, 1, 200)
    base = R(float, 0.0, 0.0)
    threshold = R(float, 0.0, 1.0)


class Link28thRange:
    multiplier = R(int, 0, Config.total_cells - 1, odd=True)
    bias = R(int, 0, Config.total_cells - 1)


class NeuronResourceRange:
    base_output = R(float, 0.001, 0.1, log=True)
    beta = R(float, 15.0, 30.0)
    k_refill = R(float, 0.02, 0.3)


class InoutFiRange:
    @staticmethod
    def generate(count_agents: int, seed: int) -> dict[str, np.ndarray]:
        rng = np.random.default_rng(seed=seed)
        total_in = count_agents * NUM_IN_PORTS
        in_face = rng.integers(0, 5, size=total_in, endpoint=True, dtype=np.int32)
        in_u = rng.integers(-1, Config.N, size=total_in, endpoint=True, dtype=np.int32)
        in_v = rng.integers(-1, Config.N, size=total_in, endpoint=True, dtype=np.int32)
        in_ports_fi = np.stack([in_face, in_u, in_v], axis=-1).astype(np.int32)

        total_out = count_agents * NUM_OUT_PORTS
        out_face = rng.integers(0, 5, size=total_out, endpoint=True, dtype=np.int32)
        out_u = rng.integers(0, Config.N - 1, size=total_out, endpoint=True, dtype=np.int32)
        out_v = rng.integers(0, Config.N - 1, size=total_out, endpoint=True, dtype=np.int32)
        out_ports_fi = np.stack([out_face, out_u, out_v], axis=-1).astype(np.int32)

        return {
            "in_ports_fi": in_ports_fi,
            "out_ports_fi": out_ports_fi,
        }


def generate(cls, seed: int) -> dict[str, np.ndarray]:
    params_dict = {}
    rng_seed = seed
    for key, value in vars(cls).items():
        if not key.startswith("__"):
            if isinstance(value, Generatable):
                params_dict[key] = value.generate(Config.m, rng_seed)
                rng_seed += 10007
    return params_dict


@dataclass(frozen=True, slots=True)
class GenesisParams:
    signature_pre_params: dict[str, np.ndarray]
    signature_post_params: dict[str, np.ndarray]
    neuromod_params: dict[str, np.ndarray]
    inhib_params: dict[str, np.ndarray]
    resource_params: dict[str, np.ndarray]
    link28th_params: dict[str, np.ndarray]
    inout_params_fi: dict[str, np.ndarray]

    @classmethod
    def new(cls) -> "GenesisParams":
        return cls(
            signature_pre_params=generate(SigRange, Config.Seed.sigpre),
            signature_post_params=generate(SigRange, Config.Seed.sigpost),
            neuromod_params=generate(SigRange, Config.Seed.neuromod),
            inhib_params=generate(InhibRange, Config.Seed.inhib),
            resource_params=generate(NeuronResourceRange, Config.Seed.res),
            link28th_params=generate(Link28thRange, Config.Seed.link),
            inout_params_fi=InoutFiRange.generate(Config.m, Config.Seed.inout),
        )


device = spy.create_device(type=spy.DeviceType.cuda)


def cast_and_buffer(ndarray_dict: dict[str, np.ndarray], device: spy.Device, float_dtype=np.float16):
    buf_dict = {}
    for key, value in ndarray_dict.items():
        if np.issubdtype(value.dtype, np.floating):
            target_type = float_dtype
        elif np.issubdtype(value.dtype, np.integer):
            target_type = np.int32
        else:
            raise TypeError("この関数に入れるndarrayはすべてintかfloatでなければいけません。")       
        val_conti = np.ascontiguousarray(value, dtype=target_type)
        buf_val = device.create_buffer(data=val_conti, usage=spy.BufferUsage.unordered_access)
        buf_dict[key] = buf_val
    return buf_dict


def build_kernel(device, filename: str, extra_defines: str = ""):
    with open(filename + ".slang", "r", encoding="utf-8") as f:
        defines = (
            f"#define DIM {Config.dim}\n"
            f"#define INNER_STEPS {Config.inner_steps}\n"
            f"#define NUM_IN_PORTS {NUM_IN_PORTS}\n"
            f"#define NUM_OUT_PORTS {NUM_OUT_PORTS}\n"
            f"#define INITIAL_ENERGY {INITIAL_ENERGY}f\n"
            f"#define METABOLIC_COST {METABOLIC_COST}f\n"
            f"#define GEN_COST_RATE {GEN_COST_RATE}f\n"
            f"#define SOLAR_GAIN_RATE {SOLAR_GAIN_RATE}f\n"
            f"#define SUN_CYCLE_PERIOD {SUN_CYCLE_PERIOD}f\n"
            f"#define SPEED_GAIN {SPEED_GAIN}f\n"
            f"#define ROTATE_GAIN {ROTATE_GAIN}f\n"
            f"{extra_defines}"
        )
        source_code = defines + f.read()
    
    module_name = f"kernel_{filename}_{'sync' if 'VRAM_SYNC_MODE' in extra_defines else 'mono'}"
    module = device.load_module_from_source(module_name, source_code)
    entry = module.entry_point("computeMain")
    program = device.link_program([module], [entry])
    kernel = device.create_compute_kernel(program)
    return kernel


def create_buf(device: spy.Device, params: np.ndarray | dict[str, np.ndarray]):
    if isinstance(params, np.ndarray):
        return device.create_buffer(data=params, usage=spy.BufferUsage.unordered_access)
    
    params_buf_dict = {}
    for key, value in params.items():
        if isinstance(value, np.ndarray):
            data_type: np.dtype = value.dtype
            val_conti = np.ascontiguousarray(value, dtype=data_type)
            buf_val = device.create_buffer(data=val_conti, usage=spy.BufferUsage.unordered_access)
            params_buf_dict[key] = buf_val
            continue
        params_buf_dict[key] = value
    return params_buf_dict


def create_mutation_params_buffers(num_groups: int, seed: int = None):
    rng = np.random.default_rng(seed)
    max_safe_diff = 1.0 / 27.0

    sig_mutation_params = {
        "rate": rng.uniform(0.05, 0.30, size=(num_groups, 4)).astype(np.float16),
        "steps": rng.integers(0, 6, size=num_groups, dtype=np.uint32),
        "max": rng.uniform(0.01, 0.1, size=(num_groups, 4)).astype(np.float16),
        "diff": rng.uniform(0.005, max_safe_diff, size=(num_groups, 4)).astype(np.float16),
    }

    neuromod_map_mutation_params = {
        "rate": rng.uniform(0.05, 0.30, size=(num_groups, 4)).astype(np.float16),
        "steps": rng.integers(0, 6, size=num_groups, dtype=np.uint32),
        "max": rng.uniform(0.01, 0.1, size=(num_groups, 4)).astype(np.float16),
        "diff": rng.uniform(0.005, max_safe_diff, size=(num_groups, 4)).astype(np.float16),
    }

    neuromod_params_rate = np.zeros((num_groups, 4), dtype=np.float16)
    neuromod_params_rate[:, 0] = rng.uniform(0.02, 0.15, size=num_groups)  # rel_matrix
    neuromod_params_rate[:, 1] = rng.uniform(0.02, 0.15, size=num_groups)  # weight_reaction
    neuromod_params_rate[:, 2] = rng.uniform(0.02, 0.15, size=num_groups)  # diff
    neuromod_params_rate[:, 3] = np.float16(0.0)  # unused
    neuromod_params_mutation_params = {
        "rate": neuromod_params_rate,
    }

    iicu_rate = np.zeros((num_groups, 4), dtype=np.float16)
    iicu_rate[:, 0] = rng.uniform(0.02, 0.20, size=num_groups)  # inhib
    iicu_rate[:, 1] = rng.uniform(0.02, 0.15, size=num_groups)  # inout
    iicu_rate[:, 2] = rng.uniform(0.02, 0.15, size=num_groups)  # copy
    iicu_rate[:, 3] = np.float16(0.0)  # unused
    iicu_mutation_params = {
        "iicu_rate": iicu_rate,
    }

    resource_rate = np.zeros((num_groups, 4), dtype=np.float16)
    resource_rate[:, 0] = rng.uniform(0.02, 0.15, size=num_groups)
    resource_rate[:, 1] = rng.uniform(0.02, 0.15, size=num_groups)
    resource_rate[:, 2] = rng.uniform(0.02, 0.15, size=num_groups)

    link28th_rate = rng.uniform(0.02, 0.15, size=(num_groups, 2)).astype(np.float16)
    mutate_rate = rng.uniform(0.01, 0.10, size=(num_groups, 4)).astype(np.float16)

    rlmu_mutation_params = {
        "resource_rate": resource_rate,
        "link28th_rate": link28th_rate,
        "mutate_rate": mutate_rate,
    }

    return (
        sig_mutation_params,
        neuromod_map_mutation_params,
        neuromod_params_mutation_params,
        iicu_mutation_params,
        rlmu_mutation_params,
    )


def create_neuromod_params_buffers(num_groups: int, seed: int = None):
    rng = np.random.default_rng(seed)

    # 4x4 相互作用行列 (初期は単位行列に近い形)
    rel_matrix = np.zeros((num_groups, 4, 4), dtype=np.float16)
    for g in range(num_groups):
        rel_matrix[g] = np.eye(4, dtype=np.float16) * 0.95 + rng.uniform(-0.05, 0.05, size=(4, 4)).astype(np.float16)

    # 4x4 反応行列 (シナプス重み反応)
    weight_reaction = rng.uniform(-0.05, 0.05, size=(num_groups, 4, 4)).astype(np.float16)
    for g in range(num_groups):
        for i in range(4):
            weight_reaction[g, i, 2] = 0.95  # 自身の重みを維持する項

    diff = rng.uniform(0.005, 1.0 / 27.0, size=num_groups).astype(np.float16)

    return {
        "neuromod_rel_matrix": rel_matrix,
        "neuromod_weight_reaction": weight_reaction,
        "diff": diff,
    }


kernel_generation = build_kernel(device, "generation")
if Config.is_vram_sync_mode:
    kernel_reasoning_step = build_kernel(device, "reasoningSim", extra_defines="#define VRAM_SYNC_MODE 1\n")
else:
    kernel_reasoning = build_kernel(device, "reasoningSim")
kernel_mutation = build_kernel(device, "mutation")

sig_pre_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
sig_post_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
neuromod_map = np.zeros((Config.m * Config.N * Config.N * Config.N, 4), dtype=np.half)
neuromod_map_buf = device.create_buffer(
    data=neuromod_map,
    usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource
)
inhib_sign_map = np.zeros(Config.m * Config.inhib_stride, dtype=np.uint32)

generation_dict = {
    "sig_pre_map_np2_pout": sig_pre_map_np2,
    "sig_post_map_np2_pout": sig_post_map_np2,
    "neuromod_map_pout": neuromod_map_buf,
    "inhib_sign_map_pout": inhib_sign_map,
    "sig_pre_genes": cast_and_buffer(genesis_params.signature_pre_params, device, float_dtype=np.float32),
    "sig_post_genes": cast_and_buffer(genesis_params.signature_post_params, device, float_dtype=np.float32),
    "neuromod_genes": cast_and_buffer(genesis_params.neuromod_params, device, float_dtype=np.float32),
    "inhib_genes": cast_and_buffer(genesis_params.inhib_params, device, float_dtype=np.float32)
}

gen_buf_dict = create_buf(device, generation_dict)

start_time_gen = time.perf_counter()
kernel_generation.dispatch(
    thread_count=(Config.m * Config.N, Config.N, Config.N),
    **gen_buf_dict
)
device.wait()
end_time_gen = time.perf_counter()
print(f"gen処理時間: {end_time_gen - start_time_gen:.6f} 秒")


global_poutputs_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.P, Config.P, Config.P), dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
)
membrane_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.P, Config.P, Config.P), dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
)
mutation_rate_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.float32),
    usage=spy.BufferUsage.unordered_access,
)

shared_resource_params_buf = cast_and_buffer(genesis_params.resource_params, device)
shared_link28th_params_buf = cast_and_buffer(genesis_params.link28th_params, device)
shared_inout_params_fi_buf = cast_and_buffer(genesis_params.inout_params_fi, device)

(
    sig_mut_dict,
    neuromod_map_mut_dict,
    neuromod_params_mut_dict,
    iicu_mut_dict,
    rlmu_mut_dict,
) = create_mutation_params_buffers(Config.m, 42)
shared_sig_mut_buf = cast_and_buffer(sig_mut_dict, device)
shared_neuromod_map_mut_buf = cast_and_buffer(neuromod_map_mut_dict, device)
shared_neuromod_params_mut_buf = cast_and_buffer(neuromod_params_mut_dict, device)
shared_iicu_mut_buf = cast_and_buffer(iicu_mut_dict, device)
shared_rlmu_mut_buf = cast_and_buffer(rlmu_mut_dict, device)

shared_neuromod_params_buf = cast_and_buffer(create_neuromod_params_buffers(Config.m, 42), device)


def get_default_inout_fi(dim: int) -> dict[str, np.ndarray]:
    """デフォルトの入出力face_index [face, u, v] を返す。
    in_ports_fi: shape (NUM_IN_PORTS, 3)
    out_ports_fi: shape (NUM_OUT_PORTS, 3)
    """
    in_defaults = np.zeros((NUM_IN_PORTS, 3), dtype=np.int32)
    out_defaults = np.zeros((NUM_OUT_PORTS, 3), dtype=np.int32)

    if dim == 1:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 1, 0]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 0, 0]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [5, 1, 0]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [5, 0, 0]
    elif dim == 2:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 3, 2]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 1, 2]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]
    else:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 5, 4]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 3, 4]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]

    return {
        "in_ports_fi": in_defaults,
        "out_ports_fi": out_defaults,
    }


def load_and_distribute_all_elites(folder_path: str):
    defaults_fi = get_default_inout_fi(Config.dim)
    def_defaults = {
        "base_output": shared_resource_params_buf["base_output"].to_numpy().view(np.float16)[0],
        "beta": shared_resource_params_buf["beta"].to_numpy().view(np.float16)[0],
        "k_refill": shared_resource_params_buf["k_refill"].to_numpy().view(np.float16)[0],
        "multiplier": shared_link28th_params_buf["multiplier"].to_numpy().view(np.int32)[0],
        "bias": shared_link28th_params_buf["bias"].to_numpy().view(np.int32)[0],
        "rel_matrix": shared_neuromod_params_buf["neuromod_rel_matrix"].to_numpy().view(np.float16).reshape(Config.m, 4, 4)[0],
        "weight_reaction": shared_neuromod_params_buf["neuromod_weight_reaction"].to_numpy().view(np.float16).reshape(Config.m, 4, 4)[0],
        "diff": shared_neuromod_params_buf["diff"].to_numpy().view(np.float16).reshape(Config.m)[0],
        "in_ports_fi": defaults_fi["in_ports_fi"],
        "out_ports_fi": defaults_fi["out_ports_fi"],
        "mut_buffers": {
            "shared_sig_mut_buf": shared_sig_mut_buf,
            "shared_neuromod_map_mut_buf": shared_neuromod_map_mut_buf,
            "shared_neuromod_params_mut_buf": shared_neuromod_params_mut_buf,
            "shared_iicu_mut_buf": shared_iicu_mut_buf,
            "shared_rlmu_mut_buf": shared_rlmu_mut_buf,
        },
    }
    EliteManager.distribute_elites_to_population(
        folder_path=folder_path,
        config=Config,
        gen_buf_dict=gen_buf_dict,
        neuromod_map_buf=neuromod_map_buf,
        shared_resource_params_buf=shared_resource_params_buf,
        shared_link28th_params_buf=shared_link28th_params_buf,
        shared_neuromod_params_buf=shared_neuromod_params_buf,
        shared_inout_params_fi_buf=shared_inout_params_fi_buf,
        def_defaults=def_defaults,
    )


LOAD_CHECKPOINT_FOLDER = os.environ.get("VB_LOAD_FOLDER", "backups/elites")
load = os.environ.get("VB_LOAD_ELITES", "0") == "1"

if LOAD_CHECKPOINT_FOLDER and os.path.exists(LOAD_CHECKPOINT_FOLDER) and load is True:
    load_and_distribute_all_elites(LOAD_CHECKPOINT_FOLDER)

reasoning_sim_dict = {
    "inhib_map_all": gen_buf_dict["inhib_sign_map_pout"],
    "global_outputs_all": global_poutputs_buf,
    "membrane_all": membrane_buf,
    "signature_pre_map_np2": gen_buf_dict["sig_pre_map_np2_pout"],
    "signature_post_map_np2": gen_buf_dict["sig_post_map_np2_pout"],
    "neuromod_gen_map": neuromod_map_buf,
    "resource_params_all": shared_resource_params_buf,
    "link28th_params_all": shared_link28th_params_buf,
    "inout_params_fi_all": shared_inout_params_fi_buf,
    "neuromod_params_all": shared_neuromod_params_buf,
    "mutation_rate_all": mutation_rate_buf,
    "dt": 0.01,
    "step": 0,
}

if Config.is_vram_sync_mode:
    body_state_buf = device.create_buffer(
        data=np.zeros((Config.m, 6), dtype=np.float32),
        usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource
    )
    r_buf = device.create_buffer(
        data=np.zeros((Config.m, Config.total_cells), dtype=np.float16),
        usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource
    )
    neuromod_state_buf = device.create_buffer(
        data=np.zeros((Config.m, Config.total_cells, 4), dtype=np.float16),
        usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource
    )
    synapse_weights_buf = device.create_buffer(
        data=np.zeros((Config.m, Config.total_cells * 28), dtype=np.float16),
        usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource
    )

    reasoning_step_dict = {
        **reasoning_sim_dict,
        "inner_step_start": np.uint32(0),
        "inner_step_count": np.uint32(0),
        "is_init": np.uint32(1),
        "body_state_all": body_state_buf,
        "r_all": r_buf,
        "neuromod_state_all": neuromod_state_buf,
        "synapse_weights_all": synapse_weights_buf,
    }


def physics_interaction_hook(
    step: int,
    inner_step_start: int,
    inner_step_count: int,
    body_state_buf: spy.Buffer,
    global_outputs_buf: spy.Buffer,
):
    """
    ユーザー拡張用: マルチエージェント物理シミュレーション挿入フック。
    VRAM書き戻しモード時に各サブステップ終了直後に呼び出されます。
    ユーザー独自の物理シミュレーション（GPUカーネルディスパッチ等）をここに実装してください。

    Args:
        step: 現在の世代 (global step)
        inner_step_start: 直前のサブステップ開始番号
        inner_step_count: 直前のサブステップ実行数
        body_state_buf: 全個体の身体状態バッファ [Config.m, 6] (float32: energy, pos.x, pos.y, angle, obj.x, obj.y)
        global_outputs_buf: 全個体のニューロン出力・膜電位バッファ
    """
    pass

mutation_dict = {
    "neuromod_map_all": neuromod_map_buf,
    "inhib_map_all": gen_buf_dict["inhib_sign_map_pout"],
    "signature_pre_map_np2": gen_buf_dict["sig_pre_map_np2_pout"],
    "signature_post_map_np2": gen_buf_dict["sig_post_map_np2_pout"],
    "neuromod_params_all": shared_neuromod_params_buf,
    "resource_params_all": shared_resource_params_buf,
    "link28th_params_all": shared_link28th_params_buf,
    "inout_params_fi_all": shared_inout_params_fi_buf,
    "sig_mutation_params_all": shared_sig_mut_buf,
    "neuromod_map_mutation_params_all": shared_neuromod_map_mut_buf,
    "neuromod_params_mutation_params_all": shared_neuromod_params_mut_buf,
    "iicu_mutation_params_all": shared_iicu_mut_buf,
    "rlmu_mutation_params_all": shared_rlmu_mut_buf,
    "mutation_rate_all": mutation_rate_buf,
    "total": Config.m,
    "step": 0
}

timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
log_filename = f"logs/log_solar_{timestamp_str}.csv"
checkpoint_dir = f"backups/checkpoint_{timestamp_str}"
top20_dir = os.path.join(checkpoint_dir, "top20")
os.makedirs("logs", exist_ok=True)
os.makedirs(checkpoint_dir, exist_ok=True)
os.makedirs(top20_dir, exist_ok=True)

BASE_ENERGY = INITIAL_ENERGY

with open(log_filename, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["step", "elapsed_sec", "passed_ge2", "stay_base", "elite_ge04", "mean_energy", "max_energy", "top10_energy"])

print(f"[+] 太陽光発電タスク（N={Config.N}, 初期エネルギー={BASE_ENERGY}）を開始します！")
print(f"[+] ログ: '{log_filename}'")
print(f"[+] エリート保存先: '{checkpoint_dir}/'")


def get_current_energies() -> np.ndarray:
    """GPUから現在のエネルギー配列を取得する"""
    raw_bytes = mutation_rate_buf.to_numpy()
    if raw_bytes.nbytes == Config.m * 2:
        return raw_bytes.view(np.float16).astype(np.float32)
    return raw_bytes.view(np.float32)


def save_top_k_elites(step_num: int, energies: np.ndarray, k: int = 20):
    """上位 k 体の遺伝子を一括でGPUから抜き出して保存する（EliteManagerに委譲）"""
    print(f"\n[+] 終了処理: Step {step_num} 時点の上位 {k} 体を '{top20_dir}/' に保存しています...")
    device.wait()
    EliteManager.save_top_k(
        target_dir=top20_dir,
        energies=energies,
        step=step_num,
        config=Config,
        gen_buf_dict=gen_buf_dict,
        neuromod_map_buf=neuromod_map_buf,
        shared_resource_params_buf=shared_resource_params_buf,
        shared_link28th_params_buf=shared_link28th_params_buf,
        shared_neuromod_params_buf=shared_neuromod_params_buf,
        shared_inout_params_fi_buf=shared_inout_params_fi_buf,
        k=k,
        sync_latest_best=True,
        backups_root="backups",
        shared_sig_mut_buf=shared_sig_mut_buf,
        shared_neuromod_map_mut_buf=shared_neuromod_map_mut_buf,
        shared_neuromod_params_mut_buf=shared_neuromod_params_mut_buf,
        shared_iicu_mut_buf=shared_iicu_mut_buf,
        shared_rlmu_mut_buf=shared_rlmu_mut_buf,
    )
    print(f"[★] 上位 {k} 体の保存完了 & backups/latest_best.npz 同期完了！")


TOTAL_STEPS = args.steps if args.steps is not None else int(os.environ.get("VB_TOTAL_STEPS", "50000"))
WAIT_INTERVAL = max(1, args.wait_interval if args.wait_interval is not None else int(os.environ.get("VB_WAIT_INTERVAL", "1")))
STOP_FILE = args.stop_file if args.stop_file is not None else os.environ.get("VB_STOP_FILE", "")
best_max_energy = BASE_ENERGY + 0.005
last_completed_step = 0
latest_energies = np.zeros(Config.m, dtype=np.float32)

periodic_save_interval = EliteManager.calculate_save_interval(TOTAL_STEPS)

interval_start_time = time.perf_counter()
interval_steps = 0

mode_str = (
    f"VRAM書き戻し分割モード ({Config.sub_inner_steps}st/chunk, 全{Config.inner_steps}st)"
    if Config.is_vram_sync_mode
    else f"一括モード ({Config.inner_steps}st)"
)
print(f"[+] 実行設定: 総ステップ数={TOTAL_STEPS}, 推論={mode_str}, GPU同期(wait)間隔={WAIT_INTERVAL}st, 定期保存間隔={periodic_save_interval}st")

for step in range(TOTAL_STEPS):
    if stop_requested:
        break

    interval_steps += 1
    has_stop_signal = bool(STOP_FILE and os.path.exists(STOP_FILE))
    # 同期ステップ: 初回(step==0), 指定間隔(interval_steps >= WAIT_INTERVAL), 最終ステップ, または停止要求時
    is_sync_step = (step == 0) or (interval_steps >= WAIT_INTERVAL) or (step == TOTAL_STEPS - 1) or has_stop_signal

    mutation_dict["step"] = step
    
    # -----------------------------------------------------------------
    # 1. まず推論・評価だけを実行する（まだ変異で上書きしない！）
    # -----------------------------------------------------------------
    if not Config.is_vram_sync_mode:
        reasoning_sim_dict["step"] = step
        kernel_reasoning.dispatch(
            thread_count=(Config.m * Config.N, Config.N, Config.N),
            **reasoning_sim_dict
        )
    else:
        reasoning_step_dict["step"] = step
        # 1-1. 各個体の初期化ディスパッチ (is_init = 1)
        reasoning_step_dict["is_init"] = 1
        reasoning_step_dict["inner_step_start"] = 0
        reasoning_step_dict["inner_step_count"] = 0
        kernel_reasoning_step.dispatch(
            thread_count=(Config.m * Config.N, Config.N, Config.N),
            **reasoning_step_dict
        )

        # 1-2. sub_inner_steps ごとに分割実行し、VRAMに状態を書き戻す
        reasoning_step_dict["is_init"] = 0
        for start_s in range(0, Config.inner_steps, Config.sub_inner_steps):
            count_s = min(Config.sub_inner_steps, Config.inner_steps - start_s)
            reasoning_step_dict["inner_step_start"] = start_s
            reasoning_step_dict["inner_step_count"] = count_s
            kernel_reasoning_step.dispatch(
                thread_count=(Config.m * Config.N, Config.N, Config.N),
                **reasoning_step_dict
            )
            # ★ 物理シミュレーション挿入フック
            physics_interaction_hook(step, start_s, count_s, body_state_buf, global_poutputs_buf)
    if is_sync_step:
        device.wait()

    # -----------------------------------------------------------------
    # 2. 同期ステップの場合のみ、エネルギーを取得・集計・ログ出力・保存
    # -----------------------------------------------------------------
    if is_sync_step:
        now = time.perf_counter()
        elapsed_interval = now - interval_start_time
        elapsed_per_step = elapsed_interval / max(1, interval_steps)

        energies = get_current_energies()
        latest_energies = energies
        last_completed_step = step
        
        max_energy  = float(np.max(energies))
        mean_energy = float(np.mean(energies))
        
        gained_count = int(np.count_nonzero(energies > BASE_ENERGY + 0.002))
        stay_count   = int(np.count_nonzero(np.abs(energies - BASE_ENERGY) <= 0.002))
        elite_ge04   = int(np.count_nonzero(energies >= 0.40))
        
        top10 = [round(float(x), 3) for x in np.sort(energies)[::-1][:10]]

        if WAIT_INTERVAL == 1 or interval_steps == 1:
            speed_str = f"{elapsed_per_step:.3f}s"
        else:
            speed_str = f"{elapsed_per_step:.3f}s/step ({elapsed_interval:.2f}s/{interval_steps}st)"

        print(
            f"Step {step:05d} | {speed_str} | "
            f"黒字(>0.2): {gained_count:4d}体 | (静止=0.2: {stay_count:4d}, 0.4+: {elite_ge04:4d}) | "
            f"Max: {max_energy:.3f} | Mean: {mean_energy:.3f} | Top5: {top10[:5]}"
        )

        with open(log_filename, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                step,
                f"{elapsed_per_step:.4f}",
                gained_count,
                stay_count,
                elite_ge04,
                f"{mean_energy:.4f}",
                f"{max_energy:.4f}",
                f'"{top10}"'
            ])
            f.flush()

        # ★ 変異前の「本物の最高個体」を保存！
        if max_energy > best_max_energy:
            best_max_energy = max_energy
            best_idx = int(np.argmax(energies))
            save_path = os.path.join(checkpoint_dir, f"best_step{step}_energy{max_energy:.3f}_id{best_idx}.npz")
            
            best_genome = EliteManager.extract_genome_dict(
                idx=best_idx,
                score=max_energy,
                step=step,
                config=Config,
                gen_buf_dict=gen_buf_dict,
                neuromod_map_buf=neuromod_map_buf,
                shared_resource_params_buf=shared_resource_params_buf,
                shared_link28th_params_buf=shared_link28th_params_buf,
                shared_neuromod_params_buf=shared_neuromod_params_buf,
                shared_inout_params_fi_buf=shared_inout_params_fi_buf,
                shared_sig_mut_buf=shared_sig_mut_buf,
                shared_neuromod_map_mut_buf=shared_neuromod_map_mut_buf,
                shared_neuromod_params_mut_buf=shared_neuromod_params_mut_buf,
                shared_iicu_mut_buf=shared_iicu_mut_buf,
                shared_rlmu_mut_buf=shared_rlmu_mut_buf,
            )
            EliteManager.save_single_elite(save_path, best_genome, sync_latest_best=True, backups_root="backups")
            print(f"  [★] 過去最高エリート（変異前・本物）を保存しました -> {save_path} (latest_best.npz 同期済)")

        # ★ 定期チェックポイント保存（総ステップ数から自動計算された間隔で保存）
        if step > 0 and step % periodic_save_interval == 0:
            periodic_dir = os.path.join(checkpoint_dir, f"periodic_step{step:05d}")
            EliteManager.save_top_k(
                target_dir=periodic_dir,
                energies=energies,
                step=step,
                config=Config,
                gen_buf_dict=gen_buf_dict,
                neuromod_map_buf=neuromod_map_buf,
                shared_resource_params_buf=shared_resource_params_buf,
                shared_link28th_params_buf=shared_link28th_params_buf,
                shared_neuromod_params_buf=shared_neuromod_params_buf,
                shared_inout_params_fi_buf=shared_inout_params_fi_buf,
                k=5,
                sync_latest_best=False,
                backups_root="backups",
                shared_sig_mut_buf=shared_sig_mut_buf,
                shared_neuromod_map_mut_buf=shared_neuromod_map_mut_buf,
                shared_neuromod_params_mut_buf=shared_neuromod_params_mut_buf,
                shared_iicu_mut_buf=shared_iicu_mut_buf,
                shared_rlmu_mut_buf=shared_rlmu_mut_buf,
            )
            print(f"  [💾] 定期チェックポイント保存完了 (Top 5) -> {periodic_dir}/")

        # 次のインターバルに向けてタイマーリセット
        interval_start_time = time.perf_counter()
        interval_steps = 0

    # ★ 最終ステップ、または Ctrl+C / 安全停止が押されていたら「変異（上書き）せず」にループを抜ける！
    if has_stop_signal:
        print("\n[!] 停止リクエストを検知しました。現在のステップの上位20体を保存して安全に終了します...")
        stop_requested = True
    if stop_requested or step == TOTAL_STEPS - 1:
        break

    # -----------------------------------------------------------------
    # 3. 最後に次世代への突然変異を実行する
    # -----------------------------------------------------------------
    kernel_mutation.dispatch(
        thread_count=(Config.m * Config.N, Config.N, Config.N),
        **mutation_dict
    )
    if is_sync_step:
        device.wait()

# =====================================================================
# ループ終了時（変異で上書きされる前の純粋な上位20体を一括保存！）
# =====================================================================
device.wait()
if last_completed_step != step:
    latest_energies = get_current_energies()
    last_completed_step = step
save_top_k_elites(last_completed_step, latest_energies, k=20)
print("wow")