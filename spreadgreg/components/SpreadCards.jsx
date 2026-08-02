'use client';
import { nf2 } from '../lib/data-engine';

function resolveLeg(leg, contractsByRoot, priceCache) {
  if (leg.month) {
    const cs = contractsByRoot[leg.root] || [];
    const c = cs.find(c => c.monthCode === leg.month && priceCache[c.symbol]);
    return c ? { data: priceCache[c.symbol], name: c.short } : null;
  }
  const cont = priceCache[`${leg.root}=F`];
  return cont ? { data: cont, name: `${leg.root}=F` } : null;
}

export default function SpreadCards({ cfg, marketData }) {
  if (!marketData) return <div className="sg-grid">{cfg.spreads.map((s, i) => <div key={i} className="sg-card sg-skel" />)}</div>;
  const { contractsByRoot, priceCache } = marketData;

  const cards = cfg.spreads.map(sp => {
    const legRes = sp.legs.map(l => resolveLeg(l, contractsByRoot, priceCache));
    if (legRes.some(r => !r)) {
      if (sp.optional) return null;
      return (
        <div key={sp.id} className="sg-card">
          <div className="sg-card-label">{sp.label}</div>
          <div className="sg-badge-err">Sin datos</div>
        </div>
      );
    }
    const lasts = legRes.map(r => r.data.last);
    let val, sep;
    if (sp.op === 'calc' && sp.calc) { val = sp.calc(...lasts); sep = ' · '; }
    else if (sp.op === 'ratio') { val = lasts[0] / lasts[1]; sep = ' ÷ '; }
    else { val = lasts[0] - lasts[1]; sep = ' − '; }

    return (
      <div key={sp.id} className="sg-card">
        <div className="sg-card-label">{sp.label}</div>
        <div className="sg-card-value">{nf2.format(val)}{sp.unit ? ` ${sp.unit}` : ''}</div>
        <div className="sg-card-sub">{legRes.map(r => r.name).join(sep)}</div>
      </div>
    );
  }).filter(Boolean);

  return <div className="sg-grid">{cards}</div>;
}
