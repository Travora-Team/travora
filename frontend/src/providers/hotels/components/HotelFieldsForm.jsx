import { HOTEL_AMENITIES } from '../models/hotelModel';

export function HotelFieldsForm({
  starRating,
  setStarRating,
  roomsCount,
  setRoomsCount,
  nightlyPriceEgp,
  setNightlyPriceEgp,
  hotelAmenities,
  setHotelAmenities,
  toggleItem,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            تصنيف النجوم السياحي
          </label>
          <div className="flex items-center gap-1.5">
            {[3, 4, 5].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setStarRating(stars)}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                  starRating === stars
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {stars} ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            عدد الغرف والأجنحة
          </label>
          <input
            type="number"
            min="1"
            value={roomsCount}
            onChange={(e) => setRoomsCount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            متوسط سعر الليلة (ج.م)
          </label>
          <input
            type="number"
            min="200"
            value={nightlyPriceEgp}
            onChange={(e) => setNightlyPriceEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          المرافق والخدمات المتوفرة في الفندق (اختر ما ينطبق)
        </label>
        <div className="flex flex-wrap gap-2">
          {HOTEL_AMENITIES.map((item) => {
            const active = hotelAmenities.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(hotelAmenities, setHotelAmenities, item)}
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
