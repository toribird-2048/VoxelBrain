# onesim/sim_cpu.py
"""CPU Simulator for VoxelBrain (SolarBrainCPU).

Calculations, random numbers, neuromodulator diffusion, and synaptic dynamics
are 100% bit-compatible with reasoningSim.slang.
"""
import numpy as np

from sim_config import (
    INITIAL_ENERGY,
    METABOLIC_COST,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SUN_CYCLE_PERIOD,
    SPEED_GAIN,
    ROTATE_GAIN,
)
from onesim.coords import (
    get_default_inout_fi,
    face_index_to_coord_in_p,
    face_index_to_coord_out_p,
)

HISTORY_LEN = 200


def pcg_hash(x: int) -> int:
    """32-bit PCG hash function bit-for-bit identical to reasoningSim.slang."""
    state = (int(x) * 747796405 + 2891336453) & 0xFFFFFFFF
    rot = ((state >> 28) + 4) & 31
    word = (((state >> rot) ^ state) * 277803737) & 0xFFFFFFFF
    return ((word >> 22) ^ word) & 0xFFFFFFFF


def rand_half(x: int) -> np.float16:
    """Random half precision float [0, 1] identical to reasoningSim.slang."""
    h1 = pcg_hash(x)
    return np.float16(h1 / 4294967295.0)


def mutate_linear(base_val: np.float16, val_min: float, val_max: float, seed_container: list[int], rate: float) -> np.float16:
    """mutation.slang の mutate_linear とビット完全一致する線形変異"""
    seed = seed_container[0]
    _ = rand_half(seed)
    seed += 1
    do_mut = bool(rand_half(seed) >= np.float16(1.0 - rate))
    seed += 1
    seed_container[0] = seed
    if do_mut:
        return np.float16((val_max - val_min) * float(rand_half(seed)) + val_min)
    return np.float16(base_val)


def mutate_half4(base_vec, val_min: float, val_max: float, seed_container: list[int], rate: float) -> np.ndarray:
    """mutation.slang の mutate_half4 と完全一致する half4 変異"""
    res = np.zeros(4, dtype=np.float16)
    for i in range(4):
        res[i] = mutate_linear(base_vec[i], val_min, val_max, seed_container, rate)
    return res


def mutate_half4x4(base_mat, val_min: float, val_max: float, seed_container: list[int], rate: float) -> np.ndarray:
    """mutation.slang の mutate_half4x4 と完全一致する half4x4 変異"""
    res = np.zeros((4, 4), dtype=np.float16)
    for i in range(4):
        res[i] = mutate_half4(base_mat[i], val_min, val_max, seed_container, rate)
    return res


class SolarBrainCPU:
    def __init__(self, sig_pre, sig_post, neuromod_map, inhib, params, spec, generation_step=0, agent_id=0):
        self.params = params
        self.spec = spec
        self.dim = spec["dim"]
        self.N = spec["n"]
        self.P = spec["p"]
        self.TOTAL_N = spec["total_n"]
        self.CENTER = spec["center"]

        self.generation_step = int(params.get("step", generation_step))
        self.agent_id = int(params.get("agent_id", agent_id))

        # P x P x P 空間でのノックアウトマスク (True のセルは出力・感覚入力とも 0.0h に強制遮断)
        self.knockout_np2 = np.zeros((self.P, self.P, self.P), dtype=bool)
        # シナプス単位の実験切断マスク (TOTAL_N, 28)
        self.synapse_ko_mask = np.zeros((self.TOTAL_N, 28), dtype=bool)
        # 手動感覚入力オーバーライド (slot_idx: value)
        self.manual_in_overrides: dict[int, float] = {}

        idx = np.arange(self.TOTAL_N)
        self.coords_x = (idx >> 0) & (self.N - 1)
        self.coords_y = (idx >> self.dim) & (self.N - 1)
        self.coords_z = (idx >> (self.dim * 2)) & (self.N - 1)

        # 27近傍オフセット: dz(slowest), dy(middle), dx(fastest) (Slang relCoordToSlot と完全一致)
        self.offsets = np.array([(dz, dy, dx) for dz in [-1, 0, 1] for dy in [-1, 0, 1] for dx in [-1, 0, 1]], dtype=np.int32)

        self.update_genes(sig_pre, sig_post, neuromod_map, inhib, params, reset_state=True)

    def update_genes(self, sig_pre, sig_post, neuromod_map, inhib, params, reset_state=False):
        """遺伝子・パラメータを更新してシナプス重みを再計算する（動的ホットリロード対応）"""
        self.params = params
        self.sig_pre = np.asarray(sig_pre, dtype=np.float16).reshape(self.P, self.P, self.P, 4)
        self.sig_post = np.asarray(sig_post, dtype=np.float16).reshape(self.P, self.P, self.P, 4)
        self.neuromod_map = np.asarray(neuromod_map, dtype=np.float16).reshape(self.TOTAL_N, 4)
        self.inhib = np.asarray(inhib, dtype=np.float16).reshape(self.TOTAL_N)

        defaults_fi = get_default_inout_fi(self.dim)
        in_fi = params.get("in_ports_fi", defaults_fi["in_ports_fi"])
        out_fi = params.get("out_ports_fi", defaults_fi["out_ports_fi"])
        self.in_coords_p = [face_index_to_coord_in_p(fi, self.N) for fi in in_fi]
        self.out_coords_p = [face_index_to_coord_out_p(fi, self.N) for fi in out_fi]

        # 互換用プロパティ
        self.light_in_p = self.in_coords_p[0] if len(self.in_coords_p) >= 1 else (0, 0, 0)
        self.battery_in_p = self.in_coords_p[1] if len(self.in_coords_p) >= 2 else (0, 0, 0)
        self.gen_pos_out_p = self.out_coords_p[0] if len(self.out_coords_p) >= 1 else (1, 1, 1)
        self.gen_neg_out_p = self.out_coords_p[1] if len(self.out_coords_p) >= 2 else (1, 1, 1)
        self.speed_out_p = self.out_coords_p[2] if len(self.out_coords_p) >= 3 else (1, 1, 1)
        self.rotate_out_p = self.out_coords_p[3] if len(self.out_coords_p) >= 4 else (1, 1, 1)

        # neuromod パラメータ
        if "neuromod_rel_matrix" in params and params["neuromod_rel_matrix"] is not None:
            self.neuromod_rel_matrix = np.asarray(params["neuromod_rel_matrix"], dtype=np.float16).reshape(4, 4)
        else:
            self.neuromod_rel_matrix = (np.eye(4, dtype=np.float16) * 0.95).astype(np.float16)

        if "neuromod_weight_reaction" in params and params["neuromod_weight_reaction"] is not None:
            self.neuromod_weight_reaction = np.asarray(params["neuromod_weight_reaction"], dtype=np.float16).reshape(4, 4)
        else:
            self.neuromod_weight_reaction = np.zeros((4, 4), dtype=np.float16)
            for i in range(4):
                self.neuromod_weight_reaction[i, 2] = np.float16(0.95)

        if "neuromod_diff" in params and params["neuromod_diff"] is not None:
            self.neuromod_diff = np.float16(params["neuromod_diff"])
        elif "diff" in params and params["diff"] is not None:
            self.neuromod_diff = np.float16(params["diff"])
        else:
            self.neuromod_diff = np.float16(0.01)

        self.params["neuromod_rel_matrix"] = self.neuromod_rel_matrix
        self.params["neuromod_weight_reaction"] = self.neuromod_weight_reaction
        self.params["neuromod_diff"] = self.neuromod_diff

        if not hasattr(self, "synapse_ko_mask") or self.synapse_ko_mask.shape != (self.TOTAL_N, 28):
            self.synapse_ko_mask = np.zeros((self.TOTAL_N, 28), dtype=bool)

        idx = np.arange(self.TOTAL_N)
        nz = self.coords_z[:, None] + 1 + self.offsets[:, 0]
        ny = self.coords_y[:, None] + 1 + self.offsets[:, 1]
        nx = self.coords_x[:, None] + 1 + self.offsets[:, 2]

        idx_27th = (idx * int(params["multiplier"]) + int(params["bias"])) & (self.TOTAL_N - 1)
        w27_x = ((idx_27th >> 0) & (self.N - 1)) + 1
        w27_y = ((idx_27th >> self.dim) & (self.N - 1)) + 1
        w27_z = ((idx_27th >> (self.dim * 2)) & (self.N - 1)) + 1

        self.conn_z = np.concatenate([nz, w27_z[:, None]], axis=1)
        self.conn_y = np.concatenate([ny, w27_y[:, None]], axis=1)
        self.conn_x = np.concatenate([nx, w27_x[:, None]], axis=1)

        # 近傍27セルの内部インデックス参照テーブル (外周膜の場合は Neumann 条件により自分自身のインデックス)
        self.conn_int_idx = np.zeros((self.TOTAL_N, 27), dtype=np.int32)
        for k in range(27):
            cz = self.conn_z[:, k]
            cy = self.conn_y[:, k]
            cx = self.conn_x[:, k]
            is_in = (1 <= cz) & (cz <= self.N) & (1 <= cy) & (cy <= self.N) & (1 <= cx) & (cx <= self.N)
            internal_target = ((cz - 1) << (self.dim * 2)) | ((cy - 1) << self.dim) | (cx - 1)
            self.conn_int_idx[:, k] = np.where(is_in, internal_target, idx)

        my_post = self.sig_post[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]  # (TOTAL_N, 4)
        target_pre = self.sig_pre[self.conn_z, self.conn_y, self.conn_x]                  # (TOTAL_N, 28, 4)

        dot_val = np.sum(my_post[:, None, :] * target_pre, axis=-1, dtype=np.float16)
        self.initial_weights = np.clip(dot_val * np.float16(0.25), np.float16(0.0), np.float16(1.0)).astype(np.float16)

        if reset_state or not hasattr(self, "weights"):
            self.reset()
        else:
            self.weights = self.initial_weights.copy()
            if np.any(self.synapse_ko_mask):
                self.weights[self.synapse_ko_mask] = np.float16(0.0)

    def mutate_neuromod_params(
        self,
        rate_matrix: float = 0.05,
        rate_reaction: float = 0.05,
        rate_diff: float = 0.05,
        seed: int = 42,
    ):
        """mutation.slang の NeuromodParams.mutate と完全一致する変異処理。
        neuromod_rel_matrix, neuromod_weight_reaction, neuromod_diff を変異させる。
        """
        sc = [int(seed)]
        self.neuromod_rel_matrix = mutate_half4x4(self.neuromod_rel_matrix, -1.0, 1.0, sc, rate_matrix)
        for i in range(4):
            self.neuromod_weight_reaction[i] = mutate_half4(self.neuromod_weight_reaction[i], -1.0, 1.0, sc, rate_reaction)
        self.neuromod_diff = mutate_linear(self.neuromod_diff, 0.001, 0.037, sc, rate_diff)

        self.params["neuromod_rel_matrix"] = self.neuromod_rel_matrix
        self.params["neuromod_weight_reaction"] = self.neuromod_weight_reaction
        self.params["neuromod_diff"] = self.neuromod_diff

    def _coord_p_to_internal_idx(self, pz: int, py: int, px: int) -> int | None:
        """P空間座標 (1..N) を内部フラットインデックス (0..TOTAL_N-1) に変換。外周なら None"""
        if (1 <= pz <= self.N) and (1 <= py <= self.N) and (1 <= px <= self.N):
            iz, iy, ix = pz - 1, py - 1, px - 1
            return (iz << (self.dim * 2)) | (iy << self.dim) | ix
        return None

    def set_synapse_slot_cut(self, post_idx: int, k: int, cut: bool | None = None) -> bool:
        """特定のシナプススロット (post_idx, k) の切断状態を切り替え、即座に weights に反映する"""
        new_state = (not self.synapse_ko_mask[post_idx, k]) if cut is None else bool(cut)
        self.synapse_ko_mask[post_idx, k] = new_state
        if new_state:
            self.weights[post_idx, k] = np.float16(0.0)
        else:
            self.weights[post_idx, k] = self.initial_weights[post_idx, k]
        return new_state

    def find_synapse_slots_between(
        self, pre_coord: tuple[int, int, int], post_coord: tuple[int, int, int], active_only: bool = False
    ) -> list[tuple[int, int]]:
        """pre_coord(P空間) ➔ post_coord(P空間) を結ぶシナプススロット (post_idx, k) のリストを返す"""
        post_idx = self._coord_p_to_internal_idx(*post_coord)
        if post_idx is None:
            return []
        sz, sy, sx = pre_coord
        matched = []
        for k in range(28):
            if (
                int(self.conn_z[post_idx, k]) == sz
                and int(self.conn_y[post_idx, k]) == sy
                and int(self.conn_x[post_idx, k]) == sx
            ):
                if not active_only or float(self.initial_weights[post_idx, k]) > 0.01 or self.synapse_ko_mask[post_idx, k]:
                    matched.append((post_idx, k))
        return matched

    def reset(self):
        """シミュレーション内部状態の完全リセット (Slang 初期状態と100%一致)"""
        self.weights = self.initial_weights.copy()
        if np.any(self.synapse_ko_mask):
            self.weights[self.synapse_ko_mask] = np.float16(0.0)

        # 外周膜は 0.0h, 内部ニューロンは 0.5h
        self.outputs_np2 = np.zeros((self.P, self.P, self.P), dtype=np.float16)
        self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1] = np.float16(0.5)
        self.outputs_np2[self.knockout_np2] = np.float16(0.0)
        self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

        # Neuromod 動的状態 (2スロットのダブルバッファ, Slang neuromod_map_s と同一)
        self.neuromod_state = np.zeros((2, self.TOTAL_N, 4), dtype=np.float16)

        self.R = np.ones(self.TOTAL_N, dtype=np.float16)
        self.my_output = np.zeros(self.TOTAL_N, dtype=np.float16)
        self.flicker_rate = 0.0

        self.inner_step_counter = 0
        self.energy = float(INITIAL_ENERGY)
        self.current_sunlight = 0.0
        self.generator_power = 0.0
        self.net_delta_energy = 0.0

        # Slang 乱数準拠の身体性・移動パラメータ
        self.pos = np.array([0.0, 0.0], dtype=np.float32)
        self.angle = 0.0
        obj_rand = 2.0 * float(rand_half(12277 * self.generation_step + 67 * self.agent_id))
        self.obj_pos = np.array([np.cos(np.pi * obj_rand), np.sin(np.pi * obj_rand)], dtype=np.float32)
        self.speed = 0.0
        self.rotate = 0.0
        self.energy_coeff = 1.0

        self.step_history = []
        self.sun_history = []
        self.gen_history = []
        self.energy_history = []
        self.neuromod_history = []  # shape: (T, 4)
        self.pos_history = [self.pos.copy()]

    @property
    def current_neuromod_state(self):
        """現在のステップに対応する Neuromod 状態 (TOTAL_N, 4)"""
        slot = self.inner_step_counter & 1
        return self.neuromod_state[slot]

    def step(self, inner_steps=1, record_history=True, generation_step=None, agent_id=None):
        """Slang シェーダーと完全に一致する 1 以上の inner_steps 実行"""
        if generation_step is not None:
            self.generation_step = int(generation_step)
        if agent_id is not None:
            self.agent_id = int(agent_id)

        base_output = np.float16(self.params["base_output"])
        beta = np.float16(self.params["beta"])
        k_refill = np.float16(self.params["k_refill"])

        has_ko = bool(np.any(self.knockout_np2))
        has_syn_ko = bool(np.any(self.synapse_ko_mask))

        dt_diff = np.float16(1.0 / 54.0)

        target_step = self.inner_step_counter + inner_steps
        while self.inner_step_counter < target_step:
            if has_ko:
                self.outputs_np2[self.knockout_np2] = np.float16(0.0)

            if record_history:
                self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

            slot = self.inner_step_counter & 1
            next_slot = (self.inner_step_counter + 1) & 1
            cur_nm = self.neuromod_state[slot]

            # 1. Neuromod の 3x3x3 ラプラシアン拡散 (Neumann 境界条件: slot -> next_slot)
            grid = cur_nm.reshape(self.N, self.N, self.N, 4)
            padded = np.pad(grid, ((1, 1), (1, 1), (1, 1), (0, 0)), mode="edge")
            nbr_sum = np.zeros_like(grid)
            for dz in range(3):
                for dy in range(3):
                    for dx in range(3):
                        nbr_sum += padded[dz:dz+self.N, dy:dy+self.N, dx:dx+self.N]
            laplacian = (nbr_sum - np.float16(27.0) * grid).reshape(self.TOTAL_N, 4)
            diffused_nm = cur_nm + (self.neuromod_diff * laplacian) * dt_diff

            # 2. 前ステップ発火出力に応じた分泌 & rel_matrix 相互作用
            secreted_nm = diffused_nm + (self.my_output[:, None] * self.neuromod_map).astype(np.float16)
            updated_nm = np.matmul(secreted_nm, self.neuromod_rel_matrix.T).astype(np.float16)
            self.neuromod_state[next_slot] = np.maximum(np.float16(0.0), updated_nm)

            # 3. シナプス入力集計 (CURRENT weights, Slang と同一順序)
            in_outputs = self.outputs_np2[self.conn_z, self.conn_y, self.conn_x]
            net = np.sum(in_outputs * self.weights, axis=1, dtype=np.float16)

            # 4. 近傍27本シナプス重み更新 (next_slot の Neuromod を参照)
            nbr_nm = self.neuromod_state[next_slot][self.conn_int_idx]  # (TOTAL_N, 27, 4)
            my_nm = self.neuromod_state[next_slot][:, None, :]         # (TOTAL_N, 1, 4)
            my_w = self.weights[:, :27]                                # (TOTAL_N, 27)

            nw = np.zeros((self.TOTAL_N, 27), dtype=np.float16)
            for c in range(4):
                r = self.neuromod_weight_reaction[c]
                nw += (my_nm[:, :, c] * r[0] + nbr_nm[:, :, c] * r[1] + my_w * r[2] + r[3]).astype(np.float16)

            self.weights[:, :27] = np.clip(nw, np.float16(0.0), np.float16(1.0))
            if has_syn_ko:
                self.weights[self.synapse_ko_mask] = np.float16(0.0)

            # 5. 発火率・出力計算 & 資源 R 更新 (float32 での exp2 評価でオーバーフロー防止)
            scaled_net = np.clip(net.astype(np.float32) * float(beta), -20.0, 20.0)
            output_rate = np.minimum(1.0, float(base_output) * np.exp2(scaled_net)).astype(np.float16)
            self.my_output = (self.inhib * output_rate * self.R).astype(np.float16)

            if has_ko:
                ko_internal_flat = self.knockout_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]
                self.my_output = np.where(ko_internal_flat, np.float16(0.0), self.my_output)

            self.outputs_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1] = self.my_output
            self.R = np.clip(self.R - output_rate * self.R + k_refill, np.float16(0.0), np.float16(1.0))

            if record_history:
                cur_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].astype(np.float32)
                self.flicker_rate = float(np.mean((cur_outputs * self.prev_outputs.astype(np.float32)) < -0.001))

            # 6. 太陽光発電・代謝・身体移動・エネルギー更新
            sun_f32 = np.float32(np.clip(np.sin(np.pi * np.float32(self.inner_step_counter * (1.0 / SUN_CYCLE_PERIOD))), 0.0, 1.0))
            self.current_sunlight = float(sun_f32)

            gen_raw = np.float16(0.0)
            if len(self.out_coords_p) >= 2:
                gpz, gpy, gpx = self.out_coords_p[0]
                gnz, gny, gnx = self.out_coords_p[1]
                gen_raw = (self.outputs_np2[gpz, gpy, gpx] - self.outputs_np2[gnz, gny, gnx]).astype(np.float16)
            elif len(self.out_coords_p) == 1:
                gpz, gpy, gpx = self.out_coords_p[0]
                gen_raw = self.outputs_np2[gpz, gpy, gpx].astype(np.float16)

            self.generator_power = float(np.clip(gen_raw, 0.0, 1.0))

            self.rotate = 0.0
            self.speed = 0.0
            if len(self.out_coords_p) >= 4:
                rz, ry, rx = self.out_coords_p[3]
                self.rotate = float(self.outputs_np2[rz, ry, rx])
            if len(self.out_coords_p) >= 3:
                sz, sy, sx = self.out_coords_p[2]
                self.speed = float(self.outputs_np2[sz, sy, sx])

            if self.energy > 0.0:
                self.angle += self.rotate * ROTATE_GAIN
                my_speed = self.speed * SPEED_GAIN
                self.pos += np.array([np.cos(self.angle), np.sin(self.angle)], dtype=np.float32) * my_speed
                self.pos = np.clip(self.pos, -2.0, 2.0)

                diff = self.pos - self.obj_pos
                dist_dot = float(np.dot(diff, diff))
                self.energy_coeff = 1.0  # Slang: float energy_coefficient = 1.0h;

                cost = float(np.float32(METABOLIC_COST) + np.float32(self.generator_power) * np.float32(GEN_COST_RATE))
                gain = float(np.float32(SOLAR_GAIN_RATE) * np.float32(self.generator_power) * sun_f32 * np.float32(self.energy_coeff))
                self.net_delta_energy = gain - cost

                e_f32 = np.float32(self.energy)
                e_f32 = np.float32(e_f32 - np.float32(METABOLIC_COST))
                e_f32 = np.float32(e_f32 - np.float32(self.generator_power) * np.float32(GEN_COST_RATE))
                e_f32 = np.float32(e_f32 + np.float32(gain))
                self.energy = float(np.clip(e_f32, 0.0, 1.0))
            else:
                self.energy = 0.0
                self.net_delta_energy = 0.0
                diff = self.pos - self.obj_pos
                dist_dot = float(np.dot(diff, diff))
                self.energy_coeff = 1.0

            # 感覚入力の書き込み
            if len(self.in_coords_p) >= 1:
                lz, ly, lx = self.in_coords_p[0]
                self.outputs_np2[lz, ly, lx] = np.float16(0.0) if self.knockout_np2[lz, ly, lx] else np.float16(self.current_sunlight)
            if len(self.in_coords_p) >= 2:
                bz, by, bx = self.in_coords_p[1]
                self.outputs_np2[bz, by, bx] = np.float16(0.0) if self.knockout_np2[bz, by, bx] else np.float16(self.energy)

            if hasattr(self, "manual_in_overrides") and self.manual_in_overrides:
                for slot_idx, man_val in self.manual_in_overrides.items():
                    if slot_idx < len(self.in_coords_p):
                        mz, my, mx = self.in_coords_p[slot_idx]
                        self.outputs_np2[mz, my, mx] = np.float16(0.0) if self.knockout_np2[mz, my, mx] else np.float16(man_val)

            if record_history:
                self.step_history.append(self.inner_step_counter)
                self.sun_history.append(self.current_sunlight)
                self.gen_history.append(self.generator_power)
                self.energy_history.append(self.energy)
                self.neuromod_history.append(np.mean(np.abs(self.neuromod_state[next_slot]), axis=0).astype(float))
                if not hasattr(self, "pos_history"):
                    self.pos_history = []
                self.pos_history.append(self.pos.copy())

                if len(self.step_history) > HISTORY_LEN:
                    self.step_history.pop(0)
                    self.sun_history.pop(0)
                    self.gen_history.pop(0)
                    self.energy_history.pop(0)
                    self.neuromod_history.pop(0)
                    if len(self.pos_history) > HISTORY_LEN:
                        self.pos_history.pop(0)

            self.inner_step_counter += 1
