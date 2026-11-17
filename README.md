# 4810 Courmayeur — sito web

Sito statico (Astro) di 4810 Courmayeur: noleggio, negozio, outlet, ristorante, pasticceria e chalet della famiglia Grivel.

## Dove si modificano i contenuti
| Cosa | File |
|---|---|
| **Orari, indirizzi, telefoni, email, link di prenotazione, menu PDF, offerte** (unica fonte: cambia ovunque) | `src/data/site.json` |
| Hotel convenzionati | `src/data/hotels.json` |
| Recensioni (solo testi reali, non modificare) | `src/data/reviews.json` |
| Testi in italiano / inglese / francese | `src/i18n/it.json`, `en.json`, `fr.json` |
| Foto | `src/assets/img/` (vengono convertite automaticamente in AVIF/WebP) |
| Menu PDF | `public/menu/` (poi aggiornare il percorso in `site.json`) |

Il valore `"TBC"` in `site.json` mostra **[DA CONFERMARE]** sul sito. Elenco completo: `docs/DA-CONFERMARE.md`.

## Comandi
```bash
npm install
npm run dev      # anteprima locale
npm run build    # sito pronto in dist/
```

## Indirizzi
- Italiano `/`, inglese `/en/`, francese `/fr/` — tabella in `src/lib/routes.ts`.
- I vecchi indirizzi WordPress (`/rental-2/`, `/shopping-2/`, ...) rimandano alle pagine nuove.
- Dominio unico `https://4810courmayeur.it/`: redirect pronti in `public/_redirects` (Netlify/Cloudflare) e `public/.htaccess` (Apache).

## Design
Design system, temi per attività e regole foto: `docs/DESIGN.md`.

## Note tecniche
- Effetti: GSAP ScrollTrigger + Lenis caricati solo su dispositivi capaci; con "riduci movimento" o connessione lenta resta la versione statica.
- Cookie: iubenda (siteId 1530480, policy 66853220) con Google Consent Mode v2. GA4 si attiva inserendo l'ID in `site.json`.
- Dati strutturati: Organization, SportingGoodsStore, OutletStore, Restaurant, Bakery, BreadcrumbList. Gli orari incerti non vengono inviati a Google.
