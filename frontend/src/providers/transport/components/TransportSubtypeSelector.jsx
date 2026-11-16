import { TRANSPORT_SUBTYPES } from '../models/transportModel';

export function TransportSubtypeSelector({ transportSubtype, setTransportSubtype }) {
  return (
    <div className="rounded-2xl border border-[#DCEBFA] bg-[#F8FAFC] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-[#0D2447]">
          حدد طبيعة نشاط النقل والسيارات لديك:
        </h3>
        <span className="text-[10px] font-extrabold text-[#0099FF]">3 فئات متاحة</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {TRANSPORT_SUBTYPES.map((sub) => {
          const activeSub = transportSubtype === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setTransportSubtype(sub.id)}
              className={`flex flex-col justify-between rounded-xl border p-2.5 text-right transition ${
                activeSub
                  ? 'border-[#0099FF] bg-[#EEF8FF]/80 shadow-2xs'
                  : 'border-[#DCEBFA] bg-white hover:border-[#0099FF]/50'
              }`}
            >
              <div>
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                    activeSub
                      ? 'bg-[#0099FF] text-white'
                      : 'bg-[#FFF5EB] text-[#CC6D00] border border-[#FED7AA]'
                  }`}
                >
                  {sub.tag}
                </span>
                <div className="mt-1.5 text-xs font-black text-[#0D2447]">{sub.title}</div>
                <p className="mt-0.5 text-[10px] text-[#64748B] leading-relaxed">{sub.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
