import React, { useEffect, useRef } from 'react';

interface WaveMonitorProps {
  sunlight: number;
  generatorPower: number;
  energy: number;
  innerStep: number;
}

export const WaveMonitor: React.FC<WaveMonitorProps> = ({
  sunlight,
  generatorPower,
  energy,
  innerStep,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<{
    step: number[];
    sun: number[];
    gen: number[];
    energy: number[];
  }>({
    step: [],
    sun: [],
    gen: [],
    energy: [],
  });

  const MAX_HISTORY = 250;

  useEffect(() => {
    const hist = historyRef.current;
    hist.step.push(innerStep);
    hist.sun.push(sunlight);
    hist.gen.push(generatorPower);
    hist.energy.push(energy);

    if (hist.step.length > MAX_HISTORY) {
      hist.step.shift();
      hist.sun.shift();
      hist.gen.shift();
      hist.energy.shift();
    }
  }, [innerStep, sunlight, generatorPower, energy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const hist = historyRef.current;
      const n = hist.step.length;

      ctx.clearRect(0, 0, width, height);

      // 背景グリッド
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 0.25; y < 1.0; y += 0.25) {
        const py = height * y;
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
      }
      ctx.stroke();

      if (n < 2) {
        animId = requestAnimationFrame(render);
        return;
      }

      const drawSeries = (data: number[], color: string, fillGradient?: boolean) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        for (let i = 0; i < n; i++) {
          const x = (i / (MAX_HISTORY - 1)) * width;
          const y = height - data[i] * (height - 10) - 5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (fillGradient) {
          ctx.lineTo(((n - 1) / (MAX_HISTORY - 1)) * width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'));
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      };

      // 1. 太陽光 (イエロー)
      drawSeries(hist.sun, '#eab308');

      // 2. 発電出力 (エメラルドグリーン)
      drawSeries(hist.gen, '#10b981', true);

      // 3. バッテリーエネルギー (シアン)
      drawSeries(hist.energy, '#38bdf8');

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
        <span className="text-xs font-semibold text-slate-300">📊 リアルタイム波形モニター</span>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>
            ☀️ 太陽光: {sunlight.toFixed(2)}
          </span>
          <span className="flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>
            ⚡ 発電量: {generatorPower.toFixed(2)}
          </span>
          <span className="flex items-center text-sky-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block mr-1"></span>
            🔋 バッテリー: {(energy * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="flex-1 w-full relative min-h-[110px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
