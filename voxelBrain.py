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


def force_exit_handler(signum, frame):
    print("\n[!] Ctrl+C を検知しました。GPUを待たずに即時強制終了します...")
    os._exit(0)
    
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
    dim: int = 3
    N: int = 1 << dim
    P: int = N + 2
    shift_x: int = 0
    shift_y: int = dim
    shift_z: int = dim * 2
    total_cells: int = 1 << (dim * 3)
    mask: int = N - 1
    
    m: int = 1 << 13
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
    multiplier = R(int, 0, 511, odd=True)
    bias = R(int, 0, 511)


class NeuronResourceRange:
    base_output = R(float, 0.001, 0.05, log=True)
    beta = R(float, 0.2, 1.2)
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
        source_code = f"#define DIM {Config.dim}\n" + f.read()
    
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
inhib_sign_map = np.zeros(Config.m * Config.N * Config.N * Config.N // 32, dtype=np.uint32)

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
pos_buf = device.create_buffer(
    data=np.zeros((Config.m, 2), dtype=np.float32),
    usage=spy.BufferUsage.unordered_access,
)
obj_pos_buf = device.create_buffer(
    data=np.random.uniform(-Config.world_size, Config.world_size, size=(Config.m, 2)).astype(np.float32),
    usage=spy.BufferUsage.unordered_access,
)
bool_passed_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.uint32),
    usage=spy.BufferUsage.unordered_access,
)
goal_count_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.uint32),
    usage=spy.BufferUsage.unordered_access,
)

shared_resource_params_buf = cast_and_buffer(genesis_params.resource_params, device)
shared_link27th_params_buf = cast_and_buffer(genesis_params.link27th_params, device)
shared_learning_params_buf = cast_and_buffer(genesis_params.learning_params, device)
shared_mutation_params_buf = cast_and_buffer(create_mutation_params_buffers(Config.m, 42), device)

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
    "object_pos_all": obj_pos_buf,
    "position_all": pos_buf,
    "bool_passed_all": bool_passed_buf,
    "goal_count_all": goal_count_buf,
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
    "bool_passed_all": bool_passed_buf,
    "total": Config.m
}


for step in range(1000):  
    start_time_output = time.perf_counter()
    reasoning_sim_dict["step"] = step
    
    kernel_reasoning.dispatch(
        thread_count=(Config.m * Config.N, Config.N, Config.N),
        **reasoning_sim_dict
    )
    
    kernel_mutation.dispatch(
        thread_count=(Config.m * Config.N, Config.N, Config.N),
        **mutation_dict
    )

    if step % 1 == 0:
        device.wait()
        end_time_output = time.perf_counter()
        elapsed_time_output = end_time_output - start_time_output

        print(f"output処理時間: {elapsed_time_output:.6f} 秒")
        goal_counts = goal_count_buf.to_numpy().view(np.uint32)

        total_goals = np.sum(goal_counts)
        max_goals = np.max(goal_counts)
        passed_agents = np.count_nonzero(goal_counts)

        print(f"=== ゴール統計(step: {step}) ===")
        print(f"総ゴール回数       : {total_goals} 回")
        print(f"最大ゴール回数(個体): {max_goals} 回")
        print(f"ゴール達成個体数   : {passed_agents} / {Config.m}")
        print(f"上位10個体のゴール数: {np.sort(goal_counts)[::-1][:10]}")

print("wow")