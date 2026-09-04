import type { Lingual } from '../../shared/i18n';

export type CardStyle = 'elevated' | 'outlined' | 'plain';
export type TestimonialAlign = 'start' | 'center';

export interface TestimonialRow extends Record<string, unknown> {
  name?: string;
  meta?: Lingual;
  quote?: Lingual;
  rating?: number | string;
  avatar?: string;
}

/** Shape of the editor `config` object for `<salla-testimonials-slider>`. */
export interface TestimonialsSliderConfig {
  title?: Lingual;
  subtitle?: Lingual;
  items?: TestimonialRow[];
  autoplay?: boolean;
  interval_seconds?: number;
  slides_desktop?: number;
  slides_mobile?: number;
  loop?: boolean;
  show_rating?: boolean;
  show_avatar?: boolean;
  show_quote_icon?: boolean;
  card_style?: CardStyle;
  show_arrows?: boolean;
  show_dots?: boolean;
  align?: TestimonialAlign;
}

export interface Testimonial {
  name: string;
  meta: string;
  quote: string;
  rating: number;
  avatar: string;
}
