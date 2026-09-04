import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export default class RecentlyViewed extends LitElement {
  @property({ type: Object })
  config?: Record<string, any>;

  static styles = css`
    :host {
      display: block;
    }
    .recently-viewed {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .recently-viewed-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .recently-viewed-content {
      color: #666;
    }
  `;

  render() {
    return html`
      <div class="recently-viewed">
        <h3 class="recently-viewed-title">${this.config?.title || 'Recently Viewed'}</h3>
        <div class="recently-viewed-content">
          ${this.config?.content || 'This is a new Recently Viewed component'}
        </div>
      </div>
    `;
  }
}
