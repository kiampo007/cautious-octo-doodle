import type { BusinessConfig, ProductItem, TemplateId } from '@/types';
import { TEMPLATE_SECTIONS } from './templates';

// ============================================================
// MOTOR GENERADOR — produce el app.js completo de la app hija.
// Reglas de oro dentro del kernel generado:
//  - SIN template literals (solo concatenación con comillas simples)
//  - Sin secuencias ${ accidentales
//  - Datos de usuario inyectados con JSON.stringify (escaping seguro)
// ============================================================

function part1(config: BusinessConfig, productos: ProductItem[], template: TemplateId): string {
  const meta = TEMPLATE_SECTIONS[template];
  const cfg = {
    template,
    businessName: config.businessName,
    tagline: config.tagline,
    whatsapp: config.whatsapp.replace(/[^0-9]/g, ''),
    city: config.city,
    currencySymbol: config.currencySymbol,
    locale: config.locale,
    colors: {
      primary: config.colorPrimary,
      accent: config.colorAccent,
      bg: config.colorBg,
      surface: config.colorSurface,
    },
    emoji: config.emoji,
    storagePrefix: 'app_' + template + '_',
    sections: meta.sections,
    features: meta.features,
  };

  return `/* ============================================================
   ${config.businessName} — generada con Fábrica de Apps
   Estructura: index.html + app.js + style.css + productos.json
               + manifest.json + sw.js  (misma base que un POS real)
   ============================================================ */

var APP_CONFIG = ${JSON.stringify(cfg, null, 2)};

var PRODUCTOS_INICIALES = ${JSON.stringify(productos, null, 2)};

/* ---------------- Utilidades ---------------- */
function $(sel){ return document.querySelector(sel); }
function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmt(n){ return APP_CONFIG.currencySymbol + Math.round(Number(n)||0).toLocaleString(APP_CONFIG.locale); }
function hoy(){ return new Date().toISOString().slice(0,10); }
function ahora(){ return new Date().toLocaleString(APP_CONFIG.locale); }
function uid(){ return Date.now() + '_' + Math.floor(Math.random()*1000); }

function saveKey(key, val){ try { localStorage.setItem(APP_CONFIG.storagePrefix + key, JSON.stringify(val)); } catch(e){ console.warn('save error', e); } }
function loadKey(key, def){ try { var raw = localStorage.getItem(APP_CONFIG.storagePrefix + key); return raw ? JSON.parse(raw) : def; } catch(e){ return def; } }

function toast(msg, tipo){
  var t = document.createElement('div');
  t.className = 'toast ' + (tipo || 'ok');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.classList.add('show'); }, 10);
  setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 300); }, 2600);
}

function openModal(html){
  closeModal();
  var ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.id = 'modalOverlay';
  ov.onclick = function(e){ if(e.target === ov) closeModal(); };
  ov.innerHTML = '<div class="modal-card">' + html + '</div>';
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  var ov = $('#modalOverlay');
  if(ov) ov.remove();
  document.body.style.overflow = '';
}

/* ---------------- Estado global ---------------- */
var DB = {
  productos: loadKey('productos', null) || PRODUCTOS_INICIALES.slice(),
  ventas: loadKey('ventas', []),
  deudas: loadKey('deudas', []),
  reservas: loadKey('reservas', []),
  carrito: loadKey('carrito', [])
};
function saveAll(){
  saveKey('productos', DB.productos);
  saveKey('ventas', DB.ventas);
  saveKey('deudas', DB.deudas);
  saveKey('reservas', DB.reservas);
  saveKey('carrito', DB.carrito);
}

/* ---------------- Router de secciones ---------------- */
var SECTION_META = {
  venta:      { label: 'Venta',      icon: '🧾' },
  inventario: { label: 'Inventario', icon: '📦' },
  deudas:     { label: 'Deudas',     icon: '💳' },
  reportes:   { label: 'Reportes',   icon: '📊' },
  catalogo:   { label: 'Catálogo',   icon: '🛍️' },
  carrito:    { label: 'Pedido',     icon: '🛒' },
  menu:       { label: 'Menú',       icon: '🍽️' },
  servicios:  { label: 'Servicios',  icon: '✨' },
  reservas:   { label: 'Reservas',   icon: '📅' },
  config:     { label: 'Ajustes',    icon: '⚙️' }
};

var currentSection = APP_CONFIG.sections[0];

function showSection(id){
  currentSection = id;
  renderApp();
  window.scrollTo(0,0);
}

function renderApp(){
  var root = $('#app');
  var navHtml = '';
  for(var i=0; i<APP_CONFIG.sections.length; i++){
    var sid = APP_CONFIG.sections[i];
    var m = SECTION_META[sid];
    var badge = '';
    if(sid === 'carrito' && DB.carrito.length > 0){
      var cnt = 0;
      for(var j=0;j<DB.carrito.length;j++) cnt += DB.carrito[j].cant;
      badge = '<span class="nav-badge">' + cnt + '</span>';
    }
    if(sid === 'deudas'){
      var pend = 0;
      for(var k=0;k<DB.deudas.length;k++) if(DB.deudas[k].pagadas < DB.deudas[k].cuotas) pend++;
      if(pend > 0) badge = '<span class="nav-badge">' + pend + '</span>';
    }
    navHtml += '<button class="nav-item' + (sid===currentSection?' active':'') + '" onclick="showSection(\\'' + sid + '\\')">'
      + '<span class="nav-icon">' + m.icon + badge + '</span>'
      + '<span class="nav-label">' + m.label + '</span></button>';
  }

  var body = '';
  if(currentSection==='venta') body = renderVenta();
  else if(currentSection==='inventario') body = renderInventario();
  else if(currentSection==='deudas') body = renderDeudas();
  else if(currentSection==='reportes') body = renderReportes();
  else if(currentSection==='catalogo') body = renderCatalogo();
  else if(currentSection==='carrito') body = renderCarrito();
  else if(currentSection==='menu') body = renderMenu();
  else if(currentSection==='servicios') body = renderServicios();
  else if(currentSection==='reservas') body = renderReservas();
  else if(currentSection==='config') body = renderConfig();

  root.innerHTML =
    '<header class="app-header">'
    + '<div class="brand"><span class="brand-emoji">' + APP_CONFIG.emoji + '</span>'
    + '<div><div class="brand-name">' + esc(APP_CONFIG.businessName) + '</div>'
    + '<div class="brand-tag">' + esc(APP_CONFIG.tagline) + '</div></div></div>'
    + '</header>'
    + '<main class="app-main">' + body + '</main>'
    + '<nav class="bottom-nav">' + navHtml + '</nav>';

  afterRender();
}

function afterRender(){
  var s = $('#buscador');
  if(s){
    s.value = window._filtro || '';
    s.addEventListener('input', function(){
      window._filtro = s.value;
      renderApp();
      var n = $('#buscador');
      if(n){ n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
    });
  }
}
`;
}

function part2(): string {
  return `
/* ============================================================
   SECCIONES POS — Venta / Inventario / Deudas / Reportes
   ============================================================ */

var _filtroCat = 'Todas';

function setCat(c){ _filtroCat = c; renderApp(); }

function categorias(){
  var cats = ['Todas'];
  for(var i=0;i<DB.productos.length;i++){
    var c = DB.productos[i].categoria || 'General';
    if(cats.indexOf(c) < 0) cats.push(c);
  }
  return cats;
}

function productosVisibles(){
  var q = (window._filtro || '').toLowerCase();
  var out = [];
  for(var i=0;i<DB.productos.length;i++){
    var p = DB.productos[i];
    if(_filtroCat !== 'Todas' && (p.categoria||'General') !== _filtroCat) continue;
    if(q && p.nombre.toLowerCase().indexOf(q) < 0) continue;
    out.push(p);
  }
  return out;
}

function catChips(){
  var cats = categorias();
  var h = '<div class="chips">';
  for(var i=0;i<cats.length;i++){
    h += '<button class="chip' + (cats[i]===_filtroCat?' active':'') + '" data-cat="' + esc(cats[i]) + '" onclick="setCat(this.dataset.cat)">' + esc(cats[i]) + '</button>';
  }
  return h + '</div>';
}

/* ---------------- VENTA ---------------- */
function renderVenta(){
  var prods = productosVisibles();
  var h = '<div class="search-box"><input id="buscador" class="input" type="search" placeholder="Buscar producto..."></div>';
  h += catChips();
  h += '<div class="prod-grid">';
  for(var i=0;i<prods.length;i++){
    var p = prods[i];
    var agotado = p.stock <= 0;
    h += '<div class="prod-card' + (agotado?' disabled':'') + '"' + (agotado?'':' onclick="addToCart(' + p.id + ')"') + '>'
      + '<div class="prod-emoji">' + esc(p.emoji || '📦') + '</div>'
      + '<div class="prod-name">' + esc(p.nombre) + '</div>'
      + '<div class="prod-price">' + fmt(p.precio) + '</div>'
      + (agotado ? '<span class="badge badge-red">Agotado</span>' : '<span class="badge">' + p.stock + ' disp.</span>')
      + '</div>';
  }
  if(prods.length === 0) h += '<div class="empty">Sin resultados</div>';
  h += '</div>';

  var cnt = 0, total = 0;
  for(var j=0;j<DB.carrito.length;j++){ cnt += DB.carrito[j].cant; total += DB.carrito[j].cant * DB.carrito[j].precio; }
  if(cnt > 0){
    h += '<div class="cart-bar" onclick="openCheckout()">'
      + '<span>🛒 ' + cnt + ' ítem' + (cnt>1?'s':'') + '</span>'
      + '<strong>' + fmt(total) + '</strong>'
      + '<button class="btn btn-accent">Cobrar →</button></div>';
  }
  return h;
}

function addToCart(id){
  var p = null;
  for(var i=0;i<DB.productos.length;i++) if(DB.productos[i].id === id) p = DB.productos[i];
  if(!p) return;
  if(APP_CONFIG.features.stock && p.stock <= 0){ toast('Producto agotado', 'warn'); return; }
  var line = null;
  for(var j=0;j<DB.carrito.length;j++) if(DB.carrito[j].id === id) line = DB.carrito[j];
  if(line){
    if(APP_CONFIG.features.stock && line.cant >= p.stock){ toast('Stock máximo alcanzado', 'warn'); return; }
    line.cant++;
  } else {
    DB.carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, cant: 1, emoji: p.emoji });
  }
  saveAll();
  toast('Agregado: ' + p.nombre);
  renderApp();
}

function changeQty(id, d){
  for(var j=0;j<DB.carrito.length;j++){
    if(DB.carrito[j].id === id){
      DB.carrito[j].cant += d;
      if(DB.carrito[j].cant <= 0) DB.carrito.splice(j,1);
      break;
    }
  }
  saveAll();
  renderApp();
}

function clearCart(){ DB.carrito = []; saveAll(); renderApp(); }

function cartTotal(){ var t=0; for(var j=0;j<DB.carrito.length;j++) t += DB.carrito[j].cant * DB.carrito[j].precio; return t; }

function openCheckout(){
  if(DB.carrito.length === 0){ toast('Carrito vacío', 'warn'); return; }
  var h = '<h3 class="modal-title">Confirmar venta</h3><div class="modal-lines">';
  for(var j=0;j<DB.carrito.length;j++){
    var l = DB.carrito[j];
    h += '<div class="line"><span>' + esc(l.emoji||'') + ' ' + esc(l.nombre) + ' ×' + l.cant + '</span>'
      + '<span class="line-btns"><button class="mini-btn" onclick="changeQty(' + l.id + ',-1);openCheckout()">−</button>'
      + '<button class="mini-btn" onclick="changeQty(' + l.id + ',1);openCheckout()">+</button></span>'
      + '<strong>' + fmt(l.precio*l.cant) + '</strong></div>';
  }
  h += '</div><div class="total-row"><span>Total</span><strong>' + fmt(cartTotal()) + '</strong></div>';
  if(APP_CONFIG.features.cuotas){
    h += '<label class="lbl">Forma de pago</label>'
      + '<select id="pagoTipo" class="input" onchange="toggleCuotas()">'
      + '<option value="1">Contado</option>';
    for(var c=2;c<=12;c++) h += '<option value="' + c + '">' + c + ' cuotas</option>';
    h += '</select>'
      + '<div id="cuotasBox" style="display:none"><label class="lbl">Nombre del cliente</label>'
      + '<input id="clienteNombre" class="input" placeholder="Ej: María Pérez">'
      + '<div id="cuotaInfo" class="hint"></div></div>';
  } else {
    h += '<input type="hidden" id="pagoTipo" value="1">';
  }
  h += '<label class="lbl">Paga con</label>'
    + '<input id="pagaCon" class="input" type="number" inputmode="numeric" placeholder="' + cartTotal() + '" oninput="calcVuelto()">'
    + '<div id="vueltoBox" class="vuelto">Vuelto: ' + fmt(0) + '</div>'
    + '<div class="modal-actions">'
    + '<button class="btn btn-ghost" onclick="clearCart();closeModal()">Vaciar</button>'
    + '<button class="btn btn-accent" onclick="processVenta()">✓ Confirmar</button></div>';
  openModal(h);
}

function toggleCuotas(){
  var n = parseInt($('#pagoTipo').value, 10);
  $('#cuotasBox').style.display = n > 1 ? 'block' : 'none';
  if(n > 1){
    var m = Math.ceil(cartTotal() / n);
    $('#cuotaInfo').textContent = n + ' cuotas de ' + fmt(m) + ' — queda registrado en Deudas';
  }
}

function calcVuelto(){
  var paga = parseFloat($('#pagaCon').value) || 0;
  var v = paga - cartTotal();
  var box = $('#vueltoBox');
  box.textContent = v >= 0 ? 'Vuelto: ' + fmt(v) : 'Falta: ' + fmt(-v);
  box.className = 'vuelto ' + (v >= 0 ? 'ok' : 'bad');
}

function processVenta(){
  var total = cartTotal();
  var cuotas = parseInt($('#pagoTipo').value, 10) || 1;
  var paga = parseFloat($('#pagaCon').value) || total;
  var cliente = cuotas > 1 ? ($('#clienteNombre').value || '').trim() : '';
  if(cuotas > 1 && !cliente){ toast('Ingresa el nombre del cliente', 'warn'); return; }
  if(cuotas === 1 && paga < total){ toast('El pago no alcanza', 'warn'); return; }

  var items = DB.carrito.slice();
  var venta = { id: uid(), fecha: ahora(), dia: hoy(), items: items, total: total, pago: paga, vuelto: Math.max(0, paga - total), cuotas: cuotas, cliente: cliente };
  DB.ventas.push(venta);

  for(var i=0;i<items.length;i++){
    for(var j=0;j<DB.productos.length;j++){
      if(DB.productos[j].id === items[i].id && APP_CONFIG.features.stock){
        DB.productos[j].stock = Math.max(0, DB.productos[j].stock - items[i].cant);
      }
    }
  }

  if(cuotas > 1){
    DB.deudas.push({ id: uid(), cliente: cliente, fecha: ahora(), items: items, total: total, cuotas: cuotas, pagadas: 0, montoCuota: Math.ceil(total/cuotas), historial: [] });
  }

  DB.carrito = [];
  saveAll();
  closeModal();
  toast(cuotas > 1 ? 'Venta a ' + cuotas + ' cuotas registrada' : 'Venta registrada — vuelto ' + fmt(venta.vuelto));
  renderApp();
}

/* ---------------- INVENTARIO ---------------- */
function renderInventario(){
  var total = DB.productos.length, agot = 0, valor = 0;
  for(var i=0;i<DB.productos.length;i++){
    valor += DB.productos[i].precio * DB.productos[i].stock;
    if(DB.productos[i].stock <= 0) agot++;
  }
  var h = '<div class="stat-grid">'
    + '<div class="stat"><div class="stat-num">' + total + '</div><div class="stat-lbl">Productos</div></div>'
    + '<div class="stat ' + (agot>0?'stat-red':'') + '"><div class="stat-num">' + agot + '</div><div class="stat-lbl">Agotados</div></div>'
    + '<div class="stat"><div class="stat-num">' + fmt(valor) + '</div><div class="stat-lbl">Valor stock</div></div>'
    + '</div>';
  h += '<button class="btn btn-primary btn-block" onclick="openNuevoProducto()">+ Agregar producto</button>';

  var orden = DB.productos.slice().sort(function(a,b){ return (a.stock>0?1:0) - (b.stock>0?1:0); });
  h += '<div class="list">';
  for(var k=0;k<orden.length;k++){
    var p = orden[k];
    h += '<div class="list-row' + (p.stock<=0?' row-agotado':'') + '">'
      + '<span class="row-emoji">' + esc(p.emoji||'📦') + '</span>'
      + '<div class="row-main"><div class="row-name">' + esc(p.nombre) + '</div>'
      + '<div class="row-sub">' + esc(p.categoria||'General') + ' · ' + fmt(p.precio) + '</div></div>'
      + '<div class="row-stock"><button class="mini-btn" onclick="chgStock(' + p.id + ',-1)">−</button>'
      + '<span class="' + (p.stock<=0?'stock-zero':'') + '">' + p.stock + '</span>'
      + '<button class="mini-btn" onclick="chgStock(' + p.id + ',1)">+</button></div>'
      + '<button class="mini-btn" onclick="openEditProducto(' + p.id + ')">✏️</button>'
      + '</div>';
  }
  return h + '</div>';
}

function chgStock(id, d){
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id){
    DB.productos[j].stock = Math.max(0, DB.productos[j].stock + d);
  }
  saveAll(); renderApp();
}

function openNuevoProducto(){
  var h = '<h3 class="modal-title">Nuevo producto</h3>'
    + '<label class="lbl">Nombre</label><input id="npNombre" class="input" placeholder="Nombre del producto">'
    + '<label class="lbl">Precio</label><input id="npPrecio" class="input" type="number" inputmode="numeric" placeholder="0">'
    + '<label class="lbl">Stock</label><input id="npStock" class="input" type="number" inputmode="numeric" value="1">'
    + '<label class="lbl">Categoría</label><input id="npCat" class="input" placeholder="General">'
    + '<label class="lbl">Emoji (opcional)</label><input id="npEmoji" class="input" placeholder="📦" maxlength="4">'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>'
    + '<button class="btn btn-accent" onclick="saveNuevoProducto()">Guardar</button></div>';
  openModal(h);
}

function saveNuevoProducto(){
  var nombre = ($('#npNombre').value || '').trim();
  var precio = parseFloat($('#npPrecio').value) || 0;
  if(!nombre || precio <= 0){ toast('Nombre y precio son obligatorios', 'warn'); return; }
  var maxId = 0;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id > maxId) maxId = DB.productos[j].id;
  DB.productos.push({ id: maxId+1, nombre: nombre, precio: precio, stock: parseInt($('#npStock').value,10)||0, categoria: ($('#npCat').value||'General').trim(), emoji: ($('#npEmoji').value||'📦').trim() });
  saveAll(); closeModal(); toast('Producto agregado'); renderApp();
}

function openEditProducto(id){
  var p = null;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id) p = DB.productos[j];
  if(!p) return;
  var h = '<h3 class="modal-title">Editar producto</h3>'
    + '<label class="lbl">Nombre</label><input id="epNombre" class="input" value="' + esc(p.nombre) + '">'
    + '<label class="lbl">Precio</label><input id="epPrecio" class="input" type="number" value="' + p.precio + '">'
    + '<label class="lbl">Categoría</label><input id="epCat" class="input" value="' + esc(p.categoria||'General') + '">'
    + '<label class="lbl">Emoji</label><input id="epEmoji" class="input" value="' + esc(p.emoji||'') + '" maxlength="4">'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="deleteProducto(' + p.id + ')">🗑 Eliminar</button>'
    + '<button class="btn btn-accent" onclick="saveEditProducto(' + p.id + ')">Guardar</button></div>';
  openModal(h);
}

function saveEditProducto(id){
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id){
    DB.productos[j].nombre = ($('#epNombre').value || DB.productos[j].nombre).trim();
    DB.productos[j].precio = parseFloat($('#epPrecio').value) || DB.productos[j].precio;
    DB.productos[j].categoria = ($('#epCat').value || 'General').trim();
    DB.productos[j].emoji = ($('#epEmoji').value || '📦').trim();
  }
  saveAll(); closeModal(); toast('Producto actualizado'); renderApp();
}

function deleteProducto(id){
  if(!confirm('¿Eliminar este producto?')) return;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id){ DB.productos.splice(j,1); break; }
  saveAll(); closeModal(); toast('Producto eliminado'); renderApp();
}

/* ---------------- DEUDAS ---------------- */
function renderDeudas(){
  var activas = 0, porCobrar = 0;
  for(var i=0;i<DB.deudas.length;i++){
    var d = DB.deudas[i];
    if(d.pagadas < d.cuotas){ activas++; porCobrar += (d.cuotas - d.pagadas) * d.montoCuota; }
  }
  var h = '<div class="stat-grid">'
    + '<div class="stat"><div class="stat-num">' + activas + '</div><div class="stat-lbl">Deudas activas</div></div>'
    + '<div class="stat"><div class="stat-num">' + fmt(porCobrar) + '</div><div class="stat-lbl">Por cobrar</div></div>'
    + '</div>';
  if(DB.deudas.length === 0) return h + '<div class="empty">Sin deudas registradas.<br>Las ventas a cuotas aparecen aquí.</div>';

  h += '<div class="list">';
  for(var k=DB.deudas.length-1;k>=0;k--){
    var dd = DB.deudas[k];
    var pct = Math.round((dd.pagadas/dd.cuotas)*100);
    var fin = dd.pagadas >= dd.cuotas;
    h += '<div class="deuda-card' + (fin?' deuda-fin':'') + '">'
      + '<div class="deuda-head"><strong>' + esc(dd.cliente) + '</strong><span>' + fmt(dd.total) + '</span></div>'
      + '<div class="deuda-sub">' + esc(dd.fecha) + ' · cuota ' + fmt(dd.montoCuota) + '</div>'
      + '<div class="progress"><div class="progress-fill" style="width:' + pct + '%"></div></div>'
      + '<div class="deuda-sub">' + dd.pagadas + '/' + dd.cuotas + ' cuotas pagadas</div>'
      + (fin ? '<span class="badge badge-green">Pagada ✓</span>'
             : '<div class="deuda-btns"><button class="btn btn-primary btn-sm" onclick="pagarCuota(\\'' + dd.id + '\\')">💵 Pagar cuota</button>'
             + '<button class="btn btn-ghost btn-sm" onclick="verDeuda(\\'' + dd.id + '\\')">Detalle</button></div>')
      + '</div>';
  }
  return h + '</div>';
}

function pagarCuota(id){
  for(var i=0;i<DB.deudas.length;i++){
    if(DB.deudas[i].id === id){
      var d = DB.deudas[i];
      d.pagadas++;
      d.historial.push({ fecha: ahora(), monto: d.montoCuota });
      saveAll();
      toast(d.pagadas >= d.cuotas ? '🎉 Deuda pagada completa' : 'Cuota ' + d.pagadas + '/' + d.cuotas + ' registrada');
      renderApp();
      return;
    }
  }
}

function verDeuda(id){
  for(var i=0;i<DB.deudas.length;i++){
    if(DB.deudas[i].id === id){
      var d = DB.deudas[i];
      var h = '<h3 class="modal-title">' + esc(d.cliente) + '</h3>'
        + '<div class="deuda-sub">Total ' + fmt(d.total) + ' · ' + d.cuotas + ' cuotas de ' + fmt(d.montoCuota) + '</div>'
        + '<h4 class="lbl">Productos</h4><div class="modal-lines">';
      for(var j=0;j<d.items.length;j++) h += '<div class="line"><span>' + esc(d.items[j].nombre) + ' ×' + d.items[j].cant + '</span><strong>' + fmt(d.items[j].precio*d.items[j].cant) + '</strong></div>';
      h += '</div><h4 class="lbl">Historial de pagos</h4><div class="modal-lines">';
      if(d.historial.length === 0) h += '<div class="hint">Sin pagos aún</div>';
      for(var k=0;k<d.historial.length;k++) h += '<div class="line"><span>' + esc(d.historial[k].fecha) + '</span><strong>' + fmt(d.historial[k].monto) + '</strong></div>';
      h += '</div><div class="modal-actions"><button class="btn btn-ghost" onclick="borrarDeuda(\\'' + d.id + '\\')">🗑 Eliminar</button>'
        + '<button class="btn btn-accent" onclick="closeModal()">Cerrar</button></div>';
      openModal(h);
      return;
    }
  }
}

function borrarDeuda(id){
  if(!confirm('¿Eliminar esta deuda?')) return;
  for(var i=0;i<DB.deudas.length;i++) if(DB.deudas[i].id === id){ DB.deudas.splice(i,1); break; }
  saveAll(); closeModal(); toast('Deuda eliminada'); renderApp();
}

/* ---------------- REPORTES ---------------- */
function renderReportes(){
  var hoyDia = hoy();
  var ventasHoy = 0, ingHoy = 0, ingTotal = 0;
  var conteo = {};
  for(var i=0;i<DB.ventas.length;i++){
    var v = DB.ventas[i];
    ingTotal += v.total;
    if(v.dia === hoyDia){ ventasHoy++; ingHoy += v.total; }
    for(var j=0;j<v.items.length;j++){
      var n = v.items[j].nombre;
      conteo[n] = (conteo[n]||0) + v.items[j].cant;
    }
  }
  var agot = 0;
  for(var k=0;k<DB.productos.length;k++) if(DB.productos[k].stock <= 0) agot++;

  var h = '<div class="stat-grid">'
    + '<div class="stat"><div class="stat-num">' + ventasHoy + '</div><div class="stat-lbl">Ventas hoy</div></div>'
    + '<div class="stat"><div class="stat-num">' + fmt(ingHoy) + '</div><div class="stat-lbl">Ingresos hoy</div></div>'
    + '<div class="stat"><div class="stat-num">' + fmt(ingTotal) + '</div><div class="stat-lbl">Ingresos total</div></div>'
    + '<div class="stat ' + (agot>0?'stat-red':'') + '"><div class="stat-num">' + agot + '</div><div class="stat-lbl">Agotados</div></div>'
    + '</div>';

  var top = Object.keys(conteo).sort(function(a,b){ return conteo[b]-conteo[a]; }).slice(0,5);
  h += '<h3 class="section-title">🏆 Más vendidos</h3><div class="list">';
  if(top.length === 0) h += '<div class="empty">Aún no hay ventas</div>';
  for(var t=0;t<top.length;t++) h += '<div class="list-row"><span class="row-emoji">' + (t===0?'🥇':t===1?'🥈':t===2?'🥉':'▫️') + '</span><div class="row-main"><div class="row-name">' + esc(top[t]) + '</div></div><strong>' + conteo[top[t]] + ' un.</strong></div>';
  h += '</div>';

  h += '<h3 class="section-title">🧾 Ventas de hoy</h3><div class="list">';
  var hay = false;
  for(var x=DB.ventas.length-1;x>=0;x--){
    if(DB.ventas[x].dia !== hoyDia) continue;
    hay = true;
    var vv = DB.ventas[x];
    h += '<div class="list-row"><span class="row-emoji">' + (vv.cuotas>1?'💳':'💵') + '</span>'
      + '<div class="row-main"><div class="row-name">' + esc(vv.fecha) + '</div>'
      + '<div class="row-sub">' + vv.items.length + ' ítem(s)' + (vv.cliente ? ' · ' + esc(vv.cliente) + ' · ' + vv.cuotas + ' cuotas' : '') + '</div></div>'
      + '<strong>' + fmt(vv.total) + '</strong></div>';
  }
  if(!hay) h += '<div class="empty">Sin ventas hoy</div>';
  return h + '</div>';
}
`;
}

function part3(): string {
  return `
/* ============================================================
   SECCIONES CATÁLOGO / MENÚ / CARRITO WHATSAPP
   ============================================================ */

function renderCatalogo(){
  var prods = productosVisibles();
  var h = '<div class="search-box"><input id="buscador" class="input" type="search" placeholder="Buscar en el catálogo..."></div>';
  h += catChips();
  h += '<div class="prod-grid">';
  for(var i=0;i<prods.length;i++){
    var p = prods[i];
    h += '<div class="prod-card" onclick="openProducto(' + p.id + ')">'
      + '<div class="prod-emoji">' + esc(p.emoji || '🛍️') + '</div>'
      + '<div class="prod-name">' + esc(p.nombre) + '</div>'
      + '<div class="prod-price">' + fmt(p.precio) + '</div>'
      + '</div>';
  }
  if(prods.length === 0) h += '<div class="empty">Sin resultados</div>';
  return h + '</div>';
}

function openProducto(id){
  var p = null;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id) p = DB.productos[j];
  if(!p) return;
  var h = '<div class="detalle-emoji">' + esc(p.emoji || '🛍️') + '</div>'
    + '<h3 class="modal-title">' + esc(p.nombre) + '</h3>'
    + '<div class="deuda-sub">' + esc(p.categoria || '') + '</div>'
    + (p.descripcion ? '<p class="detalle-desc">' + esc(p.descripcion) + '</p>' : '')
    + '<div class="detalle-precio">' + fmt(p.precio) + '</div>'
    + '<label class="lbl">Cantidad</label>'
    + '<div class="qty-row"><button class="mini-btn" onclick="var q=$(\\'#detQty\\');q.value=Math.max(1,(parseInt(q.value,10)||1)-1)">−</button>'
    + '<input id="detQty" class="input qty-input" type="number" value="1" min="1">'
    + '<button class="mini-btn" onclick="var q=$(\\'#detQty\\');q.value=(parseInt(q.value,10)||1)+1">+</button></div>'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cerrar</button>'
    + '<button class="btn btn-accent" onclick="addToCartQty(' + p.id + ', parseInt($(\\'#detQty\\').value,10)||1)">🛒 Agregar al pedido</button></div>';
  openModal(h);
}

function addToCartQty(id, qty){
  qty = Math.max(1, qty || 1);
  var p = null;
  for(var i=0;i<DB.productos.length;i++) if(DB.productos[i].id === id) p = DB.productos[i];
  if(!p) return;
  var line = null;
  for(var j=0;j<DB.carrito.length;j++) if(DB.carrito[j].id === id) line = DB.carrito[j];
  if(line) line.cant += qty;
  else DB.carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, cant: qty, emoji: p.emoji });
  saveAll();
  closeModal();
  toast('Agregado: ' + p.nombre + ' ×' + qty);
  renderApp();
}

function renderMenu(){
  var prods = productosVisibles();
  var h = catChips();
  h += '<div class="list">';
  for(var i=0;i<prods.length;i++){
    var p = prods[i];
    h += '<div class="list-row">'
      + '<span class="row-emoji">' + esc(p.emoji || '🍽️') + '</span>'
      + '<div class="row-main"><div class="row-name">' + esc(p.nombre) + '</div>'
      + (p.descripcion ? '<div class="row-sub">' + esc(p.descripcion) + '</div>' : '')
      + '<div class="prod-price">' + fmt(p.precio) + '</div></div>'
      + '<button class="btn btn-primary btn-sm" onclick="addToCartQty(' + p.id + ',1)">+ Agregar</button>'
      + '</div>';
  }
  if(prods.length === 0) h += '<div class="empty">Sin ítems en esta categoría</div>';
  h += '</div>';
  var cnt = 0, total = 0;
  for(var j=0;j<DB.carrito.length;j++){ cnt += DB.carrito[j].cant; total += DB.carrito[j].cant * DB.carrito[j].precio; }
  if(cnt > 0){
    h += '<div class="cart-bar" onclick="showSection(\\'carrito\\')">'
      + '<span>🛒 ' + cnt + ' ítem' + (cnt>1?'s':'') + '</span>'
      + '<strong>' + fmt(total) + '</strong>'
      + '<button class="btn btn-accent">Ver pedido →</button></div>';
  }
  return h;
}

function renderCarrito(){
  if(DB.carrito.length === 0){
    return '<div class="empty">Tu pedido está vacío.<br>Agrega productos desde ' + (APP_CONFIG.template==='menu'?'el menú':'el catálogo') + '.</div>';
  }
  var total = cartTotal();
  var h = '<div class="list">';
  for(var j=0;j<DB.carrito.length;j++){
    var l = DB.carrito[j];
    h += '<div class="list-row">'
      + '<span class="row-emoji">' + esc(l.emoji||'🛒') + '</span>'
      + '<div class="row-main"><div class="row-name">' + esc(l.nombre) + '</div>'
      + '<div class="row-sub">' + fmt(l.precio) + ' c/u</div></div>'
      + '<div class="row-stock"><button class="mini-btn" onclick="changeQty(' + l.id + ',-1)">−</button>'
      + '<span>' + l.cant + '</span>'
      + '<button class="mini-btn" onclick="changeQty(' + l.id + ',1)">+</button></div>'
      + '<strong>' + fmt(l.precio*l.cant) + '</strong></div>';
  }
  h += '</div><div class="total-row"><span>Total</span><strong>' + fmt(total) + '</strong></div>';
  h += '<label class="lbl">Tu nombre</label><input id="pedidoNombre" class="input" placeholder="¿A nombre de quién?">';
  if(APP_CONFIG.template === 'menu'){
    h += '<label class="lbl">Tipo de pedido</label><select id="pedidoTipo" class="input">'
      + '<option value="Retiro en local">Retiro en local</option>'
      + '<option value="Delivery">Delivery</option>'
      + '<option value="Mesa">Para mesa</option></select>';
  }
  h += '<label class="lbl">Notas (opcional)</label><textarea id="pedidoNotas" class="input" rows="2" placeholder="Sin cebolla, con extra palta..."></textarea>'
    + '<div class="modal-actions" style="margin-top:14px">'
    + '<button class="btn btn-ghost" onclick="clearCart()">Vaciar</button>'
    + '<button class="btn btn-accent" onclick="sendPedido()">📲 Enviar por WhatsApp</button></div>';
  return h;
}

function sendPedido(){
  if(!APP_CONFIG.whatsapp){ toast('Este negocio no configuró WhatsApp', 'warn'); return; }
  var nombre = ($('#pedidoNombre') ? $('#pedidoNombre').value : '').trim();
  var notas = ($('#pedidoNotas') ? $('#pedidoNotas').value : '').trim();
  var tipo = ($('#pedidoTipo') ? $('#pedidoTipo').value : '');
  var msg = 'Hola ' + APP_CONFIG.businessName + '! Quiero hacer un pedido:\\n\\n';
  for(var j=0;j<DB.carrito.length;j++){
    var l = DB.carrito[j];
    msg += '• ' + l.cant + '× ' + l.nombre + ' — ' + fmt(l.precio*l.cant) + '\\n';
  }
  msg += '\\nTotal: ' + fmt(cartTotal());
  if(tipo) msg += '\\nTipo: ' + tipo;
  if(nombre) msg += '\\nNombre: ' + nombre;
  if(notas) msg += '\\nNotas: ' + notas;
  window.open('https://wa.me/' + APP_CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
  DB.carrito = [];
  saveAll();
  toast('Pedido enviado por WhatsApp');
  renderApp();
}

/* ============================================================
   SECCIONES RESERVAS
   ============================================================ */

function renderServicios(){
  var h = '<div class="prod-grid">';
  for(var i=0;i<DB.productos.length;i++){
    var p = DB.productos[i];
    h += '<div class="prod-card">'
      + '<div class="prod-emoji">' + esc(p.emoji || '✨') + '</div>'
      + '<div class="prod-name">' + esc(p.nombre) + '</div>'
      + (p.descripcion ? '<div class="row-sub">' + esc(p.descripcion) + '</div>' : '')
      + '<div class="prod-price">' + fmt(p.precio) + '</div>'
      + '<button class="btn btn-primary btn-sm" onclick="openReserva(' + p.id + ')">Reservar hora</button>'
      + '</div>';
  }
  return h + '</div>';
}

function openReserva(id){
  var p = null;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === id) p = DB.productos[j];
  if(!p) return;
  var h = '<h3 class="modal-title">' + esc(p.emoji||'') + ' ' + esc(p.nombre) + '</h3>'
    + '<div class="deuda-sub">' + fmt(p.precio) + (p.descripcion ? ' · ' + esc(p.descripcion) : '') + '</div>'
    + '<label class="lbl">Tu nombre</label><input id="resNombre" class="input" placeholder="Nombre y apellido">'
    + '<label class="lbl">Tu WhatsApp (opcional)</label><input id="resFono" class="input" type="tel" placeholder="569...">'
    + '<label class="lbl">Fecha</label><input id="resFecha" class="input" type="date" min="' + hoy() + '" value="' + hoy() + '">'
    + '<label class="lbl">Hora</label><select id="resHora" class="input">';
  for(var hh=9; hh<=20; hh++){
    h += '<option value="' + hh + ':00">' + hh + ':00</option>';
    if(hh < 20) h += '<option value="' + hh + ':30">' + hh + ':30</option>';
  }
  h += '</select>'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>'
    + '<button class="btn btn-accent" onclick="saveReserva(' + p.id + ')">✓ Confirmar reserva</button></div>';
  openModal(h);
}

function saveReserva(servicioId){
  var p = null;
  for(var j=0;j<DB.productos.length;j++) if(DB.productos[j].id === servicioId) p = DB.productos[j];
  if(!p) return;
  var nombre = ($('#resNombre').value || '').trim();
  var fono = ($('#resFono').value || '').replace(/[^0-9]/g, '');
  var fecha = $('#resFecha').value;
  var hora = $('#resHora').value;
  if(!nombre){ toast('Ingresa tu nombre', 'warn'); return; }
  if(!fecha){ toast('Elige una fecha', 'warn'); return; }
  var res = { id: uid(), cliente: nombre, telefono: fono, servicio: p.nombre, precio: p.precio, fecha: fecha, hora: hora, estado: 'pendiente', creada: ahora() };
  DB.reservas.push(res);
  saveAll();

  var h = '<div class="detalle-emoji">✅</div><h3 class="modal-title">¡Reserva lista!</h3>'
    + '<p class="detalle-desc">' + esc(res.servicio) + '<br>' + esc(res.fecha) + ' a las ' + esc(res.hora) + '<br>a nombre de ' + esc(res.cliente) + '</p>'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal();showSection(\\'reservas\\')">Ver mis reservas</button>';
  if(APP_CONFIG.whatsapp){
    var msg = 'Hola ' + APP_CONFIG.businessName + '! Confirmo mi reserva:\\n\\n• ' + res.servicio + '\\n• ' + res.fecha + ' a las ' + res.hora + '\\n• Nombre: ' + res.cliente;
    h += '<a class="btn btn-accent" target="_blank" href="https://wa.me/' + APP_CONFIG.whatsapp + '?text=' + encodeURIComponent(msg) + '">📲 Avisar por WhatsApp</a>';
  }
  h += '</div>';
  openModal(h);
}

function renderReservas(){
  if(DB.reservas.length === 0){
    return '<div class="empty">Sin reservas aún.<br>Agenda una hora desde Servicios.</div>';
  }
  var ord = DB.reservas.slice().sort(function(a,b){
    var ka = a.fecha + ' ' + a.hora, kb = b.fecha + ' ' + b.hora;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  var h = '<div class="list">';
  for(var i=0;i<ord.length;i++){
    var r = ord[i];
    var badge = r.estado === 'confirmada' ? '<span class="badge badge-green">Confirmada</span>'
      : r.estado === 'cancelada' ? '<span class="badge">Cancelada</span>'
      : '<span class="badge badge-yellow">Pendiente</span>';
    h += '<div class="deuda-card">'
      + '<div class="deuda-head"><strong>' + esc(r.servicio) + '</strong>' + badge + '</div>'
      + '<div class="deuda-sub">👤 ' + esc(r.cliente) + '</div>'
      + '<div class="deuda-sub">📅 ' + esc(r.fecha) + ' · ⏰ ' + esc(r.hora) + '</div>'
      + '<div class="deuda-sub">💰 ' + fmt(r.precio) + '</div>'
      + '<div class="deuda-btns">';
    if(r.estado === 'pendiente') h += '<button class="btn btn-primary btn-sm" onclick="setReserva(\\'' + r.id + '\\',\\'confirmada\\')">✓ Confirmar</button>';
    if(r.estado !== 'cancelada') h += '<button class="btn btn-ghost btn-sm" onclick="setReserva(\\'' + r.id + '\\',\\'cancelada\\')">Cancelar</button>';
    if(r.telefono){
      var msg = 'Hola ' + r.cliente + '! Te recordamos tu reserva en ' + APP_CONFIG.businessName + ': ' + r.servicio + ' el ' + r.fecha + ' a las ' + r.hora + '.';
      h += '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + r.telefono + '?text=' + encodeURIComponent(msg) + '">📲 Recordar</a>';
    }
    h += '<button class="btn btn-ghost btn-sm" onclick="borrarReserva(\\'' + r.id + '\\')">🗑</button>'
      + '</div></div>';
  }
  return h + '</div>';
}

function setReserva(id, estado){
  for(var i=0;i<DB.reservas.length;i++) if(DB.reservas[i].id === id){ DB.reservas[i].estado = estado; break; }
  saveAll(); toast('Reserva ' + estado); renderApp();
}

function borrarReserva(id){
  if(!confirm('¿Eliminar esta reserva?')) return;
  for(var i=0;i<DB.reservas.length;i++) if(DB.reservas[i].id === id){ DB.reservas.splice(i,1); break; }
  saveAll(); toast('Reserva eliminada'); renderApp();
}

/* ============================================================
   CONFIGURACIÓN / RESPALDO
   ============================================================ */

function renderConfig(){
  var h = '<div class="deuda-card">'
    + '<div class="deuda-head"><strong>' + esc(APP_CONFIG.emoji) + ' ' + esc(APP_CONFIG.businessName) + '</strong></div>'
    + '<div class="deuda-sub">' + esc(APP_CONFIG.tagline) + '</div>'
    + '<div class="deuda-sub">📱 ' + esc(APP_CONFIG.whatsapp || 'Sin WhatsApp') + (APP_CONFIG.city ? ' · 📍 ' + esc(APP_CONFIG.city) : '') + '</div>'
    + '<div class="deuda-btns"><button class="btn btn-primary btn-sm" onclick="openEditConfig()">✏️ Editar datos</button></div>'
    + '</div>';

  h += '<h3 class="section-title">💾 Respaldo de datos</h3>'
    + '<div class="deuda-btns" style="flex-direction:column;align-items:stretch;gap:8px">'
    + '<button class="btn btn-primary btn-block" onclick="exportData()">⬇️ Descargar respaldo (JSON)</button>'
    + '<label class="btn btn-ghost btn-block" style="text-align:center">⬆️ Restaurar respaldo<input type="file" accept=".json" style="display:none" onchange="importData(event)"></label>'
    + '<button class="btn btn-ghost btn-block" onclick="resetProductos()">↩️ Restablecer productos de fábrica</button>'
    + '<button class="btn btn-ghost btn-block" style="color:#f87171" onclick="wipeData()">🗑 Borrar TODOS los datos</button>'
    + '</div>'
    + '<div class="footer-note">Hecha con 🏭 Fábrica de Apps</div>';
  return h;
}

function openEditConfig(){
  var h = '<h3 class="modal-title">Datos del negocio</h3>'
    + '<label class="lbl">Nombre</label><input id="cfNombre" class="input" value="' + esc(APP_CONFIG.businessName) + '">'
    + '<label class="lbl">Eslogan</label><input id="cfTagline" class="input" value="' + esc(APP_CONFIG.tagline) + '">'
    + '<label class="lbl">WhatsApp (con código país)</label><input id="cfWhatsapp" class="input" value="' + esc(APP_CONFIG.whatsapp) + '" placeholder="56912345678">'
    + '<label class="lbl">Ciudad</label><input id="cfCity" class="input" value="' + esc(APP_CONFIG.city) + '">'
    + '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>'
    + '<button class="btn btn-accent" onclick="saveConfig()">Guardar</button></div>';
  openModal(h);
}

function saveConfig(){
  var over = {
    businessName: ($('#cfNombre').value || APP_CONFIG.businessName).trim(),
    tagline: ($('#cfTagline').value || '').trim(),
    whatsapp: ($('#cfWhatsapp').value || '').replace(/[^0-9]/g, ''),
    city: ($('#cfCity').value || '').trim()
  };
  APP_CONFIG.businessName = over.businessName;
  APP_CONFIG.tagline = over.tagline;
  APP_CONFIG.whatsapp = over.whatsapp;
  APP_CONFIG.city = over.city;
  saveKey('config_override', over);
  closeModal(); toast('Datos actualizados'); renderApp();
}

function exportData(){
  var data = { productos: DB.productos, ventas: DB.ventas, deudas: DB.deudas, reservas: DB.reservas, exportado: ahora() };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'respaldo_' + hoy() + '.json';
  a.click();
  toast('Respaldo descargado');
}

function importData(ev){
  var f = ev.target.files[0];
  if(!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try{
      var data = JSON.parse(rd.result);
      if(data.productos) DB.productos = data.productos;
      if(data.ventas) DB.ventas = data.ventas;
      if(data.deudas) DB.deudas = data.deudas;
      if(data.reservas) DB.reservas = data.reservas;
      saveAll(); toast('Datos restaurados'); renderApp();
    }catch(e){ toast('Archivo inválido', 'warn'); }
  };
  rd.readAsText(f);
}

function resetProductos(){
  if(!confirm('¿Volver a los productos iniciales? Se pierden los cambios de inventario.')) return;
  DB.productos = PRODUCTOS_INICIALES.slice();
  saveAll(); toast('Productos restablecidos'); renderApp();
}

function wipeData(){
  if(!confirm('⚠️ ¿Borrar TODOS los datos de la app? Esta acción no se puede deshacer.')) return;
  var keys = ['productos','ventas','deudas','reservas','carrito','config_override'];
  for(var i=0;i<keys.length;i++) localStorage.removeItem(APP_CONFIG.storagePrefix + keys[i]);
  location.reload();
}

/* ============================================================
   ARRANQUE
   ============================================================ */

function init(){
  var over = loadKey('config_override', null);
  if(over){
    if(over.businessName) APP_CONFIG.businessName = over.businessName;
    if(over.tagline !== undefined) APP_CONFIG.tagline = over.tagline;
    if(over.whatsapp !== undefined) APP_CONFIG.whatsapp = over.whatsapp;
    if(over.city !== undefined) APP_CONFIG.city = over.city;
  }
  if(!localStorage.getItem(APP_CONFIG.storagePrefix + 'productos') && window.fetch){
    fetch('productos.json').then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(data){
      if(data && data.length){ DB.productos = data; saveAll(); renderApp(); }
    }).catch(function(){ /* sin servidor o file:// → usa productos embebidos */ });
  }
  renderApp();
  if('serviceWorker' in navigator && location.protocol.indexOf('http') === 0){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
`;
}

// ============================================================
// API pública del motor
// ============================================================
export function buildAppJs(config: BusinessConfig, productos: ProductItem[], template: TemplateId): string {
  return part1(config, productos, template) + part2() + part3();
}
