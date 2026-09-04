# Shohrah Components — عناصر شهرة

A Salla Twilight **theme component bundle** of 13 conversion-booster components. Every component is a standalone Lit web component that any Twilight theme can drop in, fully configurable from the theme editor, Arabic-first with English mirrored, and styled from the host theme's design tokens.

| # | Component | Tag | What it does |
|---|---|---|---|
| 1 | Offer countdown | `<salla-offer-countdown>` | Fixed-date, daily-reset or per-visitor (evergreen) deadline with a CTA |
| 2 | Sticky add to cart | `<salla-sticky-add-to-cart>` | Scroll-triggered bar with image, price, quantity and add-to-cart |
| 3 | Stock scarcity bar | `<salla-stock-scarcity-bar>` | "Only N left" from live product quantity and sold count |
| 4 | Free shipping meter | `<salla-free-shipping-meter>` | Progress to free shipping, live with the cart |
| 5 | Recently viewed | `<salla-recently-viewed>` | Local viewing history rendered from one product fetch |
| 6 | Trust badges | `<salla-trust-badges>` | Shipping / payment / returns / support reassurance strip |
| 7 | FAQ accordion | `<salla-faq-accordion>` | Accessible accordion with search and optional FAQ schema |
| 8 | Testimonials slider | `<salla-testimonials-slider>` | Scroll-snap carousel of customer quotes with ratings |
| 9 | Announcement ticker | `<salla-announcement-ticker>` | Marquee / rotating / static messages, sticky, dismissible |
| 10 | WhatsApp chat | `<salla-whatsapp-chat>` | Floating button with greeting bubble and working hours |
| 11 | Delivery estimator | `<salla-delivery-estimator>` | Order-by cutoff countdown and arrival window per city, zero requests |
| 12 | Size guide drawer | `<salla-size-guide-drawer>` | Side drawer with size table, cm/in toggle and measuring tips |
| 13 | Before / after slider | `<salla-before-after-slider>` | Draggable, keyboard-accessible image comparison |

Full per-field documentation (ids, types, editor labels, defaults, translation keys) is generated into [docs/FIELD-REFERENCE.md](docs/FIELD-REFERENCE.md). Manual test scripts and the viewport/browser matrix are in [docs/TESTING.md](docs/TESTING.md). The approved build plan is [PLAN.md](PLAN.md).

---

## Install, preview, build

Requirements: Node ≥ 18, **pnpm** ≥ 9 (the Salla toolchain refuses npm/yarn).

```bash
pnpm install
pnpm run dev        # demo shell with all components, AR/EN + desktop/mobile toggles, editor form per component
pnpm run build      # dist/<component>.js — one standalone ES module per component
pnpm run typecheck  # tsc --noEmit
```

Vite prints the local URL; the demo shell is served at `/node_modules/.salla-temp/index.html` (Vite opens it automatically). The demo injects Raed-style theme tokens (`--color-primary`, `--font-main`, `--s-radius`, …) so components render as they would inside a real theme.

### Adding or removing a component

Always go through the generator so `twilight-bundle.json` stays consistent:

```bash
pnpm tw-create-component <kebab-name>   # scaffolds src/components/<name>/index.ts + manifest entry with a UUID key
pnpm tw-delete-component <kebab-name>   # removes both
node scripts/apply-manifest.mjs <name> <entry.json>   # merge an enriched field schema, keeping name + key
node scripts/gen-field-reference.mjs                  # regenerate docs/FIELD-REFERENCE.md
```

The `key` of a component must never change after publishing: themes reference it.

### Publishing with the Salla CLI

Run from the bundle root while logged in to Salla Partners and GitHub (personal access token):

```bash
salla login
salla bundle create      # (alias: salla bundle c)  — first time only; this repo was created this way
salla bundle list        # (alias: salla bundle l)  — bundles linked to your Partners account
salla bundle publish     # rechecks, commits, and submits the bundle for marketplace review
salla bundle delete      # (alias: salla bundle d)  — pick a bundle to delete
```

Before publishing: run `pnpm run build`, replace the placeholder `image` URLs in `twilight-bundle.json` with real screenshots hosted on Salla's CDN, and set `support_url` (currently the GitHub repo).

---

## Architecture

```
twilight-bundle.json          manifest: bundle info + 13 components with their editable fields
vite.config.ts                Salla transform/build/demo plugins + a resolver that inlines src/shared into each component
src/
  types/salla.d.ts            narrow typing of the Twilight SDK surface used
  shared/                     inlined into every component at build time (no shared chunk on the CDN)
    base.ts                   ShohrahElement: config getters, SDK readiness, i18n, cleanup registry, theme fallbacks
    i18n.ts                   pick() for {ar,en} values, registerMessages() via salla.lang.addBulk, translate()
    tokens.ts                 :host design tokens + primitives (buttons, skeleton, focus ring, reduced motion)
    salla.ts                  SDK wrappers: product/cart fetches (cached), cart events, storage, theme colours
    format.ts                 money(), num(), clamp(), priceOf()
    icons.ts                  inline SVG icons + Salla icon-font helper
  components/<name>/
    index.ts                  default-exported LitElement (registered as salla-<name> by the transform plugin)
    styles.ts · types.ts · locale.ts
scripts/                      apply-manifest.mjs, gen-field-reference.mjs
docs/                         FIELD-REFERENCE.md (generated), TESTING.md
```

### How a component receives settings

The storefront renders `<salla-custom-component component-name="x" config='{…}'>`; the Twilight runtime swaps it for `<salla-x>` and copies the attributes. Each component reads `config` (a Lit object property) through defensive getters (`str`, `bool`, `num`, `choice`, `list`, `link`, `color`) so a missing or malformed value always falls back to a sensible default. Multilanguage fields arrive flattened to the active language by the server; the `pick()` helper also accepts the raw `{ar, en}` object.

### Design tokens

Every component resolves its tokens in this order: host theme variable → runtime value from `salla.config` (mirrored onto the host as `--shohrah-*` when the page defines no `--color-primary`) → static fallback.

| Token | Theme variable | Static fallback |
|---|---|---|
| `--sh-primary` | `--color-primary` | `#1f5c5a` |
| `--sh-primary-dark` / `-light` | `--color-primary-dark` / `-light` | derived |
| `--sh-on-primary` | `--color-primary-reverse` | `#ffffff` |
| `--sh-font` | `--font-main` | Arabic system stack |
| `--sh-radius` | `--s-radius` | `.75rem` |
| `--sh-surface`, `--sh-text`, `--sh-muted`, `--sh-border`, `--sh-shadow`, `--sh-space` | `--shohrah-*` overrides | neutral palette |

Themes can retune any component by setting `--shohrah-*` on an ancestor or by styling the exposed `part` names.

### Localization

- Component strings live in each `locale.ts` with `ar` and `en`, registered as `shohrah.<component>.<key>` through `salla.lang.addBulk` after the store translations load, and read with `salla.lang.get()` so a theme can override them with `salla.lang.set()`.
- Merchant text (titles, CTAs, messages) are `multilanguage` fields with Arabic and English defaults; placeholders such as `{amount}`, `{qty}`, `{time}` are replaced at render time. Numbers pass through `salla.helpers.number()` and money through `salla.money()`.
- Editor labels are Arabic (Salla's form builder supports one label per field).

### Data and performance

- Only Twilight SDK calls: `product.api.getDetails`, `product.api.fetch({source:'selected'})`, `cart.api.latest`, `cart.addItem`, `cart::updated`, `salla.config`, `salla.storage`, `salla.lang`, `salla.money`. No raw fetches, no third-party requests. The WhatsApp button is a link the visitor clicks, not a request made by the component.
- At most one SDK request per component instance; product details are cached for 5 minutes in session storage; cart-driven components subscribe to events instead of polling.
- `lit` is external (provided by Twilight). Built sizes per component: 25–32 KB minified, 8.4–10 KB gzipped.
- Every component removes its listeners, timers and observers on disconnect.

### States and accessibility

Every component handles loading (skeleton, `aria-busy`), empty (inline hint, never blank), error (quiet inline message, `shohrah:error` event), success and disabled. The host reflects `data-phase="loading|ready|empty|error"` for theme styling. Controls are keyboard reachable with visible focus rings; icon-only buttons carry `aria-label`; sliders, progress bars, dialogs and carousels use the matching ARIA roles; `prefers-reduced-motion` disables marquee, pulse and auto-rotation.

---

## Component reference

Fields for each component are in [docs/FIELD-REFERENCE.md](docs/FIELD-REFERENCE.md). Below: public properties, events, slots and CSS parts. All events are `CustomEvent`s that bubble and cross shadow boundaries; `shohrah:ready` and `shohrah:error` ({ message }) are emitted by every component.

### `offer-countdown`
Properties `config`, `mode` (`fixed_date|daily|evergreen`), `deadline` (ISO). Events `shohrah:countdown-expired`, `shohrah:cta-click` ({ href }). Slots `title`, `subtitle`, `cta`, `expired`. Parts `root`, `title`, `subtitle`, `timer`, `unit`, `digits`, `label`, `cta`, `expired`. Evergreen deadlines are stored per visitor under `shohrah.countdown.evergreen.*`.

### `sticky-add-to-cart`
Properties `config`, `productId`, `position` (`bottom|top`, reflected), `visible` (reflected), `showOn` (`all|mobile|desktop`, reflected). Events `shohrah:add-to-cart` ({ productId, quantity, ok }), `shohrah:options-required` ({ productId }), `shohrah:visibility` ({ visible }). Slots `button`, `extra`. Parts `bar`, `image`, `name`, `price`, `quantity`, `button`. Reads the product from `page.id` on product pages or from the `product` field.

### `stock-scarcity-bar`
Properties `config`, `productId`. Events `shohrah:stock-loaded` ({ productId, quantity, sold, shown }). Slot `title`. Parts `root`, `icon`, `title`, `message`, `bar`, `fill`, `sold`. Renders nothing when quantity is above the threshold or hidden by the store.

### `free-shipping-meter`
Properties `config`, `threshold`, `meterStyle` (`bar|pill|line`). Events `shohrah:cart-progress` ({ subtotal, threshold, percent }), `shohrah:free-shipping-reached`. Slot `cta`. Parts `root`, `icon`, `message`, `bar`, `fill`, `amounts`, `cta`. `threshold_override = 0` uses the store's own free-shipping threshold from the cart.

### `recently-viewed`
Properties `config`, `layout` (`slider|grid`), `limit`. Events `shohrah:products-loaded` ({ count }), `shohrah:add-to-cart` ({ productId, ok }), `shohrah:history-cleared`. Slots `title`, `subtitle`, `empty`. Parts `root`, `title`, `subtitle`, `list`, `card`, `image`, `name`, `price`, `add`, `clear`, `empty`. History (product ids + timestamps only) lives in `shohrah.recently_viewed`.

### `trust-badges`
Properties `config`, `layout` (`row|grid|compact`), `align`, `iconStyle`, `background`. Event `shohrah:badge-click` ({ index, title, href }). Slot `title`. Parts `root`, `title`, `item`, `icon`, `badge-title`, `badge-text`.

### `faq-accordion`
Properties `config`, `allowMultiple`, `layout` (`list|two_columns|cards`), `iconStyle`. Events `shohrah:faq-toggle` ({ index, open, question }), `shohrah:faq-search` ({ query, results }). Slots `title`, `subtitle`, `contact`. Parts `root`, `title`, `subtitle`, `search`, `item`, `trigger`, `panel`, `answer`, `contact`. `schema_markup` (off by default) adds a `FAQPage` JSON-LD script built from the merchant's own text.

### `testimonials-slider`
Properties `config`, `autoplay`, `cardStyle`. Event `shohrah:slide-change` ({ index }). Slots `title`, `subtitle`. Parts `root`, `title`, `subtitle`, `track`, `slide`, `card`, `quote`, `name`, `prev`, `next`, `dots`.

### `announcement-ticker`
Properties `config`, `mode` (`marquee|rotate|static`), `sticky` (reflected), `paused`. Events `shohrah:dismiss`, `shohrah:announcement-click` ({ index, text, href }). Parts `root`, `message`, `dismiss`, `toggle`. Dismissal is remembered for the session.

### `whatsapp-chat`
Properties `config`, `number`, `position` (`start|end`, reflected), `showOn` (reflected). Events `shohrah:whatsapp-open` ({ href, online }), `shohrah:greeting-dismiss`. Slot `greeting`. Parts `root`, `button`, `label`, `bubble`, `greeting-title`, `greeting-text`, `greeting-cta`. Falls back to the store's WhatsApp number from `store.contacts.whatsapp`.

### `delivery-estimator`
Properties `config`, `city`. Events `shohrah:city-change` ({ city }), `shohrah:delivery-estimated` ({ city, from, to, beforeCutoff }). Slots `title`, `subtitle`. Parts `root`, `title`, `subtitle`, `select`, `result`, `dates`, `cutoff`. Business-day arithmetic runs in the merchant's timezone; no network.

### `size-guide-drawer`
Properties `config`, `open` (reflected), `unit` (`cm|in`). Events `shohrah:size-guide-open`, `shohrah:size-guide-close`, `shohrah:unit-change` ({ unit }). Slots `button`, `extra`. Parts `trigger`, `drawer`, `title`, `subtitle`, `table`, `tips`, `close`. Dialog semantics with focus trap, `Esc`, and body scroll lock.

### `before-after-slider`
Properties `config`, `position` (0–100), `beforeSrc`, `afterSrc`. Event `shohrah:compare-change` ({ position }). Slots `title`, `subtitle`, `hint`. Parts `root`, `title`, `subtitle`, `stage`, `before`, `after`, `handle`, `label-before`, `label-after`, `hint`. With only an "after" image the "before" side shows it desaturated.

---

## Notes for reviewers and theme developers

- No global components (no header/footer); every component works alone and makes no assumption about the host theme.
- Components with product context (`sticky-add-to-cart`, `stock-scarcity-bar`) read the current product on product pages and otherwise use the merchant-selected product; without either they show an inline hint instead of breaking.
- `recently-viewed` is empty for a first-time visitor by design; set `empty_behavior = message` to show a message instead of hiding.
- `free-shipping-meter` ships with a 200 SAR default so it renders on first install; set `threshold_override` to 0 to follow the store setting.
- Storage keys are namespaced `shohrah.*` and hold only product ids, a dismissal flag, a chosen city, a greeting flag and an evergreen deadline. No cookies, no personal data.
- Placeholder preview images (`image` in the manifest) must be replaced with real screenshots before marketplace submission.
