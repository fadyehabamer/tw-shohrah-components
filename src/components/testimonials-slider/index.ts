import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconArrowEnd, iconArrowStart, iconQuote, iconStar, iconStarOutline } from '../../shared/icons';
import { clamp, num } from '../../shared/format';
import { messages } from './locale';
import { styles } from './styles';
import type { CardStyle, Testimonial, TestimonialAlign, TestimonialRow } from './types';

const CARD_STYLES = ['elevated', 'outlined', 'plain'] as const;
const ALIGNS = ['start', 'center'] as const;

/**
 * `<salla-testimonials-slider>` — scroll-snap carousel of customer quotes.
 *
 * Properties: `config`, `autoplay`, `cardStyle`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:slide-change` ({ index }).
 * Slots: `title`, `subtitle`.
 * CSS parts: `root`, `title`, `subtitle`, `track`, `slide`, `card`, `quote`, `name`, `prev`, `next`, `dots`.
 */
export default class TestimonialsSlider extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'testimonials-slider';
  protected readonly messages = messages;

  @property({ type: Boolean }) autoplay?: boolean;
  @property({ type: String, attribute: 'card-style' }) cardStyle?: CardStyle;

  @state() private index = 0;
  @state() private pages = 1;
  @state() private hovering = false;
  @query('.track') private trackEl?: HTMLElement;
  private stopAuto?: () => void;
  private scrollRaf = 0;
  private resizeObs?: ResizeObserver;

  private get items(): Testimonial[] {
    const rows = this.list<TestimonialRow>('items');
    const list: Testimonial[] =
      rows.length > 0
        ? rows.map((row) => ({
            name: this.rowText(row, 'name'),
            meta: this.rowText(row, 'meta'),
            quote: this.rowText(row, 'quote'),
            rating: clamp(Number(row.rating ?? 5) || 5, 1, 5),
            avatar: this.rowText(row, 'avatar'),
          }))
        : [1, 2, 3, 4].map((i) => ({
            name: this.t(`default_${i}_name`),
            meta: this.t(`default_${i}_meta`),
            quote: this.t(`default_${i}_quote`),
            rating: i === 4 ? 4 : 5,
            avatar: '',
          }));
    return list.filter((it) => it.quote);
  }

  protected onSallaReady(): void {
    this.phase = 'ready';
    this.updateComplete.then(() => {
      if (!this.trackEl) return;
      this.listen(this.trackEl, 'scroll', () => this.onScroll(), { passive: true });
      this.resizeObs = this.own(new ResizeObserver(() => this.measure()));
      this.resizeObs.observe(this.trackEl);
      this.listen(document, 'visibilitychange', () => this.setupAutoplay());
      this.measure();
      this.setupAutoplay();
    });
  }

  private slideWidth(): number {
    const first = this.trackEl?.querySelector<HTMLElement>('.slide');
    if (!first || !this.trackEl) return 1;
    const gap = parseFloat(getComputedStyle(this.trackEl).columnGap || getComputedStyle(this.trackEl).gap || '16') || 16;
    return first.getBoundingClientRect().width + gap;
  }

  private perView(): number {
    if (!this.trackEl) return 1;
    const w = this.trackEl.clientWidth;
    const slide = this.slideWidth();
    return Math.max(1, Math.round((w + 1) / slide));
  }

  private measure(): void {
    const n = this.items.length;
    this.pages = Math.max(1, n - this.perView() + 1);
    this.index = clamp(this.index, 0, this.pages - 1);
  }

  private onScroll(): void {
    if (this.scrollRaf) return;
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      if (!this.trackEl) return;
      const next = clamp(Math.round(Math.abs(this.trackEl.scrollLeft) / this.slideWidth()), 0, this.pages - 1);
      if (next !== this.index) {
        this.index = next;
        this.emit('slide-change', { index: next });
      }
    });
  }

  private goTo(i: number): void {
    if (!this.trackEl) return;
    const loop = this.bool('loop', true);
    let target = i;
    if (i >= this.pages) target = loop ? 0 : this.pages - 1;
    if (i < 0) target = loop ? this.pages - 1 : 0;
    const distance = target * this.slideWidth();
    this.trackEl.scrollTo({ left: this.rtl ? -distance : distance, behavior: this.reducedMotion ? 'auto' : 'smooth' });
  }

  private setupAutoplay(): void {
    const enabled = (this.autoplay ?? this.bool('autoplay', true)) && !this.reducedMotion;
    const active = enabled && document.visibilityState === 'visible' && !this.hovering && this.items.length > 1;
    if (!active) {
      this.stopAuto?.();
      this.stopAuto = undefined;
      return;
    }
    if (this.stopAuto) return;
    const seconds = this.num('interval_seconds', 6, 3, 15);
    this.stopAuto = this.every(seconds * 1000, () => this.goTo(this.index + 1));
  }

  private setHover(v: boolean): void {
    this.hovering = v;
    this.setupAutoplay();
  }

  private onTrackKeydown(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const forward = this.rtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
    this.goTo(this.index + (forward ? 1 : -1));
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const items = this.items;
    if (items.length === 0) return html`<div class="sh-empty" part="empty">${this.t('empty')}</div>`;

    const cardStyle = this.cardStyle ?? this.choice('card_style', CARD_STYLES, 'elevated');
    const align = this.choice<TestimonialAlign>('align', ALIGNS, 'start');
    const showArrows = this.bool('show_arrows', true) && items.length > 1;
    const showDots = this.bool('show_dots', true) && this.pages > 1;
    const showRating = this.bool('show_rating', true);
    const showAvatar = this.bool('show_avatar', true);
    const showQuoteIcon = this.bool('show_quote_icon', true);
    const desktop = this.num('slides_desktop', 3, 1, 4);
    const mobile = this.num('slides_mobile', 1, 1, 2);
    const subtitle = this.str('subtitle');

    return html`
      <section
        class="root"
        part="root"
        style="--ts-desktop:${desktop};--ts-per-view:${mobile}"
        role="region"
        aria-roledescription="carousel"
        aria-label=${this.t('region_label')}
        @mouseenter=${() => this.setHover(true)}
        @mouseleave=${() => this.setHover(false)}
        @focusin=${() => this.setHover(true)}
        @focusout=${() => this.setHover(false)}
      >
        <div class="head">
          <div class="sh-header">
            <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
            ${subtitle ? html`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
          </div>
          ${showArrows
            ? html`<div class="controls">
                <button class="sh-icon-btn" part="prev" type="button" aria-label=${this.t('prev')} @click=${() => this.goTo(this.index - 1)}>
                  ${iconArrowStart()}
                </button>
                <button class="sh-icon-btn" part="next" type="button" aria-label=${this.t('next')} @click=${() => this.goTo(this.index + 1)}>
                  ${iconArrowEnd()}
                </button>
              </div>`
            : nothing}
        </div>

        <div class="track" part="track" tabindex="0" aria-live=${this.stopAuto ? 'off' : 'polite'} @keydown=${this.onTrackKeydown}>
          ${items.map(
            (it, i) => html`<div
              class="slide"
              part="slide"
              role="group"
              aria-roledescription="slide"
              aria-label=${this.t('slide_of', { n: num(i + 1), total: num(items.length) })}
            >
              <article class=${classMap({ card: true, [`card--${cardStyle}`]: true, 'card--center': align === 'center' })} part="card">
                ${showQuoteIcon ? html`<span class="quote-icon" aria-hidden="true">${iconQuote()}</span>` : nothing}
                ${showRating ? this.renderStars(it.rating) : nothing}
                <blockquote class="quote" part="quote"><p style="margin:0">${it.quote}</p></blockquote>
                <footer class="person">
                  ${showAvatar ? this.renderAvatar(it) : nothing}
                  <div class="who">
                    ${it.name ? html`<cite class="name" part="name" style="font-style:normal">${it.name}</cite>` : nothing}
                    ${it.meta ? html`<span class="meta">${it.meta}</span>` : nothing}
                  </div>
                </footer>
              </article>
            </div>`,
          )}
        </div>

        ${showDots
          ? html`<ul class="dots" part="dots" role="list">
              ${Array.from({ length: this.pages }, (_, i) => html`<li>
                <button
                  class="dot"
                  type="button"
                  aria-label=${this.t('go_to', { n: num(i + 1) })}
                  aria-current=${String(i === this.index)}
                  @click=${() => this.goTo(i)}
                ></button>
              </li>`)}
            </ul>`
          : nothing}
      </section>
    `;
  }

  private renderStars(rating: number) {
    return html`<span class="stars" role="img" aria-label=${this.t('rating_label', { n: num(rating) })}>
      ${[1, 2, 3, 4, 5].map((n) => (n <= rating ? iconStar() : html`<span class="off">${iconStarOutline()}</span>`))}
    </span>`;
  }

  private renderAvatar(it: Testimonial) {
    if (it.avatar) return html`<img class="avatar" src=${it.avatar} alt="" loading="lazy" width="44" height="44" />`;
    const initials = it.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('');
    return html`<span class="avatar" aria-hidden="true">${initials || '★'}</span>`;
  }
}
