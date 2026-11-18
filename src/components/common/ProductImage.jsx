import React, { useState, useEffect } from 'react';
import { Package, ImageOff } from 'lucide-react';
import { AzraqBrandSymbol } from '../AzraqLogo';

/**
 * AZRAQ Shop — Reusable Product Image Component
 * 
 * Requirements handled:
 * 1. Preserves source image proportions without stretching or unintended flex clipping.
 * 2. Uses max-width: 100% and max-height: 100% inside a controlled aspect container.
 * 3. Handles loading states and graceful error states with a neutral branded placeholder.
 * 4. NEVER replaces an unavailable image with an unrelated product's photograph.
 * 5. Supports 'contain' (for isolated products and detailed gallery views) and 'cover' (for edge-to-edge listing cards).
 */
export default function ProductImage({
  src,
  alt = 'Product photograph',
  fit = 'contain', // 'contain' | 'cover'
  className = '',
  containerClassName = '',
  aspectRatio = 'square', // 'square' (1:1) | 'video' (16:9) | 'portrait' (3:4) | 'auto'
  priority = false,
  showSkeleton = true,
  onClick,
  zoomOnHover = false
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state if image source changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Determine aspect ratio class
  let aspectClass = 'aspect-square';
  if (aspectRatio === 'video') aspectClass = 'aspect-video';
  if (aspectRatio === 'portrait') aspectClass = 'aspect-[3/4]';
  if (aspectRatio === 'auto') aspectClass = '';

  // Fit class — for 'cover', fill the box edge-to-edge; for 'contain', stay within max-w/max-h without distortion
  const fitClass = fit === 'cover' 
    ? 'w-full h-full object-cover' 
    : 'max-w-full max-h-full object-contain';

  // Fallback / Placeholder when no image or image failed to load
  if (!src || hasError) {
    return (
      <div
        className={`relative w-full ${aspectClass} bg-[#EDF4F9] border border-[#D5E2EE]/60 rounded-[14px] flex flex-col items-center justify-center p-4 select-none text-[#6B7D93] overflow-hidden ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#E2ECF4] border border-[#D5E2EE] flex items-center justify-center mb-2 shadow-inner">
          <AzraqBrandSymbol className="w-6 h-6 text-[#0877C9] opacity-80" />
        </div>
        <span className="text-[10px] font-bold text-[#6B7D93] uppercase tracking-wider text-center">
          AZRAQ Authentic
        </span>
        <span className="text-[9px] text-[#8CA0B6] text-center mt-0.5">
          Photo Verified in Catalog
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectClass} flex items-center justify-center overflow-hidden bg-white select-none ${containerClassName} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && showSkeleton && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDF4F9] via-[#F7FAFD] to-[#EDF4F9] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#E2ECF4] flex items-center justify-center opacity-60">
            <Package className="w-4 h-4 text-[#8CA0B6]" />
          </div>
        </div>
      )}

      {/* Main Product Image — Constrained with max-w-full and max-h-full to prevent flex distortion */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${fitClass} transition-all duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${zoomOnHover ? 'group-hover:scale-105' : ''} ${className}`}
      />
    </div>
  );
}
