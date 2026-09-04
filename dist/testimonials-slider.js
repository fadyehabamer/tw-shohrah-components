import { LitElement as z, css as C, svg as p, html as l, nothing as u } from "lit";
import { property as _, state as v, query as L } from "lit/decorators.js";
import { classMap as R } from "lit/directives/class-map.js";
function m() {
  return window.salla ?? window.Salla;
}
let w = null;
function T(a, t) {
  return new Promise((e) => {
    const r = window.setTimeout(() => e(void 0), t);
    a.then(
      (s) => {
        clearTimeout(r), e(s);
      },
      () => {
        clearTimeout(r), e(void 0);
      }
    );
  });
}
function D(a = 8e3) {
  return w || (w = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = m();
      if (s && typeof s.onReady == "function") {
        T(Promise.resolve(s.onReady()), a).then(() => s.lang?.onLoaded ? T(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
        return;
      }
      if (Date.now() - e > a) {
        t(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), w);
}
function S() {
  const a = document.documentElement.getAttribute("lang");
  let t = a && a.trim();
  if (!t) {
    const e = m();
    try {
      t = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function P() {
  const a = m();
  if (!a) return {};
  try {
    return {
      primary: a.config.get("theme.color.primary") || void 0,
      onPrimary: a.config.get("theme.color.reverse_text") || void 0,
      isDark: !!a.config.get("theme.color.is_dark")
    };
  } catch {
    return {};
  }
}
function E(a, t) {
  if (a == null) return "";
  if (typeof a == "string") return a;
  if (typeof a == "number") return String(a);
  if (Array.isArray(a)) return "";
  const e = a, r = [e[t], e.ar, e.en, ...Object.values(e)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function I(a, t) {
  return t ? a.replace(
    /\{(\w+)\}/g,
    (e, r) => r in t ? String(t[r]) : e
  ) : a;
}
function O(a, t) {
  const e = m();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(a)) return;
  const s = {};
  for (const [i, o] of Object.entries(t)) s[`shohrah.${a}.${i}`] = { ar: o.ar, en: o.en };
  try {
    e.lang.addBulk(s), r.add(a);
  } catch {
  }
}
function V(a, t, e, r, s) {
  const i = `shohrah.${a}.${t}`, o = m();
  let c;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const n = o.lang.get(i);
      typeof n == "string" && n && n !== i && (c = n);
    } catch {
      c = void 0;
    }
  if (!c) {
    const n = e[t];
    c = n ? (r === "ar" ? n.ar : n.en) || n.en || n.ar : t;
  }
  return I(c, s);
}
function x(a) {
  if (a == null || a === "") return "";
  const t = m();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(a));
  } catch {
  }
  return String(a);
}
function k(a, t, e) {
  return Math.min(e, Math.max(t, a));
}
var W = Object.defineProperty, $ = (a, t, e, r) => {
  for (var s = void 0, i = a.length - 1, o; i >= 0; i--)
    (o = a[i]) && (s = o(t, e, s) || s);
  return s && W(t, e, s), s;
};
class b extends z {
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
    if (this.salla = await D(), !!this.isConnected) {
      this.locale = S(), O(this.ns, this.messages), this.applyThemeFallbacks();
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
    return V(this.ns, t, this.messages, this.locale, e);
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
      const i = E(r, this.locale);
      return i.trim() ? i : e;
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
    const i = this.raw(t), o = typeof i == "number" ? i : Number(String(i ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && i != null && i !== "" ? k(o, r, s) : e;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, e, r) {
    let s = this.raw(t);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const i = s == null ? "" : String(s).trim();
    return e.includes(i) ? i : r;
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
      const o = E(s, this.locale);
      return o.trim() ? o : r;
    }
    const i = String(s);
    return i.trim() ? i : r;
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
      const { primary: r, onPrimary: s } = P();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, i] = [0, 2, 4].map((n) => parseInt(e.slice(n, n + 2), 16) / 255), o = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(r) + 0.7152 * o(s) + 0.0722 * o(i) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
$([
  _({ type: Object })
], b.prototype, "config");
$([
  v()
], b.prototype, "locale");
$([
  _({ type: String, reflect: !0, attribute: "data-phase" })
], b.prototype, "phase");
$([
  v()
], b.prototype, "errorMessage");
const N = C`
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
`, y = (a, t = !1, e = "") => p`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${a}</svg>`, F = () => y(p`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), H = () => y(p`<path d="M19 12H5M11 18l-6-6 6-6"/>`, !1, "sh-flip-rtl"), B = () => y(p`<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/>`, !0), G = () => y(p`<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/>`), Q = () => y(
  p`<path d="M7.5 6C5 6 3 8 3 10.5V18h7v-7H6.5c0-1.7 1.1-2.8 2.5-3V6zM18 6c-2.5 0-4.5 2-4.5 4.5V18h7v-7H17c0-1.7 1.1-2.8 2.5-3V6z"/>`,
  !0
), X = {
  title: { ar: "آراء عملائنا", en: "What our customers say" },
  subtitle: { ar: "تجارب حقيقية من متسوقين مثلك", en: "Real experiences from shoppers like you" },
  region_label: { ar: "آراء العملاء", en: "Customer testimonials" },
  prev: { ar: "الرأي السابق", en: "Previous testimonial" },
  next: { ar: "الرأي التالي", en: "Next testimonial" },
  go_to: { ar: "الانتقال إلى الرأي {n}", en: "Go to testimonial {n}" },
  slide_of: { ar: "{n} من {total}", en: "{n} of {total}" },
  rating_label: { ar: "تقييم {n} من ٥", en: "Rated {n} out of 5" },
  empty: { ar: "أضف رأيًا واحدًا على الأقل من إعدادات العنصر.", en: "Add at least one testimonial from the component settings." },
  default_1_name: { ar: "سارة العتيبي", en: "Sarah A." },
  default_1_meta: { ar: "الرياض", en: "Riyadh" },
  default_1_quote: {
    ar: "الجودة ممتازة والتغليف راقٍ جدًا. وصل الطلب قبل الموعد بيوم كامل وأصبح المتجر خياري الأول.",
    en: "Excellent quality and beautiful packaging. My order arrived a full day early. This store is now my first choice."
  },
  default_2_name: { ar: "محمد الشهري", en: "Mohammed S." },
  default_2_meta: { ar: "جدة", en: "Jeddah" },
  default_2_quote: {
    ar: "خدمة العملاء تجاوب بسرعة على الواتساب، وعملية الاستبدال كانت سهلة بدون أي تعقيد.",
    en: "Customer service replies fast on WhatsApp, and the exchange process was effortless."
  },
  default_3_name: { ar: "نورة القحطاني", en: "Noura Q." },
  default_3_meta: { ar: "الدمام", en: "Dammam" },
  default_3_quote: {
    ar: "طلبت هدية لأختي ووصلت بتغليف فاخر وكرت مكتوب بخط جميل. تجربة تستاهل الخمس نجوم.",
    en: "I ordered a gift for my sister and it came in luxurious wrapping with a handwritten card. A five-star experience."
  },
  default_4_name: { ar: "عبدالله الدوسري", en: "Abdullah D." },
  default_4_meta: { ar: "المدينة المنورة", en: "Madinah" },
  default_4_quote: {
    ar: "الأسعار مناسبة والمنتج مطابق للصور تمامًا. سأكرر الطلب بالتأكيد.",
    en: "Fair prices and the product matches the photos exactly. I will definitely order again."
  }
}, K = C`
  .root {
    --ts-per-view: 1;
    --ts-gap: 1rem;
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
  }
  @media (min-width: 768px) {
    .root {
      --ts-per-view: var(--ts-desktop, 3);
    }
  }
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }
  .head .sh-header {
    margin: 0;
  }
  .controls {
    display: flex;
    gap: 0.5rem;
    flex: none;
  }
  .track {
    display: flex;
    gap: var(--ts-gap);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 4px;
    margin: -4px;
    -webkit-overflow-scrolling: touch;
  }
  .track::-webkit-scrollbar {
    display: none;
  }
  .track:focus-visible {
    box-shadow: var(--sh-focus);
    border-radius: var(--sh-radius);
  }
  .slide {
    flex: 0 0 calc((100% - (var(--ts-per-view) - 1) * var(--ts-gap)) / var(--ts-per-view));
    scroll-snap-align: start;
    display: flex;
    min-width: 0;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    width: 100%;
    padding: 1.375rem 1.375rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    transition: transform var(--sh-ease), box-shadow var(--sh-ease);
  }
  .card--elevated {
    box-shadow: var(--sh-shadow);
    border: 1px solid transparent;
  }
  .card--outlined {
    border: 1px solid var(--sh-border);
  }
  .card--plain {
    background: transparent;
    padding-inline: 0.25rem;
  }
  .card--center {
    text-align: center;
    align-items: center;
  }
  .quote-icon {
    color: var(--sh-primary);
    opacity: 0.55;
  }
  .quote-icon svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  .stars {
    display: inline-flex;
    gap: 2px;
    color: #f59e0b;
  }
  .stars svg {
    width: 1rem;
    height: 1rem;
  }
  .stars .off {
    color: var(--sh-border);
  }
  .quote {
    margin: 0;
    flex: 1;
    font-size: 1rem;
    line-height: 1.85;
    color: var(--sh-text);
  }
  .person {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-block-start: auto;
  }
  .card--center .person {
    flex-direction: column;
    gap: 0.375rem;
  }
  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    flex: none;
    object-fit: cover;
    background: color-mix(in srgb, var(--sh-primary) 12%, var(--sh-surface));
    color: var(--sh-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.95rem;
  }
  .who {
    display: flex;
    flex-direction: column;
    line-height: 1.4;
    min-width: 0;
  }
  .name {
    font-weight: 700;
    font-size: 0.95rem;
  }
  .meta {
    color: var(--sh-muted);
    font-size: 0.85rem;
  }
  .dots {
    display: flex;
    justify-content: center;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--sh-border);
    cursor: pointer;
    transition: width var(--sh-ease), background-color var(--sh-ease);
  }
  .dot[aria-current='true'] {
    width: 1.5rem;
    border-radius: 999px;
    background: var(--sh-primary);
  }
  .dot:focus-visible {
    box-shadow: var(--sh-focus);
  }
`;
var U = Object.defineProperty, f = (a, t, e, r) => {
  for (var s = void 0, i = a.length - 1, o; i >= 0; i--)
    (o = a[i]) && (s = o(t, e, s) || s);
  return s && U(t, e, s), s;
};
const Y = ["elevated", "outlined", "plain"], J = ["start", "center"], A = class A extends b {
  constructor() {
    super(...arguments), this.ns = "testimonials-slider", this.messages = X, this.index = 0, this.pages = 1, this.hovering = !1, this.scrollRaf = 0;
  }
  get items() {
    const t = this.list("items");
    return (t.length > 0 ? t.map((r) => ({
      name: this.rowText(r, "name"),
      meta: this.rowText(r, "meta"),
      quote: this.rowText(r, "quote"),
      rating: k(Number(r.rating ?? 5) || 5, 1, 5),
      avatar: this.rowText(r, "avatar")
    })) : [1, 2, 3, 4].map((r) => ({
      name: this.t(`default_${r}_name`),
      meta: this.t(`default_${r}_meta`),
      quote: this.t(`default_${r}_quote`),
      rating: r === 4 ? 4 : 5,
      avatar: ""
    }))).filter((r) => r.quote);
  }
  onSallaReady() {
    this.phase = "ready", this.updateComplete.then(() => {
      this.trackEl && (this.listen(this.trackEl, "scroll", () => this.onScroll(), { passive: !0 }), this.resizeObs = this.own(new ResizeObserver(() => this.measure())), this.resizeObs.observe(this.trackEl), this.listen(document, "visibilitychange", () => this.setupAutoplay()), this.measure(), this.setupAutoplay());
    });
  }
  slideWidth() {
    const t = this.trackEl?.querySelector(".slide");
    if (!t || !this.trackEl) return 1;
    const e = parseFloat(getComputedStyle(this.trackEl).columnGap || getComputedStyle(this.trackEl).gap || "16") || 16;
    return t.getBoundingClientRect().width + e;
  }
  perView() {
    if (!this.trackEl) return 1;
    const t = this.trackEl.clientWidth, e = this.slideWidth();
    return Math.max(1, Math.round((t + 1) / e));
  }
  measure() {
    const t = this.items.length;
    this.pages = Math.max(1, t - this.perView() + 1), this.index = k(this.index, 0, this.pages - 1);
  }
  onScroll() {
    this.scrollRaf || (this.scrollRaf = requestAnimationFrame(() => {
      if (this.scrollRaf = 0, !this.trackEl) return;
      const t = k(Math.round(Math.abs(this.trackEl.scrollLeft) / this.slideWidth()), 0, this.pages - 1);
      t !== this.index && (this.index = t, this.emit("slide-change", { index: t }));
    }));
  }
  goTo(t) {
    if (!this.trackEl) return;
    const e = this.bool("loop", !0);
    let r = t;
    t >= this.pages && (r = e ? 0 : this.pages - 1), t < 0 && (r = e ? this.pages - 1 : 0);
    const s = r * this.slideWidth();
    this.trackEl.scrollTo({ left: this.rtl ? -s : s, behavior: this.reducedMotion ? "auto" : "smooth" });
  }
  setupAutoplay() {
    if (!((this.autoplay ?? this.bool("autoplay", !0)) && !this.reducedMotion && document.visibilityState === "visible" && !this.hovering && this.items.length > 1)) {
      this.stopAuto?.(), this.stopAuto = void 0;
      return;
    }
    if (this.stopAuto) return;
    const r = this.num("interval_seconds", 6, 3, 15);
    this.stopAuto = this.every(r * 1e3, () => this.goTo(this.index + 1));
  }
  setHover(t) {
    this.hovering = t, this.setupAutoplay();
  }
  onTrackKeydown(t) {
    if (t.key !== "ArrowLeft" && t.key !== "ArrowRight") return;
    t.preventDefault();
    const e = this.rtl ? t.key === "ArrowLeft" : t.key === "ArrowRight";
    this.goTo(this.index + (e ? 1 : -1));
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const t = this.items;
    if (t.length === 0) return l`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const e = this.cardStyle ?? this.choice("card_style", Y, "elevated"), r = this.choice("align", J, "start"), s = this.bool("show_arrows", !0) && t.length > 1, i = this.bool("show_dots", !0) && this.pages > 1, o = this.bool("show_rating", !0), c = this.bool("show_avatar", !0), n = this.bool("show_quote_icon", !0), q = this.num("slides_desktop", 3, 1, 4), j = this.num("slides_mobile", 1, 1, 2), M = this.str("subtitle");
    return l`
      <section
        class="root"
        part="root"
        style="--ts-desktop:${q};--ts-per-view:${j}"
        role="region"
        aria-roledescription="carousel"
        aria-label=${this.t("region_label")}
        @mouseenter=${() => this.setHover(!0)}
        @mouseleave=${() => this.setHover(!1)}
        @focusin=${() => this.setHover(!0)}
        @focusout=${() => this.setHover(!1)}
      >
        <div class="head">
          <div class="sh-header">
            <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
            ${M ? l`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${M}</p></slot>` : u}
          </div>
          ${s ? l`<div class="controls">
                <button class="sh-icon-btn" part="prev" type="button" aria-label=${this.t("prev")} @click=${() => this.goTo(this.index - 1)}>
                  ${H()}
                </button>
                <button class="sh-icon-btn" part="next" type="button" aria-label=${this.t("next")} @click=${() => this.goTo(this.index + 1)}>
                  ${F()}
                </button>
              </div>` : u}
        </div>

        <div class="track" part="track" tabindex="0" aria-live=${this.stopAuto ? "off" : "polite"} @keydown=${this.onTrackKeydown}>
          ${t.map(
      (d, g) => l`<div
              class="slide"
              part="slide"
              role="group"
              aria-roledescription="slide"
              aria-label=${this.t("slide_of", { n: x(g + 1), total: x(t.length) })}
            >
              <article class=${R({ card: !0, [`card--${e}`]: !0, "card--center": r === "center" })} part="card">
                ${n ? l`<span class="quote-icon" aria-hidden="true">${Q()}</span>` : u}
                ${o ? this.renderStars(d.rating) : u}
                <blockquote class="quote" part="quote"><p style="margin:0">${d.quote}</p></blockquote>
                <footer class="person">
                  ${c ? this.renderAvatar(d) : u}
                  <div class="who">
                    ${d.name ? l`<cite class="name" part="name" style="font-style:normal">${d.name}</cite>` : u}
                    ${d.meta ? l`<span class="meta">${d.meta}</span>` : u}
                  </div>
                </footer>
              </article>
            </div>`
    )}
        </div>

        ${i ? l`<ul class="dots" part="dots" role="list">
              ${Array.from({ length: this.pages }, (d, g) => l`<li>
                <button
                  class="dot"
                  type="button"
                  aria-label=${this.t("go_to", { n: x(g + 1) })}
                  aria-current=${String(g === this.index)}
                  @click=${() => this.goTo(g)}
                ></button>
              </li>`)}
            </ul>` : u}
      </section>
    `;
  }
  renderStars(t) {
    return l`<span class="stars" role="img" aria-label=${this.t("rating_label", { n: x(t) })}>
      ${[1, 2, 3, 4, 5].map((e) => e <= t ? B() : l`<span class="off">${G()}</span>`)}
    </span>`;
  }
  renderAvatar(t) {
    if (t.avatar) return l`<img class="avatar" src=${t.avatar} alt="" loading="lazy" width="44" height="44" />`;
    const e = t.name.split(/\s+/).filter(Boolean).slice(0, 2).map((r) => r[0]).join("");
    return l`<span class="avatar" aria-hidden="true">${e || "★"}</span>`;
  }
};
A.styles = [N, K];
let h = A;
f([
  _({ type: Boolean })
], h.prototype, "autoplay");
f([
  _({ type: String, attribute: "card-style" })
], h.prototype, "cardStyle");
f([
  v()
], h.prototype, "index");
f([
  v()
], h.prototype, "pages");
f([
  v()
], h.prototype, "hovering");
f([
  L(".track")
], h.prototype, "trackEl");
typeof h < "u" && h.registerSallaComponent("salla-testimonials-slider");
export {
  h as default
};
