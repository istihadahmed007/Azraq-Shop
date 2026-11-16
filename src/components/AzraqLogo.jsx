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
  // xs: ~24px height (~72px width)
  // sm: ~32px height (~96px width)
  // md: ~38-42px height (~114-126px width)
  // lg: ~48-52px height (~144-156px width)
  // xl: ~60-64px height (~180-192px width)
  const sizeClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-11 sm:h-12 md:h-14',
    xl: 'h-14 sm:h-16 md:h-20'
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
