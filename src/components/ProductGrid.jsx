import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Heart, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
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
  const [visibleCount, setVisibleCount] = useState(24);

  // Dynamic categories extracted from authentic database products
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['All', ...list.slice(0, 10)];
  }, [products]);

  // Reset pagination when category or search changes
  React.useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, searchQuery, sortBy]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory || p.primary_collection_name === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#D9F0FF]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#50DDF0] shadow-[0_0_8px_#50DDF0]" />
            <span className="text-[11px] font-black tracking-widest text-[#0877C9] uppercase">
              {t("OFFICIAL AUTHORIZED CATALOGUE", "অনুমোদিত সোর্স ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#062B4F] tracking-tight">
            {t("All Curated Goods", "সকল কিউরেটেড পণ্য সম্ভার")}
          </h2>
          <p className="text-xs sm:text-sm text-[#062B4F]/65 mt-1">
            {t(
              "Imported & synchronized directly from EasyDrop. Original retail prices in BDT with genuine supplier specs.",
              "ইজিড্রপ থেকে সরাসরি আমদানিকৃত। আসল রিটেইল মূল্যে বিডিটি (৳)-তে নির্ভরযোগ্য ডেলিভারি।"
            )}
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#D9F0FF] text-[#062B4F] hover:bg-[#F0F7FF] transition-colors shadow-sm"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Synced', 'ইজিড্রপ সিংক')}</span>
          </button>
          
          <span className="text-xs font-bold text-[#062B4F]/70">
            {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
          </span>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#101C35] text-white shadow-md'
                  : 'bg-white hover:bg-[#F5F7FA] text-[#101C35]/75 border border-[#E2E8F0]'
              }`}
            >
              {cat === 'All' ? `${t('All', 'সকল')} (${products.length})` : cat}
            </button>
          ))}
        </div>

        {/* Right Tools: Search & Sort */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#062B4F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("Search by product name...", "পণ্য খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#D9F0FF] text-xs text-[#062B4F] placeholder-[#062B4F]/40 focus:outline-none focus:border-[#0877C9] shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] focus:outline-none focus:border-[#0877C9] shadow-sm cursor-pointer"
            >
              <option value="featured">{t("Sort: Featured", "সাজান: সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম থেকে বেশি")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি থেকে কম")}</option>
              <option value="rating">{t("Customer Rating", "সর্বোচ্চ রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#062B4F]/50 absolute right-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/95 border border-[#D9F0FF] p-8 sm:p-12 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#F0F7FF] text-[#0877C9] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#062B4F]">
            {searchQuery.trim() 
              ? `${t("No products found for", "কোনো পণ্য পাওয়া যায়নি:")} "${searchQuery}"`
              : t("No products found in this category", "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি")}
          </h3>
          <p className="text-xs sm:text-sm text-[#062B4F]/60 max-w-md mx-auto">
            {t(
              "Try searching with broader terms or explore our curated popular collections below.",
              "অন্য কোনো নামে অনুসন্ধান করুন অথবা নিচের জনপ্রিয় কালেকশনগুলো ব্রাউজ করুন।"
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['All', 'Men', 'Women', 'Electronics', 'Bags'].map((catPill) => (
              <button
                key={catPill}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(catPill);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#F0F7FF] hover:bg-[#D9F0FF] text-[#0877C9] text-xs font-bold transition-all border border-[#D9F0FF]"
              >
                {catPill}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#062B4F] text-white text-xs font-black hover:bg-[#0877C9] transition-all shadow-sm"
            >
              {t("Clear All Filters", "সকল ফিল্টার মুছুন")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredAndSortedProducts.slice(0, visibleCount).map(product => {
              const isFav = favorites.includes(product.id);
              const shortName = product.name.split('—')[1] || product.name.split('(')[0] || product.name;
              const isAvailable = product.in_stock !== false;

              return (
                <div
                  key={product.id}
                  className="bg-white/95 backdrop-blur-md rounded-xl border border-[#D9F0FF] p-2.5 sm:p-4 shadow-sm hover:shadow-[0_12px_32px_rgba(8,119,201,0.12)] hover:border-[#69C5F5]/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isFav 
                        ? 'bg-[#0877C9] text-white shadow-md' 
                        : 'bg-white/90 text-[#062B4F]/40 hover:text-[#0877C9] hover:bg-white'
                    }`}
                    title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={`Wishlist ${product.name}`}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-white' : ''}`} />
                  </button>

                  {/* SKU Tag */}
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-[#062B4F]/85 text-white text-[8px] sm:text-[9px] font-mono tracking-tight w-max backdrop-blur-sm">
                      {product.id}
                    </span>
                  </div>

                  {/* Image Area - Responsive Aspect Square, Square corners */}
                  <div 
                    onClick={() => setSelectedProduct(product)}
                    className="relative w-full aspect-square bg-gradient-to-b from-[#F8FCFF] to-white rounded-lg flex items-center justify-center p-2 sm:p-3 cursor-pointer overflow-hidden border border-[#D9F0FF]/40"
                  >
                    <img
                      src={product.main_image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (!e.target.dataset.failed) {
                          e.target.dataset.failed = 'true';
                          e.target.src = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                        }
                      }}
                      className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Quick View Overlay Pill */}
                    <div className="absolute inset-0 bg-[#062B4F]/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="px-3 py-1.5 rounded-full bg-white text-[#062B4F] text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-[#0877C9] hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t("Quick View", "বিস্তারিত")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Details Bottom Block */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] sm:text-xs font-semibold text-[#0877C9] block mb-0.5 truncate">
                        {product.category || product.primary_collection_name}
                      </span>
                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-[#062B4F] text-xs sm:text-sm line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] cursor-pointer hover:text-[#0877C9] transition-colors leading-snug"
                        title={product.name}
                      >
                        {shortName}
                      </h3>
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2.5">
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base md:text-lg font-black text-[#062B4F] truncate">
                          ৳{product.price.toLocaleString()}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-bold block truncate ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক শেষ")}
                        </span>
                      </div>

                      {/* Cart Action Button */}
                      <button
                        onClick={() => {
                          if (isAvailable) {
                            addToCart(product, product.variants?.[0] || 'Standard', 1);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all flex-shrink-0 ${
                          isAvailable
                            ? 'bg-[#062B4F] hover:bg-[#0877C9] text-white transform hover:scale-110 active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        title={isAvailable ? t("Add to Cart", "ব্যাগে যোগ করুন") : t("Out of Stock", "স্টক নেই")}
                        aria-label={`Add ${product.name} to bag`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination / Load More */}
          {visibleCount < filteredAndSortedProducts.length && (
            <div className="mt-12 text-center space-y-3">
              <p className="text-xs text-[#062B4F]/60 font-semibold">
                {t("Showing", "দেখাচ্ছে")} {Math.min(visibleCount, filteredAndSortedProducts.length)} {t("of", "এর মধ্যে")} {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
              </p>
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="px-8 py-3 rounded-full bg-[#062B4F] hover:bg-[#0877C9] text-white font-black text-xs sm:text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <span>{t("Load More Products", "আরো ২৪টি পণ্য দেখুন")}</span>
                <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center">
                  +
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
