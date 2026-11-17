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
 * AZRAQ Shop — Frosted Transparent Glass Sidebar Navigation
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-[#101C35]/40 backdrop-blur-sm z-40 xl:hidden animate-in fade-in"
        />
      )}

      {/* Floating Glass Sidebar Panel */}
      <aside 
        className={`fixed xl:sticky top-0 xl:top-5 left-0 z-40 w-[270px] xl:w-[240px] shrink-0 h-full xl:h-[calc(100vh-40px)] flex flex-col justify-between rounded-r-[28px] xl:rounded-[28px] glass-sidebar p-5 xl:p-4.5 transition-transform duration-300 overflow-y-auto select-none no-scrollbar shadow-2xl xl:shadow-[0_10px_35px_rgba(16,55,100,0.07)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Top: Brand Header & Navigation */}
        <div>
          <div className="flex items-start justify-between pb-5 pt-1">
            <div 
              onClick={() => { navigateTo('home'); onClose?.(); }}
              className="cursor-pointer group flex flex-col"
            >
              <AzraqLogo variant="dark" size="md" showDescriptor={true} />
              <p className="text-[11px] font-semibold text-[#71849B] tracking-wide mt-1.5 pl-0.5">
                {t('Discover better. Live better.', 'উন্নত জীবন, সেরা পণ্য')}
              </p>
            </div>

            <button
              onClick={onClose}
              className="xl:hidden w-8 h-8 rounded-full glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] shrink-0"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (currentView === item.id) || (item.id === 'home' && currentView === 'home');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-xs transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-[#D9EDFF]/90 text-[#0877C9] border border-[#69C5F5]/40 shadow-xs font-bold translate-x-1'
                      : 'text-[#71849B] hover:text-[#101C35] hover:bg-white/70 font-semibold'
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
        <div className="mt-5 pt-3.5 border-t border-white/60">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#F0F7FF]/90 to-[#D9EDFF]/80 p-3.5 border border-white/80 shadow-xs flex flex-col justify-between overflow-hidden">
            
            {/* Delivery Graphic & Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#0877C9]">
                <Truck className="w-4 h-4 text-[#0877C9]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#0877C9] bg-white/90 px-2 py-0.5 rounded-full border border-white">
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
              onClick={() => { setIsTrackingOpen(true); onClose?.(); }}
              className="mt-2.5 w-full flex items-center justify-between px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#101C35] hover:text-[#0877C9] text-[10px] font-bold shadow-xs hover:shadow transition-all group"
            >
              <span>{t('Track & Details', 'বিস্তারিত দেখুন')}</span>
              <div className="w-4.5 h-4.5 rounded-full bg-[#0877C9] group-hover:bg-[#2563EB] text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
