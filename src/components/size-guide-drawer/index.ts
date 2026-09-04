import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconClose, iconRuler } from '../../shared/icons';
import { num } from '../../shared/format';
import { messages } from './locale';
import { styles } from './styles';
import type { ButtonStyle, ColumnRow, DrawerSide, SizeRow, SizeTableRow, TipRow, Unit } from './types';

const UNITS = ['cm', 'in'] as const;
const BUTTON_STYLES = ['link', 'outline', 'solid'] as const;
const SIDES = ['end', 'start'] as const;
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * `<salla-size-guide-drawer>` — trigger button that opens a side drawer with a size table, unit toggle and measuring tips.
 *
 * Properties: `config`, `open` (reflected), `unit`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:size-guide-open`, `shohrah:size-guide-close`, `shohrah:unit-change` ({ unit }).
 * Slots: `button` (custom trigger content), `extra` (content appended at the bottom of the drawer).
 * CSS parts: `trigger`, `drawer`, `title`, `subtitle`, `table`, `tips`, `close`.
 */
export default class SizeGuideDrawer extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'size-guide-drawer';
  protected readonly messages = messages;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) unit?: Unit;

  @state() private activeUnit: Unit = 'cm';
  @query('.drawer') private drawerEl?: HTMLElement;
  @query('.trigger') private triggerEl?: HTMLElement;
  private unitInitialised = false;
  private previousOverflow = '';
  private keyHandler = (e: KeyboardEvent) => this.onKeydown(e);

  private get columns(): string[] {
    const rows = this.list<ColumnRow>('columns');
    const cols = rows.map((r) => this.rowText(r, 'label')).filter(Boolean);
    return cols.length ? cols : [1, 2, 3].map((i) => this.t(`default_col_${i}`));
  }

  private get rows(): SizeTableRow[] {
    const rows = this.list<SizeRow>('rows');
    const source = rows.length
      ? rows
      : [
          { size: 'S', values: '92 | 76 | 100' },
          { size: 'M', values: '100 | 84 | 108' },
          { size: 'L', values: '108 | 92 | 116' },
          { size: 'XL', values: '116 | 100 | 124' },
        ];
    return source
      .map((r) => ({
        size: String(r.size ?? '').trim(),
        values: String(r.values ?? '')
          .split('|')
          .map((v) => v.trim()),
      }))
      .filter((r) => r.size);
  }

  private get tips(): Array<{ title: string; text: string }> {
    const rows = this.list<TipRow>('tips');
    if (rows.length) return rows.map((r) => ({ title: this.rowText(r, 'title'), text: this.rowText(r, 'text') })).filter((t) => t.title || t.text);
    return [1, 2, 3].map((i) => ({ title: this.t(`default_tip_${i}_title`), text: this.t(`default_tip_${i}_text`) }));
  }

  protected onSallaReady(): void {
    this.phase = 'ready';
  }

  protected willUpdate(): void {
    if (!this.unitInitialised && this.phase === 'ready') {
      this.unitInitialised = true;
      this.activeUnit = this.unit ?? this.choice('default_unit', UNITS, 'cm');
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unlockScroll();
    document.removeEventListener('keydown', this.keyHandler);
  }

  private convert(raw: string): string {
    if (!raw) return '—';
    const n = Number(raw.replace(/[^\d.]/g, ''));
    if (!raw.match(/^\s*[\d.]+\s*$/) || !Number.isFinite(n)) return raw;
    const value = this.activeUnit === 'in' ? Math.round(n / 2.54 * 10) / 10 : Math.round(n * 10) / 10;
    return `${num(value)} ${this.t(this.activeUnit)}`;
  }

  private setUnit(u: Unit): void {
    if (u === this.activeUnit) return;
    this.activeUnit = u;
    this.emit('unit-change', { unit: u });
  }

  private show(): void {
    this.open = true;
    this.lockScroll();
    document.addEventListener('keydown', this.keyHandler);
    this.emit('size-guide-open');
    this.updateComplete.then(() => this.drawerEl?.focus());
  }

  private hide(): void {
    if (!this.open) return;
    this.open = false;
    this.unlockScroll();
    document.removeEventListener('keydown', this.keyHandler);
    this.emit('size-guide-close');
    this.updateComplete.then(() => this.triggerEl?.focus());
  }

  private lockScroll(): void {
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    if (this.open || document.body.style.overflow === 'hidden') document.body.style.overflow = this.previousOverflow;
  }

  /** Esc closes; Tab is trapped inside the drawer. */
  private onKeydown(e: KeyboardEvent): void {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
      return;
    }
    if (e.key !== 'Tab' || !this.drawerEl) return;
    const nodes = Array.from(this.drawerEl.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => !n.hasAttribute('disabled'));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = this.shadowRoot?.activeElement as HTMLElement | null;
    if (e.shiftKey && (active === first || active === this.drawerEl)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const buttonStyle = this.choice<ButtonStyle>('button_style', BUTTON_STYLES, 'link');
    const showIcon = this.bool('show_button_icon', true);
    const side = this.choice<DrawerSide>('drawer_side', SIDES, 'end');
    const width = this.num('drawer_width', 440, 320, 720);
    const rows = this.rows;

    return html`
      <button
        class=${classMap({ 'sh-btn': true, trigger: true, [`trigger--${buttonStyle}`]: true, 'sh-btn--ghost': buttonStyle === 'outline', 'sh-btn--primary': buttonStyle === 'solid' })}
        part="trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded=${String(this.open)}
        @click=${this.show}
      >
        <slot name="button">${showIcon ? iconRuler() : nothing}<span>${this.text('button_text', 'button')}</span></slot>
      </button>
      ${this.open ? this.renderDrawer(side, width, rows) : nothing}
    `;
  }

  private renderDrawer(side: DrawerSide, width: number, rows: SizeTableRow[]) {
    const columns = this.columns;
    const subtitle = this.text('subtitle', 'subtitle');
    const fitNote = this.text('fit_note', 'fit_note');
    const image = this.str('image', '');
    const tips = this.tips;
    const showToggle = this.bool('show_unit_toggle', true);

    return html`<div
      class=${classMap({ overlay: true, [`overlay--${side}`]: true })}
      style="--sg-width:${width}px"
      @click=${(e: Event) => {
        if (e.target === e.currentTarget) this.hide();
      }}
    >
      <aside class="drawer" part="drawer" role="dialog" aria-modal="true" aria-labelledby="sg-title" tabindex="-1">
        <header class="head">
          <div class="sh-header">
            <h3 id="sg-title" class="sh-title" part="title">${this.text('title', 'title')}</h3>
            <span class="accent" aria-hidden="true"></span>
            ${subtitle ? html`<p class="sh-subtitle" part="subtitle">${subtitle}</p>` : nothing}
          </div>
          <button class="sh-icon-btn" part="close" type="button" aria-label=${this.t('close')} @click=${this.hide}>${iconClose()}</button>
        </header>
        <div class="content">
          ${showToggle
            ? html`<div class="unit">
                <span class="unit-label">${this.t('unit_label')}</span>
                <div class="seg" role="group" aria-label=${this.t('unit_label')}>
                  ${UNITS.map((u) => html`<button type="button" aria-pressed=${String(this.activeUnit === u)} @click=${() => this.setUnit(u)}>${this.t(u)}</button>`)}
                </div>
              </div>`
            : nothing}
          ${rows.length === 0
            ? html`<div class="sh-empty">${this.t('empty')}</div>`
            : html`<div class="table-wrap">
                <table part="table">
                  <thead>
                    <tr>
                      <th scope="col">${this.t('size')}</th>
                      ${columns.map((c) => html`<th scope="col">${c}</th>`)}
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(
                      (r) => html`<tr>
                        <th scope="row" style="background:transparent;color:inherit;position:static">${r.size}</th>
                        ${columns.map((_, i) => html`<td>${this.convert(r.values[i] ?? '')}</td>`)}
                      </tr>`,
                    )}
                  </tbody>
                </table>
              </div>`}
          ${fitNote ? html`<p class="note">${fitNote}</p>` : nothing}
          ${image ? html`<img class="diagram" src=${image} alt="" loading="lazy" />` : nothing}
          ${tips.length
            ? html`<section class="tips" part="tips">
                <h4>${this.t('tips_title')}</h4>
                <ol>
                  ${tips.map((t) => html`<li>${t.title ? html`<strong>${t.title}:</strong> ` : nothing}${t.text}</li>`)}
                </ol>
              </section>`
            : nothing}
          <slot name="extra"></slot>
        </div>
      </aside>
    </div>`;
  }
}
