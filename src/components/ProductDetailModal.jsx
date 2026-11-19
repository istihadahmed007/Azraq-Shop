import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingBag, ArrowRight, Heart, Check, RefreshCw, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Legacy Product Detail Modal (Deprecated in favor of dedicated /product/:slug pages)
 */
export default function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    favorites,
    toggleFavorite,
    setIsCheckoutOpen,
    t
  } = useShop();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(selectedProduct.main_image_index || 0);
  const [selectedVariant, setSelectedVariant] = useState(
    selectedProduct.variants ? selectedProduct.variants[0] : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  const isFav = favorites.includes(selectedProduct.id);
  const images = selectedProduct.images || [selectedProduct.main_image];

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOpenDedicatedPage = () => {
    setSelectedProduct(null);
    window.location.href = `/product/${generateProductSlug(selectedProduct)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-azraq-deep/40 backdrop-blur-md animate-in fade-in duration-200 select-none">

      {/* Modal Dialog Container */}
      <div
        className="relative w-full max-w-4xl glass-panel rounded-3xl bg-[rgba(248,251,255,0.95)] overflow-hidden my-6 max-h-[90vh] flex flex-col md:flex-row shadow-[0_24px_64px_rgba(25,59,91,0.24)] border border-[rgba(130,170,205,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full glass-card hover:bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-azraq-secondary hover:text-azraq-deep transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Gallery with Thumbnails */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 bg-[rgba(241,247,252,0.65)] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[rgba(130,170,205,0.22)]">

          {/* Main Selected Image: Protected from flex distortion by ProductImage */}
          <div className="card-image-wrapper relative w-full aspect-square flex items-center justify-center rounded-2xl bg-white/90 p-3 border border-[rgba(130,170,205,0.25)] shadow-xs overflow-hidden">
            <ProductImage
              src={images[activeImageIndex] || selectedProduct.main_image}
              alt={selectedProduct.name}
              fit="contain"
              aspectRatio="square"
              priority={true}
              className="p-2"
            />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-azraq-deep/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-xs border border-white/20">
                {selectedProduct.badge || 'Curated'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-azraq-ice/90 backdrop-blur-md text-azraq-deep text-[9px] font-mono font-bold border border-[rgba(130,170,205,0.3)]">
                #{selectedProduct.id}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full glass-card border border-[rgba(130,170,205,0.3)] flex items-center justify-center shadow-xs transition-all ${
                isFav ? 'text-azraq-cyan bg-white' : 'text-azraq-secondary hover:text-azraq-deep'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-azraq-cyan stroke-azraq-cyan' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="mt-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-azraq-secondary mb-1.5">
              {t("AUTHENTIC PRODUCT VIEWS", "পণ্যের ছবিসমূহ")} ({images.length})
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-13 h-13 rounded-xl p-1 bg-white border flex-shrink-0 transition-all overflow-hidden flex items-center justify-center ${
                    activeImageIndex === idx
                      ? 'border-azraq-cyan ring-2 ring-azraq-cyan/30 shadow-xs scale-102'
                      : 'border-[rgba(130,170,205,0.25)] opacity-70 hover:opacity-100 hover:border-azraq-cyan'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Trust Guarantee Note */}
          <div className="mt-3.5 pt-3 border-t border-[rgba(130,170,205,0.2)] flex items-center justify-between text-[11px] text-azraq-secondary font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-azraq-cyan" />
              {t("Inspected Quality", "মান নিশ্চিত")}
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-azraq-cyan" />
              {t("Doorstep Courier BD", "হোম ডেলিভারি")}
            </span>
          </div>

        </div>

        {/* Right Column: Product Specs, Variants, Quantity, Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-7 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-4">

          <div className="space-y-3.5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-azraq-secondary tracking-wider uppercase">
                {selectedProduct.category || selectedProduct.primary_collection_name}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-azraq-deep">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{selectedProduct.rating || 4.8}</span>
                <span className="text-azraq-secondary">({selectedProduct.reviews_count || 32} {t("reviews", "রিভিউ")})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-2xl font-black text-azraq-deep tracking-tight leading-snug">
              {t(selectedProduct.name, selectedProduct.name_bn)}
            </h2>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl glass-card border border-[rgba(130,170,205,0.3)] bg-gradient-to-r from-white/90 to-[#DDEEFF]/40 flex items-baseline justify-between shadow-xs">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-azraq-deep">
                  ৳{selectedProduct.price.toLocaleString()}
                </span>
                <span className="ml-2 text-[11px] font-bold text-azraq-secondary">
                  {t("BDT Retail Price", "নির্ধারিত মূল্য")}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                selectedProduct.in_stock !== false 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {selectedProduct.in_stock !== false ? t("In Stock", "স্টক আছে") : t("Out of Stock", "স্টক শেষ")}
              </span>
            </div>

            {/* Product Details & Specifications */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-azraq-secondary">
                {t("AUTHENTIC PRODUCT DETAILS & SPECIFICATIONS", "অনুমোদিত পণ্যের বিবরণ ও স্পেসিফিকেশন")}
              </span>
              <div className="text-xs sm:text-[13px] text-azraq-deep/90 leading-relaxed whitespace-pre-line bg-white/80 p-3.5 rounded-2xl border border-[rgba(130,170,205,0.22)] max-h-36 overflow-y-auto">
                {selectedProduct.description || selectedProduct.description_en || t("Description details available upon request.", "বিস্তারিত বিবরণ শীঘ্রই যুক্ত হচ্ছে।")}
              </div>
            </div>

            {/* Delivery & Return Policies Box */}
            <div className="p-3.5 rounded-2xl bg-[rgba(241,247,252,0.8)] border border-[rgba(130,170,205,0.22)] space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-azraq-cyan mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-azraq-deep">
                    {t("Delivery Timeline & Rates", "ডেলিভারি সময় ও খরচ")}
                  </h4>
                  <p className="text-azraq-secondary text-[11px] mt-0.5 leading-relaxed">
                    • {t("Inside Dhaka: ৳80 (24–48 hours)", "ঢাকার ভেতরে: ৮০৳ (২৪–৪৮ ঘণ্টা)")}<br />
                    • {t("Outside Dhaka: ৳150 (2–4 business days)", "ঢাকার বাইরে: ১৫০৳ (২–৪ কার্যদিবস)")}<br />
                    • <strong className="text-azraq-deep">{t("FREE Nationwide Delivery on orders over ৳3,000", "৩০০০৳ এর অর্ডারে সারা দেশে ফ্রি হোম ডেলিভারি")}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Variant / Color Selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-deep">
                  <span>{t("Select Edition / Color", "রং বা এডিশন নির্বাচন করুন")}:</span>
                  <span className="text-azraq-cyan font-semibold">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        selectedVariant === v
                          ? 'bg-azraq-deep text-white border-azraq-deep shadow-xs'
                          : 'glass-card text-azraq-secondary border-[rgba(130,170,205,0.3)] hover:bg-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-azraq-deep">
                {t("Quantity", "পরিমাণ")}:
              </span>
              <div className="flex items-center glass-card rounded-xl overflow-hidden border border-[rgba(130,170,205,0.3)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-azraq-deep hover:bg-white/80"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-azraq-deep">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-azraq-deep hover:bg-white/80"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[rgba(130,170,205,0.2)] flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                if (selectedProduct.in_stock !== false) {
                  addToCart(selectedProduct, selectedVariant, quantity);
                  setSelectedProduct(null);
                }
              }}
              disabled={selectedProduct.in_stock === false}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 ${
                selectedProduct.in_stock !== false
                  ? 'btn-secondary-glass text-azraq-deep hover:bg-white shadow-xs'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {selectedProduct.in_stock !== false
                  ? t("Add to Bag", "ব্যাগে রাখুন")
                  : t("Out of Stock", "স্টক নেই")}
              </span>
            </button>

            <button
              onClick={() => {
                if (selectedProduct.in_stock !== false) {
                  handleBuyNow();
                }
              }}
              disabled={selectedProduct.in_stock === false}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(112,200,237,0.35)] ${
                selectedProduct.in_stock !== false
                  ? 'btn-primary-icy text-azraq-deep'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>
                {selectedProduct.in_stock !== false
                  ? t("Buy Now", "সরাসরি অর্ডার করুন")
                  : t("Out of Stock", "স্টক শেষ")}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
