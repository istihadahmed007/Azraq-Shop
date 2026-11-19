import React from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronDown
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Modern Editorial Header (The Everyday Edit)
 * 
 * 1. Warm Ivory & White editorial surface with subtle neutral border (#E5E3DA).
 * 2. Top micro-bar: Nationwide delivery rates (৳80 Dhaka / ৳150 Outside), support hotline, order tracking, language toggle, and admin portal.
 * 3. Main bar: Menu toggle, AzraqLogo, wide search bar with integrated AI visual search, wishlist button with count, and cart bag with live counter in AZRAQ Blue.
 * 4. Department strip: Crisp clean category tabs with 8px radius.
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
    { label: t("Gadgets & IT", "গ্যাজেটস"), cat: 'Gadgets & IT Accessories' },
    { label: t("Men's Fashion", "মেনস ফ্যাশন"), cat: 'Men Clothing' },
    { label: t("Kitchen", "কিচেন"), cat: 'Kitchen Appliances' },
    { label: t("Sports & Kids", "স্পোর্টস ও কিডস"), cat: 'Sports & Kids' },
    { label: t("Health & Beauty", "হেলথ ও বিউটি"), cat: 'Health & Beauty' },
    { label: t("Home & Living", "হোম ও লিভিং"), cat: 'Home & Lifestyle' },
  ];

  return (
    <header className="w-full bg-white border border-[#E5E3DA] rounded-[14px] shadow-[0_4px_20px_rgba(23,35,51,0.04)] select-none sticky top-2 z-40 transition-all">

      {/* 1. TOP UTILITY MICRO BAR (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center justify-between px-5 sm:px-6 py-2 border-b border-[#E5E3DA] text-[11px] text-[#667085] bg-[#FAF9F5] rounded-t-[14px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
            <span className="font-medium text-[#172333]">{t("Delivery: ৳80 Inside Dhaka / ৳150 Outside", "ডেলিভারি চার্জ: ঢাকা ৮০৳ / বাইরে ১৫০৳")}</span>
          </span>
          <span className="text-[#E5E3DA]">|</span>
          <button
            onClick={() => window.open('https://wa.me/8801851172032', '_blank')}
            className="hover:text-[#245BDB] flex items-center gap-1 transition-colors font-medium"
          >
            <Headphones className="w-3 h-3 text-[#245BDB]" />
            <span>+880 1851-172032</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Order Tracking */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-[#245BDB] flex items-center gap-1 transition-colors font-semibold"
          >
            <Package className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          <span className="text-[#E5E3DA]">|</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hover:text-[#245BDB] flex items-center gap-1 transition-colors font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <span className="text-[#E5E3DA]">|</span>

          {/* Admin Operations Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#245BDB] flex items-center gap-1 transition-colors font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-[#245BDB]" />
            <span>{t("Admin Portal", "অ্যাডমিন")}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">

        {/* Left: Menu Drawer Toggle + AZRAQ Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-[8px] border border-[#E5E3DA] bg-[#FAF9F5] hover:bg-white flex items-center justify-center text-[#172333] hover:text-[#245BDB] hover:border-[#245BDB] transition-all focus:outline-none"
            title={t("All Categories", "সকল ক্যাটাগরি")}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={false} />
          </div>
        </div>

        {/* Center: Wide Search Box with Embedded Image-Search Control */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center bg-[#FAF9F5] border border-[#E5E3DA] rounded-[8px] overflow-hidden focus-within:border-[#245BDB] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#245BDB]/15 transition-all">
              <input
                type="text"
                placeholder={t("Search products, collections, brands...", "পণ্য বা কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-[#172333] placeholder-[#8C99A8] bg-transparent focus:outline-none"
              />

              {/* AI Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-10 sm:right-12 p-1.5 rounded-[6px] text-[#667085] hover:text-[#245BDB] hover:bg-white transition-colors"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-8 h-8 mr-1 bg-[#245BDB] hover:bg-[#1C4BB8] text-white rounded-[6px] flex items-center justify-center transition-all shadow-xs shrink-0 active:scale-95"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Wishlist & Shopping Cart Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="h-10 px-3 rounded-[8px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#245BDB] text-[#172333] hover:text-[#245BDB] flex items-center justify-center gap-1.5 transition-all relative focus:outline-none"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
            <span className="hidden md:inline text-xs font-semibold">{t("Wishlist", "পছন্দ")}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#172333] text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-10 px-3.5 sm:px-4 rounded-[8px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white shadow-xs flex items-center justify-center gap-2 transition-all relative focus:outline-none active:scale-95"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{t("Bag", "ব্যাগ")}</span>
            <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-white text-[#245BDB] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
              {totalCartItems > 9 ? '9+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* 3. CATEGORY NAVIGATION STRIP */}
      <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 border-t border-[#E5E3DA] bg-[#FAF9F5] rounded-b-[14px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#245BDB] hover:text-[#1C4BB8] flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-white border border-[#E5E3DA] hover:border-[#245BDB] whitespace-nowrap shadow-xs transition-all"
        >
          <span>{t("All 18 Collections", "১৮টি কালেকশন")}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <span className="text-[#E5E3DA] mx-1">|</span>

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
              className={`text-xs font-semibold px-3 py-1.5 rounded-[6px] whitespace-nowrap transition-all border ${isSelected
                ? 'bg-[#172333] text-white border-[#172333]'
                : 'bg-transparent hover:bg-white text-[#172333] hover:text-[#245BDB] border-transparent hover:border-[#E5E3DA]'
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
