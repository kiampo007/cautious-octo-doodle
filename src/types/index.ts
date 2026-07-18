export type TemplateId = 'pos' | 'catalogo' | 'menu' | 'reservas' | 'tienda' | 'delivery' | 'barberia';

export interface ProductItem {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  emoji: string;
  descripcion?: string;
  imagen?: string;
}

export interface BusinessConfig {
  template: TemplateId;
  businessName: string;
  tagline: string;
  whatsapp: string;
  city: string;
  currencySymbol: string;
  locale: string;
  colorPrimary: string;
  colorAccent: string;
  colorBg: string;
  colorSurface: string;
  emoji: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface TemplateMeta {
  id: TemplateId;
  nombre: string;
  descripcion: string;
  icono: string;
  features: string[];
  colorDemo: string;
}
