# onesim/recorder.py
import os
import shutil
import subprocess
from datetime import datetime
import tkinter as tk
from tkinter import filedialog, messagebox
import numpy as np
from PIL import Image


class MediaRecorderMixin:
    """シミュレーション画面のGIF/MP4録画・書き出し Mixin"""

    def _capture_gif_frame(self):
        """現在描画されている Matplotlib 4画面グラフを1フレームとしてキャプチャしバッファに追加する"""
        if not hasattr(self, "mpl_canvas"):
            return
        rgba = np.asarray(self.mpl_canvas.buffer_rgba())
        img = Image.fromarray(rgba, mode="RGBA").convert("RGB")
        self.gif_frames.append(img)
        if hasattr(self, "lbl_rec_status"):
            fmt_str = self.rec_fmt_var.get().upper() if hasattr(self, "rec_fmt_var") else "MP4"
            self.lbl_rec_status.config(text=f"🔴 {fmt_str}録画中: {len(self.gif_frames)} frames")

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

