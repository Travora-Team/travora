import { HotelSvgAnimation } from '../../../providers/hotels';
import { RestaurantSvgAnimation } from '../../../providers/restaurants';
import { GuideSvgAnimation } from '../../../providers/guides';
import { TransportSvgAnimation } from '../../../providers/transport';

export function PartnerHeroSvg({ partnerType = 'hotel', transportSubtype = 'transport_company' }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#CBE4F9] bg-gradient-to-br from-[#EBF6FF] via-[#F5FAFF] to-[#E8FFFB] p-3.5 shadow-[0_8px_24px_rgba(0,153,255,0.08)]">
      <style>{`
        @keyframes trvFloatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes trvPulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes trvDashFlow {
          to { stroke-dashoffset: -48; }
        }
        @keyframes trvCompassSwing {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(22deg); }
        }
        @keyframes trvSteamRise {
          0% { transform: translateY(6px); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-9px); opacity: 0; }
        }
        .trv-float { animation: trvFloatSlow 4s ease-in-out infinite; }
        .trv-float-delayed { animation: trvFloatSlow 4.8s ease-in-out 1s infinite; }
        .trv-glow { animation: trvPulseGlow 3s ease-in-out infinite; transform-origin: center; }
        .trv-dash { stroke-dasharray: 6 6; animation: trvDashFlow 2s linear infinite; }
        .trv-compass { animation: trvCompassSwing 4.2s ease-in-out infinite; transform-origin: 180px 102px; }
        .trv-steam-1 { animation: trvSteamRise 2.5s ease-in-out infinite; }
        .trv-steam-2 { animation: trvSteamRise 2.5s ease-in-out 0.8s infinite; }
        .trv-steam-3 { animation: trvSteamRise 2.5s ease-in-out 1.6s infinite; }
      `}</style>

      <svg
        viewBox="0 0 360 198"
        className="w-full h-auto max-h-[175px] select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#00C8A8" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0099FF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00C8A8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="180" cy="100" r="88" fill="url(#auraGlow)" className="trv-glow" />
        <circle
          cx="180"
          cy="102"
          r="72"
          stroke="#0099FF"
          strokeOpacity="0.14"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        <g className="trv-glow">
          <path
            d="M48 34L50 40L56 42L50 44L48 50L46 44L40 42L46 40Z"
            fill="#FF8A00"
            opacity="0.85"
          />
          <path
            d="M312 36L313.5 40.5L318 42L313.5 43.5L312 48L310.5 43.5L306 42L310.5 40.5Z"
            fill="#0099FF"
            opacity="0.85"
          />
          <circle cx="80" cy="24" r="2.5" fill="#00C8A8" opacity="0.7" />
          <circle cx="282" cy="26" r="2.5" fill="#FF8A00" opacity="0.7" />
        </g>

        {partnerType === 'hotel' && <HotelSvgAnimation />}
        {partnerType === 'restaurant' && <RestaurantSvgAnimation />}
        {partnerType === 'guide' && <GuideSvgAnimation />}
        {partnerType === 'transport' && (
          <TransportSvgAnimation transportSubtype={transportSubtype} />
        )}
      </svg>

      <div className="mt-2 flex items-center justify-between border-t border-[#DCEBFA] pt-2 text-[11px]">
        <span className="flex items-center gap-1.5 font-extrabold text-[#0D2447]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00C8A8] animate-ping" />
          مرتبط مباشرة بلوحة تحكم الأدمن
        </span>
        <span className="rounded-full bg-white border border-[#BCE3FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
          {partnerType === 'hotel' && 'الفنادق والمنتجعات'}
          {partnerType === 'restaurant' && 'المطاعم والضيافة'}
          {partnerType === 'guide' && 'الإرشاد السياحي'}
          {partnerType === 'transport' &&
            (transportSubtype === 'car_owner'
              ? 'صاحب سيارة بسائق'
              : transportSubtype === 'car_rental'
                ? 'مكتب استئجار سيارات'
                : 'شركة نقل سياحي')}
        </span>
      </div>
    </div>
  );
}

export function CategoryAnimatedIcon({ type, active }) {
  const strokeColor = active ? '#0099FF' : '#64748B';
  const accentColor = active ? '#00C8A8' : '#94A3B8';

  if (type === 'hotel') {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0" fill="none">
        <rect
          x="10"
          y="10"
          width="28"
          height="30"
          rx="4"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill={active ? 'rgba(0,153,255,0.08)' : 'none'}
        />
        <path d="M16 6H32" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="16" y="16" width="5" height="5" rx="1" fill={accentColor} />
        <rect x="27" y="16" width="5" height="5" rx="1" fill={accentColor} />
        <rect x="16" y="25" width="5" height="5" rx="1" fill={strokeColor} />
        <rect x="27" y="25" width="5" height="5" rx="1" fill={strokeColor} />
        <path d="M21 40V33H27V40" stroke={strokeColor} strokeWidth="2.5" />
      </svg>
    );
  }

  if (type === 'restaurant') {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0" fill="none">
        <path
          d="M10 30C10 21 38 21 38 30H10Z"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill={active ? 'rgba(0,153,255,0.08)' : 'none'}
        />
        <circle cx="24" cy="18" r="3" stroke={accentColor} strokeWidth="2.2" />
        <path d="M6 34H42" stroke={accentColor} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M16 12C16 9 18 9 18 6" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M30 12C30 9 32 9 32 6" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'guide') {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0" fill="none">
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill={active ? 'rgba(0,153,255,0.08)' : 'none'}
        />
        <polygon points="24,13 28,24 24,21 20,24" fill={accentColor} />
        <polygon points="24,35 28,24 24,27 20,24" fill={strokeColor} />
        <circle cx="24" cy="24" r="2.5" fill="#FFF" stroke={strokeColor} strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0" fill="none">
      <path
        d="M8 28L12 18C13 15.5 15.5 14 18.5 14H29.5C32.5 14 35 15.5 36 18L40 28V35H8V28Z"
        stroke={strokeColor}
        strokeWidth="2.5"
        fill={active ? 'rgba(0,153,255,0.08)' : 'none'}
      />
      <circle cx="15" cy="35" r="4" fill="#FFF" stroke={accentColor} strokeWidth="2.5" />
      <circle cx="33" cy="35" r="4" fill="#FFF" stroke={accentColor} strokeWidth="2.5" />
      <path d="M14 23H34" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
