import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export default class StockScarcityBar extends LitElement {
  @property({ type: Object })
  config?: Record<string, any>;

  static styles = css`
    :host {
      display: block;
    }
    .stock-scarcity-bar {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .stock-scarcity-bar-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .stock-scarcity-bar-content {
      color: #666;
    }
  `;

  render() {
    return html`
      <div class="stock-scarcity-bar">
        <h3 class="stock-scarcity-bar-title">${this.config?.title || 'Stock Scarcity Bar'}</h3>
        <div class="stock-scarcity-bar-content">
          ${this.config?.content || 'This is a new Stock Scarcity Bar component'}
        </div>
      </div>
    `;
  }
}
