import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProviderWorkspaceBar } from '../../../shared/components/ProviderWorkspaceBar';
import { restaurantProviderApi } from '../api/restaurantApi';
import { RestaurantSvgAnimation } from '../components/RestaurantSvgAnimation';

export function RestaurantDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [submitting, setSubmitting] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');
  const [menuForm, setMenuForm] = useState({
    nameAr: '',
    categoryAr: 'قائمة عشاء تذوق Fine Dining',
    priceEgp: 1200,
    seatingZone: 'تراس البحيرة الفيروزية VIP',
  });

  useEffect(() => {
    let active = true;
    restaurantProviderApi
      .getDashboard({ providerId: user?.providerId, userId: user?.id })
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const refreshDashboard = async () => {
    try {
      const res = await restaurantProviderApi.getDashboard({
        providerId: user?.providerId,
        userId: user?.id,
      });
      setData(res);
    } catch {
      // ignore
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.nameAr.trim()) return;
    setSubmitting(true);
    setBannerMsg('');
    try {
      await restaurantProviderApi.addMenuItem({
        providerId: data?.provider?.id || user?.providerId,
        ...menuForm,
      });
      setMenuForm({
        nameAr: '',
        categoryAr: 'قائمة عشاء تذوق Fine Dining',
        priceEgp: 1200,
        seatingZone: 'تراس البحيرة الفيروزية VIP',
      });
      setBannerMsg('تمت إضافة الطبق / باقة الضيافة الجديدة إلى قائمة المطعم بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة الطبق');
    } finally {
      setSubmitting(false);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'لا ميزون دي لاغون - الجونة';
  const stats = data?.stats || {};
  const menuItems = data?.menuItems || [];
  const reservations = data?.reservations || [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-10 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-6xl">
        <ProviderWorkspaceBar
          badgeLabel="🍽️ لوحة تحكم شريك المطاعم والضيافة الفاخرة"
          title={`مرحباً بك في إدارة مطعم «${providerName}»`}
          subtitle="إدارة قوائم التذوق والمنيو، مناطق الجلوس والطاولات، مواعيد العمل، وحجوزات العشاء للمسافرين."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={data?.application?.registration_reference || 'CR-EG-400112'}
        />

        {/* Compact Restaurant KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">هوية المطبخ والضيافة</div>
            <div className="mt-1 text-sm font-black text-[#0099FF] truncate">
              {stats.cuisineAr || 'فرنسي وبحري فاخر'}
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">الطاقة الاستيعابية</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {stats.seatingCapacity || 95} مقعد وطاولة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">باقات وأطباق المنيو</div>
            <div className="mt-1 text-base font-black text-[#FF8A00]">
              {stats.menuItemsCount || menuItems.length} باقات مميزة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجوزات الطاولات المؤكدة</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {stats.reservationsCount || reservations.length} حجوزات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إيرادات حجوزات العشاء</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {(stats.totalRevenueEgp || 9500).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-800">
            ✓ {bannerMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Right Column: Animated SVG Restaurant Showcase & Add Menu Item Form */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl border border-[#DCEBFA] bg-white p-4 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black text-[#0D2447]">
                  صالة الضيافة وحجوزات الطاولات
                </span>
                <span className="rounded-full bg-[#FFF5EB] px-2.5 py-0.5 text-[10px] font-extrabold text-[#CC6D00]">
                  {stats.openingHours || '12:00 ظ - 01:00 ص'}
                </span>
              </div>
              <RestaurantSvgAnimation />
            </div>

            <form
              onSubmit={handleAddMenuItem}
              className="rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#0D2447]">
                  + إضافة طبق أو باقة عشاء للمنيو
                </h2>
                <span className="text-[10px] font-bold text-[#00806B]">متاح للحجز المسبق</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  اسم الطبق أو باقة التذوق *
                </label>
                <input
                  type="text"
                  required
                  value={menuForm.nameAr}
                  onChange={(e) => setMenuForm((p) => ({ ...p, nameAr: e.target.value }))}
                  placeholder="مثال: سيمفونية ثمار البحر الطازجة لشخصين"
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    تصنيف الباقة
                  </label>
                  <select
                    value={menuForm.categoryAr}
                    onChange={(e) => setMenuForm((p) => ({ ...p, categoryAr: e.target.value }))}
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-2.5 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  >
                    <option value="قائمة عشاء تذوق Fine Dining">قائمة عشاء تذوق Fine Dining</option>
                    <option value="الأطباق الرئيسية الفاخرة">الأطباق الرئيسية الفاخرة</option>
                    <option value="باقات المناسبات الخاصة">باقات المناسبات الخاصة</option>
                    <option value="إفطار وبرنش بإطلالة بحرية">إفطار وبرنش بإطلالة بحرية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                    السعر للفرد / الباقة (ج.م)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={menuForm.priceEgp}
                    onChange={(e) =>
                      setMenuForm((p) => ({ ...p, priceEgp: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                  منطقة الجلوس المخصصة
                </label>
                <input
                  type="text"
                  value={menuForm.seatingZone}
                  onChange={(e) => setMenuForm((p) => ({ ...p, seatingZone: e.target.value }))}
                  className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs outline-none focus:border-[#0099FF] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] text-xs font-extrabold text-white shadow-xs transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? 'جارٍ الإضافة...' : '+ نشر الباقة في قائمة المطعم'}
              </button>
            </form>
          </aside>

          {/* Left Column: Menu Packages & Table Reservations */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'menu', label: `🍽️ قائمة الطعام والباقات (${menuItems.length})` },
                { id: 'reservations', label: `🕯️ حجوزات الطاولات (${reservations.length})` },
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
                جارٍ تحميل قوائم المطعم وحجوزات الطاولات...
              </div>
            ) : activeTab === 'menu' ? (
              <div className="mt-4 space-y-2.5">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0D2447]">{item.nameAr}</span>
                        <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                          {item.categoryAr}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">
                        🪑 منطقة الطاولات: {item.seatingZone}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-[#00806B]">
                        {Number(item.priceEgp).toLocaleString('ar-EG')} ج.م
                      </div>
                      <div className="text-[10px] font-bold text-[#0099FF]">متاح للحجز</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {reservations.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#0099FF]">
                          {r.reference}
                        </span>
                        <span className="text-xs font-black text-[#0D2447]">
                          الضيف: {r.guestName} ({r.guestsCount} أفراد)
                        </span>
                        <span className="rounded-full bg-[#E8FFFB] px-2 py-0.5 text-[10px] font-extrabold text-[#00806B]">
                          طاولة مؤكدة
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">
                        🕒 الموعد: {r.reservationTime} • {r.zone} • {r.packageTitle}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-[#0D2447]">
                        {Number(r.amountEgp).toLocaleString('ar-EG')} ج.م
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
