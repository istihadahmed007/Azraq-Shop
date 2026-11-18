import React from 'react';

/**
 * AZRAQ Official Brand Logo Component
 * Incorporates authentic logo asset (/branding/azraq-logo.png)
 * Strictly preserves aspect ratio (3:1), original colors, and crisp rendering using object-fit: contain
 */
export default function AzraqLogo({ 
  variant = 'dark', 
  size = 'md', 
  showDescriptor = true,
  className = '',
  imgClassName = ''
}) {
  const isLight = variant === 'light'; // For dark backgrounds

  // Responsive height presets preserving 3:1 aspect ratio without layout shift
  // xs: ~28-32px height (~84-96px width)
  // sm: ~36-40px height (~108-120px width)
  // md: ~44-50px height (~132-150px width)
  // lg: ~52-60px height (~156-180px width)
  // xl: ~64-80px height (~192-240px width)
  const sizeClasses = {
    xs: 'h-7 sm:h-8',
    sm: 'h-9 sm:h-10',
    md: 'h-10 sm:h-11 md:h-12.5',
    lg: 'h-12 sm:h-14 md:h-16',
    xl: 'h-16 sm:h-20 md:h-24'
  };

  const heightClass = sizeClasses[size] || sizeClasses.md;

  if (isLight) {
    // When rendered on a dark background (such as Midnight Navy #101C35):
    // Wrap inside a refined, frosted white pill so the navy wordmark remains 100% legible,
    // authentic, and with crisp contrast, strictly preserving the original artwork.
    return (
      <div 
        className={`inline-flex items-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-sm transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <img
          src="/branding/azraq-logo.png"
          alt="AZRAQ Shop"
          className={`${heightClass} w-auto aspect-[1024/341] object-contain select-none ${imgClassName}`}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Standard display on white / soft-gray surfaces
  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <img
        src="/branding/azraq-logo.png"
        alt="AZRAQ Shop"
        className={`${heightClass} w-auto aspect-[1024/341] object-contain select-none transition-transform duration-200 hover:scale-[1.02] ${imgClassName}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

/**
 * Isolated Brand Symbol Component
 * Uses /branding/azraq-icon.png for compact icon contexts (mobile ribbons, badges, avatars)
 */
export function AzraqBrandSymbol({ 
  size = 'md', 
  className = '' 
}) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <img
      src="/branding/azraq-icon.png"
      alt="AZRAQ Shop"
      className={`${sizeClasses[size] || sizeClasses.md} aspect-square object-contain select-none shrink-0 ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
