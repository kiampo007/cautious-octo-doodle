import { useState } from 'react';
import type { BusinessConfig, ProductItem, TemplateId } from '@/types';
import { TEMPLATES, DEFAULT_PRODUCTS } from '@/generator/templates';
import StepTemplate from '@/sections/StepTemplate';
import StepCustomize from '@/sections/StepCustomize';
import StepProducts from '@/sections/StepProducts';
import StepPreview from '@/sections/StepPreview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Factory } from 'lucide-react';

const EMOJI_DEFAULT: Record<TemplateId, string> = {
  pos: '🧾',
  catalogo: '🛍️',
  menu: '🍽️',
  reservas: '📅',
};

const STEPS = ['Plantilla', 'Tu marca', 'Productos', 'Tu app'];

export default function App() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [warning, setWarning] = useState('');

  const [config, setConfig] = useState<BusinessConfig>({
    template: 'pos',
    businessName: '',
    tagline: '',
    whatsapp: '',
    city: '',
    currencySymbol: '$',
    locale: 'es-CL',
    colorPrimary: '#0d9488',
    colorAccent: '#f59e0b',
    colorBg: '#0b1220',
    colorSurface: '#111a2e',
    emoji: '🧾',
  });

  const [productos, setProductos] = useState<ProductItem[]>(
    DEFAULT_PRODUCTS.pos.map((p) => ({ ...p }))
  );

  const selectTemplate = (t: TemplateId) => {
    const meta = TEMPLATES.find((m) => m.id === t);
    setConfig((c) => ({
      ...c,
      template: t,
      emoji: EMOJI_DEFAULT[t],
      colorPrimary: meta?.colorDemo ?? c.colorPrimary,
    }));
    setProductos(DEFAULT_PRODUCTS[t].map((p) => ({ ...p })));
  };

  const goTo = (n: number) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => {
    if (step === 1 && !config.businessName.trim()) {
      setWarning('Ponle un nombre a tu negocio para continuar ✍️');
      return;
    }
    setWarning('');
    if (step === 1) setConfig((c) => ({ ...c, businessName: c.businessName.trim() }));
    goTo(Math.min(step + 1, 3));
  };

  const back = () => {
    setWarning('');
    goTo(Math.max(step - 1, 0));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Factory className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="font-extrabold leading-none">Fábrica de Apps</div>
            <div className="text-[11px] text-slate-400">de idea a app en 4 pasos</div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-1 sm:gap-2">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            const reachable = i <= maxStep;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => reachable && goTo(i)}
                  className={cn(
                    'flex items-center gap-2 group',
                    reachable ? 'cursor-pointer' : 'cursor-default opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors',
                      active
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : done
                          ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                          : 'border-slate-700 text-slate-500'
                    )}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold hidden sm:block',
                      active ? 'text-teal-300' : 'text-slate-400'
                    )}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-px mx-2', i < step ? 'bg-teal-500/60' : 'bg-slate-800')} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
        {step === 0 && <StepTemplate selected={config.template} onSelect={selectTemplate} />}
        {step === 1 && <StepCustomize config={config} onChange={setConfig} />}
        {step === 2 && <StepProducts productos={productos} onChange={setProductos} template={config.template} />}
        {step === 3 && <StepPreview config={config} productos={productos} />}
      </main>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={back}
            disabled={step === 0}
            className="border-slate-700 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
          </Button>
          <p className="text-xs text-amber-400 font-medium text-center flex-1">{warning}</p>
          {step < 3 ? (
            <Button onClick={next} className="bg-teal-600 hover:bg-teal-500 font-bold">
              {step === 2 ? 'Generar mi app ✨' : 'Continuar'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => goTo(0)} variant="outline" className="border-slate-700 text-slate-300">
              🏭 Crear otra app
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
