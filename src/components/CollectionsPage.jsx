import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ArrowRight, Sparkles, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Full Collections Browser Page (Editorial Edition)
 */
export default function CollectionsPage() {
  const navigate = useNavigate();
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
      <div className="flex items-center gap-2 text-xs font-semibold text-[#667085] mb-4">
        <Link to="/" className="hover:text-[#245BDB] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#172333] font-bold">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Stats */}
      <div className="rounded-[16px] bg-white border border-[#E5E3DA] p-6 sm:p-8 mb-6 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#FAF9F5] text-[#172333] text-xs font-bold border border-[#E5E3DA] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#245BDB]" />
              <span>{t("CURATED DIRECTORY", "পূর্ণাঙ্গ তালিকা")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172333] tracking-tight">
              {t("Explore Collections", "সকল কালেকশন")}
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1.5 max-w-xl leading-relaxed">
              {t(
                "Browse all 18 authentic EasyDrop catalog categories with genuine photography and verified prices in BDT.",
                "১৮টি মূল ক্যাটাগরি ও পণ্যের পূর্ণাঙ্গ তালিকা।"
              )}
            </p>
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#667085]">
              {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
            </span>

            <div className="flex items-center bg-[#FAF9F5] rounded-[6px] p-1 border border-[#E5E3DA]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[4px] transition-colors ${
                  viewMode === 'grid' ? 'bg-[#172333] text-white shadow-xs' : 'text-[#667085] hover:text-[#172333]'
                }`}
                title="Grid Mode"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[4px] transition-colors ${
                  viewMode === 'list' ? 'bg-[#172333] text-white shadow-xs' : 'text-[#667085] hover:text-[#172333]'
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-4 rounded-[12px] bg-white border border-[#E5E3DA] shadow-[0_2px_12px_rgba(23,35,51,0.03)]">
        
        {/* Search collections */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-[#8C99A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search 18 collections (e.g. Gadgets, Bags, Wellness...)", "কালেকশন খুঁজুন...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] text-xs text-[#172333] placeholder-[#8C99A8] focus:outline-none focus:border-[#245BDB] font-medium"
          />
        </div>

        {/* Sort Collections */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-[6px] bg-[#FAF9F5] text-xs font-bold text-[#172333] cursor-pointer border border-[#E5E3DA] focus:border-[#245BDB] focus:outline-none"
          >
            <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
            <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
            <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#667085] absolute right-3 pointer-events-none" />
        </div>

      </div>

      {/* MODE 1: Clean Editorial Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigate(`/collection/${col.slug}`)}
                className="group cursor-pointer rounded-[14px] bg-white p-5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden border border-[#E5E3DA] shadow-[0_2px_12px_rgba(23,35,51,0.04)] hover:shadow-[0_8px_24px_rgba(23,35,51,0.08)] hover:border-[#245BDB]/50 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between z-10 mb-3.5">
                  <span className="px-2.5 py-0.5 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DA] text-[#172333] text-[11px] font-bold">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  {col.featured && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#D7ED78] text-[#172333] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 text-[#172333] fill-[#172333]" />
                      {col.badge || 'Featured'}
                    </span>
                  )}
                </div>

                {/* Collection Thumbnail */}
                <div className="relative w-full aspect-[16/10] bg-[#FAF9F5] rounded-[8px] border border-[#E5E3DA] flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:bg-white transition-colors">
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
                    className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="pt-3 border-t border-[#E5E3DA] flex items-center justify-between z-10">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#172333] text-sm sm:text-base truncate group-hover:text-[#245BDB] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-[#667085] truncate font-medium mt-0.5">
                      {t(col.description_en, col.description_bn)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] group-hover:bg-[#245BDB] group-hover:text-white group-hover:border-[#245BDB] flex items-center justify-center transition-all flex-shrink-0 text-[#172333]">
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
              onClick={() => navigate(`/collection/${col.slug}`)}
              className="rounded-[12px] bg-white p-4 flex items-center justify-between gap-4 cursor-pointer border border-[#E5E3DA] shadow-xs hover:shadow-md hover:border-[#245BDB]/50 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-[8px] bg-[#FAF9F5] p-2 flex-shrink-0 flex items-center justify-center border border-[#E5E3DA]">
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
                  <h3 className="font-bold text-[#172333] text-sm sm:text-base group-hover:text-[#245BDB] truncate">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#667085] truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#245BDB] bg-[#FAF9F5] px-2.5 py-1 rounded-[4px] border border-[#E5E3DA]">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("items", "আইটেম")}
                </span>
                <ArrowRight className="w-4 h-4 text-[#667085]" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
