import { useCallback, useEffect, useState } from 'react';
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
  const [busyId, setBusyId] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editPriceEgp, setEditPriceEgp] = useState(1200);

  const [menuForm, setMenuForm] = useState({
    nameAr: '',
    categoryAr: 'قائمة عشاء تذوق Fine Dining',
    priceEgp: 1200,
    seatingZone: 'تراس البحيرة الفيروزية VIP',
  });

  const [tableForm, setTableForm] = useState({
    label: '',
    seats: 4,
  });

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await restaurantProviderApi.getDashboard({
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
      setBannerMsg('تم حفظ الطبق / الباقة الجديدة في جدول menu_items العلائقي بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة الطبق');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleItemAvailability = async (item) => {
    setBusyId(item.id);
    try {
      await restaurantProviderApi.updateMenuItem(item.id, {
        available: !item.available,
      });
      setBannerMsg(item.available ? 'تم تعيين الطبق كـ «غير متوفر اليوم».' : 'تم تفعيل توفر الطبق للحجز.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الطبق');
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveItemPrice = async (itemId) => {
    setBusyId(itemId);
    try {
      await restaurantProviderApi.updateMenuItem(itemId, {
        priceEgp: Number(editPriceEgp),
      });
      setEditingItemId(null);
      setBannerMsg('تم تحديث سعر الطبق في قاعدة البيانات بنجاح.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث سعر الطبق');
    } finally {
      setBusyId(null);
    }
  };

  const handleArchiveMenuItem = async (itemId) => {
    setBusyId(itemId);
    try {
      await restaurantProviderApi.updateMenuItem(itemId, { status: 'archived' });
      setBannerMsg('تم حذف / أرشفة الطبق من القائمة.');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر أرشفة الطبق');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!tableForm.label.trim()) return;
    setSubmitting(true);
    try {
      await restaurantProviderApi.addTable({
        providerId: data?.provider?.id || user?.providerId,
        label: tableForm.label.trim(),
        seats: Number(tableForm.seats) || 4,
      });
      setTableForm({ label: '', seats: 4 });
      setBannerMsg('تمت إضافة الطاولة إلى جدول restaurant_tables بنجاح!');
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر إضافة الطاولة');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReservationStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      await restaurantProviderApi.updateReservationStatus(bookingId, status);
      setBannerMsg(
        status === 'completed'
          ? 'تم تسجيل حضور الضيوف وإتمام خدمة الطاولة.'
          : status === 'cancelled'
            ? 'تم إلغاء حجز الطاولة.'
            : 'تم تأكيد حجز الطاولة.'
      );
      await refreshDashboard();
    } catch (err) {
      setBannerMsg(err.message || 'تعذر تحديث حالة الحجز');
    } finally {
      setBusyId(null);
    }
  };

  const providerName =
    data?.provider?.name_ar || user?.providerName || 'لا ميزون دي لاغون - الجونة';
  const stats = data?.stats || {};
  const menuItems = data?.menuItems || [];
  const tables = data?.tables || [];
  const reservations = data?.reservations || [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-10 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-6xl">
        <ProviderWorkspaceBar
          badgeLabel="🍽️ لوحة تحكم شريك المطاعم والضيافة الفاخرة"
          title={`مركز إدارة مطعم «${providerName}»`}
          subtitle="إدارة حقيقية لقوائم الطعام (menu_items)، صالة الطاولات (restaurant_tables)، وحجوزات العشاء المباشرة."
          applicationStatus={data?.application?.status || user?.applicationStatus || 'approved'}
          registrationReference={data?.application?.registration_reference || 'CR-EG-400112'}
        />

        {/* KPI Bar */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">هوية المطبخ والضيافة</div>
            <div className="mt-1 text-sm font-black text-[#0099FF] truncate">
              {stats.cuisineAr || 'فرنسي وبحري فاخر'}
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">سعة الطاولات المسجلة</div>
            <div className="mt-1 text-base font-black text-[#0D2447]">
              {stats.seatingCapacity || 0} مقعد ({tables.length} طاولات)
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">باقات وأطباق المنيو</div>
            <div className="mt-1 text-base font-black text-[#FF8A00]">
              {menuItems.length} أطباق نشطة
            </div>
          </div>
          <div className="rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">حجوزات الطاولات</div>
            <div className="mt-1 text-base font-black text-[#00806B]">
              {reservations.length} حجوزات
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#DCEBFA] bg-white p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#64748B]">إيرادات العشاء المؤكدة</div>
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
                  صالة الضيافة وحجوزات الطاولات
                </span>
                <span className="rounded-full bg-[#FFF5EB] px-2.5 py-0.5 text-[10px] font-extrabold text-[#CC6D00]">
                  متصل بـ menu_items و restaurant_tables
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
                <span className="text-[10px] font-bold text-[#00806B]">حفظ في جدول menu_items</span>
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
                    السعر (ج.م)
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

          {/* Left Column */}
          <section className="lg:col-span-7 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#DCEBFA] pb-3">
              {[
                { id: 'menu', label: `🍽️ المنيو والباقات (${menuItems.length})` },
                { id: 'reservations', label: `🕯️ حجوزات الطاولات (${reservations.length})` },
                { id: 'tables', label: `🪑 صالة الطاولات (${tables.length})` },
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
                جارٍ تحميل قوائم المطعم وحجوزات الطاولات من قاعدة البيانات...
              </div>
            ) : activeTab === 'menu' ? (
              <div className="mt-4 space-y-3">
                {menuItems.map((item) => {
                  const isBusy = busyId === item.id;
                  const isEditing = editingItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-[#0D2447]">{item.nameAr}</span>
                            <span className="rounded-full bg-[#EEF8FF] border border-[#BCE3FF] px-2 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
                              {item.categoryAr}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                item.available
                                  ? 'bg-[#E8FFFB] text-[#00806B]'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.available ? 'متوفر الآن' : 'نفد اليوم'}
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
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 border-t border-[#DCEBFA] pt-2">
                          <span className="text-[11px] font-bold">السعر الجديد (ج.م):</span>
                          <input
                            type="number"
                            min={50}
                            value={editPriceEgp}
                            onChange={(e) => setEditPriceEgp(e.target.value)}
                            className="h-8 w-24 rounded-lg border border-[#0099FF] bg-white px-2 text-xs font-bold"
                          />
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSaveItemPrice(item.id)}
                            className="rounded-lg bg-[#0099FF] px-3 py-1 text-[11px] font-extrabold text-white"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
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
                              setEditingItemId(item.id);
                              setEditPriceEgp(item.priceEgp);
                            }}
                            className="rounded-lg border border-[#BCE3FF] bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#0077CC] hover:bg-[#EEF8FF]"
                          >
                            ✎ تعديل السعر
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleItemAvailability(item)}
                            className="rounded-lg border border-[#DCEBFA] bg-white px-2.5 py-1 text-[11px] font-bold text-[#475569] hover:bg-slate-100"
                          >
                            {item.available ? '⏸ إيقاف التوفر اليوم' : '▶ تفعيل التوفر'}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleArchiveMenuItem(item.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : activeTab === 'reservations' ? (
              <div className="mt-4 space-y-3">
                {reservations.map((r) => {
                  const isBusy = busyId === r.id;
                  return (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-extrabold text-[#0099FF]">
                              {r.reference}
                            </span>
                            <span className="text-xs font-black text-[#0D2447]">
                              الضيف: {r.guestName} ({r.guestsCount} أفراد)
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                r.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : r.status === 'confirmed'
                                    ? 'bg-[#E8FFFB] text-[#00806B]'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {r.status === 'completed'
                                ? '✓ تم الحضور والخدمة'
                                : r.status === 'confirmed'
                                  ? 'طاولة مؤكدة'
                                  : 'ملغى'}
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

                      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#DCEBFA]/70 pt-2">
                        {r.status !== 'completed' && r.status !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateReservationStatus(r.id, 'completed')}
                            className="rounded-lg bg-[#00806B] px-3 py-1 text-[11px] font-extrabold text-white hover:bg-emerald-800"
                          >
                            ✓ تسجيل حضور الضيوف
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateReservationStatus(r.id, 'cancelled')}
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
            ) : (
              <div className="mt-4 space-y-3">
                <form
                  onSubmit={handleAddTable}
                  className="flex flex-wrap items-end gap-2 rounded-2xl border border-[#BCE3FF] bg-[#EEF8FF]/60 p-3"
                >
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                      اسم / رقم الطاولة الجديدة
                    </label>
                    <input
                      type="text"
                      required
                      value={tableForm.label}
                      onChange={(e) => setTableForm((p) => ({ ...p, label: e.target.value }))}
                      placeholder="مثال: طاولة VIP-05 — تراس الغروب"
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-white px-3 text-xs"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[11px] font-bold text-[#0D2447] mb-1">
                      عدد المقاعد
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tableForm.seats}
                      onChange={(e) => setTableForm((p) => ({ ...p, seats: Number(e.target.value) }))}
                      className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-white px-2.5 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-9 rounded-xl bg-[#0099FF] px-4 text-xs font-extrabold text-white"
                  >
                    + إضافة طاولة
                  </button>
                </form>

                {tables.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5"
                  >
                    <div>
                      <div className="text-sm font-black text-[#0D2447]">{t.label}</div>
                      <div className="text-[11px] text-[#64748B]">سعة الطاولة: {t.seats} ضيوف</div>
                    </div>
                    <span className="rounded-full bg-[#E8FFFB] border border-[#99F6E4] px-2.5 py-1 text-[10px] font-extrabold text-[#00806B]">
                      متاحة للحجز
                    </span>
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