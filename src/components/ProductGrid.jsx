import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, Check, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Main Curated Product Catalog Grid
 *
 * Implements:
 * - Phase 2: Two dedicated, visually balanced toolbar rows.
 *   Row 1: All Products + Top categories (Gadgets, Sports, Men, Kitchen, etc.) with smooth horizontal scroll.
 *   Row 2: Product search + Sort dropdown + In-stock toggle + Clear filters.
 * - Phase 6: Intelligent responsive columns:
 *   1600px+: 6 cols | 1280-1599px: 5 cols | 1024-1279px: 4 cols | 768-1023px: 3 cols | Mobile: 2 cols.
 * - Equal card heights, 100% full content width.
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
  const [visibleCount, setVisibleCount] = useState(30);

  // Dynamic priority ordered categories extracted from authentic database products
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    
    // Desired priority order per specification
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
    setVisibleCount(30);
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

  return (
    <section id="all-products" className="w-full max-w-full overflow-hidden py-2 select-none">

      {/* 1. Section Header: Title + Sync Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3.5 border-b border-white/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0877C9] shadow-[0_0_8px_rgba(8,119,201,0.5)]" />
            <span className="text-[11px] font-bold tracking-wider text-[#0877C9] uppercase">
              {t("Authorized Collection", "অনুমোদিত সোর্স কালেকশন")}
            </span>
          </div>
          <h2 className="text-2xl lg:text-[28px] font-black text-[#101C35] tracking-tight">
            {t("All Curated Goods", "সকল কিউরেটেড পণ্য সম্ভার")}
          </h2>
          <p className="text-xs sm:text-sm text-[#71849B] mt-0.5">
            {t(
              "Genuine lifestyle items imported directly from EasyDrop with verified specifications in BDT.",
              "আসল রিটেইল মূল্যে বিডিটি (৳)-তে নির্ভরযোগ্য ডেলিভারি ও যাচাইকৃত পণ্য সম্ভার।"
            )}
          </p>
        </div>

        {/* Sync Status Badge & Count */}
        <div className="flex items-center gap-2.5 self-start sm:self-end">
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-button text-[#101C35]"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Synced', 'ইজিড্রপ সিংক')}</span>
          </button>

          <span className="text-xs font-bold text-[#71849B] px-2.5 py-1 rounded-full bg-white/70 border border-white/80">
            {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
          </span>
        </div>
      </div>

      {/* 2. DEDICATED TWO-ROW TOOLBAR (Phase 2 Requirement) */}
      <div className="flex flex-col gap-3 mb-6">

        {/* ROW 1: Horizontally Scrollable Category Filter Pills */}
        <div className="w-full relative min-w-0 max-w-full overflow-hidden">
          <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const displayName = cat === 'All' 
                ? `${t('All Products', 'সকল পণ্য')} (${products.length})` 
                : cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                      : 'bg-white/75 hover:bg-white text-[#71849B] hover:text-[#101C35] border-white/90 shadow-xs'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Product Search + Sort + In-Stock Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          
          {/* Product Search Input (Pill Shaped Translucent Control) */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-[#71849B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full glass-input text-xs text-[#101C35] placeholder-[#71849B] border border-white/90 focus:border-[#0877C9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200/80 hover:bg-slate-300 text-[#101C35] flex items-center justify-center text-[10px]"
                aria-label="Clear search"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Right Tools: Sort Dropdown + In-Stock Toggle */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            
            {/* In-Stock Only Toggle */}
            <button
              onClick={() => setInStockOnly(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all border shrink-0 ${
                inStockOnly
                  ? 'bg-[#0877C9]/15 text-[#0877C9] border-[#0877C9]/40'
                  : 'bg-white/75 hover:bg-white text-[#71849B] border-white/90'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${inStockOnly ? 'bg-[#0877C9] border-[#0877C9] text-white' : 'border-[#71849B]/50'}`}>
                {inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{t("In Stock Only", "স্টকে আছে")}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-3.5 pr-8 py-2 rounded-full glass-input text-xs font-bold text-[#101C35] cursor-pointer border border-white/90 focus:border-[#0877C9]"
              >
                <option value="featured">{t("Sort: Featured", "সাজান: সেরা")}</option>
                <option value="price-low">{t("Price: Low to High", "দাম: কম থেকে বেশি")}</option>
                <option value="price-high">{t("Price: High to Low", "দাম: বেশি থেকে কম")}</option>
                <option value="rating">{t("Customer Rating", "সর্বোচ্চ রেটিং")}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#71849B] absolute right-3 pointer-events-none" />
            </div>

            {/* Clear All Filters Button (Only when filters active) */}
            {(activeCategory !== 'All' || searchQuery.trim() || inStockOnly || sortBy !== 'featured') && (
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                  setSortBy('featured');
                }}
                className="px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors whitespace-nowrap"
                title="Reset all filters"
              >
                {t("Reset", "রিসেট")}
              </button>
            )}

          </div>

        </div>

      </div>

      {/* 3. PRODUCT GRID: Responsive Columns (Phase 6) */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-[28px] glass-panel p-8 sm:p-12 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#D9EDFF] text-[#0877C9] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#101C35]">
            {searchQuery.trim()
              ? `${t("No products found for", "কোনো পণ্য পাওয়া যায়নি:")} "${searchQuery}"`
              : t("No products found in this category", "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি")}
          </h3>
          <p className="text-xs sm:text-sm text-[#71849B] max-w-md mx-auto">
            {t(
              "Try searching with broader terms or explore our curated popular collections.",
              "অন্য কোনো নামে অনুসন্ধান করুন অথবা আমাদের অন্যান্য ক্যাটাগরি ব্রাউজ করুন।"
            )}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setInStockOnly(false);
                setSortBy('featured');
              }}
              className="px-6 py-2.5 rounded-full glass-button-primary text-xs font-bold"
            >
              {t("Clear All Filters", "সকল ফিল্টার মুছুন")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredAndSortedProducts.slice(0, visibleCount).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onSelectProduct={setSelectedProduct}
                onAddToCart={addToCart}
                showCategory={true}
              />
            ))}
          </div>

          {/* Load More Pagination */}
          {visibleCount < filteredAndSortedProducts.length && (
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="px-8 py-3 rounded-full glass-button hover:bg-white text-xs font-bold text-[#101C35] hover:text-[#0877C9] shadow-sm transition-all transform hover:scale-105"
              >
                {t(
                  `Load More Goods (${filteredAndSortedProducts.length - visibleCount} remaining)`,
                  `আরও পণ্য লোড করুন (${filteredAndSortedProducts.length - visibleCount}টি বাকি)`
                )}
              </button>
              <span className="text-[11px] text-[#71849B]">
                {t(
                  `Showing ${visibleCount} of ${filteredAndSortedProducts.length} items`,
                  `${filteredAndSortedProducts.length}-এর মধ্যে ${visibleCount}টি দেখানো হচ্ছে`
                )}
              </span>
            </div>
          )}
        </>
      )}

    </section>
  );
}
