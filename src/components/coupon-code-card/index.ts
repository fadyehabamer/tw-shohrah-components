import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconCheck, iconClock, iconTag, sallaIconStylesheet, sicon } from '../../shared/icons';
import { num } from '../../shared/format';
import { getSalla } from '../../shared/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { ApplyState, CopyState, CouponAction, CouponExpired, CouponStyle } from './types';

const ACTIONS = ['copy', 'apply', 'both'] as const;
const STYLES = ['ticket', 'card', 'inline'] as const;
const EXPIRED = ['hide', 'message'] as const;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * `<salla-coupon-code-card>` — promo code with click-to-copy and one-tap apply through `salla.cart.addCoupon`.
 *
 * Properties: `config`, `code`.
 * Events: `shohrah:coupon-copied` ({ code }), `shohrah:coupon-applied` ({ code }), `shohrah:coupon-failed` ({ code, message }).
 * Slots: `title`, `description`, `conditions`.
 * CSS parts: `root`, `icon`, `title`, `description`, `code`, `copy`, `apply`, `conditions`, `expiry`.
 */
export default class CouponCodeCard extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'coupon-code-card';
  protected readonly messages = messages;

  @property({ type: String }) code?: string;

  @state() private copyState: CopyState = 'idle';
  @state() private applyState: ApplyState = 'idle';
  @state() private failMessage = '';

  private get effectiveCode(): string {
    return (this.code || this.str('code', '')).trim();
  }

  private get expiresAt(): number | undefined {
    if (!this.bool('show_expiry', false)) return undefined;
    const t = Date.parse(this.str('expires_at', ''));
    return Number.isFinite(t) ? t : undefined;
  }

  protected onSallaReady(): void {
    this.phase = this.effectiveCode ? 'ready' : 'empty';
    // Re-evaluate expiry once a minute so a live page flips at the deadline.
    this.every(60_000, () => this.requestUpdate());
  }

  private async copy(): Promise<void> {
    const code = this.effectiveCode;
    const ok = await copyToClipboard(code);
    if (!ok) return;
    this.copyState = 'copied';
    this.emit('coupon-copied', { code });
    this.delay(2200, () => {
      this.copyState = 'idle';
    });
  }

  private async apply(): Promise<void> {
    if (this.applyState === 'applying') return;
    const code = this.effectiveCode;
    const salla = getSalla();
    if (!salla?.cart?.addCoupon) {
      this.applyState = 'failed';
      this.failMessage = this.t('apply_failed');
      return;
    }
    this.applyState = 'applying';
    this.failMessage = '';
    try {
      await salla.cart.addCoupon(code);
      this.applyState = 'applied';
      this.emit('coupon-applied', { code });
    } catch (err) {
      const e = err as { response?: { data?: { error?: { message?: string } } }; message?: string };
      const message = e?.response?.data?.error?.message || this.t('apply_failed');
      this.applyState = 'failed';
      this.failMessage = message;
      this.emit('coupon-failed', { code, message });
    }
    this.delay(3000, () => {
      if (this.applyState !== 'applying') this.applyState = 'idle';
    });
  }

  private formatExpiry(ts: number): string {
    try {
      return new Intl.DateTimeFormat(this.locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-arab' : 'en-GB', { day: 'numeric', month: 'long' }).format(new Date(ts));
    } catch {
      return new Date(ts).toLocaleDateString();
    }
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === 'empty' || !this.effectiveCode) return html`<div class="sh-empty" part="empty">${this.t('missing_code')}</div>`;
    if (this.phase === 'loading') return nothing;

    const code = this.effectiveCode;
    const style = this.choice<CouponStyle>('style', STYLES, 'ticket');
    const action = this.choice<CouponAction>('action', ACTIONS, 'both');
    const expiredBehavior = this.choice<CouponExpired>('expired_behavior', EXPIRED, 'hide');
    const dashed = this.bool('dashed', true);
    const showIcon = this.bool('show_icon', true);
    const iconName = this.str('icon', '');
    const maxWidth = this.num('max_width', 480, 280, 1200);
    let vars = `--cc-max:${maxWidth}px`;
    if (!this.bool('use_theme_color', true)) {
      const c = this.color('accent_color', '#1f5c5a');
      vars += `;--cc-accent:${c};--cc-on-accent:${this.readableOn(c)}`;
    }

    const expiresAt = this.expiresAt;
    const expired = expiresAt !== undefined && expiresAt < Date.now();
    if (expired) {
      if (expiredBehavior === 'hide') return nothing;
      return html`<div class=${classMap({ root: true, [`root--${style}`]: true })} style=${vars} part="root">
        <p class="expired" role="status">${this.text('expired_text', 'expired')}</p>
      </div>`;
    }
    const daysLeft = expiresAt !== undefined ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 86_400_000)) : undefined;

    const canCopy = action === 'copy' || action === 'both';
    const canApply = action === 'apply' || action === 'both';
    const conditions = this.str('conditions');
    const description = this.str('description');

    return html`
      ${iconName.startsWith('sicon-') ? sallaIconStylesheet() : nothing}
      <div class=${classMap({ root: true, [`root--${style}`]: true })} style=${vars} part="root">
        ${showIcon ? html`<span class="icon" part="icon" aria-hidden="true">${sicon(iconName, iconTag)}</span>` : nothing}
        <div class="body">
          <slot name="title"><p class="title" part="title">${this.text('title', 'title')}</p></slot>
          ${description ? html`<slot name="description"><p class="desc" part="description">${description}</p></slot>` : nothing}

          <div class="code-row">
            <button
              class=${classMap({ code: true, 'code--dashed': dashed, 'code--copied': this.copyState === 'copied' })}
              part="code"
              type="button"
              aria-label=${this.t('copy_aria', { code })}
              @click=${canCopy ? this.copy : nothing}
            >
              ${this.copyState === 'copied' ? iconCheck() : nothing}<span>${code}</span>
            </button>
            <div class="actions">
              ${canCopy
                ? html`<button
                    class=${classMap({ 'sh-btn': true, 'sh-btn--ghost': this.copyState !== 'copied', btn: true, 'btn--copied': this.copyState === 'copied' })}
                    part="copy"
                    type="button"
                    @click=${this.copy}
                  >
                    ${this.copyState === 'copied' ? html`${iconCheck()} ${this.text('copied_text', 'copied')}` : this.text('copy_text', 'copy')}
                  </button>`
                : nothing}
              ${canApply
                ? html`<button
                    class=${classMap({ 'sh-btn': true, 'sh-btn--primary': true, btn: true, [`btn--${this.applyState}`]: this.applyState !== 'idle' && this.applyState !== 'applying' })}
                    part="apply"
                    type="button"
                    ?disabled=${this.applyState === 'applying'}
                    @click=${this.apply}
                  >
                    ${this.applyState === 'applying'
                      ? html`<span class="spinner" aria-hidden="true"></span> ${this.t('applying')}`
                      : this.applyState === 'applied'
                        ? html`${iconCheck()} ${this.text('applied_text', 'applied')}`
                        : this.text('apply_text', 'apply')}
                  </button>`
                : nothing}
            </div>
          </div>

          ${this.applyState === 'failed' && this.failMessage ? html`<p class="feedback" role="alert">${this.failMessage}</p>` : nothing}
          ${conditions ? html`<slot name="conditions"><p class="conditions" part="conditions">${conditions}</p></slot>` : nothing}
          ${expiresAt !== undefined
            ? html`<p class="expiry" part="expiry">
                ${iconClock()}
                <span>${this.t('expires', { date: this.formatExpiry(expiresAt) })}${daysLeft !== undefined && daysLeft <= 14 ? ` · ${this.t('expires_in', { n: num(daysLeft) })}` : ''}</span>
              </p>`
            : nothing}
        </div>
      </div>
    `;
  }
}
