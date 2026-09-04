import { LitElement as O, css as L, html as a, svg as b, nothing as l } from "lit";
import { property as p, state as w } from "lit/decorators.js";
import { classMap as A } from "lit/directives/class-map.js";
function u() {
  return window.salla ?? window.Salla;
}
let v = null;
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
function D(i = 8e3) {
  return v || (v = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = u();
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
  }), v);
}
function x() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const e = u();
    try {
      t = e?.lang?.getLocale?.() || e?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function W(i) {
  const t = u();
  try {
    if (t?.url?.cdn) return t.url.cdn(i);
  } catch {
  }
  return `https://cdn.salla.network/${i.replace(/^\/+/, "")}`;
}
function B() {
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
const y = "shohrah.";
function N(i, t) {
  const e = u();
  try {
    if (e?.storage?.getWithTTL) return e.storage.getWithTTL(y + i, t, "session") ?? t;
    const r = window.sessionStorage.getItem(y + i);
    return r == null ? t : JSON.parse(r);
  } catch {
    return t;
  }
}
function q(i, t, e = 5) {
  const r = u();
  try {
    if (r?.storage?.setWithTTL) {
      r.storage.setWithTTL(y + i, t, e, "session");
      return;
    }
    window.sessionStorage.setItem(y + i, JSON.stringify(t));
  } catch {
  }
}
function C(i, t) {
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
function X(i, t) {
  const e = u();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(i)) return;
  const s = {};
  for (const [o, n] of Object.entries(t)) s[`shohrah.${i}.${o}`] = { ar: n.ar, en: n.en };
  try {
    e.lang.addBulk(s), r.add(i);
  } catch {
  }
}
function V(i, t, e, r, s) {
  const o = `shohrah.${i}.${t}`, n = u();
  let c;
  if (n?.lang?.get && n.lang.translationsLoaded)
    try {
      const h = n.lang.get(o);
      typeof h == "string" && h && h !== o && (c = h);
    } catch {
      c = void 0;
    }
  if (!c) {
    const h = e[t];
    c = h ? (r === "ar" ? h.ar : h.en) || h.en || h.ar : t;
  }
  return F(c, s);
}
function K(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
var U = Object.defineProperty, k = (i, t, e, r) => {
  for (var s = void 0, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (s = n(t, e, s) || s);
  return s && U(t, e, s), s;
};
class m extends O {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = x();
    const t = new MutationObserver(() => {
      const e = x();
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
      this.locale = x(), X(this.ns, this.messages), this.applyThemeFallbacks();
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
      const o = C(r, this.locale);
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
    const o = this.raw(t), n = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && o != null && o !== "" ? K(n, r, s) : e;
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
      const n = C(s, this.locale);
      return n.trim() ? n : r;
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
      const { primary: r, onPrimary: s } = B();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, o] = [0, 2, 4].map((h) => parseInt(e.slice(h, h + 2), 16) / 255), n = (h) => h <= 0.03928 ? h / 12.92 : ((h + 0.055) / 1.055) ** 2.4;
    return 0.2126 * n(r) + 0.7152 * n(s) + 0.0722 * n(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
k([
  p({ type: Object })
], m.prototype, "config");
k([
  w()
], m.prototype, "locale");
k([
  p({ type: String, reflect: !0, attribute: "data-phase" })
], m.prototype, "phase");
k([
  w()
], m.prototype, "errorMessage");
const G = L`
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
`, $ = (i, t = !1, e = "") => b`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, J = () => $(b`<path d="M6 6l12 12M18 6L6 18"/>`), Y = () => $(b`<path d="M3 10v4l11 4V6L3 10z"/><path d="M14 9a3 3 0 0 1 0 6"/><path d="M6 14l1.5 5"/>`), Z = () => $(b`<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>`);
function H() {
  return a`<link rel="stylesheet" href=${W("fonts/sallaicons.css")} />`;
}
function Q(i, t) {
  const e = (i || "").trim();
  return e.startsWith("sicon-") ? a`<i class="sicon ${e}" aria-hidden="true"></i>` : t ? t() : a``;
}
const tt = {
  region_label: { ar: "إعلانات المتجر", en: "Store announcements" },
  dismiss: { ar: "إغلاق الإعلان", en: "Dismiss announcement" },
  pause: { ar: "إيقاف الحركة", en: "Pause" },
  play: { ar: "تشغيل الحركة", en: "Play" },
  empty: { ar: "أضف إعلانًا واحدًا على الأقل من إعدادات العنصر.", en: "Add at least one announcement from the component settings." },
  default_1: { ar: "شحن مجاني للطلبات فوق ٢٠٠ ر.س", en: "Free shipping on orders over 200 SAR" },
  default_2: { ar: "وصل حديثًا: تشكيلة الموسم الجديد", en: "Just in: the new season collection" },
  default_3: { ar: "خصم ١٠٪ على طلبك الأول بكود WELCOME10", en: "10% off your first order with code WELCOME10" }
}, et = L`
  :host {
    --tk-h: 40px;
    --tk-bg: var(--sh-primary);
    --tk-fg: var(--sh-on-primary);
    --tk-speed: 25s;
  }
  :host([sticky]) {
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .root {
    position: relative;
    display: flex;
    align-items: center;
    min-height: var(--tk-h);
    background: var(--tk-bg);
    color: var(--tk-fg);
    font-size: 0.875rem;
    font-weight: 500;
    overflow: hidden;
  }
  .root--md {
    font-size: 1rem;
  }
  .root--dark {
    --tk-bg: #111827;
    --tk-fg: #ffffff;
  }
  .root--light {
    --tk-bg: var(--sh-surface-2);
    --tk-fg: var(--sh-text);
    border-block: 1px solid var(--sh-border);
  }
  .viewport {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
  }
  .track {
    display: flex;
    width: max-content;
    align-items: center;
    animation: tk-ltr var(--tk-speed) linear infinite;
    will-change: transform;
  }
  :host(:dir(rtl)) .track {
    animation-name: tk-rtl;
  }
  .root--paused .track,
  .root--hoverpause:hover .track,
  .root--hoverpause:focus-within .track {
    animation-play-state: paused;
  }
  @keyframes tk-ltr {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes tk-rtl {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(50%);
    }
  }
  .group {
    display: flex;
    align-items: center;
    flex: none;
  }
  .msg {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1.25rem;
    white-space: nowrap;
    color: inherit;
    text-decoration: none;
    line-height: 1.4;
  }
  a.msg:hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .msg .sicon,
  .msg svg {
    font-size: 1.15em;
    width: 1.15em;
    height: 1.15em;
    opacity: 0.9;
  }
  .sep {
    flex: none;
    opacity: 0.55;
    display: inline-flex;
    align-items: center;
  }
  .sep--dot::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
  .sep--line::before {
    content: '';
    width: 1px;
    height: 1em;
    background: currentColor;
  }
  .sep--icon svg {
    width: 0.9em;
    height: 0.9em;
  }

  /* rotate mode */
  .rotate {
    flex: 1;
    min-width: 0;
    display: grid;
    place-items: center;
    text-align: center;
    padding-inline: 2.75rem;
  }
  .rotate .msg {
    grid-area: 1 / 1;
    white-space: normal;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 260ms ease-out, transform 260ms ease-out;
    pointer-events: none;
  }
  .rotate .msg[data-active='true'] {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  /* static mode */
  .static {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding-inline: 2.75rem;
  }
  .static .msg {
    white-space: normal;
  }

  .dismiss,
  .toggle {
    position: absolute;
    inset-block: 0;
    margin: auto 0;
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity var(--sh-ease), background-color var(--sh-ease);
  }
  .dismiss {
    inset-inline-end: 0.5rem;
  }
  .toggle {
    inset-inline-start: 0.5rem;
  }
  .dismiss:hover,
  .toggle:hover {
    opacity: 1;
    background: color-mix(in srgb, currentColor 15%, transparent);
  }
  .dismiss svg,
  .toggle svg {
    width: 1rem;
    height: 1rem;
  }
  .root--dismissible .viewport,
  .root--dismissible .rotate,
  .root--dismissible .static {
    padding-inline-end: 2.5rem;
  }
  .root--marquee .viewport {
    padding-inline-start: 2.5rem;
  }
  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
  }
`;
var rt = Object.defineProperty, f = (i, t, e, r) => {
  for (var s = void 0, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (s = n(t, e, s) || s);
  return s && rt(t, e, s), s;
};
const st = ["marquee", "rotate", "static"], it = ["dot", "line", "icon", "none"], ot = ["primary", "dark", "light", "custom"], nt = ["sm", "md"], R = () => a`<svg class="sh-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>`, T = () => a`<svg class="sh-svg sh-svg--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>`, S = class S extends m {
  constructor() {
    super(...arguments), this.ns = "announcement-ticker", this.messages = tt, this.sticky = !1, this.paused = !1, this.dismissed = !1, this.active = 0;
  }
  get items() {
    const t = this.list("items");
    return (t.length > 0 ? t.map((r) => ({
      text: this.rowText(r, "text"),
      icon: this.rowText(r, "icon"),
      href: this.linkValue(r.link)
    })) : [1, 2, 3].map((r) => ({ text: this.t(`default_${r}`), icon: "", href: "" }))).filter((r) => r.text);
  }
  get dismissKey() {
    return `ticker.dismissed.${this.items.map((t) => t.text).join("|").length}`;
  }
  get effectiveMode() {
    const t = this.mode ?? this.choice("mode", st, "marquee");
    return t === "marquee" && this.reducedMotion ? "rotate" : t;
  }
  onSallaReady() {
    this.sticky = this.sticky || this.bool("sticky", !1), this.bool("dismissible", !1) && N(this.dismissKey, !1) && (this.dismissed = !0), this.phase = "ready", this.setupRotation(), this.listen(document, "visibilitychange", () => this.setupRotation());
  }
  updated() {
    this.phase === "ready" && this.setupRotation();
  }
  setupRotation() {
    if (!(this.effectiveMode === "rotate" && !this.paused && !this.dismissed && document.visibilityState === "visible" && this.items.length > 1)) {
      this.stopRotate?.(), this.stopRotate = void 0;
      return;
    }
    if (this.stopRotate) return;
    const e = this.num("rotate_seconds", 5, 2, 30);
    this.stopRotate = this.every(e * 1e3, () => {
      this.active = (this.active + 1) % this.items.length;
    });
  }
  dismiss() {
    this.dismissed = !0, q(this.dismissKey, !0, 60 * 12), this.emit("dismiss");
  }
  togglePause() {
    this.paused = !this.paused;
  }
  onClick(t, e) {
    this.emit("announcement-click", { index: t, text: e.text, href: e.href });
  }
  render() {
    if (this.phase === "error") return a`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.dismissed) return l;
    const t = this.items;
    if (t.length === 0) return a`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const e = this.effectiveMode, r = this.choice("separator", it, "dot"), s = this.choice("background", ot, "primary"), o = this.choice("font_size", nt, "sm"), n = this.bool("show_icons", !0), c = this.bool("dismissible", !1), h = this.bool("pause_on_hover", !0), P = this.num("height_px", 40, 32, 64), j = this.num("speed_seconds", 25, 8, 120), z = n && t.some((g) => g.icon.startsWith("sicon-"));
    let M = `--tk-h:${P}px;--tk-speed:${Math.max(j, t.length * 4)}s`;
    if (s === "custom") {
      const g = this.color("custom_bg", "#111827"), I = this.color("custom_text", this.readableOn(g));
      M += `;--tk-bg:${g};--tk-fg:${I}`;
    }
    const E = {
      root: !0,
      [`root--${e}`]: !0,
      [`root--${s}`]: s !== "custom",
      [`root--${o}`]: !0,
      "root--dismissible": c,
      "root--hoverpause": h,
      "root--paused": this.paused
    };
    return a`
      ${z ? H() : l}
      <div class=${A(E)} style=${M} part="root" role="region" aria-label=${this.t("region_label")}>
        ${e === "marquee" ? this.renderMarquee(t, r, n) : l}
        ${e === "rotate" ? this.renderRotate(t, n) : l}
        ${e === "static" ? this.renderStatic(t, r, n) : l}
        ${c ? a`<button class="dismiss" part="dismiss" type="button" aria-label=${this.text("dismiss_label", "dismiss")} @click=${this.dismiss}>
              ${J()}
            </button>` : l}
      </div>
    `;
  }
  renderMessage(t, e, r, s = {}) {
    const o = r ? Q(t.icon, Z) : l, n = a`${o}<span>${t.text}</span>`;
    return t.href ? a`<a class="msg" part="message" href=${t.href} data-active=${String(s.active ?? "")} @click=${() => this.onClick(e, t)}>${n}</a>` : a`<span class="msg" part="message" data-active=${String(s.active ?? "")}>${n}</span>`;
  }
  renderSeparator(t) {
    return t === "none" ? l : a`<span class="sep sep--${t}" aria-hidden="true">${t === "icon" ? Y() : l}</span>`;
  }
  renderMarquee(t, e, r) {
    const s = (o) => a`<div class="group" aria-hidden=${String(o)}>
        ${t.map((n, c) => a`${this.renderMessage(n, c, r)}${this.renderSeparator(e)}`)}
      </div>`;
    return a`
      <button class="toggle" part="toggle" type="button" aria-pressed=${String(this.paused)} aria-label=${this.paused ? this.t("play") : this.t("pause")} @click=${this.togglePause}>
        ${this.paused ? T() : R()}
      </button>
      <ul class="sr-only">
        ${t.map((o) => a`<li>${o.text}</li>`)}
      </ul>
      <div class="viewport">
        <div class="track">${s(!0)}${s(!0)}</div>
      </div>
    `;
  }
  renderRotate(t, e) {
    const r = Math.min(this.active, t.length - 1);
    return a`
      ${t.length > 1 ? a`<button class="toggle" part="toggle" type="button" aria-pressed=${String(this.paused)} aria-label=${this.paused ? this.t("play") : this.t("pause")} @click=${this.togglePause}>
            ${this.paused ? T() : R()}
          </button>` : l}
      <div class="rotate" aria-live="polite" aria-atomic="true">
        ${t.map((s, o) => this.renderMessage(s, o, e, { active: o === r }))}
      </div>
    `;
  }
  renderStatic(t, e, r) {
    return a`<div class="static">
      ${t.map((s, o) => a`${o > 0 ? this.renderSeparator(e) : l}${this.renderMessage(s, o, r)}`)}
    </div>`;
  }
};
S.styles = [G, et];
let d = S;
f([
  p({ type: String })
], d.prototype, "mode");
f([
  p({ type: Boolean, reflect: !0 })
], d.prototype, "sticky");
f([
  p({ type: Boolean })
], d.prototype, "paused");
f([
  w()
], d.prototype, "dismissed");
f([
  w()
], d.prototype, "active");
typeof d < "u" && d.registerSallaComponent("salla-announcement-ticker");
export {
  d as default
};
