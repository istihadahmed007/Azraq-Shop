import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function EditorialCtaSection() {
  const { products, navigateTo, showToast, t } = useShop();
  const [inputVal, setInputVal] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      showToast('Please enter your mobile or email', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to AZRAQ! Promo code AZRAQNEW activated.', 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-12">
      <div className="rounded-3xl bg-gradient-to-r from-azraq-navy via-azraq-charcoal to-[#1C1636] p-8 sm:p-14 text-white border border-azraq-purple/30 relative overflow-hidden shadow-2xl text-center sm:text-left">
        
        {/* Ambient violet aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-azraq-violet/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-azraq-lime uppercase flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              {t("CURATED DISCOVERY", "নতুন দিগন্তের সূচনা")}
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t("READY TO FIND YOUR NEXT FAVOURITE?", "আপনার পরবর্তী পছন্দের পণ্যটি খুঁজে পেতে প্রস্তুত?")}
            </h2>

            <p className="text-xs sm:text-sm text-white/70 max-w-xl">
              {t(
                `Explore 18 authentic collections and ${products.length} curated products. Enjoy ৳200 discount on your first order with code AZRAQNEW.`,
                `১৮টি সমৃদ্ধ কালেকশন ও ${products.length}টি যাচাইকৃত পণ্য ঘুরে দেখুন। প্রথম অর্ডারে ভাউচার কোড AZRAQNEW ব্যবহারে উপভোগ করুন ২০০ টাকা বিশেষ ছাড়।`
              )}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter phone (017...) or email"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full bg-azraq-navy border border-azraq-purple/40 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-azraq-lime"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy font-black text-xs sm:text-sm shadow-glow-lime transition-all whitespace-nowrap"
                  >
                    {t("GET ৳200 OFF", "ভাউচার নিন")}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-azraq-lime/15 border border-azraq-lime/40 text-center text-xs space-y-1">
                <CheckCircle2 className="w-5 h-5 text-azraq-lime mx-auto" />
                <p className="font-bold text-azraq-lime">Voucher code ready: AZRAQNEW</p>
              </div>
            )}

            <button
              onClick={() => navigateTo('collections')}
              className="w-full py-3.5 px-6 rounded-full bg-white text-azraq-navy hover:bg-azraq-lavender font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{t("EXPLORE AZRAQ COLLECTIONS", "আজরাক কালেকশন দেখুন")}</span>
              <ArrowRight className="w-4 h-4 text-azraq-violet" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

