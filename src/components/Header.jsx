import React, { useState } from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronRight,
  User, LogOut
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

/**
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphic Header
 * 
 * Features:
 * 1. Crystal translucent surface with backdrop-blur-2xl and fine icy border.
 * 2. Top utility micro-bar with delivery transparency, WhatsApp hotline, order tracking & Admin portal.
 * 3. Customer Account button with Google login avatar / Sign In modal trigger.
 * 4. Embedded AI Visual Image Search trigger and crystal search input.
 * 5. Horizontal department navigation strip with translucent glass pills.
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

  const { user, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    <header className="w-full bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[24px] shadow-[0_12px_36px_-8px_rgba(112,200,237,0.12),0_2px_8px_-1px_rgba(25,59,91,0.03)] select-none sticky top-2.5 z-40 transition-all">

      {/* 1. TOP UTILITY MICRO BAR (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center justify-between px-5 sm:px-6 py-2 border-b border-[rgba(130,170,205,0.18)] text-[11px] text-[#718398] bg-white/40 rounded-t-[24px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#70C8ED] shadow-[0_0_8px_#70C8ED] animate-pulse" />
            <span className="font-semibold text-[#193B5B] tracking-tight">
              {t("Delivery: ৳80 Dhaka • ৳150 Outside • Free on orders over ৳3,000", "ডেলিভারি: ঢাকা ৮০৳ • বাইরে ১৫০৳ • ৩০০০৳ অর্ডারে ফ্রি ডেলিভারি")}
            </span>
          </span>
          <span className="text-[#82AACD]/40">/</span>
          <a
            href="https://wa.me/8801851172032"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0877C9] flex items-center gap-1.5 transition-colors font-medium text-[#193B5B]"
          >
            <Headphones className="w-3 h-3 text-[#70C8ED]" />
            <span>+880 1851-172032</span>
          </a>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Order Tracking */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold text-[#193B5B] cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#70C8ED]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          <span className="text-[#82AACD]/40">/</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold text-[#193B5B] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#70C8ED]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <span className="text-[#82AACD]/40">/</span>

          {/* Admin Operations Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold text-[#193B5B] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#70C8ED]" />
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
            className="w-9 h-9 rounded-full border border-[rgba(130,170,205,0.3)] bg-white/75 hover:bg-white flex items-center justify-center text-[#193B5B] hover:text-[#0877C9] shadow-xs transition-all focus:outline-none cursor-pointer"
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
            <div className="relative w-full flex items-center bg-white/80 border border-[rgba(130,170,205,0.28)] rounded-full focus-within:border-[#70C8ED] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#70C8ED]/20 transition-all shadow-inner">
              <Search className="w-4 h-4 text-[#718398] ml-4 shrink-0 pointer-events-none" />
              <input
                type="text"
                placeholder={t("Search across 1,200+ curated products, brands, categories...", "১২০০+ আসল পণ্য ও কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2.5 pr-20 py-2.5 text-xs sm:text-[13px] text-[#193B5B] placeholder-[#718398] bg-transparent focus:outline-none font-medium"
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
                className="w-8 h-8 mr-1 bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white rounded-full flex items-center justify-center transition-all shrink-0 shadow-[0_2px_8px_rgba(112,200,237,0.4)] cursor-pointer"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: User Login, Wishlist & Shopping Cart Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Customer Profile / Sign In Control */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="h-9 px-2.5 sm:px-3 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                title={user.name}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#70C8ED]"
                />
                <span className="hidden lg:inline text-xs font-bold text-[#193B5B] max-w-[85px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] shadow-[0_16px_40px_rgba(25,59,91,0.12)] p-2 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-3 border-b border-[rgba(130,170,205,0.15)] mb-1">
                    <p className="text-xs font-bold text-[#193B5B] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#718398] truncate">{user.email || user.phone}</p>
                    {user.provider === 'google' && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-[#DDEEFF] text-[10px] text-[#193B5B] font-semibold">
                        Google Verified
                      </span>
                    )}
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
              className="h-9 px-3.5 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-[#0877C9] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer focus:outline-none"
              title={t("Customer Sign In", "গ্রাহক লগইন")}
            >
              <User className="w-3.5 h-3.5 text-[#70C8ED]" />
              <span className="hidden md:inline text-xs font-bold">{t("Sign In", "লগইন")}</span>
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
            className="h-9 px-3 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] flex items-center justify-center gap-1.5 transition-all relative focus:outline-none cursor-pointer shadow-xs"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-[#E53935] text-[#E53935]' : 'text-[#718398]'}`} />
            <span className="hidden md:inline text-xs font-semibold">{t("Saved", "পছন্দ")}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#193B5B] text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button (Icy-Blue Gradient Pill with Counter) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="h-9 px-4 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white shadow-[0_6px_20px_rgba(112,200,237,0.45)] hover:shadow-[0_8px_26px_rgba(112,200,237,0.6)] flex items-center justify-center gap-2 transition-all relative focus:outline-none active:scale-98 cursor-pointer"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{t("Bag", "ব্যাগ")}</span>
            <span className="min-w-4 h-4 px-1 rounded-full bg-white text-[#193B5B] text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
              {totalCartItems > 99 ? '99+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* 2b. MOBILE SEARCH BAR ROW */}
      <div className="sm:hidden px-4 pb-3 pt-0.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full flex items-center bg-white/80 border border-[rgba(130,170,205,0.28)] rounded-full focus-within:border-[#70C8ED] focus-within:bg-white transition-all shadow-inner">
            <Search className="w-3.5 h-3.5 text-[#718398] ml-3.5 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search 1,200+ products...", "পণ্য বা কালেকশন খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-16 py-2 text-xs text-[#193B5B] placeholder-[#718398] bg-transparent focus:outline-none font-medium"
            />

            {/* AI Visual Image Search Button */}
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="absolute right-8 p-1 text-[#718398] hover:text-[#0877C9]"
              title={t("Search by Image", "ছবি দিয়ে খুঁজুন")}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-6 h-6 mr-1 bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white rounded-full flex items-center justify-center shrink-0 shadow-xs"
              title={t("Search", "অনুসন্ধান")}
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. CATEGORY NAVIGATION STRIP */}
      <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 border-t border-[rgba(130,170,205,0.18)] bg-white/40 rounded-b-[24px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-1 px-3 py-1 rounded-full bg-white/75 border border-[rgba(130,170,205,0.3)] hover:border-[#70C8ED] whitespace-nowrap shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span>{t("All 18 Collections", "১৮টি কালেকশন")}</span>
          <ChevronRight className="w-3 h-3 text-[#718398]" />
        </button>

        <span className="text-[#82AACD]/40 mx-1 shrink-0">|</span>

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
              className={`text-xs font-medium px-3.5 py-1 rounded-full whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white border-transparent font-bold shadow-[0_2px_10px_rgba(112,200,237,0.4)]'
                  : 'bg-white/50 hover:bg-white text-[#718398] hover:text-[#193B5B] border-[rgba(130,170,205,0.2)] hover:border-[rgba(130,170,205,0.4)]'
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
