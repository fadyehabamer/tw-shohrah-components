import type { Lingual } from '../../shared/i18n';

export type LabelMode = 'always' | 'hover' | 'never';
export type ChatPosition = 'start' | 'end';
export type ChatSize = 'sm' | 'md' | 'lg';
export type ChatColorMode = 'whatsapp' | 'theme' | 'custom';
export type ShowOn = 'all' | 'mobile' | 'desktop';

/** Shape of the editor `config` object for `<salla-whatsapp-chat>`. */
export interface WhatsappChatConfig {
  number?: string;
  message?: Lingual;
  include_url?: boolean;
  label?: Lingual;
  label_mode?: LabelMode;
  position?: ChatPosition;
  offset_bottom?: number;
  offset_side?: number;
  size?: ChatSize;
  color_mode?: ChatColorMode;
  custom_color?: string;
  show_on?: ShowOn;
  greeting_enabled?: boolean;
  greeting_title?: Lingual;
  greeting_text?: Lingual;
  greeting_delay?: number;
  avatar?: string;
  hours_enabled?: boolean;
  hours_from?: string;
  hours_to?: string;
  timezone?: string;
  offline_text?: Lingual;
  pulse?: boolean;
}
