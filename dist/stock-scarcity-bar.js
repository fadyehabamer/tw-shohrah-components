import { LitElement as n, css as l, html as d } from "lit";
import { property as p } from "lit/decorators.js";
var f = Object.defineProperty, b = (e, i, o, y) => {
  for (var t = void 0, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (t = a(i, o, t) || t);
  return t && f(i, o, t), t;
};
const c = class c extends n {
  render() {
    return d`
      <div class="stock-scarcity-bar">
        <h3 class="stock-scarcity-bar-title">${this.config?.title || "Stock Scarcity Bar"}</h3>
        <div class="stock-scarcity-bar-content">
          ${this.config?.content || "This is a new Stock Scarcity Bar component"}
        </div>
      </div>
    `;
  }
};
c.styles = l`
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
let r = c;
b([
  p({ type: Object })
], r.prototype, "config");
typeof r < "u" && r.registerSallaComponent("salla-stock-scarcity-bar");
export {
  r as default
};
