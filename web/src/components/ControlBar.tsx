import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sliders,
  Flame,
  FolderOpen,
  Star,
  Cpu,
} from 'lucide-react';

interface ControlBarProps {
  isRunning: boolean;
  innerStep: number;
  fps: number;
  currentAgent: string | null;
  isEvolving?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSetFps: (fps: number) => void;
  onLoadLatest: () => void;
  onOpenFilePicker: () => void;
  onOpenConfig: () => void;
  onOpenEvolution: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRunning,
  innerStep,
  fps,
  currentAgent,
  isEvolving = false,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSetFps,
  onLoadLatest,
  onOpenFilePicker,
  onOpenConfig,
  onOpenEvolution,
}) => {
  // 表示名
  const displayName = currentAgent
    ? currentAgent.split('/').pop()?.split('\\').pop() || currentAgent
    : '未選択';

  const isLatest = currentAgent?.includes('latest_best.npz');

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shadow-md z-20">

      {/* ロゴ */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold">
          🧠
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-slate-100 flex items-center gap-1.5">
            VoxelBrain <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-mono">KO Studio</span>
          </h1>
          <p className="text-[10px] text-slate-400">Slang GPU 3D Neural Circuit Simulator</p>
        </div>
      </div>

      {/* エリート個体操作 ＆ ツールボタン */}
      <div className="flex items-center space-x-2">
        {/* 現在の個体表示バッジ */}
        <div
          className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 text-xs px-2.5 py-1.5 rounded-xl max-w-xs"
          title={`現在ロード中: ${currentAgent || 'なし'}`}
        >
          <Cpu className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span className="text-slate-300 font-mono text-[11px] truncate max-w-[150px]">
            {displayName}
          </span>
          {isLatest && (
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono flex-shrink-0">
              Latest
            </span>
          )}
        </div>

        {/* 1. 最新エリート選択ボタン */}
        <button
          onClick={onLoadLatest}
          className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl border transition font-medium ${
            isLatest
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700 hover:border-amber-500/40'
          }`}
          title="最新ベスト個体 (latest_best.npz) をロード"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>最新エリート</span>
        </button>

        {/* 2. ファイル選択ボタン */}
        <button
          onClick={onOpenFilePicker}
          className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-xl transition font-medium shadow-sm"
          title="エクスプローラーから .npz ファイルを選択（デフォルト: backups/）"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>ファイル選択 (.npz)</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* SimConfig ボタン */}
        <button
          onClick={onOpenConfig}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs px-2.5 py-1.5 rounded-xl transition"
          title="sim_config.py 編集"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>設定</span>
        </button>

        {/* GPU 進化計算 ボタン */}
        <button
          onClick={onOpenEvolution}
          className={`flex items-center space-x-1 border text-xs px-2.5 py-1.5 rounded-xl transition font-medium ${
            isEvolving
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
          }`}
          title="voxelBrain.py GPU 進化計算"
        >
          <Flame className={`w-3.5 h-3.5 ${isEvolving ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>GPU進化</span>
        </button>
      </div>

      {/* シミュレーション制御ボタン */}
      <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800 rounded-lg p-1">
        {isRunning ? (
          <button
            onClick={(e) => {
              (e.currentTarget as HTMLElement).blur();
              onPause();
            }}
            className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded-md transition font-medium"
            title="一時停止 (Space)"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>一時停止</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              (e.currentTarget as HTMLElement).blur();
              onPlay();
            }}
            className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-md transition font-medium"
            title="再生 (Space)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>再生</span>
          </button>
        )}

        <button
          onClick={(e) => {
            (e.currentTarget as HTMLElement).blur();
            onStep();
          }}
          disabled={isRunning}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs px-2.5 py-1 rounded-md transition disabled:opacity-40"
          title="1ステップ進む (→)"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Step</span>
        </button>

        <button
          onClick={(e) => {
            (e.currentTarget as HTMLElement).blur();
            onReset();
          }}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs px-2 py-1 rounded-md transition"
          title="シミュレーション初期化 (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>リセット</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* InnerStep カウンタ */}
        <div className="text-xs font-mono px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300 flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-sans">STEP</span>
          <span className="font-bold text-sky-400">{innerStep.toString().padStart(4, '0')}</span>
          <span className="text-[10px] text-slate-500">/ 1000</span>
        </div>

        {/* FPS セレクター */}
        <div className="flex items-center space-x-1 pl-1">
          <span className="text-[10px] text-slate-400">FPS:</span>
          <select
            value={fps}
            onChange={(e) => onSetFps(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
          </select>
        </div>
      </div>
    </header>
  );
};
