import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { partnerRegisterApi } from '../api/partnerRegisterApi';
import { DEFAULT_CITIES, buildPartnerDetailsPayload } from '../models/partnerRegisterModel';
import { PartnerSideShowcase } from '../components/PartnerSideShowcase';
import { PartnerCategoryStep } from '../components/PartnerCategoryStep';
import { PartnerLegalStep } from '../components/PartnerLegalStep';
import { PartnerSuccessCard } from '../components/PartnerSuccessCard';
import { HotelProviderScreen } from '../../../providers/hotels';
import { RestaurantProviderScreen } from '../../../providers/restaurants';
import { GuideProviderScreen } from '../../../providers/guides';
import { TransportProviderScreen } from '../../../providers/transport';

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
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0D2447] pt-24 pb-8 px-3 sm:px-6 font-['Cairo']"
    >
      <div className="mx-auto max-w-5xl">
        {/* Unified Top Mode Switcher Strip (Matches Login & Traveler Register) */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCEBFA] bg-white/90 px-3.5 py-2 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Link
              to="/register"
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#475569] hover:bg-[#F2F7FD] hover:text-[#0099FF] transition"
            >
              ✈️ تسجيل مسافر عادي (تفعيل فوري)
            </Link>
            <span className="rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-3 py-1.5 text-xs font-extrabold text-white shadow-2xs">
              🏨 تسجيل مزود خدمة (بموافقة الأدمن)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/login"
              className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 font-extrabold text-[#0077CC] hover:bg-[#EEF8FF] transition"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          <PartnerSideShowcase partnerType={partnerType} transportSubtype={transportSubtype} />

          <section className="lg:col-span-7 rounded-3xl bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)] border border-[#DCEBFA]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-1.5">
                {[
                  { num: 1, label: 'نوع الخدمة' },
                  { num: 2, label: 'التفاصيل التشغيلية' },
                  { num: 3, label: 'الترخيص والحساب' },
                ].map((s) => {
                  const active = step === s.num;
                  const done = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setStep(s.num)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition ${
                        active
                          ? 'bg-[#0099FF] text-white shadow-2xs'
                          : done
                            ? 'bg-[#E8FFFB] text-[#00806B] border border-[#99F6E4]'
                            : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px]">
                        {done ? '✓' : s.num}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={fillQuickDemoPartner}
                className="rounded-xl border border-[#BCE3FF] bg-[#EEF8FF] px-2.5 py-1 text-[11px] font-extrabold text-[#0077CC] transition hover:bg-[#D8EFFF]"
              >
                ⚡ تعبئة تلقائية للتجربة
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {step === 1 && (
                <PartnerCategoryStep
                  partnerType={partnerType}
                  setPartnerType={setPartnerType}
                  transportSubtype={transportSubtype}
                  setTransportSubtype={setTransportSubtype}
                  onNext={handleNextStep}
                />
              )}

              {step === 2 && (
                <div className="space-y-3.5">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#0D2447]">
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
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      هذه المعلومات تُعرض للإدارة عند مراجعة طلبك وتُستخدم لتجهيز صفحتك في المنصة.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#0D2447] mb-1">
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
                        className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D2447] mb-1">
                        الاسم بالإنجليزية (اختياري)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={publicNameEn}
                        onChange={(e) => setPublicNameEn(e.target.value)}
                        placeholder="e.g. Royal Nile Palace Hotel"
                        className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#0D2447] mb-1">
                        المدينة / الوجهة السياحية الرئيسية *
                      </label>
                      <select
                        value={citySlug}
                        onChange={(e) => setCitySlug(e.target.value)}
                        className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs font-bold focus:border-[#0099FF] focus:bg-white focus:outline-none"
                      >
                        {cities.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D2447] mb-1">
                        العنوان التفصيلي أو نقطة التمركز *
                      </label>
                      <input
                        type="text"
                        value={addressAr}
                        onChange={(e) => setAddressAr(e.target.value)}
                        placeholder="مثال: كورنيش النيل، الزمالك / مارينا الجونة"
                        className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
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
                    <label className="block text-xs font-bold text-[#0D2447] mb-1">
                      وصف مختصر للخدمة ومميزاتها التنافسية
                    </label>
                    <textarea
                      rows={2}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="اكتب نبذة مميزة توضح للمسافرين ولإدارة المنصة جودة الخدمة..."
                      className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-2 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-10 rounded-xl border border-[#DCEBFA] bg-white px-4 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC]"
                    >
                      → رجوع لاختيار القطاع
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#0099FF] px-5 text-xs font-extrabold text-white shadow-[0_6px_18px_rgba(20,158,247,0.22)] transition hover:-translate-y-0.5"
                    >
                      <span>المتابعة لبيانات الترخيص والحساب</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              )}

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
          </section>
        </div>
      </div>
    </div>
  );
}
