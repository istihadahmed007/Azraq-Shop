import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, Check, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Daily Discover Product Catalog Grid (Shopee Retail Layout)
 * 
 * Shopee-inspired signature shopping section:
 * 1. Bold "DAILY DISCOVER" active header tab.
 * 2. Clean category filter tabs with horizontal scroll.
 * 3. Sorting & in-stock filter bar.
 * 4. High-density responsive grid (6 cols on desktop, 2 cols on mobile).
 * 5. Clean "See More" retail pagination button.
 */
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

  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(36);

  // Dynamic priority ordered categories extracted from authentic database products
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    const priority = [
      'Gadgets & IT Accessories',
      'Sports & Kids',
      'Men Clothing',
      'Kitchen Appliances',
      'Health & Beauty',
      'Home & Lifestyle',
      'Jewelries & Accessories',
      'Gifts'
    ];

    const sorted = [
      ...priority.filter(p => rawCategories.includes(p)),
      ...rawCategories.filter(r => !priority.includes(r))
    ];

    return ['All', ...sorted];
  }, [products]);

  // Reset pagination when category, search, or filters change
  React.useEffect(() => {
    setVisibleCount(36);
  }, [activeCategory, searchQuery, sortBy, inStockOnly]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory || p.primary_collection_name === activeCategory);
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.in_stock !== false);
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
  }, [products, activeCategory, searchQuery, sortBy, inStockOnly]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);

  return (
    <section id="all-products" className="w-full select-none flex flex-col gap-6">

      {/* 1. NEUMORPHIC "DAILY DISCOVER" SECTION CONTAINER */}
      <div className="bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,75,100,0.07)] flex flex-col gap-5">
        
        {/* Section Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
              {t("Daily Discover Catalog", "প্রতিদিনের আবিষ্কার ক্যাটালগ")}
            </h2>
            <span className="text-xs font-bold text-[#0877C9] bg-[#EDF4F9] border border-[#D5E2EE] px-2.5 py-0.5 rounded-full shadow-2xs">
              {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
            </span>
          </div>

          {/* Sync Status Badge */}
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#6B7D93] hover:text-[#0877C9] bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] transition-all shadow-2xs"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Verified', 'ইজিড্রপ ভেরিফাইড')}</span>
          </button>
        </div>

        {/* 2. CATEGORY PILL TABS & FILTER TOOLBAR */}
        <div className="flex flex-col gap-3.5">
          
          {/* Category Tabs Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const displayName = cat === 'All' ? t('All Products', 'সকল পণ্য') : cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shadow-2xs ${
                    isActive
                      ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                      : 'bg-[#EDF4F9] hover:bg-white text-[#293B52] hover:text-[#0877C9] border-[#D5E2EE]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Filter Controls Row: Search + Sort Options + In-stock Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E1EDF7]">
            
            {/* Within-catalog search input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#8CA0B6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs text-[#293B52] placeholder-[#8CA0B6] rounded-full bg-[#EDF4F9] border border-[#CBDCE9] focus:outline-none focus:border-[#0877C9] focus:bg-white shadow-[inset_0_1px_3px_rgba(50,75,100,0.06)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8CA0B6] hover:text-[#293B52]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Buttons & In-stock Checkbox */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#6B7D93] font-semibold hidden md:inline">{t("Sort by:", "সাজান:")}</span>

              <button
                onClick={() => setSortBy('featured')}
                className={`px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  sortBy === 'featured'
                    ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                    : 'bg-[#EDF4F9] hover:bg-white text-[#293B52] border-[#D5E2EE]'
                }`}
              >
                {t("Featured", "বাছাই")}
              </button>

              <button
                onClick={() => setSortBy('price-low')}
                className={`px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  sortBy === 'price-low'
                    ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                    : 'bg-[#EDF4F9] hover:bg-white text-[#293B52] border-[#D5E2EE]'
                }`}
              >
                {t("Price: Low to High", "দাম: কম")}
              </button>

              <button
                onClick={() => setSortBy('price-high')}
                className={`px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  sortBy === 'price-high'
                    ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                    : 'bg-[#EDF4F9] hover:bg-white text-[#293B52] border-[#D5E2EE]'
                }`}
              >
                {t("Price: High to Low", "দাম: বেশি")}
              </button>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-semibold text-[#293B52] select-none px-2 py-1 rounded-full hover:bg-[#EDF4F9] transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#0877C9] rounded border-[#CBDCE9] focus:ring-0"
                />
                <span>{t("In Stock Only", "স্টকে আছে")}</span>
              </label>
            </div>

          </div>

        </div>

        {/* 3. STRICTLY FIVE PRODUCT CARDS PER ROW ON DESKTOP */}
        {displayedProducts.length === 0 ? (
          <div className="bg-[#EDF4F9] border border-[#D5E2EE] rounded-[20px] p-10 text-center text-[#6B7D93] shadow-xs">
            <p className="text-sm font-semibold">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-3 px-5 py-2 rounded-full bg-[#0877C9] text-white text-xs font-bold hover:bg-[#0665AC] shadow-sm transition-all"
            >
              {t("Reset Filters", "ফিল্টার রিসেট করুন")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">
            {displayedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  isFav={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={addToCart}
                  compact={false}
                  showCategory={true}
                />
              </div>
            ))}
          </div>
        )}

        {/* 4. SOFT-NEUMORPHIC "SEE MORE" PAGINATION BUTTON */}
        {visibleCount < filteredAndSortedProducts.length && (
          <div className="flex justify-center mt-3 pt-3 border-t border-[#E1EDF7]">
            <button
              onClick={() => setVisibleCount(prev => prev + 25)}
              className="px-10 py-3 bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] hover:border-[#0877C9] hover:text-[#0877C9] text-[#293B52] text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {t("See More Products", "আরও পণ্য দেখুন")} ({filteredAndSortedProducts.length - visibleCount} {t("remaining", "বাকি")})
            </button>
          </div>
        )}

      </div>

    </section>
  );
}