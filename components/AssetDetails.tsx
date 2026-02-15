
import React from 'react';
import { StockItem } from '../types';

const AssetDetails: React.FC<{ asset: StockItem }> = ({ asset }) => {
  const perf = asset.performance || { w1: '0.00%', m1: '0.00%', m3: '0.00%', m6: '0.00%', ytd: '0.00%', y1: '0.00%' };

  return (
    <div className="flex flex-col p-4 border-t border-slate-800 bg-panel-dark/40 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{asset.symbol}</h2>
          <p className="text-[10px] text-slate-500 uppercase font-bold">{asset.name}</p>
        </div>
        <div className="flex gap-2">
           <span className="material-icons text-slate-500 text-sm">settings</span>
           <span className="material-icons text-slate-500 text-sm">more_horiz</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-black font-mono">{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">USD</span>
        <span className={`text-sm font-bold ${asset.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {asset.isPositive ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
        </span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase border-y border-slate-800/50 py-2">
        <span className="material-icons text-xs text-green-500">fiber_manual_record</span>
        Market Open
        <span className="ml-auto text-slate-400">Last Update: Feb 13, 16:02 GMT-5</span>
      </div>

      <div className="mb-6">
        <h4 className="text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Performance</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '1W', val: perf.w1 },
            { label: '1M', val: perf.m1 },
            { label: '3M', val: perf.m3 },
            { label: '6M', val: perf.m6 },
            { label: 'YTD', val: perf.ytd },
            { label: '1Y', val: perf.y1 },
          ].map((item) => {
            const isPos = !item.val.startsWith('-');
            return (
              <div key={item.label} className="bg-slate-800/20 border border-slate-800/50 p-2 rounded flex flex-col items-center">
                <span className={`text-[11px] font-bold ${isPos ? 'text-green-500' : 'text-red-500'}`}>{item.val}</span>
                <span className="text-[8px] text-slate-500 font-black uppercase mt-0.5">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Seasonals</h4>
        <div className="w-full h-12 bg-slate-800/30 rounded border border-dashed border-slate-700 flex items-center justify-center">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Load seasonal charts</span>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
