import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export default class StickyAddToCart extends LitElement {
  @property({ type: Object })
  config?: Record<string, any>;

  static styles = css`
    :host {
      display: block;
    }
    .sticky-add-to-cart {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .sticky-add-to-cart-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .sticky-add-to-cart-content {
      color: #666;
    }
  `;

  render() {
    return html`
      <div class="sticky-add-to-cart">
        <h3 class="sticky-add-to-cart-title">${this.config?.title || 'Sticky Add To Cart'}</h3>
        <div class="sticky-add-to-cart-content">
          ${this.config?.content || 'This is a new Sticky Add To Cart component'}
        </div>
      </div>
    `;
  }
}
