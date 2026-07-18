import { useRef, useState } from 'react';
import type { ProductItem, TemplateId } from '@/types';
import { DEFAULT_PRODUCTS } from '@/generator/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Sparkles, ClipboardPaste, FileUp } from 'lucide-react';

interface Props {
  productos: ProductItem[];
  onChange: (p: ProductItem[]) => void;
  template: TemplateId;
}

// ---------- Parser inteligente Excel / CSV / texto ----------
const HEADER_MAP: Record<string, keyof ColMap> = {
  nombre: 'nombre', producto: 'nombre', name: 'nombre', item: 'nombre', servicio: 'nombre', plato: 'nombre',
  precio: 'precio', price: 'precio', valor: 'precio', costo: 'precio',
  stock: 'stock', cantidad: 'stock', unidades: 'stock', inventario: 'stock',
  emoji: 'emoji', icono: 'emoji',
  categoria: 'categoria', categoría: 'categoria', tipo: 'categoria', rubro: 'categoria',
  imagen: 'imagen', foto: 'imagen', url: 'imagen', img: 'imagen', image: 'imagen', link: 'imagen',
};

interface ColMap {
  nombre: number; precio: number; stock: number; emoji: number; categoria: number; imagen: number;
}

function parsePrice(raw: string): number {
  // "$66.500" / "66,500" / "66500" → 66500 (pesos enteros, formato LatAm)
  return Math.round(Number((raw || '').replace(/[^0-9]/g, '')) || 0);
}

export function parseProductText(text: string, defaultStock: number): Omit<ProductItem, 'id'>[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const first = lines[0];
  const delim = first.includes('\t') ? '\t' : first.includes(';') ? ';' : first.includes('|') ? '|' : ',';
  const rows = lines.map((l) => l.split(delim).map((c) => c.trim().replace(/^["']+|["']+$/g, '')));

  // ¿Tiene fila de encabezado?
  const cols: ColMap = { nombre: 0, precio: 1, stock: 2, emoji: 3, categoria: 4, imagen: 5 };
  let start = 0;
  const headRow = rows[0].map((c) => c.toLowerCase());
  const found = headRow.map((h) => HEADER_MAP[h] ?? HEADER_MAP[Object.keys(HEADER_MAP).find((k) => h.includes(k)) ?? '']);
  if (found.some(Boolean)) {
    // con encabezado: solo existen las columnas detectadas por nombre
    (Object.keys(cols) as (keyof ColMap)[]).forEach((k) => { cols[k] = -1; });
    found.forEach((key, i) => {
      if (key) cols[key] = i;
    });
    start = 1;
  }
  const cell = (r: string[], idx: number) => (idx >= 0 ? r[idx] : undefined);

  const out: Omit<ProductItem, 'id'>[] = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const nombre = cell(r, cols.nombre) || '';
    if (!nombre || /^https?:\/\//i.test(nombre)) continue;
    let imagen = cell(r, cols.imagen) || '';
    // Rescate: cualquier columna que sea URL → es la foto
    if (!/^https?:\/\//i.test(imagen)) {
      const urlCol = r.find((c) => /^https?:\/\/\S+\.(jpe?g|png|webp|gif)/i.test(c) || /^https?:\/\//i.test(c));
      imagen = urlCol && urlCol !== nombre ? urlCol : '';
    }
    const rawStock = cell(r, cols.stock);
    out.push({
      nombre,
      precio: parsePrice(cell(r, cols.precio) || ''),
      stock: rawStock !== undefined && rawStock !== '' ? Math.round(Number(rawStock.replace(/[^0-9-]/g, '')) || 0) : defaultStock,
      categoria: cell(r, cols.categoria) || 'General',
      emoji: cell(r, cols.emoji) || '📦',
      imagen: imagen || undefined,
    });
  }
  return out;
}

export default function StepProducts({ productos, onChange, template }: Props) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [mensaje, setMensaje] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const defaultStock = template === 'pos' ? 1 : 99;

  const update = (id: number, patch: Partial<ProductItem>) => {
    onChange(productos.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const remove = (id: number) => onChange(productos.filter((p) => p.id !== id));

  const add = () => {
    const maxId = productos.reduce((m, p) => Math.max(m, p.id), 0);
    onChange([
      ...productos,
      { id: maxId + 1, nombre: '', precio: 0, stock: defaultStock, categoria: 'General', emoji: '📦' },
    ]);
  };

  const importItems = (items: Omit<ProductItem, 'id'>[]) => {
    if (items.length === 0) {
      setMensaje('⚠️ No detecté productos — revisa el formato');
      return;
    }
    let maxId = productos.reduce((m, p) => Math.max(m, p.id), 0);
    onChange([...productos, ...items.map((it) => ({ ...it, id: ++maxId }))]);
    setMensaje(`✅ ${items.length} ítems importados`);
    setPasteText('');
    setPasteMode(false);
  };

  const importPaste = () => importItems(parseProductText(pasteText, defaultStock));

  const importFile = (file: File | undefined) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => importItems(parseProductText(String(rd.result || ''), defaultStock));
    rd.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
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
        <div className="flex gap-2 flex-wrap">
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
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="border-slate-700">
            <FileUp className="w-4 h-4 mr-1" /> Subir CSV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.tsv,.txt"
            className="hidden"
            onChange={(e) => importFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {mensaje && <p className="text-sm font-medium text-teal-300">{mensaje}</p>}

      {pasteMode && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          <p className="text-xs text-slate-400">
            Pega directo <strong className="text-slate-200">desde Excel</strong> (selecciona las celdas, copia y pega
            aquí) o usa cualquiera de estos formatos por línea:
            <br />
            <code className="text-teal-300">Nombre | precio | stock | emoji</code>
            {'  ·  '}
            <code className="text-teal-300">Nombre,precio,stock</code>
            <br />
            Si tu lista tiene encabezados (nombre, precio, foto...) los detecto solos, incluida la columna de imagen.
          </p>
          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={6}
            placeholder={'Dior Sauvage 100ml | 72000 | 8 | 🌊\nChanel N°5 100ml | 95000 | 3 | 🎀\no pega tu tabla de Excel aquí...'}
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
            className="grid grid-cols-[44px_1fr_88px_70px_36px] sm:grid-cols-[52px_1fr_100px_80px_1fr_110px_40px] gap-2 items-center rounded-xl border border-slate-800 bg-slate-900/60 p-2"
          >
            <Input
              value={p.emoji}
              onChange={(e) => update(p.id, { emoji: e.target.value })}
              className="h-9 text-center bg-slate-950 border-slate-700 px-1"
              maxLength={4}
              title="Emoji"
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
              value={p.imagen || ''}
              onChange={(e) => update(p.id, { imagen: e.target.value || undefined })}
              placeholder="URL foto (https://...)"
              className="h-9 bg-slate-950 border-slate-700 hidden sm:block"
              title="URL de la foto del producto"
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
