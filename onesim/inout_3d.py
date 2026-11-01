# onesim/inout_3d.py
import math
import tkinter as tk
from tkinter import messagebox
import numpy as np

import sim_config
from sim_config import NUM_IN_PORTS, NUM_OUT_PORTS
from onesim.coords import (
    face_index_to_coord_in_p,
    face_index_to_coord_out_p,
    get_default_inout_fi,
)


class InOut3DViewerMixin:
    """3D入出力ポートビューアおよび入出力ポート設定管理 Mixin"""

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

        # 背景・案内表示
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

        in_conn_map = {}
        for ip_idx, fi in enumerate(in_ports):
            c_p = face_index_to_coord_in_p(fi, self.N)
            in_conn_map.setdefault(c_p, []).append(ip_idx)

        out_conn_map = {}
        for op_idx, fi in enumerate(out_ports):
            c_p = face_index_to_coord_out_p(fi, self.N)
            out_conn_map.setdefault(c_p, []).append(op_idx)

        if port_type == "in":
            for f in range(6):
                step = 1 if self.N <= 4 else 2
                for u in range(-1, self.N + 1, step):
                    for v in range(-1, self.N + 1, step):
                        coord_p = face_index_to_coord_in_p((f, u, v), self.N)
                        pz, py, px = coord_p
                        wx, wy, wz = float(px - 1), float(py - 1), float(pz - 1)
                        sx, sy, z2, factor = self._project_3d_point(wx - cen, wy - cen, wz - cen, cx, cy, scale, dist, cos_y, sin_y, cos_p, sin_p, n_norm)
                        cells_to_render.append({
                            "type": "in", "face": f, "u": u, "v": v, "p_coord": coord_p,
                            "sx": sx, "sy": sy, "z2": z2, "factor": factor,
                            "is_connected": (coord_p in in_conn_map),
                            "conn_slots": in_conn_map.get(coord_p, []),
                        })
        else:
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

        cells_to_render.sort(key=lambda item: item["z2"], reverse=True)

        hover_target = self.inout_3d_hover_target
        for item in cells_to_render:
            sx, sy = item["sx"], item["sy"]
            factor = item["factor"]
            is_conn = item["is_connected"]
            conn_slots = item["conn_slots"]
            is_hover = (hover_target and hover_target.get("p_coord") == item["p_coord"])

            is_active_target = False
            if is_conn:
                for s in conn_slots:
                    if (item["type"], s) == self.selected_io_port:
                        is_active_target = True
                        break

            r_hit = max(10.0, 14.0 * factor)
            self.inout_3d_pick_targets.append({
                "face": item["face"], "u": item["u"], "v": item["v"],
                "p_coord": item["p_coord"], "sx": sx, "sy": sy, "r": r_hit, "z2": item["z2"],
                "type": item["type"],
            })

            if is_conn:
                first_slot = conn_slots[0]
                col = self._get_io_port_color(item["type"], first_slot)

                if is_active_target:
                    p_r = max(5.5, 8.5 * factor)
                    cv.create_oval(sx - p_r - 3.5, sy - p_r - 3.5, sx + p_r + 3.5, sy + p_r + 3.5, outline="#ffee58", width=2.0)
                    cv.create_oval(sx - p_r, sy - p_r, sx + p_r, sy + p_r, fill=col, outline="#ffffff", width=2.0)
                    tag_name = self._get_io_port_name(item["type"], first_slot).split(" ")[0]
                    cv.create_text(sx + p_r + 6, sy - 4, text=f"★{tag_name}", anchor=tk.W, fill="#ffee58", font=("", 9, "bold"))
                else:
                    p_r = max(4.0, 6.0 * factor)
                    cv.create_oval(sx - p_r, sy - p_r, sx + p_r, sy + p_r, fill=col, outline="#1a1c24", width=1.5)
                    tag_name = self._get_io_port_name(item["type"], first_slot).split(" ")[0]
                    cv.create_text(sx + p_r + 5, sy - 3, text=tag_name, anchor=tk.W, fill=col, font=("", 8, "bold"))
            else:
                dot_r = max(2.0, 3.2 * factor)
                if is_hover:
                    cv.create_oval(sx - dot_r - 3.0, sy - dot_r - 3.0, sx + dot_r + 3.0, sy + dot_r + 3.0, fill="#00e5ff", outline="#ffffff", width=1.5)
                else:
                    d_col = "#263238" if item["type"] == "in" else "#311b92"
                    cv.create_oval(sx - dot_r, sy - dot_r, sx + dot_r, sy + dot_r, fill=d_col, outline="#37474f", width=1.0)

        if hover_target:
            hsx, hsy = hover_target["sx"], hover_target["sy"]
            htxt = f"Face {hover_target['face']} (u={hover_target['u']}, v={hover_target['v']}) ➔ P{hover_target['p_coord']}"
            cv.create_text(hsx, hsy - 20, text=htxt, fill="#00e5ff", font=("", 10, "bold"))

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
            ex, ey = event.x, event.y
            best_target = None
            min_dist = 22.0
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

                if port_type == "in":
                    self.sim_params["in_ports_fi"][slot] = [target_face, target_u, target_v]
                    if sim_config.NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
                    if sim_config.NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
                else:
                    self.sim_params["out_ports_fi"][slot] = [target_face, target_u, target_v]
                    if sim_config.NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
                    if sim_config.NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

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
            if sim_config.NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if sim_config.NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 0] = face
            if sim_config.NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if sim_config.NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

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
            if sim_config.NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if sim_config.NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 1] = u
            if sim_config.NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if sim_config.NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

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
            if sim_config.NUM_IN_PORTS >= 1 and slot == 0: self.sim_params["light_in_fi"] = self.sim_params["in_ports_fi"][0]
            if sim_config.NUM_IN_PORTS >= 2 and slot == 1: self.sim_params["battery_in_fi"] = self.sim_params["in_ports_fi"][1]
        else:
            self.sim_params["out_ports_fi"][slot, 2] = v
            if sim_config.NUM_OUT_PORTS >= 1 and slot == 0: self.sim_params["gen_pos_out_fi"] = self.sim_params["out_ports_fi"][0]
            if sim_config.NUM_OUT_PORTS >= 2 and slot == 1: self.sim_params["gen_neg_out_fi"] = self.sim_params["out_ports_fi"][1]

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
        self._refresh_cell_inspector()
        self._render_matplotlib_state(force_full=True)
        self._redraw_grid_canvas()

    def action_add_in_port(self):
        """新しい入力ポートを追加"""
        in_p = self.sim_params.get("in_ports_fi", np.zeros((0, 3), dtype=np.int32))
        new_row = np.array([[2, self.N // 2, self.N // 2]], dtype=np.int32)
        self.sim_params["in_ports_fi"] = np.vstack([in_p, new_row])
        sim_config.NUM_IN_PORTS = max(sim_config.NUM_IN_PORTS, len(self.sim_params["in_ports_fi"]))

        self.selected_io_port = ("in", len(self.sim_params["in_ports_fi"]) - 1)
        self._sync_genes_to_brain()
        self._draw_inout_wiring()
        self._draw_inout_3d_map()
        self._update_io_inspector_ui()
        self._render_matplotlib_state()
        self._append_vb_log(f"[I/O配線盤] 入力ポート #{self.selected_io_port[1]} を追加しました。\n")

    def action_add_out_port(self):
        """新しい出力ポートを追加"""
        out_p = self.sim_params.get("out_ports_fi", np.zeros((0, 3), dtype=np.int32))
        new_row = np.array([[1, self.N // 2, self.N // 2]], dtype=np.int32)
        self.sim_params["out_ports_fi"] = np.vstack([out_p, new_row])
        sim_config.NUM_OUT_PORTS = max(sim_config.NUM_OUT_PORTS, len(self.sim_params["out_ports_fi"]))

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
        sim_config.NUM_IN_PORTS = len(self.sim_params["in_ports_fi"])
        sim_config.NUM_OUT_PORTS = len(self.sim_params["out_ports_fi"])
        if hasattr(self, "cfg_num_vars") and "NUM_IN_PORTS" in self.cfg_num_vars:
            self.cfg_num_vars["NUM_IN_PORTS"].set(str(sim_config.NUM_IN_PORTS))
            self.cfg_num_vars["NUM_OUT_PORTS"].set(str(sim_config.NUM_OUT_PORTS))
        self.action_save_and_apply_sim_config(show_msg=True)
        messagebox.showinfo("sim_config 反映", f"sim_config.py に以下を反映保存しました:\n\nNUM_IN_PORTS = {sim_config.NUM_IN_PORTS}\nNUM_OUT_PORTS = {sim_config.NUM_OUT_PORTS}")

