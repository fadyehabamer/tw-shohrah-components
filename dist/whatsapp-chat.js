import { LitElement as n, css as c, html as h } from "lit";
import { property as l } from "lit/decorators.js";
var d = Object.defineProperty, f = (p, i, o, m) => {
  for (var t = void 0, e = p.length - 1, r; e >= 0; e--)
    (r = p[e]) && (t = r(i, o, t) || t);
  return t && d(i, o, t), t;
};
const s = class s extends n {
  render() {
    return h`
      <div class="whatsapp-chat">
        <h3 class="whatsapp-chat-title">${this.config?.title || "Whatsapp Chat"}</h3>
        <div class="whatsapp-chat-content">
          ${this.config?.content || "This is a new Whatsapp Chat component"}
        </div>
      </div>
    `;
  }
};
s.styles = c`
    :host {
      display: block;
    }
    .whatsapp-chat {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .whatsapp-chat-title {
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 1rem;
    }
    .whatsapp-chat-content {
      color: #666;
    }
  `;
let a = s;
f([
  l({ type: Object })
], a.prototype, "config");
typeof a < "u" && a.registerSallaComponent("salla-whatsapp-chat");
export {
  a as default
};
