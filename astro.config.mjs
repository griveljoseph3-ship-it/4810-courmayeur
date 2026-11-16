import { defineConfig } from 'astro/config';

// Vecchi indirizzi del sito WordPress -> nuovi indirizzi puliti (301 lato server: vedi public/_redirects e docs/DEPLOY.md)
const legacy = {
  '/rental-2': '/noleggio/',
  '/ski-rental': '/noleggio/',
  '/noleggio-attrezzature': '/noleggio/',
  '/noleggia-la-tua-bici': '/noleggio/#e-bike',
  '/shopping-2': '/negozio/',
  '/outlet-2': '/outlet/',
  '/food': '/ristorante/',
  '/food/monte-bianco': '/ristorante/',
  '/sweet-bakery': '/pasticceria/',
  '/collaborazioni': '/hotel-convenzionati/',
  '/marchi': '/brand/',
  '/family-2': '/famiglia/',
  '/boot-fitting': '/servizi/#boot-fitting',
  '/eventi-aziendali-o-feste-private': '/eventi/',
  '/credits': '/',
  '/home-prova': '/',
  '/privacy-policy': 'https://www.iubenda.com/privacy-policy/66853220',
};

const B = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const redirects = Object.fromEntries(Object.entries(legacy).map(([k, v]) => [k, v.startsWith('http') ? v : B + v]));

export default defineConfig({
  site: process.env.SITE_URL || 'https://4810courmayeur.it',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always', assets: '_astro' },
  redirects,
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  compressHTML: true,
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: { build: { cssMinify: true } },
});
