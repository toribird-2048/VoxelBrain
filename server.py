"""
server.py: FastAPI + WebSocket による VoxelBrain KO 実験ツール バックエンド
OneSim (GPU) をホストし、ブラウザ (React + Three.js) と双方向リアルタイム通信を行います。
"""

import os
import sys
import glob
import json
import asyncio
import webbrowser
import subprocess
import threading
import importlib
from contextlib import asynccontextmanager
from typing import Set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from oneSim import OneSim
from elite_manager import EliteManager
import sim_config

# ==============================================================================
# sim_config.py 読み書きマネージャー
# ==============================================================================
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "sim_config.py")

def get_sim_config_dict() -> dict:
    importlib.reload(sim_config)
    return {
        "NUM_IN_PORTS": int(sim_config.NUM_IN_PORTS),
        "NUM_OUT_PORTS": int(sim_config.NUM_OUT_PORTS),
        "INITIAL_ENERGY": float(sim_config.INITIAL_ENERGY),
        "METABOLIC_COST": float(sim_config.METABOLIC_COST),
        "GEN_COST_RATE": float(sim_config.GEN_COST_RATE),
        "SOLAR_GAIN_RATE": float(sim_config.SOLAR_GAIN_RATE),
        "SUN_CYCLE_PERIOD": float(sim_config.SUN_CYCLE_PERIOD),
        "SPEED_GAIN": float(sim_config.SPEED_GAIN),
        "ROTATE_GAIN": float(sim_config.ROTATE_GAIN),
    }

def save_sim_config_dict(data: dict):
    content = f"""# ==============================================================================
# 入出力ポート スロット数設定 (固定長スロット方式)
# ==============================================================================
NUM_IN_PORTS  = {int(data.get("NUM_IN_PORTS", sim_config.NUM_IN_PORTS))}   # 感覚入力ポート（外周膜）のスロット数 (0: light_in, 1: battery_in)
NUM_OUT_PORTS = {int(data.get("NUM_OUT_PORTS", sim_config.NUM_OUT_PORTS))}   # 運動出力ポート（内部表面）のスロット数 (0: gen_pos_out, 1: gen_neg_out)

# ==============================================================================
# 太陽光タスク・エネルギーシミュレーション共通パラメータ
# ==============================================================================
INITIAL_ENERGY    = {float(data.get("INITIAL_ENERGY", sim_config.INITIAL_ENERGY))}     # 初期エネルギー (0.0=餓死, 1.0=満タン)
METABOLIC_COST    = {float(data.get("METABOLIC_COST", sim_config.METABOLIC_COST))}   # 毎tickの基礎代謝（固定消費）
GEN_COST_RATE     = {float(data.get("GEN_COST_RATE", sim_config.GEN_COST_RATE))}    # 発電稼働コスト係数
SOLAR_GAIN_RATE   = {float(data.get("SOLAR_GAIN_RATE", sim_config.SOLAR_GAIN_RATE))}    # 太陽光発電ゲイン係数
SUN_CYCLE_PERIOD  = {float(data.get("SUN_CYCLE_PERIOD", sim_config.SUN_CYCLE_PERIOD))}     # 昼夜サイクルの半周期 (tick数)

# ==============================================================================
# 個体運動パラメータ (身体性・移動ゲイン)
# ==============================================================================
SPEED_GAIN        = {float(data.get("SPEED_GAIN", sim_config.SPEED_GAIN))}    # 前進/後退速度ゲイン (my_speed = speed_out * SPEED_GAIN)
ROTATE_GAIN       = {float(data.get("ROTATE_GAIN", sim_config.ROTATE_GAIN))}     # 旋回速度ゲイン (my_angle += rotate_out * ROTATE_GAIN)
"""
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    importlib.reload(sim_config)


# ==============================================================================
# voxelBrain.py GPU 進化計算マネージャー
# ==============================================================================
class EvolutionManager:
    def __init__(self):
        self.process: subprocess.Popen | None = None
        self.logs: list[str] = []
        self.stop_file = os.path.abspath("vb_stop_signal.txt")
        self.total_steps = 50000

    @property
    def is_running(self) -> bool:
        return self.process is not None and self.process.poll() is None

    def start(self, total_steps: int = 50000, wait_interval: int = 1, load_elites: bool = False, load_folder: str = "backups/elites"):
        if self.is_running:
            return False, "すでに進化計算が実行中です。"

        if os.path.exists(self.stop_file):
            try: os.remove(self.stop_file)
            except Exception: pass

        self.total_steps = total_steps
        self.logs.clear()

        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUNBUFFERED"] = "1"
        env["VB_STOP_FILE"] = self.stop_file
        env["VB_TOTAL_STEPS"] = str(total_steps)
        env["VB_WAIT_INTERVAL"] = str(wait_interval)
        env["VB_LOAD_ELITES"] = "1" if load_elites else "0"
        env["VB_LOAD_FOLDER"] = load_folder

        cmd = [sys.executable, "voxelBrain.py"]
        try:
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                env=env,
            )
            # ログ読み取りスレッドを開始
            threading.Thread(target=self._read_logs, daemon=True).start()
            return True, "GPU進化計算を開始しました。"
        except Exception as e:
            return False, f"プロセス起動エラー: {e}"

    def stop(self):
        if not self.is_running:
            return False, "進化計算は実行されていません。"
        # 安全停止シグナルファイルを作成
        with open(self.stop_file, "w") as f:
            f.write("stop")
        return True, "停止シグナルを送信しました。現在のステップ完了後に保存して終了します。"

    def _read_logs(self):
        if not self.process or not self.process.stdout:
            return
        try:
            for line in iter(self.process.stdout.readline, ""):
                line_str = line.strip()
                if line_str:
                    self.logs.append(line_str)
                    if len(self.logs) > 500:
                        self.logs.pop(0)
                    # WebSocket 全員に安全にログ通知 (スレッドセーフ)
                    self._dispatch_ws({
                        "type": "evolution_log",
                        "log": line_str,
                        "is_running": self.is_running,
                    })
        except Exception as e:
            self.logs.append(f"[!] ログ読み取り例外: {e}")
        finally:
            if self.process and self.process.stdout:
                self.process.stdout.close()
            if self.process:
                self.process.wait()
            self._dispatch_ws({
                "type": "evolution_status",
                "is_running": False,
                "message": "GPU進化計算が終了しました。",
            })

    def _dispatch_ws(self, msg_dict: dict):
        """別スレッドからメインイベントループの WebSocket ブロードキャストを安全に呼び出す"""
        try:
            if manager.main_loop and manager.main_loop.is_running():
                asyncio.run_coroutine_threadsafe(manager.broadcast_message(msg_dict), manager.main_loop)
        except Exception as e:
            print(f"[!] _dispatch_ws エラー: {e}")

    def get_status(self) -> dict:
        return {
            "is_running": self.is_running,
            "total_steps": self.total_steps,
            "logs": self.logs[-50:],
        }


evolution_mgr = EvolutionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    manager.main_loop = asyncio.get_running_loop()
    manager.loop_task = asyncio.create_task(manager.start_loop())
    yield
    if manager.loop_task:
        manager.loop_task.cancel()
        try:
            await manager.loop_task
        except asyncio.CancelledError:
            pass

app = FastAPI(title="VoxelBrain KO Studio", lifespan=lifespan)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationManager:
    def __init__(self):
        self.sim: OneSim | None = None
        self.current_agent_path: str | None = None
        self.is_running = False
        self.target_fps = 30
        self.clients: Set[WebSocket] = set()
        self.loop_task: asyncio.Task | None = None
        self.lock = asyncio.Lock()
        self.main_loop: asyncio.AbstractEventLoop | None = None

        # 初期化
        self.init_default_sim()

    def init_default_sim(self):
        # 最新のエリート個体を探す
        elites = self.list_available_agents()
        agent_path = elites[0]["path"] if elites else None
        self.current_agent_path = agent_path
        self.sim = OneSim(dim=2, agent_data=agent_path)
        print(f"[+] SimulationManager 初期化完了: Agent={agent_path}")

    def list_available_agents(self) -> list[dict]:
        """backups ディレクトリ内の .npz ファイル一覧を探索（詳細メタデータ付き）"""
        import re
        from datetime import datetime
        files = glob.glob("backups/**/*.npz", recursive=True)
        agent_list = []
        latest_best_entry = None

        for f in files:
            name = os.path.basename(f)
            rel_path = f.replace("\\", "/")
            folder = os.path.dirname(rel_path)
            # backups/ を除去した見やすいフォルダ名
            display_folder = folder.replace("backups/", "") if folder.startswith("backups/") else folder
            mtime = os.path.getmtime(f)
            size_kb = round(os.path.getsize(f) / 1024, 1)
            formatted_time = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")

            # energyX.XXX のスコアを抽出
            m_score = re.search(r"energy([0-9]+\.[0-9]+)", name)
            score = float(m_score.group(1)) if m_score else -1.0

            # step の抽出
            m_step = re.search(r"step([0-9]+)", name)
            step = int(m_step.group(1)) if m_step else None

            # rank の抽出
            m_rank = re.search(r"rank([0-9]+)", name)
            rank = int(m_rank.group(1)) if m_rank else None

            if name == EliteManager.LATEST_BEST_FILENAME:
                # latest_best.npz の場合はメタデータからスコアやステップを取得
                try:
                    data = EliteManager.load_elite(f)
                    score = float(data.get("score", score))
                    if "step" in data:
                        step = int(data["step"])
                except Exception:
                    pass
                latest_best_entry = {
                    "name": name,
                    "display_name": f"★ latest_best.npz (最新ベスト - energy {score:.3f})" if score >= 0 else "★ latest_best.npz (最新ベスト)",
                    "path": rel_path,
                    "folder": display_folder,
                    "score": score,
                    "step": step,
                    "rank": 1,
                    "size_kb": size_kb,
                    "formatted_time": formatted_time,
                    "mtime": mtime,
                    "is_latest_best": True,
                }
            else:
                agent_list.append({
                    "name": name,
                    "display_name": name,
                    "path": rel_path,
                    "folder": display_folder,
                    "score": score,
                    "step": step,
                    "rank": rank,
                    "size_kb": size_kb,
                    "formatted_time": formatted_time,
                    "mtime": mtime,
                    "is_latest_best": False,
                })

        # スコア降順、次に更新日時降順
        agent_list.sort(key=lambda a: (a["score"], a["mtime"]), reverse=True)

        # latest_best.npz が存在する場合は先頭に追加
        if latest_best_entry:
            agent_list.insert(0, latest_best_entry)

        return agent_list

    def get_full_state(self) -> dict:
        """クライアント送信用ステート辞書"""
        if not self.sim:
            return {}

        state = self.sim.state

        # 発電出力の計算
        out_ports = self.sim.out_ports_fi
        outputs = state["outputs"]
        # faceIndex_to_coordOut の計算
        # スロット 0: pos, スロット 1: neg
        gen_power = 0.0
        if len(out_ports) >= 2:
            # 内部表面の出力差分
            p0 = self._get_port_val(out_ports[0], outputs)
            p1 = self._get_port_val(out_ports[1], outputs)
            gen_power = float(np.clip(p0 - p1, 0.0, 1.0))
        elif len(out_ports) == 1:
            gen_power = float(np.clip(self._get_port_val(out_ports[0], outputs), 0.0, 1.0))

        # 内部ニューロン出力 (N, N, N) を float list に変換
        internal_outs = state["internal_outputs"].astype(float).tolist()
        # 外周膜を含む全グリッド出力 (P, P, P) を float list に変換
        membrane_outs = outputs.astype(float).tolist()

        return {
            "type": "state",
            "inner_step": state["inner_step"],
            "energy": state["energy"],
            "pos": [float(state["pos"][0]), float(state["pos"][1])],
            "angle": state["angle"],
            "obj": [float(state["obj"][0]), float(state["obj"][1])],
            "sunlight": state["sunlight"],
            "generator_power": gen_power,
            "internal_outputs": internal_outs,
            "membrane_outputs": membrane_outs,
            "ko_list": self.sim.get_ko_list(),
            "is_running": self.is_running,
            "target_fps": self.target_fps,
            "current_agent": self.current_agent_path,
            "dim": self.sim.dim,
            "N": self.sim.N,
            "in_ports_fi": self.sim.in_ports_fi.tolist(),
            "out_ports_fi": self.sim.out_ports_fi.tolist(),
        }

    def _get_port_val(self, fi_coord: np.ndarray, outputs: np.ndarray) -> float:
        """face_index 座標から outputs (P, P, P) の値を取得"""
        N = self.sim.N
        face, u, v = fi_coord
        u = int(np.clip(u, 0, N - 1))
        v = int(np.clip(v, 0, N - 1))
        # table: [0: (0,u,v), 1: (N-1,u,v), 2: (u,0,v), 3: (u,N-1,v), 4: (u,v,0), 5: (u,v,N-1)]
        coords = [
            (0, u, v),
            (N - 1, u, v),
            (u, 0, v),
            (u, N - 1, v),
            (u, v, 0),
            (u, v, N - 1),
        ]
        cx, cy, cz = coords[int(np.clip(face, 0, 5))]
        # outputs は P2 = N+2 なので内部座標は +1
        return float(outputs[cz + 1, cy + 1, cx + 1])

    async def broadcast_state(self):
        """全接続クライアントへ現在のステートを送信"""
        await self.broadcast_message(self.get_full_state())

    async def broadcast_message(self, msg_dict: dict):
        """任意の辞書メッセージを全接続クライアントへ送信"""
        if not self.clients:
            return
        msg = json.dumps(msg_dict)
        dead_clients = set()
        for client in self.clients:
            try:
                await client.send_text(msg)
            except Exception:
                dead_clients.add(client)
        self.clients -= dead_clients

    async def start_loop(self):
        """シミュレーション実行ループ"""
        while True:
            if self.is_running and self.sim:
                async with self.lock:
                    self.sim.step()
                await self.broadcast_state()

                # 1000 step 到達時は自動一時停止
                if self.sim.inner_step >= 1000:
                    self.is_running = False
                    await self.broadcast_state()

                sleep_time = max(0.001, 1.0 / self.target_fps)
                await asyncio.sleep(sleep_time)
            else:
                await asyncio.sleep(0.05)


manager = SimulationManager()


@app.get("/api/agents")
async def get_agents():
    return manager.list_available_agents()


@app.post("/api/agents/choose_file")
async def choose_file_dialog():
    """OS ネイティブのファイル選択ダイアログを backups フォルダ初期位置で開く"""
    import tkinter
    from tkinter import filedialog

    def _open_dialog():
        root = tkinter.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        initial_dir = os.path.abspath("backups")
        os.makedirs(initial_dir, exist_ok=True)
        file_path = filedialog.askopenfilename(
            title="エリート個体 (.npz) を選択",
            initialdir=initial_dir,
            filetypes=[("NPZ Files", "*.npz"), ("All Files", "*.*")],
        )
        root.destroy()
        return file_path

    loop = asyncio.get_running_loop()
    selected_path = await loop.run_in_executor(None, _open_dialog)

    if not selected_path:
        return {"success": False, "canceled": True}

    selected_path = os.path.abspath(selected_path).replace("\\", "/")
    manager.is_running = False
    async with manager.lock:
        manager.current_agent_path = selected_path
        manager.sim = OneSim(dim=2, agent_data=selected_path)
    await manager.broadcast_state()

    return {"success": True, "path": selected_path}


@app.post("/api/agents/upload")
async def upload_agent(file: UploadFile = File(...)):
    """ローカルの .npz ファイルをアップロードして即座にシミュレータにロード"""
    if not file.filename.endswith(".npz"):
        return {"success": False, "message": ".npz ファイルのみアップロード可能です。"}

    upload_dir = "backups/uploaded"
    os.makedirs(upload_dir, exist_ok=True)
    save_path = os.path.join(upload_dir, file.filename).replace("\\", "/")

    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    # ロード実行
    manager.is_running = False
    async with manager.lock:
        manager.current_agent_path = save_path
        manager.sim = OneSim(dim=2, agent_data=save_path)
    await manager.broadcast_state()

    return {
        "success": True,
        "message": f"{file.filename} をアップロードしてロードしました。",
        "path": save_path,
        "agents": manager.list_available_agents(),
    }


@app.post("/api/agents/load")
async def load_agent_api(payload: dict = Body(...)):
    """指定パスの .npz ファイルをロード"""
    path = payload.get("path")
    if not path or not os.path.exists(path):
        return {"success": False, "message": "ファイルが存在しません。"}

    manager.is_running = False
    async with manager.lock:
        manager.current_agent_path = path
        manager.sim = OneSim(dim=2, agent_data=path)
    await manager.broadcast_state()

    return {"success": True, "path": path}


@app.get("/api/state")
async def get_state():
    return manager.get_full_state()


@app.get("/api/config")
async def get_config():
    return get_sim_config_dict()


@app.post("/api/config")
async def save_config(config: dict = Body(...)):
    save_sim_config_dict(config)
    # 現在のシミュレータも新しいパラメータで再初期化
    if manager.sim and manager.current_agent_path:
        async with manager.lock:
            manager.sim = OneSim(dim=2, agent_data=manager.current_agent_path)
    await manager.broadcast_state()
    return {"status": "ok", "config": get_sim_config_dict()}


@app.get("/api/evolution/status")
async def get_evolution_status():
    return evolution_mgr.get_status()


@app.post("/api/evolution/start")
async def start_evolution(payload: dict = Body(...)):
    total_steps = int(payload.get("total_steps", 50000))
    wait_interval = int(payload.get("wait_interval", 1))
    load_elites = bool(payload.get("load_elites", False))
    load_folder = str(payload.get("load_folder", "backups/elites"))
    success, msg = evolution_mgr.start(total_steps, wait_interval, load_elites, load_folder)
    return {"success": success, "message": msg}


@app.post("/api/evolution/stop")
async def stop_evolution():
    success, msg = evolution_mgr.stop()
    return {"success": success, "message": msg}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    manager.clients.add(websocket)
    try:
        # 初回ステート送信
        await websocket.send_text(json.dumps(manager.get_full_state()))
        # 進化状態も送信
        await websocket.send_text(json.dumps({
            "type": "evolution_status",
            **evolution_mgr.get_status()
        }))

        while True:
            text = await websocket.receive_text()
            data = json.loads(text)
            action = data.get("action")

            if action == "play":
                manager.is_running = True
                await manager.broadcast_state()

            elif action == "pause":
                manager.is_running = False
                await manager.broadcast_state()

            elif action == "step":
                manager.is_running = False
                async with manager.lock:
                    manager.sim.step()
                await manager.broadcast_state()

            elif action == "reset":
                manager.is_running = False
                async with manager.lock:
                    manager.sim.reset()
                await manager.broadcast_state()

            elif action == "set_fps":
                manager.target_fps = int(np.clip(data.get("fps", 30), 1, 240))
                await manager.broadcast_state()

            elif action == "toggle_ko":
                if "x" in data and "y" in data and "z" in data and data["x"] is not None:
                    x = int(data["x"])
                    y = int(data["y"])
                    z = int(data["z"])
                    async with manager.lock:
                        manager.sim.toggle_ko(x, y, z)
                    await manager.broadcast_state()

            elif action == "set_ko":
                if "x" in data and "y" in data and "z" in data and "val" in data:
                    x = int(data["x"])
                    y = int(data["y"])
                    z = int(data["z"])
                    val = bool(data["val"])
                    async with manager.lock:
                        manager.sim.set_ko(x, y, z, val)
                    await manager.broadcast_state()

            elif action == "clear_ko":
                async with manager.lock:
                    manager.sim.clear_ko()
                await manager.broadcast_state()

            elif action == "load_agent":
                path = data.get("path")
                if path and not os.path.exists(path) and "latest_best" in path:
                    # latest_best.npz が存在しない場合はリスト先頭の最新個体へフォールバック
                    agents = manager.list_available_agents()
                    if agents:
                        path = agents[0]["path"]
                if path and os.path.exists(path):
                    manager.is_running = False
                    async with manager.lock:
                        manager.current_agent_path = path
                        manager.sim = OneSim(dim=2, agent_data=path)
                    await manager.broadcast_state()

            elif action == "run_ko_scan":
                # 自動KOスキャンの実行
                manager.is_running = False
                await manager.broadcast_state()

                def progress_cb(cur, tot):
                    # 進捗通知
                    asyncio.create_task(websocket.send_text(json.dumps({
                        "type": "scan_progress",
                        "current": cur,
                        "total": tot,
                    })))

                async with manager.lock:
                    # スキャン実行
                    scan_result = manager.sim.scan_ko_all(
                        total_inner_steps=1000,
                        progress_callback=progress_cb
                    )

                # 結果送信
                await websocket.send_text(json.dumps({
                    "type": "scan_result",
                    "result": scan_result,
                }))
                await manager.broadcast_state()

            elif action == "start_evolution":
                total_steps = int(data.get("total_steps", 50000))
                wait_interval = int(data.get("wait_interval", 1))
                load_elites = bool(data.get("load_elites", False))
                load_folder = str(data.get("load_folder", "backups/elites"))
                success, msg = evolution_mgr.start(total_steps, wait_interval, load_elites, load_folder)
                await websocket.send_text(json.dumps({
                    "type": "evolution_status",
                    "is_running": success,
                    "message": msg,
                }))

            elif action == "stop_evolution":
                success, msg = evolution_mgr.stop()
                await websocket.send_text(json.dumps({
                    "type": "evolution_status",
                    "is_running": False,
                    "message": msg,
                }))

    except WebSocketDisconnect:
        manager.clients.remove(websocket)
    except Exception as e:
        print(f"[!] WebSocket エラー: {e}")
        if websocket in manager.clients:
            manager.clients.remove(websocket)


# 静的ファイル配信 (ビルド済みフロントエンドがある場合)
DIST_DIR = os.path.join(os.path.dirname(__file__), "web", "dist")
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")


def main():
    import uvicorn
    import threading
    port = int(os.environ.get("PORT", 8000))
    url = f"http://localhost:{port}"
    print(f"==================================================")
    print(f"🚀 VoxelBrain KO Studio サーバー起動中...")
    print(f"🌐 ブラウザで以下のURLを開いてください:")
    print(f"   {url}")
    print(f"==================================================")
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
