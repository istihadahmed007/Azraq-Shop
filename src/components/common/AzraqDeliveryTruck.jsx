import React from 'react';

/**
 * AZRAQ Official 3D-Styled Delivery Truck Graphic
 * Vector SVG matching the light-blue / royal-blue aesthetic of the reference design.
 * Features:
 * - 3/4 perspective delivery truck in AZRAQ corporate cyan & navy blue
 * - Authentic AZRAQ wordmark on the cargo container
 * - Dynamic wind/motion speed lines
 * - Scalable, crisp on high-DPI displays
 */
export default function AzraqDeliveryTruck({ className = "w-36 h-24", animated = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(8,119,201,0.22)]"
      >
        <defs>
          {/* Main Truck Box Gradient */}
          <linearGradient id="azraqBoxGrad" x1="40" y1="30" x2="175" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#258CE6" />
            <stop offset="60%" stopColor="#0877C9" />
            <stop offset="100%" stopColor="#065A9C" />
          </linearGradient>

          {/* Truck Box Top Gradient */}
          <linearGradient id="azraqBoxTopGrad" x1="40" y1="20" x2="160" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5CBDF5" />
            <stop offset="100%" stopColor="#258CE6" />
          </linearGradient>

          {/* Truck Cab Gradient */}
          <linearGradient id="azraqCabGrad" x1="165" y1="50" x2="225" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B9EEA" />
            <stop offset="50%" stopColor="#0A77C8" />
            <stop offset="100%" stopColor="#064E88" />
          </linearGradient>

          {/* Windshield Gradient */}
          <linearGradient id="azraqWindshield" x1="185" y1="55" x2="215" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>

          {/* Soft Ground Shadow */}
          <radialGradient id="truckShadow" cx="120" cy="140" r="100" fx="120" fy="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(8, 119, 201, 0.35)" />
            <stop offset="70%" stopColor="rgba(8, 119, 201, 0.08)" />
            <stop offset="100%" stopColor="rgba(8, 119, 201, 0)" />
          </radialGradient>
        </defs>

        {/* Dynamic Motion / Speed Lines */}
        <g opacity="0.85" className={animated ? "animate-pulse" : ""}>
          <line x1="10" y1="72" x2="42" y2="72" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="2" y1="86" x2="48" y2="86" stroke="#0877C9" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="16" y1="100" x2="44" y2="100" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="112" x2="52" y2="112" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Soft Drop Shadow under Truck */}
        <ellipse cx="132" cy="136" rx="92" ry="12" fill="url(#truckShadow)" />

        {/* MAIN CARGO CONTAINER */}
        {/* Box Top Panel (Isometric Tilt) */}
        <path
          d="M 52 38 L 158 38 L 172 48 L 64 48 Z"
          fill="url(#azraqBoxTopGrad)"
        />
        {/* Box Side Body */}
        <rect
          x="50"
          y="46"
          width="122"
          height="68"
          rx="6"
          fill="url(#azraqBoxGrad)"
        />
        {/* Box Top Bevel Highlight */}
        <line x1="53" y1="47" x2="169" y2="47" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* AZRAQ Wordmark & Symbol on Cargo Box */}
        <g transform="translate(68, 70)">
          {/* Subtle Shield / Icon */}
          <path
            d="M 10 3 L 18 3 C 18 12 10 18 10 18 C 10 18 2 12 2 3 Z"
            fill="white"
            opacity="0.95"
          />
          {/* AZRAQ Typography */}
          <text
            x="24"
            y="15"
            fill="#FFFFFF"
            fontFamily="'Manrope', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="2"
          >
            AZRAQ
          </text>
          <text
            x="24"
            y="26"
            fill="#BAE6FD"
            fontFamily="'Manrope', -apple-system, sans-serif"
            fontWeight="700"
            fontSize="7"
            letterSpacing="1.2"
          >
            EXPRESS
          </text>
        </g>

        {/* CABIN (Front of truck) */}
        {/* Cabin Top */}
        <path
          d="M 172 62 L 194 62 L 208 76 L 172 76 Z"
          fill="#5CBDF5"
        />
        {/* Cabin Body */}
        <path
          d="M 172 62 
             L 196 62 
             C 200 62 205 66 208 72 
             L 218 88 
             C 222 93 222 98 222 104
             L 222 114
             L 172 114
             Z"
          fill="url(#azraqCabGrad)"
        />

        {/* Windshield */}
        <path
          d="M 180 67
             L 194 67
             C 197 67 200 70 203 75
             L 211 87
             L 180 87
             Z"
          fill="url(#azraqWindshield)"
          stroke="#0A77C8"
          strokeWidth="1"
        />
        {/* Windshield Glass Reflection */}
        <path
          d="M 188 68 L 198 68 L 192 85 L 184 85 Z"
          fill="white"
          opacity="0.4"
        />

        {/* Headlight */}
        <rect x="216" y="98" width="6" height="8" rx="2" fill="#FDE047" />
        <ellipse cx="225" cy="102" rx="7" ry="4" fill="#FEF08A" opacity="0.6" />

        {/* Bumper */}
        <rect x="214" y="110" width="10" height="5" rx="2" fill="#0F172A" />

        {/* CHASSIS & WHEEL GUARDS */}
        <rect x="52" y="112" width="168" height="6" fill="#0F172A" rx="2" />

        {/* REAR WHEELS */}
        <g transform="translate(80, 118)">
          {/* Tire */}
          <circle cx="0" cy="0" r="16" fill="#1E293B" />
          <circle cx="0" cy="0" r="11" fill="#334155" />
          {/* Rim */}
          <circle cx="0" cy="0" r="7" fill="#E2E8F0" />
          <circle cx="0" cy="0" r="3" fill="#0877C9" />
        </g>
        <g transform="translate(116, 118)">
          {/* Tire */}
          <circle cx="0" cy="0" r="16" fill="#1E293B" />
          <circle cx="0" cy="0" r="11" fill="#334155" />
          {/* Rim */}
          <circle cx="0" cy="0" r="7" fill="#E2E8F0" />
          <circle cx="0" cy="0" r="3" fill="#0877C9" />
        </g>

        {/* FRONT WHEEL */}
        <g transform="translate(196, 118)">
          {/* Tire */}
          <circle cx="0" cy="0" r="16" fill="#1E293B" />
          <circle cx="0" cy="0" r="11" fill="#334155" />
          {/* Rim */}
          <circle cx="0" cy="0" r="7" fill="#E2E8F0" />
          <circle cx="0" cy="0" r="3" fill="#0877C9" />
        </g>
      </svg>
    </div>
  );
}
