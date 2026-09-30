import numpy as np
import numpy.typing as npt
from enum import IntEnum

class NeuronType(IntEnum):
    EXCIT = 1
    INHIB = -1

class Neuron:
    def __init__(self, neuro_type: NeuronType, weights: npt.NDArray[np.uint8], weight_28th: np.uint8, position_28th: tuple[int, int, int]):
        if weights.shape != (3,3,3):
            raise ValueError("重みのサイズが合っていません")
        self.neuro_type = neuro_type
        self.weights: npt.NDArray[np.uint8] = weights
        self.weight_28th: np.uint8 = weight_28th
        self.position_28th: tuple[int, int, int] = position_28th

    def calc_output(self, position: tuple[int, int, int], outputs: npt.NDArray[np.float16]) -> np.float16:
        if outputs.shape != (6, 6, 6):
            raise ValueError("重みのサイズが合っていません")

        weights_f16: npt.NDArray[np.float16] = self.weights.astype(np.float16) * np.float16(0.00390625)
        weight_28th_f16: np.float16 = np.float16(self.weight_28th) * np.float16(0.00390625)
        slice_range: tuple = tuple(slice(p-1, p+2) for p in position)
        target_outputs: npt.NDArray[np.float16] = outputs[slice_range]
        sum_3x3: np.float16 = np.einsum("ijk,ijk->", weights_f16, target_outputs)
        val_28th: np.float16 = outputs[self.position_28th] * weight_28th_f16
        new_output: np.float16 = float(self.neuro_type) * np.float16(np.clip(sum_3x3 + val_28th, 0, 1))
        return new_output
            

class NeuronBlock:
    def __init__(self, neurons: npt.NDArray[np.object_]):

        self.neurons: npt.NDArray[np.object_] = neurons
        self.outputs: npt.NDArray[np.float16] = np.zeros((6,6,6), dtype=np.float16)

    def calc(self) -> npt.NDArray[np.float16]:
        new_outputs: npt.NDArray[np.float16] = np.zeros((6,6,6), dtype=np.float16)
        for z in range(1,5):
            for y in range(1,5):
                for x in range(1,5):
                    neuron: Neuron = self.neurons[z,y,x]
                    new_outputs[z, y, x] = neuron.calc_output(position=(z,y,x), outputs=self.outputs)
        self.outputs = new_outputs
        return self.outputs






