import { TEMPLATES } from '@/generator/templates';
import type { TemplateId } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  selected: TemplateId;
  onSelect: (t: TemplateId) => void;
}

export default function StepTemplate({ selected, onSelect }: Props) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 pt-4">
        <div className="text-6xl">🏭</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Fábrica de <span className="text-teal-400">Apps</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Elige una plantilla, personalízala con tu marca y descarga una app
          completa y funcional — con la misma estructura de un POS profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={cn(
                'text-left rounded-2xl border p-5 transition-all duration-150 bg-slate-900/60 hover:border-slate-500 active:scale-[0.98]',
                active ? 'border-teal-400 ring-2 ring-teal-400/30' : 'border-slate-700'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: t.colorDemo + '26' }}
                >
                  {t.icono}
                </span>
                <div>
                  <div className="font-bold text-slate-100">{t.nombre}</div>
                  {active && <div className="text-xs text-teal-400 font-semibold">✓ Seleccionada</div>}
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{t.descripcion}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.features.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
