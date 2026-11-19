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
    <section className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/85 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] border-t-white/95 p-8 sm:p-12 text-[#193B5B] relative overflow-hidden shadow-[0_16px_40px_-10px_rgba(112,200,237,0.18),0_4px_16px_-2px_rgba(25,59,91,0.04)] text-center sm:text-left">
        
        {/* Ambient cyan aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#70C8ED]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#0877C9] uppercase flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0877C9]" />
              {t("CURATED DISCOVERY", "নতুন দিগন্তের সূচনা")}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#193B5B] tracking-tight leading-tight">
              {t("READY TO FIND YOUR NEXT FAVOURITE?", "আপনার পরবর্তী পছন্দের পণ্যটি খুঁজে পেতে প্রস্তুত?")}
            </h2>

            <p className="text-xs sm:text-sm text-[#718398] max-w-xl leading-relaxed">
              {t(
                `Explore 18 authentic collections and ${products.length} curated products. Enjoy ৳200 discount on your first order with code AZRAQNEW.`,
                `১৮টি সমৃদ্ধ কালেকশন ও ${products.length}টি যাচাইকৃত পণ্য ঘুরে দেখুন। প্রথম অর্ডারে ভাউচার কোড AZRAQNEW ব্যবহারে উপভোগ করুন ২০০ টাকা বিশেষ ছাড়।`
              )}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter phone (017...) or email"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] text-xs text-[#193B5B] placeholder-[#718398] focus:outline-none focus:border-[#70C8ED] shadow-inner font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.35)] transition-all whitespace-nowrap cursor-pointer"
                  >
                    {t("Unlock ৳200 Off", "২০০৳ ভাউচার নিন")}
                  </button>
                </div>
                <p className="text-[11px] text-[#718398] text-center sm:text-left">
                  {t("Instant coupon code on your first verified order.", "প্রথম অর্ডারে তাৎক্ষণিক ভাউচার সুবিধা।")}
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-white/80 border border-emerald-300 text-center sm:text-left space-y-1 shadow-xs">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("Voucher Code Activated: AZRAQNEW", "ভাউচার কোড অ্যাক্টিভ: AZRAQNEW")}</span>
                </div>
                <p className="text-xs text-[#718398]">
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
