import { LitElement as N, css as P, svg as m, html as l, nothing as f } from "lit";
import { property as T, state as w } from "lit/decorators.js";
import { classMap as L } from "lit/directives/class-map.js";
function h() {
  return window.salla ?? window.Salla;
}
let x = null;
function I(i, t) {
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
function E(i = 8e3) {
  return x || (x = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = h();
      if (s && typeof s.onReady == "function") {
        I(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? I(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
        return;
      }
      if (Date.now() - e > i) {
        t(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), x);
}
function q() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const e = h();
    try {
      t = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function D() {
  const i = h();
  if (i)
    try {
      if (i.url?.is_page?.("product.single")) {
        const t = Number(i.config.get("page.id"));
        return Number.isFinite(t) && t > 0 ? t : void 0;
      }
    } catch {
    }
}
function R() {
  const i = h();
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
function Q(i) {
  if (!i || typeof i != "object") return;
  const t = i;
  return t.cart && typeof t.cart == "object" ? t.cart : t;
}
async function O() {
  const i = h();
  if (!i?.cart?.api?.latest) return;
  const t = await i.cart.api.latest();
  return Q(t?.data);
}
function B(i) {
  const t = h();
  if (!t?.event?.on) return () => {
  };
  const e = (r) => {
    const s = Q(r);
    s && i(s);
  };
  return t.event.on("cart::updated", e), () => {
    try {
      t.event.off?.("cart::updated", e);
    } catch {
    }
  };
}
function M(i, t) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const e = i, r = [e[t], e.ar, e.en, ...Object.values(e)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function F(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (e, r) => r in t ? String(t[r]) : e
  ) : i;
}
function H(i, t) {
  const e = h();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(i)) return;
  const s = {};
  for (const [a, n] of Object.entries(t)) s[`shohrah.${i}.${a}`] = { ar: n.ar, en: n.en };
  try {
    e.lang.addBulk(s), r.add(i);
  } catch {
  }
}
function V(i, t, e, r, s) {
  const a = `shohrah.${i}.${t}`, n = h();
  let c;
  if (n?.lang?.get && n.lang.translationsLoaded)
    try {
      const o = n.lang.get(a);
      typeof o == "string" && o && o !== a && (c = o);
    } catch {
      c = void 0;
    }
  if (!c) {
    const o = e[t];
    c = o ? (r === "ar" ? o.ar : o.en) || o.en || o.ar : t;
  }
  return F(c, s);
}
function C(i) {
  if (i == null || i === "") return "";
  const t = h();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(i));
  } catch {
  }
  return String(i);
}
function W(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
var Y = Object.defineProperty, _ = (i, t, e, r) => {
  for (var s = void 0, a = i.length - 1, n; a >= 0; a--)
    (n = i[a]) && (s = n(t, e, s) || s);
  return s && Y(t, e, s), s;
};
class g extends N {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = q();
    const t = new MutationObserver(() => {
      const e = q();
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
    if (this.salla = await E(), !!this.isConnected) {
      this.locale = q(), H(this.ns, this.messages), this.applyThemeFallbacks();
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
      const a = M(r, this.locale);
      return a.trim() ? a : e;
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
    const a = this.raw(t), n = typeof a == "number" ? a : Number(String(a ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && a != null && a !== "" ? W(n, r, s) : e;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, e, r) {
    let s = this.raw(t);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const a = s == null ? "" : String(s).trim();
    return e.includes(a) ? a : r;
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
      const n = M(s, this.locale);
      return n.trim() ? n : r;
    }
    const a = String(s);
    return a.trim() ? a : r;
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
      const { primary: r, onPrimary: s } = R();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, a] = [0, 2, 4].map((o) => parseInt(e.slice(o, o + 2), 16) / 255), n = (o) => o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
    return 0.2126 * n(r) + 0.7152 * n(s) + 0.0722 * n(a) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
_([
  T({ type: Object })
], g.prototype, "config");
_([
  w()
], g.prototype, "locale");
_([
  T({ type: String, reflect: !0, attribute: "data-phase" })
], g.prototype, "phase");
_([
  w()
], g.prototype, "errorMessage");
const G = P`
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
`, k = (i, t = !1, e = "") => m`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, U = () => k(m`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), j = () => k(m`<path d="M5 12.5l4.5 4.5L19 7"/>`), X = () => k(
  m`<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.25"/><circle cx="17" cy="20" r="1.25"/>`
), J = () => k(m`<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.25"/>`), K = {
  title: { ar: "اشترِ أكثر، وفّر أكثر", en: "Buy more, save more" },
  subtitle: { ar: "خصومات تلقائية كلما زادت الكمية في سلتك", en: "Automatic discounts as your quantity grows" },
  region_label: { ar: "خصومات الكمية", en: "Quantity discounts" },
  progress: { ar: "أضف {n} للحصول على {discount}", en: "Add {n} more to get {discount}" },
  reached: { ar: "وصلت لأعلى خصم متاح 🎉", en: "You’ve unlocked the top discount 🎉" },
  current: { ar: "فئتك الحالية", en: "Your current tier" },
  in_cart: { ar: "{n} في السلة", en: "{n} in cart" },
  note: { ar: "تُطبّق الخصومات تلقائيًا في السلة عند بلوغ الكمية", en: "Discounts apply automatically in the cart once the quantity is reached" },
  cta: { ar: "تسوّق الآن", en: "Shop now" },
  empty: { ar: "أضف فئة خصم واحدة على الأقل من إعدادات العنصر.", en: "Add at least one discount tier from the component settings." },
  default_1_qty: { ar: "قطعتان", en: "2 items" },
  default_1_disc: { ar: "خصم ١٠٪", en: "10% off" },
  default_1_note: { ar: "على كل قطعة", en: "on every item" },
  default_2_qty: { ar: "٣ قطع", en: "3 items" },
  default_2_disc: { ar: "خصم ١٥٪", en: "15% off" },
  default_2_note: { ar: "الأكثر طلبًا", en: "Most popular" },
  default_3_qty: { ar: "٥ قطع فأكثر", en: "5+ items" },
  default_3_disc: { ar: "خصم ٢٥٪", en: "25% off" },
  default_3_note: { ar: "أفضل قيمة", en: "Best value" }
}, Z = P`
  :host {
    --vd-accent: var(--sh-primary);
    --vd-on-accent: var(--sh-on-primary);
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1.375rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--center .sh-header,
  .root--center .note,
  .root--center .progress {
    text-align: center;
    align-items: center;
  }
  .sh-header {
    margin: 0;
  }
  .list {
    display: grid;
    gap: 0.625rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tier {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
    transition: border-color var(--sh-ease), background-color var(--sh-ease), box-shadow var(--sh-ease), transform var(--sh-ease);
  }
  .tier--hl {
    background: color-mix(in srgb, var(--vd-accent) 8%, var(--sh-surface));
    border-color: color-mix(in srgb, var(--vd-accent) 45%, var(--sh-border));
    box-shadow: var(--sh-shadow);
  }
  .tier--hl .qty {
    color: var(--vd-accent);
  }
  .tier--reached {
    border-color: var(--vd-accent);
  }
  .tier--reached::before {
    content: '';
    position: absolute;
    inset-block: 0.5rem;
    inset-inline-start: -1px;
    width: 3px;
    border-radius: 2px;
    background: var(--vd-accent);
  }
  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  .qty {
    font-weight: 700;
    font-size: 0.98rem;
    line-height: 1.4;
  }
  .sub {
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .pill {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    border-radius: var(--sh-radius-pill);
    background: var(--vd-accent);
    color: var(--vd-on-accent);
    font-weight: 700;
    font-size: 0.85rem;
    white-space: nowrap;
  }
  .pill svg {
    width: 0.95rem;
    height: 0.95rem;
  }
  .tier--reached .pill {
    background: var(--sh-success);
    color: #fff;
  }

  /* cards: horizontal row of equal cards */
  .list--cards {
    grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  }
  .list--cards .tier {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.5rem;
    padding: 1rem 0.875rem;
  }
  .list--cards .cell {
    align-items: center;
    order: 2;
  }
  .list--cards .pill {
    order: 1;
    justify-content: center;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }
  .list--cards .tier--reached::before {
    inset-inline: 0.5rem;
    inset-block: auto 0;
    width: auto;
    height: 3px;
  }

  /* steps: connected ladder */
  .list--steps {
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    gap: 0;
    position: relative;
  }
  .list--steps::before {
    content: '';
    position: absolute;
    inset-inline: 10%;
    top: 1.125rem;
    height: 2px;
    background: var(--sh-border);
  }
  .list--steps .tier {
    background: transparent;
    border: 0;
    box-shadow: none;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
  .list--steps .tier::before {
    display: none;
  }
  .list--steps .dot {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--sh-surface);
    border: 2px solid var(--sh-border);
    color: var(--sh-muted);
    font-weight: 700;
    font-size: 0.85rem;
    position: relative;
    z-index: 1;
    transition: background-color var(--sh-ease), border-color var(--sh-ease), color var(--sh-ease);
  }
  .list--steps .tier--hl .dot,
  .list--steps .tier--reached .dot {
    background: var(--vd-accent);
    border-color: var(--vd-accent);
    color: var(--vd-on-accent);
  }
  .list--steps .tier--reached .dot {
    background: var(--sh-success);
    border-color: var(--sh-success);
  }
  .list--steps .pill {
    background: transparent;
    color: var(--vd-accent);
    padding: 0;
    font-size: 1.05rem;
  }
  .list--steps .cell {
    align-items: center;
  }
  .dot {
    display: none;
  }
  .progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0.625rem 0.875rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--vd-accent) 7%, var(--sh-surface));
    font-size: 0.9rem;
    font-weight: 600;
  }
  .progress svg {
    color: var(--vd-accent);
    flex: none;
  }
  .progress strong {
    color: var(--vd-accent);
  }
  .progress--done {
    background: color-mix(in srgb, var(--sh-success) 10%, var(--sh-surface));
  }
  .progress--done svg {
    color: var(--sh-success);
  }
  .note {
    margin: 0;
    font-size: 0.82rem;
    color: var(--sh-muted);
  }
  .cta {
    display: flex;
    justify-content: center;
  }
`;
var tt = Object.defineProperty, z = (i, t, e, r) => {
  for (var s = void 0, a = i.length - 1, n; a >= 0; a--)
    (n = i[a]) && (s = n(t, e, s) || s);
  return s && tt(t, e, s), s;
};
const et = ["list", "cards", "steps"], rt = ["none", "last", "middle"], st = ["start", "center"], A = class A extends g {
  constructor() {
    super(...arguments), this.ns = "volume-discount-ladder", this.messages = K, this.cartQty = 0, this.tracking = !1, this.lastReached = -2;
  }
  get tiers() {
    const t = this.list("tiers");
    return (t.length > 0 ? t.map((r) => ({
      minQty: Math.max(1, Math.round(Number(r.min_qty ?? 1)) || 1),
      qtyLabel: this.rowText(r, "qty_label"),
      discountLabel: this.rowText(r, "discount_label"),
      note: this.rowText(r, "note")
    })) : [
      { minQty: 2, qtyLabel: this.t("default_1_qty"), discountLabel: this.t("default_1_disc"), note: this.t("default_1_note") },
      { minQty: 3, qtyLabel: this.t("default_2_qty"), discountLabel: this.t("default_2_disc"), note: this.t("default_2_note") },
      { minQty: 5, qtyLabel: this.t("default_3_qty"), discountLabel: this.t("default_3_disc"), note: this.t("default_3_note") }
    ]).filter((r) => r.qtyLabel || r.discountLabel).sort((r, s) => r.minQty - s.minQty);
  }
  async onSallaReady() {
    if (this.phase = "ready", !!this.bool("track_cart", !0)) {
      this.addDisposer(B((t) => this.applyCart(t)));
      try {
        const t = await O();
        this.applyCart(t);
      } catch {
        this.tracking = !1;
      }
    }
  }
  applyCart(t) {
    if (!t) {
      this.tracking = !1;
      return;
    }
    const e = D();
    let r = Number(t.count ?? 0) || 0;
    e && Array.isArray(t.items) && (r = t.items.filter((s) => Number(s.product_id) === e).reduce((s, a) => s + (Number(a.quantity) || 0), 0)), this.cartQty = r, this.tracking = !0;
  }
  get effectiveQty() {
    return this.quantity != null ? this.quantity : this.tracking ? this.cartQty : void 0;
  }
  updated() {
    const t = this.tiers, e = this.effectiveQty;
    if (e === void 0) return;
    const r = this.reachedIndex(t, e);
    r !== this.lastReached && (this.lastReached = r, this.emit("tier-change", { quantity: e, reachedIndex: r, nextIndex: r + 1 < t.length ? r + 1 : -1 }));
  }
  reachedIndex(t, e) {
    let r = -1;
    return t.forEach((s, a) => {
      e >= s.minQty && (r = a);
    }), r;
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const t = this.tiers;
    if (t.length === 0) return l`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const e = this.choice("style", et, "list"), r = this.choice("highlight", rt, "last"), s = this.choice("align", st, "start"), a = this.bool("show_note", !0), n = this.bool("show_cta", !1), c = this.link("cta_link"), o = this.str("subtitle"), b = this.bool("use_theme_color", !0) ? "" : (() => {
      const v = this.color("accent_color", "#1f5c5a");
      return `--vd-accent:${v};--vd-on-accent:${this.readableOn(v)}`;
    })(), d = this.effectiveQty, p = d === void 0 ? -1 : this.reachedIndex(t, d), $ = d === void 0 ? -1 : p + 1 < t.length ? p + 1 : -1;
    let S = -1;
    return d === void 0 || p === -1 && $ <= 0 ? S = r === "last" ? t.length - 1 : r === "middle" ? Math.floor((t.length - 1) / 2) : -1 : S = $, l`
      <section class=${L({ root: !0, "root--center": s === "center" })} style=${b} part="root" aria-label=${this.t("region_label")}>
        <div class="sh-header">
          <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
          ${o ? l`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${o}</p></slot>` : f}
        </div>

        <ol class=${L({ list: !0, [`list--${e}`]: !0 })} role="list">
          ${t.map((v, y) => this.renderTier(v, y, y === S && y !== p, y <= p))}
        </ol>

        ${d !== void 0 && d > 0 ? this.renderProgress(t, d, p, $) : f}

        ${a ? l`<slot name="note"><p class="note" part="note">${this.text("note", "note")}</p></slot>` : f}
        ${n && c ? l`<div class="cta" part="cta">
              <slot name="cta"><a class="sh-btn sh-btn--primary" href=${c} @click=${() => this.emit("cta-click", { href: c })}>${this.text("cta_text", "cta")} ${U()}</a></slot>
            </div>` : f}
      </section>
    `;
  }
  renderTier(t, e, r, s) {
    return l`<li class=${L({ tier: !0, "tier--hl": r, "tier--reached": s })} part="tier" aria-current=${s ? "true" : "false"}>
      <span class="dot" aria-hidden="true">${s ? j() : C(e + 1)}</span>
      <span class="cell">
        <span class="qty">${t.qtyLabel}</span>
        ${t.note ? l`<span class="sub">${t.note}</span>` : f}
      </span>
      <span class="pill" part="pill">${s ? j() : J()}${t.discountLabel}</span>
    </li>`;
  }
  renderProgress(t, e, r, s) {
    if (s === -1 && r >= 0)
      return l`<p class="progress progress--done" part="progress" role="status">${j()}<span>${this.text("reached_text", "reached")}</span></p>`;
    const a = t[s], n = Math.max(1, a.minQty - e), c = this.text("progress_text", "progress", { n: "\0", discount: a.discountLabel }), [o, b] = c.split("\0");
    return l`<p class="progress" part="progress" role="status">
      ${X()}
      <span>${b === void 0 ? c : l`${o}<strong>${C(n)}</strong>${b}`} <span class="sub">· ${this.t("in_cart", { n: C(e) })}</span></span>
    </p>`;
  }
};
A.styles = [G, Z];
let u = A;
z([
  T({ type: Number })
], u.prototype, "quantity");
z([
  w()
], u.prototype, "cartQty");
z([
  w()
], u.prototype, "tracking");
typeof u < "u" && u.registerSallaComponent("salla-volume-discount-ladder");
export {
  u as default
};
