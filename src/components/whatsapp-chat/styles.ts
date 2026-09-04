import { css } from 'lit';

export const styles = css`
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
