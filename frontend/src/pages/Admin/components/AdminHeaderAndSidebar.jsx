import { Link } from 'react-router-dom';
import { AdminIcon, SparkleIcon } from './adminHelpers';
import { WORKSPACE_GROUPS, getNavBadge } from '../models/adminModel';

export function AdminHeader({
  currentMeta,
  loading,
  onOpenNewDestination,
  onOpenAllScreens,
  onOpenHelp,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#DCEBFA]/80 bg-white/85 backdrop-blur-md shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0099FF] to-[#00C8A8] text-white shadow-[0_6px_16px_rgba(0,153,255,0.25)]">
            <AdminIcon name={currentMeta.icon} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-[#0D2447] leading-none">
                {currentMeta.pageTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#E8FFFB] border border-[#99F6E4] px-2.5 py-0.5 text-[10px] font-extrabold text-[#00806B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C8A8] animate-ping" />
                متصل ومباشر
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#64748B] mt-1">
              {currentMeta.pageSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-[11px] font-bold text-[#0099FF] bg-[#EEF8FF] border border-[#BCE3FF] rounded-xl px-2.5 py-1">
              جاري المزامنة...
            </span>
          )}

          <button
            type="button"
            onClick={onOpenNewDestination}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-[#0099FF] to-[#169CF6] hover:opacity-95 text-white px-3.5 py-2 text-xs font-extrabold shadow-[0_4px_14px_rgba(0,153,255,0.22)] transition cursor-pointer"
          >
            <span>+ وجهة سياحية</span>
          </button>

          <button
            type="button"
            onClick={onOpenAllScreens}
            className="rounded-xl bg-white hover:bg-[#EEF8FF] text-[#0099FF] border border-[#DCEBFA] px-3 py-2 text-xs font-extrabold transition cursor-pointer"
          >
            جميع الشاشات (13)
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            className="rounded-xl bg-[#EEF8FF] hover:bg-[#D8EFFF] text-[#0077CC] border border-[#BCE3FF]/60 px-3 py-2 text-xs font-extrabold transition cursor-pointer"
          >
            المساعدة
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] hover:bg-white px-3 py-1.5 transition"
            dir="ltr"
          >
            <div className="text-left">
              <span className="text-sm font-black tracking-tight text-[#0099FF] block leading-none">
                Travora
              </span>
              <span className="text-[9px] font-bold text-[#64748B] block mt-0.5">
                معاينة المنصة ↗
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AdminSidebar({ activeTab, onSelectTab, kpis, destinationsCount }) {
  return (
    <aside className="w-full lg:w-[245px] shrink-0 lg:sticky lg:top-[72px]">
      <div className="bg-white rounded-2xl border border-[#DCEBFA] p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="h-3.5 w-3.5 text-[#0099FF]" />
            <h2 className="text-xs font-black text-[#0D2447]">مساحة العمل</h2>
          </div>
          <span className="text-[10px] font-bold text-[#94A3B8]">13 وحدة</span>
        </div>

        <div className="space-y-3">
          {WORKSPACE_GROUPS.map((group) => (
            <div key={group.groupLabel}>
              <p className="px-2 mb-1 text-[10px] font-extrabold text-[#94A3B8] tracking-wide">
                {group.groupLabel}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const badge = getNavBadge(item.id, kpis, destinationsCount);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full rounded-xl px-2.5 py-2 text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-l from-[#0099FF] to-[#169CF6] text-white font-extrabold shadow-[0_4px_12px_rgba(0,153,255,0.22)]'
                          : 'text-[#475569] hover:bg-[#F2F7FD] hover:text-[#0099FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <AdminIcon
                          name={item.icon}
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-[#0099FF]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-black leading-4 ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : badge.tone === 'orange'
                              ? 'bg-[#FFF5EB] text-[#CC6D00] border border-[#FED7AA]'
                              : badge.tone === 'rose'
                              ? 'bg-[#FEE2E2] text-[#B91C1C]'
                              : 'bg-[#EEF8FF] text-[#0077CC]'
                          }`}
                        >
                          {badge.text}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#EEF8FF] hover:bg-[#D8EFFF] text-[#0077CC] border border-[#BCE3FF]/60 py-2 text-xs font-extrabold transition"
          >
            <AdminIcon name="globe" className="h-4 w-4" />
            <span>بوابة المنصة الرئيسية</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
