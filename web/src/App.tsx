import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ControlBar } from './components/ControlBar';
import { VoxelViewer } from './components/VoxelViewer';
import { WaveMonitor } from './components/WaveMonitor';
import { RadarArena } from './components/RadarArena';
import { KoPanel } from './components/KoPanel';
import { ConfigModal } from './components/ConfigModal';
import { EvolutionModal } from './components/EvolutionModal';

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(30);
  const [innerStep, setInnerStep] = useState(0);
  const [energy, setEnergy] = useState(0.2);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [angle, setAngle] = useState(0);
  const [obj, setObj] = useState<[number, number]>([0, 0]);
  const [sunlight, setSunlight] = useState(0);
  const [generatorPower, setGeneratorPower] = useState(0);
  const [internalOutputs, setInternalOutputs] = useState<number[][][] | undefined>();
  const [membraneOutputs, setMembraneOutputs] = useState<number[][][] | undefined>();
  const [koList, setKoList] = useState<{ x: number; y: number; z: number }[]>([]);
  const [N, setN] = useState(4);
  const [inPortsFi, setInPortsFi] = useState<number[][]>([]);
  const [outPortsFi, setOutPortsFi] = useState<number[][]>([]);

  const [currentAgent, setCurrentAgent] = useState<string | null>(null);

  // KO スキャン状態
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number } | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [showImportance, setShowImportance] = useState(false);

  // モーダル状態
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket 接続
  const connectWs = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Vite 開発サーバー(3000)の場合は 8000 に繋ぐ
    const wsUrl = host.includes(':3000')
      ? 'ws://localhost:8000/ws'
      : `${protocol}//${host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[+] WebSocket 接続成功');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('[!] WebSocket 切断。再接続を試行します...');
      setIsConnected(false);
      setTimeout(connectWs, 2000);
    };

    ws.onerror = (err) => {
      console.error('[!] WebSocket エラー:', err);
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // 他のコンポーネント用グローバルイベント発行
        window.dispatchEvent(new CustomEvent('voxelbrain-ws-msg', { detail: msg }));

        if (msg.type === 'state') {
          setInnerStep(msg.inner_step);
          setEnergy(msg.energy);
          setPos(msg.pos);
          setAngle(msg.angle);
          setObj(msg.obj);
          setSunlight(msg.sunlight);
          setGeneratorPower(msg.generator_power);
          setInternalOutputs(msg.internal_outputs);
          setMembraneOutputs(msg.membrane_outputs);
          setKoList(msg.ko_list);
          setIsRunning(msg.is_running);
          setFps(msg.target_fps);
          setCurrentAgent(msg.current_agent);
          setN(msg.N);
          setInPortsFi(msg.in_ports_fi);
          setOutPortsFi(msg.out_ports_fi);
        } else if (msg.type === 'scan_progress') {
          setIsScanning(true);
          setScanProgress({ current: msg.current, total: msg.total });
        } else if (msg.type === 'scan_result') {
          setIsScanning(false);
          setScanProgress(null);
          setScanResult(msg.result);
          setShowImportance(true);
        } else if (msg.type === 'evolution_status') {
          setIsEvolving(Boolean(msg.is_running));
        } else if (msg.type === 'evolution_log') {
          setIsEvolving(Boolean(msg.is_running));
        }
      } catch (e) {
        console.error('メッセージ解析エラー:', e);
      }
    };
  }, []);

  useEffect(() => {
    connectWs();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWs]);

  // アクション送信ヘルパー
  const sendAction = (action: string, payload: any = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...payload }));
    }
  };

  const handlePlay = () => {
    setIsRunning(true);
    sendAction('play');
  };
  const handlePause = () => {
    setIsRunning(false);
    sendAction('pause');
  };
  const handleStep = () => {
    setIsRunning(false);
    sendAction('step');
  };
  const handleReset = () => {
    setIsRunning(false);
    sendAction('reset');
  };
  const handleSetFps = (newFps: number) => {
    setFps(newFps);
    sendAction('set_fps', { fps: newFps });
  };
  const handleToggleKo = (x: number, y: number, z: number) => {
    sendAction('toggle_ko', { x, y, z });
  };
  const handleClearKo = () => sendAction('clear_ko');
  const handleLoadLatest = () => {
    sendAction('load_agent', { path: 'backups/latest_best.npz' });
  };
  const handleOpenFilePicker = async () => {
    const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
    try {
      const res = await fetch(`${host}/api/agents/choose_file`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'ファイルダイアログの起動に失敗しました。');
      }
      if (data.canceled) {
        return; // キャンセルされた
      }
      console.log('[+] ロード成功:', data.path);
    } catch (e: any) {
      console.error('ファイル選択エラー:', e);
      // フォールバック: ブラウザ標準のファイル選択
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.npz';
      input.onchange = async (ev: any) => {
        const file = ev.target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          await fetch(`${host}/api/agents/upload`, { method: 'POST', body: formData });
        }
      };
      input.click();
    }
  };
  const handleRunScan = () => {
    setIsScanning(true);
    sendAction('run_ko_scan');
  };

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        // フォーカスされているボタンの再クリック誤爆を防止
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        if (isRunning) handlePause();
        else handlePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        handleStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0d14] overflow-hidden">
      {/* 上部コントロールバー */}
      <ControlBar
        isRunning={isRunning}
        innerStep={innerStep}
        fps={fps}
        currentAgent={currentAgent}
        isEvolving={isEvolving}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        onSetFps={handleSetFps}
        onLoadLatest={handleLoadLatest}
        onOpenFilePicker={handleOpenFilePicker}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenEvolution={() => setIsEvolutionOpen(true)}
      />

      {/* メインレイアウト */}
      <div className="flex-1 flex min-h-0 relative">
        {/* 左側: 3D ボクセル脳 & 下部波形モニター */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 3D ビューア */}
          <div className="flex-1 relative min-h-0 bg-[#0e131f]">
            <VoxelViewer
              N={N}
              internalOutputs={internalOutputs}
              membraneOutputs={membraneOutputs}
              koList={koList}
              importanceMap={scanResult?.importance_map}
              inPortsFi={inPortsFi}
              outPortsFi={outPortsFi}
              onToggleKo={handleToggleKo}
              showImportance={showImportance}
            />

            {!isConnected && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-center">
                  <div className="animate-spin text-sky-400 text-2xl mb-2">🔄</div>
                  <div className="text-sm font-semibold text-slate-200">バックエンドサーバーに接続中...</div>
                  <div className="text-xs text-slate-400 mt-1">python server.py が起動しているか確認してください</div>
                </div>
              </div>
            )}
          </div>

          {/* 下部モニターエリア (波形 + レーダー) */}
          <div className="h-48 border-t border-slate-800 p-2 flex gap-2 bg-slate-950/40">
            <div className="flex-1 min-w-0">
              <WaveMonitor
                sunlight={sunlight}
                generatorPower={generatorPower}
                energy={energy}
                innerStep={innerStep}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <RadarArena pos={pos} angle={angle} obj={obj} />
            </div>
          </div>
        </div>

        {/* 右側: KO コントロールパネル */}
        <KoPanel
          koList={koList}
          onToggleKo={handleToggleKo}
          onClearKo={handleClearKo}
          onRunScan={handleRunScan}
          isScanning={isScanning}
          scanProgress={scanProgress}
          scanResult={scanResult}
          showImportance={showImportance}
          onToggleShowImportance={setShowImportance}
        />
      </div>

      {/* 設定編集モーダル */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigSaved={() => {
          handleReset();
        }}
      />

      {/* GPU進化計算ランチャーモーダル */}
      <EvolutionModal
        isOpen={isEvolutionOpen}
        onClose={() => setIsEvolutionOpen(false)}
        onRefreshAgents={() => {}}
      />
    </div>
  );
};

