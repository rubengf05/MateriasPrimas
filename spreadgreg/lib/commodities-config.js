// Mismo patrón que tu HTML original: un array, cada materia prima es un
// bloque de config. Para añadir una nueva, se copia un bloque y se cambian
// los datos — el motor (lib/data-engine.js) y las páginas ya saben pintarlo.
//
// De momento migramos "corn" completo como ejemplo. El resto de bloques de
// tu HTML (wheat-srw, wheat-hrw, wheat-spring, soybeans, soybean-meal,
// soybean-oil, live-cattle, feeder-cattle, lean-hogs, ethanol) se añaden
// aquí tal cual estaban, sin tocar nada más del proyecto.

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
  }

  // 👉 Siguiente paso (Fase 0b): pegar aquí el resto de bloques
  // (wheat-srw, wheat-hrw, wheat-spring, soybeans, soybean-meal,
  // soybean-oil, live-cattle, feeder-cattle, lean-hogs, ethanol)
  // exactamente como estaban en el HTML original.
];

export function getCommodity(id) {
  return COMMODITIES_CONFIG.find(c => c.id === id) || null;
}
