import React, { useState, useEffect } from 'react';

interface Props { selectedSymbol: string; }

const NewsPage: React.FC<Props> = ({ selectedSymbol }) => {
  const [news, setNews] = useState<any[]>([]);
  const ticker = selectedSymbol.split(':')[1] || selectedSymbol;
  const API_KEY = 'd68ds3hr01qq5rjf75vgd68ds3hr01qq5rjf7600';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const r = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=2026-02-01&to=2026-02-14&token=${API_KEY}`);
        const d = await r.json();
        setNews(Array.isArray(d) ? d.slice(0, 15) : []);
      } catch (e) { console.error(e); }
    };
    fetchNews();
  }, [ticker]);

  return (
    <div className="w-full h-full font-mono bg-black p-4">
      <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-end">
        <h2 className="text-cyan-500 text-[11px] font-black tracking-[0.4em] uppercase">Intelligence_Feed // {ticker}</h2>
        <span className="text-[8px] text-slate-700">SOURCE: FINNHUB_AGENCY</span>
      </div>
      <div className="space-y-4">
        {news.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block group border-b border-white/[0.03] pb-4">
            <div className="text-[8px] text-slate-600 mb-1">{new Date(item.datetime * 1000).toLocaleString()} // {item.source}</div>
            <h3 className="text-[11px] text-slate-200 group-hover:text-cyan-400 transition-colors uppercase font-black leading-tight">{item.headline}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;