export function GuideSvgAnimation() {
  return (
    <g>
      {/* Pyramids & Landmarks Backdrop */}
      <polygon
        points="42,166 92,92 142,166"
        fill="#FEF3C7"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      <polygon
        points="218,166 266,98 314,166"
        fill="#E0F2FE"
        stroke="#0099FF"
        strokeWidth="2"
      />

      {/* Animated Tour Route */}
      <path
        d="M38 170 Q115 138 180 164 T322 154"
        stroke="url(#cyanGrad)"
        strokeWidth="3"
        fill="none"
        className="trv-dash"
      />

      {/* Central Egyptology Compass */}
      <circle
        cx="180"
        cy="102"
        r="54"
        fill="#0D2447"
        stroke="url(#cyanGrad)"
        strokeWidth="3"
      />
      <circle
        cx="180"
        cy="102"
        r="45"
        fill="none"
        stroke="#38BDF8"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeDasharray="4 4"
      />

      <text x="180" y="64" textAnchor="middle" fill="#FDE68A" fontSize="8.5" fontWeight="bold">
        N
      </text>
      <text x="180" y="147" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontWeight="bold">
        S
      </text>
      <text x="221" y="105" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontWeight="bold">
        E
      </text>
      <text x="139" y="105" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontWeight="bold">
        W
      </text>

      {/* Swinging Compass Needle */}
      <g className="trv-compass" style={{ transformOrigin: '180px 102px' }}>
        <polygon points="180,64 187,102 180,96 173,102" fill="url(#goldGrad)" />
        <polygon points="180,140 187,102 180,108 173,102" fill="url(#cyanGrad)" />
        <circle cx="180" cy="102" r="5" fill="#FFFFFF" />
      </g>

      <g className="trv-float">
        <rect x="125" y="166" width="110" height="22" rx="11" fill="url(#emeraldGrad)" />
        <text x="180" y="180" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">
          مرشد سياحي مرخص ✓
        </text>
      </g>
    </g>
  );
}
