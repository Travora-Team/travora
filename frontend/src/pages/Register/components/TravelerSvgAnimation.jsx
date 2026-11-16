export function TravelerSvgAnimation() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#CBE4F9] bg-gradient-to-br from-[#EBF6FF] via-[#F5FAFF] to-[#E8FFFB] p-3.5 shadow-[0_8px_24px_rgba(0,153,255,0.08)]">
      <style>{`
        @keyframes trvPlaneFly {
          0%, 100% { transform: translate(0px, 0px) rotate(-3deg); }
          50% { transform: translate(-8px, -7px) rotate(2deg); }
        }
        @keyframes trvCardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes trvDashRoute {
          to { stroke-dashoffset: -48; }
        }
        @keyframes trvPulseRing {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .trv-plane { animation: trvPlaneFly 4.2s ease-in-out infinite; transform-origin: center; }
        .trv-card-float { animation: trvCardFloat 4s ease-in-out infinite; }
        .trv-card-float-delay { animation: trvCardFloat 4.6s ease-in-out 1.1s infinite; }
        .trv-route-dash { stroke-dasharray: 6 6; animation: trvDashRoute 2s linear infinite; }
        .trv-pulse-ring { animation: trvPulseRing 3s ease-in-out infinite; transform-origin: 180px 105px; }
      `}</style>

      <svg
        viewBox="0 0 360 198"
        className="w-full h-auto max-h-[175px] select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="trvSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#00C8A8" />
          </linearGradient>
          <linearGradient id="trvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
          <radialGradient id="trvAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0099FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C8A8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glowing Aura */}
        <circle cx="180" cy="105" r="86" fill="url(#trvAura)" className="trv-pulse-ring" />
        <circle
          cx="180"
          cy="105"
          r="70"
          stroke="#0099FF"
          strokeOpacity="0.16"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Pyramids & Nile Horizon */}
        <polygon points="48,162 88,104 128,162" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
        <polygon points="98,162 130,116 162,162" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
        <path
          d="M24 170 Q105 160 180 170 T336 170"
          stroke="url(#trvSkyGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          className="trv-route-dash"
        />

        {/* Animated Flight Path Arc */}
        <path
          d="M52 128 Q175 24 306 88"
          stroke="#0099FF"
          strokeWidth="2.2"
          fill="none"
          className="trv-route-dash"
        />

        {/* Central Instant Traveler Passport & Boarding Card */}
        <g className="trv-card-float">
          <rect
            x="128"
            y="54"
            width="112"
            height="104"
            rx="14"
            fill="#0D2447"
            stroke="url(#trvSkyGrad)"
            strokeWidth="2.5"
          />
          <rect x="142" y="68" width="84" height="14" rx="5" fill="#16376B" />
          <text x="184" y="78" textAnchor="middle" fill="#38BDF8" fontSize="7.5" fontWeight="bold">
            TRAVORA PASS
          </text>

          {/* Globe Emblem inside Pass */}
          <circle cx="184" cy="108" r="18" fill="none" stroke="url(#trvGoldGrad)" strokeWidth="2" />
          <ellipse cx="184" cy="108" rx="9" ry="18" fill="none" stroke="#38BDF8" strokeWidth="1.3" />
          <line x1="166" y1="108" x2="202" y2="108" stroke="#38BDF8" strokeWidth="1.3" />

          {/* Instant Verified Badge */}
          <rect x="142" y="134" width="84" height="15" rx="7.5" fill="#00C8A8" />
          <text x="184" y="144" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
            ✓ تفعيل فوري مباشر
          </text>
        </g>

        {/* Flying Jet Airplane */}
        <g className="trv-plane">
          <circle cx="278" cy="64" r="18" fill="#FFFFFF" stroke="#BCE3FF" strokeWidth="2" />
          <path
            d="M268 67L287 56L281 74L277 67L268 67Z"
            fill="#0099FF"
            stroke="#0077CC"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </g>

        {/* Floating Destination Pill */}
        <g className="trv-card-float-delay">
          <rect
            x="34"
            y="52"
            width="76"
            height="36"
            rx="10"
            fill="#FFFFFF"
            stroke="#BCE3FF"
            strokeWidth="1.8"
          />
          <text x="72" y="68" textAnchor="middle" fill="#0D2447" fontSize="8" fontWeight="bold">
            📍 +1000 وجهة
          </text>
          <text x="72" y="80" textAnchor="middle" fill="#0099FF" fontSize="7" fontWeight="bold">
            حجز فوري مباشر
          </text>
        </g>
      </svg>

      <div className="mt-2 flex items-center justify-between border-t border-[#DCEBFA] pt-2 text-[11px]">
        <span className="flex items-center gap-1.5 font-extrabold text-[#0D2447]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00C8A8] animate-ping" />
          تفعيل فوري عبر رمز التحقق (OTP)
        </span>
        <span className="rounded-full bg-white border border-[#99F6E4] px-2.5 py-0.5 text-[10px] font-extrabold text-[#00806B]">
          بدون انتظار موافقة إدارية
        </span>
      </div>
    </div>
  );
}
