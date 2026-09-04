import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.stock-scarcity-bar.<key>`. */
export const messages: Messages = {
  title: { ar: 'الكمية محدودة', en: 'Limited stock' },
  message: { ar: 'بقي {qty} فقط — اطلب الآن', en: 'Only {qty} left — order now' },
  sold: { ar: 'تم بيع {sold} قطعة', en: '{sold} sold' },
  out_of_stock: { ar: 'نفدت الكمية حاليًا', en: 'Currently out of stock' },
  progress_label: { ar: 'الكمية المتبقية من المنتج', en: 'Remaining product quantity' },
  no_product: { ar: 'ضع هذا العنصر في صفحة المنتج أو اختر منتجًا من الإعدادات.', en: 'Place this component on a product page or pick a product in the settings.' },
  load_error: { ar: 'تعذّر تحميل بيانات المنتج.', en: 'Could not load product data.' },
};
