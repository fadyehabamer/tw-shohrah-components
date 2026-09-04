import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import {
  iconBolt,
  iconBox,
  iconCard,
  iconHeadset,
  iconShield,
  iconTag,
  iconTruck,
  iconUndo,
  sallaIconStylesheet,
  sicon,
} from '../../shared/icons';
import { messages } from './locale';
import { styles } from './styles';
import type {
  TrustAlign,
  TrustBackground,
  TrustBadgeItem,
  TrustBadgeRow,
  TrustIconStyle,
  TrustLayout,
  TrustTextSize,
} from './types';

const LAYOUTS = ['row', 'grid', 'compact'] as const;
const ICON_STYLES = ['outline', 'circle', 'filled'] as const;
const ALIGNS = ['start', 'center'] as const;
const BACKGROUNDS = ['transparent', 'surface', 'tint'] as const;
const TEXT_SIZES = ['sm', 'md'] as const;

/** Built-in icons used when a row has no `sicon-*` icon chosen. */
const FALLBACK_ICONS = [iconTruck, iconShield, iconUndo, iconHeadset, iconTag, iconBolt, iconBox, iconCard];

/**
 * `<salla-trust-badges>` — reassurance strip (shipping, payment, returns, support).
 *
 * Properties: `config` (editor object) plus `layout`, `align`, `iconStyle`, `background`.
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:badge-click` ({ index, title, href }).
 * Slots: `title` (replaces the heading).
 * CSS parts: `root`, `title`, `item`, `icon`, `badge-title`, `badge-text`.
 */
export default class TrustBadges extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'trust-badges';
  protected readonly messages = messages;

  @property({ type: String }) layout?: TrustLayout;
  @property({ type: String }) align?: TrustAlign;
  @property({ type: String, attribute: 'icon-style' }) iconStyle?: TrustIconStyle;
  @property({ type: String }) background?: TrustBackground;

  private get items(): TrustBadgeItem[] {
    const rows = this.list<TrustBadgeRow>('items');
    if (rows.length === 0) return this.defaultItems();
    return rows
      .map((row) => ({
        icon: this.rowText(row, 'icon'),
        title: this.rowText(row, 'title'),
        text: this.rowText(row, 'text'),
        href: this.linkValue(row.link),
      }))
      .filter((it) => it.title || it.text);
  }

  private defaultItems(): TrustBadgeItem[] {
    return [1, 2, 3, 4].map((i) => ({
      icon: '',
      title: this.t(`default_${i}_title`),
      text: this.t(`default_${i}_text`),
      href: '',
    }));
  }

  private onBadgeClick(index: number, item: TrustBadgeItem): void {
    this.emit('badge-click', { index, title: item.title, href: item.href });
  }

  render() {
    const layout = this.layout ?? this.choice('layout', LAYOUTS, 'row');
    const align = this.align ?? this.choice('align', ALIGNS, 'center');
    const iconStyle = this.iconStyle ?? this.choice('icon_style', ICON_STYLES, 'circle');
    const background = this.background ?? this.choice('background', BACKGROUNDS, 'transparent');
    const textSize = this.choice<TrustTextSize>('text_size', TEXT_SIZES, 'md');
    const dividers = this.bool('dividers', true);
    const showTitle = this.bool('show_title', false);
    const colsDesktop = this.num('columns_desktop', 4, 2, 6);
    const colsMobile = this.num('columns_mobile', 2, 1, 2);
    const iconSize = this.num('icon_size', 28, 20, 48);
    const items = this.items;
    const usesSallaIcons = items.some((it) => it.icon.startsWith('sicon-'));

    if (this.phase === 'error') {
      return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    }
    if (items.length === 0) {
      return html`<div class="sh-empty" part="empty">${this.t('empty')}</div>`;
    }

    const classes = {
      root: true,
      [`root--${layout}`]: true,
      [`root--${background}`]: background !== 'transparent',
      [`root--${textSize}`]: true,
      'root--center': align === 'center',
      'root--dividers': dividers && layout !== 'compact',
      'root--m1': colsMobile === 1,
    };
    const styleVars = `--tb-cols:${colsDesktop};--tb-cols-mobile:${colsMobile};--tb-icon:${iconSize}px`;

    return html`
      ${usesSallaIcons ? sallaIconStylesheet() : nothing}
      <section class=${classMap(classes)} style=${styleVars} part="root" aria-label=${this.t('region_label')}>
        ${showTitle
          ? html`<div class="sh-header ${align === 'center' ? 'sh-header--center' : ''}">
              <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
            </div>`
          : nothing}
        <ul class="grid" role="list">
          ${items.map((item, i) => this.renderItem(item, i, iconStyle))}
        </ul>
      </section>
    `;
  }

  private renderItem(item: TrustBadgeItem, index: number, iconStyle: TrustIconStyle) {
    const fallback = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
    const body = html`
      <span class="icon icon--${iconStyle}" part="icon">${sicon(item.icon, fallback)}</span>
      <span class="body">
        ${item.title ? html`<p class="title" part="badge-title">${item.title}</p>` : nothing}
        ${item.text ? html`<p class="text" part="badge-text">${item.text}</p>` : nothing}
      </span>
    `;
    return html`<li class="item" part="item">
      ${item.href
        ? html`<a href=${item.href} @click=${() => this.onBadgeClick(index, item)}>${body}</a>`
        : body}
    </li>`;
  }
}
