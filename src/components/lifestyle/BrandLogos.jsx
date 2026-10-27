import React from 'react';

/**
 * Standard, high-fidelity partner brand logos for Lifestyle & Privileges offers.
 * Zero emojis — uses clean, theme-harmonious vector SVG assets.
 */

export function StarbucksLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-[#006241] shadow-2xs border border-white/20 ${className}`}
      title="Starbucks"
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="#D4E9E2" strokeWidth="1.5" />
        <path
          d="M22 13h1.5a3.5 3.5 0 0 1 0 7H22"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 13h16v7a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-7Z"
          fill="#FFFFFF"
        />
        <path d="M10 7c0 1.5 1 2.5 1 3.5M14 7c0 1.5 1 2.5 1 3.5M18 7c0 1.5 1 2.5 1 3.5" stroke="#A7D4C2" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="18" r="2" fill="#006241" />
      </svg>
    </div>
  );
}

export function MakeMyTripLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E41D2D] to-[#B31320] text-white shadow-2xs border border-white/20 ${className}`}
      title="MakeMyTrip"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Airplane soaring */}
        <path
          d="M26 6L16 16M26 6L19 25L15 17L7 13L26 6Z"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="23" r="2.5" fill="#FFD100" />
      </svg>
    </div>
  );
}

export function BookMyShowLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#EB1536] to-[#C10C27] text-white shadow-2xs border border-white/20 ${className}`}
      title="BookMyShow"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M12 8v16M20 8v16" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
        <polygon points="14,13 18,16 14,19" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function AmazonLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-[#131921] shadow-2xs border border-white/20 text-white ${className}`}
      title="Amazon"
    >
      <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Amazon bold 'a' */}
        <text x="10" y="20" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18">
          a
        </text>
        {/* Iconic Amazon Smile Arrow */}
        <path
          d="M8 25C13 28 22 28 27 23"
          stroke="#FF9900"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M28 21.5L28 24.5L25 24"
          stroke="#FF9900"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ZomatoLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E23744] to-[#C72330] text-white shadow-2xs border border-white/20 ${className}`}
      title="Zomato Gold"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fork & Knife gourmet icon */}
        <path d="M10 6v8a3 3 0 0 0 3 3v9M10 6H8v5M10 6h2v5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 6v10a3 3 0 0 1-3 3v7M21 6a4 4 0 0 0-4 4v5h4V6Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function PriorityPassLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1E252B] to-[#12161A] shadow-2xs border border-[#C5A059]/40 ${className}`}
      title="Priority Pass"
    >
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" stroke="#C5A059" strokeWidth="1.5" />
        {/* Monogram P P and crown */}
        <path d="M10 22V10h5a3 3 0 0 1 0 6h-5" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 22V10h5a3 3 0 0 1 0 6h-5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function CromaLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00A3A6] to-[#008082] text-white shadow-2xs border border-white/20 ${className}`}
      title="Croma"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Modern display screen with power badge */}
        <rect x="5" y="7" width="22" height="15" rx="2" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M12 26h8M16 22v4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 11v3M14.5 12.5a2.5 2.5 0 1 1 3 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SpotifyLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-xl bg-[#1DB954] text-[#121212] shadow-2xs border border-white/20 ${className}`}
      title="Spotify"
    >
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#1DB954" />
        {/* 3 curved sound wave arcs */}
        <path d="M9 12c4.5-1 10-0.5 14 1.5" stroke="#121212" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M10 16c3.8-0.8 8.5-0.3 12 1.3" stroke="#121212" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M11 20c3-0.5 6.8-0.2 9.5 1" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Universal Brand Logo Dispatcher
 */
export default function BrandLogo({ brandId, size = 44, className = '' }) {
  switch (brandId) {
    case 'off-1':
      return <StarbucksLogo size={size} className={className} />;
    case 'off-2':
      return <MakeMyTripLogo size={size} className={className} />;
    case 'off-3':
      return <BookMyShowLogo size={size} className={className} />;
    case 'off-4':
      return <AmazonLogo size={size} className={className} />;
    case 'off-5':
      return <ZomatoLogo size={size} className={className} />;
    case 'off-6':
      return <PriorityPassLogo size={size} className={className} />;
    case 'off-7':
      return <CromaLogo size={size} className={className} />;
    case 'off-8':
      return <SpotifyLogo size={size} className={className} />;
    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`shrink-0 flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold ${className}`}
        >
          UB
        </div>
      );
  }
}
