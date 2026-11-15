import React from 'react';
import { 
  Truck, RotateCcw, ShieldCheck, Headphones, MapPin, 
  Phone, Mail, ArrowRight, Heart, Sparkles, Globe 
} from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { 
    collections,
    setIsTrackingOpen, 
    setIsAdminOpen, 
    setIsBrandAssetsOpen, 
    navigateTo,
    t 
  } = useShop();

  return (
    <footer className="w-full">
      
      {/* ======================================================== */}
      {/* TOP FEATURE BAR (Reference Screenshot Exact Match) */}
      {/* ======================================================== */}
      <div className="bg-[#062B4F] text-white py-6 border-b border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Azure Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0877C9]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* 1. Free Shipping */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 text-[#50DDF0] shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                  {t("Free Shipping", "ফ্রি ডেলিভারি")}
                </h4>
                <p className="text-[11px] text-white/60">
                  {t("On orders over ৳1,500", "১৫০০৳+ অর্ডারে")}
                </p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 text-[#50DDF0] shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                  {t("Easy Returns", "সহজ রিটার্ন")}
                </h4>
                <p className="text-[11px] text-white/60">
                  {t("Within 7 days policy", "৭ দিনের রিটার্ন সুবিধা")}
                </p>
              </div>
            </div>

            {/* 3. Secure Payments */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 text-[#50DDF0] shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                  {t("Secure Payments", "নিরাপদ পেমেন্ট")}
                </h4>
                <p className="text-[11px] text-white/60">
                  {t("100% protected checkout", "১০০% নিরাপদ লেনদেন")}
                </p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 text-[#50DDF0] shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                  {t("24/7 Support", "২৪/৭ সাপোর্ট")}
                </h4>
                <p className="text-[11px] text-white/60">
                  {t("Dedicated assistance", "সর্বদা আপনার পাশে")}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN FOOTER (Deep Azraq Navy with Glassy Refinement) */}
      {/* ======================================================== */}
      <div className="bg-[#041E38] text-white pt-16 pb-12 relative overflow-hidden">
        {/* Soft Background Radial Light */}
        <div className="absolute -top-20 left-10 w-96 h-96 bg-[#0877C9]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
            
            {/* Col 1: Brand Wordmark & Descriptor */}
            <div className="lg:col-span-5 space-y-4">
              <AzraqLogo variant="light" size="lg" showDescriptor={true} />
              
              <p className="text-xs sm:text-sm text-[#69C5F5] font-serif italic">
                "Discover better. Live better."
              </p>

              <p className="text-xs text-white/70 max-w-sm leading-relaxed font-normal">
                {t(
                  "AZRAQ curates premium everyday goods for modern lifestyles in Bangladesh. Combining futuristic aesthetic principles with verified quality, sustainable craftsmanship, and dependable nationwide doorstep delivery.",
                  "আজরাক আধুনিক জীবনযাত্রার জন্য নিয়ে এসেছে কিউরেটেড এভরিডে গুডস। নান্দনিক ডিজাইন, টেকসই উপকরণ ও দেশব্যাপী নির্ভরযোগ্য হোম ডেলিভারির বিশ্বস্ত সমাধান।"
                )}
              </p>

              {/* Contact Information */}
              <div className="pt-2 space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#50DDF0]" />
                  <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#50DDF0]" />
                  <span>+880 1711-223344 (24/7 Helpline)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#50DDF0]" />
                  <span>concierge@azraqtrips.com</span>
                </div>
              </div>
            </div>

            {/* Col 2: Top Collections */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#50DDF0]">
                {t("Categories", "ক্যাটাগরি")}
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                {collections.slice(0, 6).map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => navigateTo('collection-detail', c.slug)}
                      className="hover:text-white hover:translate-x-1 transition-all text-left truncate block max-w-full"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Customer Service */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#50DDF0]">
                {t("Customer Care", "গ্রাহক সেবা")}
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors">
                    {t("Track Your Order", "অর্ডার ট্র্যাকিং")}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAdminOpen(true)} className="hover:text-white transition-colors">
                    {t("Supplier Operations", "সাপ্লায়ার পোর্টাল")}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsBrandAssetsOpen(true)} className="hover:text-white transition-colors">
                    {t("Brand Guidelines", "ব্র্যান্ড নির্দেশিকা")}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('collections')} className="hover:text-white transition-colors">
                    {t("Collection Taxonomy", "ক্যাটালগ সূচি")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#50DDF0]">
                {t("Stay in Touch", "সংযুক্ত থাকুন")}
              </h4>
              <p className="text-xs text-white/60">
                {t("Subscribe for drop updates, private sales, and new collection launches.", "নতুন কালেকশন ড্রপ ও এক্সক্লুসিভ অফারের আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।")}
              </p>

              <div className="flex items-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1">
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
                />
                <button 
                  onClick={() => alert('Thank you for subscribing to AZRAQ updates!')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0877C9] hover:bg-[#50DDF0] hover:text-[#062B4F] text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
                >
                  Join
                </button>
              </div>

              <div className="pt-2 text-[10px] text-white/50 space-y-1">
                <p>• Verified Supplier Fulfillment via EasyDrop Network</p>
                <p>• Secured by 256-Bit SSL Encryption</p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <div>
              © 2026 AZRAQ (CURATED EVERYDAY GOODS). All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors">
                Order Tracking
              </button>
              <button onClick={() => setIsBrandAssetsOpen(true)} className="hover:text-white transition-colors">
                Brand Assets
              </button>
              <span className="text-[#50DDF0] font-mono text-[11px]">
                GLASSY AZRAQ SYSTEM
              </span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
