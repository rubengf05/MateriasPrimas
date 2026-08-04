const THIS_YEAR = new Date().getFullYear();

export const COMMODITIES_CONFIG = [
  {
    id: 'corn',
    label: 'Corn',
    tickers: [
      { root: 'ZC', months: ['H', 'K', 'N', 'U', 'Z'], suffix: '.CBT', color: '#e63946', name: 'Corn (ZC)' }
    ],
    extraContinuous: ['ZS', 'ZW'],
    cot: [{ key: 'corn', label: 'Corn (CBOT)', filterLike: '%CORN%' }],
    usda: [
      { id: 'acres-planted', label: 'Prospective Plantings / Acreage — Acres Planted',
        shortDesc: 'CORN - ACRES PLANTED', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'grain-stocks', label: 'Grain Stocks',
        shortDesc: 'CORN, GRAIN - STOCKS, MEASURED IN BU', params: { year__GE: THIS_YEAR - 1 } },
      { id: 'production', label: 'Crop Production',
        shortDesc: 'CORN, GRAIN - PRODUCTION, MEASURED IN BU', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'yield', label: 'Yield',
        shortDesc: 'CORN, GRAIN - YIELD, MEASURED IN BU / ACRE', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'crop-progress', label: 'Crop Progress — % Planted',
        shortDesc: 'CORN - PROGRESS, MEASURED IN PCT PLANTED', params: { year__GE: THIS_YEAR }, maxRows: 10 }
    ],
    spreads: [
      { id: 'zcz-zch', label: 'ZCZ–ZCH · Old vs New crop', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'ZC', month: 'Z' }, { root: 'ZC', month: 'H' }] },
      { id: 'zcn-zcz', label: 'ZCN–ZCZ · Jul vs Dic', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'ZC', month: 'N' }, { root: 'ZC', month: 'Z' }] },
      { id: 'zc-zs-ratio', label: 'Ratio ZC/ZS', unit: '', op: 'ratio',
        legs: [{ root: 'ZC' }, { root: 'ZS' }] },
      { id: 'zc-zw', label: 'ZC–ZW · Corn vs Wheat SRW', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'ZC' }, { root: 'ZW' }] }
    ]
  },
  {
    id: 'wheat-srw',
    label: 'Wheat SRW',
    tickers: [{ root: 'ZW', months: ['H','K','N','U','Z'], suffix: '.CBT', color: '#e63946', unit: '¢/bu', name: 'Wheat SRW (ZW)' }],
    extraContinuous: ['KE'],
    cot: [{ key: 'srw', label: 'Wheat SRW (CBOT)', filterLike: '%WHEAT-SRW%' }],
    usda: [
      { id: 'acres-planted', label: 'Acres Planted — All Wheat',
        shortDesc: 'WHEAT - ACRES PLANTED', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'winter-acres', label: 'Acres Planted — Winter Wheat',
        shortDesc: 'WHEAT, WINTER - ACRES PLANTED', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'grain-stocks', label: 'Grain Stocks — All Wheat',
        shortDesc: 'WHEAT - STOCKS, MEASURED IN BU', params: { year__GE: THIS_YEAR - 1 } },
      { id: 'winter-condition', label: 'Crop Condition — Winter Wheat % Good',
        shortDesc: 'WHEAT, WINTER - CONDITION, MEASURED IN PCT GOOD',
        paramSets: [{ commodity_desc: 'WHEAT', class_desc: 'WINTER',
                      statisticcat_desc: 'CONDITION', filter: ['PCT GOOD'] },
                    { commodity_desc: 'WHEAT', statisticcat_desc: 'CONDITION',
                      filter: ['WINTER', 'PCT GOOD'] }],
        params: { year__GE: THIS_YEAR }, maxRows: 10 }
    ],
    spreads: [
      { id: 'zwn-zwz', label: 'ZWN–ZWZ · Jul vs Dic', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'ZW', month: 'N' }, { root: 'ZW', month: 'Z' }] },
      { id: 'ke-zw', label: 'KE–ZW · HRW vs SRW', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'KE' }, { root: 'ZW' }] }
    ]
  },
  {
    id: 'wheat-hrw',
    label: 'Wheat HRW',
    tickers: [{ root: 'KE', months: ['H','K','N','U','Z'], suffix: '.CBT', color: '#e63946', unit: '¢/bu', name: 'Wheat HRW (KE)' }],
    extraContinuous: ['ZW'],
    cot: [{ key: 'hrw', label: 'Wheat HRW (KC)', filterLike: '%WHEAT-HRW%' }],
    usda: [
      { id: 'winter-acres', label: 'Acres Planted — Winter Wheat',
        shortDesc: 'WHEAT, WINTER - ACRES PLANTED', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'winter-production', label: 'Crop Production — Winter Wheat',
        shortDesc: 'WHEAT, WINTER - PRODUCTION, MEASURED IN BU', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'winter-condition', label: 'Crop Condition — Winter Wheat % Good',
        shortDesc: 'WHEAT, WINTER - CONDITION, MEASURED IN PCT GOOD',
        paramSets: [{ commodity_desc: 'WHEAT', class_desc: 'WINTER',
                      statisticcat_desc: 'CONDITION', filter: ['PCT GOOD'] },
                    { commodity_desc: 'WHEAT', statisticcat_desc: 'CONDITION',
                      filter: ['WINTER', 'PCT GOOD'] }],
        params: { year__GE: THIS_YEAR }, maxRows: 10 },
      { id: 'grain-stocks', label: 'Grain Stocks — All Wheat',
        shortDesc: 'WHEAT - STOCKS, MEASURED IN BU', params: { year__GE: THIS_YEAR - 1 } }
    ],
    spreads: [
      { id: 'ken-kez', label: 'KEN–KEZ · Jul vs Dic', unit: '¢/bu', op: 'subtract', optional: true,
        legs: [{ root: 'KE', month: 'N' }, { root: 'KE', month: 'Z' }] },
      { id: 'ke-zw', label: 'KE–ZW · HRW vs SRW', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'KE' }, { root: 'ZW' }] }
    ]
  },
  {
    id: 'wheat-spring',
    label: 'Wheat Spring',
    tickers: [],
    noCurve: 'Yahoo Finance no publica los futuros de Minneapolis (MGEX/MIAX), ni por contrato ni como serie continua. El posicionamiento COT y los informes USDA de esta pestaña sí están disponibles.',
    extraContinuous: [],
    cot: [{ key: 'spring', label: 'Wheat HR Spring (MGEX)', filterLike: '%WHEAT-HRS%' }],
    usda: [
      { id: 'spring-acres', label: 'Acres Planted — Spring Wheat (excl. Durum)',
        shortDesc: ['WHEAT, SPRING, (EXCL DURUM) - ACRES PLANTED',
                    'WHEAT, SPRING - ACRES PLANTED'],
        params: { year__GE: THIS_YEAR - 2 } },
      { id: 'spring-production', label: 'Crop Production — Spring Wheat (excl. Durum)',
        shortDesc: ['WHEAT, SPRING, (EXCL DURUM) - PRODUCTION, MEASURED IN BU',
                    'WHEAT, SPRING - PRODUCTION, MEASURED IN BU'],
        params: { year__GE: THIS_YEAR - 2 } },
      { id: 'spring-condition', label: 'Crop Condition — Spring Wheat % Good',
        shortDesc: ['WHEAT, SPRING, (EXCL DURUM) - CONDITION, MEASURED IN PCT GOOD'],
        paramSets: [{ commodity_desc: 'WHEAT', statisticcat_desc: 'CONDITION',
                      filter: ['SPRING', 'PCT GOOD'] }],
        params: { year__GE: THIS_YEAR }, maxRows: 10 },
      { id: 'grain-stocks', label: 'Grain Stocks — All Wheat',
        shortDesc: 'WHEAT - STOCKS, MEASURED IN BU', params: { year__GE: THIS_YEAR - 1 } }
    ],
    spreads: []
  },
  {
    id: 'soybeans',
    label: 'Soybeans',
    tickers: [{ root: 'ZS', months: ['F','H','K','N','Q','U','X'], suffix: '.CBT', color: '#e63946', unit: '¢/bu', name: 'Soybeans (ZS)' }],
    extraContinuous: ['ZM', 'ZL'],
    cot: [{ key: 'soybeans', label: 'Soybeans (CBOT)', filterLike: '%SOYBEAN%',
            notLike: ['%SOYBEAN OIL%', '%SOYBEAN MEAL%'] }],
    usda: [
      { id: 'acres-planted', label: 'Prospective Plantings / Acreage — Acres Planted',
        shortDesc: 'SOYBEANS - ACRES PLANTED', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'grain-stocks', label: 'Grain Stocks',
        shortDesc: 'SOYBEANS - STOCKS, MEASURED IN BU', params: { year__GE: THIS_YEAR - 1 } },
      { id: 'production', label: 'Crop Production',
        shortDesc: 'SOYBEANS - PRODUCTION, MEASURED IN BU', params: { year__GE: THIS_YEAR - 2 } },
      { id: 'crush', label: 'Fats & Oils — Soybean Crushings',
        paramSets: [{ commodity_desc: 'SOYBEANS', freq_desc: 'MONTHLY', filter: ['CRUSHED', 'TONS'] },
                    { commodity_desc: 'SOYBEANS', freq_desc: 'MONTHLY', filter: ['CRUSHED'] }],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 12 }
    ],
    spreads: [
      { id: 'board-crush', label: 'Board Crush (GPM)', unit: '$/bu', op: 'calc',
        legs: [{ root: 'ZS' }, { root: 'ZM' }, { root: 'ZL' }],
        calc: (zs, zm, zl) => zm * 0.022 + zl * 0.11 - zs / 100 },
      { id: 'zsx-zsf', label: 'ZSX–ZSF · Nov vs Ene', unit: '¢/bu', op: 'subtract',
        legs: [{ root: 'ZS', month: 'X' }, { root: 'ZS', month: 'F' }] }
    ]
  },
  {
    id: 'soybean-meal',
    label: 'Soybean Meal',
    yTitle: '$/st (último cierre)',
    tickers: [{ root: 'ZM', months: ['F','H','K','N','Q','U','V','Z'], suffix: '.CBT', color: '#e63946', unit: '$/st', name: 'Soybean Meal (ZM)' }],
    extraContinuous: ['ZS', 'ZL'],
    cot: [{ key: 'meal', label: 'Soybean Meal (CBOT)', filterLike: '%SOYBEAN MEAL%' }],
    usda: [],
    spreads: [
      { id: 'zmn-zmz', label: 'ZMN–ZMZ · Jul vs Dic', unit: '$/st', op: 'subtract',
        legs: [{ root: 'ZM', month: 'N' }, { root: 'ZM', month: 'Z' }] },
      { id: 'board-crush', label: 'Board Crush (GPM)', unit: '$/bu', op: 'calc',
        legs: [{ root: 'ZS' }, { root: 'ZM' }, { root: 'ZL' }],
        calc: (zs, zm, zl) => zm * 0.022 + zl * 0.11 - zs / 100 }
    ]
  },
  {
    id: 'soybean-oil',
    label: 'Soybean Oil',
    yTitle: '¢/lb (último cierre)',
    tickers: [{ root: 'ZL', months: ['F','H','K','N','Q','U','V','Z'], suffix: '.CBT', color: '#e63946', unit: '¢/lb', name: 'Soybean Oil (ZL)' }],
    extraContinuous: ['ZS', 'ZM'],
    cot: [{ key: 'oil', label: 'Soybean Oil (CBOT)', filterLike: '%SOYBEAN OIL%' }],
    usda: [],
    spreads: [
      { id: 'oilshare', label: 'Oil Share', unit: '%', op: 'calc',
        legs: [{ root: 'ZL' }, { root: 'ZM' }],
        calc: (zl, zm) => (zl * 0.11) / (zl * 0.11 + zm * 0.022) * 100 },
      { id: 'board-crush', label: 'Board Crush (GPM)', unit: '$/bu', op: 'calc',
        legs: [{ root: 'ZS' }, { root: 'ZM' }, { root: 'ZL' }],
        calc: (zs, zm, zl) => zm * 0.022 + zl * 0.11 - zs / 100 }
    ]
  },
  {
    id: 'live-cattle',
    label: 'Live Cattle',
    yTitle: '$/cwt (último cierre)',
    tickers: [{ root: 'LE', months: ['G','J','M','Q','V','Z'], suffix: '.CME', color: '#e63946', unit: '$/cwt', name: 'Live Cattle (LE)' }],
    extraContinuous: ['GF', 'ZC', 'ZM', 'HE'],
    cot: [{ key: 'le', label: 'Live Cattle (CME)', filterLike: '%LIVE CATTLE%' }],
    usda: [
      {
        id: 'cattle-inventory',
        label: 'Cattle Inventory (Jan & Jul)',
        description: 'Semiannual inventory by class. January release includes state-level detail and prior-year calf crop; July release is U.S. total only and projects current-year calf crop.',
        groups: [
          {
            name: 'Total & cows',
            items: [
              { id: 'ci-all-cattle-calves', label: 'All cattle and calves',
                shortDesc: 'CATTLE, INCL CALVES - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'INCL CALVES',
                              statisticcat_desc: 'INVENTORY' }] },
              { id: 'ci-cows-all', label: 'All cows and heifers that have calved',
                shortDesc: 'CATTLE, COWS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'COWS',
                              statisticcat_desc: 'INVENTORY' }],
                subItems: [
                  { id: 'ci-cows-beef', label: 'Beef cows',
                    shortDesc: 'CATTLE, COWS, BEEF - INVENTORY',
                    paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'COWS, BEEF',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'ci-cows-milk', label: 'Milk cows',
                    shortDesc: 'CATTLE, COWS, MILK - INVENTORY',
                    paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'COWS, MILK',
                                  statisticcat_desc: 'INVENTORY' }] }
                ]
              }
            ]
          },
          {
            name: 'Heifers 500 lbs and over',
            items: [
              { id: 'ci-heifers-500', label: 'All heifers 500 pounds and over',
                shortDesc: 'CATTLE, HEIFERS, GE 500 LBS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'HEIFERS, GE 500 LBS',
                              statisticcat_desc: 'INVENTORY' }],
                subItems: [
                  { id: 'ci-heifers-500-beef-repl',
                    label: 'For beef cow replacement',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, BEEF REPLACEMENT - INVENTORY',
                    paramSets: [{ commodity_desc: 'CATTLE',
                                  class_desc: 'HEIFERS, GE 500 LBS, BEEF REPLACEMENT',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'ci-heifers-500-milk-repl',
                    label: 'For milk cow replacement',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, MILK REPLACEMENT - INVENTORY',
                    paramSets: [{ commodity_desc: 'CATTLE',
                                  class_desc: 'HEIFERS, GE 500 LBS, MILK REPLACEMENT',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'ci-heifers-500-other',
                    label: 'Other heifers',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, OTHER - INVENTORY',
                    paramSets: [{ commodity_desc: 'CATTLE',
                                  class_desc: 'HEIFERS, GE 500 LBS, OTHER',
                                  statisticcat_desc: 'INVENTORY' }] }
                ]
              }
            ]
          },
          {
            name: 'Steers, bulls & calves',
            items: [
              { id: 'ci-steers-500', label: 'Steers 500 pounds and over',
                shortDesc: 'CATTLE, STEERS, GE 500 LBS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'STEERS, GE 500 LBS',
                              statisticcat_desc: 'INVENTORY' }] },
              { id: 'ci-bulls-500', label: 'Bulls 500 pounds and over',
                shortDesc: 'CATTLE, BULLS, GE 500 LBS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'BULLS, GE 500 LBS',
                              statisticcat_desc: 'INVENTORY' }] },
              { id: 'ci-calves-lt500', label: 'Calves under 500 pounds',
                shortDesc: 'CATTLE, CALVES, LT 500 LBS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'CALVES, LT 500 LBS',
                              statisticcat_desc: 'INVENTORY' }] }
            ]
          },
          {
            name: 'On feed (semiannual snapshot)',
            items: [
              { id: 'ci-on-feed-all', label: 'All cattle on feed (all feedlots)',
                shortDesc: 'CATTLE, ON FEED - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'INVENTORY', class_desc: 'ALL CLASSES' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 2 }
      },
      {
        id: 'calf-crop',
        label: 'Calf Crop',
        description: 'Number of calves born during the calendar year. Final prior-year total published with January Cattle report; current-year projection published with July Cattle report.',
        groups: [
          {
            name: 'Annual',
            items: [
              { id: 'calf-crop-total', label: 'Calf crop — total',
                shortDesc: ['CATTLE, INCL CALVES - PRODUCTION, MEASURED IN HEAD',
                            'CATTLE - PRODUCTION, MEASURED IN HEAD'],
                paramSets: [{ commodity_desc: 'CATTLE', statisticcat_desc: 'PRODUCTION',
                              unit_desc: 'HEAD' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 3 }
      },
      {
        id: 'cof-monthly',
        label: 'Cattle on Feed — Monthly',
        description: 'Monthly report covering feedlots with 1,000+ head capacity. Inventory as of the 1st of the month; placements, marketings and other disappearance during the prior month.',
        groups: [
          {
            name: 'Inventory',
            items: [
              { id: 'cof-inventory', label: 'Cattle on Feed — Inventory',
                shortDesc: 'CATTLE, ON FEED - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'INVENTORY', class_desc: 'ALL CLASSES' }] }
            ]
          },
          {
            name: 'Placements',
            items: [
              { id: 'cof-placements-total', label: 'Placements — total',
                shortDesc: 'CATTLE, ON FEED - PLACEMENTS, MEASURED IN HEAD',
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'PLACEMENTS', class_desc: 'ALL CLASSES' }],
                subItems: [
                  { id: 'cof-placements-lt600', label: 'Placements — under 600 lbs',
                    shortDesc: 'CATTLE, ON FEED, LT 600 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, LT 600 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-600-699', label: 'Placements — 600 to 699 lbs',
                    shortDesc: 'CATTLE, ON FEED, 600-699 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 600-699 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-700-799', label: 'Placements — 700 to 799 lbs',
                    shortDesc: 'CATTLE, ON FEED, 700-799 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 700-799 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-800-899', label: 'Placements — 800 to 899 lbs',
                    shortDesc: 'CATTLE, ON FEED, 800-899 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 800-899 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-900-999', label: 'Placements — 900 to 999 lbs',
                    shortDesc: 'CATTLE, ON FEED, 900-999 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 900-999 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-ge1000', label: 'Placements — 1,000 lbs and over',
                    shortDesc: 'CATTLE, ON FEED, GE 1,000 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, GE 1,000 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] }
                ]
              }
            ]
          },
          {
            name: 'Outflow',
            items: [
              { id: 'cof-marketings', label: 'Marketings (Sales for Slaughter)',
                shortDesc: ['CATTLE, ON FEED - SALES, MEASURED IN HEAD',
                            'CATTLE, ON FEED - SALES FOR SLAUGHTER, MEASURED IN HEAD'],
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'SALES FOR SLAUGHTER',
                              class_desc: 'ALL CLASSES' }] },
              { id: 'cof-other-disappearance', label: 'Other Disappearance',
                shortDesc: 'CATTLE, ON FEED - DISAPPEARANCE, OTHER, MEASURED IN HEAD',
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'DISAPPEARANCE',
                              class_desc: 'ALL CLASSES' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 24
      },
      {
        id: 'cold-storage-beef',
        label: 'Cold Storage — Beef',
        description: 'Monthly stocks of beef in commercial cold storage warehouses.',
        groups: [
          {
            name: 'Frozen stocks',
            items: [
              { id: 'cs-beef-total', label: 'Beef — total frozen',
                paramSets: [{ commodity_desc: 'BEEF', statisticcat_desc: 'STOCKS',
                              util_practice_desc: 'COLD STORAGE, FROZEN',
                              class_desc: 'ALL CLASSES' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 12
      }
    ],
    spreads: [
      { id: 'leg-lej', label: 'LEG–LEJ · Feb vs Abr', unit: '$/cwt', op: 'subtract',
        legs: [{ root: 'LE', month: 'G' }, { root: 'LE', month: 'J' }] },
      { id: 'le-gf', label: 'LE–GF · Live vs Feeder', unit: '$/cwt', op: 'subtract',
        legs: [{ root: 'LE' }, { root: 'GF' }] },
      { id: 'le-he', label: 'LE–HE · Cattle vs Hogs', unit: '¢/lb', op: 'subtract',
        legs: [{ root: 'LE' }, { root: 'HE' }] },
      { id: 'le-zc', label: 'Ratio LE/ZC ($/cwt ÷ $/bu)', unit: ':1', op: 'calc',
        legs: [{ root: 'LE' }, { root: 'ZC' }], calc: (le, zc) => le / (zc / 100) },
      { id: 'le-zm', label: 'Ratio LE/ZM', unit: '', op: 'ratio',
        legs: [{ root: 'LE' }, { root: 'ZM' }] }
    ]
  },
  {
    id: 'feeder-cattle',
    label: 'Feeder Cattle',
    yTitle: '$/cwt (último cierre)',
    tickers: [{ root: 'GF', months: ['F','H','J','K','Q','U','V','X'], suffix: '.CME', color: '#e63946', unit: '$/cwt', name: 'Feeder Cattle (GF)' }],
    extraContinuous: ['LE', 'ZC'],
    cot: [{ key: 'gf', label: 'Feeder Cattle (CME)', filterLike: '%FEEDER CATTLE%' }],
    usda: [
      {
        id: 'cattle-inventory',
        label: 'Cattle Inventory (Jan & Jul)',
        description: 'Semiannual inventory by class. Feeder cattle supply outside feedlots is derived from calves under 500 lbs plus other heifers and steers 500+ lbs not on feed.',
        groups: [
          {
            name: 'Total & cows',
            items: [
              { id: 'ci-all-cattle-calves', label: 'All cattle and calves',
                shortDesc: 'CATTLE, INCL CALVES - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'INCL CALVES',
                              statisticcat_desc: 'INVENTORY' }] },
              { id: 'ci-cows-all', label: 'All cows and heifers that have calved',
                shortDesc: 'CATTLE, COWS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'COWS',
                              statisticcat_desc: 'INVENTORY' }],
                subItems: [
                  { id: 'ci-cows-beef', label: 'Beef cows',
                    shortDesc: 'CATTLE, COWS, BEEF - INVENTORY' },
                  { id: 'ci-cows-milk', label: 'Milk cows',
                    shortDesc: 'CATTLE, COWS, MILK - INVENTORY' }
                ]
              }
            ]
          },
          {
            name: 'Feeder supply components',
            items: [
              { id: 'ci-heifers-500', label: 'All heifers 500 pounds and over',
                shortDesc: 'CATTLE, HEIFERS, GE 500 LBS - INVENTORY',
                paramSets: [{ commodity_desc: 'CATTLE', class_desc: 'HEIFERS, GE 500 LBS',
                              statisticcat_desc: 'INVENTORY' }],
                subItems: [
                  { id: 'ci-heifers-500-beef-repl', label: 'For beef cow replacement',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, BEEF REPLACEMENT - INVENTORY' },
                  { id: 'ci-heifers-500-milk-repl', label: 'For milk cow replacement',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, MILK REPLACEMENT - INVENTORY' },
                  { id: 'ci-heifers-500-other', label: 'Other heifers',
                    shortDesc: 'CATTLE, HEIFERS, GE 500 LBS, OTHER - INVENTORY' }
                ]
              },
              { id: 'ci-steers-500', label: 'Steers 500 pounds and over',
                shortDesc: 'CATTLE, STEERS, GE 500 LBS - INVENTORY' },
              { id: 'ci-calves-lt500', label: 'Calves under 500 pounds',
                shortDesc: 'CATTLE, CALVES, LT 500 LBS - INVENTORY' }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 2 }
      },
      {
        id: 'cof-monthly',
        label: 'Cattle on Feed — Monthly',
        description: 'Monthly report covering feedlots with 1,000+ head capacity. Placements by weight class are especially relevant for feeder demand.',
        groups: [
          {
            name: 'Inventory',
            items: [
              { id: 'cof-inventory', label: 'Cattle on Feed — Inventory',
                shortDesc: 'CATTLE, ON FEED - INVENTORY' }
            ]
          },
          {
            name: 'Placements',
            items: [
              { id: 'cof-placements-total', label: 'Placements — total',
                shortDesc: 'CATTLE, ON FEED - PLACEMENTS, MEASURED IN HEAD',
                subItems: [
                  { id: 'cof-placements-lt600', label: 'Placements — under 600 lbs',
                    shortDesc: 'CATTLE, ON FEED, LT 600 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, LT 600 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-600-699', label: 'Placements — 600 to 699 lbs',
                    shortDesc: 'CATTLE, ON FEED, 600-699 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 600-699 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-700-799', label: 'Placements — 700 to 799 lbs',
                    shortDesc: 'CATTLE, ON FEED, 700-799 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 700-799 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-800-899', label: 'Placements — 800 to 899 lbs',
                    shortDesc: 'CATTLE, ON FEED, 800-899 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 800-899 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-900-999', label: 'Placements — 900 to 999 lbs',
                    shortDesc: 'CATTLE, ON FEED, 900-999 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, 900-999 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] },
                  { id: 'cof-placements-ge1000', label: 'Placements — 1,000 lbs and over',
                    shortDesc: 'CATTLE, ON FEED, GE 1,000 LBS - PLACEMENTS, MEASURED IN HEAD',
                    paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                                  class_desc: 'ON FEED, GE 1,000 LBS',
                                  statisticcat_desc: 'PLACEMENTS' }] }
                ]
              }
            ]
          },
          {
            name: 'Outflow',
            items: [
              { id: 'cof-marketings', label: 'Marketings (Sales for Slaughter)',
                shortDesc: ['CATTLE, ON FEED - SALES, MEASURED IN HEAD',
                            'CATTLE, ON FEED - SALES FOR SLAUGHTER, MEASURED IN HEAD'],
                paramSets: [{ commodity_desc: 'CATTLE', prodn_practice_desc: 'ON FEED',
                              statisticcat_desc: 'SALES FOR SLAUGHTER',
                              class_desc: 'ALL CLASSES' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 24
      }
    ],
    spreads: [
      { id: 'gf-le', label: 'GF–LE · Feeder vs Live', unit: '$/cwt', op: 'subtract',
        legs: [{ root: 'GF' }, { root: 'LE' }] },
      { id: 'gf-zc', label: 'Ratio GF/ZC ($/cwt ÷ $/bu)', unit: ':1', op: 'calc',
        legs: [{ root: 'GF' }, { root: 'ZC' }], calc: (gf, zc) => gf / (zc / 100) }
    ]
  },
  {
    id: 'lean-hogs',
    label: 'Lean Hogs',
    yTitle: '¢/lb (último cierre)',
    tickers: [{ root: 'HE', months: ['G','J','K','M','N','Q','V','Z'], suffix: '.CME', color: '#e63946', unit: '¢/lb', name: 'Lean Hogs (HE)' }],
    extraContinuous: ['LE', 'ZC', 'ZM'],
    cot: [{ key: 'he', label: 'Lean Hogs (CME)', filterLike: '%LEAN HOGS%' }],
    usda: [
      {
        id: 'hogs-inventory',
        label: 'Quarterly Hogs & Pigs',
        description: 'Quarterly inventory report (March, June, September, December). Breaks total inventory into breeding herd and market hogs, with market hogs further split by weight class.',
        groups: [
          {
            name: 'Total & breeding',
            items: [
              { id: 'hi-all', label: 'All hogs and pigs',
                shortDesc: 'HOGS - INVENTORY',
                paramSets: [{ commodity_desc: 'HOGS', class_desc: 'ALL CLASSES',
                              statisticcat_desc: 'INVENTORY' }] },
              { id: 'hi-breeding', label: 'Kept for breeding',
                shortDesc: 'HOGS, BREEDING - INVENTORY',
                paramSets: [{ commodity_desc: 'HOGS', class_desc: 'BREEDING',
                              statisticcat_desc: 'INVENTORY' }] }
            ]
          },
          {
            name: 'Market hogs by weight',
            items: [
              { id: 'hi-market', label: 'Market hogs — total',
                shortDesc: 'HOGS, MARKET - INVENTORY',
                paramSets: [{ commodity_desc: 'HOGS', class_desc: 'MARKET',
                              statisticcat_desc: 'INVENTORY' }],
                subItems: [
                  { id: 'hi-market-lt50', label: 'Market hogs — under 50 lbs',
                    shortDesc: 'HOGS, MARKET, LT 50 LBS - INVENTORY',
                    paramSets: [{ commodity_desc: 'HOGS', class_desc: 'MARKET, LT 50 LBS',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'hi-market-50-119', label: 'Market hogs — 50 to 119 lbs',
                    shortDesc: 'HOGS, MARKET, 50-119 LBS - INVENTORY',
                    paramSets: [{ commodity_desc: 'HOGS', class_desc: 'MARKET, 50-119 LBS',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'hi-market-120-179', label: 'Market hogs — 120 to 179 lbs',
                    shortDesc: 'HOGS, MARKET, 120-179 LBS - INVENTORY',
                    paramSets: [{ commodity_desc: 'HOGS', class_desc: 'MARKET, 120-179 LBS',
                                  statisticcat_desc: 'INVENTORY' }] },
                  { id: 'hi-market-ge180', label: 'Market hogs — 180 lbs and over',
                    shortDesc: 'HOGS, MARKET, GE 180 LBS - INVENTORY',
                    paramSets: [{ commodity_desc: 'HOGS', class_desc: 'MARKET, GE 180 LBS',
                                  statisticcat_desc: 'INVENTORY' }] }
                ]
              }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 10
      },
      {
        id: 'pig-crop',
        label: 'Pig Crop',
        description: 'Number of pigs saved during the quarter, and derived measures (sows farrowed, pigs per litter).',
        groups: [
          {
            name: 'Crop',
            items: [
              { id: 'pig-crop-total', label: 'Pig crop',
                shortDesc: 'HOGS - PIG CROP, MEASURED IN HEAD',
                paramSets: [{ commodity_desc: 'HOGS', statisticcat_desc: 'PIG CROP',
                              unit_desc: 'HEAD' }] },
              { id: 'sows-farrowed', label: 'Sows farrowed',
                shortDesc: 'HOGS, BREEDING - SOWS FARROWED, MEASURED IN HEAD',
                paramSets: [{ commodity_desc: 'HOGS', class_desc: 'BREEDING',
                              statisticcat_desc: 'SOWS FARROWED', unit_desc: 'HEAD' }] },
              { id: 'pigs-per-litter', label: 'Pigs per litter',
                shortDesc: 'HOGS - PIGS PER LITTER, AVG, MEASURED IN PIGS / LITTER',
                paramSets: [{ commodity_desc: 'HOGS', statisticcat_desc: 'PIGS PER LITTER' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 2 }, maxRows: 12
      },
      {
        id: 'cold-storage-pork',
        label: 'Cold Storage — Pork',
        description: 'Monthly stocks of pork and pork bellies in commercial cold storage warehouses.',
        groups: [
          {
            name: 'Frozen stocks',
            items: [
              { id: 'cs-pork-total', label: 'Pork — total frozen',
                shortDesc: 'PORK, FROZEN - STOCKS, MEASURED IN LB',
                paramSets: [{ commodity_desc: 'PORK', statisticcat_desc: 'STOCKS',
                              util_practice_desc: 'COLD STORAGE, FROZEN',
                              class_desc: 'ALL CLASSES' }] },
              { id: 'cs-pork-bellies', label: 'Pork bellies — frozen',
                paramSets: [{ commodity_desc: 'PORK', statisticcat_desc: 'STOCKS',
                              util_practice_desc: 'COLD STORAGE, FROZEN',
                              class_desc: 'BELLIES' }] }
            ]
          }
        ],
        params: { year__GE: THIS_YEAR - 1 }, maxRows: 12
      }
    ],
    spreads: [
      { id: 'hem-hez', label: 'HEM–HEZ · Jun vs Dic', unit: '¢/lb', op: 'subtract',
        legs: [{ root: 'HE', month: 'M' }, { root: 'HE', month: 'Z' }] },
      { id: 'hez-heg', label: 'HEZ–HEG · Dic vs Feb', unit: '¢/lb', op: 'subtract',
        legs: [{ root: 'HE', month: 'Z' }, { root: 'HE', month: 'G' }] },
      { id: 'he-le', label: 'HE–LE · Hogs vs Live Cattle', unit: '¢/lb', op: 'subtract',
        legs: [{ root: 'HE' }, { root: 'LE' }] },
      { id: 'he-zc', label: 'Ratio Hog/Corn (HE/ZC)', unit: ':1', op: 'calc',
        legs: [{ root: 'HE' }, { root: 'ZC' }], calc: (he, zc) => he / (zc / 100) },
      { id: 'he-zm', label: 'Ratio HE/ZM', unit: '', op: 'ratio',
        legs: [{ root: 'HE' }, { root: 'ZM' }] }
    ]
  },
  {
    id: 'ethanol',
    label: 'Ethanol',
    tickers: [],
    noCurve: 'Yahoo Finance no publica serie histórica de etanol: los contratos EL de NYMEX devuelven 404 y los tickers continuos responden sin barras. La curva necesita otra fuente (EIA para fundamentales, CME para liquidaciones).',
    extraContinuous: [],
    cot: [],
    usda: [],
    pendingModules: [
      { label: 'Weekly Ethanol Production · EIA',
        note: 'Producción semanal, existencias y días de suministro' }
    ],
    spreads: []
  }
];

export function getCommodity(id) {
  return COMMODITIES_CONFIG.find(c => c.id === id) || null;
}
