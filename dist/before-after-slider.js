import { LitElement as O, css as A, svg as L, html as c, nothing as f } from "lit";
import { property as p, state as m, query as W } from "lit/decorators.js";
import { classMap as w } from "lit/directives/class-map.js";
function u() {
  return window.salla ?? window.Salla;
}
let v = null;
function P(i, t) {
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
function X(i = 8e3) {
  return v || (v = new Promise((t) => {
    const e = Date.now(), r = () => {
      const s = u();
      if (s && typeof s.onReady == "function") {
        P(Promise.resolve(s.onReady()), i).then(() => s.lang?.onLoaded ? P(s.lang.onLoaded(), 4e3) : void 0).then(() => t(s));
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
function F() {
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
  const e = i, r = [e[t], e.ar, e.en, ...Object.values(e)];
  for (const s of r) if (typeof s == "string" && s.trim()) return s;
  return "";
}
function N(i, t) {
  return t ? i.replace(
    /\{(\w+)\}/g,
    (e, r) => r in t ? String(t[r]) : e
  ) : i;
}
function B(i, t) {
  const e = u();
  if (!e?.lang?.addBulk) return;
  const r = window.__shohrahI18n ?? (window.__shohrahI18n = /* @__PURE__ */ new Set());
  if (r.has(i)) return;
  const s = {};
  for (const [a, o] of Object.entries(t)) s[`shohrah.${i}.${a}`] = { ar: o.ar, en: o.en };
  try {
    e.lang.addBulk(s), r.add(i);
  } catch {
  }
}
function V(i, t, e, r, s) {
  const a = `shohrah.${i}.${t}`, o = u();
  let l;
  if (o?.lang?.get && o.lang.translationsLoaded)
    try {
      const n = o.lang.get(a);
      typeof n == "string" && n && n !== a && (l = n);
    } catch {
      l = void 0;
    }
  if (!l) {
    const n = e[t];
    l = n ? (r === "ar" ? n.ar : n.en) || n.en || n.ar : t;
  }
  return N(l, s);
}
function q(i) {
  if (i == null || i === "") return "";
  const t = u();
  try {
    if (t?.helpers?.number) return String(t.helpers.number(i));
  } catch {
  }
  return String(i);
}
function k(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
var K = Object.defineProperty, y = (i, t, e, r) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(t, e, s) || s);
  return s && K(t, e, s), s;
};
class g extends O {
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
    if (this.salla = await X(), !!this.isConnected) {
      this.locale = x(), B(this.ns, this.messages), this.applyThemeFallbacks();
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
      const a = z(r, this.locale);
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
    const a = this.raw(t), o = typeof a == "number" ? a : Number(String(a ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(o) && a != null && a !== "" ? k(o, r, s) : e;
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
      const o = z(s, this.locale);
      return o.trim() ? o : r;
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
      const { primary: r, onPrimary: s } = F();
      r && this.style.setProperty("--shohrah-primary", r), s && this.style.setProperty("--shohrah-on-primary", s);
    } catch {
    }
  }
  /** WCAG relative luminance helper; picks a readable text colour for a custom background. */
  readableOn(t) {
    const e = t.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(e)) return "#ffffff";
    const [r, s, a] = [0, 2, 4].map((n) => parseInt(e.slice(n, n + 2), 16) / 255), o = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * o(r) + 0.7152 * o(s) + 0.0722 * o(a) > 0.4 ? "#1c1c1c" : "#ffffff";
  }
}
y([
  p({ type: Object })
], g.prototype, "config");
y([
  m()
], g.prototype, "locale");
y([
  p({ type: String, reflect: !0, attribute: "data-phase" })
], g.prototype, "phase");
y([
  m()
], g.prototype, "errorMessage");
const U = A`
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
`, H = (i, t = !1, e = "") => L`<svg class="sh-svg ${t ? "sh-svg--fill" : ""} ${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${i}</svg>`, G = () => H(L`<path d="M9 6l-4 6 4 6"/><path d="M15 6l4 6-4 6"/>`), Y = {
  title: { ar: "قبل وبعد", en: "Before & after" },
  subtitle: { ar: "اسحب المقبض لمقارنة النتيجة", en: "Drag the handle to compare the result" },
  before: { ar: "قبل", en: "Before" },
  after: { ar: "بعد", en: "After" },
  hint: { ar: "اسحب المقبض للمقارنة بين الصورتين", en: "Drag the handle to compare the two images" },
  slider_label: { ar: "مقارنة قبل وبعد", en: "Before and after comparison" },
  value_text: { ar: "{n}٪ من صورة «بعد» ظاهرة", en: "{n}% of the “after” image visible" },
  missing_images: { ar: "أضف صورة «بعد» على الأقل من إعدادات العنصر.", en: "Add at least an “after” image from the component settings." }
}, J = A`
  :host {
    --ba-accent: var(--sh-primary);
    --ba-ratio: 16 / 9;
    --ba-max: 820px;
    --ba-pos: 50%;
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: var(--ba-max);
    margin-inline: auto;
  }
  .stage {
    position: relative;
    width: 100%;
    aspect-ratio: var(--ba-ratio);
    overflow: hidden;
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
    cursor: ew-resize;
  }
  .stage--rounded {
    border-radius: var(--sh-radius);
  }
  .img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
  .img--auto-before {
    filter: grayscale(1) brightness(0.92) contrast(0.95);
  }
  .clip {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--ba-pos);
    overflow: hidden;
  }
  .clip .img {
    width: var(--ba-stage-width, 100%);
    max-width: none;
  }
  .tag {
    position: absolute;
    inset-block-start: 0.75rem;
    z-index: 3;
    padding: 0.25rem 0.75rem;
    border-radius: var(--sh-radius-pill);
    background: rgba(15, 23, 42, 0.62);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    backdrop-filter: blur(6px);
    pointer-events: none;
  }
  .tag--after {
    inset-inline-start: 0.75rem;
  }
  .tag--before {
    inset-inline-end: 0.75rem;
  }
  .bar {
    position: absolute;
    inset-block: 0;
    inset-inline-start: var(--ba-pos);
    width: 3px;
    margin-inline-start: -1.5px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.18);
    z-index: 4;
    pointer-events: none;
  }
  .handle {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: var(--ba-pos);
    width: 2.75rem;
    height: 2.75rem;
    margin-inline-start: -1.375rem;
    margin-block-start: -1.375rem;
    border-radius: 50%;
    border: 0;
    padding: 0;
    background: #fff;
    color: var(--ba-accent);
    cursor: ew-resize;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.3);
    z-index: 5;
    transition: transform var(--sh-ease);
  }
  .handle svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .handle:hover {
    transform: scale(1.08);
  }
  .handle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--ba-accent);
  }
  .handle--bar {
    width: 1.5rem;
    height: 3.5rem;
    margin-inline-start: -0.75rem;
    margin-block-start: -1.75rem;
    border-radius: var(--sh-radius-pill);
  }
  .handle--bar svg {
    width: 1rem;
  }
  .hint {
    margin: 0;
    text-align: center;
    color: var(--sh-muted);
    font-size: 0.85rem;
  }
  .stage--dragging .handle {
    transform: scale(1.04);
  }
  @media (max-width: 640px) {
    .handle {
      width: 2.375rem;
      height: 2.375rem;
      margin-inline-start: -1.1875rem;
      margin-block-start: -1.1875rem;
    }
    .tag {
      font-size: 0.72rem;
      padding: 0.2rem 0.6rem;
    }
  }
`;
var Q = Object.defineProperty, d = (i, t, e, r) => {
  for (var s = void 0, a = i.length - 1, o; a >= 0; a--)
    (o = i[a]) && (s = o(t, e, s) || s);
  return s && Q(t, e, s), s;
};
const Z = ["landscape", "classic", "square", "portrait"], tt = ["circle", "bar"], et = { landscape: "16 / 9", classic: "4 / 3", square: "1 / 1", portrait: "4 / 5" }, $ = class $ extends g {
  constructor() {
    super(...arguments), this.ns = "before-after-slider", this.messages = Y, this.pos = 50, this.dragging = !1, this.stageWidth = 0, this.initialised = !1;
  }
  onSallaReady() {
    this.phase = "ready", this.updateComplete.then(() => {
      if (!this.stageEl) return;
      this.own(new ResizeObserver(() => this.measure())).observe(this.stageEl), this.measure(), this.listen(window, "pointerup", () => this.endDrag()), this.listen(window, "pointercancel", () => this.endDrag());
    });
  }
  willUpdate() {
    !this.initialised && this.phase === "ready" && (this.initialised = !0, this.pos = k(this.position ?? this.num("start_percent", 50, 5, 95), 0, 100));
  }
  measure() {
    this.stageWidth = this.stageEl?.clientWidth ?? 0;
  }
  setFromClientX(t) {
    const e = this.stageEl;
    if (!e) return;
    const r = e.getBoundingClientRect();
    if (!r.width) return;
    const s = (t - r.left) / r.width, a = this.rtl ? 1 - s : s;
    this.setPos(a * 100);
  }
  setPos(t) {
    const e = k(Math.round(t * 10) / 10, 0, 100);
    e !== this.pos && (this.pos = e, this.emit("compare-change", { position: e }));
  }
  onPointerDown(t) {
    if (!(t.button !== 0 && t.pointerType === "mouse")) {
      this.dragging = !0, this.setFromClientX(t.clientX);
      try {
        this.stageEl?.setPointerCapture(t.pointerId);
      } catch {
      }
    }
  }
  onPointerMove(t) {
    if (this.dragging) {
      this.setFromClientX(t.clientX), t.cancelable && t.preventDefault();
      return;
    }
    this.bool("hover_move", !1) && t.pointerType === "mouse" && this.setFromClientX(t.clientX);
  }
  endDrag() {
    this.dragging && (this.dragging = !1);
  }
  onKeydown(t) {
    const e = t.shiftKey ? 10 : 2;
    let r = null;
    t.key === "ArrowRight" ? r = this.pos + (this.rtl ? -e : e) : t.key === "ArrowLeft" ? r = this.pos + (this.rtl ? e : -e) : t.key === "Home" ? r = 0 : t.key === "End" && (r = 100), r !== null && (t.preventDefault(), this.setPos(r));
  }
  render() {
    if (this.phase === "error") return c`<div class="sh-error" role="alert">${this.errorMessage}</div>`;
    const t = this.afterSrc || this.str("after_image", ""), e = this.beforeSrc || this.str("before_image", "");
    if (!t && !e) return c`<div class="sh-empty" part="empty">${this.t("missing_images")}</div>`;
    const r = !e, s = e || t, a = t || e, o = this.choice("ratio", Z, "landscape"), l = this.choice("handle_style", tt, "circle"), n = this.bool("show_labels", !0), T = this.bool("show_title", !1), j = this.bool("rounded", !0), E = this.num("max_width", 820, 320, 1600), S = this.text("before_label", "before"), _ = this.text("after_label", "after"), M = this.str("before_alt", "") || S, R = this.str("after_alt", "") || _, C = this.str("hint", this.t("hint")), D = this.str("subtitle");
    let b = `--ba-ratio:${et[o]};--ba-max:${E}px;--ba-pos:${this.pos}%;--ba-stage-width:${this.stageWidth || 0}px`;
    return this.bool("use_theme_color", !0) || (b += `;--ba-accent:${this.color("accent_color", "#1f5c5a")}`), this.stageWidth || (b = b.replace(/--ba-stage-width:[^;]*/, "--ba-stage-width:100%")), c`
      <section class="root" part="root" style=${b}>
        ${T ? c`<div class="sh-header sh-header--center">
              <slot name="title"><h3 class="sh-title" part="title">${this.text("title", "title")}</h3></slot>
              ${D ? c`<slot name="subtitle"><p class="sh-subtitle" part="subtitle">${D}</p></slot>` : f}
            </div>` : f}
        <div
          class=${w({ stage: !0, "stage--rounded": j, "stage--dragging": this.dragging })}
          part="stage"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
        >
          <img class=${w({ img: !0, "img--auto-before": r })} part="before" src=${s} alt=${M} draggable="false" />
          ${n ? c`<span class="tag tag--before" part="label-before">${S}</span>` : f}
          <div class="clip">
            <img class="img" part="after" src=${a} alt=${R} draggable="false" @load=${() => this.measure()} />
          </div>
          ${n ? c`<span class="tag tag--after" part="label-after">${_}</span>` : f}
          <div class="bar" aria-hidden="true"></div>
          <button
            class=${w({ handle: !0, [`handle--${l}`]: !0 })}
            part="handle"
            type="button"
            role="slider"
            aria-label=${this.t("slider_label")}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${Math.round(this.pos)}
            aria-valuetext=${this.t("value_text", { n: q(Math.round(this.pos)) })}
            aria-orientation="horizontal"
            @keydown=${this.onKeydown}
            @click=${(I) => I.preventDefault()}
          >
            ${G()}
          </button>
        </div>
        ${C ? c`<slot name="hint"><p class="hint" part="hint">${C}</p></slot>` : f}
      </section>
    `;
  }
};
$.styles = [U, J];
let h = $;
d([
  p({ type: Number })
], h.prototype, "position");
d([
  p({ type: String, attribute: "before-src" })
], h.prototype, "beforeSrc");
d([
  p({ type: String, attribute: "after-src" })
], h.prototype, "afterSrc");
d([
  m()
], h.prototype, "pos");
d([
  m()
], h.prototype, "dragging");
d([
  m()
], h.prototype, "stageWidth");
d([
  W(".stage")
], h.prototype, "stageEl");
typeof h < "u" && h.registerSallaComponent("salla-before-after-slider");
export {
  h as default
};
