import { RESTAURANT_FEATURES } from '../models/restaurantModel';

export function RestaurantFieldsForm({
  cuisineAr,
  setCuisineAr,
  seatingCapacity,
  setSeatingCapacity,
  avgMealPriceEgp,
  setAvgMealPriceEgp,
  openingHours,
  setOpeningHours,
  restaurantFeatures,
  setRestaurantFeatures,
  toggleItem,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            نوع المطبخ الرئيسي
          </label>
          <input
            type="text"
            value={cuisineAr}
            onChange={(e) => setCuisineAr(e.target.value)}
            placeholder="مثال: مأكولات بحرية / مصري تراثي"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            السعة الاستيعابية (عدد المقاعد)
          </label>
          <input
            type="number"
            min="5"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            متوسط تكلفة الفرد (ج.م)
          </label>
          <input
            type="number"
            min="100"
            value={avgMealPriceEgp}
            onChange={(e) => setAvgMealPriceEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          ساعات العمل اليومية
        </label>
        <input
          type="text"
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          مزايا المطعم والضيافة
        </label>
        <div className="flex flex-wrap gap-2">
          {RESTAURANT_FEATURES.map((item) => {
            const active = restaurantFeatures.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(restaurantFeatures, setRestaurantFeatures, item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
