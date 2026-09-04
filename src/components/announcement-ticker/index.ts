import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconBolt, iconClose, iconMegaphone, sallaIconStylesheet, sicon } from '../../shared/icons';
import { sessionGet, sessionSet } from '../../shared/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { TickerBackground, TickerFontSize, TickerItem, TickerMode, TickerRow, TickerSeparator } from './types';

const MODES = ['marquee', 'rotate', 'static'] as const;
const SEPARATORS = ['dot', 'line', 'icon', 'none'] as const;
const BACKGROUNDS = ['primary', 'dark', 'light', 'custom'] as const;
const FONT_SIZES = ['sm', 'md'] as const;

const pauseIcon = () =>
  html`<svg class="sh-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>`;
const playIcon = () =>
  html`<svg class="sh-svg sh-svg--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>`;

/**
 * `<salla-announcement-ticker>` — marquee / rotating / static announcement bar.
 *
 * Properties: `config`, `mode`, `sticky` (reflected), `paused`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:dismiss`, `shohrah:announcement-click` ({ index, text, href }).
 * Slots: none (content is merchant-driven).
 * CSS parts: `root`, `message`, `dismiss`, `toggle`.
 */
export default class AnnouncementTicker extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'announcement-ticker';
  protected readonly messages = messages;

  @property({ type: String }) mode?: TickerMode;
  @property({ type: Boolean, reflect: true }) sticky = false;
  @property({ type: Boolean }) paused = false;

  @state() private dismissed = false;
  @state() private active = 0;
  private stopRotate?: () => void;

  private get items(): TickerItem[] {
    const rows = this.list<TickerRow>('items');
    const list: TickerItem[] =
      rows.length > 0
        ? rows.map((row) => ({
            text: this.rowText(row, 'text'),
            icon: this.rowText(row, 'icon'),
            href: this.linkValue(row.link),
          }))
        : [1, 2, 3].map((i) => ({ text: this.t(`default_${i}`), icon: '', href: '' }));
    return list.filter((it) => it.text);
  }

  private get dismissKey(): string {
    return `ticker.dismissed.${this.items.map((i) => i.text).join('|').length}`;
  }

  private get effectiveMode(): TickerMode {
    const wanted = this.mode ?? this.choice('mode', MODES, 'marquee');
    return wanted === 'marquee' && this.reducedMotion ? 'rotate' : wanted;
  }

  protected onSallaReady(): void {
    this.sticky = this.sticky || this.bool('sticky', false);
    if (this.bool('dismissible', false) && sessionGet<boolean>(this.dismissKey, false)) this.dismissed = true;
    this.phase = 'ready';
    this.setupRotation();
    this.listen(document, 'visibilitychange', () => this.setupRotation());
  }

  protected updated(): void {
    // Re-evaluate rotation when config changes mode/interval.
    if (this.phase === 'ready') this.setupRotation();
  }

  private setupRotation(): void {
    const shouldRotate =
      this.effectiveMode === 'rotate' && !this.paused && !this.dismissed && document.visibilityState === 'visible' && this.items.length > 1;
    if (!shouldRotate) {
      this.stopRotate?.();
      this.stopRotate = undefined;
      return;
    }
    if (this.stopRotate) return;
    const seconds = this.num('rotate_seconds', 5, 2, 30);
    this.stopRotate = this.every(seconds * 1000, () => {
      this.active = (this.active + 1) % this.items.length;
    });
  }

  private dismiss(): void {
    this.dismissed = true;
    sessionSet(this.dismissKey, true, 60 * 12);
    this.emit('dismiss');
  }

  private togglePause(): void {
    this.paused = !this.paused;
  }

  private onClick(index: number, item: TickerItem): void {
    this.emit('announcement-click', { index, text: item.text, href: item.href });
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.dismissed) return nothing;
    const items = this.items;
    if (items.length === 0) return html`<div class="sh-empty" part="empty">${this.t('empty')}</div>`;

    const mode = this.effectiveMode;
    const separator = this.choice<TickerSeparator>('separator', SEPARATORS, 'dot');
    const background = this.choice<TickerBackground>('background', BACKGROUNDS, 'primary');
    const fontSize = this.choice<TickerFontSize>('font_size', FONT_SIZES, 'sm');
    const showIcons = this.bool('show_icons', true);
    const dismissible = this.bool('dismissible', false);
    const hoverPause = this.bool('pause_on_hover', true);
    const height = this.num('height_px', 40, 32, 64);
    const speed = this.num('speed_seconds', 25, 8, 120);
    const usesSallaIcons = showIcons && items.some((it) => it.icon.startsWith('sicon-'));

    let vars = `--tk-h:${height}px;--tk-speed:${Math.max(speed, items.length * 4)}s`;
    if (background === 'custom') {
      const bg = this.color('custom_bg', '#111827');
      const fg = this.color('custom_text', this.readableOn(bg));
      vars += `;--tk-bg:${bg};--tk-fg:${fg}`;
    }

    const classes = {
      root: true,
      [`root--${mode}`]: true,
      [`root--${background}`]: background !== 'custom',
      [`root--${fontSize}`]: true,
      'root--dismissible': dismissible,
      'root--hoverpause': hoverPause,
      'root--paused': this.paused,
    };

    return html`
      ${usesSallaIcons ? sallaIconStylesheet() : nothing}
      <div class=${classMap(classes)} style=${vars} part="root" role="region" aria-label=${this.t('region_label')}>
        ${mode === 'marquee' ? this.renderMarquee(items, separator, showIcons) : nothing}
        ${mode === 'rotate' ? this.renderRotate(items, showIcons) : nothing}
        ${mode === 'static' ? this.renderStatic(items, separator, showIcons) : nothing}
        ${dismissible
          ? html`<button class="dismiss" part="dismiss" type="button" aria-label=${this.text('dismiss_label', 'dismiss')} @click=${this.dismiss}>
              ${iconClose()}
            </button>`
          : nothing}
      </div>
    `;
  }

  private renderMessage(item: TickerItem, index: number, showIcons: boolean, extra: Record<string, unknown> = {}) {
    const icon = showIcons ? sicon(item.icon, iconBolt) : nothing;
    const content = html`${icon}<span>${item.text}</span>`;
    return item.href
      ? html`<a class="msg" part="message" href=${item.href} data-active=${String(extra.active ?? '')} @click=${() => this.onClick(index, item)}>${content}</a>`
      : html`<span class="msg" part="message" data-active=${String(extra.active ?? '')}>${content}</span>`;
  }

  private renderSeparator(kind: TickerSeparator): TemplateResult | typeof nothing {
    if (kind === 'none') return nothing;
    return html`<span class="sep sep--${kind}" aria-hidden="true">${kind === 'icon' ? iconMegaphone() : nothing}</span>`;
  }

  private renderMarquee(items: TickerItem[], separator: TickerSeparator, showIcons: boolean) {
    const group = (hidden: boolean) =>
      html`<div class="group" aria-hidden=${String(hidden)}>
        ${items.map((it, i) => html`${this.renderMessage(it, i, showIcons)}${this.renderSeparator(separator)}`)}
      </div>`;
    return html`
      <button class="toggle" part="toggle" type="button" aria-pressed=${String(this.paused)} aria-label=${this.paused ? this.t('play') : this.t('pause')} @click=${this.togglePause}>
        ${this.paused ? playIcon() : pauseIcon()}
      </button>
      <ul class="sr-only">
        ${items.map((it) => html`<li>${it.text}</li>`)}
      </ul>
      <div class="viewport">
        <div class="track">${group(true)}${group(true)}</div>
      </div>
    `;
  }

  private renderRotate(items: TickerItem[], showIcons: boolean) {
    const active = Math.min(this.active, items.length - 1);
    return html`
      ${items.length > 1
        ? html`<button class="toggle" part="toggle" type="button" aria-pressed=${String(this.paused)} aria-label=${this.paused ? this.t('play') : this.t('pause')} @click=${this.togglePause}>
            ${this.paused ? playIcon() : pauseIcon()}
          </button>`
        : nothing}
      <div class="rotate" aria-live="polite" aria-atomic="true">
        ${items.map((it, i) => this.renderMessage(it, i, showIcons, { active: i === active }))}
      </div>
    `;
  }

  private renderStatic(items: TickerItem[], separator: TickerSeparator, showIcons: boolean) {
    return html`<div class="static">
      ${items.map((it, i) => html`${i > 0 ? this.renderSeparator(separator) : nothing}${this.renderMessage(it, i, showIcons)}`)}
    </div>`;
  }
}
