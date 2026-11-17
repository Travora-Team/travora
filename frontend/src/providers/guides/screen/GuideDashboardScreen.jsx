import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProviderWorkspaceBar } from '../../../shared/components/ProviderWorkspaceBar';
import { guideProviderApi } from '../api/guideApi';
import { GuideSvgAnimation } from '../components/GuideSvgAnimation';

export function GuideDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tours');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
  const [editingTourId, setEditingTourId] = useState(null);
  const [editPriceEgp, setEditPriceEgp] = useState(3200);

  const [tourForm, setTourForm] = useState({
    titleAr: '',
    durationHours: 5,
    languages: 'العربية • الإنجليزية • الفرنسية',
    maxGroupSize: 6,
    pricePerDayEgp: 3200,
    meetingPoint: 'بوابة معبد الكرنك الرئيسية - الأقصر',
  });

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await guideProviderApi.getDashboard({
        providerId: user?.providerId,
        userId: user?.id,
      });
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.providerId]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const handleAddTour = async (e) => {
    e.preventDefault();
    if (!tourForm.titleAr.trim()) return;
    setSubmitting(true);
    setBannerMsg('');
    try {
      await guideProviderApi.addGuidedTour({
        providerId: data?.provider?.id || user?.providerId,
        ...tourForm,
      });
      setTourForm({
        titleAr: '',
        durationHours: 5,
        languages: 'العربية • الإنجليزية • الفرنسية',
        maxGroupSize: 6,
        pricePerDayEgp: 3200,
        meetingPoint: 'بوابة معبد الكرنك الرئيسية - الأقصر',
      });
      setBannerMsg('تم حفظ الجولة الإرشادية في جدول activities العلائقي بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة المسار الإرشادي');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveTourPrice = async (tourId) => {
    setBusyId(tourId);
    try {
      await guideProviderApi.updateGuidedTour(tourId, {
        pricePerDayEgp: Number(editPriceEgp),
      });
      setEditingTourId(null);
      setBannerMsg('تم تحديث أجر الجولة في قاعدة البيانات بنجاح.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث الجولة');
    } finally {
      setBusyId(null);
    }
  };

  const handleArchiveTour = async (tourId) => {
    setBusyId(tourId);
    try {
      await guideProviderApi.updateGuidedTour(tourId, { status: 'archived' });
      setBannerMsg('تم أرشفة الجولة الإرشادية.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر أرشفة الجولة');
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      await guideProviderApi.updateBookingStatus(bookingId, status);
      setBannerMsg(
        status === 'completed'
          ? 'تم تسجيل إتمام الجولة الإرشادية مع الوفد السياحي بنجاح!'
          : status === 'cancelled'
            ? 'تم إلغاء حجز الجولة.'
            : 'تم تأكيد حجز الجولة.'
      );
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الحجز');
    } finally {
      setBusyId(null);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'د. طارق زكي — مرشد الآثار المصرية الملكي';
  const stats = data?.stats || {};
  const tours = data?.tours || [];
  const bookings = data?.bookings || [];
  const languages = stats.languages || ['العربية', 'الإنجليزية', 'الفرنسية'];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-10 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-6xl">
        <ProviderWorkspaceBar
          badgeLabel="🧭 لوحة تحكم المرشد السياحي المعتمد"
          title={`مركز إدارة أعمال «${providerName}»`}
          subtitle="إدارة حقيقية للمسارات الأثرية (activities)، اللغات المعتمدة (guide_languages)، وحجوزات الوفود السياحية."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={stats.licenseReference || 'EG-GUIDE-LUX-8841'}
        />

        {/* KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">لغات الإرشاد المسجلة</div>
            <div className="mt-1 text-xs font-black text-[#0099FF] truncate">
              {languages.join(' • ')}
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">متوسط الأجر اليومي</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {(stats.dailyRateEgp || 3200).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">المسارات السياحية النشطة</div>
            <div className="mt-1 text-base font-black text-[#FF8A00]">
              {tours.length} برامج جولات
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجوزات الوفود الفعلية</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {bookings.length} جولات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إجمالي عوائد الإرشاد</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {(stats.totalRevenueEgp || 0).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-800">
            <span>✓ {bannerMsg}</span>
            <button type="button" onClick={() => setBannerMsg('')} className="text-emerald-700">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Right Column */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl border border-[#DCEBFA] bg-white p-4 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black text-[#0D2447]">
                  خريطة المسارات الأثرية والتراخيص
                </span>
                <span className="rounded-full bg-[#E8FFFB] px-2.5 py-0.5 text-[10px] font-extrabold text-[#00806B]">
                  متصل بجدولي guide_profiles و activities
                </span>
              </div>
              <GuideSvgAnimation languagesCount={languages.length} />
            </div>

            <form
              onSubmit={handleAddTour}
              className="rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#0D2447]">
                  + إضافة مسار أو جولة إرشادية جديدة
                </h2>
                <span className="text-[10px] font-bold text-[#0099FF]">حفظ في جدول activities</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  عنوان الجولة أو المسار الأثري *
                </label>
                <input
                  type="text"
                  required
                  value={tourForm.titleAr}
                  onChange={(e) => setTourForm((p) => ({ ...p, titleAr: e.target.value }))}
                  placeholder="مثال: جولة خاصة في مقابر النبلاء ومعبد الرامسيوم"
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    المدة (ساعات)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={tourForm.durationHours}
                    onChange={(e) =>
                      setTourForm((p) => ({ ...p, durationHours: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    أقصى عدد للوفد
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={tourForm.maxGroupSize}
                    onChange={(e) =>
                      setTourForm((p) => ({ ...p, maxGroupSize: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    الأجر (ج.م)
                  </label>
                  <input
                    type="number"
                    min={300}
                    value={tourForm.pricePerDayEgp}
                    onChange={(e) =>
                      setTourForm((p) => ({ ...p, pricePerDayEgp: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  نقطة الالتقاء بالوفد السياحي
                </label>
                <input
                  type="text"
                  value={tourForm.meetingPoint}
                  onChange={(e) => setTourForm((p) => ({ ...p, meetingPoint: e.target.value }))}
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-extrabold text-white shadow-xs transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? 'جارٍ الإضافة...' : '+ نشر الجولة في ملف المرشد السياحي'}
              </button>
            </form>
          </aside>

          {/* Left Column */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'tours', label: `🗺️ المسارات والجولات (${tours.length})` },
                { id: 'bookings', label: `👥 حجوزات الوفود والسياح (${bookings.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EEF8FF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-[#64748B]">
                جارٍ تحميل المسارات الأثرية وجدول جولات المرشد...
              </div>
            ) : activeTab === 'tours' ? (
              <div className="mt-4 space-y-3">
                {tours.map((t) => {
                  const isBusy = busyId === t.id;
                  const isEditing = editingTourId === t.id;
                  return (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-[#0D2447]">{t.titleAr}</span>
                            <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                              ⏱️ {t.durationHours} ساعات
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[#64748B]">
                            📍 الالتقاء: {t.meetingPoint} • اللغات: {t.languages}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-[#0099FF]">
                            {Number(t.pricePerDayEgp).toLocaleString('ar-EG')} ج.م
                          </div>
                          <div className="text-[10px] font-bold text-[#00806B]">متاح للحجز</div>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 border-t border-[#DCEBFA] pt-2">
                          <span className="text-[11px] font-bold">الأجر اليومي الجديد (ج.م):</span>
                          <input
                            type="number"
                            min={300}
                            value={editPriceEgp}
                            onChange={(e) => setEditPriceEgp(e.target.value)}
                            className="h-8 w-24 rounded-lg border border-[#0099FF] bg-white px-2 text-xs font-bold"
                          />
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSaveTourPrice(t.id)}
                            className="rounded-lg bg-[#0099FF] px-3 py-1 text-[11px] font-extrabold text-white"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTourId(null)}
                            className="rounded-lg border border-[#DCEBFA] bg-white px-2.5 py-1 text-[11px] font-bold text-[#64748B]"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#DCEBFA]/70 pt-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setEditingTourId(t.id);
                              setEditPriceEgp(t.pricePerDayEgp);
                            }}
                            className="rounded-lg border border-[#BCE3FF] bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                          >
                            ✎ تعديل الأجر
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleArchiveTour(t.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            أرشفة الجولة
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {bookings.map((b) => {
                  const isBusy = busyId === b.id;
                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-extrabold text-[#0099FF]">
                              {b.reference}
                            </span>
                            <span className="text-xs font-black text-[#0D2447]">
                              المسافر: {b.travelerName} ({b.guestsCount} أفراد)
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                b.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'confirmed'
                                    ? 'bg-[#E8FFFB] text-[#00806B]'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {b.status === 'completed'
                                ? '✓ جولة مكتملة'
                                : b.status === 'confirmed'
                                  ? 'جولة مؤكدة'
                                  : 'ملغاة'}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[#64748B]">
                            🏛️ {b.tourTitle} • الموعد: {b.tourDate} • لغة الشرح: {b.language}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-[#0D2447]">
                            {Number(b.amountEgp).toLocaleString('ar-EG')} ج.م
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#DCEBFA]/70 pt-2">
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                            className="rounded-lg bg-[#00806B] px-3 py-1 text-[11px] font-extrabold text-white hover:bg-emerald-800"
                          >
                            ✓ إتمام الجولة الإرشادية
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            إلغاء الحجز
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}