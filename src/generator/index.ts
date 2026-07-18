import type { BusinessConfig, ProductItem, GeneratedFile } from '@/types';
import { buildAppJs } from './engine';
import { buildIndexHtml, buildStyleCss, buildManifest, buildSwJs, buildIconSvg, buildLeeme, slugify } from './shell';

export function generateApp(config: BusinessConfig, productos: ProductItem[]): GeneratedFile[] {
  return [
    { path: 'index.html', content: buildIndexHtml(config) },
    { path: 'app.js', content: buildAppJs(config, productos, config.template) },
    { path: 'style.css', content: buildStyleCss(config) },
    { path: 'productos.json', content: JSON.stringify(productos, null, 2) },
    { path: 'manifest.json', content: buildManifest(config) },
    { path: 'sw.js', content: buildSwJs(config) },
    { path: 'icons/icon.svg', content: buildIconSvg(config) },
    { path: 'LEEME.txt', content: buildLeeme(config) },
  ];
}

// HTML único con todo inline → para la vista previa en iframe (srcDoc)
export function buildPreviewHtml(config: BusinessConfig, productos: ProductItem[]): string {
  const css = buildStyleCss(config);
  const js = buildAppJs(config, productos, config.template).replace(/<\/script/gi, '<\\/script');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${config.businessName}</title>
<style>${css}</style>
</head>
<body>
<div id="app"><div class="splash">${config.emoji}</div></div>
<script>${js}</script>
</body>
</html>`;
}

export { slugify };
