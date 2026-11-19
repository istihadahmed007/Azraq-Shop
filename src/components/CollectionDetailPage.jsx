import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Collection Detail Page (Futuristic Glass Edition)
 */
export default function CollectionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { 
    collections,
    products,
    activeCollection: contextActiveCollection, 
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
  const [visibleCount, setVisibleCount] = useState(25);

  // Resolve collection either from URL parameter or fallback to context activeCollection
  const activeCollection = useMemo(() => {
    if (slug) {
      return collections.find(c => c.slug === slug) || null;
    }
    return contextActiveCollection || collections[0];
  }, [slug, collections, contextActiveCollection]);

  // Resolve products belonging to this collection
  const collectionProducts = useMemo(() => {
    if (!activeCollection) return [];
    return products.filter(p => 
      (p.collection_ids && p.collection_ids.includes(activeCollection.id)) ||
      p.category === activeCollection.name ||
      p.primary_collection_name === activeCollection.name
    );
  }, [activeCollection, products]);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (activeCollection) {
      document.title = `${activeCollection.name} — AZRAQ Collections`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCollection]);

  // Filter and sort products belonging to this collection (Unconditionally called on every render)
  const filteredProducts = useMemo(() => {
    if (!activeCollection) return [];
    let result = [...(collectionProducts || [])];

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
  }, [activeCollection, collectionProducts, searchQuery, priceFilter, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Safe fallback if collection is undefined (Rendered after all hooks are evaluated)
  if (!activeCollection) {
    return (
      <div className="w-full py-16 text-center select-none">
        <h2 className="text-2xl font-bold text-[#193B5B] mb-3">
          {t("Collection Not Found", "কালেকশনটি পাওয়া যায়নি")}
        </h2>
        <p className="text-xs text-[#718398] mb-6">
          {t("The category you requested does not exist or has been relocated.", "আপনার অনুরোধকৃত কালেকশনটি পাওয়া যায়নি।")}
        </p>
        <button
          onClick={() => navigate('/collections')}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-xs font-bold shadow-[0_4px_16px_rgba(112,200,237,0.4)] hover:from-[#5CBDE5] transition-all"
        >
          {t("Browse All Collections", "সকল কালেকশন দেখুন")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-4 min-h-screen select-none space-y-6">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#718398]">
        <Link to="/" className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#82AACD]" />
        <Link to="/collections" className="hover:text-[#0877C9] transition-colors">
          {t("Collections", "কালেকশনসমূহ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#82AACD]" />
        <span className="text-[#193B5B] font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner with Clean Glass Surface */}
      <div className="rounded-[28px] bg-[#F8FBFF]/75 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("DEPARTMENT ARCHIVE", "বিভাগীয় ক্যাটালগ")} #{activeCollection.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
              {activeCollection.name}
            </h1>
            <p className="text-xs sm:text-[13px] text-[#718398] leading-relaxed">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#DDEEFF]/70 text-xs font-mono font-bold text-[#193B5B] border border-[rgba(130,170,205,0.25)]">
                {collectionProducts?.length || 0} {t("Products Available", "পণ্য অন্তর্ভুক্ত")}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800 border border-emerald-200">
                {t("100% Authentic Quality", "১০০% আসল পণ্য")}
              </span>
            </div>
          </div>

          <div className="card-image-wrapper w-32 h-32 sm:w-44 sm:h-44 rounded-[22px] bg-white/80 border border-[rgba(130,170,205,0.25)] p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <ProductImage
              src={activeCollection.cover_image || activeCollection.image_url || activeCollection.fallback_image}
              alt={activeCollection.name}
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Filter and Search Bar inside the header container */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mt-6 pt-5 border-t border-[rgba(130,170,205,0.18)]">
          
          {/* Search within collection */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#718398] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Filter within department...", "কালেকশনে খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/80 border border-[rgba(130,170,205,0.28)] text-xs text-[#193B5B] placeholder-[#718398] focus:outline-none focus:border-[#70C8ED] focus:bg-white font-medium transition-colors shadow-inner"
            />
          </div>

          {/* Filter Badges & Sort */}
          <div className="flex flex-wrap items-center gap-1.5">
            
            {/* Price Quick Filter */}
            <div className="flex items-center gap-1 text-xs">
              {['all', 'under-1500', '1500-3000', 'above-3000'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all text-xs border ${
                    priceFilter === p 
                      ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white border-transparent shadow-xs' 
                      : 'bg-white/70 text-[#718398] hover:text-[#193B5B] border-[rgba(130,170,205,0.25)]'
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
                className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full bg-white/80 text-xs font-bold text-[#193B5B] cursor-pointer border border-[rgba(130,170,205,0.3)] focus:border-[#70C8ED] focus:outline-none transition-colors shadow-xs"
              >
                <option value="featured">{t("Featured", "সেরা")}</option>
                <option value="price-low">{t("Price: Low to High", "দাম: কম")}</option>
                <option value="price-high">{t("Price: High to Low", "দাম: বেশি")}</option>
                <option value="rating">{t("Top Rated", "রেটিং")}</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#718398] absolute right-2.5 pointer-events-none" />
            </div>

          </div>

        </div>
      </div>

      {/* Products Grid — Exactly 5 Product Cards Per Row on Desktop */}
      {displayedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-[22px] bg-white/75 border border-[rgba(130,170,205,0.25)] p-8 space-y-4 max-w-xl mx-auto shadow-xs">
          <p className="text-base font-bold text-[#193B5B]">
            {t("No products found matching your filters", "কোনো পণ্য খুঁজে পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setInStockOnly(false);
            }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-xs font-bold transition-all shadow-xs"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
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
            onClick={() => setVisibleCount(prev => prev + 25)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white font-bold text-xs transition-all active:scale-98 shadow-[0_8px_24px_rgba(112,200,237,0.45)]"
          >
            {t(`Load More (${filteredProducts.length - visibleCount} remaining)`, `আরও দেখুন (${filteredProducts.length - visibleCount}টি বাকি)`)}
          </button>
        </div>
      )}

    </div>
  );
}
