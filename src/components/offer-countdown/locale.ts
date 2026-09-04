import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.offer-countdown.<key>`. */
export const messages: Messages = {
  title: { ar: 'العرض ينتهي خلال', en: 'Offer ends in' },
  subtitle: { ar: 'خصم حتى ٣٠٪ على تشكيلة مختارة', en: 'Up to 30% off selected items' },
  cta: { ar: 'تسوّق العرض', en: 'Shop the offer' },
  expired: { ar: 'انتهى العرض — تابعنا للعروض القادمة', en: 'Offer ended — stay tuned for the next one' },
  days: { ar: 'يوم', en: 'Days' },
  hours: { ar: 'ساعة', en: 'Hours' },
  minutes: { ar: 'دقيقة', en: 'Min' },
  seconds: { ar: 'ثانية', en: 'Sec' },
  timer_label: { ar: 'الوقت المتبقي على انتهاء العرض', en: 'Time left until the offer ends' },
  remaining_text: {
    ar: 'متبقٍ {days} يوم و{hours} ساعة و{minutes} دقيقة',
    en: '{days} days, {hours} hours and {minutes} minutes remaining',
  },
  invalid_date: { ar: 'تاريخ الانتهاء غير صالح. راجع إعدادات العنصر.', en: 'Invalid end date. Check the component settings.' },
};
