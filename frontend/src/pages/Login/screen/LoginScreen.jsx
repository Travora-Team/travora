import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { OtpVerificationCard } from '../../../shared/components/OtpVerificationCard';
import { useAuth } from '../../../shared/context/AuthContext';
import { loginApi } from '../../Login/api/loginApi';
import { DEMO_ROLE_ACCOUNTS, LOGIN_CHANNELS, getPostLoginRoute } from '../../Login/models/loginModel';
import { registerApi } from '../../Register/api/registerApi';
import { REGISTER_CHANNELS, validateTravelerRegistration } from '../../Register/models/registerModel';
import { extractOtpSessionParams } from '../../VerifyOtp/models/verifyOtpModel';

// ثوابت المزايا السفلية — تُعرّف مرة واحدة خارج المكون لمنع إعادة التخصيص في الذاكرة
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

const HERO_COPY = {
  login: {
    titleLine1: 'مرحباً بعودتك إلى',
    titleLine2: 'عالم Travora الذكي',
    subtitleLine1: 'اكتشف وجهات استثنائية وتجارب سياحية فاخرة',
    subtitleLine2: 'مع منصة السياحة الذكية',
  },
  register: {
    titleLine1: 'ابدأ رحلتك الآن',
    titleLine2: 'في عالم Travora الذكي',
    subtitleLine1: 'أنشئ حساب مسافر خلال ثوانٍ وفعّله فوراً عبر رمز التحقق،',
    subtitleLine2: 'لتبدأ حجز الفنادق والأنشطة مباشرة',
  },
  otp: {
    titleLine1: 'خطوة واحدة أخيرة',
    titleLine2: 'لتأمين حسابك في Travora',
    subtitleLine1: 'أدخل رمز التحقق المرسل إليك لإتمام التفعيل الفوري',
    subtitleLine2: 'والانطلاق في تخطيط رحلتك الذكية',
  },
};

function resolveModeFromPath(pathname) {
  if (pathname.startsWith('/register')) return 'register';
  if (pathname.startsWith('/verify-otp')) return 'otp';
  return 'login';
}

export default function AuthScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuth();

  const copyCodeParam = searchParams.get('copyCode') || '';
  const requiredRoleParam = searchParams.get('required') || '';

  // تحديد الوضع النشط (login | register | otp) من المسار الحالي دون إعادة تحميل الغلاف أو الصور
  const routeMode = useMemo(() => resolveModeFromPath(location.pathname), [location.pathname]);

  // حالة خطوة التحقق المدمجة داخل نفس البطاقة
  const [otpStep, setOtpStep] = useState(() => {
    if (location.pathname.startsWith('/verify-otp')) {
      const extracted = extractOtpSessionParams(location.state || {}, searchParams);
      return extracted.userId ? extracted : null;
    }
    return null;
  });

  const activeMode = otpStep ? 'otp' : routeMode === 'otp' ? 'login' : routeMode;
  const heroText = HERO_COPY[activeMode] || HERO_COPY.login;

  // حالات مشتركة محفوظة في الذاكرة عند التنقل بين التبويبين (تمنع ضياع ما كتبه المستخدم)
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // خيارات الدخول (مباشر أو عبر رمز OTP) وقناة التحقق
  const [loginMethod, setLoginMethod] = useState('direct'); // 'direct' | 'otp'
  const [verifyChannel, setVerifyChannel] = useState('EMAIL');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedBanner, setCopiedBanner] = useState(false);

  const needsPhone = verifyChannel === 'SMS' || verifyChannel === 'WHATSAPP';

  useEffect(() => {
    if (copyCodeParam && navigator.clipboard) {
      navigator.clipboard
        .writeText(copyCodeParam)
        .then(() => setCopiedBanner(true))
        .catch(() => {});
    }
  }, [copyCodeParam]);

  // تبديل التبويب فوريًا داخل نفس المكون دون تفريغ الصور أو إعادة بناء شجرة DOM
  const handleSwitchTab = useCallback(
    (targetMode) => {
      setError('');
      setOtpStep(null);
      const targetPath = targetMode === 'register' ? '/register' : '/login';
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    },
    [location.pathname, navigate]
  );

  // تعبئة سريعة لحسابات التجربة (أدمن / فندق / مطعم / مرشد / نقل / مسافر)
  const handleSelectDemoAccount = useCallback((demo) => {
    setIdentifier(demo.email);
    setPassword(demo.password);
    setLoginMethod('direct');
    setError('');
  }, []);

  // معالجة تسجيل الدخول (مباشر أو عبر OTP)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف.');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setSubmitting(true);
    try {
      if (loginMethod === 'otp') {
        const res = await loginApi.initiateLoginOtp({
          identifier: cleanIdentifier,
          password,
          channel: verifyChannel,
        });
        if (res?.verification && res?.userId) {
          setOtpStep({
            userId: res.userId,
            purpose: 'LOGIN_OTP',
            channel: res.verification.channel || verifyChannel,
            target: res.verification.target || cleanIdentifier,
            cooldownSeconds: res.verification.cooldownSeconds || 60,
            devCode: res.verification.devCode || '',
          });
          return;
        }
      }

      const res = await loginApi.loginDirect({
        email: cleanIdentifier,
        password,
        rememberMe,
      });

      const loggedUser = res?.data?.user || res?.user;
      if (loggedUser) {
        setUser(loggedUser);
      }
      navigate(getPostLoginRoute(loggedUser));
    } catch (err) {
      setError(err.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  // معالجة إنشاء حساب مسافر جديد
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = identifier.trim();
    const validationError = validateTravelerRegistration({
      fullName,
      email: cleanEmail,
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
        email: cleanEmail,
        phoneNumber: phoneNumber.trim() || undefined,
        password,
        verifyChannel,
      });

      if (response?.verification && response?.userId) {
        setOtpStep({
          userId: response.userId,
          purpose: 'REGISTER_VERIFY',
          channel: response.verification.channel || verifyChannel,
          target:
            response.verification.target ||
            (needsPhone ? phoneNumber.trim() : cleanEmail),
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

  // نجاح التحقق من رمز الـ OTP
  const handleOtpSuccess = useCallback(
    (res) => {
      const verifiedUser = res?.user || res?.data?.user;
      if (verifiedUser) {
        setUser(verifiedUser);
      }
      setOtpStep(null);
      navigate(getPostLoginRoute(verifiedUser));
    },
    [navigate, setUser]
  );

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#D8ECFB] font-['Cairo'] text-[#0B2B61]"
    >
      {/* ===== الخلفية الموحدة — تُحمّل وتُفك شيفرتها مرة واحدة فقط في الذاكرة ===== */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/travora-login-hero.png"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF6FF]/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
      </div>

      {/* ===== الشريط العلوي الموحد ===== */}
      <header
        dir="ltr"
        className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-10 lg:px-16"
      >
        <Link to="/" className="inline-flex items-center">
          <img
            src="/images/travora-logo.png"
            alt="Travora - More Than a Destination"
            decoding="async"
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/partner-register"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2.5 text-xs font-extrabold text-[#0B3B7E] shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            <span>🏨 انضم كشريك خدمة</span>
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
          </button>
        </div>
      </header>

      {/* ===== المحتوى الرئيسي: النص الترحيبي يساراً والبطاقة الذكية يميناً ===== */}
      <div
        dir="ltr"
        className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-start gap-10 px-5 pb-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16 lg:pb-36"
      >
        {/* اليسار: العنوان الترحيبي المتغير بسلاسة بدون إعادة تحميل الخلفية */}
        <section
          dir="rtl"
          className="order-2 pt-2 text-center transition-opacity duration-200 lg:order-1 lg:pt-20 lg:pr-16"
        >
          <h1 className="text-[32px] font-extrabold leading-[1.55] text-[#0B3B7E] sm:text-[40px] lg:text-[46px]">
            {heroText.titleLine1}
            <br />
            {heroText.titleLine2}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-8 text-[#46689C] sm:text-lg sm:leading-9">
            {heroText.subtitleLine1}
            <br className="hidden sm:block" />
            {heroText.subtitleLine2}
          </p>
        </section>

        {/* اليمين: البطاقة الزجاجية الموحدة (تحافظ على الشعار والتبويبات في الذاكرة) */}
        <section
          dir="rtl"
          className="order-1 w-full max-w-[580px] justify-self-center rounded-[30px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_90px_rgba(10,55,120,0.18)] backdrop-blur-xl sm:p-9 lg:order-2 lg:mt-1 lg:justify-self-end lg:p-10"
        >
          {/* شعار البطاقة — يُحمّل مرة واحدة */}
          <div className="mb-6 flex justify-center">
            <img
              src="/images/travora-logo.png"
              alt="Travora"
              decoding="async"
              className="h-20 w-auto max-w-full object-contain sm:h-22"
            />
          </div>

          {/* شريط التبويبات الموحد — يعمل بتبديل الحالة اللحظي بدون إعادة تحميل الصفحة */}
          {!otpStep && (
            <div
              dir="ltr"
              role="tablist"
              aria-label="التبديل بين تسجيل الدخول وإنشاء حساب"
              className="mb-7 flex items-center rounded-full bg-[#EDF1F9] p-1.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'login'}
                onClick={() => handleSwitchTab('login')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3.5 text-sm transition sm:text-[15px] ${
                  activeMode === 'login'
                    ? 'bg-gradient-to-r from-[#0843A6] to-[#0B5AD2] font-extrabold text-white shadow-md shadow-blue-600/25'
                    : 'font-bold text-[#1B3B6F] hover:bg-white/70'
                }`}
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
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'register'}
                onClick={() => handleSwitchTab('register')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3.5 text-sm transition sm:text-[15px] ${
                  activeMode === 'register'
                    ? 'bg-gradient-to-r from-[#0843A6] to-[#0B5AD2] font-extrabold text-white shadow-md shadow-blue-600/25'
                    : 'font-bold text-[#1B3B6F] hover:bg-white/70'
                }`}
              >
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
              </button>
            </div>
          )}

          {/* ===== الحالة 1: خطوة التحقق من رمز OTP داخل نفس البطاقة ===== */}
          {otpStep ? (
            <OtpVerificationCard
              userId={otpStep.userId}
              purpose={otpStep.purpose || 'REGISTER_VERIFY'}
              initialChannel={otpStep.channel}
              initialTarget={otpStep.target}
              initialCooldown={otpStep.cooldownSeconds}
              initialDevCode={otpStep.devCode}
              onSuccess={handleOtpSuccess}
              onBack={() => setOtpStep(null)}
            />
          ) : activeMode === 'login' ? (
            /* ===== الحالة 2: نموذج تسجيل الدخول ===== */
            <>
              {requiredRoleParam && (
                <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-7 text-blue-800">
                  {requiredRoleParam === 'admin'
                    ? '🔒 لوحة تحكم الإدارة مخصصة لمدير المنصة فقط. يرجى تسجيل الدخول بحساب الإدارة للمتابعة.'
                    : '🔒 يرجى تسجيل الدخول بحساب شريك الخدمة للوصول إلى لوحة التحكم المخصصة لمنشأتك.'}
                </div>
              )}

              {copyCodeParam && (
                <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                  <span>
                    رمز التحقق:
                    <strong dir="ltr" className="mr-2 font-mono tracking-widest">
                      {copyCodeParam}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(copyCodeParam)
                        .then(() => setCopiedBanner(true))
                        .catch(() => {});
                    }}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white transition hover:bg-emerald-700"
                  >
                    {copiedBanner ? '✓ تم النسخ' : 'نسخ'}
                  </button>
                </div>
              )}

              {/* مفتاح اختيار نمط الدخول (كلمة المرور المباشرة أو تحقق ثنائي OTP) */}
              <div className="mb-5 flex items-center justify-between gap-2 rounded-2xl bg-[#F4F7FC] p-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginMethod('direct')}
                  className={`flex-1 rounded-xl py-2.5 transition ${
                    loginMethod === 'direct'
                      ? 'bg-white font-extrabold text-[#0B5AD2] shadow-xs'
                      : 'text-[#5B7396] hover:text-[#14356E]'
                  }`}
                >
                  دخول سريع بكلمة المرور
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 rounded-xl py-2.5 transition ${
                    loginMethod === 'otp'
                      ? 'bg-white font-extrabold text-[#0B5AD2] shadow-xs'
                      : 'text-[#5B7396] hover:text-[#14356E]'
                  }`}
                >
                  دخول ثنائي برمز التحقق (OTP)
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* البريد الإلكتروني أو الهاتف */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="email"
                    required
                    dir="auto"
                    autoComplete="username"
                    aria-label="البريد الإلكتروني أو رقم الهاتف"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="البريد الإلكتروني أو رقم الهاتف"
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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

                {/* كلمة المرور */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    aria-label="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-14 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5E7799] transition hover:text-[#0B5AD2]"
                  >
                    {showPassword ? (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
                        <path d="m2 2 20 20" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* اختيار قناة الـ OTP عند تفعيل الدخول الثنائي */}
                {loginMethod === 'otp' && (
                  <div className="pt-1">
                    <p className="mb-2 text-xs font-bold text-[#284A7C]">قناة استلام رمز الدخول:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {LOGIN_CHANNELS.map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setVerifyChannel(ch.id)}
                          className={`rounded-full border px-2 py-2.5 text-xs font-bold transition ${
                            verifyChannel === ch.id
                              ? 'border-[#0B5AD2] bg-blue-50 text-[#0B5AD2] shadow-xs'
                              : 'border-[#D9E2F2] bg-white text-[#7185A8] hover:border-[#B9CDF0]'
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 font-bold text-[#33507E]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-5 w-5 cursor-pointer accent-[#0B5ED7]"
                    />
                    تذكرني
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowDemoAccounts((prev) => !prev)}
                    className="font-bold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
                  >
                    {showDemoAccounts ? 'إخفاء الحسابات التجريبية' : 'حسابات تجريبية سريعة ⚡'}
                  </button>
                </div>

                {showDemoAccounts && (
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3">
                    {DEMO_ROLE_ACCOUNTS.map((demo) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => handleSelectDemoAccount(demo)}
                        className="flex flex-col items-start rounded-xl border border-[#E2E8F0] bg-white p-2 text-right transition hover:border-[#0099FF] hover:bg-[#EEF8FF]/50"
                      >
                        <span className="text-xs font-extrabold text-[#0D2447]">{demo.label}</span>
                        <span className="text-[10px] text-[#64748B]">{demo.subLabel}</span>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-[58px] w-full items-center rounded-full bg-gradient-to-r from-[#093C95] to-[#0C60D2] px-7 text-[16px] font-extrabold text-white shadow-[0_14px_30px_rgba(8,70,170,0.30)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(8,70,170,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex-1 text-center">
                    {submitting
                      ? 'جارٍ التحقق...'
                      : loginMethod === 'otp'
                      ? 'إرسال رمز الدخول الآن'
                      : 'تسجيل الدخول الآن'}
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

              <p className="mt-6 text-center text-sm font-semibold text-[#4A648C]">
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('register')}
                  className="font-extrabold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
                >
                  إنشاء حساب جديد
                </button>
              </p>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="mt-4 block rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700"
                >
                  الانتقال إلى لوحة الإدارة
                </Link>
              )}

              {user?.role === 'provider' && (
                <Link
                  to={`/provider/${user.providerType || 'hotel'}`}
                  className="mt-4 block rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700"
                >
                  الانتقال إلى لوحة تحكم الشريك
                </Link>
              )}
            </>
          ) : (
            /* ===== الحالة 3: نموذج إنشاء حساب جديد داخل نفس البطاقة ===== */
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* الاسم الكامل */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    aria-label="الاسم الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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

                {/* البريد الإلكتروني (مشترك مع حقل الدخول لمنع إعادة الكتابة) */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    dir="auto"
                    autoComplete="email"
                    aria-label="البريد الإلكتروني"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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

                {/* رقم الهاتف */}
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
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-5 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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

                {/* كلمة المرور */}
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
                    className="h-[58px] w-full rounded-full border border-[#D9E2F2] bg-white/80 pl-14 pr-14 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5E7799] transition hover:text-[#0B5AD2]"
                  >
                    {showPassword ? (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
                        <path d="m2 2 20 20" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* قناة استلام رمز التحقق */}
                <div className="pt-1">
                  <p className="mb-2.5 text-xs font-bold text-[#284A7C]">
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
                          className={`rounded-full border px-2 py-2.5 text-xs font-bold transition ${
                            active
                              ? 'border-[#0B5AD2] bg-blue-50 text-[#0B5AD2] shadow-xs'
                              : 'border-[#D9E2F2] bg-white text-[#7185A8] hover:border-[#B9CDF0]'
                          }`}
                        >
                          {ch.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-[58px] w-full items-center rounded-full bg-gradient-to-r from-[#093C95] to-[#0C60D2] px-7 text-[16px] font-extrabold text-white shadow-[0_14px_30px_rgba(8,70,170,0.30)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(8,70,170,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
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

              <p className="mt-6 text-center text-sm font-semibold text-[#4A648C]">
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="font-extrabold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
                >
                  تسجيل الدخول
                </button>
              </p>
            </>
          )}
        </section>
      </div>

      {/* ===== الشريط السفلي الموحد للمزايا — يبقى مثبتاً دون إعادة رسم ===== */}
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