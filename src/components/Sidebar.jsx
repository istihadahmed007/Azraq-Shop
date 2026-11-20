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
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphic Navigation Sidebar
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
        <div className="flex items-start justify-between pb-4 pt-1 border-b border-[rgba(130,170,205,0.2)] mb-4">
          <div
            onClick={() => { navigateTo('home'); onClose?.(); }}
            className="cursor-pointer group flex flex-col"
          >
            <AzraqLogo variant="dark" size="md" showDescriptor={false} />
            <p className="text-[10px] font-mono font-bold text-[#0877C9] tracking-wider mt-1.5 uppercase">
              CURATED EXCELLENCE 2026
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#193B5B] hover:text-[#0877C9] shrink-0 shadow-2xs"
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
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-colors group text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#185ADB] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#718398] group-hover:text-[#0877C9]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Delivery Promotion Card */}
      <div className="mt-4 pt-4 border-t border-[rgba(130,170,205,0.2)]">
        <div className="rounded-[22px] bg-white/80 p-4 border border-[rgba(130,170,205,0.25)] backdrop-blur-md flex flex-col justify-between shadow-xs">

          {/* Delivery Graphic & Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#0877C9]">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#193B5B] bg-[#DDEEFF] px-2.5 py-0.5 rounded-full">
              NATIONWIDE
            </span>
          </div>

          <h4 className="text-xs font-bold text-[#193B5B] leading-snug">
            {t('Delivery: Dhaka ৳80 / Outside ৳150', 'ডেলিভারি: ঢাকা ৮০৳ / বাইরে ১৫০৳')}
          </h4>

          <p className="text-[10px] text-[#718398] mt-1 leading-normal font-medium">
            {t('Free delivery on orders over ৳3,000.', '৩,০০০৳ বা তদূর্ধ্ব অর্ডারে ফ্রি ডেলিভারি।')}
          </p>

          <button
            onClick={() => { setIsTrackingOpen(true); onClose?.(); }}
            className="mt-3 w-full flex items-center justify-between px-4 py-2 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors group shadow-xs cursor-pointer"
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
        className="fixed inset-0 bg-[#193B5B]/35 backdrop-blur-sm z-50 animate-in fade-in transition-opacity"
      />

      {/* Modern Glassy Navigation Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] bg-[#F8FBFF]/95 backdrop-blur-2xl border-r border-[rgba(130,170,205,0.3)] p-5 shadow-[0_20px_50px_rgba(25,59,91,0.15)] select-none animate-in slide-in-from-left duration-200 overflow-y-auto"
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
