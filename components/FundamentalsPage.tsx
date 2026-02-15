import React, { useState, useEffect } from 'react';

// --- 职业级全球宏观数据库 (11大项 x 7大主权节点) ---
const GLOBAL_MACRO_DB: any = {
  "USA": {
    name: "UNITED_STATES_OF_AMERICA",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"2.1%"}, {l:"NOMINAL_GDP", v:"$27.3T"}, {l:"OUTPUT_GAP", v:"-0.4%"} ],
      "LABOR_劳动力": [ {l:"UNEMP_RATE", v:"3.7%"}, {l:"PARTICIPATION", v:"62.5%"}, {l:"WAGE_GROWTH", v:"4.5%"} ],
      "PRICE_价格": [ {l:"CPI_YOY", v:"3.1%"}, {l:"CORE_PCE", v:"2.8%"}, {l:"EXPECTATION", v:"2.2%"} ],
      "FINANCE_金融": [ {l:"FED_FUNDS", v:"5.50%"}, {l:"10Y_YIELD", v:"4.18%"}, {l:"M2_SUPPLY", v:"-1.2%"} ],
      "TRADE_贸易": [ {l:"BALANCE", v:"-$67.4B"}, {l:"EXPORTS", v:"$253B"}, {l:"CURR_ACC", v:"-3.2%"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"122%"}, {l:"DEFICIT", v:"-5.8%"}, {l:"RATING", v:"AA+"} ],
      "BIZ_商业": [ {l:"MANUF_PMI", v:"49.1"}, {l:"SERV_PMI", v:"53.4"}, {l:"CAP_UTIL", v:"78.9%"} ],
      "CONSUME_消费": [ {l:"RETAIL_SLS", v:"+0.6%"}, {l:"CONFIDENCE", v:"114.8"}, {l:"HH_DEBT", v:"$17.3T"} ],
      "HOUSING_住房": [ {l:"STARTS", v:"1.46M"}, {l:"PRICE_IDX", v:"384.2"}, {l:"30Y_MTG", v:"6.8%"} ],
      "ENERGY_能源": [ {l:"CRUDE_PROD", v:"13.1M"}, {l:"GAS_STORE", v:"3.5T"}, {l:"RIG_COUNT", v:"620"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"17.3%"}, {l:"INFLATION", v:"5.2%"}, {l:"LIFE_EXP", v:"77.5Y"} ]
    }
  },
  "CHN": {
    name: "PEOPLES_REPUBLIC_OF_CHINA",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"5.2%"}, {l:"NOMINAL_GDP", v:"¥126T"}, {l:"PER_CAPITA", v:"$12.7K"} ],
      "LABOR_劳动力": [ {l:"SURVEY_UN", v:"5.1%"}, {l:"YOUTH_UN", v:"14.9%"}, {l:"MIGRANT", v:"297M"} ],
      "PRICE_价格": [ {l:"CPI_YOY", v:"-0.8%"}, {l:"PPI_YOY", v:"-2.5%"}, {l:"FOOD_CPI", v:"-5.9%"} ],
      "FINANCE_金融": [ {l:"LPR_1Y", v:"3.45%"}, {l:"M2_SUPPLY", v:"+8.7%"}, {l:"TSF_FLOW", v:"¥4.8T"} ],
      "TRADE_贸易": [ {l:"BALANCE", v:"+$75B"}, {l:"EXPORTS", v:"$307B"}, {l:"IMPORTS", v:"$232B"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"82%"}, {l:"LOCAL_DEBT", v:"¥40T"}, {l:"RATING", v:"A+"} ],
      "BIZ_商业": [ {l:"OFFICIAL_PMI", v:"49.2"}, {l:"CAIXIN_PMI", v:"50.8"}, {l:"IND_OUTPUT", v:"+6.8%"} ],
      "CONSUME_消费": [ {l:"RETAIL_SLS", v:"+7.4%"}, {l:"ONLINE_SLS", v:"+11%"}, {l:"DISP_INC", v:"¥39K"} ],
      "HOUSING_住房": [ {l:"RE_INVEST", v:"-9.6%"}, {l:"SALES_AREA", v:"-8.5%"}, {l:"NEW_CONST", v:"-20%"} ],
      "ENERGY_能源": [ {l:"COAL_PROD", v:"4.6B_T"}, {l:"SOLAR_INST", v:"216GW"}, {l:"EV_PENET", v:"35.7%"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"7.1%"}, {l:"INSURANCE", v:"95%"}, {l:"BEDS/1K", v:"6.7"} ]
    }
  },
  "JPN": {
    name: "STATE_OF_JAPAN",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"1.2%"}, {l:"NOMINAL", v:"¥591T"}, {l:"GAP", v:"-0.1%"} ],
      "LABOR_劳动力": [ {l:"UNEMP_RATE", v:"2.4%"}, {l:"JOB/APP", v:"1.27"}, {l:"AGE_65+", v:"29.1%"} ],
      "PRICE_价格": [ {l:"CPI_EX_FOOD", v:"2.3%"}, {l:"PPI_YOY", v:"0.2%"}, {l:"TUI_INDEX", v:"104.5"} ],
      "FINANCE_金融": [ {l:"BOJ_RATE", v:"0.1%"}, {l:"JGB_10Y", v:"0.75%"}, {l:"JPY/USD", v:"150.2"} ],
      "TRADE_贸易": [ {l:"BALANCE", v:"-¥1.7T"}, {l:"AUTO_EXP", v:"+12%"}, {l:"ENERGY_IMP", v:"+5%"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"263%"}, {l:"TAX_INC", v:"¥72T"}, {l:"RATING", v:"A+"} ],
      "BIZ_商业": [ {l:"TANKAN_IDX", v:"12"}, {l:"CAPEX_PLAN", v:"+9.5%"}, {l:"INV_TURNS", v:"1.8"} ],
      "CONSUME_消费": [ {l:"WAGE_CASH", v:"+2.1%"}, {l:"HH_SPEND", v:"-2.5%"}, {l:"DEPT_SLS", v:"+8%"} ],
      "HOUSING_住房": [ {l:"STARTS", v:"820K"}, {l:"TOKYO_CONDO", v:"¥75M"}, {l:"LAND_PRICE", v:"+1.2%"} ],
      "ENERGY_能源": [ {l:"NUCLEAR_CAP", v:"12%"}, {l:"LNG_IMPORT", v:"66M_T"}, {l:"RENEWABLE", v:"22%"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"11.5%"}, {l:"ELDER_CARE", v:"STRESS"}, {l:"DOC/1K", v:"2.6"} ]
    }
  },
  "DEU": {
    name: "GERMANY_FEDERAL_REPUBLIC",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"-0.3%"}, {l:"EU_CONTRIB", v:"21%"}, {l:"POTENTIAL", v:"0.7%"} ],
      "LABOR_劳动力": [ {l:"UNEMP_RATE", v:"5.9%"}, {l:"VACANCIES", v:"710K"}, {l:"SKILLED_GAP", v:"-2.2%"} ],
      "PRICE_价格": [ {l:"HICP_YOY", v:"2.9%"}, {l:"ENERGY_PPI", v:"-4.2%"}, {l:"BRENT_SENS", v:"HIGH"} ],
      "FINANCE_金融": [ {l:"ECB_MRO", v:"4.50%"}, {l:"BUND_10Y", v:"2.35%"}, {l:"DAX_EPS", v:"€1240"} ],
      "TRADE_贸易": [ {l:"SURPLUS", v:"€22.2B"}, {l:"MACHINERY", v:"-4.2%"}, {l:"CHINA_EXP", v:"-8%"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"66%"}, {l:"FISCAL_GAP", v:"-€17B"}, {l:"RATING", v:"AAA"} ],
      "BIZ_商业": [ {l:"IFO_INDEX", v:"85.5"}, {l:"ZDW_SENT", v:"15.2"}, {l:"FACTORY_ORD", v:"-11%"} ],
      "CONSUME_消费": [ {l:"GFK_SENT", v:"-29.7"}, {l:"RETAIL_REAL", v:"-1.4%"}, {l:"SAVINGS_RT", v:"11.3%"} ],
      "HOUSING_住房": [ {l:"PERMITS", v:"-25%"}, {l:"RENT_INDEX", v:"+5.2%"}, {l:"BUILD_COST", v:"+8%"} ],
      "ENERGY_能源": [ {l:"GAS_LEVEL", v:"72%"}, {l:"RE_SHARE", v:"52%"}, {l:"ELEC_PRICE", v:"€0.38"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"12.8%"}, {l:"INSUR_PREM", v:"+4%"}, {l:"BEDS/1K", v:"7.8"} ]
    }
  },
  "CAN": {
    name: "CANADA_DOMINION",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"1.1%"}, {l:"NOMINAL", v:"$2.2T"}, {l:"PER_CAPITA", v:"$53K"} ],
      "LABOR_劳动力": [ {l:"UNEMP_RATE", v:"5.8%"}, {l:"IMM_FLOW", v:"+485K"}, {l:"PARTICIPATION", v:"65.4%"} ],
      "PRICE_价格": [ {l:"CPI_YOY", v:"3.4%"}, {l:"CORE_CPI", v:"2.4%"}, {l:"ENERGY_CPI", v:"-1.1%"} ],
      "FINANCE_金融": [ {l:"BOC_RATE", v:"5.00%"}, {l:"5Y_YIELD", v:"3.58%"}, {l:"CAD/USD", v:"1.35"} ],
      "TRADE_贸易": [ {l:"BALANCE", v:"+$0.6B"}, {l:"OIL_EXP", v:"42%"}, {l:"US_TRADE", v:"75%"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"106%"}, {l:"FISCAL_BAL", v:"-1.2%"}, {l:"RATING", v:"AAA"} ],
      "BIZ_商业": [ {l:"IVEY_PMI", v:"56.5"}, {l:"CORP_PROFITS", v:"-2.4%"}, {l:"CAPEX", v:"-1.2%"} ],
      "CONSUME_消费": [ {l:"RETAIL_SLS", v:"+0.2%"}, {l:"HH_DEBT/INC", v:"185%"}, {l:"SENTIMENT", v:"48.2"} ],
      "HOUSING_住房": [ {l:"STARTS", v:"240K"}, {l:"BENCHMARK", v:"$730K"}, {l:"MTG_COST", v:"+28%"} ],
      "ENERGY_能源": [ {l:"OIL_OUTPUT", v:"4.8M"}, {l:"OIL_SANDS", v:"72%"}, {l:"EXP_CAP", v:"92%"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"12.2%"}, {l:"WAIT_TIME", v:"27.4W"}, {l:"DOC/1K", v:"2.8"} ]
    }
  },
  "GBR": {
    name: "UNITED_KINGDOM",
    sectors: {
      "GDP_生产总值": [ {l:"REAL_GDP", v:"0.3%"}, {l:"SERVICES", v:"81%"}, {l:"GVA", v:"£2.4T"} ],
      "LABOR_劳动力": [ {l:"UNEMP_RATE", v:"4.2%"}, {l:"INACTIVITY", v:"21.8%"}, {l:"BONUS_GR", v:"+6%"} ],
      "PRICE_价格": [ {l:"CPI_YOY", v:"4.0%"}, {l:"CORE_CPI", v:"5.1%"}, {l:"FOOD_INFL", v:"8%"} ],
      "FINANCE_金融": [ {l:"BOE_BANK_RT", v:"5.25%"}, {l:"GILT_10Y", v:"4.15%"}, {l:"GBP/USD", v:"1.26"} ],
      "TRADE_贸易": [ {l:"DEFICIT", v:"-£3.2B"}, {l:"EU_TRADE", v:"42%"}, {l:"SERVICES_EXP", v:"+15%"} ],
      "GOVT_政府": [ {l:"DEBT/GDP", v:"98%"}, {l:"BORROWING", v:"£14B"}, {l:"RATING", v:"AA"} ],
      "BIZ_商业": [ {l:"COMPOSITE_PMI", v:"52.9"}, {l:"INVESTMENT", v:"+1.2%"}, {l:"INSOLVENCIES", v:"RISING"} ],
      "CONSUME_消费": [ {l:"RETAIL_VOL", v:"-0.4%"}, {l:"HH_SAVINGS", v:"9.1%"}, {l:"CONS_CONF", v:"-19"} ],
      "HOUSING_住房": [ {l:"AVG_PRICE", v:"£285K"}, {l:"APPROVALS", v:"55K"}, {l:"RENT_CHG", v:"+6.2%"} ],
      "ENERGY_能源": [ {l:"WIND_POWER", v:"29%"}, {l:"NORTH_SEA", v:"-5%"}, {l:"PRICE_CAP", v:"£1928"} ],
      "HEALTH_健康": [ {l:"SPEND/GDP", v:"11.3%"}, {l:"NHS_WAIT", v:"7.6M"}, {l:"DOC/1K", v:"3.2"} ]
    }
  }
};

const FundamentalsPage: React.FC = () => {
  const [country, setCountry] = useState('USA');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const current = GLOBAL_MACRO_DB[country] || GLOBAL_MACRO_DB['USA'];

  const onInputChange = (val: string) => {
    const v = val.toUpperCase();
    setSearch(v);
    if (v.length > 0) {
      const matches = Object.keys(GLOBAL_MACRO_DB).filter(code => 
        code.includes(v) || GLOBAL_MACRO_DB[code].name.includes(v)
      );
      setSuggestions(matches);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const selectCountry = (code: string) => {
    setCountry(code);
    setSearch('');
    setShowDropdown(false);
  };

  return (
    <div className="w-full h-full bg-black font-mono overflow-y-auto custom-scrollbar select-none">
      {/* 顶部：华尔街联想指挥栏 */}
      <header className="p-6 border-b border-white/5 sticky top-0 bg-black/95 backdrop-blur-xl z-[100] flex justify-between items-end">
        <div className="flex items-center gap-8">
          <span className="text-6xl font-black text-white tracking-tighter">{country}</span>
          <div className="border-l border-white/10 pl-6 mb-1">
            <h2 className="text-[11px] font-black text-cyan-400 tracking-[0.6em] uppercase">Sovereign_Macro_Control</h2>
            <p className="text-[8px] text-slate-500 mt-2 uppercase tracking-[0.2em]">{current.name} // NODE_SYNC_02.2026</p>
          </div>
        </div>

        <div className="relative w-80">
          <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2.5 focus-within:border-cyan-500/50 transition-all group">
            <span className="text-[10px] text-slate-700 mr-3 font-black">SEARCH:</span>
            <input 
              value={search}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="ISO (e.g. JPN, CHN, DEU)..."
              className="bg-transparent text-[11px] text-cyan-400 outline-none w-full placeholder:text-slate-800"
            />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[200]">
              {suggestions.map(code => (
                <div 
                  key={code}
                  onClick={() => selectCountry(code)}
                  className="px-4 py-2.5 hover:bg-cyan-950 cursor-pointer border-b border-white/5 last:border-none group flex justify-between items-center"
                >
                  <span className="text-[11px] font-black text-white group-hover:text-cyan-400">{code}</span>
                  <span className="text-[8px] text-slate-600 truncate max-w-[150px] uppercase font-bold">{GLOBAL_MACRO_DB[code].name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 11 维度硬核矩阵 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-white/5 border-b border-white/5">
        {Object.keys(current.sectors).map((catName) => (
          <div key={catName} className="bg-black p-6 hover:bg-white/[0.02] transition-all flex flex-col gap-5 border-r border-white/[0.03]">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                {catName}
              </span>
              <span className="text-[7px] text-slate-800 font-bold">LIVE_DATA</span>
            </div>
            <div className="space-y-5">
              {current.sectors[catName].map((sub: any) => (
                <div key={sub.l} className="group">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[9px] text-slate-700 font-bold group-hover:text-slate-400 uppercase tracking-tighter transition-colors">{sub.l}</span>
                    <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">{sub.v}</span>
                  </div>
                  <div className="h-[1px] w-full bg-white/[0.03] group-hover:bg-cyan-900 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* 系统空槽位补全 */}
        <div className="bg-[#030303] flex items-center justify-center p-10 group overflow-hidden">
           <span className="text-[8px] font-black tracking-[2em] uppercase -rotate-90 text-slate-900 group-hover:text-cyan-950 transition-colors">
             Sovereign_Link
           </span>
        </div>
      </div>

      <footer className="p-10 border-t border-white/5 bg-black flex justify-between items-center">
        <div className="text-[8px] text-slate-800 tracking-[0.5em] uppercase">
          Term_Node: {country} // Quantum_Stable // Tier_1_Data
        </div>
        <div className="flex gap-10">
           {['IMF', 'WORLD_BANK', 'OECD', 'FED_RESERVE'].map(s => (
             <span key={s} className="text-[7px] font-black text-slate-900">{s}</span>
           ))}
        </div>
      </footer>
    </div>
  );
};

export default FundamentalsPage;