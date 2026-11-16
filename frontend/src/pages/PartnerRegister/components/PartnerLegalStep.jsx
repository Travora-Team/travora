export function PartnerLegalStep({
  partnerType,
  transportSubtype,
  publicNameAr,
  legalName,
  setLegalName,
  registrationReference,
  setRegistrationReference,
  applicantName,
  setApplicantName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  acceptTerms,
  setAcceptTerms,
  submitting,
  onBack,
}) {
  return (
    <div className="space-y-3.5">
      <div>
        <h2 className="text-base sm:text-lg font-black text-[#0D2447]">
          البيانات القانونية وبيانات التواصل للموافقة
        </h2>
        <p className="mt-0.5 text-xs text-[#64748B]">
          تُستخدم هذه البيانات من قِبل إدارة المنصة للتحقق من الموثوقية وإشعارك فور تفعيل حسابك.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            {partnerType === 'guide' ||
            (partnerType === 'transport' && transportSubtype === 'car_owner')
              ? 'الاسم القانوني الرباعي كما في البطاقة / الرخصة *'
              : 'الاسم القانوني الرسمي في السجل التجاري *'}
          </label>
          <input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder={publicNameAr || 'شركة ... للسياحة والفنادق ش.م.م'}
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            {partnerType === 'guide'
              ? 'رقم ترخيص وزارة السياحة / نقابة المرشدين *'
              : partnerType === 'transport' && transportSubtype === 'car_owner'
                ? 'رقم رخصة القيادة المهنية / تسيير المركبة *'
                : 'رقم السجل التجاري أو ترخيص السياحة *'}
          </label>
          <input
            type="text"
            dir="ltr"
            value={registrationReference}
            onChange={(e) => setRegistrationReference(e.target.value)}
            placeholder={partnerType === 'guide' ? 'LIC-GUIDE-8841' : 'CR-EG-409120'}
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs font-mono focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            اسم المسؤول عن التواصل وإدارة الحساب *
          </label>
          <input
            type="text"
            required
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="الاسم الكامل للمسؤول"
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            رقم الهاتف / الواتساب الرسمي *
          </label>
          <input
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+201012345678"
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            البريد الإلكتروني الرسمي للدخول والتنبيهات *
          </label>
          <input
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@company.eg"
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0D2447] mb-1">
            كلمة المرور لحساب الشريك (8 أحرف على الأقل)
          </label>
          <input
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-9 w-full rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 text-xs focus:border-[#0099FF] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-start gap-2 rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[#BCE3FF] accent-[#0099FF]"
        />
        <span className="text-[11px] text-[#475569] leading-relaxed">
          أقر بصحة البيانات والتراخيص المسجلة وأوافق على{' '}
          <strong className="text-[#0D2447]">ميثاق جودة شركاء منصة ترافورا</strong> ومراجعة الطلب من
          قِبل إدارة المنصة قبل التفعيل.
        </span>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="h-10 rounded-xl border border-[#DCEBFA] bg-white px-4 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC]"
        >
          → رجوع لتفاصيل الخدمة
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#149EF7] to-[#00C8A8] px-6 text-xs font-black text-white shadow-[0_8px_20px_rgba(0,153,255,0.24)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? (
            <span>جاري إرسال الطلب للوحة تحكم الإدارة...</span>
          ) : (
            <>
              <span>إرسال طلب الشراكة للمراجعة والاعتماد</span>
              <span>✓</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
