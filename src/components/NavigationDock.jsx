import React from 'react';
import { Home, LayoutGrid, Layers, ShoppingBag, Headphones, ShieldCheck, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function NavigationDock() {
  const { 
    totalCartItems, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    setIsAdminOpen, 
    favorites, 
    navigateTo,
    t
  } = useShop();

  return (
    <aside 
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center py-4 px-2.5 rounded-full bg-[#F8FBFF]/85 backdrop-blur-2xl border border-[rgba(130,170,205,0.35)] shadow-[0_12px_40px_rgba(112,200,237,0.2)] transition-all hover:border-[#70C8ED]"
      aria-label="Quick Navigation Dock"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className="group relative p-2.5 rounded-full text-[#718398] hover:text-[#193B5B] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Home", "হোম")}
        >
          <Home className="w-5 h-5" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("Home", "হোম")}
          </span>
        </button>

        {/* All Collections (18) */}
        <button
          onClick={() => navigateTo('collections')}
          className="group relative p-2.5 rounded-full text-[#718398] hover:text-[#193B5B] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Browse 18 Collections", "সকল ১৮টি কালেকশন")}
        >
          <Layers className="w-5 h-5" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("18 Collections", "১৮টি কালেকশন")}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            navigateTo('home');
            setTimeout(() => {
              const el = document.getElementById('featured-curations') || document.getElementById('daily-catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="group relative p-2.5 rounded-full text-[#718398] hover:text-[#193B5B] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Wishlist", "উইশলিস্ট")}
        >
          <Heart className="w-5 h-5" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#185ADB] text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
              {favorites.length}
            </span>
          )}
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("Wishlist", "পছন্দের তালিকা")} ({favorites.length})
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="group relative p-2.5 rounded-full text-[#0877C9] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Shopping Cart", "শপিং ব্যাগ")}
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#185ADB] text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
              {totalCartItems}
            </span>
          )}
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-[#70C8ED] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("Bag", "ব্যাগ")} ({totalCartItems})
          </span>
        </button>

        <div className="w-6 h-[1px] bg-[rgba(130,170,205,0.3)] my-1" />

        {/* Customer Care / Tracking */}
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="group relative p-2.5 rounded-full text-[#718398] hover:text-[#193B5B] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Track Order & Support", "অর্ডার ট্র্যাকিং")}
        >
          <Headphones className="w-5 h-5" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("Track & Support", "ট্র্যাকিং")}
          </span>
        </button>

        {/* Admin Dropshipping Panel */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group relative p-2.5 rounded-full text-[#0877C9] hover:text-[#193B5B] hover:bg-[#DDEEFF]/60 transition-colors"
          title={t("Admin & Collections Management", "অ্যাডমিন পোর্টাল")}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="absolute left-14 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#193B5B] text-[#70C8ED] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-[rgba(130,170,205,0.3)]">
            {t("Admin & Collections", "অ্যাডমিন")}
          </span>
        </button>
      </div>
    </aside>
  );
}
