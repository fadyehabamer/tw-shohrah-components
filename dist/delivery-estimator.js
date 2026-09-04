import { LitElement as R, css as N, html as l, svg as w, nothing as f } from "lit";
import { property as D, state as x } from "lit/decorators.js";
import { classMap as U } from "lit/directives/class-map.js";
function d() {
  return window.salla ?? window.Salla;
}
let y = null;
function E(i, t) {
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
function F(i = 8e3) {
  return y || (y = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = d();
      if (s && typeof s.onReady == "function") {
        E(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? E(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
        return;
      }
      if (Date.now() - e > i) {
        t(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), y);
}
function S() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const e = d();
    try {
      t = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function Y(i) {
  const t = d();
  try {
    if (t?.url?.cdn) return t.url.cdn(i);
  } catch {
  }
  return `https://cdn.salla.network/${i.replace(/^\/+/, "")}`;
}
function W() {
  const i = d();
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
const v = "shohrah.";
function B(i, t) {
  const e = d();
  try {
    if (e?.storage?.get) return e.storage.get(v + i, t) ?? t;
    const r = window.localStorage.getItem(v + i);
    return r == null ? t : JSON.parse(r);
  } catch {
    return t;
  }
}
function G(i, t) {
  const e = d();
  try {
    if (e?.storage?.set) {
      e.storage.set(v + i, t);
      return;
    }
    window.localStorage.setItem(v + i, JSON.stringify(t));
  } catch {
  }
}
function j(i, t) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const e = i, r = [e[t], e.ar, e.en, ...Object.values(e)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function V(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (e, r) => r in t ? String(t[r]) : e
  ) : i;
}
function X(i, t) {
  const e = d();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(i)) return;
  const s = {};
  for (const [n, o] of Object.entries(t)) s[`shohrah.${i}.${n}`] = { ar: o.ar, en: o.en };
  try {
    e.lang.addBulk(s), r.add(i);
  } catch {
  }
}
function J(i, t, e, r, s) {
  const n = `shohrah.${i}.${t}`, o = d();
  let h;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const a = o.lang.get(n);
      typeof a == "string" && a && a !== n && (h = a);
    } catch {
      h = void 0;
    }
  if (!h) {
    const a = e[t];
    h = a ? (r === "ar" ? a.ar : a.en) || a.en || a.ar : t;
  }
  return V(h, s);
}
function p(i) {
  if (i == null || i === "") return "";
  const t = d();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(i));
  } catch {
  }
  return String(i);
}
function m(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
var Z = Object.defineProperty, _ = (i, t, e, r) => {
  for (var s = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (s = o(t, e, s) || s);
  return s && Z(t, e, s), s;
};
class g extends R {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = S();
    const t = new MutationObserver(() => {
      const e = S();
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
    if (this.salla = await F(), !!this.isConnected) {
      this.locale = S(), X(this.ns, this.messages), this.applyThemeFallbacks();
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
    return J(this.ns, t, this.messages, this.locale, e);
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
      const n = j(r, this.locale);
      return n.trim() ? n : e;
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
    const n = this.raw(t), o = typeof n == "number" ? n : Number(String(n ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && n != null && n !== "" ? m(o, r, s) : e;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, e, r) {
    let s = this.raw(t);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const n = s == null ? "" : String(s).trim();
    return e.includes(n) ? n : r;
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
      const o = j(s, this.locale);
      return o.trim() ? o : r;
    }
    const n = String(s);
    return n.trim() ? n : r;
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
      const { primary: r, onPrimary: s } = W();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, n] = [0, 2, 4].map((a) => parseInt(e.slice(a, a + 2), 16) / 255), o = (a) => a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(r) + 0.7152 * o(s) + 0.0722 * o(n) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
_([
  D({ type: Object })
], g.prototype, "config");
_([
  x()
], g.prototype, "locale");
_([
  D({ type: String, reflect: !0, attribute: "data-phase" })
], g.prototype, "phase");
_([
  x()
], g.prototype, "errorMessage");
const q = N`
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
`, C = (i, t = !1, e = "") => w`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, K = () => C(w`<path d="M6 9l6 6 6-6"/>`), z = () => C(w`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`);
function H() {
  return l`<link rel="stylesheet" href=${Y("fonts/sallaicons.css")} />`;
}
function Q(i, t) {
  const e = (i || "").trim();
  return e.startsWith("sicon-") ? l`<i class="sicon ${e}" aria-hidden="true"></i>` : t ? t() : l``;
}
const tt = () => C(w`<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/><path d="M7.5 5.5l9 5"/>`), et = {
  title: { ar: "احسب موعد وصول طلبك", en: "Estimate your delivery date" },
  subtitle: { ar: "اختر مدينتك لمعرفة موعد التوصيل المتوقّع", en: "Pick your city to see the expected delivery window" },
  city_label: { ar: "المدينة", en: "City" },
  result_label: { ar: "التوصيل المتوقّع", en: "Expected delivery" },
  range: { ar: "من {from} إلى {to}", en: "{from} – {to}" },
  countdown: { ar: "اطلب خلال {time} ليُشحن طلبك اليوم", en: "Order within {time} to ship today" },
  after_cutoff: { ar: "الطلبات بعد {cutoff} تُشحن في يوم العمل التالي", en: "Orders after {cutoff} ship on the next business day" },
  hours_minutes: { ar: "{h} س {m} د", en: "{h}h {m}m" },
  minutes_only: { ar: "{m} دقيقة", en: "{m} min" },
  business_days: { ar: "{min}–{max} أيام عمل", en: "{min}–{max} business days" },
  empty: { ar: "أضف مدينة واحدة على الأقل من إعدادات العنصر.", en: "Add at least one city from the component settings." },
  default_city_1: { ar: "الرياض", en: "Riyadh" },
  default_city_2: { ar: "جدة", en: "Jeddah" },
  default_city_3: { ar: "الدمام والمنطقة الشرقية", en: "Dammam & Eastern Province" },
  default_city_4: { ar: "مكة المكرمة والمدينة", en: "Makkah & Madinah" },
  default_city_5: { ar: "باقي المدن", en: "Other cities" }
}, rt = N`
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.125rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--inline {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
    padding: 0.75rem 1rem;
  }
  .root--inline .sh-header {
    display: none;
  }
  .root--inline .field {
    flex: 1 1 12rem;
  }
  .root--inline .result {
    flex: 2 1 16rem;
    padding: 0.5rem 0.75rem;
  }
  .sh-header {
    margin: 0;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--sh-muted);
  }
  .select-wrap {
    position: relative;
  }
  .select-wrap svg {
    position: absolute;
    inset-inline-end: 0.75rem;
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--sh-muted);
  }
  select {
    width: 100%;
    min-height: 2.875rem;
    padding: 0.5rem 2.5rem 0.5rem 0.875rem;
    padding-inline: 0.875rem 2.5rem;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    color: var(--sh-text);
    font: inherit;
    appearance: none;
    cursor: pointer;
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  select:focus-visible {
    border-color: var(--sh-primary);
    box-shadow: var(--sh-focus);
    outline: none;
  }
  .result {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    border: 1px dashed color-mix(in srgb, var(--sh-primary) 30%, transparent);
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--sh-surface);
    color: var(--sh-primary);
    border: 1px solid var(--sh-border);
  }
  .icon svg,
  .icon .sicon {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 1.25rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  .result-label {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .dates {
    margin: 0;
    font-weight: 700;
    font-size: 1.02rem;
    color: var(--sh-primary);
    line-height: 1.5;
  }
  .days {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .cutoff {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 0.85rem;
    color: var(--sh-text);
  }
  .cutoff svg {
    color: var(--sh-warning);
    flex: none;
  }
  .cutoff strong {
    font-variant-numeric: tabular-nums;
    color: var(--sh-warning);
  }
  .cutoff--after {
    color: var(--sh-muted);
  }
  .cutoff--after svg {
    color: var(--sh-muted);
  }
`;
var st = Object.defineProperty, T = (i, t, e, r) => {
  for (var s = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (s = o(t, e, s) || s);
  return s && st(t, e, s), s;
};
const it = ["card", "inline"], nt = ["long", "short"], ot = ["gregory", "islamic-umalqura"], at = 864e5, ct = [0, 1, 2, 3, 4], L = "delivery.city";
function lt(i) {
  const t = /* @__PURE__ */ new Date();
  try {
    const e = new Intl.DateTimeFormat("en-US", {
      timeZone: i,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: !1
    }).formatToParts(t), r = (n) => Number(e.find((o) => o.type === n)?.value ?? 0), s = Date.UTC(r("year"), r("month") - 1, r("day"));
    return { civil: { utc: s, weekday: new Date(s).getUTCDay() }, minutes: r("hour") % 24 * 60 + r("minute") };
  } catch {
    const e = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
    return { civil: { utc: e, weekday: new Date(e).getUTCDay() }, minutes: t.getHours() * 60 + t.getMinutes() };
  }
}
function P(i, t) {
  const e = i.utc + t * at;
  return { utc: e, weekday: new Date(e).getUTCDay() };
}
function b(i, t, e) {
  let r = i, s = t;
  for (; ; ) {
    if (e.has(r.weekday)) {
      if (s <= 0) return r;
      s -= 1;
    }
    r = P(r, 1);
  }
}
const M = class M extends g {
  constructor() {
    super(...arguments), this.ns = "delivery-estimator", this.messages = et, this.selected = 0, this.tick = 0, this.restored = !1;
  }
  get cities() {
    const t = this.list("cities");
    return (t.length > 0 ? t.map((r) => {
      const s = m(Math.round(Number(r.min_days ?? 1)) || 1, 0, 60), n = m(Math.round(Number(r.max_days ?? s)) || s, s, 90);
      return { name: this.rowText(r, "name"), min: s, max: n };
    }) : [
      { name: this.t("default_city_1"), min: 1, max: 2 },
      { name: this.t("default_city_2"), min: 2, max: 3 },
      { name: this.t("default_city_3"), min: 2, max: 3 },
      { name: this.t("default_city_4"), min: 2, max: 4 },
      { name: this.t("default_city_5"), min: 3, max: 5 }
    ]).filter((r) => r.name);
  }
  get workingDays() {
    const t = this.raw("working_days"), r = (Array.isArray(t) ? t : []).map((s) => Number(typeof s == "object" && s ? s.value : s)).filter((s) => Number.isInteger(s) && s >= 0 && s <= 6);
    return new Set(r.length ? r : ct);
  }
  get cutoffMinutes() {
    const t = /^(\d{1,2}):(\d{2})/.exec(this.str("cutoff_time", "14:00"));
    return t ? m(Number(t[1]) * 60 + Number(t[2]), 0, 1439) : 14 * 60;
  }
  onSallaReady() {
    this.phase = "ready", this.every(3e4, () => {
      this.tick++;
    });
  }
  willUpdate() {
    if (!this.restored && this.phase === "ready") {
      this.restored = !0;
      const t = this.cities, e = this.city ?? (this.bool("remember_city", !0) ? B(L, "") : ""), r = t.findIndex((s) => s.name === e);
      r >= 0 && (this.selected = r);
    }
  }
  estimate(t) {
    const e = this.str("timezone", "Asia/Riyadh"), { civil: r, minutes: s } = lt(e), n = this.cutoffMinutes, o = this.workingDays, h = s < n && o.has(r.weekday), a = m(Math.round(this.num("processing_days", 1, 0, 30)), 0, 30);
    let c = h ? r : b(P(r, 1), 0, o);
    c = b(c, a, o);
    const $ = b(c, t.min, o), k = b(c, t.max, o);
    return { city: t, from: $, to: k, beforeCutoff: h, msToCutoff: Math.max(0, (n - s) * 6e4) };
  }
  formatDate(t, e, r) {
    const s = `${this.locale === "ar" ? "ar-SA" : "en-GB"}-u-ca-${r}${this.locale === "ar" ? "-nu-arab" : ""}`;
    try {
      return new Intl.DateTimeFormat(s, {
        timeZone: "UTC",
        weekday: e === "long" ? "long" : "short",
        day: "numeric",
        month: e === "long" ? "long" : "short"
      }).format(new Date(t.utc));
    } catch {
      const n = new Date(t.utc);
      return `${n.getUTCDate()}/${n.getUTCMonth() + 1}`;
    }
  }
  formatCutoff() {
    const t = this.cutoffMinutes, e = new Date(Date.UTC(2e3, 0, 1, Math.floor(t / 60), t % 60));
    try {
      return new Intl.DateTimeFormat(this.locale === "ar" ? "ar-SA" : "en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" }).format(e);
    } catch {
      return this.str("cutoff_time", "14:00");
    }
  }
  formatRemaining(t) {
    const e = Math.ceil(t / 6e4), r = Math.floor(e / 60), s = e % 60;
    return r > 0 ? this.t("hours_minutes", { h: p(r), m: p(s) }) : this.t("minutes_only", { m: p(s) });
  }
  onSelect(t) {
    const e = Number(t.target.value) || 0;
    this.selected = e;
    const r = this.cities[e];
    r && this.bool("remember_city", !0) && G(L, r.name), this.emit("city-change", { city: r?.name });
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const t = this.cities;
    if (t.length === 0) return l`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const e = this.choice("style", it, "card"), r = this.choice("date_style", nt, "long"), s = this.choice("calendar", ot, "gregory"), n = this.bool("show_city_select", !0) && t.length > 1, o = this.bool("show_icon", !0), h = this.str("icon", ""), a = m(this.selected, 0, t.length - 1), c = this.estimate(t[a]), $ = this.formatDate(c.from, r, s), k = this.formatDate(c.to, r, s), A = this.str("subtitle");
    return this.tick, this.phase === "ready" && this.emit("delivery-estimated", { city: c.city.name, from: new Date(c.from.utc).toISOString(), to: new Date(c.to.utc).toISOString(), beforeCutoff: c.beforeCutoff }), l`
      ${h.startsWith("sicon-") ? H() : f}
      <section class=${U({ root: !0, [`root--${e}`]: !0 })} part="root">
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
          ${A ? l`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${A}</p></slot>` : f}
        </div>

        ${n ? l`<div class="field">
              <label class="label" for="city">${this.t("city_label")}</label>
              <div class="select-wrap">
                <select id="city" part="select" .value=${String(a)} @change=${this.onSelect}>
                  ${t.map((O, I) => l`<option value=${I} ?selected=${I === a}>${O.name}</option>`)}
                </select>
                ${K()}
              </div>
            </div>` : f}

        <div class="result" part="result" aria-live="polite">
          ${o ? l`<span class="icon" aria-hidden="true">${Q(h, tt)}</span>` : f}
          <div class="body">
            <p class="result-label">${this.text("result_label", "result_label")}${n ? f : l` · ${c.city.name}`}</p>
            <p class="dates" part="dates">${this.t("range", { from: $, to: k })}</p>
            <p class="days">${this.t("business_days", { min: p(c.city.min), max: p(c.city.max) })}</p>
          </div>
        </div>

        ${c.beforeCutoff ? l`<p class="cutoff" part="cutoff">
              ${z()}
              <span>${this.renderCountdown(this.text("countdown_text", "countdown", { time: "\0" }), this.formatRemaining(c.msToCutoff))}</span>
            </p>` : l`<p class="cutoff cutoff--after" part="cutoff">${z()}<span>${this.text("after_cutoff_text", "after_cutoff", { cutoff: this.formatCutoff() })}</span></p>`}
      </section>
    `;
  }
  /** Splits the merchant sentence around the `{time}` placeholder so the remaining time can be emphasised. */
  renderCountdown(t, e) {
    const [r, s] = t.split("\0");
    return s === void 0 ? l`${t} ${e}` : l`${r}<strong>${e}</strong>${s}`;
  }
};
M.styles = [q, rt];
let u = M;
T([
  D({ type: String })
], u.prototype, "city");
T([
  x()
], u.prototype, "selected");
T([
  x()
], u.prototype, "tick");
typeof u < "u" && u.registerSallaComponent("salla-delivery-estimator");
export {
  u as default
};
