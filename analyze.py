import os
import sys
import tkinter as tk
from tkinter import filedialog
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# ==============================================================================
# 設定
# ==============================================================================
# ★ 生涯学習（ヘブ則・タグ・ドーパミンによる重み更新）を有効にするかどうか
ENABLE_LIFELONG_LEARNING = float(np.clip(float(os.environ.get("ANALYZE_LEARNING", "0.0")), 0.0, 1.0))  # 0.0 ~ 1.0 の連続有効度合い (0.0: 重み固定)

WORLD_SIZE = float(os.environ.get("ANALYZE_WORLD_SIZE", "100.0"))
DT = float(os.environ.get("ANALYZE_DT", "0.01"))

# ==============================================================================
# 1. ファイル選択 ＆ エリート(.npz)読み込み（DIM自動検出）
# ==============================================================================
def select_npz_file() -> str:
    cli_path = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ANALYZE_NPZ_PATH", "")
    if cli_path and os.path.exists(cli_path):
        print(f"[+] 指定ファイルを読み込み中: {cli_path}")
        return cli_path
    root = tk.Tk()
    root.withdraw()

    initial_dir = os.path.abspath("backups") if os.path.exists("backups") else os.getcwd()

    file_path = filedialog.askopenfilename(
        title="可視化するエリート個体 (.npz) を選択してください",
        initialdir=initial_dir,
        filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")]
    )

    if not file_path:
        print("[!] ファイルが選択されませんでした。終了します。")
        sys.exit(0)

    print(f"[+] 読み込み中: {file_path}")
    return file_path


def load_elite_npz(npz_path: str):
    """
    .npz からエリート個体をロードし、配列の要素数から DIM / N を自動判定する
    """
    data = np.load(npz_path)

    # ニューロン総数から N と DIM を自動計算
    total_n = int(data["dopamine"].size)
    n = int(round(total_n ** (1.0 / 3.0)))
    dim = int(np.log2(n))
    p = n + 2

    print(f"[★] 検出された脳サイズ: DIM={dim} (N={n}, 全{total_n}ニューロン, P={p})")

    sig_pre = data["sig_pre"].astype(np.float32).reshape((p, p, p, 4))
    sig_post = data["sig_post"].astype(np.float32).reshape((p, p, p, 4))
    dopamine_map = data["dopamine"].astype(np.float32).reshape(total_n)
    sleep_map = data["sleep"].astype(np.float32).reshape(total_n)

    # uint32ビットパッキングされた inhib を [-1.0, 1.0] に展開
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

    spec = {
        "dim": dim,
        "n": n,
        "p": p,
        "total_n": total_n,
        "center": n // 2
    }

    return sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, spec

# ==============================================================================
# 2. CPUシミュレーション クラス (サイズ自動追従)
# ==============================================================================
class VoxelBrainCPU:
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
        self.inner_step_counter = 0

        # 座標マッピング (x, y, z)
        idx = np.arange(self.TOTAL_N)
        self.coords_x = (idx >> 0) & (self.N - 1)
        self.coords_y = (idx >> self.dim) & (self.N - 1)
        self.coords_z = (idx >> (self.dim * 2)) & (self.N - 1)

        # 27近傍のオフセット (dz, dy, dx)
        offsets = np.array([(dz, dy, dx) for dz in [-1, 0, 1] for dy in [-1, 0, 1] for dx in [-1, 0, 1]])

        nz = self.coords_z[:, None] + 1 + offsets[:, 0]
        ny = self.coords_y[:, None] + 1 + offsets[:, 1]
        nx = self.coords_x[:, None] + 1 + offsets[:, 2]

        # 28番目のワームホール結合
        idx_27th = (idx * params["multiplier"] + params["bias"]) & (self.TOTAL_N - 1)
        w27_x = ((idx_27th >> 0) & (self.N - 1)) + 1
        w27_y = ((idx_27th >> self.dim) & (self.N - 1)) + 1
        w27_z = ((idx_27th >> (self.dim * 2)) & (self.N - 1)) + 1

        self.conn_z = np.concatenate([nz, w27_z[:, None]], axis=1)
        self.conn_y = np.concatenate([ny, w27_y[:, None]], axis=1)
        self.conn_x = np.concatenate([nx, w27_x[:, None]], axis=1)

        # 初期シナプス重み
        my_post = sig_post[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]
        target_pre = sig_pre[self.conn_z, self.conn_y, self.conn_x]
        dot_val = np.sum(my_post[:, None, :] * target_pre, axis=-1) * 0.25
        self.weights = np.clip(dot_val, 0.0, 1.0).astype(np.float32)
        self.tags = np.zeros_like(self.weights)

        # 出力層
        self.outputs_np2 = np.zeros((self.P, self.P, self.P), dtype=np.float32)
        self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1] = np.random.uniform(-0.1, 0.2, size=(self.N, self.N, self.N))

        self.R = np.ones(self.TOTAL_N, dtype=np.float32)
        self.dopamine_sum = 0.0
        self.sleep_sum = 0.0

        self.pos = np.array([0.0, 0.0], dtype=np.float32)
        self.obj_pos = self._spawn_target_away()
        self.goal_count = 0
        self.trajectory = [self.pos.copy()]

    def _spawn_target_away(self):
        """現在地から必ず30〜70離れた位置にゴールを生成"""
        angle = np.random.uniform(0, 2 * np.pi)
        dist = np.random.uniform(30.0, 70.0)
        offset = np.array([np.cos(angle), np.sin(angle)], dtype=np.float32) * dist
        target = self.pos + offset
        target = np.where(np.abs(target) > WORLD_SIZE, self.pos - offset, target)
        return np.clip(target, -WORLD_SIZE, WORLD_SIZE)

    def step(self, inner_steps=5):
        for _ in range(inner_steps):
            in_outputs = self.outputs_np2[self.conn_z, self.conn_y, self.conn_x]
            delta_net = in_outputs * self.weights
            net = np.sum(delta_net, axis=1)

            # ==============================================================
            # 【生涯学習の切り替え】
            # ENABLE_LIFELONG_LEARNING = False のときは重み更新をスキップ！
            # ==============================================================
            if ENABLE_LIFELONG_LEARNING > 0.0:
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
                self.weights = np.clip(self.weights + np.concatenate([dw_nbr, dw_27th], axis=1) * ENABLE_LIFELONG_LEARNING, 0.0, 1.0)

            # 発火率と出力
            scaled_net = np.clip(net * self.params["beta"], -20.0, 20.0)
            output_rate = np.minimum(1.0, self.params["base_output"] * np.exp2(scaled_net))
            my_output = (1.0 - self.sleep_sum) * self.inhib * output_rate * self.R

            self.outputs_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1] = my_output
            self.R = np.clip(self.R - output_rate * self.R + self.params["k_refill"], 0.0, 1.0)

            # ドーパミン・スリープ
            self.dopamine_sum = float(np.sum(np.abs(my_output) * self.dopamine_map))
            self.sleep_sum = float(np.clip(np.sum(np.abs(my_output) * self.sleep_map), 0.0, 1.0))

            # 身体運動 (reasoningSim.slang と完全に同期)
            if self.dim == 1:
                # 2x2x2 用 (内部座標は 0..1)
                vx = self.outputs_np2[1 + 1, 0 + 1, 1 + 1] - self.outputs_np2[1 + 1, 0 + 1, 0 + 1]
                vy = self.outputs_np2[1 + 1, 1 + 1, 0 + 1] - self.outputs_np2[0 + 1, 0 + 1, 0 + 1]
            else:
                # 4x4x4 / 8x8x8 用
                vx = self.outputs_np2[1 + 1, 2 + 1, 3 + 1] - self.outputs_np2[1 + 1, 2 + 1, 1 + 1]
                vy = self.outputs_np2[1 + 1, 3 + 1, 2 + 1] - self.outputs_np2[1 + 1, 1 + 1, 2 + 1]

            speed = 300.0 * np.array([vx, vy], dtype=np.float32)
            self.pos = np.clip(self.pos + speed * DT, -WORLD_SIZE, WORLD_SIZE)

            # ゴール判定と感覚入力
            diff = self.pos - self.obj_pos
            K = 100.0
            norm_threshold = 5.0 / (5.0 + K)
            norm_diff = diff / (np.abs(diff) + K)
            norm_diff_abs = np.abs(norm_diff)
            diff_sign = np.where(norm_diff >= 0, 1, -1)

            if norm_diff_abs[0] <= norm_threshold and norm_diff_abs[1] <= norm_threshold:
                self.goal_count += 1
                self.obj_pos = self._spawn_target_away()
                print(f"  [Goal!] 通算ゴール数: {self.goal_count} (step={self.inner_step_counter})")

            # 感覚入力の書き込み (reasoningSim.slang と同期)
            if self.dim == 1:
                sx = 1 if diff_sign[0] > 0 else 0
                sz = 1 if diff_sign[1] > 0 else 0
                self.outputs_np2[0 + 1, 0, sx + 1] = norm_diff_abs[0]
                self.outputs_np2[sz + 1, 0, 0 + 1] = norm_diff_abs[1]
            else:
                self.outputs_np2[self.CENTER + 1, 0, self.CENTER + diff_sign[0] + 1] = norm_diff_abs[0]
                self.outputs_np2[self.CENTER + diff_sign[1] + 1, 0, self.CENTER + 1] = norm_diff_abs[1]

            self.inner_step_counter += 1
            self.trajectory.append(self.pos.copy())
            if len(self.trajectory) > 300:
                self.trajectory.pop(0)

# ==============================================================================
# 3. 可視化
# ==============================================================================
def main():
    selected_file = select_npz_file()
    agent_data = load_elite_npz(selected_file)

    brain = VoxelBrainCPU(*agent_data)
    N = brain.N

    fig = plt.figure(figsize=(13, 6))
    gs = fig.add_gridspec(2, 2, width_ratios=[1.2, 1])

    ax_world = fig.add_subplot(gs[:, 0])
    ax_world.set_xlim(-WORLD_SIZE, WORLD_SIZE)
    ax_world.set_ylim(-WORLD_SIZE, WORLD_SIZE)
    ax_world.set_aspect("equal")
    ax_world.set_title(f"World Map ({N}x{N}x{N} Brain)", fontsize=12)
    ax_world.grid(True, linestyle="--", alpha=0.5)

    traj_line, = ax_world.plot([], [], "b-", alpha=0.5, linewidth=1.5, label="Trajectory")
    agent_scatter = ax_world.scatter([], [], color="royalblue", s=120, edgecolors="black", label="Agent", zorder=4)
    goal_scatter = ax_world.scatter([], [], color="crimson", marker="*", s=250, edgecolors="black", label="Goal", zorder=3)
    info_text = ax_world.text(0.02, 0.96, "", transform=ax_world.transAxes, fontsize=10,
                              verticalalignment="top", bbox=dict(boxstyle="round", facecolor="white", alpha=0.85))
    ax_world.legend(loc="lower left")

    ax_signals = fig.add_subplot(gs[0, 1])
    mode_str = f"{ENABLE_LIFELONG_LEARNING:.2f}" if ENABLE_LIFELONG_LEARNING > 0.0 else "0.00 (Fixed Weights)"
    ax_signals.set_title(f"Neuromodulators [Lifelong Learning: {mode_str}]", fontsize=11)
    dopamine_history, sleep_history = [], []
    line_dopamine, = ax_signals.plot([], [], label="Dopamine Sum", color="darkorange", linewidth=2)
    line_sleep, = ax_signals.plot([], [], label="Sleep Sum", color="purple", linewidth=1.5)
    ax_signals.set_xlim(0, 100)
    ax_signals.set_ylim(0, 1.5)
    ax_signals.legend(loc="upper right")
    ax_signals.grid(True, alpha=0.3)

    ax_brain = fig.add_subplot(gs[1, 1])
    ax_brain.set_title(f"Voxel Brain Output ({N}x{N} Mean Z-Projection)", fontsize=11)
    im_brain = ax_brain.imshow(np.zeros((N, N)), cmap="coolwarm", vmin=-0.2, vmax=0.2, origin="lower")
    plt.colorbar(im_brain, ax=ax_brain, orientation="vertical", fraction=0.046, pad=0.04)

    plt.tight_layout()

    def update(frame):
        brain.step(inner_steps=5)

        traj = np.array(brain.trajectory)
        traj_line.set_data(traj[:, 0], traj[:, 1])
        agent_scatter.set_offsets([brain.pos])
        goal_scatter.set_offsets([brain.obj_pos])

        internal_outputs = brain.outputs_np2[1:brain.N+1, 1:brain.N+1, 1:brain.N+1]
        dist = float(np.linalg.norm(brain.pos - brain.obj_pos))

        info_text.set_text(
            f"File: {os.path.basename(selected_file)}\n"
            f"Brain Size: {brain.N}x{brain.N}x{brain.N}\n"
            f"Inner Step: {brain.inner_step_counter}\n"
            f"Goals: {brain.goal_count}\n"
            f"Distance: {dist:.1f}\n"
            f"Mean |Output|: {float(np.mean(np.abs(internal_outputs))):.4f}\n"
            f"Mean Resource R: {float(np.mean(brain.R)):.3f}"
        )

        dopamine_history.append(brain.dopamine_sum)
        sleep_history.append(brain.sleep_sum)
        if len(dopamine_history) > 100:
            dopamine_history.pop(0)
            sleep_history.pop(0)

        line_dopamine.set_data(range(len(dopamine_history)), dopamine_history)
        line_sleep.set_data(range(len(sleep_history)), sleep_history)
        max_val = max(max(dopamine_history), max(sleep_history), 0.5)
        ax_signals.set_ylim(0, max_val * 1.15)

        brain_proj = np.mean(internal_outputs, axis=0)
        v_limit = max(float(np.max(np.abs(brain_proj))), 0.02)
        im_brain.set_clim(-v_limit, v_limit)
        im_brain.set_data(brain_proj)

        return traj_line, agent_scatter, goal_scatter, info_text, line_dopamine, line_sleep, im_brain

    anim = FuncAnimation(fig, update, frames=2000, interval=30, blit=False)
    plt.show()

if __name__ == "__main__":
    main()