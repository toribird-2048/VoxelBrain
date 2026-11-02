import React, { useState, useEffect } from 'react';
import { X, Save, Sliders, Check, AlertCircle } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

interface SimConfig {
  NUM_IN_PORTS: number;
  NUM_OUT_PORTS: number;
  INITIAL_ENERGY: number;
  METABOLIC_COST: number;
  GEN_COST_RATE: number;
  SOLAR_GAIN_RATE: number;
  SUN_CYCLE_PERIOD: number;
  SPEED_GAIN: number;
  ROTATE_GAIN: number;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onConfigSaved }) => {
  const [config, setConfig] = useState<SimConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      setIsSaved(false);
      setError(null);
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
      const res = await fetch(`${host}/api/config`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      } else {
        setError('設定の取得に失敗しました。');
      }
    } catch (e: any) {
      setError(e.message || '通信エラー');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setIsLoading(true);
    setError(null);
    try {
      const host = window.location.host.includes(':3000') ? 'http://localhost:8000' : '';
      const res = await fetch(`${host}/api/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setIsSaved(true);
        if (onConfigSaved) onConfigSaved();
        setTimeout(() => setIsSaved(false), 2500);
      } else {
        setError('設定の保存に失敗しました。');
      }
    } catch (e: any) {
      setError(e.message || '通信エラー');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (key: keyof SimConfig, value: number) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100">sim_config.py 編集</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSaved && (
            <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>設定を sim_config.py に保存し、即時適用しました！</span>
            </div>
          )}

          {config ? (
            <div className="space-y-4">
              {/* 入出力ポート数 */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1">
                  🔌 入出力ポート数 (固定長スロット)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">NUM_IN_PORTS (入力)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={config.NUM_IN_PORTS}
                      onChange={(e) => updateField('NUM_IN_PORTS', parseInt(e.target.value) || 2)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">NUM_OUT_PORTS (出力)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={config.NUM_OUT_PORTS}
                      onChange={(e) => updateField('NUM_OUT_PORTS', parseInt(e.target.value) || 4)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* エネルギー・環境パラメータ */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1">
                  ☀️ 太陽光・代謝・エネルギー収支
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>INITIAL_ENERGY (初期エネルギー)</span>
                    <span className="font-mono text-sky-400 font-bold">{config.INITIAL_ENERGY.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={config.INITIAL_ENERGY}
                    onChange={(e) => updateField('INITIAL_ENERGY', parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>METABOLIC_COST (毎tickの基礎代謝)</span>
                    <span className="font-mono text-rose-400 font-bold">{config.METABOLIC_COST.toFixed(5)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.005"
                    step="0.0001"
                    value={config.METABOLIC_COST}
                    onChange={(e) => updateField('METABOLIC_COST', parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>GEN_COST_RATE (発電稼働コスト係数)</span>
                    <span className="font-mono text-amber-400 font-bold">{config.GEN_COST_RATE.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.02"
                    step="0.001"
                    value={config.GEN_COST_RATE}
                    onChange={(e) => updateField('GEN_COST_RATE', parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>SOLAR_GAIN_RATE (太陽光発電ゲイン)</span>
                    <span className="font-mono text-emerald-400 font-bold">{config.SOLAR_GAIN_RATE.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.002"
                    max="0.05"
                    step="0.001"
                    value={config.SOLAR_GAIN_RATE}
                    onChange={(e) => updateField('SOLAR_GAIN_RATE', parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>SUN_CYCLE_PERIOD (昼夜半周期 tick)</span>
                    <span className="font-mono text-yellow-400 font-bold">{config.SUN_CYCLE_PERIOD.toFixed(0)} tick</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={config.SUN_CYCLE_PERIOD}
                    onChange={(e) => updateField('SUN_CYCLE_PERIOD', parseFloat(e.target.value))}
                    className="w-full accent-yellow-500"
                  />
                </div>
              </div>

              {/* 移動ゲイン */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1">
                  🧭 身体運動ゲイン
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">SPEED_GAIN (速度)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.SPEED_GAIN}
                      onChange={(e) => updateField('SPEED_GAIN', parseFloat(e.target.value) || 0.05)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">ROTATE_GAIN (旋回)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.ROTATE_GAIN}
                      onChange={(e) => updateField('ROTATE_GAIN', parseFloat(e.target.value) || 0.1)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">読み込み中...</div>
          )}
        </div>

        {/* フッター */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
          >
            閉じる
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !config}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow"
          >
            <Save className="w-4 h-4" />
            <span>保存して適用</span>
          </button>
        </div>
      </div>
    </div>
  );
};
