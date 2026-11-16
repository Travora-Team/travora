import pyramidsImage from "../../../assets/section3/pyramids.webp";
import museumImage from "../../../assets/section3/egyptian-museum.webp";
import khanImage from "../../../assets/section3/khan-el-khalili.webp";
import dinnerImage from "../../../assets/section3/nile-dinner.webp";
import nileImage from "../../../assets/section3/nile.webp";

/* =========================================================
   BASIC ICON
========================================================= */

function Icon({
  children,
  size = 22,
  viewBox = "0 0 24 24",
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* =========================================================
   ICONS
========================================================= */

function Sparkle({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 1c.65 8.7 5.6 13.65 14 15-8.4 1.35-13.35 6.3-14 15-.65-8.7-5.6-13.65-14-15C10.4 14.65 15.35 9.7 16 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <Icon size={27}>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 3v4M17 3v4M3 10h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 14h3M14 14h3M7 18h3M14 18h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function MapPinIcon({ size = 16 }) {
  return (
    <Icon size={size}>
      <path
        d="M12 21s6-5.7 6-11a6 6 0 10-12 0c0 5.3 6 11 6 11Z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.3" fill="white" />
    </Icon>
  );
}

function BagIcon() {
  return (
    <Icon size={15}>
      <rect
        x="5"
        y="8"
        width="14"
        height="11"
        rx="2"
        fill="currentColor"
      />
      <path
        d="M9 8V6.6A2.6 2.6 0 0111.6 4h.8A2.6 2.6 0 0115 6.6V8"
        stroke="white"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function LandmarkIcon({ size = 15 }) {
  return (
    <Icon size={size}>
      <path
        d="M3 9L12 4l9 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 19h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function AlertIcon() {
  return (
    <Icon size={24}>
      <path d="M12 3L22 20H2L12 3Z" fill="currentColor" />
      <path
        d="M12 9v5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="white" />
    </Icon>
  );
}

function CarIcon({ size = 24 }) {
  return (
    <Icon size={size}>
      <path
        d="M5 11l1.8-5h10.4L19 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="3" y="10" width="18" height="8" rx="3" fill="currentColor" />
      <circle cx="7" cy="18" r="2" fill="currentColor" />
      <circle cx="17" cy="18" r="2" fill="currentColor" />
      <path
        d="M7 13h10"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function RefreshIcon() {
  return (
    <Icon size={22}>
      <path
        d="M20 8a8 8 0 10.2 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M20 4v5h-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function ClockIcon() {
  return (
    <Icon size={27}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M12 7v6l4 2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function SunIcon() {
  return (
    <Icon size={28}>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <path d="M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </g>
    </Icon>
  );
}

function WalletIcon() {
  return (
    <Icon size={27}>
      <path
        d="M4 7.5A3.5 3.5 0 017.5 4H18a2 2 0 012 2v2H8a3 3 0 000 6h12v4a2 2 0 01-2 2H6a3 3 0 01-3-3V7.5h1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="14" y="10" width="8" height="6" rx="2" fill="currentColor" />
      <circle cx="17" cy="13" r="1" fill="white" />
    </Icon>
  );
}

function ExpandIcon() {
  return (
    <Icon size={20}>
      <path
        d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function TargetIcon() {
  return (
    <Icon size={21}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      <path
        d="M12 1v3M12 20v3M1 12h3M20 12h3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function PlaneIcon() {
  return (
    <svg
      width="37"
      height="37"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 23l15-5L30 4l4 2-7 15 9 7-2 3-11-4-6 9-3-1 3-11-14 3v-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="19" height="15" viewBox="0 0 19 15" fill="none">
      <path
        d="M1 7.5h15M11 2l5.5 5.5L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   TOPOGRAPHIC BACKGROUND
========================================================= */

function TopographicPattern({
  className = "",
  flip = false,
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 500"
      fill="none"
      preserveAspectRatio="none"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <g
        stroke="#C7DEF3"
        strokeWidth="1.15"
        opacity=".72"
      >
        <path d="M-30 85c55-73 126-44 172-65 52-24 71-66 129-45 56 20 73 67 125 82 49 15 98-8 142 27" />
        <path d="M-35 109c59-72 128-41 175-61 55-22 74-60 131-40 55 20 75 67 128 82 50 14 97-9 145 26" />
        <path d="M-38 136c61-68 129-39 180-57 54-18 76-55 133-35 54 20 75 65 127 79 54 15 102-11 148 22" />
        <path d="M-39 164c65-66 134-36 182-52 56-19 78-50 135-30 51 18 74 61 128 75 55 14 101-10 149 20" />

        <path d="M58 274c35-50 78-57 116-44 42 14 58 46 101 50 43 4 70-24 109-18 43 7 66 45 107 57" />
        <path d="M37 301c39-55 85-63 130-48 41 15 59 48 105 52 46 4 73-24 114-16 45 8 68 45 111 59" />
        <path d="M17 330c45-61 96-69 145-51 44 16 63 47 109 53 47 6 74-22 118-12 46 11 68 46 113 61" />

        <path d="M52 418c46-45 101-40 140-14 37 24 54 52 96 55 44 3 67-24 104-27 42-3 73 32 112 38" />
        <path d="M31 447c52-52 111-47 152-16 37 28 55 55 101 58 43 4 68-27 109-27 44 0 72 33 112 39" />
      </g>
    </svg>
  );
}

/* =========================================================
   PALM
========================================================= */

function PalmLeaves() {
  return (
    <svg
      viewBox="0 0 250 240"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="#0B527A"
        strokeWidth="5.5"
        strokeLinecap="round"
        opacity=".95"
      >
        <path d="M0 239C60 188 101 130 126 43" />

        <path d="M122 58C88 28 48 14 8 11" />
        <path d="M116 79C70 58 36 56 2 65" />
        <path d="M107 103C64 96 31 105 3 123" />
        <path d="M97 129C58 135 27 153 5 177" />
        <path d="M84 158C53 173 31 195 18 222" />

        <path d="M127 45C155 29 183 19 218 18" />
        <path d="M124 66C165 55 199 59 237 75" />
        <path d="M118 91C158 88 199 101 244 126" />
        <path d="M109 118C151 127 191 150 230 185" />
      </g>
    </svg>
  );
}

/* =========================================================
   MAP BACKGROUND
========================================================= */

function CairoMapBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect width="600" height="520" fill="#ECF2F2" />

      {/* neighborhood zones */}
      <path
        d="M0 0h173l-22 92-34 71-74 55L0 210Z"
        fill="#E5EFE0"
      />
      <path
        d="M441 0h159v130l-61 37-64-14-39-64Z"
        fill="#E5EEE2"
      />
      <path
        d="M0 405l122-34 78 40-10 109H0Z"
        fill="#E5EEE0"
      />
      <path
        d="M453 388l147-31v163H436Z"
        fill="#E3EFE2"
      />

      {/* Nile */}
      <path
        d="M278 -20C302 65 290 111 297 159C307 229 345 267 340 335C336 396 319 459 333 540"
        stroke="#91D3F1"
        strokeWidth="48"
        fill="none"
        opacity=".95"
      />
      <path
        d="M282 -20C306 65 294 111 301 159C311 229 349 267 344 335C340 396 323 459 337 540"
        stroke="#BDE7F7"
        strokeWidth="15"
        fill="none"
        opacity=".95"
      />

      {/* green parks */}
      <g fill="#CDE6C9" opacity=".95">
        <path d="M52 44l79-7 14 52-68 28-42-31Z" />
        <path d="M367 19l67 9 17 52-38 38-58-16Z" />
        <path d="M95 275l67 11 17 56-58 35-53-28Z" />
        <path d="M393 317l81-6 25 57-59 45-60-35Z" />
      </g>

      {/* streets */}
      <g
        stroke="#FFFFFF"
        strokeWidth="6"
        opacity=".92"
        fill="none"
      >
        <path d="M-20 70L610 240" />
        <path d="M-10 165L610 60" />
        <path d="M-15 266L610 340" />
        <path d="M3 385L598 196" />
        <path d="M86 -10L223 530" />
        <path d="M458 -20L368 530" />
        <path d="M540 -10L507 530" />
        <path d="M162 -10L83 530" />
      </g>

      <g
        stroke="#CAD4DD"
        strokeWidth="1.4"
        opacity=".9"
        fill="none"
      >
        {[
          "M-10 32L610 181",
          "M-20 109L612 294",
          "M-10 204L605 137",
          "M-20 325L612 412",
          "M30 505L590 267",
          "M30 -10L205 530",
          "M229 -10L122 530",
          "M388 -10L437 530",
          "M520 -10L274 530",
        ].map((d) => (
          <path
            key={d}
            d={d}
          />
        ))}
      </g>

      {/* bridges */}
      <g
        stroke="#C5D1DD"
        strokeWidth="7"
      >
        <path d="M255 170h83" />
        <path d="M291 302h77" />
        <path d="M286 420h69" />
      </g>

      {/* labels */}
      <g
        fill="#69819C"
        fontFamily="Arial"
        fontWeight="700"
      >
        <text
          x="57"
          y="179"
          fontSize="32"
        >
          القاهرة
        </text>

        <text
          x="32"
          y="356"
          fontSize="18"
        >
          الجيزة
        </text>

        <text
          x="467"
          y="157"
          fontSize="14"
        >
          مطار
        </text>
        <text
          x="453"
          y="179"
          fontSize="14"
        >
          القاهرة الدولي
        </text>
      </g>

      {/* little mountain */}
      <path
        d="M69 323l19-25 14 18 16-29 28 36Z"
        fill="#8E959B"
        opacity=".75"
      />
    </svg>
  );
}

/* =========================================================
   MAP MARKER
========================================================= */

function MapMarker({
  image,
  label,
  icon,
  className = "",
}) {
  return (
    <div className={`absolute z-20 ${className}`}>
      <div
        className="
          overflow-hidden
          rounded-[14px]
          border-[3px] border-white
          bg-white
          shadow-[0_8px_18px_rgba(34,79,119,0.16)]
        "
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[73px] w-[124px] object-cover"
        />

        <div className="flex h-[33px] items-center justify-center gap-2 bg-white px-2 text-[12px] font-black text-[#096EC7]">
          <span>{label}</span>
          {icon}
        </div>
      </div>

      <div
        className="
          absolute -bottom-[11px] right-[11px]
          flex h-[29px] w-[29px]
          items-center justify-center
          rounded-full
          bg-[#159AF1]
          text-white
          shadow-[0_4px_9px_rgba(16,130,220,.25)]
        "
      >
        <MapPinIcon size={18} />
      </div>
    </div>
  );
}

/* =========================================================
   MAP PANEL
========================================================= */

function MapPanel() {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white p-[10px] shadow-[0_10px_30px_rgba(37,82,125,0.08)]">
      <div className="relative h-[500px] overflow-hidden rounded-[16px]">
        <CairoMapBackground />

        {/* location badge */}
        <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-[#455D79]/95 px-4 py-[9px] text-[13px] font-bold text-white shadow">
          <MapPinIcon size={17} />
          <span>القاهرة</span>
        </div>

        {/* route */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 600 520"
          preserveAspectRatio="none"
        >
          <path
            d="M240 407C275 410 322 388 337 356C352 324 330 300 322 286"
            fill="none"
            stroke="#17D19A"
            strokeWidth="4"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />

          <path
            d="M321 286C304 260 303 242 320 220C344 188 382 186 386 152C389 126 365 115 342 109"
            fill="none"
            stroke="#159AF2"
            strokeWidth="4"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />

          <circle
            cx="240"
            cy="407"
            r="6"
            fill="#13D49B"
          />
          <circle
            cx="322"
            cy="286"
            r="6"
            fill="#159AF2"
          />
          <circle
            cx="386"
            cy="152"
            r="6"
            fill="#159AF2"
          />
        </svg>

        {/* marker cards */}
        <MapMarker
          image={khanImage}
          label="خان الخليلي"
          icon={<BagIcon />}
          className="right-[22%] top-[54px]"
        />

        <MapMarker
          image={nileImage}
          label="النيل"
          icon={<span className="text-[12px]">⛵</span>}
          className="left-[30%] top-[177px]"
        />

        <MapMarker
          image={museumImage}
          label="المتحف المصري"
          icon={<LandmarkIcon />}
          className="right-[8%] top-[280px]"
        />

        <MapMarker
          image={pyramidsImage}
          label="الأهرامات"
          icon={<span className="text-[13px]">▲</span>}
          className="left-[16%] bottom-[75px]"
        />

        {/* airplane */}
        <div className="absolute right-[8%] top-[116px] z-20 rotate-[15deg] text-[#54779A]">
          <PlaneIcon />
        </div>

        {/* full map */}
        <button
          type="button"
          className="
            absolute bottom-[14px] left-[14px] z-30
            flex items-center gap-2
            rounded-[13px] bg-white/95
            px-4 py-[10px]
            text-[12px] font-bold text-[#49627F]
            shadow-[0_5px_15px_rgba(60,101,137,.12)]
            backdrop-blur
          "
        >
          <ExpandIcon />
          <span>عرض الخريطة الكاملة</span>
        </button>

        {/* target */}
        <button
          type="button"
          aria-label="موقعي"
          className="
            absolute bottom-[14px] right-[14px] z-30
            flex h-[44px] w-[44px]
            items-center justify-center
            rounded-full bg-white
            text-[#0D3A70]
            shadow-[0_5px_15px_rgba(60,101,137,.14)]
          "
        >
          <TargetIcon />
        </button>
      </div>

      {/* BUDGET */}
      <div className="mt-[10px] grid min-h-[150px] grid-cols-[1fr_auto_1fr] items-center rounded-[16px] bg-white px-7">
        <div className="text-right">
          <div className="flex items-center justify-start gap-3">
            <span className="text-[#098EE8]">
              <WalletIcon />
            </span>

            <span className="text-[16px] font-black text-[#0B2E5B]">
              الميزانية
            </span>
          </div>

          <div className="mt-4 text-[30px] font-black text-[#102B57]">
            1,500
            <span className="mr-1 text-[15px]">ج.م</span>
          </div>

          <p className="mt-1 text-[12px] text-[#8397B4]">
            الميزانية الكلية
          </p>
        </div>

        <div className="px-8">
          <BudgetRing />
        </div>

        <div className="text-right">
          <p className="text-[13px] font-bold text-[#577190]">
            المتبقي
          </p>

          <div className="mt-3 text-[27px] font-black text-[#102B57]">
            620
            <span className="mr-1 text-[14px]">ج.م</span>
          </div>

          <p className="mt-1 text-[12px] text-[#8397B4]">
            من ميزانيتك
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BUDGET RING
========================================================= */

function BudgetRing() {
  return (
    <div className="relative h-[92px] w-[92px]">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke="#DDEBF4"
          strokeWidth="10"
        />

        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke="url(#budgetGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="245"
          strokeDashoffset="100"
        />

        <defs>
          <linearGradient
            id="budgetGradient"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
          >
            <stop stopColor="#0BCBAE" />
            <stop
              offset="1"
              stopColor="#129DF2"
            />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-[15px] font-black text-[#0E2F5D]">
        59%
      </div>
    </div>
  );
}

/* =========================================================
   ITINERARY CARD
========================================================= */

const originalTrip = [
  {
    time: "09:00",
    title: "الأهرامات",
    subtitle: "زيارة ومعالم أثرية",
    image: pyramidsImage,
    color: "#6C849C",
  },
  {
    time: "12:30",
    title: "المتحف المصري",
    subtitle: "تاريخ وحضارة",
    image: museumImage,
    color: "#129CF1",
  },
  {
    time: "15:00",
    title: "خان الخليلي",
    subtitle: "تسوق وتجربة محلية",
    image: khanImage,
    color: "#12A8B5",
  },
  {
    time: "18:30",
    title: "عشاء على النيل",
    subtitle: "مطاعم وإطلالة مميزة",
    image: dinnerImage,
    color: "#0BD98E",
  },
];

const optimizedTrip = [
  originalTrip[0],
  originalTrip[2],
  originalTrip[1],
  originalTrip[3],
];

function TripStop({
  stop,
  compact = false,
}) {
  return (
    <div
      className="
        min-w-0 flex-1 overflow-hidden
        rounded-[12px]
        bg-white
        shadow-[0_4px_16px_rgba(60,100,136,.06)]
      "
    >
      <img
        src={stop.image}
        alt=""
        loading="lazy"
        decoding="async"
        className={`w-full object-cover ${
          compact ? "h-[74px]" : "h-[78px]"
        }`}
      />

      <div className="px-2 pb-[9px] pt-[6px] text-center">
        <div
          className="flex items-center justify-center gap-1 text-[11px] font-bold"
          style={{ color: stop.color }}
        >
          <MapPinIcon size={12} />
          <span>{stop.time}</span>
        </div>

        <h4 className="mt-1 truncate text-[13px] font-black text-[#102B54]">
          {stop.title}
        </h4>

        <p className="mt-[2px] truncate text-[10px] font-medium text-[#7186A3]">
          {stop.subtitle}
        </p>
      </div>
    </div>
  );
}

function StopsRow({
  stops,
  optimized = false,
}) {
  return (
    <div className="flex items-center gap-[10px]">
      {stops.map((stop, index) => (
        <div
          className="contents"
          key={`${stop.title}-${index}`}
        >
          <TripStop
            stop={stop}
            compact={optimized}
          />

          {index < stops.length - 1 && (
            <div
              className={`shrink-0 ${
                optimized
                  ? index === 0 || index === 2
                    ? "text-[#0AC59A]"
                    : "text-[#149BF1]"
                  : "text-[#149BF1]"
              }`}
            >
              <ArrowIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   METRIC
========================================================= */

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  color,
  bg,
}) {
  return (
    <div className="flex min-h-[78px] items-center justify-center gap-3 rounded-[13px] bg-white px-3">
      <div
        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: bg,
          color,
        }}
      >
        {icon}
      </div>

      <div className="text-right">
        <p className="text-[10px] font-bold text-[#71859E]">
          {title}
        </p>

        <p
          className="mt-[1px] text-[16px] font-black"
          style={{ color }}
        >
          {value}
        </p>

        <p className="mt-[1px] text-[10px] text-[#7D91AB]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ITINERARY PANEL
========================================================= */

function ItineraryPanel() {
  return (
    <div
      className="
        rounded-[22px]
        bg-white
        px-[20px] pb-[13px] pt-[17px]
        shadow-[0_10px_30px_rgba(37,82,125,0.08)]
      "
    >
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-[#159CF3]">
            <CalendarIcon />
          </div>

          <div>
            <h3 className="text-[17px] font-black text-[#102C59]">
              خط سير اليوم
            </h3>

            <p className="mt-1 text-[12px] font-medium text-[#7184A0]">
              السبت، 15 مارس 2025
            </p>
          </div>
        </div>

        <div className="text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F6FF] px-4 py-[8px] text-[13px] font-bold text-[#138DEA]">
            <span className="h-[9px] w-[9px] rounded-full bg-[#06D88B]" />
            <span>AI Live Trip</span>

            <svg
              width="23"
              height="17"
              viewBox="0 0 23 17"
              fill="none"
            >
              <path
                d="M2 6v5M6 3v11M10 7v3M14 1v15M18 4v9M22 6v5"
                stroke="#139CEA"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="mt-2 text-[10px] text-[#8296AF]">
            يتم التحديث في الوقت الفعلي
          </p>
        </div>
      </div>

      {/* original trip */}
      <div className="mt-6 rounded-[15px] bg-[#F8FBFE] p-[12px]">
        <StopsRow stops={originalTrip} />
      </div>

      {/* alert */}
      <div
        className="
          mt-[12px]
          flex items-center justify-between
          rounded-[12px]
          border border-[#FFB8B8]
          bg-[#FFF0F0]
          px-4 py-[10px]
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#FFDCDC] text-[#D51B1B]">
            <CarIcon />
          </div>

          <div>
            <p className="text-[13px] font-black text-[#C71919]">
              ازدحام شديد على الطريق إلى المتحف
            </p>

            <p className="mt-1 text-[10px] text-[#A76969]">
              الوقت المتوقع للرحلة الآن 30 دقيقة بدلاً من 25 دقيقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[#C61717]">
          <div className="text-left">
            <p className="text-[11px] font-black">
              تنبيه مباشر
            </p>

            <p className="mt-[2px] text-[10px] text-[#947479]">
              12:05
            </p>
          </div>

          <AlertIcon />
        </div>
      </div>

      {/* AI reorder */}
      <div className="mt-[10px] rounded-[12px] border border-[#BFE4F5] bg-[#EBF8FF] px-4 py-[11px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-[#149CF2]">
              <Sparkle size={28} />
            </div>

            <div>
              <p className="text-[13px] font-black text-[#0D3A70]">
                Travora أعاد ترتيب رحلتك تلقائياً
              </p>

              <p className="mt-1 text-[10px] text-[#7188A6]">
                بناءً على حالة المرور الحالية، أقترح هذا الترتيب الجديد لتوفير وقتك.
              </p>
            </div>
          </div>

          <div className="text-left">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4EEFF] px-3 py-[6px] text-[11px] font-black text-[#108BE4]"
            >
              <RefreshIcon />
              <span>إعادة التخطيط</span>
            </button>

            <p className="mt-1 text-[10px] text-[#8799AE]">
              12:06
            </p>
          </div>
        </div>
      </div>

      {/* optimized trip */}
      <div className="mt-[4px] rounded-[14px] border border-[#BCF1DA] bg-[#EFFFF7] p-[11px]">
        <StopsRow
          stops={optimizedTrip}
          optimized
        />
      </div>

      {/* metrics */}
      <div className="mt-[10px] grid grid-cols-3 gap-[9px] rounded-[13px] bg-[#F8FBFD] p-[5px]">
        <MetricCard
          icon={<ClockIcon />}
          title="الوقت الموفر"
          value="42 دقيقة"
          subtitle="مقارنة بالخطة الأصلية"
          color="#08A96E"
          bg="#DFF8EC"
        />

        <MetricCard
          icon={<CarIcon size={25} />}
          title="الازدحام الحالي"
          value="متوسط"
          subtitle="في أنحاء القاهرة"
          color="#FF9C15"
          bg="#FFF0D8"
        />

        <MetricCard
          icon={<SunIcon />}
          title="الطقس الآن"
          value="27°"
          subtitle="مشمس وصافٍ"
          color="#F3B400"
          bg="#FFF8D5"
        />
      </div>
    </div>
  );
}

/* =========================================================
   DECORATIVE NOTES
========================================================= */

function DecorativeNote({
  children,
  className = "",
}) {
  return (
    <div className={`absolute hidden xl:block ${className}`}>
      <p
        className="text-center text-[17px] leading-[1.55] text-[#617D9D]"
        style={{
          fontFamily:
            "'Segoe Print','Comic Sans MS',cursive",
        }}
      >
        {children}
      </p>

      <svg
        width="104"
        height="22"
        viewBox="0 0 104 22"
        className="mx-auto mt-2"
      >
        <path
          d="M4 17C30 7 62 4 100 6"
          stroke="#129CF2"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   SECTION 3
========================================================= */

export default function Section_3() {
  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        rounded-t-[30px]
        bg-[#F7FBFF]
        font-['Cairo',Arial,sans-serif]
      "
    >
      {/* topographic decorations */}
      <TopographicPattern className="pointer-events-none absolute -left-[105px] -top-[70px] h-[430px] w-[430px]" />

      <TopographicPattern
        flip
        className="pointer-events-none absolute -right-[105px] -top-[70px] h-[430px] w-[430px]"
      />

      <TopographicPattern className="pointer-events-none absolute -bottom-[170px] right-[18%] h-[430px] w-[430px] opacity-50" />

      {/* handwritten notes */}
      <DecorativeNote className="left-[4.4%] top-[83px] -rotate-[5deg]">
        خططك
        <br />
        تتحرك بذكاء
      </DecorativeNote>

      <DecorativeNote className="right-[4%] top-[90px] rotate-[4deg]">
        استجابة فورية
        <br />
        لكل تغيير
      </DecorativeNote>

      <DecorativeNote className="bottom-[39px] right-[2.6%] -rotate-[6deg]">
        مغامرات أجمل
        <br />
        برحلات أذكى ..
      </DecorativeNote>

      {/* palm bottom left */}
      <div className="pointer-events-none absolute -bottom-[30px] -left-[55px] hidden h-[210px] w-[230px] xl:block">
        <PalmLeaves />
      </div>

      {/* small logo */}
      <div className="absolute bottom-[40px] left-[9%] hidden xl:block">
        <p className="text-[18px] font-black text-[#7187A6]">
          Travora
        </p>

        <p className="mt-[2px] text-[10px] font-medium text-[#90A2BA]">
          More Than a Destination
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-[1420px] px-4 pb-[30px] pt-[28px] sm:px-6 lg:px-8">
        {/* =================================================
            SECTION HEADING
        ================================================= */}

        <header className="mx-auto max-w-[900px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[16px] font-black text-[#13BAA4]">
              ذكاء الرحلة المباشر
            </span>

            <span className="text-[#119BF2]">
              <Sparkle size={25} />
            </span>
          </div>

          <h2 className="mt-[8px] text-[34px] font-black leading-[1.25] tracking-[-1.4px] text-[#0B2852] sm:text-[40px] lg:text-[46px]">
            رحلتك تتغير معك{" "}
            <span className="bg-gradient-to-l from-[#0A9EF0] to-[#13C5AE] bg-clip-text text-transparent">
              لحظة بلحظة
            </span>
          </h2>

          <p className="mt-[11px] text-[15px] font-semibold leading-[1.9] text-[#7486A6] sm:text-[17px]">
            Travora يعيد ترتيب يومك تلقائياً حسب الزحام، الطقس، مواعيد الأماكن
            وتأخرك أثناء الرحلة.
          </p>
        </header>

        {/* =================================================
            MAIN DASHBOARD
        ================================================= */}

        <div
          dir="ltr"
          className="
            mx-auto mt-[28px]
            grid max-w-[1360px]
            grid-cols-1
            gap-[18px]
            xl:grid-cols-[0.82fr_1.18fr]
          "
        >
          {/* map */}
          <div dir="rtl">
            <MapPanel />
          </div>

          {/* right dashboard */}
          <div dir="rtl">
            <ItineraryPanel />
          </div>
        </div>

        {/* =================================================
            CTA
        ================================================= */}

        <div className="mt-[18px] flex flex-col items-center">
          <button
            type="button"
            className="
              flex h-[60px]
              min-w-[390px]
              items-center justify-center
              gap-8
              rounded-[18px]
              bg-gradient-to-l
              from-[#1588F3]
              to-[#12A9F2]
              px-10
              text-[16px] font-black
              text-white
              shadow-[0_11px_25px_rgba(17,147,235,.2)]
              transition-all duration-200
              hover:-translate-y-[2px]
              hover:shadow-[0_15px_30px_rgba(17,147,235,.28)]
              max-sm:min-w-0
              max-sm:w-full
            "
          >
            <span className="text-[22px]">
              ←
            </span>

            <span>جرّب التخطيط الذكي الآن</span>

            <Sparkle size={20} />
          </button>

          <p className="mt-[11px] text-[12px] font-semibold text-[#7187A5]">
            خطتك لا تبقى ثابتة ... لأنها تعرف ما يحدث حولك
          </p>
        </div>
      </div>
    </section>
  );
}