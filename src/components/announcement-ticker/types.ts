import type { Lingual } from '../../shared/i18n';

export type TickerMode = 'marquee' | 'rotate' | 'static';
export type TickerSeparator = 'dot' | 'line' | 'icon' | 'none';
export type TickerBackground = 'primary' | 'dark' | 'light' | 'custom';
export type TickerFontSize = 'sm' | 'md';

export interface TickerRow extends Record<string, unknown> {
  text?: Lingual;
  icon?: string;
  link?: unknown;
}

/** Shape of the editor `config` object for `<salla-announcement-ticker>`. */
export interface AnnouncementTickerConfig {
  items?: TickerRow[];
  mode?: TickerMode;
  speed_seconds?: number;
  rotate_seconds?: number;
  pause_on_hover?: boolean;
  separator?: TickerSeparator;
  background?: TickerBackground;
  custom_bg?: string;
  custom_text?: string;
  height_px?: number;
  font_size?: TickerFontSize;
  show_icons?: boolean;
  sticky?: boolean;
  dismissible?: boolean;
  dismiss_label?: Lingual;
}

export interface TickerItem {
  text: string;
  icon: string;
  href: string;
}
