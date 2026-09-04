import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    --sg-width: 440px;
  }
  .trigger {
    gap: 0.5rem;
  }
  .trigger--link {
    min-height: auto;
    padding: 0.25rem 0;
    border: 0;
    background: transparent;
    color: var(--sh-primary);
    text-decoration: underline;
    text-underline-offset: 0.25em;
    border-radius: var(--sh-radius-sm);
  }
  .trigger--link:hover {
    color: var(--sh-primary-dark);
  }
  .trigger svg {
    width: 1.1rem;
    height: 1.1rem;
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    justify-content: flex-end;
    animation: sg-fade 200ms ease-out;
  }
  .overlay--start {
    justify-content: flex-start;
  }
  @keyframes sg-fade {
    from {
      opacity: 0;
    }
  }
  .drawer {
    width: min(var(--sg-width), 100vw);
    height: 100%;
    background: var(--sh-surface);
    color: var(--sh-text);
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 60px rgba(15, 23, 42, 0.25);
    animation: sg-in 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
    outline: none;
  }
  @keyframes sg-in {
    from {
      transform: translateX(var(--sg-from, 100%));
    }
  }
  .overlay--start .drawer {
    --sg-from: -100%;
  }
  :host(:dir(rtl)) .drawer {
    --sg-from: -100%;
  }
  :host(:dir(rtl)) .overlay--start .drawer {
    --sg-from: 100%;
  }
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.375rem 1rem;
    border-block-end: 1px solid var(--sh-border);
  }
  .head .sh-header {
    margin: 0;
  }
  .accent {
    width: 2.75rem;
    height: 3px;
    border-radius: 2px;
    background: var(--sh-primary);
    margin-block: 0.5rem 0.375rem;
  }
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 1.125rem 1.375rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .unit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .unit-label {
    font-size: 0.85rem;
    color: var(--sh-muted);
    font-weight: 600;
  }
  .seg {
    display: inline-flex;
    padding: 3px;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
  }
  .seg button {
    min-width: 3.25rem;
    padding: 0.25rem 0.875rem;
    border: 0;
    border-radius: var(--sh-radius-pill);
    background: transparent;
    color: var(--sh-muted);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color var(--sh-ease), color var(--sh-ease);
  }
  .seg button[aria-pressed='true'] {
    background: var(--sh-primary);
    color: var(--sh-on-primary);
  }
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
    min-width: 18rem;
  }
  th,
  td {
    padding: 0.7rem 0.875rem;
    text-align: start;
    border-block-end: 1px solid var(--sh-border);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  tr:last-child td {
    border-block-end: 0;
  }
  th {
    color: var(--sh-primary);
    font-weight: 700;
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    position: sticky;
    top: 0;
  }
  td:first-child {
    font-weight: 700;
  }
  tbody tr:hover td {
    background: var(--sh-surface-2);
  }
  .note {
    margin: 0;
    padding: 0.75rem 0.875rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    color: var(--sh-text);
    font-size: 0.88rem;
    line-height: 1.6;
  }
  .diagram {
    width: 100%;
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    object-fit: contain;
    background: var(--sh-surface-2);
  }
  .tips h4 {
    margin: 0 0 0.625rem;
    font-size: 0.98rem;
    font-weight: 700;
  }
  .tips ol {
    margin: 0;
    padding-inline-start: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--sh-muted);
  }
  .tips li strong {
    color: var(--sh-text);
  }
  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .drawer {
      animation: none;
    }
  }
  @media (max-width: 480px) {
    .drawer {
      width: 100vw;
    }
  }
`;
