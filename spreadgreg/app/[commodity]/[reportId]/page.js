'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommodity } from '../../../lib/commodities-config';
import { nassFetch, withComparisons, nf0, fmtSigned, nf1, HIST_YEARS } from '../../../lib/data-engine';

function deltaText(value, base, unit) {
  if (value == null || base == null || base === 0) return '—';
  const isPct = /\bPCT\b|PERCENT/i.test(unit || '');
  const abs = value - base;
  return isPct ? `${fmtSigned(abs, nf1)} pp` : `${fmtSigned(abs / base * 100, nf1)}%`;
}

export default function ReportPage({ params }) {
  const cfg = getCommodity(params.commodity);
  const rep = cfg?.usda.find(r => r.id === params.reportId);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rep) return;
    const baseParams = {
      source_desc: 'SURVEY', agg_level_desc: 'NATIONAL',
      short_desc: rep.shortDesc, year__GE: new Date().getFullYear() - (HIST_YEARS + 1),
      ...(rep.params || {})
    };
    delete baseParams.year__GE_override;
    nassFetch(baseParams)
      .then(data => {
        const sorted = data.slice().sort((a, b) =>
          (parseInt(b.year) - parseInt(a.year)) ||
          String(b.week_ending || '').localeCompare(String(a.week_ending || '')));
        setRows(withComparisons(sorted));
      })
      .catch(e => setError(e.message));
  }, [rep]);

  if (!cfg || !rep) return notFound();

  return (
    <main className="sg-main">
      <Link href={`/${cfg.id}`} className="sg-back">&larr; {cfg.label}</Link>
      <h1 className="sg-title">{rep.label}</h1>
      <p className="sg-sub">{cfg.label} · histórico completo · USDA NASS QuickStats</p>

      {error && <div className="sg-badge-err">No se pudieron cargar los datos: {error}</div>}
      {!rows && !error && <div className="sg-skel-line" />}

      {rows && (
        <table className="sg-full-table">
          <thead>
            <tr>
              <th>Año</th><th>Periodo</th><th>Valor</th>
              <th>vs año ant.</th><th>vs media {HIST_YEARS}a</th><th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={i}>
                <td>{e.row.year}</td>
                <td>{e.row.week_ending || e.row.reference_period_desc}</td>
                <td className="sg-num">{nf0.format(e.value)}</td>
                <td className="sg-num">{deltaText(e.value, e.prev, e.row.unit_desc)}</td>
                <td className="sg-num">{deltaText(e.value, e.mean, e.row.unit_desc)}</td>
                <td>{e.row.unit_desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
