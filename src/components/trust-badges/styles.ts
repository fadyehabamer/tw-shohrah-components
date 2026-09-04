import { css } from 'lit';

export const styles = css`
  .root {
    --tb-cols: 4;
    --tb-cols-mobile: 2;
    --tb-icon: 28px;
    padding: calc(var(--sh-space) * 1.25) var(--sh-space);
    border-radius: var(--sh-radius);
  }
  .root--surface {
    background: var(--sh-surface);
    border: 1px solid var(--sh-border);
  }
  .root--tint {
    background: color-mix(in srgb, var(--sh-primary) 6%, var(--sh-surface));
  }
  .root--sm {
    font-size: 0.9rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--tb-cols-mobile), minmax(0, 1fr));
    gap: calc(var(--sh-space) * 1.25) var(--sh-space);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(var(--tb-cols), minmax(0, 1fr));
    }
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    min-width: 0;
    position: relative;
  }
  .root--center .item {
    align-items: center;
    text-align: center;
  }
  .root--dividers .item + .item::before {
    content: '';
    position: absolute;
    inset-block: 10%;
    inset-inline-start: calc(var(--sh-space) * -0.5);
    border-inline-start: 1px solid var(--sh-border);
  }
  @media (max-width: 767.98px) {
    .root--dividers .item:nth-child(odd)::before {
      display: none;
    }
    .root--dividers.root--m1 .item::before {
      display: none;
    }
  }
  .item a {
    text-decoration: none;
    display: contents;
  }
  .item a:hover .title {
    color: var(--sh-primary);
  }
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--tb-icon) + 20px);
    height: calc(var(--tb-icon) + 20px);
    flex: none;
    color: var(--sh-primary);
    transition: transform var(--sh-ease);
  }
  .icon svg,
  .icon .sicon {
    width: var(--tb-icon);
    height: var(--tb-icon);
    font-size: var(--tb-icon);
  }
  .icon--circle {
    border-radius: 50%;
    background: color-mix(in srgb, var(--sh-primary) 10%, transparent);
  }
  .icon--filled {
    border-radius: var(--sh-radius);
    background: var(--sh-primary);
    color: var(--sh-on-primary);
  }
  .item:hover .icon {
    transform: translateY(-2px);
  }
  .title {
    margin: 0;
    font-size: 1.02em;
    font-weight: 700;
    line-height: 1.5;
    color: var(--sh-text);
    transition: color var(--sh-ease);
  }
  .text {
    margin: 0;
    color: var(--sh-muted);
    font-size: 0.92em;
    line-height: 1.7;
  }

  /* compact: icon beside text, single wrapping row */
  .root--compact .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.5rem;
  }
  .root--compact .item {
    flex-direction: row;
    align-items: center;
    gap: 0.625rem;
    text-align: start;
  }
  .root--compact .item::before {
    display: none;
  }
  .root--compact .icon {
    width: calc(var(--tb-icon) + 12px);
    height: calc(var(--tb-icon) + 12px);
  }
  .root--compact .text {
    display: none;
  }

  /* row: horizontal cards with icon inline-start */
  .root--row .item {
    flex-direction: row;
    align-items: flex-start;
    text-align: start;
  }
  .root--row.root--center .item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
`;
