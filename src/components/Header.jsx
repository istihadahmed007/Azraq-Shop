import React, { useState } from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronDown,
  User, LogOut
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

/**
 * AZRAQ Shop — Premium Two-Row Light-Blue Glassmorphic Header
 * Exactly matches the reference design layout:
 * 
 * Top Row:
 * - AZRAQ logo on the far left.
 * - Large horizontal search bar in the center (with image search & search icon).
 * - Track Order and Help buttons.
 * - Account, Wishlist and Shopping Cart circular glass buttons with small blue quantity badge.
 * - Language and Admin access neatly available without overcrowding.
 * 
 * Second Row:
 * - "All Categories" button with dropdown icon (opens category drawer).
 * - Nav links: Home (active), Categories, Collections, Best Deals, New Arrivals, About Us, Contact.
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

  const { user, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (currentView !== 'home') {
      navigateTo('home');
    }
    setTimeout(() => {
      const el = document.getElementById('popular-products') || document.getElementById('all-products');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, currentView === 'home' ? 0 : 100);
  };

  const handleNavClick = (target) => {
    if (target === 'home') {
      if (currentView !== 'home') navigateTo('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'categories') {
      if (currentView !== 'home') {
        navigateTo('home');
        setTimeout(() => {
          document.getElementById('shop-by-category')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById('shop-by-category')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === 'collections') {
      navigateTo('collections');
    } else if (target === 'deals') {
      if (currentView !== 'home') navigateTo('home');
      setTimeout(() => {
        document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
      }, currentView === 'home' ? 0 : 120);
    } else if (target === 'arrivals') {
      if (currentView !== 'home') navigateTo('home');
      setActiveCategory('All');
      setTimeout(() => {
        document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
      }, currentView === 'home' ? 0 : 120);
    } else if (target === 'about') {
      if (currentView !== 'home') navigateTo('home');
      setTimeout(() => {
        document.getElementById('brand-value-ribbon')?.scrollIntoView({ behavior: 'smooth' });
      }, currentView === 'home' ? 0 : 120);
    } else if (target === 'contact') {
      window.open('https://wa.me/8801851172032', '_blank');
    }
  };

  return (
    <header className="w-full bg-white/75 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[24px] shadow-[0_12px_36px_-8px_rgba(112,200,237,0.12),0_2px_8px_-1px_rgba(25,59,91,0.03)] select-none sticky top-2.5 z-40 transition-all">

      {/* 1. TOP ROW: Brand, Large Search Bar & Utility Controls */}
      <div className="px-4 sm:px-6 lg:px-8 pt-3.5 pb-2.5 flex items-center justify-between gap-3 sm:gap-6">

        {/* Far Left: AZRAQ Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer shrink-0 flex items-center transition-transform hover:scale-[1.01]"
        >
          <AzraqLogo variant="dark" size="sm" showDescriptor={false} />
        </div>

        {/* Center: Large Horizontal Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:block flex-1 min-w-0 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center bg-white/85 border border-[rgba(130,170,205,0.3)] rounded-full focus-within:border-[#0877C9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#70C8ED]/20 transition-all shadow-inner">
              <input
                type="text"
                placeholder={t("Search for electronics, mobile accessories, lifestyle...", "১২০০+ আসল পণ্য, ব্র্যান্ড ও কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-20 py-2.5 text-xs sm:text-[13px] text-[#193B5B] placeholder-[#718398] bg-transparent focus:outline-none font-medium"
              />

              {/* AI Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-10 p-1.5 rounded-full text-[#718398] hover:text-[#0877C9] hover:bg-[#DDEEFF]/40 transition-colors cursor-pointer"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-8 h-8 mr-1.5 bg-gradient-to-r from-[#0877C9] to-[#3B82F6] hover:from-[#0665AC] hover:to-[#2563EB] text-white rounded-full flex items-center justify-center transition-all shrink-0 shadow-[0_2px_8px_rgba(8,119,201,0.35)] cursor-pointer"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Track Order, Help, Account, Wishlist & Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Track Order Pill Button */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          {/* Help / WhatsApp Hotline Button */}
          <a
            href="https://wa.me/8801851172032"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] shadow-2xs hover:shadow-xs transition-all"
            title="Customer Help WhatsApp"
          >
            <Headphones className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Help", "হেল্প")}</span>
          </a>

          {/* Language Toggle Micro-Pill */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(130,170,205,0.25)] text-[11px] font-bold text-[#193B5B] hover:text-[#0877C9] shadow-2xs transition-all cursor-pointer"
            title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <Globe className="w-3 h-3 text-[#0877C9]" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Admin Access Micro-Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-[rgba(130,170,205,0.25)] text-[#718398] hover:text-[#0877C9] shadow-2xs transition-all cursor-pointer"
            title={t("Admin Operations", "অ্যাডমিন পোর্টাল")}
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Customer Profile / Sign In Circular Glass Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#193B5B] shadow-2xs transition-all cursor-pointer overflow-hidden"
                title={user.name}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#0877C9]" />
                )}
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] shadow-[0_16px_40px_rgba(25,59,91,0.12)] p-2 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-3 border-b border-[rgba(130,170,205,0.15)] mb-1">
                    <p className="text-xs font-bold text-[#193B5B] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#718398] truncate">{user.email || user.phone}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsTrackingOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#193B5B] hover:bg-[#DDEEFF]/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#0877C9]" />
                    <span>{t("Track My Orders", "আমার অর্ডারসমূহ")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#193B5B] hover:bg-[#DDEEFF]/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#0877C9]" />
                    <span>{t("Admin Operations", "অ্যাডমিন পোর্টাল")}</span>
                  </button>

                  <div className="border-t border-[rgba(130,170,205,0.15)] my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t("Sign Out", "লগআউট")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-[#0877C9] flex items-center justify-center transition-all shadow-2xs cursor-pointer focus:outline-none"
              title={t("Customer Sign In", "গ্রাহক লগইন")}
              aria-label="Customer Sign In"
            >
              <User className="w-4 h-4 text-[#718398] hover:text-[#0877C9]" />
            </button>
          )}

          {/* Wishlist Circular Glass Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] flex items-center justify-center transition-all relative focus:outline-none cursor-pointer shadow-2xs hover:text-[#0877C9]"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#E53935] text-[#E53935]' : 'text-[#718398]'}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E53935] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Circular Glass Button with Blue Quantity Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-[#0877C9] flex items-center justify-center transition-all relative focus:outline-none cursor-pointer shadow-2xs group"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#718398] group-hover:text-[#0877C9] transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0877C9] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              {totalCartItems > 99 ? '99+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Search Row (sm:hidden) */}
      <div className="sm:hidden px-4 pb-2.5 pt-0.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full flex items-center bg-white/85 border border-[rgba(130,170,205,0.3)] rounded-full shadow-inner">
            <Search className="w-3.5 h-3.5 text-[#718398] ml-3.5 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 1,200+ products...", "পণ্য বা কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-16 py-2 text-xs text-[#193B5B] placeholder-[#718398] bg-transparent focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-8 p-1 text-[#718398] hover:text-[#0877C9]"
              title={t("Search by Image", "ছবি দিয়ে খুঁজুন")}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="w-6 h-6 mr-1 bg-[#0877C9] text-white rounded-full flex items-center justify-center shrink-0 shadow-xs"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* 2. SECOND ROW: All Categories Dropdown Button + Main Navigation Links */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">

        {/* Left: "All Categories" Dropdown Button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/80 text-xs font-bold text-[#193B5B] hover:text-[#0877C9] transition-all shrink-0 cursor-pointer border border-transparent hover:border-[rgba(130,170,205,0.25)]"
          title={t("Browse All Categories", "সকল ক্যাটাগরি ব্রাউজ করুন")}
        >
          <Menu className="w-4 h-4 text-[#0877C9]" />
          <span>{t("All Categories", "সকল ক্যাটাগরি")}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#718398]" />
        </button>

        {/* Center / Navigation Menu Links */}
        <nav className="flex items-center gap-6 sm:gap-7 shrink-0">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`text-xs font-bold transition-all relative py-1 cursor-pointer ${
              currentView === 'home'
                ? 'text-[#0877C9]'
                : 'text-[#193B5B] hover:text-[#0877C9]'
            }`}
          >
            <span>{t("Home", "হোম")}</span>
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0877C9] rounded-full" />
            )}
          </button>

          {/* Categories */}
          <button
            onClick={() => handleNavClick('categories')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Categories", "ক্যাটাগরি")}
          </button>

          {/* Collections */}
          <button
            onClick={() => handleNavClick('collections')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Collections", "কালেকশন")}
          </button>

          {/* Best Deals */}
          <button
            onClick={() => handleNavClick('deals')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Best Deals", "সেরা অফার")}
          </button>

          {/* New Arrivals */}
          <button
            onClick={() => handleNavClick('arrivals')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("New Arrivals", "নতুন কালেকশন")}
          </button>

          {/* About Us */}
          <button
            onClick={() => handleNavClick('about')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("About Us", "আমাদের সম্পর্কে")}
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className="text-xs font-semibold text-[#193B5B] hover:text-[#0877C9] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Contact", "যোগাযোগ")}
          </button>
        </nav>

        {/* Right subtle placeholder / spacer to keep clean balance on wide screens */}
        <div className="hidden lg:block shrink-0 text-[11px] font-semibold text-[#718398]">
          <span>{t("Verified Retail • 100% Genuine", "১০০% আসল পণ্য")}</span>
        </div>

      </div>

    </header>
  );
}
