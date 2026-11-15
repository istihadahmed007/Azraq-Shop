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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
      <div className="rounded-2xl bg-gradient-to-r from-[#062B4F] via-[#08355F] to-[#062B4F] p-8 sm:p-14 text-white border border-[#69C5F5]/30 relative overflow-hidden shadow-2xl text-center sm:text-left">
        
        {/* Ambient cyan aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#50DDF0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#50DDF0] uppercase flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-[#50DDF0]" />
              {t("CURATED DISCOVERY", "নতুন দিগন্তের সূচনা")}
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t("READY TO FIND YOUR NEXT FAVOURITE?", "আপনার পরবর্তী পছন্দের পণ্যটি খুঁজে পেতে প্রস্তুত?")}
            </h2>

            <p className="text-xs sm:text-sm text-white/75 max-w-xl">
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
                    className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-[#69C5F5]/40 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#50DDF0]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#0877C9] hover:bg-[#50DDF0] text-white hover:text-[#062B4F] font-black text-xs sm:text-sm shadow-md transition-all whitespace-nowrap"
                  >
                    {t("Unlock ৳200 Off", "২০০৳ ভাউচার নিন")}
                  </button>
                </div>
                <p className="text-[11px] text-white/50 text-center sm:text-left">
                  {t("Instant coupon code on your first verified order.", "প্রথম অর্ডারে তাৎক্ষণিক ভাউচার সুবিধা।")}
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-white/10 border border-[#50DDF0]/50 text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-[#50DDF0]">
                  <CheckCircle2 className="w-5 h-5 text-[#50DDF0]" />
                  <span>{t("Voucher Code Activated: AZRAQNEW", "ভাউচার কোড অ্যাক্টিভ: AZRAQNEW")}</span>
                </div>
                <p className="text-xs text-white/70">
                  {t("৳200 has been applied to your checkout cart.", "আপনার শপিং ব্যাগে ২০০ টাকা ডিসকাউন্ট যোগ হয়েছে।")}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
