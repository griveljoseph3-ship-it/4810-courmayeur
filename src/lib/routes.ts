export const LOCALES = ['it', 'en', 'fr'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'it';

export const HTML_LANG: Record<Lang, string> = { it: 'it-IT', en: 'en-GB', fr: 'fr-FR' };
export const OG_LOCALE: Record<Lang, string> = { it: 'it_IT', en: 'en_GB', fr: 'fr_FR' };

/** Indirizzi di pagina puliti, per lingua. Chiave = id della pagina. */
export const ROUTES = {
  home: { it: '', en: 'en/', fr: 'fr/' },
  rental: { it: 'noleggio/', en: 'en/ski-rental/', fr: 'fr/location-ski/' },
  shop: { it: 'negozio/', en: 'en/shop/', fr: 'fr/boutique/' },
  outlet: { it: 'outlet/', en: 'en/outlet/', fr: 'fr/outlet/' },
  restaurant: { it: 'ristorante/', en: 'en/restaurant/', fr: 'fr/restaurant/' },
  bakery: { it: 'pasticceria/', en: 'en/bakery/', fr: 'fr/patisserie/' },
  chalet: { it: 'chalet/', en: 'en/chalet/', fr: 'fr/chalet/' },
  offers: { it: 'offerte/', en: 'en/offers/', fr: 'fr/offres/' },
  hotels: { it: 'hotel-convenzionati/', en: 'en/partner-hotels/', fr: 'fr/hotels-partenaires/' },
  services: { it: 'servizi/', en: 'en/services/', fr: 'fr/services/' },
  events: { it: 'eventi/', en: 'en/events/', fr: 'fr/evenements/' },
  brands: { it: 'brand/', en: 'en/brands/', fr: 'fr/marques/' },
  family: { it: 'famiglia/', en: 'en/our-family/', fr: 'fr/famille/' },
  faq: { it: 'faq/', en: 'en/faq/', fr: 'fr/faq/' },
  contact: { it: 'contatti/', en: 'en/contact/', fr: 'fr/contact/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof ROUTES;

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

/** Percorso interno (rispetta il base path del deploy). */
export function href(key: PageKey, lang: Lang, hash = ''): string {
  return BASE + ROUTES[key][lang] + (hash ? `#${hash}` : '');
}

/** Percorso statico (es. /menu/x.pdf) con base path. */
export function asset(path: string): string {
  return BASE + path.replace(/^\//, '');
}

/** URL assoluto canonico (sempre dominio principale). */
export function absolute(key: PageKey, lang: Lang, site: string): string {
  return site.replace(/\/$/, '') + '/' + ROUTES[key][lang];
}
