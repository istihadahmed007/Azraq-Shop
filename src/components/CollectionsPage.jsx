import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ArrowRight, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Full Collections Directory (Editorial Edition)
 */
export default function CollectionsPage() {
  const navigate = useNavigate();
  const { collections, t } = useShop();

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
    <div className="w-full py-2 min-h-screen select-none space-y-5">

      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
        <Link to="/" className="hover:text-[#172333] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#8CA0B6]" />
        <span className="text-[#172333] font-semibold">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Directory Overview */}
      <div className="rounded-[6px] bg-white border border-[#E5E3DA] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,35,51,0.03)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold mb-1">
              {t("CURATED DIRECTORY", "পূর্ণাঙ্গ তালিকা")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172333] tracking-tight">
              {t("Explore Collections", "সকল কালেকশন")}
            </h1>
            <p className="text-xs sm:text-[13px] text-[#556170] mt-1.5 max-w-xl leading-relaxed">
              {t(
                "Browse all 18 authentic catalog categories with genuine photography and verified prices in BDT.",
                "১৮টি মূল ক্যাটাগরি ও পণ্যের পূর্ণাঙ্গ তালিকা।"
              )}
            </p>
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-[#667085]">
              {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
            </span>

            <div className="flex items-center bg-[#FAF9F5] rounded-[3px] p-0.5 border border-[#E5E3DA]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[2px] transition-colors ${
                  viewMode === 'grid' ? 'bg-[#172333] text-white shadow-xs' : 'text-[#667085] hover:text-[#172333]'
                }`}
                title="Grid Mode"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[2px] transition-colors ${
                  viewMode === 'list' ? 'bg-[#172333] text-white shadow-xs' : 'text-[#667085] hover:text-[#172333]'
                }`}
                title="List Mode"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Sort Toolbar inside the container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-[#E5E3DA]">
          
          {/* Search collections */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-[#8C99A8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 18 collections (e.g. Gadgets, Kitchen, Lifestyle...)", "কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-[3px] bg-[#FAF9F5] border border-[#E5E3DA] text-xs text-[#172333] placeholder-[#8C99A8] focus:outline-none focus:border-[#172333] focus:bg-white font-medium transition-colors"
            />
          </div>

          {/* Sort Collections */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-[3px] bg-[#FAF9F5] text-xs font-semibold text-[#172333] cursor-pointer border border-[#E5E3DA] focus:border-[#172333] focus:outline-none transition-colors"
            >
              <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
              <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
              <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#667085] absolute right-2.5 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* MODE 1: Clean Architectural Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigate(`/collection/${col.slug}`)}
                className="group cursor-pointer rounded-[4px] bg-white p-4 sm:p-5 transition-all duration-150 flex flex-col justify-between border border-[#E5E3DA] shadow-[0_1px_2px_rgba(23,35,51,0.02)] hover:border-[#172333] hover:shadow-[0_4px_16px_rgba(23,35,51,0.06)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#FAF9F5] border border-[#E5E3DA] text-[#172333] text-[10px] font-mono font-semibold">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  {col.featured && (
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-[#172333] text-white text-[9px] font-mono uppercase tracking-wider font-semibold">
                      {col.badge || 'Featured'}
                    </span>
                  )}
                </div>

                {/* Collection Thumbnail */}
                <div className="relative w-full aspect-[16/10] bg-[#FAF9F5] rounded-[3px] border border-[#E5E3DA] flex items-center justify-center p-3 mb-3.5 overflow-hidden group-hover:bg-white transition-colors">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-104 transition-transform duration-300"
                  />
                </div>

                <div className="pt-3 border-t border-[#E5E3DA] flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#172333] text-sm group-hover:text-[#245BDB] transition-colors truncate">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-[#667085] truncate mt-0.5">
                      {t(col.description_en, col.description_bn)}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-[3px] bg-[#FAF9F5] border border-[#E5E3DA] group-hover:bg-[#172333] group-hover:text-white group-hover:border-[#172333] flex items-center justify-center transition-colors flex-shrink-0 text-[#172333] ml-2">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Compact List Mode */}
      {viewMode === 'list' && (
        <div className="space-y-2.5">
          {filteredCollections.map(col => (
            <div
              key={col.id}
              onClick={() => navigate(`/collection/${col.slug}`)}
              className="rounded-[4px] bg-white p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer border border-[#E5E3DA] hover:border-[#172333] transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-[3px] bg-[#FAF9F5] p-1.5 flex-shrink-0 flex items-center justify-center border border-[#E5E3DA]">
                  <ProductImage
                    src={col.cover_image || col.image_url || col.fallback_image}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#172333] text-sm group-hover:text-[#245BDB] truncate">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#667085] truncate mt-0.5">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-semibold text-[#172333] bg-[#FAF9F5] px-2 py-0.5 rounded-[2px] border border-[#E5E3DA]">
                  {col.product_count ?? col.imported_product_count ?? 0} {t("items", "আইটেম")}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
