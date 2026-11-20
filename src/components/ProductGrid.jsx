import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';
import AzraqDeliveryTruck from './common/AzraqDeliveryTruck';
import { generateProductSlug } from '../utils/productUtils';
import { useNavigate } from 'react-router-dom';

/**
 * AZRAQ Shop — Popular Products Showcase & Full Catalog Engine
 * 
 * 1. Popular Products Section:
 *    - Desktop: 6 product cards in one row + 1 promotional delivery banner on the right.
 *    - Header: "Popular Products" with "View All ->" link.
 *    - Authentic product data from ShopContext, unique products, zero duplicates.
 *    - Edge-to-edge product cards with BDT pricing and prominent Buy Now button.
 *    - Reassuring delivery banner ("100% Free Nationwide Delivery on orders over ৳3,000").
 * 
 * 2. Full Catalog Directory:
 *    - Accessible via View All / search / active category filter.
 *    - Clean category tabs, search, sorting, and pagination.
 */
export default function ProductGrid() {
  const navigate = useNavigate();
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
  const [visibleCount, setVisibleCount] = useState(35);
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(false);

  // Auto-expand catalog when user has searched or chosen a category
  const shouldShowFullCatalog = isCatalogExpanded || searchQuery.trim().length > 0 || (activeCategory && activeCategory !== 'All');

  // Curate 6 authentic, unique popular products from catalog
  const popularProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const preferredIds = [
      'AZQ-0101', // Awei T61 TWS Earbuds
      'AZQ-0008', // Awei PD91-US 30W GaN Mini Charger
      'AZQ-0484', // Baseus Power Bank 20000mAh
      'AZQ-0032', // Camera Protector for iPhone 16 Pro Max
      'AZQ-0039', // 240W Fast Charging Cable
      'AZQ-0043'  // R36S Retro Handheld Game Console
    ];

    const selected = [];
    const usedIds = new Set();

    for (const id of preferredIds) {
      const match = products.find(p => p.id === id && p.main_image);
      if (match && !usedIds.has(match.id)) {
        selected.push(match);
        usedIds.add(match.id);
      }
    }

    if (selected.length < 6) {
      for (const p of products) {
        if (selected.length >= 6) break;
        if (p.main_image && p.price > 0 && !usedIds.has(p.id)) {
          selected.push(p);
          usedIds.add(p.id);
        }
      }
    }

    return selected.slice(0, 6);
  }, [products]);

  // Categories extracted from authentic database products
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ['All'];
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  // Filter and sort catalog products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter((p) => {
      if (!p.main_image || p.price <= 0) return false;
      if (inStockOnly && (p.stock === 0 || p.status === 'out_of_stock')) return false;

      if (activeCategory && activeCategory !== 'All') {
        const cat = p.category || p.primary_collection_name;
        if (cat !== activeCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const idMatch = p.id?.toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !idMatch) return false;
      }

      return true;
    });

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
    <section id="popular-products" className="w-full select-none flex flex-col gap-5 sm:gap-6">

      {/* 1. POPULAR PRODUCTS ROW (6 Cards + 1 Delivery Banner on Desktop) */}
      <div className="w-full">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
              {t("Popular Products", "জনপ্রিয় পণ্যসমূহ")}
            </h2>
          </div>

          <button
            onClick={() => {
              setIsCatalogExpanded(prev => !prev);
              setTimeout(() => {
                document.getElementById('all-products-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-xs font-semibold text-[#185ADB] hover:text-[#1044A3] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>{shouldShowFullCatalog ? t("Hide Full Catalog", "ক্যাটালগ সংক্ষেপ করুন") : t("View All", "সব দেখুন")}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 7-Item Grid on Desktop: 6 Product Cards + 1 Delivery Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">

          {/* 6 PRODUCT CARDS */}
          {popularProducts.map((p, idx) => (
            <div key={p.id} className="h-full">
              <ProductCard
                product={p}
                showCategory={false}
                priority={idx < 4}
              />
            </div>
          ))}

          {/* 7. PROMOTIONAL DELIVERY BANNER (Solid Grounded Dark Navy) */}
          <div
            onClick={() => {
              const el = document.getElementById('brand-value-ribbon');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="col-span-2 sm:col-span-1 lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#185ADB] shadow-xs mb-2 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-white uppercase tracking-tight leading-tight">
                {t("100% Free", "১০০% ফ্রি")}
                <br />
                {t("Nationwide", "দেশজুড়ে")}
                <br />
                {t("Delivery", "ডেলিভারি")}
              </span>
              <span className="text-[10px] font-semibold text-slate-300 mt-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {t("Orders > ৳3,000", "৩০০০৳+ অর্ডারে")}
              </span>
            </div>

            {/* Delivery Truck Graphic */}
            <div className="w-full flex items-center justify-center pt-2 group-hover:scale-105 transition-transform duration-200">
              <AzraqDeliveryTruck className="w-24 sm:w-28 h-16 sm:h-18" animated={true} />
            </div>
          </div>

        </div>
      </div>

      {/* 2. FULL CATALOG DIRECTORY */}
      {shouldShowFullCatalog && (
        <div id="all-products-catalog" className="border border-slate-200/90 bg-white rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col gap-5 animate-in fade-in duration-150">

          {/* Section Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {t("Browse All Products", "সকল পণ্য দেখুন")}
                </h3>
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md tabular-nums">
                  {filteredAndSortedProducts.length} {t("Items", "টি")}
                </span>
              </div>
            </div>

            {/* EasyDrop API Sync Button */}
            <button
              onClick={syncWithEasyDrop}
              disabled={syncStatus.isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Sync with EasyDrop API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#185ADB] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{syncStatus.isSyncing ? t('Syncing...', 'সিংকিং...') : t('Catalog Verified', 'ক্যাটালগ ভেরিফাইড')}</span>
            </button>
          </div>

          {/* Category Tabs & Filter Toolbar */}
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${isActive
                      ? 'bg-[#185ADB] text-white'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>

            {/* Filter Controls Row: Search + Sort + In-stock */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">

              {/* Search input */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#185ADB] focus:ring-1 focus:ring-[#185ADB]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <ArrowUpDown className="w-3 h-3" />
                  <span className="hidden md:inline">{t("Sort:", "বাছাই:")}</span>
                </span>

                <button
                  onClick={() => setSortBy('featured')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer ${sortBy === 'featured'
                    ? 'bg-[#185ADB] text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                >
                  {t("Featured", "সেরা")}
                </button>

                <button
                  onClick={() => setSortBy('price-low')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer ${sortBy === 'price-low'
                    ? 'bg-[#185ADB] text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                >
                  {t("Price: Low to High", "দাম: কম")}
                </button>

                <button
                  onClick={() => setSortBy('price-high')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer ${sortBy === 'price-high'
                    ? 'bg-[#185ADB] text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                >
                  {t("Price: High to Low", "দাম: বেশি")}
                </button>

                {/* In-Stock Toggle */}
                <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-medium text-slate-700 select-none px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#185ADB] rounded border-slate-300 focus:ring-0"
                  />
                  <span>{t("In Stock Only", "স্টকে আছে")}</span>
                </label>
              </div>

            </div>

          </div>

          {/* 5-Columns Grid on Desktop for Full Catalog */}
          {displayedProducts.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center text-slate-500">
              <p className="text-sm font-medium">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {t("Reset Filters", "ফিল্টার রিসেট করুন")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 items-stretch">
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

          {/* Load More Pagination Button */}
          {visibleCount < filteredAndSortedProducts.length && (
            <div className="flex justify-center mt-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="px-6 py-2.5 bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors active:scale-[0.98] shadow-xs cursor-pointer"
              >
                {t("Load More Products", "আরও পণ্য দেখুন")} ({filteredAndSortedProducts.length - visibleCount} {t("remaining", "বাকি")})
              </button>
            </div>
          )}

        </div>
      )}

    </section>
  );
}
