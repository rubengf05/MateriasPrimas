// Portado de tu HTML original, sin cambios de lógica — solo convertido en
// funciones exportables para que las páginas/componentes las importen.
// En la Fase 2 (base de datos), estas funciones se moverán a
// netlify/functions/ (para que corran en el servidor, programadas) y las
// páginas dejarán de llamarlas directamente. De momento siguen llamando
// en directo a los mismos proxies de netlify.toml, igual que hacía tu HTML.

export const MONTH_CODES = { F: 0, G: 1, H: 2, J: 3, K: 4, M: 5, N: 6, Q: 7, U: 8, V: 9, X: 10, Z: 11 };
export const MONTH_LABEL = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
export const HIST_YEARS = 5;

export const nf0 = new Intl.NumberFormat('es-ES');
export const nf1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const nf2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fmtDate(d) {
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function fmtSigned(n, nf) { return (n > 0 ? '+' : '') + nf.format(n); }

function dataError(reason, detail) {
  const e = new Error(detail || reason);
  e.reason = reason;
  return e;
}

/* ---------- Yahoo Finance (curva de futuros) ---------- */

export function buildContracts(t) {
  const now = new Date();
  const out = [];
  for (let y = now.getFullYear(); y <= now.getFullYear() + 2; y++) {
    for (const m of t.months) {
      const mi = MONTH_CODES[m];
      const monthEnd = new Date(y, mi + 1, 0);
      if (monthEnd >= now) {
        out.push({
          symbol: `${t.root}${m}${String(y).slice(-2)}${t.suffix}`,
          short: `${t.root}${m}${String(y).slice(-2)}`,
          root: t.root, monthCode: m, date: new Date(y, mi, 1),
          label: `${MONTH_LABEL[mi]} ${String(y).slice(-2)}`
        });
      }
    }
  }
  out.sort((a, b) => a.date - b.date);
  return out.slice(0, t.count || 8);
}

export async function fetchYahoo(symbol, range) {
  const q = `${encodeURIComponent(symbol)}?interval=1d&range=${range || '1mo'}`;
  const bases = ['/yahoo/v8/finance/chart/', '/yahoo2/v8/finance/chart/'];
  let lastErr = dataError('UNKNOWN', symbol);

  for (const base of bases) {
    let r;
    try { r = await fetch(base + q); }
    catch { lastErr = dataError('UPSTREAM', `${symbol}: red no disponible`); continue; }

    if (r.status === 404) throw dataError('NOT_FOUND', `${symbol}: 404 en Yahoo`);
    if (r.status === 429) { lastErr = dataError('RATE_LIMIT', `${symbol}: 429`); continue; }
    if (!r.ok) { lastErr = dataError('UPSTREAM', `${symbol}: HTTP ${r.status}`); continue; }

    let j;
    try { j = await r.json(); }
    catch { lastErr = dataError('UPSTREAM', `${symbol}: respuesta ilegible`); continue; }

    const res = j?.chart?.result?.[0];
    if (!res) { lastErr = dataError('UPSTREAM', `${symbol}: respuesta sin chart`); continue; }

    const ts = res.timestamp || [];
    const cl = res.indicators?.quote?.[0]?.close || [];
    const pts = [];
    for (let i = 0; i < ts.length; i++) if (cl[i] != null) pts.push({ t: ts[i] * 1000, c: cl[i] });

    if (!pts.length) throw dataError('NO_HISTORY', `${symbol}: sin barras en ${range || '1mo'}`);

    return {
      symbol, points: pts, last: pts[pts.length - 1].c,
      prev: pts.length > 1 ? pts[pts.length - 2].c : null,
      lastDate: new Date(pts[pts.length - 1].t)
    };
  }
  throw lastErr;
}

export async function loadMarketData(cfg) {
  const contractsByRoot = {};
  const symbols = new Set();
  const priceCache = {};
  const priceFail = {};

  cfg.tickers.forEach(t => {
    const cs = buildContracts(t);
    contractsByRoot[t.root] = cs;
    cs.forEach(c => symbols.add(c.symbol));
    symbols.add(`${t.root}=F`);
  });
  (cfg.extraContinuous || []).forEach(root => symbols.add(`${root}=F`));

  const list = [...symbols];
  const settled = await Promise.allSettled(list.map(s => fetchYahoo(s, cfg.range)));
  settled.forEach((s, i) => {
    const sym = list[i];
    if (s.status === 'fulfilled') priceCache[sym] = s.value;
    else priceFail[sym] = { reason: s.reason?.reason || 'UNKNOWN', detail: s.reason?.message || '' };
  });

  return { contractsByRoot, priceCache, priceFail };
}

/* ---------- CFTC (COT) ---------- */

export async function fetchCot(filterLike, notLikes) {
  const fromYear = new Date().getFullYear() - HIST_YEARS;
  let where = `market_and_exchange_names like '${filterLike}'` +
              ` AND report_date_as_yyyy_mm_dd >= '${fromYear}-01-01T00:00:00.000'`;
  (notLikes || []).forEach(n => { where += ` AND market_and_exchange_names not like '${n}'`; });
  const url = `/api/cftc?$where=${encodeURIComponent(where)}` +
              `&$order=${encodeURIComponent('report_date_as_yyyy_mm_dd DESC')}&$limit=400`;
  const r = await fetch(url);
  if (!r.ok) {
    if (r.status === 429) throw dataError('RATE_LIMIT', 'CFTC 429');
    if (r.status === 400) throw dataError('BAD_QUERY', 'CFTC 400');
    throw dataError('UPSTREAM', 'CFTC HTTP ' + r.status);
  }
  const rows = await r.json();
  if (!Array.isArray(rows) || !rows.length) throw dataError('EMPTY', 'CFTC sin filas');
  return rows;
}

/* ---------- USDA NASS QuickStats ---------- */

export async function nassFetch(params) {
  // NOTA IMPORTANTE: en tu HTML original la clave de NASS se mandaba desde
  // el cliente (NASS_API_KEY visible en el código fuente). Aquí, de forma
  // deliberada, NO se manda ninguna clave desde el navegador: en la Fase 2
  // esto se resuelve con una Netlify Function que añade la clave en el
  // servidor. De momento esta llamada funcionará solo si /nass-api no exige
  // key (o mientras se decide dónde inyectarla).
  const usp = new URLSearchParams({ format: 'JSON', ...params });
  const r = await fetch('/nass-api?' + usp.toString());
  if (!r.ok) {
    if (r.status === 400) throw dataError('BAD_QUERY', 'NASS 400');
    if (r.status === 429) throw dataError('RATE_LIMIT', 'NASS 429');
    throw dataError('UPSTREAM', 'NASS HTTP ' + r.status);
  }
  const j = await r.json();
  if (j?.error) throw dataError('BAD_QUERY', 'NASS: ' + [].concat(j.error).join(' '));
  if (!j || !Array.isArray(j.data) || !j.data.length) throw dataError('EMPTY', 'NASS sin filas');
  return j.data;
}

/* ---------- Comparaciones (vs año anterior / media histórica) ---------- */

function weekOfYear(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}

function periodKey(r) {
  if (r.week_ending) {
    const d = new Date(r.week_ending);
    if (!isNaN(d)) return 'W' + weekOfYear(d);
  }
  return String(r.reference_period_desc || '').toUpperCase().trim() || 'YEAR';
}

function parseNum(v) {
  if (v == null) return null;
  const s = String(v).replace(/,/g, '').trim();
  if (!/^-?\d*\.?\d+$/.test(s)) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export function withComparisons(rows) {
  const byKey = new Map();
  rows.forEach(r => {
    const v = parseNum(r.Value);
    if (v == null) return;
    const k = periodKey(r), y = parseInt(r.year);
    if (isNaN(y)) return;
    if (!byKey.has(k)) byKey.set(k, new Map());
    if (!byKey.get(k).has(y)) byKey.get(k).set(y, v);
  });

  return rows.map(r => {
    const value = parseNum(r.Value);
    const k = periodKey(r), y = parseInt(r.year);
    const series = byKey.get(k);
    let prev = null, mean = null, meanN = 0;
    if (series && !isNaN(y)) {
      prev = series.has(y - 1) ? series.get(y - 1) : null;
      const hist = [];
      for (let i = 1; i <= HIST_YEARS; i++) if (series.has(y - i)) hist.push(series.get(y - i));
      meanN = hist.length;
      if (meanN >= 2) mean = hist.reduce((a, b) => a + b, 0) / meanN;
    }
    return { row: r, value, periodKey: k, prev, mean, meanN };
  });
}
