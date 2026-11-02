"""
oneSim.py: 1個体専用のステップ実行シミュレータ (Slang GPU)
毎innerstepごとにPythonに全状態（ニューロン出力、シナプス重み、修飾物質、シナプス資源R、身体・環境状態）
を同期し、高レベルAPIおよび対話・実験スクリプトとして利用可能にします。
"""

import os
import sys
import time
import numpy as np
import slangpy as spy

import sim_config


class OneSim:
    """1個体専用の VoxelBrain ステップ実行シミュレータ"""

    def __init__(
        self,
        dim: int = 2,
        agent_data: dict | str | None = None,
        device: spy.Device | None = None,
        slang_path: str = "reasoningSim.slang",
    ):
        """
        Args:
            dim: 空間次元 (2 => 4x4x4, 3 => 8x8x8)
            agent_data: 個体データ辞書、または .npz ファイルパス。None の場合はランダム生成。
            device: slangpy Device。None の場合は新規作成。
            slang_path: reasoningSim.slang のファイルパス。
        """
        self.dim = dim
        self.N = 1 << dim
        self.P = self.N + 2
        self.TOTAL_N = self.N * self.N * self.N
        self.TOTAL_NP2 = self.P * self.P * self.P
        self.TOTAL_NP2H2 = self.TOTAL_NP2 // 2
        self.inhib_stride = (self.TOTAL_N + 31) // 32

        self.device = device or spy.create_device(enable_debug_layers=False)
        self.slang_path = slang_path

        # カーネルのコンパイル
        self._build_kernel()

        # 個体パラメータの読み込み/初期化
        self._setup_agent_params(agent_data)

        # GPU バッファの確保
        self._init_gpu_buffers()

        # シミュレーション内部状態カウンタ
        self.inner_step = 0
        self.global_step = 0

        # Python 側キャッシュ用
        self.state = {}

        # 初期化実行 (is_init = 1)
        self.reset()

    def _build_kernel(self):
        """#define ONE_SIM 1 を付与して reasoningSim.slang をコンパイル"""
        with open(self.slang_path, "r", encoding="utf-8") as f:
            code = f.read()

        macros_defines = (
            f"#define ONE_SIM 1\n"
            f"#define DIM {self.dim}\n"
            f"#define NUM_IN_PORTS {sim_config.NUM_IN_PORTS}\n"
            f"#define NUM_OUT_PORTS {sim_config.NUM_OUT_PORTS}\n"
            f"#define INITIAL_ENERGY {sim_config.INITIAL_ENERGY}f\n"
            f"#define METABOLIC_COST {sim_config.METABOLIC_COST}f\n"
            f"#define GEN_COST_RATE {sim_config.GEN_COST_RATE}f\n"
            f"#define SOLAR_GAIN_RATE {sim_config.SOLAR_GAIN_RATE}f\n"
            f"#define SUN_CYCLE_PERIOD {sim_config.SUN_CYCLE_PERIOD}f\n"
            f"#define SPEED_GAIN {sim_config.SPEED_GAIN}f\n"
            f"#define ROTATE_GAIN {sim_config.ROTATE_GAIN}f\n"
        )
        source_code = macros_defines + code
        mod = self.device.load_module_from_source("reasoningSim_onesim", source_code)
        entry = mod.entry_point("computeMain")
        program = self.device.link_program([mod], [entry])
        self.kernel = self.device.create_compute_kernel(program)

    def _setup_agent_params(self, agent_data: dict | str | None):
        """パラメータの読み込みまたはランダム生成"""
        rng = np.random.default_rng(12345)

        # デフォルト入出力ポート
        in_defaults = np.zeros((sim_config.NUM_IN_PORTS, 3), dtype=np.int32)
        out_defaults = np.zeros((sim_config.NUM_OUT_PORTS, 3), dtype=np.int32)
        if self.dim == 1:
            if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 1, 0]
            if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 0, 0]
            if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [5, 1, 0]
            if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [5, 0, 0]
        elif self.dim == 2:
            if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 3, 2]
            if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 1, 2]
            if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
            if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]
        else:
            if sim_config.NUM_IN_PORTS >= 1: in_defaults[0] = [2, 5, 4]
            if sim_config.NUM_IN_PORTS >= 2: in_defaults[1] = [2, 3, 4]
            if sim_config.NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
            if sim_config.NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]

        if (isinstance(agent_data, str) and os.path.exists(agent_data)) or isinstance(agent_data, dict):
            loaded = np.load(agent_data) if isinstance(agent_data, str) else agent_data

            self.sig_pre = loaded["sig_pre"].reshape(self.TOTAL_NP2, 4).astype(np.float16)
            self.sig_post = loaded["sig_post"].reshape(self.TOTAL_NP2, 4).astype(np.float16)
            self.neuromod_gen_map = (
                loaded["neuromod"].reshape(self.TOTAL_N, 4).astype(np.float16)
                if "neuromod" in loaded
                else rng.uniform(0.0, 0.5, size=(self.TOTAL_N, 4)).astype(np.float16)
            )
            self.inhib_packed = loaded["inhib"].astype(np.uint32)

            self.base_output = np.float16(loaded.get("resource_base_output", 0.4))
            self.beta = np.float16(loaded.get("resource_beta", 1.2))
            self.k_refill = np.float16(loaded.get("resource_k_refill", 0.15))

            self.link_multiplier = np.uint32(loaded.get("link_multiplier", 3))
            self.link_bias = np.uint32(loaded.get("link_bias", 7))

            self.nm_rel_matrix = (
                loaded["neuromod_rel_matrix"].astype(np.float16)
                if "neuromod_rel_matrix" in loaded
                else rng.uniform(-0.5, 0.5, size=(4, 4)).astype(np.float16)
            )
            self.nm_reaction = (
                loaded["neuromod_weight_reaction"].astype(np.float16)
                if "neuromod_weight_reaction" in loaded
                else rng.uniform(-0.2, 0.2, size=(4, 4)).astype(np.float16)
            )
            self.nm_diff = np.float16(loaded.get("neuromod_diff", 0.02))

            self.in_ports_fi = loaded["in_ports_fi"].astype(np.int32) if "in_ports_fi" in loaded else in_defaults
            self.out_ports_fi = loaded["out_ports_fi"].astype(np.int32) if "out_ports_fi" in loaded else out_defaults

        else:
            # ランダム生成
            self.sig_pre = rng.uniform(-1.0, 1.0, size=(self.TOTAL_NP2, 4)).astype(np.float16)
            self.sig_post = rng.uniform(-1.0, 1.0, size=(self.TOTAL_NP2, 4)).astype(np.float16)
            self.neuromod_gen_map = rng.uniform(0.0, 0.5, size=(self.TOTAL_N, 4)).astype(np.float16)

            inhib_raw = rng.integers(0, 2, size=(self.TOTAL_N,), dtype=np.uint32)
            self.inhib_packed = np.zeros(self.inhib_stride, dtype=np.uint32)
            for i in range(self.TOTAL_N):
                if inhib_raw[i]:
                    self.inhib_packed[i >> 5] |= (1 << (i & 31))

            self.base_output = np.float16(0.4)
            self.beta = np.float16(1.2)
            self.k_refill = np.float16(0.15)

            self.link_multiplier = np.uint32(3)
            self.link_bias = np.uint32(7)

            self.nm_rel_matrix = rng.uniform(-0.5, 0.5, size=(4, 4)).astype(np.float16)
            self.nm_reaction = rng.uniform(-0.2, 0.2, size=(4, 4)).astype(np.float16)
            self.nm_diff = np.float16(0.02)
            self.in_ports_fi = in_defaults
            self.out_ports_fi = out_defaults

    def _init_gpu_buffers(self):
        """GPU バッファの初期化"""
        # 静的パラメータ
        self.b_inhib = self.device.create_buffer(data=self.inhib_packed, usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
        self.b_sig_pre = self.device.create_buffer(data=self.sig_pre, usage=spy.BufferUsage.shader_resource)
        self.b_sig_post = self.device.create_buffer(data=self.sig_post, usage=spy.BufferUsage.shader_resource)
        self.b_nm_gen = self.device.create_buffer(data=self.neuromod_gen_map, usage=spy.BufferUsage.shader_resource)

        self.b_res_base = self.device.create_buffer(data=np.array([self.base_output], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
        self.b_res_beta = self.device.create_buffer(data=np.array([self.beta], dtype=np.float16), usage=spy.BufferUsage.shader_resource)
        self.b_res_k = self.device.create_buffer(data=np.array([self.k_refill], dtype=np.float16), usage=spy.BufferUsage.shader_resource)

        self.b_link_mul = self.device.create_buffer(data=np.array([self.link_multiplier], dtype=np.uint32), usage=spy.BufferUsage.shader_resource)
        self.b_link_bias = self.device.create_buffer(data=np.array([self.link_bias], dtype=np.uint32), usage=spy.BufferUsage.shader_resource)

        self.b_in_fi = self.device.create_buffer(data=self.in_ports_fi.reshape(1, sim_config.NUM_IN_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)
        self.b_out_fi = self.device.create_buffer(data=self.out_ports_fi.reshape(1, sim_config.NUM_OUT_PORTS, 3), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)

        self.b_nm_rel = self.device.create_buffer(data=self.nm_rel_matrix.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource)
        self.b_nm_react = self.device.create_buffer(data=self.nm_reaction.reshape(1, 4, 4), usage=spy.BufferUsage.shader_resource)
        self.b_nm_diff = self.device.create_buffer(data=np.array([self.nm_diff], dtype=np.float16), usage=spy.BufferUsage.shader_resource)

        # 出力・評価バッファ
        self.b_global_outputs = self.device.create_buffer(data=np.zeros(self.TOTAL_NP2H2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access)
        self.b_membrane = self.device.create_buffer(data=np.zeros(self.TOTAL_NP2H2, dtype=np.uint32), usage=spy.BufferUsage.unordered_access)
        self.b_mut_rate = self.device.create_buffer(data=np.zeros(1, dtype=np.float32), usage=spy.BufferUsage.unordered_access)

        # 状態引き継ぎバッファ (ONE_SIM モード専用)
        self.b_body_state = self.device.create_buffer(data=np.zeros(6, dtype=np.float32), usage=spy.BufferUsage.unordered_access)
        self.b_r = self.device.create_buffer(data=np.zeros(self.TOTAL_N, dtype=np.float16), usage=spy.BufferUsage.unordered_access)
        self.b_nm_state = self.device.create_buffer(data=np.zeros((self.TOTAL_N, 4), dtype=np.float16), usage=spy.BufferUsage.unordered_access)
        self.b_synapse = self.device.create_buffer(data=np.zeros(self.TOTAL_N * 28, dtype=np.float16), usage=spy.BufferUsage.unordered_access)

        # ノックアウト (KO) マスク: True=無効化 (出力0.0固定)
        self.ko_mask = np.zeros((self.N, self.N, self.N), dtype=bool)
        self.b_ko_mask = self.device.create_buffer(data=self._pack_ko_mask(), usage=spy.BufferUsage.unordered_access | spy.BufferUsage.shader_resource)

    def _pack_ko_mask(self) -> np.ndarray:
        """3D bool マスクを uint32 ビットパック配列に変換"""
        flat = self.ko_mask.flatten()
        stride = (self.TOTAL_N + 31) // 32
        packed = np.zeros(stride, dtype=np.uint32)
        for i in range(self.TOTAL_N):
            if flat[i]:
                packed[i >> 5] |= (1 << (i & 31))
        return packed

    def update_ko_buffer(self):
        """Python 側の ko_mask を GPU バッファに同期"""
        packed = self._pack_ko_mask()
        self.b_ko_mask.copy_from_numpy(packed)

    def set_ko(self, x: int, y: int, z: int, val: bool):
        """指定セルの KO 状態を設定"""
        self.ko_mask[z, y, x] = val
        self.update_ko_buffer()

    def toggle_ko(self, x: int, y: int, z: int) -> bool:
        """指定セルの KO 状態を反転"""
        new_val = not self.ko_mask[z, y, x]
        self.set_ko(x, y, z, new_val)
        return new_val

    def clear_ko(self):
        """全セルの KO を解除"""
        self.ko_mask.fill(False)
        self.update_ko_buffer()

    def get_ko_list(self) -> list[dict]:
        """現在 KO されているセルのリストを取得"""
        ko_indices = np.argwhere(self.ko_mask)
        return [{"x": int(x), "y": int(y), "z": int(z)} for z, y, x in ko_indices]

    def _get_slang_init_obj(self, step: int, agent_id: int = 0) -> tuple[float, float]:
        """Slang 内部の初期 obj_rand 計算式と完全一致する目標座標"""
        seed = (12277 * step + 67 * agent_id) & 0xFFFFFFFF
        st = (seed * 747796405 + 2891336453) & 0xFFFFFFFF
        rot = (st >> ((st >> 28) + 4)) & 31
        word = (((st >> rot) ^ st) * 277803737) & 0xFFFFFFFF
        res = (word >> 22) ^ word
        h = float((res & 0xFFFF) / 65535.0)
        obj_rand = 2.0 * h
        return float(np.cos(np.pi * obj_rand)), float(np.sin(np.pi * obj_rand))

    def reset(
        self,
        step: int = 0,
        energy: float | None = None,
        pos: tuple[float, float] = (0.0, 0.0),
        angle: float = 0.0,
        obj: tuple[float, float] | None = None,
    ):
        """シミュレーションを初期状態 (inner_step=0) にリセットし、初期状態をPython側にロード"""
        self.global_step = step
        self.inner_step = 0

        init_energy = float(sim_config.INITIAL_ENERGY if energy is None else energy)
        if obj is None:
            init_obj_x, init_obj_y = self._get_slang_init_obj(step, 0)
        else:
            init_obj_x, init_obj_y = float(obj[0]), float(obj[1])

        # 初期身体状態バッファ
        init_body = np.array([init_energy, pos[0], pos[1], angle, init_obj_x, init_obj_y], dtype=np.float32)
        self.b_body_state.copy_from_numpy(init_body)

        # is_init = 1 でディスパッチ (初期化＋初期状態の書き出し)
        dispatch_args = {
            "inhib_map_all": self.b_inhib,
            "global_outputs_all": self.b_global_outputs,
            "membrane_all": self.b_membrane,
            "signature_pre_map_np2": self.b_sig_pre,
            "signature_post_map_np2": self.b_sig_post,
            "neuromod_gen_map": self.b_nm_gen,
            "resource_params_all": {
                "base_output": self.b_res_base,
                "beta": self.b_res_beta,
                "k_refill": self.b_res_k,
            },
            "link28th_params_all": {
                "multiplier": self.b_link_mul,
                "bias": self.b_link_bias,
            },
            "inout_params_fi_all": {
                "in_ports_fi": self.b_in_fi,
                "out_ports_fi": self.b_out_fi,
            },
            "neuromod_params_all": {
                "neuromod_rel_matrix": self.b_nm_rel,
                "neuromod_weight_reaction": self.b_nm_react,
                "diff": self.b_nm_diff,
            },
            "mutation_rate_all": self.b_mut_rate,
            "dt": np.float16(0.01),
            "step": np.uint32(step),
            "inner_step_val": np.uint32(0),
            "is_init": np.uint32(1),
            "body_state_all": self.b_body_state,
            "r_all": self.b_r,
            "neuromod_state_all": self.b_nm_state,
            "synapse_weights_all": self.b_synapse,
            "ko_mask_all": self.b_ko_mask,
        }

        self.kernel.dispatch(thread_count=(self.N, self.N, self.N), **dispatch_args)
        self.device.wait()

        # 初期状態を Python 側に取得
        self._sync_all_states()
        return self.state

    def step(self):
        """1 innerstep 進行し、全状態をPython側に同期して返す"""
        dispatch_args = {
            "inhib_map_all": self.b_inhib,
            "global_outputs_all": self.b_global_outputs,
            "membrane_all": self.b_membrane,
            "signature_pre_map_np2": self.b_sig_pre,
            "signature_post_map_np2": self.b_sig_post,
            "neuromod_gen_map": self.b_nm_gen,
            "resource_params_all": {
                "base_output": self.b_res_base,
                "beta": self.b_res_beta,
                "k_refill": self.b_res_k,
            },
            "link28th_params_all": {
                "multiplier": self.b_link_mul,
                "bias": self.b_link_bias,
            },
            "inout_params_fi_all": {
                "in_ports_fi": self.b_in_fi,
                "out_ports_fi": self.b_out_fi,
            },
            "neuromod_params_all": {
                "neuromod_rel_matrix": self.b_nm_rel,
                "neuromod_weight_reaction": self.b_nm_react,
                "diff": self.b_nm_diff,
            },
            "mutation_rate_all": self.b_mut_rate,
            "dt": np.float16(0.01),
            "step": np.uint32(self.global_step),
            "inner_step_val": np.uint32(self.inner_step),
            "is_init": np.uint32(0),
            "body_state_all": self.b_body_state,
            "r_all": self.b_r,
            "neuromod_state_all": self.b_nm_state,
            "synapse_weights_all": self.b_synapse,
            "ko_mask_all": self.b_ko_mask,
        }

        self.kernel.dispatch(thread_count=(self.N, self.N, self.N), **dispatch_args)
        self.device.wait()

        self.inner_step += 1

        # 全状態を Python 側に同期
        self._sync_all_states()
        return self.state

    def _sync_all_states(self):
        """GPUからPython (CPU RAM) へ全状態を読み込む"""
        body_arr = self.b_body_state.to_numpy().view(np.float32)
        outputs_arr = self.b_membrane.to_numpy().view(np.float16).reshape(self.P, self.P, self.P)
        r_arr = self.b_r.to_numpy().view(np.float16).reshape(self.N, self.N, self.N)
        nm_arr = self.b_nm_state.to_numpy().view(np.float16).reshape(self.N, self.N, self.N, 4)
        syn_arr = self.b_synapse.to_numpy().view(np.float16).reshape(self.N, self.N, self.N, 28)

        # 太陽光と発電出力の計算
        current_sunlight = float(np.clip(np.sin(np.pi * (self.inner_step / sim_config.SUN_CYCLE_PERIOD)), 0.0, 1.0))

        self.state = {
            "inner_step": self.inner_step,
            "energy": float(body_arr[0]),
            "pos": np.array([body_arr[1], body_arr[2]], dtype=np.float32),
            "angle": float(body_arr[3]),
            "obj": np.array([body_arr[4], body_arr[5]], dtype=np.float32),
            "sunlight": current_sunlight,
            "outputs": outputs_arr,
            "internal_outputs": outputs_arr[1:-1, 1:-1, 1:-1],
            "r": r_arr,
            "neuromod": nm_arr,
            "synapse_weights": syn_arr,
        }

    def scan_ko_all(self, total_inner_steps: int = 1000, progress_callback=None) -> dict:
        """全内部セルを 1 つずつ KO して影響度（重要度）を自動スキャン

        Returns:
            dict: {
                "base_energy": float,
                "rankings": list[dict], # [{"rank": 1, "x": x, "y": y, "z": z, "ko_energy": float, "drop": float}, ...]
                "importance_map": list[list[list[float]]], # (N, N, N) ドロップ量グリッド
            }
        """
        # 元の KO マスクを退避
        saved_mask = self.ko_mask.copy()
        saved_step = self.global_step

        # 1. ベースライン (KO なし) での計測
        self.clear_ko()
        self.reset(step=saved_step)
        # 高速実行 (中間転送なし)
        dispatch_args = self._get_dispatch_args(is_init=0)
        for s in range(total_inner_steps):
            dispatch_args["inner_step_val"] = np.uint32(s)
            self.kernel.dispatch(thread_count=(self.N, self.N, self.N), **dispatch_args)
        self.device.wait()
        base_energy = float(self.b_body_state.to_numpy().view(np.float32)[0])

        results = []
        importance_map = np.zeros((self.N, self.N, self.N), dtype=np.float32)
        total_cells = self.TOTAL_N

        cell_count = 0
        for z in range(self.N):
            for y in range(self.N):
                for x in range(self.N):
                    # 該当セルだけ KO
                    self.ko_mask.fill(False)
                    self.ko_mask[z, y, x] = True
                    self.update_ko_buffer()

                    # リセットして 1000 ステップ高速実行
                    self.reset(step=saved_step)
                    dispatch_args = self._get_dispatch_args(is_init=0)
                    for s in range(total_inner_steps):
                        dispatch_args["inner_step_val"] = np.uint32(s)
                        self.kernel.dispatch(thread_count=(self.N, self.N, self.N), **dispatch_args)
                    self.device.wait()

                    ko_e = float(self.b_body_state.to_numpy().view(np.float32)[0])
                    drop = float(base_energy - ko_e)
                    importance_map[z, y, x] = drop

                    results.append({
                        "x": int(x),
                        "y": int(y),
                        "z": int(z),
                        "ko_energy": ko_e,
                        "drop": drop,
                    })

                    cell_count += 1
                    if progress_callback:
                        progress_callback(cell_count, total_cells)

        # ドロップ量（重要度）降順でソート
        results.sort(key=lambda r: r["drop"], reverse=True)
        for rank, r in enumerate(results, 1):
            r["rank"] = rank

        # 元の KO マスクと状態を復元
        self.ko_mask = saved_mask
        self.update_ko_buffer()
        self.reset(step=saved_step)

        return {
            "base_energy": base_energy,
            "rankings": results,
            "importance_map": importance_map.tolist(),
        }

    def _get_dispatch_args(self, is_init: int) -> dict:
        return {
            "inhib_map_all": self.b_inhib,
            "global_outputs_all": self.b_global_outputs,
            "membrane_all": self.b_membrane,
            "signature_pre_map_np2": self.b_sig_pre,
            "signature_post_map_np2": self.b_sig_post,
            "neuromod_gen_map": self.b_nm_gen,
            "resource_params_all": {
                "base_output": self.b_res_base,
                "beta": self.b_res_beta,
                "k_refill": self.b_res_k,
            },
            "link28th_params_all": {
                "multiplier": self.b_link_mul,
                "bias": self.b_link_bias,
            },
            "inout_params_fi_all": {
                "in_ports_fi": self.b_in_fi,
                "out_ports_fi": self.b_out_fi,
            },
            "neuromod_params_all": {
                "neuromod_rel_matrix": self.b_nm_rel,
                "neuromod_weight_reaction": self.b_nm_react,
                "diff": self.b_nm_diff,
            },
            "mutation_rate_all": self.b_mut_rate,
            "dt": np.float16(0.01),
            "step": np.uint32(self.global_step),
            "inner_step_val": np.uint32(self.inner_step),
            "is_init": np.uint32(is_init),
            "body_state_all": self.b_body_state,
            "r_all": self.b_r,
            "neuromod_state_all": self.b_nm_state,
            "synapse_weights_all": self.b_synapse,
            "ko_mask_all": self.b_ko_mask,
        }

    # ================= 便利プロパティ =================
    @property
    def energy(self) -> float:
        return self.state.get("energy", 0.0)

    @property
    def pos(self) -> np.ndarray:
        return self.state.get("pos", np.zeros(2, dtype=np.float32))

    @property
    def angle(self) -> float:
        return self.state.get("angle", 0.0)

    @property
    def obj(self) -> np.ndarray:
        return self.state.get("obj", np.zeros(2, dtype=np.float32))

    @property
    def outputs(self) -> np.ndarray:
        return self.state["outputs"]

    @property
    def internal_outputs(self) -> np.ndarray:
        return self.state["internal_outputs"]

    @property
    def r(self) -> np.ndarray:
        return self.state["r"]

    @property
    def neuromod(self) -> np.ndarray:
        return self.state["neuromod"]

    @property
    def synapse_weights(self) -> np.ndarray:
        return self.state["synapse_weights"]


def main():
    """CLI / 動作確認用デモ"""
    print("[+] OneSim (Step-by-step GPU Simulator) 起動テスト")

    # 引数があれば .npz ファイルをロード
    npz_path = sys.argv[1] if len(sys.argv) > 1 else None
    if npz_path:
        print(f"[+] ロード対象ファイル: {npz_path}")
    else:
        print("[+] 個体データ未指定: ランダム個体で実行します")

    sim = OneSim(dim=2, agent_data=npz_path)
    print(f"[+] 初期化完了: N={sim.N}, P={sim.P}, 初期エネルギー={sim.energy:.4f}")

    TOTAL_STEPS = 1000
    print(f"[+] {TOTAL_STEPS} innerstep のステップ実行を開始します (毎ステップ全状態同期)...")

    start_time = time.perf_counter()

    for s in range(TOTAL_STEPS):
        state = sim.step()

        if (s + 1) % 100 == 0 or s == TOTAL_STEPS - 1:
            elapsed = time.perf_counter() - start_time
            fps = (s + 1) / max(1e-5, elapsed)
            print(
                f"Step {s + 1:4d}/{TOTAL_STEPS} | "
                f"Energy: {state['energy']:.4f} | "
                f"Pos: ({state['pos'][0]:+.2f}, {state['pos'][1]:+.2f}) | "
                f"Angle: {state['angle']:+.2f} | "
                f"Speed: {fps:.1f} steps/sec (Hz)"
            )

    elapsed_total = time.perf_counter() - start_time
    avg_fps = TOTAL_STEPS / max(1e-5, elapsed_total)
    print("=" * 60)
    print(f"[+] シミュレーション完了: 総時間={elapsed_total:.3f}秒, 平均速度={avg_fps:.1f} FPS")
    print(f"[+] 最終エネルギー: {sim.energy:.6f}")
    print(f"[+] 最終シナプス重み shape: {sim.synapse_weights.shape}")
    print(f"[+] 最終修飾物質 shape:   {sim.neuromod.shape}")
    print(f"[+] 最終出力 shape:       {sim.outputs.shape}")


if __name__ == "__main__":
    main()
