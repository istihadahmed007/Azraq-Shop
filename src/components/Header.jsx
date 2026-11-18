import React from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronDown
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Professional Retail E-Commerce Header
 * Shopee-inspired high-utility header with top utility bar, prominent search, and category strip.
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
    <header className="w-full bg-white border border-gray-200 rounded-[4px] shadow-xs select-none sticky top-1 z-30">
      
      {/* 1. TOP UTILITY MICRO BAR (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 border-b border-gray-100 text-[11px] text-[#757575] bg-[#FAFAFA]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{t("Nationwide Delivery: ৳70 Dhaka / ৳130 Outside", "সারাদেশে দ্রুত ডেলিভারি: ঢাকা ৭০৳ / বাইরে ১৩০৳")}</span>
          </span>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => window.open('https://wa.me/8801711223344', '_blank')}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors"
          >
            <Headphones className="w-3 h-3 text-[#0877C9]" />
            <span>+880 1711-223344</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Order Tracking */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-medium"
          >
            <Package className="w-3 h-3 text-[#0877C9]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          <span className="text-gray-300">|</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-medium"
          >
            <Globe className="w-3 h-3 text-[#0877C9]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <span className="text-gray-300">|</span>

          {/* Admin Operations Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-medium"
          >
            <Shield className="w-3 h-3 text-[#0877C9]" />
            <span>{t("Admin Portal", "অ্যাডমিন")}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">

        {/* Left: Menu Drawer Toggle + AZRAQ Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-[3px] border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-[#212121] hover:text-[#0877C9] transition-colors"
            title={t("All Categories", "সকল ক্যাটাগরি")}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <AzraqLogo variant="dark" size="sm" showDescriptor={false} />
          </div>
        </div>

        {/* Center: Large High-Visibility Search Box (Shopee Style) */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center border-2 border-[#0877C9] rounded-[3px] overflow-hidden bg-white shadow-2xs">
              <input
                type="text"
                placeholder={t("Search products, collections, brands...", "পণ্য বা কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-20 py-1.5 sm:py-2 text-xs sm:text-sm text-[#212121] placeholder-gray-400 focus:outline-none"
              />

              {/* AI Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-12 sm:right-14 p-1 text-gray-400 hover:text-[#0877C9] transition-colors"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Shopee-style Solid Search Button */}
              <button
                type="submit"
                className="w-10 sm:w-12 h-full bg-[#0877C9] hover:bg-[#0665AC] text-white flex items-center justify-center transition-colors shrink-0"
                title={t("Search", "অনুসন্ধান")}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Wishlist & Shopping Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Wishlist Button (Tablet & Desktop) */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[#757575] hover:text-[#0877C9] hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors relative"
            title={t("Wishlist", "পছন্দের তালিকা")}
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#0877C9] text-[#0877C9]' : ''}`} />
            <span className="text-xs font-semibold hidden md:inline">{t("Wishlist", "পছন্দ")}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0877C9] text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[3px] bg-[#0877C9] hover:bg-[#0665AC] text-white shadow-2xs transition-colors shrink-0"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
          >
            <div className="relative flex items-center">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#EE4D2D] border border-white text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-xs">
                {totalCartItems > 9 ? '9+' : totalCartItems}
              </span>
            </div>
            <span className="text-xs font-bold hidden sm:inline">{t("Cart", "ব্যাগ")}</span>
          </button>

        </div>

      </div>

      {/* 3. CATEGORY NAVIGATION STRIP (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-1 px-4 py-1.5 border-t border-gray-100 bg-white overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1 px-2.5 py-1 rounded-[3px] hover:bg-blue-50/60 whitespace-nowrap transition-colors"
        >
          <span>{t("All 18 Collections", "১৮টি কালেকশন")}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <span className="text-gray-300 mx-1">|</span>

        {navCategories.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setActiveCategory(item.cat);
              setTimeout(() => {
                document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-xs font-medium text-[#4B5563] hover:text-[#0877C9] hover:bg-gray-50 px-2.5 py-1 rounded-[3px] whitespace-nowrap transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

    </header>
  );
}
