import numpy as np
from jaxtyping import Float64, Float16, Int8
from dataclasses import dataclass, field, fields
import vnoise #type: ignore
from typing import Annotated, get_type_hints, Protocol, runtime_checkable, Any
import slangpy as spy
import dataclasses
import time


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
            return rng.integers(self.val_min, self.val_max, size=(count, 4))
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
    
    m: int = 1 << 17
    
    class Seed:
        sigpre: int = 1;
        sigpost: int = 2;
        dop: int = 3;
        sleep: int = 4;
        inhib: int = 5;
        link: int = 6;
        res: int = 7;
        learn: int = 9;


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
    
    


def generate(cls, seed: int) -> dict["str", np.ndarray]:
    params_dict = {}
    for key, value in vars(cls).items():
        if not key.startswith("__"):
            if isinstance(value, Generatable):
                params_dict[key] = value.generate(Config.m, seed)
    return params_dict






@dataclass(frozen=True, slots=True)
class GenesisParams:
    signature_pre_params: dict["str", np.ndarray]
    signature_post_params: dict["str", np.ndarray]
    dopamine_params: dict["str", np.ndarray]
    sleep_params: dict["str", np.ndarray]
    inhib_params: dict["str", np.ndarray]
    resource_params: dict["str", np.ndarray]
    link27th_params: dict["str", np.ndarray]
    learning_params: dict["str", np.ndarray]

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


device = spy.create_device()


def cast_and_buffer(ndarray_dict: dict[str, np.ndarray], device: spy.Device):
    buf_dict = {}
    for key, value in ndarray_dict.items():
        if np.issubdtype(value.dtype, np.floating):
            target_type = np.float16
        elif np.issubdtype(value.dtype, np.integer):
            target_type = np.int32
        else:
            raise TypeError("この関数に入れるndarrayはすべてintかfloatでなければいけません。")       
        val_conti = np.ascontiguousarray(value, dtype=target_type)
        if "pout" in key:
            buf_val = device.create_buffer(data=val_conti, usage=spy.BufferUsage.unordered_access)
        else:
            buf_val = device.create_buffer(data=val_conti)
        buf_dict[key] = buf_val
    return buf_dict


def dispatch_kernel(device, filename: str, thread_count, params_dict: dict):
    with open(filename + ".slang", "r", encoding="utf-8") as f:
        source_code = f"#define DIM {Config.dim}\n" + f.read()

    module = device.load_module_from_source("kernel" + filename, source_code)
    entry = module.entry_point("main")
    program = device.link_program([module], [entry])
    kernel = device.create_compute_kernel(program)
    
    params_buf_dict = {}
    
    for key, value in params_dict.items():
        if isinstance(value, np.ndarray):
            data_type: np.dtype = value.dtype
            val_conti = np.ascontiguousarray(value, dtype=data_type)
            if "pout" in key:
                buf_val = device.create_buffer(data=val_conti, usage=spy.BufferUsage.unordered_access)
            else:
                buf_val = device.create_buffer(data=val_conti)
            params_buf_dict[key] = buf_val
            continue
        params_buf_dict[key] = value
    
    kernel.dispatch(
        thread_count=thread_count,
        **params_buf_dict
        )
    
    return params_buf_dict




sig_pre_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
sig_post_map_np2 = np.zeros(Config.m * Config.P * Config.P * Config.P * 4, dtype=np.half)
dopamine_map = np.zeros(Config.m * Config.N * Config.N * Config.N, dtype=np.half)
sleep_map = np.zeros(Config.m * Config.N * Config.N * Config.N, dtype=np.half)
inhib_sign_map = np.zeros(Config.m * Config.N * Config.N * Config.N, dtype=np.half)


generation_dict = {
    "sig_pre_map_np2_pout": sig_pre_map_np2,
    "sig_post_map_np2_pout": sig_post_map_np2,
    "dopamine_map_pout": dopamine_map,
    "sleep_map_pout": sleep_map,
    "inhib_sign_map_pout": inhib_sign_map,
    "sig_pre_genes": cast_and_buffer(genesis_params.signature_pre_params, device),
    "sig_post_genes": cast_and_buffer(genesis_params.signature_post_params, device),
    "dopamine_genes": cast_and_buffer(genesis_params.dopamine_params, device),
    "sleep_genes": cast_and_buffer(genesis_params.sleep_params, device),
    "inhib_genes": cast_and_buffer(genesis_params.inhib_params, device)
}

start_time_gen = time.perf_counter()

genesis_out_dict = dispatch_kernel(
    device = device,
    filename="generation",
    thread_count=(Config.m * Config.N, Config.N, Config.N),
    params_dict=generation_dict
)



end_time_gen = time.perf_counter()
elapsed_time_gen = end_time_gen - start_time_gen

print(f"gen処理時間: {elapsed_time_gen:.6f} 秒")


start_time_weight = time.perf_counter()

pout_np = np.zeros(Config.m * Config.N * Config.N * Config.N * 28, dtype=np.float16)


signature_pre_map = genesis_out_dict["sig_pre_map_np2_pout"]
signature_post_map = genesis_out_dict["sig_post_map_np2_pout"]
link27th_multipliers = genesis_params.link27th_params["multiplier"]
link27th_biases = genesis_params.link27th_params["bias"]


calc_weight_dict = {
    "signature_pre_map_np2": signature_pre_map,
    "signature_post_map_np2": signature_post_map,
    "weight_map_poutput": pout_np,
    "multipliers": link27th_multipliers.astype(np.int32),
    "biases": link27th_biases.astype(np.int32)
}


buf_out_dict = dispatch_kernel(
    device=device,
    filename="calcWeights",
    thread_count=(Config.m * Config.N, Config.N, Config.N),
    params_dict=calc_weight_dict
)


end_time_weight = time.perf_counter()
elapsed_time_weight = end_time_weight - start_time_weight
print(f"weight処理時間: {elapsed_time_weight:.6f} 秒")


start_time_output = time.perf_counter()


global_poutputs = np.zeros((Config.m, Config.P, Config.P, Config.P), dtype=np.float16)


dopamine_map = genesis_out_dict["dopamine_map_pout"]
sleep_map = genesis_out_dict["sleep_map_pout"]
inhib_map = genesis_out_dict["inhib_sign_map_pout"]

reasoning_dict = {
    "dopamine_map_all": dopamine_map,
    "sleep_map_all": sleep_map,
    "inhib_map_all": inhib_map,
    "weights_map_all": buf_out_dict["weight_map_poutput"],
    "global_poutputs_all": global_poutputs,
    "resource_params_all": cast_and_buffer(genesis_params.resource_params, device),
    "link27th_params_all": cast_and_buffer(genesis_params.link27th_params, device),
    "learning_params_all": cast_and_buffer(genesis_params.learning_params, device)
}

buf_out_reasoning = dispatch_kernel(
    device=device,
    filename="reasoning",
    thread_count=(Config.m*Config.N, Config.N, Config.N),
    params_dict=reasoning_dict
)


end_time_output = time.perf_counter()
elapsed_time_output = end_time_output - start_time_output

print(f"output処理時間: {elapsed_time_output:.6f} 秒")


print("wow")



