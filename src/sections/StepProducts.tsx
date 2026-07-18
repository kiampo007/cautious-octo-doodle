import { useState } from 'react';
import type { ProductItem, TemplateId } from '@/types';
import { DEFAULT_PRODUCTS } from '@/generator/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Sparkles, ClipboardPaste } from 'lucide-react';

interface Props {
  productos: ProductItem[];
  onChange: (p: ProductItem[]) => void;
  template: TemplateId;
}

export default function StepProducts({ productos, onChange, template }: Props) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const update = (id: number, patch: Partial<ProductItem>) => {
    onChange(productos.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const remove = (id: number) => onChange(productos.filter((p) => p.id !== id));

  const add = () => {
    const maxId = productos.reduce((m, p) => Math.max(m, p.id), 0);
    onChange([
      ...productos,
      { id: maxId + 1, nombre: '', precio: 0, stock: template === 'pos' ? 1 : 99, categoria: 'General', emoji: '📦' },
    ]);
  };

  const importPaste = () => {
    const lines = pasteText.split('\n').map((l) => l.trim()).filter(Boolean);
    const items: ProductItem[] = [];
    let maxId = productos.reduce((m, p) => Math.max(m, p.id), 0);
    for (const line of lines) {
      const parts = line.split('|').map((s) => s.trim());
      if (!parts[0]) continue;
      items.push({
        id: ++maxId,
        nombre: parts[0],
        precio: Math.round(Number(parts[1]) || 0),
        stock: Math.round(Number(parts[2]) || (template === 'pos' ? 1 : 99)),
        categoria: parts[4] || 'General',
        emoji: parts[3] || '📦',
      });
    }
    if (items.length > 0) {
      onChange([...productos, ...items]);
      setPasteText('');
      setPasteMode(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">
            {template === 'reservas' ? 'Tus servicios' : template === 'menu' ? 'Tu carta' : 'Tus productos'}
          </h2>
          <p className="text-sm text-slate-400">
            {productos.length} ítems — puedes editarlos aquí o después dentro de la app.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(DEFAULT_PRODUCTS[template].map((p) => ({ ...p })))}
            className="border-slate-700"
          >
            <Sparkles className="w-4 h-4 mr-1" /> Ejemplos
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPasteMode(!pasteMode)} className="border-slate-700">
            <ClipboardPaste className="w-4 h-4 mr-1" /> Pegar lista
          </Button>
        </div>
      </div>

      {pasteMode && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          <p className="text-xs text-slate-400">
            Un ítem por línea, formato: <code className="text-teal-300">Nombre | precio | stock | emoji</code>
            <br />
            Ej: <code className="text-teal-300">Dior Sauvage 100ml | 72000 | 8 | 🌊</code>
          </p>
          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            placeholder={'Producto 1 | 10000 | 5 | 🌸\nProducto 2 | 15000 | 3 | 🌺'}
            className="bg-slate-950 border-slate-700 font-mono text-sm"
          />
          <Button onClick={importPaste} size="sm" className="bg-teal-600 hover:bg-teal-500">
            Importar líneas
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {productos.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[44px_1fr_88px_70px_36px] sm:grid-cols-[52px_1fr_110px_90px_120px_40px] gap-2 items-center rounded-xl border border-slate-800 bg-slate-900/60 p-2"
          >
            <Input
              value={p.emoji}
              onChange={(e) => update(p.id, { emoji: e.target.value })}
              className="h-9 text-center bg-slate-950 border-slate-700 px-1"
              maxLength={4}
            />
            <Input
              value={p.nombre}
              onChange={(e) => update(p.id, { nombre: e.target.value })}
              placeholder="Nombre"
              className="h-9 bg-slate-950 border-slate-700"
            />
            <Input
              type="number"
              value={p.precio || ''}
              onChange={(e) => update(p.id, { precio: Math.round(Number(e.target.value) || 0) })}
              placeholder="Precio"
              className="h-9 bg-slate-950 border-slate-700"
            />
            <Input
              type="number"
              value={p.stock}
              onChange={(e) => update(p.id, { stock: Math.round(Number(e.target.value) || 0) })}
              placeholder="Stock"
              className="h-9 bg-slate-950 border-slate-700"
            />
            <Input
              value={p.categoria}
              onChange={(e) => update(p.id, { categoria: e.target.value })}
              placeholder="Categoría"
              className="h-9 bg-slate-950 border-slate-700 hidden sm:block"
            />
            <button
              onClick={() => remove(p.id)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={add} variant="outline" className="w-full border-dashed border-slate-600 text-slate-300">
        <Plus className="w-4 h-4 mr-2" /> Agregar ítem
      </Button>
    </div>
  );
}
