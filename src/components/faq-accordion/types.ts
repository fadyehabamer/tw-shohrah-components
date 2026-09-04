import type { Lingual } from '../../shared/i18n';

export type FaqIconStyle = 'plus' | 'chevron' | 'arrow';
export type FaqLayout = 'list' | 'two_columns' | 'cards';

export interface FaqRow extends Record<string, unknown> {
  question?: Lingual;
  answer?: Lingual;
}

/** Shape of the editor `config` object for `<salla-faq-accordion>`. */
export interface FaqAccordionConfig {
  title?: Lingual;
  subtitle?: Lingual;
  items?: FaqRow[];
  allow_multiple?: boolean;
  first_open?: boolean;
  icon_style?: FaqIconStyle;
  layout?: FaqLayout;
  dividers?: boolean;
  show_search?: boolean;
  search_placeholder?: Lingual;
  schema_markup?: boolean;
  show_contact?: boolean;
  contact_text?: Lingual;
  contact_link?: unknown;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
