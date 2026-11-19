import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, Check, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Transparent Glassy Catalog Grid
 * 
 * Features:
 * - Frosted glass container with backdrop-blur-2xl and specular edge highlights.
 * - Responsive horizontal category filter tabs with glass pills.
 * - Compact sorting and in-stock filter bar.
 * - Strictly 5-column grid on desktop screens (lg:grid-cols-5).
 * - Glassy "Load More Products" pagination trigger.
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

  // Filter and Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (activeCategory && activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // In Stock Only Filter
    if (inStockOnly) {
      result = result.filter(p => p.stock !== 0 && p.status !== 'out_of_stock');
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, inStockOnly]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);

  return (
    <section id="all-products" className="w-full select-none flex flex-col gap-6">

      <div className="border border-white/90 bg-white/75 backdrop-blur-2xl rounded-2xl p-5 sm:p-7 shadow-[0_12px_36px_0_rgba(31,38,135,0.06)] flex flex-col gap-5">
        
        {/* Section Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/80">
          <div>
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.16em] block font-bold">
              {t("CATALOGUE DIRECTORY", "ক্যাটালগ ডিরেক্টরি")}
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {t("Selected Products", "বাছাইকৃত পণ্য")}
              </h2>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50/80 border border-blue-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                {filteredAndSortedProducts.length} {t("Items", "টি")}
              </span>
            </div>
          </div>

          {/* Sync Status Badge */}
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-white/80 hover:bg-white border border-white/90 shadow-2xs transition-all cursor-pointer"
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white border-blue-600 shadow-xs'
                      : 'bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 border-white/90'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Filter Controls Row: Search + Sort Options + In-stock Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/80">
            
            {/* Within-catalog search input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown & Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <ArrowUpDown className="w-3 h-3" />
                <span className="hidden md:inline">{t("Sort:", "বাছাই:")}</span>
              </span>

              <button
                onClick={() => setSortBy('featured')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                  sortBy === 'featured'
                    ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white border-blue-600 shadow-xs'
                    : 'bg-white/70 hover:bg-white text-slate-700 border-white/90'
                }`}
              >
                {t("Featured", "সেরা")}
              </button>

              <button
                onClick={() => setSortBy('price-low')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                  sortBy === 'price-low'
                    ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white border-blue-600 shadow-xs'
                    : 'bg-white/70 hover:bg-white text-slate-700 border-white/90'
                }`}
              >
                {t("Price: Low to High", "দাম: কম")}
              </button>

              <button
                onClick={() => setSortBy('price-high')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                  sortBy === 'price-high'
                    ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white border-blue-600 shadow-xs'
                    : 'bg-white/70 hover:bg-white text-slate-700 border-white/90'
                }`}
              >
                {t("Price: High to Low", "দাম: বেশি")}
              </button>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-semibold text-slate-700 select-none px-2.5 py-1.5 rounded-xl hover:bg-white/70 transition-colors text-xs">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-0"
                />
                <span>{t("In Stock Only", "স্টকে আছে")}</span>
              </label>
            </div>

          </div>

        </div>

        {/* 3. STRICTLY FIVE PRODUCT CARDS PER ROW ON DESKTOP */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white/50 border border-white/80 rounded-2xl p-10 text-center text-slate-500">
            <p className="text-sm font-semibold">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
          <div className="flex justify-center mt-3 pt-4 border-t border-white/80">
            <button
              onClick={() => setVisibleCount(prev => prev + 25)}
              className="px-8 py-3 bg-white/80 hover:bg-white border border-white/90 hover:border-blue-400 text-slate-800 hover:text-blue-600 text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-98 shadow-sm hover:shadow-md cursor-pointer"
            >
              {t("Load More Products", "আরও পণ্য দেখুন")} ({filteredAndSortedProducts.length - visibleCount} {t("remaining", "বাকি")})
            </button>
          </div>
        )}

      </div>

    </section>
  );
}
