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
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7D93] mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#293B52] font-bold">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Stats */}
      <div className="rounded-[26px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-6 sm:p-8 mb-6 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FA] text-[#0877C9] text-xs font-bold border border-[#D5E2EE] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("CURATED DIRECTORY", "পূর্ণাঙ্গ তালিকা")}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#293B52] tracking-tight">
              {t("Explore Collections", "সকল কালেকশন")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7D93] mt-1.5 max-w-xl leading-relaxed">
              {t(
                "Browse all 18 authentic EasyDrop catalog categories with genuine photography and verified prices in BDT.",
                "১৮টি মূল ক্যাটাগরি ও পণ্যের পূর্ণাঙ্গ তালিকা।"
              )}
            </p>
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#6B7D93]">
              {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
            </span>

            <div className="flex items-center bg-[#EDF4F9] rounded-full p-1 border border-[#D5E2EE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-[#0877C9] text-white shadow-2xs' : 'text-[#6B7D93] hover:text-[#293B52]'
                }`}
                title="Grid Mode"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-[#0877C9] text-white shadow-2xs' : 'text-[#6B7D93] hover:text-[#293B52]'
                }`}
                title="List Mode"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-4 rounded-[22px] bg-[#F7FAFD] border border-[#D5E2EE]/90 shadow-[0_10px_30px_rgba(50,75,100,0.05)]">
        
        {/* Search collections */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-[#6B7D93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search 18 collections (e.g. Gadgets, Bags, Wellness...)", "কালেকশন খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-xs text-[#293B52] placeholder-[#6B7D93] focus:outline-none focus:border-[#0877C9] font-medium"
          />
        </div>

        {/* Sort Collections */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-full bg-[#EDF4F9] text-xs font-bold text-[#293B52] cursor-pointer border border-[#D5E2EE] focus:border-[#0877C9] focus:outline-none"
          >
            <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
            <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
            <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7D93] absolute right-3 pointer-events-none" />
        </div>

      </div>

      {/* MODE 1: Soft Neumorphic Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer rounded-[20px] bg-[#F7FAFD] p-5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-[#D5E2EE]/90 shadow-[0_10px_30px_rgba(50,75,100,0.06)] hover:shadow-[0_14px_35px_rgba(50,75,100,0.12)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between z-10 mb-3.5">
                  <span className="px-3 py-1 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-[#293B52] text-[11px] font-bold shadow-2xs">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  {col.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-[#EE8056] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-white fill-white" />
                      {col.badge || 'Featured'}
                    </span>
                  )}
                </div>

                {/* Collection Thumbnail */}
                <div className="relative w-full aspect-[16/10] bg-[#EDF4F9] rounded-[14px] border border-[#D5E2EE] flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:bg-white transition-colors">
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

                <div className="pt-3 border-t border-[#E2ECF4] flex items-center justify-between z-10">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#293B52] text-sm sm:text-base truncate group-hover:text-[#0877C9] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-[#6B7D93] truncate font-medium mt-0.5">
                      {t(col.description_en, col.description_bn)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] group-hover:bg-[#0877C9] group-hover:text-white group-hover:border-[#0877C9] flex items-center justify-center transition-all flex-shrink-0 text-[#293B52]">
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
              className="rounded-[20px] bg-[#F7FAFD] p-4 flex items-center justify-between gap-4 cursor-pointer border border-[#D5E2EE]/90 shadow-[0_10px_30px_rgba(50,75,100,0.06)] hover:shadow-md hover:border-[#0877C9]/40 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-[14px] bg-[#EDF4F9] p-2 flex-shrink-0 flex items-center justify-center border border-[#D5E2EE]">
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
                  <h3 className="font-bold text-[#293B52] text-sm sm:text-base group-hover:text-[#0877C9] truncate">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#0877C9] bg-[#EBF4FA] px-3 py-1 rounded-full border border-[#D5E2EE]">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("items", "আইটেম")}
                </span>
                <ArrowRight className="w-4 h-4 text-[#6B7D93]" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
