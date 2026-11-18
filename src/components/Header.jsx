import React from 'react';
import {
  Search, Heart, ShoppingBag, Headphones,
  Menu, Package, Shield, Globe, Camera, ChevronDown
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Minimal Premium Soft-Neumorphic Header
 * 
 * 1. AZRAQ logo on left.
 * 2. Wide rounded search field in the centre with embedded image-search camera.
 * 3. Circular floating wishlist and shopping cart icons on right.
 * 4. Clean category navigation underneath with rounded pill tabs.
 * 5. Soft-neumorphic elevated surface (#F7FAFD, 24px radius, soft drop shadow).
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
    <header className="w-full bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[24px] shadow-[0_10px_30px_rgba(50,75,100,0.08)] select-none sticky top-2 z-40">
      
      {/* 1. TOP UTILITY MICRO BAR (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center justify-between px-5 sm:px-6 py-2 border-b border-[#E1EDF7] text-[11px] text-[#6B7D93] bg-[#F0F6FA]/50 rounded-t-[24px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
            <span className="font-medium">{t("Nationwide Delivery: ৳70 Dhaka / ৳130 Outside", "সারাদেশে দ্রুত ডেলিভারি: ঢাকা ৭০৳ / বাইরে ১৩০৳")}</span>
          </span>
          <span className="text-[#C3D4E4]">|</span>
          <button 
            onClick={() => window.open('https://wa.me/8801711223344', '_blank')}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-medium"
          >
            <Headphones className="w-3 h-3 text-[#0877C9]" />
            <span>+880 1711-223344</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Order Tracking */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold"
          >
            <Package className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Track Order", "অর্ডার ট্র্যাক")}</span>
          </button>

          <span className="text-[#C3D4E4]">|</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <span className="text-[#C3D4E4]">|</span>

          {/* Admin Operations Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#0877C9] flex items-center gap-1 transition-colors font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-[#0877C9]" />
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
            className="w-10 h-10 rounded-full border border-[#D5E2EE] bg-[#EDF4F9] hover:bg-white flex items-center justify-center text-[#293B52] hover:text-[#0877C9] shadow-xs hover:shadow-sm transition-all focus:outline-none"
            title={t("All Categories", "সকল ক্যাটাগরি")}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <AzraqLogo variant="dark" size="sm" showDescriptor={false} />
          </div>
        </div>

        {/* Center: Wide Rounded Search Box with Embedded Image-Search Control */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="relative w-full flex items-center bg-[#EDF4F9] border border-[#CBDCE9] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(50,75,100,0.06)] focus-within:border-[#0877C9] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(8,119,201,0.15)] transition-all">
              <input
                type="text"
                placeholder={t("Search products, collections, brands...", "পণ্য বা কালেকশন খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-[#293B52] placeholder-[#8CA0B6] bg-transparent focus:outline-none"
              />

              {/* AI Visual Image Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="absolute right-11 sm:right-13 p-1.5 rounded-full text-[#6B7D93] hover:text-[#0877C9] hover:bg-white/80 transition-colors"
                title={t("Search by Image", "ছবি দিয়ে পণ্য খুঁজুন")}
                aria-label="Search by image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Solid Search Submit Button */}
              <button
                type="submit"
                className="w-8 h-8 sm:w-9 sm:h-9 mr-1 bg-[#0877C9] hover:bg-[#0665AC] text-white rounded-full flex items-center justify-center transition-all shadow-sm shrink-0 active:scale-95"
                title={t("Search", "অনুসন্ধান")}
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Circular Wishlist & Shopping Cart Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">

          {/* Circular Wishlist Button */}
          <button
            onClick={() => {
              if (currentView !== 'home') navigateTo('home');
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-10 h-10 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] text-[#293B52] hover:text-[#0877C9] shadow-xs hover:shadow-sm flex items-center justify-center transition-all relative focus:outline-none"
            title={t("Wishlist", "পছন্দের তালিকা")}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#EE8056] text-[#EE8056]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EE8056] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Circular Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-full bg-[#0877C9] hover:bg-[#0665AC] text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all relative focus:outline-none active:scale-95"
            title={t("Shopping Cart", "শপিং ব্যাগ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#EE8056] border-2 border-[#F7FAFD] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              {totalCartItems > 9 ? '9+' : totalCartItems}
            </span>
          </button>

        </div>

      </div>

      {/* 3. CATEGORY NAVIGATION STRIP (Pill style underneath) */}
      <div className="flex items-center gap-2 px-4 sm:px-6 py-2 border-t border-[#E1EDF7] bg-[#F7FAFD] rounded-b-[24px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] whitespace-nowrap shadow-2xs transition-all"
        >
          <span>{t("All 18 Collections", "১৮টি কালেকশন")}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <span className="text-[#C3D4E4] mx-0.5">|</span>

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
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#0877C9] text-white border-[#0877C9] shadow-xs'
                  : 'bg-transparent hover:bg-[#EDF4F9] text-[#293B52] hover:text-[#0877C9] border-transparent hover:border-[#D5E2EE]'
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
