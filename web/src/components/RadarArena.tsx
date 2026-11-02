import React, { useEffect, useRef } from 'react';

interface RadarArenaProps {
  pos: [number, number];
  angle: number;
  obj: [number, number];
}

export const RadarArena: React.FC<RadarArenaProps> = ({ pos, angle, obj }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const scale = width / 5.0; // -2.5 〜 2.5 の範囲を描画

    ctx.clearRect(0, 0, width, height);

    // 背景レーダーサークル
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    [0.5, 1.0, 1.5, 2.0].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 十字軸
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // 目標 Obj (星/赤丸)
    const ox = cx + obj[0] * scale;
    const oy = cy - obj[1] * scale;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // エージェント (シアンの矢印/トライアングル)
    const ax = cx + pos[0] * scale;
    const ay = cy - pos[1] * scale;

    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(-angle); // Y軸反転のため

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-6, -5);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }, [pos, angle, obj]);

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg">
      <div className="text-[11px] font-semibold text-slate-400 mb-1 w-full text-left">
        🧭 アリーナ (Pos & Obj)
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={130} height={130} className="rounded-full bg-slate-950/60 border border-slate-800/80" />
      </div>
      <div className="flex justify-between w-full mt-1 px-1 font-mono text-[10px] text-slate-400">
        <span>P: ({pos[0].toFixed(2)}, {pos[1].toFixed(2)})</span>
        <span className="text-rose-400">Obj: ({obj[0].toFixed(2)}, {obj[1].toFixed(2)})</span>
      </div>
    </div>
  );
};
