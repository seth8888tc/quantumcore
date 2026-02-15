import React from 'react';

interface Props { onSelectSymbol: (s: string) => void; }

const FundsPage: React.FC<Props> = ({ onSelectSymbol }) => {
  const groups = [
    { cat: "SECTOR_ALPHA", items: [
      {s:'SMH', n:'SEMICON_CORE', delta:'+2.4', rsi:72, vol:'28%'},
      {s:'SOXX', n:'PHLX_SEMI', delta:'+2.1', rsi:68, vol:'24%'},
      {s:'IGV', n:'SOFTW_EXP', delta:'+0.8', rsi:54, vol:'19%'},
      {s:'XBI', n:'BIOTECH_AGGR', delta:'-1.4', rsi:42, vol:'38%'}
    ]},
    { cat: "GROWTH_INDEX", items: [
      {s:'QQQ', n:'NASDAQ_100', delta:'+1.2', rsi:65, vol:'18%'},
      {s:'VUG', n:'VANG_GROWTH', delta:'+0.9', rsi:61, vol:'15%'},
      {s:'SCHG', n:'SCHWAB_L_CAP', delta:'+1.1', rsi:63, vol:'14%'},
      {s:'ARKK', n:'INNOV_SPEC', delta:'-4.2', rsi:31, vol:'45%'}
    ]},
    { cat: "MACRO_SENTIMENT", items: [
      {s:'SPY', n:'S&P500_TRUST', delta:'+0.4', rsi:58, vol:'12%'},
      {s:'IWM', n:'RUSSELL_2000', delta:'-0.2', rsi:48, vol:'22%'},
      {s:'XLE', n:'ENERGY_SEL', delta:'+3.5', rsi:78, vol:'31%'},
      {s:'TLT', n:'20Y_TREASURY', delta:'-0.5', rsi:35, vol:'14%'}
    ]}
  ];

  return (
    <div className="w-full h-full font-mono bg-black text-[10px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5 border-b border-white/5">
        {groups.map(g => (
          <div key={g.cat} className="bg-black p-4 border-r border-white/5 last:border-none">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
              <span className="text-cyan-400 font-black tracking-[3px]">{g.cat}</span>
              <span className="text-slate-700">SCAN: OK</span>
            </div>
            <div className="space-y-4">
              {g.items.map(i => (
                <div key={i.s} onClick={() => onSelectSymbol(i.s)} className="group cursor-pointer hover:bg-white/5 p-2 transition-all">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-black text-white group-hover:text-cyan-400">{i.s}</span>
                    <span className={i.delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{i.delta}%</span>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-600 mb-2 uppercase">
                    <span>{i.n}</span>
                    <span>VOL: {i.vol}</span>
                  </div>
                  <div className="h-[2px] w-full bg-slate-900 overflow-hidden">
                    <div className={`h-full ${i.rsi > 70 ? 'bg-rose-500' : 'bg-cyan-500'}`} style={{ width: `${i.rsi}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundsPage;