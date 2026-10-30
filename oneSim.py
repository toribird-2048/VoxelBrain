# oneSim.py
import os
import sys
import time
import math
import glob
import csv
import shutil
import queue
import threading
import subprocess
import importlib
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use("TkAgg")
matplotlib.rcParams["font.sans-serif"] = ["Yu Gothic", "Meiryo", "MS Gothic", "DejaVu Sans"]
matplotlib.rcParams["axes.unicode_minus"] = False
from matplotlib.figure import Figure
from matplotlib.patches import Rectangle, Circle
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# ==============================================================================
# sim_config.py から共通設定・フラグを読み込み
# ==============================================================================
from sim_config import (
    ENABLE_LEARNING,
    ENABLE_DOPAMINE,
    ENABLE_SLEEP,
    NUM_IN_PORTS,
    NUM_OUT_PORTS,
    INITIAL_ENERGY,
    METABOLIC_COST,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SUN_CYCLE_PERIOD,
    SPEED_GAIN,
    ROTATE_GAIN,
)

STEPS_PER_FRAME = 1
HISTORY_LEN = 200


def get_default_inout_fi(dim: int) -> dict[str, np.ndarray]:
    """各次元における標準の入出力face_index [face, u, v] を返す (固定長スロット方式)"""
    in_defaults = np.zeros((NUM_IN_PORTS, 3), dtype=np.int32)
    out_defaults = np.zeros((NUM_OUT_PORTS, 3), dtype=np.int32)

    if dim == 1:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 1, 0]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 0, 0]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [5, 1, 0]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [5, 0, 0]
        if NUM_OUT_PORTS >= 3: out_defaults[2] = [4, 1, 0]
        if NUM_OUT_PORTS >= 4: out_defaults[3] = [4, 0, 0]
    elif dim == 2:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 3, 2]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 1, 2]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 2, 1]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 2, 1]
        if NUM_OUT_PORTS >= 3: out_defaults[2] = [3, 2, 1]
        if NUM_OUT_PORTS >= 4: out_defaults[3] = [2, 2, 1]
    else:
        if NUM_IN_PORTS >= 1: in_defaults[0] = [2, 5, 4]
        if NUM_IN_PORTS >= 2: in_defaults[1] = [2, 3, 4]
        if NUM_OUT_PORTS >= 1: out_defaults[0] = [1, 4, 3]
        if NUM_OUT_PORTS >= 2: out_defaults[1] = [0, 4, 3]
        if NUM_OUT_PORTS >= 3: out_defaults[2] = [3, 4, 3]
        if NUM_OUT_PORTS >= 4: out_defaults[3] = [2, 4, 3]

    res = {
        "in_ports_fi": in_defaults,
        "out_ports_fi": out_defaults,
    }
    # 後方互換キー
    if NUM_IN_PORTS >= 1: res["light_in_fi"] = in_defaults[0]
    if NUM_IN_PORTS >= 2: res["battery_in_fi"] = in_defaults[1]
    if NUM_OUT_PORTS >= 1: res["gen_pos_out_fi"] = out_defaults[0]
    if NUM_OUT_PORTS >= 2: res["gen_neg_out_fi"] = out_defaults[1]
    if NUM_OUT_PORTS >= 3: res["speed_out_fi"] = out_defaults[2]
    if NUM_OUT_PORTS >= 4: res["rotate_out_fi"] = out_defaults[3]
    return res


def face_index_to_coord_in_p(fi, n: int) -> tuple[int, int, int]:
    """入力用 face_index (face, u, v) を P空間座標 (z, y, x) [0..N+1] に変換"""
    face = int(np.clip(int(fi[0]), 0, 5))
    u = int(np.clip(int(fi[1]), -1, n))
    v = int(np.clip(int(fi[2]), -1, n))
    table = (
        (-1, u, v),
        (n,  u, v),
        (u, -1, v),
        (u, n,  v),
        (u, v, -1),
        (u, v, n),
    )
    cx, cy, cz = table[face]
    return (cz + 1, cy + 1, cx + 1)


def face_index_to_coord_out_p(fi, n: int) -> tuple[int, int, int]:
    """出力用 face_index (face, u, v) を P空間座標 (z, y, x) [1..N] に変換"""
    face = int(np.clip(int(fi[0]), 0, 5))
    u = int(np.clip(int(fi[1]), 0, n - 1))
    v = int(np.clip(int(fi[2]), 0, n - 1))
    table = (
        (0,     u, v),
        (n - 1, u, v),
        (u, 0,     v),
        (u, n - 1, v),
        (u, v, 0),
        (u, v, n - 1),
    )
    cx, cy, cz = table[face]
    return (cz + 1, cy + 1, cx + 1)


def get_special_coords_np2(dim: int, params: dict | None = None) -> dict[tuple[int, int, int], str]:
    """(z, y, x) in P x P x P (0 .. N+1) における特殊セルの役割ラベルを動的に返す"""
    n = 1 << dim
    defaults_fi = get_default_inout_fi(dim)
    if params is None:
        params = defaults_fi

    in_fi = params.get("in_ports_fi")
    if in_fi is None:
        in_fi = defaults_fi["in_ports_fi"].copy()
        if "light_in_fi" in params and NUM_IN_PORTS >= 1: in_fi[0] = params["light_in_fi"]
        if "battery_in_fi" in params and NUM_IN_PORTS >= 2: in_fi[1] = params["battery_in_fi"]
    else:
        in_fi = np.asarray(in_fi, dtype=np.int32).reshape(-1, 3)

    out_fi = params.get("out_ports_fi")
    if out_fi is None:
        out_fi = defaults_fi["out_ports_fi"].copy()
        if "gen_pos_out_fi" in params and NUM_OUT_PORTS >= 1: out_fi[0] = params["gen_pos_out_fi"]
        if "gen_neg_out_fi" in params and NUM_OUT_PORTS >= 2: out_fi[1] = params["gen_neg_out_fi"]
        if "speed_out_fi" in params and NUM_OUT_PORTS >= 3: out_fi[2] = params["speed_out_fi"]
        if "rotate_out_fi" in params and NUM_OUT_PORTS >= 4: out_fi[3] = params["rotate_out_fi"]
    else:
        out_fi = np.asarray(out_fi, dtype=np.int32).reshape(-1, 3)

    res: dict[tuple[int, int, int], list[str]] = {}
    in_names = ["☀️Sun入力", "⚡Energy入力"]
    out_names = ["⚙️Gen+出力", "⚙️Gen-出力", "🚀Speed出力", "🔄Rotate出力"]

    for i in range(min(len(in_fi), NUM_IN_PORTS)):
        coord = face_index_to_coord_in_p(in_fi[i], n)
        lbl = in_names[i] if i < len(in_names) else f"📥In[{i}]"
        res.setdefault(coord, []).append(lbl)

    for j in range(min(len(out_fi), NUM_OUT_PORTS)):
        coord = face_index_to_coord_out_p(out_fi[j], n)
        lbl = out_names[j] if j < len(out_names) else f"📤Out[{j}]"
        res.setdefault(coord, []).append(lbl)

    return {coord: " / ".join(labels) for coord, labels in res.items()}


def format_coord_label(z: int, y: int, x: int, n: int) -> tuple[str, str]:
    """
    P空間座標 (z, y, x) [0..N+1] から:
      1) 内部座標表記 (x, y, z) [0..N-1] (外周なら '外周膜')
      2) 外周込み配列添字 P[z, y, x] [0..N+1]
    の2つの明確な文字列を返す。
    """
    is_internal = (1 <= z <= n) and (1 <= y <= n) and (1 <= x <= n)
    p_str = f"P[z={z}, y={y}, x={x}]"
    if is_internal:
        ix, iy, iz = x - 1, y - 1, z - 1
        n_str = f"内部(x={ix}, y={iy}, z={iz})"
    else:
        n_str = f"外周(X={x}, Y={y}, Z={z})"
    return n_str, p_str


# ==============================================================================
# 1. エリート(.npz)読み込み（サイズ＆フラグ自動判別）
# ==============================================================================
def get_smart_npz_initial_dir(hint_path: str | None = None) -> str:
    """エリート個体 (.npz) が確実に一覧表示される最適なフォルダを自動探索して返す。
    1. hint_path が指定されていればそのディレクトリ
    2. backups/checkpoint_* のうち最も新しい更新日時のディレクトリ (top20/ があればそれを優先)
    3. backups/ 内を再帰探索して最新の .npz があるディレクトリ
    4. backups/
    5. カレント作業ディレクトリ
    """
    if hint_path:
        p = os.path.abspath(hint_path)
        if os.path.isfile(p):
            p = os.path.dirname(p)
        if os.path.isdir(p):
            return p

    ckpt_dirs = [d for d in glob.glob(os.path.join("backups", "checkpoint_*")) if os.path.isdir(d)]
    if ckpt_dirs:
        ckpt_dirs.sort(key=os.path.getmtime, reverse=True)
        for ckpt in ckpt_dirs:
            top20 = os.path.join(ckpt, "top20")
            if os.path.isdir(top20) and glob.glob(os.path.join(top20, "*.npz")):
                return os.path.abspath(top20)
            if glob.glob(os.path.join(ckpt, "*.npz")):
                return os.path.abspath(ckpt)

    npz_files = glob.glob(os.path.join("backups", "**", "*.npz"), recursive=True)
    if npz_files:
        npz_files.sort(key=os.path.getmtime, reverse=True)
        return os.path.dirname(os.path.abspath(npz_files[0]))

    if os.path.exists("backups"):
        return os.path.abspath("backups")
    return os.getcwd()


def get_latest_evolved_elite_path() -> str | None:
    """進化シミュレーションで生成された最新のトップ1位個体 (.npz) のパスを自動探索して返す。"""
    ckpt_dirs = [d for d in glob.glob(os.path.join("backups", "checkpoint_*")) if os.path.isdir(d)]
    if ckpt_dirs:
        ckpt_dirs.sort(key=os.path.getmtime, reverse=True)
        for ckpt in ckpt_dirs:
            top20 = os.path.join(ckpt, "top20")
            if os.path.isdir(top20):
                rank01 = glob.glob(os.path.join(top20, "rank01_*.npz"))
                if rank01:
                    return os.path.abspath(rank01[0])
                all_ranks = sorted(glob.glob(os.path.join(top20, "rank*.npz")))
                if all_ranks:
                    return os.path.abspath(all_ranks[0])
            bests = glob.glob(os.path.join(ckpt, "best_*.npz"))
            if bests:
                bests.sort(key=os.path.getmtime, reverse=True)
                return os.path.abspath(bests[0])

    npz_files = glob.glob(os.path.join("backups", "**", "*.npz"), recursive=True)
    if npz_files:
        npz_files.sort(key=os.path.getmtime, reverse=True)
        return os.path.abspath(npz_files[0])
    return None


def select_npz_file() -> str:
    root = tk.Tk()
    root.withdraw()
    initial_dir = get_smart_npz_initial_dir()
    file_path = filedialog.askopenfilename(
        title="観察・編集する太陽光エリート個体 (.npz) を選択してください",
        initialdir=initial_dir,
        filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")],
    )
    root.destroy()
    return file_path


def load_elite_npz(npz_path: str):
    global ENABLE_LEARNING, ENABLE_DOPAMINE, ENABLE_SLEEP
    data = np.load(npz_path)

    # .npz 内に連続有効度合い (0.0~1.0) または旧boolフラグが保存されていれば自動復元
    if "enable_learning" in data:
        ENABLE_LEARNING = float(np.clip(float(data["enable_learning"]), 0.0, 1.0))
    if "enable_dopamine" in data:
        ENABLE_DOPAMINE = float(np.clip(float(data["enable_dopamine"]), 0.0, 1.0))
    if "enable_sleep" in data:
        ENABLE_SLEEP = float(np.clip(float(data["enable_sleep"]), 0.0, 1.0))

    total_n = int(data["dopamine"].size)
    n = int(round(total_n ** (1.0 / 3.0)))
    dim = int(np.log2(n))
    p = n + 2

    sig_pre = data["sig_pre"].astype(np.float16).reshape((p, p, p, 4))
    sig_post = data["sig_post"].astype(np.float16).reshape((p, p, p, 4))
    dopamine_map = data["dopamine"].astype(np.float16).reshape(total_n)
    sleep_map = data["sleep"].astype(np.float16).reshape(total_n)

    packed_inhib = data["inhib"].view(np.uint32)
    idx = np.arange(total_n)
    words = packed_inhib[idx >> 5]
    bits = (words >> (idx & 31)) & 1
    inhib = np.where(bits == 1, -1.0, 1.0).astype(np.float16)

    if data["resource_base_output"].dtype == np.uint8:
        print(
            f"[!] 警告: '{os.path.basename(npz_path)}' の神経パラメータが uint8 (破損したバイト値) で保存されています。\n"
            f"    修正後の voxelBrain.py で再生成・保存された .npz を使用するか、GUI上で標準値にリセットしてください。"
        )

    params = {
        "base_output": np.float16(data["resource_base_output"]),
        "beta": np.float16(data["resource_beta"]),
        "k_refill": np.float16(data["resource_k_refill"]),
        "multiplier": int(data["link_multiplier"]),
        "bias": int(data["link_bias"]),
        "learning_rate": np.float16(data["learn_rate"]),
        "forget_rate": np.float16(data["learn_forget"]) if "learn_forget" in data else np.float16(0.05),
        "learning_threshold": np.float16(data["learn_threshold"]),
        "tag_decay": np.float16(data["learn_decay"]),
        "step": int(data["step"]) if "step" in data else 0,
        "score": float(data["score"]) if "score" in data else float(INITIAL_ENERGY),
        "is_corrupted_u8": bool(data["resource_base_output"].dtype == np.uint8),
    }

    defaults_fi = get_default_inout_fi(dim)
    if "in_ports_fi" in data:
        loaded_in = np.asarray(data["in_ports_fi"], dtype=np.int32).reshape(-1, 3)
        in_arr = defaults_fi["in_ports_fi"].copy()
        n = min(len(loaded_in), NUM_IN_PORTS)
        in_arr[:n] = loaded_in[:n]
        params["in_ports_fi"] = in_arr
    else:
        in_arr = defaults_fi["in_ports_fi"].copy()
        if "light_in_fi" in data and NUM_IN_PORTS >= 1: in_arr[0] = np.asarray(data["light_in_fi"], dtype=np.int32).reshape(3)
        if "battery_in_fi" in data and NUM_IN_PORTS >= 2: in_arr[1] = np.asarray(data["battery_in_fi"], dtype=np.int32).reshape(3)
        params["in_ports_fi"] = in_arr

    if "out_ports_fi" in data:
        loaded_out = np.asarray(data["out_ports_fi"], dtype=np.int32).reshape(-1, 3)
        out_arr = defaults_fi["out_ports_fi"].copy()
        n = min(len(loaded_out), NUM_OUT_PORTS)
        out_arr[:n] = loaded_out[:n]
        params["out_ports_fi"] = out_arr
    else:
        out_arr = defaults_fi["out_ports_fi"].copy()
        if "gen_pos_out_fi" in data and NUM_OUT_PORTS >= 1: out_arr[0] = np.asarray(data["gen_pos_out_fi"], dtype=np.int32).reshape(3)
        if "gen_neg_out_fi" in data and NUM_OUT_PORTS >= 2: out_arr[1] = np.asarray(data["gen_neg_out_fi"], dtype=np.int32).reshape(3)
        if "speed_out_fi" in data and NUM_OUT_PORTS >= 3: out_arr[2] = np.asarray(data["speed_out_fi"], dtype=np.int32).reshape(3)
        if "rotate_out_fi" in data and NUM_OUT_PORTS >= 4: out_arr[3] = np.asarray(data["rotate_out_fi"], dtype=np.int32).reshape(3)
        params["out_ports_fi"] = out_arr

    # 後方互換キー
    if NUM_IN_PORTS >= 1: params["light_in_fi"] = params["in_ports_fi"][0]
    if NUM_IN_PORTS >= 2: params["battery_in_fi"] = params["in_ports_fi"][1]
    if NUM_OUT_PORTS >= 1: params["gen_pos_out_fi"] = params["out_ports_fi"][0]
    if NUM_OUT_PORTS >= 2: params["gen_neg_out_fi"] = params["out_ports_fi"][1]
    if NUM_OUT_PORTS >= 3: params["speed_out_fi"] = params["out_ports_fi"][2]
    if NUM_OUT_PORTS >= 4: params["rotate_out_fi"] = params["out_ports_fi"][3]

    spec = {"dim": dim, "n": n, "p": p, "total_n": total_n, "center": n // 2}
    return sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, spec


# ==============================================================================
# 2. 太陽光タスク用 CPUシミュレーション クラス（ノックアウト実験対応）
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

        # P x P x P 空間でのノックアウトマスク (True のセルは出力・感覚入力とも 0.0h に強制遮断)
        self.knockout_np2 = np.zeros((self.P, self.P, self.P), dtype=bool)
        # シナプス単位の実験切断マスク (TOTAL_N, 28) — sig_pre / sig_post を改変せずに特定結合のみ w=0 に遮断
        self.synapse_ko_mask = np.zeros((self.TOTAL_N, 28), dtype=bool)
        # 手動感覚入力オーバーライド (slot_idx: value)
        self.manual_in_overrides: dict[int, float] = {}

        idx = np.arange(self.TOTAL_N)
        self.coords_x = (idx >> 0) & (self.N - 1)
        self.coords_y = (idx >> self.dim) & (self.N - 1)
        self.coords_z = (idx >> (self.dim * 2)) & (self.N - 1)

        self.offsets = np.array([(dz, dy, dx) for dz in [-1, 0, 1] for dy in [-1, 0, 1] for dx in [-1, 0, 1]])

        self.update_genes(sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, reset_state=True)

    def update_genes(self, sig_pre, sig_post, dopamine_map, sleep_map, inhib, params, reset_state=False):
        """遺伝子・パラメータを更新してシナプス重みを再計算する（動的ホットリロード対応）"""
        self.params = params
        self.sig_pre = sig_pre.astype(np.float16)
        self.sig_post = sig_post.astype(np.float16)
        self.dopamine_map = dopamine_map.astype(np.float16)
        self.sleep_map = sleep_map.astype(np.float16)
        self.inhib = inhib.astype(np.float16)

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

        my_post = self.sig_post[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]
        target_pre = self.sig_pre[self.conn_z, self.conn_y, self.conn_x]
        dot_val = np.zeros((self.TOTAL_N, 28), dtype=np.float16)
        for c in range(4):
            dot_val = (dot_val + (my_post[:, None, c] * target_pre[:, :, c]).astype(np.float16)).astype(np.float16)
        self.initial_weights = np.clip((dot_val * np.float16(0.25)).astype(np.float16), np.float16(0.0), np.float16(1.0))

        if reset_state or not hasattr(self, "weights"):
            self.reset()
        else:
            self.weights = self.initial_weights.copy()
            if np.any(self.synapse_ko_mask):
                self.weights[self.synapse_ko_mask] = np.float16(0.0)

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
            self.tags[post_idx, k] = np.float16(0.0)
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
        self.weights = self.initial_weights.copy()
        if np.any(self.synapse_ko_mask):
            self.weights[self.synapse_ko_mask] = np.float16(0.0)
        self.tags = np.zeros_like(self.weights, dtype=np.float16)

        self.outputs_np2 = np.zeros((self.P, self.P, self.P), dtype=np.float16)
        self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1] = np.float16(0.5)
        self.outputs_np2[self.knockout_np2] = np.float16(0.0)
        self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

        self.R = np.ones(self.TOTAL_N, dtype=np.float16)
        self.dopamine_sum = 0.0
        self.sleep_sum = 0.0
        self.flicker_rate = 0.0

        self.inner_step_counter = 0
        self.energy = float(INITIAL_ENERGY)
        self.current_sunlight = 0.0
        self.generator_power = 0.0
        self.net_delta_energy = 0.0

        # reasoningSim.slang 準拠の身体性・移動パラメータ
        self.pos = np.array([0.0, 0.0], dtype=np.float32)
        self.angle = 0.0
        self.obj_pos = np.array([0.0, 1.0], dtype=np.float32)
        self.speed = 0.0
        self.rotate = 0.0
        self.energy_coeff = 1.0

        self.step_history = []
        self.sun_history = []
        self.gen_history = []
        self.energy_history = []
        self.dopamine_history = []
        self.sleep_history = []
        self.pos_history = [self.pos.copy()]

    def step(self, inner_steps=1, enable_learning=0.0, enable_dopamine=0.0, enable_sleep=0.0, record_history=True):
        base_output = np.float16(self.params["base_output"])
        beta = np.float16(self.params["beta"])
        k_refill = np.float16(self.params["k_refill"])
        learning_rate = np.float16(self.params["learning_rate"])
        forget_rate = np.float16(self.params["forget_rate"])
        learning_threshold = np.float16(self.params["learning_threshold"])
        tag_decay = np.float16(self.params["tag_decay"])

        en_learn = float(np.clip(float(enable_learning), 0.0, 1.0))
        en_dop = float(np.clip(float(enable_dopamine), 0.0, 1.0))
        en_slp = float(np.clip(float(enable_sleep), 0.0, 1.0))
        en_learn_h = np.float16(en_learn)
        en_dop_h = np.float16(en_dop)
        en_slp_h = np.float16(en_slp)

        has_ko = bool(np.any(self.knockout_np2))
        if has_ko:
            ko_internal_flat = self.knockout_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1]

        has_syn_ko = bool(np.any(self.synapse_ko_mask))
        if has_syn_ko:
            self.weights[self.synapse_ko_mask] = np.float16(0.0)
            self.tags[self.synapse_ko_mask] = np.float16(0.0)

        with np.errstate(over="ignore"):
            for _ in range(inner_steps):
                if has_ko:
                    self.outputs_np2[self.knockout_np2] = np.float16(0.0)

                if record_history:
                    self.prev_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].copy()

                in_outputs = self.outputs_np2[self.conn_z, self.conn_y, self.conn_x]
                delta_net = (in_outputs * self.weights).astype(np.float16)
                net = np.zeros(self.TOTAL_N, dtype=np.float16)
                for k in range(28):
                    net = (net + delta_net[:, k]).astype(np.float16)

                if en_learn > 0.0:
                    dop_h = np.float16(self.dopamine_sum)
                    self.tags = np.clip(
                        ((self.tags + np.clip(np.abs(delta_net), np.float16(0.0), np.float16(1.0))) * (np.float16(1.0) - tag_decay)).astype(np.float16),
                        np.float16(0.0), np.float16(1.0)
                    )
                    bistable = (self.weights * (np.float16(1.0) - self.weights) * (self.weights - learning_threshold)).astype(np.float16)
                    dw_nbr = (forget_rate * (dop_h * self.tags[:, :27] + learning_rate * bistable[:, :27]) * en_learn_h).astype(np.float16)
                    dw_27th = (learning_rate * (dop_h * self.tags[:, 27:] + learning_rate * bistable[:, 27:]) * en_learn_h).astype(np.float16)
                    self.weights = np.clip((self.weights + np.concatenate([dw_nbr, dw_27th], axis=1)).astype(np.float16), np.float16(0.0), np.float16(1.0))
                    if has_syn_ko:
                        self.weights[self.synapse_ko_mask] = np.float16(0.0)
                        self.tags[self.synapse_ko_mask] = np.float16(0.0)

                scaled_net = np.clip((net * beta).astype(np.float16), np.float16(-20.0), np.float16(20.0))
                output_rate = np.minimum(np.float16(1.0), (base_output * np.exp2(scaled_net).astype(np.float16)).astype(np.float16))
                my_output = ((np.float16(1.0) - np.float16(self.sleep_sum)) * self.inhib * output_rate * self.R).astype(np.float16)

                if has_ko:
                    my_output = np.where(ko_internal_flat, np.float16(0.0), my_output)

                self.outputs_np2[self.coords_z + 1, self.coords_y + 1, self.coords_x + 1] = my_output
                self.R = np.clip((self.R - (output_rate * self.R).astype(np.float16) + k_refill).astype(np.float16), np.float16(0.0), np.float16(1.0))

                if record_history:
                    cur_outputs = self.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].astype(np.float32)
                    self.flicker_rate = float(np.mean((cur_outputs * self.prev_outputs.astype(np.float32)) < -0.001))

                if en_dop > 0.0:
                    raw_dop = np.sum((np.abs(my_output) * self.dopamine_map).astype(np.float16), dtype=np.float16)
                    self.dopamine_sum = float(np.float16(raw_dop * en_dop_h))
                else:
                    self.dopamine_sum = 0.0

                if en_slp > 0.0:
                    raw_slp = np.clip(np.sum((np.abs(my_output) * self.sleep_map).astype(np.float16), dtype=np.float16), np.float16(0.0), np.float16(1.0))
                    self.sleep_sum = float(np.clip(np.float16(raw_slp * en_slp_h), np.float16(0.0), np.float16(1.0)))
                else:
                    self.sleep_sum = 0.0

                # --- 太陽光・発電量・エネルギー計算 (reasoningSim.slang と完全一致) ---
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

                # 出力スロット 3: rotate_out, スロット 2: speed_out (reasoningSim.slang と完全同期)
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
                    self.pos += np.array([np.cos(self.angle), np.sin(self.angle)], dtype=np.float32) * (self.speed * SPEED_GAIN)
                    self.pos = np.clip(self.pos, -2.0, 2.0)

                    diff = self.pos - self.obj_pos
                    dist_dot = float(np.dot(diff, diff))
                    self.energy_coeff = float(2.0 / (1.0 + 0.5 * dist_dot))

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
                    self.energy_coeff = float(2.0 / (1.0 + 0.5 * dist_dot))

                # --- 感覚入力の書き込み（感覚セルがKOされていれば 0.0h） ---
                # スロット 0: sunlight, 1: battery
                if len(self.in_coords_p) >= 1:
                    lz, ly, lx = self.in_coords_p[0]
                    self.outputs_np2[lz, ly, lx] = np.float16(0.0) if self.knockout_np2[lz, ly, lx] else np.float16(self.current_sunlight)
                if len(self.in_coords_p) >= 2:
                    bz, by, bx = self.in_coords_p[1]
                    self.outputs_np2[bz, by, bx] = np.float16(0.0) if self.knockout_np2[bz, by, bx] else np.float16(self.energy)

                # 手動感覚入力のオーバーライド反映
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
                    self.dopamine_history.append(self.dopamine_sum)
                    self.sleep_history.append(self.sleep_sum)
                    if not hasattr(self, "pos_history"):
                        self.pos_history = []
                    self.pos_history.append(self.pos.copy())

                    if len(self.step_history) > HISTORY_LEN:
                        self.step_history.pop(0)
                        self.sun_history.pop(0)
                        self.gen_history.pop(0)
                        self.energy_history.pop(0)
                        self.dopamine_history.pop(0)
                        self.sleep_history.pop(0)
                        if len(self.pos_history) > HISTORY_LEN:
                            self.pos_history.pop(0)

                self.inner_step_counter += 1


# ==============================================================================
# 3. 統合アプリケーション (oneSim + geneEditor + ノッキング実験)
# ==============================================================================
class IntegratedBrainStudio:
    def __init__(self, root: tk.Tk, initial_npz: str | None = None):
        self.root = root
        self.root.title("VoxelBrain 統合シミュレータ ＆ 遺伝子・ノッキング実験スタジオ (oneSim.py)")
        self.root.geometry("1720x950")

        self.current_file_path: str | None = None
        self.last_opened_dir: str | None = None
        self.paused = False
        self.steps_per_frame = STEPS_PER_FRAME
        self.auto_reset_on_edit = tk.BooleanVar(value=False)

        # エディタ上の選択座標 P(z, y, x) [0 .. P-1]
        self.sel_z = 2
        self.sel_y = 1
        self.sel_x = 1
        self.wire_src: tuple[int, int, int] | None = None

        self.view_mode_var = tk.StringVar(value="ko_inhib")
        self.right_click_mode_var = tk.StringVar(value="knockout")

        # スキャン結果の行ID -> セル座標 (z, y, x) または シナプス ((post_idx, k), pre_coord, post_coord) マッピング
        self._scan_mode: str = "cell"
        self._scan_item_coords: dict[str, tuple[int, int, int]] = {}
        self._scan_item_synapses: dict[str, tuple[int, int, tuple[int, int, int], tuple[int, int, int]]] = {}

        # 選択セルのシナプス一覧 Treeview 行ID -> (post_idx, k, partner_coord)
        self._syn_tree_items: dict[str, tuple[int, int, tuple[int, int, int]]] = {}

        # GIF録画用状態
        self.is_recording_gif: bool = False
        self.gif_frames: list[Image.Image] = []

        # UI応答性・高速Blit描画・再入防止用の管理状態
        self._updating_ui_vars: bool = False
        self._in_tick: bool = False
        self._tick_job_id: str | None = None
        self._mpl_bg = None
        self._cur_xmin: int = 0
        self._cur_xmax: int = HISTORY_LEN
        self._cur_sig_ymax: float = 1.5
        self._cur_flags_str: str = ""
        self._last_canvas_size: tuple[int, int] = (0, 0)
        self._cell_fill_rect_ids: dict[tuple[int, int, int], int] = {}

        # 外部スクリプト (voxelBrain.py / analyze.py) 実行管理用状態
        self.vb_process: subprocess.Popen | None = None
        self.vb_log_queue: queue.Queue[str] = queue.Queue()
        self.vb_stop_file: str = os.path.abspath(".voxelbrain_stop_signal")
        self.latest_evolved_npz: str | None = None
        self.latest_csv_log: str | None = None

        # I/O 配線盤 (Modular Patch Bay) 管理状態
        self.selected_io_port: tuple[str, int] | None = ("in", 0)  # ("in"|"out", index)
        self.io_wire_hit_boxes: list[dict] = []
        self.io_in_names = ["☀️ 太陽光 (Sun)", "⚡ 蓄電量 (Battery)"]
        self.io_out_names = ["⚙️ 発電+ (Gen+)", "⚙️ 発電- (Gen-)"]

        # 3D ボクセル配線マップ管理状態
        self.inout_3d_yaw: float = 38.0
        self.inout_3d_pitch: float = 26.0
        self.inout_3d_zoom: float = 1.0
        self.inout_3d_pan_x: float = 0.0
        self.inout_3d_pan_y: float = 0.0
        self.inout_3d_drag_start: tuple[int, int] | None = None
        self.inout_3d_drag_moved: bool = False
        self.inout_3d_hover_target: dict | None = None
        self.inout_3d_pick_targets: list[dict] = []

        # グラフ表示ページ管理 (1: 個体位置・フィールドマップ, 2: ドーパミン・睡眠波形)
        self.graph_page: int = 1

        # 初期データ準備
        self._init_blank_gene(dim=2)
        self._build_ui()

        if initial_npz and os.path.exists(initial_npz):
            self.last_opened_dir = os.path.dirname(os.path.abspath(initial_npz))
            self.load_npz_file(initial_npz)
        else:
            self._rebuild_matplotlib_figures()
            self._refresh_all_views()

        # キーボードショートカット登録 (Entry入力中は干渉しないよう制御)
        self.root.bind("<KeyPress>", self._on_global_key)
        self.root.protocol("WM_DELETE_WINDOW", self._on_close_window)

        # シミュレーションタイマー開始
        self._tick_loop()

    def _on_close_window(self):
        if self.vb_process is not None and self.vb_process.poll() is None:
            if messagebox.askyesno(
                "終了確認",
                "現在バックグラウンドで voxelBrain.py (GPU進化計算) が実行中です。\n強制終了してウィンドウを閉じますか？",
            ):
                self.vb_process.kill()
            else:
                return
        self.root.destroy()

    # ==========================================================================
    # 遺伝子データ管理 ＆ SolarBrainCPU 同期
    # ==========================================================================
    def _init_blank_gene(self, dim: int = 2):
        self.dim = dim
        self.N = 1 << dim
        self.P = self.N + 2
        self.TOTAL_N = self.N ** 3

        self.sig_pre = np.zeros((self.P, self.P, self.P, 4), dtype=np.float16)
        self.sig_post = np.zeros((self.P, self.P, self.P, 4), dtype=np.float16)
        self.dopamine = np.full((self.N, self.N, self.N), 0.1, dtype=np.float16)
        self.sleep = np.zeros((self.N, self.N, self.N), dtype=np.float16)
        self.inhib_bits = np.zeros((self.N, self.N, self.N), dtype=bool)

        self.meta_step = 0
        self.meta_score = float(INITIAL_ENERGY)
        self.enable_learning = float(np.clip(float(ENABLE_LEARNING), 0.0, 1.0))
        self.enable_dopamine = float(np.clip(float(ENABLE_DOPAMINE), 0.0, 1.0))
        self.enable_sleep = float(np.clip(float(ENABLE_SLEEP), 0.0, 1.0))

        self.sim_params = {
            "base_output": np.float16(0.02),
            "beta": np.float16(20.0),
            "k_refill": np.float16(0.15),
            "multiplier": 1,
            "bias": 0,
            "learning_rate": np.float16(0.1),
            "forget_rate": np.float16(0.05),
            "learning_threshold": np.float16(0.5),
            "tag_decay": np.float16(0.9),
        }
        self.sim_params.update(get_default_inout_fi(self.dim))
        self.spec = {
            "dim": self.dim,
            "n": self.N,
            "p": self.P,
            "total_n": self.TOTAL_N,
            "center": self.N // 2,
        }

        dop_flat, slp_flat, inhib_flat = self._get_flat_arrays_for_sim()
        self.brain = SolarBrainCPU(
            self.sig_pre,
            self.sig_post,
            dop_flat,
            slp_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        self.brain.step(
            inner_steps=1,
            enable_learning=self.enable_learning,
            enable_dopamine=self.enable_dopamine,
            enable_sleep=self.enable_sleep,
        )

        self.sel_z = min(self.sel_z, self.P - 1)
        self.sel_y = min(self.sel_y, self.P - 1)
        self.sel_x = min(self.sel_x, self.P - 1)
        self.wire_src = None

    def _coord_n_to_idx(self, iz: int, iy: int, ix: int) -> int:
        return (iz << (self.dim * 2)) | (iy << self.dim) | ix

    def _pack_inhib_uint32(self) -> np.ndarray:
        inhib_stride = (self.TOTAL_N + 31) // 32
        packed = np.zeros(inhib_stride, dtype=np.uint32)
        for iz in range(self.N):
            for iy in range(self.N):
                for ix in range(self.N):
                    if self.inhib_bits[iz, iy, ix]:
                        idx = self._coord_n_to_idx(iz, iy, ix)
                        packed[idx >> 5] |= np.uint32(1 << (idx & 31))
        return packed

    def _unpack_inhib_uint32(self, packed_inhib: np.ndarray) -> np.ndarray:
        packed_u32 = packed_inhib.view(np.uint32)
        bits_grid = np.zeros((self.N, self.N, self.N), dtype=bool)
        for iz in range(self.N):
            for iy in range(self.N):
                for ix in range(self.N):
                    idx = self._coord_n_to_idx(iz, iy, ix)
                    word = packed_u32[idx >> 5]
                    bits_grid[iz, iy, ix] = bool((word >> (idx & 31)) & 1)
        return bits_grid

    def _get_flat_arrays_for_sim(self):
        idx = np.arange(self.TOTAL_N)
        ix = (idx >> 0) & (self.N - 1)
        iy = (idx >> self.dim) & (self.N - 1)
        iz = (idx >> (self.dim * 2)) & (self.N - 1)

        dop_flat = self.dopamine[iz, iy, ix].astype(np.float16)
        slp_flat = self.sleep[iz, iy, ix].astype(np.float16)
        inhib_flat = np.where(self.inhib_bits[iz, iy, ix], -1.0, 1.0).astype(np.float16)
        return dop_flat, slp_flat, inhib_flat

    def _sync_genes_to_brain(self, force_reset: bool = False):
        dop_flat, slp_flat, inhib_flat = self._get_flat_arrays_for_sim()
        do_reset = force_reset or bool(self.auto_reset_on_edit.get())
        self.brain.update_genes(
            self.sig_pre,
            self.sig_post,
            dop_flat,
            slp_flat,
            inhib_flat,
            self.sim_params,
            reset_state=do_reset,
        )
        if do_reset and not self.brain.step_history:
            self.brain.step(
                inner_steps=1,
                enable_learning=self.enable_learning,
                enable_dopamine=self.enable_dopamine,
                enable_sleep=self.enable_sleep,
            )

    # ==========================================================================
    # UI構築
    # ==========================================================================
    def _build_ui(self):
        # --- 上部ツールバー ---
        toolbar = ttk.Frame(self.root, padding=5)
        toolbar.pack(side=tk.TOP, fill=tk.X)

        ttk.Button(toolbar, text="📂 .npz を開く [O]", command=self.action_open_dialog).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="🏆 最新エリート読込 [E]", command=self.action_load_latest_evolved_elite).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="💾 上書き保存", command=self.action_save_overwrite).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="📝 新規保存 (別名)...", command=self.action_save_as).pack(side=tk.LEFT, padx=2)

        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, fill=tk.Y, padx=5)
        ttk.Label(toolbar, text="新規個体:").pack(side=tk.LEFT, padx=1)
        for d, lbl in [(1, "2³"), (2, "4³"), (3, "8³")]:
            ttk.Button(toolbar, text=lbl, width=4, command=lambda dim=d: self.action_new_gene(dim)).pack(side=tk.LEFT, padx=1)

        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, fill=tk.Y, padx=5)
        self.btn_pause = ttk.Button(toolbar, text="⏸️ 一時停止 [Space]", command=self.action_toggle_pause)
        self.btn_pause.pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="⏭️ 1Step [→]", command=self.action_step_once).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="🔄 リセット [R]", command=self.action_reset_sim).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="⚡ 1000step一括検証", command=self.action_eval_1000_steps).pack(side=tk.LEFT, padx=3)

        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, fill=tk.Y, padx=5)
        self.rec_fmt_var = tk.StringVar(value="mp4")
        cb_fmt = ttk.Combobox(
            toolbar,
            textvariable=self.rec_fmt_var,
            values=["mp4", "gif", "webm", "webp", "avi"],
            width=5,
            state="readonly",
        )
        cb_fmt.pack(side=tk.LEFT, padx=(2, 1))
        cb_fmt.bind("<<ComboboxSelected>>", lambda e: self.root.focus_set())
        self.btn_rec_start = ttk.Button(toolbar, text="🔴 録画開始 [G]", command=self.action_start_gif_recording)
        self.btn_rec_start.pack(side=tk.LEFT, padx=2)
        self.btn_rec_stop = ttk.Button(toolbar, text="⏹️ 録画停止・保存", command=self.action_stop_gif_recording, state=tk.DISABLED)
        self.btn_rec_stop.pack(side=tk.LEFT, padx=2)
        self.lbl_rec_status = ttk.Label(toolbar, text="", foreground="crimson", font=("", 9, "bold"))
        self.lbl_rec_status.pack(side=tk.LEFT, padx=3)

        ttk.Label(toolbar, text="速度:").pack(side=tk.LEFT, padx=(6, 1))
        self.spn_speed = ttk.Spinbox(
            toolbar, from_=1, to=50, width=4, command=self._on_speed_change
        )
        self.spn_speed.set(self.steps_per_frame)
        self.spn_speed.bind("<Return>", lambda e: self._on_speed_change())
        self.spn_speed.pack(side=tk.LEFT, padx=2)

        ttk.Checkbutton(
            toolbar, text="編集時に波形自動リセット", variable=self.auto_reset_on_edit
        ).pack(side=tk.LEFT, padx=6)

        self.lbl_status = ttk.Label(toolbar, text="[未保存の新規遺伝子]", foreground="royalblue", font=("", 9, "bold"))
        self.lbl_status.pack(side=tk.LEFT, padx=8)

        ttk.Button(toolbar, text="⌨️ チートシート [?]", command=self.action_show_shortcuts_dialog).pack(side=tk.RIGHT, padx=4)

        # --- ルート大タブ (Notebook): 全体を2つの大画面に分離 ---
        self.root_notebook = ttk.Notebook(self.root)
        self.root_notebook.pack(fill=tk.BOTH, expand=True, padx=4, pady=2)

        tab_sim_map = ttk.Frame(self.root_notebook, padding=2)
        tab_editor_settings = ttk.Frame(self.root_notebook, padding=2)

        self.root_notebook.add(tab_sim_map, text="📊 波形グラフ ＆ 🧠 ボクセル脳マップ")
        self.root_notebook.add(tab_editor_settings, text="🛠️ 選択セル～統合SimConfig")
        self.root_notebook.bind("<<NotebookTabChanged>>", self._on_root_tab_changed)

        # -------------------------------------------------------------
        # 【大タブ1: 波形グラフ ＆ ボクセル脳マップ】
        # -------------------------------------------------------------
        self.main_paned = ttk.PanedWindow(tab_sim_map, orient=tk.HORIZONTAL)
        self.main_paned.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        # 左側: Matplotlib リアルタイム可視化パネル (広々 60%)
        self.sim_frame = ttk.Frame(self.main_paned)
        self.main_paned.add(self.sim_frame, weight=3)

        # 右側: 2Dボクセル脳マップパネル (広々 40%)
        self.map_panel_frame = ttk.Frame(self.main_paned, padding=4)
        self.main_paned.add(self.map_panel_frame, weight=2)
        self._build_voxel_map_panel(self.map_panel_frame)

        # -------------------------------------------------------------
        # 【大タブ2: 選択セル～統合SimConfig】
        # -------------------------------------------------------------
        self.editor_frame = tab_editor_settings
        self.notebook = ttk.Notebook(tab_editor_settings)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        tab_cell = ttk.Frame(self.notebook, padding=6)
        tab_inout = ttk.Frame(self.notebook, padding=6)
        tab_params = ttk.Frame(self.notebook, padding=6)
        tab_ko_scan = ttk.Frame(self.notebook, padding=6)
        tab_launcher = ttk.Frame(self.notebook, padding=6)

        self.notebook.add(tab_cell, text="🔍 選択セル・配線")
        self.notebook.add(tab_inout, text="🌐 I/O 3D配線")
        self.notebook.add(tab_params, text="⚙️ 神経パラメータ")
        self.notebook.add(tab_ko_scan, text="🧪 ノッキング診断")
        self.notebook.add(tab_launcher, text="🚀 統合ランチャー・sim_config")
        self.notebook.bind("<<NotebookTabChanged>>", self._on_notebook_tab_changed)

        self._build_tab_cell(tab_cell)
        self._build_tab_inout(tab_inout)
        self._build_tab_params(tab_params)
        self._build_tab_ko_scan(tab_ko_scan)
        self._build_tab_launcher(tab_launcher)

    def _on_root_tab_changed(self, event=None):
        self.root.focus_set()
        if not hasattr(self, "root_notebook"):
            return
        sel = self.root_notebook.select()
        tab_text = self.root_notebook.tab(sel, "text")
        if "ボクセル脳マップ" in tab_text:
            self._redraw_grid_canvas()
            self._render_matplotlib_state(force_full=True)
        elif "SimConfig" in tab_text:
            self._on_notebook_tab_changed()

    def _build_voxel_map_panel(self, parent: ttk.Frame):
        # スライスグリッドキャンバス (ノッキング＆セル選択)
        grp_grid = ttk.LabelFrame(parent, text="🧠 ボクセル脳マップ (白枠内 = 内部ニューロン x,y=0..N-1 / 外周 = 感覚膜 P=0..N+1)", padding=6)
        grp_grid.pack(fill=tk.BOTH, expand=True, pady=2)

        mode_row = ttk.Frame(grp_grid)
        mode_row.pack(fill=tk.X, pady=1)
        ttk.Label(mode_row, text="表示:").pack(side=tk.LEFT)
        for txt, val in [
            ("KO ＆ 興奮/抑制", "ko_inhib"),
            ("現在出力 |Out|", "live_out"),
            ("sig_pre", "sig_pre"),
            ("sig_post", "sig_post"),
            ("dopamine", "dopamine"),
            ("sleep", "sleep"),
        ]:
            ttk.Radiobutton(
                mode_row, text=txt, value=val, variable=self.view_mode_var, command=self._redraw_grid_canvas
            ).pack(side=tk.LEFT, padx=2)

        rclick_row = ttk.Frame(grp_grid)
        rclick_row.pack(fill=tk.X, pady=2)
        ttk.Label(rclick_row, text="右クリック/Shift左クリック:", foreground="crimson", font=("", 9, "bold")).pack(side=tk.LEFT)
        ttk.Radiobutton(
            rclick_row, text="🚫 セルKO切替", value="knockout", variable=self.right_click_mode_var
        ).pack(side=tk.LEFT, padx=3)
        ttk.Radiobutton(
            rclick_row, text="✂️ 選択セルとの結合を切断/復元(sig不変)", value="cut_synapse", variable=self.right_click_mode_var
        ).pack(side=tk.LEFT, padx=3)
        ttk.Radiobutton(
            rclick_row, text="➕/➖ 興奮/抑制切替", value="inhib", variable=self.right_click_mode_var
        ).pack(side=tk.LEFT, padx=3)

        ko_bar = ttk.Frame(grp_grid)
        ko_bar.pack(fill=tk.X, pady=2)
        ttk.Button(ko_bar, text="🚫 選択セルKO [K]", command=self.action_toggle_selected_ko).pack(side=tk.LEFT, padx=2)
        ttk.Button(ko_bar, text="🚫 ZスライスKO", command=self.action_ko_current_z_slice).pack(side=tk.LEFT, padx=2)
        ttk.Button(ko_bar, text="✨ 全セルKO解除", command=self.action_clear_all_ko).pack(side=tk.LEFT, padx=2)
        ttk.Button(ko_bar, text="✂️ 全結合切断を解除", command=self.action_clear_all_synapse_cuts).pack(side=tk.LEFT, padx=2)
        ttk.Button(ko_bar, text="🧬 KOをsig=0確定", command=self.action_bake_ko_to_genes).pack(side=tk.LEFT, padx=2)

        self.lbl_ko_summary = ttk.Label(grp_grid, text="ノックアウト中: 0 セル ｜ 結合切断: 0 本", foreground="dimgray")
        self.lbl_ko_summary.pack(anchor=tk.W, pady=1)

        self.grid_canvas = tk.Canvas(grp_grid, bg="#1e1e24", height=300, highlightthickness=0)
        self.grid_canvas.pack(fill=tk.BOTH, expand=True, pady=2)
        self.grid_canvas.bind("<Configure>", lambda e: self._redraw_grid_canvas())
        self.grid_canvas.bind("<Button-1>", self._on_grid_left_click)
        self.grid_canvas.bind("<Shift-Button-1>", self._on_grid_shift_left_click)
        self.grid_canvas.bind("<Button-3>", self._on_grid_right_click)

        # ボクセルマップ下部に現在選択セル情報をミニバーとして表示
        mini_status = ttk.Frame(parent)
        mini_status.pack(fill=tk.X, pady=2)
        self.lbl_map_sel_info = ttk.Label(mini_status, text="", font=("", 9, "bold"), foreground="#80d8ff")
        self.lbl_map_sel_info.pack(side=tk.LEFT, padx=4)
        ttk.Button(mini_status, text="🎯 選択セルの詳細編集へ ➔", command=lambda: self.root_notebook.select(1)).pack(side=tk.RIGHT, padx=4)

    def _build_tab_cell(self, parent: ttk.Frame):
        top_info = ttk.Frame(parent)
        top_info.pack(fill=tk.X)
        self.lbl_cell_coord = ttk.Label(top_info, text="", font=("", 9, "bold"))
        self.lbl_cell_coord.pack(side=tk.LEFT)
        self.lbl_cell_role = ttk.Label(top_info, text="", foreground="crimson", font=("", 9, "bold"))
        self.lbl_cell_role.pack(side=tk.RIGHT)

        mid_split = ttk.Frame(parent)
        mid_split.pack(fill=tk.BOTH, expand=True, pady=4)

        # 左半分: sig_pre / sig_post / inhib / dop / sleep
        left_c = ttk.Frame(mid_split)
        left_c.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 6))

        ttk.Label(left_c, text="CH").grid(row=0, column=0)
        ttk.Label(left_c, text="sig_pre").grid(row=0, column=1, padx=2)
        ttk.Label(left_c, text="sig_post").grid(row=0, column=2, padx=2)

        self.sig_pre_vars = [tk.StringVar(value="0.0") for _ in range(4)]
        self.sig_post_vars = [tk.StringVar(value="0.0") for _ in range(4)]

        for c in range(4):
            ttk.Label(left_c, text=f"ch{c}:").grid(row=c + 1, column=0, sticky=tk.W)
            ep = ttk.Entry(left_c, textvariable=self.sig_pre_vars[c], width=8)
            ep.grid(row=c + 1, column=1, padx=2, pady=1)
            ep.bind("<Return>", lambda e: self._apply_cell_edits_from_ui())

            epo = ttk.Entry(left_c, textvariable=self.sig_post_vars[c], width=8)
            epo.grid(row=c + 1, column=2, padx=2, pady=1)
            epo.bind("<Return>", lambda e: self._apply_cell_edits_from_ui())

        self.cell_ko_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            left_c, text="🚫 このセルをノックアウト (出力=0)", variable=self.cell_ko_var, command=self._on_ko_checkbox_toggle
        ).grid(row=5, column=0, columnspan=3, sticky=tk.W, pady=2)

        self.cell_inhib_var = tk.BooleanVar(value=False)
        self.chk_inhib = ttk.Checkbutton(
            left_c, text="➖ 抑制性ニューロン (inhib=-1)", variable=self.cell_inhib_var, command=self._apply_cell_edits_from_ui
        )
        self.chk_inhib.grid(row=6, column=0, columnspan=3, sticky=tk.W, pady=1)

        ttk.Label(left_c, text="dopamine:").grid(row=7, column=0, sticky=tk.W)
        self.cell_dop_var = tk.StringVar(value="0.1")
        ed = ttk.Entry(left_c, textvariable=self.cell_dop_var, width=8)
        ed.grid(row=7, column=1, pady=1)
        ed.bind("<Return>", lambda e: self._apply_cell_edits_from_ui())

        ttk.Label(left_c, text="sleep:").grid(row=8, column=0, sticky=tk.W)
        self.cell_slp_var = tk.StringVar(value="0.0")
        es = ttk.Entry(left_c, textvariable=self.cell_slp_var, width=8)
        es.grid(row=8, column=1, pady=1)
        es.bind("<Return>", lambda e: self._apply_cell_edits_from_ui())

        btn_c_row = ttk.Frame(left_c)
        btn_c_row.grid(row=9, column=0, columnspan=3, sticky=tk.EW, pady=2)
        ttk.Button(btn_c_row, text="値反映", command=self._apply_cell_edits_from_ui).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        ttk.Button(btn_c_row, text="sig=0化", command=self.action_zero_selected_cell_sigs).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)

        # 2セル間の結合操作 (実験切断 & クイック配線)
        wire_box = ttk.LabelFrame(left_c, text="2セル間の結合操作 (Pre➔Post)", padding=4)
        wire_box.grid(row=10, column=0, columnspan=3, sticky=tk.EW, pady=2)
        self.lbl_wire_src = ttk.Label(wire_box, text="起点(Pre): 未選択", font=("", 8))
        self.lbl_wire_src.pack(anchor=tk.W)
        ttk.Button(wire_box, text="📌 現在セルを起点(Pre)に指定 [W]", command=self.action_set_wire_src).pack(fill=tk.X, pady=1)
        ttk.Button(
            wire_box, text="✂️ Pre➔現在セル 実験切断/復元 (sig不変)", command=self.action_cut_wire_unidirectional
        ).pack(fill=tk.X, pady=1)
        ttk.Button(
            wire_box, text="✂️ Pre⟷現在セル 双方向切断/復元 (sig不変)", command=self.action_cut_wire_bidirectional
        ).pack(fill=tk.X, pady=1)

        self.wire_ch_var = tk.IntVar(value=0)
        ch_r = ttk.Frame(wire_box)
        ch_r.pack(fill=tk.X, pady=(2, 0))
        for c in range(4):
            ttk.Radiobutton(ch_r, text=f"c{c}", value=c, variable=self.wire_ch_var).pack(side=tk.LEFT)
        ttk.Button(wire_box, text="🔗 Pre➔現在セル 遺伝子書換結合(sig=1)", command=self.action_connect_wire).pack(fill=tk.X, pady=1)

        # 右半分: インタラクティブ・シナプス結合一覧 (sig_pre/post を改変せずに個別切断・復元可能)
        right_c = ttk.Frame(mid_split)
        right_c.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        ttk.Label(
            right_c,
            text="シナプス結合一覧 (ダブルクリックで実験切断/復元 ✂️ sig不変):",
            foreground="royalblue",
            font=("", 8, "bold"),
        ).pack(anchor=tk.W)

        syn_tree_frame = ttk.Frame(right_c)
        syn_tree_frame.pack(fill=tk.BOTH, expand=True, pady=2)

        syn_cols = ("dir", "partner", "weight", "info")
        self.tree_synapses = ttk.Treeview(syn_tree_frame, columns=syn_cols, show="headings", height=9, selectmode="browse")
        self.tree_synapses.heading("dir", text="方向")
        self.tree_synapses.heading("partner", text="相手セル座標")
        self.tree_synapses.heading("weight", text="重み w")
        self.tree_synapses.heading("info", text="状態 / 役割")

        self.tree_synapses.column("dir", width=78, anchor=tk.W)
        self.tree_synapses.column("partner", width=135, anchor=tk.W)
        self.tree_synapses.column("weight", width=92, anchor=tk.E)
        self.tree_synapses.column("info", width=110, anchor=tk.W)

        syn_vsb = ttk.Scrollbar(syn_tree_frame, orient="vertical", command=self.tree_synapses.yview)
        self.tree_synapses.configure(yscrollcommand=syn_vsb.set)
        self.tree_synapses.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        syn_vsb.pack(side=tk.RIGHT, fill=tk.Y)

        self.tree_synapses.bind("<Double-1>", lambda e: self.action_toggle_selected_synapse())

        syn_btn_row1 = ttk.Frame(right_c)
        syn_btn_row1.pack(fill=tk.X, pady=1)
        ttk.Button(
            syn_btn_row1, text="✂️ 選択行の結合を切断/復元 [C]", command=self.action_toggle_selected_synapse
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        ttk.Button(
            syn_btn_row1, text="🎯 相手セルへ移動", command=self.action_jump_to_synapse_partner
        ).pack(side=tk.LEFT, padx=1)

        syn_btn_row2 = ttk.Frame(right_c)
        syn_btn_row2.pack(fill=tk.X, pady=1)
        ttk.Button(
            syn_btn_row2, text="📥 このセルへの全入力を切断/復元", command=self.action_toggle_all_incoming_synapses
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        ttk.Button(
            syn_btn_row2, text="📤 このセルからの全出力を切断/復元", command=self.action_toggle_all_outgoing_synapses
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)

    # ==========================================================================
    # 🔌 I/O 配線盤 (Modular Patch Bay) UI＆配線ロジック ＆ 🌐 3D ボクセル配線マップ
    # ==========================================================================
    def _on_notebook_tab_changed(self, event=None):
        self.root.focus_set()
        sel = self.notebook.select()
        tab_text = self.notebook.tab(sel, "text")
        if "配線" in tab_text:
            self._refresh_io_port_combobox()
            self._draw_inout_3d_map()
            self._update_io_inspector_ui()

    def _build_tab_inout(self, parent: ttk.Frame):
        # 1. 上部ツールバー: ポート選択 Combobox ＆ 各種操作ボタン
        tb = ttk.Frame(parent)
        tb.pack(fill=tk.X, pady=(0, 4))

        ttk.Label(tb, text="🎯 配線ポート:", font=("", 9, "bold"), foreground="#00e5ff").pack(side=tk.LEFT, padx=(2, 4))
        self.cb_active_io_port_var = tk.StringVar()
        self.cb_active_io_port = ttk.Combobox(
            tb,
            textvariable=self.cb_active_io_port_var,
            state="readonly",
            width=26,
        )
        self.cb_active_io_port.pack(side=tk.LEFT, padx=(0, 8))
        self.cb_active_io_port.bind("<<ComboboxSelected>>", self._on_active_io_port_combo_changed)

        ttk.Button(tb, text="➕ In追加", command=self.action_add_in_port).pack(side=tk.LEFT, padx=2)
        ttk.Button(tb, text="➕ Out追加", command=self.action_add_out_port).pack(side=tk.LEFT, padx=2)
        ttk.Button(tb, text="🎲 ランダム配線", command=self.action_randomize_inout_wiring).pack(side=tk.LEFT, padx=2)
        ttk.Button(tb, text="🔄 標準配線", command=self.action_reset_inout_wiring).pack(side=tk.LEFT, padx=2)

        ttk.Button(tb, text="💾 sim_config反映", command=self.action_sync_inout_to_sim_config).pack(side=tk.RIGHT, padx=2)
        ttk.Button(tb, text="🔄 視点リセット", width=12, command=self.action_reset_inout_3d_view).pack(side=tk.RIGHT, padx=4)

        # 2. メインビュー: 🌐 3D ボクセル配線マップ (画面全体に展開)
        self.inout_canvas = None  # 2D配線板は廃止し3Dマップに一本化

        map_frame = ttk.Frame(parent)
        map_frame.pack(fill=tk.BOTH, expand=True)

        self.inout_3d_canvas = tk.Canvas(
            map_frame,
            bg="#0c0e14",
            highlightthickness=1,
            highlightbackground="#282a36",
            cursor="crosshair",
        )
        self.inout_3d_canvas.pack(fill=tk.BOTH, expand=True)
        self.inout_3d_canvas.bind("<Button-1>", self._on_inout_3d_click)
        self.inout_3d_canvas.bind("<B1-Motion>", self._on_inout_3d_drag)
        self.inout_3d_canvas.bind("<ButtonRelease-1>", self._on_inout_3d_release)
        self.inout_3d_canvas.bind("<Button-3>", self._on_inout_3d_pan_start)
        self.inout_3d_canvas.bind("<B3-Motion>", self._on_inout_3d_pan_drag)
        self.inout_3d_canvas.bind("<MouseWheel>", self._on_inout_3d_wheel)
        self.inout_3d_canvas.bind("<Motion>", self._on_inout_3d_motion)
        self.inout_3d_canvas.bind("<Configure>", lambda e: self._draw_inout_3d_map())

        # 3. 下部: 選択ポート配線インスペクター
        insp = ttk.LabelFrame(parent, text="🛠️ 選択ポートの配線＆信号調整 (3Dマップ上のセルをクリックでも即座に指定可能)", padding=4)
        insp.pack(fill=tk.X, pady=(4, 0))

        r1 = ttk.Frame(insp)
        r1.pack(fill=tk.X, pady=2)

        self.lbl_io_selected = ttk.Label(r1, text="選択中: なし", font=("", 9, "bold"), foreground="#00e5ff")
        self.lbl_io_selected.pack(side=tk.LEFT, padx=(2, 12))

        ttk.Label(r1, text="接続面(Face):", font=("", 8)).pack(side=tk.LEFT, padx=2)
        self.cb_io_face_var = tk.StringVar()
        self.cb_io_face = ttk.Combobox(
            r1,
            textvariable=self.cb_io_face_var,
            state="readonly",
            width=16,
            values=[
                "0: -X面 (西/左)",
                "1: +X面 (東/右)",
                "2: -Y面 (南/手前)",
                "3: +Y面 (北/奥)",
                "4: -Z面 (底/下)",
                "5: +Z面 (天/上)",
            ],
        )
        self.cb_io_face.pack(side=tk.LEFT, padx=2)
        self.cb_io_face.bind("<<ComboboxSelected>>", self._on_io_face_changed)

        ttk.Label(r1, text="U:", font=("", 8)).pack(side=tk.LEFT, padx=(8, 2))
        self.scale_io_u_var = tk.IntVar(value=0)
        self.scale_io_u = ttk.Scale(r1, from_=-1, to=self.N, orient=tk.HORIZONTAL, variable=self.scale_io_u_var, command=self._on_io_u_changed, length=90)
        self.scale_io_u.pack(side=tk.LEFT, padx=2)
        self.lbl_io_u = ttk.Label(r1, text="0", width=3, font=("", 8))
        self.lbl_io_u.pack(side=tk.LEFT)

        ttk.Label(r1, text="V:", font=("", 8)).pack(side=tk.LEFT, padx=(8, 2))
        self.scale_io_v_var = tk.IntVar(value=0)
        self.scale_io_v = ttk.Scale(r1, from_=-1, to=self.N, orient=tk.HORIZONTAL, variable=self.scale_io_v_var, command=self._on_io_v_changed, length=90)
        self.scale_io_v.pack(side=tk.LEFT, padx=2)
        self.lbl_io_v = ttk.Label(r1, text="0", width=3, font=("", 8))
        self.lbl_io_v.pack(side=tk.LEFT)

        self.lbl_io_p_coord = ttk.Label(r1, text="➔ P[?, ?, ?]", font=("", 9, "bold"), foreground="gold")
        self.lbl_io_p_coord.pack(side=tk.LEFT, padx=(10, 10))

        ttk.Button(r1, text="🎯 このセルへジャンプ", command=self.action_jump_to_io_cell).pack(side=tk.LEFT, padx=4)

        # 2行目: 信号手動注入 ＆ ポート削除
        r2 = ttk.Frame(insp)
        r2.pack(fill=tk.X, pady=2)

        self.io_manual_var = tk.BooleanVar(value=False)
        self.chk_io_manual = ttk.Checkbutton(r2, text="手動テスト注入 (Override):", variable=self.io_manual_var, command=self._on_io_manual_toggle)
        self.chk_io_manual.pack(side=tk.LEFT, padx=(2, 4))

        self.scale_io_manual_var = tk.DoubleVar(value=0.5)
        self.scale_io_manual = ttk.Scale(
            r2,
            from_=0.0,
            to=1.0,
            orient=tk.HORIZONTAL,
            variable=self.scale_io_manual_var,
            command=self._on_io_manual_slider,
            length=140,
        )
        self.scale_io_manual.pack(side=tk.LEFT, padx=4)

        self.lbl_io_manual_val = ttk.Label(r2, text="0.50", width=5, font=("", 8))
        self.lbl_io_manual_val.pack(side=tk.LEFT)

        self.lbl_io_live_val = ttk.Label(r2, text="現在シグナル: 0.000", font=("", 9), foreground="#69f0ae")
        self.lbl_io_live_val.pack(side=tk.LEFT, padx=(16, 10))

        self.btn_io_delete = ttk.Button(r2, text="🗑️ このポートを削除", command=self.action_remove_selected_port)
        self.btn_io_delete.pack(side=tk.RIGHT, padx=2)

    def _get_io_port_name(self, port_type: str, slot: int) -> str:
        if port_type == "in":
            if slot == 0: return "☀️ 太陽光 (Sun)"
            elif slot == 1: return "⚡ 蓄電量 (Battery)"
            else: return f"📥 センサー In[{slot}]"
        else:
            if slot == 0: return "⚙️ 発電+ (Gen+)"
            elif slot == 1: return "⚙️ 発電- (Gen-)"
            elif slot == 2: return "🚀 速度 (Speed)"
            elif slot == 3: return "🔄 旋回 (Rotate)"
            else: return f"📤 モーター Out[{slot}]"

    def _get_io_port_color(self, port_type: str, slot: int) -> str:
        if port_type == "in":
            colors = ["#ffb300", "#00e5ff", "#e040fb", "#76ff03", "#ffd600", "#18ffff"]
            return colors[slot % len(colors)]
        else:
            colors = ["#00e676", "#ff1744", "#ff9100", "#d500f9", "#00b0ff", "#ff5252"]
            return colors[slot % len(colors)]

    def _refresh_io_port_combobox(self):
        """上部のポート選択 Combobox を現在のポート一覧に更新"""
        if not hasattr(self, "cb_active_io_port"):
            return
        in_ports = self.sim_params.get("in_ports_fi", np.zeros((0, 3), dtype=np.int32))
        out_ports = self.sim_params.get("out_ports_fi", np.zeros((0, 3), dtype=np.int32))

        items = []
        selected_text = ""
        for i in range(len(in_ports)):
            txt = f"📥 In #{i}: {self._get_io_port_name('in', i)}"
            items.append(txt)
            if self.selected_io_port == ("in", i):
                selected_text = txt

        for i in range(len(out_ports)):
            txt = f"📤 Out #{i}: {self._get_io_port_name('out', i)}"
            items.append(txt)
            if self.selected_io_port == ("out", i):
                selected_text = txt

        self.cb_active_io_port["values"] = items
        if selected_text:
            self.cb_active_io_port.set(selected_text)
        elif items:
            self.cb_active_io_port.current(0)
            self._on_active_io_port_combo_changed(None)

    def _on_active_io_port_combo_changed(self, event=None):
        """Combobox からポートが選択されたときのハンドラ"""
        if not hasattr(self, "cb_active_io_port"):
            return
        sel_txt = self.cb_active_io_port.get()
        if not sel_txt:
            return
        if "📥 In #" in sel_txt:
            idx = int(sel_txt.split("📥 In #")[1].split(":")[0])
            self.selected_io_port = ("in", idx)
        elif "📤 Out #" in sel_txt:
            idx = int(sel_txt.split("📤 Out #")[1].split(":")[0])
            self.selected_io_port = ("out", idx)

        self._update_io_inspector_ui()
        self._draw_inout_3d_map()

    def _draw_inout_wiring(self):
        """互換用（2D配線板は3Dマップに一本化）"""
        pass

    def _on_inout_canvas_click(self, event):
        """互換用"""
        pass

    # ==========================================================================
    # 🌐 3D ボクセル配線マップ (回転・ズーム・セル指定ピッキング)
    # ==========================================================================
    def action_reset_inout_3d_view(self):
        """3D配線マップの視点をリセット"""
        self.inout_3d_yaw = 38.0
        self.inout_3d_pitch = 26.0
        self.inout_3d_zoom = 1.0
        self.inout_3d_pan_x = 0.0
        self.inout_3d_pan_y = 0.0
        self._draw_inout_3d_map()

    def _project_3d_point(self, rx, ry, rz, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm):
        # 世界座標: rx = X (東/右), ry = Y (北/奥), rz = Z (天/上)
        # 1. Yaw: 垂直軸 Z まわりの水平回転
        x1 = rx * cos_y - ry * sin_y
        y1 = rx * sin_y + ry * cos_y
        z1 = rz

        # 2. Pitch: カメラ横軸まわりの見下ろし回転 (Zが画面上、Yが画面奥)
        xc = x1
        yc = z1 * cos_p - y1 * sin_p
        zc = z1 * sin_p + y1 * cos_p

        # 3. 透視投影 (zc が大きいほど奥、小さいほど手前)
        factor = dist / max(0.1, dist + zc * (2.2 / n_norm))
        sx = cx + (xc * factor * scale) / n_norm + self.inout_3d_pan_x
        sy = cy - (yc * factor * scale) / n_norm + self.inout_3d_pan_y
        return sx, sy, zc, factor

    def _draw_inout_3d_map(self):
        """回転可能な3Dボクセル配線マップの描画"""
        cv = getattr(self, "inout_3d_canvas", None)
        if not cv: return

        w = cv.winfo_width()
        h = cv.winfo_height()
        if w < 100: w = max(400, cv.winfo_reqwidth())
        if h < 50: h = max(240, cv.winfo_reqheight())

        cv.delete("all")
        self.inout_3d_pick_targets.clear()

        cx = w / 2.0
        cy = h / 2.0

        rad_y = math.radians(self.inout_3d_yaw)
        rad_p = math.radians(self.inout_3d_pitch)
        cos_y, sin_y = math.cos(rad_y), math.sin(rad_y)
        cos_p, sin_p = math.cos(rad_p), math.sin(rad_p)

        n_norm = max(float(self.N), 2.0)
        dist = 5.2
        scale = min(w, h) * 0.44 * self.inout_3d_zoom
        cen = (self.N - 1.0) / 2.0

        port_type = self.selected_io_port[0] if self.selected_io_port else "in"
        slot_idx = self.selected_io_port[1] if self.selected_io_port else 0
        port_name = self._get_io_port_name(port_type, slot_idx)
        port_col = self._get_io_port_color(port_type, slot_idx)

        # 背景・案内表示 (大画面に合わせて視認性を向上)
        cv.create_rectangle(0, 0, w, h, fill="#0c0e14", outline="")
        cv.create_text(16, 12, text=f"🌐 3D ボクセル配線マップ  ｜  📍 接続指定中: #{slot_idx} {port_name}", anchor=tk.NW, fill=port_col, font=("", 11, "bold"))
        cv.create_text(16, 34, text="点線青: 外周膜(入力面)  /  点線紫: 内部表面(出力面)", anchor=tk.NW, fill="#90a4ae", font=("", 9))
        cv.create_text(16, h - 16, text="🖱️ [左ドラッグ: 3D回転]  [右ドラッグ: 平行移動]  [ホイール: ズーム]  [クリック: このセルにカチッと配線！]", anchor=tk.SW, fill="#cfd8dc", font=("", 9, "bold"))

        # 1. 座標軸 (原点から X:赤, Y:緑, Z:青)
        ax_len = cen + 1.8
        orig_s = self._project_3d_point(-cen, -cen, -cen, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm)
        for (dx, dy, dz, col, lbl) in [
            (ax_len, 0, 0, "#e57373", "+X (東)"),
            (0, ax_len, 0, "#81c784", "+Y (北)"),
            (0, 0, ax_len, "#64b5f6", "+Z (天)"),
        ]:
            ax_s = self._project_3d_point(-cen + dx, -cen + dy, -cen + dz, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm)
            cv.create_line(orig_s[0], orig_s[1], ax_s[0], ax_s[1], fill=col, width=2.0, arrow=tk.LAST)
            cv.create_text(ax_s[0] + 6, ax_s[1] - 6, text=lbl, fill=col, font=("", 9, "bold"))

        # 2. ワイヤーフレームキューブの描画 (内部ニューロンコア & 外周膜)
        core_corners = []
        for cz in (0, self.N - 1):
            for cy_ in (0, self.N - 1):
                for cx_ in (0, self.N - 1):
                    core_corners.append((cx_, cy_, cz))

        def draw_cube_wire(min_val, max_val, col, dash=()):
            corners = [
                (min_val, min_val, min_val), (max_val, min_val, min_val),
                (max_val, max_val, min_val), (min_val, max_val, min_val),
                (min_val, min_val, max_val), (max_val, min_val, max_val),
                (max_val, max_val, max_val), (min_val, max_val, max_val),
            ]
            s_corners = [self._project_3d_point(c[0] - cen, c[1] - cen, c[2] - cen, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm) for c in corners]
            edges = [
                (0,1), (1,2), (2,3), (3,0),
                (4,5), (5,6), (6,7), (7,4),
                (0,4), (1,5), (2,6), (3,7),
            ]
            for e in edges:
                cv.create_line(s_corners[e[0]][0], s_corners[e[0]][1], s_corners[e[1]][0], s_corners[e[1]][1], fill=col, width=1.5, dash=dash)

        # 外周膜枠 (-1 .. N)
        draw_cube_wire(-1.0, float(self.N), "#00bcd4", dash=(4, 4))
        # 内部表面枠 (0 .. N-1)
        draw_cube_wire(0.0, float(self.N - 1), "#9575cd", dash=(3, 3))

        # 3. 表面セルの端子パッド一覧（ピッキング対象）の収集 ＆ Zソート
        cells_to_render = []
        in_ports = self.sim_params.get("in_ports_fi", np.zeros((0, 3), dtype=np.int32))
        out_ports = self.sim_params.get("out_ports_fi", np.zeros((0, 3), dtype=np.int32))

        # 接続中ポートの逆引き辞書 (coord_in -> list of in_ports), (coord_out -> list of out_ports)
        in_conn_map = {}
        for ip_idx, fi in enumerate(in_ports):
            c_p = face_index_to_coord_in_p(fi, self.N)
            in_conn_map.setdefault(c_p, []).append(ip_idx)

        out_conn_map = {}
        for op_idx, fi in enumerate(out_ports):
            c_p = face_index_to_coord_out_p(fi, self.N)
            out_conn_map.setdefault(c_p, []).append(op_idx)

        # 表面セルグリッドを生成 (選択中ポートの種別に応じて重点配置)
        if port_type == "in":
            # 入力用: 外周膜の6面 (face 0..5, u,v in -1..N)
            for f in range(6):
                # 表示の過密を防ぐためステップ間隔を調整 (N>=4なら適度に間引きまたは全描画)
                step = 1 if self.N <= 4 else 2
                for u in range(-1, self.N + 1, step):
                    for v in range(-1, self.N + 1, step):
                        coord_p = face_index_to_coord_in_p((f, u, v), self.N)
                        pz, py, px = coord_p
                        # P空間 [0..N+1] からのワールド座標: px-1, py-1, pz-1
                        wx, wy, wz = float(px - 1), float(py - 1), float(pz - 1)
                        sx, sy, z2, factor = self._project_3d_point(wx - cen, wy - cen, wz - cen, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm)
                        cells_to_render.append({
                            "type": "in", "face": f, "u": u, "v": v, "p_coord": coord_p,
                            "sx": sx, "sy": sy, "z2": z2, "factor": factor,
                            "is_connected": (coord_p in in_conn_map),
                            "conn_slots": in_conn_map.get(coord_p, []),
                        })
        else:
            # 出力用: 内部表面の6面 (face 0..5, u,v in 0..N-1)
            for f in range(6):
                step = 1
                for u in range(0, self.N, step):
                    for v in range(0, self.N, step):
                        coord_p = face_index_to_coord_out_p((f, u, v), self.N)
                        pz, py, px = coord_p
                        wx, wy, wz = float(px - 1), float(py - 1), float(pz - 1)
                        sx, sy, z2, factor = self._project_3d_point(wx - cen, wy - cen, wz - cen, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm)
                        cells_to_render.append({
                            "type": "out", "face": f, "u": u, "v": v, "p_coord": coord_p,
                            "sx": sx, "sy": sy, "z2": z2, "factor": factor,
                            "is_connected": (coord_p in out_conn_map),
                            "conn_slots": out_conn_map.get(coord_p, []),
                        })

        # Zソート: 奥 (zcが大きい) から手前 (zcが小さい) へ描画
        cells_to_render.sort(key=lambda item: item["z2"], reverse=True)

        # 描画ループ
        hover_target = self.inout_3d_hover_target
        for item in cells_to_render:
            sx, sy = item["sx"], item["sy"]
            factor = item["factor"]
            is_conn = item["is_connected"]
            conn_slots = item["conn_slots"]
            is_hover = (hover_target and hover_target.get("p_coord") == item["p_coord"])

            # 接続中ポートの中に選択中ポートが含まれるか
            is_active_target = False
            if is_conn:
                for s in conn_slots:
                    if (item["type"], s) == self.selected_io_port:
                        is_active_target = True
                        break

            # ピッキング判定ヒット半径 (大画面でのクリック操作性を確保)
            r_hit = max(10.0, 14.0 * factor)
            self.inout_3d_pick_targets.append({
                "face": item["face"], "u": item["u"], "v": item["v"],
                "p_coord": item["p_coord"], "sx": sx, "sy": sy, "r": r_hit, "z2": item["z2"],
                "type": item["type"],
            })

            # 端子ノードの描画 (大画面に合わせた見やすい点・文字サイズ)
            if is_conn:
                first_slot = conn_slots[0]
                col = self._get_io_port_color(item["type"], first_slot)

                if is_active_target:
                    # 選択中ターゲット: 発光リング ＆ 大きめのノード球
                    p_r = max(5.5, 8.5 * factor)
                    cv.create_oval(sx - p_r - 3.5, sy - p_r - 3.5, sx + p_r + 3.5, sy + p_r + 3.5, outline="#ffee58", width=2.0)
                    cv.create_oval(sx - p_r, sy - p_r, sx + p_r, sy + p_r, fill=col, outline="#ffffff", width=2.0)

                    tag_name = self._get_io_port_name(item["type"], first_slot).split(" ")[0]
                    cv.create_text(sx + p_r + 6, sy - 4, text=f"★{tag_name}", anchor=tk.W, fill="#ffee58", font=("", 9, "bold"))
                else:
                    # 他の接続済みポート: しっかり視認できるピン球
                    p_r = max(4.0, 6.0 * factor)
                    cv.create_oval(sx - p_r, sy - p_r, sx + p_r, sy + p_r, fill=col, outline="#1a1c24", width=1.5)

                    tag_name = self._get_io_port_name(item["type"], first_slot).split(" ")[0]
                    cv.create_text(sx + p_r + 5, sy - 3, text=tag_name, anchor=tk.W, fill=col, font=("", 8, "bold"))
            else:
                # 通常の未接続表面セル (くっきりしたドット)
                dot_r = max(2.0, 3.2 * factor)
                if is_hover:
                    cv.create_oval(sx - dot_r - 3.0, sy - dot_r - 3.0, sx + dot_r + 3.0, sy + dot_r + 3.0, fill="#00e5ff", outline="#ffffff", width=1.5)
                else:
                    d_col = "#263238" if item["type"] == "in" else "#311b92"
                    cv.create_oval(sx - dot_r, sy - dot_r, sx + dot_r, sy + dot_r, fill=d_col, outline="#37474f", width=1.0)

        # 4. ホバー中のセル情報ツールチップ
        if hover_target:
            hsx, hsy = hover_target["sx"], hover_target["sy"]
            htxt = f"Face {hover_target['face']} (u={hover_target['u']}, v={hover_target['v']}) ➔ P{hover_target['p_coord']}"
            cv.create_text(hsx, hsy - 20, text=htxt, fill="#00e5ff", font=("", 10, "bold"), bbox=dict(boxstyle="round", facecolor="#10121a", alpha=0.9, edgecolor="#00e5ff"))

    # --- 3Dマップのマウスインタラクション ---
    def _on_inout_3d_click(self, event):
        self.inout_3d_drag_start = (event.x, event.y)
        self.inout_3d_drag_moved = False

    def _on_inout_3d_drag(self, event):
        if not self.inout_3d_drag_start: return
        sx, sy = self.inout_3d_drag_start
        dx = event.x - sx
        dy = event.y - sy
        if abs(dx) > 2 or abs(dy) > 2:
            self.inout_3d_drag_moved = True

        self.inout_3d_yaw = (self.inout_3d_yaw + dx * 0.65) % 360.0
        self.inout_3d_pitch = float(np.clip(self.inout_3d_pitch - dy * 0.65, -88.0, 88.0))
        self.inout_3d_drag_start = (event.x, event.y)
        self._draw_inout_3d_map()

    def _on_inout_3d_pan_start(self, event):
        self.inout_3d_drag_start = (event.x, event.y)

    def _on_inout_3d_pan_drag(self, event):
        if not self.inout_3d_drag_start: return
        sx, sy = self.inout_3d_drag_start
        self.inout_3d_pan_x += (event.x - sx)
        self.inout_3d_pan_y += (event.y - sy)
        self.inout_3d_drag_start = (event.x, event.y)
        self._draw_inout_3d_map()

    def _on_inout_3d_wheel(self, event):
        if event.delta > 0:
            self.inout_3d_zoom = min(3.5, self.inout_3d_zoom * 1.15)
        else:
            self.inout_3d_zoom = max(0.4, self.inout_3d_zoom / 1.15)
        self._draw_inout_3d_map()

    def _on_inout_3d_motion(self, event):
        ex, ey = event.x, event.y
        # 手前のターゲット (zcが小さい) を優先して探す
        best_target = None
        min_dist = 18.0
        sorted_targets = sorted(self.inout_3d_pick_targets, key=lambda it: it["z2"])
        for t in sorted_targets:
            dist = math.hypot(ex - t["sx"], ey - t["sy"])
            if dist < t["r"] and dist < min_dist:
                min_dist = dist
                best_target = t
                break

        if best_target != self.inout_3d_hover_target:
            self.inout_3d_hover_target = best_target
            self._draw_inout_3d_map()

    def _on_inout_3d_release(self, event):
        if not self.inout_3d_drag_moved:
            # クリック判定 ➔ セルピッキング実行！
            ex, ey = event.x, event.y
            best_target = None
            min_dist = 22.0
            # 手前のセル (zcが小さい＝カメラに近い) を優先
            sorted_targets = sorted(self.inout_3d_pick_targets, key=lambda it: it["z2"])
            for t in sorted_targets:
                dist = math.hypot(ex - t["sx"], ey - t["sy"])
                if dist < t["r"] and dist < min_dist:
                    best_target = t
                    break

            if best_target and self.selected_io_port:
                port_type, slot = self.selected_io_port
                target_face = best_target["face"]
                target_u = best_target["u"]
                target_v = best_target["v"]

                # 選択ポートの配線をこのセルに直接指定！
                if port_type == "in":
                    self.sim_params["in_ports_fi"][slot] = [target_face, target_u, target_v]
                    if NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
                    if NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
                else:
                    self.sim_params["out_ports_fi"][slot] = [target_face, target_u, target_v]
                    if NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
                    if NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

                self._sync_genes_to_brain()
                self._draw_inout_wiring()
                self._draw_inout_3d_map()
                self._update_io_inspector_ui()
                self._render_matplotlib_state()
                self._append_vb_log(f"[🌐 3D配線] #{slot} {self._get_io_port_name(port_type, slot)} を Face {target_face} (u={target_u}, v={target_v}) ➔ P{best_target['p_coord']} に接続しました！\n")

        self.inout_3d_drag_start = None
        self.inout_3d_drag_moved = False

    def _update_io_inspector_ui(self):
        """選択中ポートの詳細を下部インスペクターに反映"""
        if not hasattr(self, "lbl_io_selected") or not self.selected_io_port:
            return

        port_type, slot = self.selected_io_port
        in_ports = self.sim_params.get("in_ports_fi", np.zeros((0, 3), dtype=np.int32))
        out_ports = self.sim_params.get("out_ports_fi", np.zeros((0, 3), dtype=np.int32))

        if port_type == "in":
            if slot >= len(in_ports):
                self.selected_io_port = ("in", 0) if len(in_ports) > 0 else None
                return
            fi = in_ports[slot]
            coord = face_index_to_coord_in_p(fi, self.N)
            name = self._get_io_port_name("in", slot)
            self.scale_io_u.config(from_=-1, to=self.N)
            self.scale_io_v.config(from_=-1, to=self.N)
            self.chk_io_manual.config(state="normal")
            self.scale_io_manual.config(state="normal")
            is_manual = hasattr(self.brain, "manual_in_overrides") and slot in self.brain.manual_in_overrides
            self.io_manual_var.set(is_manual)
            man_val = self.brain.manual_in_overrides.get(slot, 0.5) if is_manual else 0.5
            self.scale_io_manual_var.set(man_val)
            self.lbl_io_manual_val.config(text=f"{man_val:.2f}")

            cz, cy, cx = self.brain.in_coords_p[slot] if slot < len(self.brain.in_coords_p) else (0, 0, 0)
            live_v = float(self.brain.outputs_np2[cz, cy, cx])
        else:
            if slot >= len(out_ports):
                self.selected_io_port = ("out", 0) if len(out_ports) > 0 else None
                return
            fi = out_ports[slot]
            coord = face_index_to_coord_out_p(fi, self.N)
            name = self._get_io_port_name("out", slot)
            self.scale_io_u.config(from_=0, to=self.N - 1)
            self.scale_io_v.config(from_=0, to=self.N - 1)
            self.chk_io_manual.config(state="disabled")
            self.scale_io_manual.config(state="disabled")
            self.io_manual_var.set(False)

            if slot < len(self.brain.out_coords_p):
                cz, cy, cx = self.brain.out_coords_p[slot]
                live_v = float(self.brain.outputs_np2[cz, cy, cx])
            else:
                live_v = 0.0

        self.lbl_io_selected.config(text=f"選択中: #{slot} {name} ({'入力' if port_type == 'in' else '出力'})")
        face_idx = int(np.clip(int(fi[0]), 0, 5))
        self.cb_io_face.current(face_idx)

        self.scale_io_u_var.set(int(fi[1]))
        self.lbl_io_u.config(text=str(int(fi[1])))
        self.scale_io_v_var.set(int(fi[2]))
        self.lbl_io_v.config(text=str(int(fi[2])))

        self.lbl_io_p_coord.config(text=f"➔ P{coord}")
        self.lbl_io_live_val.config(text=f"現在シグナル: {live_v:+.4f}")
        self._refresh_io_port_combobox()

    def _on_io_face_changed(self, event=None):
        if not self.selected_io_port: return
        port_type, slot = self.selected_io_port
        face = self.cb_io_face.current()
        if face < 0: return

        if port_type == "in":
            self.sim_params["in_ports_fi"][slot, 0] = face
            if NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 0] = face
            if NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()

    def _on_io_u_changed(self, val):
        if not self.selected_io_port: return
        port_type, slot = self.selected_io_port
        u = int(round(float(val)))
        self.lbl_io_u.config(text=str(u))

        if port_type == "in":
            self.sim_params["in_ports_fi"][slot, 1] = u
            if NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 1] = u
            if NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()

    def _on_io_v_changed(self, val):
        if not self.selected_io_port: return
        port_type, slot = self.selected_io_port
        v = int(round(float(val)))
        self.lbl_io_v.config(text=str(v))

        if port_type == "in":
            self.sim_params["in_ports_fi"][slot, 2] = v
            if NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 2] = v
            if NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()

    def _on_io_manual_toggle(self):
        if not self.selected_io_port or self.selected_io_port[0] != "in": return
        slot = self.selected_io_port[1]
        is_on = self.io_manual_var.get()
        if is_on:
            self.brain.manual_in_overrides[slot] = float(self.scale_io_manual_var.get())
        else:
            self.brain.manual_in_overrides.pop(slot, None)
        self._draw_inout_wiring()
        self._update_io_inspector_ui()

    def _on_io_manual_slider(self, val):
        if not self.selected_io_port or self.selected_io_port[0] != "in": return
        slot = self.selected_io_port[1]
        v = float(val)
        self.lbl_io_manual_val.config(text=f"{v:.2f}")
        if self.io_manual_var.get():
            self.brain.manual_in_overrides[slot] = v
            self._draw_inout_wiring()

    def action_jump_to_io_cell(self):
        """配線先セルに2D/3D画面の選択カーソルを移動"""
        if not self.selected_io_port: return
        port_type, slot = self.selected_io_port
        if port_type == "in":
            fi = self.sim_params["in_ports_fi"][slot]
            coord = face_index_to_coord_in_p(fi, self.N)
        else:
            fi = self.sim_params["out_ports_fi"][slot]
            coord = face_index_to_coord_out_p(fi, self.N)

        self.sel_z, self.sel_y, self.sel_x = coord
        self._update_cell_editor_ui()
        self._render_matplotlib_state(force_full=True)
        self._draw_2d_slice()

    def action_add_in_port(self):
        """新しい入力ポートを追加"""
        global NUM_IN_PORTS
        in_p = self.sim_params.get("in_ports_fi", np.zeros((0, 3), dtype=np.int32))
        new_row = np.array([[2, self.N // 2, self.N // 2]], dtype=np.int32)
        self.sim_params["in_ports_fi"] = np.vstack([in_p, new_row])
        NUM_IN_PORTS = max(NUM_IN_PORTS, len(self.sim_params["in_ports_fi"]))

        self.selected_io_port = ("in", len(self.sim_params["in_ports_fi"]) - 1)
        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()
        self._append_vb_log(f"[I/O配線盤] 入力ポート #{self.selected_io_port[1]} を追加しました。\n")

    def action_add_out_port(self):
        """新しい出力ポートを追加"""
        global NUM_OUT_PORTS
        out_p = self.sim_params.get("out_ports_fi", np.zeros((0, 3), dtype=np.int32))
        new_row = np.array([[1, self.N // 2, self.N // 2]], dtype=np.int32)
        self.sim_params["out_ports_fi"] = np.vstack([out_p, new_row])
        NUM_OUT_PORTS = max(NUM_OUT_PORTS, len(self.sim_params["out_ports_fi"]))

        self.selected_io_port = ("out", len(self.sim_params["out_ports_fi"]) - 1)
        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()
        self._append_vb_log(f"[I/O配線盤] 出力ポート #{self.selected_io_port[1]} を追加しました。\n")

    def action_remove_selected_port(self):
        """選択中のポートを削除"""
        if not self.selected_io_port: return
        port_type, slot = self.selected_io_port

        if port_type == "in":
            in_p = self.sim_params["in_ports_fi"]
            if len(in_p) <= 1:
                messagebox.showwarning("削除不可", "入力ポートは最低1つ必要です。")
                return
            if not messagebox.askyesno("ポート削除", f"入力ポート #{slot} を配線盤から削除しますか？"):
                return
            self.sim_params["in_ports_fi"] = np.delete(in_p, slot, axis=0)
            if hasattr(self.brain, "manual_in_overrides"):
                self.brain.manual_in_overrides.pop(slot, None)
            self.selected_io_port = ("in", max(0, slot - 1))
        else:
            out_p = self.sim_params["out_ports_fi"]
            if len(out_p) <= 1:
                messagebox.showwarning("削除不可", "出力ポートは最低1つ必要です。")
                return
            if not messagebox.askyesno("ポート削除", f"出力ポート #{slot} を配線盤から削除しますか？"):
                return
            self.sim_params["out_ports_fi"] = np.delete(out_p, slot, axis=0)
            self.selected_io_port = ("out", max(0, slot - 1))

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()

    def action_randomize_inout_wiring(self):
        """全ポートの配線先セルをランダムにシャッフル"""
        rng = np.random.default_rng()
        in_p = self.sim_params["in_ports_fi"]
        out_p = self.sim_params["out_ports_fi"]

        for i in range(len(in_p)):
            in_p[i, 0] = rng.integers(0, 5, endpoint=True)
            in_p[i, 1] = rng.integers(-1, self.N, endpoint=True)
            in_p[i, 2] = rng.integers(-1, self.N, endpoint=True)

        for j in range(len(out_p)):
            out_p[j, 0] = rng.integers(0, 5, endpoint=True)
            out_p[j, 1] = rng.integers(0, self.N - 1, endpoint=True)
            out_p[j, 2] = rng.integers(0, self.N - 1, endpoint=True)

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()
        self._append_vb_log("[I/O配線盤] 全ポートの接続先セルをランダムに再配線しました。\n")

    def action_reset_inout_wiring(self):
        """標準配線位置に復帰"""
        defs = get_default_inout_fi(self.dim)
        in_p = self.sim_params["in_ports_fi"]
        out_p = self.sim_params["out_ports_fi"]

        n_in = min(len(in_p), len(defs["in_ports_fi"]))
        in_p[:n_in] = defs["in_ports_fi"][:n_in]
        n_out = min(len(out_p), len(defs["out_ports_fi"]))
        out_p[:n_out] = defs["out_ports_fi"][:n_out]

        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()
        self._append_vb_log("[I/O配線盤] 標準の配線位置にリセットしました。\n")

    def action_sync_inout_to_sim_config(self):
        """現在のポート数を sim_config.py に反映保存"""
        global NUM_IN_PORTS, NUM_OUT_PORTS
        NUM_IN_PORTS = len(self.sim_params["in_ports_fi"])
        NUM_OUT_PORTS = len(self.sim_params["out_ports_fi"])
        if hasattr(self, "cfg_num_vars") and "NUM_IN_PORTS" in self.cfg_num_vars:
            self.cfg_num_vars["NUM_IN_PORTS"].set(str(NUM_IN_PORTS))
            self.cfg_num_vars["NUM_OUT_PORTS"].set(str(NUM_OUT_PORTS))
        self.action_save_and_apply_sim_config(show_msg=True)
        messagebox.showinfo("sim_config 反映", f"sim_config.py に以下を反映保存しました:\n\nNUM_IN_PORTS = {NUM_IN_PORTS}\nNUM_OUT_PORTS = {NUM_OUT_PORTS}")

    def _build_tab_params(self, parent: ttk.Frame):
        p_grid = ttk.Frame(parent)
        p_grid.pack(fill=tk.X)

        self.param_vars: dict[str, tk.StringVar] = {}
        specs = [
            ("base_output", "base_output (0.0005~0.1)"),
            ("beta", "beta (15.0~30.0)"),
            ("k_refill", "k_refill (0.01~0.5)"),
            ("multiplier", "link_multiplier (奇数)"),
            ("bias", "link_bias (0~N³-1)"),
            ("learning_rate", "learning_rate (0~1)"),
            ("forget_rate", "forget_rate (0~1)"),
            ("learning_threshold", "learning_threshold (0~1)"),
            ("tag_decay", "tag_decay (0.5~0.999)"),
            ("step", "step (世代番号)"),
            ("score", "score (評価エネルギー)"),
        ]
        for i in range(NUM_IN_PORTS):
            lbl = "☀️光入力 (f,u,v)" if i == 0 else ("⚡蓄電入力 (f,u,v)" if i == 1 else f"📥In[{i}] (f,u,v)")
            specs.append((f"in_fi_{i}", lbl))
        for j in range(NUM_OUT_PORTS):
            lbl = "⚙️発電+出力 (f,u,v)" if j == 0 else ("⚙️発電-出力 (f,u,v)" if j == 1 else f"📤Out[{j}] (f,u,v)")
            specs.append((f"out_fi_{j}", lbl))

        for idx, (key, label) in enumerate(specs):
            r, col_base = divmod(idx, 2)
            ttk.Label(p_grid, text=label).grid(row=r, column=col_base * 2, sticky=tk.W, padx=3, pady=2)
            if key == "step":
                val = str(self.meta_step)
            elif key == "score":
                val = str(self.meta_score)
            elif key.startswith("in_fi_"):
                slot = int(key.split("_")[-1])
                in_p = self.sim_params.get("in_ports_fi")
                fi = in_p[slot] if in_p is not None and slot < len(in_p) else [0, 0, 0]
                val = f"{int(fi[0])},{int(fi[1])},{int(fi[2])}"
            elif key.startswith("out_fi_"):
                slot = int(key.split("_")[-1])
                out_p = self.sim_params.get("out_ports_fi")
                fi = out_p[slot] if out_p is not None and slot < len(out_p) else [0, 0, 0]
                val = f"{int(fi[0])},{int(fi[1])},{int(fi[2])}"
            elif key.endswith("_fi"):
                fi = self.sim_params[key]
                val = f"{int(fi[0])},{int(fi[1])},{int(fi[2])}"
            else:
                val = str(self.sim_params[key])
            var = tk.StringVar(value=val)
            self.param_vars[key] = var
            ent = ttk.Entry(p_grid, textvariable=var, width=10)
            ent.grid(row=r, column=col_base * 2 + 1, padx=3, pady=2)
            ent.bind("<Return>", lambda e: self._apply_global_params_from_ui())

        f_frame = ttk.LabelFrame(parent, text="連続有効度合い (0.00 = 無効 〜 1.00 = 最大)", padding=4)
        f_frame.pack(fill=tk.X, pady=3)
        self.flag_vars = {
            "enable_learning": tk.DoubleVar(value=float(self.enable_learning)),
            "enable_dopamine": tk.DoubleVar(value=float(self.enable_dopamine)),
            "enable_sleep": tk.DoubleVar(value=float(self.enable_sleep)),
        }
        self.flag_str_vars = {
            "enable_learning": tk.StringVar(value=f"{self.enable_learning:.2f}"),
            "enable_dopamine": tk.StringVar(value=f"{self.enable_dopamine:.2f}"),
            "enable_sleep": tk.StringVar(value=f"{self.enable_sleep:.2f}"),
        }
        for col_i, (f_key, f_lbl) in enumerate([
            ("enable_learning", "Learning [L]"),
            ("enable_dopamine", "Dopamine [D]"),
            ("enable_sleep", "Sleep [S]"),
        ]):
            sub = ttk.Frame(f_frame)
            sub.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=4)
            ttk.Label(sub, text=f"{f_lbl}:", font=("", 8, "bold")).pack(side=tk.LEFT)
            ent_f = ttk.Entry(sub, textvariable=self.flag_str_vars[f_key], width=5)
            ent_f.pack(side=tk.RIGHT, padx=2)
            ent_f.bind("<Return>", lambda e: self._apply_global_params_from_ui())
            scl_f = ttk.Scale(
                sub,
                from_=0.0,
                to=1.0,
                orient=tk.HORIZONTAL,
                variable=self.flag_vars[f_key],
                command=lambda val, k=f_key: self._on_flag_slider_move(k, float(val)),
            )
            scl_f.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=3)

        b_row = ttk.Frame(parent)
        b_row.pack(fill=tk.X, pady=3)
        ttk.Button(b_row, text="パラメータ反映", command=self._apply_global_params_from_ui).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)
        ttk.Button(b_row, text="標準パラメータにリセット", command=self.action_reset_default_params).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=4)
        batch_row = ttk.Frame(parent)
        batch_row.pack(fill=tk.X)
        ttk.Button(batch_row, text="sig 全クリア(0)", command=self.action_clear_sigs).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)
        ttk.Button(batch_row, text="sig ランダム化", command=self.action_randomize_sigs).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)
        ttk.Button(batch_row, text="全て興奮性(+1)", command=lambda: self.action_set_all_inhib(False)).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)
        ttk.Button(batch_row, text="全て抑制性(-1)", command=lambda: self.action_set_all_inhib(True)).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

    def _build_tab_ko_scan(self, parent: ttk.Frame):
        top_scan_row = ttk.Frame(parent)
        top_scan_row.pack(fill=tk.X, pady=2)

        ttk.Button(
            top_scan_row,
            text="🔬 全セル 単独KOスキャン",
            command=self.action_run_knockout_scan,
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

        ttk.Button(
            top_scan_row,
            text="✂️ 全シナプス 単独切断スキャン (sig不変)",
            command=self.action_run_synapse_knockout_scan,
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

        ttk.Button(
            top_scan_row,
            text="🚫/✂️ 選択行をKO/切断切替",
            command=self.action_toggle_scan_selected_item,
        ).pack(side=tk.LEFT, padx=2)

        self.lbl_scan_base = ttk.Label(
            parent,
            text="💡 行クリックでセル選択、ダブルクリックでセルKOまたはシナプス切断(sig不変)をON/OFFします。",
            foreground="royalblue",
        )
        self.lbl_scan_base.pack(anchor=tk.W, pady=2)

        tree_frame = ttk.Frame(parent)
        tree_frame.pack(fill=tk.BOTH, expand=True)

        cols = ("rank", "n_coord", "p_coord", "ko_e", "delta_e", "role")
        self.tree_scan = ttk.Treeview(tree_frame, columns=cols, show="headings", height=10, selectmode="browse")
        self.tree_scan.heading("rank", text="順位")
        self.tree_scan.heading("n_coord", text="内部座標 (x, y, z) [0..N-1]")
        self.tree_scan.heading("p_coord", text="外周込 P[z, y, x] [0..N+1]")
        self.tree_scan.heading("ko_e", text="KO後E")
        self.tree_scan.heading("delta_e", text="変化量(ΔE)")
        self.tree_scan.heading("role", text="役割 / 状態")

        self.tree_scan.column("rank", width=42, anchor=tk.CENTER)
        self.tree_scan.column("n_coord", width=150, anchor=tk.W)
        self.tree_scan.column("p_coord", width=140, anchor=tk.W)
        self.tree_scan.column("ko_e", width=65, anchor=tk.E)
        self.tree_scan.column("delta_e", width=80, anchor=tk.E)
        self.tree_scan.column("role", width=130, anchor=tk.W)

        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.tree_scan.yview)
        self.tree_scan.configure(yscrollcommand=vsb.set)
        self.tree_scan.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        vsb.pack(side=tk.RIGHT, fill=tk.Y)

        self.tree_scan.bind("<<TreeviewSelect>>", self._on_scan_tree_select)
        self.tree_scan.bind("<Double-1>", self._on_scan_tree_double_click)

    def _build_tab_launcher(self, parent: ttk.Frame):
        """sim_config.py の編集・保存、および voxelBrain.py / analyze.py の統合実行パネル"""
        split = ttk.Frame(parent)
        split.pack(fill=tk.BOTH, expand=True)

        # --- 左カラム: sim_config.py 設定 ＆ analyze.py 起動 ---
        left_col = ttk.Frame(split)
        left_col.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 6))

        grp_cfg = ttk.LabelFrame(left_col, text="🌍 環境・エネルギー設定 (sim_config.py)", padding=4)
        grp_cfg.pack(fill=tk.X, pady=(0, 4))

        self.cfg_flag_vars = {
            "ENABLE_LEARNING": tk.DoubleVar(value=float(ENABLE_LEARNING)),
            "ENABLE_DOPAMINE": tk.DoubleVar(value=float(ENABLE_DOPAMINE)),
            "ENABLE_SLEEP": tk.DoubleVar(value=float(ENABLE_SLEEP)),
        }
        self.cfg_flag_str_vars = {
            "ENABLE_LEARNING": tk.StringVar(value=f"{float(ENABLE_LEARNING):.2f}"),
            "ENABLE_DOPAMINE": tk.StringVar(value=f"{float(ENABLE_DOPAMINE):.2f}"),
            "ENABLE_SLEEP": tk.StringVar(value=f"{float(ENABLE_SLEEP):.2f}"),
        }
        for cfg_k, cfg_lbl in [
            ("ENABLE_LEARNING", "Learning (0~1)"),
            ("ENABLE_DOPAMINE", "Dopamine (0~1)"),
            ("ENABLE_SLEEP", "Sleep (0~1)"),
        ]:
            chk_r = ttk.Frame(grp_cfg)
            chk_r.pack(fill=tk.X, pady=1)
            ttk.Label(chk_r, text=f"{cfg_lbl}:", width=13, font=("", 8)).pack(side=tk.LEFT)
            ent_c = ttk.Entry(chk_r, textvariable=self.cfg_flag_str_vars[cfg_k], width=5)
            ent_c.pack(side=tk.RIGHT, padx=2)
            ent_c.bind("<Return>", lambda e: self.action_save_and_apply_sim_config())
            scl_c = ttk.Scale(
                chk_r,
                from_=0.0,
                to=1.0,
                orient=tk.HORIZONTAL,
                variable=self.cfg_flag_vars[cfg_k],
                command=lambda val, k=cfg_k: self._on_cfg_slider_move(k, float(val)),
            )
            scl_c.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=2)

        self.cfg_num_vars: dict[str, tk.StringVar] = {}
        cfg_specs = [
            ("NUM_IN_PORTS", "入力ポート数", NUM_IN_PORTS),
            ("NUM_OUT_PORTS", "出力ポート数", NUM_OUT_PORTS),
            ("INITIAL_ENERGY", "初期エネルギー", INITIAL_ENERGY),
            ("METABOLIC_COST", "基礎代謝/tick", METABOLIC_COST),
            ("GEN_COST_RATE", "発電コスト係数", GEN_COST_RATE),
            ("SOLAR_GAIN_RATE", "太陽光ゲイン係数", SOLAR_GAIN_RATE),
            ("SUN_CYCLE_PERIOD", "昼夜半周期(tick)", SUN_CYCLE_PERIOD),
            ("SPEED_GAIN", "速度ゲイン(前進/後退)", SPEED_GAIN),
            ("ROTATE_GAIN", "旋回速度ゲイン", ROTATE_GAIN),
        ]
        cfg_grid = ttk.Frame(grp_cfg)
        cfg_grid.pack(fill=tk.X, pady=2)
        for row_i, (k, lbl, default_v) in enumerate(cfg_specs):
            ttk.Label(cfg_grid, text=f"{lbl}:", font=("", 8)).grid(row=row_i, column=0, sticky=tk.W, pady=1)
            var = tk.StringVar(value=str(default_v))
            self.cfg_num_vars[k] = var
            ent = ttk.Entry(cfg_grid, textvariable=var, width=9)
            ent.grid(row=row_i, column=1, sticky=tk.E, padx=3, pady=1)
            ent.bind("<Return>", lambda e: self.action_save_and_apply_sim_config())

        ttk.Button(
            grp_cfg,
            text="💾 sim_config.py に保存 ＆ 即時反映",
            command=self.action_save_and_apply_sim_config,
        ).pack(fill=tk.X, pady=2)

        # analyze.py ランチャー
        grp_ana = ttk.LabelFrame(left_col, text="🎯 2D追跡タスク可視化 (analyze.py)", padding=4)
        grp_ana.pack(fill=tk.X, pady=2)

        ana_l_row = ttk.Frame(grp_ana)
        ana_l_row.pack(fill=tk.X, pady=1)
        ttk.Label(ana_l_row, text="生涯学習度(0~1):", font=("", 8)).pack(side=tk.LEFT)
        self.ana_learn_var = tk.DoubleVar(value=0.0)
        self.ana_learn_str_var = tk.StringVar(value="0.00")
        ent_al = ttk.Entry(ana_l_row, textvariable=self.ana_learn_str_var, width=5)
        ent_al.pack(side=tk.RIGHT, padx=2)
        scl_al = ttk.Scale(
            ana_l_row,
            from_=0.0,
            to=1.0,
            orient=tk.HORIZONTAL,
            variable=self.ana_learn_var,
            command=lambda val: self.ana_learn_str_var.set(f"{float(val):.2f}"),
        )
        scl_al.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=2)

        ana_p_row = ttk.Frame(grp_ana)
        ana_p_row.pack(fill=tk.X, pady=1)
        ttk.Label(ana_p_row, text="World:", font=("", 8)).pack(side=tk.LEFT)
        self.ana_world_var = tk.StringVar(value="100.0")
        ttk.Entry(ana_p_row, textvariable=self.ana_world_var, width=6).pack(side=tk.LEFT, padx=2)
        ttk.Label(ana_p_row, text="dt:", font=("", 8)).pack(side=tk.LEFT)
        self.ana_dt_var = tk.StringVar(value="0.01")
        ttk.Entry(ana_p_row, textvariable=self.ana_dt_var, width=6).pack(side=tk.LEFT, padx=2)

        ttk.Button(
            grp_ana,
            text="🚀 現在OneSimの個体で analyze.py 起動",
            command=self.action_launch_analyze_current,
        ).pack(fill=tk.X, pady=1)
        ttk.Button(
            grp_ana,
            text="📂 ファイル選択で analyze.py 起動",
            command=self.action_launch_analyze_dialog,
        ).pack(fill=tk.X, pady=1)

        # --- 右カラム: voxelBrain.py (GPU進化計算) ランチャー ＆ リアルタイムログ ---
        right_col = ttk.LabelFrame(split, text="🧬 GPU進化計算ランチャー (voxelBrain.py + Slang)", padding=4)
        right_col.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        vb_row1 = ttk.Frame(right_col)
        vb_row1.pack(fill=tk.X, pady=1)
        ttk.Label(vb_row1, text="DIM:").pack(side=tk.LEFT)
        self.vb_dim_var = tk.IntVar(value=2)
        for d_val, d_txt in [(1, "1(2³)"), (2, "2(4³)"), (3, "3(8³)")]:
            ttk.Radiobutton(vb_row1, text=d_txt, value=d_val, variable=self.vb_dim_var).pack(side=tk.LEFT, padx=1)

        ttk.Label(vb_row1, text="個体数m:").pack(side=tk.LEFT, padx=(6, 1))
        self.vb_m_var = tk.StringVar(value="32768")
        cb_m = ttk.Combobox(vb_row1, textvariable=self.vb_m_var, values=["4096", "8192", "16384", "32768", "65536"], width=6)
        cb_m.pack(side=tk.LEFT, padx=1)

        ttk.Label(vb_row1, text="Steps:").pack(side=tk.LEFT, padx=(6, 1))
        self.vb_steps_var = tk.StringVar(value="50000")
        ttk.Entry(vb_row1, textvariable=self.vb_steps_var, width=7).pack(side=tk.LEFT, padx=1)

        vb_row2 = ttk.Frame(right_col)
        vb_row2.pack(fill=tk.X, pady=2)
        self.vb_load_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(vb_row2, text="エリート継承:", variable=self.vb_load_var).pack(side=tk.LEFT)
        self.vb_folder_var = tk.StringVar(value="backups/elites")
        ttk.Entry(vb_row2, textvariable=self.vb_folder_var, width=18).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=2)
        ttk.Button(vb_row2, text="📁", width=3, command=self.action_browse_vb_folder).pack(side=tk.LEFT, padx=1)
        ttk.Button(vb_row2, text="現個体フォルダ", command=self.action_use_current_folder_for_vb).pack(side=tk.LEFT, padx=1)

        vb_btn_row1 = ttk.Frame(right_col)
        vb_btn_row1.pack(fill=tk.X, pady=2)
        self.btn_vb_start = ttk.Button(vb_btn_row1, text="▶️ voxelBrain.py 進化開始", command=self.action_start_voxelbrain)
        self.btn_vb_start.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        self.btn_vb_stop = ttk.Button(
            vb_btn_row1, text="⏹️ 安全停止(上位20体保存)", command=self.action_stop_voxelbrain_graceful, state=tk.DISABLED
        )
        self.btn_vb_stop.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        self.btn_vb_kill = ttk.Button(
            vb_btn_row1, text="🚨 強制終了", command=self.action_kill_voxelbrain, state=tk.DISABLED
        )
        self.btn_vb_kill.pack(side=tk.LEFT, padx=1)

        vb_btn_row2 = ttk.Frame(right_col)
        vb_btn_row2.pack(fill=tk.X, pady=1)
        ttk.Button(
            vb_btn_row2, text="📂 最新保存エリート(.npz)をOneSimに読込", command=self.action_load_latest_evolved_elite
        ).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=1)
        ttk.Button(
            vb_btn_row2, text="📈 進化ログ(.csv)推移グラフ", command=self.action_plot_latest_csv_log
        ).pack(side=tk.LEFT, padx=1)

        log_frame = ttk.Frame(right_col)
        log_frame.pack(fill=tk.BOTH, expand=True, pady=2)
        self.txt_vb_log = tk.Text(log_frame, height=6, width=42, font=("Consolas", 8), bg="#16161c", fg="#ddeeff")
        vb_log_sb = ttk.Scrollbar(log_frame, orient="vertical", command=self.txt_vb_log.yview)
        self.txt_vb_log.configure(yscrollcommand=vb_log_sb.set)
        self.txt_vb_log.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        vb_log_sb.pack(side=tk.RIGHT, fill=tk.Y)
        self.txt_vb_log.insert(tk.END, "[待機中] 『▶️ voxelBrain.py 進化開始』を押すとGPU進化計算がバックグラウンドで始まり、ここにログが出力されます。\n")

    # ==========================================================================
    # Matplotlib リアルタイム可視化 (oneSim 4画面構成 + 選択枠・KOマーカー同期)
    # ==========================================================================
    def _rebuild_matplotlib_figures(self):
        if hasattr(self, "mpl_canvas") and self.mpl_canvas is not None:
            idle_id = getattr(self.mpl_canvas, "_idle_draw_id", None)
            if idle_id:
                try:
                    self.mpl_canvas._tkcanvas.after_cancel(idle_id)
                except Exception:
                    pass
        if hasattr(self, "fig") and self.fig is not None:
            try:
                self.fig.clear()
            except Exception:
                pass

        for child in self.sim_frame.winfo_children():
            child.destroy()

        # 1. 上部リアルタイムHUDバー
        self.lbl_sim_hud = tk.Label(
            self.sim_frame,
            text="",
            font=("Consolas", 9, "bold"),
            bg="#181822",
            fg="#e8f2ff",
            anchor="w",
            justify=tk.LEFT,
            padx=8,
            pady=4,
            relief=tk.FLAT,
        )
        self.lbl_sim_hud.pack(side=tk.TOP, fill=tk.X)

        # 2. グラフ操作・表示モード切替バー (HUD文字列の長さに潰されない独立行配置)
        graph_ctrl_bar = tk.Frame(self.sim_frame, bg="#20222e", padx=8, pady=3)
        graph_ctrl_bar.pack(side=tk.TOP, fill=tk.X)

        tk.Label(
            graph_ctrl_bar,
            text="📊 右上グラフ表示切替 [ショートカット: P]:",
            bg="#20222e",
            fg="#b0bec5",
            font=("", 8, "bold"),
        ).pack(side=tk.LEFT, padx=(2, 8))

        self.btn_page_pos = tk.Button(
            graph_ctrl_bar,
            text="📍 Page 1: 個体位置・フィールドマップ (Position)",
            font=("", 8, "bold"),
            command=lambda: self.action_set_graph_page(1),
            relief=tk.RAISED,
            bd=1,
            padx=10,
            pady=2,
            cursor="hand2",
        )
        self.btn_page_pos.pack(side=tk.LEFT, padx=3)

        self.btn_page_signals = tk.Button(
            graph_ctrl_bar,
            text="🧪 Page 2: ドーパミン・睡眠波形 (Neuromodulators)",
            font=("", 8, "bold"),
            command=lambda: self.action_set_graph_page(2),
            relief=tk.RAISED,
            bd=1,
            padx=10,
            pady=2,
            cursor="hand2",
        )
        self.btn_page_signals.pack(side=tk.LEFT, padx=3)

        self.fig = Figure(figsize=(9.5, 7.2), dpi=100)
        gs_main = self.fig.add_gridspec(2, 2, width_ratios=[1.2, 1.15], height_ratios=[1, 1.2])

        # 左上: 太陽光 vs 発電出力
        self.ax_solar = self.fig.add_subplot(gs_main[0, 0])
        self.ax_solar.set_title(
            "Sunlight vs Generator Power  (左パネルのスライスをクリックでもセル選択/右クリックKO可)",
            fontsize=8.5,
        )
        self.ax_solar.set_ylim(-0.05, 1.25)
        self.ax_solar.set_xlim(0, HISTORY_LEN)
        self.ax_solar.grid(True, linestyle="--", alpha=0.4)
        self.line_sun, = self.ax_solar.plot([], [], color="gold", linewidth=2.0, label="Sunlight (昼夜)")
        self.line_gen, = self.ax_solar.plot([], [], color="crimson", linewidth=1.6, label="|Generator Power|")
        breakeven = GEN_COST_RATE / SOLAR_GAIN_RATE if SOLAR_GAIN_RATE > 0 else 0.5
        self.hline_breakeven = self.ax_solar.axhline(
            breakeven, color="gray", linestyle=":", alpha=0.7, label=f"黒字太陽光ライン ({breakeven:.2f})"
        )
        self.ax_solar.legend(loc="upper right", fontsize=7.5)

        # 左下: エネルギー残量
        self.ax_energy = self.fig.add_subplot(gs_main[1, 0])
        self.ax_energy.set_title("Energy Level (0.0 = 餓死 / 0.2 = 初期値 / 1.0 = 満タン)", fontsize=8.5)
        self.ax_energy.set_ylim(-0.02, 1.05)
        self.ax_energy.set_xlim(0, HISTORY_LEN)
        self.ax_energy.grid(True, linestyle="--", alpha=0.4)
        self.line_energy, = self.ax_energy.plot([], [], color="limegreen", linewidth=2.2, label="Energy (my_energy_s)")
        self.hline_init_energy = self.ax_energy.axhline(
            INITIAL_ENERGY, color="royalblue", linestyle="--", alpha=0.6, label=f"Initial ({INITIAL_ENERGY:.2f})"
        )
        self.ax_energy.legend(loc="lower left", fontsize=7.5)

        self.info_text = self.ax_energy.text(
            0.02, 0.95, "", transform=self.ax_energy.transAxes, fontsize=8.0,
            verticalalignment="top", bbox=dict(boxstyle="round", facecolor="white", alpha=0.88),
        )

        # 右上 (Page 1): 個体位置 ＆ 目標オブジェクト フィールドマップ (2D空間)
        self.ax_pos = self.fig.add_subplot(gs_main[0, 1])
        self.ax_pos.set_title("Agent Field & Target (Pos & Heading) [P1]", fontsize=8.5)
        self.ax_pos.set_xlim(-2.25, 2.25)
        self.ax_pos.set_ylim(-2.25, 2.25)
        self.ax_pos.set_aspect("equal")
        self.ax_pos.grid(True, linestyle="--", alpha=0.35)

        # フィールド移動制限枠 [-2.0, 2.0]
        field_rect = Rectangle((-2.0, -2.0), 4.0, 4.0, fill=False, edgecolor="#78909c", linestyle="--", linewidth=1.2, alpha=0.7)
        self.ax_pos.add_patch(field_rect)
        self.ax_pos.axhline(0, color="#546e7a", linestyle=":", alpha=0.35, linewidth=0.8)
        self.ax_pos.axvline(0, color="#546e7a", linestyle=":", alpha=0.35, linewidth=0.8)

        # ターゲットオブジェクト (★) & 接近ボーナス目安円
        target_init = getattr(self.brain, "obj_pos", np.array([0.0, 1.0], dtype=np.float32))
        self.target_scatter = self.ax_pos.scatter(
            [target_init[0]], [target_init[1]],
            color="#ffd700", s=130, marker="*", edgecolor="#e65100", linewidth=1.5, zorder=6, label="Target (my_obj)"
        )
        self.target_bonus_circle = Circle(
            (float(target_init[0]), float(target_init[1])), 1.0,
            fill=True, facecolor="#ffd700", alpha=0.08, edgecolor="#ffb300", linestyle=":", linewidth=1.0, zorder=3
        )
        self.ax_pos.add_patch(self.target_bonus_circle)

        # 移動軌跡 (直近の履歴)
        self.line_traj, = self.ax_pos.plot([], [], color="#00e5ff", linewidth=1.8, alpha=0.75, label="Trajectory", zorder=4)

        # 個体現在位置 (●) ＆ 向きベクトル線
        self.agent_scatter = self.ax_pos.scatter(
            [0.0], [0.0],
            color="#ff1744", s=100, marker="o", edgecolor="white", linewidth=1.5, zorder=7, label="Agent (my_pos)"
        )
        self.line_agent_dir, = self.ax_pos.plot([], [], color="#ff5252", linewidth=2.8, zorder=8)

        self.txt_pos_hud = self.ax_pos.text(
            0.03, 0.04, "", transform=self.ax_pos.transAxes, fontsize=7.5,
            verticalalignment="bottom", bbox=dict(boxstyle="round,pad=0.25", facecolor="#10121a", edgecolor="#555", alpha=0.85)
        )
        self.ax_pos.legend(loc="upper right", fontsize=7.2, framealpha=0.75)

        # 右上 (Page 2): ドーパミン・スリープ波形
        self.ax_signals = self.fig.add_subplot(gs_main[0, 1])
        self.line_dopamine, = self.ax_signals.plot([], [], label="Dopamine Sum", color="darkorange", linewidth=2)
        self.line_sleep, = self.ax_signals.plot([], [], label="Sleep Sum", color="purple", linewidth=1.5)
        self.ax_signals.set_xlim(0, HISTORY_LEN)
        self.ax_signals.set_ylim(0, 1.5)
        self.ax_signals.legend(loc="upper right", fontsize=8)
        self.ax_signals.grid(True, alpha=0.3)

        # ページ初期表示の反映
        self.ax_pos.set_visible(self.graph_page == 1)
        self.ax_signals.set_visible(self.graph_page == 2)
        self._update_graph_page_button_styles()

        # 右下: 脳の全Zスライス表示 (内部 z=0 .. N-1, 外周込 P_z=1 .. N)
        N = self.N
        cols = min(N, 4)
        rows = (N + cols - 1) // cols
        gs_slices = gs_main[1, 1].subgridspec(rows, cols, wspace=0.28, hspace=0.36)

        self.slice_ims = []
        self.slice_axes = {}
        self.slice_axes_list = []
        self.slice_sel_rects = []
        self.slice_ko_scatters = []

        for iz in range(N):
            r, c = divmod(iz, cols)
            ax_s = self.fig.add_subplot(gs_slices[r, c])
            ax_s.set_title(f"内部 z={iz} (P_z={iz+1})", fontsize=8.5)
            im = ax_s.imshow(np.zeros((N, N)), cmap="coolwarm", vmin=-0.3, vmax=0.3, origin="lower")
            ax_s.set_xticks(range(N))
            ax_s.set_yticks(range(N))
            ax_s.set_xlabel("x (0..N-1)", fontsize=7, labelpad=1)
            if c == 0:
                ax_s.set_ylabel("y (0..N-1)", fontsize=7, labelpad=1)
            ax_s.tick_params(labelsize=7)

            # 選択中セルを示す黄色枠パッチ
            sel_rect = Rectangle((-0.5, -0.5), 1.0, 1.0, fill=False, edgecolor="#ffff00", linewidth=2.2, visible=False)
            ax_s.add_patch(sel_rect)
            self.slice_sel_rects.append(sel_rect)

            # ノックアウト中セルを示す赤×マーカー
            ko_scat = ax_s.scatter([], [], marker="x", color="red", s=60, linewidths=2.0, zorder=5)
            self.slice_ko_scatters.append(ko_scat)

            self.slice_ims.append(im)
            self.slice_axes[ax_s] = iz
            self.slice_axes_list.append(ax_s)

        self.fig.tight_layout()

        self._mpl_bg = None
        self._cur_xmin = 0
        self._cur_xmax = HISTORY_LEN
        self._cur_sig_ymax = 1.5
        self._cur_flags_str = ""

        self.mpl_canvas = FigureCanvasTkAgg(self.fig, master=self.sim_frame)
        tk_w = self.mpl_canvas.get_tk_widget()
        tk_w.pack(fill=tk.BOTH, expand=True)
        tk_w.bind("<Configure>", self._on_mpl_canvas_configure)
        self.mpl_canvas.mpl_connect("button_press_event", self._on_mpl_slice_click)

    def _update_graph_page_button_styles(self):
        """右上グラフ切替ボタンの見た目（アクティブ状態）を更新"""
        if not hasattr(self, "btn_page_pos") or not hasattr(self, "btn_page_signals"):
            return
        if self.graph_page == 1:
            self.btn_page_pos.config(
                bg="#00b0ff", fg="#000000", activebackground="#40c4ff",
                relief=tk.SUNKEN, font=("", 8, "bold")
            )
            self.btn_page_signals.config(
                bg="#2e3240", fg="#90a4ae", activebackground="#3d4254",
                relief=tk.RAISED, font=("", 8)
            )
        else:
            self.btn_page_pos.config(
                bg="#2e3240", fg="#90a4ae", activebackground="#3d4254",
                relief=tk.RAISED, font=("", 8)
            )
            self.btn_page_signals.config(
                bg="#d500f9", fg="#ffffff", activebackground="#e040fb",
                relief=tk.SUNKEN, font=("", 8, "bold")
            )

    def action_set_graph_page(self, page: int):
        """右上グラフの表示ページを指定 (1: 個体位置マップ / 2: ドパミン波形)"""
        self.graph_page = int(page)
        if hasattr(self, "ax_pos") and hasattr(self, "ax_signals"):
            self.ax_pos.set_visible(self.graph_page == 1)
            self.ax_signals.set_visible(self.graph_page == 2)
            self._mpl_bg = None
            self._update_graph_page_button_styles()
            self._render_matplotlib_state(force_full=True)
            if hasattr(self, "mpl_canvas"):
                self.mpl_canvas.draw_idle()

    def action_toggle_graph_page(self):
        """P キーまたはボタンで右上グラフのページをトグル切り替え"""
        new_page = 2 if getattr(self, "graph_page", 1) == 1 else 1
        self.action_set_graph_page(new_page)

    def _on_mpl_canvas_configure(self, event):
        new_size = (event.width, event.height)
        if new_size != self._last_canvas_size and event.width > 50 and event.height > 50:
            self._last_canvas_size = new_size
            self._mpl_bg = None

    def _cache_mpl_backgrounds(self):
        """静的背景（軸・目盛り・グリッド・凡例）を1回だけ描画してキャッシュし、毎フレームのBlit描画を40倍高速化する"""
        if not hasattr(self, "mpl_canvas"):
            return
        dyn_artists = [
            self.line_sun,
            self.line_gen,
            self.line_energy,
            self.info_text,
        ]
        if hasattr(self, "ax_pos") and self.ax_pos.get_visible():
            dyn_artists.extend([
                self.target_scatter,
                self.line_traj,
                self.agent_scatter,
                self.line_agent_dir,
                self.txt_pos_hud,
            ])
        if hasattr(self, "ax_signals") and self.ax_signals.get_visible():
            dyn_artists.extend([
                self.line_dopamine,
                self.line_sleep,
            ])
        for a in dyn_artists:
            a.set_visible(False)
        self.mpl_canvas.draw()
        self._mpl_bg = self.mpl_canvas.copy_from_bbox(self.fig.bbox)
        for a in dyn_artists:
            a.set_visible(True)

    def _on_mpl_slice_click(self, event):
        """Matplotlib の Zスライスヒートマップ上でのクリックでもセル選択・右クリックKO/結合切断を可能にする"""
        self.root.focus_set()
        if event.inaxes not in self.slice_axes or event.xdata is None or event.ydata is None:
            return
        iz = self.slice_axes[event.inaxes]
        ix = int(round(event.xdata))
        iy = int(round(event.ydata))
        if 0 <= ix < self.N and 0 <= iy < self.N:
            target = (iz + 1, iy + 1, ix + 1)
            if event.key == "shift" and event.button == 1:
                self._toggle_synapse_with_selected_cell(target)
                self._refresh_all_views()
                return
            if event.button == 3:
                if self.right_click_mode_var.get() == "cut_synapse":
                    self._toggle_synapse_with_selected_cell(target)
                    self._refresh_all_views()
                    return
                self.sel_z, self.sel_y, self.sel_x = target
                self._perform_right_click_action(*target)
            else:
                self.sel_z, self.sel_y, self.sel_x = target
            self._refresh_all_views()

    def _render_matplotlib_state(self, force_full: bool = False):
        steps = self.brain.step_history
        if not steps:
            # 起動直後やリセット直後（step_historyが空）でも、背景や初期オブジェクトを確実に描画
            if force_full or (self._mpl_bg is None):
                self._cache_mpl_backgrounds()
            if hasattr(self, "mpl_canvas"):
                self.mpl_canvas.draw_idle()
            return

        # X軸の範囲更新を毎ステップではなく50ステップ単位のスライドにして軸目盛り再計算コストを激減させる
        if steps[-1] <= HISTORY_LEN:
            target_xmin, target_xmax = 0, HISTORY_LEN
        elif steps[-1] > self._cur_xmax or steps[0] < self._cur_xmin or (self._cur_xmax - steps[-1]) > HISTORY_LEN:
            target_xmax = ((steps[-1] // 50) + 1) * 50
            target_xmin = max(0, target_xmax - HISTORY_LEN)
        else:
            target_xmin, target_xmax = self._cur_xmin, self._cur_xmax

        need_bg_rebuild = force_full or (self._mpl_bg is None)

        if target_xmin != self._cur_xmin or target_xmax != self._cur_xmax:
            self._cur_xmin, self._cur_xmax = target_xmin, target_xmax
            self.ax_solar.set_xlim(target_xmin, target_xmax)
            self.ax_energy.set_xlim(target_xmin, target_xmax)
            self.ax_signals.set_xlim(target_xmin, target_xmax)
            need_bg_rebuild = True

        self.line_sun.set_data(steps, self.brain.sun_history)
        self.line_gen.set_data(steps, self.brain.gen_history)
        self.line_energy.set_data(steps, self.brain.energy_history)

        internal_outputs = self.brain.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].astype(np.float32)
        flags_str = (
            f"Learn:{self.enable_learning:.2f} | "
            f"Dop:{self.enable_dopamine:.2f} | "
            f"Sleep:{self.enable_sleep:.2f}"
        )
        state_str = "PAUSED" if self.paused else f"RUNNING ({self.steps_per_frame} step/f)"
        if self.is_recording_gif:
            state_str = f"[REC {len(self.gif_frames)}f] {state_str}"
        day_night = "[昼/Day]" if self.brain.current_sunlight > 0.01 else "[夜/Night]"
        ko_count = int(np.count_nonzero(self.brain.knockout_np2))
        syn_cut_count = int(np.count_nonzero(self.brain.synapse_ko_mask))
        fname = os.path.basename(self.current_file_path) if self.current_file_path else "新規未保存"
        mean_out = float(np.mean(np.abs(internal_outputs)))
        mean_r = float(np.mean(self.brain.R))

        dist_to_obj = float(np.linalg.norm(self.brain.pos - self.brain.obj_pos))
        hud_line1 = (
            f"File: {fname} ({self.N}³) | KO:{ko_count} SynCut:{syn_cut_count} | {state_str} | {flags_str}"
        )
        hud_line2 = (
            f"Step:{self.brain.inner_step_counter:5d} {day_night}(Sun:{self.brain.current_sunlight:.2f}) | "
            f"Energy:{self.brain.energy:.4f}({self.brain.energy - INITIAL_ENERGY:+.4f}) Gen:{self.brain.generator_power:.3f} (GainCoeff:{self.brain.energy_coeff:.2f}x) | "
            f"Mean|Out|:{mean_out:.3f} R:{mean_r:.3f} Flick:{self.brain.flicker_rate:.1%}"
        )
        hud_line3 = (
            f"🚀Spd:{self.brain.speed * SPEED_GAIN:+.3f}(out:{self.brain.speed:+.2f}) 🔄Rot:{self.brain.rotate * ROTATE_GAIN:+.3f}(out:{self.brain.rotate:+.2f}) | "
            f"Pos:({self.brain.pos[0]:+.2f}, {self.brain.pos[1]:+.2f}) Ang:{math.degrees(self.brain.angle) % 360:5.1f}° | "
            f"Target:({self.brain.obj_pos[0]:+.2f}, {self.brain.obj_pos[1]:+.2f}) Dist:{dist_to_obj:.2f}"
        )
        if hasattr(self, "lbl_sim_hud"):
            self.lbl_sim_hud.config(text=f"{hud_line1}\n{hud_line2}\n{hud_line3}")

        if self.paused or self.is_recording_gif or force_full:
            self.info_text.set_text(
                f"File: {fname} ({self.N}x{self.N}x{self.N}) | KO: {ko_count} | SynCut: {syn_cut_count}\n"
                f"Status: {state_str} | {flags_str}\n"
                f"Step: {self.brain.inner_step_counter:4d} | {day_night} (Sun: {self.brain.current_sunlight:.2f})\n"
                f"Energy: {self.brain.energy:.4f} ({self.brain.energy - INITIAL_ENERGY:+.4f}) | Gen: {self.brain.generator_power:.3f} (Coeff: {self.brain.energy_coeff:.2f}x)\n"
                f"Speed: {self.brain.speed * SPEED_GAIN:+.3f} (raw:{self.brain.speed:+.2f}) | Rotate: {self.brain.rotate * ROTATE_GAIN:+.3f} (raw:{self.brain.rotate:+.2f}) | Dist: {dist_to_obj:.2f}\n"
                f"Mean |Output|: {mean_out:.4f} | Flicker: {self.brain.flicker_rate:.1%} | R: {mean_r:.3f}"
            )

        # 右上グラフの更新 (Page 1: 個体位置マップ / Page 2: ドーパミン・スリープ波形)
        if self.graph_page == 1 and hasattr(self, "ax_pos"):
            obj_pos = self.brain.obj_pos
            self.target_scatter.set_offsets([obj_pos])
            if hasattr(self, "target_bonus_circle"):
                self.target_bonus_circle.center = (float(obj_pos[0]), float(obj_pos[1]))

            # 軌跡更新
            if hasattr(self.brain, "pos_history") and self.brain.pos_history:
                traj_pts = np.asarray(self.brain.pos_history, dtype=np.float32)
                self.line_traj.set_data(traj_pts[:, 0], traj_pts[:, 1])
            else:
                self.line_traj.set_data([self.brain.pos[0]], [self.brain.pos[1]])

            # エージェント現在位置 & 向きベクトル (0.35長)
            self.agent_scatter.set_offsets([self.brain.pos])
            dir_len = 0.35
            hx = float(self.brain.pos[0] + np.cos(self.brain.angle) * dir_len)
            hy = float(self.brain.pos[1] + np.sin(self.brain.angle) * dir_len)
            self.line_agent_dir.set_data([self.brain.pos[0], hx], [self.brain.pos[1], hy])

            # グラフ内 HUD 表示
            self.txt_pos_hud.set_text(
                f"Agent: ({self.brain.pos[0]:+.2f}, {self.brain.pos[1]:+.2f}) Ang:{math.degrees(self.brain.angle) % 360:3.0f}°\n"
                f"Target: ({obj_pos[0]:+.2f}, {obj_pos[1]:+.2f}) Dist:{dist_to_obj:.2f}\n"
                f"GainCoeff: {self.brain.energy_coeff:.2f}x | Spd: {self.brain.speed * SPEED_GAIN:+.3f} (raw:{self.brain.speed:+.2f})"
            )
        elif self.graph_page == 2 and hasattr(self, "ax_signals"):
            if flags_str != self._cur_flags_str:
                self._cur_flags_str = flags_str
                self.ax_signals.set_title(f"Neuromodulators [{flags_str}] [P2]", fontsize=9.5)
                need_bg_rebuild = True

            self.line_dopamine.set_data(steps, self.brain.dopamine_history)
            self.line_sleep.set_data(steps, self.brain.sleep_history)
            max_mod = max(max(self.brain.dopamine_history), max(self.brain.sleep_history), 0.5)
            target_sig_ymax = float(np.ceil(max_mod * 1.15 * 4.0) / 4.0)
            if abs(target_sig_ymax - self._cur_sig_ymax) > 0.05:
                self._cur_sig_ymax = target_sig_ymax
                self.ax_signals.set_ylim(0, target_sig_ymax)
                need_bg_rebuild = True

        v_limit = max(float(np.max(np.abs(internal_outputs))), 0.05)
        is_sel_internal = (1 <= self.sel_z <= self.N) and (1 <= self.sel_y <= self.N) and (1 <= self.sel_x <= self.N)

        for iz in range(self.N):
            self.slice_ims[iz].set_clim(-v_limit, v_limit)
            self.slice_ims[iz].set_data(internal_outputs[iz])

            # 選択中セルの黄色枠同期
            if is_sel_internal and (self.sel_z - 1) == iz:
                self.slice_sel_rects[iz].set_xy((self.sel_x - 1 - 0.5, self.sel_y - 1 - 0.5))
                self.slice_sel_rects[iz].set_visible(True)
            else:
                self.slice_sel_rects[iz].set_visible(False)

            # KOマーカー同期
            ko_slice = self.brain.knockout_np2[iz + 1, 1:self.N+1, 1:self.N+1]
            ko_ys, ko_xs = np.where(ko_slice)
            if len(ko_xs) > 0:
                self.slice_ko_scatters[iz].set_offsets(np.column_stack([ko_xs, ko_ys]))
            else:
                self.slice_ko_scatters[iz].set_offsets(np.empty((0, 2)))

        tk_w = self.mpl_canvas.get_tk_widget()
        if tk_w.winfo_width() < 50 or tk_w.winfo_height() < 50:
            self.mpl_canvas.draw_idle()
        else:
            try:
                if need_bg_rebuild:
                    self._cache_mpl_backgrounds()
                self.mpl_canvas.restore_region(self._mpl_bg)
                self.ax_solar.draw_artist(self.line_sun)
                self.ax_solar.draw_artist(self.line_gen)
                self.ax_energy.draw_artist(self.line_energy)
                if self.paused or self.is_recording_gif or force_full:
                    self.ax_energy.draw_artist(self.info_text)
                if self.graph_page == 1 and hasattr(self, "ax_pos"):
                    self.ax_pos.draw_artist(self.target_scatter)
                    self.ax_pos.draw_artist(self.line_traj)
                    self.ax_pos.draw_artist(self.agent_scatter)
                    self.ax_pos.draw_artist(self.line_agent_dir)
                    self.ax_pos.draw_artist(self.txt_pos_hud)
                elif self.graph_page == 2 and hasattr(self, "ax_signals"):
                    self.ax_signals.draw_artist(self.line_dopamine)
                    self.ax_signals.draw_artist(self.line_sleep)
                for iz, ax_s in enumerate(self.slice_axes_list):
                    ax_s.draw_artist(self.slice_ims[iz])
                    if self.slice_sel_rects[iz].get_visible():
                        ax_s.draw_artist(self.slice_sel_rects[iz])
                    ax_s.draw_artist(self.slice_ko_scatters[iz])
                self.mpl_canvas.blit(self.fig.bbox)
            except Exception:
                self.mpl_canvas.draw_idle()

        if self.view_mode_var.get() == "live_out":
            self._update_grid_live_colors_only()

    def _capture_gif_frame(self):
        """現在描画されている Matplotlib 4画面グラフを1フレームとしてキャプチャしバッファに追加する"""
        if not hasattr(self, "mpl_canvas"):
            return
        rgba = np.asarray(self.mpl_canvas.buffer_rgba())
        frame_img = Image.fromarray(rgba[:, :, :3].copy())
        self.gif_frames.append(frame_img)
        self.lbl_rec_status.config(text=f"🔴 REC ({len(self.gif_frames)}f)")

    def _tick_loop(self):
        if self._in_tick:
            self._tick_job_id = self.root.after(40, self._tick_loop)
            return
        self._in_tick = True
        t0 = time.perf_counter()
        try:
            self._poll_vb_log_queue()
            if not self.paused:
                self.brain.step(
                    inner_steps=self.steps_per_frame,
                    enable_learning=self.enable_learning,
                    enable_dopamine=self.enable_dopamine,
                    enable_sleep=self.enable_sleep,
                )
                self._render_matplotlib_state()
                try:
                    cur_tab = self.notebook.tab(self.notebook.select(), "text")
                    if "配線盤" in cur_tab:
                        self._draw_inout_wiring()
                        self._update_io_inspector_ui()
                except Exception:
                    pass
                if self.is_recording_gif:
                    self._capture_gif_frame()
        finally:
            self._in_tick = False
            elapsed_ms = int((time.perf_counter() - t0) * 1000)
            # 必ず最低25ms以上の空き時間を確保し、ボタンクリック・スライダー等のGUIイベント枯渇を防ぐ
            next_delay = max(25, 45 - elapsed_ms)
            self._tick_job_id = self.root.after(next_delay, self._tick_loop)

    # ==========================================================================
    # エディタ・ノッキング画面の更新処理
    # ==========================================================================
    def _refresh_all_views(self):
        self._updating_ui_vars = True
        try:
            for key, var in self.param_vars.items():
                if key == "step":
                    var.set(str(self.meta_step))
                elif key == "score":
                    var.set(f"{self.meta_score:.4f}")
                elif key in ("multiplier", "bias"):
                    var.set(str(int(self.sim_params[key])))
                elif key.startswith("in_fi_"):
                    slot = int(key.split("_")[-1])
                    in_p = self.sim_params.get("in_ports_fi")
                    fi = in_p[slot] if in_p is not None and slot < len(in_p) else [0, 0, 0]
                    var.set(f"{int(fi[0])},{int(fi[1])},{int(fi[2])}")
                elif key.startswith("out_fi_"):
                    slot = int(key.split("_")[-1])
                    out_p = self.sim_params.get("out_ports_fi")
                    fi = out_p[slot] if out_p is not None and slot < len(out_p) else [0, 0, 0]
                    var.set(f"{int(fi[0])},{int(fi[1])},{int(fi[2])}")
                elif key.endswith("_fi"):
                    fi = self.sim_params[key]
                    var.set(f"{int(fi[0])},{int(fi[1])},{int(fi[2])}")
                else:
                    var.set(f"{float(self.sim_params[key]):.5g}")

            self.flag_vars["enable_learning"].set(float(self.enable_learning))
            self.flag_vars["enable_dopamine"].set(float(self.enable_dopamine))
            self.flag_vars["enable_sleep"].set(float(self.enable_sleep))
            self.flag_str_vars["enable_learning"].set(f"{float(self.enable_learning):.2f}")
            self.flag_str_vars["enable_dopamine"].set(f"{float(self.enable_dopamine):.2f}")
            self.flag_str_vars["enable_sleep"].set(f"{float(self.enable_sleep):.2f}")
        finally:
            self._updating_ui_vars = False

        ko_total = int(np.count_nonzero(self.brain.knockout_np2))
        syn_cut_total = int(np.count_nonzero(self.brain.synapse_ko_mask))
        ko_coords = []
        for z, y, x in zip(*np.where(self.brain.knockout_np2)):
            n_s, _ = format_coord_label(int(z), int(y), int(x), self.N)
            ko_coords.append(f"{n_s}")
        ko_preview = f" [{', '.join(ko_coords[:2])}{'...' if len(ko_coords) > 2 else ''}]" if ko_total > 0 else ""
        self.lbl_ko_summary.config(
            text=f"🚫 セルKO: {ko_total} セル{ko_preview}  ｜  ✂️ 結合切断(sig不変): {syn_cut_total} 本  (グリッド凡例: 緑枠=入力Pre / 橙枠=出力Post / 桃枠=切断中)",
            foreground="crimson" if (ko_total > 0 or syn_cut_total > 0) else "dimgray",
        )

        if self.current_file_path:
            self.lbl_status.config(
                text=f"編集中: {os.path.basename(self.current_file_path)} (DIM={self.dim}, N={self.N})",
                foreground="darkgreen",
            )
        else:
            self.lbl_status.config(
                text=f"[未保存の新規遺伝子] (DIM={self.dim}, N={self.N})",
                foreground="royalblue",
            )

        self._refresh_cell_inspector()
        self._redraw_grid_canvas()
        self._render_matplotlib_state()

    def _refresh_cell_inspector(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        is_internal = (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N)
        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        role_str = special_map.get((z, y, x), "")
        n_str, p_str = format_coord_label(z, y, x, self.N)

        self.lbl_cell_coord.config(text=f"選択中: {n_str}  |  {p_str}")
        self.lbl_cell_role.config(text=role_str if role_str else ("内部ニューロン" if is_internal else "外周膜セル"))
        if hasattr(self, "lbl_map_sel_info"):
            r_label = role_str if role_str else ("内部ニューロン" if is_internal else "外周膜セル")
            self.lbl_map_sel_info.config(text=f"📍 選択中: {n_str} ({p_str}) ｜ {r_label}")
        self.cell_ko_var.set(bool(self.brain.knockout_np2[z, y, x]))

        for c in range(4):
            self.sig_pre_vars[c].set(f"{float(self.sig_pre[z, y, x, c]):.4f}")
            self.sig_post_vars[c].set(f"{float(self.sig_post[z, y, x, c]):.4f}")

        if is_internal:
            iz, iy, ix = z - 1, y - 1, x - 1
            self.chk_inhib.config(state=tk.NORMAL)
            self.cell_inhib_var.set(bool(self.inhib_bits[iz, iy, ix]))
            self.cell_dop_var.set(f"{float(self.dopamine[iz, iy, ix]):.4f}")
            self.cell_slp_var.set(f"{float(self.sleep[iz, iy, ix]):.4f}")
        else:
            self.chk_inhib.config(state=tk.DISABLED)
            self.cell_inhib_var.set(False)
            self.cell_dop_var.set("-")
            self.cell_slp_var.set("-")

        # シナプス結合一覧 Treeview の更新
        for item in self.tree_synapses.get_children():
            self.tree_synapses.delete(item)
        self._syn_tree_items.clear()

        init_weights = self.brain.initial_weights
        syn_ko = self.brain.synapse_ko_mask
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x

        if is_internal:
            iz, iy, ix = z - 1, y - 1, x - 1
            flat_idx = self._coord_n_to_idx(iz, iy, ix)
            for k in range(28):
                w0 = float(init_weights[flat_idx, k])
                is_cut = bool(syn_ko[flat_idx, k])
                if w0 > 0.01 or is_cut:
                    tz, ty, tx = int(conn_z[flat_idx, k]), int(conn_y[flat_idx, k]), int(conn_x[flat_idx, k])
                    is_pre_valid = ((1 <= tz <= self.N) and (1 <= ty <= self.N) and (1 <= tx <= self.N)) or ((tz, ty, tx) in special_map)
                    if not is_pre_valid and not is_cut:
                        continue
                    tn_s, _ = format_coord_label(tz, ty, tx, self.N)
                    w_txt = f"✂️0.00 (元{w0:.2f})" if is_cut else f"{w0:.3f}"
                    tags_info = []
                    if is_cut:
                        tags_info.append("[切断中]")
                    if k == 27:
                        tags_info.append("[28th遠隔]")
                    if self.brain.knockout_np2[tz, ty, tx]:
                        tags_info.append("[相手KO]")
                    sp = special_map.get((tz, ty, tx), "")
                    if sp:
                        tags_info.append(sp)
                    item_id = self.tree_synapses.insert(
                        "",
                        tk.END,
                        values=("📥 入力(Pre➔此)", tn_s, w_txt, " ".join(tags_info) if tags_info else "通常結合"),
                    )
                    self._syn_tree_items[item_id] = (flat_idx, k, (tz, ty, tx))

        if is_internal or (z, y, x) in special_map:
            for post_idx in range(self.TOTAL_N):
                pz = ((post_idx >> (self.dim * 2)) & (self.N - 1)) + 1
                py = ((post_idx >> self.dim) & (self.N - 1)) + 1
                px = ((post_idx >> 0) & (self.N - 1)) + 1
                for k in range(28):
                    if int(conn_z[post_idx, k]) == z and int(conn_y[post_idx, k]) == y and int(conn_x[post_idx, k]) == x:
                        w0 = float(init_weights[post_idx, k])
                        is_cut = bool(syn_ko[post_idx, k])
                        if w0 > 0.01 or is_cut:
                            pn_s, _ = format_coord_label(pz, py, px, self.N)
                            w_txt = f"✂️0.00 (元{w0:.2f})" if is_cut else f"{w0:.3f}"
                            tags_info = []
                            if is_cut:
                                tags_info.append("[切断中]")
                            if k == 27:
                                tags_info.append("[28th遠隔]")
                            if self.brain.knockout_np2[pz, py, px]:
                                tags_info.append("[相手KO]")
                            sp = special_map.get((pz, py, px), "")
                            if sp:
                                tags_info.append(sp)
                            item_id = self.tree_synapses.insert(
                                "",
                                tk.END,
                                values=("📤 出力(此➔Post)", pn_s, w_txt, " ".join(tags_info) if tags_info else "通常結合"),
                            )
                            self._syn_tree_items[item_id] = (post_idx, k, (pz, py, px))

        # I/O 配線盤の同期描画
        self._draw_inout_wiring()
        self._update_io_inspector_ui()

    def _get_selected_cell_partner_map(self) -> dict[tuple[int, int, int], str]:
        """現在選択中セルとシナプス結合を持つ相手セル座標 -> 状態 ('cut' | 'in' | 'out' | 'both') の辞書を返す"""
        partner_map: dict[tuple[int, int, int], str] = {}
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        init_weights = self.brain.initial_weights
        syn_ko = self.brain.synapse_ko_mask
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x
        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        is_sel_internal = (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N)

        if is_sel_internal:
            flat_idx = self._coord_n_to_idx(z - 1, y - 1, x - 1)
            for k in range(28):
                w0 = float(init_weights[flat_idx, k])
                is_cut = bool(syn_ko[flat_idx, k])
                if w0 > 0.01 or is_cut:
                    coord = (int(conn_z[flat_idx, k]), int(conn_y[flat_idx, k]), int(conn_x[flat_idx, k]))
                    tz, ty, tx = coord
                    is_pre_valid = ((1 <= tz <= self.N) and (1 <= ty <= self.N) and (1 <= tx <= self.N)) or (coord in special_map)
                    if not is_pre_valid and not is_cut:
                        continue
                    if is_cut:
                        partner_map[coord] = "cut"
                    elif partner_map.get(coord) != "cut":
                        partner_map[coord] = "in"

        if is_sel_internal or (z, y, x) in special_map:
            for post_idx in range(self.TOTAL_N):
                pz = ((post_idx >> (self.dim * 2)) & (self.N - 1)) + 1
                py = ((post_idx >> self.dim) & (self.N - 1)) + 1
                px = ((post_idx >> 0) & (self.N - 1)) + 1
                for k in range(28):
                    if int(conn_z[post_idx, k]) == z and int(conn_y[post_idx, k]) == y and int(conn_x[post_idx, k]) == x:
                        w0 = float(init_weights[post_idx, k])
                        is_cut = bool(syn_ko[post_idx, k])
                        if w0 > 0.01 or is_cut:
                            coord = (pz, py, px)
                            if is_cut:
                                partner_map[coord] = "cut"
                            elif partner_map.get(coord) == "in":
                                partner_map[coord] = "both"
                            elif partner_map.get(coord) != "cut":
                                partner_map[coord] = "out"
        return partner_map

    def _redraw_grid_canvas(self):
        self.grid_canvas.delete("all")
        w = self.grid_canvas.winfo_width()
        h = self.grid_canvas.winfo_height()
        if w < 40 or h < 40:
            return

        cols = 3 if self.P <= 6 else 4
        rows = (self.P + cols - 1) // cols

        pad_x, pad_y = 22, 24
        avail_w = (w - pad_x * (cols + 1)) / cols
        avail_h = (h - pad_y * (rows + 1)) / rows
        cell_size = max(10.0, min(avail_w / self.P, avail_h / self.P))

        self._cell_rects: dict[tuple[int, int, int], tuple[float, float, float, float]] = {}
        self._cell_fill_rect_ids: dict[tuple[int, int, int], int] = {}
        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        partner_map = self._get_selected_cell_partner_map()
        mode = self.view_mode_var.get()

        for z in range(self.P):
            r, c = divmod(z, cols)
            ox = pad_x + c * (self.P * cell_size + pad_x)
            oy = pad_y + r * (self.P * cell_size + pad_y)

            z_title = f"外周 P_z={z}" if (z == 0 or z == self.P - 1) else f"内部 z={z-1} (P_z={z})"
            self.grid_canvas.create_text(
                ox + (self.P * cell_size) / 2, oy - 10, text=z_title, fill="#ffffff", font=("", 8, "bold")
            )

            # X軸目盛り (下部: P_x = 0..P-1、内部は x=0..N-1)
            for x in range(self.P):
                cx = ox + (x + 0.5) * cell_size
                lbl_x = f"{x-1}" if (1 <= x <= self.N) else f"P{x}"
                col_x = "#aaddff" if (1 <= x <= self.N) else "#777788"
                self.grid_canvas.create_text(
                    cx, oy + self.P * cell_size + 7, text=lbl_x, fill=col_x, font=("", 7)
                )

            # Y軸目盛り (左部: 下が y=0, 上が y=N-1 — 左のMatplotlibと完全一致)
            for y in range(self.P):
                draw_row = (self.P - 1) - y
                cy = oy + (draw_row + 0.5) * cell_size
                lbl_y = f"{y-1}" if (1 <= y <= self.N) else f"P{y}"
                col_y = "#aaddff" if (1 <= y <= self.N) else "#777788"
                self.grid_canvas.create_text(
                    ox - 9, cy, text=lbl_y, fill=col_y, font=("", 7)
                )

            for y in range(self.P):
                draw_row = (self.P - 1) - y
                for x in range(self.P):
                    x0 = ox + x * cell_size
                    y0 = oy + draw_row * cell_size
                    x1 = x0 + cell_size
                    y1 = y0 + cell_size
                    self._cell_rects[(z, y, x)] = (x0, y0, x1, y1)

                    is_internal = (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N)
                    is_ko = bool(self.brain.knockout_np2[z, y, x])
                    fill_color = self._get_cell_color(z, y, x, is_internal, is_ko, mode)

                    rect_id = self.grid_canvas.create_rectangle(
                        x0, y0, x1, y1,
                        fill=fill_color,
                        outline="#484858" if is_internal else "#2c2c36",
                        width=1,
                    )
                    self._cell_fill_rect_ids[(z, y, x)] = rect_id

                    if is_ko:
                        self.grid_canvas.create_line(x0 + 2, y0 + 2, x1 - 2, y1 - 2, fill="#ff4444", width=2)
                        self.grid_canvas.create_line(x0 + 2, y1 - 2, x1 - 2, y0 + 2, fill="#ff4444", width=2)

                    sp_role = special_map.get((z, y, x), "")
                    if sp_role:
                        short_tag = "E入" if "Energy" in sp_role else ("S入" if "Sun" in sp_role else ("G+" if "Gen+" in sp_role else "G-"))
                        self.grid_canvas.create_text(
                            (x0 + x1) / 2, (y0 + y1) / 2, text=short_tag, fill="#ffffff", font=("", max(6, int(cell_size * 0.3)), "bold")
                        )
                    elif is_internal and cell_size >= 18 and not is_ko:
                        iz, iy, ix = z - 1, y - 1, x - 1
                        sign_txt = "-" if self.inhib_bits[iz, iy, ix] else "+"
                        self.grid_canvas.create_text(
                            (x0 + x1) / 2, (y0 + y1) / 2, text=sign_txt, fill="#dddddd", font=("", max(6, int(cell_size * 0.28)))
                        )

            # 内部ニューロン領域 (1..N) の境界を白枠で明示 (Z=1..N のスライス)
            if 1 <= z <= self.N:
                ix0 = ox + 1 * cell_size
                iy0 = oy + 1 * cell_size
                ix1 = ox + (self.N + 1) * cell_size
                iy1 = oy + (self.N + 1) * cell_size
                self.grid_canvas.create_rectangle(ix0, iy0, ix1, iy1, outline="#c0d8ff", width=1.5)

            # 結合相手ハイライト枠・起点(Pre)枠・選択セル枠を最前面に描画
            for y in range(self.P):
                for x in range(self.P):
                    x0, y0, x1, y1 = self._cell_rects[(z, y, x)]
                    p_state = partner_map.get((z, y, x))
                    if p_state == "cut":
                        self.grid_canvas.create_rectangle(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, outline="#ff44cc", width=2.0)
                        if cell_size >= 14:
                            self.grid_canvas.create_text(x1 - 5, y0 + 5, text="✂", fill="#ff66dd", font=("", 7, "bold"))
                    elif p_state == "in":
                        self.grid_canvas.create_rectangle(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, outline="#33ee66", width=1.8)
                    elif p_state == "out":
                        self.grid_canvas.create_rectangle(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, outline="#ff9922", width=1.8)
                    elif p_state == "both":
                        self.grid_canvas.create_rectangle(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, outline="#cc77ff", width=2.0)

                    if self.wire_src == (z, y, x):
                        self.grid_canvas.create_rectangle(x0, y0, x1, y1, outline="#00ffff", width=2.5)
                    if z == self.sel_z and y == self.sel_y and x == self.sel_x:
                        self.grid_canvas.create_rectangle(x0, y0, x1, y1, outline="#ffff00", width=2.8)

    def _update_grid_live_colors_only(self):
        """live_out モード時に Canvas アイテムを破棄(delete('all'))せず、背景色のみをインプレース更新してマウスクリック阻害を防ぐ"""
        for (z, y, x), rect_id in getattr(self, "_cell_fill_rect_ids", {}).items():
            is_internal = (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N)
            is_ko = bool(self.brain.knockout_np2[z, y, x])
            fill_color = self._get_cell_color(z, y, x, is_internal, is_ko, "live_out")
            self.grid_canvas.itemconfig(rect_id, fill=fill_color)

    def _get_cell_color(self, z: int, y: int, x: int, is_internal: bool, is_ko: bool, mode: str) -> str:
        if is_ko:
            return "#121216"
        if mode == "ko_inhib":
            if not is_internal:
                has_sig = float(np.max(np.abs(self.sig_pre[z, y, x]))) > 0.01 or float(np.max(np.abs(self.sig_post[z, y, x]))) > 0.01
                return "#3b4252" if has_sig else "#24242c"
            iz, iy, ix = z - 1, y - 1, x - 1
            return "#2b5b84" if self.inhib_bits[iz, iy, ix] else "#8c3b3b"
        elif mode == "live_out":
            val = float(np.clip(abs(float(self.brain.outputs_np2[z, y, x])), 0.0, 1.0))
            v = int(val * 215) + 30
            return f"#{v:02x}{int(v*0.4):02x}{int(v*0.4):02x}" if float(self.brain.outputs_np2[z, y, x]) >= 0 else f"#{int(v*0.3):02x}{int(v*0.5):02x}{v:02x}"
        elif mode == "sig_pre":
            norm = float(np.linalg.norm(self.sig_pre[z, y, x].astype(np.float32))) / 2.0
            v = int(np.clip(norm, 0.0, 1.0) * 200) + 35
            return f"#{v:02x}{int(v*0.6):02x}30"
        elif mode == "sig_post":
            norm = float(np.linalg.norm(self.sig_post[z, y, x].astype(np.float32))) / 2.0
            v = int(np.clip(norm, 0.0, 1.0) * 200) + 35
            return f"#30{int(v*0.7):02x}{v:02x}"
        elif mode == "dopamine":
            if not is_internal:
                return "#24242c"
            val = float(np.clip(self.dopamine[z - 1, y - 1, x - 1], 0.0, 1.0))
            v = int(val * 210) + 35
            return f"#{v:02x}{int(v*0.55):02x}20"
        elif mode == "sleep":
            if not is_internal:
                return "#24242c"
            val = float(np.clip(self.sleep[z - 1, y - 1, x - 1], 0.0, 1.0))
            v = int(val * 210) + 35
            return f"#{int(v*0.7):02x}25{v:02x}"
        return "#2e2e38"

    # ==========================================================================
    # イベント・操作アクション
    # ==========================================================================
    def _find_clicked_cell(self, event) -> tuple[int, int, int] | None:
        for coord, (x0, y0, x1, y1) in getattr(self, "_cell_rects", {}).items():
            if x0 <= event.x <= x1 and y0 <= event.y <= y1:
                return coord
        return None

    def _on_grid_left_click(self, event):
        self.root.focus_set()
        coord = self._find_clicked_cell(event)
        if coord is not None:
            self.sel_z, self.sel_y, self.sel_x = coord
            self._refresh_all_views()

    def _on_grid_shift_left_click(self, event):
        """Shift + 左クリックで、現在選択中のセルとクリックしたセルの間のシナプス結合を即座に切断/復元(sig不変)"""
        self.root.focus_set()
        coord = self._find_clicked_cell(event)
        if coord is not None:
            self._toggle_synapse_with_selected_cell(coord)
            self._refresh_all_views()

    def _toggle_synapse_with_selected_cell(self, target_coord: tuple[int, int, int]):
        """現在選択中のセル (sel_z, sel_y, sel_x) と target_coord 間の結合(双方向または有効な方向)を実験切断/復元"""
        sel_coord = (self.sel_z, self.sel_y, self.sel_x)
        slots = self.brain.find_synapse_slots_between(target_coord, sel_coord, active_only=True)
        if target_coord != sel_coord:
            slots += self.brain.find_synapse_slots_between(sel_coord, target_coord, active_only=True)
        if not slots:
            # 初期重み 0 のスロットでもトポロジー的に隣接/28番目結合があれば対象にする
            slots = self.brain.find_synapse_slots_between(target_coord, sel_coord, active_only=False)
            if target_coord != sel_coord:
                slots += self.brain.find_synapse_slots_between(sel_coord, target_coord, active_only=False)
        if not slots:
            n_sel, _ = format_coord_label(*sel_coord, self.N)
            n_tgt, _ = format_coord_label(*target_coord, self.N)
            messagebox.showinfo(
                "結合なし",
                f"選択セル {n_sel} と {n_tgt} の間には直接のシナプス結合（近傍27または28番目遠隔リンク）が存在しません。",
            )
            return

        any_uncut = any(not self.brain.synapse_ko_mask[p_idx, k] for p_idx, k in slots)
        for p_idx, k in slots:
            self.brain.set_synapse_slot_cut(p_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()

    def _perform_right_click_action(self, z: int, y: int, x: int):
        mode = self.right_click_mode_var.get()
        if mode == "knockout":
            self.brain.knockout_np2[z, y, x] = not self.brain.knockout_np2[z, y, x]
            if self.brain.knockout_np2[z, y, x]:
                self.brain.outputs_np2[z, y, x] = np.float16(0.0)
            if self.auto_reset_on_edit.get():
                self.brain.reset()
        elif mode == "cut_synapse":
            self._toggle_synapse_with_selected_cell((z, y, x))
        else:
            if (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N):
                iz, iy, ix = z - 1, y - 1, x - 1
                self.inhib_bits[iz, iy, ix] = not self.inhib_bits[iz, iy, ix]
                self._sync_genes_to_brain()

    def _on_grid_right_click(self, event):
        self.root.focus_set()
        coord = self._find_clicked_cell(event)
        if coord is not None:
            z, y, x = coord
            if self.right_click_mode_var.get() == "cut_synapse":
                # 選択セルを維持したまま相手セルとの結合を切断/復元
                self._toggle_synapse_with_selected_cell((z, y, x))
            else:
                self.sel_z, self.sel_y, self.sel_x = z, y, x
                self._perform_right_click_action(z, y, x)
            self._refresh_all_views()

    def _on_scan_tree_select(self, event):
        sel = self.tree_scan.selection()
        if not sel:
            return
        item_id = sel[0]
        if self._scan_mode == "synapse" and item_id in self._scan_item_synapses:
            _, _, pre_coord, post_coord = self._scan_item_synapses[item_id]
            self.wire_src = pre_coord
            n_s, _ = format_coord_label(*pre_coord, self.N)
            self.lbl_wire_src.config(text=f"起点(Pre): {n_s}")
            self.sel_z, self.sel_y, self.sel_x = post_coord
            self._refresh_all_views()
        elif item_id in self._scan_item_coords:
            self.sel_z, self.sel_y, self.sel_x = self._scan_item_coords[item_id]
            self._refresh_all_views()

    def _on_scan_tree_double_click(self, event):
        self.action_toggle_scan_selected_item()

    def action_toggle_scan_selected_item(self):
        sel = self.tree_scan.selection()
        if not sel:
            return
        item_id = sel[0]
        if self._scan_mode == "synapse" and item_id in self._scan_item_synapses:
            post_idx, k, pre_coord, post_coord = self._scan_item_synapses[item_id]
            is_cut = self.brain.set_synapse_slot_cut(post_idx, k)
            if self.auto_reset_on_edit.get():
                self.brain.reset()
            # 行の表示も更新
            vals = list(self.tree_scan.item(item_id, "values"))
            if len(vals) >= 6:
                base_role = vals[5].replace("[切断中] ", "")
                vals[5] = f"[切断中] {base_role}" if is_cut else base_role
                self.tree_scan.item(item_id, values=vals)
            self._refresh_all_views()
        elif item_id in self._scan_item_coords:
            self.sel_z, self.sel_y, self.sel_x = self._scan_item_coords[item_id]
            self.action_toggle_selected_ko()

    def _on_global_key(self, event):
        focused = self.root.focus_get()
        if event.keysym.lower() == "escape":
            self.root.focus_set()
            return
        if isinstance(focused, (ttk.Entry, tk.Entry, tk.Text, ttk.Spinbox)):
            try:
                if focused.winfo_viewable():
                    return
            except Exception:
                return
            self.root.focus_set()

        key = event.keysym.lower()
        is_ctrl = bool(event.state & 0x0004)
        is_shift = bool(event.state & 0x0001)

        # --- 1. ファイル操作 (Ctrl+S, Ctrl+Shift+S, O, E) ---
        if is_ctrl and key == "s":
            if is_shift:
                self.action_save_as()
            else:
                self.action_save_overwrite()
            return
        elif key == "o":
            self.action_open_dialog()
            return
        elif key == "e":
            self.action_load_latest_evolved_elite()
            return
        elif key in ("question", "h", "slash") and (key == "question" or not is_ctrl):
            self.action_show_shortcuts_dialog()
            return

        # --- 2. 大タブ / サブタブ切り替え ---
        if is_ctrl:
            # Ctrl+1..5 で大タブ2のサブタブ直接ジャンプ
            sub_map = {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4}
            if key in sub_map and hasattr(self, "notebook") and hasattr(self, "root_notebook"):
                self.root_notebook.select(1)
                self.notebook.select(sub_map[key])
                return
        else:
            # 1 / 2 または F1 / F2 で大タブ切り替え
            if key in ("1", "f1") and hasattr(self, "root_notebook"):
                self.root_notebook.select(0)
                return
            elif key in ("2", "f2") and hasattr(self, "root_notebook"):
                self.root_notebook.select(1)
                return

        # --- 3. シミュレーション制御 (Space, 矢印, R, G, 速度) ---
        if key == "space":
            self.action_toggle_pause()
        elif key == "right":
            self.action_step_once()
        elif key == "up":
            self.steps_per_frame = min(50, self.steps_per_frame + 1)
            self.spn_speed.set(self.steps_per_frame)
            self._render_matplotlib_state()
        elif key == "down":
            self.steps_per_frame = max(1, self.steps_per_frame - 1)
            self.spn_speed.set(self.steps_per_frame)
            self._render_matplotlib_state()
        elif key == "r":
            self.action_reset_sim()
        elif key == "g":
            self.action_toggle_gif_recording()

        # --- 4. 機能フラグトグル (L, D, S) ---
        elif key == "l":
            self.enable_learning = 0.0 if self.enable_learning > 0.0 else 1.0
            self.flag_vars["enable_learning"].set(self.enable_learning)
            self.flag_str_vars["enable_learning"].set(f"{self.enable_learning:.2f}")
            self._render_matplotlib_state()
        elif key == "d":
            self.enable_dopamine = 0.0 if self.enable_dopamine > 0.0 else 1.0
            self.flag_vars["enable_dopamine"].set(self.enable_dopamine)
            self.flag_str_vars["enable_dopamine"].set(f"{self.enable_dopamine:.2f}")
            self._render_matplotlib_state()
        elif key == "s":
            self.enable_sleep = 0.0 if self.enable_sleep > 0.0 else 1.0
            self.flag_vars["enable_sleep"].set(self.enable_sleep)
            self.flag_str_vars["enable_sleep"].set(f"{self.enable_sleep:.2f}")
            self._render_matplotlib_state()

        # --- 5. ボクセル脳スライス移動 (PageUp, PageDown, Home) ---
        elif key in ("prior", "pageup"):
            self.sel_z = min(self.P - 1, self.sel_z + 1)
            self._refresh_cell_inspector()
            self._redraw_grid_canvas()
            self._render_matplotlib_state()
        elif key in ("next", "pagedown"):
            self.sel_z = max(0, self.sel_z - 1)
            self._refresh_cell_inspector()
            self._redraw_grid_canvas()
            self._render_matplotlib_state()
        elif key == "home":
            self.sel_z = self.P // 2
            self._refresh_cell_inspector()
            self._redraw_grid_canvas()
            self._render_matplotlib_state()

        # --- 6. セル操作 (K, C, W) ---
        elif key == "k":
            self.action_toggle_selected_ko()
        elif key == "c":
            self.action_toggle_selected_synapse()
        elif key == "w":
            self.action_set_wire_src()

        # --- 7. 3D配線マップ ＆ グラフ表示切替 (P: グラフP1/P2切替, F: 視点リセット, [, ]: ポート切り替え) ---
        elif key == "p":
            self.action_toggle_graph_page()
        elif key == "f":
            self.action_reset_inout_3d_view()
        elif key == "bracketleft":
            self._cycle_io_port(step=-1)
        elif key == "bracketright":
            self._cycle_io_port(step=1)

    def _cycle_io_port(self, step: int = 1):
        """3D配線マップの対象ポートを前後に切り替え"""
        if not hasattr(self, "cb_active_io_port"):
            return
        vals = self.cb_active_io_port["values"]
        if not vals:
            return
        cur_idx = self.cb_active_io_port.current()
        new_idx = (cur_idx + step) % len(vals)
        self.cb_active_io_port.current(new_idx)
        self._on_active_io_port_combo_changed()

    def action_show_shortcuts_dialog(self):
        """キーボードショートカット一覧（チートシート）ダイアログを表示"""
        dlg = tk.Toplevel(self.root)
        dlg.title("⌨️ OneSim キーボードショートカット・チートシート")
        dlg.geometry("720x620")
        dlg.configure(bg="#12141a")
        dlg.transient(self.root)

        header = tk.Frame(dlg, bg="#1a1c24", pady=10, padx=16)
        header.pack(fill=tk.X)
        tk.Label(header, text="⌨️ OneSim 操作チートシート (Cheat Sheet)", font=("", 13, "bold"), fg="#80d8ff", bg="#1a1c24").pack(side=tk.LEFT)
        tk.Label(header, text="いつでも [?] または [H] で表示可能", font=("", 9), fg="#90a4ae", bg="#1a1c24").pack(side=tk.RIGHT)

        container = tk.Frame(dlg, bg="#12141a", padx=14, pady=10)
        container.pack(fill=tk.BOTH, expand=True)

        tree = ttk.Treeview(container, columns=("Key", "Action", "Category"), show="headings", height=20)
        tree.heading("Category", text="カテゴリ")
        tree.heading("Key", text="キー")
        tree.heading("Action", text="動作・説明")
        tree.column("Category", width=120, anchor=tk.W)
        tree.column("Key", width=130, anchor=tk.CENTER)
        tree.column("Action", width=420, anchor=tk.W)
        tree.pack(fill=tk.BOTH, expand=True)

        shortcuts = [
            # シミュレーション制御
            ("シミュレーション", "Space", "シミュレーションの一時停止 / 再開"),
            ("シミュレーション", "→ (Right)", "1ステップコマ送り実行 (手動ステップ)"),
            ("シミュレーション", "↑ / ↓", "シミュレーション実行速度のアップ / ダウン"),
            ("シミュレーション", "R", "シミュレーション波形・エネルギーのリセット"),
            ("シミュレーション", "G", "GIF/MP4 録画の開始 / 停止・保存"),
            # 画面・タブ切り替え
            ("画面・タブ切替", "P", "右上グラフ表示切替 (P1: 個体位置マップ ⇄ P2: ドパミン波形)"),
            ("画面・タブ切替", "1 または F1", "【大タブ1】 📊 波形グラフ ＆ 🧠 ボクセル脳マップ に切替"),
            ("画面・タブ切替", "2 または F2", "【大タブ2】 🛠️ 選択セル～統合SimConfig に切替"),
            ("画面・タブ切替", "Ctrl + 1", "大タブ2: 🔍 選択セル・配線 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 2", "大タブ2: 🌐 I/O 3D配線 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 3", "大タブ2: ⚙️ 神経パラメータ タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 4", "大タブ2: 🧪 ノッキング診断 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 5", "大タブ2: 🚀 統合ランチャー・sim_config へジャンプ"),
            # 機能トグル
            ("リアルタイム機能", "L", "生涯学習（シナプス可塑性 Plasticity） ON / OFF"),
            ("リアルタイム機能", "D", "ドーパミン報酬修飾（Dopamine） ON / OFF"),
            ("リアルタイム機能", "S", "睡眠抑制・集計（Sleep） ON / OFF"),
            # ボクセル脳操作
            ("ボクセル脳操作", "PageUp / PageDn", "Zスライスの上下移動 (現在スライス切替)"),
            ("ボクセル脳操作", "Home", "中央Zスライス (Z=N//2) にジャンプ"),
            ("ボクセル脳操作", "K", "選択セルの一時ノックアウト (KO) 切替"),
            ("ボクセル脳操作", "C", "選択シナプス結合の切断 / 復元"),
            ("ボクセル脳操作", "W", "2セル間クイック配線の始点 (Pre) に設定"),
            # 3D配線マップ
            ("3D配線マップ", "F", "3Dマップの視点を初期位置にリセット (Focus)"),
            ("3D配線マップ", "[ / ]", "配線対象ポートの切り替え (前 / 次)"),
            ("3D配線マップ", "左ドラッグ", "キューブを 360° グリグリ 3D 回転"),
            ("3D配線マップ", "右ドラッグ", "3Dマップ画面の平行移動 (パン)"),
            ("3D配線マップ", "ホイール", "3Dマップのズームイン / ズームアウト"),
            ("3D配線マップ", "クリック", "選択中ポートの配線をクリックしたセルに直接指定"),
            # ファイル・一般
            ("ファイル・一般", "Ctrl + S", "現在の遺伝子を上書き保存"),
            ("ファイル・一般", "Ctrl + Shift + S", "新規ファイルとして別名保存 (Save As)"),
            ("ファイル・一般", "O", ".npz 遺伝子ファイルを開く"),
            ("ファイル・一般", "E", "GPU進化の最新エリート (.npz) を即時読込"),
            ("ファイル・一般", "? または H", "このショートカット・チートシートを表示"),
            ("ファイル・一般", "Escape", "入力フォーカス解除 / ウィンドウを閉じる"),
        ]

        for cat, k, act in shortcuts:
            tree.insert("", tk.END, values=(k, act, cat))

        btn_row = tk.Frame(dlg, bg="#12141a", pady=8)
        btn_row.pack(fill=tk.X)
        ttk.Button(btn_row, text="閉じる (Esc)", command=dlg.destroy).pack(side=tk.RIGHT, padx=14)
        dlg.bind("<Escape>", lambda e: dlg.destroy())

    def _on_speed_change(self):
        try:
            self.steps_per_frame = max(1, min(50, int(self.spn_speed.get())))
        except ValueError:
            pass
        self.root.focus_set()

    def action_toggle_pause(self):
        self.paused = not self.paused
        self.btn_pause.config(text="▶️ 再開 [Space]" if self.paused else "⏸️ 一時停止 [Space]")
        self._render_matplotlib_state()

    def action_step_once(self):
        self.paused = True
        self.btn_pause.config(text="▶️ 再開 [Space]")
        self.brain.step(
            inner_steps=1,
            enable_learning=self.enable_learning,
            enable_dopamine=self.enable_dopamine,
            enable_sleep=self.enable_sleep,
        )
        self._render_matplotlib_state()
        if self.is_recording_gif:
            self._capture_gif_frame()

    def action_reset_sim(self):
        self.brain.reset()
        self.brain.step(
            inner_steps=1,
            enable_learning=self.enable_learning,
            enable_dopamine=self.enable_dopamine,
            enable_sleep=self.enable_sleep,
        )
        self._render_matplotlib_state()
        if self.is_recording_gif:
            self._capture_gif_frame()

    def action_eval_1000_steps(self):
        """リセット状態から1000ステップを一括実行して波形と最終エネルギーを更新（GIF録画中はフレームを刻んで記録）"""
        self.brain.reset()
        if self.is_recording_gif:
            chunk = max(5, self.steps_per_frame)
            remaining = 1000
            while remaining > 0:
                s = min(chunk, remaining)
                self.brain.step(
                    inner_steps=s,
                    enable_learning=self.enable_learning,
                    enable_dopamine=self.enable_dopamine,
                    enable_sleep=self.enable_sleep,
                )
                remaining -= s
                self._render_matplotlib_state()
                self._capture_gif_frame()
        else:
            self.brain.step(
                inner_steps=1000,
                enable_learning=self.enable_learning,
                enable_dopamine=self.enable_dopamine,
                enable_sleep=self.enable_sleep,
            )
        self.meta_score = round(self.brain.energy, 4)
        self.paused = True
        self.btn_pause.config(text="▶️ 再開 [Space]")
        self._refresh_all_views()

    # ==========================================================================
    # 動画・GIF録画アクション (MP4 / GIF / WebM / WebP / AVI 対応)
    # ==========================================================================
    def action_toggle_gif_recording(self):
        if self.is_recording_gif:
            self.action_stop_gif_recording()
        else:
            self.action_start_gif_recording()

    def action_start_gif_recording(self):
        """シミュレーション4画面グラフの動画・GIF録画を開始する"""
        if self.is_recording_gif:
            return
        self.gif_frames.clear()
        self.is_recording_gif = True
        self.lbl_rec_status.config(foreground="crimson")
        self.btn_rec_start.config(state=tk.DISABLED, text="🔴 録画中...")
        self.btn_rec_stop.config(state=tk.NORMAL)

        # 一時停止中であれば自動的に再生を開始して波形が進むようにする
        if self.paused:
            self.paused = False
            self.btn_pause.config(text="⏸️ 一時停止 [Space]")

        self._render_matplotlib_state(force_full=True)
        self._capture_gif_frame()

    def _save_recorded_media(self, save_path: str, fps: int = 20):
        """キャプチャ済みフレーム列 (self.gif_frames) を拡張子に応じて MP4 / GIF / WebM / WebP / AVI 等で書き出す"""
        ext = os.path.splitext(save_path)[1].lower()
        if not ext:
            ext = f".{self.rec_fmt_var.get().lower()}"
            save_path += ext

        os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
        duration_ms = max(20, int(1000 / max(1, fps)))

        if ext == ".gif":
            self.gif_frames[0].save(
                save_path,
                save_all=True,
                append_images=self.gif_frames[1:],
                duration=duration_ms,
                loop=0,
                optimize=True,
            )
            return

        if ext == ".webp":
            self.gif_frames[0].save(
                save_path,
                save_all=True,
                append_images=self.gif_frames[1:],
                duration=duration_ms,
                loop=0,
                quality=90,
            )
            return

        ffmpeg_bin = shutil.which("ffmpeg")
        if not ffmpeg_bin:
            raise RuntimeError(
                f"動画形式 ({ext}) のエンコードに必要な ffmpeg が見つかりませんでした。\n"
                f"GIF (.gif) または WebP (.webp) 形式を選択するか、ffmpeg をインストールしてください。"
            )

        w0, h0 = self.gif_frames[0].size
        if ext == ".webm":
            codec_args = [
                "-c:v", "libvpx-vp9",
                "-crf", "24",
                "-b:v", "0",
                "-pix_fmt", "yuv420p",
            ]
        elif ext == ".avi":
            codec_args = [
                "-c:v", "mpeg4",
                "-q:v", "3",
            ]
        else:
            # .mp4 / .mov / .mkv 等: 汎用性の高い H.264 (yuv420p)
            codec_args = [
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "18",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
            ]

        cmd = [
            ffmpeg_bin,
            "-y",
            "-f", "rawvideo",
            "-vcodec", "rawvideo",
            "-pix_fmt", "rgb24",
            "-s", f"{w0}x{h0}",
            "-r", str(fps),
            "-i", "-",
            "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2",
            *codec_args,
            save_path,
        ]

        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        assert proc.stdin is not None
        try:
            for frame in self.gif_frames:
                if frame.size != (w0, h0):
                    frame = frame.resize((w0, h0), Image.Resampling.BILINEAR)
                if frame.mode != "RGB":
                    frame = frame.convert("RGB")
                proc.stdin.write(frame.tobytes())
            proc.stdin.close()
        except Exception:
            proc.kill()
            raise

        _, stderr_bytes = proc.communicate()
        if proc.returncode != 0:
            err_msg = stderr_bytes.decode("utf-8", errors="replace")[-600:]
            raise RuntimeError(f"ffmpeg エンコードエラー (code={proc.returncode}):\n{err_msg}")

    def action_stop_gif_recording(self, save_path: str | None = None):
        """録画を停止し、キャプチャしたフレームを MP4 / GIF / WebM / WebP / AVI ファイルとして保存する"""
        if not self.is_recording_gif and not self.gif_frames:
            return

        self.is_recording_gif = False
        self.btn_rec_start.config(state=tk.NORMAL, text="🔴 録画開始 [G]")
        self.btn_rec_stop.config(state=tk.DISABLED)

        was_paused = self.paused
        self.paused = True
        self.btn_pause.config(text="▶️ 再開 [Space]")
        self._render_matplotlib_state(force_full=True)

        if not self.gif_frames:
            self.lbl_rec_status.config(text="")
            return

        fmt = self.rec_fmt_var.get().lower() if hasattr(self, "rec_fmt_var") else "mp4"
        if fmt not in ("mp4", "gif", "webm", "webp", "avi"):
            fmt = "mp4"

        if save_path is None:
            rec_dir = os.path.abspath("backups/recordings")
            os.makedirs(rec_dir, exist_ok=True)
            base_gene = (
                os.path.splitext(os.path.basename(self.current_file_path))[0]
                if self.current_file_path
                else f"custom_dim{self.dim}"
            )
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            default_file = f"sim_{base_gene}_step{self.brain.inner_step_counter}_{ts}.{fmt}"

            all_types = [
                ("MP4 Video (*.mp4)", "*.mp4"),
                ("GIF Animation (*.gif)", "*.gif"),
                ("WebM Video (*.webm)", "*.webm"),
                ("Animated WebP (*.webp)", "*.webp"),
                ("AVI Video (*.avi)", "*.avi"),
                ("All Files", "*.*"),
            ]
            # ツールバーで選択中のフォーマットをダイアログの先頭に配置
            ext_pat = f"*.{fmt}"
            ordered_types = [t for t in all_types if t[1] == ext_pat] + [t for t in all_types if t[1] != ext_pat]

            save_path = filedialog.asksaveasfilename(
                title="録画したシミュレーション波形を保存 (MP4 / GIF / WebM / WebP / AVI)",
                initialdir=rec_dir,
                initialfile=default_file,
                defaultextension=f".{fmt}",
                filetypes=ordered_types,
            )

        if not save_path:
            self.lbl_rec_status.config(text=f"⏹️ 保存キャンセル ({len(self.gif_frames)}f)")
            self.gif_frames.clear()
            if not was_paused:
                self.paused = False
                self.btn_pause.config(text="⏸️ 一時停止 [Space]")
            return

        try:
            ext_upper = os.path.splitext(save_path)[1].lstrip(".").upper() or fmt.upper()
            self.lbl_rec_status.config(text=f"💾 {ext_upper}書き出し中...")
            self.root.update_idletasks()
            self._save_recorded_media(save_path, fps=20)
            saved_count = len(self.gif_frames)
            self.gif_frames.clear()
            self.lbl_rec_status.config(text=f"✅ {ext_upper}保存完了 ({saved_count}f)", foreground="darkgreen")
        except Exception as e:
            self.lbl_rec_status.config(text="❌ 録画保存失敗", foreground="crimson")
            messagebox.showerror("録画保存エラー", f"録画ファイルの保存に失敗しました:\n{e}")
            self.gif_frames.clear()

    # ==========================================================================
    # ノッキング実験 ＆ シナプス実験切断アクション (sig_pre / sig_post 不変)
    # ==========================================================================
    def action_toggle_selected_synapse(self):
        """選択セル・シナプス配線タブの一覧で選択されているシナプス結合を切断/復元 (sig不変)"""
        sel = self.tree_synapses.selection()
        if not sel:
            return
        item_id = sel[0]
        if item_id not in self._syn_tree_items:
            return
        post_idx, k, partner_coord = self._syn_tree_items[item_id]
        self.brain.set_synapse_slot_cut(post_idx, k)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()
        # 同じシナプス行を再選択状態に保つ
        for new_id, (p_i, slot_k, _) in self._syn_tree_items.items():
            if p_i == post_idx and slot_k == k:
                self.tree_synapses.selection_set(new_id)
                self.tree_synapses.see(new_id)
                break

    def action_jump_to_synapse_partner(self):
        """シナプス一覧で選択中の相手セルへ選択フォーカスを移動する"""
        sel = self.tree_synapses.selection()
        if not sel:
            return
        item_id = sel[0]
        if item_id in self._syn_tree_items:
            _, _, partner_coord = self._syn_tree_items[item_id]
            self.sel_z, self.sel_y, self.sel_x = partner_coord
            self._refresh_all_views()

    def action_toggle_all_incoming_synapses(self):
        """現在選択中の内部セルへの全入力シナプス (Pre ➔ 此) を一括切断/復元 (sig不変)"""
        post_idx = self.brain._coord_p_to_internal_idx(self.sel_z, self.sel_y, self.sel_x)
        if post_idx is None:
            messagebox.showinfo("外周セル", "外周膜セルにはシナプス入力スロットがありません。")
            return
        active_ks = [
            k for k in range(28)
            if float(self.brain.initial_weights[post_idx, k]) > 0.01 or self.brain.synapse_ko_mask[post_idx, k]
        ]
        if not active_ks:
            active_ks = list(range(28))
        any_uncut = any(not self.brain.synapse_ko_mask[post_idx, k] for k in active_ks)
        for k in active_ks:
            self.brain.set_synapse_slot_cut(post_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_toggle_all_outgoing_synapses(self):
        """現在選択中のセルからの全出力シナプス (此 ➔ Post) を一括切断/復元 (sig不変)"""
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x
        slots = []
        for post_idx in range(self.TOTAL_N):
            for k in range(28):
                if int(conn_z[post_idx, k]) == z and int(conn_y[post_idx, k]) == y and int(conn_x[post_idx, k]) == x:
                    if float(self.brain.initial_weights[post_idx, k]) > 0.01 or self.brain.synapse_ko_mask[post_idx, k]:
                        slots.append((post_idx, k))
        if not slots:
            return
        any_uncut = any(not self.brain.synapse_ko_mask[p_idx, k] for p_idx, k in slots)
        for p_idx, k in slots:
            self.brain.set_synapse_slot_cut(p_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_cut_wire_unidirectional(self):
        """起点(Pre) ➔ 現在セル(Post) の単方向シナプス結合のみを実験切断/復元 (sig不変)"""
        if self.wire_src is None:
            messagebox.showinfo("2セル間結合切断", "先に起点(Pre)セルを選択して「現在セルを起点(Pre)に指定 [W]」を押してください。")
            return
        post_coord = (self.sel_z, self.sel_y, self.sel_x)
        slots = self.brain.find_synapse_slots_between(self.wire_src, post_coord, active_only=False)
        if not slots:
            n_pre, _ = format_coord_label(*self.wire_src, self.N)
            n_post, _ = format_coord_label(*post_coord, self.N)
            messagebox.showinfo(
                "結合なし",
                f"{n_pre} ➔ {n_post} の方向にはシナプス結合スロットが存在しません。\n（近傍27セルまたは28番目遠隔リンクのみ結合可能です）",
            )
            return
        any_uncut = any(not self.brain.synapse_ko_mask[p_idx, k] for p_idx, k in slots)
        for p_idx, k in slots:
            self.brain.set_synapse_slot_cut(p_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_cut_wire_bidirectional(self):
        """起点(Pre) ⟷ 現在セル(Post) の双方向シナプス結合を実験切断/復元 (sig不変)"""
        if self.wire_src is None:
            messagebox.showinfo("2セル間結合切断", "先に起点(Pre)セルを選択して「現在セルを起点(Pre)に指定 [W]」を押してください。")
            return
        self._toggle_synapse_with_selected_cell(self.wire_src)
        self._refresh_all_views()

    def action_clear_all_synapse_cuts(self):
        """すべてのシナプス実験切断を解除し、元の重みに復元する"""
        self.brain.synapse_ko_mask.fill(False)
        self.brain.weights = self.brain.initial_weights.copy()
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def _on_ko_checkbox_toggle(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        self.brain.knockout_np2[z, y, x] = bool(self.cell_ko_var.get())
        if self.brain.knockout_np2[z, y, x]:
            self.brain.outputs_np2[z, y, x] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_toggle_selected_ko(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        self.brain.knockout_np2[z, y, x] = not self.brain.knockout_np2[z, y, x]
        if self.brain.knockout_np2[z, y, x]:
            self.brain.outputs_np2[z, y, x] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_ko_current_z_slice(self):
        z = self.sel_z
        if np.all(self.brain.knockout_np2[z]):
            self.brain.knockout_np2[z, :, :] = False
        else:
            self.brain.knockout_np2[z, :, :] = True
            self.brain.outputs_np2[z, :, :] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_clear_all_ko(self):
        self.brain.knockout_np2.fill(False)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_bake_ko_to_genes(self):
        """現在ノックアウト(KO)されているセルの sig_pre / sig_post を 0 に書き換えて遺伝子自体に反映する"""
        ko_mask = self.brain.knockout_np2
        count = int(np.count_nonzero(ko_mask))
        if count == 0:
            messagebox.showinfo("KO確定", "現在ノックアウトされているセルはありません。")
            return
        if messagebox.askyesno(
            "ノックアウトを遺伝子に確定",
            f"現在ノックアウト中の {count} セルの sig_pre / sig_post をすべて 0.0 に書き換えますか？\n"
            f"（確定後は .npz として保存してもそのセルの結合が完全に消去されます）",
        ):
            self.sig_pre[ko_mask] = np.float16(0.0)
            self.sig_post[ko_mask] = np.float16(0.0)
            self.brain.knockout_np2.fill(False)
            self._sync_genes_to_brain(force_reset=True)
            self._refresh_all_views()

    def action_run_knockout_scan(self):
        """各セルを1つずつ単独ノックアウトした際の1000step後エネルギー変化を自動スキャン"""
        self._scan_mode = "cell"
        self.tree_scan.heading("n_coord", text="内部座標 (x, y, z) [0..N-1]")
        self.tree_scan.heading("p_coord", text="外周込 P[z, y, x] [0..N+1]")
        self.tree_scan.heading("ko_e", text="KO後E")
        self.tree_scan.heading("role", text="役割 / 状態")

        dop_flat, slp_flat, inhib_flat = self._get_flat_arrays_for_sim()
        tester = SolarBrainCPU(
            self.sig_pre.copy(),
            self.sig_post.copy(),
            dop_flat,
            slp_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        tester.step(
            inner_steps=1000,
            enable_learning=self.enable_learning,
            enable_dopamine=self.enable_dopamine,
            enable_sleep=self.enable_sleep,
            record_history=False,
        )
        base_energy = tester.energy

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        target_coords = list(special_map.keys()) + [
            (iz + 1, iy + 1, ix + 1)
            for iz in range(self.N)
            for iy in range(self.N)
            for ix in range(self.N)
            if (iz + 1, iy + 1, ix + 1) not in special_map
        ]

        results = []
        for coord in target_coords:
            tester.knockout_np2.fill(False)
            tester.knockout_np2[coord] = True
            tester.reset()
            tester.step(
                inner_steps=1000,
                enable_learning=self.enable_learning,
                enable_dopamine=self.enable_dopamine,
                enable_sleep=self.enable_sleep,
                record_history=False,
            )
            ko_e = tester.energy
            drop = base_energy - ko_e
            results.append((drop, ko_e, coord))

        # エネルギー変化量の大きい順（低下量順）にソート
        results.sort(key=lambda x: (round(x[0], 6), round(abs(x[0]), 6)), reverse=True)

        self.lbl_scan_base.config(
            text=f"✅ セルKOスキャン完了！ 基準E: {base_energy:.4f} ｜ 行クリックでセル選択・ダブルクリックでセルKO切替"
        )

        for item in self.tree_scan.get_children():
            self.tree_scan.delete(item)
        self._scan_item_coords.clear()
        self._scan_item_synapses.clear()

        for rank, (drop, ko_e, coord) in enumerate(results, start=1):
            z, y, x = coord
            n_str, p_str = format_coord_label(z, y, x, self.N)
            role = special_map.get(coord, "内部ニューロン")
            if self.brain.knockout_np2[z, y, x]:
                role = f"[KO中] {role}"
            delta_e = ko_e - base_energy
            item_id = self.tree_scan.insert(
                "",
                tk.END,
                values=(
                    f"{rank}位",
                    n_str,
                    p_str,
                    f"{ko_e:.4f}",
                    f"{delta_e:+.4f}",
                    role,
                ),
            )
            self._scan_item_coords[item_id] = (z, y, x)

    def action_run_synapse_knockout_scan(self):
        """sig_pre/sig_post を改変せず、有効な各シナプス結合 (w > 0.01) を1本ずつ単独切断した際の重要度を自動スキャン"""
        self._scan_mode = "synapse"
        self.tree_scan.heading("n_coord", text="結合 Pre(入力元) ➔ Post(出力先)")
        self.tree_scan.heading("p_coord", text="P座標 Pre ➔ Post")
        self.tree_scan.heading("ko_e", text="切断後E")
        self.tree_scan.heading("role", text="重み w / 役割 / 状態")

        dop_flat, slp_flat, inhib_flat = self._get_flat_arrays_for_sim()
        tester = SolarBrainCPU(
            self.sig_pre.copy(),
            self.sig_post.copy(),
            dop_flat,
            slp_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        tester.step(
            inner_steps=1000,
            enable_learning=self.enable_learning,
            enable_dopamine=self.enable_dopamine,
            enable_sleep=self.enable_sleep,
            record_history=False,
        )
        base_energy = tester.energy

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x

        active_synapses = []
        for post_idx in range(self.TOTAL_N):
            for k in range(28):
                w0 = float(tester.initial_weights[post_idx, k])
                if w0 > 0.01:
                    sz, sy, sx = int(conn_z[post_idx, k]), int(conn_y[post_idx, k]), int(conn_x[post_idx, k])
                    is_pre_valid = ((1 <= sz <= self.N) and (1 <= sy <= self.N) and (1 <= sx <= self.N)) or ((sz, sy, sx) in special_map)
                    if is_pre_valid:
                        active_synapses.append((post_idx, k, w0))

        results = []
        for post_idx, k, w0 in active_synapses:
            tester.synapse_ko_mask.fill(False)
            tester.synapse_ko_mask[post_idx, k] = True
            tester.reset()
            tester.step(
                inner_steps=1000,
                enable_learning=self.enable_learning,
                enable_dopamine=self.enable_dopamine,
                enable_sleep=self.enable_sleep,
                record_history=False,
            )
            ko_e = tester.energy
            drop = base_energy - ko_e
            results.append((drop, ko_e, post_idx, k, w0))

        results.sort(key=lambda x: (round(x[0], 6), round(abs(x[0]), 6)), reverse=True)

        self.lbl_scan_base.config(
            text=f"✅ シナプス単独切断スキャン完了 ({len(results)}本)！ 基準E: {base_energy:.4f} ｜ ダブルクリックでその結合を実験切断/復元(sig不変)"
        )

        for item in self.tree_scan.get_children():
            self.tree_scan.delete(item)
        self._scan_item_coords.clear()
        self._scan_item_synapses.clear()

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x

        for rank, (drop, ko_e, post_idx, k, w0) in enumerate(results, start=1):
            pz = ((post_idx >> (self.dim * 2)) & (self.N - 1)) + 1
            py = ((post_idx >> self.dim) & (self.N - 1)) + 1
            px = ((post_idx >> 0) & (self.N - 1)) + 1
            sz, sy, sx = int(conn_z[post_idx, k]), int(conn_y[post_idx, k]), int(conn_x[post_idx, k])

            pre_n, _ = format_coord_label(sz, sy, sx, self.N)
            post_n, _ = format_coord_label(pz, py, px, self.N)
            p_pair = f"P[{sz},{sy},{sx}]➔P[{pz},{py},{px}]"

            role_parts = [f"w={w0:.2f}"]
            if k == 27:
                role_parts.append("[28th]")
            sp_pre = special_map.get((sz, sy, sx), "")
            sp_post = special_map.get((pz, py, px), "")
            if sp_pre:
                role_parts.append(sp_pre)
            if sp_post:
                role_parts.append(f"➔{sp_post}")
            if self.brain.synapse_ko_mask[post_idx, k]:
                role_parts.insert(0, "[切断中]")

            delta_e = ko_e - base_energy
            item_id = self.tree_scan.insert(
                "",
                tk.END,
                values=(
                    f"{rank}位",
                    f"{pre_n} ➔ {post_n}",
                    p_pair,
                    f"{ko_e:.4f}",
                    f"{delta_e:+.4f}",
                    " ".join(role_parts),
                ),
            )
            self._scan_item_synapses[item_id] = (post_idx, k, (sz, sy, sx), (pz, py, px))

    # ==========================================================================
    # パラメータ・セル編集・ファイル入出力
    # ==========================================================================
    def _on_flag_slider_move(self, key: str, val: float):
        if self._updating_ui_vars:
            return
        v = float(np.clip(val, 0.0, 1.0))
        self.flag_str_vars[key].set(f"{v:.2f}")
        if key == "enable_learning":
            self.enable_learning = v
        elif key == "enable_dopamine":
            self.enable_dopamine = v
        elif key == "enable_sleep":
            self.enable_sleep = v
        self._render_matplotlib_state()

    def _on_cfg_slider_move(self, key: str, val: float):
        if self._updating_ui_vars:
            return
        self.cfg_flag_str_vars[key].set(f"{float(np.clip(val, 0.0, 1.0)):.2f}")

    def _apply_global_params_from_ui(self):
        self.root.focus_set()
        try:
            self.sim_params["base_output"] = np.float16(np.clip(float(self.param_vars["base_output"].get()), 1e-5, 1.0))
            self.sim_params["beta"] = np.float16(np.clip(float(self.param_vars["beta"].get()), 0.1, 100.0))
            self.sim_params["k_refill"] = np.float16(np.clip(float(self.param_vars["k_refill"].get()), 0.0, 1.0))

            mult = int(float(self.param_vars["multiplier"].get()))
            self.sim_params["multiplier"] = (mult | 1) & (self.TOTAL_N - 1) if self.TOTAL_N > 1 else 1
            self.sim_params["bias"] = int(float(self.param_vars["bias"].get())) & (self.TOTAL_N - 1)

            self.sim_params["learning_rate"] = np.float16(np.clip(float(self.param_vars["learning_rate"].get()), 0.0, 1.0))
            self.sim_params["forget_rate"] = np.float16(np.clip(float(self.param_vars["forget_rate"].get()), 0.0, 1.0))
            self.sim_params["learning_threshold"] = np.float16(np.clip(float(self.param_vars["learning_threshold"].get()), 0.0, 1.0))
            self.sim_params["tag_decay"] = np.float16(np.clip(float(self.param_vars["tag_decay"].get()), 0.0, 1.0))

            self.meta_step = int(float(self.param_vars["step"].get()))
            self.meta_score = float(self.param_vars["score"].get())

            self.enable_learning = float(np.clip(float(self.flag_str_vars["enable_learning"].get()), 0.0, 1.0))
            self.enable_dopamine = float(np.clip(float(self.flag_str_vars["enable_dopamine"].get()), 0.0, 1.0))
            self.enable_sleep = float(np.clip(float(self.flag_str_vars["enable_sleep"].get()), 0.0, 1.0))

            if "in_ports_fi" not in self.sim_params:
                self.sim_params.update(get_default_inout_fi(self.dim))

            for i in range(NUM_IN_PORTS):
                k = f"in_fi_{i}"
                if k in self.param_vars:
                    parts = [int(p.strip()) for p in self.param_vars[k].get().split(",")]
                    if len(parts) == 3:
                        self.sim_params["in_ports_fi"][i] = np.array(parts, dtype=np.int32)

            for j in range(NUM_OUT_PORTS):
                k = f"out_fi_{j}"
                if k in self.param_vars:
                    parts = [int(p.strip()) for p in self.param_vars[k].get().split(",")]
                    if len(parts) == 3:
                        self.sim_params["out_ports_fi"][j] = np.array(parts, dtype=np.int32)

            # 後方互換キーも更新
            if NUM_IN_PORTS >= 1: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if NUM_IN_PORTS >= 2: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
            if NUM_OUT_PORTS >= 1: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if NUM_OUT_PORTS >= 2: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]
        except ValueError:
            pass

        self._sync_genes_to_brain()
        self._refresh_all_views()

    def _apply_cell_edits_from_ui(self):
        """ユーザーがセル編集パネルで Enter または『値反映』を押したときのみ遺伝子配列を更新"""
        self.root.focus_set()
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        for c in range(4):
            try:
                val_str = self.sig_pre_vars[c].get()
                if val_str != f"{float(self.sig_pre[z, y, x, c]):.4f}":
                    self.sig_pre[z, y, x, c] = np.float16(np.clip(float(val_str), -1.0, 1.0))
            except ValueError:
                pass
            try:
                val_str = self.sig_post_vars[c].get()
                if val_str != f"{float(self.sig_post[z, y, x, c]):.4f}":
                    self.sig_post[z, y, x, c] = np.float16(np.clip(float(val_str), -1.0, 1.0))
            except ValueError:
                pass

        self.brain.knockout_np2[z, y, x] = bool(self.cell_ko_var.get())
        if self.brain.knockout_np2[z, y, x]:
            self.brain.outputs_np2[z, y, x] = np.float16(0.0)

        if (1 <= z <= self.N) and (1 <= y <= self.N) and (1 <= x <= self.N):
            iz, iy, ix = z - 1, y - 1, x - 1
            self.inhib_bits[iz, iy, ix] = bool(self.cell_inhib_var.get())
            try:
                val_str = self.cell_dop_var.get()
                if val_str != f"{float(self.dopamine[iz, iy, ix]):.4f}":
                    self.dopamine[iz, iy, ix] = np.float16(np.clip(float(val_str), 0.0, 1.0))
            except ValueError:
                pass
            try:
                val_str = self.cell_slp_var.get()
                if val_str != f"{float(self.sleep[iz, iy, ix]):.4f}":
                    self.sleep[iz, iy, ix] = np.float16(np.clip(float(val_str), 0.0, 1.0))
            except ValueError:
                pass

        self._sync_genes_to_brain()
        self._refresh_all_views()

    def action_zero_selected_cell_sigs(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        self.sig_pre[z, y, x, :] = np.float16(0.0)
        self.sig_post[z, y, x, :] = np.float16(0.0)
        self._sync_genes_to_brain()
        self._refresh_all_views()

    def action_set_wire_src(self):
        self.wire_src = (self.sel_z, self.sel_y, self.sel_x)
        n_s, p_s = format_coord_label(*self.wire_src, self.N)
        self.lbl_wire_src.config(text=f"起点(Pre): {n_s}")
        self._redraw_grid_canvas()

    def action_connect_wire(self):
        if self.wire_src is None:
            messagebox.showinfo("クイック配線", "先に起点(Pre)セルを選択して「現在セルをPreに指定」を押してください。")
            return
        sz, sy, sx = self.wire_src
        dz, dy, dx = self.sel_z, self.sel_y, self.sel_x
        ch = int(self.wire_ch_var.get())
        self.sig_pre[sz, sy, sx, ch] = np.float16(1.0)
        self.sig_post[dz, dy, dx, ch] = np.float16(1.0)
        self._sync_genes_to_brain()
        self._refresh_all_views()

    def action_reset_default_params(self):
        self.sim_params.update({
            "base_output": np.float16(0.02),
            "beta": np.float16(20.0),
            "k_refill": np.float16(0.15),
            "multiplier": 1,
            "bias": 0,
            "learning_rate": np.float16(0.1),
            "forget_rate": np.float16(0.05),
            "learning_threshold": np.float16(0.5),
            "tag_decay": np.float16(0.9),
        })
        self.sim_params.update(get_default_inout_fi(self.dim))
        self._sync_genes_to_brain(force_reset=True)
        self._refresh_all_views()

    def action_clear_sigs(self):
        self.sig_pre.fill(0.0)
        self.sig_post.fill(0.0)
        self._sync_genes_to_brain(force_reset=True)
        self._refresh_all_views()

    def action_randomize_sigs(self):
        rng = np.random.default_rng()
        self.sig_pre = rng.uniform(-1.0, 1.0, size=(self.P, self.P, self.P, 4)).astype(np.float16)
        self.sig_post = rng.uniform(-1.0, 1.0, size=(self.P, self.P, self.P, 4)).astype(np.float16)
        self._sync_genes_to_brain(force_reset=True)
        self._refresh_all_views()

    def action_set_all_inhib(self, is_inhib: bool):
        self.inhib_bits.fill(is_inhib)
        self._sync_genes_to_brain()
        self._refresh_all_views()

    def action_new_gene(self, dim: int):
        old_dim = self.dim
        self.current_file_path = None
        self._init_blank_gene(dim=dim)
        if dim != old_dim:
            self._rebuild_matplotlib_figures()
        self._refresh_all_views()

    def action_open_dialog(self):
        initial_dir = get_smart_npz_initial_dir(self.last_opened_dir or self.current_file_path)
        file_path = filedialog.askopenfilename(
            title="観察・編集する太陽光エリート個体 (.npz) を選択してください",
            initialdir=initial_dir,
            filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")],
        )
        if file_path:
            self.load_npz_file(file_path)

    def load_npz_file(self, file_path: str):
        try:
            old_dim = self.dim
            sig_pre, sig_post, dop_flat, slp_flat, inhib_flat, params, spec = load_elite_npz(file_path)
            self._init_blank_gene(dim=spec["dim"])

            self.sig_pre = np.clip(sig_pre, -1.0, 1.0).astype(np.float16)
            self.sig_post = np.clip(sig_post, -1.0, 1.0).astype(np.float16)

            for iz in range(self.N):
                for iy in range(self.N):
                    for ix in range(self.N):
                        idx = self._coord_n_to_idx(iz, iy, ix)
                        self.dopamine[iz, iy, ix] = dop_flat[idx]
                        self.sleep[iz, iy, ix] = slp_flat[idx]
                        self.inhib_bits[iz, iy, ix] = bool(inhib_flat[idx] < 0)

            self.meta_step = params["step"]
            self.meta_score = params["score"]
            self.enable_learning = float(np.clip(float(ENABLE_LEARNING), 0.0, 1.0))
            self.enable_dopamine = float(np.clip(float(ENABLE_DOPAMINE), 0.0, 1.0))
            self.enable_sleep = float(np.clip(float(ENABLE_SLEEP), 0.0, 1.0))

            for k in ("base_output", "beta", "k_refill", "multiplier", "bias", "learning_rate", "forget_rate", "learning_threshold", "tag_decay"):
                self.sim_params[k] = params[k]
            if "in_ports_fi" in params:
                self.sim_params["in_ports_fi"] = params["in_ports_fi"]
            if "out_ports_fi" in params:
                self.sim_params["out_ports_fi"] = params["out_ports_fi"]
            for k in ("light_in_fi", "battery_in_fi", "gen_neg_out_fi", "gen_pos_out_fi", "speed_out_fi", "rotate_out_fi"):
                if k in params:
                    self.sim_params[k] = params[k]

            self.current_file_path = file_path
            self.last_opened_dir = os.path.dirname(os.path.abspath(file_path))
            self._mpl_bg = None
            self._sync_genes_to_brain(force_reset=True)

            if self.dim != old_dim or not hasattr(self, "fig"):
                self._rebuild_matplotlib_figures()
            self._refresh_all_views()
            self._render_matplotlib_state(force_full=True)

            if params.get("is_corrupted_u8", False):
                if messagebox.askyesno(
                    "破損パラメータの検出",
                    f"'{os.path.basename(file_path)}' の神経パラメータ (resource_* 等) は\n"
                    f"旧バージョンのバグにより uint8 バイト値 (base_output={float(self.sim_params['base_output'])}) として保存されています。\n\n"
                    f"神経パラメータを標準値にリセットしますか？",
                ):
                    self.action_reset_default_params()

        except Exception as e:
            messagebox.showerror("読み込みエラー", f"ファイルの読み込みに失敗しました:\n{e}")

    def _save_to_path(self, save_path: str):
        self._apply_global_params_from_ui()
        self._apply_cell_edits_from_ui()

        dop_flat, slp_flat, _ = self._get_flat_arrays_for_sim()
        packed_inhib = self._pack_inhib_uint32()

        os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
        np.savez_compressed(
            save_path,
            step=np.int64(self.meta_step),
            score=np.float64(self.meta_score),
            enable_learning=np.float16(self.enable_learning),
            enable_dopamine=np.float16(self.enable_dopamine),
            enable_sleep=np.float16(self.enable_sleep),
            sig_pre=self.sig_pre.reshape(-1).astype(np.float16),
            sig_post=self.sig_post.reshape(-1).astype(np.float16),
            dopamine=dop_flat.astype(np.float16),
            sleep=slp_flat.astype(np.float16),
            inhib=packed_inhib.astype(np.uint32),
            resource_base_output=np.float16(self.sim_params["base_output"]),
            resource_beta=np.float16(self.sim_params["beta"]),
            resource_k_refill=np.float16(self.sim_params["k_refill"]),
            link_multiplier=np.int32(self.sim_params["multiplier"]),
            link_bias=np.int32(self.sim_params["bias"]),
            learn_rate=np.float16(self.sim_params["learning_rate"]),
            learn_forget=np.float16(self.sim_params["forget_rate"]),
            learn_threshold=np.float16(self.sim_params["learning_threshold"]),
            learn_decay=np.float16(self.sim_params["tag_decay"]),
            in_ports_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"]), dtype=np.int32),
            out_ports_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"]), dtype=np.int32),
            light_in_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[0] if NUM_IN_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            battery_in_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[1] if NUM_IN_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            gen_pos_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[0] if NUM_OUT_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            gen_neg_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[1] if NUM_OUT_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            speed_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[2] if NUM_OUT_PORTS >= 3 else [0, 0, 0], dtype=np.int32),
            rotate_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[3] if NUM_OUT_PORTS >= 4 else [0, 0, 0], dtype=np.int32),
        )
        self.current_file_path = save_path
        self.last_opened_dir = os.path.dirname(os.path.abspath(save_path))
        self._refresh_all_views()

    def action_save_overwrite(self):
        if not self.current_file_path:
            self.action_save_as()
            return
        if messagebox.askyesno("上書き保存の確認", f"以下のファイルに上書き保存しますか？\n\n{self.current_file_path}"):
            self._save_to_path(self.current_file_path)
            messagebox.showinfo("保存完了", f"上書き保存しました:\n{self.current_file_path}")

    def action_save_as(self):
        initial_dir = self.last_opened_dir or (os.path.abspath("backups/elites") if os.path.exists("backups/elites") else os.getcwd())
        os.makedirs(initial_dir, exist_ok=True)
        default_name = os.path.basename(self.current_file_path) if self.current_file_path else f"custom_dim{self.dim}_energy{self.meta_score:.3f}.npz"
        save_path = filedialog.asksaveasfilename(
            title="遺伝子を新規保存 (名前を付けて保存)",
            initialdir=initial_dir,
            initialfile=default_name,
            defaultextension=".npz",
            filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")],
        )
        if not save_path:
            return
        self._save_to_path(save_path)
        messagebox.showinfo("保存完了", f"新規保存しました:\n{save_path}")

    # ==========================================================================
    # sim_config.py 編集・保存 ＆ 外部スクリプト (voxelBrain.py / analyze.py) 実行管理
    # ==========================================================================
    def action_save_and_apply_sim_config(self, show_msg: bool = True):
        """UI上の sim_config 設定を sim_config.py に書き出し、OneSim 内部の実行時定数にも即時反映する"""
        global ENABLE_LEARNING, ENABLE_DOPAMINE, ENABLE_SLEEP
        global NUM_IN_PORTS, NUM_OUT_PORTS
        global INITIAL_ENERGY, METABOLIC_COST, GEN_COST_RATE, SOLAR_GAIN_RATE, SUN_CYCLE_PERIOD, SPEED_GAIN, ROTATE_GAIN

        try:
            en_learn = float(np.clip(float(self.cfg_flag_str_vars["ENABLE_LEARNING"].get()), 0.0, 1.0))
            en_dop = float(np.clip(float(self.cfg_flag_str_vars["ENABLE_DOPAMINE"].get()), 0.0, 1.0))
            en_slp = float(np.clip(float(self.cfg_flag_str_vars["ENABLE_SLEEP"].get()), 0.0, 1.0))

            num_in = max(1, int(self.cfg_num_vars["NUM_IN_PORTS"].get()))
            num_out = max(1, int(self.cfg_num_vars["NUM_OUT_PORTS"].get()))
            init_e = float(self.cfg_num_vars["INITIAL_ENERGY"].get())
            meta_c = float(self.cfg_num_vars["METABOLIC_COST"].get())
            gen_c = float(self.cfg_num_vars["GEN_COST_RATE"].get())
            sol_g = float(self.cfg_num_vars["SOLAR_GAIN_RATE"].get())
            sun_p = max(1.0, float(self.cfg_num_vars["SUN_CYCLE_PERIOD"].get()))
            spd_g = float(self.cfg_num_vars["SPEED_GAIN"].get())
            rot_g = float(self.cfg_num_vars["ROTATE_GAIN"].get())
        except ValueError as e:
            messagebox.showerror("入力エラー", f"sim_config の数値形式が正しくありません:\n{e}")
            return

        ENABLE_LEARNING = en_learn
        ENABLE_DOPAMINE = en_dop
        ENABLE_SLEEP = en_slp
        NUM_IN_PORTS = num_in
        NUM_OUT_PORTS = num_out
        INITIAL_ENERGY = init_e
        METABOLIC_COST = meta_c
        GEN_COST_RATE = gen_c
        SOLAR_GAIN_RATE = sol_g
        SUN_CYCLE_PERIOD = sun_p
        SPEED_GAIN = spd_g
        ROTATE_GAIN = rot_g

        self._updating_ui_vars = True
        try:
            self.cfg_flag_vars["ENABLE_LEARNING"].set(en_learn)
            self.cfg_flag_vars["ENABLE_DOPAMINE"].set(en_dop)
            self.cfg_flag_vars["ENABLE_SLEEP"].set(en_slp)
            self.cfg_flag_str_vars["ENABLE_LEARNING"].set(f"{en_learn:.2f}")
            self.cfg_flag_str_vars["ENABLE_DOPAMINE"].set(f"{en_dop:.2f}")
            self.cfg_flag_str_vars["ENABLE_SLEEP"].set(f"{en_slp:.2f}")

            self.enable_learning = en_learn
            self.enable_dopamine = en_dop
            self.enable_sleep = en_slp
            self.flag_vars["enable_learning"].set(en_learn)
            self.flag_vars["enable_dopamine"].set(en_dop)
            self.flag_vars["enable_sleep"].set(en_slp)
            self.flag_str_vars["enable_learning"].set(f"{en_learn:.2f}")
            self.flag_str_vars["enable_dopamine"].set(f"{en_dop:.2f}")
            self.flag_str_vars["enable_sleep"].set(f"{en_slp:.2f}")
        finally:
            self._updating_ui_vars = False

        cfg_content = (
            f"# ==============================================================================\n"
            f"# 神経ダイナミクス連続有効度合い (0.0 = 無効 〜 1.0 = 最大)\n"
            f"# ==============================================================================\n"
            f"ENABLE_LEARNING = {en_learn}   # 生涯学習（シナプス重み変化量の連続スケール: 0.0 ~ 1.0）\n"
            f"ENABLE_DOPAMINE = {en_dop}   # ドーパミン集計・修飾の有効度合い (0.0 ~ 1.0)\n"
            f"ENABLE_SLEEP    = {en_slp}   # 睡眠（Sleep）集計・出力抑制の有効度合い (0.0 ~ 1.0)\n"
            f"\n"
            f"# ==============================================================================\n"
            f"# 入出力ポート スロット数設定 (固定長スロット方式)\n"
            f"# ==============================================================================\n"
            f"NUM_IN_PORTS  = {num_in}   # 感覚入力ポート（外周膜）のスロット数 (0: light_in, 1: battery_in)\n"
            f"NUM_OUT_PORTS = {num_out}   # 運動出力ポート（内部表面）のスロット数 (0: gen_pos_out, 1: gen_neg_out)\n"
            f"\n"
            f"# ==============================================================================\n"
            f"# 太陽光タスク・エネルギーシミュレーション共通パラメータ\n"
            f"# ==============================================================================\n"
            f"INITIAL_ENERGY    = {init_e}     # 初期エネルギー (0.0=餓死, 1.0=満タン)\n"
            f"METABOLIC_COST    = {meta_c}   # 毎tickの基礎代謝（固定消費）\n"
            f"GEN_COST_RATE     = {gen_c}    # 発電稼働コスト係数\n"
            f"SOLAR_GAIN_RATE   = {sol_g}    # 太陽光発電ゲイン係数\n"
            f"SUN_CYCLE_PERIOD  = {sun_p}     # 昼夜サイクルの半周期 (tick数)\n"
            f"\n"
            f"# ==============================================================================\n"
            f"# 個体運動パラメータ (身体性・移動ゲイン)\n"
            f"# ==============================================================================\n"
            f"SPEED_GAIN        = {spd_g}    # 前進/後退速度ゲイン (my_speed = speed_out * SPEED_GAIN)\n"
            f"ROTATE_GAIN       = {rot_g}     # 旋回速度ゲイン (my_angle += rotate_out * ROTATE_GAIN)\n"
        )
        cfg_path = os.path.abspath("sim_config.py")
        with open(cfg_path, "w", encoding="utf-8") as f:
            f.write(cfg_content)

        self.root.focus_set()
        if self.auto_reset_on_edit.get():
            self.brain.reset()

        # Figure 全体を破棄・再生成せず、基準線(axhline)のY座標と凡例のみをインプレース更新
        if hasattr(self, "hline_breakeven"):
            breakeven = GEN_COST_RATE / SOLAR_GAIN_RATE if SOLAR_GAIN_RATE > 0 else 0.5
            self.hline_breakeven.set_ydata([breakeven, breakeven])
            self.hline_breakeven.set_label(f"黒字太陽光ライン ({breakeven:.2f})")
            self.ax_solar.legend(loc="upper right", fontsize=8)
        if hasattr(self, "hline_init_energy"):
            self.hline_init_energy.set_ydata([INITIAL_ENERGY, INITIAL_ENERGY])
            self.hline_init_energy.set_label(f"Initial ({INITIAL_ENERGY:.2f})")
            self.ax_energy.legend(loc="lower left", fontsize=8)
        self._mpl_bg = None
        self._refresh_all_views()

        if show_msg:
            self._append_vb_log(f"[sim_config] 保存＆即時反映完了: InPorts={num_in}, OutPorts={num_out}, E0={init_e}, Meta={meta_c}, Cost={gen_c}, Gain={sol_g}, Period={sun_p}\n")

    def action_browse_vb_folder(self):
        init_dir = os.path.abspath(self.vb_folder_var.get())
        if not os.path.exists(init_dir):
            init_dir = os.path.abspath("backups") if os.path.exists("backups") else os.getcwd()
        chosen = filedialog.askdirectory(title="voxelBrain.py に継承させるエリートフォルダを選択", initialdir=init_dir)
        if chosen:
            try:
                rel = os.path.relpath(chosen, os.getcwd())
                self.vb_folder_var.set(rel.replace("\\", "/"))
            except ValueError:
                self.vb_folder_var.set(chosen)
            self.vb_load_var.set(True)

    def action_use_current_folder_for_vb(self):
        if self.current_file_path and os.path.exists(self.current_file_path):
            folder = os.path.dirname(self.current_file_path)
            try:
                rel = os.path.relpath(folder, os.getcwd()).replace("\\", "/")
                self.vb_folder_var.set(rel)
            except ValueError:
                self.vb_folder_var.set(folder)
            self.vb_load_var.set(True)
            self.vb_dim_var.set(self.dim)
            self._append_vb_log(f"[設定] 継承フォルダを '{self.vb_folder_var.get()}' (DIM={self.dim}) にセットしました。\n")
        else:
            messagebox.showinfo("フォルダ未確定", "先に .npz ファイルを開くか保存してください。")

    def _append_vb_log(self, text: str):
        self.txt_vb_log.insert(tk.END, text)
        # 行数が増えすぎないよう最新400行に保つ
        line_count = int(self.txt_vb_log.index("end-1c").split(".")[0])
        if line_count > 400:
            self.txt_vb_log.delete("1.0", f"{line_count - 400}.0")
        self.txt_vb_log.see(tk.END)

    def _poll_vb_log_queue(self):
        """バックグラウンドで実行中の voxelBrain.py からの標準出力を非同期でコンソールに反映"""
        while True:
            try:
                line = self.vb_log_queue.get_nowait()
            except queue.Empty:
                break

            self._append_vb_log(line)

            # 出力から保存された最新エリート .npz や .csv ログパスを自動検出
            if "-> " in line and ".npz" in line:
                cand = line.split("-> ", 1)[1].strip()
                if os.path.exists(cand):
                    self.latest_evolved_npz = os.path.abspath(cand)
                    self.last_opened_dir = os.path.dirname(self.latest_evolved_npz)
            elif "ログ: '" in line and ".csv'" in line:
                cand = line.split("ログ: '", 1)[1].split("'", 1)[0].strip()
                if os.path.exists(cand):
                    self.latest_csv_log = os.path.abspath(cand)

        if self.vb_process is not None and self.vb_process.poll() is not None:
            rc = self.vb_process.returncode
            self.vb_process = None
            self.btn_vb_start.config(state=tk.NORMAL, text="▶️ voxelBrain.py 進化開始")
            self.btn_vb_stop.config(state=tk.DISABLED)
            self.btn_vb_kill.config(state=tk.DISABLED)
            if os.path.exists(self.vb_stop_file):
                try:
                    os.remove(self.vb_stop_file)
                except OSError:
                    pass
            self.last_opened_dir = get_smart_npz_initial_dir()
            self._append_vb_log(f"\n[完了] voxelBrain.py が終了しました (exit code={rc})。\n")

    def action_start_voxelbrain(self):
        """現在の sim_config と指定パラメータで voxelBrain.py をバックグラウンド起動"""
        if self.vb_process is not None and self.vb_process.poll() is None:
            messagebox.showinfo("実行中", "voxelBrain.py は既に実行中です。")
            return

        # まず sim_config.py を保存・同期
        self.action_save_and_apply_sim_config(show_msg=False)

        if os.path.exists(self.vb_stop_file):
            try:
                os.remove(self.vb_stop_file)
            except OSError:
                pass

        try:
            dim_val = int(self.vb_dim_var.get())
            m_val = max(64, int(self.vb_m_var.get()))
            steps_val = max(1, int(self.vb_steps_var.get()))
        except ValueError as e:
            messagebox.showerror("パラメータエラー", f"個体数 m または Steps の数値が不正です:\n{e}")
            return

        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["VB_DIM"] = str(dim_val)
        env["VB_M"] = str(m_val)
        env["VB_TOTAL_STEPS"] = str(steps_val)
        env["VB_LOAD_ELITES"] = "1" if self.vb_load_var.get() else "0"
        env["VB_LOAD_FOLDER"] = self.vb_folder_var.get().strip()
        env["VB_STOP_FILE"] = self.vb_stop_file

        self.txt_vb_log.delete("1.0", tk.END)
        self._append_vb_log(
            f"[🚀 起動] voxelBrain.py (DIM={dim_val}, m={m_val}, steps={steps_val}, load={self.vb_load_var.get()})\n"
        )

        try:
            self.vb_process = subprocess.Popen(
                [sys.executable, "-u", "voxelBrain.py"],
                cwd=os.getcwd(),
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
        except Exception as e:
            messagebox.showerror("起動エラー", f"voxelBrain.py の起動に失敗しました:\n{e}")
            return

        self.btn_vb_start.config(state=tk.DISABLED, text="🧬 進化実行中...")
        self.btn_vb_stop.config(state=tk.NORMAL)
        self.btn_vb_kill.config(state=tk.NORMAL)

        proc = self.vb_process

        def _reader_thread():
            assert proc.stdout is not None
            for line in proc.stdout:
                self.vb_log_queue.put(line)

        threading.Thread(target=_reader_thread, daemon=True).start()

    def action_stop_voxelbrain_graceful(self):
        """停止シグナルファイルを作成し、voxelBrain.py に現在のステップ完了後・上位20体保存後に安全終了させる"""
        if self.vb_process is None or self.vb_process.poll() is not None:
            return
        with open(self.vb_stop_file, "w", encoding="utf-8") as f:
            f.write("stop\n")
        self._append_vb_log("\n[⏹️ 安全停止要求] 現在のステップ完了後に上位20体を保存して終了します...\n")

    def action_kill_voxelbrain(self):
        """voxelBrain.py を即時強制終了する"""
        if self.vb_process is None or self.vb_process.poll() is not None:
            return
        self.vb_process.kill()
        self._append_vb_log("\n[🚨 強制終了] voxelBrain.py プロセスを強制終了しました。\n")

    def action_load_latest_evolved_elite(self):
        """最新保存された最高エリート個体 (.npz) を自動検索して OneSim に読み込む"""
        target_npz = self.latest_evolved_npz
        if not target_npz or not os.path.exists(target_npz):
            target_npz = get_latest_evolved_elite_path()
        if not target_npz or not os.path.exists(target_npz):
            messagebox.showinfo("エリート未検出", "backups/ 内に .npz ファイルが見つかりませんでした。")
            return

        self.load_npz_file(target_npz)
        self._append_vb_log(f"[📂 読込完了] {target_npz} を OneSim にロードしました。\n")

    def action_plot_latest_csv_log(self, csv_path: str | None = None):
        """最新の進化ログ (logs/log_solar_*.csv) を読み込み、別ウィンドウで学習・進化曲線をプロット＆画像保存する"""
        target_csv = csv_path or self.latest_csv_log
        if not target_csv or not os.path.exists(target_csv):
            csv_files = glob.glob("logs/log_solar_*.csv")
            if not csv_files:
                target_csv = filedialog.askopenfilename(
                    title="表示する進化ログ (.csv) を選択",
                    initialdir=os.path.abspath("logs") if os.path.exists("logs") else os.getcwd(),
                    filetypes=[("CSV Files", "*.csv"), ("All Files", "*.*")],
                )
                if not target_csv:
                    return
            else:
                target_csv = max(csv_files, key=os.path.getmtime)

        def _load_csv_data(path_to_read: str):
            s_l, mx_l, mn_l, g_l, el_l = [], [], [], [], []
            with open(path_to_read, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    s_l.append(int(row["step"]))
                    mx_l.append(float(row["max_energy"]))
                    mn_l.append(float(row["mean_energy"]))
                    g_l.append(int(row["passed_ge2"]))
                    el_l.append(int(row["elite_ge04"]))
            return s_l, mx_l, mn_l, g_l, el_l

        try:
            steps_l, max_e_l, mean_e_l, gained_l, elite_l = _load_csv_data(target_csv)
        except Exception as e:
            messagebox.showerror("CSV読込エラー", f"ログファイルの読み込みに失敗しました:\n{e}")
            return

        if not steps_l:
            messagebox.showinfo("データなし", f"ログファイル '{os.path.basename(target_csv)}' にまだステップデータがありません。")
            return

        win = tk.Toplevel(self.root)
        win.title(f"📈 進化ログ推移: {os.path.basename(target_csv)}")
        win.geometry("860x580")

        current_csv_ref = [target_csv]

        # 上部ツールバー（画像保存・最新更新・別CSV選択）
        top_bar = ttk.Frame(win, padding=5)
        top_bar.pack(side=tk.TOP, fill=tk.X)

        lbl_plot_status = ttk.Label(top_bar, text="", foreground="darkgreen", font=("", 9, "bold"))

        fig_log = Figure(figsize=(8.2, 4.9), dpi=100)
        ax1 = fig_log.add_subplot(2, 1, 1)
        ax2 = fig_log.add_subplot(2, 1, 2, sharex=ax1)

        def _draw_plot(s_l, mx_l, mn_l, g_l, el_l, c_path: str):
            ax1.clear()
            ax2.clear()

            ax1.plot(s_l, mx_l, color="crimson", linewidth=1.8, label=f"Max Energy (最高: {max(mx_l):.4f})")
            ax1.plot(s_l, mn_l, color="royalblue", linewidth=1.5, label=f"Mean Energy (最終: {mn_l[-1]:.4f})")
            ax1.set_title(f"Evolution Energy History ({os.path.basename(c_path)} | Total {len(s_l)} steps)", fontsize=10)
            ax1.set_ylabel("Energy")
            ax1.grid(True, linestyle="--", alpha=0.4)
            ax1.legend(loc="upper left")

            ax2.plot(s_l, g_l, color="seagreen", linewidth=1.6, label=f"黒字個体数 (> Initial) [最終: {g_l[-1]}]")
            ax2.plot(s_l, el_l, color="darkorange", linewidth=1.6, label=f"エリート個体数 (>= 0.4) [最終: {el_l[-1]}]")
            ax2.set_xlabel("Generation / Step")
            ax2.set_ylabel("Agent Count")
            ax2.grid(True, linestyle="--", alpha=0.4)
            ax2.legend(loc="upper left")

            fig_log.tight_layout()

        _draw_plot(steps_l, max_e_l, mean_e_l, gained_l, elite_l, target_csv)

        canvas_log = FigureCanvasTkAgg(fig_log, master=win)
        canvas_log.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        canvas_log.draw()

        def _action_save_plot_image():
            plots_dir = os.path.abspath("backups/plots")
            os.makedirs(plots_dir, exist_ok=True)
            csv_stem = os.path.splitext(os.path.basename(current_csv_ref[0]))[0]
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            default_img = f"evolution_{csv_stem}_{ts}.png"
            save_p = filedialog.asksaveasfilename(
                parent=win,
                title="進化推移グラフを画像として保存",
                initialdir=plots_dir,
                initialfile=default_img,
                defaultextension=".png",
                filetypes=[
                    ("PNG Image (*.png)", "*.png"),
                    ("SVG Vector (*.svg)", "*.svg"),
                    ("PDF Document (*.pdf)", "*.pdf"),
                    ("JPEG Image (*.jpg)", "*.jpg"),
                    ("WebP Image (*.webp)", "*.webp"),
                    ("All Files", "*.*"),
                ],
            )
            if not save_p:
                return
            try:
                os.makedirs(os.path.dirname(os.path.abspath(save_p)), exist_ok=True)
                fig_log.savefig(save_p, dpi=200, bbox_inches="tight", facecolor="white")
                lbl_plot_status.config(text=f"✅ 保存完了: {os.path.basename(save_p)}", foreground="darkgreen")
                self._append_vb_log(f"[📈 グラフ保存] 進化推移グラフを保存しました: {save_p}\n")
            except Exception as ex:
                lbl_plot_status.config(text="❌ 保存失敗", foreground="crimson")
                messagebox.showerror("画像保存エラー", f"グラフ画像の保存に失敗しました:\n{ex}", parent=win)

        def _action_reload_current_csv():
            try:
                s_l, mx_l, mn_l, g_l, el_l = _load_csv_data(current_csv_ref[0])
                if not s_l:
                    return
                _draw_plot(s_l, mx_l, mn_l, g_l, el_l, current_csv_ref[0])
                canvas_log.draw()
                lbl_plot_status.config(text=f"🔄 更新完了 (Step {s_l[-1]})", foreground="royalblue")
            except Exception as ex:
                messagebox.showerror("更新エラー", f"ログの再読込に失敗しました:\n{ex}", parent=win)

        def _action_open_another_csv():
            chosen_csv = filedialog.askopenfilename(
                parent=win,
                title="表示する進化ログ (.csv) を選択",
                initialdir=os.path.abspath("logs") if os.path.exists("logs") else os.getcwd(),
                filetypes=[("CSV Files", "*.csv"), ("All Files", "*.*")],
            )
            if not chosen_csv:
                return
            try:
                s_l, mx_l, mn_l, g_l, el_l = _load_csv_data(chosen_csv)
                if not s_l:
                    messagebox.showinfo("データなし", "選択したCSVにデータがありません。", parent=win)
                    return
                current_csv_ref[0] = chosen_csv
                win.title(f"📈 進化ログ推移: {os.path.basename(chosen_csv)}")
                _draw_plot(s_l, mx_l, mn_l, g_l, el_l, chosen_csv)
                canvas_log.draw()
                lbl_plot_status.config(text=f"📂 読込: {os.path.basename(chosen_csv)}", foreground="royalblue")
            except Exception as ex:
                messagebox.showerror("CSV読込エラー", f"ログの読み込みに失敗しました:\n{ex}", parent=win)

        ttk.Button(top_bar, text="💾 画像として保存 (PNG/SVG/PDF)", command=_action_save_plot_image).pack(side=tk.LEFT, padx=3)
        ttk.Button(top_bar, text="🔄 最新状態に更新", command=_action_reload_current_csv).pack(side=tk.LEFT, padx=3)
        ttk.Button(top_bar, text="📂 別のCSVログを開く...", command=_action_open_another_csv).pack(side=tk.LEFT, padx=3)
        lbl_plot_status.pack(side=tk.LEFT, padx=8)

    def _build_analyze_env(self) -> dict[str, str]:
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        try:
            al_val = float(np.clip(float(self.ana_learn_str_var.get()), 0.0, 1.0))
        except ValueError:
            al_val = float(np.clip(float(self.ana_learn_var.get()), 0.0, 1.0))
        self.ana_learn_var.set(al_val)
        self.ana_learn_str_var.set(f"{al_val:.2f}")
        env["ANALYZE_LEARNING"] = str(al_val)
        try:
            env["ANALYZE_WORLD_SIZE"] = str(float(self.ana_world_var.get()))
        except ValueError:
            env["ANALYZE_WORLD_SIZE"] = "100.0"
        try:
            env["ANALYZE_DT"] = str(float(self.ana_dt_var.get()))
        except ValueError:
            env["ANALYZE_DT"] = "0.01"
        return env

    def action_launch_analyze_current(self):
        """現在 OneSim 上で開いている（または編集中の）個体を一時 .npz に書き出して analyze.py で即座に起動する"""
        self._apply_global_params_from_ui()
        self._apply_cell_edits_from_ui()

        preview_dir = os.path.abspath("backups/edited")
        os.makedirs(preview_dir, exist_ok=True)
        preview_npz = os.path.join(preview_dir, "_onesim_current_analyze.npz")

        dop_flat, slp_flat, _ = self._get_flat_arrays_for_sim()
        packed_inhib = self._pack_inhib_uint32()

        # 現在 KO されているセルがあれば出力側でも同等に無効化したプレビュー用 sig を保存
        sig_pre_export = self.sig_pre.copy()
        sig_post_export = self.sig_post.copy()
        if np.any(self.brain.knockout_np2):
            sig_pre_export[self.brain.knockout_np2] = np.float16(0.0)
            sig_post_export[self.brain.knockout_np2] = np.float16(0.0)

        np.savez_compressed(
            preview_npz,
            step=np.int64(self.meta_step),
            score=np.float64(self.meta_score),
            enable_learning=np.float16(self.enable_learning),
            enable_dopamine=np.float16(self.enable_dopamine),
            enable_sleep=np.float16(self.enable_sleep),
            sig_pre=sig_pre_export.reshape(-1).astype(np.float16),
            sig_post=sig_post_export.reshape(-1).astype(np.float16),
            dopamine=dop_flat.astype(np.float16),
            sleep=slp_flat.astype(np.float16),
            inhib=packed_inhib.astype(np.uint32),
            resource_base_output=np.float16(self.sim_params["base_output"]),
            resource_beta=np.float16(self.sim_params["beta"]),
            resource_k_refill=np.float16(self.sim_params["k_refill"]),
            link_multiplier=np.int32(self.sim_params["multiplier"]),
            link_bias=np.int32(self.sim_params["bias"]),
            learn_rate=np.float16(self.sim_params["learning_rate"]),
            learn_forget=np.float16(self.sim_params["forget_rate"]),
            learn_threshold=np.float16(self.sim_params["learning_threshold"]),
            learn_decay=np.float16(self.sim_params["tag_decay"]),
            in_ports_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"]), dtype=np.int32),
            out_ports_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"]), dtype=np.int32),
            light_in_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[0] if NUM_IN_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            battery_in_fi=np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[1] if NUM_IN_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            gen_pos_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[0] if NUM_OUT_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            gen_neg_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[1] if NUM_OUT_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            speed_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[2] if NUM_OUT_PORTS >= 3 else [0, 0, 0], dtype=np.int32),
            rotate_out_fi=np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[3] if NUM_OUT_PORTS >= 4 else [0, 0, 0], dtype=np.int32),
        )

        env = self._build_analyze_env()
        subprocess.Popen([sys.executable, "analyze.py", preview_npz], cwd=os.getcwd(), env=env)
        self._append_vb_log(f"[🎯 analyze.py] 現在の個体で2Dワールド追跡ビジュアライザを起動しました。\n")

    def action_launch_analyze_dialog(self):
        """ファイル選択ダイアログ付きの analyze.py を起動する"""
        env = self._build_analyze_env()
        subprocess.Popen([sys.executable, "analyze.py"], cwd=os.getcwd(), env=env)
        self._append_vb_log("[🎯 analyze.py] ファイル選択モードで起動しました。\n")


def main():
    selected_file = select_npz_file()
    root = tk.Tk()
    app = IntegratedBrainStudio(root, initial_npz=selected_file if selected_file else None)
    root.mainloop()


if __name__ == "__main__":
    main()
