import {
  AdminIcon,
  BOOKING_KIND_META,
  InitialsAvatar,
  PriorityBadge,
  SparkleIcon,
  StatusBadge,
  formatMoney,
} from './adminHelpers';

export function AdminOverviewTab({
  overview,
  kpis,
  allDestinations,
  featuredCount,
  onSelectTab,
  onSelectCatalogSubTab,
  onOpenNewDestination,
  onRefresh,
  onSelectApp,
  onSelectDispute,
}) {
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div
          onClick={() => onSelectTab('applications')}
          className="group bg-white rounded-2xl border border-[#DCEBFA] p-3.5 flex items-center justify-between gap-3 shadow-[0_6px_20px_rgba(15,23,42,0.03)] hover:border-[#0099FF] transition cursor-pointer"
        >
          <div>
            <p className="text-[11px] font-bold text-[#64748B]">طلبات انضمام الشركاء</p>
            <p className="text-2xl font-black text-[#0D2447] mt-0.5">
              {kpis.pending_applications ?? 2}
            </p>
            <span className="text-[10px] font-extrabold text-[#FF8A00]">بانتظار الاعتماد ←</span>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF5EB] text-[#FF8A00]">
            <AdminIcon name="applications" className="h-5 w-5" />
          </div>
        </div>

        <div
          onClick={() => onSelectTab('disputes')}
          className="group bg-white rounded-2xl border border-[#DCEBFA] p-3.5 flex items-center justify-between gap-3 shadow-[0_6px_20px_rgba(15,23,42,0.03)] hover:border-[#0099FF] transition cursor-pointer"
        >
          <div>
            <p className="text-[11px] font-bold text-[#64748B]">النزاعات المفتوحة</p>
            <p className="text-2xl font-black text-[#0D2447] mt-0.5">{kpis.open_disputes ?? 2}</p>
            <span className="text-[10px] font-extrabold text-[#EF4444]">تحتاج متابعة ←</span>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#EF4444]">
            <AdminIcon name="disputes" className="h-5 w-5" />
          </div>
        </div>

        <div
          onClick={() => onSelectTab('providers')}
          className="group bg-white rounded-2xl border border-[#DCEBFA] p-3.5 flex items-center justify-between gap-3 shadow-[0_6px_20px_rgba(15,23,42,0.03)] hover:border-[#0099FF] transition cursor-pointer"
        >
          <div>
            <p className="text-[11px] font-bold text-[#64748B]">الشركاء النشطون</p>
            <p className="text-2xl font-black text-[#0D2447] mt-0.5">
              {kpis.active_providers ?? 5}{' '}
              <span className="text-xs font-bold text-[#94A3B8]">
                / {kpis.total_providers || 7}
              </span>
            </p>
            <span className="text-[10px] font-extrabold text-[#00806B]">موثقون رسمياً ←</span>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F8F5] text-[#12B9A7]">
            <AdminIcon name="providers" className="h-5 w-5" />
          </div>
        </div>

        <div
          onClick={() => onSelectTab('bookings')}
          className="group bg-white rounded-2xl border border-[#DCEBFA] p-3.5 flex items-center justify-between gap-3 shadow-[0_6px_20px_rgba(15,23,42,0.03)] hover:border-[#0099FF] transition cursor-pointer"
        >
          <div>
            <p className="text-[11px] font-bold text-[#64748B]">إجمالي الحجوزات (GMV)</p>
            <p className="text-xl font-black text-[#0099FF] mt-0.5">
              {formatMoney(kpis.gross_bookings_minor, 'EGP')}
            </p>
            <span className="text-[10px] font-extrabold text-[#64748B]">
              {kpis.total_users ?? 14} مستخدم • {kpis.total_bookings ?? 3} حجوزات
            </span>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F3FF] text-[#159CF6]">
            <AdminIcon name="bookings" className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-l from-[#0D2447] via-[#123463] to-[#0D2447] rounded-2xl p-4 text-white shadow-[0_10px_28px_rgba(13,36,71,0.16)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#00C8A8]">
            <SparkleIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black">قسم "اكتشف أشهر الوجهات" — الصفحة الرئيسية</h3>
              <span className="rounded-full bg-[#00C8A8]/20 border border-[#00C8A8]/40 px-2.5 py-0.5 text-[10px] font-extrabold text-[#5EEAD4]">
                {featuredCount} معروضة حالياً من {allDestinations.length}
              </span>
            </div>
            <p className="text-[11px] text-white/75 mt-0.5">
              {allDestinations
                .filter((d) => d.status === 'active' && d.is_featured)
                .map(
                  (d) =>
                    `${d.name_ar} (${d.visitors_text} • ★${Number(d.rating || 4.8).toFixed(1)})`
                )
                .join('  •  ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewDestination}
            className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
          >
            + إضافة وجهة
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('catalog');
              onSelectCatalogSubTab('destinations');
            }}
            className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-1.5 text-xs font-extrabold shadow-xs transition cursor-pointer"
          >
            إدارة بطاقات الوجهات ←
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)] space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
            <div>
              <h3 className="text-sm font-black text-[#0D2447]">قائمة الانتظار الإدارية السريعة</h3>
              <p className="text-[11px] text-[#64748B]">
                طلبات الشركاء والتذاكر العاجلة التي تتطلب قراراً إدارياً
              </p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg bg-[#EEF8FF] hover:bg-[#D8EFFF] text-[#0077CC] px-2.5 py-1 text-[11px] font-extrabold cursor-pointer"
            >
              تحديث فوري ↻
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#64748B] px-1">
              <span>
                طلبات توثيق الشركاء المعلقة ({overview?.pendingApplications?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => onSelectTab('applications')}
                className="text-[#0099FF] hover:underline cursor-pointer"
              >
                عرض الكل
              </button>
            </div>

            {(overview?.pendingApplications || []).slice(0, 2).map((app) => (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 hover:border-[#BCE3FF] transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <InitialsAvatar name={app.trade_name} tone="orange" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-[#0F172A] truncate">{app.trade_name}</p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {app.legal_name} • سجل:{' '}
                      <span className="font-mono">{app.registration_reference}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectApp(app)}
                  className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3 py-1.5 text-[11px] font-extrabold cursor-pointer"
                >
                  فحص واعتماد
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#64748B] px-1">
              <span>النزاعات وتذاكر الدعم المفتوحة ({overview?.openDisputes?.length || 0})</span>
              <button
                type="button"
                onClick={() => onSelectTab('disputes')}
                className="text-[#0099FF] hover:underline cursor-pointer"
              >
                فتح مركز النزاعات
              </button>
            </div>

            {(overview?.openDisputes || []).slice(0, 2).map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 hover:border-[#BCE3FF] transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <PriorityBadge priority={d.priority} />
                    <p className="text-xs font-extrabold text-[#0F172A] truncate">{d.subject}</p>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    العميل: {d.customer_name} • الحجز:{' '}
                    <span className="font-mono font-bold text-[#0099FF]">
                      {d.booking_reference || 'عام'}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDispute(d)}
                  className="rounded-xl bg-[#EEF8FF] hover:bg-[#D8EFFF] text-[#0077CC] border border-[#BCE3FF] px-3 py-1.5 text-[11px] font-extrabold cursor-pointer"
                >
                  معالجة والرد
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5 mb-3">
              <div>
                <h3 className="text-sm font-black text-[#0D2447]">أداء القطاعات والمالية</h3>
                <p className="text-[11px] text-[#64748B]">توزيع السيولة والعمولات وحالة التشغيل</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('reports')}
                className="text-[11px] font-extrabold text-[#0099FF] hover:underline cursor-pointer"
              >
                التقارير ←
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl bg-[#EEF8FF]/70 border border-[#DCEBFA] p-2.5">
                <p className="text-[10px] font-bold text-[#64748B]">صافي عمولة المنصة</p>
                <p className="text-sm font-black text-[#0099FF] mt-0.5">
                  {formatMoney(kpis.total_commissions_minor, 'EGP')}
                </p>
              </div>
              <div className="rounded-xl bg-[#E8FFFB]/70 border border-[#99F6E4] p-2.5">
                <p className="text-[10px] font-bold text-[#64748B]">صافي مستحقات الشركاء</p>
                <p className="text-sm font-black text-[#00806B] mt-0.5">
                  {formatMoney(kpis.net_provider_minor, 'EGP')}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(overview?.bookingsByKind || []).map((b) => {
                const meta = BOOKING_KIND_META[b.kind] || {
                  shortLabel: b.kind,
                  barColor: 'from-[#0099FF] to-[#38BDF8]',
                };
                const pct = Math.min(
                  100,
                  Math.max(
                    18,
                    Math.round(
                      (Number(b.total_minor || 0) /
                        Math.max(1, Number(kpis.gross_bookings_minor || 1))) *
                        100
                    )
                  )
                );
                return (
                  <div key={b.kind}>
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-[#0F172A]">{meta.shortLabel || meta.label}</span>
                      <span className="text-[#0099FF] font-extrabold">
                        {formatMoney(b.total_minor, 'EGP')} ({b.count} حجز)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l ${meta.barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold text-[#64748B]">
                آخر عملية مسجلة في سجل التدقيق:
              </p>
              <p className="text-xs font-bold text-[#0F172A] truncate mt-0.5">
                {overview?.recentAuditEvents?.[0]?.summary ||
                  'تم توثيق كافة العمليات الإدارية بنجاح.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('audit')}
              className="shrink-0 rounded-lg bg-white border border-[#DCEBFA] px-2.5 py-1 text-[11px] font-extrabold text-[#0099FF] hover:bg-[#EEF8FF] cursor-pointer"
            >
              السجل
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminReportsTab({
  overview,
  kpis,
  allDestinations,
  featuredCount,
  onExportReport,
  onSelectTab,
}) {
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-[#64748B]">إجمالي المبيعات (GMV)</p>
          <p className="text-xl font-black text-[#0D2447] mt-1">
            {formatMoney(kpis.gross_bookings_minor, 'EGP')}
          </p>
          <span className="text-[10px] font-extrabold text-[#00806B]">
            {kpis.confirmed_bookings || 0} حجوزات مؤكدة
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-[#64748B]">صافي إيرادات العمولات</p>
          <p className="text-xl font-black text-[#0099FF] mt-1">
            {formatMoney(kpis.total_commissions_minor, 'EGP')}
          </p>
          <span className="text-[10px] font-extrabold text-[#64748B]">عبر 6 قطاعات سياحية</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-[#64748B]">صافي مستحقات الشركاء</p>
          <p className="text-xl font-black text-[#00806B] mt-1">
            {formatMoney(kpis.net_provider_minor, 'EGP')}
          </p>
          <span className="text-[10px] font-extrabold text-[#0077CC]">
            تم صرف {formatMoney(kpis.paid_out_minor, 'EGP')}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3.5 shadow-2xs flex flex-col justify-between">
          <p className="text-[11px] font-bold text-[#64748B]">تصدير التقارير المالية</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={onExportReport}
              className="flex-1 rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white py-2 text-xs font-extrabold cursor-pointer"
            >
              تصدير JSON/CSV
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('bookings')}
              className="rounded-xl bg-[#EEF8FF] text-[#0077CC] px-3 py-2 text-xs font-extrabold cursor-pointer"
            >
              الحجوزات
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
            <h3 className="text-sm font-black text-[#0D2447]">
              تحليل الإيرادات حسب القطاع السياحي
            </h3>
            <button
              type="button"
              onClick={() => onSelectTab('commissions')}
              className="text-xs font-extrabold text-[#0099FF] hover:underline cursor-pointer"
            >
              قواعد العمولات ←
            </button>
          </div>

          <div className="space-y-3">
            {(overview?.bookingsByKind || []).map((b) => {
              const meta = BOOKING_KIND_META[b.kind] || {
                label: b.kind,
                barColor: 'from-[#0099FF] to-[#00C8A8]',
              };
              const pct = Math.min(
                100,
                Math.max(
                  20,
                  Math.round(
                    (Number(b.total_minor || 0) /
                      Math.max(1, Number(kpis.gross_bookings_minor || 1))) *
                      100
                  )
                )
              );
              return (
                <div
                  key={b.kind}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3"
                >
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-[#0F172A]">{meta.label}</span>
                    <span className="text-[#0099FF]">
                      {formatMoney(b.total_minor, 'EGP')} ({b.count} حجز)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-l ${meta.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
            <h3 className="text-sm font-black text-[#0D2447]">ملخص التشغيل والتسويات اليومية</h3>
            <button
              type="button"
              onClick={() => onSelectTab('settlements')}
              className="text-xs font-extrabold text-[#0099FF] hover:underline cursor-pointer"
            >
              التسويات ←
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold text-[#64748B]">الوجهات السياحية النشطة</p>
              <p className="text-lg font-black text-[#0F172A] mt-0.5">
                {allDestinations.length} وجهات ({featuredCount} بالرئيسية)
              </p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold text-[#64748B]">الشركاء الموثقون</p>
              <p className="text-lg font-black text-[#0F172A] mt-0.5">
                {kpis.active_providers || 5} شركات ومرشدين
              </p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold text-[#64748B]">متوسط تقييم الوجهات</p>
              <p className="text-lg font-black text-[#FF8A00] mt-0.5">★ 4.8 / 5.0</p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold text-[#64748B]">حالة بوابات الدفع والتحقق</p>
              <p className="text-sm font-black text-[#15803D] mt-1">100% نشطة (Paymob/OTP)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
