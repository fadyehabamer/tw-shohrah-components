import type { SallaLike, SallaProduct, SallaCartSummary } from '../types/salla';

/** The Twilight SDK exposes both `salla` and `Salla`; prefer whichever exists. */
export function getSalla(): SallaLike | undefined {
  return window.salla ?? window.Salla;
}

let readyPromise: Promise<SallaLike | undefined> | null = null;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return new Promise((resolve) => {
    const id = window.setTimeout(() => resolve(undefined), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      () => {
        clearTimeout(id);
        resolve(undefined);
      },
    );
  });
}

/**
 * Resolves once the SDK is initialised and store translations are loaded.
 * Resolves `undefined` when the SDK never shows up so components can still render
 * from their built-in Arabic/English strings instead of staying blank.
 */
export function whenSallaReady(timeoutMs = 8000): Promise<SallaLike | undefined> {
  if (readyPromise) return readyPromise;
  readyPromise = new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      const s = getSalla();
      if (s && typeof s.onReady === 'function') {
        withTimeout(Promise.resolve(s.onReady()), timeoutMs)
          .then(() => (s.lang?.onLoaded ? withTimeout(s.lang.onLoaded(), 4000) : undefined))
          .then(() => resolve(s));
        return;
      }
      if (Date.now() - started > timeoutMs) {
        resolve(undefined);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
  return readyPromise;
}

const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

/** Two-letter locale of the rendered page; the document wins over the SDK, the SDK over a default of `ar`. */
export function currentLocale(): string {
  const fromDoc = document.documentElement.getAttribute('lang');
  let code: string | null | undefined = fromDoc && fromDoc.trim();
  if (!code) {
    const s = getSalla();
    try {
      code = s?.lang?.getLocale?.() || s?.config?.get('user.language_code');
    } catch {
      code = undefined;
    }
  }
  return (code || 'ar').toLowerCase().split(/[-_]/)[0];
}

export function documentIsRtl(): boolean {
  const dir = document.documentElement.getAttribute('dir');
  if (dir) return dir.toLowerCase() === 'rtl';
  return RTL_LOCALES.has(currentLocale());
}

/** Product id when the current page is a product page (`page.id` is the product id there). */
export function currentProductId(): number | undefined {
  const s = getSalla();
  if (!s) return undefined;
  try {
    if (s.url?.is_page?.('product.single')) {
      const id = Number(s.config.get('page.id'));
      return Number.isFinite(id) && id > 0 ? id : undefined;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export function storeUrl(path = ''): string {
  const s = getSalla();
  try {
    if (s?.url?.get) return s.url.get(path);
  } catch {
    /* ignore */
  }
  return `/${path.replace(/^\/+/, '')}`;
}

export function cdnUrl(path: string): string {
  const s = getSalla();
  try {
    if (s?.url?.cdn) return s.url.cdn(path);
  } catch {
    /* ignore */
  }
  return `https://cdn.salla.network/${path.replace(/^\/+/, '')}`;
}

export interface ThemeColors {
  primary?: string;
  onPrimary?: string;
  isDark?: boolean;
}

export function themeColors(): ThemeColors {
  const s = getSalla();
  if (!s) return {};
  try {
    return {
      primary: s.config.get('theme.color.primary') || undefined,
      onPrimary: s.config.get('theme.color.reverse_text') || undefined,
      isDark: Boolean(s.config.get('theme.color.is_dark')),
    };
  } catch {
    return {};
  }
}

export function storeContact(key: 'whatsapp' | 'mobile' | 'phone' | 'email'): string | undefined {
  const s = getSalla();
  try {
    const v = s?.config.get(`store.contacts.${key}`);
    return typeof v === 'string' && v.trim() ? v.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function storeInfo(key: 'name' | 'logo' | 'url'): string | undefined {
  const s = getSalla();
  try {
    const v = s?.config.get(`store.${key}`);
    return typeof v === 'string' && v.trim() ? v : undefined;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ storage */

const STORAGE_PREFIX = 'shohrah.';

export function storageGet<T>(key: string, fallback: T): T {
  const s = getSalla();
  try {
    if (s?.storage?.get) return (s.storage.get(STORAGE_PREFIX + key, fallback) as T) ?? fallback;
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function storageSet(key: string, value: unknown): void {
  const s = getSalla();
  try {
    if (s?.storage?.set) {
      s.storage.set(STORAGE_PREFIX + key, value);
      return;
    }
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

export function storageRemove(key: string): void {
  const s = getSalla();
  try {
    if (s?.storage?.remove) {
      s.storage.remove(STORAGE_PREFIX + key);
      return;
    }
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function sessionGet<T>(key: string, fallback: T): T {
  const s = getSalla();
  try {
    if (s?.storage?.getWithTTL) return (s.storage.getWithTTL(STORAGE_PREFIX + key, fallback, 'session') as T) ?? fallback;
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function sessionSet(key: string, value: unknown, ttlMinutes = 5): void {
  const s = getSalla();
  try {
    if (s?.storage?.setWithTTL) {
      s.storage.setWithTTL(STORAGE_PREFIX + key, value, ttlMinutes, 'session');
      return;
    }
    window.sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ data */

/** One request per product per page-session; details are cached for `ttlMinutes`. */
export async function fetchProductDetails(
  id: number,
  withItems: string[] = [],
  ttlMinutes = 5,
): Promise<SallaProduct | undefined> {
  const s = getSalla();
  if (!s?.product?.api?.getDetails) return undefined;
  const cacheKey = `product.${id}.${withItems.join('+')}`;
  const cached = sessionGet<SallaProduct | null>(cacheKey, null);
  if (cached && cached.id) return cached;
  const res = await s.product.api.getDetails(id, withItems);
  const product = res?.data;
  if (product) sessionSet(cacheKey, product, ttlMinutes);
  return product;
}

/** One request for many products (never one per item). */
export async function fetchProductsByIds(ids: number[], limit?: number): Promise<SallaProduct[]> {
  const s = getSalla();
  if (!s?.product?.api?.fetch || ids.length === 0) return [];
  const res = await s.product.api.fetch({
    source: 'selected',
    source_value: ids,
    limit: limit ?? ids.length,
  });
  const data = res?.data;
  return Array.isArray(data) ? data : [];
}

function unwrapCart(data: unknown): SallaCartSummary | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as { cart?: SallaCartSummary } & SallaCartSummary;
  return d.cart && typeof d.cart === 'object' ? d.cart : d;
}

export async function fetchCartSummary(): Promise<SallaCartSummary | undefined> {
  const s = getSalla();
  if (!s?.cart?.api?.latest) return undefined;
  const res = await s.cart.api.latest();
  return unwrapCart(res?.data);
}

/** Subscribe to cart updates; returns an unsubscribe function. */
export function onCartUpdated(cb: (cart: SallaCartSummary) => void): () => void {
  const s = getSalla();
  if (!s?.event?.on) return () => undefined;
  const handler = (payload: unknown) => {
    const cart = unwrapCart(payload);
    if (cart) cb(cart);
  };
  s.event.on('cart::updated', handler);
  return () => {
    try {
      s.event.off?.('cart::updated', handler);
    } catch {
      /* ignore */
    }
  };
}

export async function addToCart(id: number, quantity = 1): Promise<boolean> {
  const s = getSalla();
  if (!s?.cart?.addItem) return false;
  await s.cart.addItem({ id, quantity });
  return true;
}
