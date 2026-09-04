import { LitElement as N, css as I, html as l, svg as O, nothing as u } from "lit";
import { property as _, state as S } from "lit/decorators.js";
import { classMap as T } from "lit/directives/class-map.js";
function h() {
  return window.salla ?? window.Salla;
}
let g = null;
function C(o, r) {
  return new Promise((t) => {
    const e = window.setTimeout(() => t(void 0), r);
    o.then(
      (s) => {
        clearTimeout(e), t(s);
      },
      () => {
        clearTimeout(e), t(void 0);
      }
    );
  });
}
function E(o = 8e3) {
  return g || (g = new Promise((r) => {
    const t = Date.now(), e = () => {
      const s = h();
      if (s && typeof s.onReady == "function") {
        C(Promise.resolve(s.onReady()), o).then(() => s.lang?.onLoaded ? C(s.lang.onLoaded(), 4e3) : void 0).then(() => r(s));
        return;
      }
      if (Date.now() - t > o) {
        r(void 0);
        return;
      }
      window.setTimeout(e, 50);
    };
    e();
  }), g);
}
function x() {
  const o = document.documentElement.getAttribute("lang");
  let r = o && o.trim();
  if (!r) {
    const t = h();
    try {
      r = t?.lang?.getLocale?.() || t?.config?.get("user.language_code");
    } catch {
      r = void 0;
    }
  }
  return (r || "ar").toLowerCase().split(/[-_]/)[0];
}
function M() {
  const o = h();
  if (o)
    try {
      if (o.url?.is_page?.("product.single")) {
        const r = Number(o.config.get("page.id"));
        return Number.isFinite(r) && r > 0 ? r : void 0;
      }
    } catch {
    }
}
function z(o) {
  const r = h();
  try {
    if (r?.url?.cdn) return r.url.cdn(o);
  } catch {
  }
  return `https://cdn.salla.network/${o.replace(/^\/+/, "")}`;
}
function D() {
  const o = h();
  if (!o) return {};
  try {
    return {
      primary: o.config.get("theme.color.primary") || void 0,
      onPrimary: o.config.get("theme.color.reverse_text") || void 0,
      isDark: !!o.config.get("theme.color.is_dark")
    };
  } catch {
    return {};
  }
}
const y = "shohrah.";
function A(o, r) {
  const t = h();
  try {
    if (t?.storage?.getWithTTL) return t.storage.getWithTTL(y + o, r, "session") ?? r;
    const e = window.sessionStorage.getItem(y + o);
    return e == null ? r : JSON.parse(e);
  } catch {
    return r;
  }
}
function R(o, r, t = 5) {
  const e = h();
  try {
    if (e?.storage?.setWithTTL) {
      e.storage.setWithTTL(y + o, r, t, "session");
      return;
    }
    window.sessionStorage.setItem(y + o, JSON.stringify(r));
  } catch {
  }
}
async function F(o, r = [], t = 5) {
  const e = h();
  if (!e?.product?.api?.getDetails) return;
  const s = `product.${o}.${r.join("+")}`, i = A(s, null);
  if (i && i.id) return i;
  const c = (await e.product.api.getDetails(o, r))?.data;
  return c && R(s, c, t), c;
}
function L(o, r) {
  if (o == null) return "";
  if (typeof o == "string") return o;
  if (typeof o == "number") return String(o);
  if (Array.isArray(o)) return "";
  const t = o, e = [t[r], t.ar, t.en, ...Object.values(t)];
  for (const s of e) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function W(o, r) {
  return r ? o.replace(
    /\{(\w+)\}/g,
    (t, e) => e in r ? String(r[e]) : t
  ) : o;
}
function V(o, r) {
  const t = h();
  if (!t?.lang?.addBulk) return;
  const e = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (e.has(o)) return;
  const s = {};
  for (const [i, n] of Object.entries(r)) s[`shohrah.${o}.${i}`] = { ar: n.ar, en: n.en };
  try {
    t.lang.addBulk(s), e.add(o);
  } catch {
  }
}
function B(o, r, t, e, s) {
  const i = `shohrah.${o}.${r}`, n = h();
  let c;
  if (n?.lang?.get && n.lang.translationsLoaded)
    try {
      const a = n.lang.get(i);
      typeof a == "string" && a && a !== i && (c = a);
    } catch {
      c = void 0;
    }
  if (!c) {
    const a = t[r];
    c = a ? (e === "ar" ? a.ar : a.en) || a.en || a.ar : r;
  }
  return W(c, s);
}
function q(o) {
  if (o == null || o === "") return "";
  const r = h();
  try {
    if (r?.helpers?.number) return String(r.helpers.number(o));
  } catch {
  }
  return String(o);
}
function P(o, r, t) {
  return Math.min(t, Math.max(r, o));
}
var X = Object.defineProperty, b = (o, r, t, e) => {
  for (var s = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (s = n(r, t, s) || s);
  return s && X(r, t, s), s;
};
class f extends N {
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
    if (this.salla = await E(), !!this.isConnected) {
      this.locale = x(), V(this.ns, this.messages), this.applyThemeFallbacks();
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
    return B(this.ns, r, this.messages, this.locale, t);
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
      const i = L(e, this.locale);
      return i.trim() ? i : t;
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
    const i = this.raw(r), n = typeof i == "number" ? i : Number(String(i ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && i != null && i !== "" ? P(n, e, s) : t;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(r, t, e) {
    let s = this.raw(r);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const i = s == null ? "" : String(s).trim();
    return t.includes(i) ? i : e;
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
      const n = L(s, this.locale);
      return n.trim() ? n : e;
    }
    const i = String(s);
    return i.trim() ? i : e;
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
    const [e, s, i] = [0, 2, 4].map((a) => parseInt(t.slice(a, a + 2), 16) / 255), n = (a) => a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
    return 0.2126 * n(e) + 0.7152 * n(s) + 0.0722 * n(i) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
b([
  _({ type: Object })
], f.prototype, "config");
b([
  S()
], f.prototype, "locale");
b([
  _({ type: String, reflect: !0, attribute: "data-phase" })
], f.prototype, "phase");
b([
  S()
], f.prototype, "errorMessage");
const U = I`
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
`, G = (o, r = !1, t = "") => O`<svg class="sh-svg ${r ? "sh-svg--fill" : ""} ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${o}</svg>`, J = () => G(
  O`<path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.2-2.1-5.2-3.4-6.6-.4 1.7-1.4 2.7-2.6 3.2.3-2.7-.6-6.2-3.6-8-.2 3.1-1.7 4.6-3 6.1C5.2 11.6 5 13.4 5 15.4 5 19.1 7.6 22 12 22z"/>`
);
function Y() {
  return l`<link rel="stylesheet" href=${z("fonts/sallaicons.css")} />`;
}
function K(o, r) {
  const t = (o || "").trim();
  return t.startsWith("sicon-") ? l`<i class="sicon ${t}" aria-hidden="true"></i>` : r ? r() : l``;
}
const H = {
  title: { ar: "الكمية محدودة", en: "Limited stock" },
  message: { ar: "بقي {qty} فقط — اطلب الآن", en: "Only {qty} left — order now" },
  sold: { ar: "تم بيع {sold} قطعة", en: "{sold} sold" },
  out_of_stock: { ar: "نفدت الكمية حاليًا", en: "Currently out of stock" },
  progress_label: { ar: "الكمية المتبقية من المنتج", en: "Remaining product quantity" },
  no_product: { ar: "ضع هذا العنصر في صفحة المنتج أو اختر منتجًا من الإعدادات.", en: "Place this component on a product page or pick a product in the settings." },
  load_error: { ar: "تعذّر تحميل بيانات المنتج.", en: "Could not load product data." }
}, Q = I`
  :host {
    --sc-color: var(--sh-primary);
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.875rem 1.125rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--inline {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
  }
  .root--inline .bar {
    flex: 1;
    min-width: 6rem;
  }
  .root--minimal {
    border: 0;
    background: transparent;
    padding: 0.25rem 0;
    border-radius: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--sc-color) 12%, transparent);
    color: var(--sc-color);
  }
  .icon svg,
  .icon .sicon {
    width: 1.1rem;
    height: 1.1rem;
    font-size: 1.1rem;
  }
  .root--pulse .icon {
    animation: sc-pulse 1.6s ease-in-out infinite;
  }
  @keyframes sc-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.45;
  }
  .title {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  .msg {
    margin: 0;
    font-weight: 700;
    font-size: 0.98rem;
    color: var(--sh-text);
  }
  .msg strong {
    color: var(--sc-color);
    font-variant-numeric: tabular-nums;
  }
  .bar {
    position: relative;
    height: 0.5rem;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-surface-2);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    width: var(--sc-percent, 0%);
    border-radius: inherit;
    background: var(--sc-color);
    transition: width 600ms cubic-bezier(0.2, 0.7, 0.2, 1), background-color var(--sh-ease);
  }
  .root--noanim .fill {
    transition: none;
  }
  .sold {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .skel-a {
    width: 60%;
    height: 1.1rem;
  }
  .skel-b {
    width: 100%;
    height: 0.5rem;
  }
`;
var Z = Object.defineProperty, j = (o, r, t, e) => {
  for (var s = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (s = n(r, t, s) || s);
  return s && Z(r, t, s), s;
};
const rr = ["theme", "traffic", "custom"], tr = ["card", "inline", "minimal"];
function er(o) {
  const r = o.is_hidden_quantity === !0 || o.can_show_remained_quantity === !1, t = o.quantity, e = !r && t != null && Number.isFinite(Number(t)) ? Number(t) : null, s = o.sold_quantity, i = o.can_show_sold !== !1 && s != null && Number.isFinite(Number(s)) ? Number(s) : null;
  return { quantity: e, sold: i, outOfStock: !!o.is_out_of_stock || e !== null && e <= 0 };
}
const $ = class $ extends f {
  constructor() {
    super(...arguments), this.ns = "stock-scarcity-bar", this.messages = H;
  }
  resolveProductId() {
    return this.productId ?? this.selectedId("product") ?? M();
  }
  async onSallaReady() {
    await this.load();
  }
  updated(r) {
    if ((r.has("config") || r.has("productId")) && this.salla) {
      const t = this.resolveProductId();
      t && t !== this.loadedFor && this.load();
    }
  }
  async load() {
    const r = this.resolveProductId();
    if (!r) {
      this.phase = "empty";
      return;
    }
    this.loadedFor = r, this.phase = "loading";
    try {
      const t = await F(r, ["sold_quantity"]);
      if (!t) throw new Error(this.t("load_error"));
      this.stock = er(t), this.phase = "ready", this.emit("stock-loaded", { productId: r, quantity: this.stock.quantity, sold: this.stock.sold, shown: this.shouldShow() });
    } catch (t) {
      this.fail(t instanceof Error ? t : new Error(this.t("load_error")));
    }
  }
  shouldShow() {
    const r = this.stock;
    return r ? r.outOfStock ? !0 : r.quantity === null ? !this.bool("hide_when_unknown", !0) : r.quantity <= this.num("threshold", 10, 1, 1e4) : !1;
  }
  render() {
    if (this.phase === "error") return l`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === "empty") return l`<div class="sh-empty" part="empty">${this.t("no_product")}</div>`;
    const r = this.choice("style", tr, "card");
    if (this.phase === "loading" || !this.stock)
      return l`<div class=${T({ root: !0, [`root--${r}`]: !0 })} part="root" aria-busy="true">
        <div class="row"><span class="sh-skeleton icon"></span><span class="sh-skeleton skel-a"></span></div>
        <div class="sh-skeleton skel-b"></div>
      </div>`;
    if (!this.shouldShow()) return u;
    const t = this.stock, e = this.choice("color_mode", rr, "traffic"), s = this.bool("show_bar", !0) && t.quantity !== null, i = this.bool("show_sold", !0) && t.sold !== null && t.sold > 0, n = this.bool("animate", !0) && !this.reducedMotion, c = this.str("icon", "sicon-fire"), a = this.num("bar_max", 50, 1, 1e5), m = t.quantity === null ? 0 : P(Math.round(t.quantity / a * 100), 4, 100);
    let p = "var(--sh-primary)";
    e === "custom" && (p = this.color("custom_color", "#c2410c")), e === "traffic" && (p = m > 60 ? "var(--sh-success)" : m > 30 ? "var(--sh-warning)" : "var(--sh-danger)"), t.outOfStock && (p = "var(--sh-muted)");
    const v = q(t.quantity ?? 0), w = t.outOfStock ? this.t("out_of_stock") : this.text("message", "message", { qty: v }), k = t.outOfStock ? [w] : w.split(v);
    return l`
      ${c.startsWith("sicon-") ? Y() : u}
      <div
        class=${T({ root: !0, [`root--${r}`]: !0, "root--pulse": n && !t.outOfStock && m <= 30, "root--noanim": !n })}
        style="--sc-color:${p}"
        part="root"
      >
        <div class="row">
          <span class="icon" part="icon" aria-hidden="true">${K(c, J)}</span>
          <div class="text">
            ${r !== "minimal" ? l`<slot name="title"><p class="title" part="title">${this.text("title", "title")}</p></slot>` : u}
            <p class="msg" part="message" role="status">
              ${k.length === 2 ? l`${k[0]}<strong>${v}</strong>${k[1]}` : w}
            </p>
          </div>
        </div>
        ${s ? l`<div
              class="bar"
              part="bar"
              role="progressbar"
              aria-label=${this.t("progress_label")}
              aria-valuemin="0"
              aria-valuemax=${a}
              aria-valuenow=${Math.min(t.quantity ?? 0, a)}
            >
              <div class="fill" part="fill" style="--sc-percent:${m}%"></div>
            </div>` : u}
        ${i ? l`<p class="sold" part="sold">${this.text("sold_message", "sold", { sold: q(t.sold ?? 0) })}</p>` : u}
      </div>
    `;
  }
};
$.styles = [U, Q];
let d = $;
j([
  _({ type: Number, attribute: "product-id" })
], d.prototype, "productId");
j([
  S()
], d.prototype, "stock");
typeof d < "u" && d.registerSallaComponent("salla-stock-scarcity-bar");
export {
  d as default
};
