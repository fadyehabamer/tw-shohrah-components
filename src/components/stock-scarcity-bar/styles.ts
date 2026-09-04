import { css } from 'lit';

export const styles = css`
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
