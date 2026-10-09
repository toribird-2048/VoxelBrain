import numpy as np
from jaxtyping import Float64
from dataclasses import dataclass
import vnoise #type: ignore

class Config:
    N: int = 8
    class Perlin:
        rand_grad_range: tuple[float, float] = (-1.0, 1.0)
        bias_range: tuple[float, float] = (-0.5, 5.0)
        frequency_range: tuple[float, float] = (0.0, 1.0)
        cutoff_range: tuple[float, float] = (0.0, 0.95)
    class Inhib:
        rand_init_range: tuple[float, float] = (0.0, 1.0)
        speed_range: tuple[float, float] = (1.0, 2.0)
        cutoff_range: tuple[float, float] = (0.0, 1.5)


def check_range(value: float, range: tuple[float, float]):
    if not range[0] <= value <= range[1]:
        raise ValueError(f"値が範囲{range[0]}~{range[1]}を外れています。")


@dataclass(frozen=True, slots=True)
class perlinParams:
    seed: int
    bias: float
    frequency: float
    cutoff: float

    def __post_init__(self):
        check_range(self.bias, Config.Perlin.bias_range)
        check_range(self.frequency, Config.Perlin.frequency_range)
        check_range(self.cutoff, Config.Perlin.cutoff_range)


@dataclass(frozen=True, slots=True)
class inhibParams:
    rand_init: Float64[np.ndarray, "Ix Iy Iz"]
    speed: float
    cutoff: float
    steps: int
    base_value: float

    def __post_init__(self):
        check_range(self.rand_init.min(), Config.Inhib.rand_init_range)
        check_range(self.rand_init.max(), Config.Inhib.rand_init_range)
        check_range(self.speed, Config.Inhib.speed_range)
        check_range(self.cutoff, Config.Inhib.cutoff_range)
        if self.steps < 0:
            raise ValueError("stepsは非負整数です。")
        if not self.rand_init.shape == (Config.N+2, Config.N+2, Config.N+2):
            raise ValueError("rand_initのサイズは(N+2, N+2, N+2)である必要があります。")
1

def update_lattice(current_map: Float64[np.ndarray, "Ix Iy Iz"], inhib_params: inhibParams):
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
    new_map[1:-1, 1:-1] = inner_updated
    return new_map


def dopamine_gen(perlin_params: perlinParams) -> Float64[np.ndarray, "Nx Ny Nz"]:
    coord = (np.arange(1.5, Config.N+1, 1.0) * perlin_params.frequency)
    vn = vnoise.Noise(seed=perlin_params.seed)
    noise = vn.noise3(coord, coord, coord)
    bias = perlin_params.bias
    cutoff = perlin_params.cutoff
    return np.clip((noise - cutoff) / (1 - cutoff) + bias, 0.0, 1.0)


def sleep_gen(perlin_params: perlinParams) -> Float64[np.ndarray, "Nx Ny Nz"]:
    coord = (np.arange(1.5, Config.N+1, 1.0) * perlin_params.frequency)
    vn = vnoise.Noise(seed=perlin_params.seed)
    noise = vn.noise3(coord, coord, coord)
    bias = perlin_params.bias
    cutoff = perlin_params.cutoff
    return np.clip((noise - cutoff) / (1 - cutoff) + bias, 0.0, 1.0)


def inhib_gen(inhib_params: inhibParams) -> Float64[np.ndarray, "Ix Iy Iz"]:
    inhib_map = inhib_params.rand_init
    for k in range(inhib_params.steps):
        inhib_map = update_lattice(inhib_map, inhib_params)
    return inhib_map