import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Main Curated Product Catalog Grid
 * Responsive 5-column desktop, 4-column tablet, 2-column mobile glassmorphism grid.
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
  const [visibleCount, setVisibleCount] = useState(25);

  // Dynamic categories extracted from authentic database products
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['All', ...list.slice(0, 10)];
  }, [products]);

  // Reset pagination when category or search changes
  React.useEffect(() => {
    setVisibleCount(25);
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
    <section id="all-products" className="w-full py-2 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0877C9] shadow-[0_0_8px_rgba(8,119,201,0.5)]" />
            <span className="text-[11px] font-black tracking-widest text-[#0877C9] uppercase">
              {t("OFFICIAL AUTHORIZED CATALOGUE", "অনুমোদিত সোর্স ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#101C35] tracking-tight">
            {t("All Curated Goods", "সকল কিউরেটেড পণ্য সম্ভার")}
          </h2>
          <p className="text-xs sm:text-sm text-[#71849B] mt-1">
            {t(
              "Imported & synchronized directly from EasyDrop. Original retail prices in BDT with genuine supplier specs.",
              "ইজিড্রপ থেকে সরাসরি আমদানিকৃত। আসল রিটেইল মূল্যে বিডিটি (৳)-তে নির্ভরযোগ্য ডেলিভারি।"
            )}
          </p>
        </div>

        {/* Sync Status Badge & Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={syncWithEasyDrop}
            disabled={syncStatus.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-button text-[#101C35]"
            title="Sync with EasyDrop API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('EasyDrop Synced', 'ইজিড্রপ সিংক')}</span>
          </button>
          
          <span className="text-xs font-bold text-[#71849B]">
            {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
          </span>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#0877C9] text-white shadow-xs'
                  : 'glass-button text-[#71849B] hover:text-[#101C35]'
              }`}
            >
              {cat === 'All' ? `${t('All', 'সকল')} (${products.length})` : cat}
            </button>
          ))}
        </div>

        {/* Right Tools: Search & Sort */}
        <div className="flex items-center gap-3">
          {/* Quick Filter Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#71849B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full glass-input text-xs text-[#101C35] placeholder-[#71849B]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full glass-input text-xs font-bold text-[#101C35] cursor-pointer"
            >
              <option value="featured">{t("Sort: Featured", "সাজান: সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম থেকে বেশি")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি থেকে কম")}</option>
              <option value="rating">{t("Customer Rating", "সর্বোচ্চ রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#71849B] absolute right-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Product Grid: 5 columns on desktop, 4 on large, 3 on medium, 2 on mobile */}
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
              }}
              className="px-6 py-2.5 rounded-full glass-button-primary text-xs font-bold"
            >
              {t("Clear All Filters", "সকল ফিল্টার মুছুন")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
            {filteredAndSortedProducts.slice(0, visibleCount).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onSelectProduct={setSelectedProduct}
                onAddToCart={(p, v, q) => addToCart(p, v, q)}
                showSku={true}
                showCategory={true}
              />
            ))}
          </div>

          {/* Pagination / Load More */}
          {visibleCount < filteredAndSortedProducts.length && (
            <div className="mt-10 text-center space-y-3">
              <p className="text-xs text-[#71849B] font-semibold">
                {t("Showing", "দেখাচ্ছে")} {Math.min(visibleCount, filteredAndSortedProducts.length)} {t("of", "এর মধ্যে")} {filteredAndSortedProducts.length} {t("Products", "পণ্য")}
              </p>
              <button
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="px-8 py-3 rounded-full glass-button-primary font-bold text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>{t("Load More Products", "আরো ২৫টি পণ্য দেখুন")}</span>
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
