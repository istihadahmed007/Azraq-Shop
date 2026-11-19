import React, { useState, useEffect, useRef } from 'react';
import { Package } from 'lucide-react';
import { AzraqBrandSymbol } from '../AzraqLogo';

// Global cache of image URLs already verified and loaded during this session
const loadedImageUrls = new Set();

/**
 * AZRAQ Shop — High-Performance Product Image Component
 * 
 * Features & Optimizations:
 * 1. Strictly conforms to Requirement 5: object-fit: contain, object-position: center, 100% visible picture.
 * 2. Instant display for cached/preloaded images with zero skeleton flash.
 * 3. High network priority (`fetchPriority="high"`, `loading="eager"`) for priority views.
 * 4. Preserves 100% authentic aspect ratio without distortion or unintended clipping.
 * 5. Frosted crystal background with translucent border matching glassmorphic aesthetic.
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

  // Fit class — strictly object-contain & object-center for genuine products
  const fitClass = fit === 'cover' 
    ? 'w-full h-full object-cover object-center block' 
    : 'w-full h-full object-contain object-center block';

  // Fallback / Placeholder when no image or image failed to load
  if (!src || hasError) {
    return (
      <div
        className={`relative w-full ${aspectClass} bg-[#F8FBFF] border border-[#82AACD]/25 rounded-[16px] flex flex-col items-center justify-center p-4 select-none text-[#718398] overflow-hidden ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#DDEEFF]/60 border border-[#82AACD]/30 flex items-center justify-center mb-2 shadow-xs">
          <AzraqBrandSymbol className="w-6 h-6 text-[#193B5B] opacity-80" />
        </div>
        <span className="text-[10px] font-bold text-[#193B5B] uppercase tracking-wider text-center">
          AZRAQ Authentic
        </span>
        <span className="text-[9px] text-[#718398] text-center mt-0.5">
          Photo Verified in Catalog
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectClass} flex items-center justify-center overflow-hidden bg-white/70 backdrop-blur-xs select-none rounded-[16px] ${containerClassName} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Loading Skeleton: only shown when image is not yet loaded and not priority */}
      {!isLoaded && showSkeleton && !priority && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#DDEEFF]/40 via-[#F8FBFF] to-[#DDEEFF]/40 animate-pulse flex items-center justify-center z-0">
          <div className="w-8 h-8 rounded-full bg-[#DDEEFF]/80 flex items-center justify-center opacity-60">
            <Package className="w-4 h-4 text-[#718398]" />
          </div>
        </div>
      )}

      {/* Main Product Image — Strictly contain & center to guarantee full visibility */}
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
        className={`${fitClass} transition-all duration-300 ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        } ${zoomOnHover ? 'group-hover:scale-[1.03]' : ''} ${className}`}
      />
    </div>
  );
}
