import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  Layers, 
  Flame, 
  Sparkles, 
  Info, 
  Mail, 
  ArrowRight,
  Truck,
  X
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Premium Transparent Glassmorphism Navigation Sidebar
 *
 * Implements:
 * - Phase 1: 240px desktop sticky sidebar navigation that stays pinned beside main content.
 * - Mobile/Tablet drawer with smooth transition and zero offscreen layout displacement.
 * - Items: AZRAQ logo, Home, Categories, Collections, Best Deals, New Arrivals, About Us, Contact, Free Delivery promo.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { 
    currentView, 
    navigateTo, 
    setIsTrackingOpen,
    t 
  } = useShop();

  const navItems = [
    { id: 'home', label: t('Home', 'হোম'), icon: Home, action: () => navigateTo('home') },
    { 
      id: 'categories', 
      label: t('Categories', 'ক্যাটাগরি'), 
      icon: LayoutGrid, 
      action: () => {
        if (currentView !== 'home') navigateTo('home');
        setTimeout(() => {
          document.getElementById('browse-categories')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } 
    },
    { id: 'collections', label: t('Collections', 'কালেকশন'), icon: Layers, action: () => navigateTo('collections') },
    { 
      id: 'best-deals', 
      label: t('Best Deals', 'সেরা ডিল'), 
      icon: Flame, 
      action: () => {
        if (currentView !== 'home') navigateTo('home');
        setTimeout(() => {
          document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } 
    },
    { 
      id: 'new-arrivals', 
      label: t('New Arrivals', 'নতুন কালেকশন'), 
      icon: Sparkles, 
      action: () => {
        if (currentView !== 'home') navigateTo('home');
        setTimeout(() => {
          document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } 
    },
    { 
      id: 'about-us', 
      label: t('About Us', 'আমাদের সম্পর্কে'), 
      icon: Info, 
      action: () => {
        document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' });
      } 
    },
    { 
      id: 'contact-us', 
      label: t('Contact Us', 'যোগাযোগ'), 
      icon: Mail, 
      action: () => {
        document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
      } 
    },
  ];

  // Common Nav Content shared between Desktop & Mobile views
  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full">
      {/* Top: Brand Header & Navigation */}
      <div>
        <div className="flex items-start justify-between pb-4 pt-1 border-b border-white/60 mb-3">
          <div 
            onClick={() => { navigateTo('home'); if (isMobile) onClose?.(); }}
            className="cursor-pointer group flex flex-col"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={true} />
            <p className="text-[11px] font-semibold text-[#71849B] tracking-wide mt-1 pl-0.5">
              {t('Discover better. Live better.', 'উন্নত জীবন, সেরা পণ্য')}
            </p>
          </div>

          {isMobile && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] shrink-0"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links with Active Light-Blue Highlighting */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = (currentView === item.id) || (item.id === 'home' && currentView === 'home');

            return (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  if (isMobile) onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-xs transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-[#D9EDFF]/90 text-[#0877C9] border border-[#69C5F5]/50 shadow-xs font-bold translate-x-0.5'
                    : 'text-[#71849B] hover:text-[#101C35] hover:bg-white/80 font-semibold'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-[#0877C9]' : 'text-[#71849B] group-hover:text-[#0877C9]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Delivery Promotion Card */}
      <div className="mt-4 pt-3 border-t border-white/60">
        <div className="relative rounded-[20px] bg-gradient-to-b from-[#F0F7FF]/95 to-[#D9EDFF]/85 p-3.5 border border-white/90 shadow-xs flex flex-col justify-between overflow-hidden">
          
          {/* Delivery Graphic & Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#0877C9]">
              <Truck className="w-4 h-4 text-[#0877C9]" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#0877C9] bg-white px-2 py-0.5 rounded-full border border-white/80">
              100% Free
            </span>
          </div>

          <h4 className="text-[11px] font-black text-[#101C35] leading-snug">
            {t('FREE NATIONWIDE DELIVERY', 'ফ্রি হোম ডেলিভারি')}
          </h4>
          
          <p className="text-[10px] font-medium text-[#71849B] mt-0.5 leading-normal">
            {t('On eligible orders over ৳3,000.', '৳৩,০০০ বা তদূর্ধ্ব অর্ডারে')}
          </p>

          <button
            onClick={() => { setIsTrackingOpen(true); if (isMobile) onClose?.(); }}
            className="mt-2.5 w-full flex items-center justify-between px-2.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#101C35] hover:text-[#0877C9] text-[10px] font-bold shadow-xs hover:shadow transition-all group"
          >
            <span>{t('Track & Details', 'বিস্তারিত দেখুন')}</span>
            <div className="w-4.5 h-4.5 rounded-full bg-[#0877C9] group-hover:bg-[#2563EB] text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#101C35]/35 backdrop-blur-sm z-50 animate-in fade-in transition-opacity"
      />

      {/* Floating Glass Navigation Drawer (Visible only when open, 0px space reserved when closed) */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] glass-sidebar p-5 shadow-[0_20px_50px_rgba(16,55,100,0.18)] select-none animate-in slide-in-from-left duration-300 overflow-y-auto"
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
}
