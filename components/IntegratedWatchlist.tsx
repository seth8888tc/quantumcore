
import React, { useState, useEffect, useMemo } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  pc: number; // Percent change
}

interface IntegratedWatchlistProps {
  watchlistSymbols: string[];
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
  onSymbolRemove: (symbol: string) => void;
}

const FINNHUB_API_KEY = 'd68ds3hr01qq5rjf75vgd68ds3hr01qq5rjf7600';

const IntegratedWatchlist: React.FC<IntegratedWatchlistProps> = ({ 
  watchlistSymbols, 
  selectedSymbol, 
  onSymbolSelect, 
  onSymbolRemove 
}) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanSelected = useMemo(() => {
    return selectedSymbol.includes(':') ? selectedSymbol.split(':')[1] : selectedSymbol;
  }, [selectedSymbol]);

  const fetchData = async () => {
    if (watchlistSymbols.length === 0) {
      setStocks([]);
      setLoading(false);
      return;
    }

    try {
      const results = await Promise.all(
        watchlistSymbols.map(async (symbol) => {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
          const data = await res.json();
          return {
            symbol,
            price: data.c, 
            change: data.d,
            pc: data.dp,   
          };
        })
      );
      setStocks(results);
    } catch (error) {
      console.error("Watchlist sync failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
  }, [watchlistSymbols]);

  if (loading && stocks.length === 0 && watchlistSymbols.length > 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Syncing Feed...</span>
        </div>
      </div>
    );
  }

  if (watchlistSymbols.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-slate-800 text-[10px] font-black uppercase tracking-widest p-10 text-center">
        No Assets Under Surveillance
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden font-mono">
      {/* Table Header */}
      <div className="flex items-center px-4 py-2 border-b border-slate-900 bg-slate-950/30 text-[8px] font-black text-slate-600 uppercase tracking-widest">
        <span className="w-20">Symbol</span>
        <span className="flex-1 text-right">Price</span>
        <span className="w-16 text-right">Chg%</span>
        <span className="w-8"></span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-slate-900/40">
          {stocks.map((stock) => {
            const isSelected = cleanSelected === stock.symbol;
            const isPositive = stock.pc >= 0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSymbolSelect(stock.symbol)}
                className={`flex items-center px-4 py-2.5 cursor-pointer transition-all group relative ${
                  isSelected ? 'bg-slate-900 border-l-2 border-primary' : 'hover:bg-slate-900/50 border-l-2 border-transparent'
                }`}
              >
                <div className="w-20 flex flex-col leading-none">
                  <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-primary' : 'text-slate-400'} group-hover:text-white transition-colors`}>
                    {stock.symbol}
                  </span>
                  <span className="text-[7px] text-slate-700 font-bold uppercase mt-0.5 tracking-tighter">Live</span>
                </div>

                <div className="flex-1 text-right">
                  <span className="text-[11px] font-bold text-white tracking-tight">
                    {stock.price ? stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                  </span>
                </div>

                <div className="w-16 text-right">
                  <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{stock.pc?.toFixed(2)}%
                  </span>
                </div>

                {/* Remove Button - Appears on Hover */}
                <div className="w-8 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSymbolRemove(stock.symbol);
                    }}
                    className="material-icons text-slate-800 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm p-0.5 hover:bg-red-500/10 rounded"
                    title="Remove from Surveillance"
                  >
                    close
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IntegratedWatchlist;
