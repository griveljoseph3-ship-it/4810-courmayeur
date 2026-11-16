import { site, DAYS, isTbc } from './data';
import { absolute, type Lang, type PageKey } from './routes';

const SITE = site.brand.siteUrl;
const DAY_NAME: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

function address(key: keyof typeof site.places) {
  const p: any = site.places[key];
  const a: any = { '@type': 'PostalAddress', addressLocality: p.city, postalCode: p.zip, addressRegion: p.region, addressCountry: p.country };
  if (!isTbc(p.street)) a.streetAddress = p.street;
  return a;
}
function geo(key: keyof typeof site.places) {
  const p: any = site.places[key];
  return p.geo ? { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng } : undefined;
}
/** Orari solo se certi (niente dati [DA CONFERMARE] a Google). */
function hours(serviceKey: keyof typeof site.services) {
  const s: any = site.services[serviceKey];
  if (s.tbc || s.highSeasonOnly) return undefined;
  const h = s.hours?.all;
  if (!h) return undefined;
  const out: any[] = [];
  for (const d of DAYS) {
    const slots = (h[d] ?? h.all) as [string, string][] | undefined;
    if (!slots) continue;
    for (const [o, c] of slots) {
      if (isTbc(o) || isTbc(c)) return undefined;
      out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAME[d], opens: o, closes: c });
    }
  }
  return out.length ? out : undefined;
}
const org = { '@type': 'Organization', '@id': `${SITE}/#org`, name: site.brand.name, legalName: site.brand.legalName, vatID: `IT${site.brand.vat}`, url: SITE + '/', logo: `${SITE}/logo-4810.png`, sameAs: [site.social.facebook, site.social.instagram] };

export function businesses(lang: Lang, which: string[]) {
  const all: Record<string, any> = {
    rental: {
      '@type': ['SportingGoodsStore', 'LocalBusiness'], '@id': `${SITE}/#rental`, name: '4810 Rental',
      description: 'Noleggio sci, snowboard, scialpinismo ed e-bike a 100 m dalla telecabina di Dolonne.',
      url: absolute('rental', lang, SITE), telephone: site.places.dolonne.phone, email: site.services.rental.email,
      address: address('dolonne'), geo: geo('dolonne'), parentOrganization: { '@id': `${SITE}/#org` },
      potentialAction: { '@type': 'RentAction', target: site.booking.rentalOnline },
    },
    shop: {
      '@type': 'SportingGoodsStore', '@id': `${SITE}/#shop`, name: '4810 Shopping',
      url: absolute('shop', lang, SITE), telephone: site.places.centro.phone, email: site.services.shop.email,
      address: address('centro'), geo: geo('centro'), openingHoursSpecification: hours('shop'), parentOrganization: { '@id': `${SITE}/#org` },
    },
    outlet: {
      '@type': 'OutletStore', '@id': `${SITE}/#outlet`, name: '4810 Outlet',
      url: absolute('outlet', lang, SITE), telephone: site.places.outlet.phone, address: address('outlet'), geo: geo('outlet'),
      parentOrganization: { '@id': `${SITE}/#org` },
    },
    restaurant: {
      '@type': 'Restaurant', '@id': `${SITE}/#restaurant`, name: '4810 We Are Food',
      url: absolute('restaurant', lang, SITE), telephone: site.places.dolonne.phone, email: site.services.food.email,
      address: address('dolonne'), geo: geo('dolonne'), servesCuisine: ['Valdostana', 'Italiana', 'Cucina di montagna'],
      hasMenu: SITE + site.menus.restaurant.file, acceptsReservations: true,
      priceRange: '€€', parentOrganization: { '@id': `${SITE}/#org` },
      potentialAction: { '@type': 'ReserveAction', target: site.booking.lunch },
    },
    bakery: {
      '@type': 'Bakery', '@id': `${SITE}/#bakery`, name: '4810 Sweet Bakery',
      url: absolute('bakery', lang, SITE), telephone: site.places.dolonne.phone, email: site.services.bakery.email,
      address: address('dolonne'), geo: geo('dolonne'), parentOrganization: { '@id': `${SITE}/#org` },
    },
  };
  const graph = [org, ...which.map((w) => all[w])].map((x) => JSON.parse(JSON.stringify(x)));
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}

export const LD_FOR: Partial<Record<PageKey, string[]>> = {
  home: ['rental', 'shop', 'outlet', 'restaurant', 'bakery'],
  rental: ['rental'],
  shop: ['shop'],
  outlet: ['outlet'],
  restaurant: ['restaurant'],
  bakery: ['bakery'],
  contact: ['rental', 'shop', 'outlet', 'restaurant', 'bakery'],
};
