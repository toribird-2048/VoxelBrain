import numpy as np
from jaxtyping import Float64, Float16, Int8
from dataclasses import dataclass, field, fields
import vnoise #type: ignore
from typing import Annotated, get_type_hints, Protocol, runtime_checkable, Any
import slangpy as spy
import dataclasses
import time


@runtime_checkable
class Checkable(Protocol):
    def check(self, val: Any) -> None:
        ...

@runtime_checkable
class Generatable(Protocol):
    def generate(self) -> Any:
        ...


@dataclass(frozen=True, slots=True)
class R():
    min_val: float | int
    max_val: float | int
    odd: bool = False
    log: bool = False

    @property
    def val_type(self) -> type:
        return type(self.min_val)

    def __post_init__(self):
        if isinstance(self.min_val, bool):
            raise TypeError("最小値に真偽値を入れることはできません。")
        if isinstance(self.max_val, bool):
            raise TypeError("最大値に真偽値を入れることはできません。")
        if self.odd and self.log:
            raise ValueError("oddフラグとlogフラグを同時に立てることは許可されていません。")
        if type(self.min_val) != type(self.max_val):
            raise TypeError("最小値と最大値の型が一致していません。")
        if self.odd and self.val_type == float:
            raise ValueError("float型にoddフラグを立てることはできません。")
        if self.log and self.val_type == int:
            raise ValueError("int型にlogフラグを立てることはできません。")
        if self.max_val < self.min_val:
            raise ValueError("最大値よりも最小値を大きくすることはできません。")

    def check(self, val: float | int):
        if self.val_type != type(val):
            raise TypeError("範囲と値の型が一致しません。")
        if isinstance(val, bool):
            raise TypeError("範囲チェックする数値に真偽値は入れられません。")
        
        if not self.min_val <= val <= self.max_val:
            raise ValueError(f"値{val}が範囲{self.min_val}~{self.max_val}を外れています。")
        if self.odd and val % 2 != 1:
            raise ValueError(f"値{val}は奇数である必要があります。")

    def generate(self):
        if self.val_type == int:
            if self.odd:
                k_min = (int(self.min_val) + 1) // 2 if self.min_val % 2 == 0 else int(self.min_val) // 2
                k_max = (int(self.max_val) - 1) // 2
                return int(2 * np.random.randint(k_min, k_max + 1) + 1)
            return np.random.randint(self.min_val, self.max_val + 1)

        if self.val_type == float:
            if self.log:
                log_min = np.log10(self.min_val)
                log_max = np.log10(self.max_val)
                return 10 ** np.random.uniform(log_min, log_max)
            return np.random.uniform(self.min_val, self.max_val)
        raise ValueError("UnexpectedError")


@dataclass(frozen=True, slots=True)
class Rgene():
    min_val: np.floating | np.integer
    max_val: np.floating | np.integer

    @property
    def val_type(self) -> type:
        if type(self.min_val) != type(self.max_val):
            raise TypeError("最小値と最大値の型が一致していません。")
        return type(self.min_val)

    def __post_init__(self):
        if type(self.min_val) != type(self.max_val):
            raise TypeError("最小値と最大値の型が一致していません。")
        if self.val_type is bool:
            raise TypeError("最小値に真偽値を入れることはできません。")
        if self.max_val < self.min_val:
            raise ValueError("最大値よりも最小値を大きくすることはできません。")
        if not (np.issubdtype(self.val_type, np.integer) or np.issubdtype(self.val_type, np.floating)):
            raise TypeError("最小値はnp.floating, あるいはnp.integerの型しか取れません。")

    def check(self, val: np.ndarray):
        if not isinstance(val, np.ndarray):
            raise TypeError("チェックする配列はnp.ndarray型である必要があります")
        if not np.issubdtype(val.dtype, self.val_type):
            raise TypeError("範囲と値の型が一致しません。")
        
        if not ((self.min_val <= val) & (val <= self.max_val)).all():
            raise ValueError(f"配列{val}の数値の一部が範囲{self.min_val}~{self.max_val}を外れています。")


def auto_ranged(cls):
    orig_init = cls.__init__
    hints = get_type_hints(cls, include_extras=True)
    for f in fields(cls):
        if f.init == True:
            hint = hints[f.name]
            if hasattr(hint, "__metadata__"):
                if not any(isinstance(meta, Checkable) for meta in hint.__metadata__):
                    raise TypeError("auto_rangedで修飾されたクラスの変数は、Checkableなアノテーションがつけられている必要があります。")
            else:
                raise TypeError("auto_rangedで修飾されたクラスの変数は、アノテーションがつけられている必要があります。")
                    
    def new_init(self, *args, **kwargs):
        orig_init(self, *args, **kwargs)
        for f in fields(self):
            hint = hints[f.name]
            if hasattr(hint, "__metadata__"):
                for meta in hint.__metadata__:
                    if isinstance(meta, Checkable):
                        meta.check(getattr(self, f.name))

    cls.__init__ = new_init
    cls.__auto_ranged__ = True
    return cls


def is_auto_ranged(cls):
    return getattr(cls, "__auto_ranged__", False)


def generate(cls):
    if not is_auto_ranged(cls):
        raise TypeError("generate関数に渡されるクラスはauto_rangedで修飾されている必要があります。")
    hints = get_type_hints(cls, include_extras=True)
    kwargs = {}
    for f in fields(cls):
        if f.init == True:
            hint = hints[f.name]
            if hasattr(hint, "__metadata__"):
                meta = hint.__metadata__
                generatable_meta = next((m for m in meta if isinstance(m, Generatable)), None)
                if generatable_meta is not None:
                    kwargs[f.name] = generatable_meta.generate()
                else:
                    raise TypeError("generate関数に入れるクラスの変数は、固定値以外全てGeneratableである必要があります。")
            else:
                raise TypeError("generate関数に入れるクラスの変数は、固定値以外全てアノテーションが付されている必要があります。")
    return cls(**kwargs)


@dataclass(frozen=True, slots=True)
class NeuronTypeChoiceGene():
    excit: int = 1
    inhib: int = -1

    def check(self, val: np.ndarray):
        if isinstance(val, np.ndarray):
            invalid = (val != self.excit) & (val != self.inhib)
            if invalid.any():
                raise ValueError("配列の値は1, -1のどちらかである必要があります。")


class Config:
    dim: int = 3
    N: int = 1 << dim
    shift_x: int = 0
    shift_y: int = dim
    shift_z: int = dim * 2
    total_cells: int = 1 << (dim * 3)
    mask: int = N - 1


@auto_ranged
@dataclass(frozen=True, slots=True)
class PerlinParams:
    seed: Annotated[int, R(0, 1<<20)]
    bias: Annotated[float, R(-0.5, 5.0)]
    frequency: Annotated[float, R(0.0, 1.0)]
    cutoff: Annotated[float, R(0.0, 0.95)]
    size: Annotated[int, R(0, Config.N+2)]


@auto_ranged
@dataclass(frozen=True, slots=True)
class DopamineParams(PerlinParams):
    size: Annotated[int, R(Config.N, Config.N)] = field(init=False, default=Config.N)


@auto_ranged
@dataclass(frozen=True, slots=True)
class SleepParams(PerlinParams):
    size: Annotated[int, R(Config.N, Config.N)] = field(init=False, default=Config.N)


@auto_ranged
@dataclass(frozen=True, slots=True)
class SignaturePerlinParams(PerlinParams):
    size: Annotated[int, R(Config.N+2, Config.N+2)] = field(init=False, default=Config.N+2)


@auto_ranged
@dataclass(frozen=True, slots=True)
class InhibParams:
    seed: Annotated[int, R(0, 1<<20)]
    speed: Annotated[float, R(1.0, 2.0)]
    cutoff: Annotated[float, R(0.0, 1.5)]
    steps: Annotated[int, R(0, 200)]
    base_value: Annotated[float, R(0.0, 0.0)]
    binarize_threshold: Annotated[float, R(0.0, 1.0)]


@auto_ranged
@dataclass(frozen=True, slots=True)
class Link27thParams:
    multiplier: Annotated[int, R(0, 511, odd=True)]
    bias: Annotated[int, R(0, 511)]


@dataclass(frozen=True, slots=True)
class SignatureParams:
    perlin_w: SignaturePerlinParams
    perlin_x: SignaturePerlinParams
    perlin_y: SignaturePerlinParams
    perlin_z: SignaturePerlinParams


@auto_ranged
@dataclass(frozen=True, slots=True)
class NeuronResourceParams:
    base_output: Annotated[float, R(0.001, 0.05, log=True)]
    beta: Annotated[float, R(0.2, 1.2)]
    k_refill: Annotated[float, R(0.02, 0.3)]


@auto_ranged
@dataclass(slots=True)
class LearningParams:
    learning_rate: Annotated[float, R(0.0, 1.0)]
    forget_rate: Annotated[float, R(0.0, 1.0)]
    learning_threshold: Annotated[float, R(0.0, 1.0)]
    tag_decay: Annotated[float, R(0.7, 0.99)]


def update_lattice(current_map: Float64[np.ndarray, "Iz Iy Ix"], inhib_params: InhibParams):
    s = [slice(0, -2), slice(1, -1), slice(2, None)]

    neighbors = [
        current_map[s[dz], s[dy], s[dx]]
        for dx in range(3)
        for dy in range(3)
        for dz in range(3)
        if not (dx == 1 and dy == 1 and dz == 1)
    ]
    max_neighbor = np.maximum.reduce(neighbors)
    center = current_map[1:-1, 1:-1, 1:-1]
    inner_updated = np.clip(inhib_params.speed * (center - inhib_params.cutoff * max_neighbor), 0.0, 1.0)
    new_map = np.full_like(current_map, fill_value=inhib_params.base_value)
    new_map[1:-1, 1:-1, 1:-1] = inner_updated
    return new_map


def perlin_gen(perlin_params: PerlinParams) -> Float64[np.ndarray, "Nz Ny Nx"]:
    freq = perlin_params.frequency
    size = perlin_params.size
    i = np.arange(size**3)
    x = (i % size).astype(np.float64) * freq
    y = ((i // size) % size).astype(np.float64) * freq
    z = ((i // (size ** 2)) % size).astype(np.float64) * freq
    vn = vnoise.Noise(seed=perlin_params.seed)
    noise = vn.noise3(x, y, z, grid_mode=False)
    bias = perlin_params.bias
    cutoff = perlin_params.cutoff
    return np.clip((noise - cutoff) / (1 - cutoff) + bias, -1.0, 1.0).reshape(size, size, size)


def dopamine_gen(dopamine_params: DopamineParams) -> Float64[np.ndarray, "Dz Dy Dx"]: # N^3
    return np.clip(perlin_gen(dopamine_params), 0.0, 1.0)


def sleep_gen(sleep_params: SleepParams) -> Float64[np.ndarray, "Slz Sly Slx"]: # N^3
    return np.clip(perlin_gen(sleep_params), 0.0, 1.0)


def inhib_gen(inhib_params: InhibParams) -> Int8[np.ndarray, "Iz Iy Ix"]: # (N+2)^3
    rng = np.random.default_rng(seed=inhib_params.seed)
    shape = (Config.N+2, Config.N+2, Config.N+2)
    inhib_map = rng.uniform(0.0, 1.0, shape)
    for _ in range(inhib_params.steps):
        inhib_map = update_lattice(inhib_map, inhib_params)
    sign_map = np.where(inhib_map > inhib_params.binarize_threshold, -1, 1).astype(np.int8)
    return sign_map


def neuron_signature_gen(signature_params: SignatureParams) -> Float64[np.ndarray, "Siz Siy Six 4"]: # (N+2)^3 * 4
    noisew = perlin_gen(signature_params.perlin_w)
    noisex = perlin_gen(signature_params.perlin_x)
    noisey = perlin_gen(signature_params.perlin_y)
    noisez = perlin_gen(signature_params.perlin_z)
    noise_wxyz = np.stack([noisew, noisex, noisey, noisez], axis=-1)
    return noise_wxyz


@dataclass(frozen=True, slots=True)
class GenesisParams:
    signature_pre_params: SignatureParams
    signature_post_params: SignatureParams
    dopamine_params: DopamineParams
    sleep_params: SleepParams
    inhib_params: InhibParams
    resource_params: NeuronResourceParams
    link27th_params: Link27thParams
    learning_params: LearningParams

    @classmethod
    def new(cls) -> "GenesisParams":
        return cls(
            signature_pre_params=SignatureParams(
                perlin_w=generate(SignaturePerlinParams),
                perlin_x=generate(SignaturePerlinParams),
                perlin_y=generate(SignaturePerlinParams),
                perlin_z=generate(SignaturePerlinParams)
            ),
            signature_post_params=SignatureParams(
                perlin_w=generate(SignaturePerlinParams),
                perlin_x=generate(SignaturePerlinParams),
                perlin_y=generate(SignaturePerlinParams),
                perlin_z=generate(SignaturePerlinParams)
            ),
            dopamine_params=generate(DopamineParams),
            sleep_params=generate(SleepParams),
            inhib_params=generate(InhibParams),
            resource_params=generate(NeuronResourceParams),
            link27th_params=generate(Link27thParams),
            learning_params=generate(LearningParams)
        )


@dataclass(slots=True)
class Gene:
    signature_pre_map: Annotated[Float16[np.ndarray, "Siz Siy Six 4"], Rgene(np.float16(-1.0), np.float16(1.0))]
    signature_post_map: Annotated[Float16[np.ndarray, "Siz Siy Six 4"], Rgene(np.float16(-1.0), np.float16(1.0))]
    dopamine_map: Annotated[Float16[np.ndarray, "Dz Dy Dx"], Rgene(np.float16(0.0), np.float16(1.0))]
    sleep_map: Annotated[Float16[np.ndarray, "Slz Sly Slx"], Rgene(np.float16(0.0), np.float16(1.0))]
    inhib_map: Annotated[Int8[np.ndarray, "Iz Iy Ix"], NeuronTypeChoiceGene()]
    resource_params: NeuronResourceParams
    link27th_params: Link27thParams
    learning_params: LearningParams

    @classmethod
    def new(cls, genesis_params: GenesisParams) -> "Gene":
        return cls(
            signature_pre_map=neuron_signature_gen(genesis_params.signature_pre_params).astype(np.float16),
            signature_post_map=neuron_signature_gen(genesis_params.signature_post_params).astype(np.float16),
            dopamine_map=dopamine_gen(genesis_params.dopamine_params).astype(np.float16),
            sleep_map=sleep_gen(genesis_params.sleep_params).astype(np.float16),
            inhib_map=inhib_gen(genesis_params.inhib_params).astype(np.int8),
            resource_params=genesis_params.resource_params,
            link27th_params=genesis_params.link27th_params,
            learning_params=genesis_params.learning_params
        )

    def __post_init__(self):
        hints = get_type_hints(self.__class__, include_extras=True)
        for f in fields(self):
            hint = hints[f.name]
            if hasattr(hint, "__metadata__"):
                meta = hint.__metadata__
                checkable_meta = next((m for m in meta if isinstance(m, Checkable)), None)
                if checkable_meta is not None:
                    checkable_meta.check(getattr(self, f.name))


genesis_params = GenesisParams.new()
gene = Gene.new(genesis_params)


device = spy.create_device()



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


start_time = time.perf_counter()

pout_np = np.zeros(512 * 28, dtype=np.float16)

calc_weight_dict = {
    "signature_pre_map_np2": gene.signature_pre_map,
    "signature_post_map_np2": gene.signature_post_map,
    "weight_map_poutput": pout_np,
    "multiplier": gene.link27th_params.multiplier,
    "bias": gene.link27th_params.bias
}


buf_out_dict = dispatch_kernel(
    device=device,
    filename="calcWeights",
    thread_count=(Config.N, Config.N, Config.N),
    params_dict=calc_weight_dict
)

weights_raw = buf_out_dict["weight_map_poutput"].to_numpy()
weights = weights_raw.view(np.float16).reshape(512, 28)

m: int = 1 << 17

global_poutputs = np.zeros((m, Config.N, Config.N, Config.N), dtype=np.float16)

reasoning_dict = {
    "dopamine_map": gene.dopamine_map,
    "sleep_map": gene.sleep_map,
    "inhib_map": gene.inhib_map,
    "weights_map": weights,
    "global_poutputs": global_poutputs,
    "resource_params": dataclasses.asdict(gene.resource_params),
    "link27th_params": dataclasses.asdict(gene.link27th_params),
    "learning_params": dataclasses.asdict(gene.learning_params),
}

buf_out_reasoning = dispatch_kernel(
    device=device,
    filename="reasoning",
    thread_count=(m*Config.N, Config.N, Config.N),
    params_dict=reasoning_dict
)

poutput_raw = buf_out_reasoning["global_poutputs"].to_numpy()
poutput = poutput_raw.view(np.float16).reshape(m, Config.N, Config.N, Config.N)



end_time = time.perf_counter()
elapsed_time = end_time - start_time

print(f"処理時間: {elapsed_time:.6f} 秒")

# -------------------------------------------------------------
# 動作・ヘルスチェック & バリデーションレポート
# -------------------------------------------------------------
def validate_tensor(name: str, arr: np.ndarray, expected_shape: tuple, expected_range: tuple[float, float] | None = None):
    """テンソルの基本構造と数値妥当性をチェックするヘルパー"""
    print(f"\n--- [{name}] チェック ---")
    is_valid = True

    # 1. Shape & Dtype
    if arr.shape != expected_shape:
        print(f"❌ [Shape不一致] 期待値: {expected_shape}, 実際: {arr.shape}")
        is_valid = False
    else:
        print(f"✅ Shape: {arr.shape} ({arr.dtype})")

    # 2. NaN / Inf
    has_nan = np.isnan(arr).any()
    has_inf = np.isinf(arr).any()
    if has_nan or has_inf:
        print(f"❌ [異常値検出] NaN: {has_nan}, Inf: {has_inf}")
        is_valid = False
    else:
        print("✅ NaN / Inf: なし")

    # 3. 全ゼロ（カーネル未書き込み/不発）チェック
    is_all_zero = not np.any(arr)
    if is_all_zero:
        print("⚠️ [警告] 配列が完全にゼロです（カーネル処理が実行されていない可能性があります）")
        is_valid = False

    # 4. 統計量 & 値域
    min_val, max_val = float(np.min(arr)), float(np.max(arr))
    mean_val, std_val = float(np.mean(arr)), float(np.std(arr))
    print(f"   統計量: min={min_val:.4f}, max={max_val:.4f}, mean={mean_val:.4f}, std={std_val:.4f}")

    if expected_range is not None:
        low, high = expected_range
        # float16 の微小な丸め誤差を許容
        eps = 1e-3
        out_of_bounds = ((arr < low - eps) | (arr > high + eps)).sum()
        if out_of_bounds > 0:
            print(f"❌ [値域違反] 想定範囲 [{low}, {high}] を外れた要素数: {out_of_bounds} ({out_of_bounds / arr.size * 100:.2f}%)")
            is_valid = False
        else:
            print(f"✅ 値域: 想定範囲 [{low}, {high}] 内")

    return is_valid


print("\n" + "=" * 60)
print("🧠 VoxelBrain ヘルスチェック & 統計バリデーション")
print("=" * 60)

# =============================================================
# 1. weights の正当性チェック
# =============================================================
expected_weights_shape = (512, 28)
weights_valid = validate_tensor(
    name="weights (calcWeights 出力)",
    arr=weights,
    expected_shape=expected_weights_shape,
    expected_range=(-1.0, 1.0)  # シグネチャ内積等の想定値域に合わせて調整
)

# 結合が有効に生成されているか（非ゼロ結合の割合）
active_weights_ratio = (np.abs(weights) > 1e-4).mean() * 100
print(f"   シナプス活性結合率: {active_weights_ratio:.2f}%")


# =============================================================
# 2. global_poutputs (推論出力) の正当性チェック
# =============================================================
expected_poutput_shape = (m, Config.N, Config.N, Config.N)
poutput_valid = validate_tensor(
    name="global_poutputs (reasoning 出力)",
    arr=poutput,
    expected_shape=expected_poutput_shape,
    expected_range=(0.0, 1.0)  # 通常ニューロン出力は [0, 1] または [-1, 1]
)

# =============================================================
# 3. ニューロン活動のダイナミクス・局所領域チェック
# =============================================================
print("\n--- [ニューロン発火・空間活動性チェック] ---")

# (A) 死亡ニューロン（全ステップで一度も発火していないセル）の検出
# 形状: (Config.N, Config.N, Config.N)
cell_activity = np.abs(poutput).max(axis=0)
dead_cells_count = np.sum(cell_activity < 1e-4)
total_cells = Config.N ** 3
dead_cell_ratio = (dead_cells_count / total_cells) * 100

if dead_cells_count == total_cells:
    print("❌ [重大な警告] すべてのニューロンが静止（全ステップ出力ゼロ）しています！")
elif dead_cells_count > 0:
    print(f"⚠️ 沈黙ニューロン: {dead_cells_count}/{total_cells} 個 ({dead_cell_ratio:.1f}%)")
else:
    print("✅ 全ニューロンにおいて活動が確認されました。")

# (B) 内部コア (N-2)^3 と 境界シェル (表面) の分離チェック
# ※ poutput は 4次元 (m, N, N, N) なので空間3軸 (axis 1, 2, 3) をスライスします
if Config.N > 2:
    inner_core = poutput[:, 1:-1, 1:-1, 1:-1]
    
    # 表面（シェル）マスクの作成
    shell_mask = np.ones((Config.N, Config.N, Config.N), dtype=bool)
    shell_mask[1:-1, 1:-1, 1:-1] = False
    shell_outputs = poutput[:, shell_mask]

    print(f"   コア領域 (中央 {Config.N-2}^3)   : 平均発火 {inner_core.mean():.4f}, 最大 {inner_core.max():.4f}")
    print(f"   シェル領域 (外枠 {total_cells - (Config.N-2)**3}セル): 平均発火 {shell_outputs.mean():.4f}, 最大 {shell_outputs.max():.4f}")



print("\n" + "=" * 60)
if weights_valid and poutput_valid and dead_cells_count < total_cells:
    print(f"🎉 【判定: 合格】 全てのテンソルが正常に生成・計算されています。 (所要時間: {elapsed_time:.4f}秒)")
else:
    print(f"🚨 【判定: 警告あり】 上記のエラー・警告項目を確認してください。 (所要時間: {elapsed_time:.4f}秒)")
print("=" * 60)




print("wow")



