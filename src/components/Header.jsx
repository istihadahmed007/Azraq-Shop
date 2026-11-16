import React, { useState } from 'react';
import {
  Search, Heart, GitCompare, ShoppingBag, Headphones,
  Menu, X, ChevronDown, Sparkles, Shield, ArrowRight,
  Globe, Package, Check, Layers, Camera
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function Header() {
  const {
    collections,
    totalCartItems,
    cartSubtotal,
    favorites,
    setIsCartOpen,
    setIsTrackingOpen,
    setIsAdminOpen,
    navigateTo,
    currentView,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    setIsVisualSearchOpen,
    t
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (currentView !== 'home') {
      navigateTo('home');
    }
    setTimeout(() => {
      const el = document.getElementById('all-products') || document.getElementById('shop-by-collection');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, currentView === 'home' ? 0 : 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#101C35] text-white/90 text-[11px] font-medium py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block animate-pulse" />
            <span className="truncate">{t("Free Nationwide Delivery over ৳3,000 • Curated Everyday Goods", "সারা বাংলাদেশে ৩০০০৳ এর অর্ডারে ফ্রি হোম ডেলিভারি • কিউরেটেড এভরিডে গুডস")}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-[#69C5F5]" />
              <span>{t("Track Order", "ট্র্যাক করুন")}</span>
            </button>

            <span className="text-white/20">|</span>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="hover:text-white transition-colors flex items-center gap-1.5 font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-[#50DDF0]" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            <span className="hidden sm:inline text-white/20">|</span>

            {/* Admin Portal Link */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-[#50DDF0] hover:text-white transition-colors font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t("Admin", "অ্যাডমিন")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassy Header Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_4px_20px_0_rgba(16,28,53,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 sm:gap-8">

          {/* 1. Left: Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-left group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg py-0.5"
            aria-label="AZRAQ Shop - Return to homepage"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={true} />
          </button>

          {/* 2. Center: Large Clean Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                placeholder={t("Search curated products, essentials, and collections...", "পণ্য, কালেকশন বা ব্র্যান্ড খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-28 py-2.5 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#101C35] placeholder-[#101C35]/45 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15 shadow-sm transition-all"
              />

              {/* AI Visual Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-12 px-2.5 py-1.5 rounded-full text-[#183B70] hover:text-[#2563EB] hover:bg-[#E2E8F0]/50 transition-all flex items-center gap-1.5 group/cam"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by Image"
              >
                <Camera className="w-4 h-4 transition-transform group-hover/cam:scale-110 text-[#183B70]" />
                <span className="text-[11px] font-bold text-[#183B70] group-hover/cam:text-[#2563EB] hidden lg:inline whitespace-nowrap">
                  {t("Image Search", "ছবি দিয়ে")}
                </span>
              </button>

              <button
                type="submit"
                className="absolute right-1.5 w-9 h-9 rounded-full bg-[#101C35] hover:bg-[#183B70] text-white flex items-center justify-center transition-all shadow-sm group/btn"
                title="Search"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              </button>
            </form>
          </div>

          {/* 3. Right: Quick Actions (Wishlist, Compare, Cart) */}
          <div className="flex items-center gap-3.5 sm:gap-6">

            {/* Wishlist */}
            <button
              onClick={() => {
                const el = document.getElementById('popular-products') || document.getElementById('all-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center text-[#101C35] hover:text-[#2563EB] transition-colors relative group"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-[#2563EB] fill-[#2563EB]' : 'text-[#101C35]/70 group-hover:text-[#2563EB]'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 text-[#101C35]/70 group-hover:text-[#2563EB] hidden sm:block">
                {t("Wishlist", "উইশলিস্ট")}
              </span>
            </button>

            {/* Compare */}
            <button
              onClick={() => setCompareCount(prev => (prev > 0 ? 0 : 2))}
              className="flex flex-col items-center text-[#101C35] hover:text-[#2563EB] transition-colors relative group"
              title="Compare Products"
            >
              <div className="relative">
                <GitCompare className="w-5 h-5 text-[#101C35]/70 group-hover:text-[#2563EB]" />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#50DDF0] text-[#101C35] text-[9px] font-black flex items-center justify-center shadow-sm">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 text-[#101C35]/70 group-hover:text-[#2563EB] hidden sm:block">
                {t("Compare", "তুলনা")}
              </span>
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 pl-2 sm:pl-3 pr-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] hover:border-[#2563EB] shadow-sm hover:shadow transition-all group"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#183B70] group-hover:text-[#2563EB] transition-transform group-hover:scale-110" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#101C35] group-hover:bg-[#2563EB] text-white text-[9px] font-black flex items-center justify-center shadow-sm transition-colors">
                  {totalCartItems}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] font-semibold text-[#101C35]/60 block leading-tight">
                  {t("Cart", "ব্যাগ")}
                </span>
                <span className="text-xs font-black text-[#101C35]">
                  ৳{(cartSubtotal || 0).toLocaleString()}
                </span>
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#101C35] hover:bg-[#F5F7FA] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Secondary Navigation Ribbon */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">

          <div className="flex items-center gap-6">
            {/* Shop by Categories Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="bg-[#101C35] hover:bg-[#183B70] text-white px-4 py-2 rounded-lg flex items-center gap-2.5 font-bold text-xs shadow-sm transition-all"
              >
                <Menu className="w-4 h-4" />
                <span>{t("Shop by Categories", "ক্যাটাগরি ব্রাউজ করুন")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {showCategoryDropdown && (
                <div
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                  className="absolute top-11 left-0 w-72 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-gray-50"
                >
                  <div className="max-h-80 overflow-y-auto no-scrollbar py-1">
                    {collections.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setShowCategoryDropdown(false);
                          navigateTo('collection-detail', c.slug);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-[#101C35] hover:bg-[#F5F7FA] hover:text-[#2563EB] flex items-center justify-between transition-colors group"
                      >
                        <span className="truncate">{c.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono group-hover:text-[#2563EB]">
                          ({c.imported_product_count})
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 bg-[#F5F7FA]">
                    <button
                      onClick={() => {
                        setShowCategoryDropdown(false);
                        navigateTo('collections');
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#101C35] text-white text-xs font-bold hover:bg-[#183B70] transition-colors text-center"
                    >
                      {t("View All 18 Collections", "সকল ১৮টি কালেকশন দেখুন")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Links */}
            <nav className="flex items-center gap-7 text-xs font-bold text-[#101C35]/80">
              <button
                onClick={() => navigateTo('home')}
                className="hover:text-[#2563EB] transition-colors py-1 relative group"
              >
                {t("Shop", "শপ")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('popular-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2563EB] transition-colors py-1 relative group"
              >
                {t("Deals", "ডিলস")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('trending-now') || document.getElementById('all-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2563EB] transition-colors py-1 relative group"
              >
                {t("New Arrivals", "নতুন কালেকশন")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => navigateTo('collections')}
                className="hover:text-[#2563EB] transition-colors py-1 relative group"
              >
                {t("Brands & Collections", "ব্র্যান্ডস")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('featured-collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2563EB] transition-colors py-1 relative group"
              >
                {t("Inspiration", "ইনস্পিরেশন")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
              </button>
            </nav>

          </div>

          {/* Right: Support Contact */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#101C35]/80">
            <Headphones className="w-4 h-4 text-[#183B70]" />
            <span>Support:</span>
            <a href="tel:+8801711223344" className="font-bold text-[#101C35] hover:text-[#2563EB] transition-colors">
              +880 1711-223344
            </a>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-[#E2E8F0] p-5 space-y-4 shadow-xl">
          {/* Mobile Search with Search by Image */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              handleSearchSubmit();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder={t("Search catalog...", "পণ্য খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-20 py-2.5 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-xs text-[#101C35] focus:outline-none focus:border-[#2563EB]"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsVisualSearchOpen(true);
                }}
                className="p-1.5 rounded-full text-[#183B70] hover:bg-[#E2E8F0]/60"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by Image"
              >
                <Camera className="w-4 h-4 text-[#183B70]" />
              </button>
              <button
                type="submit"
                className="p-1.5 rounded-full text-[#101C35] hover:text-[#2563EB]"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-[#101C35]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('home');
              }}
              className="text-left py-2 hover:text-[#2563EB] border-b border-gray-100"
            >
              {t("Home", "হোম")}
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('collections');
              }}
              className="text-left py-2 text-[#2563EB] font-bold border-b border-gray-100"
            >
              {t("Browse All 18 Collections", "সকল ১৮টি কালেকশন")}
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsTrackingOpen(true);
              }}
              className="text-left py-2 hover:text-[#2563EB] border-b border-gray-100"
            >
              {t("Track Order", "অর্ডার ট্র্যাকিং")}
            </button>

            {/* Language Switcher in Mobile Drawer */}
            <div className="py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">{t("Language", "ভাষা")}:</span>
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="px-3 py-1 rounded-full bg-[#F5F7FA] text-[#183B70] border border-[#E2E8F0] text-xs font-bold flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
              </button>
            </div>

            {/* Support Helpline in Mobile Drawer */}
            <div className="py-2 border-b border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Helpline:</span>
              <a href="tel:+8801711223344" className="font-bold text-[#101C35] hover:text-[#2563EB]">
                +880 1711-223344
              </a>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-left py-2 hover:text-[#2563EB] flex items-center justify-between"
            >
              <span>{t("Admin Portal", "অ্যাডমিন পোর্টাল")}</span>
              <Shield className="w-4 h-4 text-[#2563EB]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
