import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.coupon-code-card.<key>`. */
export const messages: Messages = {
  title: { ar: 'خصم ١٠٪ على طلبك الأول', en: '10% off your first order' },
  description: { ar: 'انسخ الكود واستخدمه عند الدفع', en: 'Copy the code and use it at checkout' },
  copy: { ar: 'نسخ', en: 'Copy' },
  copied: { ar: 'تم النسخ', en: 'Copied' },
  apply: { ar: 'تطبيق على السلة', en: 'Apply to cart' },
  applying: { ar: 'جارٍ التطبيق…', en: 'Applying…' },
  applied: { ar: 'تم تطبيق الكود', en: 'Code applied' },
  apply_failed: { ar: 'لم يتم تطبيق الكود، تأكد من وجود منتجات في السلة', en: 'Could not apply the code. Make sure your cart has items' },
  code_label: { ar: 'كود الخصم', en: 'Discount code' },
  copy_aria: { ar: 'نسخ كود الخصم {code}', en: 'Copy discount code {code}' },
  expires: { ar: 'ينتهي في {date}', en: 'Expires {date}' },
  expires_in: { ar: 'متبقٍ {n} يوم', en: '{n} days left' },
  expired: { ar: 'انتهت صلاحية هذا الكود', en: 'This code has expired' },
  missing_code: { ar: 'أضف كود الخصم من إعدادات العنصر.', en: 'Add a discount code in the component settings.' },
};
