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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">

      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#185ADB]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {t("Shopping Bag", "আপনার শপিং ব্যাগ")}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#185ADB] text-white text-xs font-semibold">
                {totalCartItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-900 mb-1.5">
              <span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                    {t("You unlocked FREE Nationwide Delivery!", "আপনি ফ্রি ডেলিভারি আনলক করেছেন!")}
                  </span>
                ) : (
                  <span>
                    {t("Add", "আরও")} <strong className="text-[#185ADB]">৳{remainingForFreeDelivery.toLocaleString()}</strong> {t("for FREE delivery", "টাকার পণ্যে ফ্রি ডেলিভারি")}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">
                {Math.round(freeDeliveryProgress)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#185ADB] rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-[#185ADB] shadow-2xs">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {t("Your bag is currently empty", "আপনার ব্যাগটি খালি রয়েছে")}
                </p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {t(
                    "Discover everyday essentials curated for modern living in Bangladesh.",
                    "আমাদের কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।"
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {t("Explore Catalog", "পণ্য কালেকশন দেখুন")}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                >
                  {/* Thumbnail (Strictly Contain) */}
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      if (item.product) {
                        navigate(`/product/${generateProductSlug(item.product)}`);
                      }
                    }}
                    className="card-image-wrapper w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden cursor-pointer"
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
                          className="text-xs font-semibold text-slate-900 line-clamp-1 hover:text-[#185ADB] cursor-pointer transition-colors"
                        >
                          {item.product.name.split('—')[1] || item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#185ADB] font-medium">
                        {item.variant}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty Controls */}
                      <div className="flex items-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.variant, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-bold text-slate-900">
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
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">

              {/* Delivery Zone Toggle */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-900 block uppercase tracking-wide">
                  {t("Delivery Area in Bangladesh", "ডেলিভারি এলাকা")}:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-2 px-3 rounded-lg font-semibold transition-colors text-center border ${
                      deliveryArea === 'inside'
                        ? 'bg-[#185ADB] text-white border-[#185ADB] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t("Inside Dhaka", "ঢাকার ভেতরে")} (৳80)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-2 px-3 rounded-lg font-semibold transition-colors text-center border ${
                      deliveryArea === 'outside'
                        ? 'bg-[#185ADB] text-white border-[#185ADB] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t("Outside Dhaka", "ঢাকার বাইরে")} (৳150)
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Promo Code (try AZRAQNEW)", "প্রমো কোড লিখুন...")}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-900 uppercase font-mono placeholder:normal-case placeholder:font-sans border border-slate-200 focus:border-[#185ADB] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white text-xs font-semibold transition-colors"
                >
                  {t("Apply", "প্রয়োগ")}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <span>{appliedPromo.code} {t("Applied", "প্রযুক্ত")}</span>
                  <span>-৳{appliedPromo.discount.toLocaleString()}</span>
                </div>
              )}

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "সাবটোটাল")}</span>
                  <span className="font-semibold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span className="font-semibold text-slate-900">
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
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>{t("Estimated Total", "সর্বমোট")}</span>
                  <span className="text-lg text-[#185ADB]">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-between px-5 py-3 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>{t("PROCEED TO CHECKOUT", "চেকআউট করুন")}</span>
                <span className="w-7 h-7 rounded-md bg-white/20 text-white flex items-center justify-center">
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
