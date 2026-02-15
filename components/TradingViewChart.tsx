
import React, { useEffect, useRef } from 'react';

const TradingViewChart: React.FC<{ symbol?: string }> = ({ symbol = "NASDAQ:AAPL" }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (window.TradingView && container.current) {
          new window.TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#000000",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": container.current.id,
            "backgroundColor": "#000000",
            "gridColor": "rgba(42, 46, 57, 0.06)",
            "width": "100%",
            "height": "100%",
            "loading_screen": { "backgroundColor": "#000000" }
          });
        }
      };
      container.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div 
      id="tv_chart_container" 
      ref={container} 
      className="w-full h-full bg-black" 
    />
  );
};

declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;
