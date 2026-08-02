// netlify/functions/nass.mjs
//
// Proxy de servidor para USDA NASS QuickStats.
//
// Motivo del cambio: NASS exige el parametro "key" y responde 401 cuando no
// llega. Antes /nass-api era un simple redirect de netlify.toml al endpoint de
// NASS, y un redirect no puede inyectar secretos: de ahi el 401 en el deploy.
//
// Esta funcion recibe la peticion del navegador, anade la clave leyendola de la
// variable de entorno NASS_API_KEY (definida en Netlify, nunca en el repo) y
// devuelve la respuesta. La clave no llega jamas al cliente.

const NASS_ENDPOINT = 'https://quickstats.nass.usda.gov/api/api_GET/';

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export default async function handler(request) {
  const apiKey = process.env.NASS_API_KEY;

  if (!apiKey) {
    return json(500, {
      error: ['NASS_API_KEY no esta definida en las variables de entorno de Netlify.']
    });
  }

  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();

  for (const [name, value] of incoming) {
    // Nunca se acepta una clave enviada desde el navegador.
    if (name.toLowerCase() === 'key') continue;
    params.append(name, value);
  }
  if (!params.has('format')) params.set('format', 'JSON');
  params.set('key', apiKey);

  let upstream;
  try {
    upstream = await fetch(NASS_ENDPOINT + '?' + params.toString(), {
      headers: { accept: 'application/json' }
    });
  } catch {
    return json(502, { error: ['No se ha podido contactar con NASS QuickStats.'] });
  }

  const body = await upstream.text();

  // Si NASS sigue devolviendo 401/403 es un problema de configuracion del
  // servidor, no de la consulta: se traduce a 500 con un mensaje claro para
  // que nunca vuelva a aparecer un 401 opaco en el navegador.
  if (upstream.status === 401 || upstream.status === 403) {
    return json(500, {
      error: ['NASS ha rechazado la clave. Revisa el valor de NASS_API_KEY en Netlify.']
    });
  }

  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
      'cache-control': 'public, max-age=1800'
    }
  });
}
