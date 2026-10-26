import os
import glob
import sys
import tkinter as tk
from tkinter import filedialog
import numpy as np

# ==============================================================================
# 1. エリート読み込み（サイズ完全自動検出・自己完結版）
# ==============================================================================
def load_elite_npz(npz_path: str):
    data = np.load(npz_path)

    # dopamine の要素数から N, DIM, P を完全に動的計算
    total_n = int(data["dopamine"].size)
    n = int(round(total_n ** (1.0 / 3.0)))
    dim = int(np.log2(n))
    p = n + 2

    # ★ ここを動的サイズ p で reshape することでエラーを完全回避
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
# 2. 軽量シミュレーション クラス（健康診断用）
# ==============================================================================
class VoxelBrainCPU:
    def __init__(self, sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, spec):
        self.params = params
        self.spec = spec
        self.dim = spec["dim"]
        self.N = spec["n"]
        self.P = spec["p"]
        self.TOTAL_N = spec["total_n"]

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
        self.weights = np.clip(dot_val, 0.0, 1.0).astype(np.float32)

        self.outputs_np2 = np.zeros((self.P, self.P, self.P), dtype=np.float32)
        self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1] = np.random.uniform(-0.1, 0.2, size=(self.N, self.N, self.N))
        self.R = np.ones(self.TOTAL_N, dtype=np.float32)
        self.sleep_sum = 0.0

    def step(self):
        in_outputs = self.outputs_np2[self.conn_z, self.conn_y, self.conn_x]
        net = np.sum(in_outputs * self.weights, axis=1)

        scaled_net = np.clip(net * self.params["beta"], -20.0, 20.0)
        output_rate = np.minimum(1.0, self.params["base_output"] * np.exp2(scaled_net))
        my_output = (1.0 - self.sleep_sum) * self.inhib * output_rate * self.R

        self.outputs_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1] = my_output
        self.R = np.clip(self.R - output_rate * self.R + self.params["k_refill"], 0.0, 1.0)
        self.sleep_sum = float(np.clip(np.sum(np.abs(my_output) * self.sleep_map), 0.0, 1.0))
        return my_output

# ==============================================================================
# 3. 健康診断ロジック
# ==============================================================================
def evaluate_brain_health(npz_path, steps=200):
    try:
        agent_data = load_elite_npz(npz_path)
        brain = VoxelBrainCPU(*agent_data)
    except Exception as e:
        return {"file": os.path.basename(npz_path), "status": f"❌ 破損ファイル ({e})", "score": -1.0}

    history = [brain.step() for _ in range(steps)]
    history = np.array(history)  # (steps, TOTAL_N)

    # 指標計算
    mean_act = float(np.mean(np.abs(history)))
    temporal_std = float(np.mean(np.std(history, axis=0)))
    sign_flips = float(np.mean((history[:-1] * history[1:]) < 0))

    if mean_act < 0.01 or temporal_std < 0.005:
        status = "💀 完全沈黙（フリーズ）"
        score = 0.0
    elif sign_flips > 0.4:
        status = "⚡ チカチカ（高周波発振）"
        score = 0.01
    elif mean_act > 0.7:
        status = "🔥 飽和（焼き切れ）"
        score = 0.0
    else:
        status = "🌱 生きている！（波・ダイナミクスあり）"
        score = temporal_std * (1.0 - sign_flips) * (1.0 - abs(mean_act - 0.2))

    # 相対パスを取得（どのフォルダの個体かわかりやすくする）
    rel_path = os.path.relpath(npz_path)

    return {
        "file": rel_path,
        "status": status,
        "score": score,
        "size": f"{brain.N}x{brain.N}x{brain.N}",
        "mean_act": mean_act,
        "sign_flips": sign_flips
    }

# ==============================================================================
# 4. メイン（再帰検索対応）
# ==============================================================================
def main():
    root = tk.Tk(); root.withdraw()
    
    initial_dir = os.path.abspath("backups") if os.path.exists("backups") else os.getcwd()

    # フォルダ選択ダイアログ（親フォルダを選べばサブフォルダも全部走査します）
    folder_path = filedialog.askdirectory(
        title="診断したいエリートの親フォルダ（例: backups）を選択してください",
        initialdir=initial_dir
    )
    if not folder_path:
        print("[!] キャンセルされました。")
        return

    # 指定フォルダ以下の全サブフォルダから .npz を一括再帰検索！
    files = sorted(glob.glob(os.path.join(folder_path, "**", "*.npz"), recursive=True))
    if not files:
        print(f"[!] '{folder_path}' 内に .npz ファイルが見つかりませんでした。")
        return

    print(f"\n[+] 全 {len(files)} 個の個体を発見しました。一括診断を開始します...\n")

    results = [evaluate_brain_health(f) for f in files]
    results = [r for r in results if r["score"] >= 0]  # エラーファイル除外
    results.sort(key=lambda x: x["score"], reverse=True)

    alive_count = sum(1 for r in results if "🌱" in r["status"])
    flicker_count = sum(1 for r in results if "⚡" in r["status"])
    freeze_count = sum(1 for r in results if "💀" in r["status"])

    print("=" * 95)
    print(f"{'ファイルパス':<50} | {'サイズ':<7} | {'判定':<18} | {'平均発火':<6} | {'チカチカ率':<6}")
    print("=" * 95)
    for r in results[:20]:  # スコア上位20件を表示
        print(f"{r['file']:<50} | {r['size']:<7} | {r['status']:<16} | {r['mean_act']:.3f}  | {r['sign_flips']:.1%}")
    print("=" * 95)

    print(f"\n【診断まとめ】 全 {len(results)} 体中:")
    print(f"  🌱 生きている（動的波） : {alive_count:3d} 体 ({alive_count/len(results)*100:.1f}%)")
    print(f"  ⚡ チカチカ（発振）     : {flicker_count:3d} 体 ({flicker_count/len(results)*100:.1f}%)")
    print(f"  💀 フリーズ（沈黙・飽和）: {freeze_count:3d} 体 ({freeze_count/len(results)*100:.1f}%)")

if __name__ == "__main__":
    main()