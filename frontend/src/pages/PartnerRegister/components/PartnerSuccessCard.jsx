import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';

export function PartnerSuccessCard({ submittedResult, onReset }) {
  const { user } = useAuth();
  const app = submittedResult?.application || {};
  const details = app.details_json || {};

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] px-4 pt-24 pb-10 flex items-center justify-center font-['Cairo']"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-[#DCEBFA] bg-white p-6 sm:p-7 text-[#0D2447] shadow-[0_14px_38px_rgba(0,153,255,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8FFFB] border border-[#99F6E4]">
            <svg viewBox="0 0 80 80" className="h-11 w-11">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#00C8A8" strokeWidth="4" />
              <path
                d="M25 41 L35 51 L56 29"
                fill="none"
                stroke="#00806B"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="rounded-full bg-[#FFF5EB] border border-[#FED7AA] px-3.5 py-1 text-[11px] font-extrabold text-[#CC6D00]">
            تم إرسال الطلب إلى الإدارة • وتم تجهيز لوحة تحكم شريك الخدمة الخاصة بك
          </span>

          <h1 className="mt-2.5 text-xl sm:text-2xl font-black text-[#0D2447]">
            تم تسجيل طلب انضمام «{app.public_name_ar}» بنجاح!
          </h1>
          <p className="mt-1.5 max-w-lg text-xs text-[#64748B] leading-relaxed">
            تم إنشاء حساب شريك الخدمة الخاص بك وإرسال التراخيص لمراجعة الإدارة. يمكنك الآن تسجيل
            الدخول لفتح{' '}
            <strong className="text-[#0D2447]">لوحة تحكم شريك الخدمة المخصصة لقطاعك</strong> وإدارة
            خدماتك.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#DCEBFA] text-right">
          <div>
            <div className="text-[11px] text-[#64748B]">رقم مرجع الطلب والترخيص</div>
            <div className="mt-0.5 font-mono text-xs font-extrabold text-[#0099FF]">
              {app.registration_reference}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#64748B]">تصنيف شريك الخدمة</div>
            <div className="mt-0.5 text-xs font-extrabold text-[#0D2447]">
              {details.partnerCategoryLabel || app.partner_type}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#64748B]">الحالة الحالية في النظام</div>
            <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#CC6D00]">
              <span className="h-2 w-2 rounded-full bg-[#FF8A00] animate-pulse" />
              بانتظار موافقة الأدمن
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            to="/login"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-5 text-xs font-extrabold text-white shadow-[0_6px_18px_rgba(0,153,255,0.22)] transition hover:-translate-y-0.5"
          >
            <span>تسجيل الدخول إلى لوحة تحكم شريك الخدمة</span>
            <span>←</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin?tab=applications"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#99F6E4] bg-[#E8FFFB] px-4 text-xs font-extrabold text-[#00806B] hover:bg-[#CCFBF1]"
            >
              <span>مراجعة الطلب في لوحة الأدمن ↗</span>
            </Link>
          )}

          <button
            type="button"
            onClick={onReset}
            className="h-10 rounded-xl border border-[#DCEBFA] bg-white px-4 text-xs font-extrabold text-[#0D2447] hover:bg-[#F8FAFC]"
          >
            تسجيل شريك خدمة آخر
          </button>

          <Link
            to="/"
            className="h-10 inline-flex items-center rounded-xl px-3 text-xs font-bold text-[#64748B] hover:text-[#0099FF]"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
