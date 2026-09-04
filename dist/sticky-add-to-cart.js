import { LitElement as d, css as n, html as l } from "lit";
import { property as p } from "lit/decorators.js";
var f = Object.defineProperty, y = (r, a, s, h) => {
  for (var t = void 0, i = r.length - 1, c; i >= 0; i--)
    (c = r[i]) && (t = c(a, s, t) || t);
  return t && f(a, s, t), t;
};
const o = class o extends d {
  render() {
    return l`
      <div class="sticky-add-to-cart">
        <h3 class="sticky-add-to-cart-title">${this.config?.title || "Sticky Add To Cart"}</h3>
        <div class="sticky-add-to-cart-content">
          ${this.config?.content || "This is a new Sticky Add To Cart component"}
        </div>
      </div>
    `;
  }
};
o.styles = n`
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
let e = o;
y([
  p({ type: Object })
], e.prototype, "config");
typeof e < "u" && e.registerSallaComponent("salla-sticky-add-to-cart");
export {
  e as default
};
