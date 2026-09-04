import type { Lingual } from '../../shared/i18n';

export type EstimatorStyle = 'card' | 'inline';
export type DateStyle = 'long' | 'short';
export type CalendarKind = 'gregory' | 'islamic-umalqura';

export interface CityRow extends Record<string, unknown> {
  name?: Lingual;
  min_days?: number | string;
  max_days?: number | string;
}

/** Shape of the editor `config` object for `<salla-delivery-estimator>`. */
export interface DeliveryEstimatorConfig {
  title?: Lingual;
  subtitle?: Lingual;
  cutoff_time?: string;
  timezone?: string;
  processing_days?: number;
  working_days?: unknown;
  cities?: CityRow[];
  show_city_select?: boolean;
  remember_city?: boolean;
  countdown_text?: Lingual;
  after_cutoff_text?: Lingual;
  result_label?: Lingual;
  date_style?: DateStyle;
  calendar?: CalendarKind;
  style?: EstimatorStyle;
  show_icon?: boolean;
  icon?: string;
}

export interface City {
  name: string;
  min: number;
  max: number;
}

/** A calendar date in the merchant's timezone, held as a UTC-midnight timestamp for arithmetic. */
export interface CivilDate {
  utc: number;
  weekday: number;
}

export interface Estimate {
  city: City;
  from: CivilDate;
  to: CivilDate;
  beforeCutoff: boolean;
  msToCutoff: number;
}
