// 量价时空核心算法 - 大脑模块
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const VolumeMath = {
  // 1. 计算相对成交量 (RVOL) - 短期爆发力
  calculateRVOL: (currentVol: number, history: Candle[]) => {
    if (!history || history.length < 20) return 1;
    const avgVol = history.slice(-20).reduce((acc, c) => acc + c.volume, 0) / 20;
    return currentVol / avgVol;
  },

  // 2. 计算价格波幅比 - 短期异动
  calculateSpreadRatio: (currentCandle: Candle, history: Candle[]) => {
    if (!history || history.length < 20) return 1;
    const currentSpread = currentCandle.high - currentCandle.low;
    const avgSpread = history.slice(-20).reduce((acc, c) => acc + (c.high - c.low), 0) / 20;
    return currentSpread / avgSpread;
  },

  // 3. 计算筹码峰 (POC) - 长期成本区
  calculatePOC: (history: Candle[]) => {
    if (!history || history.length === 0) return 0;
    const bins: { [key: string]: number } = {};
    const step = 0.5; // 价格区间步长
    
    history.forEach(c => {
      const priceBin = Math.floor(c.close / step) * step;
      bins[priceBin] = (bins[priceBin] || 0) + c.volume;
    });

    const sortedBins = Object.keys(bins).sort((a, b) => bins[b] - bins[a]);
    return parseFloat(sortedBins[0]);
  },

  // 4. 计算买卖盘力量 (Volume Flow) - 中期趋势
  calculateVolumeFlow: (history: Candle[]) => {
    if (!history || history.length < 20) return false;
    let upVol = 0;
    let downVol = 0;
    history.slice(-20).forEach(c => {
      if (c.close >= c.open) upVol += c.volume;
      else downVol += c.volume;
    });
    return upVol > downVol; // 买盘多于卖盘
  }
};