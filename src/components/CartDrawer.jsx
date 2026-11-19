import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphic Cart Drawer
 */
export default function CartDrawer() {
  const navigate = useNavigate();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#193B5B]/35 backdrop-blur-sm animate-in fade-in duration-200 select-none">

      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8FBFF]/95 backdrop-blur-2xl border-l border-[rgba(130,170,205,0.3)] shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[rgba(130,170,205,0.2)] flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#DDEEFF]/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#0877C9]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#193B5B] tracking-tight">
                {t("Shopping Bag", "আপনার শপিং ব্যাগ")}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-xs font-bold shadow-2xs">
                {totalCartItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full bg-white/80 border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-[#193B5B] shadow-2xs"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="p-3.5 bg-white/60 border-b border-[rgba(130,170,205,0.18)] text-xs">
            <div className="flex items-center justify-between font-bold text-[#193B5B] mb-1.5">
              <span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                    {t("You unlocked FREE Nationwide Delivery!", "আপনি ফ্রি ডেলিভারি আনলক করেছেন!")}
                  </span>
                ) : (
                  <span>
                    {t("Add", "আরও")} <strong className="text-[#0877C9]">৳{remainingForFreeDelivery.toLocaleString()}</strong> {t("for FREE delivery", "টাকার পণ্যে ফ্রি ডেলিভারি")}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#718398] font-mono font-bold">
                {Math.round(freeDeliveryProgress)}%
              </span>
            </div>
            {/* Progress Bar (Cyan Gradient) */}
            <div className="w-full h-1.5 rounded-full bg-[rgba(130,170,205,0.2)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(112,200,237,0.5)]"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3.5">
                <div className="w-14 h-14 rounded-full bg-white/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center mx-auto text-[#0877C9] shadow-xs">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-[#193B5B]">
                  {t("Your bag is currently empty", "আপনার ব্যাগটি খালি রয়েছে")}
                </p>
                <p className="text-xs text-[#718398] max-w-xs mx-auto leading-relaxed">
                  {t(
                    "Discover everyday essentials curated for modern living in Bangladesh.",
                    "আমাদের কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।"
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(112,200,237,0.4)]"
                >
                  {t("Explore Catalog", "পণ্য কালেকশন দেখুন")}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-3 p-3 rounded-[20px] bg-white/80 border border-[rgba(130,170,205,0.25)] shadow-xs"
                >
                  {/* Thumbnail (Strictly Contain) */}
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      if (item.product) {
                        navigate(`/product/${generateProductSlug(item.product)}`);
                      }
                    }}
                    className="card-image-wrapper w-16 h-16 rounded-[14px] bg-white border border-[rgba(130,170,205,0.2)] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden cursor-pointer shadow-xs"
                  >
                    <ProductImage
                      src={item.product.main_image}
                      alt={item.product.name}
                      fit="contain"
                      aspectRatio="square"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            if (item.product) {
                              navigate(`/product/${generateProductSlug(item.product)}`);
                            }
                          }}
                          className="text-xs font-bold text-[#193B5B] line-clamp-1 hover:text-[#0877C9] cursor-pointer transition-colors"
                        >
                          {item.product.name.split('—')[1] || item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-[#718398] hover:text-[#CF1322] transition-colors p-1"
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
                      <div className="flex items-center bg-white rounded-full overflow-hidden border border-[rgba(130,170,205,0.3)] shadow-2xs">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#193B5B] hover:bg-[#DDEEFF]/40"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#193B5B] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-[#193B5B] hover:bg-[#DDEEFF]/40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-black text-[#193B5B]">
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
            <div className="p-4 bg-white/80 border-t border-[rgba(130,170,205,0.2)] space-y-3">

              {/* Delivery Zone Toggle */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#193B5B] block font-mono uppercase">
                  {t("Delivery Area in Bangladesh", "ডেলিভারি এলাকা")}:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-1.5 px-3 rounded-full font-bold transition-all text-center border ${
                      deliveryArea === 'inside'
                        ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white border-transparent shadow-xs'
                        : 'bg-white text-[#193B5B] border-[rgba(130,170,205,0.3)]'
                    }`}
                  >
                    {t("Inside Dhaka", "ঢাকার ভেতরে")} (৳80)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-1.5 px-3 rounded-full font-bold transition-all text-center border ${
                      deliveryArea === 'outside'
                        ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white border-transparent shadow-xs'
                        : 'bg-white text-[#193B5B] border-[rgba(130,170,205,0.3)]'
                    }`}
                  >
                    {t("Outside Dhaka", "ঢাকার বাইরে")} (৳150)
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#718398] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Promo Code (try AZRAQNEW)", "প্রমো কোড লিখুন...")}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white text-xs text-[#193B5B] uppercase font-mono placeholder:normal-case placeholder:font-sans border border-[rgba(130,170,205,0.3)] focus:border-[#70C8ED] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-[#DDEEFF] border border-[rgba(130,170,205,0.3)] text-[#193B5B] text-xs font-bold transition-colors shadow-2xs"
                >
                  {t("Apply", "প্রয়োগ")}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span>{appliedPromo.code} {t("Applied", "প্রযুক্ত")}</span>
                  <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                </div>
              )}

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1 text-xs text-[#718398] pt-2 border-t border-[rgba(130,170,205,0.18)]">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "সাবটোটাল")}</span>
                  <span className="font-bold text-[#193B5B]">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span className="font-bold text-[#193B5B]">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 uppercase font-bold">{t("FREE", "ফ্রি")}</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t("Promo Discount", "ডিসকাউন্ট")}</span>
                    <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#193B5B] pt-1.5 border-t border-[rgba(130,170,205,0.18)]">
                  <span>{t("Estimated Total", "সর্বমোট")}</span>
                  <span className="text-lg text-[#0877C9]">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-between pl-6 pr-2 py-3 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white font-bold text-sm shadow-[0_8px_24px_rgba(112,200,237,0.45)] transition-all active:scale-95 cursor-pointer"
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
