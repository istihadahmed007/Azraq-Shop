import React, { useState } from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, X, Package, Shield, Globe, Camera
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function Header({ onToggleSidebar }) {
  const {
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

  return (
    <header className="w-full select-none">
      <div className="w-full flex items-center justify-between gap-3 sm:gap-6 py-2">
        
        {/* Left: Mobile Sidebar Toggle + Mobile Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="xl:hidden w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-lg border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.06)] flex items-center justify-center text-[#101C35] hover:text-[#0877C9] transition-colors"
            title="Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => navigateTo('home')}
            className="xl:hidden cursor-pointer"
          >
            <AzraqLogo variant="dark" size="sm" showDescriptor={false} />
          </div>
        </div>

        {/* Center/Left: Large Recessed Frosted Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <input
              type="text"
              placeholder={t("Search products, collections and everyday essentials...", "পণ্য, কালেকশন বা ব্র্যান্ড খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-24 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-[inset_2px_2px_6px_rgba(203,215,228,0.5),inset_-2px_-2px_6px_#FFFFFF] text-xs sm:text-sm text-[#101C35] placeholder-[#71849B] focus:outline-none focus:ring-2 focus:ring-[#0877C9]/30 transition-all font-medium"
            />

            {/* AI Visual Image Search Button */}
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-12 p-1.5 text-[#71849B] hover:text-[#0877C9] transition-colors rounded-full"
              title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Submit Magnifier Button */}
            <button
              type="submit"
              className="absolute right-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#0966ab] hover:to-[#1d4ed8] text-white flex items-center justify-center shadow-[0_3px_10px_rgba(37,99,235,0.3)] transition-all group/btn"
              title="Search"
            >
              <Search className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            </button>
          </form>
        </div>

        {/* Right: Frosted Utility Pill Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Track Order Pill */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] text-xs font-bold text-[#101C35] hover:text-[#0877C9] hover:bg-white transition-all group"
            title={t("Track Order", "অর্ডার ট্র্যাক")}
          >
            <Package className="w-4 h-4 text-[#0877C9] transition-transform group-hover:scale-110" />
            <span>{t("Track Order", "ট্র্যাক")}</span>
          </button>

          {/* Help / Support Pill */}
          <button
            onClick={() => {
              window.open('https://wa.me/8801711223344', '_blank');
            }}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] text-xs font-bold text-[#101C35] hover:text-[#0877C9] hover:bg-white transition-all group"
            title={t("Customer Support", "সহায়তা")}
          >
            <Headphones className="w-4 h-4 text-[#0877C9] transition-transform group-hover:scale-110" />
            <span>{t("Help", "হেল্প")}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] text-xs font-bold text-[#101C35] hover:text-[#0877C9] transition-all"
            title={t("Switch Language", "ভাষা পরিবর্তন")}
          >
            <Globe className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Account / Admin Portal */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] flex items-center justify-center text-[#101C35] hover:text-[#0877C9] transition-all"
            title={t("Admin / Account", "অ্যাডমিন পোর্টাল")}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] flex items-center justify-center text-[#101C35] hover:text-[#F27A3F] relative transition-all"
            title={t("Wishlist", "পছন্দের তালিকা")}
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#F27A3F] text-[#F27A3F]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F27A3F] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all"
            title={t("Cart", "শপিং ব্যাগ")}
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#101C35] border border-white text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              {totalCartItems > 9 ? '9+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
