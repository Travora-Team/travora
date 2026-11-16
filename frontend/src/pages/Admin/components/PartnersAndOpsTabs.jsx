import { Link } from 'react-router-dom';
import {
  BOOKING_KIND_META,
  CATEGORY_CODE_AR,
  InitialsAvatar,
  PriorityBadge,
  StatusBadge,
  formatMoney,
} from './adminHelpers';

export function AdminProvidersTab({
  providers,
  providerFilter,
  onChangeProviderFilter,
  actionBusy,
  onOpenNewProviderModal,
  onToggleProviderStatus,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'active', 'pending', 'suspended'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onChangeProviderFilter((p) => ({ ...p, status: st }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                providerFilter.status === st
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-[#EEF8FF] text-[#0077CC] hover:bg-[#D8EFFF]'
              }`}
            >
              {st === 'all'
                ? `الكل (${providers.length})`
                : st === 'active'
                ? 'نشط'
                : st === 'pending'
                ? 'قيد التوثيق'
                : 'موقوف'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="بحث باسم الشريك..."
            value={providerFilter.search}
            onChange={(e) => onChangeProviderFilter((p) => ({ ...p, search: e.target.value }))}
            className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-44 sm:w-56 focus:outline-none focus:border-[#0099FF]"
          />
          <button
            type="button"
            onClick={onOpenNewProviderModal}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-1.5 text-xs font-extrabold cursor-pointer"
          >
            + شريك جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {providers.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-col justify-between gap-3 hover:border-[#BCE3FF] transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <InitialsAvatar name={p.public_name_ar} tone="teal" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0F172A] truncate">{p.public_name_ar}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{p.legal_name}</p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#475569] border-t border-[#E2E8F0] pt-2">
              <span>
                {(p.categories || []).map((c) => CATEGORY_CODE_AR[c] || c).join(' • ') ||
                  'خدمات سياحية'}
              </span>
              <div className="flex items-center gap-1.5">
                {p.status !== 'active' && (
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={() => onToggleProviderStatus(p.id, 'active')}
                    className="rounded-lg bg-[#DCFCE7] text-[#15803D] px-2.5 py-1 text-[10px] font-extrabold cursor-pointer"
                  >
                    تفعيل
                  </button>
                )}
                {p.status === 'active' && (
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={() => onToggleProviderStatus(p.id, 'suspended')}
                    className="rounded-lg bg-[#FEE2E2] text-[#B91C1C] px-2.5 py-1 text-[10px] font-extrabold cursor-pointer"
                  >
                    إيقاف مؤقت
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminApplicationsTab({
  applications,
  appFilter,
  onChangeAppFilter,
  onSelectApp,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `الكل (${applications.length})` },
            { id: 'submitted', label: 'بانتظار الموافقة' },
            { id: 'in_review', label: 'استكمال بيانات' },
            { id: 'approved', label: 'معتمد' },
            { id: 'rejected', label: 'مرفوض' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChangeAppFilter((p) => ({ ...p, status: f.id }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                appFilter.status === f.id
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-[#EEF8FF] text-[#0077CC] hover:bg-[#D8EFFF]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="search"
            placeholder="بحث برقم السجل التجاري أو الاسم..."
            value={appFilter.search}
            onChange={(e) => onChangeAppFilter((p) => ({ ...p, search: e.target.value }))}
            className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-52 focus:outline-none focus:border-[#0099FF]"
          />
          <Link
            to="/partner-register"
            className="rounded-xl bg-[#0D2447] hover:bg-[#16376B] text-white px-3.5 py-1.5 text-xs font-extrabold transition"
          >
            + فتح شاشة تسجيل الشركاء ↗
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const d = app.details_json || {};
          const pType =
            app.partner_type ||
            (app.requested_categories && app.requested_categories[0]) ||
            'hotel';
          const subType = app.transport_subtype;
          const categoryBadge =
            d.partnerCategoryLabel ||
            (pType === 'hotel'
              ? 'فندق / منتجع سياحي'
              : pType === 'restaurant'
                ? 'مطعم وضيافة'
                : pType === 'guide'
                  ? 'مرشد سياحي مرخص'
                  : subType === 'car_owner'
                    ? 'صاحب سيارة خاصة بسائق'
                    : subType === 'car_rental'
                      ? 'مكتب استئجار سيارات'
                      : 'شركة نقل سياحي وليموزين');

          return (
            <div
              key={app.id}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col gap-3 hover:border-[#BCE3FF] transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <InitialsAvatar name={app.trade_name} tone="orange" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-[#0F172A]">{app.trade_name}</p>
                      <span className="rounded-full bg-[#E0F2FE] text-[#0369A1] px-2.5 py-0.5 text-[10px] font-extrabold">
                        {categoryBadge}
                      </span>
                      <StatusBadge status={app.status} />
                      <span className="text-[11px] font-mono font-bold text-[#64748B]">
                        {app.registration_reference}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] mt-1">
                      الكيان القانوني: <strong>{app.legal_name}</strong> • المسؤول:{' '}
                      <strong>{d.applicantName || app.applicant_name || '—'}</strong> •{' '}
                      <span className="font-mono">{app.contact_email}</span> •{' '}
                      <span className="font-mono">{app.contact_phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectApp(app)}
                    className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer shadow-2xs"
                  >
                    فحص التفاصيل والبت في الطلب
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0]/80 text-[11px] text-[#334155]">
                {d.destinationNameAr && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    📍 الوجهة: {d.destinationNameAr}
                  </span>
                )}
                {pType === 'hotel' && d.starRating && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold text-amber-700">
                    ★ تصنيف {d.starRating} نجوم • {d.roomsCount || 30} غرفة •{' '}
                    {d.nightlyPriceEgp || 3500} ج.م/ليلة
                  </span>
                )}
                {pType === 'restaurant' && d.cuisineAr && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    🍽️ {d.cuisineAr} • {d.seatingCapacity || 80} مقعد • متوسط{' '}
                    {d.avgMealPriceEgp || 600} ج.م
                  </span>
                )}
                {pType === 'guide' && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    🧭 خبرة {d.yearsExperience || 5} سنوات •{' '}
                    {(d.languages || []).join('، ') || 'العربية، الإنجليزية'} •{' '}
                    {d.dailyRateEgp || 1800} ج.م/يوم
                  </span>
                )}
                {pType === 'transport' && subType === 'car_owner' && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    🚘 {d.carMakeModel || 'سيارة حديثة'} ({d.carYear || 2025}) • لوحة:{' '}
                    {d.plateNumber || '—'} • {d.seats || 4} مقاعد
                  </span>
                )}
                {pType === 'transport' && subType === 'car_rental' && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    🔑 متاح {d.rentalCarsCount || 20} سيارة للإيجار • يبدأ من{' '}
                    {d.startingPriceEgp || 1500} ج.م/يوم
                  </span>
                )}
                {pType === 'transport' && (!subType || subType === 'transport_company') && (
                  <span className="rounded-lg bg-white border border-[#E2E8F0] px-2.5 py-1 font-bold">
                    🚐 أسطول {d.fleetSize || 12} مركبة سياحية • يبدأ من{' '}
                    {d.startingPriceEgp || 1400} ج.م
                  </span>
                )}
                {d.descriptionAr && (
                  <span className="text-[#64748B] truncate max-w-xl">«{d.descriptionAr}»</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminUsersTab({
  usersList,
  userFilter,
  onChangeUserFilter,
  actionBusy,
  onUpdateUser,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `الكل (${usersList.length})` },
            { id: 'traveler', label: 'مسافرون' },
            { id: 'provider', label: 'شركاء خدمة' },
            { id: 'admin', label: 'مديرو النظام' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onChangeUserFilter((p) => ({ ...p, role: r.id }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                userFilter.role === r.id
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-[#EEF8FF] text-[#0077CC] hover:bg-[#D8EFFF]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="بحث بالاسم أو البريد..."
          value={userFilter.search}
          onChange={(e) => onChangeUserFilter((p) => ({ ...p, search: e.target.value }))}
          className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-56 focus:outline-none focus:border-[#0099FF]"
        />
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {usersList.map((u) => (
          <div
            key={u.id}
            className="py-2.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar name={u.display_name} tone="blue" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-[#0F172A]">{u.display_name}</p>
                  <StatusBadge status={u.status} />
                </div>
                <p className="text-[11px] text-[#64748B] font-mono">
                  {u.email} {u.phone_e164 ? `• ${u.phone_e164}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={u.role}
                disabled={actionBusy}
                onChange={(e) => onUpdateUser(u.id, { role: e.target.value })}
                className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-bold text-[#0F172A]"
              >
                <option value="traveler">مسافر (Traveler)</option>
                <option value="provider">شريك خدمة (Provider)</option>
                <option value="admin">مدير منصة (Admin)</option>
              </select>

              <button
                type="button"
                disabled={actionBusy}
                onClick={() =>
                  onUpdateUser(u.id, {
                    status: u.status === 'active' ? 'suspended' : 'active',
                  })
                }
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold cursor-pointer ${
                  u.status === 'active'
                    ? 'bg-[#FEE2E2] text-[#B91C1C]'
                    : 'bg-[#DCFCE7] text-[#15803D]'
                }`}
              >
                {u.status === 'active' ? 'إيقاف' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminBookingsTab({ bookings, bookingFilter, onChangeBookingFilter }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `الكل (${bookings.length})` },
            { id: 'HOTEL', label: 'فنادق' },
            { id: 'ACTIVITY', label: 'أنشطة' },
            { id: 'TRANSPORT', label: 'نقل VIP' },
          ].map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => onChangeBookingFilter((p) => ({ ...p, kind: k.id }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                bookingFilter.kind === k.id
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-[#EEF8FF] text-[#0077CC] hover:bg-[#D8EFFF]'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="بحث برقم الحجز TRV-2026..."
          value={bookingFilter.search}
          onChange={(e) => onChangeBookingFilter((p) => ({ ...p, search: e.target.value }))}
          className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-56 focus:outline-none focus:border-[#0099FF]"
        />
      </div>

      <div className="space-y-2.5">
        {bookings.map((bk) => {
          const kindMeta = BOOKING_KIND_META[bk.kind] || {
            shortLabel: bk.kind,
            color: 'bg-[#EEF8FF] text-[#0077CC]',
          };
          return (
            <div
              key={bk.id}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-[#0099FF]">
                    {bk.reference}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${kindMeta.color}`}
                  >
                    {kindMeta.shortLabel || kindMeta.label}
                  </span>
                  <StatusBadge status={bk.status} />
                </div>
                <p className="text-xs font-extrabold text-[#0F172A] mt-1">
                  {bk.service_title_snapshot}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  العميل: {bk.customer_name || bk.contact_name} • الشريك:{' '}
                  {bk.provider_name || 'شريك معتمد'}
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm font-black text-[#0F172A]">
                  {formatMoney(bk.total_minor, bk.currency)}
                </p>
                <p className="text-[11px] font-bold text-[#00806B]">
                  عمولة المنصة: {formatMoney(bk.commission_minor, bk.currency)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminDisputesTab({
  disputes,
  disputeFilter,
  onChangeDisputeFilter,
  onSelectDispute,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `الكل (${disputes.length})` },
            { id: 'OPEN', label: 'مفتوحة' },
            { id: 'WAITING_AGENT', label: 'بانتظار الإدارة' },
            { id: 'RESOLVED', label: 'تم الحل' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onChangeDisputeFilter((p) => ({ ...p, status: st.id }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                disputeFilter.status === st.id
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-[#EEF8FF] text-[#0077CC] hover:bg-[#D8EFFF]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="ابحث في التذاكر..."
          value={disputeFilter.search}
          onChange={(e) => onChangeDisputeFilter((p) => ({ ...p, search: e.target.value }))}
          className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-56 focus:outline-none focus:border-[#0099FF]"
        />
      </div>

      <div className="space-y-2.5">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={d.priority} />
                <StatusBadge status={d.status} />
                <span className="text-[11px] font-mono font-bold text-[#0099FF]">
                  {d.booking_reference || 'تذكرة عامة'}
                </span>
              </div>
              <p className="text-xs font-black text-[#0F172A] mt-1">{d.subject}</p>
              <p className="text-[11px] text-[#64748B]">
                العميل: {d.customer_name} ({d.customer_email})
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectDispute(d)}
              className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer"
            >
              فتح التذكرة والرد
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
