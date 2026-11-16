import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { OtpVerificationCard } from '../../../shared/components/OtpVerificationCard';
import { useAuth } from '../../../shared/context/AuthContext';
import {
  DEMO_ROLE_ACCOUNTS,
  LOGIN_CHANNELS,
  getPostLoginRoute,
} from '../models/loginModel';
import { loginApi } from '../api/loginApi';
import { LoginHeader } from '../components/LoginHeader';
import { LoginSvgAnimation } from '../components/LoginSvgAnimation';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuth();
  const copyCodeParam = searchParams.get('copyCode') || '';
  const requiredRoleParam = searchParams.get('required') || '';
  const [copiedBanner, setCopiedBanner] = useState(false);

  useEffect(() => {
    if (copyCodeParam && navigator.clipboard) {
      navigator.clipboard
        .writeText(copyCodeParam)
        .then(() => setCopiedBanner(true))
        .catch(() => {});
    }
  }, [copyCodeParam]);

  const [loginMode, setLoginMode] = useState('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [channel, setChannel] = useState('EMAIL');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(null);

  const handleQuickDemoLogin = async (demoAccount) => {
    setError('');
    setLoginMode('password');
    setIdentifier(demoAccount.email);
    setPassword(demoAccount.password);
    setSubmitting(true);
    try {
      const res = await loginApi.loginDirect({
        email: demoAccount.email,
        password: demoAccount.password,
      });
      const loggedUser = res?.data?.user || res?.user;
      if (loggedUser) {
        setUser(loggedUser);
      }
      navigate(getPostLoginRoute(loggedUser));
    } catch (err) {
      setError(err.message || 'تعذر تسجيل الدخول السريع، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

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
      if (loginMode === 'otp') {
        const res = await loginApi.initiateLoginOtp({
          identifier: identifier.trim(),
          password,
          channel,
        });

        setOtpStep({
          userId: res.userId,
          channel: res.verification?.channel || channel,
          target: res.verification?.target || identifier.trim(),
          cooldownSeconds: res.verification?.cooldownSeconds || 60,
          devCode: res.verification?.devCode || '',
        });
      } else {
        const res = await loginApi.loginDirect({
          email: identifier.trim(),
          password,
        });

        const loggedUser = res?.data?.user || res?.user;
        if (loggedUser) {
          setUser(loggedUser);
        }
        navigate(getPostLoginRoute(loggedUser));
      }
    } catch (err) {
      setError(err.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (res) => {
    const loggedUser = res?.user || res?.data?.user;
    if (loggedUser) {
      setUser(loggedUser);
    }
    navigate(getPostLoginRoute(loggedUser));
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-8 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-5xl">
        {/* Unified Top Navigation Strip */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCEBFA] bg-white/90 px-3.5 py-2 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-3 py-1.5 text-xs font-extrabold text-white shadow-2xs">
              🔐 بوابة تسجيل الدخول الموحدة
            </span>
            <Link
              to="/register"
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#475569] hover:bg-[#F2F7FD] hover:text-[#0099FF] transition"
            >
              ✈️ حساب مسافر جديد
            </Link>
            <Link
              to="/partner-register"
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#475569] hover:bg-[#F2F7FD] hover:text-[#0099FF] transition"
            >
              🏨 انضمام كمزود خدمة
            </Link>
          </div>

          {user?.role === 'admin' ? (
            <Link
              to="/admin"
              className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs font-extrabold text-[#0077CC] hover:bg-[#EEF8FF] transition"
            >
              🛡️ لوحة تحكم الأدمن ↗
            </Link>
          ) : user?.role === 'provider' ? (
            <Link
              to={`/provider/${user.providerType || 'hotel'}`}
              className="rounded-xl border border-[#99F6E4] bg-[#E8FFFB] px-3 py-1.5 text-xs font-extrabold text-[#00806B] hover:bg-[#CCFBF1] transition"
            >
              لوحة تحكم شريك الخدمة ↗
            </Link>
          ) : (
            <span className="text-[11px] font-bold text-[#64748B]">
              توجيه تلقائي حسب صلاحية الحساب (أدمن • شريك خدمة • مسافر)
            </span>
          )}
        </div>

        {requiredRoleParam && (
          <div className="mb-3 rounded-2xl border border-[#BCE3FF] bg-[#EEF8FF] px-4 py-2.5 text-xs font-bold text-[#0077CC]">
            {requiredRoleParam === 'admin'
              ? '🔒 لوحة تحكم الأدمن مخصصة لمدير المنصة فقط. يرجى تسجيل الدخول بحساب الأدمن للمتابعة.'
              : '🔒 يرجى تسجيل الدخول بحساب شريك الخدمة للوصول إلى لوحة التحكم المخصصة لمنشأتك.'}
          </div>
        )}

        {otpStep ? (
          <div className="flex justify-center pt-4">
            <OtpVerificationCard
              userId={otpStep.userId}
              purpose="LOGIN_OTP"
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
            {/* Right Column in RTL: Animated Login SVG Showcase */}
            <aside className="lg:col-span-5 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-3 py-1 text-[11px] font-extrabold text-[#0077CC]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0099FF] animate-ping" />
                <span>بوابة المسافرين والشركاء والإدارة</span>
              </div>

              <h1 className="mt-2.5 text-lg sm:text-xl font-black text-[#0D2447] leading-snug">
                مرحباً بعودتك إلى عالم Travora الذكي
              </h1>
              <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                عند تسجيل الدخول يتعرف النظام تلقائياً على نوع حسابك ويوجّهك إلى لوحة التحكم المخصصة
                لك (أدمن، فندق، مطعم، مرشد سياحي، أو شركة نقل).
              </p>

              <div className="mt-3">
                <LoginSvgAnimation loginMode={loginMode} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/register"
                  className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] hover:bg-[#EEF8FF] p-2.5 text-center transition"
                >
                  <div className="text-[11px] font-black text-[#0D2447]">ليس لديك حساب مسافر؟</div>
                  <div className="text-[10px] font-extrabold text-[#0099FF] mt-0.5">
                    إنشاء حساب فوري ←
                  </div>
                </Link>
                <Link
                  to="/partner-register"
                  className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] hover:bg-[#E8FFFB] p-2.5 text-center transition"
                >
                  <div className="text-[11px] font-black text-[#0D2447]">تمتلك خدمة سياحية؟</div>
                  <div className="text-[10px] font-extrabold text-[#00806B] mt-0.5">
                    سجّل كشريك خدمة ←
                  </div>
                </Link>
              </div>
            </aside>

            {/* Left Column in RTL: Compact Login Form + Quick Role Switcher */}
            <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <LoginHeader
                loginMode={loginMode}
                onSelectMode={(mode) => {
                  setLoginMode(mode);
                  setError('');
                }}
              />

              {/* Quick One-Click Demo Login Bar for Admin & Each Provider Type */}
              <div className="mt-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-black text-[#0D2447]">
                    ⚡ دخول فوري لتجربة لوحات التحكم المختلفة (بضغطة واحدة):
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">
                    كلمة المرور الموحدة: <code dir="ltr">Travora@2026!</code>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {DEMO_ROLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={submitting}
                      onClick={() => handleQuickDemoLogin(acc)}
                      className={`flex flex-col items-start rounded-xl border p-2 text-right transition hover:-translate-y-0.5 ${acc.badgeColor}`}
                    >
                      <span className="text-[11px] font-black">{acc.label}</span>
                      <span className="mt-0.5 text-[9px] opacity-80">{acc.subLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {copyCodeParam && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
                  <span>
                    رمزك من البريد:{' '}
                    <strong dir="ltr" className="font-mono text-sm tracking-widest">
                      {copyCodeParam}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(copyCodeParam);
                      setCopiedBanner(true);
                    }}
                    className="rounded-lg bg-emerald-600 px-2.5 py-1 text-white transition hover:bg-emerald-700"
                  >
                    {copiedBanner ? '✓ تم النسخ' : '📋 نسخ الرمز'}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0D2447] mb-1">
                    {loginMode === 'otp'
                      ? 'البريد الإلكتروني أو رقم الهاتف *'
                      : 'البريد الإلكتروني *'}
                  </label>
                  <input
                    type={loginMode === 'otp' ? 'text' : 'email'}
                    required
                    dir="ltr"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-left text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                    placeholder={
                      loginMode === 'otp' ? 'name@example.com أو +2010...' : 'admin@travora.eg'
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2447] mb-1">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 pl-12 text-xs transition outline-none focus:border-[#0099FF] focus:bg-white"
                      placeholder="••••••••"
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

                {loginMode === 'otp' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0D2447] mb-1.5">
                      استلام رمز الدخول عبر
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {LOGIN_CHANNELS.map((ch) => {
                        const active = channel === ch.id;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => setChannel(ch.id)}
                            className={`h-9 rounded-xl border px-2 text-xs font-bold transition ${
                              active
                                ? 'border-[#0099FF] bg-[#EEF8FF] text-[#0077CC]'
                                : 'border-[#DCEBFA] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                            }`}
                          >
                            {ch.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-black text-white shadow-[0_8px_20px_rgba(20,158,247,0.24)] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>
                        {loginMode === 'otp'
                          ? 'جارٍ إرسال رمز التحقق...'
                          : 'جارٍ تسجيل الدخول...'}
                      </span>
                    </>
                  ) : (
                    <span>
                      {loginMode === 'otp' ? 'متابعة وإرسال رمز التحقق ←' : 'تسجيل الدخول الآن ←'}
                    </span>
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
