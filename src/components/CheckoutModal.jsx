import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, ArrowRight, Banknote, 
  ExternalLink, RefreshCw, AlertCircle, Clock, ChevronRight,
  Copy, Check, Lock, AlertTriangle, ShoppingBag, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { 
  createCheckoutSession, 
  verifyPaymentStatus, 
  cancelCheckout,
  isTrustedPaymentUrl,
  formatBdtAmount,
  isStoreMaintenanceError
} from '../services/paymentService';

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

  // Form inputs
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
  
  // Payment method: 'PAYMENTLY' | 'COD'
  const [paymentMethod, setPaymentMethod] = useState('PAYMENTLY');

  // Checkout flow state: 'form' | 'handoff' | 'verifying' | 'paid_success' | 'pending_verification' | 'failed'
  const [checkoutStep, setCheckoutStep] = useState('form');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);
  const [verifiedTransaction, setVerifiedTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [pendingNotice, setPendingNotice] = useState('');
  const [manualTrxId, setManualTrxId] = useState('');
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedAmount, setIsCopiedAmount] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Auto-verify when redirected back from payment gateway
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment_status');
      const checkoutId = params.get('checkout_id');
      if (checkoutId) {
        if (paymentStatus === 'cancelled') {
          setErrorCode('CANCELLED');
          setErrorMessage(t("You cancelled the payment on Paymently. Your cart items are preserved.", "পেমেন্ট বাতিল করা হয়েছে। আপনার কার্টের পণ্যগুলো সংরক্ষিত আছে।"));
          setCheckoutStep('failed');
          window.history.replaceState({}, '', window.location.pathname);
        } else if (paymentStatus === 'verifying') {
          setCheckoutStep('verifying');
          verifyPaymentStatus({ checkoutId }).then(res => {
            if (res.verified === true && res.status === 'PAID' && res.order) {
              recordConfirmedOrder(res.order);
              setConfirmedOrder(res.order);
              setVerifiedTransaction(res.transaction);
              setCheckoutStep('paid_success');
              try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
              showToast(t("Payment verified successfully via Paymently!", "পেমেন্ট সফলভাবে ভেরিফাই হয়েছে!"), 'success');
            } else if (res.status === 'PENDING' || res.status === 'AWAITING_PAYMENT') {
              setPendingNotice(t("Payment has not yet cleared on Paymently. If you completed payment in your mobile wallet, please wait 30 seconds and click Check Again, or submit your TrxID below.", "পেমেন্টলি থেকে পেমেন্ট এখনো ক্লিয়ার হয়নি। অনুগ্রহ করে অপেক্ষা করে পুনরায় চেক করুন বা নিচে TrxID দিন।"));
              setPaymentSession({ checkout_id: checkoutId, invoice_id: res.gateway_invoice_id || checkoutId, amount: res.total_payable });
              setCheckoutStep('handoff');
            } else {
              setErrorMessage(res.error || res.message || t("Payment could not be verified by the provider.", "পেমেন্ট ভেরিফাই করা যায়নি।"));
              setCheckoutStep('failed');
            }
            window.history.replaceState({}, '', window.location.pathname);
          }).catch(err => {
            setErrorMessage(err.message || t("Could not reach verification service. Please try clicking 'Check payment status' again.", "ভেরিফিকেশন সার্ভিসের সাথে যোগাযোগ করা যায়নি।"));
            setCheckoutStep('failed');
          });
        }
      }
    } catch (e) {}
  }, []);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
    setPaymentSession(null);
    setManualTrxId('');
    setCheckoutStep('form');
    setErrorMessage('');
    setErrorCode('');
    setPendingNotice('');
    setShowCancelConfirm(false);
  };

  // Copy reference / invoice ID with accessible feedback
  const handleCopyId = () => {
    const idToCopy = paymentSession?.invoice_id || paymentSession?.checkout_id || '';
    if (!idToCopy) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idToCopy);
    }
    setIsCopiedId(true);
    showToast(t("Reference ID copied to clipboard!", "রেফারেন্স আইডি কপি করা হয়েছে!"), 'success');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  // Copy exact payable amount
  const handleCopyAmount = () => {
    const amt = String(paymentSession?.amount || cartTotal);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(amt);
    }
    setIsCopiedAmount(true);
    showToast(t("Amount copied to clipboard!", "টাকার পরিমাণ কপি করা হয়েছে!"), 'success');
    setTimeout(() => setIsCopiedAmount(false), 2000);
  };

  // Validate form before submitting
  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = t("Full name is required", "পূর্ণ নাম আবশ্যক");
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      errors.phone = t("Enter an 11-digit mobile number (e.g. 017XXXXXXXX)", "১১ ডিজিটের মোবাইল নম্বর দিন");
    }
    if (!address.trim() || address.trim().length < 5) {
      errors.address = t("Detailed delivery address is required (min 5 characters)", "সম্পূর্ণ ঠিকানা দিন (কমপক্ষে ৫ অক্ষর)");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPendingNotice('');

    if (!validateForm()) {
      showToast(t("Please fix the errors in the form", "অনুগ্রহ করে ফর্মের ভুলগুলো সংশোধন করুন"), 'error');
      return;
    }

    if (cart.length === 0) {
      showToast(t("Your shopping cart is empty", "আপনার কার্ট খালি"), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem('azraq_customer_name', fullName.trim());
      localStorage.setItem('azraq_customer_phone', phone.trim());
      localStorage.setItem('azraq_customer_address', address.trim());
    } catch (e) {}

    const customerData = {
      name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim() || 'Dhaka',
      thana: thana.trim() || null,
      notes: notes.trim() || ''
    };

    try {
      // 1. Cash on Delivery (COD) path
      if (paymentMethod === 'COD') {
        const res = await createCheckoutSession({
          customer: customerData,
          items: cart,
          deliveryArea,
          promoCode: appliedPromo?.code || null,
          paymentMethod: 'COD',
          notes: notes.trim()
        });

        setIsSubmitting(false);

        if (res.success && res.order) {
          recordConfirmedOrder(res.order);
          setConfirmedOrder(res.order);
          setCheckoutStep('pending_verification'); // Explicit COD marked PENDING_COD
          showToast(t(`Order ${res.order.id} confirmed with Cash on Delivery!`, `অর্ডার ${res.order.id} ক্যাশ অন ডেলিভারিতে গৃহীত হয়েছে!`), 'success');
        } else {
          setErrorMessage(res.error || t("Failed to place Cash on Delivery order.", "ক্যাশ অন ডেলিভারিতে অর্ডার গ্রহণ করা যায়নি।"));
          setCheckoutStep('failed');
        }
        return;
      }

      // 2. Paymently Online Gateway Session Creation
      const session = await createCheckoutSession({
        customer: customerData,
        items: cart,
        deliveryArea,
        promoCode: appliedPromo?.code || null,
        paymentMethod: 'PAYMENTLY',
        notes: notes.trim()
      });

      setIsSubmitting(false);

      if (session.success) {
        setPaymentSession(session);
        if (session.payment_url && isTrustedPaymentUrl(session.payment_url)) {
          showToast(t("Redirecting to Paymently secure checkout...", "পেমেন্টলি পেমেন্ট পেইজে নিয়ে যাওয়া হচ্ছে..."), 'info');
          try {
            sessionStorage.setItem('azraq_active_checkout_id', session.checkout_id);
            if (session.invoice_id) sessionStorage.setItem('azraq_active_invoice_id', session.invoice_id);
          } catch (e) {}

          // Immediately transfer directly to the gateway payment link
          window.location.href = session.payment_url;
          return;
        }

        setCheckoutStep('handoff'); // Fallback only if no direct URL returned
      } else {
        setErrorCode(session.code || 'GATEWAY_ERROR');
        setErrorMessage(session.error || t("Unable to initiate payment session. Please retry or choose Cash on Delivery.", "পেমেন্ট সেশন শুরু করা যায়নি।"));
        setCheckoutStep('failed');
      }

    } catch (err) {
      setIsSubmitting(false);
      setErrorCode(err.code || '');
      const isMaint = isStoreMaintenanceError(err);
      if (isMaint) {
        setErrorMessage(t(
          "Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.",
          "রক্ষণাবেক্ষণের কারণে চেকআউট সাময়িকভাবে অনুপলব্ধ রয়েছে। আপনার পণ্যগুলো কার্টে সংরক্ষিত আছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা কাস্টমার সার্ভিসে যোগাযোগ করুন।"
        ));
      } else {
        setErrorMessage(err.message || t("Payment initiation failed. Please check your connection or choose COD.", "পেমেন্ট শুরু করা যায়নি।"));
      }
      setCheckoutStep('failed');
    }
  };

  // Safe external payment link opener
  const handleOpenPaymentPortal = () => {
    if (!paymentSession?.payment_url) return;
    if (!isTrustedPaymentUrl(paymentSession.payment_url)) {
      showToast(t("Untrusted payment URL detected. Link blocked for security.", "নিরাপত্তাজনিত কারণে লিংকটি ব্লক করা হয়েছে।"), 'error');
      return;
    }
    window.location.href = paymentSession.payment_url;
  };

  // Check payment status with backend & Paymently
  const handleCheckStatus = async () => {
    if (!paymentSession) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setPendingNotice('');

    const checkoutSnapshot = {
      customer: {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city,
        thana
      },
      items: cart,
      deliveryArea,
      promoCode: appliedPromo?.code || null,
      notes: notes.trim()
    };

    try {
      const res = await verifyPaymentStatus({
        invoiceId: paymentSession.invoice_id,
        checkoutId: paymentSession.checkout_id,
        manualTrxId: null,
        checkoutSnapshot
      });

      setIsSubmitting(false);

      // ONLY treat as paid success when verified is explicitly true and status is PAID!
      if (res.verified === true && res.status === 'PAID' && res.order) {
        recordConfirmedOrder(res.order);
        setConfirmedOrder(res.order);
        setVerifiedTransaction(res.transaction);
        setCheckoutStep('paid_success');
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
        showToast(t("Payment verified successfully via Paymently!", "পেমেন্ট সফলভাবে ভেরিফাই হয়েছে!"), 'success');
      } else if (res.status === 'PENDING' || res.status === 'AWAITING_PAYMENT') {
        // Clear pending notice: do NOT mark as paid!
        setPendingNotice(
          t(
            "Payment has not yet cleared on Paymently. If you completed payment in your bKash/Nagad app, please wait 30 seconds and click Check Again, or submit your TrxID below.",
            "পেমেন্টলি থেকে পেমেন্ট ক্লিয়ারেন্স এখনো পাওয়া যায়নি। আপনি যদি পেমেন্ট করে থাকেন তবে ৩০ সেকেন্ড অপেক্ষা করে পুনরায় চেক করুন বা নিচে TrxID দিন।"
          )
        );
      } else if (res.status === 'FAILED' || res.status === 'CANCELLED') {
        setErrorMessage(res.message || res.error || t("Payment was cancelled or rejected by the provider.", "পেমেন্ট বাতিল হয়েছে।"));
        setCheckoutStep('failed');
      } else {
        setPendingNotice(
          res.message || t("Payment verification pending. If you paid via merchant link, please submit your TrxID.", "পেমেন্ট ভেরিফিকেশন অপেক্ষমান।")
        );
      }
    } catch (err) {
      setIsSubmitting(false);
      setPendingNotice(
        t("Could not reach verification service. Please try clicking 'Check payment status' again.", "ভেরিফিকেশন সার্ভিসের সাথে যোগাযোগ করা যায়নি। পুনরায় চেষ্টা করুন।")
      );
    }
  };

  // Customer manual TrxID submission (creates order marked PENDING_VERIFICATION)
  const handleManualTrxSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanTrx = manualTrxId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 4) {
      showToast(t("Please enter a valid Transaction ID (min 4 characters)", "অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিন (কমপক্ষে ৪ অক্ষর)"), 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setPendingNotice('');

    const checkoutSnapshot = {
      customer: {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city,
        thana
      },
      items: cart,
      deliveryArea,
      promoCode: appliedPromo?.code || null,
      notes: notes.trim()
    };

    try {
      const res = await verifyPaymentStatus({
        invoiceId: paymentSession?.invoice_id,
        checkoutId: paymentSession?.checkout_id,
        manualTrxId: cleanTrx,
        checkoutSnapshot
      });

      setIsSubmitting(false);

      if (res.order) {
        recordConfirmedOrder(res.order);
        setConfirmedOrder(res.order);
        setVerifiedTransaction(res.transaction);
        // If provider verified it as paid:
        if (res.verified === true && res.status === 'PAID') {
          setCheckoutStep('paid_success');
          try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
        } else {
          // Keep strictly as PENDING_VERIFICATION (never claim paid!)
          setCheckoutStep('pending_verification');
        }
        showToast(
          res.status === 'PAID'
            ? t("Payment verified successfully!", "পেমেন্ট সফলভাবে ভেরিফাই হয়েছে!")
            : t("Order placed! Awaiting merchant verification.", "অর্ডার গ্রহণ করা হয়েছে! ভেরিফিকেশন অপেক্ষমান।"),
          'success'
        );
      } else {
        setErrorMessage(res.error || t("Could not confirm transaction. Please verify your TrxID.", "ট্রানজেকশন নিশ্চিত করা যায়নি।"));
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || t("Failed to submit transaction reference.", "ট্রানজেকশন আইডি জমা দেওয়া যায়নি।"));
    }
  };

  // Direct 1-click Cash on Delivery from failed or handoff screen
  const handleDirectCod = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await createCheckoutSession({
        customer: {
          name: fullName || 'Valued Customer',
          phone: phone || '01700000000',
          address: address || 'Dhaka',
          city: city || 'Dhaka',
          thana: thana || ''
        },
        items: cart,
        deliveryArea,
        promoCode: appliedPromo?.code || null,
        paymentMethod: 'COD',
        notes: notes.trim()
      });
      setIsSubmitting(false);
      if (res.success && res.order) {
        recordConfirmedOrder(res.order);
        setConfirmedOrder(res.order);
        setCheckoutStep('pending_verification'); // COD order placed
        showToast(t(`Order ${res.order.id} confirmed with Cash on Delivery!`, `অর্ডার ${res.order.id} ক্যাশ অন ডেলিভারিতে সফল হয়েছে!`), 'success');
      } else {
        setErrorCode(res.code || 'COD_FAILED');
        setErrorMessage(res.error || t("Failed to place Cash on Delivery order.", "ক্যাশ অন ডেলিভারিতে অর্ডার গ্রহণ করা যায়নি।"));
        setCheckoutStep('failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorCode(err.code || '');
      const isMaint = isStoreMaintenanceError(err);
      if (isMaint) {
        setErrorMessage(t(
          "Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.",
          "রক্ষণাবেক্ষণের কারণে চেকআউট সাময়িকভাবে অনুপলব্ধ রয়েছে। আপনার পণ্যগুলো কার্টে সংরক্ষিত আছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা কাস্টমার সার্ভিসে যোগাযোগ করুন।"
        ));
      } else {
        setErrorMessage(err.message || t("Failed to place Cash on Delivery order.", "ক্যাশ অন ডেলিভারিতে অর্ডার গ্রহণ করা যায়নি।"));
      }
      setCheckoutStep('failed');
    }
  };

  // Cancel checkout with confirmation
  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    try {
      if (paymentSession) {
        await cancelCheckout({
          checkoutId: paymentSession.checkout_id,
          invoiceId: paymentSession.invoice_id
        });
      }
    } catch (e) {}
    setIsSubmitting(false);
    setShowCancelConfirm(false);
    setPaymentSession(null);
    setCheckoutStep('form');
    showToast(t("Checkout session cancelled. Your cart is preserved.", "সেশন বাতিল হয়েছে। আপনার কার্ট সংরক্ষিত আছে।"), 'info');
  };

  const displayTotal = paymentSession?.amount ? formatBdtAmount(paymentSession.amount) : formatBdtAmount(cartTotal);

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#062B4F]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Modal Surface */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92dvh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accessible live region for status announcements */}
        <div className="sr-only" aria-live="polite">
          {isCopiedId && t("Reference ID copied to clipboard", "রেফারেন্স আইডি কপি হয়েছে")}
          {isCopiedAmount && t("Amount copied to clipboard", "টাকার পরিমাণ কপি হয়েছে")}
          {errorMessage && errorMessage}
          {pendingNotice && pendingNotice}
        </div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#101C35] text-white border-b border-[#183B70]">
          <div className="flex items-center gap-2.5">
            <img src="/branding/azraq-icon.png" alt="AZRAQ Shop" className="w-5 h-5 object-contain shrink-0" />
            <h2 id="checkout-modal-title" className="text-xs font-mono font-bold tracking-wider text-[#D9F0FF] uppercase">
              AZRAQ • {t("SECURE CHECKOUT", "নিরাপদ চেকআউট")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label={t("Close checkout", "বন্ধ করুন")}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ==================================================================== */}
        {/* STEP 1: CUSTOMER & DELIVERY DETAILS FORM                             */}
        {/* ==================================================================== */}
        {checkoutStep === 'form' && (
          <div className="overflow-y-auto flex-1">
            <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-[#062B4F]">
                {t("Complete Your Order", "অর্ডার সম্পন্ন করুন")}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {t(
                  "Pay securely with bKash, Nagad, Rocket, or Card via Paymently, or choose Cash on Delivery.",
                  "বিকাশ, নগদ, রকেট, কার্ড অথবা ক্যাশ অন ডেলিভারিতে অর্ডার করুন।"
                )}
              </p>
            </div>

            {errorMessage && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5" noValidate>
              
              {/* Section 1: Customer Details */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#062B4F] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0877C9] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                    {t("Delivery Details", "ডেলিভারি বিবরণ")}
                  </span>
                  <span className="text-[11px] text-slate-500">* {t("Required", "বাধ্যতামূলক")}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="customer-name" className="block text-xs font-semibold text-[#062B4F] mb-1">
                      {t("Full Name", "পূর্ণ নাম")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      placeholder="e.g. Istihad Ahmed"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: null }));
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs text-[#062B4F] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                        formErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#062B4F] mb-1">
                      {t("Mobile Number", "মোবাইল নম্বর")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs text-[#062B4F] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="customer-city" className="block text-xs font-semibold text-[#062B4F] mb-1">
                      {t("City / District", "শহর / জেলা")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-city"
                      type="text"
                      required
                      placeholder="e.g. Dhaka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#062B4F] bg-white focus:outline-none focus:ring-2 focus:ring-[#0877C9]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#062B4F] mb-1">
                      {t("Delivery Area", "ডেলিভারি এরিয়া")}
                    </span>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("Delivery Area", "ডেলিভারি এরিয়া")}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={deliveryArea === 'inside'}
                        onClick={() => setDeliveryArea('inside')}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                          deliveryArea === 'inside'
                            ? 'border-[#0877C9] bg-[#EBF6FF] text-[#0877C9] shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t("Inside Dhaka (৳70)", "ঢাকার ভেতর (৳৭০)")}
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={deliveryArea === 'outside'}
                        onClick={() => setDeliveryArea('outside')}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                          deliveryArea === 'outside'
                            ? 'border-[#0877C9] bg-[#EBF6FF] text-[#0877C9] shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t("Outside Dhaka (৳130)", "ঢাকার বাইরে (৳১৩০)")}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-address" className="block text-xs font-semibold text-[#062B4F] mb-1">
                    {t("Detailed Delivery Address", "সম্পূর্ণ ঠিকানা")} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="customer-address"
                    required
                    rows="2"
                    placeholder="House / Flat #, Road #, Area, Landmarks"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-[#062B4F] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                      formErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>
                  )}
                </div>
              </div>

              {/* Section 2: Payment Method */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#062B4F] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0877C9] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                    {t("Payment Method", "পেমেন্ট মাধ্যম")}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Protection</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label={t("Payment Method", "পেমেন্ট মাধ্যম")}>
                  {/* Option 1: Paymently Digital Gateway */}
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={paymentMethod === 'PAYMENTLY'}
                    onClick={() => setPaymentMethod('PAYMENTLY')}
                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setPaymentMethod('PAYMENTLY')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                      paymentMethod === 'PAYMENTLY'
                        ? 'border-[#0877C9] bg-gradient-to-br from-[#F4FAFF] to-[#EBF6FF] ring-1 ring-[#0877C9]'
                        : 'border-slate-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#062B4F]">
                          Paymently Gateway
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0877C9] text-white">
                          Online
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        bKash, Nagad, Rocket, Upay & Cards
                      </p>
                    </div>

                    <div className="flex items-center gap-1 pt-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#E2136E] text-white font-bold text-[9px]">bKash</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#F7941D] text-white font-bold text-[9px]">Nagad</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#8C3494] text-white font-bold text-[9px]">Rocket</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold text-[9px]">Cards</span>
                    </div>
                  </div>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={paymentMethod === 'COD'}
                    onClick={() => setPaymentMethod('COD')}
                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setPaymentMethod('COD')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#0877C9] ${
                      paymentMethod === 'COD'
                        ? 'border-[#062B4F] bg-slate-50 ring-1 ring-[#062B4F]'
                        : 'border-slate-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#062B4F] flex items-center gap-1.5">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cash on Delivery</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                          Doorstep
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Pay in cash when parcel is delivered
                      </p>
                    </div>

                    <div className="pt-2.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Zero Advance Fee
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>{t("Subtotal", "সাবটোটাল")} ({cart.length} {t("items", "আইটেম")})</span>
                  <span className="font-medium">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t("Delivery Fee", "ডেলিভারি চার্জ")}</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span>-৳{appliedPromo.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-[#062B4F]">
                  <span>{t("Total Payable", "মোট প্রদেয়")}</span>
                  <span className="text-base text-[#0877C9]">{formatBdtAmount(cartTotal)}</span>
                </div>
              </div>

              {/* Form Primary Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0877C9] focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t("Processing...", "প্রসেসিং হচ্ছে...")}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'COD'
                        ? t("Confirm Order via Cash on Delivery", "ক্যাশ অন ডেলিভারিতে কনফার্ম করুন")
                        : t("Proceed to Paymently Checkout", "পেমেন্টলি চেকআউটে এগিয়ে যান")}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 2: REDESIGNED PAYMENT HANDOFF SCREEN                           */}
        {/* ==================================================================== */}
        {checkoutStep === 'handoff' && paymentSession && (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* 1. Concise Status Heading */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#0877C9] uppercase">
                {t("SECURE GATEWAY HANDOFF", "নিরাপদ পেমেন্ট হ্যান্ডঅফ")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {t("Complete Your Payment", "পেমেন্ট সম্পন্ন করুন")}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t(
                  "Your payment session is ready on Paymently. Open the payment page to pay, then return here to confirm your order.",
                  "আপনার পেমেন্ট সেশন প্রস্তুত। পেমেন্ট পেইজে পেমেন্ট সম্পন্ন করে এখানে ফিরে আসুন।"
                )}
              </p>
            </div>

            {/* 2 & 3. Payable Total & Reference ID with Copy Button */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {t("Exact Payable Total", "মোট প্রদেয়")}
                  </span>
                  <span className="text-2xl font-black text-[#062B4F]">
                    {displayTotal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  aria-label={t("Copy exact payable amount", "টাকার পরিমাণ কপি করুন")}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  {isCopiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{isCopiedAmount ? t("Copied!", "কপি হয়েছে!") : t("Copy ৳", "কপি ৳")}</span>
                </button>
              </div>

              <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {t("Reference ID", "রেফারেন্স আইডি")}:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[#062B4F] text-xs">
                    {paymentSession.invoice_id || paymentSession.checkout_id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    aria-label={t("Copy reference ID", "রেফারেন্স আইডি কপি করুন")}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                    title={t("Copy ID", "আইডি কপি করুন")}
                  >
                    {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dynamic vs Fallback Link Disclosure */}
              <div className="pt-2 border-t border-slate-200/70 text-[11px] leading-relaxed">
                {paymentSession.is_fallback_link ? (
                  <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {t(
                        "Hosted Merchant Portal: You are checking out via the official AZRAQ portal. Please confirm the payable amount of ",
                        "অফিসিয়াল মার্চেন্ট পোর্টাল: অনুগ্রহ করে পেমেন্ট পেইজে টাকার পরিমাণ "
                      )}
                      <strong>{displayTotal}</strong>
                      {t(
                        " on Paymently, then enter your TrxID below to confirm your order.",
                        " দিন এবং পেমেন্ট শেষে নিচে TrxID জমা দিন।"
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{t("Dynamic Session: Your order amount is pre-filled and locked on Paymently.", "ডাইনামিক সেশন: টাকার পরিমাণ পেমেন্টলিতে সরাসরি লক করা আছে।")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Primary Button to Open Gateway Safely */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleOpenPaymentPortal}
                className="w-full py-3 px-5 rounded-xl bg-[#0877C9] hover:bg-[#062B4F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0877C9] focus:ring-offset-2"
              >
                <span>{t("Open Paymently Checkout Page", "পেমেন্টলি পেমেন্ট পেইজ ওপেন করুন")}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* 5. Return Instructions */}
              <p className="text-[11px] text-center text-slate-500">
                {t(
                  "After completing your payment in Paymently or your wallet app, return to this tab to confirm your order.",
                  "পেমেন্টলি বা মোবাইল ওয়ালেটে পেমেন্ট শেষ করে এই ট্যাবে ফিরে এসে স্ট্যাটাস চেক করুন।"
                )}
              </p>
            </div>

            {/* 8. Pending Alert Banner if checked and still pending */}
            {pendingNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2 animate-in fade-in">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{t("Payment Not Yet Cleared", "পেমেন্ট এখনো ক্লিয়ার হয়নি")}</p>
                  <p className="text-[11px] leading-relaxed">{pendingNotice}</p>
                </div>
              </div>
            )}

            {/* Manual TrxID Entry Field */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-left space-y-2">
              <label htmlFor="manual-trx-input" className="block text-xs font-bold text-[#062B4F]">
                {t("Paid via merchant link? Enter Transaction ID (TrxID):", "পেমেন্ট করেছেন? ট্রানজেকশন আইডি (TrxID) দিন:")}
              </label>
              <div className="flex gap-2">
                <input
                  id="manual-trx-input"
                  type="text"
                  value={manualTrxId}
                  onChange={(e) => setManualTrxId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9KA02194 or TRX-8821"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0877C9]"
                />
                <button
                  type="button"
                  onClick={handleManualTrxSubmit}
                  disabled={isSubmitting || manualTrxId.trim().length < 4}
                  className="px-3.5 py-2 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold disabled:opacity-40 whitespace-nowrap shadow-xs transition-colors"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : t("Submit TrxID", "জমা দিন")}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                {t(
                  "Manual submissions are recorded as Pending Verification until cleared by our merchant desk.",
                  "ম্যানুয়ালি সাবমিট করা TrxID ভেরিফিকেশনের জন্য অপেক্ষমান থাকবে।"
                )}
              </p>
            </div>

            {/* 6. Distinct Check Payment Status Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#062B4F] font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting 
                    ? t("Checking Status with Paymently...", "স্ট্যাটাস চেক করা হচ্ছে...") 
                    : t("Check Payment Status", "পেমেন্ট স্ট্যাটাস চেক করুন")}
                </span>
              </button>
            </div>

            {/* 7. Change Payment Method / Cancel with Confirmation */}
            {!showCancelConfirm ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-slate-500 hover:text-rose-600 font-medium transition-colors"
                >
                  {t("Change Payment Method / Cancel", "পেমেন্ট মাধ্যম পরিবর্তন বা বাতিল করুন")}
                </button>
                <button
                  type="button"
                  onClick={handleDirectCod}
                  disabled={isSubmitting}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>{t("Switch to COD", "ক্যাশ অন ডেলিভারিতে নিন")}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-left space-y-2">
                <p className="font-semibold text-slate-800">
                  {t(
                    "Cancel this payment session? Your items will remain safely in your cart.",
                    "পেমেন্ট সেশনটি বাতিল করতে চান? আপনার কার্টের পণ্যগুলো সংরক্ষিত থাকবে।"
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                  >
                    {t("Yes, Cancel Session", "হ্যাঁ, বাতিল করুন")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                  >
                    {t("Keep Session", "সেশনে থাকুন")}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: VERIFYING LOADING VIEW                                       */}
        {/* ==================================================================== */}
        {checkoutStep === 'verifying' && (
          <div className="p-8 sm:p-10 text-center space-y-3.5 my-auto">
            <RefreshCw className="w-10 h-10 text-[#0877C9] animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-[#062B4F]">
              {t("Verifying Payment with Gateway...", "পেমেন্ট গেটওয়েতে ভেরিফাই করা হচ্ছে...")}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {t(
                "Communicating directly with Paymently to authorize and confirm your transaction. Please do not close this window.",
                "পেমেন্টলির সাথে সরাসরি যোগাযোগ করে সত্যতা যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।"
              )}
            </p>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 4: VERIFIED PAID SUCCESS VIEW (ONLY ON GENUINE PAID STATUS)     */}
        {/* ==================================================================== */}
        {checkoutStep === 'paid_success' && confirmedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                {t("PAID & VERIFIED", "পেমেন্ট সফল ও ভেরিফাইড")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {t("Payment Successful!", "পেমেন্ট সফল হয়েছে!")}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t(
                  "Your payment has been verified directly with Paymently. We are now preparing your order.",
                  "আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে। আপনার অর্ডার প্রস্তুত করা হচ্ছে।"
                )}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Order Tracking ID", "অর্ডার ট্র্যাকিং আইডি")}:</span>
                <span className="font-mono font-bold text-[#0877C9]">{confirmedOrder.id}</span>
              </div>
              {confirmedOrder.gateway_transaction_id && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("Provider TrxID", "প্রোভাইডার TrxID")}:</span>
                  <span className="font-mono font-bold text-slate-800">{confirmedOrder.gateway_transaction_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Total Paid", "পরিশোধিত টাকা")}:</span>
                <span className="font-bold text-slate-800">{formatBdtAmount(confirmedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Delivery To", "প্রাপক")}:</span>
                <span className="text-slate-800 font-medium truncate max-w-[200px]">
                  {confirmedOrder.customer_name} ({confirmedOrder.customer_phone})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setIsTrackingOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold transition-colors shadow-xs"
              >
                {t("Track My Order", "অর্ডার ট্র্যাক করুন")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                {t("Continue Shopping", "আরও কেনাকাটা করুন")}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 5: PENDING VERIFICATION VIEW (FOR MANUAL TRXID & COD)           */}
        {/* ==================================================================== */}
        {checkoutStep === 'pending_verification' && confirmedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                {confirmedOrder.payment_method === 'COD' 
                  ? t("CASH ON DELIVERY", "ক্যাশ অন ডেলিভারি") 
                  : t("PAYMENT SUBMITTED — AWAITING VERIFICATION", "পেমেন্ট জমা — ভেরিফিকেশন অপেক্ষমান")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#062B4F]">
                {confirmedOrder.payment_method === 'COD' 
                  ? t("Order Confirmed!", "অর্ডার গ্রহণ করা হয়েছে!") 
                  : t("Order Placed — Verifying Payment", "অর্ডার গৃহীত — পেমেন্ট ভেরিফাই হচ্ছে")}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {confirmedOrder.payment_method === 'COD'
                  ? t(
                      "Your Cash on Delivery order is confirmed and will be dispatched. Please have the cash ready at delivery.",
                      "আপনার ক্যাশ অন ডেলিভারি অর্ডার কনফার্ম হয়েছে। ডেলিভারির সময় নগদ টাকা প্রদান করুন।"
                    )
                  : t(
                      "We have received your order and payment reference. Our merchant desk is reconciling the transaction with Paymently. You will receive an SMS confirmation once cleared.",
                      "আপনার অর্ডার ও পেমেন্ট রেফারেন্স গ্রহণ করা হয়েছে। মার্চেন্ট ডেস্কে ভেরিফিকেশন সম্পন্ন হলে SMS এর মাধ্যমে কনফার্মেশন পাঠানো হবে।"
                    )}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Order Tracking ID", "অর্ডার ট্র্যাকিং আইডি")}:</span>
                <span className="font-mono font-bold text-[#0877C9]">{confirmedOrder.id}</span>
              </div>
              {confirmedOrder.gateway_transaction_id && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("Submitted TrxID", "প্রদত্ত TrxID")}:</span>
                  <span className="font-mono font-bold text-slate-800">{confirmedOrder.gateway_transaction_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Payable Amount", "প্রদেয় পরিমাণ")}:</span>
                <span className="font-bold text-slate-800">{formatBdtAmount(confirmedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t("Payment Status", "পেমেন্ট স্ট্যাটাস")}:</span>
                <span className="font-bold text-amber-700">
                  {confirmedOrder.payment_status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setIsTrackingOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold transition-colors shadow-xs"
              >
                {t("Track My Order", "অর্ডার ট্র্যাক করুন")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                {t("Continue Shopping", "আরও কেনাকাটা করুন")}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 6: FAILED / CANCELLED PAYMENT VIEW                              */}
        {/* ==================================================================== */}
        {checkoutStep === 'failed' && (() => {
          const isMaintenance = isStoreMaintenanceError({ code: errorCode, message: errorMessage });
          return (
            <div 
              role="alertdialog"
              aria-labelledby="checkout-dialog-title"
              aria-describedby="checkout-dialog-desc"
              className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1 my-auto"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <AlertCircle className="w-8 h-8" aria-hidden="true" />
              </div>

              <div className="space-y-1.5">
                <h3 id="checkout-dialog-title" className="text-xl sm:text-2xl font-black text-[#062B4F]">
                  {isMaintenance 
                    ? t("Checkout Temporarily Unavailable", "চেকআউট সাময়িকভাবে বন্ধ আছে")
                    : t("Payment Was Not Completed", "পেমেন্ট সম্পন্ন হয়নি")}
                </h3>
                <p id="checkout-dialog-desc" className="text-xs sm:text-sm text-rose-600 max-w-md mx-auto font-medium leading-relaxed">
                  {errorMessage || (isMaintenance 
                    ? t("Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe.", "সিস্টেম রক্ষণাবেক্ষণের কারণে চেকআউট সাময়িকভাবে বন্ধ আছে। পণ্যগুলো কার্টে সংরক্ষিত আছে।")
                    : t("The payment was cancelled or timed out. Your items are safe in your shopping bag.", "পেমেন্ট সম্পন্ন করা যায়নি। পণ্যগুলো কার্টে সংরক্ষিত আছে।"))}
                </p>
                <p className="text-[11px] text-slate-500 font-normal">
                  {t("All items in your bag and entered delivery details have been preserved.", "আপনার ব্যাগের পণ্যসমূহ এবং প্রদত্ত তথ্য সম্পূর্ণ সুরক্ষিত আছে।")}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 max-w-md mx-auto pt-2">
                {/* Only offer COD switch if system is NOT undergoing storewide maintenance */}
                {!isMaintenance && (
                  <button
                    onClick={handleDirectCod}
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                  >
                    <Banknote className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t("Switch to Cash on Delivery (Pay on Delivery)", "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ)")}</span>
                  </button>
                )}

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#062B4F] hover:bg-[#0877C9] active:bg-[#052340] text-white text-xs sm:text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0877C9] focus:ring-offset-1"
                  >
                    {t("Retry Checkout", "পুনরায় চেষ্টা করুন")}
                  </button>
                  {isMaintenance ? (
                    <a
                      href="https://wa.me/8801700000000?text=Hello%20AZRAQ%2C%20I%20need%20help%20placing%20my%20order"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span>{t("WhatsApp Concierge", "হোয়াটসঅ্যাপে সহায়তা")}</span>
                    </a>
                  ) : null}
                  <button
                    onClick={handleClose}
                    className="px-5 min-h-[44px] py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                  >
                    {t("Close", "বন্ধ")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
