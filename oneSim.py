import os
import sys
import tkinter as tk
from tkinter import filedialog
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# ==============================================================================
# 初期設定（Slang側のパラメータと合わせて調整可能）
# ==============================================================================
ENABLE_LIFELONG_LEARNING = False  # Lキーで実行中も切り替え可能
STEPS_PER_FRAME = 1               # 1フレームあたりに進めるtick数（↑/↓キーで変更可）

INITIAL_ENERGY = 0.20             # 初期エネルギー
METABOLIC_COST = 0.000            # 基礎代謝（毎tickの固定消費）
GEN_COST_RATE  = 0.005            # 発電稼働コスト係数
SOLAR_GAIN_RATE = 0.010           # 太陽光発電ゲイン係数
HISTORY_LEN = 200                 # グラフに表示する過去tick数（昼夜2サイクル分）

# ==============================================================================
# 1. ファイル選択 ＆ エリート(.npz)読み込み（サイズ自動判別）
# ==============================================================================
def select_npz_file() -> str:
    root = tk.Tk()
    root.withdraw()
    initial_dir = os.path.abspath("backups") if os.path.exists("backups") else os.getcwd()
    file_path = filedialog.askopenfilename(
        title="観察する太陽光エリート個体 (.npz) を選択してください",
        initialdir=initial_dir,
        filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")]
    )
    root.destroy()
    return file_path


def load_elite_npz(npz_path: str):
    data = np.load(npz_path)

    total_n = int(data["dopamine"].size)
    n = int(round(total_n ** (1.0 / 3.0)))
    dim = int(np.log2(n))
    p = n + 2

    sig_pre = data["sig_pre"].astype(np.float32).reshape((p, p, p, 4))
    sig_post = data["sig_post"].astype(np.float32).reshape((p, p, p, 4))
    dopamine_map = data["dopamine"].astype(np.float32).reshape(total_n)
    sleep_map = data["sleep"].astype(np.float32).reshape(total_n)

    packed_inhib = data["inhib"].view(np.uint32)
    idx = np.arange(total_n)
    words = packed_inhib[idx >> 5]
    bits = (words >> (idx & 31)) & 1
    inhib = np.where(bits == 1, -1.0, 1.0).astype(np.float32)

    params = {
        "base_output": float(data["resource_base_output"]),
        "beta": float(data["resource_beta"]),
        "k_refill": float(data["resource_k_refill"]),
        "multiplier": int(data["link_multiplier"]),
        "bias": int(data["link_bias"]),
        "learning_rate": float(data["learn_rate"]),
        "forget_rate": float(data["learn_forget"]) if "learn_forget" in data else 0.05,
        "learning_threshold": float(data["learn_threshold"]),
        "tag_decay": float(data["learn_decay"]),
    }

    spec = {"dim": dim, "n": n, "p": p, "total_n": total_n, "center": n // 2}
    return sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, spec

# ==============================================================================
# 2. 太陽光タスク用 CPUシミュレーション クラス
# ==============================================================================
class SolarBrainCPU:
    def __init__(self, sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, spec):
        self.params = params
        self.spec = spec
        self.dim = spec["dim"]
        self.N = spec["n"]
        self.P = spec["p"]
        self.TOTAL_N = spec["total_n"]
        self.CENTER = spec["center"]

        self.dopamine_map = dopamine_map
        self.sleep_map = sleep_map
        self.inhib = inhib

        idx = np.arange(self.TOTAL_N)
        self.coords_x = (idx >> 0) & (self.N - 1)
        self.coords_y = (idx >> self.dim) & (self.N - 1)
        self.coords_z = (idx >> (self.dim * 2)) & (self.N - 1)

        offsets = np.array([(dz, dy, dx) for dz in [-1, 0, 1] for dy in [-1, 0, 1] for dx in [-1, 0, 1]])
        nz = self.coords_z[:, None] + 1 + offsets[:, 0]
        ny = self.coords_y[:, None] + 1 + offsets[:, 1]
        nx = self.coords_x[:, None] + 1 + offsets[:, 2]

        idx_27th = (idx * params["multiplier"] + params["bias"]) & (self.TOTAL_N - 1)
        w27_x = ((idx_27th >> 0) & (self.N - 1)) + 1
        w27_y = ((idx_27th >> self.dim) & (self.N - 1)) + 1
        w27_z = ((idx_27th >> (self.dim * 2)) & (self.N - 1)) + 1

        self.conn_z = np.concatenate([nz, w27_z[:, None]], axis=1)
        self.conn_y = np.concatenate([ny, w27_y[:, None]], axis=1)
        self.conn_x = np.concatenate([nx, w27_x[:, None]], axis=1)

        my_post = sig_post[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]
        target_pre = sig_pre[self.conn_z, self.conn_y, self.conn_x]
        dot_val = np.sum(my_post[:, None, :] * target_pre, axis=-1) * 0.25
        self.initial_weights = np.clip(dot_val, 0.0, 1.0).astype(np.float32)

        self.reset()

    def reset(self):
        self.weights = self.initial_weights.copy()
        self.tags = np.zeros_like(self.weights)

        # Slang側と同じ初期出力 0.5
        self.outputs_np2 = np.zeros((self.P, self.P, self.P), dtype=np.float32)
        self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1] = 0.5
        self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

        self.R = np.ones(self.TOTAL_N, dtype=np.float32)
        self.dopamine_sum = 0.0
        self.sleep_sum = 0.0
        self.flicker_rate = 0.0

        self.inner_step_counter = 0
        self.energy = INITIAL_ENERGY
        self.current_sunlight = 0.0
        self.generator_power = 0.0
        self.net_delta_energy = 0.0

        # 波形履歴
        self.step_history = []
        self.sun_history = []
        self.gen_history = []
        self.energy_history = []
        self.dopamine_history = []
        self.sleep_history = []

    def step(self, inner_steps=1, enable_learning=False):
        for _ in range(inner_steps):
            self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

            in_outputs = self.outputs_np2[self.conn_z, self.conn_y, self.conn_x]
            delta_net = in_outputs * self.weights
            net = np.sum(delta_net, axis=1)

            if enable_learning:
                self.tags = np.clip(
                    (self.tags + np.clip(np.abs(delta_net), 0.0, 1.0)) * (1.0 - self.params["tag_decay"]),
                    0.0, 1.0
                )
                bistable = self.weights * (1.0 - self.weights) * (self.weights - self.params["learning_threshold"])
                dw_nbr = self.params["forget_rate"] * (
                    self.dopamine_sum * self.tags[:, :27] + self.params["learning_rate"] * bistable[:, :27]
                )
                dw_27th = self.params["learning_rate"] * (
                    self.dopamine_sum * self.tags[:, 27:] + self.params["learning_rate"] * bistable[:, 27:]
                )
                self.weights = np.clip(self.weights + np.concatenate([dw_nbr, dw_27th], axis=1), 0.0, 1.0)

            scaled_net = np.clip(net * self.params["beta"], -20.0, 20.0)
            output_rate = np.minimum(1.0, self.params["base_output"] * np.exp2(scaled_net))
            my_output = (1.0 - self.sleep_sum) * self.inhib * output_rate * self.R

            self.outputs_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1] = my_output
            self.R = np.clip(self.R - output_rate * self.R + self.params["k_refill"], 0.0, 1.0)

            cur_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1]
            self.flicker_rate = float(np.mean((cur_outputs * self.prev_outputs) < -0.001))

            self.dopamine_sum = float(np.sum(np.abs(my_output) * self.dopamine_map))
            self.sleep_sum = float(np.clip(np.sum(np.abs(my_output) * self.sleep_map), 0.0, 1.0))

            # --- 太陽光と発電量の計算 (reasoningSim.slang と完全一致: [z+1, y+1, x+1]) ---
            self.current_sunlight = float(np.clip(np.sin(np.pi * self.inner_step_counter / 50.0), 0.0, 1.0))

            if self.dim == 1:
                # int3(1, 0, 1) - int3(0, 0, 1) -> [z=2, y=1, x=2] - [z=2, y=1, x=1]
                gen_raw = self.outputs_np2[2, 1, 2] - self.outputs_np2[2, 1, 1]
            else:
                # int3(3, 2, 1) - int3(1, 2, 1) -> [z=2, y=3, x=4] - [z=2, y=3, x=2]
                gen_raw = self.outputs_np2[2, 3, 4] - self.outputs_np2[2, 3, 2]

            self.generator_power = float(abs(gen_raw))

            # エネルギー収支
            cost = METABOLIC_COST + self.generator_power * GEN_COST_RATE
            gain = self.generator_power * SOLAR_GAIN_RATE * self.current_sunlight
            self.net_delta_energy = gain - cost
            if self.energy == 0.0:
                self.energy = 0.0
            else:
                self.energy = float(np.clip(self.energy + self.net_delta_energy, 0.0, 1.0))

            # --- 感覚入力の書き込み (reasoningSim.slang と同期) ---
            if self.dim == 1:
                self.outputs_np2[1, 0, 1] = self.energy            # int3(0, -1, 0)
                self.outputs_np2[1, 0, 2] = self.current_sunlight  # int3(1, -1, 0)
            elif self.dim == 2:
                self.outputs_np2[3, 0, 2] = self.energy            # int3(1, -1, 2)
                self.outputs_np2[3, 0, 4] = self.current_sunlight  # int3(3, -1, 2)
            else:
                self.outputs_np2[5, 0, 4] = self.energy            # int3(3, -1, 4)
                self.outputs_np2[5, 0, 6] = self.current_sunlight  # int3(5, -1, 4)

            # 履歴の記録
            self.step_history.append(self.inner_step_counter)
            self.sun_history.append(self.current_sunlight)
            self.gen_history.append(self.generator_power)
            self.energy_history.append(self.energy)
            self.dopamine_history.append(self.dopamine_sum)
            self.sleep_history.append(self.sleep_sum)

            if len(self.step_history) > HISTORY_LEN:
                self.step_history.pop(0)
                self.sun_history.pop(0)
                self.gen_history.pop(0)
                self.energy_history.pop(0)
                self.dopamine_history.pop(0)
                self.sleep_history.pop(0)

            self.inner_step_counter += 1

# ==============================================================================
# 3. リアルタイム可視化（太陽光＆エネルギー波形 ＋ 全Zスライス展開）
# ==============================================================================
def main():
    global ENABLE_LIFELONG_LEARNING, STEPS_PER_FRAME

    selected_file = select_npz_file()
    if not selected_file:
        print("[!] ファイルが選択されませんでした。")
        sys.exit(0)

    agent_data = load_elite_npz(selected_file)
    brain = SolarBrainCPU(*agent_data)
    N = brain.N

    paused = False

    fig = plt.figure(figsize=(15, 8))
    gs_main = fig.add_gridspec(2, 2, width_ratios=[1.2, 1.2], height_ratios=[1, 1.2])

    # --- 左上: 太陽光 (Sunlight) vs 発電出力 (|Generator Power|) ---
    ax_solar = fig.add_subplot(gs_main[0, 0])
    ax_solar.set_title("Sunlight vs Generator Power\n[Space]:Pause [->]:1Step [Up/Down]:Speed [R]:Reset [L]:Learn [O]:Open", fontsize=9.5)
    ax_solar.set_ylim(-0.05, 1.25)
    ax_solar.grid(True, linestyle="--", alpha=0.4)

    line_sun, = ax_solar.plot([], [], color="gold", linewidth=2.5, label="Sunlight (昼夜)")
    line_gen, = ax_solar.plot([], [], color="crimson", linewidth=1.8, label="|Generator Power| (発電出力)")
    # 黒字ライン (GEN_COST_RATE / SOLAR_GAIN_RATE)
    breakeven = GEN_COST_RATE / SOLAR_GAIN_RATE if SOLAR_GAIN_RATE > 0 else 0.5
    ax_solar.axhline(breakeven, color="gray", linestyle=":", alpha=0.7, label=f"黒字太陽光ライン ({breakeven:.2f})")
    ax_solar.legend(loc="upper right", fontsize=8.5)

    # --- 左下: エネルギー残量 (my_energy_s) の推移 ---
    ax_energy = fig.add_subplot(gs_main[1, 0])
    ax_energy.set_title("Energy Level (0.0 = 餓死 / 0.2 = 初期値 / 1.0 = 満タン)", fontsize=10)
    ax_energy.set_ylim(-0.02, 1.05)
    ax_energy.grid(True, linestyle="--", alpha=0.4)

    line_energy, = ax_energy.plot([], [], color="limegreen", linewidth=2.5, label="Energy (my_energy_s)")
    ax_energy.axhline(INITIAL_ENERGY, color="royalblue", linestyle="--", alpha=0.6, label=f"Initial ({INITIAL_ENERGY:.2f})")
    ax_energy.legend(loc="lower left", fontsize=8.5)

    info_text = ax_energy.text(
        0.02, 0.95, "", transform=ax_energy.transAxes, fontsize=9,
        verticalalignment="top", bbox=dict(boxstyle="round", facecolor="white", alpha=0.88)
    )

    # --- 右上: ドーパミン・スリープ波形 ---
    ax_signals = fig.add_subplot(gs_main[0, 1])
    line_dopamine, = ax_signals.plot([], [], label="Dopamine Sum", color="darkorange", linewidth=2)
    line_sleep, = ax_signals.plot([], [], label="Sleep Sum", color="purple", linewidth=1.5)
    ax_signals.set_ylim(0, 1.5)
    ax_signals.legend(loc="upper right", fontsize=8.5)
    ax_signals.grid(True, alpha=0.3)

    # --- 右下: 脳の全Zスライス表示 (Z=0 .. N-1) ---
    cols = min(N, 4)
    rows = (N + cols - 1) // cols
    gs_slices = gs_main[1, 1].subgridspec(rows, cols, wspace=0.25, hspace=0.3)

    slice_ims = []
    for z in range(N):
        r, c = divmod(z, cols)
        ax_s = fig.add_subplot(gs_slices[r, c])
        ax_s.set_title(f"Slice Z={z}", fontsize=9)
        im = ax_s.imshow(np.zeros((N, N)), cmap="coolwarm", vmin=-0.3, vmax=0.3, origin="lower")
        ax_s.set_xticks(range(N))
        ax_s.set_yticks(range(N))
        slice_ims.append(im)

    plt.tight_layout()

    def render_state():
        steps = brain.step_history
        if not steps:
            return

        x_min, x_max = steps[0], max(steps[-1], steps[0] + HISTORY_LEN)

        # 左上: 太陽光＆発電出力
        ax_solar.set_xlim(x_min, x_max)
        line_sun.set_data(steps, brain.sun_history)
        line_gen.set_data(steps, brain.gen_history)

        # 左下: エネルギー残量
        ax_energy.set_xlim(x_min, x_max)
        line_energy.set_data(steps, brain.energy_history)

        internal_outputs = brain.outputs_np2[1:brain.N+1, 1:brain.N+1, 1:brain.N+1]
        mode_str = "ON" if ENABLE_LIFELONG_LEARNING else "OFF (Fixed)"
        state_str = "PAUSED" if paused else f"RUNNING ({STEPS_PER_FRAME} step/frame)"
        day_night = "🌞 昼 (Day)" if brain.current_sunlight > 0.01 else "🌙 夜 (Night)"

        info_text.set_text(
            f"File: {os.path.basename(selected_file)} ({brain.N}x{brain.N}x{brain.N})\n"
            f"Status: {state_str} | Learning: {mode_str}\n"
            f"Inner Step: {brain.inner_step_counter:4d} | {day_night} (Sun: {brain.current_sunlight:.2f})\n"
            f"Energy: {brain.energy:.4f} (Diff: {brain.energy - INITIAL_ENERGY:+.4f})\n"
            f"Generator: {brain.generator_power:.3f} | Net Gain/tick: {brain.net_delta_energy:+.5f}\n"
            f"Mean |Output|: {float(np.mean(np.abs(internal_outputs))):.4f} | Flicker: {brain.flicker_rate:.1%} | R: {float(np.mean(brain.R)):.3f}"
        )

        # 右上: ドーパミン・スリープ
        ax_signals.set_title(f"Neuromodulators [Lifelong Learning: {mode_str}]", fontsize=10.5)
        ax_signals.set_xlim(x_min, x_max)
        line_dopamine.set_data(steps, brain.dopamine_history)
        line_sleep.set_data(steps, brain.sleep_history)
        max_mod = max(max(brain.dopamine_history), max(brain.sleep_history), 0.5)
        ax_signals.set_ylim(0, max_mod * 1.15)

        # 右下: 全Zスライス更新
        v_limit = max(float(np.max(np.abs(internal_outputs))), 0.05)
        for z in range(brain.N):
            slice_ims[z].set_clim(-v_limit, v_limit)
            slice_ims[z].set_data(internal_outputs[z])

    def update(frame):
        if not paused:
            brain.step(inner_steps=STEPS_PER_FRAME, enable_learning=ENABLE_LIFELONG_LEARNING)
            render_state()
        return [line_sun, line_gen, line_energy, info_text, line_dopamine, line_sleep] + slice_ims

    def on_key(event):
        nonlocal paused, brain, selected_file
        global ENABLE_LIFELONG_LEARNING, STEPS_PER_FRAME

        if event.key == " ":
            paused = not paused
            render_state()
            fig.canvas.draw_idle()
        elif event.key == "right" and paused:
            brain.step(inner_steps=1, enable_learning=ENABLE_LIFELONG_LEARNING)
            render_state()
            fig.canvas.draw_idle()
        elif event.key == "up":
            STEPS_PER_FRAME = min(20, STEPS_PER_FRAME + 1)
            render_state()
        elif event.key == "down":
            STEPS_PER_FRAME = max(1, STEPS_PER_FRAME - 1)
            render_state()
        elif event.key == "r":
            brain.reset()
            brain.step(inner_steps=1, enable_learning=ENABLE_LIFELONG_LEARNING)
            render_state()
            fig.canvas.draw_idle()
        elif event.key == "l":
            ENABLE_LIFELONG_LEARNING = not ENABLE_LIFELONG_LEARNING
            render_state()
            fig.canvas.draw_idle()
        elif event.key == "o":
            paused = True
            new_file = select_npz_file()
            if new_file:
                selected_file = new_file
                new_data = load_elite_npz(selected_file)
                brain = SolarBrainCPU(*new_data)
            paused = False

    fig.canvas.mpl_connect("key_press_event", on_key)
    anim = FuncAnimation(fig, update, frames=10000, interval=40, blit=False)
    plt.show()

if __name__ == "__main__":
    main()