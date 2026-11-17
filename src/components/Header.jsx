import React, { useState } from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, X, Package, Shield, Globe, Camera
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Floating Transparent Glass Header
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
    <header className="w-full select-none sticky top-3 sm:top-5 z-30">
      <div className="w-full glass-header rounded-[22px] sm:rounded-[24px] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 transition-all">
        
        {/* Left: Mobile Sidebar Toggle + Mobile Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] sm:rounded-2xl glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] transition-colors"
            title="Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          <div 
            onClick={() => navigateTo('home')}
            className="xl:hidden cursor-pointer shrink-0"
          >
            <AzraqLogo variant="dark" size="xs" showDescriptor={false} />
          </div>
        </div>

        {/* Center: Recessed Frosted Glass Search Bar */}
        <div className="flex-1 max-w-2xl relative min-w-0">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <input
              type="text"
              placeholder={t("Search products, collections...", "পণ্য, কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 sm:pl-5 pr-18 sm:pr-24 py-2 sm:py-2.5 rounded-full glass-input text-xs sm:text-sm text-[#101C35] placeholder-[#71849B] transition-all font-medium"
            />

            {/* AI Visual Image Search Button */}
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-9 sm:right-11 p-1 text-[#71849B] hover:text-[#0877C9] transition-colors rounded-full"
              title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
            >
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Submit Magnifier Button */}
            <button
              type="submit"
              className="absolute right-1 w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#076bb5] hover:to-[#1d4ed8] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(8,119,201,0.3)] transition-all group/btn"
              title="Search"
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:scale-110" />
            </button>
          </form>
        </div>

        {/* Right: Frosted Utility Pill Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Track Order Pill (Desktop) */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-button text-xs font-bold text-[#101C35] hover:text-[#0877C9] group"
            title={t("Track Order", "অর্ডার ট্র্যাক")}
          >
            <Package className="w-3.5 h-3.5 text-[#0877C9] transition-transform group-hover:scale-110" />
            <span>{t("Track Order", "ট্র্যাক")}</span>
          </button>

          {/* Help / Support Pill (Desktop) */}
          <button
            onClick={() => {
              window.open('https://wa.me/8801711223344', '_blank');
            }}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-button text-xs font-bold text-[#101C35] hover:text-[#0877C9] group"
            title={t("Customer Support", "সহায়তা")}
          >
            <Headphones className="w-3.5 h-3.5 text-[#0877C9] transition-transform group-hover:scale-110" />
            <span>{t("Help", "হেল্প")}</span>
          </button>

          {/* Language Toggle (Desktop & Tablet) */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full glass-button text-xs font-bold text-[#101C35] hover:text-[#0877C9]"
            title={t("Switch Language", "ভাষা পরিবর্তন")}
          >
            <Globe className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Account / Admin Portal */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-button items-center justify-center text-[#101C35] hover:text-[#0877C9]"
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] relative"
            title={t("Wishlist", "পছন্দের তালিকা")}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorites.length > 0 ? 'fill-[#0877C9] text-[#0877C9]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0877C9] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#076bb5] hover:to-[#1d4ed8] text-white shadow-[0_4px_16px_rgba(8,119,201,0.35)] flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all"
            title={t("Cart", "শপিং ব্যাগ")}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#101C35] border border-white text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-xs">
              {totalCartItems > 9 ? '9+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
