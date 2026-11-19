import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowUp,
  CreditCard
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Deep Ink Modern Editorial Footer (The Everyday Edit)
 * Features:
 * - Brand story & direct contact details (verified hotline +880 1851-172032)
 * - Customer care links & order tracking modal trigger
 * - Direct links to genuine catalog collections
 * - Paymently & logistics delivery transparency (Dhaka ৳80, Outside ৳150)
 * - Smooth scroll-to-top interaction
 */
export default function Footer() {
  const { collections, navigateTo, setIsTrackingOpen, setIsAdminOpen, t } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" className="w-full pt-4 pb-8 select-none">

      <div className="bg-[#172333] border border-[#233346] rounded-[6px] p-6 sm:p-8 md:p-10 shadow-[0_4px_20px_rgba(23,35,51,0.08)] text-[#F5F4EF]">

        {/* 4-Column Retail Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-[#233346]">

          {/* 1. Brand & Contact (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <AzraqLogo variant="light" size="md" showDescriptor={false} />

            <p className="text-xs text-[#A8B3CF] max-w-sm leading-relaxed">
              {t(
                'AZRAQ Shop is your trusted online retail destination for authentic gadgets, kitchen essentials, and curated everyday lifestyle goods in Bangladesh.',
                'আজরাক শপ — বাংলাদেশের নির্ভরযোগ্য অনলাইন রিটেইল শপ। আসল পণ্যের নিশ্চয়তা ও দ্রুততম হোম ডেলিভারি।'
              )}
            </p>

            <div className="flex flex-col gap-2 pt-1 text-xs text-[#E5E3DA]">
              <div id="footer-contact" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[3px] bg-[#223145] border border-[#2B3B4E] flex items-center justify-center text-[#245BDB]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a href="tel:+8801851172032" className="font-semibold hover:text-[#245BDB] transition-colors">
                  +880 1851-172032
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[3px] bg-[#223145] border border-[#2B3B4E] flex items-center justify-center text-[#245BDB]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:support@azraqtrips.com" className="hover:text-[#245BDB] transition-colors">
                  support@azraqtrips.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[3px] bg-[#223145] border border-[#2B3B4E] flex items-center justify-center text-[#245BDB]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Care (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              {t('Customer Care', 'গ্রাহক সেবা')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#A8B3CF]">
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors text-left">
                  {t('Track Your Order', 'অর্ডার ট্র্যাক করুন')}
                </button>
              </li>
              <li>
                <a href="https://wa.me/8801851172032" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-left inline-block">
                  {t('Help Center & Support', 'হেল্প সেন্টার ও সহায়তা')}
                </a>
              </li>
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors text-left">
                  {t('Shipping & Delivery Policy', 'ডেলিভারি পলিসি')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsAdminOpen(true)} className="hover:text-white transition-colors text-left">
                  {t('Merchant & Admin Portal', 'অ্যাডমিন পোর্টাল')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Top Categories (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              {t('Catalog Collections', 'ক্যাটালগ কালেকশন')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#A8B3CF]">
              {collections.slice(0, 5).map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => navigateTo('collection-detail', col.slug)}
                    className="hover:text-white transition-colors truncate max-w-full text-left"
                  >
                    {col.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo('collections')}
                  className="text-[#245BDB] font-semibold hover:underline text-left inline-flex items-center gap-1"
                >
                  <span>{t('View All 18 Collections →', 'সকল ১৮টি কালেকশন দেখুন →')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Payment & Delivery (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              {t('Payment & Delivery', 'পেমেন্ট ও ডেলিভারি')}
            </h4>
            <div className="flex flex-col gap-3 text-xs text-[#A8B3CF]">
              <div>
                <p className="font-semibold text-white mb-1.5">{t('Payment Methods', 'পেমেন্ট মেথড')}</p>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-[#F5F4EF]">
                  <span className="px-2 py-0.5 bg-[#223145] border border-[#2B3B4E] rounded-[3px]">Paymently</span>
                  <span className="px-2 py-0.5 bg-[#223145] border border-[#2B3B4E] rounded-[3px]">bKash</span>
                  <span className="px-2 py-0.5 bg-[#223145] border border-[#2B3B4E] rounded-[3px]">Nagad</span>
                  <span className="px-2 py-0.5 bg-[#223145] border border-[#2B3B4E] rounded-[3px]">Cards</span>
                  <span className="px-2 py-0.5 bg-white text-[#172333] rounded-[3px] font-bold">COD</span>
                </div>
              </div>

              <div className="pt-1">
                <p className="font-semibold text-white mb-1">{t('Delivery Areas', 'ডেলিভারি এরিয়া')}</p>
                <p className="text-[11px] leading-relaxed text-[#A8B3CF]">
                  • {t('Dhaka: 24–48h (৳80)', 'ঢাকা: ২৪–৪৮ ঘণ্টা (৮০৳)')}<br />
                  • {t('Outside: 48–72h (৳150)', 'বাইরে: ৪৮–৭২ ঘণ্টা (১৫০৳)')}<br />
                  • {t('Free over ৳3,000', '৩০০০৳ অর্ডারে ফ্রি')}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A8B3CF]">
          <p>© {new Date().getFullYear()} AZRAQ Shop. {t('All rights reserved. EasyDrop Official Retail Partner.', 'সর্বস্বত্ব সংরক্ষিত। ইজিড্রপ অফিসিয়াল রিটেইল পার্টনার।')}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#223145] border border-[#2B3B4E] hover:border-white text-white transition-colors font-semibold shadow-xs"
          >
            <span>{t('Back to Top', 'উপরে যান')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
