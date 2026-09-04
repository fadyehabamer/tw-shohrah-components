import { LitElement as N, css as M, html as c, svg as v, nothing as u } from "lit";
import { property as y, state as w } from "lit/decorators.js";
import { classMap as j } from "lit/directives/class-map.js";
function l() {
  return window.salla ?? window.Salla;
}
let g = null;
function A(a, r) {
  return new Promise((e) => {
    const s = window.setTimeout(() => e(void 0), r);
    a.then(
      (t) => {
        clearTimeout(s), e(t);
      },
      () => {
        clearTimeout(s), e(void 0);
      }
    );
  });
}
function P(a = 8e3) {
  return g || (g = new Promise((r) => {
    const e = Date.now(), s = () => {
      const t = l();
      if (t && typeof t.onReady == "function") {
        A(Promise.resolve(t.onReady()), a).then(() => t.lang?.onLoaded ? A(t.lang.onLoaded(), 4e3) : void 0).then(() => r(t));
        return;
      }
      if (Date.now() - e > a) {
        r(void 0);
        return;
      }
      window.setTimeout(s, 50);
    };
    s();
  }), g);
}
function b() {
  const a = document.documentElement.getAttribute("lang");
  let r = a && a.trim();
  if (!r) {
    const e = l();
    try {
      r = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      r = void 0;
    }
  }
  return (r || "ar").toLowerCase().split(/[-_]/)[0];
}
function D(a = "") {
  const r = l();
  try {
    if (r?.url?.get) return r.url.get(a);
  } catch {
  }
  return `/${a.replace(/^\/+/, "")}`;
}
function E(a) {
  const r = l();
  try {
    if (r?.url?.cdn) return r.url.cdn(a);
  } catch {
  }
  return `https://cdn.salla.network/${a.replace(/^\/+/, "")}`;
}
function R() {
  const a = l();
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
function z(a) {
  if (!a || typeof a != "object") return;
  const r = a;
  return r.cart && typeof r.cart == "object" ? r.cart : r;
}
async function I() {
  const a = l();
  if (!a?.cart?.api?.latest) return;
  const r = await a.cart.api.latest();
  return z(r?.data);
}
function F(a) {
  const r = l();
  if (!r?.event?.on) return () => {
  };
  const e = (s) => {
    const t = z(s);
    t && a(t);
  };
  return r.event.on("cart::updated", e), () => {
    try {
      r.event.off?.("cart::updated", e);
    } catch {
    }
  };
}
function T(a, r) {
  if (a == null) return "";
  if (typeof a == "string") return a;
  if (typeof a == "number") return String(a);
  if (Array.isArray(a)) return "";
  const e = a, s = [e[r], e.ar, e.en, ...Object.values(e)];
  for (const t of s) if (typeof t == "string" && t.trim()) return t;
  return "";
}
function O(a, r) {
  return r ? a.replace(
    /\{(\w+)\}/g,
    (e, s) => s in r ? String(r[s]) : e
  ) : a;
}
function U(a, r) {
  const e = l();
  if (!e?.lang?.addBulk) return;
  const s = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (s.has(a)) return;
  const t = {};
  for (const [o, i] of Object.entries(r)) t[`shohrah.${a}.${o}`] = { ar: i.ar, en: i.en };
  try {
    e.lang.addBulk(t), s.add(a);
  } catch {
  }
}
function V(a, r, e, s, t) {
  const o = `shohrah.${a}.${r}`, i = l();
  let n;
  if (i?.lang?.get && i.lang.translationsLoaded)
    try {
      const h = i.lang.get(o);
      typeof h == "string" && h && h !== o && (n = h);
    } catch {
      n = void 0;
    }
  if (!n) {
    const h = e[r];
    n = h ? (s === "ar" ? h.ar : h.en) || h.en || h.ar : r;
  }
  return O(n, t);
}
function f(a, r) {
  if (a == null || a === "") return "";
  const e = l();
  try {
    if (e?.money) return e.money(r ? { amount: Number(a), currency: r } : a);
  } catch {
  }
  const s = Number(a);
  if (!Number.isFinite(s)) return String(a);
  try {
    return new Intl.NumberFormat(b() === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: r || "SAR",
      maximumFractionDigits: 2
    }).format(s);
  } catch {
    return `${s.toFixed(2)} SAR`;
  }
}
function L(a, r, e) {
  return Math.min(e, Math.max(r, a));
}
var W = Object.defineProperty, x = (a, r, e, s) => {
  for (var t = void 0, o = a.length - 1, i; o >= 0; o--)
    (i = a[o]) && (t = i(r, e, t) || t);
  return t && W(r, e, t), t;
};
class p extends N {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = b();
    const r = new MutationObserver(() => {
      const e = b();
      e !== this.locale && (this.locale = e, this.onLocaleChange());
    });
    r.observe(document.documentElement, { attributes: !0, attributeFilter: ["lang", "dir"] }), this.addDisposer(() => r.disconnect()), this.booted ? this.onSallaReady() : (this.booted = !0, this.boot());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const r = this.disposers.splice(0);
    for (const e of r)
      try {
        e();
      } catch {
      }
  }
  async boot() {
    if (this.salla = await P(), !!this.isConnected) {
      this.locale = b(), U(this.ns, this.messages), this.applyThemeFallbacks();
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
    const e = r instanceof Error ? r.message : String(r ?? "error");
    this.errorMessage = e, this.phase = "error";
    try {
      this.salla?.log?.(`[shohrah:${this.ns}]`, r);
    } catch {
    }
    this.emit("error", { message: e });
  }
  /* ------------------------------------------------------------- cleanup helpers */
  addDisposer(r) {
    this.disposers.push(r);
  }
  listen(r, e, s, t) {
    r.addEventListener(e, s, t), this.addDisposer(() => r.removeEventListener(e, s, t));
  }
  delay(r, e) {
    const s = window.setTimeout(e, r);
    return this.addDisposer(() => window.clearTimeout(s)), s;
  }
  every(r, e) {
    const s = window.setInterval(e, r), t = () => window.clearInterval(s);
    return this.addDisposer(t), t;
  }
  own(r) {
    return this.addDisposer(() => r.disconnect()), r;
  }
  emit(r, e = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${r}`, { detail: e, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(r, e) {
    return V(this.ns, r, this.messages, this.locale, e);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(r, e, s) {
    const t = this.str(r);
    return t ? s ? this.interp(t, s) : t : this.t(e, s);
  }
  interp(r, e) {
    return r.replace(/\{(\w+)\}/g, (s, t) => t in e ? String(e[t]) : s);
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
  str(r, e = "") {
    const s = this.raw(r);
    if (s == null) return e;
    if (typeof s == "object") {
      const o = T(s, this.locale);
      return o.trim() ? o : e;
    }
    const t = String(s);
    return t.trim() ? t : e;
  }
  bool(r, e) {
    const s = this.raw(r);
    if (s == null || s === "") return e;
    if (typeof s == "boolean") return s;
    if (typeof s == "number") return s !== 0;
    const t = String(s).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(t) ? !0 : ["false", "0", "no", "off"].includes(t) ? !1 : e;
  }
  num(r, e, s = -1 / 0, t = 1 / 0) {
    const o = this.raw(r), i = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(i) && o != null && o !== "" ? L(i, s, t) : e;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(r, e, s) {
    let t = this.raw(r);
    Array.isArray(t) && (t = t[0]), t && typeof t == "object" && (t = t.value ?? t.key);
    const o = t == null ? "" : String(t).trim();
    return e.includes(o) ? o : s;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(r) {
    let e = this.raw(r);
    Array.isArray(e) && (e = e[0]), e && typeof e == "object" && (e = e.value);
    const s = Number(e);
    return Number.isFinite(s) && s > 0 ? s : void 0;
  }
  /** Rows of a `collection` field. */
  list(r) {
    const e = this.raw(r);
    return Array.isArray(e) ? e.filter((s) => s && typeof s == "object") : e && typeof e == "object" ? Object.values(e).filter((s) => s && typeof s == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(r, e, s = "") {
    const t = r[e];
    if (t == null) return s;
    if (typeof t == "object") {
      const i = T(t, this.locale);
      return i.trim() ? i : s;
    }
    const o = String(t);
    return o.trim() ? o : s;
  }
  /** A link field resolved by the server to a URL string (`variable-list`) or a plain URL field. */
  link(r) {
    return this.linkValue(this.raw(r));
  }
  linkValue(r) {
    if (Array.isArray(r) && (r = r[0]), r && typeof r == "object" && (r = r.url ?? r.value), r == null) return "";
    const e = String(r).trim();
    return !e || e === "#" ? "" : /^(https?:)?\/\//i.test(e) || e.startsWith("/") || e.startsWith("#") || e.startsWith("mailto:") || e.startsWith("tel:") ? e : /^[\w./-]+$/.test(e) ? `/${e}` : "";
  }
  color(r, e) {
    const s = this.str(r, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(s) ? s : e;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: s, onPrimary: t } = R();
      s && this.style.setProperty("--shohrah-primary", s), t && this.style.setProperty("--shohrah-on-primary", t);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(r) {
    const e = r.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [s, t, o] = [0, 2, 4].map((h) => parseInt(e.slice(h, h + 2), 16) / 255), i = (h) => h <= 0.03928 ? h / 12.92 : ((h + 0.055) / 1.055) ** 2.4;
    return 0.2126 * i(s) + 0.7152 * i(t) + 0.0722 * i(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
x([
  y({ type: Object })
], p.prototype, "config");
x([
  w()
], p.prototype, "locale");
x([
  y({ type: String, reflect: !0, attribute: "data-phase" })
], p.prototype, "phase");
x([
  w()
], p.prototype, "errorMessage");
const B = M`
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
`, _ = (a, r = !1, e = "") => v`<svg class="sh-svg ${r ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${a}</svg>`, X = () => _(v`<path d="M5 12h14M13 6l6 6-6 6"/>`, !1, "sh-flip-rtl"), Y = () => _(v`<path d="M5 12.5l4.5 4.5L19 7"/>`), q = () => _(v`<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.75"/><circle cx="17" cy="18" r="1.75"/>`);
function H() {
  return c`<link rel="stylesheet" href=${E("fonts/sallaicons.css")} />`;
}
function G(a, r) {
  const e = (a || "").trim();
  return e.startsWith("sicon-") ? c`<i class="sicon ${e}" aria-hidden="true"></i>` : r ? r() : c``;
}
const J = {
  empty: { ar: "أضف منتجات واحصل على شحن مجاني للطلبات فوق {amount}", en: "Add items to unlock free shipping on orders over {amount}" },
  remaining: { ar: "أضف {amount} للحصول على شحن مجاني", en: "Add {amount} more for free shipping" },
  reached: { ar: "مبروك! حصلت على شحن مجاني", en: "You’ve unlocked free shipping!" },
  cta: { ar: "عرض السلة", en: "View cart" },
  progress_label: { ar: "التقدّم نحو الشحن المجاني", en: "Progress towards free shipping" },
  of: { ar: "{current} من {target}", en: "{current} of {target}" },
  unavailable: { ar: "لم يتم ضبط حد الشحن المجاني في إعدادات المتجر.", en: "Free-shipping threshold is not configured in the store settings." },
  load_error: { ar: "تعذّر تحميل بيانات السلة.", en: "Could not load cart data." }
}, K = M`
  :host {
    --fs-color: var(--sh-primary);
    --fs-reached: var(--sh-success);
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 0.875rem 1.125rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--pill {
    border-radius: var(--sh-radius-pill);
    padding: 0.625rem 1.125rem;
  }
  .root--line {
    border: 0;
    padding: 0.25rem 0;
    background: transparent;
    border-radius: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--fs-color) 12%, transparent);
    color: var(--fs-color);
    transition: background-color var(--sh-ease), color var(--sh-ease), transform var(--sh-ease);
  }
  .root--reached .icon {
    background: color-mix(in srgb, var(--fs-reached) 14%, transparent);
    color: var(--fs-reached);
  }
  .icon svg,
  .icon .sicon {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 1.25rem;
  }
  .msg {
    margin: 0;
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .msg strong {
    color: var(--fs-color);
    font-variant-numeric: tabular-nums;
  }
  .root--reached .msg {
    color: var(--fs-reached);
  }
  .cta {
    flex: none;
    min-height: 2.25rem;
    padding: 0.25rem 0.875rem;
    font-size: 0.85rem;
  }
  .bar {
    position: relative;
    height: 0.5rem;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-surface-2);
    overflow: hidden;
  }
  .root--line .bar {
    height: 0.3rem;
  }
  .fill {
    height: 100%;
    width: var(--fs-percent, 0%);
    border-radius: inherit;
    background: var(--fs-color);
    transition: width 500ms cubic-bezier(0.2, 0.7, 0.2, 1), background-color var(--sh-ease);
  }
  .root--reached .fill {
    background: var(--fs-reached);
  }
  .root--celebrate .fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
    animation: fs-shine 1.6s ease-in-out 2;
  }
  @keyframes fs-shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
  .amounts {
    display: flex;
    justify-content: space-between;
    margin: 0;
    font-size: 0.78rem;
    color: var(--sh-muted);
    font-variant-numeric: tabular-nums;
  }
  .skel-row {
    height: 1.25rem;
    width: 70%;
  }
  .skel-bar {
    height: 0.5rem;
    width: 100%;
  }
`;
var Q = Object.defineProperty, k = (a, r, e, s) => {
  for (var t = void 0, o = a.length - 1, i; o >= 0; o--)
    (i = a[o]) && (t = i(r, e, t) || t);
  return t && Q(r, e, t), t;
};
const Z = ["bar", "pill", "line"], S = class S extends p {
  constructor() {
    super(...arguments), this.ns = "free-shipping-meter", this.messages = J, this.celebrating = !1, this.wasReached = !1;
  }
  async onSallaReady() {
    this.addDisposer(F((r) => this.apply(r)));
    try {
      const r = await I();
      this.apply(r);
    } catch (r) {
      this.apply(void 0), this.salla?.log?.("[shohrah:free-shipping-meter] cart unavailable", r);
    }
  }
  apply(r) {
    const e = Number(r?.sub_total ?? 0) || 0, s = Number(r?.count ?? 0) || 0, t = this.threshold ?? this.num("threshold_override", 200, 0, 1e6), o = r?.free_shipping_bar, i = t > 0 ? t : Number(o?.minimum_amount ?? 0) || 0;
    if (i <= 0) {
      this.meter = void 0, this.phase = "empty";
      return;
    }
    const n = t > 0 ? e >= i : !!o?.has_free_shipping || e >= i, h = Math.max(0, i - e), m = n ? 100 : L(Math.round(e / i * 100), 0, 100);
    this.meter = { subtotal: e, threshold: i, remaining: h, percent: m, reached: n, count: s }, this.phase = "ready", this.emit("cart-progress", { subtotal: e, threshold: i, percent: m }), n && !this.wasReached && (this.emit("free-shipping-reached"), this.bool("celebrate", !0) && !this.reducedMotion && (this.celebrating = !0, this.delay(3400, () => {
      this.celebrating = !1;
    }))), this.wasReached = n;
  }
  render() {
    if (this.phase === "error") return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const r = this.meterStyle ?? this.choice("style", Z, "bar"), e = this.bool("show_cta", !0), s = this.bool("show_amounts", !0) && r !== "pill", t = this.str("icon", ""), i = this.bool("use_theme_color", !0) ? "" : `--fs-color:${this.color("bar_color", "#1f5c5a")};--fs-reached:${this.color("reached_color", "#15803d")}`;
    if (this.phase === "loading")
      return c`<div class=${j({ root: !0, [`root--${r}`]: !0 })} part="root" aria-busy="true">
        <div class="row"><span class="sh-skeleton icon"></span><span class="sh-skeleton skel-row"></span></div>
        ${r === "pill" ? u : c`<div class="sh-skeleton skel-bar"></div>`}
      </div>`;
    if (this.phase === "empty" || !this.meter)
      return c`<div class="sh-empty" part="empty">${this.t("unavailable")}</div>`;
    const n = this.meter, h = n.subtotal <= 0;
    if (h && !this.bool("show_when_empty", !0)) return u;
    if (n.reached && this.bool("hide_when_reached", !1)) return u;
    const m = f(n.remaining), C = n.reached ? this.text("message_reached", "reached") : h ? this.text("message_empty", "empty", { amount: f(n.threshold) }) : this.text("message_remaining", "remaining", { amount: m }), $ = C.split(m);
    return c`
      ${t.startsWith("sicon-") ? H() : u}
      <div
        class=${j({ root: !0, [`root--${r}`]: !0, "root--reached": n.reached, "root--celebrate": this.celebrating })}
        style=${i}
        part="root"
      >
        <div class="row">
          <span class="icon" part="icon" aria-hidden="true">${n.reached ? Y() : G(t, q)}</span>
          <p class="msg" part="message" role="status" aria-live="polite">
            ${!n.reached && !h && $.length === 2 ? c`${$[0]}<strong>${m}</strong>${$[1]}` : C}
          </p>
          ${e && !h ? c`<slot name="cta"><a class="sh-btn sh-btn--ghost cta" part="cta" href=${D("cart")}>${this.text("cta_text", "cta")} ${X()}</a></slot>` : u}
        </div>
        ${r === "pill" ? u : c`<div
              class="bar"
              part="bar"
              role="progressbar"
              aria-label=${this.t("progress_label")}
              aria-valuemin="0"
              aria-valuemax=${n.threshold}
              aria-valuenow=${Math.min(n.subtotal, n.threshold)}
              aria-valuetext=${this.t("of", { current: f(Math.min(n.subtotal, n.threshold)), target: f(n.threshold) })}
            >
              <div class="fill" part="fill" style="--fs-percent:${n.percent}%"></div>
            </div>`}
        ${s ? c`<p class="amounts" part="amounts"><span>${f(n.subtotal)}</span><span>${f(n.threshold)}</span></p>` : u}
      </div>
    `;
  }
};
S.styles = [B, K];
let d = S;
k([
  y({ type: Number })
], d.prototype, "threshold");
k([
  y({ type: String, attribute: "meter-style" })
], d.prototype, "meterStyle");
k([
  w()
], d.prototype, "meter");
k([
  w()
], d.prototype, "celebrating");
typeof d < "u" && d.registerSallaComponent("salla-free-shipping-meter");
export {
  d as default
};
