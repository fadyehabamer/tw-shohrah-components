# Shohrah Components — Build Plan

Bundle: **Shohrah Components** (`tw-shohrah-components`, already created by Salla CLI in this repo).
Status: **approved and built** (2026-09-05). The ten components below plus three added on request (`delivery-estimator`, `size-guide-drawer`, `before-after-slider`, modelled on the nyx-commerce-lib reference) are implemented; see README.md and docs/. Decisions taken from the open questions: Arabic editor labels (option A), FAQ JSON-LD off by default, GitHub repo as placeholder `support_url`.

---

## 0. Decisions for the placeholders you left blank

| Placeholder | Chosen value | Why |
|---|---|---|
| Theme / niche | **Conversion boosters** (storefront-agnostic) | Sells to every merchant regardless of vertical; nothing here ships in any Salla theme by default. |
| N | **10** | Enough to justify a paid bundle, well under the 15 cap, and every item is distinct. |
| Mood | **Restrained premium** ("minimal luxury"): hairline borders, soft radii, one accent used sparingly, 180 ms ease-out | Blends into any theme instead of looking bolted on. |
| Language | Arabic (RTL) primary, English mirrored | As requested. |

---

## 1. Proposed component set (10)

| # | Component (`name` → tag) | One-line justification |
|---|---|---|
| 1 | `offer-countdown` → `<salla-offer-countdown>` | Urgency banner with fixed-date, daily-reset, or evergreen (per-visitor) deadline and a CTA. Themes ship a bare `salla-count-down` digit widget, not a configurable offer block. |
| 2 | `sticky-add-to-cart` → `<salla-sticky-add-to-cart>` | Bottom bar with image, price, quantity, CTA that appears after scrolling on the product page. The single highest-ROI add-on merchants ask for. |
| 3 | `stock-scarcity-bar` → `<salla-stock-scarcity-bar>` | "Only 3 left" bar driven by live product quantity and sold count. Scarcity is a proven lift and no theme shows it well. |
| 4 | `free-shipping-meter` → `<salla-free-shipping-meter>` | "Add 40 SAR more for free shipping" progress meter fed by the cart's `free_shipping_bar`. Raises average order value directly. |
| 5 | `recently-viewed` → `<salla-recently-viewed>` | Local history of viewed products rendered as a slider/grid via one `product.api.fetch` call. Recovers abandoned browsing. |
| 6 | `trust-badges` → `<salla-trust-badges>` | Icon + title + text strip (shipping, secure payment, returns, support). Cheap reassurance next to CTAs. |
| 7 | `faq-accordion` → `<salla-faq-accordion>` | Accessible accordion with search and optional FAQ schema. Cuts support tickets, boosts product-page SEO. |
| 8 | `testimonials-slider` → `<salla-testimonials-slider>` | Curated customer quotes with stars and avatars. Social proof the merchant controls (distinct from the review widget). |
| 9 | `announcement-ticker` → `<salla-announcement-ticker>` | Marquee/rotating messages with links, dismissible, sticky. Promo codes, shipping thresholds, launches. |
| 10 | `whatsapp-chat` → `<salla-whatsapp-chat>` | Floating WhatsApp button with greeting bubble, working hours, prefilled message. Defaults to the store's own WhatsApp number from config. |

Alternates if you want to swap any: `delivery-estimator` (order-by cutoff → arrival window, zero requests), `size-guide-drawer`, `before-after-slider`, `product-image-zoom`, `back-to-top`.

Uniqueness check: no two components share a purpose, none is a header/footer, none depends on another, and none reuses a built-in `salla-*` tag name (verified against the 76 tags in the Twilight loader registry).

---

## 2. Verified platform facts the plan relies on

Everything below was read from the installed `@salla.sa/twilight-bundles@0.1.63`, the official starter kit `0.1.57`, `@salla.sa/twilight@2.14.572` type declarations, Salla's form-builder script, the Raed theme source, and docs.salla.dev. Nothing is assumed from memory.

- **Registration**: `sallaTransformPlugin` appends `Class.registerSallaComponent('salla-<dir-name>')` to every `src/components/*/index.ts`. The `default export` class name is irrelevant; the folder name is the tag.
- **Build**: `sallaBuildPlugin` builds one ES module per component into `dist/<name>.js` with `lit` marked external. The storefront loads `https://cdn.assets.salla.network/themes/:bundle/latest/:component.js`.
- **Runtime**: the theme renders `<salla-custom-component component-name="x" config='{...json...}'>`; the runtime swaps it for our element and copies all attributes, so we read `config` as a Lit `@property({type: Object})`.
- **Manifest** (`twilight-bundle.json`): component keys are `title`, `icon` (sicon-*), `name`, `key` (UUID from generator, must never change), `image` (preview URL), `fields[]`. Verified field types/formats:
  - `string`: `text`, `textarea`, `email`, `url`, `password`, `color`, `image`, `icon`, `date`, `time`, `datetime`, `hidden`; `multilanguage: true` makes a text/textarea per language.
  - `number`: `integer`, `float`, `units` (+`unit`), `slider` (+`minimum`, `maximum`, `step`).
  - `boolean`: `checkbox`, `switch`.
  - `items`: `dropdown-list`, `radio-list`, `checkbox-list` (with `source: "Manual"` + `options[]` + `selected[]`, `multichoice`), sources `products`, `categories`, `brands`, `pages`, `blog_articles`, `blog_categories`, `special_offers`, `branches`, `products_tags`, and `variable-list` with `source: "custom"` + `sources[]` for links.
  - `collection`: nested `fields[]`, `minLength`, `maxLength`, `item_label`, `value: [...]`.
  - `static`: `title`, `description`, `line` (section headers/dividers inside the editor).
  - Common attributes: `id`, `label`, `description`, `placeholder`, `required`, `value`, `minLength`, `maxLength`, `icon`, `hide`, `class`.
- **Label language**: the form-builder accepts **one string** per `label`. There is no `{ar, en}` label object. See Open Question 1.
- **Multilanguage values**: the form-builder stores `{ "ar": "...", "en": "..." }` for `multilanguage: true` fields (also inside collections). Components must accept both an object and a plain string (in case the server resolves it).
- **SDK surface used** (all present in `@salla.sa/twilight` types):
  `salla.onReady()`, `salla.lang.onLoaded()/get()/add()/addBulk()/getLocale()`, `salla.config.get()` with keys `page.id`, `page.slug`, `store.contacts.whatsapp`, `store.name`, `store.settings`, `theme.color.primary/text/reverse_text/is_dark`, `user.language_code`, `salla.storage.get/set/remove/getWithTTL/setWithTTL`, `salla.product.api.getDetails(id, withItems[])`, `salla.product.api.fetch({source:'selected', source_value:[ids], limit})`, `salla.cart.api.latest()`, `salla.cart.event.onUpdated(cb)`, `salla.cart.addItem({id, quantity})`, `salla.event.on/off`, `salla.money()`, `salla.helpers.number()`, `salla.url.get()`, `salla.url.is_page('product.single')`, `salla.log()`, `salla.error()`.
- **Translations**: `salla.lang.add(key, {ar, en})` writes into the active locale tables, but `setMessages()` replaces the tables when store translations finish loading. So keys must be registered **after** `await salla.lang.onLoaded()`. `get()` falls back to `en` automatically.
- **Theme tokens** (Raed master layout, the reference theme): `--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-primary-reverse`, `--font-main`, `--s-radius`. The `<html>` carries `dir` and `lang`.
- **Demo**: `sallaDemoPlugin` renders every component in a grid, has a built-in AR/EN toggle that flips `dir`/`lang` and calls `Salla.lang.setLocale`, loads the real Twilight SDK from the CDN, and accepts `css`, `js`, `grid`, `formbuilder.languages` options. It defines **none** of the theme tokens, so the demo must inject them via `css` to simulate a host theme.
- **CLI**: `salla bundle create` (`c`), `salla bundle list` (`l`), `salla bundle publish`, `salla bundle delete` (`d`). Publish must run from the bundle root while logged into Salla Partners and GitHub (PAT).

---

## 3. File tree

```
twilight-bundle.json               # manifest (generator-managed entries, then enriched fields)
package.json                       # + lit, typescript, tw-* scripts
vite.config.ts                     # 3 Salla plugins + tiny "inline shared modules" resolver + demo css
tsconfig.json
PLAN.md                            # this file
README.md                          # rewritten at the end (field reference, events, slots, CLI)
src/
  types/
    salla.d.ts                     # `Salla`/`salla` global typing (narrow subset we use)
  shared/                          # tiny helpers, INLINED into every component at build (see §5)
    base.ts                        # ShohrahElement: config plumbing, locale, lifecycle cleanup registry
    i18n.ts                        # registerMessages(), t(), pick() for {ar,en} values, dir()
    tokens.ts                      # shared :host token block (CSS `css` tagged template)
    salla.ts                       # whenReady(), getProductId(), safe wrappers around the SDK calls
    format.ts                      # money(), number(), plural helpers
    a11y.ts                        # focus ring styles, reduced-motion media, sr-only
  components/
    offer-countdown/        index.ts  styles.ts  types.ts  locale.ts
    sticky-add-to-cart/     index.ts  styles.ts  types.ts  locale.ts
    stock-scarcity-bar/     index.ts  styles.ts  types.ts  locale.ts
    free-shipping-meter/    index.ts  styles.ts  types.ts  locale.ts
    recently-viewed/        index.ts  styles.ts  types.ts  locale.ts
    trust-badges/           index.ts  styles.ts  types.ts  locale.ts
    faq-accordion/          index.ts  styles.ts  types.ts  locale.ts
    testimonials-slider/    index.ts  styles.ts  types.ts  locale.ts
    announcement-ticker/    index.ts  styles.ts  types.ts  locale.ts
    whatsapp-chat/          index.ts  styles.ts  types.ts  locale.ts
docs/
  TESTING.md                       # per-component manual test scripts + viewport/browser matrix
```

`locale.ts` per component holds its `shohrah.<component>.*` keys with `ar` and `en`, registered via `salla.lang.addBulk` after `onLoaded`. Merchant-editable multilanguage fields override these defaults.

---

## 4. Shared token strategy

Every component defines the same `:host` block (from `shared/tokens.ts`) so it inherits the host theme and never renders unstyled:

```css
:host {
  /* 1. theme tokens → 2. runtime fallback from salla.config theme.color → 3. static fallback */
  --sh-primary:          var(--color-primary,         var(--shohrah-primary, #1f5c5a));
  --sh-primary-dark:     var(--color-primary-dark,    var(--shohrah-primary-dark, #174846));
  --sh-primary-light:    var(--color-primary-light,   var(--shohrah-primary-light, #2f7f7b));
  --sh-on-primary:       var(--color-primary-reverse, var(--shohrah-on-primary, #ffffff));
  --sh-font:             var(--font-main, var(--shohrah-font, "PingARLT", "DINNextLTArabic", system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif));
  --sh-radius:           var(--s-radius, var(--shohrah-radius, .75rem));
  /* semantic, overridable by themes via --shohrah-* */
  --sh-surface:  var(--shohrah-surface, #ffffff);
  --sh-text:     var(--shohrah-text, #1c1c1c);
  --sh-muted:    var(--shohrah-muted, #6b7280);
  --sh-border:   var(--shohrah-border, rgba(0,0,0,.08));
  --sh-shadow:   var(--shohrah-shadow, 0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06));
  --sh-space:    var(--shohrah-space, 1rem);
  --sh-ease:     180ms cubic-bezier(.2,.7,.2,1);
  font-family: var(--sh-font); color: var(--sh-text);
  line-height: 1.7; letter-spacing: 0;      /* Arabic-tuned; LTR gets 1.5 / -0.005em via :host([dir=ltr]) */
  display: block; box-sizing: border-box;
}
```

- On connect, `shared/base.ts` reads `salla.config.get('theme.color.primary'|'theme.color.reverse_text')` and sets `--shohrah-primary`, `--shohrah-on-primary` on the host **only if** `--color-primary` is not defined by the page, so the runtime fallback is real theme data, not a guess.
- Every merchant colour field defaults to "use theme colour" (a boolean) with an explicit colour as secondary.
- Only logical properties (`margin-inline-start`, `inset-inline-end`, `padding-block`, `text-align: start`). Direction is read from `closest('[dir]')`/`document.documentElement.dir`, mirrored to `:host([dir])` for CSS, and re-evaluated on the demo's language toggle via a `MutationObserver` on `<html dir>` (disconnected on cleanup).
- `@media (prefers-reduced-motion: reduce)` disables marquee/pulse/auto-rotate and keeps opacity fades ≤ 150 ms.
- Contrast: all default pairs checked ≥ 4.5:1 (text on surface 13.6:1, muted on surface 5.1:1, white on `#1f5c5a` 7.9:1). Merchant-chosen colours get a runtime contrast check that flips text to dark/light automatically.

---

## 5. Build and independence

- Shared helpers live in `src/shared/`, but Rollup would normally emit them as a separate `shared-*.js` chunk that the CDN path scheme cannot serve. `vite.config.ts` therefore adds a ~25-line local plugin that rewrites `src/shared/*` imports to a per-component virtual id (`\0shared:<component>:<file>`), so each `dist/<name>.js` is fully self-contained. The build step verifies `dist/` contains exactly ten files and no chunk.
- `lit` stays external (as the Salla build plugin dictates); reported sizes exclude it.
- Budget: ≤ 12 KB min per component, ≤ 6 KB gzipped. Anything above gets flagged in the build report.
- Zero third-party runtime dependencies. No fonts, no icon fonts of our own (icons use the theme-provided `sicon-*` classes when a field is of format `icon`, with inline SVG fallbacks for the handful of built-in icons we need).
- Network: at most **one** SDK request per component instance, cached per page in `sessionStorage` through `salla.storage.setWithTTL(…, 'session')` where safe (product details 5 min, recently-viewed list 2 min). Cart-driven components subscribe to `cart::updated` instead of polling.

---

## 6. Localization strategy

1. **Component strings** (labels, ARIA text, empty/error messages, placeholders): `shohrah.<component>.<key>` in `locale.ts`, registered with `salla.lang.addBulk` after `await salla.lang.onLoaded()`, read with `salla.lang.get()`. Fallback to English is built into the SDK.
2. **Merchant text** (titles, CTAs, messages): `multilanguage: true` fields with `value: { "ar": "...", "en": "..." }` defaults. Resolved with `pick(value)`: string → as is; object → `value[locale] ?? value.en ?? value.ar ?? first non-empty`.
3. Placeholders in merchant text use `{amount}`, `{qty}`, `{sold}`, `{store}`, `{product}`, replaced at render time; numbers pass through `salla.helpers.number()` so Arabic digits follow the store setting; money through `salla.money()`.
4. README will list every key per component for translators.

---

## 7. twilight-bundle.json field schema per component

Legend: `ml` = `string` + `multilanguage: true` (value has `ar`/`en`). All `items` radio/dropdown lists are `source: "Manual"`. Every field also gets `icon`, `placeholder`, and `description` in the manifest; omitted here for brevity.

### 7.1 `offer-countdown` — icon `sicon-clock`
| id | type / format | default | notes |
|---|---|---|---|
| `title` | ml text | ar «العرض ينتهي خلال» / en “Offer ends in” | max 80 |
| `subtitle` | ml textarea | ar «خصم حتى ٣٠٪ على تشكيلة مختارة» / en “Up to 30% off selected items” | optional |
| `mode` | items radio-list | `daily` | `fixed_date` · `daily` (resets at local midnight) · `evergreen` (per-visitor) |
| `end_datetime` | string datetime | `2026-12-31T23:59:00` | used by `fixed_date` |
| `evergreen_hours` | number integer | `24` | 1–168, used by `evergreen`; deadline stored per visitor via `salla.storage` |
| `show_days` | boolean switch | `true` | |
| `digit_style` | items radio-list | `boxed` | `boxed` · `minimal` · `pill` |
| `layout` | items radio-list | `inline` | `inline` (text + timer + CTA in a row) · `stacked` |
| `align` | items radio-list | `center` | `start` · `center` |
| `show_cta` | boolean switch | `true` | |
| `cta_text` | ml text | ar «تسوّق العرض» / en “Shop the offer” | |
| `cta_link` | items variable-list (`source: custom`) | `offers_link` | sources: products, categories, brands, pages, special_offers, offers_link, custom |
| `expired_behavior` | items radio-list | `hide` | `hide` · `message` |
| `expired_message` | ml text | ar «انتهى العرض — تابعنا للعروض القادمة» / en “Offer ended — stay tuned” | |
| `use_theme_color` | boolean switch | `true` | |
| `accent_color` | string color | `#1F5C5A` | used when `use_theme_color` is off |
| `background` | items radio-list | `surface` | `transparent` · `surface` · `primary` |
| `pulse_last_hour` | boolean switch | `true` | disabled under reduced motion |

### 7.2 `sticky-add-to-cart` — icon `sicon-cart-add`
| id | type / format | default | notes |
|---|---|---|---|
| `product` | items dropdown-list `source: products` | (empty) | optional override; otherwise `salla.config.get('page.id')` on `product.single` |
| `position` | items radio-list | `bottom` | `bottom` · `top` |
| `show_after_px` | number units (px) | `320` | scroll distance before the bar appears |
| `show_image` | boolean switch | `true` | |
| `show_name` | boolean switch | `true` | |
| `show_price` | boolean switch | `true` | sale + regular price with strike-through |
| `show_quantity` | boolean switch | `true` | quantity stepper respecting `max_quantity` |
| `button_text` | ml text | ar «أضف إلى السلة» / en “Add to cart” | falls back to `product.add_to_cart_label` if emptied |
| `options_hint` | ml text | ar «اختر الخيارات أولًا» / en “Choose options first” | shown for products with options; click scrolls to the product form |
| `out_of_stock_text` | ml text | ar «غير متوفر حاليًا» / en “Out of stock” | button disabled |
| `hide_when_out_of_stock` | boolean switch | `false` | |
| `surface` | items radio-list | `light` | `light` · `dark` · `primary` |
| `shadow` | boolean switch | `true` | |
| `offset_px` | number units (px) | `0` | space for themes with a fixed bottom nav |
| `hide_near_form` | boolean switch | `true` | hides while the native add-to-cart form is in view (IntersectionObserver) |
| `show_on` | items radio-list | `all` | `all` · `mobile` · `desktop` |

### 7.3 `stock-scarcity-bar` — icon `sicon-fire`
| id | type / format | default | notes |
|---|---|---|---|
| `product` | items dropdown-list `source: products` | (empty) | optional override; default `page.id` |
| `threshold` | number integer | `10` | show only when quantity ≤ threshold |
| `bar_max` | number integer | `50` | quantity at which the bar is full |
| `title` | ml text | ar «الكمية محدودة» / en “Limited stock” | |
| `message` | ml text | ar «بقي {qty} فقط — اطلب الآن» / en “Only {qty} left — order now” | `{qty}` placeholder |
| `show_sold` | boolean switch | `true` | needs `can_show_sold` |
| `sold_message` | ml text | ar «تم بيع {sold} قطعة» / en “{sold} sold” | |
| `show_bar` | boolean switch | `true` | |
| `color_mode` | items radio-list | `traffic` | `theme` · `traffic` (green → amber → red) · `custom` |
| `custom_color` | string color | `#C2410C` | |
| `icon` | string icon | `sicon-fire` | |
| `style` | items radio-list | `card` | `card` · `inline` · `minimal` |
| `hide_when_unknown` | boolean switch | `true` | quantity hidden / unlimited → render nothing |
| `animate` | boolean switch | `true` | bar fill animation |

### 7.4 `free-shipping-meter` — icon `sicon-truck`
| id | type / format | default | notes |
|---|---|---|---|
| `threshold_override` | number float | `0` | 0 = use the store's `free_shipping_bar.minimum_amount` |
| `message_empty` | ml text | ar «أضف منتجات واحصل على شحن مجاني فوق {amount}» / en “Add items to unlock free shipping over {amount}” | |
| `message_remaining` | ml text | ar «أضف {amount} للحصول على شحن مجاني» / en “Add {amount} more for free shipping” | |
| `message_reached` | ml text | ar «مبروك! حصلت على شحن مجاني» / en “You’ve unlocked free shipping!” | |
| `show_when_empty` | boolean switch | `true` | |
| `show_amounts` | boolean switch | `true` | subtotal / threshold under the bar |
| `style` | items radio-list | `bar` | `bar` · `pill` · `line` |
| `icon` | string icon | `sicon-truck` | |
| `use_theme_color` | boolean switch | `true` | |
| `bar_color` | string color | `#1F5C5A` | |
| `reached_color` | string color | `#15803D` | |
| `show_cta` | boolean switch | `true` | |
| `cta_text` | ml text | ar «عرض السلة» / en “View cart” | links to `salla.url.get('cart')` |
| `hide_when_reached` | boolean switch | `false` | |
| `celebrate` | boolean switch | `true` | subtle shimmer on reach; off under reduced motion |

### 7.5 `recently-viewed` — icon `sicon-history`
| id | type / format | default | notes |
|---|---|---|---|
| `title` | ml text | ar «شاهدته مؤخرًا» / en “Recently viewed” | |
| `subtitle` | ml text | ar «تابع من حيث توقفت» / en “Pick up where you left off” | |
| `limit` | number integer | `8` | 2–12; single `product.api.fetch` |
| `exclude_current` | boolean switch | `true` | |
| `layout` | items radio-list | `slider` | `slider` · `grid` |
| `columns_desktop` | number integer | `4` | 2–6 |
| `columns_mobile` | number integer | `2` | 1–3 |
| `image_ratio` | items radio-list | `portrait` | `square` · `portrait` · `landscape` |
| `show_price` | boolean switch | `true` | |
| `show_sale_badge` | boolean switch | `true` | |
| `show_add_to_cart` | boolean switch | `true` | `salla.cart.addItem`; products with options link to the product page |
| `add_text` | ml text | ar «أضف» / en “Add” | |
| `show_clear` | boolean switch | `true` | |
| `clear_text` | ml text | ar «مسح السجل» / en “Clear history” | |
| `empty_behavior` | items radio-list | `hide` | `hide` · `message` |
| `empty_message` | ml text | ar «لم تشاهد أي منتجات بعد» / en “You haven’t viewed any products yet” | |
| `storage_days` | number integer | `30` | history TTL |
| `card_style` | items radio-list | `outlined` | `outlined` · `elevated` · `plain` |

### 7.6 `trust-badges` — icon `sicon-shield-check`
| id | type / format | default | notes |
|---|---|---|---|
| `title` | ml text | ar «لماذا تتسوّق معنا؟» / en “Why shop with us?” | optional heading |
| `show_title` | boolean switch | `false` | |
| `items` | collection (1–8), `item_label` «ميزة» | 4 items: شحن سريع · دفع آمن · إرجاع سهل خلال ١٤ يومًا · دعم على مدار الساعة (with en) | sub-fields: `icon` (icon), `title` (ml text), `text` (ml textarea), `link` (variable-list, optional) |
| `layout` | items radio-list | `row` | `row` · `grid` · `compact` |
| `columns_desktop` | number integer | `4` | 2–6 |
| `columns_mobile` | number integer | `2` | 1–2 |
| `icon_style` | items radio-list | `circle` | `outline` · `circle` · `filled` |
| `icon_size` | number units (px) | `28` | 20–48 |
| `align` | items radio-list | `center` | `start` · `center` |
| `dividers` | boolean switch | `true` | |
| `background` | items radio-list | `transparent` | `transparent` · `surface` · `tint` |
| `text_size` | items radio-list | `md` | `sm` · `md` |

### 7.7 `faq-accordion` — icon `sicon-help-circle`
| id | type / format | default | notes |
|---|---|---|---|
| `title` | ml text | ar «الأسئلة الشائعة» / en “Frequently asked questions” | |
| `subtitle` | ml text | ar «كل ما تحتاج معرفته قبل الشراء» / en “Everything you need to know before you buy” | |
| `items` | collection (1–30), `item_label` «سؤال» | 5 Q&As: shipping time · returns · payment methods · order tracking · contact | sub-fields: `question` (ml text), `answer` (ml textarea) |
| `allow_multiple` | boolean switch | `false` | |
| `first_open` | boolean switch | `true` | |
| `icon_style` | items radio-list | `plus` | `plus` · `chevron` · `arrow` |
| `layout` | items radio-list | `list` | `list` · `two_columns` · `cards` |
| `dividers` | boolean switch | `true` | |
| `show_search` | boolean switch | `false` | live filter for long lists |
| `search_placeholder` | ml text | ar «ابحث في الأسئلة…» / en “Search questions…” | |
| `schema_markup` | boolean switch | `false` | FAQPage JSON-LD; off by default (see Open Question 4) |
| `show_contact` | boolean switch | `false` | |
| `contact_text` | ml text | ar «لم تجد إجابتك؟ تواصل معنا» / en “Still have questions? Contact us” | |
| `contact_link` | items variable-list (`source: custom`) | (empty) | pages / custom |

### 7.8 `testimonials-slider` — icon `sicon-star`
| id | type / format | default | notes |
|---|---|---|---|
| `title` | ml text | ar «آراء عملائنا» / en “What our customers say” | |
| `subtitle` | ml text | ar «تجارب حقيقية من متسوقين مثلك» / en “Real experiences from shoppers like you” | |
| `items` | collection (1–20), `item_label` «رأي» | 4 testimonials with name, city, quote, rating | sub-fields: `name` (text), `meta` (ml text, e.g. city/role), `quote` (ml textarea), `rating` (number integer 1–5), `avatar` (image, optional) |
| `autoplay` | boolean switch | `true` | paused on hover/focus; off under reduced motion |
| `interval_seconds` | number integer | `6` | 3–15 |
| `slides_desktop` | number integer | `3` | 1–4 |
| `slides_mobile` | number integer | `1` | 1–2 |
| `loop` | boolean switch | `true` | |
| `show_rating` | boolean switch | `true` | |
| `show_avatar` | boolean switch | `true` | initials fallback |
| `show_quote_icon` | boolean switch | `true` | |
| `card_style` | items radio-list | `elevated` | `elevated` · `outlined` · `plain` |
| `show_arrows` | boolean switch | `true` | |
| `show_dots` | boolean switch | `true` | |
| `align` | items radio-list | `start` | `start` · `center` |

### 7.9 `announcement-ticker` — icon `sicon-megaphone`
| id | type / format | default | notes |
|---|---|---|---|
| `items` | collection (1–10), `item_label` «إعلان» | 3: شحن مجاني فوق ٢٠٠ ر.س · وصل حديثًا · كود خصم WELCOME10 | sub-fields: `text` (ml text), `icon` (icon), `link` (variable-list) |
| `mode` | items radio-list | `marquee` | `marquee` · `rotate` · `static`; reduced motion forces `rotate` with fade |
| `speed_seconds` | number integer | `25` | seconds per marquee loop |
| `rotate_seconds` | number integer | `5` | for `rotate` |
| `pause_on_hover` | boolean switch | `true` | |
| `separator` | items radio-list | `dot` | `dot` · `line` · `icon` · `none` |
| `background` | items radio-list | `primary` | `primary` · `dark` · `light` · `custom` |
| `custom_bg` | string color | `#111827` | |
| `custom_text` | string color | `#FFFFFF` | |
| `height_px` | number units (px) | `40` | 32–56 |
| `font_size` | items radio-list | `sm` | `sm` · `md` |
| `show_icons` | boolean switch | `true` | |
| `sticky` | boolean switch | `false` | |
| `dismissible` | boolean switch | `false` | remembered for the session via `salla.storage` |
| `dismiss_label` | ml text | ar «إغلاق» / en “Dismiss” | ARIA label |

### 7.10 `whatsapp-chat` — icon `sicon-whatsapp`
| id | type / format | default | notes |
|---|---|---|---|
| `number` | string text | (empty) | empty → `salla.config.get('store.contacts.whatsapp')`; none → renders nothing |
| `message` | ml textarea | ar «مرحبًا {store}، لدي استفسار بخصوص {product}» / en “Hi {store}, I have a question about {product}” | `{store}`, `{product}`, `{page}` |
| `include_url` | boolean switch | `true` | appends the current page URL |
| `label` | ml text | ar «تواصل معنا» / en “Chat with us” | |
| `label_mode` | items radio-list | `hover` | `always` · `hover` · `never` (always used as ARIA label) |
| `position` | items radio-list | `end` | `start` · `end` (logical) |
| `offset_bottom` | number units (px) | `24` | |
| `offset_side` | number units (px) | `24` | |
| `size` | items radio-list | `md` | `sm` · `md` · `lg` |
| `color_mode` | items radio-list | `whatsapp` | `whatsapp` · `theme` · `custom` |
| `custom_color` | string color | `#25D366` | |
| `show_on` | items radio-list | `all` | `all` · `mobile` · `desktop` |
| `greeting_enabled` | boolean switch | `true` | |
| `greeting_title` | ml text | ar «مرحبًا 👋» / en “Hello 👋” | |
| `greeting_text` | ml textarea | ar «كيف نقدر نساعدك اليوم؟» / en “How can we help you today?” | |
| `greeting_delay` | number integer | `4` | seconds; shown once per session |
| `avatar` | string image | (empty) | store logo fallback from `store.logo` |
| `hours_enabled` | boolean switch | `false` | |
| `hours_from` | string time | `09:00` | |
| `hours_to` | string time | `22:00` | |
| `offline_text` | ml text | ar «سنعود قريبًا، اترك رسالتك» / en “We’ll be back soon, leave a message” | |
| `pulse` | boolean switch | `true` | off under reduced motion |

---

## 8. Public API conventions (every component)

- **Properties**: `config` (object, from the editor) plus one reactive property per field, typed in `types.ts`, so a theme can also set them as attributes directly.
- **Events** (all `CustomEvent`, `bubbles: true, composed: true`, prefixed `shohrah:`): `shohrah:ready`, `shohrah:error`, plus per component e.g. `shohrah:countdown-expired`, `shohrah:add-to-cart`, `shohrah:faq-toggle`, `shohrah:slide-change`, `shohrah:dismiss`, `shohrah:whatsapp-open`.
- **Slots**: `title`, `subtitle`, `cta`, `empty` where applicable, so themes can override content without forking.
- **CSS parts**: `part="root"`, `part="title"`, `part="item"`, `part="button"`, `part="bar"` for theme-level restyling.
- **States**: `loading` (skeleton with `aria-busy`), `empty`, `error` (quiet inline message, never blank), `success`, `disabled` (`aria-disabled`, no pointer events).
- **Cleanup**: a per-instance disposer list (listeners, timers, observers, SDK event handlers via `salla.event.off`) flushed in `disconnectedCallback`.

---

## 9. Demo configuration

`vite.config.ts`:
```ts
sallaDemoPlugin({
  grid: { columns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', minWidth: '360px' },
  formbuilder: { languages: ['ar', 'en'], defaultLanguage: 'ar' },
  css: `:root{--color-primary:#1f5c5a;--color-primary-dark:#174846;--color-primary-light:#2f7f7b;--color-primary-reverse:#fff;--font-main:"PingARLT";--s-radius:.75rem}`,
})
```
- RTL and LTR: the demo's built-in AR/EN toggle flips `dir`/`lang` and the SDK locale; every component re-renders. Seeded defaults come from the manifest `value`s, so the first paint is never empty.
- Product-bound components (`sticky-add-to-cart`, `stock-scarcity-bar`) use the demo's mock-product panel or the `product` override field.

---

## 10. Assumptions and open questions (please confirm or correct)

1. **Field labels are single strings.** The form-builder has no per-language label. Options: **(A, recommended)** Arabic labels, matching every official Salla theme; **(B)** combined labels like «العنوان · Title». I will go with A unless you say B.
2. **Multilanguage config values** arrive as `{ar, en}` objects (verified in the form-builder). If the server resolves them to a string for the active locale, the `pick()` helper handles that too. No action needed, just noting both paths are covered.
3. **Product id on product pages** comes from `salla.config.get('page.id')` when `salla.url.is_page('product.single')` is true (documented in the SDK types). Everywhere else, the optional `product` field is required or the component hides itself.
4. **FAQ JSON-LD** injects a `<script type="application/ld+json">` built with `JSON.stringify` from merchant text only. Inert, but a strict reviewer may read it as "custom HTML injection", so it defaults **off**. Say if you want it removed entirely.
5. **WhatsApp link** is an outbound `https://wa.me/...` navigation on click, not a network request from the component. It should pass the "no requests to non-Salla domains" rule, but flagging it since it is the only non-Salla URL in the bundle.
6. **Preview images** (`image` per component) will use the generator's Salla CDN placeholder until you provide hosted screenshots; the marketplace listing needs real ones.
7. **`lit` is external** per the Salla build plugin; the storefront supplies it. Reported sizes exclude it.
8. **Shared code is inlined** per component through a local Vite resolve plugin (the only addition to the three Salla plugins), so every `dist/*.js` is standalone.
9. **Author block**: the CLI generated `author_email` / `support_url`; the starter kit uses `author: {name,email,url}`. I will keep the CLI's shape and fill `description` (ar/en) and `support_url`. Tell me the support URL to use.
10. **Storage keys** are namespaced `shohrah.*` in `salla.storage` (localStorage/sessionStorage wrappers). Only product ids, a dismissal flag, and an evergreen deadline are stored. No cookies, no personal data.

---

## 11. Delivery sequence after approval

1. Scaffold: `pnpm tw-create-component <name>` ×10, add `lit`, `typescript`, `tsconfig.json`, `src/shared/*`, `src/types/salla.d.ts`, demo config.
2. One component per pass (order: trust-badges → faq-accordion → announcement-ticker → testimonials-slider → offer-countdown → free-shipping-meter → whatsapp-chat → stock-scarcity-bar → sticky-add-to-cart → recently-viewed), each pass: `index.ts`, `styles.ts`, `types.ts`, `locale.ts`, enriched manifest entry, test script in `docs/TESTING.md`, list of changed files.
3. `pnpm run build`, size table per component, flags.
4. README with field reference, events, slots, keys per component, install/preview steps, and the exact `salla bundle create|list|publish|delete` commands.
