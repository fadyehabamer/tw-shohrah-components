import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.volume-discount-ladder.<key>`. */
export const messages: Messages = {
  title: { ar: 'اشترِ أكثر، وفّر أكثر', en: 'Buy more, save more' },
  subtitle: { ar: 'خصومات تلقائية كلما زادت الكمية في سلتك', en: 'Automatic discounts as your quantity grows' },
  region_label: { ar: 'خصومات الكمية', en: 'Quantity discounts' },
  progress: { ar: 'أضف {n} للحصول على {discount}', en: 'Add {n} more to get {discount}' },
  reached: { ar: 'وصلت لأعلى خصم متاح 🎉', en: 'You’ve unlocked the top discount 🎉' },
  current: { ar: 'فئتك الحالية', en: 'Your current tier' },
  in_cart: { ar: '{n} في السلة', en: '{n} in cart' },
  note: { ar: 'تُطبّق الخصومات تلقائيًا في السلة عند بلوغ الكمية', en: 'Discounts apply automatically in the cart once the quantity is reached' },
  cta: { ar: 'تسوّق الآن', en: 'Shop now' },
  empty: { ar: 'أضف فئة خصم واحدة على الأقل من إعدادات العنصر.', en: 'Add at least one discount tier from the component settings.' },
  default_1_qty: { ar: 'قطعتان', en: '2 items' },
  default_1_disc: { ar: 'خصم ١٠٪', en: '10% off' },
  default_1_note: { ar: 'على كل قطعة', en: 'on every item' },
  default_2_qty: { ar: '٣ قطع', en: '3 items' },
  default_2_disc: { ar: 'خصم ١٥٪', en: '15% off' },
  default_2_note: { ar: 'الأكثر طلبًا', en: 'Most popular' },
  default_3_qty: { ar: '٥ قطع فأكثر', en: '5+ items' },
  default_3_disc: { ar: 'خصم ٢٥٪', en: '25% off' },
  default_3_note: { ar: 'أفضل قيمة', en: 'Best value' },
};
