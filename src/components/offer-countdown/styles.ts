import { css } from 'lit';

export const styles = css`
  :host {
    --cd-accent: var(--sh-primary);
    --cd-on-accent: var(--sh-on-primary);
  }
  .root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    padding: 1.125rem 1.375rem;
    border-radius: var(--sh-radius);
  }
  .root--surface {
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
    box-shadow: var(--sh-shadow);
  }
  .root--primary {
    background: var(--cd-accent);
    color: var(--cd-on-accent);
    --sh-muted: color-mix(in srgb, var(--cd-on-accent) 78%, transparent);
  }
  .root--stacked {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .root--center {
    justify-content: center;
    text-align: center;
  }
  .copy {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
    flex: 1 1 14rem;
  }
  .root--center .copy {
    align-items: center;
    flex: 0 1 auto;
  }
  .title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
  }
  .subtitle {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.92rem;
  }
  .timer {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    direction: ltr;
    flex: none;
  }
  .root--center .timer,
  .root--stacked .timer {
    justify-content: center;
  }
  .unit {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-width: 3.25rem;
  }
  .digits {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    min-height: 3rem;
    padding: 0.25rem 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    transition: background-color var(--sh-ease), color var(--sh-ease);
  }
  .digits--boxed {
    background: color-mix(in srgb, var(--cd-accent) 10%, var(--sh-surface));
    color: var(--cd-accent);
    border-radius: var(--sh-radius-sm);
    border: 1px solid color-mix(in srgb, var(--cd-accent) 20%, transparent);
  }
  .root--primary .digits--boxed {
    background: color-mix(in srgb, var(--cd-on-accent) 14%, transparent);
    color: var(--cd-on-accent);
    border-color: color-mix(in srgb, var(--cd-on-accent) 25%, transparent);
  }
  .digits--pill {
    background: var(--cd-accent);
    color: var(--cd-on-accent);
    border-radius: var(--sh-radius-pill);
    min-width: 3.5rem;
  }
  .root--primary .digits--pill {
    background: var(--cd-on-accent);
    color: var(--cd-accent);
  }
  .digits--minimal {
    min-height: auto;
    padding: 0;
    font-size: 1.75rem;
    color: inherit;
  }
  .label {
    font-size: 0.72rem;
    color: var(--sh-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .colon {
    font-size: 1.25rem;
    font-weight: 700;
    opacity: 0.5;
    margin-block-end: 1.1rem;
  }
  .digits--minimal + .label {
    display: none;
  }
  .root--pulse .digits {
    animation: cd-pulse 1s ease-in-out infinite;
  }
  @keyframes cd-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
  }
  .cta {
    flex: none;
  }
  .root--primary .sh-btn--primary {
    background: var(--cd-on-accent);
    color: var(--cd-accent);
  }
  .root--primary .sh-btn--primary:hover {
    background: color-mix(in srgb, var(--cd-on-accent) 90%, #000);
  }
  .expired {
    margin: 0;
    font-weight: 600;
  }
  .skel {
    width: 12rem;
    height: 3rem;
  }
  @media (max-width: 480px) {
    .digits {
      min-width: 2.75rem;
      font-size: 1.25rem;
      min-height: 2.5rem;
    }
    .unit {
      min-width: 2.75rem;
    }
  }
`;
