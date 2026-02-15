import React from 'react';

const FuturesPage: React.FC = () => {
  const sections = [
    { title: "EQUITY_FUTURES", items: [
      {s:'ES=F', n:'S&P_500', p:'5,021.25', c:'+12.50', dp:'+0.25%'},
      {s:'NQ=F', n:'NASDAQ_100', p:'17,842.00', c:'+85.25', dp:'+0.48%'},
      {s:'YM=F', n:'DOW_30', p:'38,620.00', c:'-42.00', dp:'-0.11%'}
    ]},
    { title: "RATES_&_CURRENCY", items: [
      {s:'ZN=F', n:'10Y_T_NOTE', p:'110.15', c:'+0.04', dp:'+0.02%'},
      {s:'DX=F', n:'US_DOLLAR', p:'104.12', c:'+0.12', dp:'+0.11%'},
      {s:'6E=F', n:'EUR/USD', p:'1.0782', c:'-0.0014', dp:'-0.13%'}
    ]},
    { title: "METALS_&_ENERGY", items: [
      {s:'GC=F', n:'GOLD_SPOT', p:'2,034.50', c:'+15.20', dp:'+0.75%'},
      {s:'HG=F', n:'COPPER_DR', p:'3.7845', c:'+0.042', dp:'+1.12%'},
      {s:'CL=F', n:'WTI_CRUDE', p:'76.84', c:'+2.45', dp:'+3.30%'}
    ]},
    { title: "AGRI_SOFT", items: [
      {s:'ZC=F', n:'CORN_FUT', p:'428.25', c:'-2.50', dp:'-0.58%'},
      {s:'KC=F', n:'COFFEE_AR', p:'188.45', c:'+4.20', dp:'+2.28%'}
    ]}
  ];

  return (
    <div className="w-full h-full bg-black font-mono p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8 text-[10px] text-slate-700">
        <span className="text-cyan-500 animate-pulse">●</span> LIVE_CORRELATION_SYNC_ACTIVE
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
        {sections.map(sec => (
          <div key={sec.title} className="flex flex-col">
            <h3 className="text-[10px] font-black text-slate-500 border-b border-white/10 pb-1 mb-4 tracking-tighter uppercase">{sec.title}</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-slate-800 font-black mb-1">
                <span>SYMBOL</span>
                <span>PRICE</span>
                <span>CHG%</span>
              </div>
              {sec.items.map(i => (
                <div key={i.s} className="flex justify-between items-center py-2 border-b border-white/[0.02] hover:bg-white/5 transition-all cursor-crosshair">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white">{i.s}</span>
                    <span className="text-[7px] text-slate-700 font-bold">{i.n}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">{i.p}</div>
                  <div className={`text-[10px] font-black ${i.dp.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {i.dp}
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

export default FuturesPage;