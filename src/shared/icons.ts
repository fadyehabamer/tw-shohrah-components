import { html, svg, type TemplateResult } from 'lit';
import { cdnUrl } from './salla';

/**
 * Inline SVG icons as individual named exports so each component only bundles the few it uses.
 * 24×24 viewBox, 1.75 stroke, `currentColor`. Directional icons carry `.sh-flip-rtl`.
 */
const wrap = (body: TemplateResult, fill = false, cls = '') =>
  svg`<svg class="sh-svg ${fill ? 'sh-svg--fill' : ''} ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;

export const iconChevronDown = () => wrap(svg`<path d="M6 9l6 6 6-6"/>`);
export const iconArrowEnd = () => wrap(svg`<path d="M5 12h14M13 6l6 6-6 6"/>`, false, 'sh-flip-rtl');
export const iconArrowStart = () => wrap(svg`<path d="M19 12H5M11 18l-6-6 6-6"/>`, false, 'sh-flip-rtl');
export const iconPlus = () => wrap(svg`<path d="M12 5v14M5 12h14"/>`);
export const iconMinus = () => wrap(svg`<path d="M5 12h14"/>`);
export const iconClose = () => wrap(svg`<path d="M6 6l12 12M18 6L6 18"/>`);
export const iconCheck = () => wrap(svg`<path d="M5 12.5l4.5 4.5L19 7"/>`);
export const iconSearch = () => wrap(svg`<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>`);
export const iconClock = () => wrap(svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`);
export const iconHistory = () => wrap(svg`<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/>`);
export const iconTruck = () =>
  wrap(svg`<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.75"/><circle cx="17" cy="18" r="1.75"/>`);
export const iconFire = () =>
  wrap(
    svg`<path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.2-2.1-5.2-3.4-6.6-.4 1.7-1.4 2.7-2.6 3.2.3-2.7-.6-6.2-3.6-8-.2 3.1-1.7 4.6-3 6.1C5.2 11.6 5 13.4 5 15.4 5 19.1 7.6 22 12 22z"/>`,
  );
export const iconShield = () => wrap(svg`<path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>`);
export const iconCart = () =>
  wrap(
    svg`<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.25"/><circle cx="17" cy="20" r="1.25"/>`,
  );
export const iconStar = () =>
  wrap(svg`<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/>`, true);
export const iconStarOutline = () =>
  wrap(svg`<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/>`);
export const iconQuote = () =>
  wrap(
    svg`<path d="M7.5 6C5 6 3 8 3 10.5V18h7v-7H6.5c0-1.7 1.1-2.8 2.5-3V6zM18 6c-2.5 0-4.5 2-4.5 4.5V18h7v-7H17c0-1.7 1.1-2.8 2.5-3V6z"/>`,
    true,
  );
export const iconWhatsapp = () =>
  wrap(
    svg`<path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5zm5.3 13.4c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.5c-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4l.7 1.8c.1.1.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.5.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.3 1.1z"/>`,
    true,
  );
export const iconMegaphone = () => wrap(svg`<path d="M3 10v4l11 4V6L3 10z"/><path d="M14 9a3 3 0 0 1 0 6"/><path d="M6 14l1.5 5"/>`);
export const iconTrash = () => wrap(svg`<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>`);
export const iconBox = () => wrap(svg`<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>`);
export const iconCard = () => wrap(svg`<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>`);
export const iconUndo = () => wrap(svg`<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>`);
export const iconHeadset = () =>
  wrap(
    svg`<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v5H5a1 1 0 0 1-1-1v-4zM20 13h-3v5h2a1 1 0 0 0 1-1v-4z"/><path d="M12 21h4"/>`,
  );
export const iconTag = () => wrap(svg`<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.25"/>`);
export const iconBolt = () => wrap(svg`<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>`);
export const iconAlert = () => wrap(svg`<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18.5v.5"/>`);

/**
 * Salla icon-font glyph (`sicon-*`) chosen by the merchant. The font's stylesheet has to be
 * present inside the shadow root for the glyph classes to resolve; the file is served from
 * Salla's CDN and cached by the browser, so the cost is one cached request per page.
 */
export function sallaIconStylesheet() {
  return html`<link rel="stylesheet" href=${cdnUrl('fonts/sallaicons.css')} />`;
}

export function sicon(name: string | undefined, fallback?: () => TemplateResult) {
  const n = (name || '').trim();
  if (n.startsWith('sicon-')) return html`<i class="sicon ${n}" aria-hidden="true"></i>`;
  return fallback ? fallback() : html``;
}
