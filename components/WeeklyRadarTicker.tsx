import React from 'react';

const WeeklyRadarTicker: React.FC = () => {
  // 模拟全球跨市场实时波幅
  const marketData = [
    { s: 'S&P 500', v: '5,026.1', c: '+12.4', p: '+0.25%' },
    { s: 'NASDAQ 100', v: '17,892.5', c: '+94.2', p: '+0.52%' },
    { s: 'DAX 40', v: '17,112.0', c: '-15.4', p: '-0.09%' },
    { s: 'NIKKEI 225', v: '38,487.2', c: '+320.5', p: '+0.84%' },
    { s: 'VIX_INDEX', v: '14.22', c: '-0.45', p: '-3.12%' },
    { s: 'DXY_DOLLAR', v: '104.18', c: '+0.05', p: '+0.04%' },
    { s: 'WTI_CRUDE', v: '78.24', c: '+1.15', p: '+1.48%' },
    { s: 'GOLD_SPOT', v: '2,024.5', c: '+12.1', p: '+0.60%' }
  ];

  return (
    <div className="h-full bg-black flex items-center overflow-hidden border-b border-white/5 select-none">
      {/* 侧边标签 */}
      <div className="h-full bg-cyan-950/30 px-3 flex items-center border-r border-white/10 z-10 shrink-0">
        <span className="text-[8px] font-black text-cyan-400 tracking-[2px] animate-pulse">GLOBAL_TAPE</span>
      </div>
      
      {/* 滚动容器 */}
      <div className="flex animate-scroll whitespace-nowrap items-center">
        {[...marketData, ...marketData].map((m, i) => (
          <div key={i} className="flex items-center gap-4 px-8 border-r border-white/[0.03]">
            <span className="text-[9px] font-black text-slate-500">{m.s}</span>
            <span className="text-[10px] font-bold text-white tracking-tighter">{m.v}</span>
            <span className={`text-[9px] font-black ${m.p.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {m.p}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default WeeklyRadarTicker;