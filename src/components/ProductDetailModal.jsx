import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingBag, ArrowRight, Heart, Check, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Premium Transparent Glassmorphism Product Detail Modal
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#101C35]/50 backdrop-blur-md animate-in fade-in duration-200 select-none">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-4xl glass-modal rounded-[28px] overflow-hidden my-6 max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-8.5 h-8.5 rounded-full glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Gallery with Thumbnails */}
        <div className="w-full md:w-1/2 p-6 sm:p-7 bg-[#F8FBFF]/70 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/80">
          
          {/* Main Selected Image */}
          <div className="relative w-full aspect-square flex items-center justify-center rounded-[22px] bg-white/90 p-4 border border-white shadow-2xs overflow-hidden">
            <img
              src={images[activeImageIndex] || selectedProduct.main_image}
              alt={selectedProduct.name}
              loading="eager"
              decoding="async"
              onError={(e) => {
                if (e.target.src !== selectedProduct.main_image) {
                  e.target.src = selectedProduct.main_image;
                }
              }}
              className="w-full h-full object-contain filter drop-shadow-xs transition-all duration-300"
            />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-[#101C35]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-xs border border-white/20">
                {selectedProduct.badge || 'Curated'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#D9EDFF]/90 backdrop-blur-md text-[#0877C9] text-[9px] font-mono font-bold border border-white/50">
                #{selectedProduct.id}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full glass-button flex items-center justify-center shadow-xs transition-all ${
                isFav ? 'text-[#0877C9] bg-white' : 'text-[#71849B] hover:text-[#0877C9]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#0877C9] stroke-[#0877C9]' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#71849B] mb-2">
              {t("AUTHENTIC PRODUCT VIEWS", "পণ্যের ছবিসমূহ")} ({images.length})
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-[14px] p-1.5 bg-white/90 backdrop-blur-sm border flex-shrink-0 transition-all overflow-hidden flex items-center justify-center ${
                    activeImageIndex === idx
                      ? 'border-[#0877C9] ring-2 ring-[#0877C9]/30 shadow-xs scale-105'
                      : 'border-white/80 opacity-70 hover:opacity-100 hover:border-[#69C5F5]'
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
          <div className="mt-4 pt-3 border-t border-white/80 flex items-center justify-between text-[11px] text-[#71849B] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
              {t("Inspected Quality", "মান নিশ্চিত")}
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0877C9]" />
              {t("Doorstep Courier BD", "হোম ডেলিভারি")}
            </span>
          </div>

        </div>

        {/* Right Column: Product Specs, Variants, Quantity, Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0877C9] tracking-wider uppercase">
                {selectedProduct.category || selectedProduct.primary_collection_name}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#101C35]">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{selectedProduct.rating || 4.8}</span>
                <span className="text-[#71849B]">({selectedProduct.reviews_count || 32} {t("reviews", "রিভিউ")})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-2xl font-black text-[#101C35] tracking-tight leading-snug">
              {t(selectedProduct.name, selectedProduct.name_bn)}
            </h2>

            {/* Price Box */}
            <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#F0F7FF] to-[#E6F3FF] border border-white/80 flex items-baseline justify-between shadow-2xs">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#101C35]">
                  ৳{selectedProduct.price.toLocaleString()}
                </span>
                <span className="ml-2 text-[11px] font-bold text-[#0877C9]">
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
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71849B]">
                {t("AUTHENTIC PRODUCT DETAILS & SPECIFICATIONS", "অনুমোদিত পণ্যের বিবরণ ও স্পেসিফিকেশন")}
              </span>
              <div className="text-xs sm:text-[13px] text-[#101C35]/85 leading-relaxed whitespace-pre-line bg-white/70 p-3.5 rounded-[16px] border border-white/80 max-h-40 overflow-y-auto">
                {selectedProduct.description || selectedProduct.description_en || t("Description details available upon request.", "বিস্তারিত বিবরণ শীঘ্রই যুক্ত হচ্ছে।")}
              </div>
            </div>

            {/* Delivery & Return Policies Box */}
            <div className="p-3.5 rounded-[16px] bg-[#F8FBFF]/90 border border-white/80 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#0877C9] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#101C35]">
                    {t("Delivery Timeline & Rates", "ডেলিভারি সময় ও খরচ")}
                  </h4>
                  <p className="text-[#71849B] text-[11px] mt-0.5 leading-relaxed">
                    • {t("Inside Dhaka: ৳70 (24–48 hours)", "ঢাকার ভেতরে: ৭০৳ (২৪–৪৮ ঘণ্টা)")}<br />
                    • {t("Outside Dhaka: ৳130 (2–4 business days)", "ঢাকার বাইরে: ১৩০৳ (২–৪ কার্যদিবস)")}<br />
                    • <strong className="text-[#0877C9]">{t("FREE Nationwide Delivery on orders over ৳3,000", "৩০০০৳ এর অর্ডারে সারা দেশে ফ্রি হোম ডেলিভারি")}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Variant / Color Selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#101C35]">
                  <span>{t("Select Edition / Color", "রং বা এডিশন নির্বাচন করুন")}:</span>
                  <span className="text-[#0877C9] font-semibold">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedVariant === v
                          ? 'bg-[#0877C9] text-white shadow-2xs'
                          : 'glass-button text-[#71849B]'
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
              <span className="text-xs font-bold text-[#101C35]">
                {t("Quantity", "পরিমাণ")}:
              </span>
              <div className="flex items-center glass-panel rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#101C35] hover:bg-white/80"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#101C35]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-[#101C35] hover:bg-white/80"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/80 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (selectedProduct.in_stock !== false) {
                  addToCart(selectedProduct, selectedVariant, quantity);
                  setSelectedProduct(null);
                }
              }}
              disabled={selectedProduct.in_stock === false}
              className={`flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 ${
                selectedProduct.in_stock !== false
                  ? 'glass-button text-[#0877C9] hover:bg-white active:scale-95'
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
              className={`flex-1 py-3 px-4 rounded-full font-black text-xs sm:text-sm glass-button-primary transition-all flex items-center justify-center gap-2 ${
                selectedProduct.in_stock !== false
                  ? 'active:scale-95'
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
