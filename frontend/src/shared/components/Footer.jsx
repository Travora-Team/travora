import heroImage from "../../assets/footer/travora-footer-hero.webp";

/* =========================================================
   BASE SVG ICON
========================================================= */

function Icon({ children, size = 22, viewBox = "0 0 24 24", className = "" }) {
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

function LinkIcon() {
  return (
    <Icon>
      <path
        d="M10.2 13.8L13.8 10.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.1 16.7L6.6 18.2a3.25 3.25 0 01-4.6-4.6l3.2-3.2a3.25 3.25 0 014.6 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.9 7.3l1.5-1.5a3.25 3.25 0 014.6 4.6l-3.2 3.2a3.25 3.25 0 01-4.6 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function SettingsIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21H9.6v-.1A1.7 1.7 0 008.5 19.3a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.1 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H2.3V9.6h.1A1.7 1.7 0 004 8.5a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 008.4 4.1a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V2.3h4v.1A1.7 1.7 0 0015 4a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.9 8.4a1.7 1.7 0 00.6 1 1.7 1.7 0 001.1.4h.1v4h-.1a1.7 1.7 0 00-1.6 1.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function HeadsetIcon() {
  return (
    <Icon>
      <path
        d="M4 13v-1a8 8 0 0116 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="3" y="12" width="4" height="7" rx="2" fill="currentColor" />
      <rect x="17" y="12" width="4" height="7" rx="2" fill="currentColor" />
      <path
        d="M19 19c0 1.2-1 2-2.3 2H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function MailIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function PhoneIcon() {
  return (
    <Icon size={18}>
      <path
        d="M7.1 3.5l2 4-2.1 1.6c1.1 2.7 3.2 4.8 5.9 5.9l1.6-2.1 4 2c.4.2.6.6.5 1.1l-.5 3a2 2 0 01-2 1.7C9.2 20.7 3.3 14.8 3.3 7.5a2 2 0 011.7-2l3-.5c.5-.1.9.1 1.1.5z"
        fill="currentColor"
      />
    </Icon>
  );
}

function PinIcon() {
  return (
    <Icon size={18}>
      <path
        d="M12 21s6-5.7 6-11a6 6 0 10-12 0c0 5.3 6 11 6 11z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.3" fill="white" />
    </Icon>
  );
}

function TelegramIcon() {
  return (
    <Icon size={30}>
      <path
        d="M21 4L3.9 10.6c-1.16.47-1.15 1.12-.21 1.41l4.39 1.37 1.7 5.3c.2.55.1.77.68.77.44 0 .64-.2.89-.44l2.13-2.07 4.43 3.27c.82.45 1.4.22 1.6-.76L22.4 5.9C22.7 4.7 21.94 4.16 21 4z"
        fill="currentColor"
      />
    </Icon>
  );
}

function ArrowLeftIcon() {
  return (
    <Icon size={18}>
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function SparkleIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 1c.6 8.7 5.5 13.6 14 15-8.5 1.4-13.4 6.3-14 15-.6-8.7-5.5-13.6-14-15C10.5 14.6 15.4 9.7 16 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================================================
   SOCIAL SVG
========================================================= */

function InstagramIcon() {
  return (
    <Icon size={21}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.6" cy="6.5" r="1.1" fill="currentColor" />
    </Icon>
  );
}

function XIcon() {
  return (
    <Icon size={18}>
      <path
        d="M5 4l14 16M19 4L5 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22">
      <path
        d="M11.4 21V12.8h2.8l.42-3.2H11.4V7.55c0-.93.27-1.56 1.61-1.56h1.72V3.13a22.5 22.5 0 00-2.5-.13C9.76 3 8.08 4.45 8.08 7.1v2.5H5.3v3.2h2.78V21h3.32Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <Icon size={20}>
      <rect x="2" y="5" width="20" height="14" rx="5" fill="currentColor" />
      <path d="M10 9l6 3-6 3V9z" fill="white" />
    </Icon>
  );
}

/* =========================================================
   TRAVORA LOGO - VECTOR
========================================================= */

function TravoraLogo() {
  return (
    <div
      className="flex items-center gap-3"
      aria-label="Travora"
    >
      <svg
        width="76"
        height="72"
        viewBox="0 0 90 78"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="travoraLogoGradient"
            x1="8"
            y1="4"
            x2="78"
            y2="72"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#17D1D5" />
            <stop offset=".55" stopColor="#08ACE7" />
            <stop offset="1" stopColor="#0C73E8" />
          </linearGradient>
        </defs>

        <path
          d="M5 50C14 29 23 9 32 3c8 8 13 19 17 30 5-8 10-14 17-17 7 7 12 17 19 31-10-7-20-9-29-7-10 2-17 8-24 14-8-4-17-5-27-4Z"
          fill="url(#travoraLogoGradient)"
        />

        <path
          d="M4 58c15-9 28-7 39-1 10 6 20 6 39-3-8 14-18 19-29 18-10 0-17-7-26-8-7-1-14 1-23 7 0-4 0-8 0-13Z"
          fill="url(#travoraLogoGradient)"
        />

        <path
          d="M61 9l7 4 8-3-4 7 3 7-7-3-7 3 4-7-4-8Z"
          fill="#1687DE"
        />
      </svg>

      <div className="text-left" dir="ltr">
        <div className="text-[37px] font-black leading-none tracking-[-1.8px] text-[#102F61]">
          Travora
        </div>

        <div className="mt-1 text-[10px] font-semibold tracking-[0.2px] text-[#46628D]">
          More Than a Destination
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TOPOGRAPHIC BACKGROUND
========================================================= */

function TopographicPattern({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 500"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#A9CEF2" strokeWidth="1.2" opacity=".58">
        <path d="M-40 82c55-71 130-39 169-60 49-26 65-69 123-52 61 18 77 74 133 93 56 18 102-13 161 23" />
        <path d="M-47 104c63-69 128-35 174-56 52-23 70-59 122-42 61 21 77 77 132 93 59 17 108-16 165 24" />
        <path d="M-50 127c68-67 133-33 179-51 53-21 75-54 127-34 56 22 72 77 129 91 60 15 110-18 163 23" />
        <path d="M-54 150c70-63 135-30 183-46 56-18 79-48 130-27 53 23 69 75 124 88 63 15 112-17 168 20" />

        <path d="M54 279c31-46 80-57 119-43 39 15 57 48 99 49 41 2 69-27 109-20 45 8 71 51 109 59" />
        <path d="M34 302c34-52 88-63 133-46 40 16 59 48 102 51 44 3 72-27 113-18 45 10 68 49 112 62" />
        <path d="M17 328c40-59 96-69 148-49 41 16 61 46 105 51 47 5 74-25 118-14 47 12 70 49 111 62" />

        <path d="M64 422c47-47 103-42 142-13 34 24 52 55 94 56 42 2 65-28 103-29 43-1 72 35 113 38" />
        <path d="M45 445c50-51 111-47 153-14 35 27 53 57 98 59 43 2 70-30 110-29 43 2 70 36 111 41" />
      </g>
    </svg>
  );
}

/* =========================================================
   PALM SVG
========================================================= */

function PalmLeaves({ className = "", flip = false }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="#87B4DD"
        strokeWidth="7"
        strokeLinecap="round"
        opacity=".72"
      >
        <path d="M1 299C74 224 117 153 142 48" />

        <path d="M136 68C88 43 54 26 11 18" />
        <path d="M128 92C79 80 43 77 2 84" />
        <path d="M118 120C77 121 39 135 5 154" />
        <path d="M104 150C68 163 40 185 14 217" />
        <path d="M89 179C57 202 37 228 22 261" />

        <path d="M142 50C173 34 201 20 237 15" />
        <path d="M138 75C182 65 219 67 270 79" />
        <path d="M130 105C174 106 220 120 281 151" />
        <path d="M119 137C159 152 204 178 258 226" />
        <path d="M104 165C139 190 170 223 198 270" />
      </g>
    </svg>
  );
}

/* =========================================================
   AIRPLANE PATH
========================================================= */

function AirplaneDecoration() {
  return (
    <svg
      viewBox="0 0 340 130"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 106C96 102 161 84 224 52C255 36 277 27 309 24"
        stroke="white"
        strokeOpacity=".6"
        strokeWidth="4"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />

      <g
        transform="translate(283 4) rotate(-13)"
        fill="#4E91D0"
      >
        <path d="M4 14l47 13-47 13 8-11-10-4 10-4-8-7Z" />
        <path d="M19 25L7 3l8 3 17 18-13 1Z" />
        <path d="M19 29L7 51l8-3 17-18-13-1Z" />
      </g>
    </svg>
  );
}

/* =========================================================
   MOUNTAIN DRAWING
========================================================= */

function MountainSketch() {
  return (
    <svg
      viewBox="0 0 270 100"
      className="h-[78px] w-full"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#92BDEA" strokeWidth="2" strokeLinecap="round">
        <path d="M15 75l30-27 18 13 33-42 44 52 29-25 32 29" />
        <path d="M4 82c45-6 80-4 114-2 45 3 86 2 133-5" />
        <path d="M182 71c-1-15 0-24 0-34M170 47c10-2 18 2 24 9M194 47c-9-1-17 2-23 9" />
      </g>
    </svg>
  );
}

/* =========================================================
   FOOTER DATA
========================================================= */

const quickLinks = [
  "الرئيسية",
  "اكتشف الوجهات",
  "رحلاتي",
  "الفنادق",
  "عنا",
];

const services = [
  "التخطيط الذكي",
  "الفنادق والإقامات",
  "التجارب والأنشطة",
  "التنقل أثناء الرحلة",
  "المتابعة المباشرة",
];

/* =========================================================
   SECTION TITLE
========================================================= */

function FooterTitle({ icon, children }) {
  return (
    <div className="mb-6 flex items-center justify-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4F2FF] text-[#0D8FE9]">
        {icon}
      </div>

      <h3 className="text-[18px] font-black text-[#082A5B]">
        {children}
      </h3>
    </div>
  );
}

/* =========================================================
   LINK LIST
========================================================= */

function FooterLinks({ items }) {
  return (
    <nav>
      <ul className="space-y-[22px]">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="group flex items-center justify-between text-[16px] font-medium text-[#183B6B] transition-colors duration-200 hover:text-[#079CF0]"
            >
              <span>{item}</span>

              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                <ArrowLeftIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({ children, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="
        flex h-[48px] w-[48px]
        items-center justify-center
        rounded-full
        bg-[#E6F2FF]
        text-[#0C3D78]
        transition-all duration-200
        hover:-translate-y-1
        hover:bg-[#D5EBFF]
        hover:text-[#098FE4]
      "
    >
      {children}
    </a>
  );
}

/* =========================================================
   HERO CTA
========================================================= */

function TravelCTA() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/90 bg-[#DFF3FF] shadow-[0_18px_55px_rgba(46,110,168,0.09)]">
      {/* Optimized single WEBP image */}
      <img
        src={heroImage}
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* white central haze - CSS only */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.55)_27%,rgba(255,255,255,0.88)_48%,rgba(255,255,255,0.76)_66%,rgba(255,255,255,0.05)_100%)]
        "
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />

      {/* airplane */}
      <div className="pointer-events-none absolute right-[7%] top-2 hidden h-[125px] w-[320px] lg:block">
        <AirplaneDecoration />
      </div>

      {/* left handwritten note */}
      <div className="absolute left-[6.5%] top-[75px] hidden -rotate-[7deg] text-center lg:block">
        <p
          className="text-[19px] leading-[1.65] text-[#173E70]"
          style={{
            fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
          }}
        >
          عالم أحلى
          <br />
          في انتظارك القادمة
        </p>

        <svg
          width="88"
          height="18"
          viewBox="0 0 88 18"
          className="mx-auto mt-1"
        >
          <path
            d="M3 15C32 3 51 2 85 4"
            stroke="#0A96F3"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* right handwritten note */}
      <div className="absolute right-[5%] top-[80px] hidden rotate-[5deg] text-center lg:block">
        <p
          className="text-[18px] leading-[1.6] text-[#173E70]"
          style={{
            fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
          }}
        >
          رحلات
          <br />
          تصنع قصصًا أجمل
        </p>

        <svg
          width="42"
          height="15"
          viewBox="0 0 42 15"
          className="mx-auto mt-1"
        >
          <path
            d="M3 12C17 6 27 5 39 4"
            stroke="#0A96F3"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* CTA content */}
      <div className="relative z-10 flex min-h-[360px] items-center justify-center px-5 py-9 sm:min-h-[365px] md:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          {/* badge */}
          <div className="mb-5 flex items-center justify-center gap-5">
            <span className="hidden h-[2px] w-[42px] bg-[#199FEF] sm:block" />

            <span className="rounded-full bg-[#D5EBFF]/90 px-7 py-[9px] text-[15px] font-bold text-[#113E75] backdrop-blur-[2px]">
              جاهز لرحلة تشبهك؟
            </span>

            <span className="hidden h-[2px] w-[42px] bg-[#199FEF] sm:block" />
          </div>

          <h2 className="text-[34px] font-black leading-[1.25] tracking-[-1.4px] text-[#092E61] sm:text-[42px] lg:text-[52px]">
            ابدأ التخطيط الذكي لرحلتك الآن
          </h2>

          <p className="mx-auto mt-4 max-w-[750px] text-[16px] font-medium leading-[1.9] text-[#21446F] sm:text-[18px]">
            أخبرنا بما تحب، ودع Travora يبني لك رحلة تناسب وقتك وميزانيتك
            واهتماماتك.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#plan"
              className="
                flex h-[67px] min-w-[295px]
                items-center justify-center gap-4
                rounded-[24px]
                bg-gradient-to-l
                from-[#1877F2]
                via-[#128EEA]
                to-[#17B9E5]
                px-8
                text-[20px] font-black text-white
                shadow-[0_12px_28px_rgba(25,126,228,0.21)]
                transition-all duration-200
                hover:-translate-y-1
                hover:shadow-[0_17px_35px_rgba(25,126,228,0.28)]
              "
            >
              <SparkleIcon size={23} />
              <span>ابدأ تخطيط رحلتي</span>
            </a>

            <a
              href="#destinations"
              className="
                flex h-[62px] min-w-[210px]
                items-center justify-center gap-4
                rounded-[20px]
                border border-[#8DBBEA]
                bg-white/50
                px-7
                text-[17px] font-black text-[#0C376E]
                backdrop-blur-[4px]
                transition-all duration-200
                hover:bg-white/80
              "
            >
              <span>اكتشف الوجهات</span>
              <ArrowLeftIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   NEWSLETTER
========================================================= */

function Newsletter() {
  return (
    <section
      className="
        relative overflow-hidden rounded-[25px]
        border border-[#D9EAF9]
        bg-white/55
        px-6 pb-5 pt-7
        shadow-[0_13px_40px_rgba(70,118,166,0.05)]
        backdrop-blur-sm
      "
    >
      <div className="flex items-start gap-4">
        <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[21px] bg-[#E2F2FF] text-[#0795E7]">
          <TelegramIcon />
        </div>

        <div>
          <h3 className="text-[19px] font-black text-[#092E60]">
            ابقَ على اطلاع بأفضل الرحلات
          </h3>

          <p className="mt-2 text-[13px] font-medium leading-[1.8] text-[#547299]">
            نصائح سفر، وجهات ملهمة، وتحديثات ذكية
            <br className="hidden xl:block" />
            من Travora
          </p>
        </div>
      </div>

      <form
        className="mt-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="flex h-[51px] items-center rounded-[15px] border border-[#B9D9F5] bg-white/65 px-4">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            aria-label="البريد الإلكتروني"
            className="
              h-full min-w-0 flex-1
              border-none bg-transparent
              text-[14px] text-[#183B69]
              outline-none
              placeholder:text-[#90A7C2]
            "
          />

          <span className="text-[#7298C0]">
            <MailIcon size={18} />
          </span>
        </label>

        <button
          type="submit"
          className="
            mt-3 h-[50px] w-full
            rounded-[15px]
            bg-gradient-to-l from-[#087AED] to-[#17A9EE]
            text-[16px] font-black text-white
            shadow-[0_9px_18px_rgba(22,137,231,0.17)]
            transition-transform duration-200
            hover:-translate-y-[2px]
          "
        >
          اشترك
        </button>
      </form>

      <div className="mt-7">
        <MountainSketch />

        <p
          className="-mt-4 pr-24 text-[13px] leading-[1.8] text-[#7998BB]"
          style={{
            fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
          }}
        >
          مغامرات أفضل
          <br />
          تبدأ من هنا ..
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function ContactSection() {
  return (
    <section className="h-full border-[#D7E8F6] lg:border-l lg:pl-6">
      <FooterTitle icon={<HeadsetIcon />}>
        تواصل معنا
      </FooterTitle>

      <div className="space-y-5 text-[15px] text-[#153965]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="block font-medium">البريد:</span>
            <a
              href="mailto:hello@travora.com"
              className="mt-1 block font-semibold hover:text-[#0799EB]"
            >
              hello@travora.com
            </a>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F2FF] text-[#158DE1]">
            <MailIcon />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="block font-medium">الهاتف:</span>
            <a
              href="tel:+201000000000"
              dir="ltr"
              className="mt-1 block font-semibold hover:text-[#0799EB]"
            >
              +20 100 000 0000
            </a>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F2FF] text-[#158DE1]">
            <PhoneIcon />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-medium">
            القاهرة، مصر
          </span>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F2FF] text-[#158DE1]">
            <PinIcon />
          </div>
        </div>
      </div>

      <div className="my-7 h-px bg-[#D5E7F6]" />

      <div
        dir="ltr"
        className="flex gap-3"
      >
        <SocialButton label="Instagram">
          <InstagramIcon />
        </SocialButton>

        <SocialButton label="X">
          <XIcon />
        </SocialButton>

        <SocialButton label="Facebook">
          <FacebookIcon />
        </SocialButton>

        <SocialButton label="YouTube">
          <YouTubeIcon />
        </SocialButton>
      </div>
    </section>
  );
}

/* =========================================================
   BRAND SECTION
========================================================= */

function BrandSection() {
  return (
    <section className="h-full border-[#D7E8F6] lg:border-r lg:pr-7">
      <TravoraLogo />

      <p className="mt-7 max-w-[255px] text-[15px] font-medium leading-[1.8] text-[#264A76]">
        منصة سياحية ذكية تساعدك على اكتشاف الوجهات، بناء رحلتك، وإعادة ترتيبها
        بذكاء أثناء السفر.
      </p>

      <div className="my-7 h-px bg-[#D1E3F3]" />

      <p
        className="max-w-[250px] rotate-[-5deg] text-[15px] leading-[1.75] text-[#7095BE]"
        style={{
          fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
        }}
      >
        المكان مجرد بداية ..
        <br />
        والقصة تبدأ مع Travora
      </p>

      <svg
        width="76"
        height="20"
        viewBox="0 0 76 20"
        className="mr-16 mt-2"
      >
        <path
          d="M3 17C24 7 43 4 72 3"
          stroke="#63A9E7"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}

/* =========================================================
   MAIN FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="
        relative overflow-hidden
        bg-[#F7FBFF]
        font-['Cairo',Arial,sans-serif]
        text-[#102F5C]
      "
    >
      {/* topographic decorations */}
      <TopographicPattern className="pointer-events-none absolute -left-[90px] -top-[100px] h-[520px] w-[520px]" />

      <TopographicPattern className="pointer-events-none absolute -right-[90px] -top-[100px] h-[520px] w-[520px] scale-x-[-1]" />

      {/* palms */}
      <PalmLeaves className="pointer-events-none absolute -bottom-[90px] -left-[38px] h-[355px] w-[355px]" />

      <PalmLeaves
        flip
        className="pointer-events-none absolute -bottom-[80px] -right-[35px] h-[320px] w-[320px]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-8 pt-[68px] sm:px-6 lg:px-8">
        {/* =================================================
            CTA HERO
        ================================================= */}

        <TravelCTA />

        {/* =================================================
            MAIN FOOTER CONTENT
        ================================================= */}

        <div
          className="
            mt-[38px]
            grid
            grid-cols-1
            gap-10
            md:grid-cols-2
            lg:grid-cols-[1.5fr_1fr_1fr_1.15fr_1.45fr]
            lg:gap-0
          "
        >
          {/* right: brand */}
          <div className="lg:pl-7">
            <BrandSection />
          </div>

          {/* quick links */}
          <section className="border-[#D7E8F6] lg:border-r lg:px-7">
            <FooterTitle icon={<LinkIcon />}>
              روابط سريعة
            </FooterTitle>

            <FooterLinks items={quickLinks} />
          </section>

          {/* services */}
          <section className="border-[#D7E8F6] lg:border-r lg:px-7">
            <FooterTitle icon={<SettingsIcon />}>
              الخدمات
            </FooterTitle>

            <FooterLinks items={services} />
          </section>

          {/* contact */}
          <div className="lg:px-7">
            <ContactSection />
          </div>

          {/* newsletter LEFT */}
          <div className="lg:pr-7">
            <Newsletter />
          </div>
        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================= */}

        <div className="mt-[40px] border-t border-[#D2E5F5] pt-7">
          <div className="flex flex-col-reverse items-center justify-between gap-5 md:flex-row">
            {/* policies - left */}
            <nav className="flex flex-wrap items-center justify-center gap-4 text-[13px] font-semibold text-[#173B68] md:justify-start">
              <a
                href="#privacy"
                className="transition hover:text-[#0798E9]"
              >
                سياسة الخصوصية
              </a>

              <span className="text-[#7C9ABB]">|</span>

              <a
                href="#terms"
                className="transition hover:text-[#0798E9]"
              >
                الشروط والأحكام
              </a>

              <span className="text-[#7C9ABB]">|</span>

              <a
                href="#faq"
                className="transition hover:text-[#0798E9]"
              >
                الأسئلة الشائعة
              </a>
            </nav>

            {/* copyright */}
            <p className="text-center text-[13px] font-semibold text-[#183B68] md:text-right">
              © 2026 Travora. جميع الحقوق محفوظة
            </p>
          </div>

          {/* handwritten bottom text */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[#7397BB]">
            <span className="h-px w-[90px] bg-[#9DBDDA]" />

            <span
              className="text-[14px]"
              style={{
                fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
              }}
            >
              رحلات أذكى .. لحياة أجمل ..
            </span>

            <span className="h-px w-[90px] bg-[#9DBDDA]" />
          </div>
        </div>
      </div>
    </footer>
  );
}