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
    
    m: int = 1 << 14
    
    world_size: float = 100.0
    
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


def build_kernel(device, filename: str):
    with open(filename + ".slang", "r", encoding="utf-8") as f:
        source_code = f"#define DIM {Config.dim}\n" + f.read()
    
    module = device.load_module_from_source("kernel" + filename, source_code)
    entry = module.entry_point("main")
    program = device.link_program([module], [entry])
    kernel = device.create_compute_kernel(program)
    return kernel


def create_buf(device: spy.Device, params: np.ndarray | dict[str, np.ndarray]):
    if isinstance(params, np.ndarray):
        return device.create_buffer(data=params)
    
    params_buf_dict = {}
    
    for key, value in params.items():
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

gen_buf_dict = create_buf(device, generation_dict)

start_time_gen = time.perf_counter()


kernel_generation = build_kernel(device, "generation")

kernel_generation.dispatch(
    thread_count=(Config.m * Config.N, Config.N, Config.N),
    **gen_buf_dict
)




end_time_gen = time.perf_counter()
elapsed_time_gen = end_time_gen - start_time_gen

print(f"gen処理時間: {elapsed_time_gen:.6f} 秒")


start_time_weight = time.perf_counter()


kernel_out = build_kernel(device, filename="calcWeights")
    
    
def calc_weight(sig_pre: spy.Buffer, sig_post: spy.Buffer, multipliers: spy.Buffer, bias: spy.Buffer):
    pout_np = np.zeros(Config.m * Config.N * Config.N * Config.N * 28, dtype=np.float16)


    calc_weight_dict = {
        "signature_pre_map_np2": sig_pre,
        "signature_post_map_np2": sig_post,
        "weight_map_poutput": device.create_buffer(data=pout_np, usage=spy.BufferUsage.unordered_access),
        "multipliers": multipliers,
        "biases": bias
    }

    kernel_out.dispatch(
        thread_count=(Config.m * Config.N, Config.N, Config.N),
        **calc_weight_dict
    )
    
    return calc_weight_dict["weight_map_poutput"]

weight_buf = calc_weight(
    sig_pre=gen_buf_dict["sig_pre_map_np2_pout"],
    sig_post=gen_buf_dict["sig_post_map_np2_pout"],
    multipliers=device.create_buffer(data=genesis_params.link27th_params["multiplier"], usage=spy.BufferUsage.unordered_access),
    bias=device.create_buffer(data=genesis_params.link27th_params["bias"].astype(np.int32))
    )

end_time_weight = time.perf_counter()
elapsed_time_weight = end_time_weight - start_time_weight
print(f"weight処理時間: {elapsed_time_weight:.6f} 秒")




global_poutputs_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.P, Config.P, Config.P), dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
    )


membrane_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.P, Config.P, Config.P), dtype=np.float16),
    usage=spy.BufferUsage.unordered_access
    )

synapse_tag_buf = device.create_buffer(
    data=np.zeros((Config.m, Config.P, Config.P, Config.P, 28), dtype=np.float16),
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

reasoning_dict = {
    "dopamine_map_all": gen_buf_dict["dopamine_map_pout"],
    "sleep_map_all": gen_buf_dict["sleep_map_pout"],
    "inhib_map_all": gen_buf_dict["inhib_sign_map_pout"],
    "weights_map_all": weight_buf,
    "global_poutputs_all": global_poutputs_buf,
    "membrane_all": membrane_buf,
    "synapse_tag_all": synapse_tag_buf,
    "resource_params_all": cast_and_buffer(genesis_params.resource_params, device),
    "link27th_params_all": cast_and_buffer(genesis_params.link27th_params, device),
    "learning_params_all": cast_and_buffer(genesis_params.learning_params, device),
    "dopamine_sum": dopamine_sum_buf,
    "sleep_sum": sleep_sum_buf
}




pos_buf = device.create_buffer(
    data=np.zeros((Config.m, 2), dtype=np.float32),
    usage=spy.BufferUsage.unordered_access,
    )

obj_pos_buf = device.create_buffer(
    data=np.random.uniform(-Config.world_size, Config.world_size, size=(Config.m, 2)).astype(np.float32),
    usage=spy.BufferUsage.unordered_access,
    )

goal_count_buf = device.create_buffer(
    data=np.zeros(Config.m, dtype=np.uint32),
    usage=spy.BufferUsage.unordered_access,
    )

sim_dict = {
    "global_poutputs_all": global_poutputs_buf,
    "object_pos_all": obj_pos_buf,
    "membrane_all": membrane_buf,
    "position_all": pos_buf,
    "goal_count_all": goal_count_buf,
    "dt": 0.01,
    "step": 0,
}

kernel_reasoning = build_kernel(device, "reasoning")
kernel_sim = build_kernel(device, "sim")


start_time_output = time.perf_counter()

for step in range(10):
    kernel_reasoning.dispatch(
        thread_count=(Config.m*Config.N, Config.N, Config.N),
        **reasoning_dict
    )
    
    sim_dict["step"] = step

    kernel_sim.dispatch(
        thread_count=(Config.m, 1, 1),
        **sim_dict
    )
    if str(step).endswith("000"):
        device.wait()
    
device.wait()

end_time_output = time.perf_counter()
elapsed_time_output = end_time_output - start_time_output

print(f"output処理時間: {elapsed_time_output:.6f} 秒")


import numpy as np

# =================================================================
# 1. GPUからデータをNumPy配列として回収 & 基本計算
# =================================================================
device.wait() # 確実に計算完了を待機

# ゴール回数と最終座標を取得
goal_counts = goal_count_buf.to_numpy().view(np.uint32)
final_pos = pos_buf.to_numpy().view(np.float32).reshape(-1, 2)

# 原点 (0, 0) からの移動距離を計算
dists = np.linalg.norm(final_pos, axis=1)
m = len(goal_counts)

# =================================================================
# 2. 全体統計の計算 & 表示
# =================================================================
total_goals = int(np.sum(goal_counts))
max_goals = int(np.max(goal_counts))
min_goals = int(np.min(goal_counts))
mean_goals = float(np.mean(goal_counts))
median_goals = float(np.median(goal_counts))
std_goals = float(np.std(goal_counts))

achieved_mask = goal_counts > 0
achieved_count = int(np.sum(achieved_mask))
achieved_rate = (achieved_count / m) * 100

active_mask = dists >= 1.0
active_count = int(np.sum(active_mask))

print("\n" + "=" * 65)
print("                   📊 シミュレーション結果統計")
print("=" * 65)
print(f"  総個体数 (m)        : {m:,} 体")
print(f"  総ゴール回数        : {total_goals:,} 回")
print(f"  ゴール達成個体数    : {achieved_count:,} 体 ({achieved_rate:.2f}%)")
print(f"  自力で歩けた個体(≧1.0): {active_count:,} 体 ({active_count / m * 100:.2f}%)")
print("-" * 65)
print(f"  最大ゴール数 (Max)  : {max_goals} 回")
print(f"  平均ゴール数 (Mean) : {mean_goals:.3f} 回")
print(f"  中央値 (Median)     : {median_goals:.1f} 回")
print(f"  標準偏差 (Std)      : {std_goals:.3f}")
print("=" * 65)

# =================================================================
# 3. ゴール回数の度数分布
# =================================================================
print("\n[ゴール回数ごとの個体分布]")
unique_counts, num_agents = np.unique(goal_counts, return_counts=True)
for count, num in zip(unique_counts[:10], num_agents[:10]):
    bar = "■" * int((num / m) * 40)
    print(f"  {count:3d} 回ゴール : {num:6,d} 体 ({num / m * 100:5.1f}%) | {bar}")
if len(unique_counts) > 10:
    remaining_num = np.sum(num_agents[10:])
    print(f"  それ以上    : {remaining_num:6,d} 体 ({remaining_num / m * 100:5.1f}%)")

# =================================================================
# 4. 🏆 ゴール回数 上位 15 個体（移動距離つき！）
# =================================================================
top_k_goal = 15
sorted_by_goal = np.argsort(goal_counts)[::-1]  # ゴール数の降順ソート

print(f"\n[🏆 ゴール回数 上位 {top_k_goal} 個体（運動実績つき）]")
print("  順位 | 個体ID (index) | ゴール回数 | 移動距離 | 最終座標 (X, Y)")
print("  -----+----------------+------------+----------+-----------------------")
for rank in range(min(top_k_goal, m)):
    idx = sorted_by_goal[rank]
    count = goal_counts[idx]
    d = dists[idx]
    x, y = final_pos[idx]
    print(f"   {rank+1:2d}位 | ID: {idx:10d} |   {count:4d} 回  | {d:7.2f}  | ({x:6.2f}, {y:6.2f})")
print("=" * 65)

# =================================================================
# 5. 🏃 移動距離 上位 20 体
# =================================================================
top_k_dist = 20
sorted_by_dist = np.argsort(dists)[::-1]  # 移動距離の降順ソート

best_mover_id = sorted_by_dist[0]
best_dist = dists[best_mover_id]
best_goals = goal_counts[best_mover_id]
best_pos = final_pos[best_mover_id]

print(f"\n[🏃 移動距離 上位 {top_k_dist} 体（最大チャンピオン: ID {best_mover_id} / 距離 {best_dist:.2f} / ゴール {best_goals}回）]")
print("  順位 | 個体ID (index) | 移動距離 | ゴール回数 | 最終座標 (X, Y)")
print("  -----+----------------+----------+------------+-----------------------")
for rank in range(min(top_k_dist, len(dists))):
    idx = sorted_by_dist[rank]
    d = dists[idx]
    g = goal_counts[idx]
    x, y = final_pos[idx]
    print(f"   {rank+1:2d}位 | ID: {idx:10d} | {d:7.2f}  |   {g:2d} 回   | ({x:6.2f}, {y:6.2f})")
print("=" * 65)


print("wow")
