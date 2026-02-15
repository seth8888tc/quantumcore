import React, { useState, useMemo } from 'react';
import { VolumeMath, Candle } from './VolumeMath';
import TradingViewChart from './TradingViewChart';

interface Props {
  symbol: string;
  centralData: Candle[];
}

const ChartWarRoom: React.FC<Props> = ({ symbol, centralData }) => {
  const [mode, setMode] = useState<'SHORT' | 'MEDIUM' | 'LONG'>('SHORT'); // 默认设为 SHORT 方便看光

  // 1. 数据处理（含周末模拟逻辑）
  const processedData = useMemo(() => {
    if (centralData && centralData.length > 5) return centralData;
    
    // 如果中央数据为空（周末），生成 30 天模拟数据
    console.log("HUD: Activating Mock Data Stream...");
    return Array.from({ length: 30 }).map((_, i) => ({
      time: Date.now() / 1000 - (30 - i) * 86400,
      open: 150, high: 160, low: 140, close: 155,
      volume: i === 29 ? 2500000 : 1000000 // 让最后一根 K 线放巨量，强行触发青光
    }));
  }, [centralData]);

  // 2. 量价精算
  const analytics = useMemo(() => {
    const data = processedData;
    const latest = data[data.length - 1];
    const pocPrice = VolumeMath.calculatePOC(data);
    const offset = ((latest.close - pocPrice) / pocPrice) * 100;

    return {
      rvol: VolumeMath.calculateRVOL(latest.volume, data),
      isBullishFlow: VolumeMath.calculateVolumeFlow(data),
      poc: pocPrice,
      currentPrice: latest.close,
      offset: offset
    };
  }, [processedData]);

  // 3. 三维战术判定
  const isShortAlert = mode === 'SHORT' && (analytics?.rvol || 0) > 1.2; // 调低门槛，更容易亮
  const isMediumGlow = mode === 'MEDIUM' && analytics?.isBullishFlow;
  const isLongSafe = mode === 'LONG' && (analytics?.currentPrice || 0) > (analytics?.poc || 0);
  const isOnSupport = (analytics?.offset || 0) > 0 && (analytics?.offset || 0) < 3;

  return (
    <div className={`relative w-full h-full transition-all duration-700 bg-black border-[6px] ${
      isShortAlert ? 'border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.6)] animate-pulse' : 'border-slate-900'
    }`}>
      
      {/* 顶部控制台 */}
      <div className="absolute top-4 right-16 z-50 flex gap-2">
        {(['SHORT', 'MEDIUM', 'LONG'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-1 text-[10px] font-black font-mono transition-all rounded-sm border ${
            mode === m ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_#22d3ee]' : 'text-slate-500 border-slate-800'
          }`}>{m}</button>
        ))}
      </div>

      {/* 长期模式：底部安全带 */}
      {mode === 'LONG' && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-950 z-10">
          <div className={`h-full transition-all duration-1000 ${isLongSafe ? 'bg-cyan-400' : 'bg-red-600'}`} style={{ width: isLongSafe ? '100%' : '30%' }} />
        </div>
      )}

      {/* 中期模式：侧边绿条 */}
      {mode === 'MEDIUM' && (
        <div className={`absolute left-0 top-0 bottom-0 w-2 z-10 transition-all ${isMediumGlow ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-transparent'}`} />
      )}

      {/* 右侧：筹码峰引力标签 */}
      {analytics && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-md border-l-4 border-cyan-400 p-3 flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase font-black">Gravity_Center</span>
            <span className="text-lg font-black font-mono text-cyan-400">${analytics.poc.toFixed(2)}</span>
            <span className={`text-[9px] font-bold ${isOnSupport ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>
              {analytics.offset > 0 ? 'ABOVE_POC' : 'BELOW_POC'}
            </span>
        </div>
      )}

      {/* 主图 */}
      <div className="w-full h-full opacity-80">
        <TradingViewChart symbol={symbol} />
      </div>

      {/* 底部看板 */}
      <div className="absolute bottom-10 left-8 z-20 bg-black/90 border border-white/10 p-3 rounded flex gap-6 font-mono text-[10px]">
          <div className="flex flex-col">
            <span className="text-slate-600 text-[8px] uppercase">RVOL_Index</span>
            <span className={isShortAlert ? 'text-cyan-400 font-bold' : 'text-white'}>{analytics?.rvol.toFixed(2)}</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-4">
            <span className="text-slate-600 text-[8px] uppercase">Trend_Flow</span>
            <span className={analytics?.isBullishFlow ? 'text-emerald-400' : 'text-rose-500'}>{analytics?.isBullishFlow ? 'BULLISH' : 'BEARISH'}</span>
          </div>
      </div>

    </div>
  );
};

export default ChartWarRoom;