import { RENTAL_CAR_CATEGORIES, RENTAL_MODES } from '../models/transportModel';

export function CarRentalFields({
  rentalCarsCount,
  setRentalCarsCount,
  startingPriceEgp,
  setStartingPriceEgp,
  depositEgp,
  setDepositEgp,
  rentalCategories,
  setRentalCategories,
  rentalModes,
  setRentalModes,
  toggleItem,
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            عدد السيارات المتاحة للإيجار
          </label>
          <input
            type="number"
            min="1"
            value={rentalCarsCount}
            onChange={(e) => setRentalCarsCount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            الإيجار اليومي يبدأ من (ج.م)
          </label>
          <input
            type="number"
            min="300"
            value={startingPriceEgp}
            onChange={(e) => setStartingPriceEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            مبلغ التأمين المسترد (ج.م)
          </label>
          <input
            type="number"
            min="0"
            value={depositEgp}
            onChange={(e) => setDepositEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          فئات السيارات المتوفرة للإيجار
        </label>
        <div className="flex flex-wrap gap-2">
          {RENTAL_CAR_CATEGORIES.map((cat) => {
            const active = rentalCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleItem(rentalCategories, setRentalCategories, cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          أنظمة ومزايا التأجير المتاحة للعملاء
        </label>
        <div className="flex flex-wrap gap-2">
          {RENTAL_MODES.map((mode) => {
            const active = rentalModes.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => toggleItem(rentalModes, setRentalModes, mode)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {mode}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
