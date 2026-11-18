import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, ArrowRight, Sparkles, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Full Collections Browser Page
 */
export default function CollectionsPage() {
  const { collections, navigateTo, t } = useShop();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('count');

  const filteredCollections = useMemo(() => {
    let result = [...collections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.description_en && c.description_en.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'count') {
      result.sort((a, b) => (b.product_count || b.imported_product_count || 0) - (a.product_count || a.imported_product_count || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [collections, searchQuery, sortBy]);

  return (
    <div className="w-full py-4 min-h-screen select-none">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#71849B] mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#101C35]">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/60 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0877C9] shadow-[0_0_8px_rgba(8,119,201,0.5)]" />
            <span className="text-[11px] font-black tracking-widest text-[#0877C9] uppercase">
              {t("AUTHENTIC TAXONOMY BROWSER", "ইজিড্রপ ক্যাটাগরি ব্রাউজার")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#101C35] tracking-tight">
            {t("Explore Collections", "সকল কালেকশন এক্সপ্লোর করুন")}
          </h1>
          <p className="text-xs sm:text-sm text-[#71849B] mt-1 max-w-xl">
            {t(
              "Browse 18 complete EasyDrop supplier categories. Filtered, organized and verified for seamless discovery.",
              "১৮টি মূল ক্যাটাগরি ও ১২০৬টি যাচাইকৃত পণ্যের পূর্ণাঙ্গ তালিকা।"
            )}
          </p>
        </div>

        {/* View Mode Toggle & Total Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#71849B]">
            {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
          </span>

          <div className="flex items-center glass-panel rounded-[6px] p-1 shadow-2xs border border-white/90">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[4px] transition-colors ${
                viewMode === 'grid' ? 'bg-[#0877C9] text-white' : 'text-[#71849B] hover:text-[#101C35]'
              }`}
              title="Editorial Grid Mode"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-[4px] transition-colors ${
                viewMode === 'list' ? 'bg-[#0877C9] text-white' : 'text-[#71849B] hover:text-[#101C35]'
              }`}
              title="Compact Category List Mode"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        
        {/* Search collections */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-[#71849B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search 18 collections (e.g. Gadgets, Bags, Wellness...)", "কালেকশন খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-[6px] glass-input text-xs text-[#101C35] placeholder-[#71849B] border border-white/90 focus:border-[#0877C9]"
          />
        </div>

        {/* Sort Collections */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-[6px] glass-input text-xs font-bold text-[#101C35] cursor-pointer border border-white/90 focus:border-[#0877C9]"
          >
            <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
            <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
            <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#71849B] absolute right-2.5 pointer-events-none" />
        </div>

      </div>

      {/* MODE 1: Editorial Visual Grid (Sharp 8px radius, natural proportion, no fixed dead height) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer rounded-[8px] glass-card p-4 transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-white/95 bg-white/90 hover:border-[#0877C9]/40 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between z-10 mb-3">
                  <span className="px-2 py-0.5 rounded-[4px] bg-white/90 backdrop-blur-md border border-white/90 text-[#101C35] text-[10px] font-mono font-bold shadow-2xs">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  {col.featured && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#0877C9] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-[#50DDF0] fill-[#50DDF0]" />
                      {col.badge || 'Featured'}
                    </span>
                  )}
                </div>

                {/* Collection Thumbnail: Visually prominent with consistent 16/10 aspect */}
                <div className="relative w-full aspect-[16/10] bg-[#F8FBFF] rounded-[6px] border border-white/90 flex items-center justify-center p-3 mb-3 overflow-hidden transition-colors group-hover:bg-white shadow-2xs">
                  <img
                    src={displayImage}
                    alt={col.name}
                    loading="lazy"
                    onError={(e) => {
                      const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
                    className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between z-10">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#101C35] text-sm sm:text-base truncate group-hover:text-[#0877C9] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-[#71849B] truncate font-medium mt-0.5">
                      {t(col.description_en, col.description_bn)}
                    </p>
                  </div>
                  <div className="w-7.5 h-7.5 rounded-[4px] glass-button group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Compact List Mode */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="glass-card rounded-[8px] p-3.5 flex items-center justify-between gap-4 cursor-pointer border border-white/95 bg-white/90 hover:border-[#0877C9]/40"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-[6px] bg-[#F8FBFF] p-1.5 flex-shrink-0 flex items-center justify-center border border-white/90">
                  <img
                    src={col.cover_image || col.image_url || col.fallback_image}
                    alt={col.name}
                    onError={(e) => {
                      const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#101C35] text-sm sm:text-base group-hover:text-[#0877C9] truncate">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#71849B] truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#0877C9] bg-[#D9EDFF]/80 px-2.5 py-1 rounded-[4px] border border-white">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("items", "আইটেম")}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#71849B]" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
