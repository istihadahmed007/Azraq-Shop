import React from 'react';

export default function AzraqLogo({ 
  variant = 'dark', 
  size = 'md', 
  showDescriptor = true,
  className = '' 
}) {
  const isLight = variant === 'light'; // Light text on dark background
  const textColor = isLight ? '#FFFFFF' : '#062B4F';
  const subColor = isLight ? '#69C5F5' : '#0877C9';

  const sizes = {
    sm: { icon: 32, text: 'text-xl', desc: 'text-[9px]' },
    md: { icon: 40, text: 'text-2xl', desc: 'text-[10px]' },
    lg: { icon: 52, text: 'text-3xl', desc: 'text-xs' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric AZ Monogram Symbol - Glassy Azraq Azure */}
      <div 
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-105"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
          background: isLight 
            ? 'linear-gradient(135deg, #0877C9 0%, #062B4F 100%)' 
            : 'linear-gradient(135deg, #062B4F 0%, #0877C9 100%)',
          border: isLight ? '1px solid rgba(105, 197, 245, 0.4)' : '1px solid rgba(8, 119, 201, 0.25)',
          boxShadow: '0 4px 15px rgba(8, 119, 201, 0.15)'
        }}
      >
        <svg 
          viewBox="0 0 64 64" 
          width={currentSize.icon * 0.82} 
          height={currentSize.icon * 0.82} 
          fill="none"
        >
          {/* Main A Character Geometry */}
          <path 
            d="M15 47L27 17H34L46 47H39.2L36.3 39.5H23.7L20.8 47H15ZM25.7 34.2H34.3L30 23.5L25.7 34.2Z" 
            fill="#FFFFFF"
          />
          {/* Glass Cyan Dynamic Z Band Cutting Across */}
          <path 
            d="M23 29.5L44 18V23.5L31.5 31H44V36L23 47.5V42L35.5 34.5H23V29.5Z" 
            fill="#50DDF0" 
            fillOpacity="0.95"
          />
          {/* Azure Blue Accent Pip */}
          <circle cx="48.5" cy="15.5" r="3.2" fill="#69C5F5" />
        </svg>
      </div>

      {/* Brand Wordmark & Descriptor */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-black tracking-tight font-sans ${currentSize.text}`}
            style={{ color: textColor, letterSpacing: '-0.02em' }}
          >
            AZRAQ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-azraq-cyan inline-block mb-1 shadow-glow-cyan"></span>
        </div>
        {showDescriptor && (
          <span 
            className={`font-bold tracking-[0.22em] uppercase ${currentSize.desc}`}
            style={{ color: subColor }}
          >
            Curated Everyday Goods
          </span>
        )}
      </div>
    </div>
  );
}

