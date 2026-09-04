import { LitElement as a, css as f, html as l } from "lit";
import { property as c } from "lit/decorators.js";
var d = Object.defineProperty, h = (n, s, p, m) => {
  for (var e = void 0, i = n.length - 1, o; i >= 0; i--)
    (o = n[i]) && (e = o(s, p, e) || e);
  return e && d(s, p, e), e;
};
const r = class r extends a {
  render() {
    return l`
      <div class="free-shipping-meter">
        <h3 class="free-shipping-meter-title">${this.config?.title || "Free Shipping Meter"}</h3>
        <div class="free-shipping-meter-content">
          ${this.config?.content || "This is a new Free Shipping Meter component"}
        </div>
      </div>
    `;
  }
};
r.styles = f`
    :host {
      display: block;
    }
    .free-shipping-meter {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .free-shipping-meter-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .free-shipping-meter-content {
      color: #666;
    }
  `;
let t = r;
h([
  c({ type: Object })
], t.prototype, "config");
typeof t < "u" && t.registerSallaComponent("salla-free-shipping-meter");
export {
  t as default
};
