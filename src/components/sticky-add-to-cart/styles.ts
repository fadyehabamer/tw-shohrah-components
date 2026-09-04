import { css } from 'lit';

export const styles = css`
  :host {
    --sb-offset: 0px;
    --sb-bg: var(--sh-surface);
    --sb-fg: var(--sh-text);
    --sb-border: var(--sh-border);
    position: fixed;
    inset-inline: 0;
    inset-block-end: var(--sb-offset);
    z-index: 50;
    width: auto;
    transform: translateY(calc(100% + var(--sb-offset) + 8px));
    transition: transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
    pointer-events: none;
  }
  :host([position='top']) {
    inset-block-end: auto;
    inset-block-start: var(--sb-offset);
    transform: translateY(calc(-100% - var(--sb-offset) - 8px));
  }
  :host([data-phase='empty']),
  :host([data-phase='error']) {
    position: static;
    transform: none;
    pointer-events: auto;
  }
  :host([visible]) {
    transform: none;
    pointer-events: auto;
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
  .bar {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.625rem max(1rem, env(safe-area-inset-left)) calc(0.625rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-right));
    background: var(--sb-bg);
    color: var(--sb-fg);
    border-block-start: 1px solid var(--sb-border);
  }
  :host([position='top']) .bar {
    border-block-start: 0;
    border-block-end: 1px solid var(--sb-border);
    padding-block-end: 0.625rem;
  }
  .bar--shadow {
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.08);
  }
  :host([position='top']) .bar--shadow {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
  .bar--dark {
    --sb-bg: #111827;
    --sb-fg: #ffffff;
    --sb-border: rgba(255, 255, 255, 0.1);
    --sh-muted: rgba(255, 255, 255, 0.7);
  }
  .bar--primary {
    --sb-bg: var(--sh-primary);
    --sb-fg: var(--sh-on-primary);
    --sb-border: transparent;
    --sh-muted: color-mix(in srgb, var(--sh-on-primary) 75%, transparent);
  }
  .bar--primary .sh-btn--primary {
    background: var(--sh-on-primary);
    color: var(--sh-primary);
  }
  .inner {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
  }
  .thumb {
    width: 3rem;
    height: 3rem;
    border-radius: var(--sh-radius-sm);
    object-fit: cover;
    flex: none;
    background: var(--sh-surface-2);
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    line-height: 1.35;
  }
  .name {
    margin: 0;
    font-weight: 700;
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-variant-numeric: tabular-nums;
  }
  .price .now {
    font-weight: 700;
  }
  .price .was {
    color: var(--sh-muted);
    text-decoration: line-through;
    font-size: 0.85rem;
  }
  .qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--sb-border);
    border-radius: var(--sh-radius);
    overflow: hidden;
    flex: none;
    background: color-mix(in srgb, var(--sb-fg) 4%, transparent);
  }
  .qty button {
    width: 2.5rem;
    height: 2.75rem;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .qty button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .qty button svg {
    width: 1rem;
    height: 1rem;
  }
  .qty output {
    min-width: 2rem;
    text-align: center;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .add {
    flex: none;
    min-width: 9rem;
  }
  .add--added {
    background: var(--sh-success) !important;
    color: #fff !important;
  }
  .add--failed {
    background: var(--sh-danger) !important;
    color: #fff !important;
  }
  .hint {
    font-size: 0.8rem;
    color: var(--sh-muted);
    margin: 0;
  }
  .spinner {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    animation: sb-spin 0.8s linear infinite;
  }
  @keyframes sb-spin {
    to {
      transform: rotate(360deg);
    }
  }
  .skel-name {
    width: 55%;
    height: 1rem;
  }
  .skel-price {
    width: 30%;
    height: 0.9rem;
    margin-block-start: 0.25rem;
  }
  @media (max-width: 640px) {
    .thumb {
      width: 2.5rem;
      height: 2.5rem;
    }
    .name {
      font-size: 0.875rem;
    }
    .add {
      min-width: 0;
      padding-inline: 0.875rem;
    }
    .qty button {
      width: 2.125rem;
      height: 2.5rem;
    }
  }
`;
