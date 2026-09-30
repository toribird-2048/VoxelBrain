import numpy as np
import numpy.typing as npt

class Neuron:
    def __init__(self, position: npt.NDArray[np.uint8], weights: npt.NDArray[np.uint8], weight_28th: np.uint8, position_28th: npt.NDArray[np.uint8]):
        if weights.shape != (3,3,3):
            raise ValueError("重みのサイズが合っていません")
        self.weights: npt.NDArray[np.uint8] = weights
        self.weight_28th: np.uint8 = weight_28th
        self.output: np.uint8 = np.uint8(0)
        self.position: npt.NDArray[np.uint8] = position
        self.position_28th: npt.NDArray[np.uint8] = position_28th

    def calc_output(self, outputs: npt.NDArray[np.uint8]):
        if outputs.shape != (6, 6, 6):
            raise ValueError("重みのサイズが合っていません")
        slice_range = tuple(slice(p-1, p+2) for p in self.position)
        target_outputs = outputs[slice_range]
        new_output = np.einsum("ijk,ijk->", self.weights, target_outputs)
        new_output += outputs[self.position_28th] * self.weight_28th
        self.output = new_output
        return new_output
            