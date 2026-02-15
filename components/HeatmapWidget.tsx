import React from 'react';

interface Props {
  isHighAlert?: boolean;
}

const RealtimeHeatmap: React.FC<Props> = ({ isHighAlert = false }) => {
  const sectors = [
    { name: 'TECH', change: +2.5, weight: 35 },
    { name: 'FIN', change: -0.8, weight: 20 },
    { name: 'SEMI', change: +4.2, weight: 25 },
    { name: 'ENERGY', change: +1.1, weight: 20 }
  ];

  return (
    <div className={`w-full h-full relative transition-all duration-500 bg-black flex flex-wrap p-1 gap-1 border-t-2 ${isHighAlert ? 'border-cyan-500/50' : 'border-slate-900'}`}>
      {isHighAlert && <div className="absolute inset-0 bg-cyan-400/5 z-10 animate-pulse pointer-events-none"></div>}
      
      {sectors.map(s => (
        <div key={s.name} className={`flex-1 flex flex-col justify-center items-center rounded border border-black/20 ${s.change > 0 ? 'bg-emerald-600/80' : 'bg-rose-700/80'}`} style={{ flexBasis: `${s.weight}%` }}>
          <span className="text-[10px] font-black opacity-50">{s.name}</span>
          <span className="text-sm font-black">{s.change > 0 ? '+' : ''}{s.change}%</span>
          {isHighAlert && s.change > 2 && <span className="material-icons text-[12px] text-cyan-300 animate-bounce">bolt</span>}
        </div>
      ))}
      
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-600 uppercase">
        {isHighAlert ? "!!! TACTICAL_ALERT_ACTIVE !!!" : "Market_Scan_Normal"}
      </div>
    </div>
  );
};

export default RealtimeHeatmap;