import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { PartnerHeroSvg } from './PartnerSvgAnimations';

export function PartnerSideShowcase({ partnerType, transportSubtype }) {
  const { user } = useAuth();

  return (
    <aside className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-24">
      <div className="rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-3 py-1 text-[11px] font-extrabold text-[#0077CC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0099FF] animate-ping" />
            <span>بوابة شركاء Travora المعتمدين</span>
          </div>

          {user?.role === 'admin' ? (
            <Link
              to="/admin?tab=applications"
              className="rounded-full bg-[#E8FFFB] border border-[#99F6E4] px-2.5 py-1 text-[10px] font-extrabold text-[#00806B] hover:bg-[#CCFBF1] transition"
            >
              لوحة مراجعة الأدمن ↗
            </Link>
          ) : (
            <span className="rounded-full bg-[#E8FFFB] border border-[#99F6E4] px-2.5 py-1 text-[10px] font-extrabold text-[#00806B]">
              لوحة تحكم مخصصة لكل شريك ✓
            </span>
          )}
        </div>

        <h1 className="mt-2.5 text-lg sm:text-xl font-black leading-snug text-[#0D2447]">
          سجّل منشأتك أو خدمتك السياحية واعرضها لآلاف المسافرين
        </h1>
        <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
          بعد التسجيل يمكنك الدخول مباشرة إلى لوحة التحكم المخصصة لقطاعك (فندق • مطعم • مرشد • نقل)
          لإدارة خدماتك ومتابعة حالة اعتمادك.
        </p>

        <div className="mt-3">
          <PartnerHeroSvg partnerType={partnerType} transportSubtype={transportSubtype} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-2">
            <div className="text-[11px] font-extrabold text-[#0099FF]">1. بيانات القطاع</div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">حقول مخصصة لنشاطك</div>
          </div>
          <div className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-2">
            <div className="text-[11px] font-extrabold text-[#FF8A00]">2. مراجعة الأدمن</div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">فحص فوري للتراخيص</div>
          </div>
          <div className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-2">
            <div className="text-[11px] font-extrabold text-[#00806B]">3. لوحة الشريك</div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">إدارة كاملة لخدمتك</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
