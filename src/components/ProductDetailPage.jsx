import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  Share2,
  ZoomIn,
  X,
  Check,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  WifiOff,
  ServerCrash
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import ProductCard from './common/ProductCard';
import {
  findProductBySlug,
  generateProductSlug,
  normalizeProductImages,
  fetchSingleProduct
} from '../utils/productUtils';
import { formatBdtAmount } from '../services/paymentService';

/**
 * AZRAQ Shop — Premium Dedicated Product Detail Page
 * 
 * Replaces the modal experience with a production-grade URL-driven route: /product/:slug
 * Features:
 * - 55% Left Gallery with responsive 1:1 main viewer, thumbnail carousel, prev/next, zoom modal.
 * - 45% Right Column with real BDT pricing, authentic compare discounts, stock, variant selectors,
 *   quantity stepper, Add to Bag, Buy Now, Wishlist, and guarantee badges.
 * - Organized Overview, Specifications, Delivery Timeline, and Return Policy tabs (EN/BN).
 * - Related Products grid maintaining exactly 5 cards per row on desktop.
 * - Full SEO tags (document.title, canonical, OpenGraph).
 */
export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    products,
    collections,
    addToCart,
    favorites,
    toggleFavorite,
    setIsCheckoutOpen,
    catalogStatus,
    catalogError,
    retryCatalogHydration,
    injectProduct,
    isCatalogHydrated,
    t
  } = useShop();

  // 1. Try to find product immediately from current in-memory products
  const productFromContext = useMemo(() => {
    return findProductBySlug(slug, products);
  }, [slug, products]);

  // Local state for single product resolution and retry triggering
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'notFound' | 'error'
  const [fetchError, setFetchError] = useState(null);
  const [fetchAttempt, setFetchAttempt] = useState(0);

  // Active product is either from context or from single product fetch
  const product = productFromContext || fetchedProduct;

  // Trigger individual product fetch if not found in current context products
  useEffect(() => {
    // If product is already found in context, mark as success
    if (productFromContext) {
      setFetchStatus('success');
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    setFetchStatus('loading');
    setFetchError(null);

    fetchSingleProduct(slug, { signal: controller.signal, timeoutMs: 8000 })
      .then(res => {
        if (!isMounted) return;
        if (res.product) {
          setFetchedProduct(res.product);
          setFetchStatus('success');
          if (injectProduct) {
            injectProduct(res.product);
          }
        } else if (res.isNotFound) {
          // If catalog is already hydrated or not actively loading, confirm 404 immediately
          if (isCatalogHydrated || catalogStatus !== 'loading') {
            setFetchStatus('notFound');
          } else {
            // Wait for catalog hydration to finish before confirming notFound
            setFetchStatus('loading');
          }
        } else if (res.isServerError) {
          setFetchStatus('serverError');
          setFetchError(res.error || 'The product service is currently unavailable.');
        } else if (res.isNetworkError) {
          setFetchStatus('networkError');
          setFetchError(res.error || 'A network connection or timeout occurred.');
        } else if (res.isError) {
          setFetchStatus('networkError');
          setFetchError(res.error || 'Failed to load product details');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setFetchStatus('networkError');
        setFetchError(err.message || 'Network error loading product');
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, productFromContext, catalogStatus, isCatalogHydrated, fetchAttempt, injectProduct]);

  // Safety watchdog timer: guarantees loading never stays active indefinitely
  useEffect(() => {
    if (!product && (fetchStatus === 'loading' || fetchStatus === 'idle')) {
      const watchdog = setTimeout(() => {
        if (!product && fetchStatus !== 'notFound') {
          setFetchStatus('networkError');
          setFetchError('Loading timed out. Please check your connection and retry.');
        }
      }, 10000);
      return () => clearTimeout(watchdog);
    }
  }, [product, fetchStatus, fetchAttempt]);

  // If waiting on catalog hydration for a not-found product, resolve once catalog finishes
  useEffect(() => {
    if (!product && fetchStatus === 'loading' && catalogStatus !== 'loading') {
      const p = findProductBySlug(slug, products);
      if (p) {
        setFetchedProduct(p);
        setFetchStatus('success');
      } else if (isCatalogHydrated || catalogStatus === 'success' || catalogStatus === 'error') {
        setFetchStatus('notFound');
      }
    }
  }, [slug, product, fetchStatus, catalogStatus, isCatalogHydrated, products]);

  // Handle retry
  const handleRetry = () => {
    setFetchAttempt(prev => prev + 1);
    if (retryCatalogHydration) {
      retryCatalogHydration();
    }
  };

  // Gallery state
  const images = useMemo(() => {
    return normalizeProductImages(product);
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'delivery' | 'returns'

  // Reset zoom scale when changing images or closing modal
  useEffect(() => {
    setZoomScale(1);
  }, [activeImageIndex, isZoomOpen]);

  // Keyboard navigation for full-screen zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, images.length]);

  // Update selected variant when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant('Standard');
    }
  }, [product]);

  // Track product in recently viewed history
  useEffect(() => {
    if (product && product.id) {
      try {
        const stored = localStorage.getItem('azraq_recently_viewed');
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter(id => id !== product.id);
        filtered.unshift(product.id);
        localStorage.setItem('azraq_recently_viewed', JSON.stringify(filtered.slice(0, 15)));
      } catch (e) {
        // Safe fallback
      }
    }
  }, [product]);

  // Dynamic SEO & Metadata
  useEffect(() => {
    if (product) {
      const pageTitle = `${product.name} — AZRAQ Shop`;
      document.title = pageTitle;

      // Update or create meta tags for OpenGraph
      const setMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      setMeta('og:title', pageTitle);
      setMeta('og:description', product.description ? product.description.slice(0, 160) : 'Shop authentic products at AZRAQ.');
      if (product.main_image) {
        setMeta('og:image', product.main_image);
      }
      setMeta('og:url', window.location.href);

      // Preload primary photograph with high priority
      const targetImage = images[activeImageIndex] || product.main_image;
      if (targetImage) {
        let preloadLink = document.querySelector(`link[rel="preload"][href="${targetImage}"]`);
        if (!preloadLink) {
          preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = targetImage;
          preloadLink.fetchPriority = 'high';
          document.head.appendChild(preloadLink);
        }
      }

      // Pre-cache other gallery thumbnails in browser memory
      if (images && images.length > 1) {
        images.forEach((url, i) => {
          if (i !== activeImageIndex && url) {
            const img = new Image();
            img.src = url;
          }
        });
      }

      // Scroll smoothly to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, images, activeImageIndex]);

  // 1. Loading state: active when product is being loaded from single record or catalog
  const isStillLoading = !product && (
    fetchStatus === 'loading' ||
    fetchStatus === 'idle' ||
    (fetchStatus !== 'error' && fetchStatus !== 'networkError' && fetchStatus !== 'serverError' && fetchStatus !== 'notFound' && catalogStatus === 'loading')
  );

  if (isStillLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-10 h-10 rounded-full border-3 border-[#245BDB]/20 border-t-[#245BDB] animate-spin mb-3" />
        <span className="text-xs text-[#667085] font-medium">
          {t("Loading authentic catalog details...", "পণ্যের বিবরণ লোড হচ্ছে...")}
        </span>
      </div>
    );
  }

  // 2. Recoverable Network Error state (CRITICAL: NEVER display 404 for network errors or timeouts)
  if (!product && (fetchStatus === 'networkError' || fetchStatus === 'error')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-full bg-white/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center mb-4 text-[#CF1322] shadow-xs">
          <WifiOff className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#193B5B] mb-2">
          {t("Network Connection Issue", "নেটওয়ার্ক সংযোগ সমস্যা")}
        </h1>
        <p className="text-xs text-[#718398] max-w-md mb-6 leading-relaxed">
          {fetchError || t("A network connection or server timeout occurred while loading this product. Please check your connection and retry.", "সংযোগজনিত সমস্যার কারণে পণ্যটি লোড করা যায়নি। দয়া করে পুনরায় চেষ্টা করুন।")}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.4)] hover:from-[#5CBDE5] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("Retry", "পুনরায় চেষ্টা করুন")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-white/75 border border-[rgba(130,170,205,0.3)] text-[#193B5B] font-semibold text-xs hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{t("Back to Home", "হোমপেজে ফিরে যান")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2b. Recoverable Server Error state (500s)
  if (!product && fetchStatus === 'serverError') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-full bg-white/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center mb-4 text-[#D46B08] shadow-xs">
          <ServerCrash className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#193B5B] mb-2">
          {t("Service Temporarily Unavailable", "সার্ভার সাময়িকভাবে অনুপলব্ধ")}
        </h1>
        <p className="text-xs text-[#718398] max-w-md mb-6 leading-relaxed">
          {fetchError || t("The catalog server encountered a temporary error. Your cart and session are safe. Please retry.", "ক্যাটালগ সার্ভারে সাময়িক সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।")}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.4)] hover:from-[#5CBDE5] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("Retry", "পুনরায় চেষ্টা করুন")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-white/75 border border-[rgba(130,170,205,0.3)] text-[#193B5B] font-semibold text-xs hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{t("Back to Home", "হোমপেজে ফিরে যান")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Genuine 404 (Not Found) state: shown only when single product resolution returns 404 AND full catalog check completes
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-full bg-white/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center mb-4 text-[#0877C9] shadow-xs">
          <Package className="w-6 h-6 opacity-70" />
        </div>
        <h1 className="text-xl font-bold text-[#193B5B] mb-2">
          {t("Product Not Found", "পণ্যটি খুঁজে পাওয়া যায়নি")}
        </h1>
        <p className="text-xs text-[#718398] max-w-md mb-6 leading-relaxed">
          {t(
            "The product you are looking for might have been moved or is currently unavailable in our catalog.",
            "আপনি যে পণ্যটি খুঁজছেন তা ক্যাটালগে নেই অথবা সরানো হয়েছে।"
          )}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.4)] hover:from-[#5CBDE5] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{t("Browse All Products", "সব পণ্য দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const isAvailable = product.in_stock !== false && (product.stock === undefined || product.stock > 0);

  // Authentic compare price & discount calculation
  const originalPrice = product.compare_price ||
    (product.supplier_retail_price && product.supplier_retail_price > product.price ? product.supplier_retail_price : null);
  const discountPercent = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : (product.discount_percent || null);

  // Associated Collection
  const productCollection = collections.find(c =>
    (product.collection_ids && product.collection_ids.includes(c.id)) ||
    c.name === product.category ||
    c.name === product.primary_collection_name
  ) || collections[0];

  // Related products (exclude current product, 5 per row)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (
      p.category === product.category ||
      (p.collection_ids && productCollection && p.collection_ids.includes(productCollection.id))
    ))
    .slice(0, 5);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, quantity);
    setIsCheckoutOpen(true);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const activeImageUrl = images[activeImageIndex] || product.main_image;

  return (
    <div className="w-full select-none flex flex-col gap-6 pb-12">

      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#718398] overflow-x-auto whitespace-nowrap pt-1">
        <Link to="/" className="hover:text-[#193B5B] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-[#82AACD]" />

        {productCollection && (
          <>
            <Link to={`/collection/${productCollection.slug}`} className="hover:text-[#193B5B] transition-colors">
              {productCollection.name}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-[#82AACD]" />
          </>
        )}

        <span className="text-[#193B5B] font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* 2. MAIN PRODUCT DETAIL SHOWCASE (55% Gallery Left / 45% Information Right) */}
      <div className="rounded-[32px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-8 md:p-10 shadow-[0_20px_48px_-12px_rgba(112,200,237,0.15),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ========================================================= */}
          {/* LEFT COLUMN: PRODUCT IMAGE GALLERY (~55% width, col-span-7) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Primary Main Image Viewer (Strictly Contain) */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative w-full aspect-square max-h-[560px] mx-auto rounded-[24px] bg-white/80 backdrop-blur-md border border-[rgba(130,170,205,0.25)] overflow-hidden flex items-center justify-center group cursor-zoom-in shadow-inner"
            >

              {/* Product Photograph with object-contain to preserve 100% of the image without distortion */}
              <div className="card-image-wrapper w-full h-full p-4 sm:p-6">
                <ProductImage
                  src={activeImageUrl}
                  alt={product.name}
                  fit="contain"
                  aspectRatio="square"
                  priority={true}
                  containerClassName="w-full h-full"
                />
              </div>

              {/* Prev / Next Controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Top-Right Badges & Zoom Control */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(true);
                  }}
                  className="w-8 h-8 rounded-full bg-white/95 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-[#193B5B] flex items-center justify-center shadow-xs transition-colors"
                  title={t("Zoom photo", "বড় করে দেখুন")}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Top-Left Authentic Discount Badge */}
              {discountPercent && discountPercent > 0 ? (
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-[11px] font-mono font-bold shadow-xs">
                    -{discountPercent}%
                  </span>
                </div>
              ) : null}

              {/* Hover Zoom Pill Indicator */}
              <div className="absolute bottom-3 left-3 bg-[#193B5B]/90 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs z-10">
                <ZoomIn className="w-3 h-3 text-[#70C8ED]" />
                <span>{t("Click to Zoom", "বড় করে দেখুন")}</span>
              </div>

              {/* Image counter indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-[#193B5B]/85 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full z-10">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-[16px] bg-white/80 border flex items-center justify-center overflow-hidden shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#70C8ED] shadow-[0_0_12px_rgba(112,200,237,0.5)]'
                        : 'border-[rgba(130,170,205,0.25)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fit="contain"
                      aspectRatio="square"
                      className="p-1"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Pills below gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-full bg-white/75 border border-[rgba(130,170,205,0.25)] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-medium text-[#193B5B] leading-tight">
                  {t("100% Authentic Quality", "১০০% আসল পণ্য")}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-full bg-white/75 border border-[rgba(130,170,205,0.25)] shadow-xs">
                <Truck className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-medium text-[#193B5B] leading-tight">
                  {t("Doorstep Delivery", "হোম ডেলিভারি")}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-full bg-white/75 border border-[rgba(130,170,205,0.25)] shadow-xs col-span-2 sm:col-span-1">
                <RotateCcw className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-medium text-[#193B5B] leading-tight">
                  {t("Easy 7-Day Returns", "সহজ ৭ দিনের রিটার্ন")}
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: PRODUCT PURCHASE DETAILS (~45% width, col-span-5) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">

            <div className="flex flex-col gap-4">

              {/* Category & Catalog ID */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-[rgba(130,170,205,0.2)]">
                <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.16em] font-bold">
                  {product.category || product.primary_collection_name || t("Catalog Item", "ক্যাটালগ পণ্য")}
                </span>

                <span className="text-xs font-mono font-semibold text-[#718398]">
                  SKU: {product.sku || product.id}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="p-4 rounded-[20px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex items-baseline justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#718398] block mb-0.5 font-bold">
                    {t("Price", "মূল্য")}
                  </span>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
                      ৳{(product.price || 0).toLocaleString()}
                    </span>
                    {originalPrice && originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-[#718398] line-through font-mono">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status Badge */}
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-red-600'}`} />
                    {isAvailable ? t("In Stock", "স্টকে আছে") : t("Out of Stock", "স্টক শেষ")}
                  </span>
                </div>
              </div>

              {/* Variant / Edition / Size Selector (Only when variants exist) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-[#193B5B] block uppercase tracking-wider font-mono">
                    {t("Select Edition / Size:", "এডিশন / সাইজ নির্বাচন করুন:")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          selectedVariant === variant
                            ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white border-transparent shadow-[0_2px_10px_rgba(112,200,237,0.4)]'
                            : 'bg-white/80 text-[#193B5B] border-[rgba(130,170,205,0.3)] hover:border-[#70C8ED]'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#193B5B] block uppercase tracking-wider font-mono">
                  {t("Quantity:", "পরিমাণ:")}
                </label>
                <div className="inline-flex items-center rounded-full bg-white border border-[rgba(130,170,205,0.3)] p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || !isAvailable}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#193B5B] hover:bg-[#DDEEFF]/40 disabled:opacity-30 transition-colors font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-bold text-[#193B5B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={!isAvailable}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#193B5B] hover:bg-[#DDEEFF]/40 disabled:opacity-30 transition-colors font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons: Add to Bag & Buy Now */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3">

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="w-full sm:flex-1 py-3 px-5 rounded-full bg-white/80 hover:bg-white text-[#193B5B] border border-[rgba(130,170,205,0.32)] hover:border-[#70C8ED] font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0877C9]" />
                  <span>{t("Add to Bag", "ব্যাগে যোগ করুন")}</span>
                </button>

                {/* Buy Now Button (Glowing Icy-Blue Gradient Pill) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  className="w-full sm:flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white font-bold text-xs sm:text-sm shadow-[0_8px_24px_rgba(112,200,237,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{t("Buy Now", "সরাসরি কিনুন")}</span>
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors shrink-0 shadow-xs ${
                    isFav
                      ? 'bg-red-50 text-[#E53935] border-[#E53935]/40'
                      : 'bg-white/80 text-[#718398] border-[rgba(130,170,205,0.3)] hover:text-[#193B5B] hover:border-[#70C8ED]'
                  }`}
                  title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দের তালিকায় রাখুন")}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
                </button>

              </div>

              {/* Delivery Rates & Guarantee Box */}
              <div className="p-4 rounded-[20px] bg-white/75 border border-[rgba(130,170,205,0.25)] text-xs text-[#193B5B] space-y-1.5 mt-1 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#0877C9] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#193B5B] block">
                      {t("Delivery Timeline & Rates", "ডেলিভারি সময় ও চার্জ")}
                    </span>
                    <p className="text-[#718398] text-[11px] leading-relaxed mt-0.5">
                      • {t("Inside Dhaka: ৳80 (24–48 hours)", "ঢাকা সিটির ভেতরে: ৮০৳ (২৪–৪৮ ঘণ্টা)")}<br />
                      • {t("Outside Dhaka: ৳150 (2–4 business days)", "ঢাকা সিটির বাইরে: ১৫০৳ (২–৪ কার্যদিবস)")}<br />
                      • <strong className="text-[#0877C9]">{t("FREE Delivery on orders over ৳3,000", "৩০০০৳ বা তদূর্ধ্ব অর্ডারে ফ্রি ডেলিভারি")}</strong>
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 3. PRODUCT SPECIFICATIONS & DETAILS TABS */}
      <div className="rounded-[32px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12)]">

        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-[rgba(130,170,205,0.2)] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs'
                : 'text-[#718398] hover:text-[#193B5B] bg-white/60 hover:bg-white border border-[rgba(130,170,205,0.2)]'
            }`}
          >
            {t("Overview & Description", "পণ্যের বিবরণ")}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'specs'
                ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs'
                : 'text-[#718398] hover:text-[#193B5B] bg-white/60 hover:bg-white border border-[rgba(130,170,205,0.2)]'
            }`}
          >
            {t("Specifications", "স্পেসিফিকেশন")}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs'
                : 'text-[#718398] hover:text-[#193B5B] bg-white/60 hover:bg-white border border-[rgba(130,170,205,0.2)]'
            }`}
          >
            {t("Shipping & Logistics", "ডেলিভারি ও শিপিং")}
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'returns'
                ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs'
                : 'text-[#718398] hover:text-[#193B5B] bg-white/60 hover:bg-white border border-[rgba(130,170,205,0.2)]'
            }`}
          >
            {t("Return Policy", "রিটার্ন পলিসি")}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'overview' && (
            <div className="prose max-w-none text-xs sm:text-sm text-[#193B5B] leading-relaxed whitespace-pre-line font-bengali">
              {product.description || product.description_en || product.description_bn || t(
                "Authentic catalog specifications verified by EasyDrop manufacturing partner.",
                "আসল পণ্যের নিশ্চয়তা ও মান যাচাইকৃত।"
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl text-xs">
              <div className="p-3.5 rounded-[16px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex justify-between shadow-2xs">
                <span className="font-semibold text-[#718398]">{t("Product ID", "পণ্য আইডি")}:</span>
                <span className="font-mono font-bold text-[#193B5B]">{product.id}</span>
              </div>
              <div className="p-3.5 rounded-[16px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex justify-between shadow-2xs">
                <span className="font-semibold text-[#718398]">{t("Catalog SKU", "ক্যাটালগ এসকেইউ")}:</span>
                <span className="font-mono font-bold text-[#193B5B]">{product.sku || 'N/A'}</span>
              </div>
              <div className="p-3.5 rounded-[16px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex justify-between shadow-2xs">
                <span className="font-semibold text-[#718398]">{t("Primary Category", "মূল ক্যাটাগরি")}:</span>
                <span className="font-bold text-[#193B5B]">{product.category || product.primary_collection_name}</span>
              </div>
              <div className="p-3.5 rounded-[16px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex justify-between shadow-2xs">
                <span className="font-semibold text-[#718398]">{t("Quality Guarantee", "কোয়ালিটি গ্যারান্টি")}:</span>
                <span className="font-bold text-emerald-700">{t("100% Verified Authentic", "১০০% ভেরিফাইড আসল")}</span>
              </div>
              {product.supplier_url && (
                <div className="p-3.5 rounded-[16px] bg-white/75 border border-[rgba(130,170,205,0.25)] flex justify-between col-span-1 sm:col-span-2 shadow-2xs">
                  <span className="font-semibold text-[#718398]">{t("Fulfillment Partner", "ফুলফিলমেন্ট পার্টনার")}:</span>
                  <span className="font-bold text-[#193B5B]">EasyDrop Verified Supplier</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3 text-xs text-[#193B5B] max-w-2xl leading-relaxed">
              <p>
                {t(
                  "All orders are processed and dispatched within 24 hours from verified hubs in Dhaka. You will receive an instant SMS tracking ID once the courier receives your package.",
                  "সকল অর্ডার ২৪ ঘণ্টার মধ্যে ঢাকা হাব থেকে প্রসেস ও ডিসপ্যাচ করা হয়। কুরিয়ারে হস্তান্তরের সাথে সাথে এসএমএস ও ট্র্যাকিং আইডি দেওয়া হয়।"
                )}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#718398]">
                <li>{t("Inside Dhaka City: Delivered within 24–48 hours via Steedfast / Pathao.", "ঢাকা সিটির ভেতরে: ২৪–৪৮ ঘণ্টার মধ্যে ডেলিভারি।")}</li>
                <li>{t("Outside Dhaka: Delivered within 48–72 hours across all 64 districts.", "ঢাকা সিটির বাইরে: ৪৮–৭২ ঘণ্টার মধ্যে দেশব্যাপী ৬৪ জেলায় ডেলিভারি।")}</li>
                <li>{t("Cash on Delivery (COD) and Paymently secure digital payments supported.", "ক্যাশ অন ডেলিভারি এবং ডিজিটাল পেমেন্ট দুটিই প্রযোজ্য।")}</li>
              </ul>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-3 text-xs text-[#193B5B] max-w-2xl leading-relaxed">
              <p>
                {t(
                  "Shop with confidence. If you receive a damaged, defective, or mismatched product, you are eligible for an immediate replacement or full refund within 7 calendar days.",
                  "কোনো পণ্য ত্রুটিপূর্ণ বা ছবির সাথে অমিল হলে আপনি ৭ দিনের মধ্যে রিপ্লেসমেন্ট অথবা রিফান্ডের সুবিধা পাবেন।"
                )}
              </p>
              <p className="text-[#718398]">
                {t(
                  "Please ensure original packaging, tags, and accessories remain intact when requesting an exchange or return.",
                  "রিটার্নের ক্ষেত্রে মূল প্যাকেট ও ট্যাগ অক্ষত রাখা আবশ্যক।"
                )}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 4. RELATED PRODUCTS SECTION (Strictly 5 Product Cards per Row on Desktop) */}
      {relatedProducts.length > 0 && (
        <section className="rounded-[32px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12)]">
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(130,170,205,0.2)]">
            <div>
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
                + {t("COMPANION PIECES", "সম্পর্কিত সংগ্রহ")}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight mt-0.5">
                {t("Related Products You May Like", "সম্পর্কিত অন্যান্য পণ্য")}
              </h2>
            </div>

            {productCollection && (
              <Link
                to={`/collection/${productCollection.slug}`}
                className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] transition-colors shadow-xs"
              >
                <span>{t("View Collection", "সম্পূর্ণ কালেকশন")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#718398]" />
              </Link>
            )}
          </div>

          {/* Strictly 5 columns on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 items-stretch">
            {relatedProducts.map((relProduct) => (
              <div key={relProduct.id} className="h-full">
                <ProductCard
                  product={relProduct}
                  isFav={favorites.includes(relProduct.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectProduct={(p) => navigate(`/product/${generateProductSlug(p)}`)}
                  onAddToCart={addToCart}
                  compact={false}
                  showCategory={true}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FULL-SCREEN LIGHTBOX ZOOM MODAL WITH MULTI-LEVEL ZOOM & THUMBNAILS */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#101C35]/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Top Bar: Title, Zoom Controls & Close */}
          <div
            className="flex items-center justify-between gap-3 text-white z-20 pb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-semibold text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                {product.name}
              </span>
              {images.length > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono shrink-0">
                  {activeImageIndex + 1} / {images.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Scale Multiplier Button */}
              <button
                type="button"
                onClick={() => setZoomScale(prev => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
                title="Toggle Zoom Level"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#69C5F5]" />
                <span>{zoomScale}×</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none"
                aria-label="Close zoom"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Stage: Constrained Zoom Viewer */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-auto my-3 p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Photo in Modal */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition-all z-20 focus:outline-none"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div
              className="max-w-4xl max-h-[75vh] flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <img
                src={activeImageUrl}
                alt={product.name}
                className="max-w-full max-h-[72vh] object-contain rounded-[14px] shadow-2xl bg-white/5"
              />
            </div>

            {/* Next Photo in Modal */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition-all z-20 focus:outline-none"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Thumbnail Strip & Keyboard Hint */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="hidden sm:inline text-[11px] text-white/60">
              {t("Tip: Use Arrow keys to navigate photos, Esc to close", "টিপ: কীবোর্ডের তীর বাটন দিয়ে ছবি পরিবর্তন করুন")}
            </span>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar mx-auto sm:mx-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-[10px] bg-white border-2 flex items-center justify-center overflow-hidden shrink-0 transition-all ${activeImageIndex === idx
                      ? 'border-[#0877C9] scale-105 shadow-md'
                      : 'border-white/40 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <ProductImage
                      src={imgUrl}
                      alt={`Thumb ${idx + 1}`}
                      fit="contain"
                      aspectRatio="square"
                      className="p-0.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
