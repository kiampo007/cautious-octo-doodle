import type { TemplateId, TemplateMeta, ProductItem } from '@/types';

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'pos',
    nombre: 'POS de Ventas',
    descripcion: 'Punto de venta completo: carrito, vueltos, cuotas, inventario con agotados, deudas y reportes.',
    icono: '🧾',
    features: ['Venta con vuelto', 'Cuotas 1-12 meses', 'Inventario + agotados', 'Deudas de clientes', 'Reportes del día'],
    colorDemo: '#0d9488',
  },
  {
    id: 'catalogo',
    nombre: 'Catálogo Digital',
    descripcion: 'Vitrina online con buscador, detalle de producto y pedidos directos por WhatsApp.',
    icono: '🛍️',
    features: ['Grid con fotos/emoji', 'Buscador instantáneo', 'Ficha de producto', 'Pedido por WhatsApp', 'Categorías'],
    colorDemo: '#7c3aed',
  },
  {
    id: 'menu',
    nombre: 'Menú Restaurante',
    descripcion: 'Carta digital por categorías con carrito y envío del pedido a WhatsApp del local.',
    icono: '🍽️',
    features: ['Categorías de platos', 'Carrito de pedido', 'Mesa o delivery', 'Pedido por WhatsApp', 'Notas del cliente'],
    colorDemo: '#ea580c',
  },
  {
    id: 'reservas',
    nombre: 'Reservas y Turnos',
    descripcion: 'Agenda de servicios con reserva de hora, lista de citas y confirmación por WhatsApp.',
    icono: '📅',
    features: ['Servicios con duración', 'Selector fecha/hora', 'Lista de reservas', 'Estados: pendiente/confirmada', 'Recordatorio WhatsApp'],
    colorDemo: '#2563eb',
  },
];

export const DEFAULT_PRODUCTS: Record<TemplateId, ProductItem[]> = {
  pos: [
    { id: 1, nombre: 'Lancôme Trésor EDP 100ml', precio: 66500, stock: 5, categoria: 'Perfumes Mujer', emoji: '🌸', descripcion: 'Eau de parfum floral' },
    { id: 2, nombre: 'Carolina Herrera 212 VIP 100ml', precio: 58990, stock: 3, categoria: 'Perfumes Hombre', emoji: '🖤', descripcion: 'Aroma especiado' },
    { id: 3, nombre: 'Paco Rabanne 1 Million 100ml', precio: 62500, stock: 0, categoria: 'Perfumes Hombre', emoji: '✨', descripcion: 'Amaderado especiado' },
    { id: 4, nombre: 'Dior Sauvage EDT 100ml', precio: 72000, stock: 8, categoria: 'Perfumes Hombre', emoji: '🌊', descripcion: 'Fresco intenso' },
    { id: 5, nombre: 'Chanel Coco Mademoiselle 100ml', precio: 95000, stock: 2, categoria: 'Perfumes Mujer', emoji: '🎀', descripcion: 'Oriental floral' },
    { id: 6, nombre: 'Versace Eros EDT 100ml', precio: 54000, stock: 6, categoria: 'Perfumes Hombre', emoji: '💚', descripcion: 'Menta y vainilla' },
  ],
  catalogo: [
    { id: 1, nombre: 'Polera Oversize Negra', precio: 12990, stock: 15, categoria: 'Ropa', emoji: '👕', descripcion: 'Algodón premium, tallas S-XL' },
    { id: 2, nombre: 'Jeans Skinny Azul', precio: 19990, stock: 10, categoria: 'Ropa', emoji: '👖', descripcion: 'Denim stretch' },
    { id: 3, nombre: 'Zapatillas Urbanas', precio: 34990, stock: 7, categoria: 'Calzado', emoji: '👟', descripcion: 'Suela antideslizante' },
    { id: 4, nombre: 'Gorro Tejido', precio: 7990, stock: 20, categoria: 'Accesorios', emoji: '🧢', descripcion: 'Lana suave' },
    { id: 5, nombre: 'Mochila Minimalista', precio: 24990, stock: 4, categoria: 'Accesorios', emoji: '🎒', descripcion: 'Impermeable 20L' },
    { id: 6, nombre: 'Chaqueta Denim', precio: 29990, stock: 0, categoria: 'Ropa', emoji: '🧥', descripcion: 'Calce clásico' },
  ],
  menu: [
    { id: 1, nombre: 'Completo Italiano', precio: 2500, stock: 99, categoria: 'Completos', emoji: '🌭', descripcion: 'Palta, tomate, mayo casera' },
    { id: 2, nombre: 'Chorrillana 2 personas', precio: 8990, stock: 99, categoria: 'Para compartir', emoji: '🍟', descripcion: 'Papas, carne, huevo, cebolla' },
    { id: 3, nombre: 'Empanada de Pino', precio: 2200, stock: 99, categoria: 'Empanadas', emoji: '🥟', descripcion: 'Horno de barro' },
    { id: 4, nombre: 'Bubble Tea Taro 500ml', precio: 3900, stock: 99, categoria: 'Bebidas', emoji: '🧋', descripcion: 'Con perlas de tapioca' },
    { id: 5, nombre: 'Papas Fritas Grandes', precio: 3500, stock: 99, categoria: 'Para compartir', emoji: '🍟', descripcion: 'Corte rústico' },
    { id: 6, nombre: 'Jugo Natural Frambuesa', precio: 2800, stock: 99, categoria: 'Bebidas', emoji: '🥤', descripcion: 'Sin azúcar añadida' },
  ],
  reservas: [
    { id: 1, nombre: 'Corte de Pelo', precio: 10000, stock: 1, categoria: 'Peluquería', emoji: '✂️', descripcion: '45 minutos' },
    { id: 2, nombre: 'Coloración Completa', precio: 35000, stock: 1, categoria: 'Peluquería', emoji: '🎨', descripcion: '2 horas, incluye lavado' },
    { id: 3, nombre: 'Manicure Gel', precio: 15000, stock: 1, categoria: 'Uñas', emoji: '💅', descripcion: '60 minutos' },
    { id: 4, nombre: 'Pedicure Spa', precio: 18000, stock: 1, categoria: 'Uñas', emoji: '🦶', descripcion: '60 minutos' },
    { id: 5, nombre: 'Limpieza Facial', precio: 25000, stock: 1, categoria: 'Estética', emoji: '🧖', descripcion: '75 minutos' },
    { id: 6, nombre: 'Masaje Relajante', precio: 28000, stock: 1, categoria: 'Estética', emoji: '💆', descripcion: '60 minutos' },
  ],
};

export const TEMPLATE_SECTIONS: Record<TemplateId, { sections: string[]; features: Record<string, boolean> }> = {
  pos: {
    sections: ['venta', 'inventario', 'deudas', 'reportes', 'config'],
    features: { stock: true, cuotas: true, whatsappCheckout: false, reservas: false, carrito: true, buscador: true },
  },
  catalogo: {
    sections: ['catalogo', 'carrito', 'config'],
    features: { stock: false, cuotas: false, whatsappCheckout: true, reservas: false, carrito: true, buscador: true },
  },
  menu: {
    sections: ['menu', 'carrito', 'config'],
    features: { stock: false, cuotas: false, whatsappCheckout: true, reservas: false, carrito: true, buscador: false },
  },
  reservas: {
    sections: ['servicios', 'reservas', 'config'],
    features: { stock: false, cuotas: false, whatsappCheckout: true, reservas: true, carrito: false, buscador: false },
  },
};
