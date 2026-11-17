import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    isFreeDelivery,
    deliveryArea,
    setDeliveryArea,
    deliveryFee,
    appliedPromo,
    applyPromoCode,
    cartTotal,
    totalCartItems,
    setIsCheckoutOpen,
    t
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 3000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#062B4F]/60 backdrop-blur-sm animate-in fade-in duration-200">

      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#D9F0FF]">

          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-[#F8FCFF]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#0877C9]" />
              <h2 className="text-lg font-black text-[#062B4F] tracking-tight">
                {t("Your Shopping Bag", "আপনার শপিং ব্যাগ")}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#D9F0FF] text-[#0877C9] text-xs font-bold">
                {totalCartItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-[#062B4F]/60 hover:text-[#062B4F] hover:bg-gray-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="p-4 bg-[#F0F7FF] border-b border-[#D9F0FF] text-xs">
            <div className="flex items-center justify-between font-bold text-[#062B4F] mb-1.5">
              <span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-black">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                    {t("You unlocked FREE Nationwide Delivery!", "আপনি ফ্রি ডেলিভারি আনলক করেছেন!")}
                  </span>
                ) : (
                  <span>
                    {t("Add", "আরও")} <strong className="text-[#0877C9]">৳{remainingForFreeDelivery.toLocaleString()}</strong> {t("for FREE delivery", "টাকার পণ্যে ফ্রি ডেলিভারি")}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#062B4F]/60 font-mono">
                {Math.round(freeDeliveryProgress)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0877C9] to-[#50DDF0] rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0F7FF] flex items-center justify-center mx-auto text-[#0877C9]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-[#062B4F]">
                  {t("Your bag is currently empty", "আপনার ব্যাগটি খালি রয়েছে")}
                </p>
                <p className="text-xs text-[#062B4F]/60 max-w-xs mx-auto">
                  {t(
                    "Discover everyday essentials curated for modern living in Bangladesh.",
                    "আমাদের কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।"
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors"
                >
                  {t("Explore Catalog", "পণ্য কালেকশন দেখুন")}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white border border-[#D9F0FF] shadow-xs hover:border-[#0877C9]/40 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#F8FCFF] border border-[#D9F0FF]/50 flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
                    <img
                      src={item.product.main_image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#062B4F] line-clamp-1">
                          {item.product.name.split('—')[1] || item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#0877C9] font-semibold">
                        {item.variant}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#062B4F] hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#062B4F]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#062B4F] hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-black text-[#062B4F]">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#F8FCFF] border-t border-[#D9F0FF] space-y-4">

              {/* Delivery Zone Toggle */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#062B4F] block">
                  {t("Delivery Area in Bangladesh", "ডেলিভারি এলাকা")}:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${deliveryArea === 'inside'
                      ? 'bg-[#062B4F] text-white border-[#062B4F] shadow-sm'
                      : 'bg-white text-[#062B4F]/80 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {t("Inside Dhaka", "ঢাকার ভেতরে")} (৳70)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${deliveryArea === 'outside'
                      ? 'bg-[#062B4F] text-white border-[#062B4F] shadow-sm'
                      : 'bg-white text-[#062B4F]/80 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {t("Outside Dhaka", "ঢাকার বাইরে")} (৳130)
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Promo Code (try AZRAQNEW)", "প্রমো কোড লিখুন...")}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#062B4F] uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#0877C9]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors"
                >
                  {t("Apply", "প্রয়োগ")}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span>{appliedPromo.code} {t("Applied", "প্রযুক্ত")}</span>
                  <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                </div>
              )}

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-[#062B4F]/80 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "সাবটোটাল")}</span>
                  <span className="font-bold text-[#062B4F]">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span className="font-bold text-[#062B4F]">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-black">{t("FREE", "ফ্রি")}</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t("Promo Discount", "ডিসকাউন্ট")}</span>
                    <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#062B4F] pt-2 border-t border-gray-200">
                  <span>{t("Estimated Total", "সর্বমোট")}</span>
                  <span className="text-lg">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-between pl-6 pr-2 py-3 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#0966ab] hover:to-[#1d4ed8] text-white font-extrabold text-sm tracking-tight shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{t("PROCEED TO CHECKOUT", "চেকআউট করুন")}</span>
                <span className="w-8 h-8 rounded-full bg-white text-[#2563EB] flex items-center justify-center shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

