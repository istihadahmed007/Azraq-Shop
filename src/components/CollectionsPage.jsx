import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, ArrowRight, Sparkles, ArrowUpDown, Filter, ChevronRight } from 'lucide-react';
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
        c.name.toLowerCase().includes(q) || 
        c.description_en.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'count') {
      result.sort((a, b) => (b.product_count || b.imported_product_count || 0) - (a.product_count || a.imported_product_count || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [collections, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-azraq-navy/50 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-azraq-violet">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-azraq-navy">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-azraq-purple/15 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-azraq-lime" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("AUTHENTIC TAXONOMY BROWSER", "ইজিড্রপ ক্যাটাগরি ব্রাউজার")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-azraq-navy tracking-tight">
            {t("Explore Collections", "সকল কালেকশন এক্সপ্লোর করুন")}
          </h1>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1 max-w-xl">
            {t(
              "Browse 18 complete EasyDrop supplier categories. Filtered, organized and verified for seamless discovery.",
              "১৮টি মূল ক্যাটাগরি ও ২৫৭টি যাচাইকৃত পণ্যের পূর্ণাঙ্গ তালিকা।"
            )}
          </p>
        </div>

        {/* View Mode Toggle & Total Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-azraq-navy/60">
            {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
          </span>

          <div className="flex items-center bg-white border border-azraq-purple/20 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-azraq-navy text-white' : 'text-gray-400 hover:text-azraq-navy'
              }`}
              title="Editorial Grid Mode"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-colors ${
                viewMode === 'list' ? 'bg-azraq-navy text-white' : 'text-gray-400 hover:text-azraq-navy'
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
          <Search className="w-4 h-4 text-azraq-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search 18 collections (e.g. Gadgets, Bags, Wellness...)", "কালেকশন খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-azraq-purple/25 text-xs text-azraq-navy placeholder-azraq-navy/40 focus:outline-none focus:border-azraq-violet shadow-sm"
          />
        </div>

        {/* Sort Collections */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-full bg-white border border-azraq-purple/25 text-xs font-bold text-azraq-navy focus:outline-none focus:border-azraq-violet shadow-sm cursor-pointer"
          >
            <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
            <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
            <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-azraq-navy/50 absolute right-3 pointer-events-none" />
        </div>

      </div>

      {/* MODE 1: Editorial Visual Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-none bg-white border border-azraq-purple/20 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-[450px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-none bg-azraq-cloud border border-azraq-purple/20 text-azraq-navy text-[10px] font-mono font-bold">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-0.5 rounded-none bg-azraq-lavender text-azraq-violet text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              <div className="relative w-full h-[300px] sm:h-[310px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-3 my-auto overflow-hidden">
                <img
                  src={col.cover_image || col.image_url}
                  alt={col.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="z-10 pt-3 border-t border-gray-100 flex items-end justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-base text-azraq-navy truncate group-hover:text-azraq-violet transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-azraq-navy/60 line-clamp-1 mt-0.5 font-normal">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-azraq-lime text-azraq-navy flex items-center justify-center shadow-glow-lime flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: Compact Category List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-azraq-purple/20 overflow-hidden divide-y divide-gray-100 shadow-sm">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-azraq-cloud/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-azraq-cloud flex items-center justify-center p-2 flex-shrink-0 border border-azraq-purple/15">
                  <img src={col.cover_image || col.image_url} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-azraq-navy truncate group-hover:text-azraq-violet">
                      {col.name}
                    </h3>
                    {col.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-azraq-lavender text-azraq-violet text-[9px] font-bold uppercase">
                        {col.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-azraq-navy/60 truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="px-3 py-1 rounded-full bg-azraq-cloud text-xs font-mono font-bold text-azraq-navy">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("Items", "পণ্য")}
                </span>
                <div className="w-8 h-8 rounded-full bg-azraq-lime text-azraq-navy flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

