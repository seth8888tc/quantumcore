
import React, { useState, useEffect, useMemo, useRef } from 'react';

interface CompanyBriefProps {
  symbol: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

// Global cache for persistent data between component re-renders
const metricsCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const FINNHUB_API_KEY = 'd68ds3hr01qq5rjf75vgd68ds3hr01qq5rjf7600';

const CompanyBrief: React.FC<CompanyBriefProps> = ({ symbol }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  
  const cleanSymbol = useMemo(() => {
    if (!symbol) return '';
    return symbol.includes(':') ? symbol.split(':')[1] : symbol;
  }, [symbol]);

  useEffect(() => {
    // 1. Clear any existing debounce timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // 2. Handle invalid symbols or indices that don't have stock metrics
    if (!cleanSymbol || ['SPX', 'DXY', 'US10Y', 'BTC', 'ETH', 'SOL'].some(s => cleanSymbol.includes(s))) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    // 3. Check Cache first for immediate UI response
    const cachedItem = metricsCache[cleanSymbol];
    const now = Date.now();
    
    if (cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
      setMetrics(cachedItem.data);
      setLoading(false);
      return;
    }

    // 4. If not in cache or expired, initiate debounced fetch
    debounceTimerRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/metric?symbol=${cleanSymbol}&metric=all&token=${FINNHUB_API_KEY}`
        );
        const data = await response.json();
        
        if (data && data.metric && Object.keys(data.metric).length > 0) {
          // Update global cache
          metricsCache[cleanSymbol] = {
            data: data.metric,
            timestamp: Date.now()
          };
          setMetrics(data.metric);
        } else {
          setMetrics(null);
        }
      } catch (e) {
        console.error("Brief fetch failed", e);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce window

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cleanSymbol]);

  if (loading) {
    return (
      <div className="p-4 bg-black">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Retrieving Intelligence...</span>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-slate-900/40 animate-pulse rounded border border-slate-900"></div>
          <div className="h-10 bg-slate-900/40 animate-pulse rounded border border-slate-900"></div>
        </div>
      </div>
    );
  }

  if (!metrics) return (
    <div className="p-8 text-center flex flex-col items-center gap-3">
      <span className="material-icons text-slate-900 text-3xl">analytics</span>
      <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-relaxed">
        Select valid equity asset<br/>to initialize metrics link
      </span>
    </div>
  );

  const low = metrics['52WeekLow'];
  const high = metrics['52WeekHigh'];
  const current = metrics.currentPrice || ((high + low) / 2);
  const rangePercent = high !== low ? ((current - low) / (high - low)) * 100 : 50;

  const formatVal = (val: any, decimals: number = 2) => 
    val !== null && val !== undefined && !isNaN(val) 
      ? Number(val).toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) 
      : '--';

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Key Metric Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
        <div className="group">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 group-hover:text-slate-400 transition-colors">Market Cap</span>
          <span className="text-[12px] font-mono font-bold text-white tracking-tight">
            ${metrics.marketCapitalization ? (metrics.marketCapitalization / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}B
          </span>
        </div>
        <div className="group">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 group-hover:text-slate-400 transition-colors">P/E Ratio</span>
          <span className="text-[12px] font-mono font-bold text-white tracking-tight">{formatVal(metrics.peNormalized)}x</span>
        </div>
        <div className="group">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 group-hover:text-slate-400 transition-colors">Div Yield</span>
          <span className="text-[12px] font-mono font-bold text-white tracking-tight">{formatVal(metrics.dividendYieldIndicatedAnnual)}%</span>
        </div>
        <div className="group">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 group-hover:text-slate-400 transition-colors">Beta (1Y)</span>
          <span className="text-[12px] font-mono font-bold text-white tracking-tight">{formatVal(metrics.beta)}</span>
        </div>
      </div>

      {/* 52-Week Range Visualizer */}
      <div className="space-y-3 border-t border-slate-900/80 pt-5">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">52W Range Analysis</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">L/H Proximity</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-black font-mono ${rangePercent > 70 ? 'text-green-500' : rangePercent < 30 ? 'text-red-500' : 'text-primary'}`}>
              {rangePercent.toFixed(1)}%
            </span>
            <span className="text-[7px] text-slate-700 font-bold uppercase">Percentile</span>
          </div>
        </div>

        <div className="relative h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
          <div 
            className={`absolute top-0 bottom-0 transition-all duration-700 ease-out rounded-full z-10 ${
              rangePercent > 70 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
              rangePercent < 30 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 
              'bg-primary shadow-[0_0_10px_#136dec]'
            }`}
            style={{ width: '6px', left: `calc(${Math.min(100, Math.max(0, rangePercent))}% - 3px)` }}
          />
          {/* Subtle gradient background for the track */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-slate-800/10 to-green-500/10 opacity-30"></div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500">
          <div className="flex flex-col">
            <span className="text-white">{formatVal(low)}</span>
            <span className="text-[7px] uppercase text-slate-800">Low</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white">{formatVal(high)}</span>
            <span className="text-[7px] uppercase text-slate-800">High</span>
          </div>
        </div>
      </div>
      
      {/* Cache Status Badge */}
      <div className="mt-6 flex items-center gap-1.5 opacity-20 hover:opacity-100 transition-opacity">
        <span className="material-icons text-[10px] text-slate-600">cached</span>
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Local Intel Cache Active</span>
      </div>
    </div>
  );
};

export default CompanyBrief;
