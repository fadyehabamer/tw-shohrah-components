import { getSalla } from './salla';

/** A merchant text value: already flattened to a string by the server, or `{ar, en}` from the editor. */
export type Lingual = string | number | Record<string, string | undefined> | null | undefined;

export interface Message {
  ar: string;
  en: string;
}
export type Messages = Record<string, Message>;

/** Same priority as Salla's presenter: current locale → ar → en → first non-empty value. */
export function pick(value: Lingual, locale: string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return '';
  const v = value as Record<string, string | undefined>;
  const candidates = [v[locale], v.ar, v.en, ...Object.values(v)];
  for (const c of candidates) if (typeof c === 'string' && c.trim()) return c;
  return '';
}

export type Replacements = Record<string, string | number>;

export function interpolate(text: string, replacements?: Replacements): string {
  if (!replacements) return text;
  return text.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in replacements ? String(replacements[key]) : m,
  );
}

type GlobalWithRegistry = typeof window & { __shohrahI18n?: Set<string> };

/**
 * Registers a component's strings under `shohrah.<ns>.<key>` so themes can override them
 * through `salla.lang.set()`. Must be called after `salla.lang.onLoaded()` because the SDK
 * replaces its message tables when store translations arrive.
 */
export function registerMessages(ns: string, messages: Messages): void {
  const s = getSalla();
  if (!s?.lang?.addBulk) return;
  const registry = ((window as GlobalWithRegistry).__shohrahI18n ??= new Set<string>());
  if (registry.has(ns)) return;
  const bulk: Record<string, Record<string, string>> = {};
  for (const [key, msg] of Object.entries(messages)) bulk[`shohrah.${ns}.${key}`] = { ar: msg.ar, en: msg.en };
  try {
    s.lang.addBulk(bulk);
    registry.add(ns);
  } catch {
    /* translations layer unavailable: fall back to built-in table */
  }
}

/** Translate a component string; SDK first (so overrides win), then the built-in ar/en table. */
export function translate(
  ns: string,
  key: string,
  messages: Messages,
  locale: string,
  replacements?: Replacements,
): string {
  const full = `shohrah.${ns}.${key}`;
  const s = getSalla();
  let out: string | undefined;
  if (s?.lang?.get && s.lang.translationsLoaded) {
    try {
      const r = s.lang.get(full);
      if (typeof r === 'string' && r && r !== full) out = r;
    } catch {
      out = undefined;
    }
  }
  if (!out) {
    const m = messages[key];
    out = m ? (locale === 'ar' ? m.ar : m.en) || m.en || m.ar : key;
  }
  return interpolate(out, replacements);
}
