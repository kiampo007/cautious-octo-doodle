import type { BusinessConfig } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MONEDAS = [
  { label: '🇨🇱 Chile — $ (66.500)', symbol: '$', locale: 'es-CL' },
  { label: '🇲🇽 México — $ (1,299)', symbol: '$', locale: 'es-MX' },
  { label: '🇦🇷 Argentina — $ (1.299)', symbol: '$', locale: 'es-AR' },
  { label: '🇨🇴 Colombia — $ (1.299)', symbol: '$', locale: 'es-CO' },
  { label: '🇵🇪 Perú — S/ (1,299)', symbol: 'S/', locale: 'es-PE' },
  { label: '🇺🇸 Dólar — US$ (1,299)', symbol: 'US$', locale: 'en-US' },
  { label: '🇪🇺 Euro — € (1.299)', symbol: '€', locale: 'es-ES' },
];

const PALETAS = [
  { nombre: 'Turquesa', primary: '#0d9488', accent: '#f59e0b', bg: '#0b1220', surface: '#111a2e' },
  { nombre: 'Violeta', primary: '#7c3aed', accent: '#f59e0b', bg: '#0f0a1e', surface: '#1a1030' },
  { nombre: 'Naranja', primary: '#ea580c', accent: '#0ea5e9', bg: '#140c06', surface: '#221408' },
  { nombre: 'Océano', primary: '#2563eb', accent: '#22d3ee', bg: '#081020', surface: '#0e1a33' },
  { nombre: 'Rosa', primary: '#db2777', accent: '#fbbf24', bg: '#160810', surface: '#241020' },
  { nombre: 'Bosque', primary: '#16a34a', accent: '#f59e0b', bg: '#08120c', surface: '#10231a' },
];

const EMOJIS = ['🌸', '🧴', '🛍️', '🍽️', '🧋', '✂️', '💅', '📱', '👕', '🐾', '☕', '📚'];

interface Props {
  config: BusinessConfig;
  onChange: (c: BusinessConfig) => void;
}

export default function StepCustomize({ config, onChange }: Props) {
  const set = (patch: Partial<BusinessConfig>) => onChange({ ...config, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Tu marca</h2>
        <p className="text-sm text-slate-400">Estos datos aparecen en toda la app generada.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bn">Nombre del negocio *</Label>
          <Input
            id="bn"
            value={config.businessName}
            onChange={(e) => set({ businessName: e.target.value })}
            placeholder="Ej: Dulces Aromas"
            className="bg-slate-900 border-slate-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tg">Eslogan</Label>
          <Input
            id="tg"
            value={config.tagline}
            onChange={(e) => set({ tagline: e.target.value })}
            placeholder="Ej: Perfumes originales en Arica"
            className="bg-slate-900 border-slate-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wa">WhatsApp (con código de país)</Label>
          <Input
            id="wa"
            value={config.whatsapp}
            onChange={(e) => set({ whatsapp: e.target.value })}
            placeholder="56912345678"
            className="bg-slate-900 border-slate-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ci">Ciudad</Label>
          <Input
            id="ci"
            value={config.city}
            onChange={(e) => set({ city: e.target.value })}
            placeholder="Arica"
            className="bg-slate-900 border-slate-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Moneda</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MONEDAS.map((m) => {
            const active = config.locale === m.locale && config.currencySymbol === m.symbol;
            return (
              <button
                key={m.label}
                onClick={() => set({ currencySymbol: m.symbol, locale: m.locale })}
                className={cn(
                  'text-left text-sm px-3 py-2.5 rounded-xl border transition-colors',
                  active
                    ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Emoji de tu marca</Label>
        <div className="flex flex-wrap gap-2 items-center">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => set({ emoji: e })}
              className={cn(
                'w-10 h-10 rounded-xl text-xl border transition-all',
                config.emoji === e
                  ? 'border-teal-400 bg-teal-400/15 scale-110'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-500'
              )}
            >
              {e}
            </button>
          ))}
          <Input
            value={config.emoji}
            onChange={(e) => set({ emoji: e.target.value })}
            className="w-16 bg-slate-900 border-slate-700 text-center text-xl"
            maxLength={4}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Colores de la app</Label>
        <div className="flex flex-wrap gap-2">
          {PALETAS.map((p) => (
            <button
              key={p.nombre}
              onClick={() =>
                set({ colorPrimary: p.primary, colorAccent: p.accent, colorBg: p.bg, colorSurface: p.surface })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:border-slate-500 text-sm"
            >
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full border border-black/30" style={{ background: p.primary }} />
                <span className="w-4 h-4 rounded-full border border-black/30" style={{ background: p.accent }} />
              </span>
              {p.nombre}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {(
            [
              ['Primario', 'colorPrimary'],
              ['Acento', 'colorAccent'],
              ['Fondo', 'colorBg'],
              ['Tarjetas', 'colorSurface'],
            ] as const
          ).map(([lbl, key]) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 cursor-pointer"
            >
              <input
                type="color"
                value={config[key]}
                onChange={(e) => set({ [key]: e.target.value } as Partial<BusinessConfig>)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-xs text-slate-300">{lbl}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
