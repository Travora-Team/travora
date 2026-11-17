import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProviderWorkspaceBar } from '../../../shared/components/ProviderWorkspaceBar';
import { transportProviderApi } from '../api/transportApi';
import { TransportSvgAnimation } from '../components/TransportSvgAnimation';
import { TRANSPORT_SUBTYPES } from '../models/transportModel';

export function TransportDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtype, setSelectedSubtype] = useState(
    user?.transportSubtype || 'transport_company'
  );
  const [activeTab, setActiveTab] = useState('fleet');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editPriceEgp, setEditPriceEgp] = useState(2200);

  const [vehicleForm, setVehicleForm] = useState({
    nameAr: '',
    serviceType: 'airport_transfer',
    seats: 4,
    luggageCapacity: 4,
    priceEgp: 2200,
    plateReference: 'م ص ر 742',
    citySlug: 'cairo',
  });

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await transportProviderApi.getDashboard({
        providerId: user?.providerId,
        userId: user?.id,
        subtype: selectedSubtype,
      });
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.providerId, selectedSubtype]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleForm.nameAr.trim()) return;
    setSubmitting(true);
    setBannerMsg('');
    try {
      await transportProviderApi.addVehicleService({
        providerId: data?.provider?.id || user?.providerId,
        ...vehicleForm,
      });
      setVehicleForm({
        nameAr: '',
        serviceType: 'airport_transfer',
        seats: 4,
        luggageCapacity: 4,
        priceEgp: 2200,
        plateReference: `م ص ر ${Math.floor(100 + Math.random() * 899)}`,
        citySlug: 'cairo',
      });
      setBannerMsg('تمت إضافة الخدمة والمركبة في جدولي transport_services و provider_vehicles بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة المركبة');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveServicePrice = async (serviceId) => {
    setBusyId(serviceId);
    try {
      await transportProviderApi.updateVehicleOrService(serviceId, {
        priceEgp: Number(editPriceEgp),
      });
      setEditingServiceId(null);
      setBannerMsg('تم تحديث تسعيرة خط النقل في قاعدة البيانات.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث السعر');
    } finally {
      setBusyId(null);
    }
  };

  const handleArchiveService = async (serviceId) => {
    setBusyId(serviceId);
    try {
      await transportProviderApi.updateVehicleOrService(serviceId, { status: 'archived' });
      setBannerMsg('تم أرشفة خط النقل من الكتالوج.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر أرشفة خط النقل');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleVehicleMaintenance = async (v) => {
    setBusyId(v.id);
    const nextStatus = v.status === 'active' ? 'maintenance' : 'active';
    try {
      await transportProviderApi.updateVehicleOrService(v.id, {
        vehicleStatus: nextStatus,
      });
      setBannerMsg(
        nextStatus === 'active'
          ? 'تم إعادة تفعيل المركبة في الأسطول الجاهز للتشغيل.'
          : 'تم تحويل المركبة إلى وضع الصيانة الدورية.'
      );
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة المركبة');
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      await transportProviderApi.updateBookingStatus(bookingId, status);
      setBannerMsg(
        status === 'completed'
          ? 'تم تسجيل إتمام توصيل المسافر بنجاح!'
          : status === 'cancelled'
            ? 'تم إلغاء حجز التوصيل.'
            : 'تم تأكيد رحلة النقل.'
      );
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الحجز');
    } finally {
      setBusyId(null);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'أسطول ترافورا للنقل الفاخر VIP';
  const stats = data?.stats || {};
  const services = data?.services || [];
  const vehicles = data?.vehicles || [];
  const bookings = data?.bookings || [];

  const subtypeMeta =
    TRANSPORT_SUBTYPES.find((s) => s.id === selectedSubtype) || TRANSPORT_SUBTYPES[0];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-10 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-6xl">
        <ProviderWorkspaceBar
          badgeLabel={`🚘 لوحة تحكم شريك النقل السياحي — ${subtypeMeta.label}`}
          title={`مركز عمليات «${providerName}»`}
          subtitle="إدارة حقيقية لخطوط النقل (transport_services)، مركبات الأسطول (provider_vehicles)، ومهام استقبال المطارات."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={data?.application?.registration_reference || 'CR-EG-300891'}
        />

        {/* Subtype Switcher */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCEBFA] bg-white p-2.5 shadow-2xs">
          <span className="px-2 text-xs font-black text-[#0D2447]">
            نمط تشغيل قطاع النقل والسيارات:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TRANSPORT_SUBTYPES.map((sub) => {
              const active = selectedSubtype === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubtype(sub.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    active
                      ? 'bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EEF8FF]'
                  }`}
                >
                  {sub.icon} {sub.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">المركبات المسجلة بالأسطول</div>
            <div className="mt-1 text-base font-black text-[#0099FF]">
              {vehicles.length} مركبات ({stats.activeVehiclesCount || vehicles.length} نشطة)
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">خطوط وخدمات النقل</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {services.length} خدمات مفعلة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">نطاق التغطية الجغرافية</div>
            <div className="mt-1 text-xs font-black text-[#FF8A00] truncate">
              {(stats.coverageAreas || ['القاهرة', 'الجيزة']).join(' • ')}
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجوزات النقل الفعلية</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {bookings.length} حجوزات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إجمالي عوائد النقل</div>
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
                  حركة الأسطول وخطوط النقل الذكية
                </span>
                <span className="rounded-full bg-[#EEF8FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                  متصل بـ transport_services و provider_vehicles
                </span>
              </div>
              <TransportSvgAnimation transportSubtype={selectedSubtype} />
            </div>

            <form
              onSubmit={handleAddVehicle}
              className="rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#0D2447]">
                  + إضافة سيارة وخط نقل للأسطول
                </h2>
                <span className="text-[10px] font-bold text-[#0099FF]">تسجيل مزدوج بالقاعدة</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  اسم المركبة أو خط النقل بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleForm.nameAr}
                  onChange={(e) => setVehicleForm((p) => ({ ...p, nameAr: e.target.value }))}
                  placeholder="مثال: فان مرسيدس V-Class VIP استقبال مطار"
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    نوع الخدمة
                  </label>
                  <select
                    value={vehicleForm.serviceType}
                    onChange={(e) =>
                      setVehicleForm((p) => ({ ...p, serviceType: e.target.value }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  >
                    <option value="airport_transfer">استقبال مطار VIP</option>
                    <option value="private_car">سيارة خاصة / إيجار يومي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    السعر (ج.م)
                  </label>
                  <input
                    type="number"
                    min={200}
                    value={vehicleForm.priceEgp}
                    onChange={(e) =>
                      setVehicleForm((p) => ({ ...p, priceEgp: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    المقاعد
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={vehicleForm.seats}
                    onChange={(e) =>
                      setVehicleForm((p) => ({ ...p, seats: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    الحقائب
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={vehicleForm.luggageCapacity}
                    onChange={(e) =>
                      setVehicleForm((p) => ({
                        ...p,
                        luggageCapacity: Number(e.target.value),
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    رقم اللوحة
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.plateReference}
                    onChange={(e) =>
                      setVehicleForm((p) => ({ ...p, plateReference: e.target.value }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-extrabold text-white shadow-xs transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? 'جارٍ الإضافة...' : '+ حفظ المركبة وإضافتها للأسطول'}
              </button>
            </form>
          </aside>

          {/* Left Column */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'fleet', label: `🚘 خدمات وخطوط النقل (${services.length})` },
                { id: 'vehicles', label: `🚐 سجل المركبات (${vehicles.length})` },
                { id: 'bookings', label: `✈️ حجوزات الاستقبال (${bookings.length})` },
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
                جارٍ تحميل بيانات الأسطول وحجوزات النقل من قاعدة البيانات...
              </div>
            ) : activeTab === 'fleet' ? (
              <div className="mt-4 space-y-3">
                {services.map((s) => {
                  const priceEgp = Math.round((Number(s.price_minor) || 250000) / 100);
                  const isBusy = busyId === s.id;
                  const isEditing = editingServiceId === s.id;
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-[#0D2447]">{s.name_ar}</span>
                            <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                              {s.service_type === 'airport_transfer'
                                ? 'استقبال مطار VIP'
                                : 'سيارة خاصة / إيجار'}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[#64748B]">
                            📍 {s.destination_name || 'القاهرة'} • {s.seats} مقاعد ركاب •{' '}
                            {s.luggage_capacity} حقائب سفر
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-[#0099FF]">
                            {priceEgp.toLocaleString('ar-EG')} ج.م
                          </div>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 border-t border-[#DCEBFA] pt-2">
                          <span className="text-[11px] font-bold">السعر الجديد (ج.م):</span>
                          <input
                            type="number"
                            min={200}
                            value={editPriceEgp}
                            onChange={(e) => setEditPriceEgp(e.target.value)}
                            className="h-8 w-24 rounded-lg border border-[#0099FF] bg-white px-2 text-xs font-bold"
                          />
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSaveServicePrice(s.id)}
                            className="rounded-lg bg-[#0099FF] px-3 py-1 text-[11px] font-extrabold text-white"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingServiceId(null)}
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
                              setEditingServiceId(s.id);
                              setEditPriceEgp(priceEgp);
                            }}
                            className="rounded-lg border border-[#BCE3FF] bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                          >
                            ✎ تعديل السعر
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleArchiveService(s.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            حذف الخط
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : activeTab === 'vehicles' ? (
              <div className="mt-4 space-y-2.5">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0D2447]">
                          {v.make} {v.model}
                        </span>
                        <span className="rounded-full bg-white border border-[#DCEBFA] px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-[#0077CC]">
                          لوحة: {v.plate_reference || v.code}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">
                        الفئة: {v.vehicle_type === 'van' ? 'فان عائلي VIP' : 'سيارة سيدان / SUV'} •{' '}
                        {v.seats} مقاعد • {v.luggage_capacity} حقائب
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                          v.status === 'active'
                            ? 'bg-[#E8FFFB] text-[#00806B]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.status === 'active' ? 'جاهزة بالخدمة' : 'في الصيانة'}
                      </span>
                      <button
                        type="button"
                        disabled={busyId === v.id}
                        onClick={() => handleToggleVehicleMaintenance(v)}
                        className="rounded-xl border border-[#BCE3FF] bg-white px-3 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                      >
                        {v.status === 'active' ? 'تحويل للصيانة' : 'إعادة للخدمة'}
                      </button>
                    </div>
                  </div>
                ))}
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
                              المسافر: {b.contact_name} ({b.passenger_count} ركاب)
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
                                ? '✓ تم التوصيل'
                                : b.status === 'confirmed'
                                  ? 'رحلة مؤكدة'
                                  : 'ملغاة'}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[#64748B]">
                            🚘 من: {b.pickup_label} ← إلى: {b.dropoff_label}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-[#0D2447]">
                            {Math.round((Number(b.total_minor) || 0) / 100).toLocaleString('ar-EG')}{' '}
                            ج.م
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
                            ✓ تأكيد إتمام التوصيل
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            إلغاء الرحلة
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