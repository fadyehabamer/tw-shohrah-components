import type { Lingual } from '../../shared/i18n';

export type TrustLayout = 'row' | 'grid' | 'compact';
export type TrustIconStyle = 'outline' | 'circle' | 'filled';
export type TrustAlign = 'start' | 'center';
export type TrustBackground = 'transparent' | 'surface' | 'tint';
export type TrustTextSize = 'sm' | 'md';

export interface TrustBadgeRow extends Record<string, unknown> {
  icon?: string;
  title?: Lingual;
  text?: Lingual;
  link?: unknown;
}

/** Shape of the editor `config` object for `<salla-trust-badges>`. */
export interface TrustBadgesConfig {
  title?: Lingual;
  show_title?: boolean;
  items?: TrustBadgeRow[];
  layout?: TrustLayout;
  columns_desktop?: number;
  columns_mobile?: number;
  icon_style?: TrustIconStyle;
  icon_size?: number;
  align?: TrustAlign;
  dividers?: boolean;
  background?: TrustBackground;
  text_size?: TrustTextSize;
}

export interface TrustBadgeItem {
  icon: string;
  title: string;
  text: string;
  href: string;
}
