import { css } from 'lit';

export const styles = css`
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.125rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--inline {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
    padding: 0.75rem 1rem;
  }
  .root--inline .sh-header {
    display: none;
  }
  .root--inline .field {
    flex: 1 1 12rem;
  }
  .root--inline .result {
    flex: 2 1 16rem;
    padding: 0.5rem 0.75rem;
  }
  .sh-header {
    margin: 0;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--sh-muted);
  }
  .select-wrap {
    position: relative;
  }
  .select-wrap svg {
    position: absolute;
    inset-inline-end: 0.75rem;
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--sh-muted);
  }
  select {
    width: 100%;
    min-height: 2.875rem;
    padding: 0.5rem 2.5rem 0.5rem 0.875rem;
    padding-inline: 0.875rem 2.5rem;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    color: var(--sh-text);
    font: inherit;
    appearance: none;
    cursor: pointer;
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  select:focus-visible {
    border-color: var(--sh-primary);
    box-shadow: var(--sh-focus);
    outline: none;
  }
  .result {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
    border: 1px dashed color-mix(in srgb, var(--sh-primary) 30%, transparent);
  }
  .icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--sh-surface);
    color: var(--sh-primary);
    border: 1px solid var(--sh-border);
  }
  .icon svg,
  .icon .sicon {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 1.25rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  .result-label {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .dates {
    margin: 0;
    font-weight: 700;
    font-size: 1.02rem;
    color: var(--sh-primary);
    line-height: 1.5;
  }
  .days {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .cutoff {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 0.85rem;
    color: var(--sh-text);
  }
  .cutoff svg {
    color: var(--sh-warning);
    flex: none;
  }
  .cutoff strong {
    font-variant-numeric: tabular-nums;
    color: var(--sh-warning);
  }
  .cutoff--after {
    color: var(--sh-muted);
  }
  .cutoff--after svg {
    color: var(--sh-muted);
  }
`;
