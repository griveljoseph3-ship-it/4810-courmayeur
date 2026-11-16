import it from './it.json';
import en from './en.json';
import fr from './fr.json';
import type { Lang } from '../lib/routes';

export type Dict = typeof it;
export const dict: Record<Lang, Dict> = { it, en: en as Dict, fr: fr as Dict };

/** Sostituisce {chiave} con i valori passati. */
export function fill(str: string, vars: Record<string, string | number> = {}): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
