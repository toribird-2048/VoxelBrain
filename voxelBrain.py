import numpy as np
from jaxtyping import Float64, Float16, Int8
from dataclasses import dataclass, field
import vnoise #type: ignore
from typing import Annotated, get_type_hints, Protocol, runtime_checkable, Any


@runtime_checkable
class Checkable(Protocol):
    def check(self, val: Any) -> None:
        ...


@dataclass(frozen=True, slots=True)
class R(Checkable):
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

    def check(self, val:float | int | np.ndarray):
        if isinstance(val, bool):
            raise TypeError("範囲チェックする数値に真偽値は入れられません。")

        if isinstance(val, np.ndarray):
            if not np.issubdtype(val.dtype, np.number):
                raise TypeError(f"配列のdtype{val.dtype}が不正です。dtypeはnp.numberのサブタイプである必要があります。")

            if (val < self.min_val).any() or (self.max_val < val).any():
                raise ValueError(f"配列の値は、全て{self.min_val}以上{self.max_val}以下である必要があります。")
            return

        
        if not self.min_val <= val <= self.max_val:
            raise ValueError(f"値{val}が範囲{self.min_val}~{self.max_val}を外れています。")
        if self.odd and val % 2 != 1:
            raise ValueError(f"値{val}は奇数である必要があります。")

    def sample(self):
        if self.val_type == int:
            if self.odd:
                k_low = int(self.min_val) // 2
                k_high = int(self.max_val) // 2 + 1
                return int(2 * np.random.randint(k_low, k_high) + 1)
            return np.random.randint(self.min_val, self.max_val + 1)

        if self.val_type == float:
            if self.log:
                log_min = np.log10(self.min_val)
                log_max = np.log10(self.max_val)
                return 10 ** np.random.uniform(log_min, log_max)
            return np.random.uniform(self.min_val, self.max_val)
        raise ValueError("UnexpectedError")


def auto_ranged(cls):
    orig_init = cls.__init__
    hints = get_type_hints(cls, include_extras=True)

    def new_init(self, *args, **kwargs):
        orig_init(self, *args, **kwargs)
        for name, hint in hints.items():
            if hasattr(hint, "__metadata__"):
                for meta in hint.__metadata__:
                    if isinstance(meta, Checkable):
                        meta.check(getattr(self, name))

    cls.__init__ = new_init
    return cls


@dataclass(frozen=True, slots=True)
class NeuronTypeChoice(Checkable):
    excit: int = 1
    inhib: int = -1

    def check(self, val: np.ndarray | int):
        if isinstance(val, bool):
            raise TypeError("値は1, -1のどちらかである必要があります。")
        if isinstance(val, int):
            if val != self.excit and val != self.inhib:
                raise ValueError("値は1, -1のどちらかである必要があります。")
            return

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
class Link28thParams:
    multiplier: Annotated[int, R(0, 511, odd=True)]
    bias: Annotated[int, R(0, 511)]


@auto_ranged
@dataclass(frozen=True, slots=True)
class SignatureParams:
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


def update_lattice(current_map: Float64[np.ndarray, "Iz Iy Ix"], inhib_params: InhibParams):
    s = [slice(0, -2), slice(1, -1), slice(2, None)]

    neighbors = [
        current_map[s[dx], s[dy], s[dz]]
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
    noise = vn.noise3(x, y, z)
    bias = perlin_params.bias
    cutoff = perlin_params.cutoff
    return np.clip((noise - cutoff) / (1 - cutoff) + bias, 0.0, 1.0).reshape(size, size, size)


def dopamine_gen(dopamine_params: DopamineParams) -> Float64[np.ndarray, "Dz Dy Dx"]: # N^3
    return perlin_gen(dopamine_params)


def sleep_gen(sleep_params: SleepParams) -> Float64[np.ndarray, "Slz Sly SLx"]: # N^3
    return perlin_gen(sleep_params)


def inhib_gen(inhib_params: InhibParams) -> Int8[np.ndarray, "Iz Iy Ix"]: # (N+2)^3
    rng = np.random.default_rng(seed=inhib_params.seed)
    shape = (Config.N+2, Config.N+2, Config.N+2)
    inhib_map = rng.uniform(0.0, 1.0, shape)
    for _ in range(inhib_params.steps):
        inhib_map = update_lattice(inhib_map, inhib_params)
    sign_map = np.where(inhib_map > inhib_params.binarize_threshold, -1, 1).astype(np.int8)
    return sign_map


def neuron_signature_gen(signature_params: SignatureParams) -> Float64[np.ndarray, "Siz Siy Six 3"]: # (N+2)^3
    noisex = perlin_gen(signature_params.perlin_x)
    noisey = perlin_gen(signature_params.perlin_y)
    noisez = perlin_gen(signature_params.perlin_z)
    noisexyz = np.stack([noisex, noisey, noisez], axis=-1)
    return noisexyz


@dataclass(frozen=True, slots=True)
class GenesisParams:
    signature_params: SignatureParams
    dopamine_params: DopamineParams
    sleep_params: SleepParams
    inhib_params: InhibParams
    resource_params: NeuronResourceParams
    link28th_params: Link28thParams
    learning_params: LearningParams


@auto_ranged
@dataclass(slots=True)
class Gene:
    signature_map: Annotated[Float16[np.ndarray, "Siz Siy Six 3"], R(-1.0, 1.0)]
    dopamine_map: Annotated[Float16[np.ndarray, "Dz Dy Dx"], R(0.0, 1.0)]
    sleep_map: Annotated[Float16[np.ndarray, "Slz Sly Slx"], R(0.0, 1.0)]
    inhib_map: Annotated[Int8[np.ndarray, "Iz Iy Ix"], NeuronTypeChoice()]
    resource_params: NeuronResourceParams
    link28th_params: Link28thParams
    learning_params: LearningParams

    @classmethod
    def new(cls, genesis_params: GenesisParams) -> "Gene":
        return cls(
            signature_map=neuron_signature_gen(genesis_params.signature_params).astype(np.float16),
            dopamine_map=dopamine_gen(genesis_params.dopamine_params).astype(np.float16),
            sleep_map=sleep_gen(genesis_params.sleep_params).astype(np.float16),
            inhib_map=inhib_gen(genesis_params.inhib_params).astype(np.int8),
            resource_params=genesis_params.resource_params,
            link28th_params=genesis_params.link28th_params,
            learning_params=genesis_params.learning_params
        )