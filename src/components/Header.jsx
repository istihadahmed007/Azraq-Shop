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
 * AZRAQ Shop — Clean Two-Row Storefront Header
 * 
 * Top Row:
 * - Brand logo.
 * - Center search bar with visual image search.
 * - Order Tracking, Help, Language, Account, Wishlist, and Cart.
 * 
 * Second Row:
 * - "All Categories" drawer button.
 * - Primary navigation links with quiet active states.
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
    <header className="w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xs select-none sticky top-2 z-40 transition-all">

      {/* 1. TOP ROW: Brand, Large Search Bar & Utility Controls */}
      <div className="px-4 sm:px-6 lg:px-8 pt-3 pb-2.5 flex items-center justify-between gap-3 sm:gap-6">

        {/* Far Left: AZRAQ Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer shrink-0 flex items-center transition-opacity hover:opacity-90"
        >
          <AzraqLogo variant="dark" size="sm" showDescriptor={false} />
        </div>

        {/* Center: Large Horizontal Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:block flex-1 min-w-0 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center bg-slate-50 border border-slate-200 rounded-lg focus-within:border-[#185ADB] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#185ADB] transition-all">
              <input
                type="text"
                placeholder={t("Search for electronics, mobile accessories, lifestyle...", "১২০০+ আসল পণ্য, ব্র্যান্ড ও কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-20 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />

              {/* Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-10 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-8 h-8 mr-1.5 bg-[#185ADB] hover:bg-[#1044A3] text-white rounded-md flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Track Order, Help, Account, Wishlist & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Track Order Button */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#185ADB]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          {/* Help / WhatsApp Hotline Button */}
          <a
            href="https://wa.me/8801851172032"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 transition-colors"
            title="Customer Help WhatsApp"
          >
            <Headphones className="w-3.5 h-3.5 text-[#185ADB]" />
            <span>{t("Help", "হেল্প")}</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Admin Access Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden xl:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title={t("Admin Operations", "অ্যাডমিন পোর্টাল")}
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Customer Profile / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 transition-colors cursor-pointer overflow-hidden"
                title={user.name}
              >
                {(user.avatar || user.avatar_url) ? (
                  <img
                    src={user.avatar || user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#185ADB]" />
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-50 animate-in fade-in duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email || user.phone}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsTrackingOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#185ADB]" />
                    <span>{t("Track My Orders", "আমার অর্ডারসমূহ")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#185ADB]" />
                    <span>{t("Admin Operations", "অ্যাডমিন পোর্টাল")}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
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
              className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title={t("Customer Sign In", "গ্রাহক লগইন")}
              aria-label="Customer Sign In"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors relative cursor-pointer"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center transition-colors relative cursor-pointer"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#185ADB] text-white text-[10px] font-bold flex items-center justify-center shadow-xs tabular-nums">
              {totalCartItems > 99 ? '99+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Search Row (sm:hidden) */}
      <div className="sm:hidden px-4 pb-2.5 pt-0.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full flex items-center bg-slate-50 border border-slate-200 rounded-lg">
            <Search className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 1,200+ products...", "পণ্য বা কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-16 py-2 text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-8 p-1 text-slate-400 hover:text-slate-700"
              title={t("Search by Image", "ছবি দিয়ে খুঁজুন")}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="w-6 h-6 mr-1 bg-[#185ADB] text-white rounded flex items-center justify-center shrink-0 shadow-xs"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* 2. SECOND ROW: All Categories Dropdown Button + Main Navigation Links */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 border-t border-slate-100 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">

        {/* Left: "All Categories" Dropdown Button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors shrink-0 cursor-pointer"
          title={t("Browse All Categories", "সকল ক্যাটাগরি ব্রাউজ করুন")}
        >
          <Menu className="w-4 h-4 text-[#185ADB]" />
          <span>{t("All Categories", "সকল ক্যাটাগরি")}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Center / Navigation Menu Links */}
        <nav className="flex items-center gap-6 shrink-0">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`text-xs font-semibold transition-colors relative py-1 cursor-pointer ${currentView === 'home'
              ? 'text-[#185ADB]'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>{t("Home", "হোম")}</span>
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#185ADB] rounded-full" />
            )}
          </button>

          {/* Categories */}
          <button
            onClick={() => handleNavClick('categories')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Categories", "ক্যাটাগরি")}
          </button>

          {/* Collections */}
          <button
            onClick={() => handleNavClick('collections')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Collections", "কালেকশন")}
          </button>

          {/* Best Deals */}
          <button
            onClick={() => handleNavClick('deals')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Best Deals", "সেরা অফার")}
          </button>

          {/* New Arrivals */}
          <button
            onClick={() => handleNavClick('arrivals')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("New Arrivals", "নতুন কালেকশন")}
          </button>

          {/* About Us */}
          <button
            onClick={() => handleNavClick('about')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("About Us", "আমাদের সম্পর্কে")}
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t("Contact", "যোগাযোগ")}
          </button>
        </nav>

        {/* Right Reassurance Text */}
        <div className="hidden lg:block shrink-0 text-xs font-medium text-slate-500">
          <span>{t("Authentic Catalog • Verified Quality", "১০০% আসল পণ্য")}</span>
        </div>

      </div>

    </header>
  );
}
