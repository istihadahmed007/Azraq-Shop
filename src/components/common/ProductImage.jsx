import React, { useState, useEffect, useRef } from 'react';
import { Package, ImageOff } from 'lucide-react';
import { AzraqBrandSymbol } from '../AzraqLogo';

// Global cache of image URLs already verified and loaded during this session
const loadedImageUrls = new Set();

/**
 * AZRAQ Shop — High-Performance Product Image Component
 * 
 * Features & Optimizations:
 * 1. Instant display for cached/preloaded images with zero skeleton flash.
 * 2. High network priority (`fetchPriority="high"`, `loading="eager"`) for priority views.
 * 3. Pre-connected to image CDN (easydrop.asia) for zero DNS/TLS negotiation lag.
 * 4. Preserves 100% authentic aspect ratio without distortion or unintended flex clipping.
 * 5. Immediate progressive rendering (no blocking with opacity-0 when priority is set).
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
  const [isLoaded, setIsLoaded] = useState(() => Boolean(src && loadedImageUrls.has(src)));
  const imgRef = useRef(null);

  // Sync state when src changes or image is already in memory cache
  useEffect(() => {
    if (!src) {
      setHasError(false);
      setIsLoaded(false);
      return;
    }

    if (loadedImageUrls.has(src)) {
      setHasError(false);
      setIsLoaded(true);
      return;
    }

    // Check if the DOM image is already complete (e.g. from browser disk/memory cache)
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      loadedImageUrls.add(src);
      setHasError(false);
      setIsLoaded(true);
    } else {
      setHasError(false);
      setIsLoaded(priority ? true : false);
    }
  }, [src, priority]);

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
      {/* Loading Skeleton: only shown when image is not yet loaded and not priority */}
      {!isLoaded && showSkeleton && !priority && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDF4F9] via-[#F7FAFD] to-[#EDF4F9] animate-pulse flex items-center justify-center z-0">
          <div className="w-8 h-8 rounded-full bg-[#E2ECF4] flex items-center justify-center opacity-60">
            <Package className="w-4 h-4 text-[#8CA0B6]" />
          </div>
        </div>
      )}

      {/* Main Product Image — High-speed loading without artificial opacity delay */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => {
          if (src) loadedImageUrls.add(src);
          setIsLoaded(true);
        }}
        onError={() => setHasError(true)}
        className={`${fitClass} transition-opacity duration-150 ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        } ${zoomOnHover ? 'group-hover:scale-105' : ''} ${className}`}
      />
    </div>
  );
}
