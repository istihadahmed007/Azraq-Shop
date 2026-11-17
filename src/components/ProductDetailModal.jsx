import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingBag, ArrowRight, Heart, Check, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#062B4F]/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#69C5F5]/30 overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#062B4F] shadow-md border border-[#D9F0FF] flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery with Thumbnails */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-[#F8FCFF] to-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
          
          {/* Main Selected Image - Prominent, square ratio, contain */}
          <div className="relative w-full aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#F5F7FA]/90 to-white/70 p-4 shadow-sm border border-white/80 overflow-hidden">
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
              className="w-full h-full object-contain filter drop-shadow-sm transition-all duration-300"
            />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-[#101C35]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20">
                {selectedProduct.badge || 'Curated'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#D9F0FF]/90 backdrop-blur-sm text-[#183B70] text-[9px] font-mono font-bold border border-white/50">
                SKU: #{selectedProduct.id}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                isFav ? 'bg-[#2563EB] text-white' : 'bg-white/90 backdrop-blur-sm text-[#101C35]/50 hover:text-[#2563EB] border border-white/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white stroke-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Carousel / Grid */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#101C35]/50 mb-2">
              {t("AUTHENTIC PRODUCT VIEWS", "পণ্যের ছবিসমূহ")} ({images.length})
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 bg-white/90 backdrop-blur-sm border flex-shrink-0 transition-all overflow-hidden flex items-center justify-center ${
                    activeImageIndex === idx
                      ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-md scale-105'
                      : 'border-gray-200/80 opacity-70 hover:opacity-100 hover:border-gray-300'
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
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#062B4F]/70 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
              {t("Inspected Quality", "মান নিশ্চিত")}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#50DDF0]" />
              {t("Doorstep Courier BD", "হোম ডেলিভারি")}
            </span>
          </div>

        </div>

        {/* Right Column: Product Specs, Variants, Quantity, Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0877C9] tracking-wider uppercase">
                {selectedProduct.category || selectedProduct.primary_collection_name}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#062B4F]">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{selectedProduct.rating || 4.8}</span>
                <span className="text-[#062B4F]/50">({selectedProduct.reviews_count || 32} {t("reviews", "রিভিউ")})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-black text-[#062B4F] tracking-tight leading-snug">
              {t(selectedProduct.name, selectedProduct.name_bn)}
            </h2>

            {/* Price Box - Strict EasyDrop Retail Price with Zero Markup */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#F0F7FF] to-[#E6F3FF] border border-[#D9F0FF] flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#062B4F]">
                  ৳{selectedProduct.price.toLocaleString()}
                </span>
                <span className="ml-2 text-[11px] font-bold text-[#0877C9]">
                  {t("Original Retail Price", "নির্ধারিত খুচরা মূল্য")}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                selectedProduct.in_stock !== false 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {selectedProduct.in_stock !== false ? t("In Stock", "স্টক আছে") : t("Out of Stock", "স্টক শেষ")}
              </span>
            </div>

            {/* Authentic Supplier Description - Exact EasyDrop Content */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#062B4F]/60">
                {t("AUTHENTIC PRODUCT DETAILS & SPECIFICATIONS", "অনুমোদিত পণ্যের বিবরণ ও স্পেসিফিকেশন")}
              </span>
              <div className="text-xs sm:text-sm text-[#062B4F]/80 leading-relaxed whitespace-pre-line bg-gray-50/80 p-4 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                {selectedProduct.description || selectedProduct.description_en || t("Description details available upon request.", "বিস্তারিত বিবরণ শীঘ্রই যুক্ত হচ্ছে।")}
              </div>
            </div>

            {/* Delivery & Return Policies Box */}
            <div className="p-4 rounded-xl bg-[#F8FCFF] border border-[#D9F0FF] space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#0877C9] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#062B4F]">
                    {t("Delivery Timeline & Rates", "ডেলিভারি সময় ও খরচ")}
                  </h4>
                  <p className="text-[#062B4F]/70 text-[11px] mt-0.5 leading-relaxed">
                    • {t("Inside Dhaka: ৳70 (24–48 hours)", "ঢাকার ভেতরে: ৭০৳ (২৪–৪৮ ঘণ্টা)")}<br />
                    • {t("Outside Dhaka: ৳130 (2–4 business days)", "ঢাকার বাইরে: ১৩০৳ (২–৪ কার্যদিবস)")}<br />
                    • <strong className="text-[#0877C9]">{t("FREE Nationwide Delivery on orders over ৳3,000", "৩০০০৳ এর অর্ডারে সারা দেশে ফ্রি হোম ডেলিভারি")}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-[#D9F0FF]/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#062B4F]">
                    {t("7-Day Return & Doorstep Inspection", "৭ দিনের রিপ্লেসমেন্ট ও পার্সেল চেক")}
                  </h4>
                  <p className="text-[#062B4F]/70 text-[11px] mt-0.5 leading-relaxed">
                    {t(
                      "Inspect your parcel in front of the courier rider. 7-day hassle-free replacement for defective or damaged products.",
                      "কুরিয়ার রাইডারের সামনে পার্সেল দেখে নিন। ত্রুটিপূর্ণ বা ক্ষতিগ্রস্ত পণ্যে ৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি।"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Variant / Color Selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#062B4F]">
                  <span>{t("Select Edition / Color", "রং বা এডিশন নির্বাচন করুন")}:</span>
                  <span className="text-[#0877C9] font-semibold">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedVariant === v
                          ? 'bg-[#062B4F] text-white shadow-sm ring-2 ring-[#50DDF0]'
                          : 'bg-gray-100 hover:bg-gray-200 text-[#062B4F]/80'
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
              <span className="text-xs font-bold text-[#062B4F]">
                {t("Quantity", "পরিমাণ")}:
              </span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1 text-sm font-bold text-[#062B4F] hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#062B4F]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1 text-sm font-bold text-[#062B4F] hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
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
                  ? 'border-2 border-[#0877C9] text-[#0877C9] hover:bg-[#F0F7FF] active:scale-95'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
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
              className={`flex-1 py-3 px-4 rounded-full font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 ${
                selectedProduct.in_stock !== false
                  ? 'bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#0966ab] hover:to-[#1d4ed8] text-white active:scale-95'
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
