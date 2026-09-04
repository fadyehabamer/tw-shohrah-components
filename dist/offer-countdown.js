import { LitElement as U, css as A, svg as L, html as h, nothing as m } from "lit";
import { property as w, state as p } from "lit/decorators.js";
import { classMap as D } from "lit/directives/class-map.js";
function u() {
  return window.salla ?? window.Salla;
}
let y = null;
function C(s, e) {
  return new Promise((t) => {
    const r = window.setTimeout(() => t(void 0), e);
    s.then(
      (i) => {
        clearTimeout(r), t(i);
      },
      () => {
        clearTimeout(r), t(void 0);
      }
    );
  });
}
function F(s = 8e3) {
  return y || (y = new Promise((e) => {
    const t = Date.now(), r = () => {
      const i = u();
      if (i && typeof i.onReady == "function") {
        C(Promise.resolve(i.onReady()), s).then(() => i.lang?.onLoaded ? C(i.lang.onLoaded(), 4e3) : void 0).then(() => e(i));
        return;
      }
      if (Date.now() - t > s) {
        e(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), y);
}
function S() {
  const s = document.documentElement.getAttribute("lang");
  let e = s && s.trim();
  if (!e) {
    const t = u();
    try {
      e = t?.lang?.getLocale?.() || t?.config?.get("user.language_code");
    } catch {
      e = void 0;
    }
  }
  return (e || "ar").toLowerCase().split(/[-_]/)[0];
}
function B() {
  const s = u();
  if (!s) return {};
  try {
    return {
      primary: s.config.get("theme.color.primary") || void 0,
      onPrimary: s.config.get("theme.color.reverse_text") || void 0,
      isDark: !!s.config.get("theme.color.is_dark")
    };
  } catch {
    return {};
  }
}
const v = "shohrah.";
function V(s, e) {
  const t = u();
  try {
    if (t?.storage?.get) return t.storage.get(v + s, e) ?? e;
    const r = window.localStorage.getItem(v + s);
    return r == null ? e : JSON.parse(r);
  } catch {
    return e;
  }
}
function G(s, e) {
  const t = u();
  try {
    if (t?.storage?.set) {
      t.storage.set(v + s, e);
      return;
    }
    window.localStorage.setItem(v + s, JSON.stringify(e));
  } catch {
  }
}
function j(s, e) {
  if (s == null) return "";
  if (typeof s == "string") return s;
  if (typeof s == "number") return String(s);
  if (Array.isArray(s)) return "";
  const t = s, r = [t[e], t.ar, t.en, ...Object.values(t)];
  for (const i of r) if (typeof i == "string" && i.trim()) return i;
  return "";
}
function X(s, e) {
  return e ? s.replace(
    /\{(\w+)\}/g,
    (t, r) => r in e ? String(e[r]) : t
  ) : s;
}
function W(s, e) {
  const t = u();
  if (!t?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(s)) return;
  const i = {};
  for (const [n, o] of Object.entries(e)) i[`shohrah.${s}.${n}`] = { ar: o.ar, en: o.en };
  try {
    t.lang.addBulk(i), r.add(s);
  } catch {
  }
}
function H(s, e, t, r, i) {
  const n = `shohrah.${s}.${e}`, o = u();
  let d;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const a = o.lang.get(n);
      typeof a == "string" && a && a !== n && (d = a);
    } catch {
      d = void 0;
    }
  if (!d) {
    const a = t[e];
    d = a ? (r === "ar" ? a.ar : a.en) || a.en || a.ar : e;
  }
  return X(d, i);
}
function b(s) {
  if (s == null || s === "") return "";
  const e = u();
  try {
    if (e?.helpers?.number) return String(e.helpers.number(s));
  } catch {
  }
  return String(s);
}
function Y(s, e, t) {
  return Math.min(t, Math.max(e, s));
}
function J(s) {
  return s < 10 ? `0${s}` : String(s);
}
var q = Object.defineProperty, x = (s, e, t, r) => {
  for (var i = void 0, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = o(e, t, i) || i);
  return i && q(e, t, i), i;
};
class f extends U {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = S();
    const e = new MutationObserver(() => {
      const t = S();
      t !== this.locale && (this.locale = t, this.onLocaleChange());
    });
    e.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => e.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const e = this.disposers.splice(0);
    for (const t of e)
      try {
        t();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await F(), !!this.isConnected) {
      this.locale = S(), W(this.ns, this.messages), this.applyThemeFallbacks();
      try {
        await this.onSallaReady(), this.emit("ready");
      } catch (e) {
        this.fail(e);
      }
    }
  }
  /** Override to load data. Default: mark ready. */
  onSallaReady() {
    this.phase = "ready";
  }
  onLocaleChange() {
    this.requestUpdate();
  }
  fail(e) {
    const t = e instanceof Error ? e.message : String(e ?? "error");
    this.errorMessage = t, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, e);
    } catch {
    }
    this.emit("error", { message: t });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(e) {
    this.disposers.push(e);
  }
  listen(e, t, r, i) {
    e.addEventListener(t, r, i), this.addDisposer(() => e.removeEventListener(t, r, i));
  }
  delay(e, t) {
    const r = window.setTimeout(t, e);
    return this.addDisposer(() => window.clearTimeout(r)), r;
  }
  every(e, t) {
    const r = window.setInterval(t, e), i = () => window.clearInterval(r);
    return this.addDisposer(i), i;
  }
  own(e) {
    return this.addDisposer(() => e.disconnect()), e;
  }
  emit(e, t = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${e}`, { detail: t, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(e, t) {
    return H(this.ns, e, this.messages, this.locale, t);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(e, t, r) {
    const i = this.str(e);
    return i ? r ? this.interp(i, r) : i : this.t(t, r);
  }
  interp(e, t) {
    return e.replace(/\{(\w+)\}/g, (r, i) => i in t ? String(t[i]) : r);
  }
  get rtl() {
    return getComputedStyle(this).direction === "rtl";
  }
  get reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  /* ------------------------------------------------------------- config getters */
  raw(e) {
    return this.config ? this.config[e] : void 0;
  }
  str(e, t = "") {
    const r = this.raw(e);
    if (r == null) return t;
    if (typeof r == "object") {
      const n = j(r, this.locale);
      return n.trim() ? n : t;
    }
    const i = String(r);
    return i.trim() ? i : t;
  }
  bool(e, t) {
    const r = this.raw(e);
    if (r == null || r === "") return t;
    if (typeof r == "boolean") return r;
    if (typeof r == "number") return r !== 0;
    const i = String(r).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(i) ? !0 : ["false", "0", "no", "off"].includes(i) ? !1 : t;
  }
  num(e, t, r = -1 / 0, i = 1 / 0) {
    const n = this.raw(e), o = typeof n == "number" ? n : Number(String(n ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && n != null && n !== "" ? Y(o, r, i) : t;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(e, t, r) {
    let i = this.raw(e);
    Array.isArray(i) && (i = i[0]), i && typeof i == "object" && (i = i.value ?? i.key);
    const n = i == null ? "" : String(i).trim();
    return t.includes(n) ? n : r;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(e) {
    let t = this.raw(e);
    Array.isArray(t) && (t = t[0]), t && typeof t == "object" && (t = t.value);
    const r = Number(t);
    return Number.isFinite(r) && r > 0 ? r : void 0;
  }
  /** Rows of a `collection` field. */
  list(e) {
    const t = this.raw(e);
    return Array.isArray(t) ? t.filter((r) => r && typeof r == "object") : t && typeof t == "object" ? Object.values(t).filter((r) => r && typeof r == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(e, t, r = "") {
    const i = e[t];
    if (i == null) return r;
    if (typeof i == "object") {
      const o = j(i, this.locale);
      return o.trim() ? o : r;
    }
    const n = String(i);
    return n.trim() ? n : r;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(e) {
    return this.linkValue(this.raw(e));
  }
  linkValue(e) {
    if (Array.isArray(e) && (e = e[0]), e && typeof e == "object" && (e = e.url ?? e.value), e == null) return "";
    const t = String(e).trim();
    return !t || t === "#" ? "" : /^(https?:)?\/\//i.test(t) || t.startsWith("/") || t.startsWith("#") || t.startsWith("mailto:") || t.startsWith("tel:") ? t : /^[\w./-]+$/.test(t) ? `/${t}` : "";
  }
  color(e, t) {
    const r = this.str(e, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(r) ? r : t;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: r, onPrimary: i } = B();
      r && this.style.setProperty("--shohrah-primary", r), i && this.style.setProperty("--shohrah-on-primary", i);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(e) {
    const t = e.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(t)) return "#ffffff";
    const [r, i, n] = [0, 2, 4].map((a) => parseInt(t.slice(a, a + 2), 16) / 255), o = (a) => a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(r) + 0.7152 * o(i) + 0.0722 * o(n) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
x([
  w({ type: Object })
], f.prototype, "config");
x([
  p()
], f.prototype, "locale");
x([
  w({ type: String, reflect: !0, attribute: "data-phase" })
], f.prototype, "phase");
x([
  p()
], f.prototype, "errorMessage");
const K = A`
  :host {
    --sh-primary: var(--color-primary, var(--shohrah-primary, #1f5c5a));
    --sh-primary-dark: var(--color-primary-dark, var(--shohrah-primary-dark, #174846));
    --sh-primary-light: var(--color-primary-light, var(--shohrah-primary-light, #2f7f7b));
    --sh-on-primary: var(--color-primary-reverse, var(--shohrah-on-primary, #ffffff));
    --sh-font: var(
      --font-main,
      var(--shohrah-font, 'PingARLT', 'DINNextLTArabic', system-ui, -apple-system, 'Segoe UI', Tahoma, sans-serif)
    );
    --sh-radius: var(--s-radius, var(--shohrah-radius, 0.75rem));
    --sh-radius-sm: calc(var(--sh-radius) * 0.5);
    --sh-radius-pill: 999px;

    --sh-surface: var(--shohrah-surface, #ffffff);
    --sh-surface-2: var(--shohrah-surface-2, #f7f7f6);
    --sh-text: var(--shohrah-text, #1c1c1c);
    --sh-muted: var(--shohrah-muted, #6b7280);
    --sh-border: var(--shohrah-border, rgba(0, 0, 0, 0.08));
    --sh-shadow: var(--shohrah-shadow, 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06));
    --sh-success: var(--shohrah-success, #15803d);
    --sh-warning: var(--shohrah-warning, #b45309);
    --sh-danger: var(--shohrah-danger, #b91c1c);
    --sh-space: var(--shohrah-space, 1rem);
    --sh-ease: 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
    --sh-focus: 0 0 0 3px color-mix(in srgb, var(--sh-primary) 35%, transparent);

    display: block;
    box-sizing: border-box;
    font-family: var(--sh-font);
    color: var(--sh-text);
    font-size: 1rem;
    line-height: 1.75;
    letter-spacing: 0;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  :host(:dir(ltr)) {
    line-height: 1.55;
    letter-spacing: -0.005em;
  }
  :host([hidden]) {
    display: none !important;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  a {
    color: inherit;
  }
  button {
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
  }
  img {
    max-width: 100%;
    display: block;
  }
  :focus-visible {
    outline: none;
    box-shadow: var(--sh-focus);
    border-radius: var(--sh-radius-sm);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  .sh-title {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.45;
    color: var(--sh-text);
  }
  .sh-subtitle {
    margin: 0.25rem 0 0;
    color: var(--sh-muted);
    font-size: 0.95rem;
  }
  .sh-header {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin-block-end: calc(var(--sh-space) * 1.25);
  }
  .sh-header--center {
    text-align: center;
    align-items: center;
  }
  .sh-card {
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
  }
  .sh-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    padding: 0.5rem 1.25rem;
    border-radius: var(--sh-radius);
    border: 1px solid transparent;
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.2;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color var(--sh-ease),
      color var(--sh-ease),
      border-color var(--sh-ease),
      transform var(--sh-ease),
      opacity var(--sh-ease);
  }
  .sh-btn:active {
    transform: translateY(1px);
  }
  .sh-btn[disabled],
  .sh-btn[aria-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
  }
  .sh-btn--primary {
    background: var(--sh-primary);
    color: var(--sh-on-primary);
  }
  .sh-btn--primary:hover {
    background: var(--sh-primary-dark);
  }
  .sh-btn--ghost {
    background: transparent;
    color: var(--sh-primary);
    border-color: var(--sh-border);
  }
  .sh-btn--ghost:hover {
    border-color: var(--sh-primary);
    background: color-mix(in srgb, var(--sh-primary) 6%, transparent);
  }
  .sh-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border-radius: 50%;
    border: 1px solid var(--sh-border);
    background: var(--sh-surface);
    color: var(--sh-text);
    cursor: pointer;
    transition:
      background-color var(--sh-ease),
      border-color var(--sh-ease),
      opacity var(--sh-ease);
  }
  .sh-icon-btn:hover {
    border-color: var(--sh-primary);
    color: var(--sh-primary);
  }
  .sh-icon-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .sh-icon-btn svg {
    width: 1.125rem;
    height: 1.125rem;
  }
  svg.sh-svg {
    width: 1.25em;
    height: 1.25em;
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  svg.sh-svg--fill {
    fill: currentColor;
    stroke: none;
  }
  .sh-flip-rtl {
    transform: none;
  }
  :host(:dir(rtl)) .sh-flip-rtl {
    transform: scaleX(-1);
  }
  .sicon {
    font-size: 1.5em;
    line-height: 1;
    display: inline-block;
  }
  .sh-skeleton {
    position: relative;
    overflow: hidden;
    background: var(--sh-surface-2);
    border-radius: var(--sh-radius-sm);
    color: transparent !important;
  }
  .sh-skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%);
    animation: sh-shimmer 1.4s ease-in-out infinite;
  }
  @keyframes sh-shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
  .sh-error,
  .sh-empty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: var(--sh-radius);
    border: 1px dashed var(--sh-border);
    color: var(--sh-muted);
    font-size: 0.9rem;
  }
  .sh-error {
    color: var(--sh-danger);
    border-color: color-mix(in srgb, var(--sh-danger) 35%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`, Q = (s, e = !1, t = "") => L`<svg class="sh-svg ${e ? "sh-svg--fill" : ""} ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${s}</svg>`, Z = () => Q(L`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), ee = {
  title: { ar: "العرض ينتهي خلال", en: "Offer ends in" },
  subtitle: { ar: "خصم حتى ٣٠٪ على تشكيلة مختارة", en: "Up to 30% off selected items" },
  cta: { ar: "تسوّق العرض", en: "Shop the offer" },
  expired: { ar: "انتهى العرض — تابعنا للعروض القادمة", en: "Offer ended — stay tuned for the next one" },
  days: { ar: "يوم", en: "Days" },
  hours: { ar: "ساعة", en: "Hours" },
  minutes: { ar: "دقيقة", en: "Min" },
  seconds: { ar: "ثانية", en: "Sec" },
  timer_label: { ar: "الوقت المتبقي على انتهاء العرض", en: "Time left until the offer ends" },
  remaining_text: {
    ar: "متبقٍ {days} يوم و{hours} ساعة و{minutes} دقيقة",
    en: "{days} days, {hours} hours and {minutes} minutes remaining"
  },
  invalid_date: { ar: "تاريخ الانتهاء غير صالح. راجع إعدادات العنصر.", en: "Invalid end date. Check the component settings." }
}, te = A`
  :host {
    --cd-accent: var(--sh-primary);
    --cd-on-accent: var(--sh-on-primary);
  }
  .root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    padding: 1.125rem 1.375rem;
    border-radius: var(--sh-radius);
  }
  .root--surface {
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
    box-shadow: var(--sh-shadow);
  }
  .root--primary {
    background: var(--cd-accent);
    color: var(--cd-on-accent);
    --sh-muted: color-mix(in srgb, var(--cd-on-accent) 78%, transparent);
  }
  .root--stacked {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .root--center {
    justify-content: center;
    text-align: center;
  }
  .copy {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
    flex: 1 1 14rem;
  }
  .root--center .copy {
    align-items: center;
    flex: 0 1 auto;
  }
  .title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
  }
  .subtitle {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.92rem;
  }
  .timer {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    direction: ltr;
    flex: none;
  }
  .root--center .timer,
  .root--stacked .timer {
    justify-content: center;
  }
  .unit {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-width: 3.25rem;
  }
  .digits {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    min-height: 3rem;
    padding: 0.25rem 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    transition: background-color var(--sh-ease), color var(--sh-ease);
  }
  .digits--boxed {
    background: color-mix(in srgb, var(--cd-accent) 10%, var(--sh-surface));
    color: var(--cd-accent);
    border-radius: var(--sh-radius-sm);
    border: 1px solid color-mix(in srgb, var(--cd-accent) 20%, transparent);
  }
  .root--primary .digits--boxed {
    background: color-mix(in srgb, var(--cd-on-accent) 14%, transparent);
    color: var(--cd-on-accent);
    border-color: color-mix(in srgb, var(--cd-on-accent) 25%, transparent);
  }
  .digits--pill {
    background: var(--cd-accent);
    color: var(--cd-on-accent);
    border-radius: var(--sh-radius-pill);
    min-width: 3.5rem;
  }
  .root--primary .digits--pill {
    background: var(--cd-on-accent);
    color: var(--cd-accent);
  }
  .digits--minimal {
    min-height: auto;
    padding: 0;
    font-size: 1.75rem;
    color: inherit;
  }
  .label {
    font-size: 0.72rem;
    color: var(--sh-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .colon {
    font-size: 1.25rem;
    font-weight: 700;
    opacity: 0.5;
    margin-block-end: 1.1rem;
  }
  .digits--minimal + .label {
    display: none;
  }
  .root--pulse .digits {
    animation: cd-pulse 1s ease-in-out infinite;
  }
  @keyframes cd-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
  }
  .cta {
    flex: none;
  }
  .root--primary .sh-btn--primary {
    background: var(--cd-on-accent);
    color: var(--cd-accent);
  }
  .root--primary .sh-btn--primary:hover {
    background: color-mix(in srgb, var(--cd-on-accent) 90%, #000);
  }
  .expired {
    margin: 0;
    font-weight: 600;
  }
  .skel {
    width: 12rem;
    height: 3rem;
  }
  @media (max-width: 480px) {
    .digits {
      min-width: 2.75rem;
      font-size: 1.25rem;
      min-height: 2.5rem;
    }
    .unit {
      min-width: 2.75rem;
    }
  }
`;
var re = Object.defineProperty, g = (s, e, t, r) => {
  for (var i = void 0, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = o(e, t, i) || i);
  return i && re(e, t, i), i;
};
const ie = ["fixed_date", "daily", "evergreen"], se = ["boxed", "minimal", "pill"], ne = ["inline", "stacked"], oe = ["start", "center"], ae = ["transparent", "surface", "primary"], ce = ["hide", "message"];
function E(s) {
  const e = Math.max(0, s), t = Math.floor(e / 1e3);
  return {
    total: e,
    days: Math.floor(t / 86400),
    hours: Math.floor(t % 86400 / 3600),
    minutes: Math.floor(t % 3600 / 60),
    seconds: t % 60
  };
}
function he(s) {
  let e = 0;
  for (let t = 0; t < s.length; t++) e = e * 31 + s.charCodeAt(t) | 0;
  return Math.abs(e).toString(36);
}
const M = class M extends f {
  constructor() {
    super(...arguments), this.ns = "offer-countdown", this.messages = ee, this.remaining = E(0), this.expired = !1, this.invalid = !1, this.deadlineMs = 0, this.expiredEmitted = !1;
  }
  get effectiveMode() {
    return this.mode ?? this.choice("mode", ie, "daily");
  }
  onSallaReady() {
    this.computeDeadline(), this.tick(), this.stopTick = this.every(1e3, () => this.tick()), this.phase = "ready";
  }
  updated(e) {
    (e.has("config") || e.has("mode") || e.has("deadline")) && this.phase === "ready" && (this.computeDeadline(), this.tick());
  }
  endOfToday() {
    const e = /* @__PURE__ */ new Date();
    return e.setHours(23, 59, 59, 999), e.getTime();
  }
  computeDeadline() {
    this.invalid = !1;
    const e = this.effectiveMode;
    if (this.deadline) {
      const i = Date.parse(this.deadline);
      this.deadlineMs = Number.isFinite(i) ? i : 0, this.invalid = !this.deadlineMs;
      return;
    }
    if (e === "daily") {
      this.deadlineMs = this.endOfToday();
      return;
    }
    if (e === "evergreen") {
      const i = this.num("evergreen_hours", 24, 1, 168), n = `countdown.evergreen.${he(this.str("title") + i)}`, o = V(n, 0);
      o && o > Date.now() ? this.deadlineMs = o : (this.deadlineMs = Date.now() + i * 36e5, G(n, this.deadlineMs));
      return;
    }
    const t = this.str("end_datetime", ""), r = Date.parse(t);
    if (!t || !Number.isFinite(r)) {
      this.invalid = !0, this.deadlineMs = 0;
      return;
    }
    this.deadlineMs = r;
  }
  tick() {
    if (this.invalid) return;
    let e = this.deadlineMs - Date.now();
    e <= 0 && this.effectiveMode === "daily" && (this.deadlineMs = this.endOfToday(), e = this.deadlineMs - Date.now()), this.remaining = E(e);
    const t = e <= 0;
    t !== this.expired && (this.expired = t), t && !this.expiredEmitted && (this.expiredEmitted = !0, this.emit("countdown-expired"), this.stopTick?.());
  }
  onCta(e) {
    this.emit("cta-click", { href: e });
  }
  render() {
    if (this.phase === "error") return h`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.invalid) return h`<div class="sh-error" role="alert">${this.t("invalid_date")}</div>`;
    const e = this.choice("layout", ne, "inline"), t = this.choice("align", oe, "center"), r = this.choice("digit_style", se, "boxed"), i = this.choice("background", ae, "surface"), n = this.choice("expired_behavior", ce, "hide"), o = this.bool("show_days", !0), d = this.bool("show_cta", !0), a = this.bool("use_theme_color", !0), O = this.bool("pulse_last_hour", !0) && !this.reducedMotion, k = this.link("cta_link"), _ = this.str("subtitle");
    let $ = "";
    if (!a) {
      const T = this.color("accent_color", "#1f5c5a");
      $ = `--cd-accent:${T};--cd-on-accent:${this.readableOn(T)}`;
    }
    if (this.expired)
      return n === "hide" ? m : h`<div class=${D({ root: !0, [`root--${i}`]: !0, "root--center": !0 })} style=${$} part="root">
        <slot name="expired"><p class="expired" part="expired" role="status">${this.text("expired_message", "expired")}</p></slot>
      </div>`;
    const c = this.remaining, z = this.phase === "loading", I = c.total > 0 && c.total < 36e5, P = {
      root: !0,
      [`root--${i}`]: i !== "transparent",
      [`root--${e}`]: !0,
      "root--center": t === "center",
      "root--pulse": O && I
    }, N = o ? c.hours : c.hours + c.days * 24, R = this.t("remaining_text", { days: b(c.days), hours: b(c.hours), minutes: b(c.minutes) });
    return h`
      <section class=${D(P)} style=${$} part="root">
        <div class="copy">
          <slot name="title"><h3 class="title" part="title">${this.text("title", "title")}</h3></slot>
          ${_ ? h`<slot name="subtitle"><p class="subtitle" part="subtitle">${_}</p></slot>` : m}
        </div>
        ${z ? h`<div class="sh-skeleton skel" aria-hidden="true"></div>` : h`<div class="timer" part="timer" role="timer" aria-label=${this.t("timer_label")} aria-live="off">
              <span class="sr-only">${R}</span>
              ${o ? this.renderUnit(c.days, "days", r) : m}
              ${o ? this.renderColon() : m}
              ${this.renderUnit(N, "hours", r)}
              ${this.renderColon()}
              ${this.renderUnit(c.minutes, "minutes", r)}
              ${this.renderColon()}
              ${this.renderUnit(c.seconds, "seconds", r)}
            </div>`}
        ${d && k ? h`<div class="cta" part="cta">
              <slot name="cta">
                <a class="sh-btn sh-btn--primary" href=${k} @click=${() => this.onCta(k)}>${this.text("cta_text", "cta")} ${Z()}</a>
              </slot>
            </div>` : m}
      </section>
    `;
  }
  renderUnit(e, t, r) {
    return h`<span class="unit" part="unit" aria-hidden="true">
      <span class="digits digits--${r}" part="digits">${b(J(e))}</span>
      <span class="label" part="label">${this.t(t)}</span>
    </span>`;
  }
  renderColon() {
    return h`<span class="colon" aria-hidden="true">:</span>`;
  }
};
M.styles = [K, te];
let l = M;
g([
  w({ type: String })
], l.prototype, "mode");
g([
  w({ type: String })
], l.prototype, "deadline");
g([
  p()
], l.prototype, "remaining");
g([
  p()
], l.prototype, "expired");
g([
  p()
], l.prototype, "invalid");
typeof l < "u" && l.registerSallaComponent("salla-offer-countdown");
export {
  l as default
};
