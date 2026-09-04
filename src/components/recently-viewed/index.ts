import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconArrowEnd, iconArrowStart, iconCart, iconCheck, iconTrash } from '../../shared/icons';
import { money, priceOf } from '../../shared/format';
import { addToCart, currentProductId, fetchProductsByIds, storageGet, storageRemove, storageSet } from '../../shared/salla';
import type { SallaProduct } from '../../types/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { RvCardStyle, RvEmptyBehavior, RvImageRatio, RvLayout, ViewedEntry } from './types';

const LAYOUTS = ['slider', 'grid'] as const;
const RATIOS = ['square', 'portrait', 'landscape'] as const;
const EMPTY = ['hide', 'message'] as const;
const CARD_STYLES = ['outlined', 'elevated', 'plain'] as const;
const RATIO_CSS: Record<RvImageRatio, string> = { square: '1 / 1', portrait: '3 / 4', landscape: '4 / 3' };
const STORAGE_KEY = 'recently_viewed';
const MAX_ENTRIES = 24;

/**
 * `<salla-recently-viewed>` — products the visitor viewed on this device, fetched in a single request.
 *
 * History is a list of product ids kept in the SDK's local storage; on product pages the component
 * records the current product. Nothing else is stored.
 *
 * Properties: `config`, `layout`, `limit`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:products-loaded` ({ count }), `shohrah:add-to-cart` ({ productId, ok }),
 *         `shohrah:history-cleared`.
 * Slots: `title`, `subtitle`, `empty`.
 * CSS parts: `root`, `title`, `subtitle`, `list`, `card`, `image`, `name`, `price`, `add`, `clear`, `empty`.
 */
export default class RecentlyViewed extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'recently-viewed';
  protected readonly messages = messages;

  @property({ type: String }) layout?: RvLayout;
  @property({ type: Number }) limit?: number;

  @state() private products: SallaProduct[] = [];
  @state() private addedIds = new Set<number>();
  @query('.list--slider') private sliderEl?: HTMLElement;

  private readHistory(): ViewedEntry[] {
    const days = this.num('storage_days', 30, 1, 365);
    const cutoff = Date.now() - days * 86_400_000;
    const raw = storageGet<unknown>(STORAGE_KEY, []);
    const list = Array.isArray(raw) ? (raw as ViewedEntry[]) : [];
    return list.filter((e) => e && Number(e.id) > 0 && Number(e.t) > cutoff);
  }

  private recordCurrent(): void {
    const id = currentProductId();
    if (!id) return;
    const list = this.readHistory().filter((e) => Number(e.id) !== id);
    list.unshift({ id, t: Date.now() });
    storageSet(STORAGE_KEY, list.slice(0, MAX_ENTRIES));
  }

  protected async onSallaReady(): Promise<void> {
    this.recordCurrent();
    await this.load();
  }

  private async load(): Promise<void> {
    const current = currentProductId();
    const exclude = this.bool('exclude_current', true);
    const limit = this.limit ?? this.num('limit', 8, 2, 12);
    const ids = this.readHistory()
      .map((e) => Number(e.id))
      .filter((id) => !(exclude && id === current))
      .slice(0, limit);
    if (ids.length === 0) {
      this.products = [];
      this.phase = 'empty';
      return;
    }
    this.phase = 'loading';
    try {
      const fetched = await fetchProductsByIds(ids, limit);
      const byId = new Map(fetched.map((p) => [Number(p.id), p]));
      this.products = ids.map((id) => byId.get(id)).filter((p): p is SallaProduct => Boolean(p));
      this.phase = this.products.length ? 'ready' : 'empty';
      this.emit('products-loaded', { count: this.products.length });
    } catch (err) {
      this.fail(err instanceof Error ? err : new Error(this.t('load_error')));
    }
  }

  private clear(): void {
    storageRemove(STORAGE_KEY);
    this.products = [];
    this.phase = 'empty';
    this.emit('history-cleared');
  }

  private async add(p: SallaProduct): Promise<void> {
    const id = Number(p.id);
    let ok = false;
    try {
      ok = await addToCart(id, 1);
    } catch {
      ok = false;
    }
    if (ok) {
      this.addedIds = new Set([...this.addedIds, id]);
      this.delay(2200, () => {
        const next = new Set(this.addedIds);
        next.delete(id);
        this.addedIds = next;
      });
    }
    this.emit('add-to-cart', { productId: id, ok });
  }

  private scrollSlider(dir: 1 | -1): void {
    const el = this.sliderEl;
    if (!el) return;
    const step = el.clientWidth * 0.9 * dir * (this.rtl ? -1 : 1);
    el.scrollBy({ left: step, behavior: this.reducedMotion ? 'auto' : 'smooth' });
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;

    const layout = this.layout ?? this.choice('layout', LAYOUTS, 'slider');
    const ratio = this.choice<RvImageRatio>('image_ratio', RATIOS, 'portrait');
    const cardStyle = this.choice<RvCardStyle>('card_style', CARD_STYLES, 'outlined');
    const emptyBehavior = this.choice<RvEmptyBehavior>('empty_behavior', EMPTY, 'hide');
    const cols = this.num('columns_desktop', 4, 2, 6);
    const colsMobile = this.num('columns_mobile', 2, 1, 3);
    const vars = `--rv-cols:${cols};--rv-cols-mobile:${colsMobile};--rv-ratio:${RATIO_CSS[ratio]}`;
    const subtitle = this.str('subtitle');

    if (this.phase === 'empty') {
      if (emptyBehavior === 'hide') return nothing;
      return html`<section class="root" part="root" style=${vars}>
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
        </div>
        <slot name="empty"><div class="sh-empty" part="empty">${this.text('empty_message', 'empty')}</div></slot>
      </section>`;
    }

    const loading = this.phase === 'loading';
    const limit = this.limit ?? this.num('limit', 8, 2, 12);
    const items = loading ? Array.from({ length: Math.min(limit, cols) }) : this.products;

    return html`
      <section class="root" part="root" style=${vars} aria-label=${this.t('region_label')} aria-busy=${String(loading)}>
        <div class="head">
          <div class="sh-header">
            <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
            ${subtitle ? html`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
          </div>
          <div class="actions">
            ${this.bool('show_clear', true) && !loading
              ? html`<button class="sh-btn sh-btn--ghost clear" part="clear" type="button" @click=${this.clear}>
                  ${iconTrash()} ${this.text('clear_text', 'clear')}
                </button>`
              : nothing}
            ${layout === 'slider' && !loading && this.products.length > cols
              ? html`
                  <button class="sh-icon-btn" type="button" aria-label=${this.t('prev')} @click=${() => this.scrollSlider(-1)}>${iconArrowStart()}</button>
                  <button class="sh-icon-btn" type="button" aria-label=${this.t('next')} @click=${() => this.scrollSlider(1)}>${iconArrowEnd()}</button>
                `
              : nothing}
          </div>
        </div>
        <ul class=${classMap({ list: true, 'list--slider': layout === 'slider' })} part="list" role="list">
          ${items.map((p) => html`<li class="card-wrap">${loading ? this.renderSkeleton(cardStyle) : this.renderCard(p as SallaProduct, cardStyle)}</li>`)}
        </ul>
      </section>
    `;
  }

  private renderSkeleton(cardStyle: RvCardStyle) {
    return html`<div class=${classMap({ card: true, [`card--${cardStyle}`]: true })} aria-hidden="true">
      <div class="media sh-skeleton skel-media"></div>
      <div class="body">
        <span class="sh-skeleton skel-line"></span>
        <span class="sh-skeleton skel-line skel-line--short"></span>
      </div>
    </div>`;
  }

  private renderCard(p: SallaProduct, cardStyle: RvCardStyle) {
    const id = Number(p.id);
    const image = p.image?.url || p.images?.find((i) => i.main)?.url || p.images?.[0]?.url || '';
    const price = priceOf(p);
    const onSale = Boolean(p.is_on_sale && price.original);
    const showAdd = this.bool('show_add_to_cart', true);
    const canQuickAdd = showAdd && p.is_available !== false && !p.is_out_of_stock && !p.has_options && !(Array.isArray(p.options) && p.options.length);
    const added = this.addedIds.has(id);
    const badge = p.discount_percentage ? String(p.discount_percentage) : this.t('sale');

    return html`<article class=${classMap({ card: true, [`card--${cardStyle}`]: true })} part="card">
      <a class="media" href=${p.url || '#'} tabindex="-1" aria-hidden="true">
        ${image ? html`<img part="image" src=${image} alt=${p.image?.alt || p.name || ''} loading="lazy" decoding="async" />` : nothing}
        ${this.bool('show_sale_badge', true) && onSale ? html`<span class="badge">${badge}</span>` : nothing}
      </a>
      <div class="body">
        <h4 class="name" part="name"><a href=${p.url || '#'}>${p.name ?? ''}</a></h4>
        ${this.bool('show_price', true)
          ? html`<div class="price" part="price">
              <span class="now">${money(price.current)}</span>
              ${price.original ? html`<s class="was">${money(price.original)}</s>` : nothing}
            </div>`
          : nothing}
        ${showAdd
          ? canQuickAdd
            ? html`<button
                class=${classMap({ 'sh-btn': true, 'sh-btn--ghost': !added, add: true, 'add--added': added })}
                part="add"
                type="button"
                aria-label=${this.t('add_to_cart_label', { name: p.name ?? '' })}
                @click=${() => this.add(p)}
              >
                ${added ? iconCheck() : iconCart()} ${added ? this.t('added') : this.text('add_text', 'add')}
              </button>`
            : html`<a class="sh-btn sh-btn--ghost add" part="add" href=${p.url || '#'}>${this.t('view')} ${iconArrowEnd()}</a>`
          : nothing}
      </div>
    </article>`;
  }
}
