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
  Truck
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

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
          className="fixed inset-0 bg-[#062B4F]/30 backdrop-blur-sm z-40 xl:hidden"
        />
      )}

      {/* Floating Sidebar Container */}
      <aside 
        className={`fixed xl:sticky top-6 left-6 z-40 w-[250px] shrink-0 h-[calc(100vh-48px)] flex flex-col justify-between rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_rgba(6,43,79,0.07)] p-5 transition-transform duration-300 overflow-y-auto select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div 
            onClick={() => { navigateTo('home'); onClose?.(); }}
            className="cursor-pointer group pb-6 pt-1 flex flex-col"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={true} />
            <p className="text-[10px] font-semibold text-[#71849B] tracking-wide mt-1 pl-0.5">
              {t('Discover better. Live better.', 'উন্নত জীবন, সেরা পণ্য')}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 pt-2">
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
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0877C9] via-[#2563EB] to-[#458CF6] text-white shadow-[0_6px_20px_rgba(37,99,235,0.35)] translate-x-1'
                      : 'text-[#485B73] hover:text-[#0877C9] hover:bg-white/90 hover:shadow-[0_2px_10px_rgba(6,43,79,0.04)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#71849B] group-hover:text-[#0877C9]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promotional Delivery Card (Reference Screenshot Exact Match) */}
        <div className="mt-6 pt-4 border-t border-[#D9F0FF]/60">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#EDF5FD] to-[#D9EDFD] p-4 border border-white/80 shadow-[0_6px_18px_rgba(6,43,79,0.05)] overflow-hidden flex flex-col justify-between">
            {/* Delivery Graphic & Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2563EB]">
                <Truck className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0877C9] bg-white/80 px-2 py-0.5 rounded-full">
                100% Free
              </span>
            </div>

            <h4 className="text-xs font-black text-[#101C35] leading-tight">
              {t('FREE NATIONWIDE DELIVERY', 'ফ্রি হোম ডেলিভারি')}
            </h4>
            
            <p className="text-[11px] font-medium text-[#71849B] mt-1 leading-normal">
              {t('On eligible orders over ৳3,000.', '৳৩,০০০ বা তদূর্ধ্ব অর্ডারে')}
            </p>

            <button
              onClick={() => { setIsTrackingOpen(true); onClose?.(); }}
              className="mt-3.5 w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-white text-[#101C35] hover:text-[#2563EB] text-[11px] font-bold shadow-xs hover:shadow transition-all group"
            >
              <span>{t('Track & Details', 'বিস্তারিত দেখুন')}</span>
              <div className="w-5 h-5 rounded-full bg-[#0877C9] group-hover:bg-[#2563EB] text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
