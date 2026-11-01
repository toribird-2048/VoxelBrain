# onesim/io_npz.py
import os
import glob
import tkinter as tk
from tkinter import filedialog
import numpy as np

import sim_config
from sim_config import (
    NUM_IN_PORTS,
    NUM_OUT_PORTS,
    INITIAL_ENERGY,
)
from onesim.coords import get_default_inout_fi


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
    data = np.load(npz_path)

    if "neuromod" in data:
        neuromod_map = data["neuromod"].astype(np.float16).reshape(-1, 4)
        total_n = neuromod_map.shape[0]
    else:
        # 旧形式npzの互換対応: dopamine を 1つ目 (ch 0), sleep を 2つ目 (ch 1) として解釈
        total_n = int(data["dopamine"].size) if "dopamine" in data else 64
        neuromod_map = np.zeros((total_n, 4), dtype=np.float16)
        if "dopamine" in data:
            neuromod_map[:, 0] = data["dopamine"].astype(np.float16).reshape(total_n)
        if "sleep" in data:
            neuromod_map[:, 1] = data["sleep"].astype(np.float16).reshape(total_n)

    n = int(round(total_n ** (1.0 / 3.0)))
    dim = int(np.log2(n))
    p = n + 2

    sig_pre = data["sig_pre"].astype(np.float16).reshape((p, p, p, 4))
    sig_post = data["sig_post"].astype(np.float16).reshape((p, p, p, 4))

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

    # neuromod 関連パラメータの復元・デフォルト値設定
    if "neuromod_rel_matrix" in data and data["neuromod_rel_matrix"] is not None:
        nm_rel = data["neuromod_rel_matrix"].astype(np.float16).reshape(4, 4)
    else:
        nm_rel = (np.eye(4, dtype=np.float16) * 0.95).astype(np.float16)

    if "neuromod_weight_reaction" in data and data["neuromod_weight_reaction"] is not None:
        nm_react = data["neuromod_weight_reaction"].astype(np.float16).reshape(4, 4)
    else:
        nm_react = np.zeros((4, 4), dtype=np.float16)
        for i in range(4):
            nm_react[i, 2] = np.float16(0.95)

    if "neuromod_diff" in data and data["neuromod_diff"] is not None:
        nm_diff = np.float16(data["neuromod_diff"])
    elif "diff" in data and data["diff"] is not None:
        nm_diff = np.float16(data["diff"])
    else:
        nm_diff = np.float16(0.01)

    params = {
        "base_output": np.float16(data["resource_base_output"]),
        "beta": np.float16(data["resource_beta"]),
        "k_refill": np.float16(data["resource_k_refill"]),
        "multiplier": int(data["link_multiplier"]),
        "bias": int(data["link_bias"]),
        "neuromod_rel_matrix": nm_rel,
        "neuromod_weight_reaction": nm_react,
        "neuromod_diff": nm_diff,
        "step": int(data["step"]) if "step" in data else 0,
        "score": float(data["score"]) if "score" in data else float(INITIAL_ENERGY),
        "is_corrupted_u8": bool(data["resource_base_output"].dtype == np.uint8),
    }

    defaults_fi = get_default_inout_fi(dim)
    if "in_ports_fi" in data:
        loaded_in = np.asarray(data["in_ports_fi"], dtype=np.int32).reshape(-1, 3)
        in_arr = defaults_fi["in_ports_fi"].copy()
        n_ports = min(len(loaded_in), NUM_IN_PORTS)
        in_arr[:n_ports] = loaded_in[:n_ports]
        params["in_ports_fi"] = in_arr
    else:
        in_arr = defaults_fi["in_ports_fi"].copy()
        if "light_in_fi" in data and NUM_IN_PORTS >= 1: in_arr[0] = np.asarray(data["light_in_fi"], dtype=np.int32).reshape(3)
        if "battery_in_fi" in data and NUM_IN_PORTS >= 2: in_arr[1] = np.asarray(data["battery_in_fi"], dtype=np.int32).reshape(3)
        params["in_ports_fi"] = in_arr

    if "out_ports_fi" in data:
        loaded_out = np.asarray(data["out_ports_fi"], dtype=np.int32).reshape(-1, 3)
        out_arr = defaults_fi["out_ports_fi"].copy()
        n_ports = min(len(loaded_out), NUM_OUT_PORTS)
        out_arr[:n_ports] = loaded_out[:n_ports]
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

    # メタ変異パラメータ（mutation.slang）の復元
    mut_keys = [
        "mut_sig_rate", "mut_sig_steps", "mut_sig_max", "mut_sig_diff",
        "mut_neuromod_map_rate", "mut_neuromod_map_steps", "mut_neuromod_map_max", "mut_neuromod_map_diff",
        "mut_neuromod_params_rate", "mut_iicu_rate",
        "mut_resource_rate", "mut_link28th_rate", "mut_mutate_rate",
    ]
    for key in mut_keys:
        if key in data and data[key] is not None:
            params[key] = np.array(data[key])

    spec = {"dim": dim, "n": n, "p": p, "total_n": total_n, "center": n // 2}
    return sig_pre, sig_post, neuromod_map, inhib, params, spec
