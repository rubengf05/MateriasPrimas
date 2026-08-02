# SpreadGreg — Fase 0 (andamiaje)

Esto es el punto de partida de la nueva arquitectura: la misma plataforma,
pero con páginas separadas de verdad en vez de todo en un único HTML.

## Qué hay ya funcionando

- `/` → menú principal con las materias primas (de momento solo "Corn",
  para no tener que copiar todo el HTML de golpe).
- `/corn` → vista resumen: curva de futuros + spreads + COT (igual que
  tu pestaña actual, pero en su propia URL).
- `/corn/crop-progress` (y el resto de informes USDA de `corn`) → página
  de detalle con el histórico completo, sin compartir espacio con nada más.

Todo sigue llamando en directo a Yahoo/CFTC/NASS a través de los mismos
proxies de tu `netlify.toml` (los he mantenido tal cual). Es decir:
**visualmente y en datos, hace lo mismo que tu HTML actual** — lo único
que cambia en esta fase es que ahora está repartido en páginas reales.

## Lo que falta por migrar (mecánico, sin decisiones nuevas)

1. Copiar el resto de bloques de `COMMODITIES_CONFIG` desde tu HTML
   original a `lib/commodities-config.js` (wheat-srw, wheat-hrw,
   wheat-spring, soybeans, soybean-meal, soybean-oil, live-cattle,
   feeder-cattle, lean-hogs, ethanol).
2. Nada más en esta fase — el motor y las páginas ya están preparados
   para pintar cualquier materia prima que añadas a ese array.

## Cómo lo pruebas tú (sin tocar código)

1. Sube esta carpeta a un repositorio nuevo de GitHub.
2. En Netlify: "Add new site" → "Import from Git" → selecciona ese repo.
   Netlify detecta `netlify.toml` solo y hace `npm run build`.
3. Al entrar, verás el menú principal. Pincha en "Corn" para ver la vista
   resumen, y desde ahí en cualquier informe USDA para ver el detalle.

## Lo que NO se ha hecho todavía (fases siguientes, a propósito)

- **Base de datos propia (Fase 2)**: de momento sigue todo en directo
  desde el navegador, igual que antes. Cuando lo decidamos, esto pasa a
  Netlify Scheduled Functions + Netlify DB, y las páginas dejan de llamar
  a Yahoo/CFTC/NASS directamente.
- **Clave de NASS**: en tu HTML original viajaba en el cliente. Aquí no
  se manda ninguna clave (por eso el informe puede fallar si NASS la
  exige) — se resuelve de raíz en la Fase 2, cuando la llamada se mueva
  al servidor.
- El resto de materias primas, más allá de "Corn".
