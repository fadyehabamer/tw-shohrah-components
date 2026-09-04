# Field reference

Generated from `twilight-bundle.json` by `scripts/gen-field-reference.mjs` — do not edit by hand.

Bundle: **Shohrah Components** / **عناصر شهرة** — 13 components.

## `offer-countdown` — عدّاد العرض

Tag: `<salla-offer-countdown>` · key: `7eab4953-fafa-4409-aafb-7cbd439998f5` · icon: `sicon-clock` · 18 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `title` | string/text · multilanguage | العنوان | ar: “العرض ينتهي خلال” · en: “Offer ends in” |
| `subtitle` | string/text · multilanguage | الوصف | ar: “خصم حتى ٣٠٪ على تشكيلة مختارة” · en: “Up to 30% off selected items” |
| `mode` | items/radio-list | نوع العدّاد | `daily` |
| `end_datetime` | string/datetime | تاريخ ووقت الانتهاء (للنوع «تاريخ محدد») | `2026-12-31T23:59:00` |
| `evergreen_hours` | number/slider | مدة العدّاد لكل زائر (ساعات) | `24` |
| `show_days` | boolean/switch | إظهار خانة الأيام | `true` |
| `digit_style` | items/radio-list | شكل الأرقام | `boxed` |
| `layout` | items/radio-list | التخطيط | `inline` |
| `align` | items/radio-list | المحاذاة | `center` |
| `background` | items/radio-list | الخلفية | `surface` |
| `use_theme_color` | boolean/switch | استخدام لون الثيم الأساسي | `true` |
| `accent_color` | string/color | لون مخصص (عند إيقاف لون الثيم) | `#1F5C5A` |
| `pulse_last_hour` | boolean/switch | نبض خفيف في الساعة الأخيرة | `true` |
| `show_cta` | boolean/switch | إظهار زر التسوّق | `true` |
| `cta_text` | string/text · multilanguage | نص الزر | ar: “تسوّق العرض” · en: “Shop the offer” |
| `cta_link` | items/variable-list · source: custom | رابط الزر | `offers_link` |
| `expired_behavior` | items/radio-list | عند انتهاء الوقت | `hide` |
| `expired_message` | string/text · multilanguage | رسالة الانتهاء | ar: “انتهى العرض — تابعنا للعروض القادمة” · en: “Offer ended — stay tuned for the next one” |

**Translation keys** (registered as `shohrah.offer-countdown.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `cta`, `expired`, `days`, `hours`, `minutes`, `seconds`, `timer_label`, `remaining_text`, `invalid_date`

## `sticky-add-to-cart` — شريط الإضافة للسلة الثابت

Tag: `<salla-sticky-add-to-cart>` · key: `74c3218d-ce6c-40c5-b14e-88cd97d97c62` · icon: `sicon-cart-add` · 16 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `product` | items/dropdown-list · source: products | المنتج (اختياري) | — (source: products) |
| `position` | items/radio-list | موضع الشريط | `bottom` |
| `show_after_px` | number/units | الظهور بعد التمرير مسافة | `320` |
| `hide_near_form` | boolean/switch | الإخفاء عندما يكون زر الإضافة الأصلي ظاهرًا | `true` |
| `hide_when_out_of_stock` | boolean/switch | الإخفاء عند نفاد الكمية | `false` |
| `offset_px` | number/units | مسافة إضافية من الحافة | `0` |
| `show_on` | items/radio-list | الإظهار على | `all` |
| `show_image` | boolean/switch | إظهار صورة المنتج | `true` |
| `show_name` | boolean/switch | إظهار اسم المنتج | `true` |
| `show_price` | boolean/switch | إظهار السعر | `true` |
| `show_quantity` | boolean/switch | إظهار محدد الكمية | `true` |
| `button_text` | string/text · multilanguage | نص الزر | ar: “أضف إلى السلة” · en: “Add to cart” |
| `options_hint` | string/text · multilanguage | نص الزر للمنتجات ذات الخيارات | ar: “اختر الخيارات أولًا” · en: “Choose options first” |
| `out_of_stock_text` | string/text · multilanguage | نص الزر عند نفاد الكمية | ar: “غير متوفر حاليًا” · en: “Out of stock” |
| `surface` | items/radio-list | خلفية الشريط | `light` |
| `shadow` | boolean/switch | ظل خفيف | `true` |

**Translation keys** (registered as `shohrah.sticky-add-to-cart.<key>`, override with `salla.lang.set()`):

`add`, `adding`, `added`, `failed`, `options`, `out_of_stock`, `quantity`, `increase`, `decrease`, `region_label`, `no_product`, `load_error`

## `stock-scarcity-bar` — مؤشر الكمية المحدودة

Tag: `<salla-stock-scarcity-bar>` · key: `949245cf-6f0e-45ed-b8ec-83b014c495f6` · icon: `sicon-fire` · 14 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `product` | items/dropdown-list · source: products | المنتج (اختياري) | — (source: products) |
| `threshold` | number/integer | إظهار المؤشر عندما تكون الكمية أقل من أو تساوي | `10` |
| `bar_max` | number/integer | الكمية التي يكون عندها الشريط ممتلئًا | `50` |
| `title` | string/text · multilanguage | العنوان الصغير | ar: “الكمية محدودة” · en: “Limited stock” |
| `message` | string/text · multilanguage | الرسالة | ar: “بقي {qty} فقط — اطلب الآن” · en: “Only {qty} left — order now” |
| `show_sold` | boolean/switch | إظهار عدد القطع المباعة | `true` |
| `sold_message` | string/text · multilanguage | نص المبيعات | ar: “تم بيع {sold} قطعة” · en: “{sold} sold” |
| `style` | items/radio-list | الشكل | `card` |
| `show_bar` | boolean/switch | إظهار شريط الكمية | `true` |
| `color_mode` | items/radio-list | لون الشريط | `traffic` |
| `custom_color` | string/color | اللون المخصص | `#C2410C` |
| `icon` | string/icon | الأيقونة | `sicon-fire` |
| `animate` | boolean/switch | حركة خفيفة عند انخفاض الكمية | `true` |
| `hide_when_unknown` | boolean/switch | الإخفاء عندما تكون الكمية غير محدودة أو مخفية | `true` |

**Translation keys** (registered as `shohrah.stock-scarcity-bar.<key>`, override with `salla.lang.set()`):

`title`, `message`, `sold`, `out_of_stock`, `progress_label`, `no_product`, `load_error`

## `free-shipping-meter` — مقياس الشحن المجاني

Tag: `<salla-free-shipping-meter>` · key: `8c3e43f2-d5a5-4d93-8b89-e936458d9c1e` · icon: `sicon-truck` · 15 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `threshold_override` | number/float | حد الشحن المجاني | `200` |
| `message_empty` | string/text · multilanguage | رسالة السلة الفارغة | ar: “أضف منتجات واحصل على شحن مجاني للطلبات فوق {amount}” · en: “Add items to unlock free shipping on orders over {amount}” |
| `message_remaining` | string/text · multilanguage | رسالة المبلغ المتبقي | ar: “أضف {amount} للحصول على شحن مجاني” · en: “Add {amount} more for free shipping” |
| `message_reached` | string/text · multilanguage | رسالة الوصول للحد | ar: “مبروك! حصلت على شحن مجاني” · en: “You’ve unlocked free shipping!” |
| `style` | items/radio-list | الشكل | `bar` |
| `icon` | string/icon | الأيقونة | `sicon-truck` |
| `show_amounts` | boolean/switch | إظهار المبلغ الحالي والحد أسفل الشريط | `true` |
| `use_theme_color` | boolean/switch | استخدام لون الثيم الأساسي | `true` |
| `bar_color` | string/color | لون الشريط المخصص | `#1F5C5A` |
| `reached_color` | string/color | لون الوصول للحد | `#15803D` |
| `show_when_empty` | boolean/switch | الإظهار عند السلة الفارغة | `true` |
| `hide_when_reached` | boolean/switch | الإخفاء بعد الوصول للحد | `false` |
| `celebrate` | boolean/switch | لمعة احتفالية عند الوصول للحد | `true` |
| `show_cta` | boolean/switch | إظهار زر «عرض السلة» | `true` |
| `cta_text` | string/text · multilanguage | نص الزر | ar: “عرض السلة” · en: “View cart” |

**Translation keys** (registered as `shohrah.free-shipping-meter.<key>`, override with `salla.lang.set()`):

`empty`, `remaining`, `reached`, `cta`, `progress_label`, `of`, `unavailable`, `load_error`

## `recently-viewed` — شاهدته مؤخرًا

Tag: `<salla-recently-viewed>` · key: `773009e0-5df4-42bd-a438-af06163b6efc` · icon: `sicon-history` · 18 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `title` | string/text · multilanguage | العنوان | ar: “شاهدته مؤخرًا” · en: “Recently viewed” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “تابع من حيث توقفت” · en: “Pick up where you left off” |
| `limit` | number/slider | عدد المنتجات | `8` |
| `exclude_current` | boolean/switch | استثناء المنتج المعروض حاليًا | `true` |
| `storage_days` | number/slider | مدة الاحتفاظ بالسجل (أيام) | `30` |
| `layout` | items/radio-list | طريقة العرض | `slider` |
| `columns_desktop` | number/slider | عدد الأعمدة على سطح المكتب | `4` |
| `columns_mobile` | number/slider | عدد الأعمدة على الجوال | `2` |
| `image_ratio` | items/radio-list | نسبة الصورة | `portrait` |
| `card_style` | items/radio-list | شكل البطاقة | `outlined` |
| `show_price` | boolean/switch | إظهار السعر | `true` |
| `show_sale_badge` | boolean/switch | إظهار شارة الخصم | `true` |
| `show_add_to_cart` | boolean/switch | إظهار زر الإضافة للسلة | `true` |
| `add_text` | string/text · multilanguage | نص زر الإضافة | ar: “أضف” · en: “Add” |
| `show_clear` | boolean/switch | إظهار زر مسح السجل | `true` |
| `clear_text` | string/text · multilanguage | نص زر المسح | ar: “مسح السجل” · en: “Clear history” |
| `empty_behavior` | items/radio-list | عندما لا يوجد سجل مشاهدة | `hide` |
| `empty_message` | string/text · multilanguage | رسالة الحالة الفارغة | ar: “لم تشاهد أي منتجات بعد” · en: “You haven’t viewed any products yet” |

**Translation keys** (registered as `shohrah.recently-viewed.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `region_label`, `add`, `added`, `view`, `clear`, `empty`, `sale`, `prev`, `next`, `add_to_cart_label`, `load_error`

## `trust-badges` — شريط الثقة

Tag: `<salla-trust-badges>` · key: `5292e7c0-4d49-42a5-8ed9-4dff43bef7fb` · icon: `sicon-shield-check` · 12 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `show_title` | boolean/switch | إظهار العنوان | `false` |
| `title` | string/text · multilanguage | العنوان | ar: “لماذا تتسوّق معنا؟” · en: “Why shop with us?” |
| `items` | collection/collection | المزايا | 4 rows |
| ↳ `items[].icon` | string/icon | الأيقونة | — |
| ↳ `items[].title` | string/text · multilanguage | العنوان | — |
| ↳ `items[].text` | string/textarea · multilanguage | الوصف | — |
| ↳ `items[].link` | items/variable-list · source: custom | الرابط (اختياري) | — (source: custom) |
| `layout` | items/radio-list | التخطيط | `row` |
| `align` | items/radio-list | المحاذاة | `center` |
| `columns_desktop` | number/slider | عدد الأعمدة على سطح المكتب | `4` |
| `columns_mobile` | number/slider | عدد الأعمدة على الجوال | `2` |
| `icon_style` | items/dropdown-list | شكل الأيقونة | `circle` |
| `icon_size` | number/units | حجم الأيقونة | `28` |
| `text_size` | items/radio-list | حجم النص | `md` |
| `dividers` | boolean/switch | فواصل بين المزايا | `true` |
| `background` | items/radio-list | الخلفية | `transparent` |

**Translation keys** (registered as `shohrah.trust-badges.<key>`, override with `salla.lang.set()`):

`title`, `region_label`, `empty`, `default_1_title`, `default_1_text`, `default_2_title`, `default_2_text`, `default_3_title`, `default_3_text`, `default_4_title`, `default_4_text`

## `faq-accordion` — الأسئلة الشائعة

Tag: `<salla-faq-accordion>` · key: `f1d5c76e-b47e-4e75-9853-dc83ff9e7df9` · icon: `sicon-help-circle` · 14 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `title` | string/text · multilanguage | العنوان | ar: “الأسئلة الشائعة” · en: “Frequently asked questions” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “كل ما تحتاج معرفته قبل الشراء” · en: “Everything you need to know before you buy” |
| `items` | collection/collection | الأسئلة | 5 rows |
| ↳ `items[].question` | string/text · multilanguage | السؤال | — |
| ↳ `items[].answer` | string/textarea · multilanguage | الإجابة | — |
| `allow_multiple` | boolean/switch | السماح بفتح أكثر من سؤال | `false` |
| `first_open` | boolean/switch | فتح السؤال الأول تلقائيًا | `true` |
| `show_search` | boolean/switch | إظهار حقل البحث | `false` |
| `search_placeholder` | string/text · multilanguage | نص حقل البحث | ar: “ابحث في الأسئلة…” · en: “Search questions…” |
| `schema_markup` | boolean/switch | إضافة بيانات FAQ المهيكلة لمحركات البحث | `false` |
| `layout` | items/radio-list | التخطيط | `list` |
| `icon_style` | items/radio-list | أيقونة الفتح | `plus` |
| `dividers` | boolean/switch | فواصل بين الأسئلة | `true` |
| `show_contact` | boolean/switch | إظهار زر «تواصل معنا» | `false` |
| `contact_text` | string/text · multilanguage | نص زر التواصل | ar: “لم تجد إجابتك؟ تواصل معنا” · en: “Still have questions? Contact us” |
| `contact_link` | items/variable-list · source: custom | رابط التواصل | — (source: custom) |

**Translation keys** (registered as `shohrah.faq-accordion.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `search_placeholder`, `search_label`, `clear_search`, `no_results`, `results_count`, `empty`, `contact_text`, `region_label`, `default_q1`, `default_a1`, `default_q2`, `default_a2`, `default_q3`, `default_a3`, `default_q4`, `default_a4`, `default_q5`, `default_a5`

## `testimonials-slider` — آراء العملاء

Tag: `<salla-testimonials-slider>` · key: `3f514db3-5083-4eae-a9c4-059c3caf65b1` · icon: `sicon-star` · 15 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `title` | string/text · multilanguage | العنوان | ar: “آراء عملائنا” · en: “What our customers say” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “تجارب حقيقية من متسوقين مثلك” · en: “Real experiences from shoppers like you” |
| `items` | collection/collection | الآراء | 4 rows |
| ↳ `items[].name` | string/text | اسم العميل | — |
| ↳ `items[].meta` | string/text · multilanguage | المدينة أو الوصف | — |
| ↳ `items[].quote` | string/textarea · multilanguage | نص الرأي | — |
| ↳ `items[].rating` | number/slider | التقييم | `5` |
| ↳ `items[].avatar` | string/image | صورة العميل (اختياري) | — |
| `autoplay` | boolean/switch | تشغيل تلقائي | `true` |
| `interval_seconds` | number/slider | مدة كل شريحة (ثانية) | `6` |
| `loop` | boolean/switch | العودة للبداية بعد آخر شريحة | `true` |
| `slides_desktop` | number/slider | عدد الشرائح المعروضة على سطح المكتب | `3` |
| `slides_mobile` | number/slider | عدد الشرائح المعروضة على الجوال | `1` |
| `card_style` | items/radio-list | شكل البطاقة | `elevated` |
| `align` | items/radio-list | محاذاة محتوى البطاقة | `start` |
| `show_rating` | boolean/switch | إظهار النجوم | `true` |
| `show_avatar` | boolean/switch | إظهار صورة العميل أو الأحرف الأولى | `true` |
| `show_quote_icon` | boolean/switch | إظهار علامة الاقتباس | `true` |
| `show_arrows` | boolean/switch | إظهار أسهم التنقل | `true` |
| `show_dots` | boolean/switch | إظهار نقاط التنقل | `true` |

**Translation keys** (registered as `shohrah.testimonials-slider.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `region_label`, `prev`, `next`, `go_to`, `slide_of`, `rating_label`, `empty`, `default_1_name`, `default_1_meta`, `default_1_quote`, `default_2_name`, `default_2_meta`, `default_2_quote`, `default_3_name`, `default_3_meta`, `default_3_quote`, `default_4_name`, `default_4_meta`, `default_4_quote`

## `announcement-ticker` — شريط الإعلانات

Tag: `<salla-announcement-ticker>` · key: `51421d19-4e2b-4311-8ef5-b470d574b12c` · icon: `sicon-megaphone` · 15 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `items` | collection/collection | الإعلانات | 3 rows |
| ↳ `items[].text` | string/text · multilanguage | النص | — |
| ↳ `items[].icon` | string/icon | الأيقونة | — |
| ↳ `items[].link` | items/variable-list · source: custom | الرابط (اختياري) | — (source: custom) |
| `mode` | items/radio-list | نمط العرض | `marquee` |
| `speed_seconds` | number/slider | مدة الدورة الكاملة (ثانية) | `25` |
| `rotate_seconds` | number/slider | مدة كل إعلان في نمط التبديل (ثانية) | `5` |
| `pause_on_hover` | boolean/switch | إيقاف الحركة عند مرور المؤشر | `true` |
| `separator` | items/dropdown-list | الفاصل بين الإعلانات | `dot` |
| `background` | items/radio-list | الخلفية | `primary` |
| `custom_bg` | string/color | لون الخلفية المخصص | `#111827` |
| `custom_text` | string/color | لون النص المخصص | `#FFFFFF` |
| `height_px` | number/units | الارتفاع | `40` |
| `font_size` | items/radio-list | حجم الخط | `sm` |
| `show_icons` | boolean/switch | إظهار الأيقونات | `true` |
| `sticky` | boolean/switch | تثبيت الشريط أعلى الصفحة عند التمرير | `false` |
| `dismissible` | boolean/switch | السماح للزائر بإغلاق الشريط | `false` |
| `dismiss_label` | string/text · multilanguage | نص زر الإغلاق (لقارئ الشاشة) | ar: “إغلاق الإعلان” · en: “Dismiss announcement” |

**Translation keys** (registered as `shohrah.announcement-ticker.<key>`, override with `salla.lang.set()`):

`region_label`, `dismiss`, `pause`, `play`, `empty`, `default_1`, `default_2`, `default_3`

## `whatsapp-chat` — زر واتساب العائم

Tag: `<salla-whatsapp-chat>` · key: `c787941e-fa73-423a-b1bd-9301ea5b2dc1` · icon: `sicon-whatsapp` · 23 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `number` | string/text | رقم واتساب | — |
| `message` | string/textarea · multilanguage | الرسالة المعبّأة مسبقًا | ar: “مرحبًا {store}، لدي استفسار بخصوص {product}” · en: “Hi {store}, I have a question about {product}” |
| `include_url` | boolean/switch | إضافة رابط الصفحة الحالية للرسالة | `true` |
| `label` | string/text · multilanguage | نص الزر | ar: “تواصل معنا” · en: “Chat with us” |
| `label_mode` | items/radio-list | إظهار نص الزر | `hover` |
| `position` | items/radio-list | الموضع | `end` |
| `offset_bottom` | number/units | المسافة من الأسفل | `24` |
| `offset_side` | number/units | المسافة من الجانب | `24` |
| `size` | items/radio-list | الحجم | `md` |
| `color_mode` | items/radio-list | اللون | `whatsapp` |
| `custom_color` | string/color | اللون المخصص | `#25D366` |
| `pulse` | boolean/switch | نبض خفيف حول الزر | `true` |
| `show_on` | items/radio-list | الإظهار على | `all` |
| `greeting_enabled` | boolean/switch | إظهار فقاعة ترحيب | `true` |
| `greeting_title` | string/text · multilanguage | عنوان الترحيب | ar: “مرحبًا 👋” · en: “Hello 👋” |
| `greeting_text` | string/textarea · multilanguage | نص الترحيب | ar: “كيف نقدر نساعدك اليوم؟” · en: “How can we help you today?” |
| `greeting_delay` | number/slider | التأخير قبل ظهور الترحيب (ثانية) | `4` |
| `avatar` | string/image | صورة الترحيب (اختياري) | — |
| `hours_enabled` | boolean/switch | تفعيل أوقات العمل | `false` |
| `hours_from` | string/time | من | `09:00` |
| `hours_to` | string/time | إلى | `22:00` |
| `timezone` | string/text | المنطقة الزمنية | `Asia/Riyadh` |
| `offline_text` | string/text · multilanguage | نص خارج أوقات العمل | ar: “خارج أوقات العمل الآن، اترك رسالتك وسنرد قريبًا” · en: “We’re offline right now. Leave a message and we’ll reply soon” |

**Translation keys** (registered as `shohrah.whatsapp-chat.<key>`, override with `salla.lang.set()`):

`label`, `message`, `greeting_title`, `greeting_text`, `offline`, `online`, `close_greeting`, `start_chat`, `this_page`, `missing_number`

## `delivery-estimator` — حاسبة موعد التوصيل

Tag: `<salla-delivery-estimator>` · key: `e50c72f5-6975-4b60-a6d3-82ec55297bce` · icon: `sicon-truck` · 17 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `title` | string/text · multilanguage | العنوان | ar: “احسب موعد وصول طلبك” · en: “Estimate your delivery date” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “اختر مدينتك لمعرفة موعد التوصيل المتوقّع” · en: “Pick your city to see the expected delivery window” |
| `cutoff_time` | string/time | آخر وقت للشحن في نفس اليوم | `14:00` |
| `timezone` | string/text | المنطقة الزمنية | `Asia/Riyadh` |
| `processing_days` | number/slider | أيام تجهيز الطلب قبل الشحن | `1` |
| `working_days` | items/checkbox-list · multi | أيام العمل | `0`, `1`, `2`, `3`, `4` |
| `cities` | collection/collection | المدن | 5 rows |
| ↳ `cities[].name` | string/text · multilanguage | اسم المدينة أو المنطقة | — |
| ↳ `cities[].min_days` | number/integer | أقل عدد أيام عمل | `2` |
| ↳ `cities[].max_days` | number/integer | أكثر عدد أيام عمل | `4` |
| `show_city_select` | boolean/switch | إظهار قائمة اختيار المدينة | `true` |
| `remember_city` | boolean/switch | تذكّر مدينة الزائر | `true` |
| `countdown_text` | string/text · multilanguage | نص العدّ قبل وقت الشحن | ar: “اطلب خلال {time} ليُشحن طلبك اليوم” · en: “Order within {time} to ship today” |
| `after_cutoff_text` | string/text · multilanguage | نص ما بعد وقت الشحن | ar: “الطلبات بعد {cutoff} تُشحن في يوم العمل التالي” · en: “Orders after {cutoff} ship on the next business day” |
| `result_label` | string/text · multilanguage | عنوان النتيجة | ar: “التوصيل المتوقّع” · en: “Expected delivery” |
| `date_style` | items/radio-list | صيغة التاريخ | `long` |
| `calendar` | items/radio-list | التقويم | `gregory` |
| `style` | items/radio-list | الشكل | `card` |
| `show_icon` | boolean/switch | إظهار الأيقونة | `true` |
| `icon` | string/icon | الأيقونة | — |

**Translation keys** (registered as `shohrah.delivery-estimator.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `city_label`, `result_label`, `range`, `countdown`, `after_cutoff`, `hours_minutes`, `minutes_only`, `business_days`, `empty`, `default_city_1`, `default_city_2`, `default_city_3`, `default_city_4`, `default_city_5`

## `size-guide-drawer` — دليل المقاسات

Tag: `<salla-size-guide-drawer>` · key: `9119ffb4-77b8-47fa-b058-ec5390503a5c` · icon: `sicon-ruler` · 14 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `button_text` | string/text · multilanguage | نص الزر | ar: “دليل المقاسات” · en: “Size guide” |
| `button_style` | items/radio-list | شكل الزر | `link` |
| `show_button_icon` | boolean/switch | إظهار أيقونة المسطرة | `true` |
| `title` | string/text · multilanguage | العنوان | ar: “دليل المقاسات” · en: “Size guide” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “قِس نفسك بدقّة واختر مقاسك المثالي” · en: “Measure yourself and pick your perfect size” |
| `drawer_side` | items/radio-list | جهة الظهور | `end` |
| `drawer_width` | number/units | عرض النافذة | `440` |
| `columns` | collection/collection | أعمدة القياس | 3 rows |
| ↳ `columns[].label` | string/text · multilanguage | اسم العمود | — |
| `rows` | collection/collection | صفوف المقاسات | 5 rows |
| ↳ `rows[].size` | string/text | المقاس | — |
| ↳ `rows[].values` | string/text | القياسات بالسنتيمتر مفصولة بـ \| | — |
| `default_unit` | items/radio-list | الوحدة الافتراضية | `cm` |
| `show_unit_toggle` | boolean/switch | إظهار مبدّل الوحدة (سم / إنش) | `true` |
| `fit_note` | string/textarea · multilanguage | ملاحظة المقاس | ar: “إذا كنت بين مقاسين، ننصح باختيار المقاس الأكبر.” · en: “If you are between sizes, we recommend choosing the larger one.” |
| `image` | string/image | صورة توضيحية للقياس (اختياري) | — |
| `tips` | collection/collection | الإرشادات | 3 rows |
| ↳ `tips[].title` | string/text · multilanguage | العنوان | — |
| ↳ `tips[].text` | string/textarea · multilanguage | النص | — |

**Translation keys** (registered as `shohrah.size-guide-drawer.<key>`, override with `salla.lang.set()`):

`button`, `title`, `subtitle`, `close`, `unit_label`, `cm`, `in`, `size`, `tips_title`, `fit_note`, `empty`, `default_col_1`, `default_col_2`, `default_col_3`, `default_tip_1_title`, `default_tip_1_text`, `default_tip_2_title`, `default_tip_2_text`, `default_tip_3_title`, `default_tip_3_text`

## `before-after-slider` — مقارنة قبل وبعد

Tag: `<salla-before-after-slider>` · key: `8ec915aa-7574-4f7b-8657-089cb4484377` · icon: `sicon-image-landscape` · 19 editable fields

| id | type | label (editor) | default |
|---|---|---|---|
| `after_image` | string/image | صورة «بعد» | `https://cdn.salla.sa/form-builder/EMl1Ae8o35qzaG0HvVqz0IpeqcK9uyHliKksscja.jpg` |
| `before_image` | string/image | صورة «قبل» | — |
| `show_labels` | boolean/switch | إظهار تسميات قبل / بعد | `true` |
| `before_label` | string/text · multilanguage | تسمية «قبل» | ar: “قبل” · en: “Before” |
| `after_label` | string/text · multilanguage | تسمية «بعد» | ar: “بعد” · en: “After” |
| `before_alt` | string/text · multilanguage | النص البديل لصورة «قبل» (لقارئ الشاشة) | — |
| `after_alt` | string/text · multilanguage | النص البديل لصورة «بعد» (لقارئ الشاشة) | — |
| `hint` | string/text · multilanguage | نص الإرشاد أسفل الصورة | ar: “اسحب المقبض للمقارنة بين الصورتين” · en: “Drag the handle to compare the two images” |
| `show_title` | boolean/switch | إظهار عنوان فوق المقارنة | `false` |
| `title` | string/text · multilanguage | العنوان | ar: “قبل وبعد” · en: “Before & after” |
| `subtitle` | string/text · multilanguage | العنوان الفرعي | ar: “اسحب المقبض لمقارنة النتيجة” · en: “Drag the handle to compare the result” |
| `start_percent` | number/slider | موضع البداية | `50` |
| `ratio` | items/radio-list | نسبة الإطار | `landscape` |
| `handle_style` | items/radio-list | شكل المقبض | `circle` |
| `max_width` | number/units | أقصى عرض | `820` |
| `rounded` | boolean/switch | زوايا دائرية | `true` |
| `hover_move` | boolean/switch | تحريك المقارنة بمرور المؤشر بدون سحب | `false` |
| `use_theme_color` | boolean/switch | استخدام لون الثيم للمقبض | `true` |
| `accent_color` | string/color | لون المقبض المخصص | `#1F5C5A` |

**Translation keys** (registered as `shohrah.before-after-slider.<key>`, override with `salla.lang.set()`):

`title`, `subtitle`, `before`, `after`, `hint`, `slider_label`, `value_text`, `missing_images`

