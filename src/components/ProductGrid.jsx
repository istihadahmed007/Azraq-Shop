import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, Check, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Selected Products & Daily Discover Catalog Grid
 * 
 * Modern editorial catalog layout:
 * 1. Clean "Selected Products / Daily Discover" section header with verified count.
 * 2. Responsive horizontal category filter tabs with active states.
 * 3. Compact sorting and in-stock filter bar.
 * 4. Responsive 5-column grid on desktop (3 on tablet, 2 on mobile).
 * 5. Editorial "See More Products" pagination button.
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
  const [visibleCount, setVisibleCount] = useState(35); // 7 complete rows of 5 cards on desktop

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
    setVisibleCount(35);
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

    // Search query filter: safely handles all catalog text fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.name_bn && p.name_bn.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.primary_collection_name && p.primary_collection_name.toLowerCase().includes(q)) ||
        (p.sku && String(p.sku).toLowerCase().includes(q)) ||
        (p.id && String(p.id).toLowerCase().includes(q))
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

      <div className="bg-white border border-[#E5E3DA] rounded-[6px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(23,35,51,0.03)] flex flex-col gap-5">
        
        {/* Section Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E3DA]">
          <div>
            <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold">
              {t("CATALOGUE DIRECTORY", "ক্যাটালগ ডিরেক্টরি")}
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight">
                {t("Selected Products", "বাছাইকৃত পণ্য")}
              </h2>
              <span className="text-xs font-mono font-semibold text-[#667085] bg-[#FAF9F5] border border-[#E5E3DA] px-2 py-0.5 rounded-[3px]">
                {filteredAndSortedProducts.length} {t("Items", "টি")}
              </span>
            </div>
          </div>

          {/* Sync Status Badge */}
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold text-[#667085] hover:text-[#172333] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] transition-colors"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#245BDB] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('Catalog Verified', 'ক্যাটালগ ভেরিফাইড')}</span>
          </button>
        </div>

        {/* 2. CATEGORY TABS & FILTER TOOLBAR */}
        <div className="flex flex-col gap-3.5">
          
          {/* Category Tabs Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const displayName = cat === 'All' ? t('All Products', 'সকল পণ্য') : cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#172333] text-white border-[#172333]'
                      : 'bg-[#FAF9F5] hover:bg-white text-[#556170] hover:text-[#172333] border-[#E5E3DA]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Filter Controls Row: Search + Sort Options + In-stock Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E5E3DA]">
            
            {/* Within-catalog search input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#8C99A8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs text-[#172333] placeholder-[#8C99A8] rounded-[3px] bg-[#FAF9F5] border border-[#E5E3DA] focus:outline-none focus:border-[#172333] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C99A8] hover:text-[#172333]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Buttons & In-stock Checkbox */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[#667085] font-medium hidden md:inline text-[11px] uppercase tracking-wider">{t("Sort:", "সাজান:")}</span>

              <button
                onClick={() => setSortBy('featured')}
                className={`px-2.5 py-1.5 rounded-[3px] font-semibold border transition-all text-xs ${
                  sortBy === 'featured'
                    ? 'bg-[#172333] text-white border-[#172333]'
                    : 'bg-[#FAF9F5] hover:bg-white text-[#172333] border-[#E5E3DA]'
                }`}
              >
                {t("Featured", "বাছাই")}
              </button>

              <button
                onClick={() => setSortBy('price-low')}
                className={`px-2.5 py-1.5 rounded-[3px] font-semibold border transition-all text-xs ${
                  sortBy === 'price-low'
                    ? 'bg-[#172333] text-white border-[#172333]'
                    : 'bg-[#FAF9F5] hover:bg-white text-[#172333] border-[#E5E3DA]'
                }`}
              >
                {t("Price: Low to High", "দাম: কম")}
              </button>

              <button
                onClick={() => setSortBy('price-high')}
                className={`px-2.5 py-1.5 rounded-[3px] font-semibold border transition-all text-xs ${
                  sortBy === 'price-high'
                    ? 'bg-[#172333] text-white border-[#172333]'
                    : 'bg-[#FAF9F5] hover:bg-white text-[#172333] border-[#E5E3DA]'
                }`}
              >
                {t("Price: High to Low", "দাম: বেশি")}
              </button>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-medium text-[#172333] select-none px-2 py-1 rounded-[3px] hover:bg-[#FAF9F5] transition-colors text-xs">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#245BDB] rounded-[2px] border-[#E5E3DA] focus:ring-0"
                />
                <span>{t("In Stock Only", "স্টকে আছে")}</span>
              </label>
            </div>

          </div>

        </div>

        {/* 3. STRICTLY FIVE PRODUCT CARDS PER ROW ON DESKTOP */}
        {displayedProducts.length === 0 ? (
          <div className="bg-[#FAF9F5] border border-[#E5E3DA] rounded-[4px] p-10 text-center text-[#667085]">
            <p className="text-sm font-semibold">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-3 px-4 py-2 rounded-[3px] bg-[#172333] text-white text-xs font-semibold hover:bg-[#245BDB] transition-colors"
            >
              {t("Reset Filters", "ফিল্টার রিসেট করুন")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 items-stretch">
            {displayedProducts.map((product, idx) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  isFav={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={addToCart}
                  compact={false}
                  showCategory={true}
                  priority={idx < 5}
                />
              </div>
            ))}
          </div>
        )}

        {/* 4. "SEE MORE" EDITORIAL PAGINATION BUTTON */}
        {visibleCount < filteredAndSortedProducts.length && (
          <div className="flex justify-center mt-3 pt-4 border-t border-[#E5E3DA]">
            <button
              onClick={() => setVisibleCount(prev => prev + 25)}
              className="px-8 py-2.5 bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] hover:text-[#172333] text-[#172333] text-xs sm:text-sm font-semibold rounded-[4px] transition-colors active:scale-98 shadow-xs"
            >
              {t("Load More Products", "আরও পণ্য দেখুন")} ({filteredAndSortedProducts.length - visibleCount} {t("remaining", "বাকি")})
            </button>
          </div>
        )}

      </div>

    </section>
  );
}
