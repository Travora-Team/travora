import React from 'react';

export function HotelSvgAnimation() {
  return (
    <g>
      {/* Animated Nile/Red Sea turquoise waves */}
      <path
        d="M20 176 Q95 166 180 176 T340 176"
        stroke="url(#cyanGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        className="trv-dash"
      />
      <path
        d="M40 186 Q120 178 190 186 T320 186"
        stroke="#00C8A8"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 5 Floating Golden Stars */}
      <g className="trv-float">
        {[124, 152, 180, 208, 236].map((cx, i) => (
          <g key={cx} transform={`translate(${cx}, ${28 - (2 - Math.abs(2 - i)) * 4})`}>
            <polygon
              points="0,-7 2,-2 7,-2 3,1 4.5,6 0,3 -4.5,6 -3,1 -7,-2 -2,-2"
              fill="url(#goldGrad)"
            />
          </g>
        ))}
      </g>

      {/* Side Resort Wings */}
      <rect
        x="74"
        y="86"
        width="48"
        height="82"
        rx="8"
        fill="#FFFFFF"
        stroke="#BCE3FF"
        strokeWidth="2"
      />
      <rect
        x="238"
        y="86"
        width="48"
        height="82"
        rx="8"
        fill="#FFFFFF"
        stroke="#BCE3FF"
        strokeWidth="2"
      />

      {/* Main Luxury Hotel Tower */}
      <rect
        x="118"
        y="50"
        width="124"
        height="118"
        rx="10"
        fill="#0D2447"
        stroke="url(#cyanGrad)"
        strokeWidth="2.5"
      />
      <path d="M138 50 C138 30, 222 30, 222 50 Z" fill="url(#cyanGrad)" />
      <rect x="150" y="40" width="60" height="13" rx="6.5" fill="#0D2447" stroke="#38BDF8" strokeWidth="1" />
      <text
        x="180"
        y="49"
        textAnchor="middle"
        fill="#38BDF8"
        fontSize="7.5"
        fontWeight="bold"
        letterSpacing="1"
      >
        5★ RESORT
      </text>

      {/* Animated Glowing Windows */}
      {[64, 86, 108].map((y, rIdx) =>
        [135, 158, 181, 204].map((x, cIdx) => (
          <rect
            key={`${rIdx}-${cIdx}`}
            x={x}
            y={y}
            width="15"
            height="14"
            rx="3"
            fill={(rIdx + cIdx) % 2 === 0 ? 'url(#goldGrad)' : '#38BDF8'}
          >
            <animate
              attributeName="opacity"
              values="0.35;1;0.35"
              dur={`${1.8 + ((rIdx + cIdx) % 3) * 0.6}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))
      )}

      {[98, 118, 138].map((y) => (
        <React.Fragment key={y}>
          <rect x="86" y={y} width="24" height="10" rx="2.5" fill="#E0F2FE" />
          <rect x="250" y={y} width="24" height="10" rx="2.5" fill="#E0F2FE" />
        </React.Fragment>
      ))}

      {/* Grand Royal Arch Entrance */}
      <path d="M158 168 V142 C158 130, 202 130, 202 142 V168 Z" fill="url(#goldGrad)" />
      <path d="M165 168 V145 C165 136, 195 136, 195 145 V168 Z" fill="#0D2447" />
      <line
        x1="56"
        y1="168"
        x2="304"
        y2="168"
        stroke="#0099FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
