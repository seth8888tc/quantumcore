
import React, { useState } from 'react';
import { SectorPerformance } from '../types';

interface SectorCardProps {
  data: SectorPerformance;
  onSymbolSelect: (symbol: string) => void;
}

const SectorCard: React.FC<SectorCardProps> = ({ data, onSymbolSelect }) => {
  const { name, performance, isPositive, percentageWidth, leaders } = data;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-1 border-b border-slate-800/30 pb-3 last:border-0">
      <div 
        className="flex justify-between items-center text-[11px] font-bold cursor-pointer hover:bg-slate-800/20 p-1 rounded transition-all group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className={`material-icons text-[14px] transition-transform duration-200 ${isExpanded ? 'rotate-90 text-primary' : 'text-slate-600'}`}>
            chevron_right
          </span>
          <span className="text-slate-400 group-hover:text-slate-200 truncate">{name}</span>
        </div>
        <span className={`font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{performance}%
        </span>
      </div>
      
      <div className="px-1">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} 
            style={{ width: `${percentageWidth}%` }}
          />
        </div>
      </div>
      
      {isExpanded && leaders && (
        <div className="mt-1 ml-3 border-l-2 border-slate-800 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
          {leaders.map((leader) => (
            <div 
              key={leader.symbol}
              onClick={(e) => {
                e.stopPropagation();
                onSymbolSelect(leader.symbol);
              }}
              className="flex justify-between items-center text-[10px] py-1.5 pl-3 pr-2 hover:bg-primary/10 rounded-r-md cursor-pointer transition-colors group relative"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[2px] bg-slate-800 group-hover:bg-primary"></div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-300 group-hover:text-primary transition-colors">{leader.symbol}</span>
                <span className="text-[8px] text-slate-600 uppercase truncate max-w-[80px]">{leader.name}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-[9px] ${leader.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {leader.isPositive ? '+' : ''}{leader.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectorCard;
