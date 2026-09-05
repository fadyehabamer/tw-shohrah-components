import type { Lingual } from '../../shared/i18n';

export type LadderStyle = 'list' | 'cards' | 'steps';
export type LadderHighlight = 'none' | 'last' | 'middle';
export type LadderAlign = 'start' | 'center';

export interface TierRow extends Record<string, unknown> {
  min_qty?: number | string;
  qty_label?: Lingual;
  discount_label?: Lingual;
  note?: Lingual;
}

/** Shape of the editor `config` object for `<salla-volume-discount-ladder>`. */
export interface VolumeDiscountLadderConfig {
  title?: Lingual;
  subtitle?: Lingual;
  tiers?: TierRow[];
  track_cart?: boolean;
  progress_text?: Lingual;
  reached_text?: Lingual;
  style?: LadderStyle;
  highlight?: LadderHighlight;
  align?: LadderAlign;
  use_theme_color?: boolean;
  accent_color?: string;
  show_note?: boolean;
  note?: Lingual;
  show_cta?: boolean;
  cta_text?: Lingual;
  cta_link?: unknown;
}

export interface Tier {
  minQty: number;
  qtyLabel: string;
  discountLabel: string;
  note: string;
}
