import { css } from 'lit';

export const styles = css`
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
