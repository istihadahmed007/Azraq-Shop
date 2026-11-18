import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Collection Detail Page
 */
export default function CollectionDetailPage() {
  const { 
    activeCollection, 
    activeCollectionProducts, 
    navigateTo, 
    setSelectedProduct, 
    addToCart, 
    favorites, 
    toggleFavorite, 
    t 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(24);

  // Safe fallback if collection is undefined
  if (!activeCollection) {
    return (
      <div className="w-full py-16 text-center select-none">
        <h2 className="text-2xl font-bold text-[#101C35] mb-4">
          {t("Collection Not Found", "কালেকশনটি পাওয়া যায়নি")}
        </h2>
        <button
          onClick={() => navigateTo('collections')}
          className="px-6 py-2.5 rounded-full glass-button-primary text-xs font-bold"
        >
          {t("Browse All Collections", "সকল কালেকশন দেখুন")}
        </button>
      </div>
    );
  }

  // Filter and sort products belonging to this collection
  const filteredProducts = useMemo(() => {
    let result = [...(activeCollectionProducts || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.raw_supplier_name && p.raw_supplier_name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      );
    }

    if (priceFilter === 'under-1500') {
      result = result.filter(p => p.price < 1500);
    } else if (priceFilter === '1500-3000') {
      result = result.filter(p => p.price >= 1500 && p.price <= 3000);
    } else if (priceFilter === 'above-3000') {
      result = result.filter(p => p.price > 3000);
    }

    if (inStockOnly) {
      result = result.filter(p => p.in_stock !== false && (p.stock === undefined || p.stock > 0));
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [activeCollectionProducts, searchQuery, priceFilter, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="w-full py-4 min-h-screen select-none">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigateTo('collections')} className="hover:text-[#0877C9] transition-colors">
          {t("Collections", "কালেকশনসমূহ")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#212121] font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner with Clean Retail Layout */}
      <div className="rounded-[4px] bg-white border border-gray-200 p-5 sm:p-6 mb-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-blue-50 text-[#0877C9] text-xs font-bold border border-blue-100">
              <span>{t("COLLECTION", "কালেকশন")} #{activeCollection.id}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-[#212121] tracking-tight">
              {activeCollection.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] leading-relaxed">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-gray-50 text-xs font-medium text-gray-600 border border-gray-200">
                {activeCollectionProducts?.length || 0} {t("Products Available", "পণ্য অন্তর্ভুক্ত")}
              </span>
              <span className="px-2.5 py-0.5 rounded-[2px] bg-emerald-50 text-xs font-medium text-emerald-800 border border-emerald-200">
                {t("100% Authentic Quality", "১০০% আসল পণ্য")}
              </span>
            </div>
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[3px] bg-gray-50 border border-gray-200 p-2 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={activeCollection.cover_image || activeCollection.image_url || activeCollection.fallback_image}
              alt={activeCollection.name}
              onError={(e) => {
                const fallback = activeCollection.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                if (e.target.src !== fallback) {
                  e.target.src = fallback;
                }
              }}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 p-3 rounded-[4px] bg-white border border-gray-200 shadow-2xs">
        
        {/* Search within collection */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Filter within collection...", "কালেকশনে খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-[3px] border border-gray-200 text-xs text-[#212121] placeholder-gray-400 focus:outline-none focus:border-[#0877C9]"
          />
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Price Quick Filter */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'under-1500', '1500-3000', 'above-3000'].map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`px-2.5 py-1.5 rounded-[4px] font-bold transition-all border ${
                  priceFilter === p 
                    ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-2xs' 
                    : 'glass-button text-[#71849B] hover:text-[#101C35] border-white/90'
                }`}
              >
                {p === 'all' && t('All Prices', 'সব দাম')}
                {p === 'under-1500' && '< ৳1,500'}
                {p === '1500-3000' && '৳1.5K - 3K'}
                {p === 'above-3000' && '> ৳3,000'}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-[6px] glass-input text-xs font-bold text-[#101C35] cursor-pointer border border-white/90 focus:border-[#0877C9]"
            >
              <option value="featured">{t("Featured", "সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি")}</option>
              <option value="rating">{t("Top Rated", "রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#71849B] absolute right-2.5 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Products Grid (Shopee-Inspired Proportions: 5-6 desktop, 3-4 tablet, 2 mobile) */}
      {displayedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-[8px] glass-panel p-8 space-y-4 max-w-xl mx-auto border border-white/95">
          <p className="text-base font-bold text-[#101C35]">
            {t("No products found matching your filters", "কোনো পণ্য খুঁজে পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setInStockOnly(false);
            }}
            className="px-5 py-2 rounded-[6px] glass-button-primary text-xs font-bold shadow-xs"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5 lg:gap-4">
          {displayedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              onSelectProduct={setSelectedProduct}
              onAddToCart={(p, v, q) => addToCart(p, v, q)}
              showCategory={false}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-8 py-2.5 rounded-[6px] glass-button text-[#101C35] hover:text-[#0877C9] font-bold text-xs shadow-xs transition-all hover:scale-102"
          >
            {t(`Load More (${filteredProducts.length - visibleCount} remaining)`, `আরও দেখুন (${filteredProducts.length - visibleCount}টি বাকি)`)}
          </button>
        </div>
      )}

    </div>
  );
}
