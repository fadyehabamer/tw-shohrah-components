import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconFire, sallaIconStylesheet, sicon } from '../../shared/icons';
import { clamp, num } from '../../shared/format';
import { currentProductId, fetchProductDetails } from '../../shared/salla';
import type { SallaProduct } from '../../types/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { ScarcityColorMode, ScarcityStyle, StockInfo } from './types';

const COLOR_MODES = ['theme', 'traffic', 'custom'] as const;
const STYLES = ['card', 'inline', 'minimal'] as const;

function readStock(p: SallaProduct): StockInfo {
  const hidden = p.is_hidden_quantity === true || p.can_show_remained_quantity === false;
  const q = p.quantity;
  const quantity = !hidden && q != null && Number.isFinite(Number(q)) ? Number(q) : null;
  const soldRaw = p.sold_quantity;
  const sold = p.can_show_sold !== false && soldRaw != null && Number.isFinite(Number(soldRaw)) ? Number(soldRaw) : null;
  return { quantity, sold, outOfStock: Boolean(p.is_out_of_stock) || (quantity !== null && quantity <= 0) };
}

/**
 * `<salla-stock-scarcity-bar>` — "only N left" indicator from live product quantity.
 *
 * Properties: `config`, `productId` (overrides page/product field).
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:stock-loaded` ({ productId, quantity, sold, shown }).
 * Slots: `title`.
 * CSS parts: `root`, `icon`, `title`, `message`, `bar`, `fill`, `sold`.
 */
export default class StockScarcityBar extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'stock-scarcity-bar';
  protected readonly messages = messages;

  @property({ type: Number, attribute: 'product-id' }) productId?: number;

  @state() private stock?: StockInfo;
  private loadedFor?: number;

  private resolveProductId(): number | undefined {
    return this.productId ?? this.selectedId('product') ?? currentProductId();
  }

  protected async onSallaReady(): Promise<void> {
    await this.load();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if ((changed.has('config') || changed.has('productId')) && this.salla) {
      const id = this.resolveProductId();
      if (id && id !== this.loadedFor) void this.load();
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
      const product = await fetchProductDetails(id, ['sold_quantity']);
      if (!product) throw new Error(this.t('load_error'));
      this.stock = readStock(product);
      this.phase = 'ready';
      this.emit('stock-loaded', { productId: id, quantity: this.stock.quantity, sold: this.stock.sold, shown: this.shouldShow() });
    } catch (err) {
      this.fail(err instanceof Error ? err : new Error(this.t('load_error')));
    }
  }

  private shouldShow(): boolean {
    const s = this.stock;
    if (!s) return false;
    if (s.outOfStock) return true;
    if (s.quantity === null) return !this.bool('hide_when_unknown', true);
    return s.quantity <= this.num('threshold', 10, 1, 10_000);
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === 'empty') return html`<div class="sh-empty" part="empty">${this.t('no_product')}</div>`;

    const style = this.choice<ScarcityStyle>('style', STYLES, 'card');
    if (this.phase === 'loading' || !this.stock) {
      return html`<div class=${classMap({ root: true, [`root--${style}`]: true })} part="root" aria-busy="true">
        <div class="row"><span class="sh-skeleton icon"></span><span class="sh-skeleton skel-a"></span></div>
        <div class="sh-skeleton skel-b"></div>
      </div>`;
    }
    if (!this.shouldShow()) return nothing;

    const s = this.stock;
    const colorMode = this.choice<ScarcityColorMode>('color_mode', COLOR_MODES, 'traffic');
    const showBar = this.bool('show_bar', true) && s.quantity !== null;
    const showSold = this.bool('show_sold', true) && s.sold !== null && s.sold > 0;
    const animate = this.bool('animate', true) && !this.reducedMotion;
    const iconName = this.str('icon', 'sicon-fire');
    const barMax = this.num('bar_max', 50, 1, 100_000);
    const percent = s.quantity === null ? 0 : clamp(Math.round((s.quantity / barMax) * 100), 4, 100);

    let color = 'var(--sh-primary)';
    if (colorMode === 'custom') color = this.color('custom_color', '#c2410c');
    if (colorMode === 'traffic') color = percent > 60 ? 'var(--sh-success)' : percent > 30 ? 'var(--sh-warning)' : 'var(--sh-danger)';
    if (s.outOfStock) color = 'var(--sh-muted)';

    const qty = num(s.quantity ?? 0);
    const message = s.outOfStock ? this.t('out_of_stock') : this.text('message', 'message', { qty });
    const parts = !s.outOfStock ? message.split(qty) : [message];

    return html`
      ${iconName.startsWith('sicon-') ? sallaIconStylesheet() : nothing}
      <div
        class=${classMap({ root: true, [`root--${style}`]: true, 'root--pulse': animate && !s.outOfStock && percent <= 30, 'root--noanim': !animate })}
        style="--sc-color:${color}"
        part="root"
      >
        <div class="row">
          <span class="icon" part="icon" aria-hidden="true">${sicon(iconName, iconFire)}</span>
          <div class="text">
            ${style !== 'minimal' ? html`<slot name="title"><p class="title" part="title">${this.text('title', 'title')}</p></slot>` : nothing}
            <p class="msg" part="message" role="status">
              ${parts.length === 2 ? html`${parts[0]}<strong>${qty}</strong>${parts[1]}` : message}
            </p>
          </div>
        </div>
        ${showBar
          ? html`<div
              class="bar"
              part="bar"
              role="progressbar"
              aria-label=${this.t('progress_label')}
              aria-valuemin="0"
              aria-valuemax=${barMax}
              aria-valuenow=${Math.min(s.quantity ?? 0, barMax)}
            >
              <div class="fill" part="fill" style="--sc-percent:${percent}%"></div>
            </div>`
          : nothing}
        ${showSold ? html`<p class="sold" part="sold">${this.text('sold_message', 'sold', { sold: num(s.sold ?? 0) })}</p>` : nothing}
      </div>
    `;
  }
}
