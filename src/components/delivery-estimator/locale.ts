import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.delivery-estimator.<key>`. */
export const messages: Messages = {
  title: { ar: 'احسب موعد وصول طلبك', en: 'Estimate your delivery date' },
  subtitle: { ar: 'اختر مدينتك لمعرفة موعد التوصيل المتوقّع', en: 'Pick your city to see the expected delivery window' },
  city_label: { ar: 'المدينة', en: 'City' },
  result_label: { ar: 'التوصيل المتوقّع', en: 'Expected delivery' },
  range: { ar: 'من {from} إلى {to}', en: '{from} – {to}' },
  countdown: { ar: 'اطلب خلال {time} ليُشحن طلبك اليوم', en: 'Order within {time} to ship today' },
  after_cutoff: { ar: 'الطلبات بعد {cutoff} تُشحن في يوم العمل التالي', en: 'Orders after {cutoff} ship on the next business day' },
  hours_minutes: { ar: '{h} س {m} د', en: '{h}h {m}m' },
  minutes_only: { ar: '{m} دقيقة', en: '{m} min' },
  business_days: { ar: '{min}–{max} أيام عمل', en: '{min}–{max} business days' },
  empty: { ar: 'أضف مدينة واحدة على الأقل من إعدادات العنصر.', en: 'Add at least one city from the component settings.' },
  default_city_1: { ar: 'الرياض', en: 'Riyadh' },
  default_city_2: { ar: 'جدة', en: 'Jeddah' },
  default_city_3: { ar: 'الدمام والمنطقة الشرقية', en: 'Dammam & Eastern Province' },
  default_city_4: { ar: 'مكة المكرمة والمدينة', en: 'Makkah & Madinah' },
  default_city_5: { ar: 'باقي المدن', en: 'Other cities' },
};
