import type { BusinessConfig } from '@/types';

export function slugify(name: string): string {
  return (name || 'mi-app')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'mi-app';
}

export function buildIndexHtml(config: BusinessConfig): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="${config.colorPrimary}">
  <meta name="description" content="${config.businessName} — ${config.tagline}">
  <title>${config.businessName}</title>
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="icons/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"><div class="splash">${config.emoji}</div></div>
  <script src="app.js" defer></script>
</body>
</html>
`;
}

export function buildStyleCss(config: BusinessConfig): string {
  return `/* ${config.businessName} — tema generado por Fábrica de Apps */
:root{
  --primary: ${config.colorPrimary};
  --accent: ${config.colorAccent};
  --bg: ${config.colorBg};
  --surface: ${config.colorSurface};
  --surface2: color-mix(in srgb, ${config.colorSurface} 70%, white 6%);
  --text: #f1f5f9;
  --muted: #94a3b8;
  --border: rgba(148,163,184,.16);
  --radius: 16px;
  --safe-b: env(safe-area-inset-bottom, 0px);
}
*{ margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html{ color-scheme: dark; }
body{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg); color: var(--text);
  min-height: 100vh;
}
.splash{ display:flex; align-items:center; justify-content:center; min-height:100vh; font-size:64px; animation:pulse 1.2s ease infinite; }
@keyframes pulse{ 0%,100%{ transform:scale(1); opacity:.7 } 50%{ transform:scale(1.12); opacity:1 } }

/* ---------- Header ---------- */
.app-header{
  position: sticky; top:0; z-index:20;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
}
.brand{ display:flex; align-items:center; gap:12px; max-width:720px; margin:0 auto; }
.brand-emoji{
  width:44px; height:44px; border-radius:14px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:24px;
  background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, black));
  box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 45%, transparent);
}
.brand-name{ font-weight:800; font-size:18px; letter-spacing:-.02em; }
.brand-tag{ font-size:12px; color:var(--muted); }

.app-main{ max-width:720px; margin:0 auto; padding:16px 16px 130px; }

/* ---------- Bottom nav ---------- */
.bottom-nav{
  position:fixed; left:0; right:0; bottom:0; z-index:30;
  display:flex; justify-content:space-around;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-top:1px solid var(--border);
  padding: 6px 4px calc(6px + var(--safe-b));
}
.nav-item{
  flex:1; max-width:96px; border:0; background:none; color:var(--muted);
  display:flex; flex-direction:column; align-items:center; gap:2px;
  padding:6px 2px; border-radius:12px; cursor:pointer; font-size:11px;
}
.nav-item.active{ color:var(--text); background: color-mix(in srgb, var(--primary) 22%, transparent); }
.nav-icon{ font-size:20px; position:relative; }
.nav-badge{
  position:absolute; top:-6px; right:-12px;
  background: var(--accent); color:#111; font-size:10px; font-weight:800;
  min-width:16px; height:16px; border-radius:8px; display:flex; align-items:center; justify-content:center; padding:0 4px;
}
.nav-label{ font-weight:600; }

/* ---------- Controles ---------- */
.input{
  width:100%; padding:12px 14px; border-radius:12px;
  border:1px solid var(--border); background:var(--surface); color:var(--text);
  font-size:15px; outline:none;
}
.input:focus{ border-color: var(--primary); box-shadow:0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent); }
.search-box{ margin-bottom:12px; }
.lbl{ display:block; font-size:12px; font-weight:700; color:var(--muted); margin:12px 0 6px; text-transform:uppercase; letter-spacing:.04em; }
.hint{ font-size:13px; color:var(--muted); margin-top:8px; }

.chips{ display:flex; gap:8px; overflow-x:auto; padding:2px 0 12px; scrollbar-width:none; }
.chips::-webkit-scrollbar{ display:none; }
.chip{
  flex-shrink:0; border:1px solid var(--border); background:var(--surface); color:var(--muted);
  padding:7px 14px; border-radius:999px; font-size:13px; font-weight:600; cursor:pointer;
}
.chip.active{ background:var(--primary); border-color:var(--primary); color:#fff; }

/* ---------- Tarjetas de producto ---------- */
.prod-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; }
.prod-card{
  background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
  padding:16px 12px; text-align:center; cursor:pointer;
  transition:transform .15s ease, border-color .15s ease;
  display:flex; flex-direction:column; align-items:center; gap:6px;
}
.prod-card:active{ transform:scale(.97); }
.prod-card.disabled{ opacity:.45; cursor:not-allowed; }
.prod-emoji{ font-size:40px; }
.prod-name{ font-size:14px; font-weight:700; line-height:1.25; }
.prod-price{ font-size:15px; font-weight:800; color:var(--primary); }
.badge{ font-size:11px; font-weight:700; color:var(--muted); background:var(--surface2); padding:3px 10px; border-radius:999px; }
.badge-red{ color:#fca5a5; background:rgba(239,68,68,.16); }
.badge-green{ color:#86efac; background:rgba(34,197,94,.16); }
.badge-yellow{ color:#fde68a; background:rgba(245,158,11,.16); }

/* ---------- Barra carrito ---------- */
.cart-bar{
  position:fixed; left:12px; right:12px; bottom:calc(72px + var(--safe-b)); z-index:25;
  max-width:600px; margin:0 auto;
  background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
  padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px;
  box-shadow:0 10px 30px rgba(0,0,0,.45); cursor:pointer;
}

/* ---------- Stats / listas ---------- */
.stat-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:10px; margin-bottom:16px; }
.stat{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px 10px; text-align:center; }
.stat-red{ border-color:rgba(239,68,68,.45); }
.stat-num{ font-size:19px; font-weight:800; }
.stat-lbl{ font-size:11px; color:var(--muted); margin-top:2px; }
.section-title{ font-size:16px; font-weight:800; margin:20px 0 10px; }
.list{ display:flex; flex-direction:column; gap:10px; }
.list-row{
  display:flex; align-items:center; gap:12px;
  background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:12px 14px;
}
.row-agotado{ border-color:rgba(239,68,68,.4); }
.row-emoji{ font-size:26px; flex-shrink:0; }
.row-main{ flex:1; min-width:0; }
.row-name{ font-weight:700; font-size:14px; }
.row-sub{ font-size:12px; color:var(--muted); margin-top:2px; }
.row-stock{ display:flex; align-items:center; gap:8px; font-weight:700; }
.stock-zero{ color:#f87171; }
.empty{ text-align:center; color:var(--muted); padding:40px 20px; font-size:14px; line-height:1.7; grid-column:1/-1; }

/* ---------- Botones ---------- */
.btn{
  border:0; border-radius:12px; padding:11px 18px; font-size:14px; font-weight:700;
  cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;
  text-decoration:none; color:var(--text); transition:transform .12s ease, filter .12s ease;
}
.btn:active{ transform:scale(.96); }
.btn-primary{ background:var(--primary); color:#fff; }
.btn-accent{ background:var(--accent); color:#111; }
.btn-ghost{ background:var(--surface2); color:var(--text); border:1px solid var(--border); }
.btn-sm{ padding:8px 12px; font-size:13px; border-radius:10px; }
.btn-block{ width:100%; margin-bottom:12px; }
.mini-btn{
  width:30px; height:30px; border-radius:9px; border:1px solid var(--border);
  background:var(--surface2); color:var(--text); font-size:15px; font-weight:800; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center;
}

/* ---------- Deudas / reservas ---------- */
.deuda-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px; }
.deuda-fin{ opacity:.6; }
.deuda-head{ display:flex; justify-content:space-between; align-items:center; font-size:15px; margin-bottom:4px; }
.deuda-sub{ font-size:12.5px; color:var(--muted); margin-top:4px; }
.deuda-btns{ display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
.progress{ height:8px; border-radius:4px; background:var(--surface2); margin-top:10px; overflow:hidden; }
.progress-fill{ height:100%; border-radius:4px; background:linear-gradient(90deg, var(--primary), var(--accent)); transition:width .3s ease; }

/* ---------- Modal ---------- */
.modal-overlay{
  position:fixed; inset:0; z-index:50; background:rgba(2,6,23,.7);
  backdrop-filter: blur(4px); display:flex; align-items:flex-end; justify-content:center;
}
@media(min-width:640px){ .modal-overlay{ align-items:center; padding:20px; } }
.modal-card{
  width:100%; max-width:480px; max-height:88vh; overflow-y:auto;
  background:var(--surface); border:1px solid var(--border);
  border-radius:22px 22px 0 0; padding:20px;
  animation:slideUp .22s ease;
}
@media(min-width:640px){ .modal-card{ border-radius:22px; } }
@keyframes slideUp{ from{ transform:translateY(30px); opacity:0 } to{ transform:none; opacity:1 } }
.modal-title{ font-size:18px; font-weight:800; margin-bottom:12px; }
.modal-lines{ display:flex; flex-direction:column; gap:8px; margin:8px 0; }
.line{ display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:14px; }
.line-btns{ display:flex; gap:6px; }
.total-row{
  display:flex; justify-content:space-between; align-items:center;
  font-size:17px; font-weight:800; padding:12px 0; margin-top:8px;
  border-top:1px solid var(--border);
}
.vuelto{ font-size:15px; font-weight:700; margin-top:10px; padding:10px 14px; border-radius:12px; background:var(--surface2); }
.vuelto.ok{ color:#86efac; }
.vuelto.bad{ color:#fca5a5; }
.modal-actions{ display:flex; gap:10px; margin-top:18px; }
.modal-actions .btn{ flex:1; }

/* ---------- Detalle producto ---------- */
.detalle-emoji{ font-size:64px; text-align:center; margin-bottom:8px; }
.detalle-desc{ font-size:14px; color:var(--muted); text-align:center; line-height:1.6; }
.detalle-precio{ font-size:24px; font-weight:800; color:var(--primary); text-align:center; margin:10px 0; }
.qty-row{ display:flex; align-items:center; gap:10px; }
.qty-input{ text-align:center; }

/* ---------- Toast ---------- */
.toast{
  position:fixed; left:50%; bottom:calc(96px + var(--safe-b)); z-index:60;
  transform:translateX(-50%) translateY(16px); opacity:0;
  background:var(--surface); color:var(--text); border:1px solid var(--primary);
  padding:11px 18px; border-radius:999px; font-size:13.5px; font-weight:700;
  box-shadow:0 8px 26px rgba(0,0,0,.5); transition:all .28s ease; pointer-events:none;
  max-width:88vw; text-align:center;
}
.toast.show{ transform:translateX(-50%) translateY(0); opacity:1; }
.toast.warn{ border-color:#f59e0b; }

.footer-note{ text-align:center; color:var(--muted); font-size:12px; margin-top:32px; opacity:.7; }
`;
}

export function buildManifest(config: BusinessConfig): string {
  return JSON.stringify({
    name: config.businessName,
    short_name: config.businessName.slice(0, 12),
    description: config.tagline,
    start_url: '.',
    scope: '.',
    display: 'standalone',
    orientation: 'portrait',
    background_color: config.colorBg,
    theme_color: config.colorPrimary,
    icons: [
      { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }, null, 2);
}

export function buildIconSvg(config: BusinessConfig): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="${config.colorPrimary}"/>
  <text x="256" y="330" font-size="240" text-anchor="middle">${config.emoji}</text>
</svg>
`;
}

export function buildSwJs(config: BusinessConfig): string {
  const cache = 'cache_' + slugify(config.businessName) + '_v1';
  return `/* Service Worker — ${config.businessName} */
var CACHE = '${cache}';
var ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'productos.json', 'manifest.json', 'icons/icon.svg'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k !== CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        return res;
      }).catch(function(){ return caches.match('index.html'); });
    })
  );
});
`;
}

export function buildLeeme(config: BusinessConfig): string {
  const slug = slugify(config.businessName);
  return `🎉 ${config.businessName} — tu app está lista
================================================

ARCHIVOS INCLUIDOS (misma estructura que un POS profesional):
  index.html      → página principal
  app.js          → toda la lógica de la app
  style.css       → diseño y colores de tu marca
  productos.json  → tus productos/servicios (editable)
  manifest.json   → instalable como app en el celular
  sw.js           → funciona sin internet (PWA)
  icons/icon.svg  → ícono de tu app

CÓMO PROBARLA EN TU PC:
  Doble clic en index.html — funciona altiro, sin instalar nada.

CÓMO SUBIRLA A INTERNET (GRATIS, 5 MINUTOS):
  Opción A — Vercel (recomendada):
    1. Crea un repo nuevo en GitHub llamado "${slug}"
    2. Sube TODOS estos archivos
    3. En vercel.com: "Add New Project" → importa el repo → Deploy
    4. Listo, tendrás tu link público

  Opción B — Netlify Drop:
    1. Entra a app.netlify.com/drop
    2. Arrastra la carpeta completa
    3. Listo

INSTALARLA COMO APP EN EL CELULAR:
  Abre el link en Chrome → menú ⋮ → "Agregar a pantalla de inicio".

RESPALDOS:
  Dentro de la app, sección Ajustes → "Descargar respaldo".
  Hazlo seguido para no perder tus ventas/reservas.

Hecha con 🏭 Fábrica de Apps
`;
}
