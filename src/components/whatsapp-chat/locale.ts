import type { Messages } from '../../shared/i18n';

/** Translation keys registered as `shohrah.whatsapp-chat.<key>`. */
export const messages: Messages = {
  label: { ar: 'تواصل معنا عبر واتساب', en: 'Chat with us on WhatsApp' },
  message: { ar: 'مرحبًا {store}، لدي استفسار بخصوص {product}', en: 'Hi {store}, I have a question about {product}' },
  greeting_title: { ar: 'مرحبًا 👋', en: 'Hello 👋' },
  greeting_text: { ar: 'كيف نقدر نساعدك اليوم؟', en: 'How can we help you today?' },
  offline: { ar: 'خارج أوقات العمل الآن، اترك رسالتك وسنرد قريبًا', en: 'We’re offline right now. Leave a message and we’ll reply soon' },
  online: { ar: 'متاحون الآن', en: 'Online now' },
  close_greeting: { ar: 'إغلاق الرسالة', en: 'Close message' },
  start_chat: { ar: 'ابدأ المحادثة', en: 'Start chat' },
  this_page: { ar: 'هذه الصفحة', en: 'this page' },
  missing_number: { ar: 'لم يتم ضبط رقم واتساب. أضفه في إعدادات العنصر أو في بيانات تواصل المتجر.', en: 'No WhatsApp number set. Add one in the component settings or in the store contact details.' },
};
