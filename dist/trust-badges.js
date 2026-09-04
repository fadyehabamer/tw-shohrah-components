import { LitElement as D, css as T, html as c, svg as l, nothing as g } from "lit";
import { property as m, state as $ } from "lit/decorators.js";
import { classMap as E } from "lit/directives/class-map.js";
function u() {
  return window.salla ?? window.Salla;
}
let b = null;
function M(i, t) {
  return new Promise((r) => {
    const s = window.setTimeout(() => r(void 0), t);
    i.then(
      (e) => {
        clearTimeout(s), r(e);
      },
      () => {
        clearTimeout(s), r(void 0);
      }
    );
  });
}
function O(i = 8e3) {
  return b || (b = new Promise((t) => {
    const r = Date.now(), s = () => {
      const e = u();
      if (e && typeof e.onReady == "function") {
        M(Promise.resolve(e.onReady()), i).then(() => e.lang?.onLoaded ? M(e.lang.onLoaded(), 4e3) : void 0).then(() => t(e));
        return;
      }
      if (Date.now() - r > i) {
        t(void 0);
        return;
      }
      window.setTimeout(s, 50);
    };
    s();
  }), b);
}
function k() {
  const i = document.documentElement.getAttribute("lang");
  let t = i && i.trim();
  if (!t) {
    const r = u();
    try {
      t = r?.lang?.getLocale?.() || r?.config?.get("user.language_code");
    } catch {
      t = void 0;
    }
  }
  return (t || "ar").toLowerCase().split(/[-_]/)[0];
}
function N(i) {
  const t = u();
  try {
    if (t?.url?.cdn) return t.url.cdn(i);
  } catch {
  }
  return `https://cdn.salla.network/${i.replace(/^\/+/, "")}`;
}
function R() {
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
function z(i, t) {
  if (i == null) return "";
  if (typeof i == "string") return i;
  if (typeof i == "number") return String(i);
  if (Array.isArray(i)) return "";
  const r = i, s = [r[t], r.ar, r.en, ...Object.values(r)];
  for (const e of s) if (typeof e == "string" && e.trim()) return e;
  return "";
}
function V(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (r, s) => s in t ? String(t[s]) : r
  ) : i;
}
function B(i, t) {
  const r = u();
  if (!r?.lang?.addBulk) return;
  const s = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (s.has(i)) return;
  const e = {};
  for (const [o, n] of Object.entries(t)) e[`shohrah.${i}.${o}`] = { ar: n.ar, en: n.en };
  try {
    r.lang.addBulk(e), s.add(i);
  } catch {
  }
}
function W(i, t, r, s, e) {
  const o = `shohrah.${i}.${t}`, n = u();
  let h;
  if (n?.lang?.get && n.lang.translationsLoaded)
    try {
      const a = n.lang.get(o);
      typeof a == "string" && a && a !== o && (h = a);
    } catch {
      h = void 0;
    }
  if (!h) {
    const a = r[t];
    h = a ? (s === "ar" ? a.ar : a.en) || a.en || a.ar : t;
  }
  return V(h, e);
}
function F(i, t, r) {
  return Math.min(r, Math.max(t, i));
}
var U = Object.defineProperty, y = (i, t, r, s) => {
  for (var e = void 0, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (e = n(t, r, e) || e);
  return e && U(t, r, e), e;
};
class f extends D {
  constructor() {
    super(...arguments), this.locale = "ar", this.phase = "loading", this.errorMessage = "", this.disposers = [], this.booted = !1;
  }
  /* ------------------------------------------------------------- lifecycle */
  connectedCallback() {
    super.connectedCallback(), this.locale = k();
    const t = new MutationObserver(() => {
      const r = k();
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
    if (this.salla = await O(), !!this.isConnected) {
      this.locale = k(), B(this.ns, this.messages), this.applyThemeFallbacks();
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
  listen(t, r, s, e) {
    t.addEventListener(r, s, e), this.addDisposer(() => t.removeEventListener(r, s, e));
  }
  delay(t, r) {
    const s = window.setTimeout(r, t);
    return this.addDisposer(() => window.clearTimeout(s)), s;
  }
  every(t, r) {
    const s = window.setInterval(r, t), e = () => window.clearInterval(s);
    return this.addDisposer(e), e;
  }
  own(t) {
    return this.addDisposer(() => t.disconnect()), t;
  }
  emit(t, r = void 0) {
    this.dispatchEvent(new CustomEvent(`shohrah:${t}`, { detail: r, bubbles: !0, composed: !0 }));
  }
  /* ------------------------------------------------------------- i18n */
  t(t, r) {
    return W(this.ns, t, this.messages, this.locale, r);
  }
  /** Merchant text for `key`, falling back to the built-in string `msgKey`. */
  text(t, r, s) {
    const e = this.str(t);
    return e ? s ? this.interp(e, s) : e : this.t(r, s);
  }
  interp(t, r) {
    return t.replace(/\{(\w+)\}/g, (s, e) => e in r ? String(r[e]) : s);
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
    const s = this.raw(t);
    if (s == null) return r;
    if (typeof s == "object") {
      const o = z(s, this.locale);
      return o.trim() ? o : r;
    }
    const e = String(s);
    return e.trim() ? e : r;
  }
  bool(t, r) {
    const s = this.raw(t);
    if (s == null || s === "") return r;
    if (typeof s == "boolean") return s;
    if (typeof s == "number") return s !== 0;
    const e = String(s).trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(e) ? !0 : ["false", "0", "no", "off"].includes(e) ? !1 : r;
  }
  num(t, r, s = -1 / 0, e = 1 / 0) {
    const o = this.raw(t), n = typeof o == "number" ? o : Number(String(o ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && o != null && o !== "" ? F(n, s, e) : r;
  }
  /** Value of an `items` field (radio/dropdown): string, `{value}`, or `[{value}]`. */
  choice(t, r, s) {
    let e = this.raw(t);
    Array.isArray(e) && (e = e[0]), e && typeof e == "object" && (e = e.value ?? e.key);
    const o = e == null ? "" : String(e).trim();
    return r.includes(o) ? o : s;
  }
  /** First selected id of a `source` items field (products, categories …). */
  selectedId(t) {
    let r = this.raw(t);
    Array.isArray(r) && (r = r[0]), r && typeof r == "object" && (r = r.value);
    const s = Number(r);
    return Number.isFinite(s) && s > 0 ? s : void 0;
  }
  /** Rows of a `collection` field. */
  list(t) {
    const r = this.raw(t);
    return Array.isArray(r) ? r.filter((s) => s && typeof s == "object") : r && typeof r == "object" ? Object.values(r).filter((s) => s && typeof s == "object") : [];
  }
  /** Text inside a collection row (string or `{ar,en}`). */
  rowText(t, r, s = "") {
    const e = t[r];
    if (e == null) return s;
    if (typeof e == "object") {
      const n = z(e, this.locale);
      return n.trim() ? n : s;
    }
    const o = String(e);
    return o.trim() ? o : s;
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
    const s = this.str(t, "").trim();
    return /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i.test(s) ? s : r;
  }
  /* ------------------------------------------------------------- theme */
  /**
   * If the page defines no `--color-primary`, mirror the store's real colours from
   * `salla.config` onto the host so the static fallbacks are only a last resort.
   */
  applyThemeFallbacks() {
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() !== "") return;
      const { primary: s, onPrimary: e } = R();
      s && this.style.setProperty("--shohrah-primary", s), e && this.style.setProperty("--shohrah-on-primary", e);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const r = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(r)) return "#ffffff";
    const [s, e, o] = [0, 2, 4].map((a) => parseInt(r.slice(a, a + 2), 16) / 255), n = (a) => a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
    return 0.2126 * n(s) + 0.7152 * n(e) + 0.0722 * n(o) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
y([
  m({ type: Object })
], f.prototype, "config");
y([
  $()
], f.prototype, "locale");
y([
  $()
], f.prototype, "phase");
y([
  $()
], f.prototype, "errorMessage");
const X = T`
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
`, p = (i, t = !1, r = "") => l`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${r}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, Y = () => p(l`<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.75"/><circle cx="17" cy="18" r="1.75"/>`), H = () => p(l`<path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>`), K = () => p(l`<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>`), G = () => p(l`<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>`), q = () => p(l`<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>`), Z = () => p(
  l`<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v5H5a1 1 0 0 1-1-1v-4zM20 13h-3v5h2a1 1 0 0 0 1-1v-4z"/><path d="M12 21h4"/>`
), J = () => p(l`<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.25"/>`), Q = () => p(l`<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>`);
function tt() {
  return c`<link rel="stylesheet" href=${N("fonts/sallaicons.css")} />`;
}
function rt(i, t) {
  const r = (i || "").trim();
  return r.startsWith("sicon-") ? c`<i class="sicon ${r}" aria-hidden="true"></i>` : t ? t() : c``;
}
const et = {
  title: { ar: "لماذا تتسوّق معنا؟", en: "Why shop with us?" },
  region_label: { ar: "مزايا المتجر", en: "Store benefits" },
  empty: { ar: "أضف ميزة واحدة على الأقل من إعدادات العنصر.", en: "Add at least one benefit from the component settings." },
  default_1_title: { ar: "شحن سريع", en: "Fast shipping" },
  default_1_text: { ar: "توصيل خلال ٢–٥ أيام عمل لجميع مناطق المملكة", en: "Delivery in 2–5 business days across the Kingdom" },
  default_2_title: { ar: "دفع آمن", en: "Secure payment" },
  default_2_text: { ar: "مدى، Apple Pay، وجميع البطاقات عبر بوابة مشفّرة", en: "mada, Apple Pay and all cards over an encrypted gateway" },
  default_3_title: { ar: "إرجاع سهل", en: "Easy returns" },
  default_3_text: { ar: "استرجاع أو استبدال خلال ١٤ يومًا دون تعقيد", en: "Return or exchange within 14 days, no hassle" },
  default_4_title: { ar: "دعم على مدار الساعة", en: "24/7 support" },
  default_4_text: { ar: "فريقنا جاهز للرد عبر الواتساب والبريد في أي وقت", en: "Our team answers on WhatsApp and email any time" }
}, st = T`
  .root {
    --tb-cols: 4;
    --tb-cols-mobile: 2;
    --tb-icon: 28px;
    padding: calc(var(--sh-space) * 1.25) var(--sh-space);
    border-radius: var(--sh-radius);
  }
  .root--surface {
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--tint {
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
  }
  .root--sm {
    font-size: 0.9rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--tb-cols-mobile), minmax(0, 1fr));
    gap: calc(var(--sh-space) * 1.25) var(--sh-space);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(var(--tb-cols), minmax(0, 1fr));
    }
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    min-width: 0;
    position: relative;
  }
  .root--center .item {
    align-items: center;
    text-align: center;
  }
  .root--dividers .item + .item::before {
    content: '';
    position: absolute;
    inset-block: 10%;
    inset-inline-start: calc(var(--sh-space) * -0.5);
    border-inline-start: 1px solid var(--sh-border);
  }
  @media (max-width: 767.98px) {
    .root--dividers .item:nth-child(odd)::before {
      display: none;
    }
    .root--dividers.root--m1 .item::before {
      display: none;
    }
  }
  .item a {
    text-decoration: none;
    display: contents;
  }
  .item a:hover .title {
    color: var(--sh-primary);
  }
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--tb-icon) + 20px);
    height: calc(var(--tb-icon) + 20px);
    flex: none;
    color: var(--sh-primary);
    transition: transform var(--sh-ease);
  }
  .icon svg,
  .icon .sicon {
    width: var(--tb-icon);
    height: var(--tb-icon);
    font-size: var(--tb-icon);
  }
  .icon--circle {
    border-radius: 50%;
    background: color-mix(in srgb, var(--sh-primary) 10%, transparent);
  }
  .icon--filled {
    border-radius: var(--sh-radius);
    background: var(--sh-primary);
    color: var(--sh-on-primary);
  }
  .item:hover .icon {
    transform: translateY(-2px);
  }
  .title {
    margin: 0;
    font-size: 1.02em;
    font-weight: 700;
    line-height: 1.5;
    color: var(--sh-text);
    transition: color var(--sh-ease);
  }
  .text {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.92em;
    line-height: 1.7;
  }

  /* compact: icon beside text, single wrapping row */
  .root--compact .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.5rem;
  }
  .root--compact .item {
    flex-direction: row;
    align-items: center;
    gap: 0.625rem;
    text-align: start;
  }
  .root--compact .item::before {
    display: none;
  }
  .root--compact .icon {
    width: calc(var(--tb-icon) + 12px);
    height: calc(var(--tb-icon) + 12px);
  }
  .root--compact .text {
    display: none;
  }

  /* row: horizontal cards with icon inline-start */
  .root--row .item {
    flex-direction: row;
    align-items: flex-start;
    text-align: start;
  }
  .root--row.root--center .item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
`;
var it = Object.defineProperty, v = (i, t, r, s) => {
  for (var e = void 0, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (e = n(t, r, e) || e);
  return e && it(t, r, e), e;
};
const ot = ["row", "grid", "compact"], nt = ["outline", "circle", "filled"], at = ["start", "center"], ct = ["transparent", "surface", "tint"], lt = ["sm", "md"], C = [Y, H, q, Z, J, Q, K, G], S = class S extends f {
  constructor() {
    super(...arguments), this.ns = "trust-badges", this.messages = et;
  }
  get items() {
    const t = this.list("items");
    return t.length === 0 ? this.defaultItems() : t.map((r) => ({
      icon: this.rowText(r, "icon"),
      title: this.rowText(r, "title"),
      text: this.rowText(r, "text"),
      href: this.linkValue(r.link)
    })).filter((r) => r.title || r.text);
  }
  defaultItems() {
    return [1, 2, 3, 4].map((t) => ({
      icon: "",
      title: this.t(`default_${t}_title`),
      text: this.t(`default_${t}_text`),
      href: ""
    }));
  }
  onBadgeClick(t, r) {
    this.emit("badge-click", { index: t, title: r.title, href: r.href });
  }
  render() {
    const t = this.layout ?? this.choice("layout", ot, "row"), r = this.align ?? this.choice("align", at, "center"), s = this.iconStyle ?? this.choice("icon_style", nt, "circle"), e = this.background ?? this.choice("background", ct, "transparent"), o = this.choice("text_size", lt, "md"), n = this.bool("dividers", !0), h = this.bool("show_title", !1), a = this.num("columns_desktop", 4, 2, 6), _ = this.num("columns_mobile", 2, 1, 2), A = this.num("icon_size", 28, 20, 48), x = this.items, L = x.some((w) => w.icon.startsWith("sicon-"));
    if (this.phase === "error")
      return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    if (x.length === 0)
      return c`<div class="sh-empty" part="empty">${this.t("empty")}</div>`;
    const j = {
      root: !0,
      [`root--${t}`]: !0,
      [`root--${e}`]: e !== "transparent",
      [`root--${o}`]: !0,
      "root--center": r === "center",
      "root--dividers": n && t !== "compact",
      "root--m1": _ === 1
    }, I = `--tb-cols:${a};--tb-cols-mobile:${_};--tb-icon:${A}px`;
    return c`
      ${L ? tt() : g}
      <section class=${E(j)} style=${I} part="root" aria-label=${this.t("region_label")}>
        ${h ? c`<div class="sh-header ${r === "center" ? "sh-header--center" : ""}">
              <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
            </div>` : g}
        <ul class="grid" role="list">
          ${x.map((w, P) => this.renderItem(w, P, s))}
        </ul>
      </section>
    `;
  }
  renderItem(t, r, s) {
    const e = C[r % C.length], o = c`
      <span class="icon icon--${s}" part="icon">${rt(t.icon, e)}</span>
      <span class="body">
        ${t.title ? c`<p class="title" part="badge-title">${t.title}</p>` : g}
        ${t.text ? c`<p class="text" part="badge-text">${t.text}</p>` : g}
      </span>
    `;
    return c`<li class="item" part="item">
      ${t.href ? c`<a href=${t.href} @click=${() => this.onBadgeClick(r, t)}>${o}</a>` : o}
    </li>`;
  }
};
S.styles = [X, st];
let d = S;
v([
  m({ type: String })
], d.prototype, "layout");
v([
  m({ type: String })
], d.prototype, "align");
v([
  m({ type: String, attribute: "icon-style" })
], d.prototype, "iconStyle");
v([
  m({ type: String })
], d.prototype, "background");
typeof d < "u" && d.registerSallaComponent("salla-trust-badges");
export {
  d as default
};
