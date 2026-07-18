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
  {
    id: 'tienda',
    nombre: 'Tienda Online + Local',
    descripcion: 'Vende por WhatsApp con catálogo online y cobra en tu local con POS, inventario y reportes.',
    icono: '🏪',
    features: ['Catálogo con fotos', 'Pedido WhatsApp o venta local', 'Inventario + agotados', 'Reportes del día', 'Descuentos'],
    colorDemo: '#059669',
  },
  {
    id: 'delivery',
    nombre: 'Delivery / Comida',
    descripcion: 'Carta digital con pedidos a domicilio: dirección de entrega y pedido directo al WhatsApp.',
    icono: '🛵',
    features: ['Carta con fotos', 'Dirección de entrega', 'Pedido por WhatsApp', 'Notas de cocina', 'Categorías'],
    colorDemo: '#dc2626',
  },
  {
    id: 'barberia',
    nombre: 'Barbería / Salón',
    descripcion: 'Reserva de horas online + caja para cobrar servicios y productos el mismo día.',
    icono: '💈',
    features: ['Reserva de horas', 'Cobro en caja', 'Recordatorio WhatsApp', 'Servicios y productos', 'Reportes'],
    colorDemo: '#1d4ed8',
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
  tienda: [
    { id: 1, nombre: 'Polera Oversize Negra', precio: 12990, stock: 15, categoria: 'Ropa', emoji: '👕', descripcion: 'Algodón premium, tallas S-XL' },
    { id: 2, nombre: 'Jeans Skinny Azul', precio: 19990, stock: 10, categoria: 'Ropa', emoji: '👖', descripcion: 'Denim stretch' },
    { id: 3, nombre: 'Zapatillas Urbanas', precio: 34990, stock: 7, categoria: 'Calzado', emoji: '👟', descripcion: 'Suela antideslizante' },
    { id: 4, nombre: 'Gorro Tejido', precio: 7990, stock: 20, categoria: 'Accesorios', emoji: '🧢', descripcion: 'Lana suave' },
    { id: 5, nombre: 'Mochila Minimalista', precio: 24990, stock: 4, categoria: 'Accesorios', emoji: '🎒', descripcion: 'Impermeable 20L' },
    { id: 6, nombre: 'Chaqueta Denim', precio: 29990, stock: 0, categoria: 'Ropa', emoji: '🧥', descripcion: 'Calce clásico' },
  ],
  delivery: [
    { id: 1, nombre: 'Hamburguesa Clásica', precio: 5990, stock: 99, categoria: 'Burgers', emoji: '🍔', descripcion: 'Carne 150g, queso, tomate, papas' },
    { id: 2, nombre: 'Churrasco Italiano', precio: 6500, stock: 99, categoria: 'Sandwiches', emoji: '🥪', descripcion: 'Palta, tomate, mayo casera' },
    { id: 3, nombre: 'Pizza Familiar', precio: 9990, stock: 99, categoria: 'Pizzas', emoji: '🍕', descripcion: '8 porciones, 2 ingredientes' },
    { id: 4, nombre: 'Papas Fritas Grandes', precio: 3500, stock: 99, categoria: 'Acompañamientos', emoji: '🍟', descripcion: 'Corte rústico' },
    { id: 5, nombre: 'Bebida 1.5L', precio: 2500, stock: 99, categoria: 'Bebidas', emoji: '🥤', descripcion: 'Variedades' },
    { id: 6, nombre: 'Empanada de Pino', precio: 2200, stock: 99, categoria: 'Sandwiches', emoji: '🥟', descripcion: 'Horno de barro' },
  ],
  barberia: [
    { id: 1, nombre: 'Corte Clásico', precio: 10000, stock: 1, categoria: 'Cortes', emoji: '✂️', descripcion: '45 minutos' },
    { id: 2, nombre: 'Corte + Barba', precio: 14000, stock: 1, categoria: 'Cortes', emoji: '💈', descripcion: '60 minutos' },
    { id: 3, nombre: 'Fade / Diseño', precio: 12000, stock: 1, categoria: 'Cortes', emoji: '💇', descripcion: '50 minutos' },
    { id: 4, nombre: 'Tintura de Barba', precio: 8000, stock: 1, categoria: 'Barba', emoji: '🎨', descripcion: '30 minutos' },
    { id: 5, nombre: 'Pomada Matte', precio: 9000, stock: 8, categoria: 'Productos', emoji: '🧴', descripcion: 'Fijación fuerte' },
    { id: 6, nombre: 'Aceite de Barba', precio: 7500, stock: 5, categoria: 'Productos', emoji: '🧴', descripcion: '30ml, aroma sándalo' },
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
  tienda: {
    sections: ['catalogo', 'venta', 'inventario', 'reportes', 'config'],
    features: { stock: true, cuotas: false, whatsappCheckout: true, reservas: false, carrito: true, buscador: true },
  },
  delivery: {
    sections: ['menu', 'carrito', 'config'],
    features: { stock: false, cuotas: false, whatsappCheckout: true, delivery: true, reservas: false, carrito: true, buscador: false },
  },
  barberia: {
    sections: ['servicios', 'reservas', 'venta', 'config'],
    features: { stock: false, cuotas: false, whatsappCheckout: true, reservas: true, carrito: true, buscador: false },
  },
};
