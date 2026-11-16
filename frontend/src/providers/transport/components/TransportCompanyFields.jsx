import { COMPANY_VEHICLE_CLASSES } from '../models/transportModel';

export function TransportCompanyFields({
  fleetSize,
  setFleetSize,
  startingPriceEgp,
  setStartingPriceEgp,
  companyVehicleClasses,
  setCompanyVehicleClasses,
  toggleItem,
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            حجم الأسطول (عدد المركبات العاملة)
          </label>
          <input
            type="number"
            min="1"
            value={fleetSize}
            onChange={(e) => setFleetSize(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            سعر البداية للتوصيلة / الاستقبال (ج.م)
          </label>
          <input
            type="number"
            min="200"
            value={startingPriceEgp}
            onChange={(e) => setStartingPriceEgp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          فئات المركبات المتوفرة في الأسطول
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPANY_VEHICLE_CLASSES.map((vc) => {
            const active = companyVehicleClasses.includes(vc);
            return (
              <button
                key={vc}
                type="button"
                onClick={() => toggleItem(companyVehicleClasses, setCompanyVehicleClasses, vc)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {vc}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
