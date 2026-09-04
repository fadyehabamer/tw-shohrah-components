import { getSalla, currentLocale } from './salla';

/** Store-formatted money via the SDK; Intl fallback keeps the demo/legacy pages readable. */
export function money(value: number | string | null | undefined, currency?: string): string {
  if (value == null || value === '') return '';
  const s = getSalla();
  try {
    if (s?.money) return s.money(currency ? { amount: Number(value), currency } : (value as number));
  } catch {
    /* fall through */
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  try {
    return new Intl.NumberFormat(currentLocale() === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency || 'SAR',
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency || 'SAR'}`;
  }
}

/** Number rendering that follows the store's Arabic-digits setting. */
export function num(value: number | string | null | undefined): string {
  if (value == null || value === '') return '';
  const s = getSalla();
  try {
    if (s?.helpers?.number) return String(s.helpers.number(value));
  } catch {
    /* fall through */
  }
  return String(value);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function priceOf(p: { price?: number | string; sale_price?: number | string; regular_price?: number | string; is_on_sale?: boolean }): {
  current: number | string | undefined;
  original: number | string | undefined;
} {
  const sale = p.sale_price != null && Number(p.sale_price) > 0 ? p.sale_price : undefined;
  const regular = p.regular_price != null && Number(p.regular_price) > 0 ? p.regular_price : undefined;
  if (p.is_on_sale && sale != null) return { current: sale, original: regular ?? p.price };
  return { current: p.price ?? sale ?? regular, original: undefined };
}
