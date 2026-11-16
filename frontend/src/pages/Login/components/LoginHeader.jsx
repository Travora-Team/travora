export function LoginHeader({ loginMode, onSelectMode }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0D2447]">
            تسجيل الدخول إلى Travora
          </h2>
          <p className="text-[11px] text-[#64748B]">
            اختر طريقة الدخول المفضلة لديك لمتابعة رحلاتك أو إدارة خدماتك
          </p>
        </div>
        <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2.5 py-1 text-[10px] font-extrabold text-[#0077CC]">
          آمن وموثق
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => onSelectMode('otp')}
          className={`h-8 rounded-lg transition ${
            loginMode === 'otp'
              ? 'bg-white text-[#0099FF] shadow-2xs font-black'
              : 'text-[#64748B] hover:text-[#0D2447]'
          }`}
        >
          دخول برمز التحقق (OTP)
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('direct')}
          className={`h-8 rounded-lg transition ${
            loginMode === 'direct'
              ? 'bg-white text-[#0099FF] shadow-2xs font-black'
              : 'text-[#64748B] hover:text-[#0D2447]'
          }`}
        >
          دخول سريع بكلمة المرور
        </button>
      </div>
    </>
  );
}
