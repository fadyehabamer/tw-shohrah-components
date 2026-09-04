import { css } from 'lit';

export const styles = css`
  .root {
    --ts-per-view: 1;
    --ts-gap: 1rem;
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
  }
  @media (min-width: 768px) {
    .root {
      --ts-per-view: var(--ts-desktop, 3);
    }
  }
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }
  .head .sh-header {
    margin: 0;
  }
  .controls {
    display: flex;
    gap: 0.5rem;
    flex: none;
  }
  .track {
    display: flex;
    gap: var(--ts-gap);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 4px;
    margin: -4px;
    -webkit-overflow-scrolling: touch;
  }
  .track::-webkit-scrollbar {
    display: none;
  }
  .track:focus-visible {
    box-shadow: var(--sh-focus);
    border-radius: var(--sh-radius);
  }
  .slide {
    flex: 0 0 calc((100% - (var(--ts-per-view) - 1) * var(--ts-gap)) / var(--ts-per-view));
    scroll-snap-align: start;
    display: flex;
    min-width: 0;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    width: 100%;
    padding: 1.375rem 1.375rem 1.25rem;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    transition: transform var(--sh-ease), box-shadow var(--sh-ease);
  }
  .card--elevated {
    box-shadow: var(--sh-shadow);
    border: 1px solid transparent;
  }
  .card--outlined {
    border: 1px solid var(--sh-border);
  }
  .card--plain {
    background: transparent;
    padding-inline: 0.25rem;
  }
  .card--center {
    text-align: center;
    align-items: center;
  }
  .quote-icon {
    color: var(--sh-primary);
    opacity: 0.55;
  }
  .quote-icon svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  .stars {
    display: inline-flex;
    gap: 2px;
    color: #f59e0b;
  }
  .stars svg {
    width: 1rem;
    height: 1rem;
  }
  .stars .off {
    color: var(--sh-border);
  }
  .quote {
    margin: 0;
    flex: 1;
    font-size: 1rem;
    line-height: 1.85;
    color: var(--sh-text);
  }
  .person {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-block-start: auto;
  }
  .card--center .person {
    flex-direction: column;
    gap: 0.375rem;
  }
  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    flex: none;
    object-fit: cover;
    background: color-mix(in srgb, var(--sh-primary) 12%, var(--sh-surface));
    color: var(--sh-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.95rem;
  }
  .who {
    display: flex;
    flex-direction: column;
    line-height: 1.4;
    min-width: 0;
  }
  .name {
    font-weight: 700;
    font-size: 0.95rem;
  }
  .meta {
    color: var(--sh-muted);
    font-size: 0.85rem;
  }
  .dots {
    display: flex;
    justify-content: center;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--sh-border);
    cursor: pointer;
    transition: width var(--sh-ease), background-color var(--sh-ease);
  }
  .dot[aria-current='true'] {
    width: 1.5rem;
    border-radius: 999px;
    background: var(--sh-primary);
  }
  .dot:focus-visible {
    box-shadow: var(--sh-focus);
  }
`;
