export function CarOwnerFields({
  carMakeModel,
  setCarMakeModel,
  carYear,
  setCarYear,
  plateNumber,
  setPlateNumber,
  seatsCount,
  setSeatsCount,
  luggageCapacity,
  setLuggageCapacity,
  startingPriceEgp,
  setStartingPriceEgp,
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ماركة وموديل السيارة *
          </label>
          <input
            type="text"
            value={carMakeModel}
            onChange={(e) => setCarMakeModel(e.target.value)}
            placeholder="مثال: مرسيدس E200 / تويوتا فورتشنر"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            سنة الصنع
          </label>
          <input
            type="number"
            min="2015"
            max="2027"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            رقم لوحة السيارة
          </label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="ق هـ ر - 114"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            عدد مقاعد الركاب
          </label>
          <input
            type="number"
            min="1"
            max="15"
            value={seatsCount}
            onChange={(e) => setSeatsCount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            سعة الحقائب
          </label>
          <input
            type="number"
            min="1"
            max="15"
            value={luggageCapacity}
            onChange={(e) => setLuggageCapacity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            سعر الجولة أو التوصيلة يبدأ من (ج.م)
          </label>
          <input
            type="number"
            min="150"
            value={startingPriceEgp}
            onChange={(e) => setStartingPriceEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>
    </>
  );
}
