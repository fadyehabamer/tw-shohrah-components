import { LitElement as M, css as E, svg as k, html as c, nothing as p } from "lit";
import { property as m, state as y } from "lit/decorators.js";
import { classMap as O } from "lit/directives/class-map.js";
function l() {
  return window.salla ?? window.Salla;
}
let b = null;
function z(o, e) {
  return new Promise((t) => {
    const r = window.setTimeout(() => t(void 0), e);
    o.then(
      (s) => {
        clearTimeout(r), t(s);
      },
      () => {
        clearTimeout(r), t(void 0);
      }
    );
  });
}
function j(o = 8e3) {
  return b || (b = new Promise((e) => {
    const t = Date.now(), r = () => {
      const s = l();
      if (s && typeof s.onReady == "function") {
        z(Promise.resolve(s.onReady()), o).then(() => s.lang?.onLoaded ? z(s.lang.onLoaded(), 4e3) : void 0).then(() => e(s));
        return;
      }
      if (Date.now() - t > o) {
        e(void 0);
        return;
      }
      window.setTimeout(r, 50);
    };
    r();
  }), b);
}
function x() {
  const o = document.documentElement.getAttribute("lang");
  let e = o && o.trim();
  if (!e) {
    const t = l();
    try {
      e = t?.lang?.getLocale?.() || t?.config?.get("user.language_code");
    } catch {
      e = void 0;
    }
  }
  return (e || "ar").toLowerCase().split(/[-_]/)[0];
}
function A() {
  const o = l();
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
function P(o) {
  const e = l();
  try {
    const t = e?.config.get(`store.contacts.${o}`);
    return typeof t == "string" && t.trim() ? t.trim() : void 0;
  } catch {
    return;
  }
}
function T(o) {
  const e = l();
  try {
    const t = e?.config.get(`store.${o}`);
    return typeof t == "string" && t.trim() ? t : void 0;
  } catch {
    return;
  }
}
const v = "shohrah.";
function D(o, e) {
  const t = l();
  try {
    if (t?.storage?.getWithTTL) return t.storage.getWithTTL(v + o, e, "session") ?? e;
    const r = window.sessionStorage.getItem(v + o);
    return r == null ? e : JSON.parse(r);
  } catch {
    return e;
  }
}
function N(o, e, t = 5) {
  const r = l();
  try {
    if (r?.storage?.setWithTTL) {
      r.storage.setWithTTL(v + o, e, t, "session");
      return;
    }
    window.sessionStorage.setItem(v + o, JSON.stringify(e));
  } catch {
  }
}
function L(o, e) {
  if (o == null) return "";
  if (typeof o == "string") return o;
  if (typeof o == "number") return String(o);
  if (Array.isArray(o)) return "";
  const t = o, r = [t[e], t.ar, t.en, ...Object.values(t)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function R(o, e) {
  return e ? o.replace(
    /\{(\w+)\}/g,
    (t, r) => r in e ? String(e[r]) : t
  ) : o;
}
function W(o, e) {
  const t = l();
  if (!t?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(o)) return;
  const s = {};
  for (const [i, n] of Object.entries(e)) s[`shohrah.${o}.${i}`] = { ar: n.ar, en: n.en };
  try {
    t.lang.addBulk(s), r.add(o);
  } catch {
  }
}
function G(o, e, t, r, s) {
  const i = `shohrah.${o}.${e}`, n = l();
  let h;
  if (n?.lang?.get && n.lang.translationsLoaded)
    try {
      const a = n.lang.get(i);
      typeof a == "string" && a && a !== i && (h = a);
    } catch {
      h = void 0;
    }
  if (!h) {
    const a = t[e];
    h = a ? (r === "ar" ? a.ar : a.en) || a.en || a.ar : e;
  }
  return R(h, s);
}
function F(o, e, t) {
  return Math.min(t, Math.max(e, o));
}
var B = Object.defineProperty, w = (o, e, t, r) => {
  for (var s = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (s = n(e, t, s) || s);
  return s && B(e, t, s), s;
};
class f extends M {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = x();
    const e = new MutationObserver(() => {
      const t = x();
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
    if (this.salla = await j(), !!this.isConnected) {
      this.locale = x(), W(this.ns, this.messages), this.applyThemeFallbacks();
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
  listen(e, t, r, s) {
    e.addEventListener(t, r, s), this.addDisposer(() => e.removeEventListener(t, r, s));
  }
  delay(e, t) {
    const r = window.setTimeout(t, e);
    return this.addDisposer(() => window.clearTimeout(r)), r;
  }
  every(e, t) {
    const r = window.setInterval(t, e), s = () => window.clearInterval(r);
    return this.addDisposer(s), s;
  }
  own(e) {
    return this.addDisposer(() => e.disconnect()), e;
  }
  emit(e, t = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${e}`, { detail: t, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(e, t) {
    return G(this.ns, e, this.messages, this.locale, t);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(e, t, r) {
    const s = this.str(e);
    return s ? r ? this.interp(s, r) : s : this.t(t, r);
  }
  interp(e, t) {
    return e.replace(/\{(\w+)\}/g, (r, s) => s in t ? String(t[s]) : r);
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
      const i = L(r, this.locale);
      return i.trim() ? i : t;
    }
    const s = String(r);
    return s.trim() ? s : t;
  }
  bool(e, t) {
    const r = this.raw(e);
    if (r == null || r === "") return t;
    if (typeof r == "boolean") return r;
    if (typeof r == "number") return r !== 0;
    const s = String(r).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(s) ? !0 : ["false", "0", "no", "off"].includes(s) ? !1 : t;
  }
  num(e, t, r = -1 / 0, s = 1 / 0) {
    const i = this.raw(e), n = typeof i == "number" ? i : Number(String(i ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && i != null && i !== "" ? F(n, r, s) : t;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(e, t, r) {
    let s = this.raw(e);
    Array.isArray(s) && (s = s[0]), s && typeof s == "object" && (s = s.value ?? s.key);
    const i = s == null ? "" : String(s).trim();
    return t.includes(i) ? i : r;
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
    const s = e[t];
    if (s == null) return r;
    if (typeof s == "object") {
      const n = L(s, this.locale);
      return n.trim() ? n : r;
    }
    const i = String(s);
    return i.trim() ? i : r;
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
      const { primary: r, onPrimary: s } = A();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(e) {
    const t = e.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(t)) return "#ffffff";
    const [r, s, i] = [0, 2, 4].map((a) => parseInt(t.slice(a, a + 2), 16) / 255), n = (a) => a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
    return 0.2126 * n(r) + 0.7152 * n(s) + 0.0722 * n(i) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
w([
  m({ type: Object })
], f.prototype, "config");
w([
  y()
], f.prototype, "locale");
w([
  m({ type: String, reflect: !0, attribute: "data-phase" })
], f.prototype, "phase");
w([
  y()
], f.prototype, "errorMessage");
const H = E`
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
`, I = (o, e = !1, t = "") => k`<svg class="sh-svg ${e ? "sh-svg--fill" : ""} ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${o}</svg>`, V = () => I(k`<path d="M6 6l12 12M18 6L6 18"/>`), $ = () => I(
  k`<path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5zm5.3 13.4c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.5c-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4l.7 1.8c.1.1.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.5.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.3 1.1z"/>`,
  !0
), X = {
  label: { ar: "تواصل معنا عبر واتساب", en: "Chat with us on WhatsApp" },
  message: { ar: "مرحبًا {store}، لدي استفسار بخصوص {product}", en: "Hi {store}, I have a question about {product}" },
  greeting_title: { ar: "مرحبًا 👋", en: "Hello 👋" },
  greeting_text: { ar: "كيف نقدر نساعدك اليوم؟", en: "How can we help you today?" },
  offline: { ar: "خارج أوقات العمل الآن، اترك رسالتك وسنرد قريبًا", en: "We’re offline right now. Leave a message and we’ll reply soon" },
  online: { ar: "متاحون الآن", en: "Online now" },
  close_greeting: { ar: "إغلاق الرسالة", en: "Close message" },
  start_chat: { ar: "ابدأ المحادثة", en: "Start chat" },
  this_page: { ar: "هذه الصفحة", en: "this page" },
  missing_number: { ar: "لم يتم ضبط رقم واتساب. أضفه في إعدادات العنصر أو في بيانات تواصل المتجر.", en: "No WhatsApp number set. Add one in the component settings or in the store contact details." }
}, Y = E`
  :host {
    --wa-color: #25d366;
    --wa-on: #ffffff;
    --wa-size: 3.5rem;
    --wa-bottom: 24px;
    --wa-side: 24px;
    position: fixed;
    inset-block-end: var(--wa-bottom);
    inset-inline-end: var(--wa-side);
    z-index: 60;
    display: block;
    width: auto;
  }
  :host([data-phase='empty']),
  :host([data-phase='error']) {
    position: static;
    width: 100%;
  }
  :host([position='start']) {
    inset-inline-end: auto;
    inset-inline-start: var(--wa-side);
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
  .root {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
  }
  :host([position='start']) .root {
    align-items: flex-start;
  }
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    height: var(--wa-size);
    min-width: var(--wa-size);
    padding: 0 calc(var(--wa-size) * 0.22);
    border-radius: var(--sh-radius-pill);
    background: var(--wa-color);
    color: var(--wa-on);
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--wa-color) 40%, transparent), 0 2px 6px rgba(0, 0, 0, 0.12);
    transition: transform var(--sh-ease), box-shadow var(--sh-ease);
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px color-mix(in srgb, var(--wa-color) 45%, transparent), 0 2px 8px rgba(0, 0, 0, 0.14);
  }
  .btn:focus-visible {
    box-shadow: 0 0 0 3px var(--wa-on), 0 0 0 6px var(--wa-color);
    outline: none;
  }
  .btn svg {
    width: calc(var(--wa-size) * 0.55);
    height: calc(var(--wa-size) * 0.55);
    flex: none;
  }
  .btn .text {
    white-space: nowrap;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-width 260ms ease-out, opacity 200ms ease-out;
  }
  .btn--always .text,
  .btn--hover:hover .text,
  .btn--hover:focus-visible .text {
    max-width: 16rem;
    opacity: 1;
    padding-inline-end: 0.25rem;
  }
  .btn--pulse::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--wa-color);
    opacity: 0.45;
    animation: wa-pulse 2.4s ease-out infinite;
    z-index: -1;
  }
  @keyframes wa-pulse {
    from {
      transform: scale(1);
      opacity: 0.45;
    }
    to {
      transform: scale(1.35);
      opacity: 0;
    }
  }
  .status {
    position: absolute;
    inset-block-start: -2px;
    inset-inline-end: -2px;
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    border: 2px solid var(--wa-on);
    background: var(--sh-success);
  }
  .status--off {
    background: var(--sh-muted);
  }
  .bubble {
    position: relative;
    width: min(20rem, calc(100vw - 2 * var(--wa-side)));
    padding: 1rem 1rem 0.875rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    color: var(--sh-text);
    border: 1px solid var(--sh-border);
    box-shadow: var(--sh-shadow);
    animation: wa-in 220ms ease-out;
  }
  @keyframes wa-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .bubble .close {
    position: absolute;
    inset-block-start: 0.375rem;
    inset-inline-end: 0.375rem;
    width: 1.75rem;
    height: 1.75rem;
    border: 0;
    background: transparent;
    color: var(--sh-muted);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .bubble .close:hover {
    background: var(--sh-surface-2);
    color: var(--sh-text);
  }
  .bubble .close svg {
    width: 0.9rem;
    height: 0.9rem;
  }
  .who {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-block-end: 0.625rem;
  }
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    background: var(--sh-surface-2);
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--sh-primary);
  }
  .avatar svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .g-title {
    margin: 0;
    font-weight: 700;
    font-size: 0.98rem;
    line-height: 1.4;
  }
  .g-status {
    margin: 0;
    font-size: 0.78rem;
    color: var(--sh-muted);
  }
  .g-text {
    margin: 0 0 0.75rem;
    font-size: 0.92rem;
    color: var(--sh-muted);
    line-height: 1.6;
  }
  .g-cta {
    width: 100%;
    background: var(--wa-color);
    color: var(--wa-on);
    min-height: 2.5rem;
    font-size: 0.9rem;
  }
  .g-cta:hover {
    background: color-mix(in srgb, var(--wa-color) 85%, #000);
  }
  @media (prefers-reduced-motion: reduce) {
    .btn--pulse::before {
      animation: none;
      display: none;
    }
    .bubble {
      animation: none;
    }
  }
`;
var U = Object.defineProperty, g = (o, e, t, r) => {
  for (var s = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (s = n(e, t, s) || s);
  return s && U(e, t, s), s;
};
const Z = ["always", "hover", "never"], q = ["start", "end"], J = ["sm", "md", "lg"], K = ["whatsapp", "theme", "custom"], Q = ["all", "mobile", "desktop"], tt = { sm: 3, md: 3.5, lg: 4 }, C = "whatsapp.greeting.seen", _ = class _ extends f {
  constructor() {
    super(...arguments), this.ns = "whatsapp-chat", this.messages = X, this.position = "end", this.showOn = "all", this.greetingOpen = !1, this.online = !0, this.greetingShown = !1;
  }
  get digits() {
    let t = (this.number || this.str("number", "") || P("whatsapp") || "").replace(/[^\d]/g, "");
    return t.startsWith("00") && (t = t.slice(2)), /^05\d{8}$/.test(t) ? t = `966${t.slice(1)}` : /^5\d{8}$/.test(t) && (t = `966${t}`), t.length >= 8 ? t : "";
  }
  onSallaReady() {
    if (this.position = this.choice("position", q, this.position), this.showOn = this.choice("show_on", Q, this.showOn), !this.digits) {
      this.phase = "empty";
      return;
    }
    if (this.phase = "ready", this.updateOnline(), this.every(6e4, () => this.updateOnline()), this.bool("greeting_enabled", !0) && !D(C, !1)) {
      const e = this.num("greeting_delay", 4, 0, 60);
      this.delay(e * 1e3, () => {
        this.greetingShown || (this.greetingShown = !0, this.greetingOpen = !0);
      });
    }
  }
  /** Working hours are evaluated in the merchant's timezone (default Asia/Riyadh). */
  updateOnline() {
    if (!this.bool("hours_enabled", !1)) {
      this.online = !0;
      return;
    }
    const e = this.str("timezone", "Asia/Riyadh"), t = (n, h) => {
      const a = /^(\d{1,2}):(\d{2})/.exec(n.trim());
      return a ? Number(a[1]) * 60 + Number(a[2]) : h;
    }, r = t(this.str("hours_from", "09:00"), 9 * 60), s = t(this.str("hours_to", "22:00"), 22 * 60);
    let i;
    try {
      const n = new Intl.DateTimeFormat("en-GB", { timeZone: e, hour: "2-digit", minute: "2-digit", hour12: !1 }).formatToParts(/* @__PURE__ */ new Date()), h = Number(n.find((u) => u.type === "hour")?.value ?? 0) % 24, a = Number(n.find((u) => u.type === "minute")?.value ?? 0);
      i = h * 60 + a;
    } catch {
      const n = /* @__PURE__ */ new Date();
      i = n.getHours() * 60 + n.getMinutes();
    }
    this.online = r <= s ? i >= r && i < s : i >= r || i < s;
  }
  get href() {
    const e = l();
    let t = "";
    try {
      t = String(e?.config.get("page.title") || document.title || "").trim();
    } catch {
      t = document.title;
    }
    const r = T("name") || "", s = t || this.t("this_page");
    let i = this.text("message", "message", { store: r, product: s, page: s });
    return this.bool("include_url", !0) && (i += `
${window.location.href}`), `https://wa.me/${this.digits}?text=${encodeURIComponent(i)}`;
  }
  onOpen() {
    this.emit("whatsapp-open", { href: this.href, online: this.online }), this.closeGreeting(!1);
  }
  closeGreeting(e = !0) {
    this.greetingOpen = !1, N(C, !0, 60 * 12), e && this.emit("greeting-dismiss");
  }
  render() {
    if (this.phase === "error") return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (this.phase === "empty") return c`<div class="sh-empty" part="empty">${this.t("missing_number")}</div>`;
    if (this.phase === "loading") return p;
    const e = this.choice("label_mode", Z, "hover"), t = this.choice("size", J, "md"), r = this.choice("color_mode", K, "whatsapp"), s = this.bool("pulse", !0) && !this.reducedMotion, i = this.text("label", "label"), n = this.bool("hours_enabled", !1);
    let h = `--wa-size:${tt[t]}rem;--wa-bottom:${this.num("offset_bottom", 24, 0, 200)}px;--wa-side:${this.num("offset_side", 24, 0, 200)}px`;
    if (r === "theme" && (h += ";--wa-color:var(--sh-primary);--wa-on:var(--sh-on-primary)"), r === "custom") {
      const S = this.color("custom_color", "#25d366");
      h += `;--wa-color:${S};--wa-on:${this.readableOn(S)}`;
    }
    const a = this.href, u = this.str("avatar", "") || T("logo") || "";
    return c`
      <div class="root" part="root" style=${h}>
        ${this.greetingOpen ? c`<div class="bubble" part="bubble" role="dialog" aria-label=${this.text("greeting_title", "greeting_title")}>
              <button class="close" type="button" aria-label=${this.t("close_greeting")} @click=${() => this.closeGreeting()}>${V()}</button>
              <slot name="greeting">
                <div class="who">
                  ${u ? c`<img class="avatar" src=${u} alt="" width="40" height="40" loading="lazy" />` : c`<span class="avatar" aria-hidden="true">${$()}</span>`}
                  <div>
                    <p class="g-title" part="greeting-title">${this.text("greeting_title", "greeting_title")}</p>
                    ${n ? c`<p class="g-status">${this.online ? this.t("online") : this.t("offline")}</p>` : p}
                  </div>
                </div>
                <p class="g-text" part="greeting-text">
                  ${!this.online && n ? this.text("offline_text", "offline") : this.text("greeting_text", "greeting_text")}
                </p>
                <a class="sh-btn g-cta" part="greeting-cta" href=${a} target="_blank" rel="noopener noreferrer" @click=${this.onOpen}>
                  ${$()} ${this.t("start_chat")}
                </a>
              </slot>
            </div>` : p}
        <a
          class=${O({ btn: !0, [`btn--${e}`]: !0, "btn--pulse": s })}
          part="button"
          href=${a}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${i}
          @click=${this.onOpen}
        >
          ${$()}
          ${e !== "never" ? c`<span class="text" part="label">${i}</span>` : p}
          ${n ? c`<span class=${O({ status: !0, "status--off": !this.online })} aria-hidden="true"></span>` : p}
        </a>
      </div>
    `;
  }
};
_.styles = [H, Y];
let d = _;
g([
  m({ type: String })
], d.prototype, "number");
g([
  m({ type: String, reflect: !0 })
], d.prototype, "position");
g([
  m({ type: String, reflect: !0, attribute: "show-on" })
], d.prototype, "showOn");
g([
  y()
], d.prototype, "greetingOpen");
g([
  y()
], d.prototype, "online");
typeof d < "u" && d.registerSallaComponent("salla-whatsapp-chat");
export {
  d as default
};
