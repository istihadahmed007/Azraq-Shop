import React from 'react';

export default function AzraqLogo({ 
  variant = 'dark', 
  size = 'md', 
  showDescriptor = true,
  className = '' 
}) {
  const isLight = variant === 'light'; // Light text on dark background
  const textColor = isLight ? '#FFFFFF' : '#12233F';
  const subColor = isLight ? '#A78BFA' : '#7955E8';

  const sizes = {
    sm: { icon: 30, text: 'text-lg', desc: 'text-[9px]' },
    md: { icon: 38, text: 'text-2xl', desc: 'text-[10px]' },
    lg: { icon: 52, text: 'text-3xl', desc: 'text-xs' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric AZ Monogram Symbol */}
      <div 
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-105"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
          background: isLight 
            ? 'linear-gradient(135deg, #162644 0%, #0F1D33 100%)' 
            : 'linear-gradient(135deg, #12233F 0%, #0D192D 100%)',
          border: isLight ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(18, 35, 63, 0.15)'
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
          {/* Neon-Lime Dynamic Z Band Cutting Across */}
          <path 
            d="M23 29.5L44 18V23.5L31.5 31H44V36L23 47.5V42L35.5 34.5H23V29.5Z" 
            fill="#C9F34A" 
            fillOpacity="0.95"
          />
          {/* Azure Blue Accent Pip */}
          <circle cx="48.5" cy="15.5" r="3.2" fill="#2677D9" />
        </svg>
      </div>

      {/* Brand Wordmark & Descriptor */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-extrabold tracking-tight font-sans ${currentSize.text}`}
            style={{ color: textColor, letterSpacing: '-0.02em' }}
          >
            AZRAQ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-azraq-lime inline-block mb-1"></span>
        </div>
        {showDescriptor && (
          <span 
            className={`font-semibold tracking-[0.22em] uppercase ${currentSize.desc}`}
            style={{ color: subColor }}
          >
            Curated Everyday Goods
          </span>
        )}
      </div>
    </div>
  );
}

