import { REGISTER_CHANNELS } from '../models/registerModel';

function ChannelIcon({ id }) {
  if (id === 'EMAIL') {
    return (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === 'SMS') {
    return (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M12 18h.01" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    );
  }
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifyChannelSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#0D2447] mb-1.5">
        طريقة استلام رمز تفعيل الحساب (OTP)
      </label>
      <div className="grid grid-cols-3 gap-2">
        {REGISTER_CHANNELS.map((ch) => {
          const active = value === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onChange(ch.id)}
              className={`flex flex-col items-start rounded-xl border p-2.5 text-right transition ${
                active
                  ? 'border-[#0099FF] bg-[#EEF8FF]/80 text-[#0077CC] shadow-2xs'
                  : 'border-[#DCEBFA] bg-[#F8FAFC] text-[#475569] hover:bg-white'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className={active ? 'text-[#0099FF]' : 'text-[#94A3B8]'}>
                  <ChannelIcon id={ch.id} />
                </span>
                <span
                  className={`size-3.5 rounded-full border flex items-center justify-center ${
                    active ? 'border-[#0099FF] bg-[#0099FF]' : 'border-[#CBD5E1]'
                  }`}
                >
                  {active && <span className="size-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <span className="mt-1.5 text-[11px] font-black text-[#0D2447]">{ch.label}</span>
              <span className="text-[10px] text-[#64748B] truncate w-full">{ch.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
