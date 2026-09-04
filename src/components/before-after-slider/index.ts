import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconGrip } from '../../shared/icons';
import { clamp, num } from '../../shared/format';
import { messages } from './locale';
import { styles } from './styles';
import type { FrameRatio, HandleStyle } from './types';

const RATIOS = ['landscape', 'classic', 'square', 'portrait'] as const;
const HANDLES = ['circle', 'bar'] as const;
const RATIO_CSS: Record<FrameRatio, string> = { landscape: '16 / 9', classic: '4 / 3', square: '1 / 1', portrait: '4 / 5' };

/**
 * `<salla-before-after-slider>` — draggable comparison between two images.
 *
 * When only an "after" image is provided, the "before" side shows the same image desaturated,
 * so the component never renders empty. RTL-aware: the "after" side always starts at inline-start.
 *
 * Properties: `config`, `position` (0–100), `beforeSrc`, `afterSrc`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:compare-change` ({ position }).
 * Slots: `title`, `subtitle`, `hint`.
 * CSS parts: `root`, `title`, `subtitle`, `stage`, `before`, `after`, `handle`, `label-before`, `label-after`, `hint`.
 */
export default class BeforeAfterSlider extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'before-after-slider';
  protected readonly messages = messages;

  @property({ type: Number }) position?: number;
  @property({ type: String, attribute: 'before-src' }) beforeSrc?: string;
  @property({ type: String, attribute: 'after-src' }) afterSrc?: string;

  @state() private pos = 50;
  @state() private dragging = false;
  @state() private stageWidth = 0;
  @query('.stage') private stageEl?: HTMLElement;
  private initialised = false;

  protected onSallaReady(): void {
    this.phase = 'ready';
    this.updateComplete.then(() => {
      if (!this.stageEl) return;
      const ro = this.own(new ResizeObserver(() => this.measure()));
      ro.observe(this.stageEl);
      this.measure();
      this.listen(window, 'pointerup', () => this.endDrag());
      this.listen(window, 'pointercancel', () => this.endDrag());
    });
  }

  protected willUpdate(): void {
    if (!this.initialised && this.phase === 'ready') {
      this.initialised = true;
      this.pos = clamp(this.position ?? this.num('start_percent', 50, 5, 95), 0, 100);
    }
  }

  private measure(): void {
    this.stageWidth = this.stageEl?.clientWidth ?? 0;
  }

  private setFromClientX(clientX: number): void {
    const stage = this.stageEl;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    const ratio = (clientX - r.left) / r.width;
    const p = this.rtl ? 1 - ratio : ratio;
    this.setPos(p * 100);
  }

  private setPos(p: number): void {
    const next = clamp(Math.round(p * 10) / 10, 0, 100);
    if (next === this.pos) return;
    this.pos = next;
    this.emit('compare-change', { position: next });
  }

  private onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.dragging = true;
    this.setFromClientX(e.clientX);
    try {
      this.stageEl?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.dragging) {
      this.setFromClientX(e.clientX);
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (this.bool('hover_move', false) && e.pointerType === 'mouse') this.setFromClientX(e.clientX);
  }

  private endDrag(): void {
    if (this.dragging) this.dragging = false;
  }

  private onKeydown(e: KeyboardEvent): void {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = this.pos + (this.rtl ? -step : step);
    else if (e.key === 'ArrowLeft') next = this.pos + (this.rtl ? step : -step);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    this.setPos(next);
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const after = this.afterSrc || this.str('after_image', '');
    const before = this.beforeSrc || this.str('before_image', '');
    if (!after && !before) return html`<div class="sh-empty" part="empty">${this.t('missing_images')}</div>`;

    const autoBefore = !before;
    const beforeSrc = before || after;
    const afterSrc = after || before;
    const ratio = this.choice<FrameRatio>('ratio', RATIOS, 'landscape');
    const handle = this.choice<HandleStyle>('handle_style', HANDLES, 'circle');
    const showLabels = this.bool('show_labels', true);
    const showTitle = this.bool('show_title', false);
    const rounded = this.bool('rounded', true);
    const maxWidth = this.num('max_width', 820, 320, 1600);
    const beforeLabel = this.text('before_label', 'before');
    const afterLabel = this.text('after_label', 'after');
    const beforeAlt = this.str('before_alt', '') || beforeLabel;
    const afterAlt = this.str('after_alt', '') || afterLabel;
    const hint = this.str('hint', this.t('hint'));
    const subtitle = this.str('subtitle');
    let vars = `--ba-ratio:${RATIO_CSS[ratio]};--ba-max:${maxWidth}px;--ba-pos:${this.pos}%;--ba-stage-width:${this.stageWidth || 0}px`;
    if (!this.bool('use_theme_color', true)) vars += `;--ba-accent:${this.color('accent_color', '#1f5c5a')}`;
    if (!this.stageWidth) vars = vars.replace(/--ba-stage-width:[^;]*/, '--ba-stage-width:100%');

    return html`
      <section class="root" part="root" style=${vars}>
        ${showTitle
          ? html`<div class="sh-header sh-header--center">
              <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
              ${subtitle ? html`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
            </div>`
          : nothing}
        <div
          class=${classMap({ stage: true, 'stage--rounded': rounded, 'stage--dragging': this.dragging })}
          part="stage"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
        >
          <img class=${classMap({ img: true, 'img--auto-before': autoBefore })} part="before" src=${beforeSrc} alt=${beforeAlt} draggable="false" />
          ${showLabels ? html`<span class="tag tag--before" part="label-before">${beforeLabel}</span>` : nothing}
          <div class="clip">
            <img class="img" part="after" src=${afterSrc} alt=${afterAlt} draggable="false" @load=${() => this.measure()} />
          </div>
          ${showLabels ? html`<span class="tag tag--after" part="label-after">${afterLabel}</span>` : nothing}
          <div class="bar" aria-hidden="true"></div>
          <button
            class=${classMap({ handle: true, [`handle--${handle}`]: true })}
            part="handle"
            type="button"
            role="slider"
            aria-label=${this.t('slider_label')}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${Math.round(this.pos)}
            aria-valuetext=${this.t('value_text', { n: num(Math.round(this.pos)) })}
            aria-orientation="horizontal"
            @keydown=${this.onKeydown}
            @click=${(e: Event) => e.preventDefault()}
          >
            ${iconGrip()}
          </button>
        </div>
        ${hint ? html`<slot name="hint"><p class="hint" part="hint">${hint}</p></slot>` : nothing}
      </section>
    `;
  }
}
