import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseNavLinks = [
  { to: "/", title: "الرئيسية", end: true },
  { to: "/hotels", title: "الفنادق" },
  { to: "/my-trips", title: "رحلاتي" },
  { to: "/destinations", title: "اكتشف الوجهات" },
];

const PROVIDER_DASHBOARD_META = {
  hotel: { to: "/provider/hotel", title: "🏨 لوحة تحكم الفندق" },
  restaurant: { to: "/provider/restaurant", title: "🍽️ لوحة تحكم المطعم" },
  guide: { to: "/provider/guide", title: "🧭 لوحة تحكم المرشد" },
  transport: { to: "/provider/transport", title: "🚘 لوحة تحكم النقل" },
};

function getRoleNavLinks(user) {
  if (user?.role === "admin") {
    return [...baseNavLinks, { to: "/admin", title: "🛡️ لوحة الأدمن" }];
  }
  if (user?.role === "provider") {
    const pType = user.providerType || "hotel";
    const dash = PROVIDER_DASHBOARD_META[pType] || PROVIDER_DASHBOARD_META.hotel;
    return [...baseNavLinks, dash];
  }
  return [...baseNavLinks, { to: "/partner-register", title: "انضم كشريك خدمة" }];
}

function UserIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }) {
  if (open) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const displayName = user?.fullName || user?.name || user?.email || "";
  const navLinks = getRoleNavLinks(user);

  const desktopLinkClass = ({ isActive }) => `
    relative
    flex
    h-full
    items-center
    justify-center
    px-4
    text-[15px]
    font-[700]
    transition-colors
    duration-300

    ${
      isActive
        ? "text-[#119FF5]"
        : "text-[#10213E] hover:text-[#119FF5]"
    }

    after:absolute
    after:bottom-[-1px]
    after:left-1/2
    after:h-[3px]
    after:-translate-x-1/2
    after:rounded-full
    after:bg-[#12A9F5]
    after:transition-all
    after:duration-300

    ${
      isActive
        ? "after:w-[58px] after:opacity-100"
        : "after:w-0 after:opacity-0"
    }
  `;

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
      ========================================================= */}
      <header
        className="
          absolute
          inset-x-0
          top-[16px]
          z-50
          px-4
          sm:px-6
          lg:px-[4.5%]
        "
      >
        <nav
          dir="rtl"
          className="
            mx-auto
            flex
            h-[68px]
            w-full
            max-w-[1320px]
            items-center
            justify-between

            rounded-[24px]

            border
            border-white/80

            bg-white/[0.94]

            px-4

            shadow-[0_10px_40px_rgba(43,94,139,0.10)]

            backdrop-blur-[18px]

            sm:px-5
            lg:px-6
          "
        >
          {/* =====================================================
              LOGO - RIGHT
          ===================================================== */}
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="
              flex
              min-w-[175px]
              flex-col
              items-start
              justify-center
              leading-none
            "
          >
            <div className="flex items-end">
              <span
                className="
                  font-serif
                  text-[29px]
                  font-[700]
                  tracking-[0.01em]
                  text-[#0F1D38]
                  sm:text-[31px]
                "
              >
                Travora
              </span>

              <span
                className="
                  mb-[5px]
                  mr-[3px]
                  block
                  size-[6px]
                  rounded-full
                  bg-[#169CF3]
                "
              />
            </div>

            <span
              className="
                mt-[4px]
                text-[9px]
                font-[500]
                tracking-[0.01em]
                text-[#8190A7]
              "
            >
              اكتشف أكثر من مجرد وجهة
            </span>
          </Link>

          {/* =====================================================
              DESKTOP LINKS
          ===================================================== */}
          <div
            className="
              hidden
              h-full
              flex-1
              items-center
              justify-center
              gap-[16px]
              lg:flex
              xl:gap-[28px]
            "
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={desktopLinkClass}
              >
                {link.title}
              </NavLink>
            ))}
          </div>

          {/* =====================================================
              LOGIN / USER PROFILE - LEFT
          ===================================================== */}
          <div className="hidden min-w-[175px] items-center justify-end gap-2.5 lg:flex">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex h-[44px] items-center gap-2.5 rounded-[14px] border border-[#E2ECF5] bg-[#F4F9FD] px-3.5 text-[14px] font-[800] text-[#0F1D38]">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#149EF7] text-xs font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </div>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="flex h-[44px] items-center justify-center rounded-[14px] border border-red-200 bg-red-50 px-3.5 text-[13px] font-[800] text-red-600 transition hover:bg-red-100"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  flex
                  h-[48px]
                  min-w-[174px]
                  items-center
                  justify-center
                  gap-3

                  rounded-[14px]

                  bg-gradient-to-l
                  from-[#149EF7]
                  to-[#188DE9]

                  px-5

                  text-[15px]
                  font-[800]
                  text-white

                  shadow-[0_8px_22px_rgba(20,158,247,0.23)]

                  transition-all
                  duration-300

                  hover:-translate-y-[1px]
                  hover:shadow-[0_12px_28px_rgba(20,158,247,0.30)]

                  active:translate-y-0
                "
              >
                <UserIcon />

                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="
              flex
              size-[44px]
              items-center
              justify-center
              rounded-[13px]
              bg-[#119FF5]/10
              text-[#119FF5]
              transition
              hover:bg-[#119FF5]/15
              lg:hidden
            "
            aria-label={
              isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"
            }
            aria-expanded={isMobileMenuOpen}
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </nav>
      </header>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      <div
        className={`
          fixed
          inset-0
          z-40
          transition-all
          duration-300
          lg:hidden

          ${
            isMobileMenuOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        {/* dark overlay */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="إغلاق القائمة"
          className="
            absolute
            inset-0
            h-full
            w-full
            bg-[#10213E]/25
            backdrop-blur-[5px]
          "
        />

        {/* mobile card */}
        <div
          dir="rtl"
          className={`
            absolute
            left-4
            right-4
            top-[96px]

            rounded-[24px]
            border
            border-white/80

            bg-white/[0.97]

            p-4

            shadow-[0_20px_60px_rgba(16,33,62,0.20)]

            backdrop-blur-xl

            transition-all
            duration-300

            ${
              isMobileMenuOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-4 scale-[0.98] opacity-0"
            }
          `}
        >
          {/* links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex
                  h-[50px]
                  items-center
                  rounded-[14px]
                  px-4
                  text-[15px]
                  font-[700]
                  transition

                  ${
                    isActive
                      ? "bg-[#119FF5]/10 text-[#119FF5]"
                      : "text-[#10213E] hover:bg-[#119FF5]/5"
                  }
                `}
              >
                {link.title}
              </NavLink>
            ))}
          </div>

          {/* divider */}
          <div className="my-4 h-px bg-[#E5ECF3]" />

          {/* login / user profile */}
          {user ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex h-[50px] items-center justify-between rounded-[14px] border border-[#E2ECF5] bg-[#F4F9FD] px-4 text-[15px] font-[800] text-[#0F1D38]">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#149EF7] text-xs font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{displayName}</span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  متصل
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setIsMobileMenuOpen(false);
                }}
                className="flex h-[48px] w-full items-center justify-center rounded-[14px] border border-red-200 bg-red-50 text-[15px] font-[800] text-red-600"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                gap-3

                rounded-[15px]

                bg-gradient-to-l
                from-[#149EF7]
                to-[#188DE9]

                text-[15px]
                font-[800]
                text-white

                shadow-[0_8px_22px_rgba(20,158,247,0.22)]
              "
            >
              <UserIcon />

              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </>
  );
}