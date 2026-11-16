import { PARTNER_CATEGORIES } from '../models/partnerRegisterModel';
import { CategoryAnimatedIcon } from './PartnerSvgAnimations';
import { TransportSubtypeSelector } from '../../../providers/transport';

export function PartnerCategoryStep({
  partnerType,
  setPartnerType,
  transportSubtype,
  setTransportSubtype,
  onNext,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-black text-[#0D2447]">
          اختر قطاع الخدمة الذي ترغب بتسجيله في المنصة
        </h2>
        <p className="mt-0.5 text-xs text-[#64748B]">
          يتغير نموذج البيانات والـ SVG تلقائياً ليطلب منك المعلومات المفيدة الخاصة بنشاطك.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PARTNER_CATEGORIES.map((cat) => {
          const isSelected = partnerType === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setPartnerType(cat.id)}
              className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-right transition-all ${
                isSelected
                  ? 'border-[#0099FF] bg-[#EEF8FF]/80 shadow-[0_6px_18px_rgba(0,153,255,0.12)]'
                  : 'border-[#DCEBFA] bg-[#F8FAFC] hover:border-[#0099FF]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5 w-full">
                <CategoryAnimatedIcon type={cat.id} active={isSelected} />
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-[#0099FF] text-white'
                      : 'bg-white border border-[#DCEBFA] text-[#475569]'
                  }`}
                >
                  {cat.badge}
                </span>
              </div>

              <div className="mt-2">
                <div className="text-sm font-black text-[#0D2447]">{cat.title}</div>
                <p className="mt-0.5 text-[11px] text-[#64748B] leading-relaxed">{cat.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {partnerType === 'transport' && (
        <TransportSubtypeSelector
          transportSubtype={transportSubtype}
          setTransportSubtype={setTransportSubtype}
        />
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-5 text-xs font-extrabold text-white shadow-[0_6px_18px_rgba(20,158,247,0.24)] transition hover:-translate-y-0.5"
        >
          <span>المتابعة لإدخال تفاصيل الخدمة</span>
          <span>←</span>
        </button>
      </div>
    </div>
  );
}
