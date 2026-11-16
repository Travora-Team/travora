import { BOOKING_KIND_META, StatusBadge, formatDateAr, formatMoney } from './adminHelpers';

export function AdminCommissionsTab({
  finance,
  onOpenNewCommissionModal,
  onOpenEditCommissionModal,
  onToggleRule,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div>
          <h3 className="text-sm font-black text-[#0D2447]">قواعد احتساب عمولة المنصة</h3>
          <p className="text-[11px] text-[#64748B]">
            تُحتسب تلقائياً عند تأكيد الحجز (100 bps = 1%)
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewCommissionModal}
          className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer"
        >
          + قاعدة عمولة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(finance?.commissionRules || []).map((rule) => {
          const meta = BOOKING_KIND_META[rule.booking_kind] || {
            label: rule.booking_kind,
            color: 'bg-[#EEF8FF] text-[#0077CC]',
          };
          return (
            <div
              key={rule.id}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.color}`}
                  >
                    {meta.shortLabel || meta.label}
                  </span>
                  <StatusBadge status={rule.is_active ? 'active' : 'archived'} />
                </div>
                <p className="text-xs font-black text-[#0F172A] mt-1.5">{rule.name}</p>
                <p className="text-[11px] text-[#64748B]">
                  النسبة:{' '}
                  <strong className="text-[#0099FF] font-black">
                    {(rule.rate_bps / 100).toFixed(1)}%
                  </strong>{' '}
                  • الحجوزات: {rule.bookings_count || 0}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenEditCommissionModal(rule)}
                  className="rounded-lg bg-[#EEF8FF] text-[#0099FF] px-2.5 py-1.5 text-[11px] font-extrabold cursor-pointer"
                >
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => onToggleRule(rule)}
                  className="rounded-lg border border-[#DCEBFA] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#475569] cursor-pointer"
                >
                  {rule.is_active ? 'تعطيل' : 'تفعيل'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminSettlementsTab({
  finance,
  actionBusy,
  onSettlementTransition,
  onCreatePayout,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="border-b border-[#F1F5F9] pb-2.5">
        <h3 className="text-sm font-black text-[#0D2447]">التسويات المالية للشركاء</h3>
        <p className="text-[11px] text-[#64748B]">
          اعتماد التسويات المسودة لإتاحة إصدار أوامر التحويل البنكي
        </p>
      </div>

      <div className="space-y-2.5">
        {(finance?.settlements || []).map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-[#0F172A]">{s.provider_name}</p>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                الفترة: {formatDateAr(s.period_start)} → {formatDateAr(s.period_end)} • إجمالي:{' '}
                {formatMoney(s.gross_minor, s.currency)}
              </p>
              <p className="text-xs font-extrabold text-[#00806B] mt-0.5">
                صافي الشريك: {formatMoney(s.net_minor, s.currency)} • متاح للصرف:{' '}
                {formatMoney(s.available_minor, s.currency)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {s.status === 'draft' && (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => onSettlementTransition(s.id, 'approved')}
                  className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer"
                >
                  اعتماد التسوية
                </button>
              )}
              {s.status === 'approved' && Number(s.available_minor) > 0 && (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => onCreatePayout(s)}
                  className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer"
                >
                  إصدار تحويل بنكي
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPayoutsTab({ finance, actionBusy, onUpdatePayout }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="border-b border-[#F1F5F9] pb-2.5">
        <h3 className="text-sm font-black text-[#0D2447]">سجل التحويلات البنكية للشركاء</h3>
        <p className="text-[11px] text-[#64748B]">
          متابعة أوامر الصرف البنكي وتوثيق الأرقام المرجعية
        </p>
      </div>

      <div className="space-y-2.5">
        {(finance?.payouts || []).map((po) => (
          <div
            key={po.id}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-[#0F172A]">{po.provider_name}</p>
                <StatusBadge status={po.status} />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {po.destination_label || 'حساب بنكي موثق'} • المرجع:{' '}
                <span className="font-mono font-bold text-[#0F172A]">
                  {po.processor_payout_ref || 'بانتظار التأكيد'}
                </span>
              </p>
              <p className="text-xs font-extrabold text-[#0099FF] mt-0.5">
                المبلغ: {formatMoney(po.amount_minor, po.currency)}
              </p>
            </div>

            {(po.status === 'pending' || po.status === 'processing') && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => onUpdatePayout(po.id, 'succeeded')}
                  className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-2 text-xs font-extrabold cursor-pointer"
                >
                  تأكيد التحويل
                </button>
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => onUpdatePayout(po.id, 'cancelled')}
                  className="rounded-xl bg-[#FEE2E2] text-[#B91C1C] px-3 py-2 text-xs font-extrabold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminAuditTab({ auditLogs, auditSearch, onChangeAuditSearch }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
        <div>
          <h3 className="text-sm font-black text-[#0D2447]">
            سجل التدقيق الأمني غير القابل للتعديل ({auditLogs.length})
          </h3>
          <p className="text-[11px] text-[#64748B]">توثيق لحظي لكافة القرارات الإدارية والمالية</p>
        </div>
        <input
          type="search"
          placeholder="ابحث في سجل التدقيق..."
          value={auditSearch}
          onChange={(e) => onChangeAuditSearch(e.target.value)}
          className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-full sm:w-64 focus:outline-none focus:border-[#0099FF]"
        />
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="py-2.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#EEF8FF] text-[#0077CC] font-mono text-[10px] font-bold px-2 py-0.5">
                  {log.action}
                </span>
                <p className="text-xs font-extrabold text-[#0F172A]">
                  {log.provider_name || 'إدارة المنصة'}
                </p>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{log.summary}</p>
            </div>
            <div className="text-left text-[11px] text-[#94A3B8] font-bold">
              <p>{log.actor_name || 'مدير النظام'}</p>
              <p>{formatDateAr(log.occurred_at, true)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsTab({
  settingsData,
  faqForm,
  onChangeFaqForm,
  actionBusy,
  onCreateFaq,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-[#0D2447] border-b border-[#F1F5F9] pb-2.5">
          إعدادات التشغيل والعملات والربط السحابي
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <p className="text-[11px] font-bold text-[#64748B]">العملات المفعلة</p>
            <p className="text-xs font-extrabold text-[#0F172A] mt-1">
              {(settingsData?.currencies || []).map((c) => `${c.name_ar} (${c.code})`).join(' • ') ||
                'الجنيه المصري (EGP)'}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <p className="text-[11px] font-bold text-[#64748B]">بوابات الإشعارات والتحقق</p>
            <p className="text-xs font-extrabold text-[#00806B] mt-1">
              Resend Email + Twilio SMS & WhatsApp
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-black text-[#0D2447] mb-2">
            الأسئلة الشائعة المنشورة ({settingsData?.faqs?.length || 0})
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {(settingsData?.faqs || []).map((f) => (
              <div key={f.id} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5">
                <p className="text-xs font-extrabold text-[#0F172A]">{f.question}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{f.answer_markdown}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={onCreateFaq}
        className="lg:col-span-5 bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-2xs space-y-3"
      >
        <h3 className="text-sm font-black text-[#0D2447] border-b border-[#F1F5F9] pb-2.5">
          إضافة سؤال شائع جديد لمركز المساعدة
        </h3>
        <div>
          <label className="block text-xs font-bold text-[#0F172A] mb-1">السؤال</label>
          <input
            type="text"
            required
            value={faqForm.question}
            onChange={(e) => onChangeFaqForm((p) => ({ ...p, question: e.target.value }))}
            placeholder="اكتب السؤال الشائع..."
            className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 text-xs focus:outline-none focus:border-[#0099FF]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#0F172A] mb-1">الإجابة</label>
          <textarea
            rows={3}
            required
            value={faqForm.answerMarkdown}
            onChange={(e) => onChangeFaqForm((p) => ({ ...p, answerMarkdown: e.target.value }))}
            placeholder="اكتب الإجابة المعتمدة..."
            className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 text-xs focus:outline-none focus:border-[#0099FF]"
          />
        </div>
        <button
          type="submit"
          disabled={actionBusy}
          className="w-full rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white py-2.5 text-xs font-extrabold cursor-pointer"
        >
          نشر السؤال الشائع
        </button>
      </form>
    </div>
  );
}
