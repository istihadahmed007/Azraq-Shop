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
 * AZRAQ Shop — Modern Editorial Navigation Sidebar (The Everyday Edit)
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
      label: t('Departments', 'ডিপার্টমেন্ট'),
      icon: LayoutGrid,
      action: () => {
        if (currentView !== 'home') navigateTo('home');
        setTimeout(() => {
          document.getElementById('browse-categories')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    { id: 'collections', label: t('All Collections', 'সকল কালেকশন'), icon: Layers, action: () => navigateTo('collections') },
    {
      id: 'best-deals',
      label: t('Best Sellers', 'সেরা বিক্রি'),
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
      label: t('Daily Discover', 'প্রতিদিনের আবিষ্কার'),
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
      label: t('About AZRAQ', 'আমাদের সম্পর্কে'),
      icon: Info,
      action: () => {
        document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'contact-us',
      label: t('Contact & Support', 'যোগাযোগ ও সহায়তা'),
      icon: Mail,
      action: () => {
        document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
  ];

  // Common Nav Content
  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      {/* Top: Brand Header & Navigation */}
      <div>
        <div className="flex items-start justify-between pb-4 pt-1 border-b border-[#E5E3DA] mb-4">
          <div
            onClick={() => { navigateTo('home'); onClose?.(); }}
            className="cursor-pointer group flex flex-col"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={false} />
            <p className="text-[11px] font-semibold text-[#667085] tracking-wide mt-1">
              THE MODERN EVERYDAY EDIT
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#172333] hover:text-[#245BDB] shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs transition-all duration-200 group text-left ${isActive
                  ? 'bg-[#172333] text-white font-bold shadow-xs'
                  : 'text-[#667085] hover:text-[#172333] hover:bg-[#FAF9F5] font-semibold'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-[#D7ED78]' : 'text-[#667085] group-hover:text-[#245BDB]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Delivery Promotion Card */}
      <div className="mt-4 pt-4 border-t border-[#E5E3DA]">
        <div className="rounded-[8px] bg-[#FAF9F5] p-3.5 border border-[#E5E3DA] flex flex-col justify-between">

          {/* Delivery Graphic & Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-[4px] bg-white border border-[#E5E3DA] flex items-center justify-center text-[#245BDB]">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#172333] bg-[#D7ED78] px-2 py-0.5 rounded-[4px]">
              FAST NATIONWIDE
            </span>
          </div>

          <h4 className="text-xs font-bold text-[#172333] leading-snug">
            {t('Delivery: Dhaka ৳80 / Outside ৳150', 'ডেলিভারি: ঢাকা ৮০৳ / বাইরে ১৫০৳')}
          </h4>

          <p className="text-[10px] text-[#667085] mt-1 leading-normal font-medium">
            {t('Free delivery on orders over ৳3,000.', '৩,০০০৳ বা তদূর্ধ্ব অর্ডারে ফ্রি ডেলিভারি।')}
          </p>

          <button
            onClick={() => { setIsTrackingOpen(true); onClose?.(); }}
            className="mt-3 w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-white hover:bg-[#172333] text-[#172333] hover:text-white border border-[#E5E3DA] text-xs font-bold transition-all group shadow-xs"
          >
            <span>{t('Track Your Order', 'অর্ডার ট্র্যাক করুন')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
        className="fixed inset-0 bg-[#172333]/40 backdrop-blur-xs z-50 animate-in fade-in transition-opacity"
      />

      {/* Modern Editorial Navigation Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] bg-white border-r border-[#E5E3DA] p-5 shadow-[0_20px_50px_rgba(23,35,51,0.14)] select-none animate-in slide-in-from-left duration-200 overflow-y-auto"
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
