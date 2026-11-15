import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ArrowRight, CreditCard, Banknote, Smartphone, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export default function CheckoutModal() {
  const {
    cart,
    cartSubtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryFee,
    appliedPromo,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    setIsTrackingOpen,
    showToast,
    t
  } = useShop();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [thana, setThana] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'bKash' | 'Nagad'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      showToast('Please enter a valid 11-digit Bangladeshi mobile number', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Please enter your complete delivery address', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        name: fullName,
        phone,
        address,
        city,
        thana,
        notes,
        area: deliveryArea
      }, paymentMethod);

      setConfirmedOrder(order);
      setIsSubmitting(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      showToast(`Order ${order.id} confirmed!`, 'success');
    }, 700);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-azraq-navy/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-azraq-purple/20 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-azraq-navy flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedOrder ? (
          <div>
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-azraq-navy to-azraq-charcoal text-white">
              <span className="text-[10px] font-mono tracking-widest text-azraq-lime uppercase">
                {t("SECURE BANGLADESH CHECKOUT", "নিরাপদ চেকআউট")}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {t("Complete Your Order", "অর্ডার সম্পূর্ণ করুন")}
              </h2>
              <p className="text-xs text-white/70 mt-1">
                {t(
                  "Cash on Delivery or Instant Mobile Payment. Free delivery on orders over ৳3,000.",
                  "ক্যাশ অন ডেলিভারি অথবা মোবাইল পেমেন্ট। ৩,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি।"
                )}
              </p>
            </div>

            {/* Form & Summary */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Delivery Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-azraq-navy flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-[10px]">1</span>
                  {t("Recipient & Delivery Details", "প্রাপক ও ঠিকানার বিবরণ")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-azraq-navy block mb-1">
                      {t("Full Name *", "পূর্ণ নাম *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-azraq-navy focus:outline-none focus:border-azraq-violet"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-azraq-navy block mb-1">
                      {t("Phone Number (11 digits) *", "মোবাইল নম্বর *")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-azraq-navy font-mono focus:outline-none focus:border-azraq-violet"
                    />
                  </div>
                </div>

                {/* Delivery Zone Radio Selector */}
                <div>
                  <label className="text-[11px] font-bold text-azraq-navy block mb-1.5">
                    {t("Delivery Area *", "ডেলিভারি এলাকা *")}
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <label 
                      onClick={() => setDeliveryArea('inside')}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        deliveryArea === 'inside'
                          ? 'border-azraq-navy bg-azraq-cloud ring-2 ring-azraq-navy/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-azraq-navy">{t("Inside Dhaka", "ঢাকার ভেতরে")}</p>
                        <p className="text-[10px] text-gray-500">24-48 hrs delivery</p>
                      </div>
                      <span className="font-bold text-azraq-navy">৳70</span>
                    </label>

                    <label 
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        deliveryArea === 'outside'
                          ? 'border-azraq-navy bg-azraq-cloud ring-2 ring-azraq-navy/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-azraq-navy">{t("Outside Dhaka", "ঢাকার বাইরে")}</p>
                        <p className="text-[10px] text-gray-500">48-72 hrs delivery</p>
                      </div>
                      <span className="font-bold text-azraq-navy">৳130</span>
                    </label>
                  </div>
                </div>

                {/* Address & Thana */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-azraq-navy block mb-1">
                      {t("Street Address / House / Flat *", "পূর্ণ ঠিকানা *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 42, Road 11, Banani"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-azraq-navy focus:outline-none focus:border-azraq-violet"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-azraq-navy block mb-1">
                      {t("Thana / District", "থানা / জেলা")}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan / Dhaka"
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-azraq-navy focus:outline-none focus:border-azraq-violet"
                    />
                  </div>
                </div>

              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-azraq-navy flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-[10px]">2</span>
                  {t("Payment Method", "পেমেন্ট মাধ্যম")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-azraq-navy bg-azraq-cloud ring-2 ring-azraq-navy/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-azraq-navy">Cash on Delivery</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      Pay with cash upon physical parcel inspection
                    </p>
                  </div>

                  {/* bKash */}
                  <div
                    onClick={() => setPaymentMethod('bKash')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'bKash'
                        ? 'border-[#E2136E] bg-[#E2136E]/5 ring-2 ring-[#E2136E]/30'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#E2136E]" />
                      <span className="font-bold text-[#E2136E]">bKash Payment</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      Instant mobile wallet verification
                    </p>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'Nagad'
                        ? 'border-[#F7941D] bg-[#F7941D]/5 ring-2 ring-[#F7941D]/30'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#F7941D]" />
                      <span className="font-bold text-[#F7941D]">Nagad MFS</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      Zero fee digital checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items Preview & Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-azraq-cloud border border-azraq-purple/20 space-y-3">
                <div className="text-xs font-bold text-azraq-navy flex items-center justify-between">
                  <span>{t("Order Items Summary", "অর্ডারের বিবরণ")} ({cart.length})</span>
                  <span>৳{cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] text-azraq-navy/70 pr-1">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate max-w-[280px]">
                        {item.quantity}x {item.product.name.split('—')[1] || item.product.name} ({item.variant})
                      </span>
                      <span className="font-mono">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>{t("Delivery Charge", "ডেলিভারি চার্জ")}</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo ({appliedPromo.code})</span>
                      <span>-৳{appliedPromo.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-azraq-navy pt-1 border-t border-gray-200">
                    <span>{t("Total Payable", "মোট প্রদেয়")}</span>
                    <span className="text-lg">৳{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#062B4F] hover:bg-[#0877C9] text-white font-black text-sm tracking-tight shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t("Processing Order...", "অর্ডার প্রসেস হচ্ছে...")}</span>
                ) : (
                  <>
                    <span>{t("Confirm Order", "অর্ডার কনফার্ম করুন")} (৳{cartTotal.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-azraq-violet uppercase">
                {t("ORDER PLACED SUCCESSFULLY", "অর্ডার সফলভাবে গৃহীত হয়েছে")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-azraq-navy tracking-tight">
                {t("Thank you for your order!", "ধন্যবাদ আপনার অর্ডারের জন্য!")}
              </h2>
              <p className="text-xs sm:text-sm text-azraq-navy/70 max-w-md mx-auto">
                {t(
                  "We have received your request. Your curated items are being prepared for dispatch via our official logistics network in Bangladesh.",
                  "আপনার অর্ডারটি নিশ্চিত করা হয়েছে। খুব শীঘ্রই ডেলিভারি প্রতিনিধির মাধ্যমে আপনার ঠিকানায় পৌঁছে যাবে।"
                )}
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-5 rounded-2xl bg-azraq-cloud border border-azraq-purple/30 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-azraq-navy/60">
                  {t("Order Tracking ID", "অর্ডার ট্র্যাকিং আইডি")}:
                </span>
                <span className="text-sm font-mono font-extrabold text-azraq-violet">
                  {confirmedOrder.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-azraq-navy/60">
                  {t("Courier Partner", "কুরিয়ার পার্টনার")}:
                </span>
                <span className="text-xs font-bold text-azraq-navy">
                  Steadfast Courier BD ({confirmedOrder.courierTracking})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-azraq-navy/60">
                  {t("Payment Method", "পেমেন্ট মাধ্যম")}:
                </span>
                <span className="text-xs font-bold text-azraq-navy">
                  {confirmedOrder.paymentMethod} (৳{confirmedOrder.total.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-azraq-navy/60">
                  {t("Dropship Fulfilment Code", "ড্রপশিপ পার্টনার কোড")}:
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {confirmedOrder.easyDropOrderId}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => {
                  handleClose();
                  setIsTrackingOpen(true);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-azraq-navy text-white text-xs font-bold hover:bg-azraq-charcoal transition-colors"
              >
                {t("Track This Order", "অর্ডার ট্র্যাক করুন")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-full bg-[#0877C9] text-white text-xs font-bold hover:bg-[#062B4F] transition-colors"
              >
                {t("Continue Shopping", "আরও কেনাকাটা করুন")}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

