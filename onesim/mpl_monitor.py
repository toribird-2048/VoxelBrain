# onesim/mpl_monitor.py
import os
import math
import tkinter as tk
import numpy as np
import matplotlib
from matplotlib.figure import Figure
from matplotlib.patches import Rectangle, Circle
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

from sim_config import (
    INITIAL_ENERGY,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SPEED_GAIN,
    ROTATE_GAIN,
)
from onesim.sim_cpu import HISTORY_LEN


class MplMonitorMixin:
    """Matplotlibによるリアルタイムグラフ描画・モニタリング Mixin"""

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

        # 2. グラフ操作・表示モード切替バー
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
            text="📍 Page 1: 個体位置マップ (Position)",
            font=("", 8, "bold"),
            command=lambda: self.action_set_graph_page(1),
            relief=tk.RAISED,
            bd=1,
            padx=12,
            pady=2,
            cursor="hand2",
        )
        self.btn_page_pos.pack(side=tk.LEFT, padx=3)

        self.btn_page_signals = tk.Button(
            graph_ctrl_bar,
            text="🧪 Page 2: 神経修飾物質マップ (Neuromodulators [0..3])",
            font=("", 8, "bold"),
            command=lambda: self.action_set_graph_page(2),
            relief=tk.RAISED,
            bd=1,
            padx=12,
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

        field_rect = Rectangle((-2.0, -2.0), 4.0, 4.0, fill=False, edgecolor="#78909c", linestyle="--", linewidth=1.2, alpha=0.7)
        self.ax_pos.add_patch(field_rect)
        self.ax_pos.axhline(0, color="#546e7a", linestyle=":", alpha=0.35, linewidth=0.8)
        self.ax_pos.axvline(0, color="#546e7a", linestyle=":", alpha=0.35, linewidth=0.8)

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

        self.line_traj, = self.ax_pos.plot([], [], color="#00e5ff", linewidth=1.8, alpha=0.75, label="Trajectory", zorder=4)

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

        # 右上 (Page 2): 4チャンネル神経修飾物質 (Neuromodulators [0..3]) 空間発火ヒートマップ (2x2)
        gs_nm = gs_main[0, 1].subgridspec(2, 2, wspace=0.18, hspace=0.28)
        self.ax_nm = []
        self.im_nm = []
        nm_cmaps = ["Blues", "Purples", "Greens", "Oranges"]
        nm_titles = ["🧪 NM[0] (Ch0)", "🧪 NM[1] (Ch1)", "🧪 NM[2] (Ch2)", "🧪 NM[3] (Ch3)"]

        t_cols = 2 if self.N <= 4 else 4
        t_rows = (self.N + t_cols - 1) // t_cols
        dummy_tile = np.zeros((t_rows * self.N, t_cols * self.N), dtype=np.float32)

        for i in range(4):
            r, c = divmod(i, 2)
            ax = self.fig.add_subplot(gs_nm[r, c])
            ax.set_title(nm_titles[i], fontsize=8.0, pad=2)
            im = ax.imshow(dummy_tile, cmap=nm_cmaps[i], vmin=0.0, vmax=0.2, origin="lower")
            ax.set_xticks([])
            ax.set_yticks([])
            # スライスタイル境界線
            for sc in range(1, t_cols):
                ax.axvline(sc * self.N - 0.5, color="#555", linestyle=":", alpha=0.6, linewidth=0.8)
            for sr in range(1, t_rows):
                ax.axhline(sr * self.N - 0.5, color="#555", linestyle=":", alpha=0.6, linewidth=0.8)
            self.ax_nm.append(ax)
            self.im_nm.append(im)

        self._set_page_axes_visibility()
        self._update_graph_page_button_styles()

        # 右下: 脳の全Zスライス表示
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

            sel_rect = Rectangle((-0.5, -0.5), 1.0, 1.0, fill=False, edgecolor="#ffff00", linewidth=2.2, visible=False)
            ax_s.add_patch(sel_rect)
            self.slice_sel_rects.append(sel_rect)

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

        self.mpl_canvas = FigureCanvasTkAgg(self.fig, master=self.sim_frame)
        tk_w = self.mpl_canvas.get_tk_widget()
        tk_w.pack(fill=tk.BOTH, expand=True)
        tk_w.bind("<Configure>", self._on_mpl_canvas_configure)
        self.mpl_canvas.mpl_connect("button_press_event", self._on_mpl_slice_click)

    def _make_slice_tile(self, vol_3d):
        """(N, N, N) の 3D 空間をひと目で全ニューロン俯瞰できる 2D タイル画像に変換"""
        t_cols = 2 if self.N <= 4 else 4
        t_rows = (self.N + t_cols - 1) // t_cols
        tile = np.zeros((t_rows * self.N, t_cols * self.N), dtype=np.float32)
        for iz in range(self.N):
            r, c = divmod(iz, t_cols)
            tile[r * self.N : (r + 1) * self.N, c * self.N : (c + 1) * self.N] = vol_3d[iz]
        return tile

    def _set_page_axes_visibility(self):
        """現在の graph_page (1: 空間移動, 2: 神経修飾物質マップ) に応じて Axes の表示/非表示を設定"""
        is_p1 = (self.graph_page == 1)
        is_p2 = (self.graph_page == 2)

        if hasattr(self, "ax_pos"):
            self.ax_pos.set_visible(is_p1)
        if hasattr(self, "ax_nm"):
            for ax in self.ax_nm:
                ax.set_visible(is_p2)

    def _update_graph_page_button_styles(self):
        """右上グラフ切替ボタンの見た目を更新"""
        if not hasattr(self, "btn_page_pos") or not hasattr(self, "btn_page_signals"):
            return
        
        # Page 1
        if self.graph_page == 1:
            self.btn_page_pos.config(bg="#00b0ff", fg="#000000", relief=tk.SUNKEN, font=("", 8, "bold"))
            self.btn_page_signals.config(bg="#2e3240", fg="#90a4ae", relief=tk.RAISED, font=("", 8))
        else:
            self.btn_page_pos.config(bg="#2e3240", fg="#90a4ae", relief=tk.RAISED, font=("", 8))
            self.btn_page_signals.config(bg="#d500f9", fg="#ffffff", relief=tk.SUNKEN, font=("", 8, "bold"))

    def action_set_graph_page(self, page: int):
        """右上グラフの表示ページを指定 (1: 個体位置マップ / 2: 神経修飾物質空間発火マップ)"""
        self.graph_page = 1 if int(page) == 1 else 2
        self._set_page_axes_visibility()
        self._mpl_bg = None
        self._update_graph_page_button_styles()
        self._render_matplotlib_state(force_full=True)
        if hasattr(self, "mpl_canvas"):
            self.mpl_canvas.draw_idle()

    def action_toggle_graph_page(self):
        """P キーで右上グラフのページをトグル切り替え (1 <-> 2)"""
        new_page = 2 if getattr(self, "graph_page", 1) == 1 else 1
        self.action_set_graph_page(new_page)

    def _on_mpl_canvas_configure(self, event):
        new_size = (event.width, event.height)
        if new_size != self._last_canvas_size and event.width > 50 and event.height > 50:
            self._last_canvas_size = new_size
            self._mpl_bg = None

    def _cache_mpl_backgrounds(self):
        """静的背景をキャッシュしてBlit描画を高速化"""
        if not hasattr(self, "mpl_canvas"):
            return
        dyn_artists = [
            self.line_sun,
            self.line_gen,
            self.line_energy,
            self.info_text,
        ]
        if hasattr(self, "ax_pos") and self.ax_pos.get_visible():
            if hasattr(self, "target_bonus_circle"):
                dyn_artists.append(self.target_bonus_circle)
            dyn_artists.extend([
                self.target_scatter,
                self.line_traj,
                self.agent_scatter,
                self.line_agent_dir,
                self.txt_pos_hud,
            ])
        if hasattr(self, "im_nm") and self.graph_page == 2:
            dyn_artists.extend(self.im_nm)

        for a in dyn_artists:
            a.set_visible(False)
        self.mpl_canvas.draw()
        self._mpl_bg = self.mpl_canvas.copy_from_bbox(self.fig.bbox)
        for a in dyn_artists:
            a.set_visible(True)

    def _on_mpl_slice_click(self, event):
        """Matplotlib の Zスライスヒートマップ上でのクリックイベント"""
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
            if force_full or (self._mpl_bg is None):
                self._cache_mpl_backgrounds()
            if hasattr(self, "mpl_canvas"):
                self.mpl_canvas.draw_idle()
            return

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
            need_bg_rebuild = True

        self.line_sun.set_data(steps, self.brain.sun_history)
        self.line_gen.set_data(steps, self.brain.gen_history)
        self.line_energy.set_data(steps, self.brain.energy_history)

        internal_outputs = self.brain.outputs_np2[1:self.N+1, 1:self.N+1, 1:self.N+1].astype(np.float32)
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
            f"File: {fname} ({self.N}³) | KO:{ko_count} SynCut:{syn_cut_count} | {state_str}"
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
                f"Status: {state_str}\n"
                f"Step: {self.brain.inner_step_counter:4d} | {day_night} (Sun: {self.brain.current_sunlight:.2f})\n"
                f"Energy: {self.brain.energy:.4f} ({self.brain.energy - INITIAL_ENERGY:+.4f}) | Gen: {self.brain.generator_power:.3f} (Coeff: {self.brain.energy_coeff:.2f}x)\n"
                f"Speed: {self.brain.speed * SPEED_GAIN:+.3f} (raw:{self.brain.speed:+.2f}) | Rotate: {self.brain.rotate * ROTATE_GAIN:+.3f} (raw:{self.brain.rotate:+.2f}) | Dist: {dist_to_obj:.2f}\n"
                f"Mean |Output|: {mean_out:.4f} | Flicker: {self.brain.flicker_rate:.1%} | R: {mean_r:.3f}"
            )

        if self.graph_page == 1 and hasattr(self, "ax_pos"):
            obj_pos = self.brain.obj_pos
            self.target_scatter.set_offsets([obj_pos])
            if hasattr(self, "target_bonus_circle"):
                self.target_bonus_circle.center = (float(obj_pos[0]), float(obj_pos[1]))

            if hasattr(self.brain, "pos_history") and self.brain.pos_history:
                traj_pts = np.asarray(self.brain.pos_history, dtype=np.float32)
                self.line_traj.set_data(traj_pts[:, 0], traj_pts[:, 1])
            else:
                self.line_traj.set_data([self.brain.pos[0]], [self.brain.pos[1]])

            self.agent_scatter.set_offsets([self.brain.pos])
            dir_len = 0.35
            hx = float(self.brain.pos[0] + np.cos(self.brain.angle) * dir_len)
            hy = float(self.brain.pos[1] + np.sin(self.brain.angle) * dir_len)
            self.line_agent_dir.set_data([self.brain.pos[0], hx], [self.brain.pos[1], hy])

            self.txt_pos_hud.set_text(
                f"Agent: ({self.brain.pos[0]:+.2f}, {self.brain.pos[1]:+.2f}) Ang:{math.degrees(self.brain.angle) % 360:3.0f}°\n"
                f"Target: ({obj_pos[0]:+.2f}, {obj_pos[1]:+.2f}) Dist:{dist_to_obj:.2f}\n"
                f"GainCoeff: {self.brain.energy_coeff:.2f}x | Spd: {self.brain.speed * SPEED_GAIN:+.3f} (raw:{self.brain.speed:+.2f})"
            )
        elif self.graph_page == 2 and hasattr(self, "ax_nm"):
            # Page 2: 4チャンネル神経修飾物質の空間発火マップ
            cur_nm_raw = getattr(self.brain, "current_neuromod_state", None)
            if cur_nm_raw is not None:
                nm_3d = cur_nm_raw.reshape(self.N, self.N, self.N, 4).astype(np.float32)
                for ch in range(4):
                    tile = self._make_slice_tile(nm_3d[:, :, :, ch])
                    v_max = max(float(np.max(tile)), 0.05)
                    self.im_nm[ch].set_clim(0.0, v_max)
                    self.im_nm[ch].set_data(tile)

        v_limit = max(float(np.max(np.abs(internal_outputs))), 0.05)
        is_sel_internal = (1 <= self.sel_z <= self.N) and (1 <= self.sel_y <= self.N) and (1 <= self.sel_x <= self.N)

        # 右下: 常にニューロン発火マップ (internal_outputs) を表示
        for iz in range(self.N):
            self.slice_ims[iz].set_clim(-v_limit, v_limit)
            self.slice_ims[iz].set_data(internal_outputs[iz])

            if is_sel_internal and (self.sel_z - 1) == iz:
                self.slice_sel_rects[iz].set_xy((self.sel_x - 1 - 0.5, self.sel_y - 1 - 0.5))
                self.slice_sel_rects[iz].set_visible(True)
            else:
                self.slice_sel_rects[iz].set_visible(False)

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
                elif self.graph_page == 2 and hasattr(self, "ax_nm"):
                    for ax, im in zip(self.ax_nm, self.im_nm):
                        ax.draw_artist(im)

                for iz, ax_s in enumerate(self.slice_axes_list):
                    ax_s.draw_artist(self.slice_ims[iz])
                    if self.slice_sel_rects[iz].get_visible():
                        ax_s.draw_artist(self.slice_sel_rects[iz])
                    ax_s.draw_artist(self.slice_ko_scatters[iz])
                self.mpl_canvas.blit(self.fig.bbox)
            except Exception:
                self._mpl_bg = None
                self.mpl_canvas.draw_idle()

        if self.view_mode_var.get() == "live_out":
            self._update_grid_live_colors_only()
