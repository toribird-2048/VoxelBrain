# onesim/coords.py
import numpy as np
from sim_config import NUM_IN_PORTS, NUM_OUT_PORTS


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

