import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
    { id: 'Shoulder Bags', label: t('Shoulder Bags', 'শোল্ডার ব্যাগ') },
    { id: 'Luxury Handbags', label: t('Luxury Handbags', 'লাক্সারি হ্যান্ডব্যাগ') },
    { id: 'Totes', label: t('Totes & Shoppers', 'টোট ব্যাগ') },
    { id: 'Travel & Crossbody', label: t('Travel & Crossbody', 'ট্রাভেল ও ক্রসবাডি') },
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
    <section id="top-picks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      
      {/* Header & Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          {/* Category Tagline */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-1 rounded-full bg-azraq-violet inline-block" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("EASYDROP CATEGORY 5 • 20 EDITIONS", "অনুমোদিত ড্রপশিপিং ক্যাটাগরি ৫")}
            </span>
          </div>

          {/* Section Heading (Matching Reference) */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-azraq-navy tracking-tight">
            {t("EXPLORE OUR TOP PICKS", "আমাদের সেরা পছন্দসমূহ")}
          </h2>
        </div>

        {/* Carousel Navigation Buttons (Matching Reference: Round White & Dark buttons) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-11 h-11 rounded-full border border-azraq-purple/20 bg-white flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'text-azraq-navy hover:bg-azraq-lavender hover:scale-105 active:scale-95 shadow-sm' 
                : 'text-azraq-navy/25 cursor-not-allowed'
            }`}
            aria-label="Previous Products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-11 h-11 rounded-full bg-azraq-navy text-white flex items-center justify-center transition-all shadow-md ${
              canScrollRight 
                ? 'hover:bg-azraq-charcoal hover:scale-105 active:scale-95' 
                : 'bg-azraq-navy/40 cursor-not-allowed'
            }`}
            aria-label="Next Products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-azraq-navy text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-azraq-navy/70 border border-azraq-purple/20'
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
        className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{ scrollbarWidth: 'none' }}
      >
        {filteredProducts.map(product => {
          const isFav = favorites.includes(product.id);
          const shortName = product.name.split('—')[1] || product.name;

          return (
            <div
              key={product.id}
              className="flex-none w-[280px] sm:w-[310px] snap-start group"
            >
              {/* Product Card (Nexora Reference Layout Recreated) */}
              <div className="rounded-none bg-white border border-azraq-purple/20 p-3 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-[490px] sm:h-[510px] relative overflow-hidden">
                
                {/* Floating Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isFav 
                      ? 'bg-azraq-violet text-white shadow-md' 
                      : 'bg-white/80 text-azraq-navy/40 hover:text-azraq-violet hover:bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                </button>

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-none bg-azraq-lavender text-azraq-violet text-[10px] font-extrabold uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}

                {/* Product Image Area - 75-80% visual area, completely square corners */}
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="relative w-full h-[370px] sm:h-[390px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-2 sm:p-3 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.main_image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Quick View Overlay Pill */}
                  <div className="absolute inset-0 bg-azraq-navy/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white text-azraq-navy text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-azraq-lime transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("Quick View", "বিস্তারিত")}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Details Row (Matching Reference) */}
                <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Name */}
                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-azraq-navy text-sm truncate cursor-pointer hover:text-azraq-violet transition-colors"
                        title={product.name}
                      >
                        {shortName}
                      </h3>
                      {/* Price in BDT */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base sm:text-lg font-black text-azraq-navy">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Neon Lime Action Button with Dark Arrow (Direct Reference Match) */}
                    <button
                      onClick={() => {
                        addToCart(product, product.variants[0] || 'Standard', 1);
                      }}
                      className="w-9 h-9 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform hover:scale-110 active:scale-95 flex-shrink-0"
                      title={t("Add to Bag", "ব্যাগে যোগ করুন")}
                    >
                      <ArrowRight className="w-4 h-4 text-azraq-navy" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

