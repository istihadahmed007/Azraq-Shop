import React from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronRight
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Architectural Retail Header
 * 
 * Inspired by independent lifestyle retail storefronts:
 * 1. Clean architectural lines with crisp hairline border (#E5E3DA).
 * 2. Top utility bar: Delivery rates transparency (৳80 Dhaka / ৳150 Outside), support hotline, order tracking, and language toggle.
 * 3. Main bar: Category menu trigger, correctly proportioned AzraqLogo, calm search input with AI visual search, wishlist counter, and cart bag.
 * 4. Mobile search bar: Always accessible on mobile without being obscured.
 * 5. Department navigation strip: Restrained typography with subtle active indicator.
 */
export default function Header({ onToggleSidebar }) {
  const {
    totalCartItems,
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
    setActiveCategory,
    activeCategory,
    t
  } = useShop();

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (currentView !== 'home') {
      navigateTo('home');
    }
    setTimeout(() => {
      const el = document.getElementById('all-products') || document.getElementById('popular-products');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, currentView === 'home' ? 0 : 100);
  };

  const navCategories = [
    { label: t("All Products", "সকল পণ্য"), cat: 'All' },
    { label: t("Gadgets & Audio", "গ্যাজেটস ও অডিও"), cat: 'Gadgets & IT Accessories' },
    { label: t("Men's Wardrobe", "মেনস ফ্যাশন"), cat: 'Men Clothing' },
    { label: t("Kitchen & Dining", "কিচেন ও ডাইনিং"), cat: 'Kitchen Appliances' },
    { label: t("Sports & Kids", "স্পোর্টস ও কিডস"), cat: 'Sports & Kids' },
    { label: t("Health & Beauty", "হেলথ ও বিউটি"), cat: 'Health & Beauty' },
    { label: t("Living & Lifestyle", "হোম ও লিভিং"), cat: 'Home & Lifestyle' },
  ];

  return (
    <header className="w-full bg-white border border-[#E5E3DA] rounded-[6px] shadow-[0_1px_4px_rgba(23,35,51,0.03)] select-none sticky top-2 z-40 transition-all">

      {/* 1. TOP UTILITY MICRO BAR (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center justify-between px-5 sm:px-6 py-2 border-b border-[#E5E3DA] text-[11px] text-[#667085] bg-[#FAF9F5] rounded-t-[6px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="font-medium text-[#172333] tracking-tight">
              {t("Delivery: ৳80 Dhaka • ৳150 Outside • Free on orders over ৳3,000", "ডেলিভারি: ঢাকা ৮০৳ • বাইরে ১৫০৳ • ৩০০০৳ অর্ডারে ফ্রি ডেলিভারি")}
            </span>
          </span>
          <span className="text-[#E5E3DA]">/</span>
          <a
            href="https://wa.me/8801851172032"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#172333] flex items-center gap-1.5 transition-colors font-medium"
          >
            <Headphones className="w-3 h-3 text-[#245BDB]" />
            <span>+880 1851-172032</span>
          </a>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Order Tracking */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-[#172333] flex items-center gap-1 transition-colors font-semibold"
          >
            <Package className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          <span className="text-[#E5E3DA]">/</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hover:text-[#172333] flex items-center gap-1 transition-colors font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <span className="text-[#E5E3DA]">/</span>

          {/* Admin Operations Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#172333] flex items-center gap-1 transition-colors font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{t("Admin", "অ্যাডমিন")}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">

        {/* Left: Menu Drawer Toggle + AZRAQ Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-[4px] border border-[#E5E3DA] bg-[#FAF9F5] hover:bg-white flex items-center justify-center text-[#172333] hover:border-[#172333] transition-all focus:outline-none"
            title={t("Browse All Categories", "সকল ক্যাটাগরি")}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={false} />
          </div>
        </div>

        {/* Center: Wide Search Box with Embedded Image-Search Control (Desktop & Tablet) */}
        <div className="hidden sm:block flex-1 min-w-0 max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center bg-[#FAF9F5] border border-[#E5E3DA] rounded-[4px] focus-within:border-[#172333] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#172333] transition-all">
              <Search className="w-4 h-4 text-[#8C99A8] ml-3 shrink-0 pointer-events-none" />
              <input
                type="text"
                placeholder={t("Search across 1,200+ curated products, brands, categories...", "১২০০+ আসল পণ্য ও কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2.5 pr-20 py-2 text-xs sm:text-[13px] text-[#172333] placeholder-[#8C99A8] bg-transparent focus:outline-none"
              />

              {/* AI Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-9 p-1 rounded-[3px] text-[#667085] hover:text-[#245BDB] hover:bg-white transition-colors"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-7 h-7 mr-1 bg-[#172333] hover:bg-[#245BDB] text-white rounded-[3px] flex items-center justify-center transition-colors shrink-0"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Wishlist & Shopping Cart Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="h-9 px-3 rounded-[4px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] text-[#172333] flex items-center justify-center gap-1.5 transition-all relative focus:outline-none"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-[#E53935] text-[#E53935]' : 'text-[#667085]'}`} />
            <span className="hidden md:inline text-xs font-semibold">{t("Saved", "পছন্দ")}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#172333] text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-9 px-3.5 rounded-[4px] bg-[#172333] hover:bg-[#245BDB] text-white shadow-xs flex items-center justify-center gap-2 transition-colors relative focus:outline-none active:scale-98"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{t("Bag", "ব্যাগ")}</span>
            <span className="min-w-4 h-4 px-1 rounded-full bg-[#245BDB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
              {totalCartItems > 99 ? '99+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* 2b. MOBILE SEARCH BAR ROW (Always visible and usable on small viewports) */}
      <div className="sm:hidden px-4 pb-3 pt-0.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full flex items-center bg-[#FAF9F5] border border-[#E5E3DA] rounded-[4px] focus-within:border-[#172333] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-[#8C99A8] ml-2.5 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 1,200+ products...", "পণ্য বা কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-16 py-1.5 text-xs text-[#172333] placeholder-[#8C99A8] bg-transparent focus:outline-none"
            />

            {/* AI Visual Image Search Button */}
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-7 p-1 text-[#667085] hover:text-[#245BDB]"
              title={t("Search by Image", "ছবি দিয়ে খুঁজুন")}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-6 h-6 mr-1 bg-[#172333] text-white rounded-[2px] flex items-center justify-center shrink-0"
              title={t("Search", "অনুসন্ধান")}
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. CATEGORY NAVIGATION STRIP */}
      <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-t border-[#E5E3DA] bg-[#FAF9F5] rounded-b-[6px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#172333] hover:text-[#245BDB] flex items-center gap-1 px-2.5 py-1 rounded-[3px] bg-white border border-[#E5E3DA] hover:border-[#172333] whitespace-nowrap shadow-xs transition-colors shrink-0"
        >
          <span>{t("All 18 Collections", "১৮টি কালেকশন")}</span>
          <ChevronRight className="w-3 h-3 text-[#667085]" />
        </button>

        <span className="text-[#E5E3DA] mx-1 shrink-0">|</span>

        {navCategories.map((item, idx) => {
          const isSelected = (item.cat === 'All' && activeCategory === 'All') || activeCategory === item.cat;
          return (
            <button
              key={idx}
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                setActiveCategory(item.cat);
                setTimeout(() => {
                  document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-xs font-medium px-2.5 py-1 rounded-[3px] whitespace-nowrap transition-all border shrink-0 ${isSelected
                ? 'bg-[#172333] text-white border-[#172333] font-semibold'
                : 'bg-transparent hover:bg-white text-[#556170] hover:text-[#172333] border-transparent hover:border-[#E5E3DA]'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

    </header>
  );
}
