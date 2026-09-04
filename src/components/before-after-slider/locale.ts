import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.before-after-slider.<key>`. */
export const messages: Messages = {
  title: { ar: 'قبل وبعد', en: 'Before & after' },
  subtitle: { ar: 'اسحب المقبض لمقارنة النتيجة', en: 'Drag the handle to compare the result' },
  before: { ar: 'قبل', en: 'Before' },
  after: { ar: 'بعد', en: 'After' },
  hint: { ar: 'اسحب المقبض للمقارنة بين الصورتين', en: 'Drag the handle to compare the two images' },
  slider_label: { ar: 'مقارنة قبل وبعد', en: 'Before and after comparison' },
  value_text: { ar: '{n}٪ من صورة «بعد» ظاهرة', en: '{n}% of the “after” image visible' },
  missing_images: { ar: 'أضف صورة «بعد» على الأقل من إعدادات العنصر.', en: 'Add at least an “after” image from the component settings.' },
};
