import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OtpVerificationCard } from '../../../shared/components/OtpVerificationCard';
import { useAuth } from '../../../shared/context/AuthContext';
import { registerApi } from '../api/registerApi';
import { validateTravelerRegistration } from '../models/registerModel';
import { TravelerHeaderBanner } from '../components/TravelerHeaderBanner';
import { TravelerSvgAnimation } from '../components/TravelerSvgAnimation';
import { VerifyChannelSelector } from '../components/VerifyChannelSelector';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyChannel, setVerifyChannel] = useState('EMAIL');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(null);

  const needsPhone = verifyChannel === 'SMS' || verifyChannel === 'WHATSAPP';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateTravelerRegistration({
      fullName,
      email,
      phoneNumber,
      password,
      verifyChannel,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await registerApi.registerTraveler({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        password,
        verifyChannel,
      });

      if (response?.verification && response?.userId) {
        setOtpStep({
          userId: response.userId,
          channel: response.verification.channel || verifyChannel,
          target: response.verification.target || (needsPhone ? phoneNumber.trim() : email.trim()),
          cooldownSeconds: response.verification.cooldownSeconds || 60,
          devCode: response.verification.devCode || '',
        });
      } else {
        const createdUser = response?.user || response?.data?.user;
        if (createdUser) setUser(createdUser);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'تعذر إنشاء الحساب، يرجى مراجعة البيانات والمحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (res) => {
    const verifiedUser = res?.user || res?.data?.user;
    if (verifiedUser) {
      setUser(verifiedUser);
    }
    navigate('/');
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-8 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-5xl">
        <TravelerHeaderBanner />

        {otpStep ? (
          <div className="flex justify-center pt-4">
            <OtpVerificationCard
              userId={otpStep.userId}
              purpose="REGISTER_VERIFY"
              initialChannel={otpStep.channel}
              initialTarget={otpStep.target}
              initialCooldown={otpStep.cooldownSeconds}
              initialDevCode={otpStep.devCode}
              onSuccess={handleOtpSuccess}
              onBack={() => setOtpStep(null)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
            {/* Right Column in RTL: Animated Traveler SVG Showcase */}
            <aside className="lg:col-span-5 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8FFFB] border border-[#99F6E4] px-3 py-1 text-[11px] font-extrabold text-[#00806B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C8A8] animate-ping" />
                <span>حساب مسافر فوري (بدون انتظار موافقة)</span>
              </div>

              <h1 className="mt-2.5 text-lg sm:text-xl font-black text-[#0D2447] leading-snug">
                انطلق في رحلتك القادمة مع Travora خلال ثوانٍ
              </h1>
              <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                حساب المسافر يُفعّل مباشرة عبر رمز التحقق (OTP) دون الحاجة لمراجعة إدارية، لتبدأ حجز
                الفنادق والأنشطة فوراً.
              </p>

              <div className="mt-3">
                <TravelerSvgAnimation />
              </div>

              <div className="mt-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-black text-[#0D2447]">
                    هل تمثل فندقاً أو مطعماً أو شركة نقل؟
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    سجّل منشأتك في بوابة الشركاء المخصصة لإرسال طلبك للأدمن.
                  </div>
                </div>
                <Link
                  to="/partner-register"
                  className="shrink-0 rounded-xl bg-[#0D2447] hover:bg-[#0099FF] px-3 py-1.5 text-[11px] font-extrabold text-white transition"
                >
                  بوابة الشركاء ←
                </Link>
              </div>
            </aside>

            {/* Left Column in RTL: Compact Traveler Registration Form */}
            <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0D2447]">
                    بيانات حساب المسافر الجديد
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    أدخل بياناتك الأساسية واختر قناة استلام رمز التفعيل الفوري
                  </p>
                </div>
                <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2.5 py-1 text-[10px] font-extrabold text-[#0077CC]">
                  تفعيل فوري
                </span>
              </div>

              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2447] mb-1">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                      placeholder="مثال: أحمد محمد"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2447] mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-left text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#0D2447]">
                        رقم الهاتف (بالصيغة الدولية)
                      </label>
                      <span className="text-[10px] font-bold text-[#64748B]">
                        {needsPhone ? 'مطلوب للقناة' : 'اختياري'}
                      </span>
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      required={needsPhone}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-left text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                      placeholder="+201012345678"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2447] mb-1">
                      كلمة المرور (8 أحرف أو أكثر) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 pl-12 text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                        placeholder="8 أحرف أو أكثر"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#64748B] hover:text-[#0099FF]"
                      >
                        {showPassword ? 'إخفاء' : 'إظهار'}
                      </button>
                    </div>
                  </div>
                </div>

                <VerifyChannelSelector value={verifyChannel} onChange={setVerifyChannel} />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-black text-white shadow-[0_8px_20px_rgba(20,158,247,0.24)] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>جارٍ إنشاء الحساب وإرسال الرمز...</span>
                    </>
                  ) : (
                    <span>إنشاء حساب المسافر وإرسال رمز التحقق ←</span>
                  )}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
