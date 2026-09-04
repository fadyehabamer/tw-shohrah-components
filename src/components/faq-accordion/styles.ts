import { css } from 'lit';

export const styles = css`
  .root {
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
  }
  .search {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 32rem;
  }
  .search svg {
    position: absolute;
    inset-inline-start: 0.875rem;
    color: var(--sh-muted);
    pointer-events: none;
  }
  .search input {
    width: 100%;
    min-height: 2.875rem;
    padding: 0.5rem 2.75rem;
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    color: var(--sh-text);
    font: inherit;
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  .search input:focus-visible {
    border-color: var(--sh-primary);
    box-shadow: var(--sh-focus);
    outline: none;
  }
  .search .clear {
    position: absolute;
    inset-inline-end: 0.375rem;
    width: 2.125rem;
    height: 2.125rem;
    border: 0;
    background: transparent;
  }
  .count {
    color: var(--sh-muted);
    font-size: 0.85rem;
    margin: -0.5rem 0 0;
  }
  .list {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .list--cards {
    gap: 0.75rem;
  }
  @media (min-width: 768px) {
    .list--two_columns {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: calc(var(--sh-space) * 2);
    }
  }
  .item {
    position: relative;
  }
  .list--dividers .item {
    border-block-end: 1px solid var(--sh-border);
  }
  .list--cards .item {
    border: 1px solid var(--sh-border);
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    transition: border-color var(--sh-ease), box-shadow var(--sh-ease);
  }
  .list--cards .item[data-open='true'] {
    border-color: color-mix(in srgb, var(--sh-primary) 45%, var(--sh-border));
    box-shadow: var(--sh-shadow);
  }
  .trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0.25rem;
    border: 0;
    background: transparent;
    text-align: start;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.02rem;
    line-height: 1.6;
    border-radius: var(--sh-radius-sm);
    transition: color var(--sh-ease);
  }
  .list--cards .trigger {
    padding: 1rem 1.125rem;
  }
  .trigger:hover {
    color: var(--sh-primary);
  }
  .trigger[aria-expanded='true'] {
    color: var(--sh-primary);
  }
  .indicator {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    color: var(--sh-muted);
    transition: transform var(--sh-ease), color var(--sh-ease), background-color var(--sh-ease);
  }
  .indicator svg {
    width: 1.1rem;
    height: 1.1rem;
  }
  .trigger[aria-expanded='true'] .indicator {
    color: var(--sh-primary);
    background: color-mix(in srgb, var(--sh-primary) 10%, transparent);
  }
  .trigger[aria-expanded='true'] .indicator--plus {
    transform: rotate(45deg);
  }
  .trigger[aria-expanded='true'] .indicator--chevron {
    transform: rotate(180deg);
  }
  .indicator--arrow {
    transform: rotate(90deg);
  }
  .trigger[aria-expanded='true'] .indicator--arrow {
    transform: rotate(-90deg);
  }
  .panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .panel[data-open='true'] {
    grid-template-rows: 1fr;
  }
  .panel > div {
    overflow: hidden;
    min-height: 0;
  }
  .answer {
    margin: 0;
    padding: 0 0.25rem 1.125rem;
    color: var(--sh-muted);
    white-space: pre-line;
    font-size: 0.97rem;
  }
  .list--cards .answer {
    padding: 0 1.125rem 1.125rem;
  }
  .contact {
    display: flex;
    justify-content: center;
    padding-block-start: 0.5rem;
  }
  mark {
    background: color-mix(in srgb, var(--sh-primary) 18%, transparent);
    color: inherit;
    border-radius: 2px;
    padding: 0 0.1em;
  }
`;
