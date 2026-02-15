import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChartWarRoom from './components/ChartWarRoom';
import RealtimeHeatmap from './components/RealtimeHeatmap';
import FundamentalsPage from './components/FundamentalsPage';
import NewsPage from './components/NewsPage';
import CompanyBrief from './components/CompanyBrief';
import IntegratedWatchlist from './components/IntegratedWatchlist';
import WeeklyRadarTicker from './components/WeeklyRadarTicker';
import { SidebarAnalytics } from './components/SidebarAnalytics';
import FundsPage from './components/FundsPage'; 
import FuturesPage from './components/FuturesPage'; 
import { VolumeMath, Candle } from './components/VolumeMath';

const App: React.FC = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('qc_watchlist');
    return saved ? JSON.parse(saved) : ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'BTCUSDT', 'SPY', 'QQQ'];
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NASDAQ:AAPL');
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sharedData, setSharedData] = useState<Candle[]>([]);
  const [isHighAlert, setIsHighAlert] = useState(false);
  const [weather, setWeather] = useState<any>({ SPY: { p: 0, c: 0 }, GLD: { p: 0, c: 0 }, BTC: { p: 0, c: 0 } });

  const API_KEY = 'd68ds3hr01qq5rjf75vgd68ds3hr01qq5rjf7600';
  const isWeekend = useMemo(() => [0, 6].includes(new Date().getDay()), []);

  // 1. 自动保存 Watchlist
  useEffect(() => { localStorage.setItem('qc_watchlist', JSON.stringify(watchlist)); }, [watchlist]);

  // 2. 搜索联想
  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const r = await fetch(`https://finnhub.io/api/v1/search?q=${searchQuery}&token=${API_KEY}`);
        const d = await r.json();
        if (d.result) setSuggestions(d.result.slice(0, 8));
      } catch (e) { }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. 数据泵 (个股)
  useEffect(() => {
    const fetchMain = async () => {
      const ticker = selectedSymbol.split(':')[1] || selectedSymbol;
      const end = Math.floor(Date.now() / 1000);
      const start = end - (60 * 60 * 24 * 30);
      try {
        const r = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${start}&to=${end}&token=${API_KEY}`);
        const j = await r.json();
        if (j.s === 'ok' && j.c) {
          const candles = j.t.map((t: any, i: number) => ({
            time: t, open: j.o[i], high: j.h[i], low: j.l[i], close: j.c[i], volume: j.v[i]
          }));
          setSharedData(candles);
          setIsHighAlert(VolumeMath.calculateRVOL(j.v[j.v.length - 1], candles) > 1.8);
        }
      } catch (e) { }
    };
    fetchMain();
  }, [selectedSymbol]);

  const selectSymbol = (s: any) => {
    const sym = typeof s === 'string' ? s : s.symbol;
    const formatted = sym.includes(':') ? sym : `NASDAQ:${sym}`;
    setSelectedSymbol(formatted);
    setActiveTab('Home');
    setSearchQuery('');
    setShowDropdown(false);
    const pure = sym.includes(':') ? sym.split(':')[1] : sym;
    if (!watchlist.includes(pure)) setWatchlist(prev => [pure, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-slate-300 overflow-hidden font-mono">
      <style>{`
        * { border-radius: 0 !important; font-family: 'JetBrains Mono', monospace !important; font-variant-numeric: tabular-nums; }
        ::-webkit-scrollbar { width: 2px; height: 2px; }
        ::-webkit-scrollbar-thumb { background: #222; }
        .tiled-gap { gap: 1px; background-color: #111; }
      `}</style>

      <header className="h-10 border-b border-white/5 flex items-center justify-between px-3 bg-[#050505] shrink-0 z-[1000]">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className={`w-1.5 h-1.5 ${isHighAlert ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]' : 'bg-emerald-500'}`} />
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">QUANTUM_CORE_PRO</h1>
          </div>
          <nav className="flex h-full gap-1">
            {['Home', 'Funds', 'Macro', 'Fundamentals', 'News'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 h-10 text-[9px] font-bold uppercase transition-all ${activeTab === t ? 'bg-white/5 text-cyan-400 border-b border-cyan-400' : 'text-slate-600'}`}>
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 max-w-xs mx-4 relative">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="COMMAND_SEARCH..."
            className="w-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] text-cyan-400 outline-none focus:border-cyan-500/50"
          />
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 shadow-2xl z-[2000]">
              {suggestions.map((s, idx) => (
                <div key={idx} onClick={() => selectSymbol(s)} className="px-3 py-1.5 hover:bg-white/5 cursor-pointer border-b border-white/[0.03] flex justify-between">
                  <span className="text-[10px] text-white">{s.displaySymbol}</span>
                  <span className="text-[7px] text-slate-700">{s.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-[8px] font-black">
          <span className={isWeekend ? 'text-rose-900' : 'text-emerald-900'}>{isWeekend ? 'WEEKEND_PAUSE' : 'LIVE_MARKET'}</span>
          <span className="text-white uppercase">{selectedSymbol.split(':')[1]}</span>
        </div>
      </header>

      <div className="h-8 shrink-0 border-b border-white/5 bg-black"><WeeklyRadarTicker /></div>

      <main className="flex-1 flex overflow-hidden tiled-gap bg-[#111]">
        {activeTab === 'Home' ? (
          <div className="flex h-full w-full tiled-gap">
            <div className="flex-1 flex flex-col tiled-gap overflow-hidden">
              <div className="flex-[75] relative bg-black">
                <ChartWarRoom symbol={selectedSymbol} centralData={sharedData} />
              </div>
              <div className="flex-[25] bg-black">
                <RealtimeHeatmap isHighAlert={isHighAlert} />
              </div>
            </div>
            <aside className="w-[300px] h-full flex flex-col bg-black border-l border-white/5 overflow-y-auto custom-scrollbar">
              <div className="p-3 border-b border-white/5"><IntegratedWatchlist watchlistSymbols={watchlist} selectedSymbol={selectedSymbol} onSymbolSelect={(s) => setSelectedSymbol(s)} /></div>
              <div className="p-3 border-b border-white/5"><SidebarAnalytics selectedSymbol={selectedSymbol} watchlist={watchlist} centralData={sharedData} /></div>
              <div className="p-3 flex-1"><CompanyBrief symbol={selectedSymbol} /></div>
            </aside>
          </div>
        ) : (
          <div className="flex-1 h-full overflow-y-auto bg-black p-6">
             {activeTab === 'Funds' && <FundsPage onSelectSymbol={selectSymbol} />}
             {activeTab === 'Macro' && <FuturesPage />}
             {activeTab === 'Fundamentals' && <FundamentalsPage symbol={selectedSymbol} />}
             {activeTab === 'News' && <NewsPage selectedSymbol={selectedSymbol} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;