import { Link } from 'react-router-dom';

export function TravelerHeaderBanner() {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCEBFA] bg-white/90 px-3.5 py-2 shadow-2xs">
      <div className="flex items-center gap-1.5">
        <span className="rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-3 py-1.5 text-xs font-extrabold text-white shadow-2xs">
          ✈️ تسجيل مسافر عادي (تفعيل فوري)
        </span>
        <Link
          to="/partner-register"
          className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#475569] hover:bg-[#F2F7FD] hover:text-[#0099FF] transition"
        >
          🏨 تسجيل مزود خدمة (فندق • مطعم • مرشد • نقل)
        </Link>
      </div>

      <Link
        to="/login"
        className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs font-extrabold text-[#0077CC] hover:bg-[#EEF8FF] transition"
      >
        لديك حساب؟ تسجيل الدخول
      </Link>
    </div>
  );
}
