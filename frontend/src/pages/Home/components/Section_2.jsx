import { useEffect, useState } from "react";
import cairoImage from "../../../assets/section2/cairo.webp";
import gizaImage from "../../../assets/section2/giza.webp";
import luxorImage from "../../../assets/section2/luxor.webp";
import sharmImage from "../../../assets/section2/sharm.webp";
import { adminApi, resolveDestinationImage } from "../../../shared/api/adminApi";

/* =========================================================
   SVG Icons
========================================================= */

function GlobeIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="13.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M3.5 17H30.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M17 3.5C20.7 7.2 22.5 11.7 22.5 17C22.5 22.3 20.7 26.8 17 30.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M17 3.5C13.3 7.2 11.5 11.7 11.5 17C11.5 22.3 13.3 26.8 17 30.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="31"
      height="34"
      viewBox="0 0 31 34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15.5 2.5L27 6.4V14.8C27 22.2 22.3 28.1 15.5 31.5C8.7 28.1 4 22.2 4 14.8V6.4L15.5 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 2.8C19.8 11.5 23 15.1 31.2 17.2C23.1 19.2 19.8 22.9 19 31.3C18.1 22.8 14.8 19.2 6.8 17.2C14.9 15.1 18.2 11.5 19 2.8Z"
        fill="currentColor"
      />
      <circle cx="31.5" cy="5.5" r="2.2" fill="#169BFF" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      width="31"
      height="34"
      viewBox="0 0 31 34"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="15.5" cy="10.5" r="6" fill="currentColor" />
      <path
        d="M5.2 27.5C5.2 21.9 9.8 18.5 15.5 18.5C21.2 18.5 25.8 21.9 25.8 27.5V29.2C25.8 30.7 24.6 31.9 23.1 31.9H7.9C6.4 31.9 5.2 30.7 5.2 29.2V27.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path
        d="M7 16C7 16 12.5 10.5 12.5 6.5C12.5 3.46 10.04 1 7 1C3.96 1 1.5 3.46 1.5 6.5C1.5 10.5 7 16 7 16Z"
        fill="white"
      />
      <circle cx="7" cy="6.5" r="2.2" fill="#577493" />
    </svg>
  );
}

function UserSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="5.2" r="3.2" fill="currentColor" />
      <path
        d="M3.2 15C3.2 11.9 5.7 9.7 9 9.7C12.3 9.7 14.8 11.9 14.8 15V15.7H3.2V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect
        x="1.5"
        y="1.5"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SparkleIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2C20.9 12.8 25.6 18 36 20C25.6 22 20.9 27.2 20 38C19.1 27.2 14.4 22 4 20C14.4 18 19.1 12.8 20 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================================================
   Decorative SVG
========================================================= */

function CornerWaves({
  className = "",
  flipX = false,
  flipY = false,
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 330 230"
      fill="none"
      preserveAspectRatio="none"
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <path
          key={item}
          d={`M ${
            -85 - item * 23
          } 220 C 65 220, 135 170, 155 110 C 175 50, 160 -5, 115 -42`}
          stroke="#CFE6F8"
          strokeWidth="1"
          opacity={0.72 - item * 0.08}
        />
      ))}
    </svg>
  );
}

function SideUnderline() {
  return (
    <svg
      width="98"
      height="18"
      viewBox="0 0 98 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 3C24 7 49 10 96 16"
        stroke="#169BF5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BluePalmDecoration() {
  return (
    <svg
      viewBox="0 0 180 210"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 89C36 77 80 77 128 87C93 89 63 96 29 116C64 108 97 110 141 122C98 127 66 139 35 158C75 145 111 145 158 163C116 165 79 179 48 207H0V89Z"
        fill="#086493"
      />

      <path
        d="M5 90C50 82 84 84 123 90"
        stroke="#07537A"
        strokeWidth="2"
        opacity=".4"
      />
    </svg>
  );
}

/* =========================================================
   DATA
========================================================= */

const benefits = [
  {
    title: "اكتشف العالم",
    description: "أكثر من 1000 وجهة حول العالم",
    icon: <GlobeIcon />,
    iconColor: "#159CF6",
    background: "#E5F3FF",
  },
  {
    title: "تجارب موثوقة",
    description: "مراجعات حقيقية من مسافرين مثلك",
    icon: <ShieldIcon />,
    iconColor: "#12B9A7",
    background: "#E5F8F5",
  },
  {
    title: "مدعوم بالذكاء الاصطناعي",
    description: "خطط أذكى لرحلات أفضل",
    icon: <AiIcon />,
    iconColor: "#13BDB7",
    background: "#E6FAF7",
  },
  {
    title: "رحلات مخصصة لك",
    description: "تجارب تناسب اهتماماتك وميزانيتك",
    icon: <PersonIcon />,
    iconColor: "#159CF6",
    background: "#E3F2FF",
  },
];

const defaultDestinations = [
  {
    id: "cairo",
    slug: "cairo",
    title: "القاهرة",
    nameEn: "Cairo",
    country: "مصر",
    image: cairoImage,
    tags: "ثقافة • تاريخ • حياة عصرية",
    description:
      "عاصمة لا تنام تجمع بين عراقة التاريخ وحيوية الحاضر على ضفاف النيل.",
    category: "معالم",
    visitors: "+12K",
    rating: "4.8",
    cta: "استكشف الآن",
    hotelsCount: 1,
    activitiesCount: 0,
  },
  {
    id: "giza",
    slug: "giza",
    title: "الجيزة",
    nameEn: "Giza",
    country: "مصر",
    image: gizaImage,
    tags: "آثار • مغامرة • استكشاف",
    description:
      "استكشف أهرامات الجيزة العظيمة، إحدى عجائب العالم حيث يلتقي التاريخ بالدهشة.",
    category: "معالم",
    visitors: "+18K",
    rating: "4.9",
    cta: "استكشف الآن",
    hotelsCount: 0,
    activitiesCount: 0,
  },
  {
    id: "luxor",
    slug: "luxor",
    title: "الأقصر",
    nameEn: "Luxor",
    country: "مصر",
    image: luxorImage,
    tags: "حضارة • معابد • تاريخ",
    description:
      "متحف مفتوح في قلب الصعيد، حيث تعيش الحضارة الفرعونية في كل زاوية.",
    category: "معالم",
    visitors: "+10K",
    rating: "4.7",
    cta: "استكشف الآن",
    hotelsCount: 0,
    activitiesCount: 0,
  },
  {
    id: "sharm-el-sheikh",
    slug: "sharm-el-sheikh",
    title: "شرم الشيخ",
    nameEn: "Sharm El-Sheikh",
    country: "مصر",
    image: sharmImage,
    tags: "شاطئ • غوص • استرخاء",
    description:
      "البحر الأحمر بتجاربه التي لا تُنسى بين الشعاب المرجانية والمياه الفيروزية.",
    category: "معالم",
    visitors: "+14K",
    rating: "4.8",
    cta: "استكشف الآن",
    hotelsCount: 0,
    activitiesCount: 1,
  },
];

function mapDbDestination(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.name_ar,
    nameEn: row.name_en,
    country: row.country_label_ar || "مصر",
    image: resolveDestinationImage(row.image_url, row.slug),
    tags: row.tags_ar || "ثقافة • تاريخ • سياحة",
    description:
      row.description_ar ||
      "وجهة سياحية مميزة تجمع بين الفخامة والتجارب الاستثنائية.",
    category: row.category_label_ar || "معالم",
    visitors: row.visitors_text || "+10K",
    rating: Number(row.rating || 4.8).toFixed(1),
    cta: row.cta_label_ar || "استكشف الآن",
    hotelsCount: Number(row.hotels_count || 0),
    activitiesCount: Number(row.activities_count || 0),
    isFeatured: Boolean(row.is_featured),
  };
}

/* =========================================================
   BENEFIT
========================================================= */

function BenefitItem({
  benefit,
  index,
}) {
  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-center gap-4 px-5">
      <div
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: benefit.background,
          color: benefit.iconColor,
        }}
      >
        {benefit.icon}
      </div>

      <div className="min-w-0 text-right">
        <h3 className="whitespace-nowrap text-[15px] font-extrabold text-[#263F62]">
          {benefit.title}
        </h3>

        <p className="mt-2 whitespace-nowrap text-[11px] font-medium text-[#8DA0BB]">
          {benefit.description}
        </p>
      </div>

      {index !== benefits.length - 1 && (
        <span className="absolute -left-[1px] top-1/2 hidden h-[58px] w-px -translate-y-1/2 bg-[#D9E4EF] xl:block" />
      )}
    </div>
  );
}

/* =========================================================
   DESTINATION CARD
========================================================= */

function DestinationCard({ destination, onSelect }) {
  return (
    <article
      dir="rtl"
      className="
        group
        overflow-hidden
        rounded-[20px]
        bg-white
        shadow-[0_10px_30px_rgba(45,87,126,0.08)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(45,87,126,0.14)]
      "
    >
      {/* image */}
      <div className="relative h-[277px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.04]
          "
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071729]/80 via-transparent to-transparent" />

        {/* country */}
        <div className="absolute left-[18px] top-[14px] flex items-center gap-2 rounded-full bg-[#314D6D]/80 px-3 py-[7px] text-[11px] font-bold text-white backdrop-blur-sm">
          <LocationIcon />
          <span>{destination.country || "مصر"}</span>
        </div>

        {/* title */}
        <div className="absolute bottom-[17px] right-[20px] left-[16px] text-right">
          <h3 className="text-[25px] font-black leading-none text-white">
            {destination.title}
          </h3>

          <p className="mt-[9px] text-[12px] font-bold text-white/95">
            {destination.tags}
          </p>
        </div>
      </div>

      {/* body */}
      <div className="px-[20px] pb-[18px] pt-[17px]">
        <p className="min-h-[46px] text-[11px] font-medium leading-[2] text-[#7890AE]">
          {destination.description}
        </p>

        <div className="mt-[13px] flex items-center justify-between text-[11px] font-semibold text-[#536C8C]">
          <div className="flex items-center gap-2">
            <CategoryIcon />
            <span>{destination.category || "معالم"}</span>
          </div>

          <div className="flex items-center gap-2">
            <UserSmallIcon />
            <span>{destination.visitors} زائر</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[17px] leading-none text-[#FFB000]">★</span>
            <span>{destination.rating}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect?.(destination)}
          className="
            mt-[19px]
            flex
            items-center
            gap-2
            text-[13px]
            font-extrabold
            text-[#159CF6]
            transition
            hover:gap-3
            cursor-pointer
          "
        >
          <span>{destination.cta || "استكشف الآن"}</span>
          <span aria-hidden="true">←</span>
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   SECTION
========================================================= */

export default function Section_2() {
  const [featuredDestinations, setFeaturedDestinations] = useState(defaultDestinations);
  const [allDestinations, setAllDestinations] = useState(defaultDestinations);
  const [showAll, setShowAll] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getPublicDestinations()
      .then((res) => {
        if (!active) return;
        const featured = (res?.data?.featuredDestinations || []).map(mapDbDestination);
        const all = (res?.data?.destinations || []).map(mapDbDestination);
        if (featured.length > 0) {
          setFeaturedDestinations(featured);
        } else if (all.length > 0) {
          setFeaturedDestinations(all.slice(0, 4));
        }
        if (all.length > 0) {
          setAllDestinations(all);
        }
      })
      .catch(() => {
        // Fallback to defaultDestinations if offline
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleDestinations = showAll ? allDestinations : featuredDestinations;

  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-white font-['Cairo']"
    >
      {/* ===================================================
          WHY TRAVORA
      =================================================== */}

      <div className="relative overflow-hidden bg-white pb-[48px] pt-[31px]">
        {/* decorative corner lines */}

        <CornerWaves className="pointer-events-none absolute -left-4 -top-[18px] h-[225px] w-[330px]" />

        <CornerWaves
          flipX
          className="pointer-events-none absolute -right-4 -top-[18px] h-[225px] w-[330px]"
        />

        <div className="relative z-10 mx-auto max-w-[1190px] px-5">
          {/* mini title */}
          <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#7187A5]">
            <SparkleIcon className="h-[11px] w-[11px] text-[#58718F]" />
            <span>لماذا Travora ؟</span>
          </div>

          <h2 className="mt-[14px] text-center text-[26px] font-black leading-[1.5] text-[#122A4C] md:text-[31px]">
            لأن كل رحلة تستحق أن تكون استثنائية
          </h2>

          {/* benefits */}
          <div className="mt-[25px] grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={benefit.title}
                benefit={benefit}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================
          DESTINATIONS
      =================================================== */}

      <div className="relative min-h-[790px] overflow-hidden bg-[#F2F7FD] pb-[42px] pt-[38px]">
        {/* corner contour lines */}

        <CornerWaves className="pointer-events-none absolute -left-[65px] -top-[55px] h-[280px] w-[350px] opacity-60" />

        <CornerWaves
          flipX
          className="pointer-events-none absolute -right-[65px] -top-[55px] h-[280px] w-[350px] opacity-60"
        />

        <CornerWaves
          flipY
          className="pointer-events-none absolute -bottom-[50px] -left-[60px] h-[280px] w-[350px] opacity-45"
        />

        <CornerWaves
          flipX
          flipY
          className="pointer-events-none absolute -bottom-[50px] -right-[60px] h-[280px] w-[350px] opacity-45"
        />

        {/* side message left */}
        <div
          dir="rtl"
          className="absolute left-[38px] top-[76px] z-10 hidden text-right xl:block"
        >
          <p className="text-[14px] font-semibold leading-[2] text-[#7086A3]">
            كل رحلة
            <br />
            تحكي قصة ..
          </p>

          <div className="mt-3 rotate-[3deg]">
            <SideUnderline />
          </div>
        </div>

        {/* side message right */}
        <div
          dir="rtl"
          className="absolute right-[45px] top-[84px] z-10 hidden text-right xl:block"
        >
          <p className="text-[13px] font-semibold text-[#7086A3]">
            مصر بعيون جديدة
          </p>

          <div className="mt-4 rotate-[3deg]">
            <SideUnderline />
          </div>
        </div>

        {/* bottom message */}
        <div
          dir="rtl"
          className="absolute bottom-[38px] right-[45px] z-10 hidden text-right xl:block"
        >
          <p className="text-[14px] font-semibold leading-[2] text-[#7086A3]">
            رحلة جديدة
            <br />
            تنتظرك ..
          </p>

          <div className="mt-3 rotate-[4deg]">
            <SideUnderline />
          </div>
        </div>

        {/* Palm */}
        <div className="pointer-events-none absolute -bottom-[4px] -left-[25px] hidden h-[155px] w-[180px] xl:block">
          <BluePalmDecoration />
        </div>

        {/* logo */}
        <div className="absolute bottom-[43px] left-[100px] z-10 hidden text-left xl:block">
          <p className="text-[16px] font-extrabold text-[#5B789C]">
            Travora
          </p>

          <p className="mt-1 text-[9px] font-medium text-[#92A8C4]">
            More Than a Destination
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-[1270px] px-5">
          {/* heading */}

          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <p className="text-[15px] font-extrabold text-[#10BFB0]">
                وجهات مختارة لك
              </p>

              <SparkleIcon className="h-[22px] w-[22px] text-[#149CF4]" />
            </div>

            <h2 className="mt-[13px] text-[34px] font-black tracking-[-1px] text-[#0D2447] md:text-[45px]">
              اكتشف{" "}
              <span className="bg-gradient-to-l from-[#0BA9F2] to-[#11C3AE] bg-clip-text text-transparent">
                أشهر الوجهات
              </span>
            </h2>

            <p className="mt-[13px] text-[15px] font-medium text-[#8396B2]">
              أماكن استثنائية ... تجارب لا تُنسى
            </p>
          </div>

          {/* cards */}
          <div
            dir="ltr"
            className="
              mx-auto
              mt-[22px]
              grid
              max-w-[1275px]
              grid-cols-1
              gap-[20px]
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {visibleDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={setSelectedDestination}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-[17px] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="
                flex
                h-[58px]
                min-w-[350px]
                items-center
                justify-center
                gap-[34px]
                rounded-[20px]
                bg-gradient-to-l
                from-[#139AF1]
                to-[#2DAFFA]
                px-10
                text-[16px]
                font-extrabold
                text-white
                shadow-[0_10px_24px_rgba(20,156,242,0.18)]
                transition
                duration-300
                hover:-translate-y-[2px]
                hover:shadow-[0_15px_30px_rgba(20,156,242,0.25)]
                max-sm:min-w-0
                max-sm:w-full
                cursor-pointer
              "
            >
              <span className="text-[23px]">←</span>

              <span>
                {showAll
                  ? `عرض أشهر الوجهات فقط (${featuredDestinations.length})`
                  : allDestinations.length > featuredDestinations.length
                    ? `عرض جميع الوجهات (${allDestinations.length})`
                    : "عرض جميع الوجهات"}
              </span>

              <SparkleIcon className="h-[19px] w-[19px] text-white" />
            </button>

            <p className="mt-[14px] text-[11px] font-medium text-[#8EA1BB]">
              اكتشف المزيد من الوجهات داخل مصر وحول العالم
            </p>
          </div>
        </div>
      </div>

      {/* نافذة تفاصيل الوجهة عند الضغط على "استكشف الآن" */}
      {selectedDestination && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#DCEBFA] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071729]/85 via-[#071729]/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
                className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#0F172A] shadow-sm hover:bg-white cursor-pointer"
              >
                إغلاق ✕
              </button>
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#314D6D]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs">
                <LocationIcon />
                <span>{selectedDestination.country}</span>
              </div>
              <div className="absolute bottom-4 right-5 left-5 text-right">
                <h3 className="text-2xl font-black text-white">
                  {selectedDestination.title}{" "}
                  {selectedDestination.nameEn && (
                    <span className="text-sm font-semibold text-white/80">
                      ({selectedDestination.nameEn})
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-xs font-bold text-[#00C8A8]">
                  {selectedDestination.tags}
                </p>
              </div>
            </div>

            <div className="p-6 text-right">
              <p className="text-sm font-medium leading-7 text-[#475569]">
                {selectedDestination.description}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 text-center">
                <div>
                  <p className="text-[11px] font-semibold text-[#64748B]">التصنيف</p>
                  <p className="mt-1 text-sm font-extrabold text-[#0F172A]">
                    {selectedDestination.category}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#64748B]">عدد الزوار</p>
                  <p className="mt-1 text-sm font-extrabold text-[#0099FF]">
                    {selectedDestination.visitors} زائر
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#64748B]">التقييم العام</p>
                  <p className="mt-1 text-sm font-extrabold text-[#FF8A00]">
                    ★ {selectedDestination.rating}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#64748B]">
                  البيانات متزامنة مباشرة مع لوحة تحكم Travora
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDestination(null)}
                  className="rounded-xl bg-[#0099FF] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0088E5] cursor-pointer"
                >
                  متابعة التصفح
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}