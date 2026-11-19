import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, X, ArrowRight, ShieldCheck, ShoppingBag, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';
import ProductImage from './common/ProductImage';
import AzraqDeliveryTruck from './common/AzraqDeliveryTruck';
import { generateProductSlug } from '../utils/productUtils';
import { useNavigate } from 'react-router-dom';

/**
 * AZRAQ Shop — Popular Products Showcase & Full Catalog Engine
 * Exactly matches the reference design layout:
 * 
 * 1. Popular Products Section:
 *    - Desktop: Strictly 6 product cards in one row + 1 promotional delivery banner on the right.
 *    - Header: "Popular Products" with "View All ->" link.
 *    - Authentic product data from ShopContext, unique products, zero duplicates.
 *    - 100% full image containment, wishlist button, BDT price, small add-to-cart button.
 *    - Truthful delivery promo banner ("100% FREE NATIONWIDE DELIVERY on orders over ৳3,000").
 * 
 * 2. Full Catalog Directory (Accessible through View All / Active Filter / Search):
 *    - Preserves all 1,206 products, category filter pills, search, sorting, and pagination.
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

    // Target product IDs for genuine variety matching reference
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

    // 1. First add preferred products if available
    for (const id of preferredIds) {
      const match = products.find(p => p.id === id && p.main_image);
      if (match && !usedIds.has(match.id)) {
        selected.push(match);
        usedIds.add(match.id);
      }
    }

    // 2. Fill up to 6 with featured / high-quality catalog items if any preferred item is missing
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

  // Filter and Sort Pipeline for full catalog
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

  const handleOpenProduct = (p) => {
    if (!p) return;
    try {
      const slug = generateProductSlug(p);
      navigate(`/product/${slug}`);
    } catch {
      navigate(`/product/${p.id}`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (addToCart && product) {
      addToCart(product, product.variants?.[0] || 'Standard', 1);
    }
  };

  const handleToggleFav = (e, productId) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(productId);
    }
  };

  return (
    <section id="popular-products" className="w-full select-none flex flex-col gap-5 sm:gap-6">

      {/* ========================================================
          1. EXACT REFERENCE POPULAR PRODUCTS ROW (6 Cards + 1 Banner)
          ======================================================== */}
      <div className="w-full">
        {/* Section Header: Left Title + Right View All Link */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(130,170,205,0.18)]">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-[#193B5B] tracking-tight">
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
            className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>{shouldShowFullCatalog ? t("Hide Full Catalog", "ক্যাটালগ সংক্ষেপ করুন") : t("View All", "সব দেখুন")}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 7-Item Grid on Desktop: 6 Product Cards + 1 Delivery Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">

          {/* 6 PRODUCT CARDS (Screenshot-2 Image-First Style) */}
          {popularProducts.map((p, idx) => (
            <div key={p.id} className="h-full">
              <ProductCard
                product={p}
                showCategory={false}
                priority={idx < 4}
              />
            </div>
          ))}

          {/* 7. PROMOTIONAL DELIVERY BANNER (On the far right of the 7-item desktop row) */}
          <div
            onClick={() => {
              const el = document.getElementById('brand-value-ribbon');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="col-span-2 sm:col-span-1 lg:col-span-1 bg-gradient-to-br from-[#EEF2FF]/95 via-[#E8F4FD]/90 to-[#DDEEFF]/95 border border-[#6366F1]/20 hover:border-[#6366F1]/45 rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between items-center text-center shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all relative overflow-hidden group cursor-pointer"
          >
            {/* Top Shield & Delivery Claim */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-white/95 border border-[#6366F1]/25 flex items-center justify-center text-[#245BDB] shadow-2xs mb-2 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#245BDB]" />
              </div>
              <span className="text-xs sm:text-[13px] font-black text-[#193B5B] uppercase tracking-tight leading-tight">
                {t("100% FREE", "১০০% ফ্রি")}
                <br />
                {t("NATIONWIDE", "দেশজুড়ে")}
                <br />
                {t("DELIVERY", "ডেলিভারি")}
              </span>
              <span className="text-[10px] font-bold text-[#245BDB] mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-[#6366F1]/20">
                {t("Orders > ৳3,000", "৩০০০৳+ অর্ডারে")}
              </span>
            </div>

            {/* Bottom 3D Truck Graphic */}
            <div className="w-full flex items-center justify-center pt-2 group-hover:scale-105 transition-transform duration-300">
              <AzraqDeliveryTruck className="w-24 sm:w-28 h-16 sm:h-18" animated={true} />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. FULL CATALOG DIRECTORY (1,200+ Products)
          Preserves full catalog browsing, search, category filtering & pagination
          ======================================================== */}
      {shouldShowFullCatalog && (
        <div id="all-products-catalog" className="border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-white/75 backdrop-blur-2xl rounded-[28px] p-5 sm:p-7 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] flex flex-col gap-5 animate-in fade-in duration-200">
          
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(130,170,205,0.18)]">
            <div>
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
                + {t("COMPLETE CATALOGUE DIRECTORY", "সম্পূর্ণ ক্যাটালগ")}
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight">
                  {t("Browse All Products", "সকল পণ্য দেখুন")}
                </h3>
                <span className="text-xs font-mono font-bold text-[#193B5B] bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.3)] px-3 py-0.5 rounded-full shadow-2xs">
                  {filteredAndSortedProducts.length} {t("Items", "টি")}
                </span>
              </div>
            </div>

            {/* EasyDrop API Sync Button */}
            <button
              onClick={syncWithEasyDrop}
              disabled={syncStatus.isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#193B5B] hover:text-[#0877C9] bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs transition-all cursor-pointer"
              title="Sync with EasyDrop API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0877C9] to-[#3B82F6] text-white border-transparent shadow-[0_4px_14px_rgba(8,119,201,0.4)]'
                        : 'bg-white/70 hover:bg-white text-[#718398] hover:text-[#193B5B] border-[rgba(130,170,205,0.22)]'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>

            {/* Filter Controls Row: Search + Sort + In-stock */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(130,170,205,0.18)]">
              
              {/* Search input */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#718398] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t("Filter within catalog...", "পণ্য ফিল্টার করুন...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-full bg-white/85 border border-[rgba(130,170,205,0.28)] text-xs text-[#193B5B] focus:bg-white focus:outline-none focus:border-[#0877C9] shadow-inner font-medium placeholder-[#718398]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718398] hover:text-[#193B5B]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown & Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-[#718398] flex items-center gap-1 font-semibold">
                  <ArrowUpDown className="w-3 h-3" />
                  <span className="hidden md:inline">{t("Sort:", "বাছাই:")}</span>
                </span>

                <button
                  onClick={() => setSortBy('featured')}
                  className={`px-3 py-1.5 rounded-full font-bold border transition-all text-xs cursor-pointer ${
                    sortBy === 'featured'
                      ? 'bg-gradient-to-r from-[#0877C9] to-[#3B82F6] text-white border-transparent shadow-xs'
                      : 'bg-white/70 hover:bg-white text-[#193B5B] border-[rgba(130,170,205,0.25)]'
                  }`}
                >
                  {t("Featured", "সেরা")}
                </button>

                <button
                  onClick={() => setSortBy('price-low')}
                  className={`px-3 py-1.5 rounded-full font-bold border transition-all text-xs cursor-pointer ${
                    sortBy === 'price-low'
                      ? 'bg-gradient-to-r from-[#0877C9] to-[#3B82F6] text-white border-transparent shadow-xs'
                      : 'bg-white/70 hover:bg-white text-[#193B5B] border-[rgba(130,170,205,0.25)]'
                  }`}
                >
                  {t("Price: Low to High", "দাম: কম")}
                </button>

                <button
                  onClick={() => setSortBy('price-high')}
                  className={`px-3 py-1.5 rounded-full font-bold border transition-all text-xs cursor-pointer ${
                    sortBy === 'price-high'
                      ? 'bg-gradient-to-r from-[#0877C9] to-[#3B82F6] text-white border-transparent shadow-xs'
                      : 'bg-white/70 hover:bg-white text-[#193B5B] border-[rgba(130,170,205,0.25)]'
                  }`}
                >
                  {t("Price: High to Low", "দাম: বেশি")}
                </button>

                {/* In-Stock Toggle */}
                <label className="flex items-center gap-1.5 ml-1 cursor-pointer font-semibold text-[#193B5B] select-none px-3 py-1.5 rounded-full hover:bg-white/70 transition-colors text-xs border border-transparent hover:border-[rgba(130,170,205,0.25)]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#0877C9] rounded border-[rgba(130,170,205,0.4)] focus:ring-0"
                  />
                  <span>{t("In Stock Only", "স্টকে আছে")}</span>
                </label>
              </div>

            </div>

          </div>

          {/* 5-Columns Grid on Desktop for Full Catalog */}
          {displayedProducts.length === 0 ? (
            <div className="bg-white/50 border border-[rgba(130,170,205,0.25)] rounded-[22px] p-10 text-center text-[#718398]">
              <p className="text-sm font-semibold">{t("No products found matching your filter.", "কোন পণ্য পাওয়া যায়নি।")}</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="mt-3 px-5 py-2 rounded-full bg-gradient-to-r from-[#0877C9] to-[#3B82F6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
            <div className="flex justify-center mt-3 pt-4 border-t border-[rgba(130,170,205,0.18)]">
              <button
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="px-8 py-3 bg-gradient-to-r from-[#0877C9] to-[#3B82F6] hover:from-[#0665AC] hover:to-[#2563EB] text-white text-xs sm:text-sm font-bold rounded-full transition-all active:scale-98 shadow-[0_8px_24px_rgba(8,119,201,0.35)] cursor-pointer"
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
