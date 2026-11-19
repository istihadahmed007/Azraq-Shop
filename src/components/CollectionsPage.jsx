import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ArrowRight, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Full Collections Directory (Futuristic Glass Edition)
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
    <div className="w-full py-2 min-h-screen select-none space-y-6">

      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#718398]">
        <Link to="/" className="hover:text-[#193B5B] transition-colors">
          {t("Home", "হোম")}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#82AACD]" />
        <span className="text-[#193B5B] font-bold">{t("All Collections", "সকল কালেকশন")}</span>
      </div>

      {/* Page Title & Directory Overview Glass Container */}
      <div className="rounded-[28px] bg-[#F8FBFF]/75 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
              + {t("CURATED DIRECTORY", "পূর্ণাঙ্গ তালিকা")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
              {t("Explore Collections", "সকল কালেকশন")}
            </h1>
            <p className="text-xs sm:text-[13px] text-[#718398] mt-1.5 max-w-xl leading-relaxed">
              {t(
                "Browse all 18 authentic catalog categories with genuine photography and verified prices in BDT.",
                "১৮টি মূল ক্যাটাগরি ও পণ্যের পূর্ণাঙ্গ তালিকা।"
              )}
            </p>
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#193B5B] px-3 py-1 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.3)]">
              {filteredCollections.length} {t("Collections", "ক্যাটাগরি")}
            </span>

            <div className="flex items-center bg-white/80 rounded-full p-1 border border-[rgba(130,170,205,0.3)] shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs' : 'text-[#718398] hover:text-[#193B5B]'
                }`}
                title="Grid Mode"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white shadow-xs' : 'text-[#718398] hover:text-[#193B5B]'
                }`}
                title="List Mode"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Sort Toolbar inside the container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-[rgba(130,170,205,0.18)]">

          {/* Search collections */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-[#718398] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 18 collections (e.g. Gadgets, Kitchen, Lifestyle...)", "কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/80 border border-[rgba(130,170,205,0.28)] text-xs text-[#193B5B] placeholder-[#718398] focus:outline-none focus:border-[#70C8ED] focus:bg-white font-medium transition-colors shadow-inner"
            />
          </div>

          {/* Sort Collections */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full bg-white/80 text-xs font-bold text-[#193B5B] cursor-pointer border border-[rgba(130,170,205,0.3)] focus:border-[#70C8ED] focus:outline-none transition-colors shadow-xs"
            >
              <option value="count">{t("Sort by: Most Products", "সর্বাধিক পণ্য অনুযায়ী")}</option>
              <option value="name">{t("Sort by: Name (A-Z)", "নাম অনুযায়ী (A-Z)")}</option>
              <option value="featured">{t("Sort by: Featured First", "সেরা কালেকশন প্রথমে")}</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#718398] absolute right-3 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* MODE 1: Clean Glass Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigate(`/collection/${col.slug}`)}
                className="group cursor-pointer rounded-[22px] bg-white/75 hover:bg-white/95 backdrop-blur-md p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between border border-[rgba(130,170,205,0.25)] border-t-white/95 shadow-xs hover:border-[#70C8ED]/60 hover:shadow-[0_16px_36px_rgba(112,200,237,0.22)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.25)] text-[#193B5B] text-[10px] font-mono font-bold">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  {col.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-[9px] font-mono uppercase tracking-wider font-bold shadow-2xs">
                      {col.badge || 'Featured'}
                    </span>
                  )}
                </div>

                {/* Collection Thumbnail (Strictly full contain) */}
                <div className="card-image-wrapper relative w-full aspect-[16/10] bg-[#F8FBFF]/80 rounded-[18px] border border-[rgba(130,170,205,0.2)] flex items-center justify-center p-3 mb-3.5 overflow-hidden shadow-inner">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="video"
                    className="group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>

                {/* Info & Description */}
                <div>
                  <h3 className="text-base font-extrabold text-[#193B5B] group-hover:text-[#0877C9] transition-colors leading-snug">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#718398] line-clamp-2 mt-1 leading-relaxed">
                    {col.description_en || col.description || t("Explore verified items in this collection.", "আসল পণ্যতালিকা।")}
                  </p>
                </div>

                {/* Bottom Action strip */}
                <div className="pt-3.5 mt-3 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0877C9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{t("Browse Products", "পণ্য দেখুন")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-mono text-[#718398]">
                    AZRAQ Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Clean List Mode */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-3">
          {filteredCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.product_count ?? col.imported_product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigate(`/collection/${col.slug}`)}
                className="group cursor-pointer rounded-[20px] bg-white/75 hover:bg-white/95 backdrop-blur-md p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[rgba(130,170,205,0.25)] border-t-white/95 shadow-xs hover:border-[#70C8ED]/60 hover:shadow-[0_12px_28px_rgba(112,200,237,0.18)]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="card-image-wrapper w-20 h-20 rounded-[16px] bg-[#F8FBFF] border border-[rgba(130,170,205,0.2)] p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                    <ProductImage
                      src={displayImage}
                      alt={col.name}
                      fit="contain"
                      aspectRatio="square"
                      className="group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.25)] text-[#193B5B] text-[10px] font-mono font-bold">
                        {count} {t("Products", "পণ্য")}
                      </span>
                      {col.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                          {col.badge || 'Featured'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-[#193B5B] group-hover:text-[#0877C9] transition-colors truncate">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#718398] line-clamp-1 mt-0.5">
                      {col.description_en || col.description || t("Explore verified items in this collection.", "আসল পণ্যতালিকা।")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-[#0877C9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{t("Browse Products", "পণ্য দেখুন")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
