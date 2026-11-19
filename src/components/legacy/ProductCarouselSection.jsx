import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductImage from '../common/ProductImage';

export default function ProductCarouselSection() {
  const { 
    products, 
    setSelectedProduct, 
    addToCart, 
    favorites, 
    toggleFavorite, 
    activeCategory, 
    setActiveCategory,
    t 
  } = useShop();

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = [
    { id: 'All', label: t('All Top Picks', 'সকল সেরা পণ্য') },
    { id: 'Gadgets & IT Accessories', label: t('Gadgets & IT', 'গ্যাজেট ও আইটি') },
    { id: 'Health & Beauty', label: t('Health & Beauty', 'হেলথ ও বিউটি') },
    { id: 'Home & Lifestyle', label: t('Home & Lifestyle', 'হোম ও লাইফস্টাইল') },
    { id: 'Men Clothing', label: t('Men Fashion', 'পুরুষদের ফ্যাশন') },
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products.slice(0, 16) 
    : products.filter(p => p.category === activeCategory || p.primary_collection_name === activeCategory).slice(0, 16);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="top-picks" className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.28)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
              + {t("CURATED CAROUSEL", "বাছাইকৃত গ্যালারি")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
              {t("Explore Top Picks", "আমাদের সেরা পছন্দসমূহ")}
            </h2>
            <p className="text-xs text-[#718398] mt-1">
              {t("Verified products with 4.8+ ratings and prompt doorstep delivery.", "যাচাইকৃত পণ্য ও দ্রুত হোম ডেলিভারি নিশ্চয়তা।")}
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full glass-card border border-[rgba(130,170,205,0.3)] flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'text-[#193B5B] hover:bg-white hover:border-[#70C8ED] shadow-xs cursor-pointer' 
                  : 'text-[#718398]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full bg-[#193B5B] text-white flex items-center justify-center transition-all shadow-md ${
                canScrollRight 
                  ? 'hover:bg-[#062B4F] hover:shadow-[0_4px_16px_rgba(25,59,91,0.3)] cursor-pointer' 
                  : 'bg-[#193B5B]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next Products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#718398] hover:text-[#193B5B] border border-[rgba(130,170,205,0.28)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {filteredProducts.map((product, idx) => {
            const isFav = favorites.includes(product.id);
            const indexStr = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={product.id}
                className="flex-none w-[240px] sm:w-[260px] snap-start group"
              >
                {/* Product Card */}
                <div className="rounded-[22px] bg-white/90 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] border-t-white p-3.5 shadow-[0_8px_24px_rgba(112,200,237,0.1),0_2px_6px_rgba(25,59,91,0.03)] hover:shadow-[0_16px_36px_rgba(112,200,237,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden">
                  
                  {/* Top Row: Index Badge & Wishlist Heart */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-[#0877C9] px-2 py-0.5 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.28)]">
                      {indexStr}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className={`w-7 h-7 rounded-full glass-card border border-[rgba(130,170,205,0.3)] flex items-center justify-center transition-all ${
                        isFav 
                          ? 'bg-[#193B5B] text-white' 
                          : 'text-[#718398] hover:text-[#193B5B] hover:bg-white'
                      }`}
                      title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Image Area - STRICT CONTAINMENT */}
                  <div 
                    onClick={() => setSelectedProduct(product)}
                    className="card-image-wrapper relative w-full h-[180px] rounded-xl bg-gradient-to-b from-[#F1F7FC] to-white flex items-center justify-center p-2.5 cursor-pointer overflow-hidden border border-[rgba(130,170,205,0.18)]"
                  >
                    <ProductImage
                      src={product.main_image}
                      alt={product.name}
                      fit="contain"
                      aspectRatio="square"
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom Details Row */}
                  <div className="mt-3 pt-2.5 border-t border-[rgba(130,170,205,0.18)] flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-bold text-[#0877C9] block truncate uppercase tracking-wider">
                        {product.category || product.primary_collection_name}
                      </span>
                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-xs sm:text-[13px] text-[#193B5B] truncate cursor-pointer hover:text-[#0877C9] transition-colors mt-0.5"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-auto">
                      <span className="text-sm sm:text-base font-black text-[#193B5B]">
                        ৳{product.price.toLocaleString()}
                      </span>

                      <button
                        onClick={() => addToCart(product, product.variants?.[0] || 'Default', 1)}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(112,200,237,0.4)] transition-all transform hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
                        title={t("Add to Bag", "ব্যাগে যোগ করুন")}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
