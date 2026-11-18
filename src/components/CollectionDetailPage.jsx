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
      <div className="flex items-center gap-2 text-xs font-semibold text-[#71849B] mb-5">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigateTo('collections')} className="hover:text-[#0877C9] transition-colors">
          {t("Collections", "কালেকশনসমূহ")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#101C35] font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner with Frosted Glass Theme */}
      <div className="rounded-[8px] glass-feature p-6 sm:p-8 mb-6 relative overflow-hidden border border-white/95 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#69C5F5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white/90 text-[#0877C9] text-xs font-mono font-bold border border-white">
              <span>{t("COLLECTION", "কালেকশন")} #{activeCollection.id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#101C35] tracking-tight">
              {activeCollection.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#71849B] leading-relaxed font-normal">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-1 rounded-[4px] bg-white/90 backdrop-blur-md text-xs font-semibold text-[#101C35] border border-white shadow-2xs">
                {activeCollectionProducts?.length || 0} {t("Products Available", "পণ্য অন্তর্ভুক্ত")}
              </span>
              <span className="px-2.5 py-1 rounded-[4px] bg-white/90 backdrop-blur-md text-xs font-semibold text-[#101C35] border border-white shadow-2xs">
                {t("100% Verified Quality", "১০০% পরীক্ষিত গুণমান")}
              </span>
            </div>
          </div>

          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-[6px] bg-[#F8FBFF] border border-white/90 p-3 flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
            <img
              src={activeCollection.cover_image || activeCollection.image_url || activeCollection.fallback_image}
              alt={activeCollection.name}
              onError={(e) => {
                const fallback = activeCollection.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                if (e.target.src !== fallback) {
                  e.target.src = fallback;
                }
              }}
              className="w-full h-full object-contain filter drop-shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Sharp 6px radius) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 p-3 rounded-[8px] glass-panel border border-white/95">
        
        {/* Search within collection */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-[#71849B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Filter within collection...", "কালেকশনে খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-[6px] glass-input text-xs text-[#101C35] placeholder-[#71849B] border border-white/90 focus:border-[#0877C9]"
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
