import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, ArrowRight, Banknote, 
  ExternalLink, RefreshCw, AlertCircle, Clock, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { createCheckoutSession, verifyPaymentStatus } from '../services/paymentService';

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
    recordConfirmedOrder,
    setIsTrackingOpen,
    showToast,
    t
  } = useShop();

  const [fullName, setFullName] = useState(() => {
    try { return localStorage.getItem('azraq_customer_name') || ''; } catch (e) { return ''; }
  });
  const [phone, setPhone] = useState(() => {
    try { return localStorage.getItem('azraq_customer_phone') || ''; } catch (e) { return ''; }
  });
  const [address, setAddress] = useState(() => {
    try { return localStorage.getItem('azraq_customer_address') || ''; } catch (e) { return ''; }
  });
  const [city, setCity] = useState('Dhaka');
  const [thana, setThana] = useState('');
  const [notes, setNotes] = useState('');
  
  // Payment methods: 'PAYMENTLY' (Default) | 'COD'
  const [paymentMethod, setPaymentMethod] = useState('PAYMENTLY');

  // Checkout flow state: 'form' | 'gateway_redirect' | 'verifying' | 'success' | 'pending' | 'failed'
  const [checkoutStep, setCheckoutStep] = useState('form');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);
  const [verifiedTransaction, setVerifiedTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
    setPaymentSession(null);
    setCheckoutStep('form');
    setErrorMessage('');
  };

  // Submit checkout & initiate payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      showToast('Please enter a valid 11-digit Bangladeshi mobile number', 'error');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      showToast('Please enter your complete delivery address', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    // Save customer details to localStorage for convenience
    try {
      localStorage.setItem('azraq_customer_name', fullName.trim());
      localStorage.setItem('azraq_customer_phone', phone.trim());
      localStorage.setItem('azraq_customer_address', address.trim());
    } catch (e) {}

    const customerData = {
      name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city,
      thana,
      notes
    };

    try {
      // 1. If Cash on Delivery (COD) explicitly selected
      if (paymentMethod === 'COD') {
        const res = await createCheckoutSession({
          customer: customerData,
          items: cart,
          deliveryArea,
          promoCode: appliedPromo?.code || null,
          paymentMethod: 'COD',
          notes
        });

        setIsSubmitting(false);

        if (res.success && res.order) {
          recordConfirmedOrder(res.order);
          setConfirmedOrder(res.order);
          setCheckoutStep('success');
          triggerConfetti();
          showToast(`Order ${res.order.id} confirmed with Cash on Delivery!`, 'success');
        } else {
          setErrorMessage(res.error || 'Failed to place Cash on Delivery order.');
          setCheckoutStep('failed');
        }
        return;
      }

      // 2. Real Paymently Dynamic Checkout Session Creation
      const session = await createCheckoutSession({
        customer: customerData,
        items: cart,
        deliveryArea,
        promoCode: appliedPromo?.code || null,
        paymentMethod: 'PAYMENTLY',
        notes
      });

      setPaymentSession(session);
      setIsSubmitting(false);
      setCheckoutStep('gateway_redirect');

      // Automatically open the official Paymently checkout session where amount is locked & pre-filled
      if (session.payment_url) {
        window.open(session.payment_url, '_blank');
      }

    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please check gateway configuration or try COD.');
      setCheckoutStep('failed');
    }
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  // Verify Payment Status with Paymently Server API
  const handleVerifyPayment = async () => {
    if (!paymentSession) return;
    setIsSubmitting(true);
    setCheckoutStep('verifying');
    setErrorMessage('');

    try {
      const res = await verifyPaymentStatus({
        invoiceId: paymentSession.invoice_id,
        checkoutId: paymentSession.checkout_id
      });

      setIsSubmitting(false);

      if (res.verified && res.status === 'PAID' && res.order) {
        recordConfirmedOrder(res.order);
        setConfirmedOrder(res.order);
        setVerifiedTransaction(res.transaction);
        setCheckoutStep('success');
        triggerConfetti();
        showToast(t("Payment verified successfully via Paymently!", "পেমেন্ট সফলভাবে ভেরিফাই হয়েছে!"), 'success');
      } else if (res.status === 'PENDING' || res.status === 'AWAITING_PAYMENT') {
        setCheckoutStep('pending');
      } else {
        setErrorMessage(res.error || res.message || t("Payment verification was not completed. Please try again.", "পেমেন্ট ভেরিফিকেশন সম্পন্ন হয়নি।"));
        setCheckoutStep('failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Payment verification encountered an error.');
      setCheckoutStep('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#062B4F]/75 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[#69C5F5]/40 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#062B4F] flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: Main Checkout Form */}
        {checkoutStep === 'form' && (
          <div className="overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#062B4F] via-[#0A3D6E] to-[#062B4F] text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#50DDF0] shadow-[0_0_8px_#50DDF0]" />
                <span className="text-[10px] font-mono tracking-widest text-[#50DDF0] uppercase font-bold">
                  {t("AZRAQ SECURE CHECKOUT • PAYMENTLY", "আজরাক নিরাপদ চেকআউট")}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t("Complete Your Order", "অর্ডার সম্পূর্ণ করুন")}
              </h2>
              <p className="text-xs text-white/75 mt-1">
                {t(
                  "Official BDT Payment Gateway with bKash, Nagad, Rocket, Cards or Cash on Delivery.",
                  "বিকাশ, নগদ, রকেট, কার্ড অথবা ক্যাশ অন ডেলিভারিতে অর্ডার করুন।"
                )}
              </p>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Delivery Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#062B4F] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D9F0FF] text-[#0877C9] flex items-center justify-center text-[10px] font-bold">1</span>
                  {t("Recipient & Delivery Details", "প্রাপক ও ঠিকানার বিবরণ")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#062B4F] block mb-1">
                      {t("Full Name *", "পূর্ণ নাম *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0FF] bg-[#F8FCFF] text-xs text-[#062B4F] focus:outline-none focus:border-[#0877C9]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#062B4F] block mb-1">
                      {t("Phone Number (11 digits) *", "মোবাইল নম্বর *")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0FF] bg-[#F8FCFF] text-xs text-[#062B4F] focus:outline-none focus:border-[#0877C9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#062B4F] block mb-1">
                      {t("City / District *", "শহর / জেলা *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0FF] bg-[#F8FCFF] text-xs text-[#062B4F] focus:outline-none focus:border-[#0877C9]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#062B4F] block mb-1">
                      {t("Delivery Area *", "ডেলিভারি এরিয়া *")}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryArea('inside')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          deliveryArea === 'inside'
                            ? 'border-[#0877C9] bg-[#EBF6FF] text-[#0877C9] shadow-sm'
                            : 'border-[#D9F0FF] bg-[#F8FCFF] text-gray-600'
                        }`}
                      >
                        {t("Inside Dhaka (৳70)", "ঢাকার ভেতর (৳৭০)")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryArea('outside')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          deliveryArea === 'outside'
                            ? 'border-[#0877C9] bg-[#EBF6FF] text-[#0877C9] shadow-sm'
                            : 'border-[#D9F0FF] bg-[#F8FCFF] text-gray-600'
                        }`}
                      >
                        {t("Outside Dhaka (৳130)", "ঢাকার বাইরে (৳১৩০)")}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#062B4F] block mb-1">
                    {t("Detailed Delivery Address *", "সম্পূর্ণ ঠিকানা *")}
                  </label>
                  <textarea
                    required
                    rows="2"
                    placeholder="e.g. House 14, Road 5, Block B, Banani, Dhaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9F0FF] bg-[#F8FCFF] text-xs text-[#062B4F] focus:outline-none focus:border-[#0877C9]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#062B4F] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#D9F0FF] text-[#0877C9] flex items-center justify-center text-[10px] font-bold">2</span>
                    {t("Payment Method", "পেমেন্ট মাধ্যম")}
                  </h3>
                  <span className="text-[10px] text-[#0877C9] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* 1. Paymently Digital Gateway (Recommended) */}
                  <div
                    onClick={() => setPaymentMethod('PAYMENTLY')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'PAYMENTLY'
                        ? 'border-[#0877C9] bg-gradient-to-r from-[#F0F7FF] to-[#E6F3FF] ring-2 ring-[#0877C9]/25 shadow-sm'
                        : 'border-[#D9F0FF] hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs sm:text-sm text-[#062B4F]">
                          Paymently Secure Gateway
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#0877C9] text-white text-[9px] font-bold uppercase">
                          Dynamic
                        </span>
                      </div>
                      <p className="text-[11px] text-[#062B4F]/65">
                        bKash, Nagad, Rocket, Upay, Visa, Mastercard
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="px-2 py-0.5 rounded bg-[#E2136E] text-white font-bold text-[9px]">bKash</span>
                      <span className="px-2 py-0.5 rounded bg-[#F7941D] text-white font-bold text-[9px]">Nagad</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#8C3494] text-white font-bold text-[9px]">Rocket</span>
                    </div>
                  </div>

                  {/* 2. Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-[#062B4F] bg-gray-50 ring-2 ring-[#062B4F]/20 shadow-sm'
                        : 'border-[#D9F0FF] hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs sm:text-sm text-[#062B4F]">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#062B4F]/65">
                        Pay in cash upon physical parcel inspection at doorstep
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Pay on Delivery
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#F0F7FF] via-[#F8FCFF] to-[#F0F7FF] border border-[#D9F0FF] space-y-2.5">
                <div className="text-xs font-bold text-[#062B4F] flex items-center justify-between">
                  <span>{t("Order Items Summary", "অর্ডারের বিবরণ")} ({cart.length})</span>
                  <span>৳{cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] text-[#062B4F]/70 pr-1">
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
                  <div className="flex justify-between text-base font-black text-[#062B4F] pt-1 border-t border-gray-200">
                    <span>{t("Total Payable", "মোট প্রদেয়")}</span>
                    <span className="text-lg text-[#0877C9]">৳{cartTotal.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>

              {/* Action Button: PAY SECURELY NOW */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#062B4F] to-[#0877C9] hover:from-[#0877C9] hover:to-[#062B4F] text-white font-black text-sm tracking-tight shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#50DDF0]" />
                <span>
                  {isSubmitting 
                    ? t("Connecting to Payment Gateway...", "পেমেন্ট গেটওয়েতে যুক্ত হচ্ছে...") 
                    : paymentMethod === 'COD' 
                      ? t("CONFIRM CASH ON DELIVERY", "ক্যাশ অন ডেলিভারিতে অর্ডার করুন")
                      : t("PAY SECURELY WITH PAYMENTLY", "পেমেন্টলিতে নিরাপদে পেমেন্ট করুন")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

        {/* STEP 2: Gateway Redirecting / Awaiting Payment */}
        {checkoutStep === 'gateway_redirect' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-[#EBF6FF] text-[#0877C9] flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <ExternalLink className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[#0877C9] uppercase">
                {t("SECURE GATEWAY REDIRECT", "পেমেন্ট গেটওয়ে পেজ")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {t("Complete Payment on Paymently", "পেমেন্ট সম্পন্ন করুন")}
              </h3>
              <p className="text-xs text-[#062B4F]/70 leading-relaxed">
                {t(
                  "A secure Paymently payment page has been opened. Complete your bKash, Nagad or Card checkout of ৳",
                  "একটি নিরাপদ পেমেন্ট পেইজ ওপেন হয়েছে। আপনার বিকাশ, নগদ বা কার্ডের মাধ্যমে ৳"
                )}
                <strong>{paymentSession?.amount?.toLocaleString() || cartTotal.toLocaleString()} BDT</strong>.
              </p>
            </div>

            {/* Direct Open Link in case popup was blocked */}
            <div className="p-4 rounded-xl bg-[#F8FCFF] border border-[#D9F0FF] max-w-md mx-auto text-xs space-y-3">
              <div className="flex items-center justify-between text-gray-500">
                <span>Invoice: {paymentSession?.invoice_id}</span>
                <span className="font-bold text-[#062B4F]">৳{paymentSession?.amount?.toLocaleString()} BDT</span>
              </div>
              <a
                href={paymentSession?.payment_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0877C9] hover:bg-[#062B4F] text-white font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t("Open Paymently Checkout Page", "পেমেন্ট পেইজ ওপেন করুন")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Verification Button */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <button
                onClick={handleVerifyPayment}
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{t("I Have Completed Payment — Verify Now", "পেমেন্ট সম্পন্ন করেছি — ভেরিফাই করুন")}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-center gap-3">
              <button
                onClick={() => setCheckoutStep('form')}
                className="text-xs text-gray-500 hover:text-[#062B4F] font-semibold"
              >
                ← {t("Change Payment Method", "পেমেন্ট মাধ্যম পরিবর্তন করুন")}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Verifying State */}
        {checkoutStep === 'verifying' && (
          <div className="p-10 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-[#0877C9] animate-spin mx-auto" />
            <h3 className="text-lg font-black text-[#062B4F]">
              {t("Verifying Your Payment Directly With Paymently...", "পেমেন্টলিতে সরাসরি ভেরিফাই করা হচ্ছে...")}
            </h3>
            <p className="text-xs text-[#062B4F]/65 max-w-sm mx-auto">
              {t("Contacting Paymently gateway to independently confirm transaction validity and funds clearance.", "গেটওয়ে থেকে ট্রানজেকশন ও ফান্ডের সত্যতা নিশ্চিত করা হচ্ছে...")}
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESSFUL PAYMENT PAGE */}
        {checkoutStep === 'success' && confirmedOrder && (
          <div className="p-8 sm:p-10 text-center space-y-6 overflow-y-auto">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#0877C9] uppercase">
                {confirmedOrder.payment_method === 'COD' 
                  ? t("ORDER CONFIRMED (CASH ON DELIVERY)", "অর্ডার কনফার্মড (ক্যাশ অন ডেলিভারি)")
                  : t("ORDER CONFIRMED & VERIFIED PAID", "অর্ডার কনফার্মড ও পেমেন্ট ভেরিফাইড")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#062B4F] tracking-tight">
                {t("Thank you for choosing AZRAQ!", "AZRAQ-এ কেনাকাটার জন্য ধন্যবাদ!")}
              </h2>
              <p className="text-xs sm:text-sm text-[#062B4F]/70 max-w-md mx-auto">
                {confirmedOrder.payment_method === 'COD'
                  ? t("Your order has been recorded and will be prepared for doorstep delivery across Bangladesh.", "আপনার অর্ডারটি গ্রহণ করা হয়েছে এবং ডেলিভারির জন্য প্রস্তুত করা হচ্ছে।")
                  : t("Your online payment has been independently verified with Paymently. Your order is now being processed.", "পেমেন্টলি থেকে আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে। অর্ডার প্রসেসিং শুরু হয়েছে।")}
              </p>
            </div>

            {/* Official Invoice & Tracking Receipt Card */}
            <div className="p-5 rounded-2xl bg-[#F8FCFF] border border-[#D9F0FF] max-w-md mx-auto text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#062B4F]/60">{t("Merchant", "মার্চেন্ট")}:</span>
                <span className="text-xs font-black text-[#062B4F]">AZRAQ ({confirmedOrder.gateway_name || 'Paymently BD'})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#062B4F]/60">{t("Order Tracking ID", "অর্ডার ট্র্যাকিং আইডি")}:</span>
                <span className="text-sm font-mono font-extrabold text-[#0877C9]">{confirmedOrder.id}</span>
              </div>
              {confirmedOrder.gateway_transaction_id && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#062B4F]/60">{t("Provider TrxID", "প্রোভাইডার ট্রানজেকশন আইডি")}:</span>
                  <span className="text-xs font-mono font-bold text-[#062B4F]">
                    {confirmedOrder.gateway_transaction_id}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#062B4F]/60">{t("Payment Status", "পেমেন্ট স্ট্যাটাস")}:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {confirmedOrder.payment_status} (৳{confirmedOrder.total?.toLocaleString()} BDT)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#062B4F]/60">{t("Recipient", "প্রাপক")}:</span>
                <span className="text-xs font-bold text-[#062B4F]">
                  {confirmedOrder.customer_name} ({confirmedOrder.customer_phone})
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
                className="flex-1 py-3 px-4 rounded-full bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors shadow-sm"
              >
                {t("Track My Order", "অর্ডার ট্র্যাক করুন")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-full bg-[#0877C9] text-white text-xs font-bold hover:bg-[#062B4F] transition-colors shadow-sm"
              >
                {t("Continue Shopping", "আরও কেনাকাটা করুন")}
              </button>
            </div>

          </div>
        )}

        {/* STEP 5: PENDING PAYMENT VIEW */}
        {checkoutStep === 'pending' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {t("Payment Awaiting Confirmation", "পেমেন্ট কনফার্মেশন অপেক্ষমান")}
              </h3>
              <p className="text-xs text-[#062B4F]/70 max-w-md mx-auto">
                {t(
                  "Paymently has not yet cleared the funds. If you completed the bKash/Nagad step in the gateway tab, click Verify below.",
                  "পেমেন্ট প্রসেসিংয়ে রয়েছে। গেটওয়েতে পেমেন্ট শেষ করার পর নিচের বাটনে ক্লিক করুন।"
                )}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleVerifyPayment}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white text-xs font-bold hover:bg-[#062B4F] transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{t("Check Status Again", "পুনরায় স্ট্যাটাস চেক করুন")}</span>
              </button>
              <button
                onClick={() => setCheckoutStep('form')}
                className="px-6 py-2.5 rounded-full bg-gray-100 text-[#062B4F] text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                {t("Back to Bag", "কার্টে ফিরুন")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: FAILED / CANCELLED PAYMENT VIEW */}
        {checkoutStep === 'failed' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {t("Payment Was Not Completed", "পেমেন্ট সম্পন্ন হয়নি")}
              </h3>
              <p className="text-xs text-rose-600 max-w-md mx-auto font-medium">
                {errorMessage || t("The payment was cancelled or timed out. Your items are safe in your shopping bag.", "পেমেন্ট বাতিল হয়েছে। আপনার পণ্যগুলো কার্টে সংরক্ষিত আছে।")}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCheckoutStep('form')}
                className="px-6 py-2.5 rounded-full bg-[#062B4F] text-white text-xs font-bold hover:bg-[#0877C9] transition-colors"
              >
                {t("Retry Checkout / Choose COD", "পুনরায় চেষ্টা করুন")}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-gray-100 text-[#062B4F] text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                {t("Close", "বন্ধ")}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
