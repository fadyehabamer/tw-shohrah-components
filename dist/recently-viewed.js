import { LitElement as c, css as d, html as a } from "lit";
import { property as p } from "lit/decorators.js";
var v = Object.defineProperty, f = (n, o, l, y) => {
  for (var e = void 0, i = n.length - 1, s; i >= 0; i--)
    (s = n[i]) && (e = s(o, l, e) || e);
  return e && v(o, l, e), e;
};
const r = class r extends c {
  render() {
    return a`
      <div class="recently-viewed">
        <h3 class="recently-viewed-title">${this.config?.title || "Recently Viewed"}</h3>
        <div class="recently-viewed-content">
          ${this.config?.content || "This is a new Recently Viewed component"}
        </div>
      </div>
    `;
  }
};
r.styles = d`
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
let t = r;
f([
  p({ type: Object })
], t.prototype, "config");
typeof t < "u" && t.registerSallaComponent("salla-recently-viewed");
export {
  t as default
};
