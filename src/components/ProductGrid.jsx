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
    <section id="all-products" className="w-full select-none flex flex-col gap-3">

      {/* 1. SHOPEE-STYLE "DAILY DISCOVER" SECTION HEADER TAB */}
      <div className="bg-white border-b-2 border-[#0877C9] px-4 py-3 flex items-center justify-between rounded-t-[4px] shadow-2xs">
        <div className="flex items-center gap-3">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#0877C9]">
            {t("Daily Discover", "প্রতিদিনের আবিষ্কার")}
          </h2>
          <span className="text-xs font-medium text-gray-400">
            ({filteredAndSortedProducts.length} {t("Items", "পণ্য")})
          </span>
        </div>

        {/* Sync Status Badge */}
        <button
          onClick={syncWithEasyDrop}
          disabled={syncStatus.isSyncing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-medium text-gray-500 hover:text-[#0877C9] hover:bg-gray-50 border border-gray-200 transition-colors"
          title="Sync with EasyDrop API"
        >
          <RefreshCw className={`w-3 h-3 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Verified', 'ইজিড্রপ ভেরিফাইড')}</span>
        </button>
      </div>

      {/* 2. CATEGORY TABS & FILTER TOOLBAR */}
      <div className="bg-white border border-gray-200 rounded-[4px] p-3 sm:p-4 flex flex-col gap-3 shadow-xs">
        
        {/* Category Tabs Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const displayName = cat === 'All' ? t('All Products', 'সকল পণ্য') : cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-[#0877C9] text-white border-[#0877C9]'
                    : 'bg-white hover:bg-gray-50 text-[#4B5563] border-gray-200'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row: Search + Sort Options + In-stock Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-100">
          
          {/* Within-catalog search input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs text-[#212121] placeholder-gray-400 rounded-[3px] border border-gray-200 focus:outline-none focus:border-[#0877C9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Buttons & In-stock Checkbox */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-gray-500 font-medium hidden md:inline">{t("Sort by:", "সাজান:")}</span>

            <button
              onClick={() => setSortBy('featured')}
              className={`px-2.5 py-1 rounded-[3px] font-medium border ${
                sortBy === 'featured'
                  ? 'bg-blue-50 text-[#0877C9] border-[#0877C9] font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t("Featured", "বাছাই")}
            </button>

            <button
              onClick={() => setSortBy('price-low')}
              className={`px-2.5 py-1 rounded-[3px] font-medium border ${
                sortBy === 'price-low'
                  ? 'bg-blue-50 text-[#0877C9] border-[#0877C9] font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t("Price: Low to High", "দাম: কম থেকে বেশি")}
            </button>

            <button
              onClick={() => setSortBy('price-high')}
              className={`px-2.5 py-1 rounded-[3px] font-medium border ${
                sortBy === 'price-high'
                  ? 'bg-blue-50 text-[#0877C9] border-[#0877C9] font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t("Price: High to Low", "দাম: বেশি থেকে কম")}
            </button>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-medium text-gray-600 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-[#0877C9] rounded border-gray-300 focus:ring-0"
              />
              <span>{t("In Stock Only", "শুধু স্টকে আছে")}</span>
            </label>
          </div>

        </div>

      </div>

      {/* 3. HIGH-DENSITY RESPONSIVE PRODUCT GRID (Shopee Standard) */}
      {displayedProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[4px] p-10 text-center text-gray-500 shadow-xs">
          <p className="text-sm font-semibold">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-3 px-4 py-1.5 rounded-[3px] bg-[#0877C9] text-white text-xs font-semibold hover:bg-[#0665AC] transition-colors"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 items-stretch">
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

      {/* 4. SHOPEE-STYLE "SEE MORE" PAGINATION BUTTON */}
      {visibleCount < filteredAndSortedProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-10 py-2.5 bg-white border border-gray-300 hover:border-[#0877C9] hover:text-[#0877C9] text-[#212121] text-xs sm:text-sm font-semibold rounded-[3px] shadow-2xs hover:shadow-xs transition-all"
          >
            {t("See More Products", "আরও পণ্য দেখুন")} ({filteredAndSortedProducts.length - visibleCount} {t("remaining", "বাকি")})
          </button>
        </div>
      )}

    </section>
  );
}