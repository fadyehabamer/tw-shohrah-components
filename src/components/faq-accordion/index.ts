import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconArrowEnd, iconChevronDown, iconClose, iconPlus, iconSearch } from '../../shared/icons';
import { num } from '../../shared/format';
import { messages } from './locale';
import { styles } from './styles';
import type { FaqIconStyle, FaqItem, FaqLayout, FaqRow } from './types';

const ICON_STYLES = ['plus', 'chevron', 'arrow'] as const;
const LAYOUTS = ['list', 'two_columns', 'cards'] as const;

/** Light Arabic-aware normalisation for search: strip diacritics/tatweel, unify alef/yaa/taa marbuta. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

/**
 * `<salla-faq-accordion>` — accessible FAQ accordion with optional search, FAQ schema and contact CTA.
 *
 * Properties: `config`, `allowMultiple`, `layout`, `iconStyle`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:faq-toggle` ({ index, open, question }),
 *         `shohrah:faq-search` ({ query, results }).
 * Slots: `title`, `subtitle`, `contact` (replaces the contact CTA).
 * CSS parts: `root`, `title`, `subtitle`, `search`, `item`, `trigger`, `panel`, `answer`, `contact`.
 */
export default class FaqAccordion extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'faq-accordion';
  protected readonly messages = messages;

  @property({ type: Boolean, attribute: 'allow-multiple' }) allowMultiple?: boolean;
  @property({ type: String }) layout?: FaqLayout;
  @property({ type: String, attribute: 'icon-style' }) iconStyle?: FaqIconStyle;

  @state() private open = new Set<string>();
  @state() private query = '';
  private initialised = false;
  private schemaEl?: HTMLScriptElement;
  private readonly uid = Math.random().toString(36).slice(2, 8);

  private get items(): FaqItem[] {
    const rows = this.list<FaqRow>('items');
    const source: FaqItem[] =
      rows.length > 0
        ? rows.map((row, i) => ({
            id: `${this.uid}-${i}`,
            question: this.rowText(row, 'question'),
            answer: this.rowText(row, 'answer'),
          }))
        : [1, 2, 3, 4, 5].map((i) => ({
            id: `${this.uid}-${i}`,
            question: this.t(`default_q${i}`),
            answer: this.t(`default_a${i}`),
          }));
    return source.filter((it) => it.question);
  }

  protected onSallaReady(): void {
    this.phase = 'ready';
    if (!this.initialised) {
      this.initialised = true;
      if (this.bool('first_open', true)) {
        const first = this.items[0];
        if (first) this.open = new Set([first.id]);
      }
    }
    this.syncSchema();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.schemaEl?.remove();
    this.schemaEl = undefined;
  }

  /** FAQPage JSON-LD, generated only from merchant text with JSON.stringify (inert). Off by default. */
  private syncSchema(): void {
    if (!this.bool('schema_markup', false)) {
      this.schemaEl?.remove();
      this.schemaEl = undefined;
      return;
    }
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.items.map((it) => ({
        '@type': 'Question',
        name: it.question,
        acceptedAnswer: { '@type': 'Answer', text: it.answer },
      })),
    };
    if (!this.schemaEl) {
      this.schemaEl = document.createElement('script');
      this.schemaEl.type = 'application/ld+json';
      this.schemaEl.dataset.shohrah = `faq-${this.uid}`;
      document.head.appendChild(this.schemaEl);
    }
    this.schemaEl.textContent = JSON.stringify(data);
  }

  private toggle(item: FaqItem, index: number): void {
    const next = new Set(this.allowMultiple ?? this.bool('allow_multiple', false) ? this.open : []);
    const willOpen = !this.open.has(item.id);
    if (willOpen) next.add(item.id);
    else next.delete(item.id);
    this.open = next;
    this.emit('faq-toggle', { index, open: willOpen, question: item.question });
  }

  private onTriggerKeydown(e: KeyboardEvent): void {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const triggers = Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('.trigger'));
    const i = triggers.indexOf(e.currentTarget as HTMLButtonElement);
    if (i === -1) return;
    e.preventDefault();
    const target =
      e.key === 'Home'
        ? triggers[0]
        : e.key === 'End'
          ? triggers[triggers.length - 1]
          : triggers[(i + (e.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length];
    target?.focus();
  }

  private onSearch(e: Event): void {
    this.query = (e.target as HTMLInputElement).value;
    this.emit('faq-search', { query: this.query, results: this.filtered().length });
  }

  private filtered(): FaqItem[] {
    const q = normalize(this.query);
    if (!q) return this.items;
    return this.items.filter((it) => normalize(it.question).includes(q) || normalize(it.answer).includes(q));
  }

  private highlight(text: string) {
    const q = this.query.trim();
    if (!q) return text;
    const idx = normalize(text).indexOf(normalize(q));
    if (idx === -1) return text;
    return html`${text.slice(0, idx)}<mark>${text.slice(idx, idx + q.length)}</mark>${text.slice(idx + q.length)}`;
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const items = this.items;
    if (items.length === 0) return html`<div class="sh-empty" part="empty">${this.t('empty')}</div>`;

    const layout = this.layout ?? this.choice('layout', LAYOUTS, 'list');
    const iconStyle = this.iconStyle ?? this.choice('icon_style', ICON_STYLES, 'plus');
    const dividers = this.bool('dividers', true) && layout !== 'cards';
    const showSearch = this.bool('show_search', false);
    const showContact = this.bool('show_contact', false);
    const contactHref = this.link('contact_link');
    const visible = this.filtered();
    const title = this.text('title', 'title');
    const subtitle = this.str('subtitle');

    return html`
      <section class="root" part="root" aria-label=${this.t('region_label')}>
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${title}</h3></slot>
          ${subtitle ? html`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
        </div>

        ${showSearch
          ? html`<div class="search" part="search">
              ${iconSearch()}
              <input
                type="search"
                .value=${this.query}
                @input=${this.onSearch}
                placeholder=${this.text('search_placeholder', 'search_placeholder')}
                aria-label=${this.t('search_label')}
                autocomplete="off"
              />
              ${this.query
                ? html`<button class="sh-icon-btn clear" type="button" aria-label=${this.t('clear_search')} @click=${() => {
                    this.query = '';
                  }}>${iconClose()}</button>`
                : nothing}
            </div>
            ${this.query
              ? html`<p class="count" role="status">${this.t('results_count', { count: num(visible.length) })}</p>`
              : nothing}`
          : nothing}

        ${visible.length === 0
          ? html`<div class="sh-empty" role="status">${this.t('no_results')}</div>`
          : html`<ul class=${classMap({ list: true, [`list--${layout}`]: true, 'list--dividers': dividers })} role="list">
              ${visible.map((item, i) => this.renderItem(item, i, iconStyle))}
            </ul>`}

        ${showContact && contactHref
          ? html`<div class="contact" part="contact">
              <slot name="contact">
                <a class="sh-btn sh-btn--ghost" href=${contactHref}>${this.text('contact_text', 'contact_text')} ${iconArrowEnd()}</a>
              </slot>
            </div>`
          : nothing}
      </section>
    `;
  }

  private renderItem(item: FaqItem, index: number, iconStyle: FaqIconStyle) {
    const isOpen = this.open.has(item.id);
    const panelId = `panel-${item.id}`;
    const triggerId = `trigger-${item.id}`;
    const indicator = iconStyle === 'plus' ? iconPlus() : iconStyle === 'chevron' ? iconChevronDown() : iconArrowEnd();
    return html`<li class="item" part="item" data-open=${String(isOpen)}>
      <h4 style="margin:0;font:inherit">
        <button
          id=${triggerId}
          class="trigger"
          part="trigger"
          type="button"
          aria-expanded=${String(isOpen)}
          aria-controls=${panelId}
          @click=${() => this.toggle(item, index)}
          @keydown=${this.onTriggerKeydown}
        >
          <span>${this.highlight(item.question)}</span>
          <span class="indicator indicator--${iconStyle}" aria-hidden="true">${indicator}</span>
        </button>
      </h4>
      <div id=${panelId} class="panel" part="panel" role="region" aria-labelledby=${triggerId} data-open=${String(isOpen)}>
        <div>
          <p class="answer" part="answer" ?inert=${!isOpen} aria-hidden=${String(!isOpen)}>${this.highlight(item.answer)}</p>
        </div>
      </div>
    </li>`;
  }
}
