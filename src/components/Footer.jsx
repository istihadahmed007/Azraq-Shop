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
 * AZRAQ Shop — Clean Professional Retail E-Commerce Footer
 * Shopee-inspired structured layout: Customer Care, About AZRAQ, Payment & Logistics, Copyright.
 */
export default function Footer() {
  const { collections, navigateTo, setIsTrackingOpen, setIsAdminOpen, t } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" className="w-full pt-4 pb-8 select-none">

      <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-xs">

        {/* 4-Column Retail Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-6 border-b border-gray-100">

          {/* 1. Brand & Contact (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-3">
            <AzraqLogo variant="dark" size="sm" showDescriptor={false} />

            <p className="text-xs text-[#757575] max-w-sm leading-relaxed">
              {t(
                'AZRAQ Shop is your trusted online retail destination for authentic gadgets, kitchen essentials, and curated everyday lifestyle goods in Bangladesh.',
                'আজরাক শপ — বাংলাদেশের নির্ভরযোগ্য অনলাইন রিটেইল শপ। আসল পণ্যের নিশ্চয়তা ও দ্রুত হোম ডেলিভারি।'
              )}
            </p>

            <div className="flex flex-col gap-1.5 pt-1 text-xs text-[#212121]">
              <div id="footer-contact" className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0877C9]" />
                <span className="font-semibold">+880 1711-223344</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0877C9]" />
                <span>support@azraqtrips.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0877C9]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Care (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#212121]">
              {t('Customer Care', 'গ্রাহক সেবা')}
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-[#757575]">
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-[#0877C9] transition-colors">
                  {t('Track Your Order', 'অর্ডার ট্র্যাক করুন')}
                </button>
              </li>
              <li>
                <button onClick={() => window.open('https://wa.me/8801711223344', '_blank')} className="hover:text-[#0877C9] transition-colors">
                  {t('Help Center & Support', 'হেল্প সেন্টার ও সহায়তা')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
                  {t('Shipping & Delivery Policy', 'ডেলিভারি পলিসি')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#0877C9] transition-colors">
                  {t('Merchant & Admin Portal', 'অ্যাডমিন পোর্টাল')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Top Categories (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#212121]">
              {t('Catalog Categories', 'ক্যাটালগ ক্যাটাগরি')}
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-[#757575]">
              {collections.slice(0, 5).map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => navigateTo('collection-detail', col.slug)}
                    className="hover:text-[#0877C9] transition-colors truncate max-w-full text-left"
                  >
                    {col.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo('collections')}
                  className="text-[#0877C9] font-medium hover:underline"
                >
                  {t('View All 18 Collections →', 'সকল ১৮টি কালেকশন দেখুন →')}
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Payment & Delivery (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#212121]">
              {t('Payment & Delivery', 'পেমেন্ট ও ডেলিভারি')}
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#757575]">
              <div>
                <p className="font-semibold text-[#212121] mb-1">{t('Payment Methods', 'পেমেন্ট মেথড')}</p>
                <div className="flex flex-wrap gap-1 text-[11px] font-medium text-gray-600">
                  <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-[2px]">Paymently</span>
                  <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-[2px]">bKash</span>
                  <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-[2px]">Nagad</span>
                  <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-[2px]">Cards</span>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[2px]">COD</span>
                </div>
              </div>

              <div className="pt-1">
                <p className="font-semibold text-[#212121] mb-1">{t('Delivery Areas', 'ডেলিভারি এরিয়া')}</p>
                <p className="text-[11px] leading-relaxed">
                  • {t('Dhaka: 24–48h (৳70)', 'ঢাকা: ২৪–৪৮ ঘণ্টা (৭০৳)')}<br />
                  • {t('Outside: 48–72h (৳130)', 'বাইরে: ৪৮–৭২ ঘণ্টা (১৩০৳)')}<br />
                  • {t('Free over ৳3,000', '৩০০০৳ এর অর্ডারে ফ্রি')}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AZRAQ. {t('All rights reserved. EasyDrop Official Retail Partner.', 'সর্বস্বত্ব সংরক্ষিত। ইজিড্রপ অফিসিয়াল রিটেইল পার্টনার।')}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-[3px] border border-gray-200 hover:border-[#0877C9] text-gray-600 hover:text-[#0877C9] transition-colors"
          >
            <span>{t('Back to Top', 'উপরে যান')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}