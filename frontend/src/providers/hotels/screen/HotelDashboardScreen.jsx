import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProviderWorkspaceBar } from '../../../shared/components/ProviderWorkspaceBar';
import { hotelProviderApi } from '../api/hotelApi';
import { HotelSvgAnimation } from '../components/HotelSvgAnimation';

export function HotelDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomValues, setEditRoomValues] = useState({ nightlyPriceEgp: 0, totalUnits: 1 });

  const [roomForm, setRoomForm] = useState({
    nameAr: '',
    bedDescriptionAr: 'سرير كينج ملكي + إطلالة بانورامية',
    areaSqm: 65,
    maxOccupancy: 3,
    nightlyPriceEgp: 8500,
    totalUnits: 6,
  });

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await hotelProviderApi.getDashboard({
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

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.nameAr.trim()) return;
    setSubmitting(true);
    setBannerMsg('');
    try {
      await hotelProviderApi.createRoomType({
        providerId: data?.provider?.id || user?.providerId,
        hotelId: data?.hotels?.[0]?.id,
        ...roomForm,
      });
      setRoomForm({
        nameAr: '',
        bedDescriptionAr: 'سرير كينج ملكي + إطلالة بانورامية',
        areaSqm: 65,
        maxOccupancy: 3,
        nightlyPriceEgp: 8500,
        totalUnits: 6,
      });
      setBannerMsg('تمت إضافة الغرفة / الجناح الجديد وتحديث مخزون الليالي الفندقية في قاعدة البيانات!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة الغرفة');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEditRoom = (rt) => {
    setEditingRoomId(rt.id);
    setEditRoomValues({
      nightlyPriceEgp: Math.round((Number(rt.nightly_price_minor) || 650000) / 100),
      totalUnits: Number(rt.total_units) || 6,
    });
  };

  const handleSaveRoomEdit = async (roomId) => {
    setBusyId(roomId);
    try {
      await hotelProviderApi.updateRoomType(roomId, {
        nightlyPriceEgp: Number(editRoomValues.nightlyPriceEgp),
        totalUnits: Number(editRoomValues.totalUnits),
      });
      setEditingRoomId(null);
      setBannerMsg('تم تحديث سعر الليلة وعدد الوحدات المتاحة في جدول room_inventory بنجاح.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث بيانات الغرفة');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleRoomClosed = async (rt) => {
    setBusyId(rt.id);
    try {
      await hotelProviderApi.updateRoomType(rt.id, {
        isClosed: !rt.is_closed,
      });
      setBannerMsg(rt.is_closed ? 'تم إعادة فتح الحجز اليومي للغرفة.' : 'تم إيقاف الحجز المؤقت لهذه الغرفة.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تغيير حالة التوافر');
    } finally {
      setBusyId(null);
    }
  };

  const handleArchiveRoom = async (roomId) => {
    setBusyId(roomId);
    try {
      await hotelProviderApi.updateRoomType(roomId, { status: 'archived' });
      setBannerMsg('تم أرشفة فئة الغرفة بنجاح.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر أرشفة الغرفة');
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      await hotelProviderApi.updateBookingStatus(bookingId, status);
      const msgMap = {
        confirmed: 'تم تأكيد حجز الضيف بنجاح.',
        completed: 'تم تسجيل الوصول وإتمام إقامة الضيف (Check-in / Completed).',
        cancelled: 'تم إلغاء الحجز وتحديث الرصيد.',
      };
      setBannerMsg(msgMap[status] || 'تم تحديث حالة الحجز.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الحجز');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleHotelStatus = async (hotel) => {
    setBusyId(hotel.id);
    const nextStatus = hotel.status === 'active' ? 'draft' : 'active';
    try {
      await hotelProviderApi.updateHotelStatus(hotel.id, nextStatus);
      setBannerMsg(
        nextStatus === 'active'
          ? 'تم نشر المنشأة الفندقية وتفعيلها للحجز العام.'
          : 'تم تحويل المنشأة الفندقية إلى وضع المسودة.'
      );
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الفندق');
    } finally {
      setBusyId(null);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'فنادق ومنتجعات قصر النيل الملكي';
  const stats = data?.stats || {};
  const roomTypes = (data?.roomTypes || []).filter((r) => r.status !== 'archived');
  const bookings = data?.bookings || [];
  const hotels = data?.hotels || [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-10 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-6xl">
        <ProviderWorkspaceBar
          badgeLabel="🏨 لوحة تحكم شريك الفنادق والمنتجعات السياحية"
          title={`مركز إدارة «${providerName}»`}
          subtitle="إدارة حقيقية للغرف والأجنحة، تسعير الليالي الفندقية ومخزون الوحدات (room_inventory)، وتسجيل وصول حجوزات الضيوف."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={data?.application?.registration_reference || 'CR-EG-100291'}
        />

        {/* KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">تصنيف المنشأة الفندقية</div>
            <div className="mt-1 text-base font-black text-[#FF8A00]">
              {'★'.repeat(stats.starRating || 5)} ({stats.starRating || 5} نجوم)
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">فئات الغرف النشطة</div>
            <div className="mt-1 text-base font-black text-[#0099FF]">
              {roomTypes.length} فئات
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إجمالي الوحدات الفندقية</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {stats.totalUnits || 0} غرفة وجناح
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجوزات الإقامة الفعلية</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {bookings.length} حجوزات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إيرادات الحجوزات المؤكدة</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {(stats.totalRevenueEgp || 0).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-800">
            <span>✓ {bannerMsg}</span>
            <button
              type="button"
              onClick={() => setBannerMsg('')}
              className="text-emerald-700 hover:text-emerald-950"
            >
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
                  معاينة حالة المنشأة الفندقية
                </span>
                <span className="rounded-full bg-[#EEF8FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                  متصل بجدولي room_types و room_inventory
                </span>
              </div>
              <HotelSvgAnimation starRating={stats.starRating || 5} />
            </div>

            <form
              onSubmit={handleAddRoom}
              className="rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#0D2447]">
                  + إضافة غرفة أو جناح فندقي جديد
                </h2>
                <span className="text-[10px] font-bold text-[#0099FF]">حفظ مباشر بقاعدة البيانات</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  اسم الغرفة أو الجناح بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={roomForm.nameAr}
                  onChange={(e) => setRoomForm((p) => ({ ...p, nameAr: e.target.value }))}
                  placeholder="مثال: جناح أميري مطل على النيل مباشرة"
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    سعر الليلة (ج.م)
                  </label>
                  <input
                    type="number"
                    min={500}
                    value={roomForm.nightlyPriceEgp}
                    onChange={(e) =>
                      setRoomForm((p) => ({ ...p, nightlyPriceEgp: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    عدد الغرف المتاحة يومياً
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={roomForm.totalUnits}
                    onChange={(e) =>
                      setRoomForm((p) => ({ ...p, totalUnits: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    المساحة (م²)
                  </label>
                  <input
                    type="number"
                    min={15}
                    value={roomForm.areaSqm}
                    onChange={(e) =>
                      setRoomForm((p) => ({ ...p, areaSqm: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    أقصى عدد للضيوف
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={roomForm.maxOccupancy}
                    onChange={(e) =>
                      setRoomForm((p) => ({ ...p, maxOccupancy: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  تجهيز الأسرّة والمرافق
                </label>
                <input
                  type="text"
                  value={roomForm.bedDescriptionAr}
                  onChange={(e) =>
                    setRoomForm((p) => ({ ...p, bedDescriptionAr: e.target.value }))
                  }
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-extrabold text-white shadow-xs transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? 'جارٍ الحفظ...' : '+ حفظ الغرفة وإضافتها لكتالوج الفندق'}
              </button>
            </form>
          </aside>

          {/* Left Column */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'rooms', label: `🛏️ الغرف والمخزون (${roomTypes.length})` },
                { id: 'bookings', label: `📅 حجوزات الضيوف (${bookings.length})` },
                { id: 'hotels', label: `🏨 حالة المنشأة (${hotels.length})` },
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
                جارٍ تحميل بيانات الفندق والغرف من قاعدة البيانات...
              </div>
            ) : activeTab === 'rooms' ? (
              <div className="mt-4 space-y-3">
                {roomTypes.map((rt) => {
                  const priceEgp = Math.round((Number(rt.nightly_price_minor) || 650000) / 100);
                  const isEditing = editingRoomId === rt.id;
                  const isBusy = busyId === rt.id;

                  return (
                    <div
                      key={rt.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-[#0D2447]">{rt.name_ar}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold border ${
                                rt.is_closed
                                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                                  : 'bg-[#E8FFFB] border-[#99F6E4] text-[#00806B]'
                              }`}
                            >
                              {rt.is_closed ? 'مغلق مؤقتاً' : 'متاح للحجز الفوري'}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[#64748B]">
                            {rt.bed_description_ar} • مساحة {Number(rt.area_sqm) || 60} م² • يتسع حتى{' '}
                            {rt.max_occupancy} ضيوف
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-sm font-black text-[#0099FF]">
                            {priceEgp.toLocaleString('ar-EG')} ج.م{' '}
                            <span className="text-[10px] font-bold text-[#64748B]">/ الليلة</span>
                          </div>
                          <div className="text-[10px] font-bold text-[#475569]">
                            المخزون اليومي: {rt.total_units || 6} غرف (محجوز: {rt.booked_units || 0})
                          </div>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex flex-wrap items-center gap-2 border-t border-[#DCEBFA] pt-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-[#0D2447]">السعر (ج.م):</span>
                            <input
                              type="number"
                              min={300}
                              value={editRoomValues.nightlyPriceEgp}
                              onChange={(e) =>
                                setEditRoomValues((p) => ({ ...p, nightlyPriceEgp: e.target.value }))
                              }
                              className="h-8 w-24 rounded-lg border border-[#0099FF] bg-white px-2 text-xs font-bold"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-[#0D2447]">الوحدات:</span>
                            <input
                              type="number"
                              min={1}
                              value={editRoomValues.totalUnits}
                              onChange={(e) =>
                                setEditRoomValues((p) => ({ ...p, totalUnits: e.target.value }))
                              }
                              className="h-8 w-16 rounded-lg border border-[#0099FF] bg-white px-2 text-xs font-bold"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSaveRoomEdit(rt.id)}
                            className="rounded-lg bg-[#0099FF] px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-[#0077CC]"
                          >
                            حفظ التعديلات
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRoomId(null)}
                            className="rounded-lg bg-white border border-[#DCEBFA] px-2.5 py-1.5 text-[11px] font-bold text-[#64748B]"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#DCEBFA]/70 pt-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStartEditRoom(rt)}
                            className="rounded-lg border border-[#BCE3FF] bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                          >
                            ✎ تعديل السعر والمخزون
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleRoomClosed(rt)}
                            className="rounded-lg border border-[#DCEBFA] bg-white px-2.5 py-1 text-[11px] font-bold text-[#475569] hover:bg-slate-100"
                          >
                            {rt.is_closed ? '🔓 فتح الحجز' : '🔒 إيقاف مؤقت'}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleArchiveRoom(rt.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            أرشفة
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : activeTab === 'bookings' ? (
              <div className="mt-4 space-y-3">
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-6 text-center text-xs text-[#64748B]">
                    لا توجد حجوزات إقامة مسجلة حالياً لهذا الفندق.
                  </div>
                ) : (
                  bookings.map((b) => {
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
                                الضيف: {b.contact_name}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                  b.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : b.status === 'confirmed'
                                      ? 'bg-[#E8FFFB] text-[#00806B]'
                                      : b.status === 'cancelled'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.status === 'completed'
                                  ? '✓ تمت الإقامة وتسجيل الدخول'
                                  : b.status === 'confirmed'
                                    ? 'حجز مؤكد'
                                    : b.status === 'cancelled'
                                      ? 'حجز ملغى'
                                      : b.status}
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] text-[#64748B]">
                              {b.room_name_snapshot} • {b.meal_plan_snapshot || 'شامل الإفطار'} •{' '}
                              {b.adult_count} بالغين • هاتف: {b.contact_phone || 'غير مسجل'}
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-black text-[#0D2447]">
                              {Math.round((Number(b.total_minor) || 0) / 100).toLocaleString('ar-EG')}{' '}
                              ج.م
                            </div>
                            <div className="text-[10px] text-[#64748B]">
                              من {String(b.check_in || '').slice(0, 10)} إلى{' '}
                              {String(b.check_out || '').slice(0, 10)}
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
                              ✓ تسجيل وصول الضيف (Check-in)
                            </button>
                          )}
                          {b.status !== 'confirmed' && b.status !== 'completed' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                              className="rounded-lg bg-[#0099FF] px-3 py-1 text-[11px] font-extrabold text-white hover:bg-[#0077CC]"
                            >
                              تأكيد الحجز
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
                  })
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="text-sm font-black text-[#0D2447]">{h.name_ar}</div>
                      <div className="mt-0.5 text-[11px] text-[#64748B]">
                        📍 {h.destination_name} — {h.address_ar} • تصنيف {h.star_rating} نجوم
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                          h.status === 'active'
                            ? 'bg-[#E8FFFB] text-[#00806B]'
                            : 'bg-[#FFF5EB] text-[#CC6D00]'
                        }`}
                      >
                        {h.status === 'active' ? 'منشور بالمنصة' : 'مسودة مراجعة'}
                      </span>
                      <button
                        type="button"
                        disabled={busyId === h.id}
                        onClick={() => handleToggleHotelStatus(h)}
                        className="rounded-xl border border-[#BCE3FF] bg-white px-3 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                      >
                        {h.status === 'active' ? 'إيقاف النشر مؤقتاً' : 'نشر الفندق الآن'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}