import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconClose, iconWhatsapp } from '../../shared/icons';
import { getSalla, sessionGet, sessionSet, storeContact, storeInfo } from '../../shared/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { ChatColorMode, ChatPosition, ChatSize, LabelMode, ShowOn } from './types';

const LABEL_MODES = ['always', 'hover', 'never'] as const;
const POSITIONS = ['start', 'end'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const COLOR_MODES = ['whatsapp', 'theme', 'custom'] as const;
const SHOW_ON = ['all', 'mobile', 'desktop'] as const;
const SIZE_REM: Record<ChatSize, number> = { sm: 3, md: 3.5, lg: 4 };
const GREETING_KEY = 'whatsapp.greeting.seen';

/**
 * `<salla-whatsapp-chat>` — floating WhatsApp button with greeting bubble and working hours.
 *
 * The click opens `https://wa.me/<number>` in a new tab (a navigation, not a request made by the component).
 *
 * Properties: `config`, `number`, `position` (reflected), `showOn` (reflected).
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:whatsapp-open` ({ href, online }), `shohrah:greeting-dismiss`.
 * Slots: `greeting` (replaces the bubble body).
 * CSS parts: `root`, `button`, `label`, `bubble`, `greeting-title`, `greeting-text`, `greeting-cta`.
 */
export default class WhatsappChat extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'whatsapp-chat';
  protected readonly messages = messages;

  @property({ type: String }) number?: string;
  @property({ type: String, reflect: true }) position: ChatPosition = 'end';
  @property({ type: String, reflect: true, attribute: 'show-on' }) showOn: ShowOn = 'all';

  @state() private greetingOpen = false;
  @state() private online = true;
  private greetingShown = false;

  private get digits(): string {
    const raw = this.number || this.str('number', '') || storeContact('whatsapp') || '';
    let d = raw.replace(/[^\d]/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    // Saudi local formats (05xxxxxxxx / 5xxxxxxxx) → international 9665xxxxxxxx
    if (/^05\d{8}$/.test(d)) d = `966${d.slice(1)}`;
    else if (/^5\d{8}$/.test(d)) d = `966${d}`;
    return d.length >= 8 ? d : '';
  }

  protected onSallaReady(): void {
    this.position = this.choice('position', POSITIONS, this.position);
    this.showOn = this.choice('show_on', SHOW_ON, this.showOn);
    if (!this.digits) {
      this.phase = 'empty';
      return;
    }
    this.phase = 'ready';
    this.updateOnline();
    this.every(60_000, () => this.updateOnline());
    if (this.bool('greeting_enabled', true) && !sessionGet<boolean>(GREETING_KEY, false)) {
      const seconds = this.num('greeting_delay', 4, 0, 60);
      this.delay(seconds * 1000, () => {
        if (!this.greetingShown) {
          this.greetingShown = true;
          this.greetingOpen = true;
        }
      });
    }
  }

  /** Working hours are evaluated in the merchant's timezone (default Asia/Riyadh). */
  private updateOnline(): void {
    if (!this.bool('hours_enabled', false)) {
      this.online = true;
      return;
    }
    const tz = this.str('timezone', 'Asia/Riyadh');
    const parse = (v: string, fallback: number) => {
      const m = /^(\d{1,2}):(\d{2})/.exec(v.trim());
      return m ? Number(m[1]) * 60 + Number(m[2]) : fallback;
    };
    const from = parse(this.str('hours_from', '09:00'), 9 * 60);
    const to = parse(this.str('hours_to', '22:00'), 22 * 60);
    let nowMin: number;
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
      nowMin = h * 60 + m;
    } catch {
      const d = new Date();
      nowMin = d.getHours() * 60 + d.getMinutes();
    }
    this.online = from <= to ? nowMin >= from && nowMin < to : nowMin >= from || nowMin < to;
  }

  private get href(): string {
    const salla = getSalla();
    let page = '';
    try {
      page = String(salla?.config.get('page.title') || document.title || '').trim();
    } catch {
      page = document.title;
    }
    const store = storeInfo('name') || '';
    const product = page || this.t('this_page');
    let text = this.text('message', 'message', { store, product, page: product });
    if (this.bool('include_url', true)) text += `\n${window.location.href}`;
    return `https://wa.me/${this.digits}?text=${encodeURIComponent(text)}`;
  }

  private onOpen(): void {
    this.emit('whatsapp-open', { href: this.href, online: this.online });
    this.closeGreeting(false);
  }

  private closeGreeting(emit = true): void {
    this.greetingOpen = false;
    sessionSet(GREETING_KEY, true, 60 * 12);
    if (emit) this.emit('greeting-dismiss');
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === 'empty') return html`<div class="sh-empty" part="empty">${this.t('missing_number')}</div>`;
    if (this.phase === 'loading') return nothing;

    const labelMode = this.choice<LabelMode>('label_mode', LABEL_MODES, 'hover');
    const size = this.choice<ChatSize>('size', SIZES, 'md');
    const colorMode = this.choice<ChatColorMode>('color_mode', COLOR_MODES, 'whatsapp');
    const pulse = this.bool('pulse', true) && !this.reducedMotion;
    const label = this.text('label', 'label');
    const hoursEnabled = this.bool('hours_enabled', false);

    let vars = `--wa-size:${SIZE_REM[size]}rem;--wa-bottom:${this.num('offset_bottom', 24, 0, 200)}px;--wa-side:${this.num('offset_side', 24, 0, 200)}px`;
    if (colorMode === 'theme') vars += ';--wa-color:var(--sh-primary);--wa-on:var(--sh-on-primary)';
    if (colorMode === 'custom') {
      const c = this.color('custom_color', '#25d366');
      vars += `;--wa-color:${c};--wa-on:${this.readableOn(c)}`;
    }

    const href = this.href;
    const avatar = this.str('avatar', '') || storeInfo('logo') || '';

    return html`
      <div class="root" part="root" style=${vars}>
        ${this.greetingOpen
          ? html`<div class="bubble" part="bubble" role="dialog" aria-label=${this.text('greeting_title', 'greeting_title')}>
              <button class="close" type="button" aria-label=${this.t('close_greeting')} @click=${() => this.closeGreeting()}>${iconClose()}</button>
              <slot name="greeting">
                <div class="who">
                  ${avatar
                    ? html`<img class="avatar" src=${avatar} alt="" width="40" height="40" loading="lazy" />`
                    : html`<span class="avatar" aria-hidden="true">${iconWhatsapp()}</span>`}
                  <div>
                    <p class="g-title" part="greeting-title">${this.text('greeting_title', 'greeting_title')}</p>
                    ${hoursEnabled ? html`<p class="g-status">${this.online ? this.t('online') : this.t('offline')}</p>` : nothing}
                  </div>
                </div>
                <p class="g-text" part="greeting-text">
                  ${!this.online && hoursEnabled ? this.text('offline_text', 'offline') : this.text('greeting_text', 'greeting_text')}
                </p>
                <a class="sh-btn g-cta" part="greeting-cta" href=${href} target="_blank" rel="noopener noreferrer" @click=${this.onOpen}>
                  ${iconWhatsapp()} ${this.t('start_chat')}
                </a>
              </slot>
            </div>`
          : nothing}
        <a
          class=${classMap({ btn: true, [`btn--${labelMode}`]: true, 'btn--pulse': pulse })}
          part="button"
          href=${href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${label}
          @click=${this.onOpen}
        >
          ${iconWhatsapp()}
          ${labelMode !== 'never' ? html`<span class="text" part="label">${label}</span>` : nothing}
          ${hoursEnabled ? html`<span class=${classMap({ status: true, 'status--off': !this.online })} aria-hidden="true"></span>` : nothing}
        </a>
      </div>
    `;
  }
}
