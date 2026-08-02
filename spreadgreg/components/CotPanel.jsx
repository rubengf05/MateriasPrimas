'use client';
import { useEffect, useState } from 'react';
import { fetchCot, nf0, fmtSigned, fmtDate } from '../lib/data-engine';

function netNC(r) { return (+r.noncomm_positions_long_all || 0) - (+r.noncomm_positions_short_all || 0); }
function netC(r) { return (+r.comm_positions_long_all || 0) - (+r.comm_positions_short_all || 0); }

export default function CotPanel({ cfg }) {
  const [state, setState] = useState({}); // key -> {status, latest, error}

  useEffect(() => {
    if (!cfg.cot.length) return;
    cfg.cot.forEach(mkt => {
      fetchCot(mkt.filterLike, mkt.notLike)
        .then(rows => {
          const sorted = rows.slice().sort((a, b) =>
            new Date(b.report_date_as_yyyy_mm_dd) - new Date(a.report_date_as_yyyy_mm_dd));
          const latest = sorted[0];
          setState(s => ({ ...s, [mkt.key]: { status: 'ok', latest } }));
        })
        .catch(e => setState(s => ({ ...s, [mkt.key]: { status: 'error', error: e.message } })));
    });
  }, [cfg]);

  if (!cfg.cot.length) return null;

  return (
    <div className="sg-grid">
      {cfg.cot.map(mkt => {
        const st = state[mkt.key];
        return (
          <div key={mkt.key} className="sg-card">
            <div className="sg-card-label">{mkt.label}</div>
            {!st && <div className="sg-skel-line" />}
            {st?.status === 'error' && <div className="sg-badge-err">Sin datos</div>}
            {st?.status === 'ok' && (
              <>
                <div className="sg-cot-stats">
                  <div>
                    <div className="sg-cot-k">No Comercial</div>
                    <div className={netNC(st.latest) >= 0 ? 'sg-up' : 'sg-down'}>
                      {fmtSigned(netNC(st.latest), nf0)}
                    </div>
                  </div>
                  <div>
                    <div className="sg-cot-k">Comercial</div>
                    <div className={netC(st.latest) >= 0 ? 'sg-up' : 'sg-down'}>
                      {fmtSigned(netC(st.latest), nf0)}
                    </div>
                  </div>
                </div>
                <div className="sg-card-sub">Informe: {fmtDate(new Date(st.latest.report_date_as_yyyy_mm_dd))}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
