import { LitElement as M, css as C, svg as w, html as l, nothing as u } from "lit";
import { property as b, state as x, query as E } from "lit/decorators.js";
import { classMap as $ } from "lit/directives/class-map.js";
function p() {
  return window.salla ?? window.Salla;
}
let g = null;
function _(i, t) {
  return new Promise((e) => {
    const r = window.setTimeout(() => e(void 0), t);
    i.then(
      (s) => {
        clearTimeout(r), e(s);
      },
      () => {
        clearTimeout(r), e(void 0);
      }
    );
  });
}
function A(i = 8e3) {
  return g || (g = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = p();
      if (s && typeof s.onReady == "function") {
        _(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? _(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
        return;
      }
      if (Date.now() - e > i) {
        t(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), g);
}
function y() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const e = p();
    try {
      t = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function U() {
  const i = p();
  if (!i) return {};
  try {
    return {
      primary: i.config.get("theme.color.primary") || void 0,
      onPrimary: i.config.get("theme.color.reverse_text") || void 0,
      isDark: !!i.config.get("theme.color.is_dark")
    };
  } catch {
    return {};
  }
}
function S(i, t) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const e = i, r = [e[t], e.ar, e.en, ...Object.values(e)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function I(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (e, r) => r in t ? String(t[r]) : e
  ) : i;
}
function D(i, t) {
  const e = p();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(i)) return;
  const s = {};
  for (const [o, a] of Object.entries(t)) s[`shohrah.${i}.${o}`] = { ar: a.ar, en: a.en };
  try {
    e.lang.addBulk(s), r.add(i);
  } catch {
  }
}
function P(i, t, e, r, s) {
  const o = `shohrah.${i}.${t}`, a = p();
  let d;
  if (a?.lang?.get && a.lang.translationsLoaded)
    try {
      const n = a.lang.get(o);
      typeof n == "string" && n && n !== o && (d = n);
    } catch {
      d = void 0;
    }
  if (!d) {
    const n = e[t];
    d = n ? (r === "ar" ? n.ar : n.en) || n.en || n.ar : t;
  }
  return I(d, s);
}
function O(i) {
  if (i == null || i === "") return "";
  const t = p();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(i));
  } catch {
  }
  return String(i);
}
function N(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
var R = Object.defineProperty, v = (i, t, e, r) => {
  for (var s = void 0, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (s = a(t, e, s) || s);
  return s && R(t, e, s), s;
};
class f extends M {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = y();
    const t = new MutationObserver(() => {
      const e = y();
      e !== this.locale && (this.locale = e, this.onLocaleChange());
    });
    t.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => t.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const t = this.disposers.splice(0);
    for (const e of t)
      try {
        e();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await A(), !!this.isConnected) {
      this.locale = y(), D(this.ns, this.messages), this.applyThemeFallbacks();
      try {
        await this.onSallaReady(), this.emit("ready");
      } catch (t) {
        this.fail(t);
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
  fail(t) {
    const e = t instanceof Error ? t.message : String(t ?? "error");
    this.errorMessage = e, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, t);
    } catch {
    }
    this.emit("error", { message: e });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(t) {
    this.disposers.push(t);
  }
  listen(t, e, r, s) {
    t.addEventListener(e, r, s), this.addDisposer(() => t.removeEventListener(e, r, s));
  }
  delay(t, e) {
    const r = window.setTimeout(e, t);
    return this.addDisposer(() => window.clearTimeout(r)), r;
  }
  every(t, e) {
    const r = window.setInterval(e, t), s = () => window.clearInterval(r);
    return this.addDisposer(s), s;
  }
  own(t) {
    return this.addDisposer(() => t.disconnect()), t;
  }
  emit(t, e = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${t}`, { detail: e, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(t, e) {
    return P(this.ns, t, this.messages, this.locale, e);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(t, e, r) {
    const s = this.str(t);
    return s ? r ? this.interp(s, r) : s : this.t(e, r);
  }
  interp(t, e) {
    return t.replace(/\{(\w+)\}/g, (r, s) => s in e ? String(e[s]) : r);
  }
  get rtl() {
    return getComputedStyle(this).direction === "rtl";
  }
  get reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  /* ------------------------------------------------------------- config getters */
  raw(t) {
    return this.config ? this.config[t] : void 0;
  }
  str(t, e = "") {
    const r = this.raw(t);
    if (r == null) return e;
    if (typeof r == "object") {
      const o = S(r, this.locale);
      return o.trim() ? o : e;
    }
    const s = String(r);
    return s.trim() ? s : e;
  }
  bool(t, e) {
    const r = this.raw(t);
    if (r == null || r === "") return e;
    if (typeof r == "boolean") return r;
    if (typeof r == "number") return r !== 0;
    const s = String(r).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(s) ? !0 : ["false", "0", "no", "off"].includes(s) ? !1 : e;
  }
  num(t, e, r = -1 / 0, s = 1 / 0) {
    const o = this.raw(t), a = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(a) && o != null && o !== "" ? N(a, r, s) : e;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, e, r) {
    let s = this.raw(t);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const o = s == null ? "" : String(s).trim();
    return e.includes(o) ? o : r;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(t) {
    let e = this.raw(t);
    Array.isArray(e) && (e = e[0]), e && typeof e == "object" && (e = e.value);
    const r = Number(e);
    return Number.isFinite(r) && r > 0 ? r : void 0;
  }
  /** Rows of a `collection` field. */
  list(t) {
    const e = this.raw(t);
    return Array.isArray(e) ? e.filter((r) => r && typeof r == "object") : e && typeof e == "object" ? Object.values(e).filter((r) => r && typeof r == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(t, e, r = "") {
    const s = t[e];
    if (s == null) return r;
    if (typeof s == "object") {
      const a = S(s, this.locale);
      return a.trim() ? a : r;
    }
    const o = String(s);
    return o.trim() ? o : r;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(t) {
    return this.linkValue(this.raw(t));
  }
  linkValue(t) {
    if (Array.isArray(t) && (t = t[0]), t && typeof t == "object" && (t = t.url ?? t.value), t == null) return "";
    const e = String(t).trim();
    return !e || e === "#" ? "" : /^(https?:)?\/\//i.test(e) || e.startsWith("/") || e.startsWith("#") || e.startsWith("mailto:") || e.startsWith("tel:") ? e : /^[\w./-]+$/.test(e) ? `/${e}` : "";
  }
  color(t, e) {
    const r = this.str(t, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(r) ? r : e;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: r, onPrimary: s } = U();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, o] = [0, 2, 4].map((n) => parseInt(e.slice(n, n + 2), 16) / 255), a = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * a(r) + 0.7152 * a(s) + 0.0722 * a(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
v([
  b({ type: Object })
], f.prototype, "config");
v([
  x()
], f.prototype, "locale");
v([
  b({ type: String, reflect: !0, attribute: "data-phase" })
], f.prototype, "phase");
v([
  x()
], f.prototype, "errorMessage");
const B = C`
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
`, T = (i, t = !1, e = "") => w`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, F = () => T(w`<path d="M6 6l12 12M18 6L6 18"/>`), H = () => T(w`<path d="M3 16.5L16.5 3 21 7.5 7.5 21 3 16.5z"/><path d="M7 12.5l2 2M10 9.5l2 2M13 6.5l2 2"/>`), W = {
  button: { ar: "دليل المقاسات", en: "Size guide" },
  title: { ar: "دليل المقاسات", en: "Size guide" },
  subtitle: { ar: "قِس نفسك بدقّة واختر مقاسك المثالي", en: "Measure yourself and pick your perfect size" },
  close: { ar: "إغلاق دليل المقاسات", en: "Close size guide" },
  unit_label: { ar: "وحدة القياس", en: "Unit" },
  cm: { ar: "سم", en: "cm" },
  in: { ar: "إنش", en: "in" },
  size: { ar: "المقاس", en: "Size" },
  tips_title: { ar: "كيف تقيس؟", en: "How to measure" },
  fit_note: { ar: "إذا كنت بين مقاسين، ننصح باختيار المقاس الأكبر.", en: "If you are between sizes, we recommend choosing the larger one." },
  empty: { ar: "أضف صفًا واحدًا على الأقل في جدول المقاسات.", en: "Add at least one row to the size table." },
  default_col_1: { ar: "الصدر", en: "Chest" },
  default_col_2: { ar: "الخصر", en: "Waist" },
  default_col_3: { ar: "الورك", en: "Hips" },
  default_tip_1_title: { ar: "الصدر", en: "Chest" },
  default_tip_1_text: { ar: "قِس حول أوسع نقطة في الصدر مع إبقاء شريط القياس مستويًا.", en: "Measure around the fullest part of your chest, keeping the tape level." },
  default_tip_2_title: { ar: "الخصر", en: "Waist" },
  default_tip_2_text: { ar: "قِس حول أضيق جزء من الخصر، فوق السرّة بقليل.", en: "Measure around the narrowest part of your waist, just above the navel." },
  default_tip_3_title: { ar: "الورك", en: "Hips" },
  default_tip_3_text: { ar: "قِس حول أوسع نقطة في الورك مع تقريب القدمين.", en: "Measure around the fullest part of your hips with feet together." }
}, V = C`
  :host {
    display: inline-block;
    --sg-width: 440px;
  }
  .trigger {
    gap: 0.5rem;
  }
  .trigger--link {
    min-height: auto;
    padding: 0.25rem 0;
    border: 0;
    background: transparent;
    color: var(--sh-primary);
    text-decoration: underline;
    text-underline-offset: 0.25em;
    border-radius: var(--sh-radius-sm);
  }
  .trigger--link:hover {
    color: var(--sh-primary-dark);
  }
  .trigger svg {
    width: 1.1rem;
    height: 1.1rem;
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    justify-content: flex-end;
    animation: sg-fade 200ms ease-out;
  }
  .overlay--start {
    justify-content: flex-start;
  }
  @keyframes sg-fade {
    from {
      opacity: 0;
    }
  }
  .drawer {
    width: min(var(--sg-width), 100vw);
    height: 100%;
    background: var(--sh-surface);
    color: var(--sh-text);
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 60px rgba(15, 23, 42, 0.25);
    animation: sg-in 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
    outline: none;
  }
  @keyframes sg-in {
    from {
      transform: translateX(var(--sg-from, 100%));
    }
  }
  .overlay--start .drawer {
    --sg-from: -100%;
  }
  :host(:dir(rtl)) .drawer {
    --sg-from: -100%;
  }
  :host(:dir(rtl)) .overlay--start .drawer {
    --sg-from: 100%;
  }
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.375rem 1rem;
    border-block-end: 1px solid var(--sh-border);
  }
  .head .sh-header {
    margin: 0;
  }
  .accent {
    width: 2.75rem;
    height: 3px;
    border-radius: 2px;
    background: var(--sh-primary);
    margin-block: 0.5rem 0.375rem;
  }
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 1.125rem 1.375rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .unit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .unit-label {
    font-size: 0.85rem;
    color: var(--sh-muted);
    font-weight: 600;
  }
  .seg {
    display: inline-flex;
    padding: 3px;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
  }
  .seg button {
    min-width: 3.25rem;
    padding: 0.25rem 0.875rem;
    border: 0;
    border-radius: var(--sh-radius-pill);
    background: transparent;
    color: var(--sh-muted);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color var(--sh-ease), color var(--sh-ease);
  }
  .seg button[aria-pressed='true'] {
    background: var(--sh-primary);
    color: var(--sh-on-primary);
  }
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
    min-width: 18rem;
  }
  th,
  td {
    padding: 0.7rem 0.875rem;
    text-align: start;
    border-block-end: 1px solid var(--sh-border);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  tr:last-child td {
    border-block-end: 0;
  }
  th {
    color: var(--sh-primary);
    font-weight: 700;
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    position: sticky;
    top: 0;
  }
  td:first-child {
    font-weight: 700;
  }
  tbody tr:hover td {
    background: var(--sh-surface-2);
  }
  .note {
    margin: 0;
    padding: 0.75rem 0.875rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    color: var(--sh-text);
    font-size: 0.88rem;
    line-height: 1.6;
  }
  .diagram {
    width: 100%;
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    object-fit: contain;
    background: var(--sh-surface-2);
  }
  .tips h4 {
    margin: 0 0 0.625rem;
    font-size: 0.98rem;
    font-weight: 700;
  }
  .tips ol {
    margin: 0;
    padding-inline-start: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--sh-muted);
  }
  .tips li strong {
    color: var(--sh-text);
  }
  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .drawer {
      animation: none;
    }
  }
  @media (max-width: 480px) {
    .drawer {
      width: 100vw;
    }
  }
`;
var X = Object.defineProperty, m = (i, t, e, r) => {
  for (var s = void 0, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (s = a(t, e, s) || s);
  return s && X(t, e, s), s;
};
const z = ["cm", "in"], K = ["link", "outline", "solid"], q = ["end", "start"], Y = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', k = class k extends f {
  constructor() {
    super(...arguments), this.ns = "size-guide-drawer", this.messages = W, this.open = !1, this.activeUnit = "cm", this.unitInitialised = !1, this.previousOverflow = "", this.keyHandler = (t) => this.onKeydown(t);
  }
  get columns() {
    const e = this.list("columns").map((r) => this.rowText(r, "label")).filter(Boolean);
    return e.length ? e : [1, 2, 3].map((r) => this.t(`default_col_${r}`));
  }
  get rows() {
    const t = this.list("rows");
    return (t.length ? t : [
      { size: "S", values: "92 | 76 | 100" },
      { size: "M", values: "100 | 84 | 108" },
      { size: "L", values: "108 | 92 | 116" },
      { size: "XL", values: "116 | 100 | 124" }
    ]).map((r) => ({
      size: String(r.size ?? "").trim(),
      values: String(r.values ?? "").split("|").map((s) => s.trim())
    })).filter((r) => r.size);
  }
  get tips() {
    const t = this.list("tips");
    return t.length ? t.map((e) => ({ title: this.rowText(e, "title"), text: this.rowText(e, "text") })).filter((e) => e.title || e.text) : [1, 2, 3].map((e) => ({ title: this.t(`default_tip_${e}_title`), text: this.t(`default_tip_${e}_text`) }));
  }
  onSallaReady() {
    this.phase = "ready";
  }
  willUpdate() {
    !this.unitInitialised && this.phase === "ready" && (this.unitInitialised = !0, this.activeUnit = this.unit ?? this.choice("default_unit", z, "cm"));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.unlockScroll(), document.removeEventListener("keydown", this.keyHandler);
  }
  convert(t) {
    if (!t) return "—";
    const e = Number(t.replace(/[^\d.]/g, ""));
    if (!t.match(/^\s*[\d.]+\s*$/) || !Number.isFinite(e)) return t;
    const r = this.activeUnit === "in" ? Math.round(e / 2.54 * 10) / 10 : Math.round(e * 10) / 10;
    return `${O(r)} ${this.t(this.activeUnit)}`;
  }
  setUnit(t) {
    t !== this.activeUnit && (this.activeUnit = t, this.emit("unit-change", { unit: t }));
  }
  show() {
    this.open = !0, this.lockScroll(), document.addEventListener("keydown", this.keyHandler), this.emit("size-guide-open"), this.updateComplete.then(() => this.drawerEl?.focus());
  }
  hide() {
    this.open && (this.open = !1, this.unlockScroll(), document.removeEventListener("keydown", this.keyHandler), this.emit("size-guide-close"), this.updateComplete.then(() => this.triggerEl?.focus()));
  }
  lockScroll() {
    this.previousOverflow = document.body.style.overflow, document.body.style.overflow = "hidden";
  }
  unlockScroll() {
    (this.open || document.body.style.overflow === "hidden") && (document.body.style.overflow = this.previousOverflow);
  }
  /** Esc closes; Tab is trapped inside the drawer. */
  onKeydown(t) {
    if (!this.open) return;
    if (t.key === "Escape") {
      t.preventDefault(), this.hide();
      return;
    }
    if (t.key !== "Tab" || !this.drawerEl) return;
    const e = Array.from(this.drawerEl.querySelectorAll(Y)).filter((a) => !a.hasAttribute("disabled"));
    if (e.length === 0) return;
    const r = e[0], s = e[e.length - 1], o = this.shadowRoot?.activeElement;
    t.shiftKey && (o === r || o === this.drawerEl) ? (t.preventDefault(), s.focus()) : !t.shiftKey && o === s && (t.preventDefault(), r.focus());
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const t = this.choice("button_style", K, "link"), e = this.bool("show_button_icon", !0), r = this.choice("drawer_side", q, "end"), s = this.num("drawer_width", 440, 320, 720), o = this.rows;
    return l`
      <button
        class=${$({ "sh-btn": !0, trigger: !0, [`trigger--${t}`]: !0, "sh-btn--ghost": t === "outline", "sh-btn--primary": t === "solid" })}
        part="trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded=${String(this.open)}
        @click=${this.show}
      >
        <slot name="button">${e ? H() : u}<span>${this.text("button_text", "button")}</span></slot>
      </button>
      ${this.open ? this.renderDrawer(r, s, o) : u}
    `;
  }
  renderDrawer(t, e, r) {
    const s = this.columns, o = this.text("subtitle", "subtitle"), a = this.text("fit_note", "fit_note"), d = this.str("image", ""), n = this.tips, L = this.bool("show_unit_toggle", !0);
    return l`<div
      class=${$({ overlay: !0, [`overlay--${t}`]: !0 })}
      style="--sg-width:${e}px"
      @click=${(h) => {
      h.target === h.currentTarget && this.hide();
    }}
    >
      <aside class="drawer" part="drawer" role="dialog" aria-modal="true" aria-labelledby="sg-title" tabindex="-1">
        <header class="head">
          <div class="sh-header">
            <h3 id="sg-title" class="sh-title" part="title">${this.text("title", "title")}</h3>
            <span class="accent" aria-hidden="true"></span>
            ${o ? l`<p class="sh-subtitle" part="subtitle">${o}</p>` : u}
          </div>
          <button class="sh-icon-btn" part="close" type="button" aria-label=${this.t("close")} @click=${this.hide}>${F()}</button>
        </header>
        <div class="content">
          ${L ? l`<div class="unit">
                <span class="unit-label">${this.t("unit_label")}</span>
                <div class="seg" role="group" aria-label=${this.t("unit_label")}>
                  ${z.map((h) => l`<button type="button" aria-pressed=${String(this.activeUnit === h)} @click=${() => this.setUnit(h)}>${this.t(h)}</button>`)}
                </div>
              </div>` : u}
          ${r.length === 0 ? l`<div class="sh-empty">${this.t("empty")}</div>` : l`<div class="table-wrap">
                <table part="table">
                  <thead>
                    <tr>
                      <th scope="col">${this.t("size")}</th>
                      ${s.map((h) => l`<th scope="col">${h}</th>`)}
                    </tr>
                  </thead>
                  <tbody>
                    ${r.map(
      (h) => l`<tr>
                        <th scope="row" style="background:transparent;color:inherit;position:static">${h.size}</th>
                        ${s.map((J, j) => l`<td>${this.convert(h.values[j] ?? "")}</td>`)}
                      </tr>`
    )}
                  </tbody>
                </table>
              </div>`}
          ${a ? l`<p class="note">${a}</p>` : u}
          ${d ? l`<img class="diagram" src=${d} alt="" loading="lazy" />` : u}
          ${n.length ? l`<section class="tips" part="tips">
                <h4>${this.t("tips_title")}</h4>
                <ol>
                  ${n.map((h) => l`<li>${h.title ? l`<strong>${h.title}:</strong> ` : u}${h.text}</li>`)}
                </ol>
              </section>` : u}
          <slot name="extra"></slot>
        </div>
      </aside>
    </div>`;
  }
};
k.styles = [B, V];
let c = k;
m([
  b({ type: Boolean, reflect: !0 })
], c.prototype, "open");
m([
  b({ type: String })
], c.prototype, "unit");
m([
  x()
], c.prototype, "activeUnit");
m([
  E(".drawer")
], c.prototype, "drawerEl");
m([
  E(".trigger")
], c.prototype, "triggerEl");
typeof c < "u" && c.registerSallaComponent("salla-size-guide-drawer");
export {
  c as default
};
