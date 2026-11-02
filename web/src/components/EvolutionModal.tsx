import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Terminal, Cpu, RotateCcw } from 'lucide-react';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAgents: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ isOpen, onClose, onRefreshAgents }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSteps, setTotalSteps] = useState(50000);
  const [loadElites, setLoadElites] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
      const res = await fetch(`${host}/api/evolution/status`);
      if (res.ok) {
        const data = await res.json();
        setIsRunning(data.is_running);
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      }
    } catch (e) {
      console.error('進化ステータスの取得に失敗:', e);
    }
  };

  // ログ自動スクロール
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // WebSocket からの進化ログ受信リスナー
  useEffect(() => {
    const handleWsLog = (e: CustomEvent) => {
      const data = e.detail;
      if (data.type === 'evolution_log') {
        setLogs((prev) => [...prev.slice(-300), data.log]);
        setIsRunning(data.is_running);
      } else if (data.type === 'evolution_status') {
        setIsRunning(data.is_running);
        setStatusMsg(data.message || '');
        if (!data.is_running) {
          onRefreshAgents();
        }
      }
    };

    window.addEventListener('voxelbrain-ws-msg' as any, handleWsLog);
    return () => window.removeEventListener('voxelbrain-ws-msg' as any, handleWsLog);
  }, [onRefreshAgents]);

  const handleStart = async () => {
    try {
      const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
      const res = await fetch(`${host}/api/evolution/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_steps: totalSteps,
          wait_interval: 1,
          load_elites: loadElites,
        }),
      });
      const data = await res.json();
      setStatusMsg(data.message);
      if (data.success) {
        setIsRunning(true);
      }
    } catch (e: any) {
      setStatusMsg(`起動エラー: ${e.message}`);
    }
  };

  const handleStop = async () => {
    try {
      const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
      const res = await fetch(`${host}/api/evolution/stop`, { method: 'POST' });
      const data = await res.json();
      setStatusMsg(data.message);
    } catch (e: any) {
      setStatusMsg(`停止エラー: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                GPU 進化計算ランチャー <span className="text-xs font-mono text-slate-400">voxelBrain.py</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isRunning ? (
              <span className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>GPU計算中</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>停止中</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* コントロールエリア */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 grid grid-cols-3 gap-3 text-xs items-center">
          <div>
            <label className="text-slate-400 block mb-1">総世代数 (TOTAL_STEPS)</label>
            <input
              type="number"
              step="1000"
              min="10"
              max="200000"
              value={totalSteps}
              disabled={isRunning}
              onChange={(e) => setTotalSteps(parseInt(e.target.value) || 50000)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-200 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="loadElites"
              checked={loadElites}
              disabled={isRunning}
              onChange={(e) => setLoadElites(e.target.checked)}
              className="accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="loadElites" className="text-slate-300 cursor-pointer">
              既存エリートを読込再開
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            {isRunning ? (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow"
              >
                <Square className="w-3.5 h-3.5" />
                <span>安全停止</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5" />
                <span>進化開始</span>
              </button>
            )}
          </div>
        </div>

        {statusMsg && (
          <div className="px-4 py-1.5 bg-slate-800/80 text-[11px] text-slate-300 border-b border-slate-800">
            {statusMsg}
          </div>
        )}

        {/* ターミナル風ログ表示エリア */}
        <div className="flex-1 flex flex-col p-4 min-h-0 bg-slate-950">
          <div className="flex items-center justify-between pb-2 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span>標準出力ログ (voxelBrain.py stdout)</span>
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-slate-500 hover:text-slate-300 transition text-[10px]"
            >
              ログクリア
            </button>
          </div>
          <div
            ref={logContainerRef}
            className="flex-1 overflow-y-auto font-mono text-[11px] p-3 rounded-lg bg-black/80 border border-slate-800/80 text-slate-300 leading-relaxed select-text space-y-0.5"
          >
            {logs.length === 0 ? (
              <span className="text-slate-600">ログはまだありません。「進化開始」を押すと出力が表示されます。</span>
            ) : (
              logs.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.includes('Max:')
                      ? 'text-emerald-400'
                      : line.includes('エラー') || line.includes('Error')
                      ? 'text-rose-400'
                      : line.includes('★') || line.includes('[+]')
                      ? 'text-sky-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              fetchStatus();
              onRefreshAgents();
            }}
            className="text-slate-400 hover:text-slate-200 transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>最新エリート一覧更新</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
