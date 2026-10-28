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

try:
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
except Exception:
    pass

from sim_config import (
    ENABLE_LEARNING,
    ENABLE_DOPAMINE,
    ENABLE_SLEEP,
    INITIAL_ENERGY,
    METABOLIC_COST,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SUN_CYCLE_PERIOD,
)


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
    
    class Seed:
        sigpre: int = 1
        sigpost: int = 2
        dop: int = 3
        sleep: int = 4
        inhib: int = 5
        link: int = 6
        res: int = 7
        learn: int = 8


class SigRange:
    seeds = R4(int, 0, 1<<20)
    biases = R4(float, -0.5, 0.5)
    freqs = R4(float, 0.0, 1.0)
    cutoffs = R4(float, 0.0, 0.95)


class DopSleepRange:
    seed = R(int, 0, 1<<20)
    bias = R(float, -0.5, 0.5)
    freq = R(float, 0.0, 1.0)
    cutoff = R(float, 0.0, 0.95)


class InhibRange:
    seed = R(int, 0, 1<<20)
    speed = R(float, 1.0, 2.0)
    cutoff = R(float, 0.0, 1.5)
    steps = R(int, 1, 200)
    base = R(float, 0.0, 0.0)
    threshold = R(float, 0.0, 1.0)


class Link27thRange:
    multiplier = R(int, 0, Config.total_cells - 1, odd=True)
    bias = R(int, 0, Config.total_cells - 1)


class NeuronResourceRange:
    base_output = R(float, 0.001, 0.1, log=True)
    beta = R(float, 15.0, 30.0)
    k_refill = R(float, 0.02, 0.3)


class LearningRange:
    learning_rate = R(float, 0.0, 1.0)
    forget_rate = R(float, 0.0, 1.0)
    learning_threshold = R(float, 0.0, 1.0)
    tag_decay = R(float, 0.7, 0.99)


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
    dopamine_params: dict[str, np.ndarray]
    sleep_params: dict[str, np.ndarray]
    inhib_params: dict[str, np.ndarray]
    resource_params: dict[str, np.ndarray]
    link27th_params: dict[str, np.ndarray]
    learning_params: dict[str, np.ndarray]

    @classmethod
    def new(cls) -> "GenesisParams":
        return cls(
            signature_pre_params=generate(SigRange, Config.Seed.sigpre),
            signature_post_params=generate(SigRange, Config.Seed.sigpost),
            dopamine_params=generate(DopSleepRange, Config.Seed.dop),
            sleep_params=generate(DopSleepRange, Config.Seed.sleep),
            inhib_params=generate(InhibRange, Config.Seed.inhib),
            resource_params=generate(NeuronResourceRange, Config.Seed.res),
            link27th_params=generate(Link27thRange, Config.Seed.link),
            learning_params=generate(LearningRange, Config.Seed.learn)
        )


genesis_params = GenesisParams.new()
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


def build_kernel(device, filename: str):
    with open(filename + ".slang", "r", encoding="utf-8") as f:
        defines = (
            f"#define DIM {Config.dim}\n"
            f"#define USE_LEARNING {1 if float(ENABLE_LEARNING) > 0.0 else 0}\n"
            f"#define ENABLE_LEARNING {float(ENABLE_LEARNING)}h\n"
            f"#define USE_DOPAMINE {1 if float(ENABLE_DOPAMINE) > 0.0 else 0}\n"
            f"#define ENABLE_DOPAMINE {float(ENABLE_DOPAMINE)}h\n"
            f"#define USE_SLEEP {1 if float(ENABLE_SLEEP) > 0.0 else 0}\n"
            f"#define ENABLE_SLEEP {float(ENABLE_SLEEP)}h\n"
            f"#define INITIAL_ENERGY {INITIAL_ENERGY}f\n"
            f"#define METABOLIC_COST {METABOLIC_COST}f\n"
            f"#define GEN_COST_RATE {GEN_COST_RATE}f\n"
            f"#define SOLAR_GAIN_RATE {SOLAR_GAIN_RATE}f\n"
            f"#define SUN_CYCLE_PERIOD {SUN_CYCLE_PERIOD}f\n"
        )
        source_code = defines + f.read()
    
    module = device.load_module_from_source("kernel" + filename, source_code)
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

    sig_pre_threshold  = rng.uniform(0.7, 0.95, size=(num_groups, 4)).astype(np.float16)
    sig_post_threshold = rng.uniform(0.7, 0.95, size=(num_groups, 4)).astype(np.float16)
    
    other_threshold = np.zeros((num_groups, 4), dtype=np.float16)
    other_threshold[:, 0] = rng.uniform(0.6, 0.9, size=num_groups)  # dopamine
    other_threshold[:, 1] = rng.uniform(0.6, 0.9, size=num_groups)  # sleep
    other_threshold[:, 2] = rng.uniform(0.8, 0.98, size=num_groups) # inhib (反転確率)

    steps = rng.integers(0, 6, size=(num_groups, 4), dtype=np.uint32)

    max_safe_diff = 1.0 / 27.0
    sig_pre_diff  = rng.uniform(0.005, max_safe_diff, size=(num_groups, 4)).astype(np.float16)
    sig_post_diff = rng.uniform(0.005, max_safe_diff, size=(num_groups, 4)).astype(np.float16)
    
    other_diff = np.zeros((num_groups, 4), dtype=np.float16)
    other_diff[:, 0] = rng.uniform(0.005, max_safe_diff, size=num_groups)
    other_diff[:, 1] = rng.uniform(0.005, max_safe_diff, size=num_groups)

    sig_pre_max  = rng.uniform(0.01, 0.1, size=(num_groups, 4)).astype(np.float16)
    sig_post_max = rng.uniform(0.01, 0.1, size=(num_groups, 4)).astype(np.float16)
    
    other_max = np.zeros((num_groups, 4), dtype=np.float16)
    other_max[:, 0] = rng.uniform(0.01, 0.1, size=num_groups)
    other_max[:, 1] = rng.uniform(0.01, 0.1, size=num_groups)

    resource_threshold = np.zeros((num_groups, 4), dtype=np.float16)
    resource_threshold[:, 0] = rng.uniform(0.85, 0.98, size=num_groups)
    resource_threshold[:, 1] = rng.uniform(0.85, 0.98, size=num_groups)
    resource_threshold[:, 2] = rng.uniform(0.85, 0.98, size=num_groups)

    link27th_threshold = rng.uniform(0.85, 0.98, size=(num_groups, 2)).astype(np.float16)

    learning_threshold = rng.uniform(0.85, 0.98, size=(num_groups, 4)).astype(np.float16)

    mutate_threshold = rng.uniform(0.9, 0.99, size=(num_groups, 4)).astype(np.float16)

    return {
        "sig_pre_threshold":  sig_pre_threshold,
        "sig_post_threshold": sig_post_threshold,
        "other_threshold":    other_threshold,
        "steps":              steps,
        "sig_pre_diff":       sig_pre_diff,
        "sig_post_diff":      sig_post_diff,
        "other_diff":         other_diff,
        "sig_pre_max":        sig_pre_max,
        "sig_post_max":       sig_post_max,
        "other_max":          other_max,
        "resource_threshold": resource_threshold,
        "link27th_threshold": link27th_threshold,
        "learning_threshold": learning_threshold,
        "mutate_threshold":   mutate_threshold,
    }


kernel_generation = build_kernel(device, "generation")
kernel_reasoning = build_kernel(device, "reasoningSim")
kernel_mutation = build_kernel(device, "mutation")

sig_pre_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
sig_post_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
dopamine_map = np.zeros(Config.m * Config.N * Config.N * Config.N, dtype=np.half)
sleep_map = np.zeros(Config.m * Config.N * Config.N * Config.N, dtype=np.half)
inhib_sign_map = np.zeros(Config.m * Config.inhib_stride, dtype=np.uint32)

generation_dict = {
    "sig_pre_map_np2_pout": sig_pre_map_np2,
    "sig_post_map_np2_pout": sig_post_map_np2,
    "dopamine_map_pout": dopamine_map,
    "sleep_map_pout": sleep_map,
    "inhib_sign_map_pout": inhib_sign_map,
    "sig_pre_genes": cast_and_buffer(genesis_params.signature_pre_params, device, float_dtype=np.float32),
    "sig_post_genes": cast_and_buffer(genesis_params.signature_post_params, device, float_dtype=np.float32),
    "dopamine_genes": cast_and_buffer(genesis_params.dopamine_params, device, float_dtype=np.float32),
    "sleep_genes": cast_and_buffer(genesis_params.sleep_params, device, float_dtype=np.float32),
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
synapse_tag_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.N, Config.N, Config.N, 7), dtype=np.uint32),
    usage=spy.BufferUsage.unordered_access
)
dopamine_sum_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
)
sleep_sum_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
)
mutation_rate_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.float32),
    usage=spy.BufferUsage.unordered_access,
)

shared_resource_params_buf = cast_and_buffer(genesis_params.resource_params, device)
shared_link27th_params_buf = cast_and_buffer(genesis_params.link27th_params, device)
shared_learning_params_buf = cast_and_buffer(genesis_params.learning_params, device)
shared_mutation_params_buf = cast_and_buffer(create_mutation_params_buffers(Config.m, 42), device)


def load_and_distribute_all_elites(folder_path: str):
    file_list = sorted(glob.glob(os.path.join(folder_path, "*.npz")))
    if not file_list:
        print(f"[!] フォルダ内に .npz ファイルが見つかりません: {folder_path}")
        return

    num_elites = len(file_list)
    print(f"\n[★] {num_elites} 個のエリート遺伝子を発見しました！")
    print(f"    1系統あたり約 {Config.m // num_elites} 体ずつ、全 {Config.m} 体に均等配分します...")

    elites = [np.load(f) for f in file_list]
    assign = np.arange(Config.m) % num_elites

    # --- 1. 空間マップ（脳の配線）の均等配分 ---
    sig_pre_all  = np.stack([e["sig_pre"] for e in elites])[assign].reshape(-1).astype(np.float16)
    sig_post_all = np.stack([e["sig_post"] for e in elites])[assign].reshape(-1).astype(np.float16)
    dopamine_all = np.stack([e["dopamine"] for e in elites])[assign].reshape(-1).astype(np.float16)
    sleep_all    = np.stack([e["sleep"] for e in elites])[assign].reshape(-1).astype(np.float16)
    inhib_all    = np.stack([e["inhib"] for e in elites])[assign].reshape(-1).astype(np.uint32)

    gen_buf_dict["sig_pre_map_np2_pout"].copy_from_numpy(sig_pre_all)
    gen_buf_dict["sig_post_map_np2_pout"].copy_from_numpy(sig_post_all)
    gen_buf_dict["dopamine_map_pout"].copy_from_numpy(dopamine_all)
    gen_buf_dict["sleep_map_pout"].copy_from_numpy(sleep_all)
    gen_buf_dict["inhib_sign_map_pout"].copy_from_numpy(inhib_all)

    # --- 2. 神経パラメータの均等配分 ---
    shared_resource_params_buf["base_output"].copy_from_numpy(
        np.array([e["resource_base_output"] for e in elites], dtype=np.float16)[assign]
    )
    shared_resource_params_buf["beta"].copy_from_numpy(
        np.array([e["resource_beta"] for e in elites], dtype=np.float16)[assign]
    )
    shared_resource_params_buf["k_refill"].copy_from_numpy(
        np.array([e["resource_k_refill"] for e in elites], dtype=np.float16)[assign]
    )

    shared_link27th_params_buf["multiplier"].copy_from_numpy(
        np.array([e["link_multiplier"] for e in elites], dtype=np.int32)[assign]
    )
    shared_link27th_params_buf["bias"].copy_from_numpy(
        np.array([e["link_bias"] for e in elites], dtype=np.int32)[assign]
    )

    shared_learning_params_buf["learning_rate"].copy_from_numpy(
        np.array([e["learn_rate"] for e in elites], dtype=np.float16)[assign]
    )
    shared_learning_params_buf["forget_rate"].copy_from_numpy(
        np.array([e["learn_forget"] for e in elites], dtype=np.float16)[assign]
    )
    shared_learning_params_buf["learning_threshold"].copy_from_numpy(
        np.array([e["learn_threshold"] for e in elites], dtype=np.float16)[assign]
    )
    shared_learning_params_buf["tag_decay"].copy_from_numpy(
        np.array([e["learn_decay"] for e in elites], dtype=np.float16)[assign]
    )

    print("[★] 全8,192体への多系統エリート配分が完了しました！\n")


LOAD_CHECKPOINT_FOLDER = os.environ.get("VB_LOAD_FOLDER", "backups/elites")
load = os.environ.get("VB_LOAD_ELITES", "0") == "1"

if LOAD_CHECKPOINT_FOLDER and os.path.exists(LOAD_CHECKPOINT_FOLDER) and load is True:
    load_and_distribute_all_elites(LOAD_CHECKPOINT_FOLDER)

reasoning_sim_dict = {
    "dopamine_map_all": gen_buf_dict["dopamine_map_pout"],
    "sleep_map_all": gen_buf_dict["sleep_map_pout"],
    "inhib_map_all": gen_buf_dict["inhib_sign_map_pout"],
    "global_poutputs_all": global_poutputs_buf,
    "membrane_all": membrane_buf,
    "synapse_tag_all": synapse_tag_buf,
    "signature_pre_map_np2": gen_buf_dict["sig_pre_map_np2_pout"],
    "signature_post_map_np2": gen_buf_dict["sig_post_map_np2_pout"],
    "resource_params_all": shared_resource_params_buf,
    "link27th_params_all": shared_link27th_params_buf,
    "learning_params_all": shared_learning_params_buf,
    "dopamine_sum": dopamine_sum_buf,
    "sleep_sum": sleep_sum_buf,
    "mutation_rate_all": mutation_rate_buf,
    "dt": 0.01,
    "step": 0,
}

mutation_dict = {
    "dopamine_map_all": gen_buf_dict["dopamine_map_pout"],
    "sleep_map_all": gen_buf_dict["sleep_map_pout"],
    "inhib_map_all": gen_buf_dict["inhib_sign_map_pout"],
    "signature_pre_map_np2": gen_buf_dict["sig_pre_map_np2_pout"],
    "signature_post_map_np2": gen_buf_dict["sig_post_map_np2_pout"],
    "resource_params_all": shared_resource_params_buf,
    "link27th_params_all": shared_link27th_params_buf,
    "learning_params_all": shared_learning_params_buf,
    "mutation_params_all": shared_mutation_params_buf,
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
    """上位 k 体の遺伝子を一括でGPUから抜き出して保存する"""
    print(f"\n[+] 終了処理: Step {step_num} 時点の上位 {k} 体を '{top20_dir}/' に保存しています...")
    device.wait()

    # 上位 k 個体のインデックスを取得（降順）
    top_indices = np.argsort(energies)[::-1][:k]

    # GPU→CPU転送を1回だけで済ませるため、最初に全配列を取得
    P_cube_4   = Config.P * Config.P * Config.P * 4
    N_cube     = Config.N * Config.N * Config.N
    INHIB_SIZE = Config.inhib_stride

    sig_pre_all  = gen_buf_dict["sig_pre_map_np2_pout"].to_numpy().view(np.float16)
    sig_post_all = gen_buf_dict["sig_post_map_np2_pout"].to_numpy().view(np.float16)
    dopamine_all = gen_buf_dict["dopamine_map_pout"].to_numpy().view(np.float16)
    sleep_all    = gen_buf_dict["sleep_map_pout"].to_numpy().view(np.float16)
    inhib_all    = gen_buf_dict["inhib_sign_map_pout"].to_numpy().view(np.uint32)

    res_base   = shared_resource_params_buf["base_output"].to_numpy().view(np.float16)
    res_beta   = shared_resource_params_buf["beta"].to_numpy().view(np.float16)
    res_refill = shared_resource_params_buf["k_refill"].to_numpy().view(np.float16)
    link_mult  = shared_link27th_params_buf["multiplier"].to_numpy().view(np.int32)
    link_bias  = shared_link27th_params_buf["bias"].to_numpy().view(np.int32)
    lr_rate    = shared_learning_params_buf["learning_rate"].to_numpy().view(np.float16)
    lr_forget  = shared_learning_params_buf["forget_rate"].to_numpy().view(np.float16)
    lr_thresh  = shared_learning_params_buf["learning_threshold"].to_numpy().view(np.float16)
    lr_decay   = shared_learning_params_buf["tag_decay"].to_numpy().view(np.float16)

    for rank, idx in enumerate(top_indices, start=1):
        idx = int(idx)
        score = float(energies[idx])
        save_path = os.path.join(top20_dir, f"rank{rank:02d}_step{step_num}_energy{score:.3f}_id{idx}.npz")

        np.savez_compressed(
            save_path,
            step=step_num,
            score=score,
            enable_learning=np.float16(ENABLE_LEARNING),
            enable_dopamine=np.float16(ENABLE_DOPAMINE),
            enable_sleep=np.float16(ENABLE_SLEEP),
            sig_pre=sig_pre_all[idx * P_cube_4 : (idx + 1) * P_cube_4],
            sig_post=sig_post_all[idx * P_cube_4 : (idx + 1) * P_cube_4],
            dopamine=dopamine_all[idx * N_cube : (idx + 1) * N_cube],
            sleep=sleep_all[idx * N_cube : (idx + 1) * N_cube],
            inhib=inhib_all[idx * INHIB_SIZE : (idx + 1) * INHIB_SIZE],
            resource_base_output=res_base[idx],
            resource_beta=res_beta[idx],
            resource_k_refill=res_refill[idx],
            link_multiplier=link_mult[idx],
            link_bias=link_bias[idx],
            learn_rate=lr_rate[idx],
            learn_forget=lr_forget[idx],
            learn_threshold=lr_thresh[idx],
            learn_decay=lr_decay[idx],
        )

    print(f"[★] 上位 {k} 体の保存が完了しました！(1位スコア: {energies[top_indices[0]]:.3f} ~ {k}位スコア: {energies[top_indices[-1]]:.3f})")
    first_rank_path = os.path.join(top20_dir, f"rank01_step{step_num}_energy{float(energies[top_indices[0]]):.3f}_id{int(top_indices[0])}.npz")
    print(f"  -> {first_rank_path}")


TOTAL_STEPS = int(os.environ.get("VB_TOTAL_STEPS", "50000"))
STOP_FILE = os.environ.get("VB_STOP_FILE", "")
best_max_energy = BASE_ENERGY + 0.005
last_completed_step = 0
latest_energies = np.zeros(Config.m, dtype=np.float32)

for step in range(TOTAL_STEPS):
    if stop_requested:
        break

    start_time_output = time.perf_counter()
    reasoning_sim_dict["step"] = step
    mutation_dict["step"] = step
    
    # -----------------------------------------------------------------
    # 1. まず推論・評価だけを実行する（まだ変異で上書きしない！）
    # -----------------------------------------------------------------
    kernel_reasoning.dispatch(
        thread_count=(Config.m * Config.N, Config.N, Config.N),
        **reasoning_sim_dict
    )
    device.wait()

    end_time_output = time.perf_counter()
    elapsed_time_output = end_time_output - start_time_output

    # -----------------------------------------------------------------
    # 2. 上書きされる「前」の純粋な状態でエネルギーを取得・集計・保存する！
    # -----------------------------------------------------------------
    energies = get_current_energies()
    latest_energies = energies
    last_completed_step = step
    
    max_energy  = float(np.max(energies))
    mean_energy = float(np.mean(energies))
    
    gained_count = int(np.count_nonzero(energies > BASE_ENERGY + 0.002))
    stay_count   = int(np.count_nonzero(np.abs(energies - BASE_ENERGY) <= 0.002))
    elite_ge04   = int(np.count_nonzero(energies >= 0.40))
    
    top10 = [round(float(x), 3) for x in np.sort(energies)[::-1][:10]]

    print(
        f"Step {step:05d} | {elapsed_time_output:.3f}s | "
        f"黒字(>0.2): {gained_count:4d}体 | (静止=0.2: {stay_count:4d}, 0.4+: {elite_ge04:4d}) | "
        f"Max: {max_energy:.3f} | Mean: {mean_energy:.3f} | Top5: {top10[:5]}"
    )

    with open(log_filename, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            step,
            f"{elapsed_time_output:.4f}",
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
        
        P_cube_4 = Config.P * Config.P * Config.P * 4
        N_cube   = Config.N * Config.N * Config.N
        INHIB_SIZE = Config.inhib_stride
        
        sig_pre_elite  = gen_buf_dict["sig_pre_map_np2_pout"].to_numpy().view(np.float16)[best_idx * P_cube_4 : (best_idx + 1) * P_cube_4]
        sig_post_elite = gen_buf_dict["sig_post_map_np2_pout"].to_numpy().view(np.float16)[best_idx * P_cube_4 : (best_idx + 1) * P_cube_4]
        dopamine_elite = gen_buf_dict["dopamine_map_pout"].to_numpy().view(np.float16)[best_idx * N_cube : (best_idx + 1) * N_cube]
        sleep_elite    = gen_buf_dict["sleep_map_pout"].to_numpy().view(np.float16)[best_idx * N_cube : (best_idx + 1) * N_cube]
        inhib_elite    = gen_buf_dict["inhib_sign_map_pout"].to_numpy().view(np.uint32)[best_idx * INHIB_SIZE : (best_idx + 1) * INHIB_SIZE]

        np.savez_compressed(
            save_path,
            step=step,
            score=max_energy,
            enable_learning=np.float16(ENABLE_LEARNING),
            enable_dopamine=np.float16(ENABLE_DOPAMINE),
            enable_sleep=np.float16(ENABLE_SLEEP),
            sig_pre=sig_pre_elite,
            sig_post=sig_post_elite,
            dopamine=dopamine_elite,
            sleep=sleep_elite,
            inhib=inhib_elite,
            resource_base_output=shared_resource_params_buf["base_output"].to_numpy().view(np.float16)[best_idx],
            resource_beta=shared_resource_params_buf["beta"].to_numpy().view(np.float16)[best_idx],
            resource_k_refill=shared_resource_params_buf["k_refill"].to_numpy().view(np.float16)[best_idx],
            link_multiplier=shared_link27th_params_buf["multiplier"].to_numpy().view(np.int32)[best_idx],
            link_bias=shared_link27th_params_buf["bias"].to_numpy().view(np.int32)[best_idx],
            learn_rate=shared_learning_params_buf["learning_rate"].to_numpy().view(np.float16)[best_idx],
            learn_forget=shared_learning_params_buf["forget_rate"].to_numpy().view(np.float16)[best_idx],
            learn_threshold=shared_learning_params_buf["learning_threshold"].to_numpy().view(np.float16)[best_idx],
            learn_decay=shared_learning_params_buf["tag_decay"].to_numpy().view(np.float16)[best_idx],
        )
        print(f"  [★] 過去最高エリート（変異前・本物）を保存しました -> {save_path}")

    # ★ 最終ステップ、または Ctrl+C が押されていたら「変異（上書き）せず」にループを抜ける！
    if STOP_FILE and os.path.exists(STOP_FILE):
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
    device.wait()

# =====================================================================
# ループ終了時（変異で上書きされる前の純粋な上位20体を一括保存！）
# =====================================================================
save_top_k_elites(last_completed_step, latest_energies, k=20)
print("wow")