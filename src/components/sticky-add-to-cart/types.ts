import type { Lingual } from '../../shared/i18n';

export type BarPosition = 'bottom' | 'top';
export type BarSurface = 'light' | 'dark' | 'primary';
export type BarShowOn = 'all' | 'mobile' | 'desktop';

/** Shape of the editor `config` object for `<salla-sticky-add-to-cart>`. */
export interface StickyAddToCartConfig {
  product?: unknown;
  position?: BarPosition;
  show_after_px?: number;
  show_image?: boolean;
  show_name?: boolean;
  show_price?: boolean;
  show_quantity?: boolean;
  button_text?: Lingual;
  options_hint?: Lingual;
  out_of_stock_text?: Lingual;
  hide_when_out_of_stock?: boolean;
  surface?: BarSurface;
  shadow?: boolean;
  offset_px?: number;
  hide_near_form?: boolean;
  show_on?: BarShowOn;
}

export type AddState = 'idle' | 'adding' | 'added' | 'failed';
