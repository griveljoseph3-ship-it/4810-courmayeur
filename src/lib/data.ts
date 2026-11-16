import site from '../data/site.json';
import type { Lang } from './routes';
import { dict } from '../i18n';

export { site };

export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export type Day = (typeof DAYS)[number];
/** Ordine di visualizzazione (lunedì per primo). */
export const WEEK: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

type Slot = [string, string];
type Week = Partial<Record<Day | 'all', Slot[]>>;

export const TBC = '[DA CONFERMARE]';
export const isTbc = (v: unknown) => v === 'TBC' || v === null || v === undefined;

/** Etichetta [DA CONFERMARE] tradotta per la lingua (testo visibile). */
export function tbc(lang: Lang) {
  return dict[lang].common.tbc;
}

export function fmtTime(t: string, lang: Lang): string {
  if (isTbc(t)) return tbc(lang);
  const [h, m] = t.split(':');
  const hh = String(Number(h));
  if (lang === 'fr') return `${hh}h${m}`;
  return `${hh}:${m}`;
}

export function fmtSlots(slots: Slot[] | undefined, lang: Lang): string {
  if (!slots || slots.length === 0) return dict[lang].common.closed;
  return slots.map(([a, b]) => `${fmtTime(a, lang)}–${fmtTime(b, lang)}`).join(' · ');
}

export function slotsFor(week: Week, day: Day): Slot[] | undefined {
  return (week[day] ?? week.all) as Slot[] | undefined;
}

/** Restituisce gli orari settimanali di un servizio per una stagione. */
export function weekOf(serviceKey: keyof typeof site.services, season: 'winter' | 'summer' | 'all' = 'all'): Week {
  const s: any = site.services[serviceKey];
  const src = s.sameHoursAs ? (site.services as any)[s.sameHoursAs] : s;
  const h = src.hours;
  return (h[season] ?? h.all ?? h.winter) as Week;
}

export function serviceTbc(serviceKey: keyof typeof site.services): boolean {
  const s: any = site.services[serviceKey];
  const src = s.sameHoursAs ? (site.services as any)[s.sameHoursAs] : s;
  return !!src.tbc;
}

export function place(key: keyof typeof site.places) {
  return site.places[key];
}

export function telHref(phone: string) {
  return 'tel:' + phone.replace(/[^+\d]/g, '');
}

export function directions(key: keyof typeof site.places): string {
  const p: any = site.places[key];
  if (p.geo) return `https://www.google.com/maps/dir/?api=1&destination=${p.geo.lat},${p.geo.lng}`;
  return p.mapsShort ?? '';
}

export function addressLine(key: keyof typeof site.places, lang: Lang): string {
  const p: any = site.places[key];
  const street = isTbc(p.street) ? tbc(lang) : p.street;
  return `${street}, ${p.zip} ${p.city} (${p.region})`;
}

export function chaletBooking(lang: Lang) {
  return (site.booking.chalet as any)[lang] as string;
}
export function wineList(lang: Lang) {
  return (site.booking.wineList as any)[lang] as string;
}
