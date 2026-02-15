
import React from 'react';

interface SentimentGaugeProps {
  value: number;
  label: string;
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ value, label }) => {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Semi-circle background */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-slate-800"></div>
        
        {/* Progress Arc (Colored segments) */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-t-red-500/20 border-l-red-500/20 -rotate-45"></div>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-t-yellow-500/20 border-r-yellow-500/20 rotate-45"></div>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-t-green-500/20 rotate-0"></div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-primary origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="absolute -top-1 -left-0.5 w-1.5 h-1.5 bg-primary rounded-full"></div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-2xl font-black text-slate-100">{value}</span>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{label}</div>
      </div>
    </div>
  );
};

export default SentimentGauge;
