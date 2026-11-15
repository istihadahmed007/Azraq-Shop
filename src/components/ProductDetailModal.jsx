import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ArrowRight, Heart, Check, RefreshCw } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-azraq-navy/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-none shadow-2xl border border-azraq-purple/20 overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-azraq-navy shadow-md border border-azraq-purple/20 flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery with Thumbnails */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-[#F7F8FC] to-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
          
          {/* Main Selected Image - Prominent, square corners, contain */}
          <div className="relative w-full h-80 sm:h-96 flex items-center justify-center rounded-none bg-white p-3 shadow-sm border border-azraq-purple/15 overflow-hidden">
            <img
              src={images[activeImageIndex] || selectedProduct.main_image}
              alt={selectedProduct.name}
              className="w-full h-full object-contain filter drop-shadow-lg transition-all duration-300"
            />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <span className="px-2.5 py-1 rounded-none bg-azraq-navy text-white text-[10px] font-bold uppercase tracking-wider">
                {selectedProduct.badge || 'Curated'}
              </span>
              <span className="px-2 py-0.5 rounded-none bg-azraq-purple/30 text-azraq-navy text-[9px] font-mono">
                SKU: {selectedProduct.id}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                isFav ? 'bg-azraq-violet text-white' : 'bg-white/90 text-azraq-navy/50 hover:text-azraq-violet'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Carousel / Grid (EasyDrop Multi-Photo Showcase) */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-azraq-navy/40 mb-2">
              {t("AUTHENTIC PRODUCT VIEWS", "পণ্যের ছবিসমূহ")} ({images.length})
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-none p-1 bg-white border flex-shrink-0 transition-all overflow-hidden ${
                    activeImageIndex === idx
                      ? 'border-azraq-violet ring-2 ring-azraq-violet/30 shadow-md scale-105'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
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
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-azraq-navy/60 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-azraq-violet" />
              {t("Inspected Quality", "মান নিশ্চিত")}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-azraq-azure" />
              {t("Doorstep Courier BD", "হোম ডেলিভারি")}
            </span>
          </div>

        </div>

        {/* Right Column: Product Specs, Variants, Quantity, Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-azraq-violet tracking-wider uppercase">
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-azraq-navy">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{selectedProduct.rating}</span>
                <span className="text-azraq-navy/40">({selectedProduct.reviews_count} {t("reviews", "রিভিউ")})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-black text-azraq-navy tracking-tight leading-snug">
              {t(selectedProduct.name, selectedProduct.name_bn)}
            </h2>

            {/* Subtitle */}
            <p className="text-xs font-semibold text-azraq-navy/60">
              {selectedProduct.sub}
            </p>

            {/* Price Box - Strict EasyDrop Retail Price with Zero Markup */}
            <div className="p-3.5 rounded-2xl bg-azraq-cloud border border-azraq-purple/20 flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-azraq-navy">
                  ৳{selectedProduct.price.toLocaleString()}
                </span>
                <span className="ml-2 text-[11px] font-semibold text-azraq-violet">
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-azraq-navy/50">
                {t("AUTHENTIC PRODUCT DETAILS & SPECIFICATIONS", "অনুমোদিত পণ্যের বিবরণ ও স্পেসিফিকেশন")}
              </span>
              <div className="text-xs sm:text-sm text-azraq-navy/80 leading-relaxed whitespace-pre-line bg-gray-50/70 p-4 rounded-2xl border border-gray-100 max-h-60 overflow-y-auto">
                {selectedProduct.description || selectedProduct.description_en || t("Description details available upon request.", "বিস্তারিত বিবরণ শীঘ্রই যুক্ত হচ্ছে।")}
              </div>
            </div>

            {/* Variant / Color Selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-navy">
                  <span>{t("Select Edition / Color", "রং বা এডিশন নির্বাচন করুন")}:</span>
                  <span className="text-azraq-violet font-semibold">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedVariant === v
                          ? 'bg-azraq-navy text-white shadow-sm ring-2 ring-azraq-lime'
                          : 'bg-gray-100 hover:bg-gray-200 text-azraq-navy/80'
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
              <span className="text-xs font-bold text-azraq-navy">
                {t("Quantity", "পরিমাণ")}:
              </span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1 text-sm font-bold text-azraq-navy hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-azraq-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1 text-sm font-bold text-azraq-navy hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Specifications Snapshot */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5 text-[11px] text-azraq-navy/80">
              <p><strong className="text-azraq-navy">{t("Material", "ম্যাটেরিয়াল")}:</strong> {selectedProduct.material}</p>
              <p><strong className="text-azraq-navy">{t("Dimensions", "সাইজ")}:</strong> {selectedProduct.dimensions}</p>
              <p><strong className="text-azraq-navy">{t("Delivery Time", "ডেলিভারি সময়")}:</strong> Dhaka 24-48 hrs • Outside Dhaka 48-72 hrs</p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                addToCart(selectedProduct, selectedVariant, quantity);
                setSelectedProduct(null);
              }}
              className="flex-1 py-3 px-4 rounded-full border-2 border-azraq-navy text-azraq-navy font-bold text-xs sm:text-sm hover:bg-azraq-navy hover:text-white transition-all text-center"
            >
              {t("Add to Bag", "ব্যাগে রাখুন")}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy font-black text-xs sm:text-sm shadow-glow-lime transition-all flex items-center justify-center gap-2"
            >
              <span>{t("Buy Now", "সরাসরি অর্ডার করুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

