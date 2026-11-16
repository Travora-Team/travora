import { useEffect, useState } from 'react';
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
  const [bannerMsg, setBannerMsg] = useState('');
  const [vehicleForm, setVehicleForm] = useState({
    nameAr: '',
    serviceType: 'airport_transfer',
    seats: 4,
    luggageCapacity: 4,
    priceEgp: 2200,
    citySlug: 'cairo',
  });

  useEffect(() => {
    let active = true;
    transportProviderApi
      .getDashboard({
        providerId: user?.providerId,
        userId: user?.id,
        subtype: selectedSubtype,
      })
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, selectedSubtype]);

  const refreshDashboard = async () => {
    try {
      const res = await transportProviderApi.getDashboard({
        providerId: user?.providerId,
        userId: user?.id,
        subtype: selectedSubtype,
      });
      setData(res);
    } catch {
      // ignore
    }
  };

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
        citySlug: 'cairo',
      });
      setBannerMsg('تمت إضافة السيارة / خدمة النقل الجديدة إلى أسطولك بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة المركبة');
    } finally {
      setSubmitting(false);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'أسطول ترافورا للنقل الفاخر VIP';
  const stats = data?.stats || {};
  const services = data?.services || [];
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
          title={`مرحباً بك في مركز عمليات «${providerName}»`}
          subtitle="إدارة أسطول السيارات والليموزين، استقبال المطارات VIP، السيارات الخاصة بسائق، وعقود الإيجار اليومي."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={data?.application?.registration_reference || 'CR-EG-300891'}
        />

        {/* Transport Sub-type Switcher Bar */}
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

        {/* Compact Transport KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجم الأسطول المسجل</div>
            <div className="mt-1 text-base font-black text-[#0099FF]">
              {stats.fleetSize || 8} مركبات حديثة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">خطوط وخدمات النقل</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {stats.servicesCount || services.length} خدمات مفعلة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">نطاق التغطية الجغرافية</div>
            <div className="mt-1 text-xs font-black text-[#FF8A00] truncate">
              {(stats.coverageAreas || ['القاهرة', 'الجيزة']).join(' • ')}
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">طلبات التوصيل والاستقبال</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {stats.bookingsCount || bookings.length} حجوزات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إجمالي عوائد النقل</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {(stats.totalRevenueEgp || 2950).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-800">
            ✓ {bannerMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Right Column: Animated SVG Transport Showcase & Add Vehicle Form */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl border border-[#DCEBFA] bg-white p-4 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black text-[#0D2447]">
                  حركة الأسطول وخطوط النقل الذكية
                </span>
                <span className="rounded-full bg-[#EEF8FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                  {subtypeMeta.label}
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
                  + إضافة سيارة أو خدمة نقل للأسطول
                </h2>
                <span className="text-[10px] font-bold text-[#0099FF]">تفعيل مباشر</span>
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
                  placeholder={
                    selectedSubtype === 'car_rental'
                      ? 'مثال: إيجار يومي مرسيدس C200 موديل 2026'
                      : selectedSubtype === 'car_owner'
                        ? 'مثال: سيارة تويوتا فورتشنر خاصة بسائق ليوم كامل'
                        : 'مثال: فان مرسيدس V-Class VIP استقبال مطار'
                  }
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
                    <option value="intercity">نقل سياحي بين المدن</option>
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    مقاعد الركاب
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={vehicleForm.seats}
                    onChange={(e) =>
                      setVehicleForm((p) => ({ ...p, seats: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    سعة الحقائب
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
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
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

          {/* Left Column: Fleet Services & Transport Bookings */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'fleet', label: `🚘 أسطول السيارات وخطوط النقل (${services.length})` },
                { id: 'bookings', label: `✈️ حجوزات الاستقبال والمشاوير (${bookings.length})` },
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
              <div className="mt-4 space-y-2.5">
                {services.map((s) => {
                  const priceEgp = Math.round((Number(s.price_minor) || 250000) / 100);
                  return (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
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
                        <div className="text-[10px] font-bold text-[#00806B]">
                          {s.status === 'active' ? 'جاهز للتشغيل' : 'قيد المراجعة'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#0099FF]">
                          {b.reference}
                        </span>
                        <span className="text-xs font-black text-[#0D2447]">
                          المسافر: {b.contact_name} ({b.passenger_count} ركاب)
                        </span>
                        <span className="rounded-full bg-[#FFF5EB] px-2 py-0.5 text-[10px] font-extrabold text-[#CC6D00]">
                          {b.status === 'confirmed' ? 'رحلة مؤكدة' : 'بانتظار التأكيد'}
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
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
