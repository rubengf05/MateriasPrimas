'use client';
import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommodity } from '../../lib/commodities-config';
import FuturesCurve from '../../components/FuturesCurve';
import SpreadCards from '../../components/SpreadCards';
import CotPanel from '../../components/CotPanel';

export default function CommodityPage({ params }) {
  const cfg = getCommodity(params.commodity);
  const [marketData, setMarketData] = useState(null);
  if (!cfg) return notFound();

  // Cada informe USDA de esta materia prima tiene su propia página completa
  // (Fase 1): /[commodity]/[reportId]. Aquí solo enlazamos a ellas.
  return (
    <main className="sg-main">
      <Link href="/" className="sg-back">&larr; Todas las materias primas</Link>
      <h1 className="sg-title">{cfg.label}</h1>

      <section>
        <h2 className="sg-section-h">Curva de Futuros</h2>
        <div className="sg-panel">
          <FuturesCurve cfg={cfg} onMarketData={setMarketData} />
        </div>
      </section>

      <section>
        <h2 className="sg-section-h">Monitor de Spreads</h2>
        <SpreadCards cfg={cfg} marketData={marketData} />
      </section>

      <section>
        <h2 className="sg-section-h">Posicionamiento COT</h2>
        <CotPanel cfg={cfg} />
      </section>

      {cfg.usda.length > 0 && (
        <section>
          <h2 className="sg-section-h">Informes USDA — ver detalle completo</h2>
          <div className="sg-menu-grid">
            {cfg.usda.map(rep => (
              <Link key={rep.id} href={`/${cfg.id}/${rep.id}`} className="sg-menu-card">
                {rep.label}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
