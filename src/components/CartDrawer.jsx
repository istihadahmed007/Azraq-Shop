import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Modern Editorial Cart Drawer (The Everyday Edit)
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#172333]/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">

      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E5E3DA] shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5E3DA] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#245BDB]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#172333] tracking-tight">
                {t("Shopping Bag", "আপনার শপিং ব্যাগ")}
              </h2>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#245BDB] text-white text-xs font-bold">
                {totalCartItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] text-[#172333] hover:text-[#245BDB]"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="p-3.5 bg-[#FAF9F5] border-b border-[#E5E3DA] text-xs">
            <div className="flex items-center justify-between font-bold text-[#172333] mb-1.5">
              <span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                    {t("You unlocked FREE Nationwide Delivery!", "আপনি ফ্রি ডেলিভারি আনলক করেছেন!")}
                  </span>
                ) : (
                  <span>
                    {t("Add", "আরও")} <strong className="text-[#245BDB]">৳{remainingForFreeDelivery.toLocaleString()}</strong> {t("for FREE delivery", "টাকার পণ্যে ফ্রি ডেলিভারি")}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#667085] font-mono font-bold">
                {Math.round(freeDeliveryProgress)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-[2px] bg-[#E5E3DA] overflow-hidden">
              <div
                className="h-full bg-[#245BDB] rounded-[2px] transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3.5">
                <div className="w-14 h-14 rounded-[8px] bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center mx-auto text-[#245BDB]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-[#172333]">
                  {t("Your bag is currently empty", "আপনার ব্যাগটি খালি রয়েছে")}
                </p>
                <p className="text-xs text-[#667085] max-w-xs mx-auto leading-relaxed">
                  {t(
                    "Discover everyday essentials curated for modern living in Bangladesh.",
                    "আমাদের কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।"
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-[8px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  {t("Explore Catalog", "পণ্য কালেকশন দেখুন")}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-3 p-3 rounded-[8px] bg-[#FAF9F5] border border-[#E5E3DA] shadow-xs"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      if (item.product) {
                        navigate(`/product/${generateProductSlug(item.product)}`);
                      }
                    }}
                    className="w-16 h-16 rounded-[6px] bg-white border border-[#E5E3DA] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden cursor-pointer shadow-xs"
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
                          className="text-xs font-bold text-[#172333] line-clamp-1 hover:text-[#245BDB] cursor-pointer transition-colors"
                        >
                          {item.product.name.split('—')[1] || item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-[#8C99A8] hover:text-[#CF1322] transition-colors p-1"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#245BDB] font-semibold">
                        {item.variant}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty Controls */}
                      <div className="flex items-center bg-white rounded-[4px] overflow-hidden border border-[#E5E3DA]">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#172333] hover:bg-[#FAF9F5]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#172333]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#172333] hover:bg-[#FAF9F5]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-extrabold text-[#172333]">
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
            <div className="p-4 bg-white border-t border-[#E5E3DA] space-y-3">

              {/* Delivery Zone Toggle */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#172333] block">
                  {t("Delivery Area in Bangladesh", "ডেলিভারি এলাকা")}:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-1.5 px-3 rounded-[6px] font-bold transition-all text-center border ${deliveryArea === 'inside'
                      ? 'bg-[#172333] text-white border-[#172333] shadow-xs'
                      : 'bg-[#FAF9F5] text-[#172333] border-[#E5E3DA]'
                      }`}
                  >
                    {t("Inside Dhaka", "ঢাকার ভেতরে")} (৳80)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-1.5 px-3 rounded-[6px] font-bold transition-all text-center border ${deliveryArea === 'outside'
                      ? 'bg-[#172333] text-white border-[#172333] shadow-xs'
                      : 'bg-[#FAF9F5] text-[#172333] border-[#E5E3DA]'
                      }`}
                  >
                    {t("Outside Dhaka", "ঢাকার বাইরে")} (৳150)
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8C99A8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Promo Code (try AZRAQNEW)", "প্রমো কোড লিখুন...")}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-[6px] bg-[#FAF9F5] text-xs text-[#172333] uppercase font-mono placeholder:normal-case placeholder:font-sans border border-[#E5E3DA] focus:border-[#245BDB] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-[6px] bg-[#FAF9F5] hover:bg-[#172333] hover:text-white border border-[#E5E3DA] text-[#172333] text-xs font-bold transition-colors"
                >
                  {t("Apply", "প্রয়োগ")}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[4px] border border-emerald-200">
                  <span>{appliedPromo.code} {t("Applied", "প্রযুক্ত")}</span>
                  <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                </div>
              )}

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1 text-xs text-[#667085] pt-2 border-t border-[#E5E3DA]">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "সাবটোটাল")}</span>
                  <span className="font-bold text-[#172333]">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span className="font-bold text-[#172333]">
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
                <div className="flex justify-between text-base font-extrabold text-[#172333] pt-1.5 border-t border-[#E5E3DA]">
                  <span>{t("Estimated Total", "সর্বমোট")}</span>
                  <span className="text-lg text-[#245BDB]">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-between pl-5 pr-2 py-3 rounded-[8px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white font-bold text-sm shadow-xs transition-all active:scale-95"
              >
                <span>{t("PROCEED TO CHECKOUT", "চেকআউট করুন")}</span>
                <span className="w-7 h-7 rounded-[6px] bg-white text-[#245BDB] flex items-center justify-center shadow-xs">
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
