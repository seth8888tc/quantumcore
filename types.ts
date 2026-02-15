
export interface PerformanceMetrics {
  w1: string;
  m1: string;
  m3: string;
  m6: string;
  ytd: string;
  y1: string;
}

export interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  high?: number;
  low?: number;
  performance?: PerformanceMetrics;
}

export interface SectorPerformance {
  name: string;
  performance: number;
  isPositive: boolean;
  percentageWidth: number;
  leaders?: StockItem[];
}

export interface IndexTicker {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface EconomicIndicator {
  name: string;
  last: string;
  previous: string;
  unit: string;
  reference: string;
  frequency: string;
}

export interface IndicatorCategory {
  title: string;
  indicators: EconomicIndicator[];
}

export interface CountryData {
  name: string;
  code: string;
  flag: string;
  categories: IndicatorCategory[];
}
