import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { OtpVerificationCard } from '../../../shared/components/OtpVerificationCard';
import { useAuth } from '../../../shared/context/AuthContext';
import { registerApi } from '../api/registerApi';
import { validateTravelerRegistration } from '../models/registerModel';

// Same bottom features as the login design
const FEATURES = [
  {
    label: 'أمان عالي',
    icon: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    label: 'دعم متميز',
    icon: (
      <>
        <path d="M3 12a9 9 0 0 1 18 0" />
        <path d="M21 12v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M3 12v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
        <path d="M21 17v1a3 3 0 0 1-3 3h-4" />
      </>
    ),
  },
  {
    label: 'تجارب فاخرة',
    icon: (
      <>
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </>
    ),
  },
];

const REGISTER_CHANNELS = [
  { id: 'EMAIL', label: 'البريد الإلكتروني' },
  { id: 'SMS', label: 'رسالة نصية SMS' },
  { id: 'WHATSAPP', label: 'واتساب' },
];

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
          target:
            response.verification.target ||
            (needsPhone ? phoneNumber.trim() : email.trim()),
          cooldownSeconds: response.verification.cooldownSeconds || 60,
          devCode: response.verification.devCode || '',
        });
      } else {
        const createdUser = response?.user || response?.data?.user;
        if (createdUser) setUser(createdUser);
        navigate('/');
      }
    } catch (err) {
      setError(
        err.message || 'تعذر إنشاء الحساب، يرجى مراجعة البيانات والمحاولة مرة أخرى.'
      );
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

  /* ===== OTP step — same background, centered card ===== */
  if (otpStep) {
    return (
      <main
        dir="rtl"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#D8ECFB] p-5 font-['Cairo'] text-[#0B2B61]"
      >
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src="/images/travora-login-hero.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF6FF]/60 via-white/20 to-[#B9DFFF]/40" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <img
              src="/images/travora-logo.png"
              alt="Travora"
              className="mx-auto h-20 w-auto object-contain"
            />
          </div>

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
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#D8ECFB] font-['Cairo'] text-[#0B2B61]"
    >
      {/* ===== Full-screen background ===== */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/travora-login-hero.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF6FF]/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
      </div>

      {/* ===== Header: logo left / language right ===== */}
      <header
        dir="ltr"
        className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-10 lg:px-16"
      >
        <Link to="/" className="inline-flex items-center">
          <img
            src="/images/travora-logo.png"
            alt="Travora - More Than a Destination"
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>

        <button
          type="button"
          aria-label="اختيار اللغة"
          className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-5 py-2.5 text-sm font-bold text-[#123A6E] shadow-sm backdrop-blur-md transition hover:bg-white"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
          العربية
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>

      {/* ===== Content: hero text left / register card right ===== */}
      <div
        dir="ltr"
        className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-start gap-10 px-5 pb-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16 lg:pb-36"
      >
        {/* LEFT: headline over the background */}
        <section
          dir="rtl"
          className="order-2 pt-2 text-center lg:order-1 lg:pt-20 lg:pr-16"
        >
          <h1 className="text-[32px] font-extrabold leading-[1.55] text-[#0B3B7E] sm:text-[40px] lg:text-[46px]">
            ابدأ رحلتك الآن
            <br />
            في عالم Travora الذكي
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-8 text-[#46689C] sm:text-lg sm:leading-9">
            أنشئ حساب مسافر خلال ثوانٍ وفعّله فوراً عبر رمز التحقق،
            <br className="hidden sm:block" />
            لتبدأ حجز الفنادق والأنشطة مباشرة
          </p>
        </section>

        {/* RIGHT: register card */}
        <section
          dir="rtl"
          className="order-1 w-full max-w-[580px] justify-self-center rounded-[30px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_90px_rgba(10,55,120,0.18)] backdrop-blur-xl sm:p-9 lg:order-2 lg:mt-1 lg:justify-self-end lg:p-10"
        >
          {/* Card logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/images/travora-logo.png"
              alt="Travora"
              className="h-20 w-auto max-w-full object-contain sm:h-24"
            />
          </div>

          {/* Tabs — same positions as login: login left / register right (active) */}
          <div
            dir="ltr"
            className="mb-8 flex items-center rounded-full bg-[#EDF1F9] p-1.5"
          >
            <Link
              to="/login"
              className="flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3.5 text-sm font-bold text-[#1B3B6F] transition hover:bg-white/70 sm:text-[15px]"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="3" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
              </svg>
              <span>تسجيل الدخول</span>
            </Link>

            <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0843A6] to-[#0B5AD2] px-3 py-3.5 text-sm font-extrabold text-white shadow-md shadow-blue-600/25 sm:text-[15px]">
              <span>إنشاء حساب جديد</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M19 8v6m3-3h-6" />
              </svg>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Form — pill inputs, icons on the right */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="name"
                aria-label="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="الاسم الكامل"
                className="h-[60px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
              />

              <svg
                className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#1B3B6F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                required
                dir="auto"
                autoComplete="email"
                aria-label="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="h-[60px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
              />

              <svg
                className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#1B3B6F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                dir="ltr"
                required={needsPhone}
                autoComplete="tel"
                aria-label="رقم الهاتف بالصيغة الدولية"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={
                  needsPhone
                    ? 'رقم الهاتف (مطلوب للقناة) +2010...'
                    : 'رقم الهاتف (اختياري) +2010...'
                }
                className="h-[60px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
              />

              <svg
                className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#1B3B6F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                aria-label="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور (8 أحرف أو أكثر)"
                className="h-[60px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-14 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
              />

              <svg
                className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#1B3B6F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="3" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
              </svg>

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'
                }
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5E7799] transition hover:text-[#0B5AD2]"
              >
                {showPassword ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
                    <path d="m2 2 20 20" />
                  </svg>
                )}
              </button>
            </div>

            {/* Verification channel — styled like the design */}
            <div className="pt-1">
              <p className="mb-3 text-sm font-bold text-[#284A7C]">
                استلام رمز التحقق عبر
              </p>

              <div className="grid grid-cols-3 gap-2">
                {REGISTER_CHANNELS.map((ch) => {
                  const active = verifyChannel === ch.id;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setVerifyChannel(ch.id)}
                      className={`rounded-full border px-2 py-3 text-xs font-bold transition ${
                        active
                          ? 'border-[#0B5AD2] bg-blue-50 text-[#0B5AD2] shadow-sm'
                          : 'border-[#D9E2F2] bg-white text-[#7185A8] hover:border-[#B9CDF0]'
                      }`}
                    >
                      {ch.label}
                    </button>
                  );
                })}
              </div>

              {needsPhone && (
                <p className="mt-2 text-xs font-semibold text-[#7185A8]">
                  رقم الهاتف مطلوب لاستلام الرمز عبر القناة المختارة.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="group flex h-[60px] w-full items-center rounded-full bg-gradient-to-r from-[#093C95] to-[#0C60D2] px-7 text-[16px] font-extrabold text-white shadow-[0_14px_30px_rgba(8,70,170,0.30)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(8,70,170,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex-1 text-center">
                {submitting
                  ? 'جارٍ إنشاء الحساب وإرسال الرمز...'
                  : 'إنشاء الحساب وإرسال رمز التحقق'}
              </span>

              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg
                  className="h-6 w-6 transition group-hover:-translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5m7-7-7 7 7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm font-semibold text-[#4A648C]">
            لديك حساب بالفعل؟{' '}
            <Link
              to="/login"
              className="font-extrabold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
            >
              تسجيل الدخول
            </Link>
          </p>
        </section>
      </div>

      {/* ===== Bottom features band ===== */}
      <div className="relative z-10 mt-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
        <div className="bg-gradient-to-t from-[#0A4C9E]/80 via-[#2F7FD0]/45 to-transparent pt-8">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 px-5 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16">
            <div dir="ltr" className="grid grid-cols-3 divide-x divide-white/25">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  dir="rtl"
                  className="flex flex-col items-center gap-2 py-5 text-white"
                >
                  <svg
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                  <span className="text-xs font-bold sm:text-sm">{f.label}</span>
                </div>
              ))}
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>
    </main>
  );
}