
import React, { useEffect, useRef, memo } from 'react';

const RealtimeHeatmap: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      // Clear existing content
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "exchanges": [],
        "dataSource": "S&P500",
        "grouping": "sector",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasSymbolTooltip": true,
        "isTransparent": true,
        "width": "100%",
        "height": "100%"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-full bg-black overflow-hidden border-t border-slate-900/30">
      <div ref={container} className="w-full h-full" />
    </div>
  );
};

export default memo(RealtimeHeatmap);
