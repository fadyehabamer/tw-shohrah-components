import type { Lingual } from '../../shared/i18n';

export type FrameRatio = 'landscape' | 'classic' | 'square' | 'portrait';
export type HandleStyle = 'circle' | 'bar';

/** Shape of the editor `config` object for `<salla-before-after-slider>`. */
export interface BeforeAfterSliderConfig {
  show_title?: boolean;
  title?: Lingual;
  subtitle?: Lingual;
  before_image?: string;
  after_image?: string;
  before_label?: Lingual;
  after_label?: Lingual;
  before_alt?: Lingual;
  after_alt?: Lingual;
  show_labels?: boolean;
  hint?: Lingual;
  start_percent?: number;
  ratio?: FrameRatio;
  handle_style?: HandleStyle;
  use_theme_color?: boolean;
  accent_color?: string;
  max_width?: number;
  rounded?: boolean;
  hover_move?: boolean;
}
