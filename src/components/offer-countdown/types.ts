import type { Lingual } from '../../shared/i18n';

export type CountdownMode = 'fixed_date' | 'daily' | 'evergreen';
export type DigitStyle = 'boxed' | 'minimal' | 'pill';
export type CountdownLayout = 'inline' | 'stacked';
export type CountdownAlign = 'start' | 'center';
export type CountdownBackground = 'transparent' | 'surface' | 'primary';
export type ExpiredBehavior = 'hide' | 'message';

/** Shape of the editor `config` object for `<salla-offer-countdown>`. */
export interface OfferCountdownConfig {
  title?: Lingual;
  subtitle?: Lingual;
  mode?: CountdownMode;
  end_datetime?: string;
  evergreen_hours?: number;
  show_days?: boolean;
  digit_style?: DigitStyle;
  layout?: CountdownLayout;
  align?: CountdownAlign;
  show_cta?: boolean;
  cta_text?: Lingual;
  cta_link?: unknown;
  expired_behavior?: ExpiredBehavior;
  expired_message?: Lingual;
  use_theme_color?: boolean;
  accent_color?: string;
  background?: CountdownBackground;
  pulse_last_hour?: boolean;
}

export interface Remaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
