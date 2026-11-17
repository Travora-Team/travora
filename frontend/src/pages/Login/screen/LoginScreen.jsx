import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../../shared/context/AuthContext';
import { getPostLoginRoute } from '../models/loginModel';
import { loginApi } from '../api/loginApi';

// Bottom features — rendered LTR so "أمان عالي" is leftmost, exactly like the design
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

export default function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuth();

  const copyCodeParam = searchParams.get('copyCode') || '';
  const requiredRoleParam = searchParams.get('required') || '';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedBanner, setCopiedBanner] = useState(false);

  useEffect(() => {
    if (copyCodeParam && navigator.clipboard) {
      navigator.clipboard
        .writeText(copyCodeParam)
        .then(() => setCopiedBanner(true))
        .catch(() => {});
    }
  }, [copyCodeParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف.');
      return;
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await loginApi.loginDirect({
        email: identifier.trim(),
        password,
        rememberMe,
      });

      const loggedUser = res?.data?.user || res?.user;

      if (loggedUser) {
        setUser(loggedUser);
      }

      navigate(getPostLoginRoute(loggedUser));
    } catch (err) {
      setError(
        err.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#D8ECFB] font-['Cairo'] text-[#0B2B61]"
    >
      {/* ===== Full-screen background (the complete design artwork) ===== */}
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

      {/* ===== Content: hero text left / login card right ===== */}
      <div
        dir="ltr"
        className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-start gap-10 px-5 pb-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16 lg:pb-36"
      >
        {/* LEFT: headline directly over the background (no card, no badge) */}
        <section
          dir="rtl"
          className="order-2 pt-2 text-center lg:order-1 lg:pt-20 lg:pr-16"
        >
          <h1 className="text-[32px] font-extrabold leading-[1.55] text-[#0B3B7E] sm:text-[40px] lg:text-[46px]">
            مرحباً بعودتك إلى
            <br />
            عالم Travora الذكي
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-8 text-[#46689C] sm:text-lg sm:leading-9">
            اكتشف وجهات استثنائية وتجارب سياحية فاخرة
            <br className="hidden sm:block" />
            مع منصة السياحة الذكية
          </p>
        </section>

        {/* RIGHT: login card */}
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

          {/* Tabs — LTR so the active blue tab is on the LEFT like the design */}
          <div
            dir="ltr"
            className="mb-8 flex items-center rounded-full bg-[#EDF1F9] p-1.5"
          >
            <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0843A6] to-[#0B5AD2] px-3 py-3.5 text-sm font-extrabold text-white shadow-md shadow-blue-600/25 sm:text-[15px]">
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
            </div>

            <Link
              to="/register"
              className="flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3.5 text-sm font-bold text-[#1B3B6F] transition hover:bg-white/70 sm:text-[15px]"
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
            </Link>
          </div>

          {/* Required role notice (conditional — hidden by default) */}
          {requiredRoleParam && (
            <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-7 text-blue-800">
              {requiredRoleParam === 'admin'
                ? '🔒 لوحة تحكم الإدارة مخصصة لمدير المنصة فقط. يرجى تسجيل الدخول بحساب الإدارة للمتابعة.'
                : '🔒 يرجى تسجيل الدخول بحساب شريك الخدمة للوصول إلى لوحة التحكم المخصصة لمنشأتك.'}
            </div>
          )}

          {/* Copy code banner (conditional) */}
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

          {/* Error (conditional) */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Form — pill inputs, icons on the right, no external labels */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Phone */}
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

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                aria-label="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
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

            {/* Remember me (right) / Forgot password (left) */}
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

              <Link
                to="/forgot-password"
                className="font-bold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit — arrow on the left */}
            <button
              type="submit"
              disabled={submitting}
              className="group flex h-[60px] w-full items-center rounded-full bg-gradient-to-r from-[#093C95] to-[#0C60D2] px-7 text-[17px] font-extrabold text-white shadow-[0_14px_30px_rgba(8,70,170,0.30)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(8,70,170,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex-1 text-center">
                {submitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول الآن'}
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

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#DCE4F2]" />
            <span className="text-sm font-bold text-[#5B7396]">أو</span>
            <div className="h-px flex-1 bg-[#DCE4F2]" />
          </div>

          {/* Social login — LTR so Google is leftmost like the design */}
          <div dir="ltr" className="grid grid-cols-3 gap-3">
            <button
              type="button"
              disabled
              title="تسجيل الدخول عبر Google قريباً"
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#D9E2F2] bg-white text-sm font-bold text-[#1F3A63] transition hover:bg-[#F6F9FF] disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              disabled
              title="تسجيل الدخول عبر Apple قريباً"
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#D9E2F2] bg-white text-sm font-bold text-[#1F3A63] transition hover:bg-[#F6F9FF] disabled:cursor-not-allowed"
            >
              <svg
                className="h-6 w-6 fill-current text-[#111827]"
                viewBox="0 0 24 24"
              >
                <path d="M16.37 12.58c.02 2.25 1.97 3 1.99 3.01-.02.05-.31 1.08-1.03 2.13-.62.91-1.26 1.81-2.27 1.83-.99.02-1.31-.59-2.44-.59-1.13 0-1.48.57-2.42.61-.97.04-1.71-.98-2.34-1.88-1.28-1.85-2.26-5.23-.94-7.51.65-1.13 1.81-1.84 3.06-1.86.96-.02 1.86.65 2.44.65.58 0 1.67-.8 2.81-.68.48.02 1.83.19 2.7 1.47-.07.04-1.61.94-1.56 2.82ZM14.5 6.83c.51-.62.85-1.48.76-2.34-.74.03-1.64.49-2.17 1.11-.48.55-.9 1.43-.78 2.27.83.06 1.68-.42 2.19-1.04Z" />
              </svg>
              Apple
            </button>

            <button
              type="button"
              disabled
              title="تسجيل الدخول عبر X قريباً"
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#D9E2F2] bg-white text-sm font-bold text-[#1F3A63] transition hover:bg-[#F6F9FF] disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5 fill-current text-[#111827]"
                viewBox="0 0 24 24"
              >
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.17 2.25H8l4.72 6.24 5.52-6.24Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
              </svg>
              X
            </button>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-sm font-semibold text-[#4A648C]">
            ليس لديك حساب؟{' '}
            <Link
              to="/register"
              className="font-extrabold text-[#0B5ED7] underline underline-offset-4 transition hover:text-[#009FEF]"
            >
              إنشاء حساب جديد
            </Link>
          </p>

          {/* Logged-in shortcuts (conditional — hidden by default) */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="mt-5 block rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700"
            >
              الانتقال إلى لوحة الإدارة
            </Link>
          )}

          {user?.role === 'provider' && (
            <Link
              to={`/provider/${user.providerType || 'hotel'}`}
              className="mt-5 block rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700"
            >
              الانتقال إلى لوحة تحكم الشريك
            </Link>
          )}
        </section>
      </div>

      {/* ===== Bottom features band (full width, items on the left) ===== */}
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
                  <span className="text-xs font-bold sm:text-sm">
                    {f.label}
                  </span>
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