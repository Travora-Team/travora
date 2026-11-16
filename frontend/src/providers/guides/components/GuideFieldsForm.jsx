import { GUIDE_LANGUAGES, GUIDE_SPECIALTIES } from '../models/guideModel';

export function GuideFieldsForm({
  yearsExperience,
  setYearsExperience,
  dailyRateEgp,
  setDailyRateEgp,
  guideLanguages,
  setGuideLanguages,
  guideSpecialties,
  setGuideSpecialties,
  toggleItem,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            سنوات الخبرة في الإرشاد السياحي
          </label>
          <input
            type="number"
            min="1"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            السعر اليومي للجولة الخاصة (ج.م)
          </label>
          <input
            type="number"
            min="300"
            value={dailyRateEgp}
            onChange={(e) => setDailyRateEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          اللغات التي تتحدثها بطلاقة مع الأفواج السياحية
        </label>
        <div className="flex flex-wrap gap-2">
          {GUIDE_LANGUAGES.map((lang) => {
            const active = guideLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleItem(guideLanguages, setGuideLanguages, lang)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          التخصصات الإرشادية والمسارات التاريخية
        </label>
        <div className="flex flex-wrap gap-2">
          {GUIDE_SPECIALTIES.map((spec) => {
            const active = guideSpecialties.includes(spec);
            return (
              <button
                key={spec}
                type="button"
                onClick={() => toggleItem(guideSpecialties, setGuideSpecialties, spec)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {spec}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
