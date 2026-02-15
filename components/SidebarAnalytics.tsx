import React, { useMemo } from 'react';
import { VolumeMath, Candle } from './VolumeMath';

interface Props {
  selectedSymbol: string;
  watchlist: string[];
  centralData: Candle[]; // 接收来自 App.tsx 的中央数据
}

export const SidebarAnalytics: React.FC<Props> = ({ selectedSymbol, watchlist, centralData }) => {
  
  // 直接利用中央数据进行分析，无需 fetch
  const stats = useMemo(() => {
    if (!centralData || centralData.length < 5) return null;
    const latest = centralData[centralData.length - 1];
    
    const rvol = VolumeMath.calculateRVOL(latest.volume, centralData);
    const poc = VolumeMath.calculatePOC(centralData);
    const distToPOC = ((latest.close - poc) / poc) * 100;
    const isBullish = VolumeMath.calculateVolumeFlow(centralData);

    return { rvol, poc, distToPOC, isBullish };
  }, [centralData]);

  // 如果没有数据，显示扫描状态
  if (!centralData || centralData.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin inline-block w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full mb-2"></div>
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Awaiting_Data_Feed...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-4 bg-black font-mono">
      {/* 1. 量价扫描监控面板 */}
      <div className={`p-4 rounded border-l-4 transition-all duration-700 ${
        (stats?.rvol || 0) > 1.5 
          ? 'bg-cyan-950/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
          : 'bg-slate-900/30 border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Volume_Intensity</span>
            <span className={`text-2xl font-black ${(stats?.rvol || 0) > 1.5 ? 'text-cyan-400 animate-pulse' : 'text-white'}`}>
              {stats?.rvol.toFixed(2) || '---'}
            </span>
          </div>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-tighter border ${
            stats?.isBullish 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {stats?.isBullish ? 'ACCUMULATING' : 'DISTRIBUTING'}
          </div>
        </div>

        {/* 2. 筹码引力条 */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold">
            <span className="text-slate-500 uppercase">POC_Base_Gap</span>
            <span className={stats && stats.distToPOC > 0 ? 'text-cyan-400' : 'text-rose-500'}>
              {stats?.distToPOC.toFixed(2)}%
            </span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${stats && stats.distToPOC > 0 ? 'bg-cyan-400' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(Math.max(50 + (stats?.distToPOC || 0), 5), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. 动态战术简报 */}
      <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-lg relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-[12px] text-primary">analytics</span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tactical Brief</span>
        </div>
        <p className="text-[10px] text-slate-300 leading-relaxed font-sans italic min-h-[40px]">
          {(stats?.rvol || 0) > 2 ? "SIGNAL: Massive institutional footprint. Price action confirmed by extreme relative volume." :
           (stats?.distToPOC || 0) < -3 ? "WARNING: Price collapsed below volume shelf. Significant overhead supply detected." :
           (stats?.isBullish && (stats?.distToPOC || 0) > 0) ? "BULLISH: Sustained accumulation above POC base. Healthy trend structure." :
           "NEUTRAL: Trading within established volume parameters. No tactical divergence detected."}
        </p>
      </div>

      {/* 4. 雷达状态 */}
      <div className="mt-2 pt-4 border-t border-slate-900 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-700 font-black uppercase tracking-[2px]">Terminal_Surveillance</span>
          <span className="text-[9px] text-emerald-500 font-mono flex items-center gap-1">
             <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
             LIVE_FEED_SYNCED
          </span>
        </div>
        <span className="material-icons text-slate-800 text-lg">radar</span>
      </div>
    </div>
  );
};