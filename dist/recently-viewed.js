import { LitElement as z, css as j, svg as f, html as c, nothing as u } from "lit";
import { property as $, state as _, query as R } from "lit/decorators.js";
import { classMap as y } from "lit/directives/class-map.js";
function d() {
  return window.salla ?? window.Salla;
}
let w = null;
function N(i, r) {
  return new Promise((t) => {
    const e = window.setTimeout(() => t(void 0), r);
    i.then(
      (s) => {
        clearTimeout(e), t(s);
      },
      () => {
        clearTimeout(e), t(void 0);
      }
    );
  });
}
function O(i = 8e3) {
  return w || (w = new Promise((r) => {
    const t = Date.now(), e = () => {
      const s = d();
      if (s && typeof s.onReady == "function") {
        N(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? N(s.lang.onLoaded(), 4e3) : void 0).then(() => r(s));
        return;
      }
      if (Date.now() - t > i) {
        r(void 0);
        return;
      }
      window.setTimeout(e, 50);
    };
    e();
  }), w);
}
function x() {
  const i = document.documentElement.getAttribute("lang");
  let r = i && i.trim();
  if (!r) {
    const t = d();
    try {
      r = t?.lang?.getLocale?.() || t?.config?.get("user.language_code");
    } catch {
      r = void 0;
    }
  }
  return (r || "ar").toLowerCase().split(/[-_]/)[0];
}
function M() {
  const i = d();
  if (i)
    try {
      if (i.url?.is_page?.("product.single")) {
        const r = Number(i.config.get("page.id"));
        return Number.isFinite(r) && r > 0 ? r : void 0;
      }
    } catch {
    }
}
function D() {
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
const p = "shohrah.";
function F(i, r) {
  const t = d();
  try {
    if (t?.storage?.get) return t.storage.get(p + i, r) ?? r;
    const e = window.localStorage.getItem(p + i);
    return e == null ? r : JSON.parse(e);
  } catch {
    return r;
  }
}
function B(i, r) {
  const t = d();
  try {
    if (t?.storage?.set) {
      t.storage.set(p + i, r);
      return;
    }
    window.localStorage.setItem(p + i, JSON.stringify(r));
  } catch {
  }
}
function Y(i) {
  const r = d();
  try {
    if (r?.storage?.remove) {
      r.storage.remove(p + i);
      return;
    }
    window.localStorage.removeItem(p + i);
  } catch {
  }
}
async function H(i, r) {
  const t = d();
  if (!t?.product?.api?.fetch || i.length === 0) return [];
  const s = (await t.product.api.fetch({
    source: "selected",
    source_value: i,
    limit: r ?? i.length
  }))?.data;
  return Array.isArray(s) ? s : [];
}
async function V(i, r = 1) {
  const t = d();
  return t?.cart?.addItem ? (await t.cart.addItem({ id: i, quantity: r }), !0) : !1;
}
function T(i, r) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const t = i, e = [t[r], t.ar, t.en, ...Object.values(t)];
  for (const s of e) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function W(i, r) {
  return r ? i.replace(
    /\{(\w+)\}/g,
    (t, e) => e in r ? String(r[e]) : t
  ) : i;
}
function X(i, r) {
  const t = d();
  if (!t?.lang?.addBulk) return;
  const e = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (e.has(i)) return;
  const s = {};
  for (const [a, o] of Object.entries(r)) s[`shohrah.${i}.${a}`] = { ar: o.ar, en: o.en };
  try {
    t.lang.addBulk(s), e.add(i);
  } catch {
  }
}
function q(i, r, t, e, s) {
  const a = `shohrah.${i}.${r}`, o = d();
  let l;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const n = o.lang.get(a);
      typeof n == "string" && n && n !== a && (l = n);
    } catch {
      l = void 0;
    }
  if (!l) {
    const n = t[r];
    l = n ? (e === "ar" ? n.ar : n.en) || n.en || n.ar : r;
  }
  return W(l, s);
}
function E(i, r) {
  if (i == null || i === "") return "";
  const t = d();
  try {
    if (t?.money) return t.money(r ? { amount: Number(i), currency: r } : i);
  } catch {
  }
  const e = Number(i);
  if (!Number.isFinite(e)) return String(i);
  try {
    return new Intl.NumberFormat(x() === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: r || "SAR",
      maximumFractionDigits: 2
    }).format(e);
  } catch {
    return `${e.toFixed(2)} SAR`;
  }
}
function U(i, r, t) {
  return Math.min(t, Math.max(r, i));
}
function G(i) {
  const r = i.sale_price != null && Number(i.sale_price) > 0 ? i.sale_price : void 0, t = i.regular_price != null && Number(i.regular_price) > 0 ? i.regular_price : void 0;
  return i.is_on_sale && r != null ? { current: r, original: t ?? i.price } : { current: i.price ?? r ?? t, original: void 0 };
}
var J = Object.defineProperty, k = (i, r, t, e) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(r, t, s) || s);
  return s && J(r, t, s), s;
};
class g extends z {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = x();
    const r = new MutationObserver(() => {
      const t = x();
      t !== this.locale && (this.locale = t, this.onLocaleChange());
    });
    r.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => r.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const r = this.disposers.splice(0);
    for (const t of r)
      try {
        t();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await O(), !!this.isConnected) {
      this.locale = x(), X(this.ns, this.messages), this.applyThemeFallbacks();
      try {
        await this.onSallaReady(), this.emit("ready");
      } catch (r) {
        this.fail(r);
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
  fail(r) {
    const t = r instanceof Error ? r.message : String(r ?? "error");
    this.errorMessage = t, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, r);
    } catch {
    }
    this.emit("error", { message: t });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(r) {
    this.disposers.push(r);
  }
  listen(r, t, e, s) {
    r.addEventListener(t, e, s), this.addDisposer(() => r.removeEventListener(t, e, s));
  }
  delay(r, t) {
    const e = window.setTimeout(t, r);
    return this.addDisposer(() => window.clearTimeout(e)), e;
  }
  every(r, t) {
    const e = window.setInterval(t, r), s = () => window.clearInterval(e);
    return this.addDisposer(s), s;
  }
  own(r) {
    return this.addDisposer(() => r.disconnect()), r;
  }
  emit(r, t = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${r}`, { detail: t, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(r, t) {
    return q(this.ns, r, this.messages, this.locale, t);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(r, t, e) {
    const s = this.str(r);
    return s ? e ? this.interp(s, e) : s : this.t(t, e);
  }
  interp(r, t) {
    return r.replace(/\{(\w+)\}/g, (e, s) => s in t ? String(t[s]) : e);
  }
  get rtl() {
    return getComputedStyle(this).direction === "rtl";
  }
  get reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  /* ------------------------------------------------------------- config getters */
  raw(r) {
    return this.config ? this.config[r] : void 0;
  }
  str(r, t = "") {
    const e = this.raw(r);
    if (e == null) return t;
    if (typeof e == "object") {
      const a = T(e, this.locale);
      return a.trim() ? a : t;
    }
    const s = String(e);
    return s.trim() ? s : t;
  }
  bool(r, t) {
    const e = this.raw(r);
    if (e == null || e === "") return t;
    if (typeof e == "boolean") return e;
    if (typeof e == "number") return e !== 0;
    const s = String(e).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(s) ? !0 : ["false", "0", "no", "off"].includes(s) ? !1 : t;
  }
  num(r, t, e = -1 / 0, s = 1 / 0) {
    const a = this.raw(r), o = typeof a == "number" ? a : Number(String(a ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && a != null && a !== "" ? U(o, e, s) : t;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(r, t, e) {
    let s = this.raw(r);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const a = s == null ? "" : String(s).trim();
    return t.includes(a) ? a : e;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(r) {
    let t = this.raw(r);
    Array.isArray(t) && (t = t[0]), t && typeof t == "object" && (t = t.value);
    const e = Number(t);
    return Number.isFinite(e) && e > 0 ? e : void 0;
  }
  /** Rows of a `collection` field. */
  list(r) {
    const t = this.raw(r);
    return Array.isArray(t) ? t.filter((e) => e && typeof e == "object") : t && typeof t == "object" ? Object.values(t).filter((e) => e && typeof e == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(r, t, e = "") {
    const s = r[t];
    if (s == null) return e;
    if (typeof s == "object") {
      const o = T(s, this.locale);
      return o.trim() ? o : e;
    }
    const a = String(s);
    return a.trim() ? a : e;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(r) {
    return this.linkValue(this.raw(r));
  }
  linkValue(r) {
    if (Array.isArray(r) && (r = r[0]), r && typeof r == "object" && (r = r.url ?? r.value), r == null) return "";
    const t = String(r).trim();
    return !t || t === "#" ? "" : /^(https?:)?\/\//i.test(t) || t.startsWith("/") || t.startsWith("#") || t.startsWith("mailto:") || t.startsWith("tel:") ? t : /^[\w./-]+$/.test(t) ? `/${t}` : "";
  }
  color(r, t) {
    const e = this.str(r, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(e) ? e : t;
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
  readableOn(r) {
    const t = r.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(t)) return "#ffffff";
    const [e, s, a] = [0, 2, 4].map((n) => parseInt(t.slice(n, n + 2), 16) / 255), o = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(e) + 0.7152 * o(s) + 0.0722 * o(a) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
k([
  $({ type: Object })
], g.prototype, "config");
k([
  _()
], g.prototype, "locale");
k([
  $({ type: String, reflect: !0, attribute: "data-phase" })
], g.prototype, "phase");
k([
  _()
], g.prototype, "errorMessage");
const K = j`
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
`, b = (i, r = !1, t = "") => f`<svg class="sh-svg ${r ? "sh-svg--fill" : ""} ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, P = () => b(f`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), Q = () => b(f`<path d="M19 12H5M11 18l-6-6 6-6"/>`, !1, "sh-flip-rtl"), Z = () => b(f`<path d="M5 12.5l4.5 4.5L19 7"/>`), rr = () => b(
  f`<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.25"/><circle cx="17" cy="20" r="1.25"/>`
), tr = () => b(f`<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>`), er = {
  title: { ar: "شاهدته مؤخرًا", en: "Recently viewed" },
  subtitle: { ar: "تابع من حيث توقفت", en: "Pick up where you left off" },
  region_label: { ar: "المنتجات التي شاهدتها مؤخرًا", en: "Products you viewed recently" },
  add: { ar: "أضف", en: "Add" },
  added: { ar: "تمت الإضافة", en: "Added" },
  view: { ar: "عرض المنتج", en: "View product" },
  clear: { ar: "مسح السجل", en: "Clear history" },
  empty: { ar: "لم تشاهد أي منتجات بعد", en: "You haven’t viewed any products yet" },
  sale: { ar: "خصم", en: "Sale" },
  prev: { ar: "السابق", en: "Previous" },
  next: { ar: "التالي", en: "Next" },
  add_to_cart_label: { ar: "إضافة {name} إلى السلة", en: "Add {name} to cart" },
  load_error: { ar: "تعذّر تحميل المنتجات.", en: "Could not load products." }
}, sr = j`
  .root {
    --rv-cols: 4;
    --rv-cols-mobile: 2;
    --rv-ratio: 3 / 4;
    --rv-gap: 1rem;
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
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
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: none;
  }
  .clear {
    min-height: 2.25rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(var(--rv-cols-mobile), minmax(0, 1fr));
    gap: var(--rv-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  @media (min-width: 768px) {
    .list {
      grid-template-columns: repeat(var(--rv-cols), minmax(0, 1fr));
    }
  }
  .list--slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 4px;
    margin: -4px;
  }
  .list--slider::-webkit-scrollbar {
    display: none;
  }
  .list--slider .card-wrap {
    flex: 0 0 calc((100% - (var(--rv-cols-mobile) - 1) * var(--rv-gap)) / var(--rv-cols-mobile));
    scroll-snap-align: start;
  }
  @media (min-width: 768px) {
    .list--slider .card-wrap {
      flex-basis: calc((100% - (var(--rv-cols) - 1) * var(--rv-gap)) / var(--rv-cols));
    }
  }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    overflow: hidden;
    transition: transform var(--sh-ease), box-shadow var(--sh-ease), border-color var(--sh-ease);
  }
  .card--outlined {
    border: 1px solid var(--sh-border);
  }
  .card--elevated {
    box-shadow: var(--sh-shadow);
  }
  .card--plain {
    background: transparent;
  }
  .card:hover {
    transform: translateY(-2px);
  }
  .card--outlined:hover {
    border-color: color-mix(in srgb, var(--sh-primary) 40%, var(--sh-border));
  }
  .media {
    position: relative;
    aspect-ratio: var(--rv-ratio);
    background: var(--sh-surface-2);
    overflow: hidden;
    display: block;
  }
  .card--plain .media {
    border-radius: var(--sh-radius);
  }
  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease-out;
  }
  .card:hover .media img {
    transform: scale(1.03);
  }
  .badge {
    position: absolute;
    inset-block-start: 0.5rem;
    inset-inline-start: 0.5rem;
    padding: 0.125rem 0.5rem;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-danger);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 0.75rem 0.875rem 0.875rem;
    flex: 1;
  }
  .card--plain .body {
    padding-inline: 0.125rem;
  }
  .name {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .name a {
    text-decoration: none;
  }
  .name a::after {
    content: '';
    position: absolute;
    inset: 0;
  }
  .name a:hover {
    color: var(--sh-primary);
  }
  .price {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-variant-numeric: tabular-nums;
    font-size: 0.92rem;
  }
  .price .now {
    font-weight: 700;
    color: var(--sh-primary);
  }
  .price .was {
    color: var(--sh-muted);
    text-decoration: line-through;
    font-size: 0.8rem;
  }
  .add {
    position: relative;
    z-index: 1;
    margin-block-start: auto;
    min-height: 2.5rem;
    font-size: 0.88rem;
    width: 100%;
  }
  .add--added {
    background: var(--sh-success) !important;
    color: #fff !important;
    border-color: transparent !important;
  }
  .skel-media {
    aspect-ratio: var(--rv-ratio);
  }
  .skel-line {
    height: 0.9rem;
    width: 80%;
  }
  .skel-line--short {
    width: 45%;
  }
`;
var ir = Object.defineProperty, v = (i, r, t, e) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(r, t, s) || s);
  return s && ir(r, t, s), s;
};
const ar = ["slider", "grid"], or = ["square", "portrait", "landscape"], nr = ["hide", "message"], lr = ["outlined", "elevated", "plain"], cr = { square: "1 / 1", portrait: "3 / 4", landscape: "4 / 3" }, I = "recently_viewed", dr = 24, C = class C extends g {
  constructor() {
    super(...arguments), this.ns = "recently-viewed", this.messages = er, this.products = [], this.addedIds = /* @__PURE__ */ new Set();
  }
  readHistory() {
    const r = this.num("storage_days", 30, 1, 365), t = Date.now() - r * 864e5, e = F(I, []);
    return (Array.isArray(e) ? e : []).filter((a) => a && Number(a.id) > 0 && Number(a.t) > t);
  }
  recordCurrent() {
    const r = M();
    if (!r) return;
    const t = this.readHistory().filter((e) => Number(e.id) !== r);
    t.unshift({ id: r, t: Date.now() }), B(I, t.slice(0, dr));
  }
  async onSallaReady() {
    this.recordCurrent(), await this.load();
  }
  async load() {
    const r = M(), t = this.bool("exclude_current", !0), e = this.limit ?? this.num("limit", 8, 2, 12), s = this.readHistory().map((a) => Number(a.id)).filter((a) => !(t && a === r)).slice(0, e);
    if (s.length === 0) {
      this.products = [], this.phase = "empty";
      return;
    }
    this.phase = "loading";
    try {
      const a = await H(s, e), o = new Map(a.map((l) => [Number(l.id), l]));
      this.products = s.map((l) => o.get(l)).filter((l) => !!l), this.phase = this.products.length ? "ready" : "empty", this.emit("products-loaded", { count: this.products.length });
    } catch (a) {
      this.fail(a instanceof Error ? a : new Error(this.t("load_error")));
    }
  }
  clear() {
    Y(I), this.products = [], this.phase = "empty", this.emit("history-cleared");
  }
  async add(r) {
    const t = Number(r.id);
    let e = !1;
    try {
      e = await V(t, 1);
    } catch {
      e = !1;
    }
    e && (this.addedIds = /* @__PURE__ */ new Set([...this.addedIds, t]), this.delay(2200, () => {
      const s = new Set(this.addedIds);
      s.delete(t), this.addedIds = s;
    })), this.emit("add-to-cart", { productId: t, ok: e });
  }
  scrollSlider(r) {
    const t = this.sliderEl;
    if (!t) return;
    const e = t.clientWidth * 0.9 * r * (this.rtl ? -1 : 1);
    t.scrollBy({ left: e, behavior: this.reducedMotion ? "auto" : "smooth" });
  }
  render() {
    if (this.phase === "error") return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const r = this.layout ?? this.choice("layout", ar, "slider"), t = this.choice("image_ratio", or, "portrait"), e = this.choice("card_style", lr, "outlined"), s = this.choice("empty_behavior", nr, "hide"), a = this.num("columns_desktop", 4, 2, 6), o = this.num("columns_mobile", 2, 1, 3), l = `--rv-cols:${a};--rv-cols-mobile:${o};--rv-ratio:${cr[t]}`, n = this.str("subtitle");
    if (this.phase === "empty")
      return s === "hide" ? u : c`<section class="root" part="root" style=${l}>
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
        </div>
        <slot name="empty"><div class="sh-empty" part="empty">${this.text("empty_message", "empty")}</div></slot>
      </section>`;
    const h = this.phase === "loading", S = this.limit ?? this.num("limit", 8, 2, 12), A = h ? Array.from({ length: Math.min(S, a) }) : this.products;
    return c`
      <section class="root" part="root" style=${l} aria-label=${this.t("region_label")} aria-busy=${String(h)}>
        <div class="head">
          <div class="sh-header">
            <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
            ${n ? c`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${n}</p></slot>` : u}
          </div>
          <div class="actions">
            ${this.bool("show_clear", !0) && !h ? c`<button class="sh-btn sh-btn--ghost clear" part="clear" type="button" @click=${this.clear}>
                  ${tr()} ${this.text("clear_text", "clear")}
                </button>` : u}
            ${r === "slider" && !h && this.products.length > a ? c`
                  <button class="sh-icon-btn" type="button" aria-label=${this.t("prev")} @click=${() => this.scrollSlider(-1)}>${Q()}</button>
                  <button class="sh-icon-btn" type="button" aria-label=${this.t("next")} @click=${() => this.scrollSlider(1)}>${P()}</button>
                ` : u}
          </div>
        </div>
        <ul class=${y({ list: !0, "list--slider": r === "slider" })} part="list" role="list">
          ${A.map((L) => c`<li class="card-wrap">${h ? this.renderSkeleton(e) : this.renderCard(L, e)}</li>`)}
        </ul>
      </section>
    `;
  }
  renderSkeleton(r) {
    return c`<div class=${y({ card: !0, [`card--${r}`]: !0 })} aria-hidden="true">
      <div class="media sh-skeleton skel-media"></div>
      <div class="body">
        <span class="sh-skeleton skel-line"></span>
        <span class="sh-skeleton skel-line skel-line--short"></span>
      </div>
    </div>`;
  }
  renderCard(r, t) {
    const e = Number(r.id), s = r.image?.url || r.images?.find((A) => A.main)?.url || r.images?.[0]?.url || "", a = G(r), o = !!(r.is_on_sale && a.original), l = this.bool("show_add_to_cart", !0), n = l && r.is_available !== !1 && !r.is_out_of_stock && !r.has_options && !(Array.isArray(r.options) && r.options.length), h = this.addedIds.has(e), S = r.discount_percentage ? String(r.discount_percentage) : this.t("sale");
    return c`<article class=${y({ card: !0, [`card--${t}`]: !0 })} part="card">
      <a class="media" href=${r.url || "#"} tabindex="-1" aria-hidden="true">
        ${s ? c`<img part="image" src=${s} alt=${r.image?.alt || r.name || ""} loading="lazy" decoding="async" />` : u}
        ${this.bool("show_sale_badge", !0) && o ? c`<span class="badge">${S}</span>` : u}
      </a>
      <div class="body">
        <h4 class="name" part="name"><a href=${r.url || "#"}>${r.name ?? ""}</a></h4>
        ${this.bool("show_price", !0) ? c`<div class="price" part="price">
              <span class="now">${E(a.current)}</span>
              ${a.original ? c`<s class="was">${E(a.original)}</s>` : u}
            </div>` : u}
        ${l ? n ? c`<button
                class=${y({ "sh-btn": !0, "sh-btn--ghost": !h, add: !0, "add--added": h })}
                part="add"
                type="button"
                aria-label=${this.t("add_to_cart_label", { name: r.name ?? "" })}
                @click=${() => this.add(r)}
              >
                ${h ? Z() : rr()} ${h ? this.t("added") : this.text("add_text", "add")}
              </button>` : c`<a class="sh-btn sh-btn--ghost add" part="add" href=${r.url || "#"}>${this.t("view")} ${P()}</a>` : u}
      </div>
    </article>`;
  }
};
C.styles = [K, sr];
let m = C;
v([
  $({ type: String })
], m.prototype, "layout");
v([
  $({ type: Number })
], m.prototype, "limit");
v([
  _()
], m.prototype, "products");
v([
  _()
], m.prototype, "addedIds");
v([
  R(".list--slider")
], m.prototype, "sliderEl");
typeof m < "u" && m.registerSallaComponent("salla-recently-viewed");
export {
  m as default
};
