import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { SallaLike } from '../types/salla';
import { currentLocale, themeColors, whenSallaReady } from './salla';
import { pick, registerMessages, translate, type Lingual, type Messages, type Replacements } from './i18n';
import { clamp } from './format';

export type Phase = 'loading' | 'ready' | 'empty' | 'error';

type OptionLike = { value?: unknown; key?: unknown } | string | number | null | undefined;

/**
 * Base class for every Shohrah component.
 * - reads the editor `config` object with typed, defensive getters
 * - waits for the Twilight SDK and store translations, then registers its own strings
 * - mirrors the host theme's colours as fallback tokens when the theme exposes none
 * - tracks listeners/timers/observers and removes them on disconnect
 */
export abstract class ShohrahElement extends LitElement {
  /** Namespace for translations and events, e.g. `trust-badges`. */
  protected abstract readonly ns: string;
  /** Built-in Arabic/English strings; registered under `shohrah.<ns>.<key>`. */
  protected abstract readonly messages: Messages;

  @property({ type: Object }) config: Record<string, unknown> | undefined;

  @state() protected locale = 'ar';
  /** Reflected as `data-phase` so themes can style loading/empty/error states from outside. */
  @property({ type: String, reflect: true, attribute: 'data-phase' }) phase: Phase = 'loading';
  @state() protected errorMessage = '';

  protected salla: SallaLike | undefined;
  private disposers: Array<() => void> = [];
  private booted = false;

  /* ------------------------------------------------------------- lifecycle */

  connectedCallback(): void {
    super.connectedCallback();
    this.locale = currentLocale();
    const observer = new MutationObserver(() => {
      const next = currentLocale();
      if (next !== this.locale) {
        this.locale = next;
        this.onLocaleChange();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    this.addDisposer(() => observer.disconnect());
    if (!this.booted) {
      this.booted = true;
      void this.boot();
    } else {
      void this.onSallaReady();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const list = this.disposers.splice(0);
    for (const fn of list) {
      try {
        fn();
      } catch {
        /* ignore */
      }
    }
  }

  private async boot(): Promise<void> {
    this.salla = await whenSallaReady();
    if (!this.isConnected) return;
    this.locale = currentLocale();
    registerMessages(this.ns, this.messages);
    this.applyThemeFallbacks();
    try {
      await this.onSallaReady();
      this.emit('ready');
    } catch (err) {
      this.fail(err);
    }
  }

  /** Override to load data. Default: mark ready. */
  protected onSallaReady(): void | Promise<void> {
    this.phase = 'ready';
  }

  protected onLocaleChange(): void {
    this.requestUpdate();
  }

  protected fail(err: unknown): void {
    const message = err instanceof Error ? err.message : String(err ?? 'error');
    this.errorMessage = message;
    this.phase = 'error';
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, err);
    } catch {
      /* ignore */
    }
    this.emit('error', { message });
  }

  /* ------------------------------------------------------------- cleanup helpers */

  protected addDisposer(fn: () => void): void {
    this.disposers.push(fn);
  }

  protected listen<K extends keyof HTMLElementEventMap>(
    target: EventTarget,
    type: K | string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void {
    target.addEventListener(type as string, handler, options);
    this.addDisposer(() => target.removeEventListener(type as string, handler, options));
  }

  protected delay(ms: number, fn: () => void): number {
    const id = window.setTimeout(fn, ms);
    this.addDisposer(() => window.clearTimeout(id));
    return id;
  }

  protected every(ms: number, fn: () => void): () => void {
    const id = window.setInterval(fn, ms);
    const stop = () => window.clearInterval(id);
    this.addDisposer(stop);
    return stop;
  }

  protected own<T extends { disconnect(): void }>(observer: T): T {
    this.addDisposer(() => observer.disconnect());
    return observer;
  }

  protected emit(name: string, detail: unknown = undefined): void {
    this.dispatchEvent(new CustomEvent(`shohrah:${name}`, { detail, bubbles: true, composed: true }));
  }

  /* ------------------------------------------------------------- i18n */

  protected t(key: string, replacements?: Replacements): string {
    return translate(this.ns, key, this.messages, this.locale, replacements);
  }

  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  protected text(key: string, msgKey: string, replacements?: Replacements): string {
    const merchant = this.str(key);
    if (merchant) return replacements ? this.interp(merchant, replacements) : merchant;
    return this.t(msgKey, replacements);
  }

  protected interp(text: string, replacements: Replacements): string {
    return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in replacements ? String(replacements[k]) : m));
  }

  protected get rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  protected get reducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /* ------------------------------------------------------------- config getters */

  protected raw(key: string): unknown {
    return this.config ? (this.config as Record<string, unknown>)[key] : undefined;
  }

  protected str(key: string, fallback = ''): string {
    const v = this.raw(key);
    if (v == null) return fallback;
    if (typeof v === 'object') {
      const p = pick(v as Lingual, this.locale);
      return p.trim() ? p : fallback;
    }
    const s = String(v);
    return s.trim() ? s : fallback;
  }

  protected bool(key: string, fallback: boolean): boolean {
    const v = this.raw(key);
    if (v == null || v === '') return fallback;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    const s = String(v).trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(s)) return true;
    if (['false', '0', 'no', 'off'].includes(s)) return false;
    return fallback;
  }

  protected num(key: string, fallback: number, min = -Infinity, max = Infinity): number {
    const v = this.raw(key);
    const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) && v != null && v !== '' ? clamp(n, min, max) : fallback;
  }

  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  protected choice<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    let v = this.raw(key) as OptionLike | OptionLike[];
    if (Array.isArray(v)) v = v[0];
    if (v && typeof v === 'object') v = ((v as { value?: unknown }).value ?? (v as { key?: unknown }).key) as OptionLike;
    const s = v == null ? '' : String(v).trim();
    return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
  }

  /** First selected id of a `source` items field (products, categories …). */
  protected selectedId(key: string): number | undefined {
    let v = this.raw(key) as OptionLike | OptionLike[];
    if (Array.isArray(v)) v = v[0];
    if (v && typeof v === 'object') v = (v as { value?: unknown }).value as OptionLike;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }

  /** Rows of a `collection` field. */
  protected list<T extends Record<string, unknown> = Record<string, unknown>>(key: string): T[] {
    const v = this.raw(key);
    if (Array.isArray(v)) return v.filter((r) => r && typeof r === 'object') as T[];
    if (v && typeof v === 'object') return Object.values(v as Record<string, unknown>).filter((r) => r && typeof r === 'object') as T[];
    return [];
  }

  /** Text inside a collection row (string or `{ar,en}`). */
  protected rowText(row: Record<string, unknown>, key: string, fallback = ''): string {
    const v = row[key];
    if (v == null) return fallback;
    if (typeof v === 'object') {
      const p = pick(v as Lingual, this.locale);
      return p.trim() ? p : fallback;
    }
    const s = String(v);
    return s.trim() ? s : fallback;
  }

  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  protected link(key: string): string {
    return this.linkValue(this.raw(key));
  }

  protected linkValue(v: unknown): string {
    if (Array.isArray(v)) v = v[0];
    if (v && typeof v === 'object') v = (v as { value?: unknown; url?: unknown }).url ?? (v as { value?: unknown }).value;
    if (v == null) return '';
    const s = String(v).trim();
    if (!s || s === '#') return '';
    if (/^(https?:)?\/\//i.test(s) || s.startsWith('/') || s.startsWith('#') || s.startsWith('mailto:') || s.startsWith('tel:')) return s;
    return /^[\w./-]+$/.test(s) ? `/${s}` : '';
  }

  protected color(key: string, fallback: string): string {
    const v = this.str(key, '').trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(v) ? v : fallback;
  }

  /* ------------------------------------------------------------- theme */

  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  protected applyThemeFallbacks(): void {
    try {
      const root = getComputedStyle(document.documentElement);
      const hasThemeVar = root.getPropertyValue('--color-primary').trim() !== '';
      if (hasThemeVar) return;
      const { primary, onPrimary } = themeColors();
      if (primary) this.style.setProperty('--shohrah-primary', primary);
      if (onPrimary) this.style.setProperty('--shohrah-on-primary', onPrimary);
    } catch {
      /* ignore */
    }
  }

  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  protected readableOn(background: string): string {
    const m = background.replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(m)) return '#ffffff';
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255);
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const l = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return l > 0.4 ? '#1c1c1c' : '#ffffff';
  }
}
