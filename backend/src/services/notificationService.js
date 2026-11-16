const { Resend } = require('resend');
const twilio = require('twilio');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

let resendInstance = null;
function getResendClient() {
  if (!resendInstance) {
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) return null;
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

let twilioInstance = null;
function getTwilioClient() {
  if (!twilioInstance) {
    const sid = env.TWILIO_ACCOUNT_SID;
    const token = env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) return null;
    try {
      twilioInstance = twilio(sid, token);
    } catch {
      twilioInstance = null;
    }
  }
  return twilioInstance;
}

const isDevFallbackEnabled = (customFallback) => {
  if (customFallback === true) return true;
  return env.NODE_ENV !== 'production' && String(env.OTP_DEV_FALLBACK) === 'true';
};

/**
 * بناء قالب البريد الإلكتروني الفاخر بهوية منصة Travora
 */
function buildTravoraEmailTemplate({ code, purpose, expiryMinutes, frontendUrl }) {
  const isRegister = purpose === 'REGISTER_VERIFY';
  const badgeText = isRegister ? 'تفعيل حساب مسافر جديد' : 'تحقق أمني لتسجيل الدخول';
  const headingText = isRegister
    ? 'أهلاً بك في Travora — رحلتك الذكية تبدأ من هنا!'
    : 'رمز الأمان لتسجيل الدخول إلى حسابك';
  const subText = isRegister
    ? 'شكراً لانضمامك إلى منصة Travora للسياحة الذكية. لتفعيل حسابك والبدء في تخطيط رحلاتك وحجوزاتك، استخدم رمز التحقق التالي:'
    : 'تلقينا طلباً لتسجيل الدخول إلى حسابك في منصة Travora. لإتمام الدخول بأمان، يرجى استخدام رمز التحقق المكون من 6 أرقام أدناه:';

  const quickCopyUrl = `${frontendUrl}/ login?copyCode=${encodeURIComponent(code)}`.replace('/ login', '/login');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headingText}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F9FD; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F4F9FD; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(15, 29, 56, 0.08); border: 1px solid #E2ECF5;">
          
          <!-- Luxury Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F1D38 0%, #16335B 55%, #0D6EFD 100%); padding: 34px 36px 30px; text-align: right;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display: inline-block;">
                      <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 34px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">Travora</span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #00C8A8; margin-right: 4px; vertical-align: baseline;"></span>
                    </div>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #BAE6FD; font-weight: 500; letter-spacing: 0.3px;">
                      اكتشف أكثر من مجرد وجهة • منصة السياحة الذكية
                    </p>
                  </td>
                  <td align="left" valign="top">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.25); color: #E0F2FE; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 999px;">
                      ${badgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Turquoise & Ocean Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #00C8A8 0%, #149EF7 50%, #FF8A00 100%);"></td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h1 style="margin: 0 0 14px; font-size: 22px; font-weight: 800; color: #0F1D38; line-height: 1.4;">
                ${headingText}
              </h1>
              <p style="margin: 0 0 26px; font-size: 15px; line-height: 1.8; color: #475569;">
                ${subText}
              </p>

              <!-- OTP Box with One-Click Selection & Copy Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(180deg, #F0F9FF 0%, #E8F6FE 100%); border: 2px dashed #38BDF8; border-radius: 22px; padding: 26px 20px; text-align: center;">
                <tr>
                  <td align="center">
                    <span style="display: block; font-size: 12px; font-weight: 700; color: #0284C7; margin-bottom: 12px;">
                      رمز التحقق الخاص بك (انقر على الرمز لتحديده ونسخه)
                    </span>

                    <!-- Select-all OTP Code Pill -->
                    <div dir="ltr" style="display: inline-block; background-color: #FFFFFF; border: 2px solid #BAE6FD; border-radius: 16px; padding: 14px 28px; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #0F1D38; box-shadow: 0 8px 20px rgba(20, 158, 247, 0.12); user-select: all; -webkit-user-select: all; -moz-user-select: all; cursor: pointer;">
                      ${code}
                    </div>

                    <!-- Expiry Notice -->
                    <p style="margin: 14px 0 18px; font-size: 12px; color: #64748B;">
                      ⏱️ هذا الرمز صالح لمدة <strong style="color: #0F172A;">${expiryMinutes} دقائق</strong> فقط ويُستخدم لمرة واحدة.
                    </p>

                    <!-- Action Button to Copy / Auto-Fill in Platform -->
                    <a href="${quickCopyUrl}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #149EF7 0%, #188DE9 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 800; padding: 12px 26px; border-radius: 12px; box-shadow: 0 6px 18px rgba(20, 158, 247, 0.28);">
                      📋 نسخ الرمز والعودة إلى Travora
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Tip Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px; background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.7; color: #92400E;">
                    🔒 <strong>تنبيه أمني من Travora:</strong> لن يطلب منك فريق دعم Travora هذا الرمز أبداً عبر الهاتف أو البريد. لا تشارك الرمز مع أي شخص لحماية حسابك.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 22px 36px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #0F1D38;">
                منصة Travora للسياحة الذكية ✈️
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.6;">
                تخطيط رحلات بالذكاء الاصطناعي • حجوزات فنادق وتجارب • إدارة ميزانية السفر<br />
                إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. إرسال رمز التحقق الفعلي عبر البريد الإلكتروني (Resend)
 */
async function sendEmailOTP(toEmail, code, purpose, { devFallback } = {}) {
  const expiryMinutes = env.OTP_EXPIRY_MINUTES || 5;
  const subject = purpose === 'REGISTER_VERIFY'
    ? `[${code}] رمز تفعيل حسابك في منصة Travora 🌍`
    : `[${code}] رمز تسجيل الدخول الآمن إلى Travora 🔒`;

  const frontendUrl = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')[0].trim();

  try {
    const resend = getResendClient();
    if (!resend) {
      if (isDevFallbackEnabled(devFallback)) {
        console.warn(`[DEV FALLBACK - NO RESEND KEY] OTP for ${toEmail}: ${code}`);
        return { delivered: false, fallback: 'DEV_CONSOLE' };
      }
      throw new ApiError(502, 'EMAIL_NOT_CONFIGURED', 'مفتاح خدمة البريد الإلكتروني Resend غير مهيأ.');
    }

    const html = buildTravoraEmailTemplate({
      code,
      purpose,
      expiryMinutes,
      frontendUrl,
    });

    const textVersion = [
      'Travora — اكتشف أكثر من مجرد وجهة',
      purpose === 'REGISTER_VERIFY' ? 'تفعيل حسابك الجديد في Travora' : 'تسجيل الدخول الآمن إلى Travora',
      `رمز التحقق الخاص بك هو: ${code}`,
      `صالح لمدة ${expiryMinutes} دقائق. لا تشاركه مع أي شخص.`,
      '',
      `@${new URL(frontendUrl).hostname} #${code}`,
    ].join('\n');

    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL || 'Travora <notifications@orthino.com>',
      to: [toEmail],
      subject,
      html,
      text: textVersion,
    });

    if (error) {
      if (isDevFallbackEnabled(devFallback)) {
        console.warn(`[DEV FALLBACK - RESEND] OTP for ${toEmail}: ${code} (Reason: ${error.message})`);
        return { delivered: false, fallback: 'DEV_CONSOLE' };
      }
      throw new ApiError(502, 'EMAIL_SEND_FAILED', `فشل إرسال البريد الإلكتروني: ${error.message}`);
    }

    return { delivered: true, channel: 'EMAIL', messageId: data?.id };
  } catch (err) {
    if (isDevFallbackEnabled(devFallback)) {
      console.warn(`[DEV FALLBACK - RESEND] OTP for ${toEmail}: ${code} (Reason: ${err.message})`);
      return { delivered: false, fallback: 'DEV_CONSOLE' };
    }
    throw err instanceof ApiError ? err : new ApiError(502, 'EMAIL_SEND_FAILED', `فشل في إرسال البريد الإلكتروني: ${err.message}`);
  }
}

/**
 * 2. إرسال رمز التحقق الفعلي عبر الرسائل النصية (Twilio SMS)
 * يدعم معيار WebOTP (@domain #code) ليظهر زر "نسخ الرمز" تلقائياً في إشعارات الهاتف
 */
async function sendSmsOTP(toPhone, code, purpose, { devFallback } = {}) {
  const expiryMinutes = env.OTP_EXPIRY_MINUTES || 5;
  const actionText = purpose === 'REGISTER_VERIFY' ? 'لتفعيل حسابك الجديد' : 'لتسجيل الدخول الآمن';
  const frontendHost = new URL((process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')[0].trim()).hostname;

  const smsBody = [
    `✈️ Travora | اكتشف أكثر من مجرد وجهة`,
    `رمز التحقق الخاص بك ${actionText}:`,
    `${code}`,
    `⏱️ صالح لمدة ${expiryMinutes} دقائق. لا تشاركه مع أحد.`,
    `@${frontendHost} #${code}`,
  ].join('\n');

  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient || !env.TWILIO_PHONE_NUMBER) {
      if (isDevFallbackEnabled(devFallback)) {
        console.warn(`[DEV FALLBACK - SMS SIMULATED] OTP for ${toPhone}: ${code}`);
        return { delivered: false, fallback: 'DEV_CONSOLE' };
      }
      throw new ApiError(502, 'SMS_NOT_CONFIGURED', 'خدمة الرسائل النصية Twilio غير مهيأة حالياً.');
    }

    const msg = await twilioClient.messages.create({
      body: smsBody,
      from: env.TWILIO_PHONE_NUMBER,
      to: toPhone,
    });
    return { delivered: true, channel: 'SMS', sid: msg.sid };
  } catch (err) {
    if (isDevFallbackEnabled(devFallback)) {
      console.warn(`[DEV FALLBACK - TWILIO SMS] OTP for ${toPhone}: ${code} (Twilio Code: ${err.code} - ${err.message})`);
      return { delivered: false, fallback: 'DEV_CONSOLE' };
    }
    if (err.code === 21608) {
      throw new ApiError(
        502,
        'TWILIO_UNVERIFIED_NUMBER',
        'حساب Twilio في الوضع التجريبي (Trial): يجب توثيق رقم الهاتف المستلم في Verified Caller IDs في لوحة تحكم Twilio أولاً، أو استخدم التحقق عبر البريد الإلكتروني.'
      );
    }
    throw new ApiError(502, 'SMS_SEND_FAILED', `فشل إرسال الرسالة النصية عبر Twilio: ${err.message}`);
  }
}

/**
 * 3. إرسال رمز التحقق الفعلي عبر واتساب (Twilio WhatsApp API / Sandbox)
 */
async function sendWhatsAppOTP(toPhone, code, purpose, { devFallback } = {}) {
  const expiryMinutes = env.OTP_EXPIRY_MINUTES || 5;
  const actionText = purpose === 'REGISTER_VERIFY' ? 'تفعيل حسابك الجديد' : 'تسجيل الدخول الآمن';
  const fromNum = env.TWILIO_WHATSAPP_NUMBER || env.TWILIO_PHONE_NUMBER;
  const fromWhatsApp = fromNum && fromNum.startsWith('whatsapp:') ? fromNum : `whatsapp:${fromNum}`;
  const toWhatsApp = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`;

  const whatsappBody = [
    `🌍 *Travora | اكتشف أكثر من مجرد وجهة*`,
    `━━━━━━━━━━━━━━━━━━`,
    `مرحباً بك في منصة السياحة الذكية ✈️`,
    `رمز التحقق الخاص بك لـ *${actionText}* هو:`,
    ``,
    `\`\`\`${code}\`\`\``,
    `_(اضغط مطولاً على الرمز أعلاه لنسخه فوراً)_`,
    ``,
    `⏱️ *الصلاحية:* ${expiryMinutes} دقائق فقط`,
    `🔒 *تنبيه أمني:* لا تشارك هذا الرمز مع أي شخص لحماية حسابك.`,
  ].join('\n');

  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient || !fromNum) {
      if (isDevFallbackEnabled(devFallback)) {
        console.warn(`[DEV FALLBACK - WHATSAPP SIMULATED] OTP for ${toPhone}: ${code}`);
        return { delivered: false, fallback: 'DEV_CONSOLE' };
      }
      throw new ApiError(502, 'WHATSAPP_NOT_CONFIGURED', 'خدمة واتساب غير مهيأة حالياً.');
    }

    const msg = await twilioClient.messages.create({
      body: whatsappBody,
      from: fromWhatsApp,
      to: toWhatsApp,
    });
    return { delivered: true, channel: 'WHATSAPP', sid: msg.sid };
  } catch (err) {
    if (isDevFallbackEnabled(devFallback)) {
      console.warn(`[DEV FALLBACK - TWILIO WHATSAPP] OTP for ${toPhone}: ${code} (Twilio Code: ${err.code} - ${err.message})`);
      return { delivered: false, fallback: 'DEV_CONSOLE' };
    }
    throw new ApiError(
      502,
      'WHATSAPP_SEND_FAILED',
      `فشل إرسال رسالة واتساب (${err.code || 'Twilio'}): تأكد من إرسال كود الانضمام إلى رقم Twilio WhatsApp Sandbox (+14155238886) أولاً.`
    );
  }
}

module.exports = {
  sendEmailOTP,
  sendSmsOTP,
  sendWhatsAppOTP,
  buildTravoraEmailTemplate,
};
