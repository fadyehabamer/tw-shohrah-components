# Manual test scripts

Run `pnpm run dev`, open the URL Vite prints (the shell lives at `/node_modules/.salla-temp/index.html`), and use the header bar to switch **AR ↔ EN** (flips `dir`/`lang` and the SDK locale) and **desktop ↔ mobile**. Every component must pass in both directions.

## Matrix

| Viewport | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| 360 px (mobile) | ☐ | ☐ | ☐ (iOS) | ☐ |
| 768 px (tablet) | ☐ | ☐ | ☐ | ☐ |
| 1024 px | ☐ | ☐ | ☐ | ☐ |
| 1440 px | ☐ | ☐ | ☐ | ☐ |

Global checks for every component: no horizontal scroll at 360 px; text never overflows its box in Arabic; `Tab` reaches every control and shows a visible focus ring; with **Reduce motion** on (macOS: System Settings → Accessibility → Display) no marquee/pulse/auto-rotate runs; switching AR/EN re-renders the component's own strings and the merchant text in the other language.

## trust-badges
1. Default render shows 4 badges with icons (Salla icon font when `sicon-*`, inline SVG otherwise).
2. Editor → layout `grid` → icons move above text; `compact` → descriptions hide and items wrap on one line.
3. Set `columns_mobile` 1 at 360 px → single column, dividers hidden.
4. Add a `link` to a badge → whole badge becomes a link; click fires `shohrah:badge-click` (check console with `document.addEventListener('shohrah:badge-click', e => console.log(e.detail))`).
5. Delete all rows → empty hint appears (never blank).

## faq-accordion
1. First item open by default; click another → first closes (single mode). Enable `allow_multiple` → both stay open.
2. Keyboard: focus a question, `ArrowDown`/`ArrowUp`/`Home`/`End` move between questions, `Enter`/`Space` toggle.
3. Enable `show_search`, type "شحن" → list filters, match highlighted, count shows; clear button resets.
4. Screen reader: header `aria-expanded` toggles, panel has `role=region` labelled by its question.
5. Enable `schema_markup` → `document.head` gains one `script[type="application/ld+json"]`; disable → it is removed.

## announcement-ticker
1. Default marquee scrolls toward inline-end in RTL and reverses in LTR after the AR/EN toggle.
2. Hover pauses; the pause button toggles and announces state (`aria-pressed`).
3. Reduce motion on → mode falls back to rotate with fade.
4. `mode = rotate` → messages rotate every `rotate_seconds`; `static` → all messages inline with separators.
5. Enable `dismissible` → close hides the bar; reload → still hidden within the session (sessionStorage); new tab → visible again.
6. `background = custom` with a light colour → text auto-switches to dark for contrast.

## testimonials-slider
1. Autoplay advances every 6 s; hover or focus pauses; tab away (hidden tab) pauses.
2. Arrow buttons move one slide; in RTL the "next" arrow points left visually and moves the track correctly.
3. Dots reflect the current page; clicking a dot jumps.
4. Focus the track and press `ArrowLeft`/`ArrowRight`.
5. Set `slides_desktop` 1 at 1440 px → one full-width card; `slides_mobile` 2 at 360 px → two cards.

## offer-countdown
1. Default `daily` mode counts down to local midnight and rolls over (change device clock to 23:59 to verify).
2. `fixed_date` with a past date and `expired_behavior = message` → expired message; `hide` → component disappears and `shohrah:countdown-expired` fires once.
3. `evergreen` 1 hour → reload keeps the same deadline (localStorage) for this visitor.
4. Last hour → digits pulse unless reduced motion.
5. Toggle `show_days` off → hours absorb the days.

## free-shipping-meter
1. In the demo the cart is the demo store's cart; with an empty cart and `show_when_empty` on you see the empty message with the threshold amount.
2. Set `threshold_override` 0 → uses the store's `free_shipping_bar`; if the store has none, the "not configured" hint shows.
3. Add a product to the cart on a real store → meter updates live via `cart::updated`; reaching the threshold flips to the reached state with a one-time shimmer.
4. `style = pill` hides the bar and amounts; `line` removes the border.
5. `hide_when_reached` on → component disappears once reached.

## recently-viewed
1. Open two product pages on a store, then a page with the component → those products render newest first via one `products` request (check Network: a single `/products?source=selected` call).
2. `exclude_current` on a product page hides that product.
3. Click **Clear history** → list empties and, with `empty_behavior = message`, the empty message shows.
4. Quick add button on a simple product adds to cart and turns green for 2 s; products with options show **View product** instead.
5. `layout = grid` at 360 px shows `columns_mobile` columns; `slider` shows arrows when items exceed `columns_desktop`.

## whatsapp-chat
1. Button floats bottom-inline-end; `position = start` moves it to the other side in both directions.
2. Hover shows the label (`label_mode = hover`); `always` keeps it; `never` leaves an icon-only button with an `aria-label`.
3. Greeting bubble appears after `greeting_delay`, once per session; close it, reload → not shown again in the same session.
4. Enable `hours_enabled` with a window that excludes now → offline text and grey status dot.
5. Click → new tab to `https://wa.me/<digits>?text=…` with the store name, page title and URL prefilled; `shohrah:whatsapp-open` fires.
6. Empty `number` and no store WhatsApp → inline hint (empty state) instead of a button.

## stock-scarcity-bar
1. Place on a product page (or pick a product in the editor) with quantity ≤ `threshold` → bar appears with quantity and colour band.
2. Quantity above threshold → renders nothing; unlimited/hidden quantity → nothing unless `hide_when_unknown` is off.
3. Out of stock → grey "out of stock" message.
4. `color_mode = traffic` → green/amber/red by percentage of `bar_max`.
5. Slow network → skeleton first, then content; SDK failure → quiet inline error.

## sticky-add-to-cart
1. On a product page scroll past `show_after_px` → bar slides in; scroll back → slides out. `shohrah:visibility` fires on each change.
2. When the theme's own add-to-cart area is on screen the bar hides (`hide_near_form`).
3. Quantity stepper respects 1..`max_quantity`; **Add** calls `cart.addItem`, button turns green "Added" for 2 s.
4. Product with options → button reads the options hint and scrolls to the product form.
5. Out of stock → disabled button; `hide_when_out_of_stock` hides the bar.
6. `position = top`, `offset_px` 56 → bar sits below a fixed header.

## delivery-estimator
1. Default shows a city select and a date window; change city → window changes, `shohrah:city-change` fires, reload restores the city (`remember_city`).
2. Before `cutoff_time` (in `timezone`) → "order within …" with the remaining time; after → "orders after … ship next business day".
3. Untick Thursday in `working_days` → windows skip Thursday and Friday.
4. `calendar = islamic-umalqura` → Hijri dates; `date_style = short` → abbreviated.
5. `style = inline` → single compact row.

## size-guide-drawer
1. Click the trigger → drawer slides from inline-end (`drawer_side = start` flips it), focus moves into the drawer, background scroll locks.
2. `Esc` closes and returns focus to the trigger; clicking the overlay closes; `Tab` cycles inside the drawer only.
3. Toggle **cm / in** → numeric cells convert (92 cm → 36.2 in); non-numeric cells stay as typed.
4. Six columns → table scrolls horizontally inside the drawer without breaking the page.
5. Remove all tips → tips section disappears; remove all rows → empty hint inside the drawer.

## before-after-slider
1. Default: same image, "before" side desaturated; drag the handle → clip follows the pointer in both RTL and LTR.
2. Keyboard: focus handle, `ArrowLeft/Right` move 2 %, with `Shift` 10 %, `Home`/`End` jump; `aria-valuenow` updates.
3. Touch at 360 px: horizontal drag moves the handle, vertical swipe still scrolls the page.
4. `ratio = square` and `portrait` keep the frame stable while images load.
5. `hover_move` on → the split follows the mouse without dragging.
