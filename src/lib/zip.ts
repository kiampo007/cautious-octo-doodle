import JSZip from 'jszip';
import type { GeneratedFile } from '@/types';
import { slugify } from '@/generator';

export async function downloadZip(files: GeneratedFile[], businessName: string): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(slugify(businessName)) ?? zip;
  for (const f of files) {
    folder.file(f.path, f.content);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = slugify(businessName) + '.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
