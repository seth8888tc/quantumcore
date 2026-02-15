
import { IndexTicker, CountryData } from './types';

export const INDEX_TICKERS: IndexTicker[] = [
  { label: 'DXY', value: '104.22', change: '+0.12%', isPositive: true },
  { label: 'US10Y', value: '4.123%', change: '-1.20%', isPositive: false },
  { label: 'SPX', value: '4,982.11', change: '+0.82%', isPositive: true },
  { label: 'GOLD', value: '2,024.15', change: '+0.15%', isPositive: true },
];

export const MOCK_COUNTRIES: CountryData[] = [
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    categories: [
      {
        title: "概述",
        indicators: [
          { name: "GDP增长率", last: "3.3%", previous: "4.9%", unit: "Percent", reference: "Dec/23", frequency: "Quarterly" },
          { name: "失业率", last: "3.7%", previous: "3.7%", unit: "Percent", reference: "Jan/24", frequency: "Monthly" },
          { name: "通货膨胀率", last: "3.1%", previous: "3.4%", unit: "Percent", reference: "Jan/24", frequency: "Monthly" },
          { name: "利率", last: "5.50%", previous: "5.50%", unit: "Percent", reference: "Jan/24", frequency: "Daily" }
        ]
      },
      {
        title: "国内生产总值",
        indicators: [
          { name: "GDP", last: "27361", previous: "26408", unit: "USD Billion", reference: "Dec/23", frequency: "Yearly" },
          { name: "GDP增长率", last: "3.3%", previous: "4.9%", unit: "Percent", reference: "Dec/23", frequency: "Quarterly" },
          { name: "GDP年度增长率", last: "3.1%", previous: "2.9%", unit: "Percent", reference: "Dec/23", frequency: "Yearly" }
        ]
      }
    ]
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    categories: [
      {
        title: "概述",
        indicators: [
          { name: "GDP年度增长率", last: "5.2%", previous: "4.9%", unit: "Percent", reference: "Dec/23", frequency: "Yearly" },
          { name: "利率", last: "3.45%", previous: "3.45%", unit: "Percent", reference: "Feb/24", frequency: "Daily" }
        ]
      }
    ]
  }
];
