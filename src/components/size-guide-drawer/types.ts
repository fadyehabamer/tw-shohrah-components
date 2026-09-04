import type { Lingual } from '../../shared/i18n';

export type Unit = 'cm' | 'in';
export type ButtonStyle = 'link' | 'outline' | 'solid';
export type DrawerSide = 'end' | 'start';

export interface ColumnRow extends Record<string, unknown> {
  label?: Lingual;
}

export interface SizeRow extends Record<string, unknown> {
  size?: string;
  values?: string;
}

export interface TipRow extends Record<string, unknown> {
  title?: Lingual;
  text?: Lingual;
}

/** Shape of the editor `config` object for `<salla-size-guide-drawer>`. */
export interface SizeGuideDrawerConfig {
  button_text?: Lingual;
  button_style?: ButtonStyle;
  show_button_icon?: boolean;
  title?: Lingual;
  subtitle?: Lingual;
  columns?: ColumnRow[];
  rows?: SizeRow[];
  default_unit?: Unit;
  show_unit_toggle?: boolean;
  fit_note?: Lingual;
  tips?: TipRow[];
  image?: string;
  drawer_side?: DrawerSide;
  drawer_width?: number;
}

export interface SizeTableRow {
  size: string;
  values: string[];
}
