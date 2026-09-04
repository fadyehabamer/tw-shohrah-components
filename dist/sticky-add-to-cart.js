import { LitElement as R, css as A, svg as b, html as d, nothing as f } from "lit";
import { property as m, state as g } from "lit/decorators.js";
import { classMap as q } from "lit/directives/class-map.js";
function c() {
  return window.salla ?? window.Salla;
}
let w = null;
function T(i, t) {
  return new Promise((r) => {
    const e = window.setTimeout(() => r(void 0), t);
    i.then(
      (s) => {
        clearTimeout(e), r(s);
      },
      () => {
        clearTimeout(e), r(void 0);
      }
    );
  });
}
function z(i = 8e3) {
  return w || (w = new Promise((t) => {
    const r = Date.now(), e = () => {
      const s = c();
      if (s && typeof s.onReady == "function") {
        T(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? T(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
        return;
      }
      if (Date.now() - r > i) {
        t(void 0);
        return;
      }
      window.setTimeout(e, 50);
    };
    e();
  }), w);
}
function x() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const r = c();
    try {
      t = r?.lang?.getLocale?.() || r?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function M() {
  const i = c();
  if (i)
    try {
      if (i.url?.is_page?.("product.single")) {
        const t = Number(i.config.get("page.id"));
        return Number.isFinite(t) && t > 0 ? t : void 0;
      }
    } catch {
    }
}
function D() {
  const i = c();
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
const k = "shohrah.";
function F(i, t) {
  const r = c();
  try {
    if (r?.storage?.getWithTTL) return r.storage.getWithTTL(k + i, t, "session") ?? t;
    const e = window.sessionStorage.getItem(k + i);
    return e == null ? t : JSON.parse(e);
  } catch {
    return t;
  }
}
function V(i, t, r = 5) {
  const e = c();
  try {
    if (e?.storage?.setWithTTL) {
      e.storage.setWithTTL(k + i, t, r, "session");
      return;
    }
    window.sessionStorage.setItem(k + i, JSON.stringify(t));
  } catch {
  }
}
async function Q(i, t = [], r = 5) {
  const e = c();
  if (!e?.product?.api?.getDetails) return;
  const s = `product.${i}.${t.join("+")}`, o = F(s, null);
  if (o && o.id) return o;
  const h = (await e.product.api.getDetails(i, t))?.data;
  return h && V(s, h, r), h;
}
async function W(i, t = 1) {
  const r = c();
  return r?.cart?.addItem ? (await r.cart.addItem({ id: i, quantity: t }), !0) : !1;
}
function C(i, t) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const r = i, e = [r[t], r.ar, r.en, ...Object.values(r)];
  for (const s of e) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function B(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (r, e) => e in t ? String(t[e]) : r
  ) : i;
}
function U(i, t) {
  const r = c();
  if (!r?.lang?.addBulk) return;
  const e = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (e.has(i)) return;
  const s = {};
  for (const [o, a] of Object.entries(t)) s[`shohrah.${i}.${o}`] = { ar: a.ar, en: a.en };
  try {
    r.lang.addBulk(s), e.add(i);
  } catch {
  }
}
function X(i, t, r, e, s) {
  const o = `shohrah.${i}.${t}`, a = c();
  let h;
  if (a?.lang?.get && a.lang.translationsLoaded)
    try {
      const n = a.lang.get(o);
      typeof n == "string" && n && n !== o && (h = n);
    } catch {
      h = void 0;
    }
  if (!h) {
    const n = r[t];
    h = n ? (e === "ar" ? n.ar : n.en) || n.en || n.ar : t;
  }
  return B(h, s);
}
function P(i, t) {
  if (i == null || i === "") return "";
  const r = c();
  try {
    if (r?.money) return r.money(t ? { amount: Number(i), currency: t } : i);
  } catch {
  }
  const e = Number(i);
  if (!Number.isFinite(e)) return String(i);
  try {
    return new Intl.NumberFormat(x() === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: t || "SAR",
      maximumFractionDigits: 2
    }).format(e);
  } catch {
    return `${e.toFixed(2)} SAR`;
  }
}
function Y(i) {
  if (i == null || i === "") return "";
  const t = c();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(i));
  } catch {
  }
  return String(i);
}
function E(i, t, r) {
  return Math.min(r, Math.max(t, i));
}
function G(i) {
  const t = i.sale_price != null && Number(i.sale_price) > 0 ? i.sale_price : void 0, r = i.regular_price != null && Number(i.regular_price) > 0 ? i.regular_price : void 0;
  return i.is_on_sale && t != null ? { current: t, original: r ?? i.price } : { current: i.price ?? t ?? r, original: void 0 };
}
var H = Object.defineProperty, S = (i, t, r, e) => {
  for (var s = void 0, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (s = a(t, r, s) || s);
  return s && H(t, r, s), s;
};
class y extends R {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = x();
    const t = new MutationObserver(() => {
      const r = x();
      r !== this.locale && (this.locale = r, this.onLocaleChange());
    });
    t.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => t.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const t = this.disposers.splice(0);
    for (const r of t)
      try {
        r();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await z(), !!this.isConnected) {
      this.locale = x(), U(this.ns, this.messages), this.applyThemeFallbacks();
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
    const r = t instanceof Error ? t.message : String(t ?? "error");
    this.errorMessage = r, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, t);
    } catch {
    }
    this.emit("error", { message: r });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(t) {
    this.disposers.push(t);
  }
  listen(t, r, e, s) {
    t.addEventListener(r, e, s), this.addDisposer(() => t.removeEventListener(r, e, s));
  }
  delay(t, r) {
    const e = window.setTimeout(r, t);
    return this.addDisposer(() => window.clearTimeout(e)), e;
  }
  every(t, r) {
    const e = window.setInterval(r, t), s = () => window.clearInterval(e);
    return this.addDisposer(s), s;
  }
  own(t) {
    return this.addDisposer(() => t.disconnect()), t;
  }
  emit(t, r = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${t}`, { detail: r, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(t, r) {
    return X(this.ns, t, this.messages, this.locale, r);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(t, r, e) {
    const s = this.str(t);
    return s ? e ? this.interp(s, e) : s : this.t(r, e);
  }
  interp(t, r) {
    return t.replace(/\{(\w+)\}/g, (e, s) => s in r ? String(r[s]) : e);
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
  str(t, r = "") {
    const e = this.raw(t);
    if (e == null) return r;
    if (typeof e == "object") {
      const o = C(e, this.locale);
      return o.trim() ? o : r;
    }
    const s = String(e);
    return s.trim() ? s : r;
  }
  bool(t, r) {
    const e = this.raw(t);
    if (e == null || e === "") return r;
    if (typeof e == "boolean") return e;
    if (typeof e == "number") return e !== 0;
    const s = String(e).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(s) ? !0 : ["false", "0", "no", "off"].includes(s) ? !1 : r;
  }
  num(t, r, e = -1 / 0, s = 1 / 0) {
    const o = this.raw(t), a = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(a) && o != null && o !== "" ? E(a, e, s) : r;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, r, e) {
    let s = this.raw(t);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const o = s == null ? "" : String(s).trim();
    return r.includes(o) ? o : e;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(t) {
    let r = this.raw(t);
    Array.isArray(r) && (r = r[0]), r && typeof r == "object" && (r = r.value);
    const e = Number(r);
    return Number.isFinite(e) && e > 0 ? e : void 0;
  }
  /** Rows of a `collection` field. */
  list(t) {
    const r = this.raw(t);
    return Array.isArray(r) ? r.filter((e) => e && typeof e == "object") : r && typeof r == "object" ? Object.values(r).filter((e) => e && typeof e == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(t, r, e = "") {
    const s = t[r];
    if (s == null) return e;
    if (typeof s == "object") {
      const a = C(s, this.locale);
      return a.trim() ? a : e;
    }
    const o = String(s);
    return o.trim() ? o : e;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(t) {
    return this.linkValue(this.raw(t));
  }
  linkValue(t) {
    if (Array.isArray(t) && (t = t[0]), t && typeof t == "object" && (t = t.url ?? t.value), t == null) return "";
    const r = String(t).trim();
    return !r || r === "#" ? "" : /^(https?:)?\/\//i.test(r) || r.startsWith("/") || r.startsWith("#") || r.startsWith("mailto:") || r.startsWith("tel:") ? r : /^[\w./-]+$/.test(r) ? `/${r}` : "";
  }
  color(t, r) {
    const e = this.str(t, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(e) ? e : r;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: e, onPrimary: s } = D();
      e && this.style.setProperty("--shohrah-primary", e), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const r = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(r)) return "#ffffff";
    const [e, s, o] = [0, 2, 4].map((n) => parseInt(r.slice(n, n + 2), 16) / 255), a = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * a(e) + 0.7152 * a(s) + 0.0722 * a(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
S([
  m({ type: Object })
], y.prototype, "config");
S([
  g()
], y.prototype, "locale");
S([
  m({ type: String, reflect: !0, attribute: "data-phase" })
], y.prototype, "phase");
S([
  g()
], y.prototype, "errorMessage");
const J = A`
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
`, _ = (i, t = !1, r = "") => b`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${r}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, K = () => _(b`<path d="M12 5v14M5 12h14"/>`), Z = () => _(b`<path d="M5 12h14"/>`), tt = () => _(b`<path d="M5 12.5l4.5 4.5L19 7"/>`), rt = () => _(
  b`<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.25"/><circle cx="17" cy="20" r="1.25"/>`
), et = {
  add: { ar: "أضف إلى السلة", en: "Add to cart" },
  adding: { ar: "جارٍ الإضافة…", en: "Adding…" },
  added: { ar: "تمت الإضافة", en: "Added" },
  failed: { ar: "لم تتم الإضافة، حاول مجددًا", en: "Could not add, try again" },
  options: { ar: "اختر الخيارات أولًا", en: "Choose options first" },
  out_of_stock: { ar: "غير متوفر حاليًا", en: "Out of stock" },
  quantity: { ar: "الكمية", en: "Quantity" },
  increase: { ar: "زيادة الكمية", en: "Increase quantity" },
  decrease: { ar: "تقليل الكمية", en: "Decrease quantity" },
  region_label: { ar: "شريط الإضافة السريعة إلى السلة", en: "Quick add-to-cart bar" },
  no_product: { ar: "ضع هذا العنصر في صفحة المنتج أو اختر منتجًا من الإعدادات.", en: "Place this component on a product page or pick a product in the settings." },
  load_error: { ar: "تعذّر تحميل بيانات المنتج.", en: "Could not load product data." }
}, st = A`
  :host {
    --sb-offset: 0px;
    --sb-bg: var(--sh-surface);
    --sb-fg: var(--sh-text);
    --sb-border: var(--sh-border);
    position: fixed;
    inset-inline: 0;
    inset-block-end: var(--sb-offset);
    z-index: 50;
    width: auto;
    transform: translateY(calc(100% + var(--sb-offset) + 8px));
    transition: transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
    pointer-events: none;
  }
  :host([position='top']) {
    inset-block-end: auto;
    inset-block-start: var(--sb-offset);
    transform: translateY(calc(-100% - var(--sb-offset) - 8px));
  }
  :host([data-phase='empty']),
  :host([data-phase='error']) {
    position: static;
    transform: none;
    pointer-events: auto;
  }
  :host([visible]) {
    transform: none;
    pointer-events: auto;
  }
  :host([show-on='mobile']) {
    display: none;
  }
  @media (max-width: 767.98px) {
    :host([show-on='mobile']) {
      display: block;
    }
    :host([show-on='desktop']) {
      display: none;
    }
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.625rem max(1rem, env(safe-area-inset-left)) calc(0.625rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-right));
    background: var(--sb-bg);
    color: var(--sb-fg);
    border-block-start: 1px solid var(--sb-border);
  }
  :host([position='top']) .bar {
    border-block-start: 0;
    border-block-end: 1px solid var(--sb-border);
    padding-block-end: 0.625rem;
  }
  .bar--shadow {
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.08);
  }
  :host([position='top']) .bar--shadow {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
  .bar--dark {
    --sb-bg: #111827;
    --sb-fg: #ffffff;
    --sb-border: rgba(255, 255, 255, 0.1);
    --sh-muted: rgba(255, 255, 255, 0.7);
  }
  .bar--primary {
    --sb-bg: var(--sh-primary);
    --sb-fg: var(--sh-on-primary);
    --sb-border: transparent;
    --sh-muted: color-mix(in srgb, var(--sh-on-primary) 75%, transparent);
  }
  .bar--primary .sh-btn--primary {
    background: var(--sh-on-primary);
    color: var(--sh-primary);
  }
  .inner {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
  }
  .thumb {
    width: 3rem;
    height: 3rem;
    border-radius: var(--sh-radius-sm);
    object-fit: cover;
    flex: none;
    background: var(--sh-surface-2);
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    line-height: 1.35;
  }
  .name {
    margin: 0;
    font-weight: 700;
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-variant-numeric: tabular-nums;
  }
  .price .now {
    font-weight: 700;
  }
  .price .was {
    color: var(--sh-muted);
    text-decoration: line-through;
    font-size: 0.85rem;
  }
  .qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--sb-border);
    border-radius: var(--sh-radius);
    overflow: hidden;
    flex: none;
    background: color-mix(in srgb, var(--sb-fg) 4%, transparent);
  }
  .qty button {
    width: 2.5rem;
    height: 2.75rem;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .qty button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .qty button svg {
    width: 1rem;
    height: 1rem;
  }
  .qty output {
    min-width: 2rem;
    text-align: center;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .add {
    flex: none;
    min-width: 9rem;
  }
  .add--added {
    background: var(--sh-success) !important;
    color: #fff !important;
  }
  .add--failed {
    background: var(--sh-danger) !important;
    color: #fff !important;
  }
  .hint {
    font-size: 0.8rem;
    color: var(--sh-muted);
    margin: 0;
  }
  .spinner {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    animation: sb-spin 0.8s linear infinite;
  }
  @keyframes sb-spin {
    to {
      transform: rotate(360deg);
    }
  }
  .skel-name {
    width: 55%;
    height: 1rem;
  }
  .skel-price {
    width: 30%;
    height: 0.9rem;
    margin-block-start: 0.25rem;
  }
  @media (max-width: 640px) {
    .thumb {
      width: 2.5rem;
      height: 2.5rem;
    }
    .name {
      font-size: 0.875rem;
    }
    .add {
      min-width: 0;
      padding-inline: 0.875rem;
    }
    .qty button {
      width: 2.125rem;
      height: 2.5rem;
    }
  }
`;
var it = Object.defineProperty, u = (i, t, r, e) => {
  for (var s = void 0, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (s = a(t, r, s) || s);
  return s && it(t, r, s), s;
};
const ot = ["bottom", "top"], at = ["light", "dark", "primary"], nt = ["all", "mobile", "desktop"], L = ["salla-add-product-button", 'form[id^="product-form"]', ".product-form", "#product-form"], O = class O extends y {
  constructor() {
    super(...arguments), this.ns = "sticky-add-to-cart", this.messages = et, this.position = "bottom", this.visible = !1, this.showOn = "all", this.quantity = 1, this.addState = "idle", this.scrolledEnough = !1, this.formInView = !1, this.scrollRaf = 0;
  }
  resolveProductId() {
    return this.productId ?? this.selectedId("product") ?? M();
  }
  async onSallaReady() {
    if (this.position = this.choice("position", ot, this.position), this.showOn = this.choice("show_on", nt, this.showOn), await this.load(), this.phase === "ready" && (this.listen(window, "scroll", () => this.onScroll(), { passive: !0 }), this.onScroll(), this.bool("hide_near_form", !0) && "IntersectionObserver" in window)) {
      const t = L.map((r) => document.querySelector(r)).find(Boolean);
      t && this.own(
        new IntersectionObserver(
          (e) => {
            this.formInView = e.some((s) => s.isIntersecting), this.updateVisibility();
          },
          { threshold: 0.2 }
        )
      ).observe(t);
    }
  }
  async load() {
    const t = this.resolveProductId();
    if (!t) {
      this.phase = "empty";
      return;
    }
    this.loadedFor = t, this.phase = "loading";
    try {
      const r = await Q(t, ["images", "options"]);
      if (!r) throw new Error(this.t("load_error"));
      this.product = r, this.quantity = 1, this.phase = "ready";
    } catch (r) {
      this.fail(r instanceof Error ? r : new Error(this.t("load_error")));
    }
  }
  updated(t) {
    if ((t.has("config") || t.has("productId")) && this.salla) {
      const r = this.resolveProductId();
      r && r !== this.loadedFor && this.load();
    }
  }
  onScroll() {
    this.scrollRaf || (this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      const t = this.num("show_after_px", 320, 0, 5e3);
      this.scrolledEnough = (window.scrollY || document.documentElement.scrollTop) > t, this.updateVisibility();
    }));
  }
  updateVisibility() {
    const t = this.isOutOfStock, r = this.phase === "ready" && this.scrolledEnough && !this.formInView && !(t && this.bool("hide_when_out_of_stock", !1));
    r !== this.visible && (this.visible = r, this.emit("visibility", { visible: r }));
  }
  get isOutOfStock() {
    const t = this.product;
    return !!t && (t.is_out_of_stock === !0 || t.is_available === !1);
  }
  get hasOptions() {
    const t = this.product;
    return !!t && (t.has_options === !0 || Array.isArray(t.options) && t.options.length > 0);
  }
  get maxQuantity() {
    const t = this.product, r = Number(t?.max_quantity ?? 0);
    return r > 0 ? r : 99;
  }
  setQuantity(t) {
    this.quantity = E(t, 1, this.maxQuantity);
  }
  async add() {
    const t = this.product;
    if (!t || this.addState === "adding" || this.isOutOfStock) return;
    const r = Number(t.id);
    if (this.hasOptions) {
      this.emit("options-required", { productId: r });
      const s = L.map((o) => document.querySelector(o)).find(Boolean);
      s ? (s.scrollIntoView({ behavior: this.reducedMotion ? "auto" : "smooth", block: "center" }), this.delay(500, () => s.querySelector("select, input, button")?.focus?.())) : t.url && (window.location.href = t.url);
      return;
    }
    this.addState = "adding";
    let e = !1;
    try {
      e = await W(r, this.quantity), this.addState = e ? "added" : "failed";
    } catch {
      this.addState = "failed";
    }
    this.emit("add-to-cart", { productId: r, quantity: this.quantity, ok: e }), this.delay(2200, () => {
      this.addState = "idle";
    });
  }
  render() {
    if (this.phase === "error") return d`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === "empty") return d`<div class="sh-empty" part="empty">${this.t("no_product")}</div>`;
    const t = this.choice("surface", at, "light"), r = this.bool("shadow", !0), e = this.num("offset_px", 0, 0, 200), s = this.product, o = this.phase === "loading" || !s, a = this.bool("show_image", !0), h = this.bool("show_name", !0), n = this.bool("show_price", !0), N = this.bool("show_quantity", !0) && !this.hasOptions, v = this.isOutOfStock, I = s?.image?.url || s?.images?.find((j) => j.main)?.url || s?.images?.[0]?.url || "", $ = s ? G(s) : { current: void 0, original: void 0 };
    let p = this.text("button_text", "add") || s?.add_to_cart_label || this.t("add");
    return this.hasOptions && (p = this.text("options_hint", "options")), v && (p = this.text("out_of_stock_text", "out_of_stock")), this.addState === "adding" && (p = this.t("adding")), this.addState === "added" && (p = this.t("added")), this.addState === "failed" && (p = this.t("failed")), d`
      <div
        class=${q({ bar: !0, [`bar--${t}`]: !0, "bar--shadow": r })}
        style="--sb-offset:${e}px"
        part="bar"
        role="region"
        aria-label=${this.t("region_label")}
        aria-busy=${String(o)}
      >
        <div class="inner">
          ${a ? o ? d`<span class="thumb sh-skeleton"></span>` : I ? d`<img class="thumb" part="image" src=${I} alt="" width="48" height="48" loading="lazy" />` : f : f}
          <div class="info">
            ${o ? d`<span class="sh-skeleton skel-name"></span><span class="sh-skeleton skel-price"></span>` : d`
                  ${h ? d`<p class="name" part="name">${s?.name ?? ""}</p>` : f}
                  ${n ? d`<div class="price" part="price">
                        <span class="now">${P($.current)}</span>
                        ${$.original ? d`<s class="was">${P($.original)}</s>` : f}
                      </div>` : f}
                `}
          </div>
          <slot name="extra"></slot>
          ${N && !o && !v ? d`<div class="qty" part="quantity" role="group" aria-label=${this.t("quantity")}>
                <button type="button" aria-label=${this.t("decrease")} ?disabled=${this.quantity <= 1} @click=${() => this.setQuantity(this.quantity - 1)}>
                  ${Z()}
                </button>
                <output aria-live="polite">${Y(this.quantity)}</output>
                <button type="button" aria-label=${this.t("increase")} ?disabled=${this.quantity >= this.maxQuantity} @click=${() => this.setQuantity(this.quantity + 1)}>
                  ${K()}
                </button>
              </div>` : f}
          <slot name="button">
            <button
              class=${q({ "sh-btn": !0, "sh-btn--primary": !0, add: !0, [`add--${this.addState}`]: this.addState !== "idle" })}
              part="button"
              type="button"
              ?disabled=${o || v || this.addState === "adding"}
              aria-disabled=${String(o || v)}
              @click=${this.add}
            >
              ${this.addState === "adding" ? d`<span class="spinner" aria-hidden="true"></span>` : this.addState === "added" ? tt() : rt()}
              <span>${p}</span>
            </button>
          </slot>
        </div>
      </div>
    `;
  }
};
O.styles = [J, st];
let l = O;
u([
  m({ type: Number, attribute: "product-id" })
], l.prototype, "productId");
u([
  m({ type: String, reflect: !0 })
], l.prototype, "position");
u([
  m({ type: Boolean, reflect: !0 })
], l.prototype, "visible");
u([
  m({ type: String, reflect: !0, attribute: "show-on" })
], l.prototype, "showOn");
u([
  g()
], l.prototype, "product");
u([
  g()
], l.prototype, "quantity");
u([
  g()
], l.prototype, "addState");
typeof l < "u" && l.registerSallaComponent("salla-sticky-add-to-cart");
export {
  l as default
};
