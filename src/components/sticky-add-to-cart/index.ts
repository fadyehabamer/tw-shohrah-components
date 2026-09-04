import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconCart, iconCheck, iconMinus, iconPlus } from '../../shared/icons';
import { clamp, money, num, priceOf } from '../../shared/format';
import { addToCart, currentProductId, fetchProductDetails } from '../../shared/salla';
import type { SallaProduct } from '../../types/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { AddState, BarPosition, BarShowOn, BarSurface } from './types';

const POSITIONS = ['bottom', 'top'] as const;
const SURFACES = ['light', 'dark', 'primary'] as const;
const SHOW_ON = ['all', 'mobile', 'desktop'] as const;

/** Selectors for the theme's own add-to-cart area; when it is on screen the bar hides itself. */
const FORM_SELECTORS = ['salla-add-product-button', 'form[id^="product-form"]', '.product-form', '#product-form'];

/**
 * `<salla-sticky-add-to-cart>` — fixed bar with image, price, quantity and add-to-cart that appears on scroll.
 *
 * Properties: `config`, `productId`, `position` (reflected), `visible` (reflected), `showOn` (reflected).
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:add-to-cart` ({ productId, quantity, ok }),
 *         `shohrah:options-required` ({ productId }), `shohrah:visibility` ({ visible }).
 * Slots: `button` (custom CTA content), `extra` (content between price and button).
 * CSS parts: `bar`, `image`, `name`, `price`, `quantity`, `button`.
 */
export default class StickyAddToCart extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'sticky-add-to-cart';
  protected readonly messages = messages;

  @property({ type: Number, attribute: 'product-id' }) productId?: number;
  @property({ type: String, reflect: true }) position: BarPosition = 'bottom';
  @property({ type: Boolean, reflect: true }) visible = false;
  @property({ type: String, reflect: true, attribute: 'show-on' }) showOn: BarShowOn = 'all';

  @state() private product?: SallaProduct;
  @state() private quantity = 1;
  @state() private addState: AddState = 'idle';
  private scrolledEnough = false;
  private formInView = false;
  private scrollRaf = 0;
  private loadedFor?: number;

  private resolveProductId(): number | undefined {
    return this.productId ?? this.selectedId('product') ?? currentProductId();
  }

  protected async onSallaReady(): Promise<void> {
    this.position = this.choice('position', POSITIONS, this.position);
    this.showOn = this.choice('show_on', SHOW_ON, this.showOn);
    await this.load();
    if (this.phase !== 'ready') return;
    this.listen(window, 'scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
    if (this.bool('hide_near_form', true) && 'IntersectionObserver' in window) {
      const form = FORM_SELECTORS.map((s) => document.querySelector(s)).find(Boolean);
      if (form) {
        const io = this.own(
          new IntersectionObserver(
            (entries) => {
              this.formInView = entries.some((e) => e.isIntersecting);
              this.updateVisibility();
            },
            { threshold: 0.2 },
          ),
        );
        io.observe(form);
      }
    }
  }

  private async load(): Promise<void> {
    const id = this.resolveProductId();
    if (!id) {
      this.phase = 'empty';
      return;
    }
    this.loadedFor = id;
    this.phase = 'loading';
    try {
      const product = await fetchProductDetails(id, ['images', 'options']);
      if (!product) throw new Error(this.t('load_error'));
      this.product = product;
      this.quantity = 1;
      this.phase = 'ready';
    } catch (err) {
      this.fail(err instanceof Error ? err : new Error(this.t('load_error')));
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if ((changed.has('config') || changed.has('productId')) && this.salla) {
      const id = this.resolveProductId();
      if (id && id !== this.loadedFor) void this.load();
    }
  }

  private onScroll(): void {
    if (this.scrollRaf) return;
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      const threshold = this.num('show_after_px', 320, 0, 5000);
      this.scrolledEnough = (window.scrollY || document.documentElement.scrollTop) > threshold;
      this.updateVisibility();
    });
  }

  private updateVisibility(): void {
    const outOfStock = this.isOutOfStock;
    const next = this.phase === 'ready' && this.scrolledEnough && !this.formInView && !(outOfStock && this.bool('hide_when_out_of_stock', false));
    if (next !== this.visible) {
      this.visible = next;
      this.emit('visibility', { visible: next });
    }
  }

  private get isOutOfStock(): boolean {
    const p = this.product;
    return !!p && (p.is_out_of_stock === true || p.is_available === false);
  }

  private get hasOptions(): boolean {
    const p = this.product;
    return !!p && (p.has_options === true || (Array.isArray(p.options) && p.options.length > 0));
  }

  private get maxQuantity(): number {
    const p = this.product;
    const max = Number(p?.max_quantity ?? 0);
    return max > 0 ? max : 99;
  }

  private setQuantity(q: number): void {
    this.quantity = clamp(q, 1, this.maxQuantity);
  }

  private async add(): Promise<void> {
    const p = this.product;
    if (!p || this.addState === 'adding' || this.isOutOfStock) return;
    const id = Number(p.id);
    if (this.hasOptions) {
      this.emit('options-required', { productId: id });
      const form = FORM_SELECTORS.map((s) => document.querySelector<HTMLElement>(s)).find(Boolean);
      if (form) {
        form.scrollIntoView({ behavior: this.reducedMotion ? 'auto' : 'smooth', block: 'center' });
        this.delay(500, () => form.querySelector<HTMLElement>('select, input, button')?.focus?.());
      } else if (p.url) {
        window.location.href = p.url;
      }
      return;
    }
    this.addState = 'adding';
    let ok = false;
    try {
      ok = await addToCart(id, this.quantity);
      this.addState = ok ? 'added' : 'failed';
    } catch {
      this.addState = 'failed';
    }
    this.emit('add-to-cart', { productId: id, quantity: this.quantity, ok });
    this.delay(2200, () => {
      this.addState = 'idle';
    });
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === 'empty') return html`<div class="sh-empty" part="empty">${this.t('no_product')}</div>`;

    const surface = this.choice<BarSurface>('surface', SURFACES, 'light');
    const shadow = this.bool('shadow', true);
    const offset = this.num('offset_px', 0, 0, 200);
    const p = this.product;
    const loading = this.phase === 'loading' || !p;
    const showImage = this.bool('show_image', true);
    const showName = this.bool('show_name', true);
    const showPrice = this.bool('show_price', true);
    const showQty = this.bool('show_quantity', true) && !this.hasOptions;
    const outOfStock = this.isOutOfStock;
    const image = p?.image?.url || p?.images?.find((i) => i.main)?.url || p?.images?.[0]?.url || '';
    const price = p ? priceOf(p) : { current: undefined, original: undefined };

    let buttonLabel = this.text('button_text', 'add') || p?.add_to_cart_label || this.t('add');
    if (this.hasOptions) buttonLabel = this.text('options_hint', 'options');
    if (outOfStock) buttonLabel = this.text('out_of_stock_text', 'out_of_stock');
    if (this.addState === 'adding') buttonLabel = this.t('adding');
    if (this.addState === 'added') buttonLabel = this.t('added');
    if (this.addState === 'failed') buttonLabel = this.t('failed');

    return html`
      <div
        class=${classMap({ bar: true, [`bar--${surface}`]: true, 'bar--shadow': shadow })}
        style="--sb-offset:${offset}px"
        part="bar"
        role="region"
        aria-label=${this.t('region_label')}
        aria-busy=${String(loading)}
      >
        <div class="inner">
          ${showImage
            ? loading
              ? html`<span class="thumb sh-skeleton"></span>`
              : image
                ? html`<img class="thumb" part="image" src=${image} alt="" width="48" height="48" loading="lazy" />`
                : nothing
            : nothing}
          <div class="info">
            ${loading
              ? html`<span class="sh-skeleton skel-name"></span><span class="sh-skeleton skel-price"></span>`
              : html`
                  ${showName ? html`<p class="name" part="name">${p?.name ?? ''}</p>` : nothing}
                  ${showPrice
                    ? html`<div class="price" part="price">
                        <span class="now">${money(price.current)}</span>
                        ${price.original ? html`<s class="was">${money(price.original)}</s>` : nothing}
                      </div>`
                    : nothing}
                `}
          </div>
          <slot name="extra"></slot>
          ${showQty && !loading && !outOfStock
            ? html`<div class="qty" part="quantity" role="group" aria-label=${this.t('quantity')}>
                <button type="button" aria-label=${this.t('decrease')} ?disabled=${this.quantity <= 1} @click=${() => this.setQuantity(this.quantity - 1)}>
                  ${iconMinus()}
                </button>
                <output aria-live="polite">${num(this.quantity)}</output>
                <button type="button" aria-label=${this.t('increase')} ?disabled=${this.quantity >= this.maxQuantity} @click=${() => this.setQuantity(this.quantity + 1)}>
                  ${iconPlus()}
                </button>
              </div>`
            : nothing}
          <slot name="button">
            <button
              class=${classMap({ 'sh-btn': true, 'sh-btn--primary': true, add: true, [`add--${this.addState}`]: this.addState !== 'idle' })}
              part="button"
              type="button"
              ?disabled=${loading || outOfStock || this.addState === 'adding'}
              aria-disabled=${String(loading || outOfStock)}
              @click=${this.add}
            >
              ${this.addState === 'adding' ? html`<span class="spinner" aria-hidden="true"></span>` : this.addState === 'added' ? iconCheck() : iconCart()}
              <span>${buttonLabel}</span>
            </button>
          </slot>
        </div>
      </div>
    `;
  }
}
