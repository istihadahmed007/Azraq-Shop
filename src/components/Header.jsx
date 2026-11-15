import React, { useState } from 'react';
import { ArrowUpRight, ShoppingBag, Globe, Sparkles, Shield, Search, Menu, X, Layers, ChevronDown } from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function Header() {
  const { 
    collections,
    totalCartItems, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    setIsAdminOpen, 
    setIsBrandAssetsOpen,
    navigateTo,
    language, 
    setLanguage, 
    searchQuery, 
    setSearchQuery,
    t 
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showCollectionsDropdown, setShowCollectionsDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-azraq-cloud/90 backdrop-blur-xl border-b border-azraq-purple/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: AZRAQ Brand Logo */}
        <div className="flex items-center gap-6">
          <button onClick={() => navigateTo('home')} className="flex items-center text-left group">
            <AzraqLogo variant="dark" size="md" showDescriptor={true} />
          </button>
        </div>

        {/* Center: Minimal Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-bold text-azraq-navy/80">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-azraq-violet transition-colors py-1 relative group"
          >
            {t("Home", "হোম")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-azraq-violet transition-all group-hover:w-full" />
          </button>

          {/* Collections Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowCollectionsDropdown(!showCollectionsDropdown)}
              onMouseEnter={() => setShowCollectionsDropdown(true)}
              className="hover:text-azraq-violet transition-colors py-1 flex items-center gap-1 group"
            >
              <span>{t("All Collections (18)", "সকল ১৮টি কালেকশন")}</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
            </button>

            {/* Collections Mega Menu Dropdown */}
            {showCollectionsDropdown && (
              <div 
                onMouseLeave={() => setShowCollectionsDropdown(false)}
                className="absolute top-8 -left-12 w-[460px] bg-white rounded-2xl shadow-2xl border border-azraq-purple/20 p-4 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {collections.slice(0, 12).map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setShowCollectionsDropdown(false);
                      navigateTo('collection-detail', c.slug);
                    }}
                    className="p-2 rounded-xl hover:bg-azraq-cloud text-left flex items-center gap-2.5 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center p-1 flex-shrink-0">
                      <img src={c.image_url} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-azraq-navy truncate group-hover/item:text-azraq-violet">
                        {c.name}
                      </p>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {c.imported_product_count} items
                      </span>
                    </div>
                  </button>
                ))}
                <div className="col-span-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Showing 12 of 18 Collections</span>
                  <button
                    onClick={() => {
                      setShowCollectionsDropdown(false);
                      navigateTo('collections');
                    }}
                    className="font-bold text-azraq-violet hover:underline flex items-center gap-1"
                  >
                    <span>View All Collections</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigateTo('collection-detail', 'gadgets-it-accessories')}
            className="hover:text-azraq-violet transition-colors py-1 relative group"
          >
            {t("Gadgets & IT", "গ্যাজেটস")}
          </button>

          <button 
            onClick={() => navigateTo('collection-detail', 'jewelries-accessories')}
            className="hover:text-azraq-violet transition-colors py-1 relative group"
          >
            {t("Bags & Carry", "ব্যাগস")}
          </button>

          <button 
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-azraq-violet transition-colors py-1 relative group"
          >
            {t("Track Order", "অর্ডার ট্র্যাকিং")}
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-white border border-azraq-purple/30 rounded-full px-3 py-1.5 shadow-sm transition-all">
                <Search className="w-4 h-4 text-azraq-navy/50 mr-2" />
                <input
                  type="text"
                  placeholder={t("Search 257 products...", "পণ্য খুঁজুন...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-48 bg-transparent text-xs text-azraq-navy focus:outline-none"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                  }}
                  className="text-azraq-navy/40 hover:text-azraq-navy ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-azraq-navy/70 hover:text-azraq-navy hover:bg-azraq-lavender/50 rounded-full transition-colors"
                title={t("Search Catalog", "অনুসন্ধান")}
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-azraq-purple/20 bg-white/70 hover:bg-white text-azraq-navy transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-azraq-azure" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Admin Collections Portal Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-azraq-navy text-white hover:bg-azraq-charcoal transition-colors shadow-sm"
            title="Open Admin Operations & Dropship Portal"
          >
            <Shield className="w-3.5 h-3.5 text-azraq-lime" />
            <span>{t("Admin Portal", "অ্যাডমিন")}</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-azraq-navy hover:text-azraq-violet bg-white border border-azraq-purple/20 rounded-full shadow-sm hover:shadow transition-all group"
            title={t("View Cart", "ব্যাগ দেখুন")}
          >
            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-azraq-lime text-[11px] font-black text-azraq-navy flex items-center justify-center shadow-md animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Explore Collections CTA Button */}
          <button
            onClick={() => navigateTo('collections')}
            className="flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy text-xs font-bold shadow-glow-lime transition-all transform hover:-translate-y-0.5"
          >
            <span>{t("Collections", "কালেকশন")}</span>
            <span className="w-7 h-7 rounded-full bg-azraq-navy text-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-azraq-navy hover:bg-azraq-lavender/50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-azraq-purple/20 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-semibold text-azraq-navy text-base">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('home');
              }} 
              className="text-left py-2 hover:text-azraq-violet border-b border-gray-100"
            >
              {t("Home", "হোম")}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('collections');
              }} 
              className="text-left py-2 hover:text-azraq-violet border-b border-gray-100 font-bold text-azraq-violet"
            >
              {t("Browse All 18 Collections", "সকল ১৮টি কালেকশন")}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsTrackingOpen(true);
              }} 
              className="text-left py-2 hover:text-azraq-violet border-b border-gray-100"
            >
              {t("Track Your Order", "অর্ডার ট্র্যাকিং")}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminOpen(true);
              }} 
              className="text-left py-2 text-azraq-navy hover:text-azraq-lime flex items-center justify-between font-bold"
            >
              <span>{t("Admin Collections Portal", "অ্যাডমিন পোর্টাল")}</span>
              <Shield className="w-4 h-4 text-azraq-lime" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
