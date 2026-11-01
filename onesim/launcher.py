# onesim/launcher.py
import os
import sys
import csv
import glob
import queue
import threading
import subprocess
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import numpy as np
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

import sim_config
from onesim.coords import get_default_inout_fi
from onesim.io_npz import get_smart_npz_initial_dir, get_latest_evolved_elite_path


class VbLauncherMixin:
    """voxelBrain.py 学習プロセス実行・監視および進化ログ解析プロット Mixin"""

    def action_save_and_apply_sim_config(self, show_msg: bool = True):
        """UI上の sim_config 設定を sim_config.py に書き出し、OneSim 内部の実行時定数にも即時反映する"""
        try:

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

        sim_config.NUM_IN_PORTS = num_in
        sim_config.NUM_OUT_PORTS = num_out
        sim_config.INITIAL_ENERGY = init_e
        sim_config.METABOLIC_COST = meta_c
        sim_config.GEN_COST_RATE = gen_c
        sim_config.SOLAR_GAIN_RATE = sol_g
        sim_config.SUN_CYCLE_PERIOD = sun_p
        sim_config.SPEED_GAIN = spd_g
        sim_config.ROTATE_GAIN = rot_g


        cfg_content = (
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

        if hasattr(self, "hline_breakeven"):
            breakeven = sim_config.GEN_COST_RATE / sim_config.SOLAR_GAIN_RATE if sim_config.SOLAR_GAIN_RATE > 0 else 0.5
            self.hline_breakeven.set_ydata([breakeven, breakeven])
            self.hline_breakeven.set_label(f"黒字太陽光ライン ({breakeven:.2f})")
            self.ax_solar.legend(loc="upper right", fontsize=8)
        if hasattr(self, "hline_init_energy"):
            self.hline_init_energy.set_ydata([sim_config.INITIAL_ENERGY, sim_config.INITIAL_ENERGY])
            self.hline_init_energy.set_label(f"Initial ({sim_config.INITIAL_ENERGY:.2f})")
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
        """最新の進化ログを読み込み、別ウィンドウで学習・進化曲線をプロット＆画像保存する"""
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
        """現在 OneSim 上で開いている個体を一時 .npz に書き出して analyze.py で起動"""
        self._apply_global_params_from_ui()
        self._apply_cell_edits_from_ui()

        preview_dir = os.path.abspath("backups/edited")
        os.makedirs(preview_dir, exist_ok=True)
        preview_npz = os.path.join(preview_dir, "_onesim_current_analyze.npz")

        neuromod_flat, _ = self._get_flat_arrays_for_sim()
        packed_inhib = self._pack_inhib_uint32()

        sig_pre_export = self.sig_pre.copy()
        sig_post_export = self.sig_post.copy()
        if np.any(self.brain.knockout_np2):
            sig_pre_export[self.brain.knockout_np2] = np.float16(0.0)
            sig_post_export[self.brain.knockout_np2] = np.float16(0.0)

        save_dict = {
            "step": np.int64(self.meta_step),
            "score": np.float64(self.meta_score),
            "sig_pre": sig_pre_export.reshape(-1).astype(np.float16),
            "sig_post": sig_post_export.reshape(-1).astype(np.float16),
            "neuromod": neuromod_flat.astype(np.float16),
            "inhib": packed_inhib.astype(np.uint32),
            "resource_base_output": np.float16(self.sim_params["base_output"]),
            "resource_beta": np.float16(self.sim_params["beta"]),
            "resource_k_refill": np.float16(self.sim_params["k_refill"]),
            "link_multiplier": np.int32(self.sim_params["multiplier"]),
            "link_bias": np.int32(self.sim_params["bias"]),
            "in_ports_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"]), dtype=np.int32),
            "out_ports_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"]), dtype=np.int32),
            "light_in_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[0] if sim_config.NUM_IN_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            "battery_in_fi": np.asarray(self.sim_params.get("in_ports_fi", get_default_inout_fi(self.dim)["in_ports_fi"])[1] if sim_config.NUM_IN_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            "gen_pos_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[0] if sim_config.NUM_OUT_PORTS >= 1 else [0, 0, 0], dtype=np.int32),
            "gen_neg_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[1] if sim_config.NUM_OUT_PORTS >= 2 else [0, 0, 0], dtype=np.int32),
            "speed_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[2] if sim_config.NUM_OUT_PORTS >= 3 else [0, 0, 0], dtype=np.int32),
            "rotate_out_fi": np.asarray(self.sim_params.get("out_ports_fi", get_default_inout_fi(self.dim)["out_ports_fi"])[3] if sim_config.NUM_OUT_PORTS >= 4 else [0, 0, 0], dtype=np.int32),
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

        np.savez_compressed(preview_npz, **save_dict)

        env = self._build_analyze_env()
        subprocess.Popen([sys.executable, "analyze.py", preview_npz], cwd=os.getcwd(), env=env)
        self._append_vb_log(f"[🎯 analyze.py] 現在の個体で2Dワールド追跡ビジュアライザを起動しました。\n")

    def action_launch_analyze_dialog(self):
        """ファイル選択ダイアログ付きの analyze.py を起動する"""
        env = self._build_analyze_env()
        subprocess.Popen([sys.executable, "analyze.py"], cwd=os.getcwd(), env=env)
        self._append_vb_log("[🎯 analyze.py] ファイル選択モードで起動しました。\n")
