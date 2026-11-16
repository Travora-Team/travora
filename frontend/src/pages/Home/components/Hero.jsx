import { useNavigate } from "react-router-dom";

import heroMobile from "../../../assets/heroMobile.webp";
import heroTablet from "../../../assets/heroTablet.webp";
import heroDesktop from "../../../assets/heroDesktop.webp";

function SearchField({ label, icon, children, className = "" }) {
  return (
    <label
      className={`
        flex min-w-0 flex-1 items-center gap-3
        rounded-2xl bg-[#F7F9FC] px-4 py-3.5
        text-content-primary transition
        focus-within:ring-2 focus-within:ring-primary/30
        lg:rounded-none lg:bg-transparent lg:py-2
        ${className}
      `}
    >
      <span
        className="
          flex size-9 shrink-0 items-center justify-center
          rounded-xl bg-primary/10
          text-base font-black text-primary
        "
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black text-content-muted">
          {label}
        </span>

        {children}
      </span>
    </label>
  );
}

export function Hero() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/destinations");
  };

  return (
    <section
      className="
        relative isolate
        flex min-h-[760px] items-center
        overflow-hidden
        bg-[#10213E]
        px-4 py-16
        text-white

        sm:min-h-[780px]
        sm:px-6
        sm:py-20

        md:min-h-[760px]

        lg:min-h-[700px]
        lg:px-8
        lg:py-20
      "
    >
      {/* =========================================================
          RESPONSIVE HERO IMAGE
          Mobile  : 9:16
          Tablet  : 3:4
          Desktop : 16:9
      ========================================================== */}
      <picture className="absolute inset-0 -z-30 block h-full w-full">
        {/* Desktop */}
        <source
          media="(min-width: 1024px)"
          srcSet={heroDesktop}
          type="image/webp"
        />

        {/* Tablet */}
        <source
          media="(min-width: 640px)"
          srcSet={heroTablet}
          type="image/webp"
        />

        {/* Mobile fallback */}
        <img
          src={heroMobile}
          alt="القاهرة والنيل والأهرامات وقت الغروب"
          className="
            h-full w-full
            object-cover

            object-[center_48%]

            sm:object-[center_45%]

            lg:object-center
          "
          width="640"
          height="1138"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable="false"
        />
      </picture>

      {/* =========================================================
          COLOR OVERLAY
      ========================================================== */}
      <div
        className="
          absolute inset-0 -z-20
          bg-gradient-to-b
          from-[#2496e8]/10
          via-[#2496e8]/5
          to-[#10213E]/25

          lg:bg-gradient-to-l
          lg:from-[#2496e8]/10
          lg:via-[#2496e8]/10
          lg:to-[#2496e8]/20
        "
      />

      {/* =========================================================
          CENTRAL WHITE GLOW
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-[43%]
          -z-10
          h-[390px] w-[115%]
          -translate-x-1/2 -translate-y-1/2
          rounded-[50%]
          bg-white/65
          blur-[100px]

          sm:h-[450px]
          sm:w-[85%]
          sm:blur-[120px]

          lg:top-[47%]
          lg:h-[480px]
          lg:w-[750px]
          lg:bg-white/75
          lg:blur-[130px]
        "
      />

      {/* =========================================================
          OVAL BORDER
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-[43%]
          z-[1]

          h-[700px]
          w-[125%]

          -translate-x-1/2
          -translate-y-1/2

          rounded-[50%]
          border border-white/15

          sm:h-[820px]
          sm:w-[110%]

          lg:top-[44%]
          lg:h-[960px]
          lg:w-[1340px]
          lg:border-white/20
        "
      />

      {/* =========================================================
          TOP LEFT SOFT BLOB
          نخفيه في الشاشات الصغيرة جدًا لتقليل الزحام
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          -left-8 -top-8
          z-[2]
          hidden
          h-[150px] w-[150px]

          sm:block

          lg:left-20
          lg:top-[2%]
          lg:h-[180px]
          lg:w-[180px]
          lg:-translate-x-1/2
          lg:-translate-y-1/2
        "
      >
        <svg
          viewBox="0 0 420 320"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="rgba(255,255,255,0.30)"
            d="
              M115 28
              C145 -2, 205 -2, 235 28
              C265 -2, 325 8, 338 54
              C387 60, 415 95, 405 145
              C430 184, 415 232, 375 252
              C366 298, 327 324, 279 314
              C245 352, 181 354, 147 318
              C99 324, 57 299, 47 255
              C7 232, -7 187, 20 145
              C6 97, 32 60, 82 52
              C91 40, 101 34, 115 28
              Z
            "
          />
        </svg>
      </div>

      {/* =========================================================
          LEFT QUOTE
          Desktop / Tablet only
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          left-[4%] top-[22%]
          z-10
          hidden
          text-white

          md:block

          lg:left-[7%]
          lg:top-[25%]
        "
      >
        <p
          className="
            -rotate-[4deg]
            text-center
            text-[13px]
            font-medium
            leading-[1.65]
            text-white/90
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]

            lg:text-[17px]
          "
        >
          مصر دائمًا
          <br />
          بداية لقصة أجمل
        </p>

        <svg
          viewBox="0 0 120 40"
          className="
            mx-auto mt-0
            h-[25px] w-[90px]
            -rotate-[7deg]

            lg:h-[30px]
            lg:w-[105px]
          "
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 9 C38 3, 82 2, 113 4"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* =========================================================
          RIGHT QUOTE
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          right-[4%] top-[13%]
          z-10
          hidden
          text-white

          md:block

          lg:right-[5%]
          lg:top-[15%]
        "
      >
        <p
          className="
            -rotate-[4deg]
            text-center
            text-[13px]
            font-medium
            leading-[1.65]
            text-white/90
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]

            lg:text-[15px]
          "
        >
          أماكن أجمل
          <br />
          لحياة أوسع ..
        </p>

        <svg
          viewBox="0 0 120 40"
          className="
            mx-auto
            h-[25px] w-[90px]
            -rotate-[7deg]

            lg:h-[30px]
            lg:w-[105px]
          "
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 14 C38 3, 82 2, 113 10"
            stroke="rgba(19,174,245,0.95)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* =========================================================
          LOCATION
      ========================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-5 left-5
          z-10

          sm:bottom-7
          sm:left-7

          lg:bottom-[5%]
          lg:left-[5%]
        "
      >
        <div className="flex items-center gap-2.5 text-white">
          <div className="text-left">
            <p
              className="
                text-[12px]
                font-semibold
                leading-[1.3]

                sm:text-[13px]

                lg:text-[15px]
              "
            >
              القاهرة، مصر
            </p>

            <p
              className="
                mt-1
                text-[9px]
                font-normal
                leading-[1.4]
                text-white/80

                sm:text-[10px]

                lg:text-[11px]
              "
            >
              حيث يلتقي التاريخ بالمستقبل
            </p>
          </div>

          <svg
            width="18"
            height="22"
            viewBox="0 0 25 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
              h-[18px] w-[15px]
              shrink-0

              lg:h-[22px]
              lg:w-[18px]
            "
            aria-hidden="true"
          >
            <path
              d="M12.5 28C12.5 28 22 20.1 22 11.7C22 5.8 17.75 2 12.5 2C7.25 2 3 5.8 3 11.7C3 20.1 12.5 28 12.5 28Z"
              fill="white"
            />

            <path
              d="M12.5 14.7C14.2674 14.7 15.7 13.2673 15.7 11.5C15.7 9.73268 14.2674 8.29999 12.5 8.29999C10.7327 8.29999 9.30005 9.73268 9.30005 11.5C9.30005 13.2673 10.7327 14.7 12.5 14.7Z"
              fill="#3C7EAF"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================
          MAIN HERO CONTENT
      ========================================================== */}
      <div
        className="
          relative z-10
          mx-auto
          flex w-full
          max-w-[1240px]
          flex-col
          items-center
          text-center
        "
      >
        {/* Badge */}
        <span
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border border-[#79DFD6]
            bg-[#E9FFFB]/95
            px-3.5 py-2
            text-[12px]
            font-black
            text-[#139E91]
            shadow-sm
            backdrop-blur-md

            sm:px-4
            sm:text-sm
          "
        >
          <span aria-hidden="true">✦</span>
          خطّط رحلتك معنا بذكاء
        </span>

        {/* Heading */}
        <h1
          className="
            mt-5
            max-w-[900px]
            font-sans
            text-[42px]
            font-medium
            leading-[1.08]
            tracking-tight
            text-[#10213E]

            min-[380px]:text-[46px]

            sm:mt-6
            sm:text-[54px]

            md:text-[62px]

            lg:text-[72px]
            lg:leading-[1.1]

            xl:text-[76px]
          "
        >
          مغامرتك التالية
          <br />

          <span
            className="
              bg-gradient-to-l
              from-[#13BCE9]
              to-[#12C8A8]
              bg-clip-text
              text-transparent
            "
          >
            تبدأ من هنا.
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            mt-4
            max-w-[310px]
            text-[14px]
            leading-7
            text-[#637694]

            sm:mt-5
            sm:max-w-[430px]
            sm:text-base
            sm:leading-8

            md:max-w-[520px]
            md:text-lg
          "
        >
          اختر وجهتك، وقتك، ونوع التجربة التي تحبها. ثم ابدأ رحلة تشبهك فعلًا.
        </p>

        {/* =====================================================
            SEARCH BOX
        ====================================================== */}
        <form
          onSubmit={handleSubmit}
          className="
            mt-7
            flex
            w-full
            max-w-[1180px]
            flex-col
            gap-2.5
            rounded-[24px]
            border border-white/80
            bg-white/95
            p-2.5
            text-right
            text-content-primary

            shadow-[0_20px_60px_rgba(13,44,70,0.20)]
            backdrop-blur-xl

            sm:mt-8
            sm:max-w-[560px]
            sm:p-3

            md:mt-9
            md:max-w-[760px]
            md:grid
            md:grid-cols-2
            md:gap-2

            lg:mt-11
            lg:max-w-6xl
            lg:flex
            lg:flex-row
            lg:items-stretch
            lg:gap-0
            lg:rounded-[28px]
            lg:p-2
          "
        >
          <SearchField
            label="الوجهة"
            icon="⌖"
            className="
              lg:border-l
              lg:border-divider
            "
          >
            <select
              aria-label="اختر وجهتك"
              defaultValue=""
              className="
                mt-1
                w-full
                cursor-pointer
                bg-transparent
                text-[13px]
                font-black
                outline-none

                sm:text-sm
              "
            >
              <option value="" disabled>
                أين تريد أن تبدأ؟
              </option>

              <option value="cairo">القاهرة</option>
              <option value="giza">الجيزة</option>
              <option value="luxor">الأقصر</option>
              <option value="sharm">شرم الشيخ</option>
            </select>
          </SearchField>

          <SearchField
            label="موعد تقريبي"
            icon="◷"
            className="
              lg:border-l
              lg:border-divider
            "
          >
            <input
              aria-label="اختر موعدًا تقريبيًا"
              type="date"
              className="
                mt-1
                w-full
                bg-transparent
                text-[13px]
                font-black
                outline-none

                sm:text-sm
              "
            />
          </SearchField>

          <SearchField label="نوع الرحلة" icon="✦">
            <select
              aria-label="اختر نوع الرحلة"
              defaultValue=""
              className="
                mt-1
                w-full
                cursor-pointer
                bg-transparent
                text-[13px]
                font-black
                outline-none

                sm:text-sm
              "
            >
              <option value="" disabled>
                اختر ما يناسبك
              </option>

              <option value="culture">استكشاف وثقافة</option>
              <option value="family">عائلة وراحة</option>
              <option value="adventure">مغامرة وشاطئ</option>
            </select>
          </SearchField>

          <button
            type="submit"
            className="
              min-h-[58px]
              w-full
              rounded-2xl
              bg-primary
              px-6
              text-sm
              font-black
              text-white

              shadow-lg
              shadow-primary/25

              transition
              duration-200

              hover:bg-primary-hover

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2

              active:scale-[0.98]

              md:min-h-[64px]

              lg:min-h-14
              lg:w-auto
              lg:min-w-[165px]
              lg:px-7
            "
          >
            ابحث عن رحلتي ←
          </button>
        </form>
      </div>
    </section>
  );
}