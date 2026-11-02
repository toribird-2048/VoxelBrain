import React from 'react';
import { Zap, X, ShieldAlert, Sparkles, BarChart2 } from 'lucide-react';

interface KoCell {
  x: number;
  y: number;
  z: number;
}

interface ScanRanking {
  rank: number;
  x: number;
  y: number;
  z: number;
  ko_energy: number;
  drop: number;
}

interface KoPanelProps {
  koList: KoCell[];
  onToggleKo: (x: number, y: number, z: number) => void;
  onClearKo: () => void;
  onRunScan: () => void;
  isScanning: boolean;
  scanProgress: { current: number; total: number } | null;
  scanResult: {
    base_energy: number;
    rankings: ScanRanking[];
  } | null;
  showImportance: boolean;
  onToggleShowImportance: (show: boolean) => void;
}

export const KoPanel: React.FC<KoPanelProps> = ({
  koList,
  onToggleKo,
  onClearKo,
  onRunScan,
  isScanning,
  scanProgress,
  scanResult,
  showImportance,
  onToggleShowImportance,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 w-80 text-xs shadow-xl select-none">
      {/* ヘッダー */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h2 className="font-bold text-slate-100 text-sm">KO (ノックアウト) 実験</h2>
        </div>
        {koList.length > 0 && (
          <button
            onClick={onClearKo}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition"
          >
            全解除
          </button>
        )}
      </div>

      {/* 現在の KO セル一覧 */}
      <div className="my-3">
        <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
          <span>無効化中のニューロン ({koList.length})</span>
        </div>
        {koList.length === 0 ? (
          <div className="text-slate-500 bg-slate-950/40 border border-slate-800/80 rounded-lg p-2.5 text-center text-[11px]">
            KO中のセルはありません。<br />
            3D脳のセルをクリックして無効化できます。
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/40 border border-slate-800/80 rounded-lg">
            {koList.map((c) => (
              <span
                key={`${c.x},${c.y},${c.z}`}
                className="inline-flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono text-[10px]"
              >
                <span>[{c.x},{c.y},{c.z}]</span>
                <button
                  onClick={() => onToggleKo(c.x, c.y, c.z)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 自動 KO スキャン機能 */}
      <div className="pt-2 border-t border-slate-800 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            全セル重要度診断スキャン
          </span>
        </div>

        <button
          onClick={onRunScan}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isScanning ? '全探索スキャン実行中...' : '全セル自動KOスキャン実行'}</span>
        </button>

        {/* スキャン進捗 */}
        {isScanning && scanProgress && (
          <div className="mt-2.5 bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>進捗: {scanProgress.current} / {scanProgress.total} セル</span>
              <span className="font-mono">{Math.round((scanProgress.current / scanProgress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-150"
                style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* スキャン結果表示 */}
        {scanResult && !isScanning && (
          <div className="mt-3 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-1.5 text-[11px]">
              <span className="text-slate-400">
                基準E: <span className="text-sky-400 font-mono font-bold">{scanResult.base_energy.toFixed(3)}</span>
              </span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showImportance}
                  onChange={(e) => onToggleShowImportance(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span className="text-slate-300 text-[10px]">3Dヒートマップ</span>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950/60 border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/90 sticky top-0 text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-1.5 px-2">順位</th>
                    <th className="py-1.5 px-2">セル [X,Y,Z]</th>
                    <th className="py-1.5 px-2 text-right">低下度 (Drop)</th>
                    <th className="py-1.5 px-2 text-right">KO後E</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {scanResult.rankings.slice(0, 15).map((r) => {
                    const isHigh = r.drop > 0.1;
                    return (
                      <tr
                        key={`${r.x},${r.y},${r.z}`}
                        onClick={() => onToggleKo(r.x, r.y, r.z)}
                        className="hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        <td className="py-1.5 px-2 font-bold text-slate-400">
                          {r.rank <= 3 ? (
                            <span className="text-amber-400">#{r.rank}</span>
                          ) : (
                            `#${r.rank}`
                          )}
                        </td>
                        <td className="py-1.5 px-2 text-slate-200">
                          [{r.x},{r.y},{r.z}]
                        </td>
                        <td className={`py-1.5 px-2 text-right font-bold ${isHigh ? 'text-rose-400' : 'text-slate-400'}`}>
                          -{r.drop.toFixed(3)}
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-400">
                          {r.ko_energy.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-center">
              リストをクリックするとそのセルを KO/復帰 できます
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
