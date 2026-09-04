import type { Lingual } from '../../shared/i18n';

export type RvLayout = 'slider' | 'grid';
export type RvImageRatio = 'square' | 'portrait' | 'landscape';
export type RvEmptyBehavior = 'hide' | 'message';
export type RvCardStyle = 'outlined' | 'elevated' | 'plain';

/** Shape of the editor `config` object for `<salla-recently-viewed>`. */
export interface RecentlyViewedConfig {
  title?: Lingual;
  subtitle?: Lingual;
  limit?: number;
  exclude_current?: boolean;
  layout?: RvLayout;
  columns_desktop?: number;
  columns_mobile?: number;
  image_ratio?: RvImageRatio;
  show_price?: boolean;
  show_sale_badge?: boolean;
  show_add_to_cart?: boolean;
  add_text?: Lingual;
  show_clear?: boolean;
  clear_text?: Lingual;
  empty_behavior?: RvEmptyBehavior;
  empty_message?: Lingual;
  storage_days?: number;
  card_style?: RvCardStyle;
}

export interface ViewedEntry {
  id: number;
  t: number;
}
