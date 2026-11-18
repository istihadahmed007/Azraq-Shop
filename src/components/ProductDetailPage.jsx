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
          if (catalogStatus === 'loading') {
            setFetchStatus('loading');
          } else {
            setFetchStatus('notFound');
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
        if (err.name === 'AbortError') return;
        setFetchStatus('networkError');
        setFetchError(err.message || 'Network error loading product');
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, productFromContext, catalogStatus, fetchAttempt, injectProduct]);

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

      // Scroll smoothly to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  // 1. Loading state: active when product is being loaded from single record or catalog
  const isStillLoading = !product && (
    fetchStatus === 'loading' || 
    fetchStatus === 'idle' || 
    (fetchStatus !== 'error' && fetchStatus !== 'networkError' && fetchStatus !== 'serverError' && fetchStatus !== 'notFound' && catalogStatus === 'loading')
  );

  if (isStillLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-10 h-10 rounded-full border-3 border-[#0877C9]/30 border-t-[#0877C9] animate-spin mb-3" />
        <span className="text-xs text-[#6B7D93] font-medium">
          {t("Loading authentic catalog details...", "পণ্যের বিবরণ লোড হচ্ছে...")}
        </span>
      </div>
    );
  }

  // 2. Recoverable Network Error state (CRITICAL: NEVER display 404 for network errors or timeouts)
  if (!product && (fetchStatus === 'networkError' || fetchStatus === 'error')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#FFF1F0] border border-[#FFA39E] flex items-center justify-center mb-4 text-[#CF1322]">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#293B52] mb-2">
          {t("Network Connection Issue", "নেটওয়ার্ক সংযোগ সমস্যা")}
        </h1>
        <p className="text-xs text-[#6B7D93] max-w-md mb-6">
          {fetchError || t("A network connection or server timeout occurred while loading this product. Please check your connection and retry.", "সংযোগজনিত সমস্যার কারণে পণ্যটি লোড করা যায়নি। দয়া করে পুনরায় চেষ্টা করুন।")}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white font-bold text-xs shadow-md hover:bg-[#0665AC] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("Retry", "পুনরায় চেষ্টা করুন")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-[#293B52] font-semibold text-xs hover:bg-[#E4EEF5] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{t("Back to Home", "হোমপেজে ফিরে যান")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2b. Recoverable Server Error state (500s)
  if (!product && fetchStatus === 'serverError') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#FFF7E6] border border-[#FFD591] flex items-center justify-center mb-4 text-[#D46B08]">
          <ServerCrash className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#293B52] mb-2">
          {t("Service Temporarily Unavailable", "সার্ভার সাময়িকভাবে অনুপলব্ধ")}
        </h1>
        <p className="text-xs text-[#6B7D93] max-w-md mb-6">
          {fetchError || t("The catalog server encountered a temporary error. Your cart and session are safe. Please retry.", "ক্যাটালগ সার্ভারে সাময়িক সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।")}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white font-bold text-xs shadow-md hover:bg-[#0665AC] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("Retry", "পুনরায় চেষ্টা করুন")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-[#293B52] font-semibold text-xs hover:bg-[#E4EEF5] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{t("Back to Home", "হোমপেজে ফিরে যান")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Genuine 404 (Not Found) state: shown only when single product resolution returns 404 AND full catalog check completes
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] flex items-center justify-center mb-4 text-[#0877C9]">
          <Package className="w-8 h-8 opacity-70" />
        </div>
        <h1 className="text-2xl font-bold text-[#293B52] mb-2">
          {t("Product Not Found", "পণ্যটি খুঁজে পাওয়া যায়নি")}
        </h1>
        <p className="text-sm text-[#6B7D93] max-w-md mb-6">
          {t(
            "The product you are looking for might have been moved or is currently unavailable in our catalog.",
            "আপনি যে পণ্যটি খুঁজছেন তা ক্যাটালগে নেই অথবা সরানো হয়েছে।"
          )}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white font-bold text-xs shadow-md hover:bg-[#0665AC] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{t("Browse All Products", "সব পণ্য দেখুন")}</span>
          <ArrowRight className="w-4 h-4" />
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
    <div className="w-full select-none flex flex-col gap-8 pb-12">

      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#6B7D93] overflow-x-auto whitespace-nowrap pt-1">
        <Link to="/" className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#8CA0B6]" />

        {productCollection && (
          <>
            <Link to={`/collection/${productCollection.slug}`} className="hover:text-[#0877C9] transition-colors">
              {productCollection.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#8CA0B6]" />
          </>
        )}

        <span className="text-[#293B52] font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* 2. MAIN PRODUCT DETAIL SHOWCASE (55% Gallery Left / 45% Information Right) */}
      <div className="rounded-[28px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-5 sm:p-8 md:p-10 shadow-[0_12px_36px_rgba(50,75,100,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ========================================================= */}
          {/* LEFT COLUMN: PRODUCT IMAGE GALLERY (~55% width, col-span-7) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Primary Main Image Viewer */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative w-full aspect-square max-h-[560px] mx-auto rounded-[22px] bg-white border border-[#D5E2EE]/80 overflow-hidden shadow-inner flex items-center justify-center group cursor-zoom-in"
            >

              {/* Product Photograph with object-contain to preserve 100% of the image without distortion */}
              <ProductImage
                src={activeImageUrl}
                alt={product.name}
                fit="contain"
                aspectRatio="square"
                priority={true}
                containerClassName="p-3 sm:p-5"
              />

              {/* Prev / Next Controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#D5E2EE] text-[#293B52] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#D5E2EE] text-[#293B52] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
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
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#D5E2EE] text-[#6B7D93] hover:text-[#0877C9] flex items-center justify-center shadow-xs transition-colors"
                  title={t("Zoom photo", "বড় করে দেখুন")}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Top-Left Authentic Discount Badge */}
              {discountPercent && discountPercent > 0 ? (
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-[#EE8056] text-white text-xs font-extrabold shadow-sm">
                    -{discountPercent}%
                  </span>
                </div>
              ) : null}

              {/* Hover Zoom Pill Indicator */}
              <div className="absolute bottom-3 left-3 bg-[#101C35]/75 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm z-10">
                <ZoomIn className="w-3.5 h-3.5 text-[#69C5F5]" />
                <span>{t("Click to Zoom", "বড় করে দেখুন")}</span>
              </div>

              {/* Image counter indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-xs z-10">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-[14px] bg-white border-2 flex items-center justify-center overflow-hidden shrink-0 transition-all ${activeImageIndex === idx
                      ? 'border-[#0877C9] shadow-sm scale-102'
                      : 'border-[#D5E2EE]/80 opacity-70 hover:opacity-100'
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDF4F9] border border-[#D5E2EE]/80">
                <ShieldCheck className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-semibold text-[#293B52] leading-tight">
                  {t("100% Authentic Quality", "১০০% আসল পণ্য")}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDF4F9] border border-[#D5E2EE]/80">
                <Truck className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-semibold text-[#293B52] leading-tight">
                  {t("Doorstep Delivery", "হোম ডেলিভারি")}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-[16px] bg-[#EDF4F9] border border-[#D5E2EE]/80 col-span-2 sm:col-span-1">
                <RotateCcw className="w-4 h-4 text-[#0877C9] shrink-0" />
                <span className="text-[11px] font-semibold text-[#293B52] leading-tight">
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
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-xs font-bold text-[#0877C9]">
                  {product.category || product.primary_collection_name || t("Catalog Item", "ক্যাটালগ পণ্য")}
                </span>

                <span className="text-xs font-mono font-semibold text-[#6B7D93]">
                  SKU: {product.sku || product.id}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#293B52] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="p-4 rounded-[20px] bg-[#EDF4F9] border border-[#D5E2EE]/90 flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7D93] block mb-0.5">
                    {t("Current Price", "বর্তমান মূল্য")}
                  </span>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-[#0877C9] tracking-tight">
                      ৳{(product.price || 0).toLocaleString()}
                    </span>
                    {originalPrice && originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-[#8CA0B6] line-through font-normal">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status Badge */}
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-red-600'}`} />
                    {isAvailable ? t("In Stock", "স্টকে আছে") : t("Out of Stock", "স্টক শেষ")}
                  </span>
                </div>
              </div>

              {/* Variant / Edition / Size Selector (Only when variants exist) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-[#293B52] block uppercase tracking-wider">
                    {t("Select Edition / Size:", "এডিশন / সাইজ নির্বাচন করুন:")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedVariant === variant
                          ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-sm'
                          : 'bg-white text-[#293B52] border-[#D5E2EE] hover:border-[#0877C9]'
                          }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-[#293B52] block uppercase tracking-wider">
                  {t("Quantity:", "পরিমাণ:")}
                </label>
                <div className="inline-flex items-center rounded-full bg-white border border-[#D5E2EE] p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || !isAvailable}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#293B52] hover:bg-[#EDF4F9] disabled:opacity-40 transition-colors font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-[#293B52]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={!isAvailable}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#293B52] hover:bg-[#EDF4F9] disabled:opacity-40 transition-colors font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons: Add to Bag & Buy Now */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#EDF4F9] hover:bg-white text-[#0877C9] border border-[#0877C9]/40 hover:border-[#0877C9] font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t("Add to Bag", "ব্যাগে যোগ করুন")}</span>
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#0877C9] hover:bg-[#0665AC] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{t("Buy Now", "সরাসরি কিনুন")}</span>
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shrink-0 ${isFav
                    ? 'bg-red-50 text-[#EE8056] border-[#EE8056] shadow-sm'
                    : 'bg-white text-[#6B7D93] border-[#D5E2EE] hover:text-[#EE8056] hover:border-[#EE8056]'
                    }`}
                  title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দের তালিকায় রাখুন")}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-[#EE8056] stroke-[#EE8056]' : ''}`} />
                </button>

              </div>

              {/* Delivery Rates & Guarantee Box */}
              <div className="p-4 rounded-[18px] bg-[#EDF4F9]/70 border border-[#D5E2EE] text-xs text-[#293B52] space-y-2 mt-2">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#0877C9] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#293B52] block">
                      {t("Delivery Timeline & Rates", "ডেলিভারি সময় ও চার্জ")}
                    </span>
                    <p className="text-[#6B7D93] text-[11px] leading-relaxed mt-0.5">
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
      <div className="rounded-[28px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-6 sm:p-8 shadow-[0_10px_30px_rgba(50,75,100,0.06)]">

        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-[#D5E2EE] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'overview'
              ? 'bg-[#0877C9] text-white shadow-2xs'
              : 'text-[#6B7D93] hover:text-[#293B52]'
              }`}
          >
            {t("Overview & Description", "পণ্যের বিবরণ")}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'specs'
              ? 'bg-[#0877C9] text-white shadow-2xs'
              : 'text-[#6B7D93] hover:text-[#293B52]'
              }`}
          >
            {t("Specifications", "স্পেসিফিকেশন")}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'delivery'
              ? 'bg-[#0877C9] text-white shadow-2xs'
              : 'text-[#6B7D93] hover:text-[#293B52]'
              }`}
          >
            {t("Shipping & Logistics", "ডেলিভারি ও শিপিং")}
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'returns'
              ? 'bg-[#0877C9] text-white shadow-2xs'
              : 'text-[#6B7D93] hover:text-[#293B52]'
              }`}
          >
            {t("Return Policy", "রিটার্ন পলিসি")}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'overview' && (
            <div className="prose max-w-none text-xs sm:text-sm text-[#293B52] leading-relaxed whitespace-pre-line font-bengali">
              {product.description || product.description_en || product.description_bn || t(
                "Authentic catalog specifications verified by EasyDrop manufacturing partner.",
                "আসল পণ্যের নিশ্চয়তা ও মান যাচাইকৃত।"
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl text-xs">
              <div className="p-3 rounded-[14px] bg-[#EDF4F9] border border-[#D5E2EE]/80 flex justify-between">
                <span className="font-semibold text-[#6B7D93]">{t("Product ID", "পণ্য আইডি")}:</span>
                <span className="font-mono font-bold text-[#293B52]">{product.id}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#EDF4F9] border border-[#D5E2EE]/80 flex justify-between">
                <span className="font-semibold text-[#6B7D93]">{t("Catalog SKU", "ক্যাটালগ এসকেইউ")}:</span>
                <span className="font-mono font-bold text-[#293B52]">{product.sku || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#EDF4F9] border border-[#D5E2EE]/80 flex justify-between">
                <span className="font-semibold text-[#6B7D93]">{t("Primary Category", "মূল ক্যাটাগরি")}:</span>
                <span className="font-bold text-[#293B52]">{product.category || product.primary_collection_name}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#EDF4F9] border border-[#D5E2EE]/80 flex justify-between">
                <span className="font-semibold text-[#6B7D93]">{t("Quality Guarantee", "কোয়ালিটি গ্যারান্টি")}:</span>
                <span className="font-bold text-emerald-700">{t("100% Verified Authentic", "১০০% ভেরিফাইড আসল")}</span>
              </div>
              {product.supplier_url && (
                <div className="p-3 rounded-[14px] bg-[#EDF4F9] border border-[#D5E2EE]/80 flex justify-between col-span-1 sm:col-span-2">
                  <span className="font-semibold text-[#6B7D93]">{t("Fulfillment Partner", "ফুলফিলমেন্ট পার্টনার")}:</span>
                  <span className="font-bold text-[#293B52]">EasyDrop Verified Supplier</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3 text-xs text-[#293B52] max-w-2xl leading-relaxed">
              <p>
                {t(
                  "All orders are processed and dispatched within 24 hours from verified hubs in Dhaka. You will receive an instant SMS tracking ID once the courier receives your package.",
                  "সকল অর্ডার ২৪ ঘণ্টার মধ্যে ঢাকা হাব থেকে প্রসেস ও ডিসপ্যাচ করা হয়। কুরিয়ারে হস্তান্তরের সাথে সাথে এসএমএস ও ট্র্যাকিং আইডি দেওয়া হয়।"
                )}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7D93]">
                <li>{t("Inside Dhaka City: Delivered within 24–48 hours via Steedfast / Pathao.", "ঢাকা সিটির ভেতরে: ২৪–৪৮ ঘণ্টার মধ্যে ডেলিভারি।")}</li>
                <li>{t("Outside Dhaka: Delivered within 48–72 hours across all 64 districts.", "ঢাকা সিটির বাইরে: ৪৮–৭২ ঘণ্টার মধ্যে দেশব্যাপী ৬৪ জেলায় ডেলিভারি।")}</li>
                <li>{t("Cash on Delivery (COD) and Paymently secure digital payments supported.", "ক্যাশ অন ডেলিভারি এবং ডিজিটাল পেমেন্ট দুটিই প্রযোজ্য।")}</li>
              </ul>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-3 text-xs text-[#293B52] max-w-2xl leading-relaxed">
              <p>
                {t(
                  "Shop with confidence. If you receive a damaged, defective, or mismatched product, you are eligible for an immediate replacement or full refund within 7 calendar days.",
                  "কোনো পণ্য ত্রুটিপূর্ণ বা ছবির সাথে অমিল হলে আপনি ৭ দিনের মধ্যে রিপ্লেসমেন্ট অথবা রিফান্ডের সুবিধা পাবেন।"
                )}
              </p>
              <p className="text-[#6B7D93]">
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
        <section className="rounded-[28px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-6 sm:p-8 shadow-[0_10px_30px_rgba(50,75,100,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
                  {t("Related Products You May Like", "সম্পর্কিত অন্যান্য পণ্য")}
                </h2>
                <p className="text-xs text-[#6B7D93]">
                  {t("Curated items from the same category and collection", "একই ক্যাটাগরির বাছাইকৃত বিকল্প")}
                </p>
              </div>
            </div>

            {productCollection && (
              <Link
                to={`/collection/${productCollection.slug}`}
                className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] shadow-2xs transition-all"
              >
                <span>{t("View Collection", "সম্পূর্ণ কালেকশন")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Strictly 5 columns on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">
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
