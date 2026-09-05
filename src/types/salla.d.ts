/**
 * Narrow typing of the parts of the Twilight JS SDK this bundle uses.
 * Every member below exists in @salla.sa/twilight@2.14 type declarations
 * (types/index.d.ts, lib/lang.d.ts, api/product, api/cart, event/cart) or @salla.sa/base.
 */
export interface SallaLingualMap {
  ar?: string;
  en?: string;
  [locale: string]: string | undefined;
}

export interface SallaOption {
  label: string;
  value: string | number;
  key?: string;
}

export interface SallaProductImage {
  url?: string;
  alt?: string | null;
}

export interface SallaProduct {
  id: number | string;
  name?: string;
  url?: string;
  price?: number | string;
  sale_price?: number | string;
  regular_price?: number | string;
  is_on_sale?: boolean;
  is_available?: boolean;
  is_out_of_stock?: boolean;
  quantity?: number | null;
  max_quantity?: number | null;
  sold_quantity?: number | null;
  can_show_sold?: boolean;
  can_show_remained_quantity?: boolean;
  is_hidden_quantity?: boolean;
  has_options?: boolean;
  options?: unknown[];
  image?: SallaProductImage;
  images?: Array<SallaProductImage & { main?: boolean }>;
  add_to_cart_label?: string;
  promotion_title?: string | null;
  discount_percentage?: string | null;
  currency?: string;
  type?: string;
}

export interface SallaFreeShippingBar {
  minimum_amount: number;
  has_free_shipping: boolean;
  percent: number;
  remaining: number;
}

export interface SallaCartItem {
  id: number;
  product_id: number;
  quantity: number;
}

export interface SallaCartSummary {
  id?: number;
  sub_total?: number;
  total?: number;
  count?: number;
  free_shipping_bar?: SallaFreeShippingBar;
  items?: SallaCartItem[];
}

export interface SallaApiResponse<T> {
  status?: number;
  success?: boolean;
  data: T;
}

export interface SallaLike {
  onReady: () => Promise<void>;
  status?: 'loading' | 'ready';
  lang: {
    translationsLoaded?: boolean;
    onLoaded: (cb?: () => void) => Promise<void>;
    get: (key: string, replacements?: Record<string, string | number>, locale?: string) => string;
    add: (key: string, messages: Record<string, string>) => unknown;
    addBulk: (messages: Record<string, Record<string, string>>) => unknown;
    getLocale?: () => string;
  };
  config: {
    get: (key: string, fallback?: unknown) => any;
  };
  storage: {
    get: (key: string, fallback?: unknown) => unknown;
    set: (key: string, value: unknown) => unknown;
    remove: (key: string) => void;
    setWithTTL: (key: string, value: unknown, ttlMinutes: number, store: 'store' | 'session' | 'cookie') => unknown;
    getWithTTL: (key: string, fallback: unknown, store: 'store' | 'session' | 'cookie') => unknown;
  };
  product: {
    api: {
      getDetails: (id: number, withItems?: string[]) => Promise<SallaApiResponse<SallaProduct>>;
      fetch: (query: {
        source: string;
        source_value: number | string | string[] | number[] | object;
        limit?: number;
        includes?: string[];
      }) => Promise<SallaApiResponse<SallaProduct[]>>;
    };
  };
  cart: {
    api: { latest: () => Promise<SallaApiResponse<{ cart?: SallaCartSummary } | SallaCartSummary>> };
    event: { onUpdated: (cb: (cart: SallaCartSummary) => void) => void };
    addItem: (data: { id: number; quantity: number; options?: unknown; notes?: string }) => Promise<unknown>;
    addCoupon: (coupon: string) => Promise<unknown>;
  };
  event: {
    on: (event: string, cb: (...args: any[]) => void) => unknown;
    off: (event: string, cb: (...args: any[]) => void) => unknown;
    emit: (event: string, ...args: any[]) => unknown;
  };
  money: (value: number | string | { amount: number; currency: string }) => string;
  helpers: { number: (n: number | string, forceEnglish?: boolean) => number | string };
  url: { get: (path: string) => string; is_page: (name: string) => boolean; cdn: (path: string) => string };
  log: (...args: unknown[]) => void;
  error: (message: string, data?: unknown) => unknown;
  success: (message: string, data?: unknown) => unknown;
}

declare global {
  interface Window {
    salla?: SallaLike;
    Salla?: SallaLike;
  }
}
