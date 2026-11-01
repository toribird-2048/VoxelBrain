# onesim/studio.py
import os
import sys
import time
import math
import glob
import queue
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import numpy as np

import sim_config
from sim_config import (
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
from onesim.coords import (
    get_default_inout_fi,
    face_index_to_coord_in_p,
    face_index_to_coord_out_p,
    get_special_coords_np2,
    format_coord_label,
)
from onesim.io_npz import (
    get_smart_npz_initial_dir,
    get_latest_evolved_elite_path,
    select_npz_file,
    load_elite_npz,
)
from onesim.sim_cpu import SolarBrainCPU, HISTORY_LEN
from onesim.inout_3d import InOut3DViewerMixin
from onesim.mpl_monitor import MplMonitorMixin
from onesim.recorder import MediaRecorderMixin
from onesim.ko_scanner import KoScannerMixin
from onesim.launcher import VbLauncherMixin

STEPS_PER_FRAME = 1


class IntegratedBrainStudio(
    InOut3DViewerMixin,
    MplMonitorMixin,
    MediaRecorderMixin,
    KoScannerMixin,
    VbLauncherMixin,
):
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
        self.neuromod = np.zeros((self.N, self.N, self.N, 4), dtype=np.float16)
        self.neuromod[:, :, :, 0] = np.float16(0.1)
        self.inhib_bits = np.zeros((self.N, self.N, self.N), dtype=bool)

        self.meta_step = 0
        self.meta_score = float(INITIAL_ENERGY)

        default_react = np.zeros((4, 4), dtype=np.float16)
        for i in range(4):
            default_react[i, 2] = np.float16(0.95)

        self.sim_params = {
            "base_output": np.float16(0.02),
            "beta": np.float16(20.0),
            "k_refill": np.float16(0.15),
            "multiplier": 1,
            "bias": 0,
            "neuromod_rel_matrix": (np.eye(4, dtype=np.float16) * 0.95).astype(np.float16),
            "neuromod_weight_reaction": default_react,
            "neuromod_diff": np.float16(0.01),
        }
        self.sim_params.update(get_default_inout_fi(self.dim))
        self.spec = {
            "dim": self.dim,
            "n": self.N,
            "p": self.P,
            "total_n": self.TOTAL_N,
            "center": self.N // 2,
        }

        nm_flat, inhib_flat = self._get_flat_arrays_for_sim()
        self.brain = SolarBrainCPU(
            self.sig_pre,
            self.sig_post,
            nm_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        self.brain.step(inner_steps=1,
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

        nm_flat = self.neuromod[iz, iy, ix].astype(np.float16).reshape(self.TOTAL_N, 4)
        inhib_flat = np.where(self.inhib_bits[iz, iy, ix], -1.0, 1.0).astype(np.float16)
        return nm_flat, inhib_flat
    def _sync_genes_to_brain(self, force_reset: bool = False):
        nm_flat, inhib_flat = self._get_flat_arrays_for_sim()
        do_reset = force_reset or bool(self.auto_reset_on_edit.get())
        self.brain.update_genes(
            self.sig_pre,
            self.sig_post,
            nm_flat,
            inhib_flat,
            self.sim_params,
            reset_state=do_reset,
        )
        if do_reset and not self.brain.step_history:
            self.brain.step(inner_steps=1,
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
            ("Neuromod 0", "neuromod_0"),
            ("Neuromod 1", "neuromod_1"),
            ("Neuromod 2", "neuromod_2"),
            ("Neuromod 3", "neuromod_3"),
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

        # 左半分: sig_pre / sig_post / inhib / neuromod
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

        ttk.Label(left_c, text="Neuromodulators (0..3):").grid(row=7, column=0, columnspan=3, sticky=tk.W, pady=(2, 0))
        self.cell_nm_vars = [tk.StringVar(value="0.0") for _ in range(4)]
        nm_frame = ttk.Frame(left_c)
        nm_frame.grid(row=8, column=0, columnspan=3, sticky=tk.EW, pady=1)
        for c in range(4):
            ttk.Label(nm_frame, text=f"nm{c}:").pack(side=tk.LEFT)
            enm = ttk.Entry(nm_frame, textvariable=self.cell_nm_vars[c], width=5)
            enm.pack(side=tk.LEFT, padx=1)
            enm.bind("<Return>", lambda e: self._apply_cell_edits_from_ui())

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


    def _tick_loop(self):
        if self._in_tick:
            self._tick_job_id = self.root.after(40, self._tick_loop)
            return
        self._in_tick = True
        t0 = time.perf_counter()
        try:
            self._poll_vb_log_queue()
            if not self.paused:
                self.brain.step(inner_steps=self.steps_per_frame,
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
            for c in range(4):
                self.cell_nm_vars[c].set(f"{float(self.neuromod[iz, iy, ix, c]):.4f}")
        else:
            self.chk_inhib.config(state=tk.DISABLED)
            self.cell_inhib_var.set(False)
            for c in range(4):
                self.cell_nm_vars[c].set(f"{float(self.neuromod[iz, iy, ix, c]):.4f}")

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
        elif mode.startswith("neuromod_"):
            if not is_internal:
                return "#24242c"
            ch = int(mode.split("_")[1])
            val = float(np.clip(self.neuromod[z - 1, y - 1, x - 1, ch], 0.0, 1.0))
            v = int(val * 210) + 35
            palette = [(41, 182, 246), (171, 71, 188), (102, 187, 106), (255, 167, 38)]
            pr, pg, pb = palette[ch]
            return f"#{int(pr * val):02x}{int(pg * val):02x}{int(pb * val):02x}"
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
            ("画面・タブ切替", "P", "右上グラフ表示切替 (P1: 個体位置マップ ⇄ P2: 神経修飾物質波形)"),
            ("画面・タブ切替", "1 または F1", "【大タブ1】 📊 波形グラフ ＆ 🧠 ボクセル脳マップ に切替"),
            ("画面・タブ切替", "2 または F2", "【大タブ2】 🛠️ 選択セル～統合SimConfig に切替"),
            ("画面・タブ切替", "Ctrl + 1", "大タブ2: 🔍 選択セル・配線 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 2", "大タブ2: 🌐 I/O 3D配線 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 3", "大タブ2: ⚙️ 神経パラメータ タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 4", "大タブ2: 🧪 ノッキング診断 タブへジャンプ"),
            ("画面・タブ切替", "Ctrl + 5", "大タブ2: 🚀 統合ランチャー・sim_config へジャンプ"),
            # 機能トグル
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
        self.brain.step(inner_steps=1,
        )
        self._render_matplotlib_state()
        if self.is_recording_gif:
            self._capture_gif_frame()

    def action_reset_sim(self):
        self.brain.reset()
        self.brain.step(inner_steps=1)
        self._mpl_bg = None
        self._cur_xmin = 0
        self._cur_xmax = HISTORY_LEN
        if hasattr(self, "ax_solar"):
            self.ax_solar.set_xlim(0, HISTORY_LEN)
        if hasattr(self, "ax_energy"):
            self.ax_energy.set_xlim(0, HISTORY_LEN)
        self._render_matplotlib_state(force_full=True)
        if hasattr(self, "mpl_canvas"):
            self.mpl_canvas.draw_idle()
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
                self.brain.step(inner_steps=s,
                )
                remaining -= s
                self._render_matplotlib_state()
                self._capture_gif_frame()
        else:
            self.brain.step(inner_steps=1000,
            )
        self.meta_score = round(self.brain.energy, 4)
        self.paused = True
        self.btn_pause.config(text="▶️ 再開 [Space]")
        self._refresh_all_views()



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


            self.meta_step = int(float(self.param_vars["step"].get()))
            self.meta_score = float(self.param_vars["score"].get())

    
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
            for c in range(4):
                try:
                    val_str = self.cell_nm_vars[c].get()
                    if val_str != f"{float(self.neuromod[iz, iy, ix, c]):.4f}":
                        self.neuromod[iz, iy, ix, c] = np.float16(np.clip(float(val_str), 0.0, 1.0))
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
        default_react = np.zeros((4, 4), dtype=np.float16)
        for i in range(4):
            default_react[i, 2] = np.float16(0.95)

        self.sim_params.update({
            "base_output": np.float16(0.02),
            "beta": np.float16(20.0),
            "k_refill": np.float16(0.15),
            "multiplier": 1,
            "bias": 0,
            "neuromod_rel_matrix": (np.eye(4, dtype=np.float16) * 0.95).astype(np.float16),
            "neuromod_weight_reaction": default_react,
            "neuromod_diff": np.float16(0.01),
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
            sig_pre, sig_post, neuromod_map, inhib_flat, params, spec = load_elite_npz(file_path)
            self._init_blank_gene(dim=spec["dim"])

            self.sig_pre = np.clip(sig_pre, -1.0, 1.0).astype(np.float16)
            self.sig_post = np.clip(sig_post, -1.0, 1.0).astype(np.float16)

            for iz in range(self.N):
                for iy in range(self.N):
                    for ix in range(self.N):
                        idx = self._coord_n_to_idx(iz, iy, ix)
                        self.neuromod[iz, iy, ix] = neuromod_map[idx]
                        self.inhib_bits[iz, iy, ix] = bool(inhib_flat[idx] < 0)

            self.meta_step = params["step"]
            self.meta_score = params["score"]
    
            for k in ("base_output", "beta", "k_refill", "multiplier", "bias"):
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

        nm_flat, _ = self._get_flat_arrays_for_sim()
        packed_inhib = self._pack_inhib_uint32()

        save_dict = {
            "step": np.int64(self.meta_step),
            "score": np.float64(self.meta_score),
            "sig_pre": self.sig_pre.reshape(-1).astype(np.float16),
            "sig_post": self.sig_post.reshape(-1).astype(np.float16),
            "neuromod": nm_flat.astype(np.float16),
            "inhib": packed_inhib.astype(np.uint32),
            "resource_base_output": np.float16(self.sim_params["base_output"]),
            "resource_beta": np.float16(self.sim_params["beta"]),
            "resource_k_refill": np.float16(self.sim_params["k_refill"]),
            "link_multiplier": np.int32(self.sim_params["multiplier"]),
            "link_bias": np.int32(self.sim_params["bias"]),
            "in_ports_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"]), dtype=np.int32),
            "out_ports_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"]), dtype=np.int32),
            "light_in_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[0] if NUM_IN_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            "battery_in_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[1] if NUM_IN_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            "gen_pos_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[0] if NUM_OUT_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            "gen_neg_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[1] if NUM_OUT_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            "speed_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[2] if NUM_OUT_PORTS >= 3 else [0, 0, 0], dtype=np.int32),
            "rotate_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[3] if NUM_OUT_PORTS >= 4 else [0, 0, 0], dtype=np.int32),
        }
        if "neuromod_rel_matrix" in self.sim_params and self.sim_params["neuromod_rel_matrix"] is not None:
            save_dict["neuromod_rel_matrix"] = self.sim_params["neuromod_rel_matrix"]
        if "neuromod_weight_reaction" in self.sim_params and self.sim_params["neuromod_weight_reaction"] is not None:
            save_dict["neuromod_weight_reaction"] = self.sim_params["neuromod_weight_reaction"]
        if "neuromod_diff" in self.sim_params and self.sim_params["neuromod_diff"] is not None:
            save_dict["neuromod_diff"] = self.sim_params["neuromod_diff"]

        # メタ変異パラメータ（全遺伝情報の網羅）
        for key in [
            "mut_sig_rate", "mut_sig_steps", "mut_sig_max", "mut_sig_diff",
            "mut_neuromod_map_rate", "mut_neuromod_map_steps", "mut_neuromod_map_max", "mut_neuromod_map_diff",
            "mut_neuromod_params_rate", "mut_iicu_rate",
            "mut_resource_rate", "mut_link28th_rate", "mut_mutate_rate",
        ]:
            if key in self.sim_params and self.sim_params[key] is not None:
                save_dict[key] = self.sim_params[key]

        os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
        np.savez_compressed(save_path, **save_dict)
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


def main():
    selected_file = select_npz_file()
    root = tk.Tk()
    app = IntegratedBrainStudio(root, initial_npz=selected_file if selected_file else None)
    root.mainloop()
