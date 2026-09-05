import type { Lingual } from '../../shared/i18n';

export type CouponAction = 'copy' | 'apply' | 'both';
export type CouponStyle = 'ticket' | 'card' | 'inline';
export type CouponExpired = 'hide' | 'message';

/** Shape of the editor `config` object for `<salla-coupon-code-card>`. */
export interface CouponCodeCardConfig {
  code?: string;
  title?: Lingual;
  description?: Lingual;
  conditions?: Lingual;
  action?: CouponAction;
  copy_text?: Lingual;
  copied_text?: Lingual;
  apply_text?: Lingual;
  applied_text?: Lingual;
  show_expiry?: boolean;
  expires_at?: string;
  expired_behavior?: CouponExpired;
  expired_text?: Lingual;
  style?: CouponStyle;
  dashed?: boolean;
  show_icon?: boolean;
  icon?: string;
  use_theme_color?: boolean;
  accent_color?: string;
  max_width?: number;
}

export type CopyState = 'idle' | 'copied';
export type ApplyState = 'idle' | 'applying' | 'applied' | 'failed';
