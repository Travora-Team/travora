import transportImage from "../../../assets/section4/transport.webp";
import experiencesImage from "../../../assets/section4/experiences.webp";
import hotelsImage from "../../../assets/section4/hotels.webp";

/* =========================================================
   SHARED SVG
========================================================= */

function SvgIcon({
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

function SparkleIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 1.5C16.7 10 21.8 15.2 30.5 16C21.8 16.8 16.7 22 16 30.5C15.3 22 10.2 16.8 1.5 16C10.2 15.2 15.3 10 16 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlanIcon() {
  return (
    <SvgIcon size={27}>
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="3"
        fill="currentColor"
      />
      <path
        d="M8.5 8h7M8.5 12h7M8.5 16h4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function BedIcon({ size = 27 }) {
  return (
    <SvgIcon size={size}>
      <path
        d="M3 19V9M21 19v-6a3 3 0 00-3-3h-7v9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="6"
        width="7"
        height="7"
        rx="2"
        fill="currentColor"
      />
      <path
        d="M3 17h18M5 19v2M19 19v2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function StarIcon({ size = 25 }) {
  return (
    <SvgIcon
      size={size}
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35 6.2 20.4l1.1-6.47-4.7-4.58 6.5-.95L12 2.5Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function CarIcon({ size = 26 }) {
  return (
    <SvgIcon size={size}>
      <path
        d="M6 11l2-5h8l2 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="10"
        width="18"
        height="8"
        rx="3"
        fill="currentColor"
      />
      <circle
        cx="7"
        cy="18"
        r="2"
        fill="currentColor"
      />
      <circle
        cx="17"
        cy="18"
        r="2"
        fill="currentColor"
      />
      <path
        d="M7 13h10"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function ChartIcon() {
  return (
    <SvgIcon size={26}>
      <rect
        x="4"
        y="13"
        width="3"
        height="7"
        rx="1.5"
        fill="currentColor"
      />
      <rect
        x="10.5"
        y="8"
        width="3"
        height="12"
        rx="1.5"
        fill="currentColor"
      />
      <rect
        x="17"
        y="3"
        width="3"
        height="17"
        rx="1.5"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function BinocularIcon({ size = 28 }) {
  return (
    <SvgIcon size={size}>
      <path
        d="M7 7l-2 5-1.5 5.5A3 3 0 006.4 21h.2a3 3 0 002.8-2l1.6-5h2l1.6 5a3 3 0 002.8 2h.2a3 3 0 002.9-3.5L19 12l-2-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="7"
        y="5"
        width="4"
        height="8"
        rx="2"
        fill="currentColor"
      />
      <rect
        x="13"
        y="5"
        width="4"
        height="8"
        rx="2"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function LocationIcon({ size = 16 }) {
  return (
    <SvgIcon size={size}>
      <path
        d="M12 21s6-5.7 6-11a6 6 0 10-12 0c0 5.3 6 11 6 11Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="10"
        r="2.2"
        fill="white"
      />
    </SvgIcon>
  );
}

function CoffeeIcon() {
  return (
    <SvgIcon size={17}>
      <path
        d="M5 7h10v7a4 4 0 01-4 4H9a4 4 0 01-4-4V7Z"
        fill="currentColor"
      />
      <path
        d="M15 9h2a2 2 0 010 4h-2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 3v2M11 3v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function MountainIcon() {
  return (
    <SvgIcon size={17}>
      <path
        d="M3 18l5.2-9L12 14l2.8-5L21 18H3Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function BalloonIcon() {
  return (
    <SvgIcon size={18}>
      <ellipse
        cx="12"
        cy="9"
        rx="5.5"
        ry="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 7h8M9 13h6M10 16l-1 3h6l-1-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function DivingIcon() {
  return (
    <SvgIcon size={18}>
      <rect
        x="3"
        y="7"
        width="7"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="7"
        width="7"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 10h4M7 15c2 2 8 2 10 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function ClockIcon() {
  return (
    <SvgIcon size={18}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function CoinsIcon() {
  return (
    <SvgIcon size={19}>
      <ellipse
        cx="12"
        cy="6"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </SvgIcon>
  );
}

function BoltIcon() {
  return (
    <SvgIcon size={18}>
      <path
        d="M13 2L5 13h6l-1 9 9-13h-6V2Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function UsersIcon() {
  return (
    <SvgIcon size={26}>
      <circle
        cx="8"
        cy="8"
        r="3"
        fill="currentColor"
      />
      <circle
        cx="16"
        cy="8"
        r="3"
        fill="currentColor"
      />
      <path
        d="M3 19c0-3 2.3-5 5-5s5 2 5 5"
        fill="currentColor"
      />
      <path
        d="M11 19c0-3 2.3-5 5-5s5 2 5 5"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function HeartIcon() {
  return (
    <SvgIcon size={26}>
      <path
        d="M12 21S3 15.5 3 9a5 5 0 019-3 5 5 0 019 3c0 6.5-9 12-9 12Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function TagIcon() {
  return (
    <SvgIcon size={25}>
      <path
        d="M4 5h8l8 8-7 7-8-8V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="9"
        r="1.5"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function RouteIcon() {
  return (
    <SvgIcon size={26}>
      <circle
        cx="5"
        cy="17"
        r="3"
        fill="currentColor"
      />
      <circle
        cx="19"
        cy="7"
        r="3"
        fill="currentColor"
      />
      <path
        d="M7.5 15c2.5-5 4-7 9-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </SvgIcon>
  );
}

function ArrowLeftIcon({ size = 20 }) {
  return (
    <SvgIcon size={size}>
      <path
        d="M16 5l-7 7 7 7M9 12h12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

/* =========================================================
   TOPOGRAPHIC LINES
========================================================= */

function TopographicPattern({
  className = "",
  flip = false,
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 480"
      fill="none"
      preserveAspectRatio="none"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <g
        stroke="#C6DFF5"
        strokeWidth="1.2"
        opacity=".66"
      >
        <path d="M-50 71c53-65 123-39 165-59 49-24 71-65 127-45 58 19 75 65 128 80 51 15 96-10 151 24" />
        <path d="M-56 96c59-68 127-39 171-58 53-23 74-60 131-40 58 21 76 66 129 80 52 14 101-10 152 24" />
        <path d="M-59 123c63-67 131-37 176-54 55-21 77-56 133-35 55 21 75 65 130 79 54 14 102-12 152 21" />
        <path d="M-60 151c67-64 134-34 181-50 54-18 80-51 135-29 53 21 75 62 129 76 56 14 104-10 153 19" />

        <path d="M44 271c36-47 82-56 123-42 40 15 59 45 102 49 44 4 69-23 108-17 44 8 67 45 108 56" />
        <path d="M24 299c39-53 88-63 132-47 42 16 61 47 105 51 45 5 72-23 114-15 45 9 68 45 109 59" />
        <path d="M3 328c43-59 95-68 144-50 44 17 63 47 110 53 45 5 73-21 117-11 47 11 69 45 111 60" />

        <path d="M50 408c47-45 100-40 141-13 36 24 54 51 97 54 42 2 66-24 102-26 44-2 72 31 113 37" />
        <path d="M29 437c52-52 111-46 152-15 37 27 56 54 100 57 44 3 69-26 109-26 45 1 74 34 113 39" />
      </g>
    </svg>
  );
}

/* =========================================================
   PALM DECORATION
========================================================= */

function PalmDecoration({
  className = "",
  flip = false,
}) {
  return (
    <svg
      viewBox="0 0 310 250"
      className={className}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="#07557E"
        strokeLinecap="round"
        opacity=".96"
      >
        <path
          d="M3 249C71 200 116 137 145 42"
          strokeWidth="7"
        />

        <path
          d="M140 55C99 26 57 15 14 15"
          strokeWidth="7"
        />
        <path
          d="M134 77C90 56 49 52 6 62"
          strokeWidth="7"
        />
        <path
          d="M126 100C82 93 42 103 6 124"
          strokeWidth="7"
        />
        <path
          d="M114 128C74 132 41 151 12 178"
          strokeWidth="7"
        />
        <path
          d="M101 157C68 171 42 195 24 225"
          strokeWidth="7"
        />

        <path
          d="M146 42C177 27 208 19 250 21"
          strokeWidth="7"
        />
        <path
          d="M142 65C186 55 224 60 277 82"
          strokeWidth="7"
        />
        <path
          d="M136 92C184 92 229 107 296 142"
          strokeWidth="7"
        />
        <path
          d="M126 120C171 133 216 159 275 207"
          strokeWidth="7"
        />
      </g>
    </svg>
  );
}

/* =========================================================
   PROCESS BAR
========================================================= */

const processSteps = [
  {
    title: "خطة ذكية",
    icon: <PlanIcon />,
  },
  {
    title: "إقامة",
    icon: <BedIcon />,
  },
  {
    title: "أنشطة",
    icon: <StarIcon />,
  },
  {
    title: "تنقل",
    icon: <CarIcon />,
  },
  {
    title: "متابعة مباشرة",
    icon: <ChartIcon />,
  },
];

function ProcessStep({
  step,
  last,
}) {
  return (
    <>
      <div
        className="
          flex h-[55px] min-w-[145px]
          items-center justify-center gap-3
          rounded-[24px]
          bg-white
          px-4
          shadow-[0_7px_24px_rgba(50,92,133,.07)]
        "
      >
        <span className="text-[14px] font-extrabold text-[#1B3B68]">
          {step.title}
        </span>

        <span
          className="
            flex h-[43px] w-[43px]
            items-center justify-center
            rounded-full
            bg-[#E6F4FF]
            text-[#139CF1]
          "
        >
          {step.icon}
        </span>
      </div>

      {!last && (
        <div className="hidden shrink-0 text-[#129CF1] lg:block">
          <ArrowLeftIcon size={23} />
        </div>
      )}
    </>
  );
}

/* =========================================================
   CHIP
========================================================= */

function FeatureChip({
  children,
  icon,
}) {
  return (
    <span
      className="
        inline-flex h-[38px]
        items-center gap-2
        rounded-full
        bg-[#EFF8FF]
        px-4
        text-[12px] font-bold
        text-[#6880A0]
      "
    >
      {children}

      <span className="text-[#139CF1]">
        {icon}
      </span>
    </span>
  );
}

/* =========================================================
   STAT ITEM
========================================================= */

function StatItem({
  icon,
  iconColor,
  value,
  title,
  subtitle,
  last = false,
}) {
  return (
    <div
      className={`
        relative flex flex-1 flex-col items-center justify-center
        px-3 text-center
        ${!last ? "after:absolute after:left-0 after:top-[12%] after:h-[76%] after:w-px after:bg-[#DAE8F3]" : ""}
      `}
    >
      <div
        className="mb-2"
        style={{ color: iconColor }}
      >
        {icon}
      </div>

      {value && (
        <p className="text-[14px] font-black text-[#102F5C]">
          {value}
        </p>
      )}

      <p className="mt-[3px] text-[12px] font-bold text-[#183B68]">
        {title}
      </p>

      <p className="mt-[4px] text-[10px] leading-[1.5] text-[#8295AE]">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  image,
  title,
  description,
  mainIcon,
  mainIconBg,
  mainIconColor,
  chips,
  stats,
  action,
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[22px]
        bg-white
        shadow-[0_12px_34px_rgba(41,89,129,.08)]
        transition-all duration-300
        hover:-translate-y-[4px]
        hover:shadow-[0_20px_45px_rgba(41,89,129,.13)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-[218px] overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-[1.035]
          "
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/12 to-transparent" />

        <div
          className="
            absolute left-[14px] top-[13px]
            flex items-center gap-2
            rounded-full
            bg-[#3B536F]/85
            px-3 py-[7px]
            text-[11px] font-bold text-white
            backdrop-blur-[5px]
          "
        >
          <LocationIcon size={14} />
          <span>مصر</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-[21px] pb-[15px] pt-[17px]">
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-[60px] w-[60px]
              shrink-0 items-center justify-center
              rounded-full
            "
            style={{
              backgroundColor: mainIconBg,
              color: mainIconColor,
            }}
          >
            {mainIcon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[20px] font-black text-[#0C2B58]">
              {title}
            </h3>

            <p className="mt-[7px] min-h-[49px] text-[12px] font-medium leading-[1.9] text-[#778BA7]">
              {description}
            </p>
          </div>
        </div>

        {/* CHIPS */}
        <div className="mt-[14px] flex flex-wrap gap-[8px]">
          {chips.map((chip) => (
            <FeatureChip
              key={chip.label}
              icon={chip.icon}
            >
              {chip.label}
            </FeatureChip>
          ))}
        </div>

        {/* STATS */}
        <div
          className="
            mt-[15px]
            flex min-h-[104px]
            rounded-[14px]
            border border-[#E0ECF5]
            bg-[#FBFDFF]
            px-1 py-3
          "
        >
          {stats.map((stat, index) => (
            <StatItem
              key={stat.title}
              {...stat}
              last={index === stats.length - 1}
            />
          ))}
        </div>

        {/* ACTION */}
        <a
          href="#"
          className="
            mt-[16px]
            inline-flex items-center gap-2
            text-[14px] font-black
            text-[#0798F0]
            transition-all duration-200
            hover:gap-3
          "
        >
          <span>{action}</span>
          <ArrowLeftIcon size={19} />
        </a>
      </div>
    </article>
  );
}

/* =========================================================
   DATA
========================================================= */

const cards = [
  {
    image: transportImage,

    title: "تنقلك أثناء الرحلة",

    description:
      "احصل على أفضل وسيلة انتقال بين محطات يومك مع الوقت والتكلفة التقديرية.",

    mainIcon: <CarIcon size={31} />,
    mainIconBg: "#E6F4FF",
    mainIconColor: "#159CF2",

    chips: [
      {
        label: "أسرع مسار",
        icon: <BoltIcon />,
      },
      {
        label: "تكلفة أقل",
        icon: <CoinsIcon />,
      },
      {
        label: "وصول في الوقت",
        icon: <ClockIcon />,
      },
    ],

    stats: [
      {
        icon: <ClockIcon />,
        iconColor: "#159CF2",
        value: "30 - 120 دقيقة",
        title: "الوقت المتوقع",
        subtitle: "",
      },
      {
        icon: <CoinsIcon />,
        iconColor: "#159CF2",
        value: "250 - 600 ج.م",
        title: "التكلفة التقديرية",
        subtitle: "",
      },
      {
        icon: <RouteIcon />,
        iconColor: "#10C5A2",
        title: "مسار محسن",
        subtitle: "أذكى الطرق",
      },
    ],

    action: "استكشف التنقل",
  },

  {
    image: experiencesImage,

    title: "التجارب والأنشطة",

    description:
      "اكتشف أنشطة تناسب اهتماماتك وتحول رحلتك إلى تجربة لا تُنسى.",

    mainIcon: <BinocularIcon size={32} />,
    mainIconBg: "#E4FAF4",
    mainIconColor: "#0FC3A2",

    chips: [
      {
        label: "رحلة نيلية",
        icon: (
          <span className="text-[15px]">
            ⛵
          </span>
        ),
      },
      {
        label: "منطاد",
        icon: <BalloonIcon />,
      },
      {
        label: "سفاري",
        icon: <MountainIcon />,
      },
      {
        label: "غوص",
        icon: <DivingIcon />,
      },
    ],

    stats: [
      {
        icon: <StarIcon size={25} />,
        iconColor: "#FFAE00",
        value: "4.9",
        title: "تقييم التجارب",
        subtitle: "",
      },
      {
        icon: <HeartIcon />,
        iconColor: "#FF4C56",
        value: "+18K",
        title: "مسافر سعيد",
        subtitle: "",
      },
      {
        icon: <UsersIcon />,
        iconColor: "#0BC8A4",
        title: "حجز سهل",
        subtitle: "خلال دقائق",
      },
    ],

    action: "اكتشف التجارب",
  },

  {
    image: hotelsImage,

    title: "الفنادق والإقامات",

    description:
      "اختر مكان إقامتك حسب موقع خطتك وميزانيتك.",

    mainIcon: <BedIcon size={32} />,
    mainIconBg: "#E7F4FF",
    mainIconColor: "#159CF2",

    chips: [
      {
        label: "قريب من المعالم",
        icon: <LocationIcon size={17} />,
      },
      {
        label: "إفطار",
        icon: <CoffeeIcon />,
      },
      {
        label: "أفضل تقييم",
        icon: <StarIcon size={17} />,
      },
    ],

    stats: [
      {
        icon: <LocationIcon size={25} />,
        iconColor: "#159CF2",
        title: "مواقع مميزة",
        subtitle: "بالقرب من خطتك",
      },
      {
        icon: <StarIcon size={25} />,
        iconColor: "#FFAE00",
        value: "4.8",
        title: "متوسط التقييم",
        subtitle: "",
      },
      {
        icon: <TagIcon />,
        iconColor: "#159CF2",
        value: "350 ج.م",
        title: "يبدأ من",
        subtitle: "ليلة واحدة",
      },
    ],

    action: "استكشف الفنادق",
  },
];

/* =========================================================
   HANDWRITTEN SIDE TEXT
========================================================= */

function HandwrittenNote({
  children,
  className = "",
}) {
  return (
    <div
      className={`absolute hidden xl:block ${className}`}
    >
      <p
        className="
          text-center
          text-[17px]
          font-medium
          leading-[1.65]
          text-[#67809F]
        "
        style={{
          fontFamily:
            "'Segoe Print','Comic Sans MS',cursive",
        }}
      >
        {children}
      </p>

      <svg
        width="112"
        height="22"
        viewBox="0 0 112 22"
        className="mx-auto mt-[5px]"
      >
        <path
          d="M5 18C35 8 68 4 107 6"
          stroke="#129CF2"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Section_4() {
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
      {/* =================================================
          DECORATIVE TOPOGRAPHY
      ================================================= */}

      <TopographicPattern
        className="
          pointer-events-none
          absolute -left-[120px] -top-[65px]
          h-[470px] w-[470px]
        "
      />

      <TopographicPattern
        flip
        className="
          pointer-events-none
          absolute -right-[120px] -top-[65px]
          h-[470px] w-[470px]
        "
      />

      <TopographicPattern
        className="
          pointer-events-none
          absolute -bottom-[170px] left-[7%]
          h-[450px] w-[450px]
          opacity-50
        "
      />

      <TopographicPattern
        flip
        className="
          pointer-events-none
          absolute -bottom-[160px] right-[16%]
          h-[450px] w-[450px]
          opacity-45
        "
      />

      {/* =================================================
          SIDE NOTES
      ================================================= */}

      <HandwrittenNote className="left-[4.7%] top-[79px] -rotate-[7deg]">
        كل تفاصيلك
        <br />
        في مكان واحد
      </HandwrittenNote>

      <HandwrittenNote className="right-[3.7%] top-[91px] rotate-[5deg]">
        رحلة أسهل
        <br />
        تبدأ من هنا
      </HandwrittenNote>

      {/* =================================================
          PALMS
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute -bottom-[25px] -right-[58px]
          hidden h-[205px] w-[250px]
          xl:block
        "
      >
        <PalmDecoration flip />
      </div>

      {/* =================================================
          LOGO BOTTOM LEFT
      ================================================= */}

      <div
        className="
          absolute bottom-[31px] left-[3.5%]
          hidden xl:block
        "
      >
        <p className="text-[18px] font-black text-[#7187A5]">
          Travora
        </p>

        <p className="mt-[1px] text-[10px] font-medium text-[#8FA4BE]">
          More Than a Destination
        </p>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative z-10
          mx-auto
          max-w-[1470px]
          px-4
          pb-[30px]
          pt-[34px]
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mx-auto max-w-[960px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[16px] font-black text-[#0CBCA5]">
              خدمات الرحلة المتكاملة
            </span>

            <span className="text-[#139CF2]">
              <SparkleIcon size={25} />
            </span>
          </div>

          <h2
            className="
              mt-[8px]
              text-[32px]
              font-black
              leading-[1.28]
              tracking-[-1.3px]
              text-[#0A2854]
              sm:text-[40px]
              lg:text-[46px]
            "
          >
            كل ما تحتاجه لرحلتك{" "}
            <span
              className="
                bg-gradient-to-l
                from-[#079CEB]
                to-[#12C6AE]
                bg-clip-text
                text-transparent
              "
            >
              في مكان واحد
            </span>
          </h2>

          <p
            className="
              mt-[11px]
              text-[15px]
              font-semibold
              leading-[1.9]
              text-[#7689A7]
              sm:text-[17px]
            "
          >
            من التخطيط إلى الإقامة والأنشطة والتنقل، يمنحك Travora تجربة سفر
            متكاملة وسهلة.
          </p>
        </header>

        {/* =================================================
            PROCESS BAR
        ================================================= */}

        <div
          className="
            mx-auto
            mt-[25px]
            flex
            max-w-[1050px]
            flex-wrap
            items-center
            justify-center
            gap-[13px]
            lg:flex-nowrap
          "
        >
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.title}
              step={step}
              last={index === processSteps.length - 1}
            />
          ))}
        </div>

        {/* =================================================
            CARDS
        ================================================= */}

        <div
          dir="ltr"
          className="
            mx-auto
            mt-[29px]
            grid
            max-w-[1460px]
            grid-cols-1
            gap-[20px]
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {cards.map((card) => (
            <div
              dir="rtl"
              key={card.title}
            >
              <ServiceCard {...card} />
            </div>
          ))}
        </div>

        {/* =================================================
            CTA
        ================================================= */}

        <div className="mt-[22px] flex flex-col items-center">
          <button
            type="button"
            className="
              flex h-[63px]
              min-w-[370px]
              items-center
              justify-center
              gap-8
              rounded-[20px]
              bg-gradient-to-l
              from-[#087DF2]
              to-[#16A8EF]
              px-9
              text-[16px]
              font-black
              text-white
              shadow-[0_11px_28px_rgba(14,141,232,.20)]
              transition-all duration-200
              hover:-translate-y-[2px]
              hover:shadow-[0_16px_34px_rgba(14,141,232,.28)]
              max-sm:min-w-0
              max-sm:w-full
            "
          >
            <span className="text-[22px]">
              ←
            </span>

            <span>
              ابدأ رحلتك الكاملة الآن
            </span>

            <SparkleIcon size={20} />
          </button>

          <p
            className="
              mt-[12px]
              text-center
              text-[12px]
              font-semibold
              text-[#7488A5]
            "
          >
            كل تفاصيل رحلتك في منصة واحدة — أبسط، أذكى، وأكثر راحة.
          </p>
        </div>
      </div>
    </section>
  );
}