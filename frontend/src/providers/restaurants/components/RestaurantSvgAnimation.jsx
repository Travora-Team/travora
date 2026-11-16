export function RestaurantSvgAnimation() {
  return (
    <g>
      {/* Rising Animated Aroma Steam */}
      <path
        d="M154 64 C148 50, 162 42, 155 26"
        stroke="url(#goldGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        className="trv-steam-1"
      />
      <path
        d="M180 58 C174 42, 188 34, 180 18"
        stroke="#0099FF"
        strokeWidth="3"
        strokeLinecap="round"
        className="trv-steam-2"
      />
      <path
        d="M206 64 C200 50, 214 42, 207 26"
        stroke="#00C8A8"
        strokeWidth="3"
        strokeLinecap="round"
        className="trv-steam-3"
      />

      {/* Floating Royal Cloche Dome */}
      <g className="trv-float">
        <circle cx="180" cy="70" r="9" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="3.5" />
        <path
          d="M104 140 C104 88, 256 88, 256 140 Z"
          fill="#0D2447"
          stroke="url(#cyanGrad)"
          strokeWidth="2.5"
        />
        <path
          d="M124 130 C130 102, 170 94, 194 96"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <rect x="90" y="140" width="180" height="11" rx="5.5" fill="url(#goldGrad)" />
        <path d="M110 151 L250 151 L236 162 L124 162 Z" fill="#BCE3FF" />
      </g>

      {/* Floating Side Badges */}
      <g className="trv-float-delayed">
        <rect
          x="36"
          y="82"
          width="50"
          height="54"
          rx="12"
          fill="#FFFFFF"
          stroke="#BCE3FF"
          strokeWidth="2"
        />
        <text x="61" y="108" textAnchor="middle" fill="#FF8A00" fontSize="15">
          ★
        </text>
        <text x="61" y="124" textAnchor="middle" fill="#0D2447" fontSize="7.5" fontWeight="bold">
          FINE DINING
        </text>

        <rect
          x="274"
          y="82"
          width="50"
          height="54"
          rx="12"
          fill="#FFFFFF"
          stroke="#99F6E4"
          strokeWidth="2"
        />
        <text x="299" y="108" textAnchor="middle" fill="#00C8A8" fontSize="14">
          ♛
        </text>
        <text x="299" y="124" textAnchor="middle" fill="#0D2447" fontSize="7.5" fontWeight="bold">
          VIP TABLE
        </text>
      </g>

      <path
        d="M60 178 H300"
        stroke="url(#cyanGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="trv-dash"
      />
    </g>
  );
}
