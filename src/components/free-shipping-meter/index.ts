import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconArrowEnd, iconCheck, iconTruck, sallaIconStylesheet, sicon } from '../../shared/icons';
import { clamp, money } from '../../shared/format';
import { fetchCartSummary, onCartUpdated, storeUrl } from '../../shared/salla';
import type { SallaCartSummary } from '../../types/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { MeterState, MeterStyle } from './types';

const STYLES = ['bar', 'pill', 'line'] as const;

/**
 * `<salla-free-shipping-meter>` — progress towards the store's free-shipping threshold, live with the cart.
 *
 * Properties: `config`, `threshold` (number override), `meterStyle`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:free-shipping-reached`, `shohrah:cart-progress` ({ subtotal, threshold, percent }).
 * Slots: `cta`.
 * CSS parts: `root`, `icon`, `message`, `bar`, `fill`, `amounts`, `cta`.
 */
export default class FreeShippingMeter extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'free-shipping-meter';
  protected readonly messages = messages;

  @property({ type: Number }) threshold?: number;
  @property({ type: String, attribute: 'meter-style' }) meterStyle?: MeterStyle;

  @state() private meter?: MeterState;
  @state() private celebrating = false;
  private wasReached = false;

  protected async onSallaReady(): Promise<void> {
    this.addDisposer(onCartUpdated((cart) => this.apply(cart)));
    try {
      const cart = await fetchCartSummary();
      this.apply(cart);
    } catch (err) {
      // A cart that does not exist yet is not an error for the shopper: show the empty state.
      this.apply(undefined);
      this.salla?.log?.('[shohrah:free-shipping-meter] cart unavailable', err);
    }
  }

  private apply(cart: SallaCartSummary | undefined): void {
    const subtotal = Number(cart?.sub_total ?? 0) || 0;
    const count = Number(cart?.count ?? 0) || 0;
    const override = this.threshold ?? this.num('threshold_override', 200, 0, 1_000_000);
    const bar = cart?.free_shipping_bar;
    const threshold = override > 0 ? override : Number(bar?.minimum_amount ?? 0) || 0;
    if (threshold <= 0) {
      this.meter = undefined;
      this.phase = 'empty';
      return;
    }
    const reached = override > 0 ? subtotal >= threshold : Boolean(bar?.has_free_shipping) || subtotal >= threshold;
    const remaining = Math.max(0, threshold - subtotal);
    const percent = reached ? 100 : clamp(Math.round((subtotal / threshold) * 100), 0, 100);
    this.meter = { subtotal, threshold, remaining, percent, reached, count };
    this.phase = 'ready';
    this.emit('cart-progress', { subtotal, threshold, percent });
    if (reached && !this.wasReached) {
      this.emit('free-shipping-reached');
      if (this.bool('celebrate', true) && !this.reducedMotion) {
        this.celebrating = true;
        this.delay(3400, () => {
          this.celebrating = false;
        });
      }
    }
    this.wasReached = reached;
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const style = this.meterStyle ?? this.choice('style', STYLES, 'bar');
    const showCta = this.bool('show_cta', true);
    const showAmounts = this.bool('show_amounts', true) && style !== 'pill';
    const iconName = this.str('icon', '');
    const useTheme = this.bool('use_theme_color', true);
    const vars = useTheme
      ? ''
      : `--fs-color:${this.color('bar_color', '#1f5c5a')};--fs-reached:${this.color('reached_color', '#15803d')}`;

    if (this.phase === 'loading') {
      return html`<div class=${classMap({ root: true, [`root--${style}`]: true })} part="root" aria-busy="true">
        <div class="row"><span class="sh-skeleton icon"></span><span class="sh-skeleton skel-row"></span></div>
        ${style === 'pill' ? nothing : html`<div class="sh-skeleton skel-bar"></div>`}
      </div>`;
    }
    if (this.phase === 'empty' || !this.meter) {
      return html`<div class="sh-empty" part="empty">${this.t('unavailable')}</div>`;
    }

    const m = this.meter;
    const isEmptyCart = m.subtotal <= 0;
    if (isEmptyCart && !this.bool('show_when_empty', true)) return nothing;
    if (m.reached && this.bool('hide_when_reached', false)) return nothing;

    const amount = money(m.remaining);
    const message = m.reached
      ? this.text('message_reached', 'reached')
      : isEmptyCart
        ? this.text('message_empty', 'empty', { amount: money(m.threshold) })
        : this.text('message_remaining', 'remaining', { amount });
    const parts = message.split(amount);

    return html`
      ${iconName.startsWith('sicon-') ? sallaIconStylesheet() : nothing}
      <div
        class=${classMap({ root: true, [`root--${style}`]: true, 'root--reached': m.reached, 'root--celebrate': this.celebrating })}
        style=${vars}
        part="root"
      >
        <div class="row">
          <span class="icon" part="icon" aria-hidden="true">${m.reached ? iconCheck() : sicon(iconName, iconTruck)}</span>
          <p class="msg" part="message" role="status" aria-live="polite">
            ${!m.reached && !isEmptyCart && parts.length === 2
              ? html`${parts[0]}<strong>${amount}</strong>${parts[1]}`
              : message}
          </p>
          ${showCta && !isEmptyCart
            ? html`<slot name="cta"><a class="sh-btn sh-btn--ghost cta" part="cta" href=${storeUrl('cart')}>${this.text('cta_text', 'cta')} ${iconArrowEnd()}</a></slot>`
            : nothing}
        </div>
        ${style === 'pill'
          ? nothing
          : html`<div
              class="bar"
              part="bar"
              role="progressbar"
              aria-label=${this.t('progress_label')}
              aria-valuemin="0"
              aria-valuemax=${m.threshold}
              aria-valuenow=${Math.min(m.subtotal, m.threshold)}
              aria-valuetext=${this.t('of', { current: money(Math.min(m.subtotal, m.threshold)), target: money(m.threshold) })}
            >
              <div class="fill" part="fill" style="--fs-percent:${m.percent}%"></div>
            </div>`}
        ${showAmounts
          ? html`<p class="amounts" part="amounts"><span>${money(m.subtotal)}</span><span>${money(m.threshold)}</span></p>`
          : nothing}
      </div>
    `;
  }
}
