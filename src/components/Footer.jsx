import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { 
    setIsTrackingOpen, 
    setIsAdminOpen, 
    setIsBrandAssetsOpen, 
    setActiveCategory,
    t 
  } = useShop();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-azraq-navy text-white pt-16 pb-12 border-t border-azraq-purple/20 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-azraq-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-azraq-azure/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <AzraqLogo variant="light" size="lg" showDescriptor={true} />
            <p className="text-sm font-serif italic text-azraq-lime">
              "Discover better. Live better."
            </p>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              {t(
                "AZRAQ curates premium everyday goods for modern lifestyles in Bangladesh. Combining futuristic aesthetic principles with verified quality, sustainable craftsmanship, and dependable nationwide doorstep delivery.",
                "আজরাক আধুনিক জীবনযাত্রার জন্য নিয়ে এসেছে কিউরেটেড এভরিডে গুডস। নান্দনিক ডিজাইন, টেকসই উপকরণ ও দেশব্যাপী দ্রুত ডেলিভারির বিশ্বস্ত সমাধান।"
              )}
            </p>

            {/* Quick Contact Points */}
            <div className="pt-2 space-y-1.5 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-azraq-lime" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-azraq-lime" />
                <span>+880 1700-000000 (24/7 Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-azraq-lime" />
                <span>concierge@azraq.shop</span>
              </div>
            </div>
          </div>

          {/* Col 2: Curated Editions */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-azraq-lime">
              {t("Curated Goods", "কালেকশন")}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('Shoulder Bags');
                    scrollTo('all-products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t("Shoulder Bags (8)", "শোল্ডার ব্যাগ")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('Luxury Handbags');
                    scrollTo('all-products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t("Luxury Handbags (5)", "হ্যান্ডব্যাগ")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('Totes');
                    scrollTo('all-products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t("Totes & Shoppers (5)", "টোট ব্যাগ")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('Travel & Crossbody');
                    scrollTo('all-products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t("Travel & Crossbody (2)", "ট্রাভেল ও ক্রসবাডি")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('All');
                    scrollTo('all-products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t("All 20 Editions", "সকল ২০টি পণ্য")}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Transparency */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-azraq-lime">
              {t("Customer Care", "সহায়তা")}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button 
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  {t("Track BD Shipment", "অর্ডার ট্র্যাক")}
                </button>
              </li>
              <li>
                <span className="text-white/50">{t("Dhaka 24-48h Delivery", "২৪-৪৮ ঘণ্টায় ঢাকা ডেলিভারি")}</span>
              </li>
              <li>
                <span className="text-white/50">{t("Cash on Delivery (COD)", "ক্যাশ অন ডেলিভারি")}</span>
              </li>
              <li>
                <span className="text-white/50">{t("7-Day Return Policy", "৭ দিনের রিটার্ন পলিসি")}</span>
              </li>
              <li>
                <button 
                  onClick={() => setIsBrandAssetsOpen(true)}
                  className="hover:text-white text-azraq-purple transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-azraq-lime" />
                  <span>{t("Brand Book & Assets", "ব্র্যান্ড নির্দেশিকা")}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Architecture */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-azraq-lime">
              {t("Operations & Dropship", "সাপ্লায়ার ও সিস্টেম")}
            </h4>
            <div className="p-4 rounded-2xl bg-azraq-charcoal/80 border border-azraq-purple/30 text-xs space-y-2">
              <p className="text-white/80 leading-relaxed text-[11px]">
                Authorized dropshipping catalogue imported from <strong>EasyDrop Category ID 5</strong>. Seamless fulfilment across Bangladesh.
              </p>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-azraq-navy hover:bg-azraq-navy/80 text-azraq-lime text-xs font-bold border border-azraq-lime/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dropship Portal</span>
              </button>
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-white/50 block mb-1.5">
                Supported Payment Options
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/80">
                <span className="px-2 py-0.5 rounded bg-white/10">Cash on Delivery</span>
                <span className="px-2 py-0.5 rounded bg-[#E2136E]/20 text-[#E2136E]">bKash</span>
                <span className="px-2 py-0.5 rounded bg-[#F7941D]/20 text-[#F7941D]">Nagad</span>
                <span className="px-2 py-0.5 rounded bg-white/10">Visa / MC</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} AZRAQ. All rights reserved. Registered retail trademark in Bangladesh.
          </p>
          <div className="flex items-center gap-6">
            <span>Bangladesh Standard Time (BST)</span>
            <span className="text-azraq-lime">Currency: BDT (৳)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

