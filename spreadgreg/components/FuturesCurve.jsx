'use client';
import { useEffect, useRef, useState } from 'react';
import { loadMarketData, nf2 } from '../lib/data-engine';

export default function FuturesCurve({ cfg, onMarketData }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ok | empty

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { contractsByRoot, priceCache } = await loadMarketData(cfg);
      if (cancelled) return;
      onMarketData?.({ contractsByRoot, priceCache });

      const pointMap = new Map();
      cfg.tickers.forEach(t => {
        (contractsByRoot[t.root] || []).forEach(c => {
          if (priceCache[c.symbol]) pointMap.set(c.date.getTime(), c.label);
        });
      });
      const times = [...pointMap.keys()].sort((a, b) => a - b);
      if (!times.length) { setStatus('empty'); return; }

      const labels = times.map(tm => pointMap.get(tm));
      const datasets = cfg.tickers.map(t => {
        const bySlot = {};
        (contractsByRoot[t.root] || []).forEach(c => {
          const d = priceCache[c.symbol];
          if (d) bySlot[c.date.getTime()] = d.last;
        });
        return {
          label: t.name || t.root,
          data: times.map(tm => bySlot[tm] ?? null),
          borderColor: t.color || '#e63946',
          backgroundColor: t.color || '#e63946',
          spanGaps: true, tension: 0.25, borderWidth: 2, pointRadius: 3.5
        };
      });

      const { Chart } = await import('chart.js/auto');
      if (cancelled) return;
      if (chartRef.current) chartRef.current.destroy();

      // El canvas SIEMPRE está montado y con tamaño ya asentado por CSS,
      // así que Chart.js lo mide correctamente desde el primer instante.
      chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: datasets.length > 1 },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${nf2.format(ctx.parsed.y)}` } }
          },
          scales: { x: { grid: { display: false } } }
        }
      });

      // Actualizamos el estado DESPUÉS de crear el chart, y forzamos
      // un resize en el siguiente frame para que recalcule con el
      // layout ya definitivo (evita el bug de ejes descolocados).
      setStatus('ok');
      requestAnimationFrame(() => chartRef.current?.resize());
    })();

    return () => { cancelled = true; chartRef.current?.destroy(); };
  }, [cfg]);

  if (!cfg.tickers.length) {
    return <div className="sg-empty">{cfg.noCurve || 'La fuente no publica futuros de este producto.'}</div>;
  }

  return (
    <div className="sg-chart-wrap" style={{ position: 'relative', height: 350 }}>
      {status === 'empty' && <div className="sg-empty">Sin datos para esta curva ahora mismo.</div>}
      {/* El canvas se mantiene siempre montado; solo se atenúa mientras carga */}
      <canvas
        ref={canvasRef}
        style={{ opacity: status === 'ok' ? 1 : 0, transition: 'opacity 0.15s' }}
      />
    </div>
  );
}
