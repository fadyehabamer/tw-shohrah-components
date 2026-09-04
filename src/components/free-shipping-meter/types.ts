import type { Lingual } from '../../shared/i18n';

export type MeterStyle = 'bar' | 'pill' | 'line';

/** Shape of the editor `config` object for `<salla-free-shipping-meter>`. */
export interface FreeShippingMeterConfig {
  threshold_override?: number;
  message_empty?: Lingual;
  message_remaining?: Lingual;
  message_reached?: Lingual;
  show_when_empty?: boolean;
  show_amounts?: boolean;
  style?: MeterStyle;
  icon?: string;
  use_theme_color?: boolean;
  bar_color?: string;
  reached_color?: string;
  show_cta?: boolean;
  cta_text?: Lingual;
  hide_when_reached?: boolean;
  celebrate?: boolean;
}

export interface MeterState {
  subtotal: number;
  threshold: number;
  remaining: number;
  percent: number;
  reached: boolean;
  count: number;
  currency?: string;
}
