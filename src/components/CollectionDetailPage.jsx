import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  Filter, 
  Heart, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter and sort products belonging to this collection
  const filteredProducts = useMemo(() => {
    let result = [...activeCollectionProducts];

    // Search query within collection
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.raw_supplier_name.toLowerCase().includes(q)
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
      result = result.filter(p => p.in_stock && p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCollectionProducts, searchQuery, priceFilter, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-azraq-navy/50 mb-6">
        <button onClick={() => navigateTo('home')} className="hover:text-azraq-violet">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigateTo('collections')} className="hover:text-azraq-violet">
          {t("Collections", "কালেকশনসমূহ")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-azraq-navy font-bold">{activeCollection.name}</span>
      </div>

      {/* Collection Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-azraq-navy via-azraq-charcoal to-[#1A253A] text-white p-8 sm:p-12 mb-10 border border-azraq-purple/20 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-azraq-violet/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azraq-lime/15 text-azraq-lime text-xs font-mono font-bold">
              <span>{t("EASYDROP SUPPLIER CATEGORY ID", "সাপ্লায়ার ক্যাটাগরি আইডি")}: {activeCollection.id}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {activeCollection.name}
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              {t(activeCollection.description_en, activeCollection.description_bn)}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-white/60">
              <span>• {activeCollectionProducts.length} {t("Verified Products", "যাচাইকৃত পণ্য")}</span>
              <span>• {t("Nationwide Delivery Across Bangladesh", "সারা বাংলাদেশে ডেলিভারি")}</span>
              <span>• {t("100% Quality Inspected", "মান নিয়ন্ত্রিত")}</span>
            </div>
          </div>

          {/* Collection Cover Art */}
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-white/10 backdrop-blur-md p-4 flex items-center justify-center border border-white/20 shadow-2xl flex-shrink-0">
            <img
              src={activeCollection.image_url}
              alt={activeCollection.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Sibling Collection Navigation Tabs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
          <span className="text-xs font-bold text-azraq-navy/50 mr-1 flex-shrink-0">
            {t("Browse Others:", "অন্যান্য কালেকশন:")}
          </span>
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                col.slug === activeCollection.slug
                  ? 'bg-azraq-navy text-white shadow-md'
                  : 'bg-white hover:bg-azraq-lavender text-azraq-navy/70 border border-azraq-purple/20'
              }`}
            >
              {col.name} ({col.imported_product_count})
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-azraq-purple/20 shadow-sm">
        
        {/* Search within collection */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-azraq-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t(`Search in ${activeCollection.name}...`, "পণ্য খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-azraq-navy focus:outline-none focus:border-azraq-violet"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-azraq-navy/60 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {t("Price:", "দাম:")}
          </span>
          {[
            { id: 'all', label: t('All', 'সব') },
            { id: 'under-1500', label: 'Under ৳1,500' },
            { id: '1500-3000', label: '৳1,500 – ৳3,000' },
            { id: 'above-3000', label: '৳3,000+' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setPriceFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                priceFilter === f.id
                  ? 'bg-azraq-violet text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}

          <label className="flex items-center gap-1.5 ml-2 cursor-pointer font-bold text-azraq-navy">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-azraq-violet focus:ring-0"
            />
            <span>{t("In Stock Only", "কেবল স্টকে থাকা")}</span>
          </label>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-azraq-navy bg-white focus:outline-none focus:border-azraq-violet cursor-pointer"
          >
            <option value="featured">{t("Sort: Featured", "সাজান: সেরা")}</option>
            <option value="price-low">{t("Price: Low to High", "দাম: কম থেকে বেশি")}</option>
            <option value="price-high">{t("Price: High to Low", "দাম: বেশি থেকে কম")}</option>
            <option value="rating">{t("Rating: Highest", "সর্বোচ্চ রেটিং")}</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-gray-400 absolute right-2.5 pointer-events-none" />
        </div>

      </div>

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-gray-200 p-8 space-y-4">
          <p className="text-base font-bold text-azraq-navy">
            {t("No products matched your filters in this collection", "কোনো পণ্য পাওয়া যায়নি")}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setInStockOnly(false);
            }}
            className="px-5 py-2 rounded-full bg-azraq-navy text-white text-xs font-bold hover:bg-azraq-violet"
          >
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.map(product => {
            const isFav = favorites.includes(product.id);

            return (
              <div
                key={product.id}
                className="rounded-none bg-white border border-azraq-purple/20 p-2 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[370px] sm:h-[490px] md:h-[510px]"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    isFav ? 'bg-azraq-violet text-white shadow-md' : 'bg-white/80 text-azraq-navy/40 hover:text-azraq-violet'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-white' : ''}`} />
                </button>

                {/* SKU Badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-none bg-azraq-cloud border border-azraq-purple/20 text-azraq-navy text-[8px] sm:text-[9px] font-mono font-bold">
                    {product.id}
                  </span>
                </div>

                {/* Product Image - 75-80% visual dominance, completely square corners */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative w-full h-[250px] sm:h-[370px] md:h-[390px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-1.5 sm:p-3 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.main_image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-azraq-navy/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white text-azraq-navy text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-azraq-lime transition-colors">
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {t("Quick View", "বিস্তারিত")}
                    </span>
                  </div>
                </div>

                {/* Info & Bottom Action */}
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-azraq-navy text-xs sm:text-sm line-clamp-1 cursor-pointer hover:text-azraq-violet transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      SKU: {product.easydrop_id || product.sku}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                    <span className="text-xs sm:text-base md:text-lg font-black text-azraq-navy truncate">
                      ৳{product.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform hover:scale-110 flex-shrink-0"
                      title="Add to bag"
                    >
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-azraq-navy" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Load More Pagination */}
      {visibleCount < filteredProducts.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-8 py-3 rounded-full bg-azraq-navy text-white hover:bg-azraq-charcoal font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            {t("Load More Products", "আরও পণ্য লোড করুন")} ({visibleCount} of {filteredProducts.length})
          </button>
        </div>
      )}

    </div>
  );
}

