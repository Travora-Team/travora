export function LoginSvgAnimation({ loginMode = 'otp' }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#CBE4F9] bg-gradient-to-br from-[#EBF6FF] via-[#F5FAFF] to-[#E8FFFB] p-3.5 shadow-[0_8px_24px_rgba(0,153,255,0.08)]">
      <style>{`
        @keyframes trvShieldFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes trvRadarPulse {
          0%, 100% { transform: scale(0.96); opacity: 0.45; }
          50% { transform: scale(1.06); opacity: 0.95; }
        }
        @keyframes trvOrbitDash {
          to { stroke-dashoffset: -48; }
        }
        .trv-shield { animation: trvShieldFloat 4s ease-in-out infinite; }
        .trv-shield-delay { animation: trvShieldFloat 4.8s ease-in-out 1.2s infinite; }
        .trv-radar { animation: trvRadarPulse 3.2s ease-in-out infinite; transform-origin: 180px 102px; }
        .trv-orbit { stroke-dasharray: 6 6; animation: trvOrbitDash 2.2s linear infinite; }
      `}</style>

      <svg
        viewBox="0 0 360 198"
        className="w-full h-auto max-h-[175px] select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loginBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#00C8A8" />
          </linearGradient>
          <linearGradient id="loginGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
          <radialGradient id="loginAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0099FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C8A8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated Radar Rings */}
        <circle cx="180" cy="102" r="84" fill="url(#loginAura)" className="trv-radar" />
        <circle
          cx="180"
          cy="102"
          r="66"
          stroke="#0099FF"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          className="trv-orbit"
        />

        {/* Animated Route Arc */}
        <path
          d="M44 156 Q180 128 316 156"
          stroke="url(#loginBlueGrad)"
          strokeWidth="2.5"
          fill="none"
          className="trv-orbit"
        />

        {/* Central Smart Security Portal & Shield */}
        <g className="trv-shield">
          <path
            d="M180 42L228 60V102C228 136 206 160 180 172C154 160 132 136 132 102V60L180 42Z"
            fill="#0D2447"
            stroke="url(#loginBlueGrad)"
            strokeWidth="2.5"
          />
          <circle cx="180" cy="98" r="22" fill="#16376B" stroke="#38BDF8" strokeWidth="1.5" />
          <path
            d="M171 98L177 104L190 91"
            stroke="#00C8A8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="150" y="130" width="60" height="14" rx="7" fill="url(#loginGoldGrad)" />
          <text x="180" y="140" textAnchor="middle" fill="#0D2447" fontSize="7.5" fontWeight="bold">
            {loginMode === 'otp' ? '2FA OTP' : 'FAST LOGIN'}
          </text>
        </g>

        {/* Floating OTP Code Card (Left) */}
        <g className="trv-shield-delay">
          <rect
            x="30"
            y="64"
            width="82"
            height="42"
            rx="11"
            fill="#FFFFFF"
            stroke="#BCE3FF"
            strokeWidth="1.8"
          />
          <text x="71" y="81" textAnchor="middle" fill="#64748B" fontSize="7" fontWeight="bold">
            رمز الأمان الذكي
          </text>
          <text
            x="71"
            y="96"
            textAnchor="middle"
            fill="#0099FF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
          >
            849•210
          </text>

          {/* Floating Trip Status Card (Right) */}
          <rect
            x="248"
            y="64"
            width="82"
            height="42"
            rx="11"
            fill="#FFFFFF"
            stroke="#99F6E4"
            strokeWidth="1.8"
          />
          <text x="289" y="81" textAnchor="middle" fill="#00806B" fontSize="7.5" fontWeight="bold">
            ✈️ رحلاتي وحجوزاتي
          </text>
          <text x="289" y="95" textAnchor="middle" fill="#0D2447" fontSize="7.5" fontWeight="bold">
            مزامنة لحظية ✓
          </text>
        </g>
      </svg>

      <div className="mt-2 flex items-center justify-between border-t border-[#DCEBFA] pt-2 text-[11px]">
        <span className="flex items-center gap-1.5 font-extrabold text-[#0D2447]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#0099FF] animate-ping" />
          جلسة مشفرة ومحمية بالكامل
        </span>
        <span className="rounded-full bg-white border border-[#BCE3FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0077CC]">
          {loginMode === 'otp' ? 'تحقق ثنائي متعدد القنوات' : 'دخول مباشر بكلمة المرور'}
        </span>
      </div>
    </div>
  );
}
