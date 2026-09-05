import { LitElement as I, css as E, html as c, svg as b, nothing as l } from "lit";
import { property as _, state as m } from "lit/decorators.js";
import { classMap as f } from "lit/directives/class-map.js";
function p() {
  return window.salla ?? window.Salla;
}
let g = null;
function L(s, e) {
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
function O(s = 8e3) {
  return g || (g = new Promise((e) => {
    const t = Date.now(), r = () => {
      const i = p();
      if (i && typeof i.onReady == "function") {
        L(Promise.resolve(i.onReady()), s).then(() => i.lang?.onLoaded ? L(i.lang.onLoaded(), 4e3) : void 0).then(() => e(i));
        return;
      }
      if (Date.now() - t > s) {
        e(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), g);
}
function $() {
  const s = document.documentElement.getAttribute("lang");
  let e = s && s.trim();
  if (!e) {
    const t = p();
    try {
      e = t?.lang?.getLocale?.() || t?.config?.get("user.language_code");
    } catch {
      e = void 0;
    }
  }
  return (e || "ar").toLowerCase().split(/[-_]/)[0];
}
function N(s) {
  const e = p();
  try {
    if (e?.url?.cdn) return e.url.cdn(s);
  } catch {
  }
  return `https://cdn.salla.network/${s.replace(/^\/+/, "")}`;
}
function R() {
  const s = p();
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
function j(s, e) {
  if (s == null) return "";
  if (typeof s == "string") return s;
  if (typeof s == "number") return String(s);
  if (Array.isArray(s)) return "";
  const t = s, r = [t[e], t.ar, t.en, ...Object.values(t)];
  for (const i of r) if (typeof i == "string" && i.trim()) return i;
  return "";
}
function W(s, e) {
  return e ? s.replace(
    /\{(\w+)\}/g,
    (t, r) => r in e ? String(e[r]) : t
  ) : s;
}
function F(s, e) {
  const t = p();
  if (!t?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(s)) return;
  const i = {};
  for (const [o, a] of Object.entries(e)) i[`shohrah.${s}.${o}`] = { ar: a.ar, en: a.en };
  try {
    t.lang.addBulk(i), r.add(s);
  } catch {
  }
}
function B(s, e, t, r, i) {
  const o = `shohrah.${s}.${e}`, a = p();
  let h;
  if (a?.lang?.get && a.lang.translationsLoaded)
    try {
      const n = a.lang.get(o);
      typeof n == "string" && n && n !== o && (h = n);
    } catch {
      h = void 0;
    }
  if (!h) {
    const n = t[e];
    h = n ? (r === "ar" ? n.ar : n.en) || n.en || n.ar : e;
  }
  return W(h, i);
}
function V(s) {
  if (s == null || s === "") return "";
  const e = p();
  try {
    if (e?.helpers?.number) return String(e.helpers.number(s));
  } catch {
  }
  return String(s);
}
function U(s, e, t) {
  return Math.min(t, Math.max(e, s));
}
var X = Object.defineProperty, v = (s, e, t, r) => {
  for (var i = void 0, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (i = a(e, t, i) || i);
  return i && X(e, t, i), i;
};
class y extends I {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = $();
    const e = new MutationObserver(() => {
      const t = $();
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
    if (this.salla = await O(), !!this.isConnected) {
      this.locale = $(), F(this.ns, this.messages), this.applyThemeFallbacks();
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
    return B(this.ns, e, this.messages, this.locale, t);
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
      const o = j(r, this.locale);
      return o.trim() ? o : t;
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
    const o = this.raw(e), a = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(a) && o != null && o !== "" ? U(a, r, i) : t;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(e, t, r) {
    let i = this.raw(e);
    Array.isArray(i) && (i = i[0]), i && typeof i == "object" && (i = i.value ?? i.key);
    const o = i == null ? "" : String(i).trim();
    return t.includes(o) ? o : r;
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
      const a = j(i, this.locale);
      return a.trim() ? a : r;
    }
    const o = String(i);
    return o.trim() ? o : r;
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
      const { primary: r, onPrimary: i } = R();
      r && this.style.setProperty("--shohrah-primary", r), i && this.style.setProperty("--shohrah-on-primary", i);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(e) {
    const t = e.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(t)) return "#ffffff";
    const [r, i, o] = [0, 2, 4].map((n) => parseInt(t.slice(n, n + 2), 16) / 255), a = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * a(r) + 0.7152 * a(i) + 0.0722 * a(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
v([
  _({ type: Object })
], y.prototype, "config");
v([
  m()
], y.prototype, "locale");
v([
  _({ type: String, reflect: !0, attribute: "data-phase" })
], y.prototype, "phase");
v([
  m()
], y.prototype, "errorMessage");
const Y = E`
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
`, C = (s, e = !1, t = "") => b`<svg class="sh-svg ${e ? "sh-svg--fill" : ""} ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${s}</svg>`, S = () => C(b`<path d="M5 12.5l4.5 4.5L19 7"/>`), q = () => C(b`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`), G = () => C(b`<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.25"/>`);
function H() {
  return c`<link rel="stylesheet" href=${N("fonts/sallaicons.css")} />`;
}
function J(s, e) {
  const t = (s || "").trim();
  return t.startsWith("sicon-") ? c`<i class="sicon ${t}" aria-hidden="true"></i>` : e ? e() : c``;
}
const K = {
  title: { ar: "خصم ١٠٪ على طلبك الأول", en: "10% off your first order" },
  description: { ar: "انسخ الكود واستخدمه عند الدفع", en: "Copy the code and use it at checkout" },
  copy: { ar: "نسخ", en: "Copy" },
  copied: { ar: "تم النسخ", en: "Copied" },
  apply: { ar: "تطبيق على السلة", en: "Apply to cart" },
  applying: { ar: "جارٍ التطبيق…", en: "Applying…" },
  applied: { ar: "تم تطبيق الكود", en: "Code applied" },
  apply_failed: { ar: "لم يتم تطبيق الكود، تأكد من وجود منتجات في السلة", en: "Could not apply the code. Make sure your cart has items" },
  code_label: { ar: "كود الخصم", en: "Discount code" },
  copy_aria: { ar: "نسخ كود الخصم {code}", en: "Copy discount code {code}" },
  expires: { ar: "ينتهي في {date}", en: "Expires {date}" },
  expires_in: { ar: "متبقٍ {n} يوم", en: "{n} days left" },
  expired: { ar: "انتهت صلاحية هذا الكود", en: "This code has expired" },
  missing_code: { ar: "أضف كود الخصم من إعدادات العنصر.", en: "Add a discount code in the component settings." }
}, Q = E`
  :host {
    --cc-accent: var(--sh-primary);
    --cc-on-accent: var(--sh-on-primary);
    --cc-max: 480px;
  }
  .root {
    position: relative;
    display: flex;
    gap: 1rem;
    max-width: var(--cc-max);
    padding: 1.125rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
    overflow: hidden;
  }
  .root--ticket {
    border: 2px solid color-mix(in srgb, var(--cc-accent) 40%, var(--sh-border));
  }
  .root--ticket::before,
  .root--ticket::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--sh-surface-2, #f7f7f6);
    border: 2px solid color-mix(in srgb, var(--cc-accent) 40%, var(--sh-border));
    transform: translateY(-50%);
  }
  .root--ticket::before {
    inset-inline-start: -0.75rem;
  }
  .root--ticket::after {
    inset-inline-end: -0.75rem;
  }
  .root--inline {
    align-items: center;
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  .root--inline .body {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }
  .root--inline .desc,
  .root--inline .conditions,
  .root--inline .expiry {
    display: none;
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--cc-accent) 12%, transparent);
    color: var(--cc-accent);
  }
  .icon svg,
  .icon .sicon {
    width: 1.35rem;
    height: 1.35rem;
    font-size: 1.35rem;
  }
  .root--inline .icon {
    width: 2.25rem;
    height: 2.25rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }
  .title {
    margin: 0;
    font-weight: 700;
    font-size: 1.05rem;
    line-height: 1.45;
  }
  .desc {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.9rem;
  }
  .code-row {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .code {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--sh-radius-sm);
    border: 2px solid var(--cc-accent);
    color: var(--cc-accent);
    background: color-mix(in srgb, var(--cc-accent) 6%, transparent);
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    direction: ltr;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    user-select: all;
    transition: background-color var(--sh-ease), border-color var(--sh-ease);
  }
  .code--dashed {
    border-style: dashed;
  }
  .code:hover {
    background: color-mix(in srgb, var(--cc-accent) 12%, transparent);
  }
  .code--copied {
    border-color: var(--sh-success);
    color: var(--sh-success);
    background: color-mix(in srgb, var(--sh-success) 8%, transparent);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .btn {
    min-height: 2.6rem;
    font-size: 0.9rem;
    padding-inline: 1rem;
  }
  .btn--copied,
  .btn--applied {
    background: var(--sh-success) !important;
    border-color: transparent !important;
    color: #fff !important;
  }
  .btn--failed {
    background: var(--sh-danger) !important;
    border-color: transparent !important;
    color: #fff !important;
  }
  .conditions {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .expiry {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-warning);
    font-weight: 600;
  }
  .expiry svg {
    width: 0.95rem;
    height: 0.95rem;
  }
  .feedback {
    margin: 0;
    font-size: 0.82rem;
    color: var(--sh-danger);
  }
  .expired {
    margin: 0;
    font-weight: 600;
    color: var(--sh-muted);
  }
  .spinner {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    animation: cc-spin 0.8s linear infinite;
  }
  @keyframes cc-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
var Z = Object.defineProperty, x = (s, e, t, r) => {
  for (var i = void 0, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (i = a(e, t, i) || i);
  return i && Z(e, t, i), i;
};
const ee = ["copy", "apply", "both"], te = ["ticket", "card", "inline"], re = ["hide", "message"];
async function ie(s) {
  try {
    if (navigator.clipboard?.writeText)
      return await navigator.clipboard.writeText(s), !0;
  } catch {
  }
  try {
    const e = document.createElement("textarea");
    e.value = s, e.setAttribute("readonly", ""), e.style.position = "fixed", e.style.opacity = "0", document.body.appendChild(e), e.select();
    const t = document.execCommand("copy");
    return e.remove(), t;
  } catch {
    return !1;
  }
}
const A = class A extends y {
  constructor() {
    super(...arguments), this.ns = "coupon-code-card", this.messages = K, this.copyState = "idle", this.applyState = "idle", this.failMessage = "";
  }
  get effectiveCode() {
    return (this.code || this.str("code", "")).trim();
  }
  get expiresAt() {
    if (!this.bool("show_expiry", !1)) return;
    const e = Date.parse(this.str("expires_at", ""));
    return Number.isFinite(e) ? e : void 0;
  }
  onSallaReady() {
    this.phase = this.effectiveCode ? "ready" : "empty", this.every(6e4, () => this.requestUpdate());
  }
  async copy() {
    const e = this.effectiveCode;
    await ie(e) && (this.copyState = "copied", this.emit("coupon-copied", { code: e }), this.delay(2200, () => {
      this.copyState = "idle";
    }));
  }
  async apply() {
    if (this.applyState === "applying") return;
    const e = this.effectiveCode, t = p();
    if (!t?.cart?.addCoupon) {
      this.applyState = "failed", this.failMessage = this.t("apply_failed");
      return;
    }
    this.applyState = "applying", this.failMessage = "";
    try {
      await t.cart.addCoupon(e), this.applyState = "applied", this.emit("coupon-applied", { code: e });
    } catch (r) {
      const o = r?.response?.data?.error?.message || this.t("apply_failed");
      this.applyState = "failed", this.failMessage = o, this.emit("coupon-failed", { code: e, message: o });
    }
    this.delay(3e3, () => {
      this.applyState !== "applying" && (this.applyState = "idle");
    });
  }
  formatExpiry(e) {
    try {
      return new Intl.DateTimeFormat(this.locale === "ar" ? "ar-SA-u-ca-gregory-nu-arab" : "en-GB", { day: "numeric", month: "long" }).format(new Date(e));
    } catch {
      return new Date(e).toLocaleDateString();
    }
  }
  render() {
    if (this.phase === "error") return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === "empty" || !this.effectiveCode) return c`<div class="sh-empty" part="empty">${this.t("missing_code")}</div>`;
    if (this.phase === "loading") return l;
    const e = this.effectiveCode, t = this.choice("style", te, "ticket"), r = this.choice("action", ee, "both"), i = this.choice("expired_behavior", re, "hide"), o = this.bool("dashed", !0), a = this.bool("show_icon", !0), h = this.str("icon", "");
    let w = `--cc-max:${this.num("max_width", 480, 280, 1200)}px`;
    if (!this.bool("use_theme_color", !0)) {
      const z = this.color("accent_color", "#1f5c5a");
      w += `;--cc-accent:${z};--cc-on-accent:${this.readableOn(z)}`;
    }
    const u = this.expiresAt;
    if (u !== void 0 && u < Date.now())
      return i === "hide" ? l : c`<div class=${f({ root: !0, [`root--${t}`]: !0 })} style=${w} part="root">
        <p class="expired" role="status">${this.text("expired_text", "expired")}</p>
      </div>`;
    const k = u !== void 0 ? Math.max(0, Math.ceil((u - Date.now()) / 864e5)) : void 0, M = r === "copy" || r === "both", P = r === "apply" || r === "both", T = this.str("conditions"), D = this.str("description");
    return c`
      ${h.startsWith("sicon-") ? H() : l}
      <div class=${f({ root: !0, [`root--${t}`]: !0 })} style=${w} part="root">
        ${a ? c`<span class="icon" part="icon" aria-hidden="true">${J(h, G)}</span>` : l}
        <div class="body">
          <slot name="title"><p class="title" part="title">${this.text("title", "title")}</p></slot>
          ${D ? c`<slot name="description"><p class="desc" part="description">${D}</p></slot>` : l}

          <div class="code-row">
            <button
              class=${f({ code: !0, "code--dashed": o, "code--copied": this.copyState === "copied" })}
              part="code"
              type="button"
              aria-label=${this.t("copy_aria", { code: e })}
              @click=${M ? this.copy : l}
            >
              ${this.copyState === "copied" ? S() : l}<span>${e}</span>
            </button>
            <div class="actions">
              ${M ? c`<button
                    class=${f({ "sh-btn": !0, "sh-btn--ghost": this.copyState !== "copied", btn: !0, "btn--copied": this.copyState === "copied" })}
                    part="copy"
                    type="button"
                    @click=${this.copy}
                  >
                    ${this.copyState === "copied" ? c`${S()} ${this.text("copied_text", "copied")}` : this.text("copy_text", "copy")}
                  </button>` : l}
              ${P ? c`<button
                    class=${f({ "sh-btn": !0, "sh-btn--primary": !0, btn: !0, [`btn--${this.applyState}`]: this.applyState !== "idle" && this.applyState !== "applying" })}
                    part="apply"
                    type="button"
                    ?disabled=${this.applyState === "applying"}
                    @click=${this.apply}
                  >
                    ${this.applyState === "applying" ? c`<span class="spinner" aria-hidden="true"></span> ${this.t("applying")}` : this.applyState === "applied" ? c`${S()} ${this.text("applied_text", "applied")}` : this.text("apply_text", "apply")}
                  </button>` : l}
            </div>
          </div>

          ${this.applyState === "failed" && this.failMessage ? c`<p class="feedback" role="alert">${this.failMessage}</p>` : l}
          ${T ? c`<slot name="conditions"><p class="conditions" part="conditions">${T}</p></slot>` : l}
          ${u !== void 0 ? c`<p class="expiry" part="expiry">
                ${q()}
                <span>${this.t("expires", { date: this.formatExpiry(u) })}${k !== void 0 && k <= 14 ? ` · ${this.t("expires_in", { n: V(k) })}` : ""}</span>
              </p>` : l}
        </div>
      </div>
    `;
  }
};
A.styles = [Y, Q];
let d = A;
x([
  _({ type: String })
], d.prototype, "code");
x([
  m()
], d.prototype, "copyState");
x([
  m()
], d.prototype, "applyState");
x([
  m()
], d.prototype, "failMessage");
typeof d < "u" && d.registerSallaComponent("salla-coupon-code-card");
export {
  d as default
};
