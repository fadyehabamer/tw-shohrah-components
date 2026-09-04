import { LitElement as c, css as d, html as a } from "lit";
import { property as l } from "lit/decorators.js";
var p = Object.defineProperty, u = (r, i, f, h) => {
  for (var o = void 0, e = r.length - 1, s; e >= 0; e--)
    (s = r[e]) && (o = s(i, f, o) || o);
  return o && p(i, f, o), o;
};
const n = class n extends c {
  render() {
    return a`
      <div class="offer-countdown">
        <h3 class="offer-countdown-title">${this.config?.title || "Offer Countdown"}</h3>
        <div class="offer-countdown-content">
          ${this.config?.content || "This is a new Offer Countdown component"}
        </div>
      </div>
    `;
  }
};
n.styles = d`
    :host {
      display: block;
    }
    .offer-countdown {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .offer-countdown-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .offer-countdown-content {
      color: #666;
    }
  `;
let t = n;
u([
  l({ type: Object })
], t.prototype, "config");
typeof t < "u" && t.registerSallaComponent("salla-offer-countdown");
export {
  t as default
};
