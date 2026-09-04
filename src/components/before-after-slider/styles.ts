import { css } from 'lit';

export const styles = css`
  :host {
    --ba-accent: var(--sh-primary);
    --ba-ratio: 16 / 9;
    --ba-max: 820px;
    --ba-pos: 50%;
  }
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: var(--ba-max);
    margin-inline: auto;
  }
  .stage {
    position: relative;
    width: 100%;
    aspect-ratio: var(--ba-ratio);
    overflow: hidden;
    background: var(--sh-surface-2);
    border: 1px solid var(--sh-border);
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
    cursor: ew-resize;
  }
  .stage--rounded {
    border-radius: var(--sh-radius);
  }
  .img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
  .img--auto-before {
    filter: grayscale(1) brightness(0.92) contrast(0.95);
  }
  .clip {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--ba-pos);
    overflow: hidden;
  }
  .clip .img {
    width: var(--ba-stage-width, 100%);
    max-width: none;
  }
  .tag {
    position: absolute;
    inset-block-start: 0.75rem;
    z-index: 3;
    padding: 0.25rem 0.75rem;
    border-radius: var(--sh-radius-pill);
    background: rgba(15, 23, 42, 0.62);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    backdrop-filter: blur(6px);
    pointer-events: none;
  }
  .tag--after {
    inset-inline-start: 0.75rem;
  }
  .tag--before {
    inset-inline-end: 0.75rem;
  }
  .bar {
    position: absolute;
    inset-block: 0;
    inset-inline-start: var(--ba-pos);
    width: 3px;
    margin-inline-start: -1.5px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.18);
    z-index: 4;
    pointer-events: none;
  }
  .handle {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: var(--ba-pos);
    width: 2.75rem;
    height: 2.75rem;
    margin-inline-start: -1.375rem;
    margin-block-start: -1.375rem;
    border-radius: 50%;
    border: 0;
    padding: 0;
    background: #fff;
    color: var(--ba-accent);
    cursor: ew-resize;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.3);
    z-index: 5;
    transition: transform var(--sh-ease);
  }
  .handle svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .handle:hover {
    transform: scale(1.08);
  }
  .handle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--ba-accent);
  }
  .handle--bar {
    width: 1.5rem;
    height: 3.5rem;
    margin-inline-start: -0.75rem;
    margin-block-start: -1.75rem;
    border-radius: var(--sh-radius-pill);
  }
  .handle--bar svg {
    width: 1rem;
  }
  .hint {
    margin: 0;
    text-align: center;
    color: var(--sh-muted);
    font-size: 0.85rem;
  }
  .stage--dragging .handle {
    transform: scale(1.04);
  }
  @media (max-width: 640px) {
    .handle {
      width: 2.375rem;
      height: 2.375rem;
      margin-inline-start: -1.1875rem;
      margin-block-start: -1.1875rem;
    }
    .tag {
      font-size: 0.72rem;
      padding: 0.2rem 0.6rem;
    }
  }
`;
