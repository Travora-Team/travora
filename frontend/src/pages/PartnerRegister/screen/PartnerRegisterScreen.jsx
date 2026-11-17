import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { partnerRegisterApi } from '../api/partnerRegisterApi';
import { DEFAULT_CITIES, buildPartnerDetailsPayload } from '../models/partnerRegisterModel';
import { PartnerLegalStep } from '../components/PartnerLegalStep';
import { PartnerSuccessCard } from '../components/PartnerSuccessCard';
import { HotelProviderScreen } from '../../../providers/hotels';
import { RestaurantProviderScreen } from '../../../providers/restaurants';
import { GuideProviderScreen } from '../../../providers/guides';
import { TransportProviderScreen } from '../../../providers/transport';

/* ===== Stepper (icons + numbered badges, like the design) ===== */
const STEPS = [
  {
    num: 1,
    label: 'نوع الخدمة',
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </>
    ),
  },
  {
    num: 2,
    label: 'التفاصيل التشغيلية',
    icon: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    num: 3,
    label: 'الترخيص والحساب',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
];

/* ===== Partner categories (RTL: hotels rightmost, like the design) ===== */
const PARTNER_TYPES = [
  {
    id: 'hotel',
    label: 'الفنادق\nوالمنتجعات',
    icon: (
      <>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M12 4v6M2 18h20" />
      </>
    ),
  },
  {
    id: 'restaurant',
    label: 'المطاعم\nوالمقاهي',
    icon: (
      <>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </>
    ),
  },
  {
    id: 'guide',
    label: 'المرشدون\nالسياحيون',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
  },
  {
    id: 'transport',
    label: 'النقل السياحي',
    icon: (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M9 17h6" />
      </>
    ),
  },
];

const TRANSPORT_SUBTYPES = [
  { id: 'transport_company', label: 'شركة نقل سياحي' },
  { id: 'car_owner', label: 'سيارة خاصة مع سائق' },
  { id: 'car_rental', label: 'تأجير سيارات' },
];

/* ===== Bottom features — new labels, leftmost first (LTR band) ===== */
const FEATURES = [
  {
    label: 'بيئة آمنة\nوموثوقة',
    icon: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    label: 'دعم فني\nمتخصص',
    icon: (
      <>
        <path d="M3 12a9 9 0 0 1 18 0" />
        <path d="M21 12v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M3 12v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
        <path d="M21 17v1a3 3 0 0 1-3 3h-4" />
      </>
    ),
  },
  {
    label: 'فرص نمو\nوتوسع أكبر',
    icon: (
      <>
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </>
    ),
  },
];

const inputClass =
  'h-[56px] w-full rounded-full border border-[#D9E2F2] bg-white/80 px-5 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70';

const labelClass = 'mb-2 block text-sm font-bold text-[#284A7C]';

export default function PartnerRegisterScreen() {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState(DEFAULT_CITIES);

  const [partnerType, setPartnerType] = useState('hotel');
  const [transportSubtype, setTransportSubtype] = useState('transport_company');

  const [publicNameAr, setPublicNameAr] = useState('');
  const [publicNameEn, setPublicNameEn] = useState('');
  const [legalName, setLegalName] = useState('');
  const [registrationReference, setRegistrationReference] = useState('');
  const [citySlug, setCitySlug] = useState('cairo');
  const [addressAr, setAddressAr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');

  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [starRating, setStarRating] = useState(5);
  const [roomsCount, setRoomsCount] = useState('45');
  const [nightlyPriceEgp, setNightlyPriceEgp] = useState('4500');
  const [hotelAmenities, setHotelAmenities] = useState([
    'إطلالة نيلية أو بحرية مباشرة',
    'استقبال وتوصيل مطار VIP',
    'إفطار ملكي مفتوح',
  ]);

  const [cuisineAr, setCuisineAr] = useState('مأكولات مصرية وبحرية فاخرة');
  const [seatingCapacity, setSeatingCapacity] = useState('120');
  const [openingHours, setOpeningHours] = useState('يومياً من 12:00 ظهراً حتى 1:00 صباحاً');
  const [avgMealPriceEgp, setAvgMealPriceEgp] = useState('850');
  const [restaurantFeatures, setRestaurantFeatures] = useState([
    'حجز طاولات كبار الزوار VIP',
    'إطلالة بانورامية / تراس مفتوح',
  ]);

  const [yearsExperience, setYearsExperience] = useState('8');
  const [dailyRateEgp, setDailyRateEgp] = useState('2200');
  const [guideLanguages, setGuideLanguages] = useState(['العربية', 'الإنجليزية', 'الفرنسية']);
  const [guideSpecialties, setGuideSpecialties] = useState([
    'علم المصريات والآثار الفرعونية',
    'جولات المتاحف الملكية الخاصة',
  ]);

  const [fleetSize, setFleetSize] = useState('15');
  const [companyVehicleClasses, setCompanyVehicleClasses] = useState([
    'سيدان فاخرة (Mercedes / BMW)',
    'فان عائلي سياحي VIP (7-9 مقاعد)',
  ]);
  const [startingPriceEgp, setStartingPriceEgp] = useState('1400');

  const [carMakeModel, setCarMakeModel] = useState('مرسيدس E200 — فيس ليفت');
  const [carYear, setCarYear] = useState('2025');
  const [plateNumber, setPlateNumber] = useState('ق هـ ر - 114');
  const [seatsCount, setSeatsCount] = useState('4');
  const [luggageCapacity, setLuggageCapacity] = useState('3');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');

  const [rentalCarsCount, setRentalCarsCount] = useState('25');
  const [rentalCategories, setRentalCategories] = useState([
    'سيدان فاخرة ورجال أعمال',
    'دفع رباعي عائلية SUV 4x4',
  ]);
  const [rentalModes, setRentalModes] = useState([
    'إيجار بدون سائق (Self-Drive)',
    'إيجار بسائق خاص محترف',
    'تسليم واستلام في المطار 24/7',
  ]);
  const [depositEgp, setDepositEgp] = useState('5000');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    partnerRegisterApi
      .getPublicDestinations()
      .then((res) => {
        const list = res?.data?.destinations;
        if (Array.isArray(list) && list.length > 0) {
          setCities(list);
        }
      })
      .catch(() => {});
  }, []);

  const toggleItem = (list, setList, item) => {
    setList((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!publicNameAr.trim()) {
        setErrorMsg('يرجى إدخال اسم المنشأة أو الخدمة بالعربية قبل الانتقال للخطوة التالية.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!publicNameAr.trim()) {
      setErrorMsg('يرجى إدخال اسم الفندق / المطعم / المرشد / خدمة النقل.');
      setStep(2);
      return;
    }
    if (!applicantName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('يرجى استكمال اسم المسؤول والبريد الإلكتروني ورقم الهاتف.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('يرجى الموافقة على ميثاق جودة شركاء ترافورا لإرسال الطلب.');
      return;
    }

    setSubmitting(true);
    try {
      const details = buildPartnerDetailsPayload(partnerType, {
        transportSubtype,
        starRating,
        roomsCount,
        nightlyPriceEgp,
        hotelAmenities,
        cuisineAr,
        seatingCapacity,
        openingHours,
        avgMealPriceEgp,
        restaurantFeatures,
        yearsExperience,
        dailyRateEgp,
        guideLanguages,
        guideSpecialties,
        registrationReference,
        fleetSize,
        companyVehicleClasses,
        startingPriceEgp,
        carMakeModel,
        carYear,
        plateNumber,
        seatsCount,
        luggageCapacity,
        driverLicenseNumber,
        rentalCarsCount,
        rentalCategories,
        rentalModes,
        depositEgp,
        addressAr,
        descriptionAr,
      });

      const payload = {
        partnerType,
        transportSubtype: partnerType === 'transport' ? transportSubtype : null,
        publicNameAr: publicNameAr.trim(),
        publicNameEn: (publicNameEn || publicNameAr).trim(),
        legalName: (legalName || publicNameAr).trim(),
        registrationReference: registrationReference.trim(),
        citySlug,
        applicantName: applicantName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim() || undefined,
        details,
      };

      const res = await partnerRegisterApi.submitPartnerApplication(payload);
      setSubmittedResult(res?.data);
    } catch (err) {
      setErrorMsg(
        err.message || 'تعذر إرسال طلب الانضمام، يرجى التحقق من البيانات والمحاولة مجدداً.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickDemoPartner = () => {
    setErrorMsg('');
    if (partnerType === 'hotel') {
      setPublicNameAr('فندق ومنتجع قصر الفيروز الملكي');
      setPublicNameEn('Al Fayrouz Royal Palace Resort');
      setLegalName('شركة الفيروز للفنادق والمنتجعات السياحية ش.م.م');
      setRegistrationReference(`CR-EG-${Math.floor(100000 + Math.random() * 899999)}`);
      setCitySlug('sharm-el-sheikh');
      setAddressAr('خليج القرش، شرم الشيخ، جنوب سيناء');
      setDescriptionAr(
        'منتجع 5 نجوم فاخر يضم شاطئاً رملياً خاصاً وأجنحة ملكية مطلة على البحر الأحمر مباشرة.'
      );
      setApplicantName('المهندس طارق المنشاوي');
      setEmail(`fayrouz.resort.${Math.floor(100 + Math.random() * 899)}@travora.eg`);
      setPhone('+201022334455');
      setPassword('Partner@2026');
    } else if (partnerType === 'restaurant') {
      setPublicNameAr('مطعم سرايا النيل للمأكولات البحرية والشرقية');
      setPublicNameEn('Saraya El Nile Fine Dining');
      setLegalName('شركة سرايا النيل للضيافة والمطاعم السياحية');
      setRegistrationReference(`CR-REST-${Math.floor(100000 + Math.random() * 899999)}`);
      setCitySlug('cairo');
      setAddressAr('كورنيش النيل، الزمالك، القاهرة');
      setDescriptionAr(
        'تجربة عشاء ملكية على ضفاف النيل مع جلسات تراس بانورامية وقائمة طعام بإشراف أشهر الطهاة.'
      );
      setApplicantName('الشيف كريم عبد العزيز');
      setEmail(`saraya.dining.${Math.floor(100 + Math.random() * 899)}@travora.eg`);
      setPhone('+201033445566');
      setPassword('Partner@2026');
    } else if (partnerType === 'guide') {
      setPublicNameAr('أ.د. سلمى الهاشمي — خبيرة الآثار والحضارة المصرية');
      setPublicNameEn('Dr. Salma El-Hashemi — Egyptology Guide');
      setLegalName('سلمى الهاشمي محمود (مرشدة سياحية مرخصة بوزارة السياحة)');
      setRegistrationReference(`LIC-GUIDE-${Math.floor(1000 + Math.random() * 8999)}`);
      setCitySlug('luxor');
      setAddressAr('شارع معبد الكرنك، الأقصر');
      setDescriptionAr(
        'مرشدة سياحية معتمدة بخبرة 11 عاماً في الجولات الملكية الخاصة بمعابد الأقصر وأسوان والمتحف المصري الكبير.'
      );
      setApplicantName('د. سلمى الهاشمي');
      setEmail(`salma.guide.${Math.floor(100 + Math.random() * 899)}@travora.eg`);
      setPhone('+201044556677');
      setPassword('Partner@2026');
    } else {
      if (transportSubtype === 'car_owner') {
        setPublicNameAr('كابتن محمود الشاذلي — سيارة مرسيدس E200 بسائق خاص');
        setPublicNameEn('Capt. Mahmoud El-Shazly — Private Mercedes Chauffeur');
        setLegalName('محمود الشاذلي حسن (مالك وقائد مركبة سياحية خاصة)');
        setRegistrationReference(`DRV-EG-${Math.floor(10000 + Math.random() * 89999)}`);
        setDriverLicenseNumber(`PRO-LIC-${Math.floor(10000 + Math.random() * 89999)}`);
      } else if (transportSubtype === 'car_rental') {
        setPublicNameAr('إيليت لتأجير السيارات الحديثة والفاخرة');
        setPublicNameEn('Elite Luxury Car Rental Egypt');
        setLegalName('شركة إيليت الدولية لتأجير السيارات والخدمات السياحية');
        setRegistrationReference(`CR-RENT-${Math.floor(100000 + Math.random() * 899999)}`);
      } else {
        setPublicNameAr('أوربت للنقل السياحي وخدمات الليموزين VIP');
        setPublicNameEn('Orbit VIP Tourist Transport & Limousine');
        setLegalName('شركة أوربت للنقل السياحي والليموزين ش.م.م');
        setRegistrationReference(`CR-TRANS-${Math.floor(100000 + Math.random() * 899999)}`);
      }
      setCitySlug('cairo');
      setAddressAr('مصر الجديدة، طريق مطار القاهرة الدولي');
      setDescriptionAr(
        'خدمات نقل وتأجير سيارات حديثة مؤمنة بالكامل مع التزام تام بالمواعيد وخدمة عملاء على مدار الساعة.'
      );
      setApplicantName('أحمد الكيلاني');
      setEmail(`transport.partner.${Math.floor(100 + Math.random() * 899)}@travora.eg`);
      setPhone('+201055667788');
      setPassword('Partner@2026');
    }
  };

  if (submittedResult) {
    return (
      <PartnerSuccessCard
        submittedResult={submittedResult}
        onReset={() => {
          setSubmittedResult(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#D8ECFB] font-['Cairo'] text-[#0B2B61]"
    >
      {/* ===== Full-screen background ===== */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/travora-login-hero.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF6FF]/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
      </div>

      {/* ===== Header: logo left / mode pills right ===== */}
      <header
        dir="ltr"
        className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-10 lg:px-16"
      >
        <Link to="/" className="inline-flex items-center">
          <img
            src="/images/travora-logo.png"
            alt="Travora - More Than a Destination"
            className="h-14 w-auto object-contain sm:h-20"
          />
        </Link>

        {/* RTL order: login rightmost, provider (active) leftmost — like the design */}
        <nav dir="rtl" className="flex flex-wrap items-center justify-end gap-2">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 text-[11px] font-bold text-[#123A6E] shadow-sm backdrop-blur-md transition hover:bg-white sm:text-sm"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="m10 17 5-5-5-5M15 12H3" />
            </svg>
            تسجيل الدخول
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 text-[11px] font-bold text-[#123A6E] shadow-sm backdrop-blur-md transition hover:bg-white sm:text-sm"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M21.5 3.5c-1-.5-3 0-4.5 1.5L13.5 8.5 5 6.5l-1.5 1.5 7 3.5-3 3H4l-1.5 1.5 3.5 1.5 1.5 3.5L9 19.5v-3.5l3-3 3.5 7L17 18.5l-2-8.5 3.5-3.5c1.5-1.5 2-3.5 1.5-4.5Z" />
            </svg>
            تسجيل مسافر عادي (تفعيل فوري)
          </Link>

          <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B5AD2] to-[#0843A6] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-md shadow-blue-600/25 sm:text-sm">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
            </svg>
            تسجيل مزود خدمة (بموافقة الأدمن)
          </span>
        </nav>
      </header>

      {/* ===== Content: hero text left / wizard card right ===== */}
      <div
        dir="ltr"
        className="relative z-20 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-start gap-10 px-5 pb-8 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-16 lg:pb-36"
      >
        {/* LEFT: headline over the background */}
        <section
          dir="rtl"
          className="order-2 pt-2 text-center lg:order-1 lg:pt-20 lg:pr-10"
        >
          <h1 className="text-[32px] font-extrabold leading-[1.55] text-[#0B3B7E] sm:text-[40px] lg:text-[44px]">
            انضم إلى شبكة
            <br />
            شركاء ترافورا السياحية
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-8 text-[#46689C] sm:text-lg sm:leading-9">
            كن جزءاً من رحلتنا في تقديم تجارب سياحية استثنائية
            <br className="hidden sm:block" />
            من خلال شراكتك معنا
          </p>
        </section>

        {/* RIGHT: wizard card (no logo — starts with the stepper) */}
        <section
          dir="rtl"
          className="order-1 w-full max-w-[720px] justify-self-center rounded-[30px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_90px_rgba(10,55,120,0.18)] backdrop-blur-xl sm:p-8 lg:order-2 lg:mt-1 lg:justify-self-end lg:p-10"
        >
          {/* Stepper */}
          <div className="mb-9 flex items-start justify-center gap-2 sm:gap-3">
            {STEPS.map((s, i) => {
              const active = step === s.num;
              const done = step > s.num;

              return (
                <Fragment key={s.num}>
                  {i > 0 && (
                    <div className="mt-3.5 h-[2px] max-w-[110px] flex-1 rounded bg-[#D5DEEB]" />
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(s.num)}
                    className="flex w-24 shrink-0 flex-col items-center gap-1.5 sm:w-28"
                  >
                    <svg
                      className={`h-7 w-7 ${
                        active || done ? 'text-[#0C56CE]' : 'text-[#9AA7BD]'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {s.icon}
                    </svg>

                    <span
                      className={`flex items-center justify-center rounded-full font-black ${
                        active
                          ? 'h-9 w-9 bg-[#0C56CE] text-base text-white shadow-lg shadow-blue-500/30'
                          : done
                            ? 'h-7 w-7 bg-[#0C56CE]/15 text-sm text-[#0C56CE]'
                            : 'h-7 w-7 bg-[#E3E9F2] text-sm text-[#8A97AC]'
                      }`}
                    >
                      {done ? '✓' : s.num}
                    </span>

                    {active && (
                      <svg
                        className="-mt-1.5 h-4 w-4 text-[#0C56CE]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}

                    <span
                      className={`text-xs font-bold sm:text-sm ${
                        active ? 'text-[#0C56CE]' : 'text-[#8A97AC]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>

          {/* Error */}
          {errorMsg && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ================= STEP 1 — matches the design ================= */}
            {step === 1 && (
              <div>
                <h2 className="text-center text-2xl font-extrabold text-[#10366E] sm:text-[26px]">
                  اختر نوع الشريك
                </h2>
                <p className="mt-2 text-center text-sm font-semibold text-[#7185A8]">
                  حدد القطاع الذي تنتمي إليه للمتابعة في عملية التسجيل
                </p>

                {/* Category cards */}
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PARTNER_TYPES.map((t) => {
                    const active = partnerType === t.id;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPartnerType(t.id)}
                        className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 px-3 py-6 transition ${
                          active
                            ? 'border-[#0C56CE] bg-[#F0F7FF] shadow-md shadow-blue-500/10'
                            : 'border-[#E1E8F3] bg-white hover:border-[#B9CDF0]'
                        }`}
                      >
                        {active && (
                          <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0C56CE] text-white">
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m5 12 5 5 9-10" />
                            </svg>
                          </span>
                        )}

                        <svg
                          className="h-10 w-10 text-[#0C56CE]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {t.icon}
                        </svg>

                        <span className="whitespace-pre-line text-center text-sm font-extrabold leading-6 text-[#123A6E]">
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Transport subtype — always visible, as in the design */}
                <div className="mt-6 rounded-[22px] bg-[#EEF3FB] p-5">
                  <p className="text-center text-sm font-extrabold text-[#123A6E]">
                    نوع النقل (في حالة اختيار النقل السياحي)
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TRANSPORT_SUBTYPES.map((st) => {
                      const active = transportSubtype === st.id;

                      return (
                        <label
                          key={st.id}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-full border bg-white px-4 py-3 text-sm font-bold text-[#123A6E] transition ${
                            active
                              ? 'border-[#0C56CE]/40'
                              : 'border-transparent hover:border-[#D5DEEB]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="transportSubtype"
                            className="sr-only"
                            checked={active}
                            onChange={() => setTransportSubtype(st.id)}
                          />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              active ? 'border-[#0C56CE]' : 'border-[#C4D2E8]'
                            }`}
                          >
                            {active && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#0C56CE]" />
                            )}
                          </span>
                          {st.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Continue */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-7 flex h-[60px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#2AA9E8] to-[#0C56CE] text-[17px] font-extrabold text-white shadow-[0_14px_30px_rgba(8,70,170,0.30)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(8,70,170,0.38)]"
                >
                  <span>المتابعة للبيانات التفصيلية</span>
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5m7-7-7 7 7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-extrabold text-[#10366E] sm:text-2xl">
                    {partnerType === 'hotel' && 'بيانات الفندق أو المنتجع السياحي'}
                    {partnerType === 'restaurant' && 'بيانات المطعم وتجربة الضيافة'}
                    {partnerType === 'guide' && 'الملف المهني للمرشد السياحي'}
                    {partnerType === 'transport' &&
                      (transportSubtype === 'car_owner'
                        ? 'بيانات السيارة الخاصة والسائق'
                        : transportSubtype === 'car_rental'
                          ? 'بيانات مكتب أو شركة استئجار السيارات'
                          : 'بيانات شركة النقل السياحي والأسطول')}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-[#7185A8]">
                    هذه المعلومات تُعرض للإدارة عند مراجعة طلبك وتُستخدم لتجهيز صفحتك في المنصة.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      {partnerType === 'guide'
                        ? 'الاسم المهني للمرشد السياحي (بالعربية) *'
                        : partnerType === 'transport' && transportSubtype === 'car_owner'
                          ? 'اسم السائق / وصف السيارة للعرض (بالعربية) *'
                          : 'اسم المنشأة أو العلامة التجارية (بالعربية) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={publicNameAr}
                      onChange={(e) => setPublicNameAr(e.target.value)}
                      placeholder={
                        partnerType === 'hotel'
                          ? 'مثال: فندق قصر النيل الملكي'
                          : partnerType === 'restaurant'
                            ? 'مثال: مطعم لا ميزون الجونة'
                            : partnerType === 'guide'
                              ? 'مثال: د. طارق زكي — خبير الآثار المصرية'
                              : 'مثال: أسطول القاهرة للنقل السياحي VIP'
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>الاسم بالإنجليزية (اختياري)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={publicNameEn}
                      onChange={(e) => setPublicNameEn(e.target.value)}
                      placeholder="e.g. Royal Nile Palace Hotel"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      المدينة / الوجهة السياحية الرئيسية *
                    </label>
                    <select
                      value={citySlug}
                      onChange={(e) => setCitySlug(e.target.value)}
                      className={`${inputClass} cursor-pointer font-bold`}
                    >
                      {cities.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      العنوان التفصيلي أو نقطة التمركز *
                    </label>
                    <input
                      type="text"
                      value={addressAr}
                      onChange={(e) => setAddressAr(e.target.value)}
                      placeholder="مثال: كورنيش النيل، الزمالك / مارينا الجونة"
                      className={inputClass}
                    />
                  </div>
                </div>

                {partnerType === 'hotel' && (
                  <HotelProviderScreen
                    starRating={starRating}
                    setStarRating={setStarRating}
                    roomsCount={roomsCount}
                    setRoomsCount={setRoomsCount}
                    nightlyPriceEgp={nightlyPriceEgp}
                    setNightlyPriceEgp={setNightlyPriceEgp}
                    hotelAmenities={hotelAmenities}
                    setHotelAmenities={setHotelAmenities}
                    toggleItem={toggleItem}
                  />
                )}

                {partnerType === 'restaurant' && (
                  <RestaurantProviderScreen
                    cuisineAr={cuisineAr}
                    setCuisineAr={setCuisineAr}
                    seatingCapacity={seatingCapacity}
                    setSeatingCapacity={setSeatingCapacity}
                    avgMealPriceEgp={avgMealPriceEgp}
                    setAvgMealPriceEgp={setAvgMealPriceEgp}
                    openingHours={openingHours}
                    setOpeningHours={setOpeningHours}
                    restaurantFeatures={restaurantFeatures}
                    setRestaurantFeatures={setRestaurantFeatures}
                    toggleItem={toggleItem}
                  />
                )}

                {partnerType === 'guide' && (
                  <GuideProviderScreen
                    yearsExperience={yearsExperience}
                    setYearsExperience={setYearsExperience}
                    dailyRateEgp={dailyRateEgp}
                    setDailyRateEgp={setDailyRateEgp}
                    guideLanguages={guideLanguages}
                    setGuideLanguages={setGuideLanguages}
                    guideSpecialties={guideSpecialties}
                    setGuideSpecialties={setGuideSpecialties}
                    toggleItem={toggleItem}
                  />
                )}

                {partnerType === 'transport' && (
                  <TransportProviderScreen
                    transportSubtype={transportSubtype}
                    fleetSize={fleetSize}
                    setFleetSize={setFleetSize}
                    startingPriceEgp={startingPriceEgp}
                    setStartingPriceEgp={setStartingPriceEgp}
                    companyVehicleClasses={companyVehicleClasses}
                    setCompanyVehicleClasses={setCompanyVehicleClasses}
                    carMakeModel={carMakeModel}
                    setCarMakeModel={setCarMakeModel}
                    carYear={carYear}
                    setCarYear={setCarYear}
                    plateNumber={plateNumber}
                    setPlateNumber={setPlateNumber}
                    seatsCount={seatsCount}
                    setSeatsCount={setSeatsCount}
                    luggageCapacity={luggageCapacity}
                    setLuggageCapacity={setLuggageCapacity}
                    rentalCarsCount={rentalCarsCount}
                    setRentalCarsCount={setRentalCarsCount}
                    depositEgp={depositEgp}
                    setDepositEgp={setDepositEgp}
                    rentalCategories={rentalCategories}
                    setRentalCategories={setRentalCategories}
                    rentalModes={rentalModes}
                    setRentalModes={setRentalModes}
                    toggleItem={toggleItem}
                  />
                )}

                <div>
                  <label className={labelClass}>
                    وصف مختصر للخدمة ومميزاتها التنافسية
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="اكتب نبذة مميزة توضح للمسافرين ولإدارة المنصة جودة الخدمة..."
                    className="w-full rounded-[22px] border border-[#D9E2F2] bg-white/80 px-5 py-4 text-right text-[15px] font-semibold text-[#14356E] outline-none transition placeholder:font-medium placeholder:text-[#93A7C9] hover:border-[#B9CDF0] focus:border-[#1685EC] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-[52px] rounded-full border border-[#D9E2F2] bg-white px-6 text-sm font-bold text-[#45618C] transition hover:bg-[#F6F9FF]"
                  >
                    → رجوع لاختيار القطاع
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex h-[52px] items-center gap-2 rounded-full bg-gradient-to-r from-[#2AA9E8] to-[#0C56CE] px-6 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(8,70,170,0.28)] transition hover:-translate-y-0.5"
                  >
                    <span>المتابعة لبيانات الترخيص والحساب</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5m7-7-7 7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <PartnerLegalStep
                partnerType={partnerType}
                transportSubtype={transportSubtype}
                publicNameAr={publicNameAr}
                legalName={legalName}
                setLegalName={setLegalName}
                registrationReference={registrationReference}
                setRegistrationReference={setRegistrationReference}
                applicantName={applicantName}
                setApplicantName={setApplicantName}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                submitting={submitting}
                onBack={() => setStep(2)}
              />
            )}
          </form>

          {/* Dev-only quick fill (not part of the design) */}
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={fillQuickDemoPartner}
              className="mt-6 w-full rounded-full border border-dashed border-[#B9CDF0] bg-[#F4F8FF] py-2.5 text-xs font-bold text-[#0B5AD2] transition hover:bg-[#EAF2FF]"
            >
              ⚡ تعبئة تلقائية للتجربة (وضع التطوير فقط)
            </button>
          )}
        </section>
      </div>

      {/* ===== Bottom features band — left side only, rounded right edge ===== */}
      <div className="relative z-10 mt-10 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-[44%] lg:max-w-[720px]">
        <div className="rounded-t-[40px] bg-gradient-to-t from-[#0A4C9E]/75 via-[#2F7FD0]/45 to-[#7FB8E8]/20 pt-6 backdrop-blur-sm lg:rounded-t-none lg:rounded-r-[70px]">
          <div dir="ltr" className="grid grid-cols-3 divide-x divide-white/25 px-4">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                dir="rtl"
                className="flex flex-col items-center gap-2 py-5 text-white"
              >
                <svg
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
                <span className="whitespace-pre-line text-center text-xs font-bold leading-6 sm:text-sm">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}