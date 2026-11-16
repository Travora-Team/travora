export const REGISTER_CHANNELS = [
  {
    id: 'EMAIL',
    label: 'البريد الإلكتروني',
    desc: 'إرسال الرمز لبريدك',
  },
  {
    id: 'SMS',
    label: 'رسالة نصية SMS',
    desc: 'إرسال الرمز لهاتفك',
  },
  {
    id: 'WHATSAPP',
    label: 'واتساب',
    desc: 'إرسال عبر WhatsApp',
  },
];

export function validateTravelerRegistration({ fullName, email, phoneNumber, password, verifyChannel }) {
  const needsPhone = verifyChannel === 'SMS' || verifyChannel === 'WHATSAPP';

  if (!fullName.trim() || fullName.trim().length < 2) {
    return 'يرجى إدخال الاسم الكامل بشكل صحيح (حرفين على الأقل).';
  }
  if (!email.trim()) {
    return 'يرجى إدخال البريد الإلكتروني.';
  }
  if (needsPhone && !phoneNumber.trim()) {
    return 'رقم الهاتف بالصيغة الدولية مطلوب عند اختيار التحقق عبر الرسائل النصية أو واتساب.';
  }
  if (!password || password.length < 8) {
    return 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.';
  }
  return '';
}
