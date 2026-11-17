import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, Headphones, Loader2, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Transparent Glassmorphism Order Tracking Modal
 */
export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, t } = useShop();

  const [orderReference, setOrderReference] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  if (!isTrackingOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');

    const cleanOrderRef = orderReference.trim();
    const cleanPhone = customerPhone.trim();

    if (!cleanOrderRef) {
      setSearchError(t("Please enter your Order Reference (e.g. AZQ-ORD-...).", "অনুগ্রহ করে আপনার অর্ডার আইডি (যেমন AZQ-ORD-...) দিন।"));
      return;
    }

    if (!cleanPhone) {
      setSearchError(t("Customer phone number or tracking token is required for security verification.", "নিরাপত্তা নিশ্চিত করতে অনুগ্রহ করে গ্রাহকের ফোন নম্বর বা ট্র্যাকিং টোকেন দিন।"));
      return;
    }

    setIsLoading(true);
    try {
      const isToken = cleanPhone.startsWith('trk_');
      const payload = {
        orderId: cleanOrderRef,
        phone: isToken ? '' : cleanPhone,
        trackingToken: isToken ? cleanPhone : ''
      };

      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'RATE_LIMITED') {
          setSearchError(t("Too many tracking attempts. Please wait 5 minutes before trying again.", "অতিরিক্ত ট্র্যাকিং প্রচেষ্টার কারণে সাময়িক বন্ধ। ৫ মিনিট পর আবার চেষ্টা করুন।"));
        } else if (data.code === 'FORBIDDEN') {
          setSearchError(t("Security Verification Failed: The phone number or token does not match this order reference.", "নিরাপত্তা যাচাই ব্যর্থ: এই ফোন নম্বর বা টোকেনের সাথে অর্ডার আইডির মিল নেই।"));
        } else if (data.code === 'ORDER_NOT_FOUND') {
          setSearchError(t("No order found with reference " + cleanOrderRef + ". Please check your receipt.", cleanOrderRef + " নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি।"));
        } else {
          setSearchError(data.error || t("Unable to locate order. Please check details or contact customer care.", "অর্ডারের তথ্য পাওয়া যায়নি। অনুগ্রহ করে কাস্টমার সার্ভিসে যোগাযোগ করুন।"));
        }
        setActiveOrder(null);
      } else {
        setActiveOrder(data.order);
      }
    } catch (err) {
      setSearchError(t("Network error connecting to tracking service. Please try again.", "নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"));
      setActiveOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getFulfillmentMilestones = (order) => {
    const fStatus = order?.fulfillment_status || order?.order_status || 'Processing';
    const isDispatched = fStatus === 'Dispatched' || fStatus === 'Delivered';
    const isDelivered = fStatus === 'Delivered';

    return [
      {
        title: t("Order Registered", "অর্ডার গৃহীত"),
        desc: t("Order verified & logged into AZRAQ logistics", "অর্ডারের তথ্য আজরাক লজিস্টিকসে নিবন্ধিত"),
        status: "completed",
        time: order?.created_at ? new Date(order.created_at).toLocaleDateString('en-GB') : null
      },
      {
        title: t("Quality Inspection & Packaging", "মান যাচাই ও প্যাকেজিং"),
        desc: t("Inspected by AZRAQ QC inspection team in Dhaka", "আজরাক কিউসি টিম দ্বারা পণ্য যাচাইকৃত"),
        status: isDispatched || isDelivered ? "completed" : "current"
      },
      {
        title: t("Dispatched to Courier", "কুরিয়ারে হস্তান্তর"),
        desc: order?.courier_name ? `${order.courier_name} (${order.courier_tracking_id || 'Assigned'})` : t("Steadfast Courier BD logistics partner", "স্টেডফাস্ট কুরিয়ার পার্টনার"),
        status: isDelivered ? "completed" : isDispatched ? "current" : "upcoming",
        time: order?.dispatched_at ? new Date(order.dispatched_at).toLocaleDateString('en-GB') : null
      },
      {
        title: t("Delivered & Handed Over", "ডেলিভারি সম্পন্ন"),
        desc: t("Parcel inspected and safely delivered to customer", "গ্রাহকের নিকট পার্সেল সফলভাবে হস্তান্তর"),
        status: isDelivered ? "completed" : "upcoming",
        time: order?.delivered_at ? new Date(order.delivered_at).toLocaleDateString('en-GB') : null
      }
    ];
  };

  const milestones = activeOrder ? getFulfillmentMilestones(activeOrder) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101C35]/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-2xl glass-modal rounded-[28px] overflow-hidden my-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full glass-button flex items-center justify-center text-[#101C35] hover:text-[#0877C9] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 bg-white/80 backdrop-blur-md border-b border-white/80">
          <div className="flex items-center gap-2.5">
            <img src="/branding/azraq-icon.png" alt="AZRAQ Shop" className="w-5 h-5 object-contain shrink-0" />
            <span className="text-[10px] font-mono tracking-widest text-[#0877C9] uppercase font-bold">
              {t("AZRAQ CONCIERGE & LOGISTICS", "আজরাক লজিস্টিকস ও সিকিউর ট্র্যাকিং")}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101C35] tracking-tight mt-1">
            {t("Secure Order Tracking", "অর্ডারের লাইভ অবস্থান")}
          </h2>
          <p className="text-xs text-[#71849B] mt-1">
            {t("To protect customer privacy, enter your Order ID along with your phone number or tracking token.", "গ্রাহকের তথ্য সুরক্ষায় অনুগ্রহ করে অর্ডার আইডি ও ফোন নম্বর দিন।")}
          </p>

          {/* Secure Search Form */}
          <form onSubmit={handleSearch} className="mt-4 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-[#71849B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order ID (e.g. AZQ-ORD-...)"
                  value={orderReference}
                  onChange={(e) => {
                    setOrderReference(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-full glass-input text-xs text-[#101C35] placeholder-[#71849B]"
                />
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#71849B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mobile (018...) or Token"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-full glass-input text-xs text-[#101C35] placeholder-[#71849B]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full glass-button-primary text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("Verifying...", "যাচাই করা হচ্ছে...")}</span>
                  </>
                ) : (
                  <span>{t("Track Securely", "নিরাপদে ট্র্যাক করুন")}</span>
                )}
              </button>
            </div>
          </form>

          {searchError && (
            <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {searchError}
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {activeOrder ? (
          <div className="p-6 space-y-5">
            
            {/* Order Meta Card */}
            <div className="p-4 rounded-[20px] glass-card flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#71849B]">Order Reference</span>
                <p className="text-base font-mono font-black text-[#101C35]">{activeOrder.id}</p>
                <p className="text-xs text-[#71849B]">
                  {activeOrder.customer_name_masked || 'Customer'} • {activeOrder.customer_phone_masked || '018****'}
                </p>
                {activeOrder.city && (
                  <p className="text-[11px] text-[#71849B] mt-0.5">
                    Destination: {activeOrder.city} ({activeOrder.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#71849B]">Statuses</span>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D9EDFF] text-[#0877C9] text-[10px] font-bold">
                    Fulfillment: {activeOrder.fulfillment_status || 'Processing'}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeOrder.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Payment: {activeOrder.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Milestones Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#101C35]">
                {t("Logistics Progress", "ডেলিভারি ট্র্যাকিং ধাপসমূহ")}
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#D9EDFF]">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <span className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                      m.status === 'completed'
                        ? 'bg-[#0877C9] border-[#0877C9] text-white'
                        : m.status === 'current'
                        ? 'bg-white border-[#0877C9] text-[#0877C9] animate-pulse'
                        : 'bg-white border-gray-300'
                    }`}>
                      {m.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className={`text-xs font-bold ${m.status === 'completed' || m.status === 'current' ? 'text-[#101C35]' : 'text-[#71849B]'}`}>
                          {m.title}
                        </h4>
                        {m.time && (
                          <span className="text-[10px] font-mono text-[#71849B]">{m.time}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#71849B] mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Care Hotline Box */}
            <div className="p-3.5 rounded-[18px] bg-[#F0F7FF] border border-white/80 flex items-center justify-between text-xs text-[#101C35]">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-[#0877C9]" />
                <span>{t("Need help with this order?", "এই অর্ডার নিয়ে কোনো সহায়তার প্রয়োজন?")}</span>
              </div>
              <a 
                href="https://wa.me/8801711223344"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full glass-button text-[11px] font-bold text-[#0877C9]"
              >
                WhatsApp Concierge
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#71849B] space-y-2">
            <Package className="w-8 h-8 text-[#0877C9]/40 mx-auto" />
            <p>{t("Enter your Order ID (from SMS receipt) to view real-time delivery status.", "রসিদে প্রদত্ত অর্ডার আইডি দিয়ে লাইভ স্ট্যাটাস দেখুন।")}</p>
          </div>
        )}

      </div>
    </div>
  );
}
