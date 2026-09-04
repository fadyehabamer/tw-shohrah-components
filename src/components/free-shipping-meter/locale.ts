import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.free-shipping-meter.<key>`. */
export const messages: Messages = {
  empty: { ar: 'أضف منتجات واحصل على شحن مجاني للطلبات فوق {amount}', en: 'Add items to unlock free shipping on orders over {amount}' },
  remaining: { ar: 'أضف {amount} للحصول على شحن مجاني', en: 'Add {amount} more for free shipping' },
  reached: { ar: 'مبروك! حصلت على شحن مجاني', en: 'You’ve unlocked free shipping!' },
  cta: { ar: 'عرض السلة', en: 'View cart' },
  progress_label: { ar: 'التقدّم نحو الشحن المجاني', en: 'Progress towards free shipping' },
  of: { ar: '{current} من {target}', en: '{current} of {target}' },
  unavailable: { ar: 'لم يتم ضبط حد الشحن المجاني في إعدادات المتجر.', en: 'Free-shipping threshold is not configured in the store settings.' },
  load_error: { ar: 'تعذّر تحميل بيانات السلة.', en: 'Could not load cart data.' },
};
