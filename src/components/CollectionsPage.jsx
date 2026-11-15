import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, ArrowRight, Sparkles, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CollectionsPage() {
  const { collections, navigateTo, t } = useShop();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('count'); // 'count' | 'name' | 'featured'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#062B4F]/50 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9]">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#062B4F]">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D9F0FF] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#50DDF0] shadow-[0_0_8px_#50DDF0]" />
            <span className="text-xs font-black tracking-widest text-[#0877C9] uppercase">
              {t("AUTHENTIC TAXONOMY BROWSER", "ইজিড্রপ ক্যাটাগরি ব্রাউজার")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#062B4F] tracking-tight">
            {t("Explore Collections", "সকল কালেকশন এক্সপ্লোর করুন")}
          </h1>
          <p className="text-xs sm:text-sm text-[#062B4F]/65 mt-1 max-w-xl">
            {t(
              "Browse 18 complete EasyDrop supplier categories. Filtered, organized and verified for seamless discovery.",
              "১৮টি মূল ক্যাটাগরি ও ১২০৬টি যাচাইকৃত পণ্যের পূর্ণাঙ্গ তালিকা।"
            )}
          </p>
        </div>

        {/* View Mode Toggle & Total Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#062B4F]/70">
            {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
          </span>

          <div className="flex items-center bg-white border border-[#D9F0FF] rounded-full p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-[#062B4F] text-white' : 'text-gray-400 hover:text-[#062B4F]'
              }`}
              title="Editorial Grid Mode"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-colors ${
                viewMode === 'list' ? 'bg-[#062B4F] text-white' : 'text-gray-400 hover:text-[#062B4F]'
              }`}
              title="Compact Category List Mode"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        
        {/* Search collections */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-[#062B4F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search 18 collections (e.g. Gadgets, Bags, Wellness...)", "কালেকশন খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-[#D9F0FF] text-xs text-[#062B4F] placeholder-[#062B4F]/40 focus:outline-none focus:border-[#0877C9] shadow-sm"
          />
        </div>

        {/* Sort Collections */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-full bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] focus:outline-none focus:border-[#0877C9] shadow-sm cursor-pointer"
          >
            <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
            <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
            <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#062B4F]/50 absolute right-3 pointer-events-none" />
        </div>

      </div>

      {/* MODE 1: Editorial Visual Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md border border-[#D9F0FF] p-5 shadow-sm hover:shadow-[0_12px_35px_rgba(8,119,201,0.12)] hover:border-[#69C5F5]/60 transition-all duration-300 flex flex-col justify-between h-[450px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-[#F0F7FF] border border-[#D9F0FF] text-[#062B4F] text-[10px] font-mono font-bold">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#50DDF0]/20 text-[#0877C9] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#0877C9]" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              <div className="relative w-full h-[300px] sm:h-[310px] bg-gradient-to-b from-[#F8FCFF] to-white flex items-center justify-center p-3 my-auto overflow-hidden">
                <img
                  src={col.cover_image || col.image_url || col.fallback_image}
                  alt={col.name}
                  loading="lazy"
                  onError={(e) => {
                    if (col.fallback_image && e.target.src !== col.fallback_image) {
                      e.target.src = col.fallback_image;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-108"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between z-10">
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-[#062B4F] text-base truncate group-hover:text-[#0877C9] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#062B4F]/60 truncate font-normal mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#062B4F] group-hover:bg-[#0877C9] text-white flex items-center justify-center shadow-md transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: Compact List Mode */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="bg-white/95 backdrop-blur-md border border-[#D9F0FF] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#69C5F5] hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-lg bg-[#F8FCFF] p-1 flex-shrink-0 flex items-center justify-center border border-[#D9F0FF]">
                  <img
                    src={col.cover_image || col.image_url || col.fallback_image}
                    alt={col.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#062B4F] text-sm sm:text-base hover:text-[#0877C9] truncate">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#062B4F]/60 truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#0877C9] bg-[#D9F0FF]/50 px-2.5 py-1 rounded-full">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("items", "আইটেম")}
                </span>
                <ArrowRight className="w-4 h-4 text-[#062B4F]/40" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
