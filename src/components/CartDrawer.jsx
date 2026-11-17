import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Transparent Glassmorphism Cart Drawer
 */
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#101C35]/50 backdrop-blur-sm animate-in fade-in duration-200 select-none">

      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-drawer shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/80 flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D9EDFF] flex items-center justify-center text-[#0877C9]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-[#101C35] tracking-tight">
                {t("Your Shopping Bag", "আপনার শপিং ব্যাগ")}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#0877C9] text-white text-xs font-bold">
                {totalCartItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full glass-button text-[#101C35] hover:text-[#0877C9]"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="p-4 bg-[#F0F7FF]/90 border-b border-white/80 text-xs">
            <div className="flex items-center justify-between font-bold text-[#101C35] mb-1.5">
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
              <span className="text-[10px] text-[#71849B] font-mono font-bold">
                {Math.round(freeDeliveryProgress)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/80 border border-white/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0877C9] to-[#50DDF0] rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D9EDFF] flex items-center justify-center mx-auto text-[#0877C9]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-[#101C35]">
                  {t("Your bag is currently empty", "আপনার ব্যাগটি খালি রয়েছে")}
                </p>
                <p className="text-xs text-[#71849B] max-w-xs mx-auto">
                  {t(
                    "Discover everyday essentials curated for modern living in Bangladesh.",
                    "আমাদের কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।"
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full glass-button-primary text-xs font-bold"
                >
                  {t("Explore Catalog", "পণ্য কালেকশন দেখুন")}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-3.5 p-3 rounded-[20px] glass-card"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-[16px] bg-[#F8FBFF] border border-white/80 flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
                    <img
                      src={item.product.main_image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#101C35] line-clamp-1">
                          {item.product.name.split('—')[1] || item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-[#71849B] hover:text-rose-500 transition-colors p-0.5"
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
                      <div className="flex items-center glass-panel rounded-full overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#101C35] hover:bg-white/80"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#101C35]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#101C35] hover:bg-white/80"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-black text-[#101C35]">
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
            <div className="p-4 sm:p-5 bg-white/85 border-t border-white/80 space-y-3.5">

              {/* Delivery Zone Toggle */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#101C35] block">
                  {t("Delivery Area in Bangladesh", "ডেলিভারি এলাকা")}:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-2 px-3 rounded-full font-bold transition-all text-center ${deliveryArea === 'inside'
                      ? 'bg-[#0877C9] text-white shadow-2xs'
                      : 'glass-button text-[#101C35]'
                      }`}
                  >
                    {t("Inside Dhaka", "ঢাকার ভেতরে")} (৳70)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-2 px-3 rounded-full font-bold transition-all text-center ${deliveryArea === 'outside'
                      ? 'bg-[#0877C9] text-white shadow-2xs'
                      : 'glass-button text-[#101C35]'
                      }`}
                  >
                    {t("Outside Dhaka", "ঢাকার বাইরে")} (৳130)
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#71849B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Promo Code (try AZRAQNEW)", "প্রমো কোড লিখুন...")}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-full glass-input text-xs text-[#101C35] uppercase font-mono placeholder:normal-case placeholder:font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full glass-button text-[#0877C9] hover:bg-white text-xs font-bold"
                >
                  {t("Apply", "প্রয়োগ")}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <span>{appliedPromo.code} {t("Applied", "প্রযুক্ত")}</span>
                  <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                </div>
              )}

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1 text-xs text-[#71849B] pt-2 border-t border-white/80">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "সাবটোটাল")}</span>
                  <span className="font-bold text-[#101C35]">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span className="font-bold text-[#101C35]">
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
                <div className="flex justify-between text-base font-black text-[#101C35] pt-2 border-t border-white/80">
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
                className="w-full flex items-center justify-between pl-6 pr-2 py-3 rounded-full glass-button-primary font-black text-sm tracking-tight"
              >
                <span>{t("PROCEED TO CHECKOUT", "চেকআউট করুন")}</span>
                <span className="w-8 h-8 rounded-full bg-white text-[#0877C9] flex items-center justify-center shadow-xs">
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
