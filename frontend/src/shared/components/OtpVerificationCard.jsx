import { useEffect, useRef, useState } from "react";
import { authApi } from "../api/authApi";

const CHANNEL_LABELS = {
  EMAIL: {
    title: "البريد الإلكتروني",
    badge: "بريد إلكتروني",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  SMS: {
    title: "الرسائل النصية (SMS)",
    badge: "رسالة نصية SMS",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M12 18h.01" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
  },
  WHATSAPP: {
    title: "واتساب (WhatsApp)",
    badge: "واتساب",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export function OtpVerificationCard({
  userId,
  purpose = "REGISTER_VERIFY", // 'REGISTER_VERIFY' | 'LOGIN_OTP'
  initialChannel = "EMAIL",
  initialTarget = "",
  initialCooldown = 60,
  initialDevCode = "",
  onSuccess,
  onBack,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [channel, setChannel] = useState(initialChannel || "EMAIL");
  const [target, setTarget] = useState(initialTarget || "");
  const [cooldown, setCooldown] = useState(initialCooldown || 60);
  const [devCode, setDevCode] = useState(initialDevCode || "");
  const [copiedDev, setCopiedDev] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const codeString = digits.join("");

  const applySixDigits = (rawText) => {
    const cleaned = (rawText || "").replace(/\D/g, "").slice(0, 6);
    if (!cleaned) return false;
    const next = ["", "", "", "", "", ""];
    cleaned.split("").forEach((ch, idx) => {
      next[idx] = ch;
    });
    setDigits(next);
    setError("");
    const focusIdx = Math.min(cleaned.length, 5);
    inputsRef.current[focusIdx]?.focus();
    return true;
  };

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const next = [...digits];
      chars.forEach((char, idx) => {
        if (index + idx < 6) {
          next[index + idx] = char;
        }
      });
      setDigits(next);
      const nextFocusIndex = Math.min(index + chars.length, 5);
      inputsRef.current[nextFocusIndex]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError("");

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    applySixDigits(pasted);
  };

  const handleClipboardPasteButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!applySixDigits(text)) {
        setError("الحافظة لا تحتوي على رمز مكون من أرقام.");
      }
    } catch {
      setError("يرجى استخدام اللصق المباشر (Ctrl+V) داخل خانات الرمز.");
    }
  };

  const handleCopyDevCode = async () => {
    if (!devCode) return;
    try {
      await navigator.clipboard.writeText(devCode);
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } catch {
      // Fallback
    }
    applySixDigits(devCode);
  };

  const handleVerifySubmit = async (e) => {
    e?.preventDefault();
    if (codeString.length !== 6) {
      setError("يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.");
      return;
    }

    setVerifying(true);
    setError("");
    setInfoMessage("");

    try {
      const response =
        purpose === "REGISTER_VERIFY"
          ? await authApi.verifyRegistrationOtp({
              userId,
              channel,
              code: codeString,
            })
          : await authApi.verifyLoginOtp({
              userId,
              channel,
              code: codeString,
            });

      onSuccess?.(response);
    } catch (err) {
      setError(err.message || "رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async (selectedChannel = channel) => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await authApi.resendOtp({
        userId,
        channel: selectedChannel,
        purpose,
      });

      const verification = response?.verification || {};
      setChannel(verification.channel || selectedChannel);
      if (verification.target) setTarget(verification.target);
      setCooldown(verification.cooldownSeconds || 60);
      setDevCode(verification.devCode || "");
      setDigits(["", "", "", "", "", ""]);
      setInfoMessage(response?.message || "تم إعادة إرسال رمز تحقق جديد بنجاح.");
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.message || "تعذر إعادة إرسال الرمز حالياً.");
    } finally {
      setResending(false);
    }
  };

  const channelMeta = CHANNEL_LABELS[channel] || CHANNEL_LABELS.EMAIL;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-lg rounded-[28px] border border-divider bg-white p-7 sm:p-9 soft-shadow">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-bold text-primary-dark">
          {channelMeta.icon}
          <span>التحقق عبر {channelMeta.badge}</span>
        </span>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-content-secondary transition hover:text-primary"
          >
            <span>تعديل البيانات</span>
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Title & Description */}
      <h1 className="mt-5 text-2xl sm:text-3xl font-black text-content-primary">
        {purpose === "REGISTER_VERIFY" ? "تأكيد وتفعيل حسابك" : "رمز التحقق لتسجيل الدخول"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-content-secondary">
        أرسلنا رمز تحقق مكوناً من 6 أرقام عبر {channelMeta.title}
        {target ? (
          <>
            {" "}
            إلى{" "}
            <span dir="ltr" className="font-bold text-content-primary">
              {target}
            </span>
          </>
        ) : null}
        . يرجى نسخه من الرسالة وإدخاله أدناه للمتابعة.
      </p>

      {/* Dev Fallback Helper Banner (only shown if devFallback is enabled) */}
      {devCode && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              رمز التحقق:{" "}
              <strong dir="ltr" className="font-mono text-sm tracking-widest text-amber-950">
                {devCode}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyDevCode}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 font-bold text-amber-950 transition hover:bg-amber-500/30"
          >
            <span>{copiedDev ? "✓ تم النسخ والتعبئة" : "📋 نسخ وتعبئة الرمز"}</span>
          </button>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm font-medium text-red-700">
          <svg className="mt-0.5 size-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {infoMessage && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-700">
          <svg className="mt-0.5 size-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Quick Paste Bar */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-bold text-content-secondary">أدخل الرمز المكون من 6 أرقام:</span>
        <button
          type="button"
          onClick={handleClipboardPasteButton}
          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-light/50 px-3 py-1.5 text-xs font-bold text-primary-dark transition hover:bg-primary-light"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>لصق الرمز المنسوخ</span>
        </button>
      </div>

      {/* 6-Digit OTP Input Form */}
      <form onSubmit={handleVerifySubmit} className="mt-2.5">
        <div dir="ltr" className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              aria-label={`الرقم ${idx + 1} من رمز التحقق`}
              className={`h-14 w-full rounded-2xl border-2 text-center text-xl font-black tracking-widest transition outline-none ${
                digit
                  ? "border-primary bg-primary-light/40 text-content-primary"
                  : "border-divider bg-slate-50/70 text-content-primary focus:border-primary focus:bg-white"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={verifying || codeString.length !== 6}
          className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#149EF7] to-[#188DE9] font-black text-white shadow-[0_10px_25px_rgba(20,158,247,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(20,158,247,0.33)] disabled:pointer-events-none disabled:opacity-55"
        >
          {verifying ? (
            <>
              <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>جارٍ التحقق...</span>
            </>
          ) : (
            <span>{purpose === "REGISTER_VERIFY" ? "تأكيد وتفعيل الحساب" : "تأكيد الدخول"}</span>
          )}
        </button>
      </form>

      {/* Resend & Cooldown Footer */}
      <div className="mt-6 border-t border-divider pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
          <span className="text-content-secondary">لم يصلك الرمز بعد؟</span>

          {cooldown > 0 ? (
            <div className="inline-flex items-center gap-2 font-bold text-content-secondary">
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              <span>
                إعادة الإرسال متاحة بعد{" "}
                <span dir="ltr" className="font-mono text-primary-dark">
                  {formatTimer(cooldown)}
                </span>
              </span>
            </div>
          ) : (
            <button
              type="button"
              disabled={resending}
              onClick={() => handleResend(channel)}
              className="inline-flex items-center gap-1.5 font-black text-primary transition hover:text-primary-dark disabled:opacity-50"
            >
              {resending ? "جارٍ إعادة الإرسال..." : "إعادة إرسال الرمز الآن"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
