import type { Lingual } from '../../shared/i18n';

export type ScarcityColorMode = 'theme' | 'traffic' | 'custom';
export type ScarcityStyle = 'card' | 'inline' | 'minimal';

/** Shape of the editor `config` object for `<salla-stock-scarcity-bar>`. */
export interface StockScarcityBarConfig {
  product?: unknown;
  threshold?: number;
  bar_max?: number;
  title?: Lingual;
  message?: Lingual;
  show_sold?: boolean;
  sold_message?: Lingual;
  show_bar?: boolean;
  color_mode?: ScarcityColorMode;
  custom_color?: string;
  icon?: string;
  style?: ScarcityStyle;
  hide_when_unknown?: boolean;
  animate?: boolean;
}

export interface StockInfo {
  quantity: number | null;
  sold: number | null;
  outOfStock: boolean;
}
