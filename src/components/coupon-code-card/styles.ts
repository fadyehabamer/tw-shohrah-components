import { css } from 'lit';

export const styles = css`
  :host {
    --cc-accent: var(--sh-primary);
    --cc-on-accent: var(--sh-on-primary);
    --cc-max: 480px;
  }
  .root {
    position: relative;
    display: flex;
    gap: 1rem;
    max-width: var(--cc-max);
    padding: 1.125rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
    overflow: hidden;
  }
  .root--ticket {
    border: 2px solid color-mix(in srgb, var(--cc-accent) 40%, var(--sh-border));
  }
  .root--ticket::before,
  .root--ticket::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--sh-surface-2, #f7f7f6);
    border: 2px solid color-mix(in srgb, var(--cc-accent) 40%, var(--sh-border));
    transform: translateY(-50%);
  }
  .root--ticket::before {
    inset-inline-start: -0.75rem;
  }
  .root--ticket::after {
    inset-inline-end: -0.75rem;
  }
  .root--inline {
    align-items: center;
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  .root--inline .body {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }
  .root--inline .desc,
  .root--inline .conditions,
  .root--inline .expiry {
    display: none;
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--cc-accent) 12%, transparent);
    color: var(--cc-accent);
  }
  .icon svg,
  .icon .sicon {
    width: 1.35rem;
    height: 1.35rem;
    font-size: 1.35rem;
  }
  .root--inline .icon {
    width: 2.25rem;
    height: 2.25rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }
  .title {
    margin: 0;
    font-weight: 700;
    font-size: 1.05rem;
    line-height: 1.45;
  }
  .desc {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.9rem;
  }
  .code-row {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .code {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--sh-radius-sm);
    border: 2px solid var(--cc-accent);
    color: var(--cc-accent);
    background: color-mix(in srgb, var(--cc-accent) 6%, transparent);
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    direction: ltr;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    user-select: all;
    transition: background-color var(--sh-ease), border-color var(--sh-ease);
  }
  .code--dashed {
    border-style: dashed;
  }
  .code:hover {
    background: color-mix(in srgb, var(--cc-accent) 12%, transparent);
  }
  .code--copied {
    border-color: var(--sh-success);
    color: var(--sh-success);
    background: color-mix(in srgb, var(--sh-success) 8%, transparent);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .btn {
    min-height: 2.6rem;
    font-size: 0.9rem;
    padding-inline: 1rem;
  }
  .btn--copied,
  .btn--applied {
    background: var(--sh-success) !important;
    border-color: transparent !important;
    color: #fff !important;
  }
  .btn--failed {
    background: var(--sh-danger) !important;
    border-color: transparent !important;
    color: #fff !important;
  }
  .conditions {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .expiry {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-warning);
    font-weight: 600;
  }
  .expiry svg {
    width: 0.95rem;
    height: 0.95rem;
  }
  .feedback {
    margin: 0;
    font-size: 0.82rem;
    color: var(--sh-danger);
  }
  .expired {
    margin: 0;
    font-weight: 600;
    color: var(--sh-muted);
  }
  .spinner {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    animation: cc-spin 0.8s linear infinite;
  }
  @keyframes cc-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
