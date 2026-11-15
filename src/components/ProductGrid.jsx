import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Heart, ArrowRight, Eye, Check, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductGrid() {
  const { 
    products, 
    setSelectedProduct, 
    addToCart, 
    favorites, 
    toggleFavorite, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    syncStatus,
    syncWithEasyDrop,
    t 
  } = useShop();

  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  const categories = ['All', 'Shoulder Bags', 'Luxury Handbags', 'Totes', 'Travel & Crossbody'];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sub.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.supplier_sku.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-azraq-purple/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-azraq-lime" />
            <span className="text-xs font-bold tracking-widest text-azraq-violet uppercase">
              {t("OFFICIAL AUTHORIZED CATALOGUE", "অনুমোদিত সোর্স ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-azraq-navy tracking-tight">
            {t("All Curated Goods", "সকল কিউরেটেড কালেকশন")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1">
            {t(
              "Imported & synchronized from EasyDrop Category ID 5. Priced in BDT with verified retail margins.",
              "ইজিড্রপ ক্যাটাগরি ৫ থেকে সমন্বয়কৃত। বিডিটি মূল্যে দেশব্যাপী নির্ভরযোগ্য ডেলিভারি।"
            )}
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-azraq-purple/25 text-azraq-navy hover:bg-azraq-lavender/50 transition-colors shadow-sm"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-azraq-azure ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Synced', 'ইজিড্রপ সিংক')}</span>
          </button>
          
          <span className="text-xs font-bold text-azraq-navy/60">
            {filteredAndSortedProducts.length} {t("Editions Available", "পণ্য প্রদর্শিত")}
          </span>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        
        {/* Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-azraq-navy text-white shadow-md'
                  : 'bg-white hover:bg-azraq-lavender/50 text-azraq-navy/70 border border-azraq-purple/20'
              }`}
            >
              {cat === 'All' ? t('All (20)', 'সকল (২০)') : cat}
            </button>
          ))}
        </div>

        {/* Right Tools: Search & Sort */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-azraq-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("Filter by name, material...", "নাম বা ম্যাটেরিয়াল দিয়ে খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-azraq-purple/25 text-xs text-azraq-navy placeholder-azraq-navy/40 focus:outline-none focus:border-azraq-violet shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full bg-white border border-azraq-purple/25 text-xs font-bold text-azraq-navy focus:outline-none focus:border-azraq-violet shadow-sm cursor-pointer"
            >
              <option value="featured">{t("Sort: Featured", "সাজান: সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম থেকে বেশি")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি থেকে কম")}</option>
              <option value="rating">{t("Customer Rating", "সর্বোচ্চ রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-azraq-navy/50 absolute right-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-azraq-purple/20 p-8 space-y-4">
          <p className="text-base font-bold text-azraq-navy">
            {t("No products matched your criteria", "কোনো পণ্য পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-5 py-2 rounded-full bg-azraq-navy text-white text-xs font-bold hover:bg-azraq-violet transition-colors"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => {
            const isFav = favorites.includes(product.id);
            const shortName = product.name.split('—')[1] || product.name;

            return (
              <div
                key={product.id}
                className="rounded-none bg-white border border-azraq-purple/20 p-3 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[490px] sm:h-[510px]"
              >
                {/* Wishlist Button */}
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

                {/* Badge & Supplier SKU Tag */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  {product.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-azraq-lavender text-azraq-violet text-[10px] font-extrabold uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-none bg-azraq-navy/85 text-white text-[9px] font-mono tracking-tight">
                    {product.id}
                  </span>
                </div>

                {/* Image Area - 75-80% visual area dominance, completely square corners */}
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

                {/* Compact Details Bottom Block */}
                <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-semibold text-azraq-violet block mb-0.5 truncate">
                      {product.category}
                    </span>
                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-azraq-navy text-sm line-clamp-1 cursor-pointer hover:text-azraq-violet transition-colors"
                      title={product.name}
                    >
                      {shortName}
                    </h3>
                    <p className="text-[11px] text-azraq-navy/50 line-clamp-1 mt-0.5">
                      {product.sub}
                    </p>
                  </div>

                  {/* Price & Action Row (Reference Styling) */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-azraq-navy">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {t("In Stock", "স্টকে রয়েছে")} ({product.stock})
                      </span>
                    </div>

                    {/* Lime Circular Arrow Action Button */}
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
            );
          })}
        </div>
      )}
    </section>
  );
}

