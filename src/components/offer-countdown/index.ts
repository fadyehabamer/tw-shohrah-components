import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconArrowEnd } from '../../shared/icons';
import { num, pad2 } from '../../shared/format';
import { storageGet, storageSet } from '../../shared/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { CountdownAlign, CountdownBackground, CountdownLayout, CountdownMode, DigitStyle, ExpiredBehavior, Remaining } from './types';

const MODES = ['fixed_date', 'daily', 'evergreen'] as const;
const DIGIT_STYLES = ['boxed', 'minimal', 'pill'] as const;
const LAYOUTS = ['inline', 'stacked'] as const;
const ALIGNS = ['start', 'center'] as const;
const BACKGROUNDS = ['transparent', 'surface', 'primary'] as const;
const EXPIRED = ['hide', 'message'] as const;

function split(ms: number): Remaining {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

/**
 * `<salla-offer-countdown>` — offer banner with a fixed-date, daily-reset, or per-visitor (evergreen) deadline.
 *
 * Properties: `config`, `mode`, `deadline` (ISO string override).
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:countdown-expired`, `shohrah:cta-click` ({ href }).
 * Slots: `title`, `subtitle`, `cta`, `expired`.
 * CSS parts: `root`, `title`, `subtitle`, `timer`, `unit`, `digits`, `label`, `cta`, `expired`.
 */
export default class OfferCountdown extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'offer-countdown';
  protected readonly messages = messages;

  @property({ type: String }) mode?: CountdownMode;
  @property({ type: String }) deadline?: string;

  @state() private remaining: Remaining = split(0);
  @state() private expired = false;
  @state() private invalid = false;
  private deadlineMs = 0;
  private stopTick?: () => void;
  private expiredEmitted = false;

  private get effectiveMode(): CountdownMode {
    return this.mode ?? this.choice('mode', MODES, 'daily');
  }

  protected onSallaReady(): void {
    this.computeDeadline();
    this.tick();
    this.stopTick = this.every(1000, () => this.tick());
    this.phase = 'ready';
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('config') || changed.has('mode') || changed.has('deadline')) {
      if (this.phase === 'ready') {
        this.computeDeadline();
        this.tick();
      }
    }
  }

  private endOfToday(): number {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }

  private computeDeadline(): void {
    this.invalid = false;
    const mode = this.effectiveMode;
    if (this.deadline) {
      const t = Date.parse(this.deadline);
      this.deadlineMs = Number.isFinite(t) ? t : 0;
      this.invalid = !this.deadlineMs;
      return;
    }
    if (mode === 'daily') {
      this.deadlineMs = this.endOfToday();
      return;
    }
    if (mode === 'evergreen') {
      const hours = this.num('evergreen_hours', 24, 1, 168);
      const key = `countdown.evergreen.${hash(this.str('title') + hours)}`;
      const saved = storageGet<number>(key, 0);
      if (saved && saved > Date.now()) {
        this.deadlineMs = saved;
      } else {
        this.deadlineMs = Date.now() + hours * 3600_000;
        storageSet(key, this.deadlineMs);
      }
      return;
    }
    const raw = this.str('end_datetime', '');
    const t = Date.parse(raw);
    if (!raw || !Number.isFinite(t)) {
      this.invalid = true;
      this.deadlineMs = 0;
      return;
    }
    this.deadlineMs = t;
  }

  private tick(): void {
    if (this.invalid) return;
    let diff = this.deadlineMs - Date.now();
    if (diff <= 0 && this.effectiveMode === 'daily') {
      // roll over to the next day seamlessly
      this.deadlineMs = this.endOfToday();
      diff = this.deadlineMs - Date.now();
    }
    this.remaining = split(diff);
    const nowExpired = diff <= 0;
    if (nowExpired !== this.expired) this.expired = nowExpired;
    if (nowExpired && !this.expiredEmitted) {
      this.expiredEmitted = true;
      this.emit('countdown-expired');
      this.stopTick?.();
    }
  }

  private onCta(href: string): void {
    this.emit('cta-click', { href });
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.invalid) return html`<div class="sh-error" role="alert">${this.t('invalid_date')}</div>`;

    const layout = this.choice<CountdownLayout>('layout', LAYOUTS, 'inline');
    const align = this.choice<CountdownAlign>('align', ALIGNS, 'center');
    const digitStyle = this.choice<DigitStyle>('digit_style', DIGIT_STYLES, 'boxed');
    const background = this.choice<CountdownBackground>('background', BACKGROUNDS, 'surface');
    const expiredBehavior = this.choice<ExpiredBehavior>('expired_behavior', EXPIRED, 'hide');
    const showDays = this.bool('show_days', true);
    const showCta = this.bool('show_cta', true);
    const useTheme = this.bool('use_theme_color', true);
    const pulse = this.bool('pulse_last_hour', true) && !this.reducedMotion;
    const href = this.link('cta_link');
    const subtitle = this.str('subtitle');

    let vars = '';
    if (!useTheme) {
      const accent = this.color('accent_color', '#1f5c5a');
      vars = `--cd-accent:${accent};--cd-on-accent:${this.readableOn(accent)}`;
    }

    if (this.expired) {
      if (expiredBehavior === 'hide') return nothing;
      return html`<div class=${classMap({ root: true, [`root--${background}`]: true, 'root--center': true })} style=${vars} part="root">
        <slot name="expired"><p class="expired" part="expired" role="status">${this.text('expired_message', 'expired')}</p></slot>
      </div>`;
    }

    const r = this.remaining;
    const loading = this.phase === 'loading';
    const inLastHour = r.total > 0 && r.total < 3600_000;
    const classes = {
      root: true,
      [`root--${background}`]: background !== 'transparent',
      [`root--${layout}`]: true,
      'root--center': align === 'center',
      'root--pulse': pulse && inLastHour,
    };
    const hoursValue = showDays ? r.hours : r.hours + r.days * 24;
    const srText = this.t('remaining_text', { days: num(r.days), hours: num(r.hours), minutes: num(r.minutes) });

    return html`
      <section class=${classMap(classes)} style=${vars} part="root">
        <div class="copy">
          <slot name="title"><h3 class="title" part="title">${this.text('title', 'title')}</h3></slot>
          ${subtitle ? html`<slot name="subtitle"><p class="subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
        </div>
        ${loading
          ? html`<div class="sh-skeleton skel" aria-hidden="true"></div>`
          : html`<div class="timer" part="timer" role="timer" aria-label=${this.t('timer_label')} aria-live="off">
              <span class="sr-only">${srText}</span>
              ${showDays ? this.renderUnit(r.days, 'days', digitStyle) : nothing}
              ${showDays ? this.renderColon() : nothing}
              ${this.renderUnit(hoursValue, 'hours', digitStyle)}
              ${this.renderColon()}
              ${this.renderUnit(r.minutes, 'minutes', digitStyle)}
              ${this.renderColon()}
              ${this.renderUnit(r.seconds, 'seconds', digitStyle)}
            </div>`}
        ${showCta && href
          ? html`<div class="cta" part="cta">
              <slot name="cta">
                <a class="sh-btn sh-btn--primary" href=${href} @click=${() => this.onCta(href)}>${this.text('cta_text', 'cta')} ${iconArrowEnd()}</a>
              </slot>
            </div>`
          : nothing}
      </section>
    `;
  }

  private renderUnit(value: number, key: 'days' | 'hours' | 'minutes' | 'seconds', style: DigitStyle) {
    return html`<span class="unit" part="unit" aria-hidden="true">
      <span class="digits digits--${style}" part="digits">${num(pad2(value))}</span>
      <span class="label" part="label">${this.t(key)}</span>
    </span>`;
  }

  private renderColon() {
    return html`<span class="colon" aria-hidden="true">:</span>`;
  }
}
