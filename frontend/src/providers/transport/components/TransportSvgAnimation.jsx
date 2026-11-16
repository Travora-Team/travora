export function TransportSvgAnimation({ transportSubtype = 'transport_company' }) {
  return (
    <g>
      {/* Highway Road & Animated Lane Dashes */}
      <line
        x1="26"
        y1="166"
        x2="334"
        y2="166"
        stroke="#CBD5E1"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="175"
        x2="324"
        y2="175"
        stroke="#0099FF"
        strokeWidth="2.5"
        className="trv-dash"
      />

      {/* Animated GPS Route Arc */}
      <path
        d="M60 62 Q180 20 300 62"
        stroke="url(#cyanGrad)"
        strokeWidth="2.5"
        fill="none"
        className="trv-dash"
      />
      <g className="trv-float">
        <circle cx="60" cy="62" r="8" fill="#0099FF" />
        <circle cx="60" cy="62" r="3.5" fill="#FFF" />
        <circle cx="300" cy="62" r="8" fill="#00C8A8" />
        <circle cx="300" cy="62" r="3.5" fill="#FFF" />
      </g>

      {/* Dynamic Subtype Pill */}
      <g className="trv-float-delayed">
        <rect
          x="105"
          y="34"
          width="150"
          height="24"
          rx="12"
          fill="#FFFFFF"
          stroke="#BCE3FF"
          strokeWidth="1.8"
        />
        <text x="180" y="49" textAnchor="middle" fill="#0D2447" fontSize="8.5" fontWeight="bold">
          {transportSubtype === 'car_owner'
            ? '🚘 سيارة خاصة بسائق معتمد'
            : transportSubtype === 'car_rental'
              ? '🔑 مكتب تأجير سيارات حديثة'
              : '🚐 أسطول نقل سياحي وليموزين VIP'}
        </text>
      </g>

      {/* Animated Luxury Vehicle */}
      <g className="trv-float">
        <polygon points="278,124 334,110 334,146" fill="url(#goldGrad)" opacity="0.35" />

        <path
          d="M82 138 L98 112 C106 98, 122 92, 146 92 L212 92 C232 92, 246 102, 258 118 L280 122 C288 124, 292 130, 292 138 L292 150 C292 154, 288 156, 282 156 L82 156 C76 156, 72 152, 72 146 C72 140, 76 138, 82 138 Z"
          fill="#0D2447"
          stroke="#0099FF"
          strokeWidth="2"
        />
        <path d="M114 116 L126 99 L174 99 L174 116 Z" fill="#E0F2FE" />
        <path d="M180 116 L180 99 L216 99 L236 116 Z" fill="#E0F2FE" />

        <line
          x1="88"
          y1="132"
          x2="276"
          y2="132"
          stroke="url(#cyanGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Wheels */}
        <g>
          <circle cx="122" cy="156" r="15" fill="#0F172A" stroke="url(#goldGrad)" strokeWidth="3" />
          <circle cx="122" cy="156" r="5.5" fill="#38BDF8" />
          <circle cx="244" cy="156" r="15" fill="#0F172A" stroke="url(#goldGrad)" strokeWidth="3" />
          <circle cx="244" cy="156" r="5.5" fill="#38BDF8" />
        </g>
      </g>
    </g>
  );
}
