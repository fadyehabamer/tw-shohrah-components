import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ShohrahElement } from '../../shared/base';
import { baseStyles } from '../../shared/tokens';
import { iconChevronDown, iconClock, iconPackage, sallaIconStylesheet, sicon } from '../../shared/icons';
import { clamp, num } from '../../shared/format';
import { storageGet, storageSet } from '../../shared/salla';
import { messages } from './locale';
import { styles } from './styles';
import type { CalendarKind, City, CityRow, CivilDate, DateStyle, Estimate, EstimatorStyle } from './types';

const STYLES = ['card', 'inline'] as const;
const DATE_STYLES = ['long', 'short'] as const;
const CALENDARS = ['gregory', 'islamic-umalqura'] as const;
const DAY = 86_400_000;
const DEFAULT_WORKING_DAYS = [0, 1, 2, 3, 4]; // Sun–Thu
const STORAGE_KEY = 'delivery.city';

interface TzNow {
  civil: CivilDate;
  minutes: number;
}

/** Current date/time expressed in the merchant's timezone. */
function nowIn(tz: string): TzNow {
  const d = new Date();
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    const utc = Date.UTC(get('year'), get('month') - 1, get('day'));
    return { civil: { utc, weekday: new Date(utc).getUTCDay() }, minutes: (get('hour') % 24) * 60 + get('minute') };
  } catch {
    const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return { civil: { utc, weekday: new Date(utc).getUTCDay() }, minutes: d.getHours() * 60 + d.getMinutes() };
  }
}

function addDays(c: CivilDate, n: number): CivilDate {
  const utc = c.utc + n * DAY;
  return { utc, weekday: new Date(utc).getUTCDay() };
}

/** Moves forward `n` business days (n = 0 returns the next working day on or after `c`). */
function addBusinessDays(c: CivilDate, n: number, working: Set<number>): CivilDate {
  let cur = c;
  let left = n;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (working.has(cur.weekday)) {
      if (left <= 0) return cur;
      left -= 1;
    }
    cur = addDays(cur, 1);
  }
}

/**
 * `<salla-delivery-estimator>` — order-by cutoff countdown plus expected arrival window per city. Zero requests.
 *
 * Properties: `config`, `city` (selected city name).
 * Events: `shohrah:ready`, `shohrah:error`, `shohrah:city-change` ({ city }), `shohrah:delivery-estimated` ({ city, from, to, beforeCutoff }).
 * Slots: `title`, `subtitle`.
 * CSS parts: `root`, `title`, `subtitle`, `select`, `result`, `dates`, `cutoff`.
 */
export default class DeliveryEstimator extends ShohrahElement {
  static styles = [baseStyles, styles];

  protected readonly ns = 'delivery-estimator';
  protected readonly messages = messages;

  @property({ type: String }) city?: string;

  @state() private selected = 0;
  @state() private tick = 0;
  private restored = false;

  private get cities(): City[] {
    const rows = this.list<CityRow>('cities');
    const list: City[] =
      rows.length > 0
        ? rows.map((r) => {
            const min = clamp(Math.round(Number(r.min_days ?? 1)) || 1, 0, 60);
            const max = clamp(Math.round(Number(r.max_days ?? min)) || min, min, 90);
            return { name: this.rowText(r, 'name'), min, max };
          })
        : [
            { name: this.t('default_city_1'), min: 1, max: 2 },
            { name: this.t('default_city_2'), min: 2, max: 3 },
            { name: this.t('default_city_3'), min: 2, max: 3 },
            { name: this.t('default_city_4'), min: 2, max: 4 },
            { name: this.t('default_city_5'), min: 3, max: 5 },
          ];
    return list.filter((c) => c.name);
  }

  private get workingDays(): Set<number> {
    const raw = this.raw('working_days');
    const arr = Array.isArray(raw) ? raw : [];
    const days = arr
      .map((o) => Number(typeof o === 'object' && o ? (o as { value?: unknown }).value : o))
      .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
    return new Set(days.length ? days : DEFAULT_WORKING_DAYS);
  }

  private get cutoffMinutes(): number {
    const m = /^(\d{1,2}):(\d{2})/.exec(this.str('cutoff_time', '14:00'));
    return m ? clamp(Number(m[1]) * 60 + Number(m[2]), 0, 1439) : 14 * 60;
  }

  protected onSallaReady(): void {
    this.phase = 'ready';
    this.every(30_000, () => {
      this.tick++;
    });
  }

  protected willUpdate(): void {
    if (!this.restored && this.phase === 'ready') {
      this.restored = true;
      const cities = this.cities;
      const wanted = this.city ?? (this.bool('remember_city', true) ? storageGet<string>(STORAGE_KEY, '') : '');
      const idx = cities.findIndex((c) => c.name === wanted);
      if (idx >= 0) this.selected = idx;
    }
  }

  private estimate(city: City): Estimate {
    const tz = this.str('timezone', 'Asia/Riyadh');
    const { civil, minutes } = nowIn(tz);
    const cutoff = this.cutoffMinutes;
    const working = this.workingDays;
    const beforeCutoff = minutes < cutoff && working.has(civil.weekday);
    const processing = clamp(Math.round(this.num('processing_days', 1, 0, 30)), 0, 30);
    // Ship date: today if before cutoff on a working day, else the next working day; then processing days.
    let ship = beforeCutoff ? civil : addBusinessDays(addDays(civil, 1), 0, working);
    ship = addBusinessDays(ship, processing, working);
    const from = addBusinessDays(ship, city.min, working);
    const to = addBusinessDays(ship, city.max, working);
    return { city, from, to, beforeCutoff, msToCutoff: Math.max(0, (cutoff - minutes) * 60_000) };
  }

  private formatDate(c: CivilDate, style: DateStyle, calendar: CalendarKind): string {
    const locale = `${this.locale === 'ar' ? 'ar-SA' : 'en-GB'}-u-ca-${calendar}${this.locale === 'ar' ? '-nu-arab' : ''}`;
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: 'UTC',
        weekday: style === 'long' ? 'long' : 'short',
        day: 'numeric',
        month: style === 'long' ? 'long' : 'short',
      }).format(new Date(c.utc));
    } catch {
      const d = new Date(c.utc);
      return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
    }
  }

  private formatCutoff(): string {
    const mins = this.cutoffMinutes;
    const d = new Date(Date.UTC(2000, 0, 1, Math.floor(mins / 60), mins % 60));
    try {
      return new Intl.DateTimeFormat(this.locale === 'ar' ? 'ar-SA' : 'en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' }).format(d);
    } catch {
      return this.str('cutoff_time', '14:00');
    }
  }

  private formatRemaining(ms: number): string {
    const total = Math.ceil(ms / 60_000);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return h > 0 ? this.t('hours_minutes', { h: num(h), m: num(m) }) : this.t('minutes_only', { m: num(m) });
  }

  private onSelect(e: Event): void {
    const idx = Number((e.target as HTMLSelectElement).value) || 0;
    this.selected = idx;
    const city = this.cities[idx];
    if (city && this.bool('remember_city', true)) storageSet(STORAGE_KEY, city.name);
    this.emit('city-change', { city: city?.name });
  }

  render() {
    if (this.phase === 'error') return html`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const cities = this.cities;
    if (cities.length === 0) return html`<div class="sh-empty" part="empty">${this.t('empty')}</div>`;

    const style = this.choice<EstimatorStyle>('style', STYLES, 'card');
    const dateStyle = this.choice<DateStyle>('date_style', DATE_STYLES, 'long');
    const calendar = this.choice<CalendarKind>('calendar', CALENDARS, 'gregory');
    const showSelect = this.bool('show_city_select', true) && cities.length > 1;
    const showIcon = this.bool('show_icon', true);
    const iconName = this.str('icon', '');
    const idx = clamp(this.selected, 0, cities.length - 1);
    const est = this.estimate(cities[idx]);
    const from = this.formatDate(est.from, dateStyle, calendar);
    const to = this.formatDate(est.to, dateStyle, calendar);
    const subtitle = this.str('subtitle');
    void this.tick;

    if (this.phase === 'ready') {
      this.emit('delivery-estimated', { city: est.city.name, from: new Date(est.from.utc).toISOString(), to: new Date(est.to.utc).toISOString(), beforeCutoff: est.beforeCutoff });
    }

    return html`
      ${iconName.startsWith('sicon-') ? sallaIconStylesheet() : nothing}
      <section class=${classMap({ root: true, [`root--${style}`]: true })} part="root">
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${this.text('title', 'title')}</h3></slot>
          ${subtitle ? html`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${subtitle}</p></slot>` : nothing}
        </div>

        ${showSelect
          ? html`<div class="field">
              <label class="label" for="city">${this.t('city_label')}</label>
              <div class="select-wrap">
                <select id="city" part="select" .value=${String(idx)} @change=${this.onSelect}>
                  ${cities.map((c, i) => html`<option value=${i} ?selected=${i === idx}>${c.name}</option>`)}
                </select>
                ${iconChevronDown()}
              </div>
            </div>`
          : nothing}

        <div class="result" part="result" aria-live="polite">
          ${showIcon ? html`<span class="icon" aria-hidden="true">${sicon(iconName, iconPackage)}</span>` : nothing}
          <div class="body">
            <p class="result-label">${this.text('result_label', 'result_label')}${!showSelect ? html` · ${est.city.name}` : nothing}</p>
            <p class="dates" part="dates">${this.t('range', { from, to })}</p>
            <p class="days">${this.t('business_days', { min: num(est.city.min), max: num(est.city.max) })}</p>
          </div>
        </div>

        ${est.beforeCutoff
          ? html`<p class="cutoff" part="cutoff">
              ${iconClock()}
              <span>${this.renderCountdown(this.text('countdown_text', 'countdown', { time: ' ' }), this.formatRemaining(est.msToCutoff))}</span>
            </p>`
          : html`<p class="cutoff cutoff--after" part="cutoff">${iconClock()}<span>${this.text('after_cutoff_text', 'after_cutoff', { cutoff: this.formatCutoff() })}</span></p>`}
      </section>
    `;
  }

  /** Splits the merchant sentence around the `{time}` placeholder so the remaining time can be emphasised. */
  private renderCountdown(template: string, time: string) {
    const [a, b] = template.split('\u0000');
    return b === undefined ? html`${template} ${time}` : html`${a}<strong>${time}</strong>${b}`;
  }
}
