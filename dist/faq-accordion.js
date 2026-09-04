import { LitElement as j, css as E, svg as d, html as l, nothing as p } from "lit";
import { property as f, state as w } from "lit/decorators.js";
import { classMap as L } from "lit/directives/class-map.js";
function u() {
  return window.salla ?? window.Salla;
}
let v = null;
function _(i, e) {
  return new Promise((r) => {
    const t = window.setTimeout(() => r(void 0), e);
    i.then(
      (s) => {
        clearTimeout(t), r(s);
      },
      () => {
        clearTimeout(t), r(void 0);
      }
    );
  });
}
function O(i = 8e3) {
  return v || (v = new Promise((e) => {
    const r = Date.now(), t = () => {
      const s = u();
      if (s && typeof s.onReady == "function") {
        _(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? _(s.lang.onLoaded(), 4e3) : void 0).then(() => e(s));
        return;
      }
      if (Date.now() - r > i) {
        e(void 0);
        return;
      }
      window.setTimeout(t, 50);
    };
    t();
  }), v);
}
function $() {
  const i = document.documentElement.getAttribute("lang");
  let e = i && i.trim();
  if (!e) {
    const r = u();
    try {
      e = r?.lang?.getLocale?.() || r?.config?.get("user.language_code");
    } catch {
      e = void 0;
    }
  }
  return (e || "ar").toLowerCase().split(/[-_]/)[0];
}
function P() {
  const i = u();
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
function q(i, e) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const r = i, t = [r[e], r.ar, r.en, ...Object.values(r)];
  for (const s of t) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function I(i, e) {
  return e ? i.replace(
    /\{(\w+)\}/g,
    (r, t) => t in e ? String(e[t]) : r
  ) : i;
}
function z(i, e) {
  const r = u();
  if (!r?.lang?.addBulk) return;
  const t = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (t.has(i)) return;
  const s = {};
  for (const [a, o] of Object.entries(e)) s[`shohrah.${i}.${a}`] = { ar: o.ar, en: o.en };
  try {
    r.lang.addBulk(s), t.add(i);
  } catch {
  }
}
function D(i, e, r, t, s) {
  const a = `shohrah.${i}.${e}`, o = u();
  let h;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const n = o.lang.get(a);
      typeof n == "string" && n && n !== a && (h = n);
    } catch {
      h = void 0;
    }
  if (!h) {
    const n = r[e];
    h = n ? (t === "ar" ? n.ar : n.en) || n.en || n.ar : e;
  }
  return I(h, s);
}
function N(i) {
  if (i == null || i === "") return "";
  const e = u();
  try {
    if (e?.helpers?.number) return String(e.helpers.number(i));
  } catch {
  }
  return String(i);
}
function R(i, e, r) {
  return Math.min(r, Math.max(e, i));
}
var F = Object.defineProperty, x = (i, e, r, t) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(e, r, s) || s);
  return s && F(e, r, s), s;
};
class g extends j {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = $();
    const e = new MutationObserver(() => {
      const r = $();
      r !== this.locale && (this.locale = r, this.onLocaleChange());
    });
    e.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => e.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const e = this.disposers.splice(0);
    for (const r of e)
      try {
        r();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await O(), !!this.isConnected) {
      this.locale = $(), z(this.ns, this.messages), this.applyThemeFallbacks();
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
    const r = e instanceof Error ? e.message : String(e ?? "error");
    this.errorMessage = r, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, e);
    } catch {
    }
    this.emit("error", { message: r });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(e) {
    this.disposers.push(e);
  }
  listen(e, r, t, s) {
    e.addEventListener(r, t, s), this.addDisposer(() => e.removeEventListener(r, t, s));
  }
  delay(e, r) {
    const t = window.setTimeout(r, e);
    return this.addDisposer(() => window.clearTimeout(t)), t;
  }
  every(e, r) {
    const t = window.setInterval(r, e), s = () => window.clearInterval(t);
    return this.addDisposer(s), s;
  }
  own(e) {
    return this.addDisposer(() => e.disconnect()), e;
  }
  emit(e, r = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${e}`, { detail: r, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(e, r) {
    return D(this.ns, e, this.messages, this.locale, r);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(e, r, t) {
    const s = this.str(e);
    return s ? t ? this.interp(s, t) : s : this.t(r, t);
  }
  interp(e, r) {
    return e.replace(/\{(\w+)\}/g, (t, s) => s in r ? String(r[s]) : t);
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
  str(e, r = "") {
    const t = this.raw(e);
    if (t == null) return r;
    if (typeof t == "object") {
      const a = q(t, this.locale);
      return a.trim() ? a : r;
    }
    const s = String(t);
    return s.trim() ? s : r;
  }
  bool(e, r) {
    const t = this.raw(e);
    if (t == null || t === "") return r;
    if (typeof t == "boolean") return t;
    if (typeof t == "number") return t !== 0;
    const s = String(t).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(s) ? !0 : ["false", "0", "no", "off"].includes(s) ? !1 : r;
  }
  num(e, r, t = -1 / 0, s = 1 / 0) {
    const a = this.raw(e), o = typeof a == "number" ? a : Number(String(a ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && a != null && a !== "" ? R(o, t, s) : r;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(e, r, t) {
    let s = this.raw(e);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const a = s == null ? "" : String(s).trim();
    return r.includes(a) ? a : t;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(e) {
    let r = this.raw(e);
    Array.isArray(r) && (r = r[0]), r && typeof r == "object" && (r = r.value);
    const t = Number(r);
    return Number.isFinite(t) && t > 0 ? t : void 0;
  }
  /** Rows of a `collection` field. */
  list(e) {
    const r = this.raw(e);
    return Array.isArray(r) ? r.filter((t) => t && typeof t == "object") : r && typeof r == "object" ? Object.values(r).filter((t) => t && typeof t == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(e, r, t = "") {
    const s = e[r];
    if (s == null) return t;
    if (typeof s == "object") {
      const o = q(s, this.locale);
      return o.trim() ? o : t;
    }
    const a = String(s);
    return a.trim() ? a : t;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(e) {
    return this.linkValue(this.raw(e));
  }
  linkValue(e) {
    if (Array.isArray(e) && (e = e[0]), e && typeof e == "object" && (e = e.url ?? e.value), e == null) return "";
    const r = String(e).trim();
    return !r || r === "#" ? "" : /^(https?:)?\/\//i.test(r) || r.startsWith("/") || r.startsWith("#") || r.startsWith("mailto:") || r.startsWith("tel:") ? r : /^[\w./-]+$/.test(r) ? `/${r}` : "";
  }
  color(e, r) {
    const t = this.str(e, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(t) ? t : r;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: t, onPrimary: s } = P();
      t && this.style.setProperty("--shohrah-primary", t), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(e) {
    const r = e.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(r)) return "#ffffff";
    const [t, s, a] = [0, 2, 4].map((n) => parseInt(r.slice(n, n + 2), 16) / 255), o = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(t) + 0.7152 * o(s) + 0.0722 * o(a) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
x([
  f({ type: Object })
], g.prototype, "config");
x([
  w()
], g.prototype, "locale");
x([
  f({ type: String, reflect: !0, attribute: "data-phase" })
], g.prototype, "phase");
x([
  w()
], g.prototype, "errorMessage");
const W = E`
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
`, y = (i, e = !1, r = "") => d`<svg class="sh-svg ${e ? "sh-svg--fill" : ""} ${r}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, Y = () => y(d`<path d="M6 9l6 6 6-6"/>`), C = () => y(d`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), H = () => y(d`<path d="M12 5v14M5 12h14"/>`), V = () => y(d`<path d="M6 6l12 12M18 6L6 18"/>`), B = () => y(d`<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>`), U = {
  title: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
  subtitle: { ar: "كل ما تحتاج معرفته قبل الشراء", en: "Everything you need to know before you buy" },
  search_placeholder: { ar: "ابحث في الأسئلة…", en: "Search questions…" },
  search_label: { ar: "البحث في الأسئلة الشائعة", en: "Search the FAQ" },
  clear_search: { ar: "مسح البحث", en: "Clear search" },
  no_results: { ar: "لا توجد نتائج مطابقة لبحثك.", en: "No questions match your search." },
  results_count: { ar: "{count} نتيجة", en: "{count} results" },
  empty: { ar: "أضف سؤالًا واحدًا على الأقل من إعدادات العنصر.", en: "Add at least one question from the component settings." },
  contact_text: { ar: "لم تجد إجابتك؟ تواصل معنا", en: "Still have questions? Contact us" },
  region_label: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
  default_q1: { ar: "كم يستغرق الشحن؟", en: "How long does shipping take?" },
  default_a1: {
    ar: "نشحن الطلبات خلال يوم عمل واحد، ويصل الطلب عادةً خلال ٢ إلى ٥ أيام عمل حسب مدينتك.",
    en: "Orders ship within one business day and usually arrive in 2 to 5 business days depending on your city."
  },
  default_q2: { ar: "هل يمكنني إرجاع المنتج؟", en: "Can I return a product?" },
  default_a2: {
    ar: "نعم، يمكنك الإرجاع أو الاستبدال خلال ١٤ يومًا من الاستلام بشرط أن يكون المنتج بحالته الأصلية.",
    en: "Yes. You can return or exchange within 14 days of delivery as long as the item is in its original condition."
  },
  default_q3: { ar: "ما طرق الدفع المتاحة؟", en: "Which payment methods do you accept?" },
  default_a3: {
    ar: "نقبل مدى، Apple Pay، فيزا وماستركارد، بالإضافة إلى خدمات التقسيط مثل تابي وتمارا.",
    en: "We accept mada, Apple Pay, Visa and Mastercard, plus instalment services such as Tabby and Tamara."
  },
  default_q4: { ar: "كيف أتابع طلبي؟", en: "How do I track my order?" },
  default_a4: {
    ar: "ستصلك رسالة برقم التتبع فور الشحن، ويمكنك أيضًا متابعة الحالة من صفحة طلباتي في حسابك.",
    en: "You will receive a tracking number as soon as the order ships. You can also follow it from My Orders in your account."
  },
  default_q5: { ar: "كيف أتواصل مع خدمة العملاء؟", en: "How can I reach customer service?" },
  default_a5: {
    ar: "فريقنا متاح يوميًا من ٩ صباحًا حتى ١٠ مساءً عبر الواتساب أو البريد الإلكتروني الموجود في صفحة تواصل معنا.",
    en: "Our team is available daily from 9 am to 10 pm on WhatsApp or by email through the Contact us page."
  }
}, Q = E`
  .root {
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
  }
  .search {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 32rem;
  }
  .search svg {
    position: absolute;
    inset-inline-start: 0.875rem;
    color: var(--sh-muted);
    pointer-events: none;
  }
  .search input {
    width: 100%;
    min-height: 2.875rem;
    padding: 0.5rem 2.75rem;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    color: var(--sh-text);
    font: inherit;
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  .search input:focus-visible {
    border-color: var(--sh-primary);
    box-shadow: var(--sh-focus);
    outline: none;
  }
  .search .clear {
    position: absolute;
    inset-inline-end: 0.375rem;
    width: 2.125rem;
    height: 2.125rem;
    border: 0;
    background: transparent;
  }
  .count {
    color: var(--sh-muted);
    font-size: 0.85rem;
    margin: -0.5rem 0 0;
  }
  .list {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .list--cards {
    gap: 0.75rem;
  }
  @media (min-width: 768px) {
    .list--two_columns {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: calc(var(--sh-space) * 2);
    }
  }
  .item {
    position: relative;
  }
  .list--dividers .item {
    border-block-end: 1px solid var(--sh-border);
  }
  .list--cards .item {
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  .list--cards .item[data-open='true'] {
    border-color: color-mix(in srgb, var(--sh-primary) 45%, var(--sh-border));
    box-shadow: var(--sh-shadow);
  }
  .trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0.25rem;
    border: 0;
    background: transparent;
    text-align: start;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.02rem;
    line-height: 1.6;
    border-radius: var(--sh-radius-sm);
    transition: color var(--sh-ease);
  }
  .list--cards .trigger {
    padding: 1rem 1.125rem;
  }
  .trigger:hover {
    color: var(--sh-primary);
  }
  .trigger[aria-expanded='true'] {
    color: var(--sh-primary);
  }
  .indicator {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    color: var(--sh-muted);
    transition: transform var(--sh-ease), color var(--sh-ease), background-color var(--sh-ease);
  }
  .indicator svg {
    width: 1.1rem;
    height: 1.1rem;
  }
  .trigger[aria-expanded='true'] .indicator {
    color: var(--sh-primary);
    background: color-mix(in srgb, var(--sh-primary) 10%, transparent);
  }
  .trigger[aria-expanded='true'] .indicator--plus {
    transform: rotate(45deg);
  }
  .trigger[aria-expanded='true'] .indicator--chevron {
    transform: rotate(180deg);
  }
  .indicator--arrow {
    transform: rotate(90deg);
  }
  .trigger[aria-expanded='true'] .indicator--arrow {
    transform: rotate(-90deg);
  }
  .panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .panel[data-open='true'] {
    grid-template-rows: 1fr;
  }
  .panel > div {
    overflow: hidden;
    min-height: 0;
  }
  .answer {
    margin: 0;
    padding: 0 0.25rem 1.125rem;
    color: var(--sh-muted);
    white-space: pre-line;
    font-size: 0.97rem;
  }
  .list--cards .answer {
    padding: 0 1.125rem 1.125rem;
  }
  .contact {
    display: flex;
    justify-content: center;
    padding-block-start: 0.5rem;
  }
  mark {
    background: color-mix(in srgb, var(--sh-primary) 18%, transparent);
    color: inherit;
    border-radius: 2px;
    padding: 0 0.1em;
  }
`;
var X = Object.defineProperty, b = (i, e, r, t) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(e, r, s) || s);
  return s && X(e, r, s), s;
};
const K = ["plus", "chevron", "arrow"], J = ["list", "two_columns", "cards"];
function m(i) {
  return i.toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").trim();
}
const k = class k extends g {
  constructor() {
    super(...arguments), this.ns = "faq-accordion", this.messages = U, this.open = /* @__PURE__ */ new Set(), this.query = "", this.initialised = !1, this.uid = Math.random().toString(36).slice(2, 8);
  }
  get items() {
    const e = this.list("items");
    return (e.length > 0 ? e.map((t, s) => ({
      id: `${this.uid}-${s}`,
      question: this.rowText(t, "question"),
      answer: this.rowText(t, "answer")
    })) : [1, 2, 3, 4, 5].map((t) => ({
      id: `${this.uid}-${t}`,
      question: this.t(`default_q${t}`),
      answer: this.t(`default_a${t}`)
    }))).filter((t) => t.question);
  }
  onSallaReady() {
    if (this.phase = "ready", !this.initialised && (this.initialised = !0, this.bool("first_open", !0))) {
      const e = this.items[0];
      e && (this.open = /* @__PURE__ */ new Set([e.id]));
    }
    this.syncSchema();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.schemaEl?.remove(), this.schemaEl = void 0;
  }
  /** FAQPage JSON-LD, generated only from merchant text with JSON.stringify (inert). Off by default. */
  syncSchema() {
    if (!this.bool("schema_markup", !1)) {
      this.schemaEl?.remove(), this.schemaEl = void 0;
      return;
    }
    const e = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: this.items.map((r) => ({
        "@type": "Question",
        name: r.question,
        acceptedAnswer: { "@type": "Answer", text: r.answer }
      }))
    };
    this.schemaEl || (this.schemaEl = document.createElement("script"), this.schemaEl.type = "application/ld+json", this.schemaEl.dataset.shohrah = `faq-${this.uid}`, document.head.appendChild(this.schemaEl)), this.schemaEl.textContent = JSON.stringify(e);
  }
  toggle(e, r) {
    const t = new Set(this.allowMultiple ?? this.bool("allow_multiple", !1) ? this.open : []), s = !this.open.has(e.id);
    s ? t.add(e.id) : t.delete(e.id), this.open = t, this.emit("faq-toggle", { index: r, open: s, question: e.question });
  }
  onTriggerKeydown(e) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const t = Array.from(this.renderRoot.querySelectorAll(".trigger")), s = t.indexOf(e.currentTarget);
    if (s === -1) return;
    e.preventDefault(), (e.key === "Home" ? t[0] : e.key === "End" ? t[t.length - 1] : t[(s + (e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length])?.focus();
  }
  onSearch(e) {
    this.query = e.target.value, this.emit("faq-search", { query: this.query, results: this.filtered().length });
  }
  filtered() {
    const e = m(this.query);
    return e ? this.items.filter((r) => m(r.question).includes(e) || m(r.answer).includes(e)) : this.items;
  }
  highlight(e) {
    const r = this.query.trim();
    if (!r) return e;
    const t = m(e).indexOf(m(r));
    return t === -1 ? e : l`${e.slice(0, t)}<mark>${e.slice(t, t + r.length)}</mark>${e.slice(t + r.length)}`;
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.items.length === 0) return l`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const r = this.layout ?? this.choice("layout", J, "list"), t = this.iconStyle ?? this.choice("icon_style", K, "plus"), s = this.bool("dividers", !0) && r !== "cards", a = this.bool("show_search", !1), o = this.bool("show_contact", !1), h = this.link("contact_link"), n = this.filtered(), A = this.text("title", "title"), S = this.str("subtitle");
    return l`
      <section class="root" part="root" aria-label=${this.t("region_label")}>
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${A}</h3></slot>
          ${S ? l`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${S}</p></slot>` : p}
        </div>

        ${a ? l`<div class="search" part="search">
              ${B()}
              <input
                type="search"
                .value=${this.query}
                @input=${this.onSearch}
                placeholder=${this.text("search_placeholder", "search_placeholder")}
                aria-label=${this.t("search_label")}
                autocomplete="off"
              />
              ${this.query ? l`<button class="sh-icon-btn clear" type="button" aria-label=${this.t("clear_search")} @click=${() => {
      this.query = "";
    }}>${V()}</button>` : p}
            </div>
            ${this.query ? l`<p class="count" role="status">${this.t("results_count", { count: N(n.length) })}</p>` : p}` : p}

        ${n.length === 0 ? l`<div class="sh-empty" role="status">${this.t("no_results")}</div>` : l`<ul class=${L({ list: !0, [`list--${r}`]: !0, "list--dividers": s })} role="list">
              ${n.map((T, M) => this.renderItem(T, M, t))}
            </ul>`}

        ${o && h ? l`<div class="contact" part="contact">
              <slot name="contact">
                <a class="sh-btn sh-btn--ghost" href=${h}>${this.text("contact_text", "contact_text")} ${C()}</a>
              </slot>
            </div>` : p}
      </section>
    `;
  }
  renderItem(e, r, t) {
    const s = this.open.has(e.id), a = `panel-${e.id}`, o = `trigger-${e.id}`, h = t === "plus" ? H() : t === "chevron" ? Y() : C();
    return l`<li class="item" part="item" data-open=${String(s)}>
      <h4 style="margin:0;font:inherit">
        <button
          id=${o}
          class="trigger"
          part="trigger"
          type="button"
          aria-expanded=${String(s)}
          aria-controls=${a}
          @click=${() => this.toggle(e, r)}
          @keydown=${this.onTriggerKeydown}
        >
          <span>${this.highlight(e.question)}</span>
          <span class="indicator indicator--${t}" aria-hidden="true">${h}</span>
        </button>
      </h4>
      <div id=${a} class="panel" part="panel" role="region" aria-labelledby=${o} data-open=${String(s)}>
        <div>
          <p class="answer" part="answer" ?inert=${!s} aria-hidden=${String(!s)}>${this.highlight(e.answer)}</p>
        </div>
      </div>
    </li>`;
  }
};
k.styles = [W, Q];
let c = k;
b([
  f({ type: Boolean, attribute: "allow-multiple" })
], c.prototype, "allowMultiple");
b([
  f({ type: String })
], c.prototype, "layout");
b([
  f({ type: String, attribute: "icon-style" })
], c.prototype, "iconStyle");
b([
  w()
], c.prototype, "open");
b([
  w()
], c.prototype, "query");
typeof c < "u" && c.registerSallaComponent("salla-faq-accordion");
export {
  c as default
};
