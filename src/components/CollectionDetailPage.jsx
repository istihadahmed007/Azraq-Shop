import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Filter, 
  Heart, 
  Eye, 
  ArrowRight, 
  ShoppingBag,
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

export default function CollectionDetailPage() {
  const { 
    collections, 
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
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under-1500', '1500-3000', 'above-3000'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [visibleCount, setVisibleCount] = useState(24);

  // Safe fallback if collection is undefined
  if (!activeCollection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#062B4F] mb-4">
          {t("Collection Not Found", "কালেকশনটি পাওয়া যায়নি")}
        </h2>
        <button
          onClick={() => navigateTo('collections')}
          className="px-6 py-2.5 rounded-full bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors"
        >
          {t("Browse All Collections", "সকল কালেকশন দেখুন")}
        </button>
      </div>
    );
  }

  // Filter and sort products belonging to this collection
  const filteredProducts = useMemo(() => {
    let result = [...(activeCollectionProducts || [])];

    // Search query within collection - SAFELY checking properties
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

    // Price filter
    if (priceFilter === 'under-1500') {
      result = result.filter(p => p.price < 1500);
    } else if (priceFilter === '1500-3000') {
      result = result.filter(p => p.price >= 1500 && p.price <= 3000);
    } else if (priceFilter === 'above-3000') {
      result = result.filter(p => p.price > 3000);
    }

    // Stock availability
    if (inStockOnly) {
      result = result.filter(p => p.in_stock !== false && (p.stock === undefined || p.stock > 0));
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
  }, [activeCollectionProducts, searchQuery, priceFilter, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#062B4F]/50 mb-6">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9]">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigateTo('collections')} className="hover:text-[#0877C9]">
          {t("Collections", "কালেকশনসমূহ")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#062B4F] font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner with Glassy Azraq Theme */}
      <div className="rounded-2xl bg-gradient-to-r from-[#062B4F] via-[#0A3D6E] to-[#062B4F] text-white p-8 sm:p-12 mb-10 border border-[#69C5F5]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#50DDF0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#50DDF0]/20 text-[#50DDF0] text-xs font-mono font-bold">
              <span>{t("EASYDROP SUPPLIER CATEGORY ID", "সাপ্লায়ার ক্যাটাগরি আইডি")}: {activeCollection.id}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {activeCollection.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
                {activeCollectionProducts?.length || 0} {t("Products Available", "পণ্য অন্তর্ভুক্ত")}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
                {t("100% EasyDrop Authentic", "১০০% অনুমোদিত সরবরাহ")}
              </span>
            </div>
          </div>

          <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            <img
              src={activeCollection.cover_image || activeCollection.image_url || activeCollection.fallback_image}
              alt={activeCollection.name}
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#D9F0FF] shadow-sm">
        
        {/* Search within collection */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-[#062B4F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Filter within collection...", "কালেকশনে খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#F8FCFF] border border-[#D9F0FF] text-xs text-[#062B4F] placeholder-[#062B4F]/40 focus:outline-none focus:border-[#0877C9]"
          />
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Price Quick Filter */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'under-1500', '1500-3000', 'above-3000'].map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  priceFilter === p 
                    ? 'bg-[#062B4F] text-white' 
                    : 'bg-[#F8FCFF] text-[#062B4F]/70 hover:bg-[#D9F0FF]/50 border border-[#D9F0FF]'
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
              className="appearance-none pl-3 pr-8 py-1.5 rounded-full bg-[#F8FCFF] border border-[#D9F0FF] text-xs font-bold text-[#062B4F] focus:outline-none focus:border-[#0877C9] cursor-pointer"
            >
              <option value="featured">{t("Featured", "সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি")}</option>
              <option value="rating">{t("Top Rated", "রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#062B4F]/50 absolute right-2.5 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/90 border border-[#D9F0FF] p-8 space-y-4">
          <p className="text-base font-bold text-[#062B4F]">
            {t("No products found matching your filters", "কোনো পণ্য খুঁজে পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setInStockOnly(false);
            }}
            className="px-5 py-2 rounded-full bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              onSelectProduct={setSelectedProduct}
              onAddToCart={(p, v, q) => addToCart(p, v, q)}
              showSku={true}
              showCategory={false}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="text-center pt-10">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-8 py-3 rounded-full bg-white border border-[#D9F0FF] text-[#062B4F] hover:bg-[#F0F7FF] hover:border-[#69C5F5] font-bold text-xs shadow-sm transition-all"
          >
            {t(`Load More (${filteredProducts.length - visibleCount} remaining)`, `আরও দেখুন (${filteredProducts.length - visibleCount}টি বাকি)`)}
          </button>
        </div>
      )}

    </div>
  );
}
