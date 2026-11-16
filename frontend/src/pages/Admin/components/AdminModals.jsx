import { DESTINATION_IMAGE_PRESETS, resolveDestinationImage } from '../api/adminScreenApi';
import { WORKSPACE_LINKS } from '../models/adminModel';
import { AdminIcon, StatusBadge, formatDateAr } from './adminHelpers';

export function AllScreensModal({ open, activeTab, onClose, onSelectTab }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        dir="rtl"
        className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div>
            <h3 className="text-base font-black text-[#0F172A]">جميع شاشات لوحة الإدارة (13)</h3>
            <p className="text-xs text-[#64748B]">انتقل مباشرة إلى أي وحدة تشغيلية أو مالية</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WORKSPACE_LINKS.map((scr) => (
            <button
              key={scr.id}
              type="button"
              onClick={() => {
                onSelectTab(scr.id);
                onClose();
              }}
              className={`rounded-xl border p-3 text-right transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === scr.id
                  ? 'bg-[#EEF8FF] border-[#0099FF] text-[#0077CC]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#BCE3FF] text-[#0F172A]'
              }`}
            >
              <AdminIcon name={scr.icon} className="h-4 w-4 text-[#0099FF] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-black truncate">{scr.pageTitle}</p>
                <p className="text-[10px] text-[#64748B] truncate">{scr.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HelpModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        dir="rtl"
        className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <h3 className="text-base font-black text-[#0F172A]">دليل مساعدة لوحة الإدارة</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2 text-xs text-[#475569] leading-relaxed">
          <p>
            • <strong>اكتشف أشهر الوجهات:</strong> من تبويب المحتوى والخدمات يمكنك إضافة أو تعديل أو
            إخفاء أي وجهة لتنعكس لحظياً في الصفحة الرئيسية.
          </p>
          <p>
            • <strong>طلبات الشركاء:</strong> اعتمد الشريك لتفعيل حسابه تلقائياً أو اطلب استكمال
            المستندات.
          </p>
          <p>
            • <strong>التسويات والتحويلات:</strong> اعتمد التسوية المسودة لإصدار أمر تحويل بنكي
            وتوثيق الرقم المرجعي.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#0099FF] text-white py-2 text-xs font-extrabold cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

export function ApplicationReviewModal({
  selectedApp,
  reviewNotes,
  onChangeReviewNotes,
  actionBusy,
  onClose,
  onReviewDecision,
}) {
  if (!selectedApp) return null;
  const d = selectedApp.details_json || {};
  const tagList = [
    ...(d.amenities || []),
    ...(d.diningFeatures || []),
    ...(d.languages || []),
    ...(d.specialties || []),
    ...(d.vehicleClasses || []),
    ...(d.rentalCategories || []),
    ...(d.rentalModes || []),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        dir="rtl"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#DCEBFA] space-y-4 my-6"
      >
        <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#0077CC] bg-[#EEF8FF] px-2.5 py-0.5 rounded-md">
                {selectedApp.registration_reference}
              </span>
              <StatusBadge status={selectedApp.status} />
            </div>
            <h3 className="text-lg font-black text-[#0F172A] mt-1.5">{selectedApp.trade_name}</h3>
            <p className="text-xs text-[#64748B]">{selectedApp.legal_name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] text-xs">
          <div>
            <span className="text-[#64748B] block">نوع الخدمة / التصنيف:</span>
            <strong className="text-[#0F172A]">
              {d.partnerCategoryLabel || selectedApp.partner_type || 'شريك خدمة سياحية'}
            </strong>
          </div>
          <div>
            <span className="text-[#64748B] block">المدينة / الوجهة:</span>
            <strong className="text-[#0F172A]">
              {d.destinationNameAr || selectedApp.city_slug || 'مصر'}
            </strong>
          </div>
          <div>
            <span className="text-[#64748B] block">اسم المسؤول:</span>
            <strong className="text-[#0F172A]">
              {d.applicantName || selectedApp.applicant_name || '—'}
            </strong>
          </div>
          <div>
            <span className="text-[#64748B] block">البريد والهاتف الرسمي:</span>
            <strong className="font-mono text-[#0F172A]">
              {selectedApp.contact_email} • {selectedApp.contact_phone}
            </strong>
          </div>
          {d.addressAr && (
            <div className="sm:col-span-2">
              <span className="text-[#64748B] block">العنوان التفصيلي:</span>
              <strong className="text-[#0F172A]">{d.addressAr}</strong>
            </div>
          )}
        </div>

        {Object.keys(d).length > 0 && (
          <div className="rounded-2xl border border-[#DCEBFA] bg-[#F0F9FF]/50 p-4 space-y-2.5 text-xs">
            <h4 className="font-black text-[#0D2447]">
              التفاصيل الفنية والتشغيلية المقدمة من الشريك:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {d.starRating && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">تصنيف الفندق</span>
                  <strong className="text-amber-600">{d.starRating} نجوم ★</strong>
                </div>
              )}
              {d.roomsCount && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">عدد الغرف والأجنحة</span>
                  <strong>{d.roomsCount} غرفة</strong>
                </div>
              )}
              {d.nightlyPriceEgp && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">متوسط سعر الليلة</span>
                  <strong>{d.nightlyPriceEgp} ج.م</strong>
                </div>
              )}
              {d.cuisineAr && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">نوع المطبخ</span>
                  <strong>{d.cuisineAr}</strong>
                </div>
              )}
              {d.seatingCapacity && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">الطاقة الاستيعابية</span>
                  <strong>{d.seatingCapacity} مقعد</strong>
                </div>
              )}
              {d.yearsExperience && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">سنوات الخبرة</span>
                  <strong>{d.yearsExperience} سنوات</strong>
                </div>
              )}
              {d.carMakeModel && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">السيارة والموديل</span>
                  <strong>
                    {d.carMakeModel} ({d.carYear})
                  </strong>
                </div>
              )}
              {d.plateNumber && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">رقم اللوحة</span>
                  <strong className="font-mono">{d.plateNumber}</strong>
                </div>
              )}
              {d.fleetSize && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">حجم الأسطول</span>
                  <strong>{d.fleetSize} مركبة</strong>
                </div>
              )}
              {d.rentalCarsCount && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">السيارات المتاحة للإيجار</span>
                  <strong>{d.rentalCarsCount} سيارة</strong>
                </div>
              )}
              {(d.startingPriceEgp || d.dailyRateEgp) && (
                <div className="rounded-xl bg-white p-2.5 border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">سعر البداية / اليومي</span>
                  <strong>{d.startingPriceEgp || d.dailyRateEgp} ج.م</strong>
                </div>
              )}
            </div>

            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tagList.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white border border-[#BAE6FD] px-2.5 py-0.5 text-[11px] font-bold text-[#0369A1]"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            )}

            {d.descriptionAr && (
              <p className="text-[#475569] bg-white rounded-xl p-2.5 border border-[#E2E8F0] leading-relaxed">
                {d.descriptionAr}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-extrabold text-[#0F172A] mb-1">
            ملاحظات لجنة المراجعة وقرار الاعتماد:
          </label>
          <textarea
            rows={2}
            value={reviewNotes}
            onChange={(e) => onChangeReviewNotes(e.target.value)}
            placeholder="اكتب قرار الاعتماد أو المستندات المطلوبة (مطلوب في حالة الرفض)..."
            className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-2.5 text-xs focus:outline-none focus:border-[#0099FF]"
          />
        </div>

        {!['approved', 'rejected'].includes(selectedApp.status) ? (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={actionBusy}
              onClick={() => onReviewDecision('in_review')}
              className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-3.5 py-2.5 text-xs font-extrabold cursor-pointer"
            >
              طلب استكمال بيانات
            </button>
            <button
              type="button"
              disabled={actionBusy}
              onClick={() => onReviewDecision('rejected')}
              className="rounded-xl bg-[#FEE2E2] text-[#B91C1C] px-4 py-2.5 text-xs font-extrabold cursor-pointer"
            >
              رفض الطلب
            </button>
            <button
              type="button"
              disabled={actionBusy}
              onClick={() => onReviewDecision('approved')}
              className="rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 text-xs font-extrabold cursor-pointer shadow-md"
            >
              ✓ موافقة وتفعيل الشريك والخدمة فوراً
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#DCFCE7] border border-[#86EFAC] p-2.5 text-xs font-bold text-[#15803D]">
            تم البت النهائي بتاريخ {formatDateAr(selectedApp.reviewed_at, true)}.
          </div>
        )}
      </div>
    </div>
  );
}

export function NewProviderModal({
  open,
  form,
  onChangeForm,
  actionBusy,
  onClose,
  onSubmit,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        dir="rtl"
        onSubmit={onSubmit}
        className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-3.5"
      >
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <h3 className="text-base font-black text-[#0F172A]">إضافة شريك خدمة جديد</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">الاسم التجاري بالعربية *</label>
            <input
              type="text"
              required
              value={form.publicNameAr}
              onChange={(e) => onChangeForm((p) => ({ ...p, publicNameAr: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">الاسم بالإنجليزية *</label>
            <input
              type="text"
              required
              value={form.publicNameEn}
              onChange={(e) => onChangeForm((p) => ({ ...p, publicNameEn: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-[#0F172A] block mb-1">الاسم القانوني في السجل *</label>
            <input
              type="text"
              required
              value={form.legalName}
              onChange={(e) => onChangeForm((p) => ({ ...p, legalName: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">القطاع السياحي</label>
            <select
              value={form.category}
              onChange={(e) => onChangeForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-bold"
            >
              <option value="hotel">الفنادق والإقامة</option>
              <option value="activity">الأنشطة والتجارب</option>
              <option value="transport">النقل الفاخر VIP</option>
              <option value="restaurant">المطاعم الراقية</option>
              <option value="guide">الإرشاد السياحي</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">البريد الرسمي *</label>
            <input
              type="email"
              required
              value={form.supportEmail}
              onChange={(e) => onChangeForm((p) => ({ ...p, supportEmail: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-4 py-2 text-xs font-extrabold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={actionBusy}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-5 py-2 text-xs font-extrabold cursor-pointer"
          >
            حفظ الشريك
          </button>
        </div>
      </form>
    </div>
  );
}

export function DisputeResolutionModal({
  selectedDispute,
  disputeStatusNext,
  onChangeDisputeStatus,
  disputePriorityNext,
  onChangeDisputePriority,
  disputeReply,
  onChangeDisputeReply,
  actionBusy,
  onClose,
  onSubmit,
}) {
  if (!selectedDispute) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        dir="rtl"
        onSubmit={onSubmit}
        className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-3.5"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-black text-[#0F172A]">{selectedDispute.subject}</h3>
            <p className="text-xs text-[#64748B]">
              العميل: {selectedDispute.customer_name} • الحجز:{' '}
              {selectedDispute.booking_reference || 'عام'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">حالة التذكرة</label>
            <select
              value={disputeStatusNext}
              onChange={(e) => onChangeDisputeStatus(e.target.value)}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-bold"
            >
              <option value="OPEN">مفتوحة (OPEN)</option>
              <option value="WAITING_AGENT">بانتظار الإدارة</option>
              <option value="WAITING_CUSTOMER">بانتظار العميل</option>
              <option value="RESOLVED">تم الحل (RESOLVED)</option>
              <option value="CLOSED">إغلاق نهائي</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">الأولوية</label>
            <select
              value={disputePriorityNext}
              onChange={(e) => onChangeDisputePriority(e.target.value)}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-bold"
            >
              <option value="LOW">منخفضة</option>
              <option value="NORMAL">عادية</option>
              <option value="HIGH">مرتفعة</option>
              <option value="URGENT">عاجلة</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#0F172A] mb-1">
            رد الإدارة الرسمي للعميل:
          </label>
          <textarea
            rows={3}
            value={disputeReply}
            onChange={(e) => onChangeDisputeReply(e.target.value)}
            placeholder="اكتب رد الإدارة..."
            className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-2.5 text-xs focus:outline-none focus:border-[#0099FF]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-4 py-2 text-xs font-extrabold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={actionBusy}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-5 py-2 text-xs font-extrabold cursor-pointer"
          >
            حفظ القرار وإرسال الرد
          </button>
        </div>
      </form>
    </div>
  );
}

export function CommissionRuleModal({
  open,
  form,
  onChangeForm,
  actionBusy,
  onClose,
  onSubmit,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        dir="rtl"
        onSubmit={onSubmit}
        className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-3.5"
      >
        <h3 className="text-base font-black text-[#0F172A]">إصدار قاعدة عمولة جديدة</h3>
        <div className="space-y-2.5 text-xs">
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">قطاع الحجز</label>
            <select
              value={form.bookingKind}
              onChange={(e) => onChangeForm((p) => ({ ...p, bookingKind: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-bold"
            >
              <option value="HOTEL">الفنادق والإقامة (HOTEL)</option>
              <option value="ACTIVITY">الأنشطة والتجارب (ACTIVITY)</option>
              <option value="TRANSPORT">النقل الفاخر (TRANSPORT)</option>
              <option value="RESTAURANT">المطاعم (RESTAURANT)</option>
              <option value="GUIDE">المرشد السياحي (GUIDE)</option>
              <option value="DELIVERY">توصيل الطلبات (DELIVERY)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">اسم القاعدة</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => onChangeForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="مثال: عمولة موسم الشتاء (11%)"
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-bold text-[#0F172A] block mb-1">نسبة العمولة (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              value={form.ratePercent}
              onChange={(e) => onChangeForm((p) => ({ ...p, ratePercent: e.target.value }))}
              className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-mono font-bold"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-4 py-2 text-xs font-extrabold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={actionBusy}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-5 py-2 text-xs font-extrabold cursor-pointer"
          >
            اعتماد القاعدة
          </button>
        </div>
      </form>
    </div>
  );
}

export function DestinationEditorModal({
  open,
  editingDestinationId,
  form,
  onChangeForm,
  actionBusy,
  onClose,
  onSubmit,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <form
        dir="rtl"
        onSubmit={onSubmit}
        className="bg-white rounded-3xl max-w-4xl w-full p-5 shadow-2xl border border-[#DCEBFA] space-y-4 my-6"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-3">
          <div>
            <h3 className="text-base font-black text-[#0F172A]">
              {editingDestinationId
                ? `تعديل بيانات الوجهة: ${form.nameAr}`
                : 'إضافة وجهة جديدة إلى قسم "اكتشف أشهر الوجهات"'}
            </h3>
            <p className="text-xs text-[#64748B]">
              جميع الحقول أدناه تنعكس بنفس التفاصيل في بطاقة الوجهة بالصفحة الرئيسية فور الحفظ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  اسم الوجهة بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={form.nameAr}
                  onChange={(e) => onChangeForm((p) => ({ ...p, nameAr: e.target.value }))}
                  placeholder="مثال: القاهرة"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-bold focus:outline-none focus:border-[#0099FF]"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  اسم الوجهة بالإنجليزية *
                </label>
                <input
                  type="text"
                  required
                  value={form.nameEn}
                  onChange={(e) => onChangeForm((p) => ({ ...p, nameEn: e.target.value }))}
                  placeholder="Cairo"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-mono focus:outline-none focus:border-[#0099FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  الوسوم أسفل العنوان (Tags) *
                </label>
                <input
                  type="text"
                  required
                  value={form.tagsAr}
                  onChange={(e) => onChangeForm((p) => ({ ...p, tagsAr: e.target.value }))}
                  placeholder="ثقافة • تاريخ • حياة عصرية"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 focus:outline-none focus:border-[#0099FF]"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">اسم الدولة</label>
                <input
                  type="text"
                  value={form.countryLabelAr}
                  onChange={(e) => onChangeForm((p) => ({ ...p, countryLabelAr: e.target.value }))}
                  placeholder="مصر"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 focus:outline-none focus:border-[#0099FF]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                وصف الوجهة في البطاقة *
              </label>
              <textarea
                rows={2}
                required
                value={form.descriptionAr}
                onChange={(e) => onChangeForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                placeholder="عاصمة لا تنام تجمع بين عراقة التاريخ وحيوية الحاضر على ضفاف النيل."
                className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 focus:outline-none focus:border-[#0099FF]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">التصنيف</label>
                <input
                  type="text"
                  value={form.categoryLabelAr}
                  onChange={(e) => onChangeForm((p) => ({ ...p, categoryLabelAr: e.target.value }))}
                  placeholder="معالم"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">عدد الزوار</label>
                <input
                  type="text"
                  value={form.visitorsText}
                  onChange={(e) => onChangeForm((p) => ({ ...p, visitorsText: e.target.value }))}
                  placeholder="+12K"
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">التقييم (★)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => onChangeForm((p) => ({ ...p, rating: e.target.value }))}
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">الترتيب</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.displayOrder}
                  onChange={(e) => onChangeForm((p) => ({ ...p, displayOrder: e.target.value }))}
                  className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">صورة الوجهة</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {DESTINATION_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => onChangeForm((p) => ({ ...p, imageUrl: preset.key }))}
                    className={`relative overflow-hidden rounded-lg border-2 h-12 transition cursor-pointer ${
                      form.imageUrl === preset.key
                        ? 'border-[#0099FF] ring-2 ring-[#0099FF]/25'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.src}
                      alt={preset.label}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-[#0F172A]/75 text-[8px] font-bold text-white py-0.5 truncate px-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => onChangeForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="أو ضع رابط صورة مباشر https://..."
                className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 font-mono text-[11px]"
              />
            </div>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-[#DCEBFA] bg-[#EEF8FF]/60 p-2.5 cursor-pointer">
              <div>
                <p className="text-xs font-extrabold text-[#0F172A]">
                  إظهار الوجهة في قسم "اكتشف أشهر الوجهات" بالصفحة الرئيسية
                </p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(form.isFeatured)}
                onChange={(e) => onChangeForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="h-4 w-4 accent-[#0099FF]"
              />
            </label>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-extrabold text-[#64748B] mb-1.5 text-right">
              معاينة حية لبطاقة الصفحة الرئيسية:
            </p>
            <div
              dir="rtl"
              className="overflow-hidden rounded-[20px] bg-white border border-[#DCEBFA] shadow-[0_10px_30px_rgba(45,87,126,0.10)]"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={resolveDestinationImage(form.imageUrl, form.nameEn)}
                  alt={form.nameAr || 'معاينة'}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071729]/80 via-transparent to-transparent" />
                <div className="absolute left-[14px] top-[12px] flex items-center gap-1 rounded-full bg-[#314D6D]/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                  <span>📍</span>
                  <span>{form.countryLabelAr || 'مصر'}</span>
                </div>
                <div className="absolute bottom-[14px] right-[16px] left-[14px] text-right">
                  <h4 className="text-[20px] font-black leading-none text-white">
                    {form.nameAr || 'اسم الوجهة'}
                  </h4>
                  <p className="mt-1.5 text-[11px] font-bold text-white/95">
                    {form.tagsAr || 'ثقافة • تاريخ • سياحة'}
                  </p>
                </div>
              </div>
              <div className="px-[16px] pb-[14px] pt-[14px]">
                <p className="min-h-[38px] text-[11px] font-medium leading-[1.8] text-[#7890AE]">
                  {form.descriptionAr ||
                    'سيظهر هنا وصف الوجهة السياحية كما يراه الزائر في الصفحة الرئيسية.'}
                </p>
                <div className="mt-[10px] flex items-center justify-between text-[11px] font-semibold text-[#536C8C]">
                  <span>▢ {form.categoryLabelAr || 'معالم'}</span>
                  <span>👤 {form.visitorsText || '+12K'} زائر</span>
                  <span>
                    <span className="text-[#FFB000]">★</span>{' '}
                    {Number(form.rating || 4.8).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-4 py-2 text-xs font-extrabold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={actionBusy}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-6 py-2 text-xs font-extrabold shadow-xs cursor-pointer"
          >
            {editingDestinationId ? 'حفظ التعديلات ومزامنة الرئيسية' : 'إضافة الوجهة ونشرها'}
          </button>
        </div>
      </form>
    </div>
  );
}
