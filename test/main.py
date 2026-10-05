import numpy as np
import numpy.typing as npt
from enum import IntEnum
from jaxtyping import Float64
from dataclasses import dataclass

N = 4

def perlin_gen(x: float, y: float, z: float, rand_grad: Float64[np.ndarray, "Gx Gy Gz 3"], bias: float, frequency: int):
    if not all(0 <= v < N+1 for v in (x, y, z)):
        raise ValueError("x, y, zは全て0以上N+1未満に収める必要があります")
    x_mod, y_mod, z_mod = x % 1, y % 1, z % 1
    x_floor, y_floor, z_floor = [int(np.floor(v)) for v in (x, y, z)]
    dist = np.array([x_mod, y_mod, z_mod]) - np.indices((2, 2, 2)).transpose(1, 2, 3, 0)
    grad_near: Float64[np.ndarray, "2 2 2 3"] = rand_grad[x_floor:x_floor+2, y_floor:y_floor+2, z_floor:z_floor+2, :]
    dot_near: Float64[np.ndarray, "2 2 2"] = np.einsum("xyzi, xyzi -> xyz", dist, grad_near)
    fade = lambda t: 6*t**5 - 15*t**4 + 10*t**3
    us = np.array([1-fade(x_mod), fade(x_mod)])
    vs = np.array([1-fade(y_mod), fade(y_mod)])
    ws = np.array([1-fade(z_mod), fade(z_mod)])
    noise = np.einsum("ijk, i, j, k ->", dot_near, us, vs, ws)
    return noise

@dataclass(frozen=True, slots=True)
class NeuronCoord:
    x: int
    y: int
    z: int

    def __post_init__(self):
        if not all(1 <= v <= N for v in (self.x, self.y, self.z)):
            raise ValueError(f"ニューロンの座標は、全て1以上N以下である必要があります。({self.x}, {self.y}, {self.z})")

    @property
    def slice_range(self) -> tuple[int, int, int]: # type: ignore
        return (
            slice(self.x - 1, self.x + 2), # type: ignore
            slice(self.y - 1, self.y + 2), # type: ignore
            slice(self.z - 1, self.z + 2) # type: ignore
        )

    @property
    def as_tuple(self) -> tuple[int, int, int]:
        return (self.x, self.y, self.z)
    

@dataclass(frozen=True, slots=True)
class Synapse28th:
    weight: int
    neuron_coord: NeuronCoord

@dataclass(frozen=True, slots=True)
class NeuronResourceParams:
    base_output: float
    beta: float
    k_refill: float


class NeuronType(IntEnum):
    EXCIT = 1
    INHIB = -1

class Neuron:
    def __init__(self, neuro_type: NeuronType, weights: npt.NDArray[np.uint8], synapse_28th: Synapse28th, neuron_resource_params: NeuronResourceParams):
        if weights.shape != (3,3,3):
            raise ValueError("重みのサイズが合っていません")
        self.neuro_type = neuro_type
        self.weights: npt.NDArray[np.uint8] = weights
        self.synapse_28th: Synapse28th = synapse_28th
        self.resource: float = 1.0
        self.resource_params: NeuronResourceParams = neuron_resource_params

    def calc_output(self, position: NeuronCoord, outputs: npt.NDArray[np.float16]) -> float:
        if outputs.shape != (N+2, N+2, N+2):
            raise ValueError("重みのサイズが合っていません")

        weights_f16: npt.NDArray[np.float16] = self.weights.astype(np.float16) * float(0.00390625)
        weight_28th_f16: float = float(self.synapse_28th.weight) * float(0.00390625)
        sum_3x3: float = np.einsum("ijk,ijk->", weights_f16, outputs[position.slice_range])
        val_28th: float = outputs[self.synapse_28th.neuron_coord.as_tuple] * weight_28th_f16
        new_net: float = sum_3x3 + val_28th
        output_rate: float = min(1.0, self.resource_params.base_output * np.exp2(new_net * self.resource_params.beta))
        new_output: float = output_rate * self.resource
        refill: float = self.resource_params.k_refill * (1 - self.resource)
        self.resource = np.clip(self.resource - new_output + refill, 0, 1)
        return new_output * float(self.neuro_type)
            

class NeuronBlock:
    def __init__(self, neurons: npt.NDArray[np.object_]):

        self.neurons: npt.NDArray[np.object_] = neurons
        self.outputs: npt.NDArray[np.float16] = np.zeros((N+2, N+2, N+2), dtype=np.float16)

    def neuron_at(self, coord: NeuronCoord):
        return self.neurons[coord.x-1, coord.y-1, coord.z-1]
    
    def calc(self) -> npt.NDArray[np.float16]:
        new_outputs: npt.NDArray[np.float16] = np.zeros((N+2, N+2, N+2), dtype=np.float16)
        for z in range(1,N+1):
            for y in range(1,N+1):
                for x in range(1,N+1):
                    neuron: Neuron = self.neuron_at(NeuronCoord(x, y, z))
                    new_outputs[x, y, z] = neuron.calc_output(position=NeuronCoord(x, y, z), outputs=self.outputs)
        self.outputs = new_outputs
        return self.outputs


