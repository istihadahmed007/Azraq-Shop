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
  X,
  User,
  Shield
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

/**
 * AZRAQ Shop — Transparent Glassy Navigation Sidebar
 */
export default function Sidebar({ isOpen, onClose }) {
  const {
    currentView,
    navigateTo,
    setIsTrackingOpen,
    setIsAdminOpen,
    t
  } = useShop();

  const { user, openAuthModal } = useAuth();

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
      id: 'login',
      label: user ? user.name : t('Customer Login', 'গ্রাহক লগইন'),
      icon: User,
      action: () => {
        if (!user) {
          openAuthModal('login');
        } else {
          setIsTrackingOpen(true);
        }
      }
    },
    {
      id: 'admin',
      label: t('Admin Portal', 'অ্যাডমিন পোর্টাল'),
      icon: Shield,
      action: () => {
        setIsAdminOpen(true);
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
        <div className="flex items-start justify-between pb-4 pt-1 border-b border-white/80 mb-4">
          <div
            onClick={() => { navigateTo('home'); onClose?.(); }}
            className="cursor-pointer group flex flex-col"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={false} />
            <p className="text-[11px] font-bold text-blue-600 tracking-wider mt-1 uppercase">
              THE MODERN EVERYDAY EDIT
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/70 hover:bg-white border border-white/90 flex items-center justify-center text-slate-700 hover:text-blue-600 shrink-0 shadow-2xs"
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group text-left cursor-pointer ${isActive
                  ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 font-semibold'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Delivery Promotion Card */}
      <div className="mt-4 pt-4 border-t border-white/80">
        <div className="rounded-2xl bg-white/80 p-4 border border-white/90 backdrop-blur-md flex flex-col justify-between shadow-sm">

          {/* Delivery Graphic & Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
              FAST NATIONWIDE
            </span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {t('Delivery: Dhaka ৳80 / Outside ৳150', 'ডেলিভারি: ঢাকা ৮০৳ / বাইরে ১৫০৳')}
          </h4>

          <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">
            {t('Free delivery on orders over ৳3,000.', '৩,০০০৳ বা তদূর্ধ্ব অর্ডারে ফ্রি ডেলিভারি।')}
          </p>

          <button
            onClick={() => { setIsTrackingOpen(true); onClose?.(); }}
            className="mt-3 w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#245BDB] to-[#1E40AF] hover:from-[#1E40AF] text-white text-xs font-bold transition-all group shadow-xs cursor-pointer"
          >
            <span>{t('Track Your Order', 'অর্ডার ট্র্যাক করুন')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in transition-opacity"
      />

      {/* Modern Glassy Navigation Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] bg-white/90 backdrop-blur-2xl border-r border-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.15)] select-none animate-in slide-in-from-left duration-200 overflow-y-auto"
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
