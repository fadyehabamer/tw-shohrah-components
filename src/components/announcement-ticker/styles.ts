import { css } from 'lit';

export const styles = css`
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
