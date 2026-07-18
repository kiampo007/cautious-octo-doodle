import { useMemo, useState } from 'react';
import type { BusinessConfig, ProductItem } from '@/types';
import { generateApp, buildPreviewHtml, slugify } from '@/generator';
import { downloadZip } from '@/lib/zip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Smartphone, Monitor, Download, FileCode2, Rocket } from 'lucide-react';

interface Props {
  config: BusinessConfig;
  productos: ProductItem[];
}

export default function StepPreview({ config, productos }: Props) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [downloading, setDownloading] = useState(false);

  const files = useMemo(() => generateApp(config, productos), [config, productos]);
  const previewHtml = useMemo(() => buildPreviewHtml(config, productos), [config, productos]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadZip(files, config.businessName);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Tu app está lista 🎉</h2>
          <p className="text-sm text-slate-400">Prueba la app aquí mismo — funciona de verdad.</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">
          <button
            onClick={() => setDevice('mobile')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors',
              device === 'mobile' ? 'bg-teal-600 text-white' : 'text-slate-400'
            )}
          >
            <Smartphone className="w-4 h-4" /> Celular
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors',
              device === 'desktop' ? 'bg-teal-600 text-white' : 'text-slate-400'
            )}
          >
            <Monitor className="w-4 h-4" /> PC
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ---- Vista previa real ---- */}
        <div className="flex justify-center flex-1 min-w-0">
          <div
            className={cn(
              'rounded-[28px] border-4 border-slate-700 bg-black overflow-hidden shadow-2xl transition-all',
              device === 'mobile' ? 'w-[375px] max-w-full' : 'w-full'
            )}
          >
            <iframe
              key={previewHtml.length}
              title="Vista previa de tu app"
              sandbox="allow-scripts allow-modals allow-popups allow-forms allow-same-origin"
              srcDoc={previewHtml}
              className="w-full bg-slate-950"
              style={{ height: device === 'mobile' ? 620 : 560, border: 0 }}
            />
          </div>
        </div>

        {/* ---- Panel de entrega ---- */}
        <div className="lg:w-[340px] space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-teal-400" /> Archivos generados
            </h3>
            <div className="space-y-1 text-sm">
              {files.map((f) => (
                <div key={f.path} className="flex justify-between text-slate-300">
                  <span className="font-mono text-xs">{f.path}</span>
                  <span className="text-xs text-slate-500">{(new Blob([f.content]).size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Generando ZIP...' : `Descargar ${slugify(config.businessName)}.zip`}
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-2">
            <h3 className="font-bold flex items-center gap-2">
              <Rocket className="w-4 h-4 text-teal-400" /> Publicarla en internet
            </h3>
            <ol className="text-sm text-slate-300 space-y-1.5 list-decimal list-inside">
              <li>Descomprime el ZIP</li>
              <li>
                Sube los archivos a un repo en <span className="text-teal-300">GitHub</span>
              </li>
              <li>
                En <span className="text-teal-300">Vercel</span>: Add New Project → importa el repo → Deploy
              </li>
              <li>Comparte tu link y agrégala a tu pantalla de inicio 📲</li>
            </ol>
            <p className="text-xs text-slate-500 pt-1">
              También funciona con doble clic en index.html, sin internet ni instalación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
