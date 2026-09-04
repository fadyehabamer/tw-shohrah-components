import { css } from 'lit';

export const styles = css`
  .root {
    --rv-cols: 4;
    --rv-cols-mobile: 2;
    --rv-ratio: 3 / 4;
    --rv-gap: 1rem;
    display: flex;
    flex-direction: column;
    gap: var(--sh-space);
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
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: none;
  }
  .clear {
    min-height: 2.25rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(var(--rv-cols-mobile), minmax(0, 1fr));
    gap: var(--rv-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  @media (min-width: 768px) {
    .list {
      grid-template-columns: repeat(var(--rv-cols), minmax(0, 1fr));
    }
  }
  .list--slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 4px;
    margin: -4px;
  }
  .list--slider::-webkit-scrollbar {
    display: none;
  }
  .list--slider .card-wrap {
    flex: 0 0 calc((100% - (var(--rv-cols-mobile) - 1) * var(--rv-gap)) / var(--rv-cols-mobile));
    scroll-snap-align: start;
  }
  @media (min-width: 768px) {
    .list--slider .card-wrap {
      flex-basis: calc((100% - (var(--rv-cols) - 1) * var(--rv-gap)) / var(--rv-cols));
    }
  }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--sh-radius);
    background: var(--sh-surface);
    overflow: hidden;
    transition: transform var(--sh-ease), box-shadow var(--sh-ease), border-color var(--sh-ease);
  }
  .card--outlined {
    border: 1px solid var(--sh-border);
  }
  .card--elevated {
    box-shadow: var(--sh-shadow);
  }
  .card--plain {
    background: transparent;
  }
  .card:hover {
    transform: translateY(-2px);
  }
  .card--outlined:hover {
    border-color: color-mix(in srgb, var(--sh-primary) 40%, var(--sh-border));
  }
  .media {
    position: relative;
    aspect-ratio: var(--rv-ratio);
    background: var(--sh-surface-2);
    overflow: hidden;
    display: block;
  }
  .card--plain .media {
    border-radius: var(--sh-radius);
  }
  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease-out;
  }
  .card:hover .media img {
    transform: scale(1.03);
  }
  .badge {
    position: absolute;
    inset-block-start: 0.5rem;
    inset-inline-start: 0.5rem;
    padding: 0.125rem 0.5rem;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-danger);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 0.75rem 0.875rem 0.875rem;
    flex: 1;
  }
  .card--plain .body {
    padding-inline: 0.125rem;
  }
  .name {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .name a {
    text-decoration: none;
  }
  .name a::after {
    content: '';
    position: absolute;
    inset: 0;
  }
  .name a:hover {
    color: var(--sh-primary);
  }
  .price {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-variant-numeric: tabular-nums;
    font-size: 0.92rem;
  }
  .price .now {
    font-weight: 700;
    color: var(--sh-primary);
  }
  .price .was {
    color: var(--sh-muted);
    text-decoration: line-through;
    font-size: 0.8rem;
  }
  .add {
    position: relative;
    z-index: 1;
    margin-block-start: auto;
    min-height: 2.5rem;
    font-size: 0.88rem;
    width: 100%;
  }
  .add--added {
    background: var(--sh-success) !important;
    color: #fff !important;
    border-color: transparent !important;
  }
  .skel-media {
    aspect-ratio: var(--rv-ratio);
  }
  .skel-line {
    height: 0.9rem;
    width: 80%;
  }
  .skel-line--short {
    width: 45%;
  }
`;
