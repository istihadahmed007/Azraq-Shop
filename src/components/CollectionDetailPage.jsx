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
 * AZRAQ Shop — Collection Detail Page
 */
export default function CollectionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { 
    collections,
    products,
    activeCollection: contextActiveCollection, 
    activeCollectionProducts: contextCollectionProducts, 
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

  // Safe fallback if collection is undefined
  if (!activeCollection) {
    return (
      <div className="w-full py-16 text-center select-none">
        <h2 className="text-2xl font-bold text-[#293B52] mb-3">
          {t("Collection Not Found", "কালেকশনটি পাওয়া যায়নি")}
        </h2>
        <p className="text-xs text-[#6B7D93] mb-6">
          {t("The category you requested does not exist or has been relocated.", "আপনার অনুরোধকৃত কালেকশনটি পাওয়া যায়নি।")}
        </p>
        <button
          onClick={() => navigate('/collections')}
          className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white text-xs font-bold shadow-sm hover:bg-[#0665AC] transition-all"
        >
          {t("Browse All Collections", "সকল কালেকশন দেখুন")}
        </button>
      </div>
    );
  }

  // Filter and sort products belonging to this collection
  const filteredProducts = useMemo(() => {
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
  }, [activeCollectionProducts, searchQuery, priceFilter, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="w-full py-4 min-h-screen select-none">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7D93] mb-4">
        <Link to="/" className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections" className="hover:text-[#0877C9] transition-colors">
          {t("Collections", "কালেকশনসমূহ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#293B52] font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner with Clean Neumorphic Surface */}
      <div className="rounded-[26px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-6 sm:p-8 mb-5 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FA] text-[#0877C9] text-xs font-bold border border-[#D5E2EE]">
              <span>{t("COLLECTION", "কালেকশন")} #{activeCollection.id}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#293B52] tracking-tight">
              {activeCollection.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7D93] leading-relaxed">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EDF4F9] text-xs font-semibold text-[#293B52] border border-[#D5E2EE]">
                {activeCollectionProducts?.length || 0} {t("Products Available", "পণ্য অন্তর্ভুক্ত")}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800 border border-emerald-200">
                {t("100% Authentic Quality", "১০০% আসল পণ্য")}
              </span>
            </div>
          </div>

          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[20px] bg-[#EDF4F9] border border-[#D5E2EE] p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 p-4 rounded-[22px] bg-[#F7FAFD] border border-[#D5E2EE]/90 shadow-[0_10px_30px_rgba(50,75,100,0.05)]">
        
        {/* Search within collection */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-[#6B7D93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Filter within collection...", "কালেকশনে খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-xs text-[#293B52] placeholder-[#6B7D93] focus:outline-none focus:border-[#0877C9] transition-all font-medium"
          />
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Price Quick Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'under-1500', '1500-3000', 'above-3000'].map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all text-xs ${
                  priceFilter === p 
                    ? 'bg-[#0877C9] text-white shadow-sm' 
                    : 'bg-[#EDF4F9] text-[#6B7D93] hover:text-[#293B52] border border-[#D5E2EE]'
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
              className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full bg-[#EDF4F9] text-xs font-bold text-[#293B52] cursor-pointer border border-[#D5E2EE] focus:border-[#0877C9] focus:outline-none"
            >
              <option value="featured">{t("Featured", "সেরা")}</option>
              <option value="price-low">{t("Price: Low to High", "দাম: কম")}</option>
              <option value="price-high">{t("Price: High to Low", "দাম: বেশি")}</option>
              <option value="rating">{t("Top Rated", "রেটিং")}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7D93] absolute right-3 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Products Grid — Exactly 5 Product Cards Per Row on Desktop */}
      {displayedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-[26px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-8 space-y-4 max-w-xl mx-auto shadow-xs">
          <p className="text-base font-bold text-[#293B52]">
            {t("No products found matching your filters", "কোনো পণ্য খুঁজে পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setInStockOnly(false);
            }}
            className="px-6 py-2 rounded-full bg-[#0877C9] text-white text-xs font-bold shadow-xs hover:bg-[#0768b0] transition-colors"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
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
            className="px-8 py-3 rounded-full bg-[#F7FAFD] border border-[#D5E2EE] text-[#293B52] hover:text-[#0877C9] hover:border-[#0877C9] font-bold text-xs shadow-sm hover:shadow transition-all"
          >
            {t(`Load More (${filteredProducts.length - visibleCount} remaining)`, `আরও দেখুন (${filteredProducts.length - visibleCount}টি বাকি)`)}
          </button>
        </div>
      )}

    </div>
  );
}
