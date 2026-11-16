import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.jpg', { eager: true });
const brands = import.meta.glob<{ default: ImageMetadata }>('../assets/brands/*.jpg', { eager: true });

export function img(name: string): ImageMetadata {
  const m = files[`../assets/img/${name}.jpg`];
  if (!m) throw new Error(`Immagine mancante: ${name}`);
  return m.default;
}
export function brandImg(file: string): ImageMetadata {
  const m = brands[`../assets/brands/${file}`];
  if (!m) throw new Error(`Logo mancante: ${file}`);
  return m.default;
}
