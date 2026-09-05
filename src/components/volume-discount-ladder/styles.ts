import { css } from 'lit';

export const styles = css`
  :host {
    --vd-accent: var(--sh-primary);
    --vd-on-accent: var(--sh-on-primary);
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1.375rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--center .sh-header,
  .root--center .note,
  .root--center .progress {
    text-align: center;
    align-items: center;
  }
  .sh-header {
    margin: 0;
  }
  .list {
    display: grid;
    gap: 0.625rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tier {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
    transition: border-color var(--sh-ease), background-color var(--sh-ease), box-shadow var(--sh-ease), transform var(--sh-ease);
  }
  .tier--hl {
    background: color-mix(in srgb, var(--vd-accent) 8%, var(--sh-surface));
    border-color: color-mix(in srgb, var(--vd-accent) 45%, var(--sh-border));
    box-shadow: var(--sh-shadow);
  }
  .tier--hl .qty {
    color: var(--vd-accent);
  }
  .tier--reached {
    border-color: var(--vd-accent);
  }
  .tier--reached::before {
    content: '';
    position: absolute;
    inset-block: 0.5rem;
    inset-inline-start: -1px;
    width: 3px;
    border-radius: 2px;
    background: var(--vd-accent);
  }
  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  .qty {
    font-weight: 700;
    font-size: 0.98rem;
    line-height: 1.4;
  }
  .sub {
    font-size: 0.8rem;
    color: var(--sh-muted);
  }
  .pill {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    border-radius: var(--sh-radius-pill);
    background: var(--vd-accent);
    color: var(--vd-on-accent);
    font-weight: 700;
    font-size: 0.85rem;
    white-space: nowrap;
  }
  .pill svg {
    width: 0.95rem;
    height: 0.95rem;
  }
  .tier--reached .pill {
    background: var(--sh-success);
    color: #fff;
  }

  /* cards: horizontal row of equal cards */
  .list--cards {
    grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  }
  .list--cards .tier {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.5rem;
    padding: 1rem 0.875rem;
  }
  .list--cards .cell {
    align-items: center;
    order: 2;
  }
  .list--cards .pill {
    order: 1;
    justify-content: center;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }
  .list--cards .tier--reached::before {
    inset-inline: 0.5rem;
    inset-block: auto 0;
    width: auto;
    height: 3px;
  }

  /* steps: connected ladder */
  .list--steps {
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    gap: 0;
    position: relative;
  }
  .list--steps::before {
    content: '';
    position: absolute;
    inset-inline: 10%;
    top: 1.125rem;
    height: 2px;
    background: var(--sh-border);
  }
  .list--steps .tier {
    background: transparent;
    border: 0;
    box-shadow: none;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
  .list--steps .tier::before {
    display: none;
  }
  .list--steps .dot {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--sh-surface);
    border: 2px solid var(--sh-border);
    color: var(--sh-muted);
    font-weight: 700;
    font-size: 0.85rem;
    position: relative;
    z-index: 1;
    transition: background-color var(--sh-ease), border-color var(--sh-ease), color var(--sh-ease);
  }
  .list--steps .tier--hl .dot,
  .list--steps .tier--reached .dot {
    background: var(--vd-accent);
    border-color: var(--vd-accent);
    color: var(--vd-on-accent);
  }
  .list--steps .tier--reached .dot {
    background: var(--sh-success);
    border-color: var(--sh-success);
  }
  .list--steps .pill {
    background: transparent;
    color: var(--vd-accent);
    padding: 0;
    font-size: 1.05rem;
  }
  .list--steps .cell {
    align-items: center;
  }
  .dot {
    display: none;
  }
  .progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0.625rem 0.875rem;
    border-radius: var(--sh-radius);
    background: color-mix(in srgb, var(--vd-accent) 7%, var(--sh-surface));
    font-size: 0.9rem;
    font-weight: 600;
  }
  .progress svg {
    color: var(--vd-accent);
    flex: none;
  }
  .progress strong {
    color: var(--vd-accent);
  }
  .progress--done {
    background: color-mix(in srgb, var(--sh-success) 10%, var(--sh-surface));
  }
  .progress--done svg {
    color: var(--sh-success);
  }
  .note {
    margin: 0;
    font-size: 0.82rem;
    color: var(--sh-muted);
  }
  .cta {
    display: flex;
    justify-content: center;
  }
`;
