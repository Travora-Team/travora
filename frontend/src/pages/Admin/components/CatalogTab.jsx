import { Link } from 'react-router-dom';
import { resolveDestinationImage } from '../api/adminScreenApi';
import { InitialsAvatar, StatusBadge } from './adminHelpers';

export function AdminCatalogTab({
  catalog,
  catalogTabsMeta,
  catalogSubTab,
  onSelectCatalogSubTab,
  allDestinations,
  featuredCount,
  filteredDestinations,
  destFilter,
  onChangeDestFilter,
  destSearch,
  onChangeDestSearch,
  actionBusy,
  onOpenNewDestination,
  onOpenEditDestination,
  onToggleDestinationFeatured,
  onToggleCatalogStatus,
  onDeleteDestination,
}) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          {catalogTabsMeta.map((tab) => {
            const isSelected = catalogSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectCatalogSubTab(tab.id)}
                className={`rounded-xl p-2.5 text-right border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-l from-[#0099FF] to-[#159CF6] text-white border-[#0099FF] shadow-[0_6px_16px_rgba(0,153,255,0.22)]'
                    : 'bg-[#F8FAFC] hover:bg-[#EEF8FF] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{tab.label}</p>
                  <p
                    className={`text-[10px] font-bold truncate mt-0.5 ${
                      isSelected ? 'text-white/85' : 'text-[#64748B]'
                    }`}
                  >
                    {tab.sub}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-[#0099FF] border border-[#DCEBFA]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCEBFA] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.03)] space-y-4">
        {catalogSubTab === 'destinations' ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: `الكل (${allDestinations.length})` },
                  { id: 'featured', label: `معروض بالرئيسية (${featuredCount})` },
                  {
                    id: 'hidden',
                    label: `غير معروض بالرئيسية (${allDestinations.length - featuredCount})`,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChangeDestFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                      destFilter === f.id
                        ? 'bg-[#0D2447] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                <input
                  type="search"
                  value={destSearch}
                  onChange={(e) => onChangeDestSearch(e.target.value)}
                  placeholder="ابحث باسم الوجهة أو الوسوم..."
                  className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs w-44 sm:w-56 focus:outline-none focus:border-[#0099FF]"
                />
                <Link
                  to="/"
                  className="rounded-xl bg-[#EEF8FF] hover:bg-[#D8EFFF] text-[#0077CC] px-3 py-1.5 text-xs font-extrabold transition"
                >
                  معاينة بالرئيسية ↗
                </Link>
                <button
                  type="button"
                  onClick={onOpenNewDestination}
                  className="rounded-xl bg-[#0099FF] hover:bg-[#0088E5] text-white px-3.5 py-1.5 text-xs font-extrabold shadow-xs cursor-pointer"
                >
                  + إضافة وجهة
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDestinations.map((dest) => {
                const imgSrc = resolveDestinationImage(dest.image_url, dest.slug);
                return (
                  <div
                    key={dest.id}
                    className="group overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_32px_rgba(0,153,255,0.10)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={dest.name_ar}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071729]/85 via-[#071729]/20 to-transparent" />

                        <div className="absolute left-3 top-2.5 flex items-center gap-1 rounded-full bg-[#314D6D]/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                          <span>📍</span>
                          <span>{dest.country_label_ar || 'مصر'}</span>
                        </div>

                        <div className="absolute right-3 top-2.5 flex items-center gap-1">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              dest.is_featured && dest.status === 'active'
                                ? 'bg-[#E8FFFB] text-[#00806B] border border-[#99F6E0]'
                                : 'bg-white/90 text-[#64748B]'
                            }`}
                          >
                            {dest.is_featured && dest.status === 'active'
                              ? `بالرئيسية #${dest.display_order || 1}`
                              : 'مخفي من الرئيسية'}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 right-3.5 left-3.5 text-right">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="text-lg font-black text-white leading-tight">
                              {dest.name_ar}
                            </h4>
                            <span className="text-[10px] font-semibold text-white/75 font-mono">
                              {dest.name_en}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] font-bold text-[#5EEAD4] truncate">
                            {dest.tags_ar || 'ثقافة • تاريخ • سياحة'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 text-right">
                        <p className="text-[11px] font-medium leading-5 text-[#64748B] line-clamp-2 min-h-[40px]">
                          {dest.description_ar}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 text-[11px] font-bold text-[#475569]">
                          <span>▢ {dest.category_label_ar || 'معالم'}</span>
                          <span className="text-[#0099FF]">👤 {dest.visitors_text || '+10K'} زائر</span>
                          <span className="text-[#FF8A00] font-black">
                            ★ {Number(dest.rating || 4.8).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-3.5 pb-3 pt-2 flex items-center justify-between gap-1.5 border-t border-[#F1F5F9]">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() => onOpenEditDestination(dest)}
                          className="rounded-lg bg-[#0099FF] hover:bg-[#0088E5] text-white px-2.5 py-1 text-[11px] font-extrabold transition cursor-pointer"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() => onToggleDestinationFeatured(dest)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold border transition cursor-pointer ${
                            dest.is_featured
                              ? 'bg-[#FFF5EB] text-[#CC6D00] border-[#FFD8A8] hover:bg-[#FFE8CC]'
                              : 'bg-[#E8FFFB] text-[#00806B] border-[#99F6E0] hover:bg-[#CCFBF1]'
                          }`}
                        >
                          {dest.is_featured ? 'إخفاء من الرئيسية' : 'إظهار بالرئيسية'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() => onToggleCatalogStatus('destination', dest)}
                          className="rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] px-2 py-1 text-[10px] font-extrabold cursor-pointer"
                        >
                          {dest.status === 'active' ? 'أرشفة' : 'نشر'}
                        </button>
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() => onDeleteDestination(dest)}
                          className="rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] text-[#B91C1C] px-2 py-1 text-[10px] font-extrabold cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
              <h3 className="text-sm font-black text-[#0D2447]">
                {catalogTabsMeta.find((t) => t.id === catalogSubTab)?.label}
              </h3>
              <span className="text-xs font-bold text-[#64748B]">
                يمكنك تفعيل أو أرشفة أي خدمة سياحية مباشرة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(catalogSubTab === 'hotels'
                ? catalog?.hotels
                : catalogSubTab === 'activities'
                ? catalog?.activities
                : catalogSubTab === 'transport'
                ? catalog?.transportServices
                : catalogSubTab === 'restaurants'
                ? catalog?.restaurants
                : catalog?.guides || []
              )?.map((item) => {
                const typeMap = {
                  hotels: 'hotel',
                  activities: 'activity',
                  transport: 'transport',
                  restaurants: 'restaurant',
                  guides: 'guide',
                };
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 hover:border-[#BCE3FF] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <InitialsAvatar name={item.name_ar} tone="blue" />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#0F172A] truncate">{item.name_ar}</p>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          الوجهة:{' '}
                          <strong className="text-[#0099FF]">
                            {item.destination_name || 'مصر'}
                          </strong>
                          {item.provider_name ? ` • الشريك: ${item.provider_name}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={item.status} />
                      <button
                        type="button"
                        disabled={actionBusy}
                        onClick={() => onToggleCatalogStatus(typeMap[catalogSubTab], item)}
                        className="rounded-lg bg-white hover:bg-[#EEF8FF] text-[#0099FF] border border-[#DCEBFA] px-2.5 py-1 text-[11px] font-extrabold cursor-pointer"
                      >
                        {item.status === 'active' ? 'أرشفة' : 'تفعيل'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
