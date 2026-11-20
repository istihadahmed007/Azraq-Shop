import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, Headphones, Loader2, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphism Order Tracking Modal
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#193B5B]/35 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-2xl bg-[#F8FBFF]/95 backdrop-blur-2xl rounded-[28px] overflow-hidden my-6 shadow-2xl border border-[rgba(130,170,205,0.3)] border-t-white/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#193B5B] hover:text-[#0877C9] transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-7 bg-white/70 backdrop-blur-md border-b border-[rgba(130,170,205,0.2)]">
          <div className="flex items-center gap-2">
            <img src="/branding/azraq-icon.png" alt="AZRAQ Shop" className="w-5 h-5 object-contain shrink-0" />
            <span className="text-[10px] font-mono tracking-widest text-[#0877C9] uppercase font-bold">
              {t("AZRAQ CONCIERGE & LOGISTICS", "আজরাক লজিস্টিকস ও সিকিউর ট্র্যাকিং")}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight mt-1">
            {t("Secure Order Tracking", "অর্ডারের লাইভ অবস্থান")}
          </h2>
          <p className="text-xs text-[#718398] mt-0.5">
            {t("To protect customer privacy, enter your Order ID along with your phone number or tracking token.", "গ্রাহকের তথ্য সুরক্ষায় অনুগ্রহ করে অর্ডার আইডি ও ফোন নম্বর দিন।")}
          </p>

          {/* Secure Search Form */}
          <form onSubmit={handleSearch} className="mt-4 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#718398] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order ID (e.g. AZQ-ORD-...)"
                  value={orderReference}
                  onChange={(e) => {
                    setOrderReference(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-white text-xs text-[#193B5B] placeholder-[#718398] border border-[rgba(130,170,205,0.3)] focus:border-[#70C8ED] focus:outline-none shadow-inner"
                />
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#718398] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mobile (018...) or Token"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-white text-xs text-[#193B5B] placeholder-[#718398] border border-[rgba(130,170,205,0.3)] focus:border-[#70C8ED] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs transition-colors cursor-pointer"
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
            <div className="mt-3 p-3 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {searchError}
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {activeOrder ? (
          <div className="p-6 sm:p-7 space-y-4">
            
            {/* Order Meta Card */}
            <div className="p-4 rounded-[20px] bg-white/80 border border-[rgba(130,170,205,0.25)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#718398]">Order Reference</span>
                <p className="text-base font-mono font-black text-[#193B5B]">{activeOrder.id}</p>
                <p className="text-xs text-[#718398]">
                  {activeOrder.customer_name_masked || 'Customer'} • {activeOrder.customer_phone_masked || '018****'}
                </p>
                {activeOrder.city && (
                  <p className="text-[11px] text-[#718398] mt-0.5">
                    Destination: {activeOrder.city} ({activeOrder.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#718398]">Statuses</span>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#DDEEFF] text-[#193B5B] text-[10px] font-bold border border-[rgba(130,170,205,0.3)]">
                    Fulfillment: {activeOrder.fulfillment_status || 'Processing'}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                    activeOrder.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Payment: {activeOrder.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Milestones Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#193B5B]">
                {t("Logistics Progress", "ডেলিভারি ট্র্যাকিং ধাপসমূহ")}
              </h3>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#DDEEFF]">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <span className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                      m.status === 'completed'
                        ? 'bg-[#0877C9] border-[#0877C9] text-white shadow-[0_0_8px_#70C8ED]'
                        : m.status === 'current'
                        ? 'bg-white border-[#70C8ED] text-[#70C8ED] animate-pulse'
                        : 'bg-white border-gray-300'
                    }`}>
                      {m.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className={`text-xs font-bold ${m.status === 'completed' || m.status === 'current' ? 'text-[#193B5B]' : 'text-[#718398]'}`}>
                          {m.title}
                        </h4>
                        {m.time && (
                          <span className="text-[10px] font-mono text-[#718398]">{m.time}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#718398] mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Care Hotline Box */}
            <div className="p-3.5 rounded-[20px] bg-white/80 border border-[rgba(130,170,205,0.25)] flex items-center justify-between text-xs text-[#193B5B] shadow-xs">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#0877C9]" />
                <span className="font-semibold">{t("Need help with this order?", "এই অর্ডার নিয়ে কোনো সহায়তার প্রয়োজন?")}</span>
              </div>
              <a 
                href="https://wa.me/8801851172032"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-white hover:bg-[#DDEEFF] text-[11px] font-bold text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-2xs transition-colors"
              >
                WhatsApp Concierge
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#718398] space-y-2">
            <Package className="w-8 h-8 text-[#0877C9]/40 mx-auto" />
            <p>{t("Enter your Order ID (from SMS receipt) to view real-time delivery status.", "রসিদে প্রদত্ত অর্ডার আইডি দিয়ে লাইভ স্ট্যাটাস দেখুন।")}</p>
          </div>
        )}

      </div>
    </div>
  );
}
