import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowUp
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Professional Light Frosted Glass Footer
 */
export default function Footer() {
  const { collections, navigateTo, setIsTrackingOpen, setIsAdminOpen, t } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" className="w-full max-w-full overflow-hidden pt-2 pb-10 select-none">

      {/* Frosted Main Glass Footer Container (Sharp 8px radius) */}
      <div className="rounded-[8px] glass-panel p-6 sm:p-10 border border-white/95 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* 1. Brand Column (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-3.5">
            <AzraqLogo variant="dark" size="md" showDescriptor={true} />

            <p className="text-xs sm:text-[13px] font-medium text-[#71849B] max-w-sm leading-relaxed">
              {t(
                'AZRAQ is your premier destination for authentic curated everyday goods, mobile accessories, kitchen essentials, and lifestyle collections across Bangladesh.',
                'আজরাক বাংলাদেশের অন্যতম নির্ভরযোগ্য কিউরেটেড এভরিডে গুডস, মোবাইল এক্সেসরিজ ও আধুনিক লাইফস্টাইল শপ।'
              )}
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs font-semibold text-[#101C35]">
              <div id="footer-contact" className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0877C9]" />
                <span>+880 1711-223344</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0877C9]" />
                <span>support@azraqtrips.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#0877C9]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* 2. Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#101C35]">
              {t('Quick Links', 'দ্রুত লিংক')}
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-[#71849B]">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-[#0877C9] transition-colors">
                  {t('Home', 'হোম')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('collections')} className="hover:text-[#0877C9] transition-colors">
                  {t('All 18 Collections', 'সকল ১৮টি কালেকশন')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-[#0877C9] transition-colors">
                  {t('Track Order', 'অর্ডার ট্র্যাকিং')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#0877C9] transition-colors">
                  {t('Admin Operations', 'অ্যাডমিন পোর্টাল')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Top Collections (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#101C35]">
              {t('Top Collections', 'জনপ্রিয় ক্যাটাগরি')}
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-[#71849B]">
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
            </ul>
          </div>

          {/* 4. Customer Assurance Policies (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#101C35]">
              {t('Customer Assurance', 'গ্রাহক সেবা ও নীতি')}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-medium text-[#71849B]">
              <p>• {t('Free Delivery over ৳3,000 nationwide', '৩০০০৳ এর অর্ডারে সারা দেশে ফ্রি ডেলিভারি')}</p>
              <p>• {t('Cash on Delivery & Secure Online Payment', 'ক্যাশ অন ডেলিভারি ও সুরক্ষিত পেমেন্ট')}</p>
              <p>• {t('7-day verified return guarantee', '৭ দিনের সহজ রিটার্ন সুবিধা')}</p>
              <p>• {t('100% genuine supplier warranty specs', '১০০% আসল প্রোডাক্ট কোয়ালিটি গ্যারান্টি')}</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="mt-8 pt-6 border-t border-white/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#71849B]">
          <p>© {new Date().getFullYear()} AZRAQ. {t('All rights reserved. Curated Everyday Goods.', 'সর্বস্বত্ব সংরক্ষিত। কিউরেটেড এভরিডে গুডস।')}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-[6px] glass-button hover:text-[#0877C9] text-[#101C35] transition-all group shadow-2xs"
          >
            <span>{t('Back to Top', 'উপরে যান')}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
