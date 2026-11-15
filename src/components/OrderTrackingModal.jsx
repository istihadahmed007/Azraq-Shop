import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, Headphones, Loader2, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
      // Call backend secure order tracking API
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
        setSearchError('');
      }
    } catch (err) {
      setSearchError(t("Connection error. Please check your network and try again.", "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।"));
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#062B4F]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9F0FF] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 bg-[#062B4F] text-white">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#50DDF0] uppercase font-bold">
              {t("AZRAQ CONCIERGE & LOGISTICS", "আজরাক লজিস্টিকস ও সিকিউর ট্র্যাকিং")}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#50DDF0]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {t("Secure Order Tracking", "অর্ডারের লাইভ অবস্থান")}
          </h2>
          <p className="text-xs text-white/70 mt-1">
            {t("To protect customer privacy, enter your Order ID along with your phone number or tracking token.", "গ্রাহকের তথ্য সুরক্ষায় অনুগ্রহ করে অর্ডার আইডি ও ফোন নম্বর দিন।")}
          </p>

          {/* Secure Search Form */}
          <form onSubmit={handleSearch} className="mt-4 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order ID (e.g. AZQ-ORD-...)"
                  value={orderReference}
                  onChange={(e) => {
                    setOrderReference(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 text-white text-xs placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-[#50DDF0]"
                />
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mobile (018...) or Token"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 text-white text-xs placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-[#50DDF0]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#50DDF0] text-[#062B4F] text-xs font-black hover:bg-[#69C5F5] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-medium">
              {searchError}
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {activeOrder ? (
          <div className="p-6 space-y-6">
            
            {/* Order Meta Card */}
            <div className="p-4 rounded-2xl bg-[#F8FCFF] border border-[#D9F0FF] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#062B4F]/50">Order Reference</span>
                <p className="text-base font-mono font-black text-[#062B4F]">{activeOrder.id}</p>
                <p className="text-xs text-[#062B4F]/60">
                  {activeOrder.customer_name_masked || 'Customer'} • {activeOrder.customer_phone_masked || '018****'}
                </p>
                {activeOrder.city && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Destination: {activeOrder.city} ({activeOrder.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#062B4F]/50">Statuses</span>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  {/* Fulfillment Status */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D9F0FF] text-[#0877C9] text-[10px] font-bold">
                    Fulfillment: {activeOrder.fulfillment_status || 'Processing'}
                  </span>
                  {/* Payment Status */}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeOrder.payment_status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-700'
                      : activeOrder.payment_status === 'PENDING_VERIFICATION'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    Payment: {activeOrder.payment_status || 'PENDING'}
                  </span>
                </div>
                {activeOrder.courier_name && (
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    Courier: {activeOrder.courier_name} {activeOrder.courier_tracking_id ? `(#${activeOrder.courier_tracking_id})` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#062B4F]">
                {t("Shipment Milestones", "ডেলিভারি ধাপসমূহ")}
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D9F0FF]">
                {milestones.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                      st.status === 'completed'
                        ? 'bg-[#0877C9] text-white shadow-sm'
                        : st.status === 'current'
                        ? 'bg-[#50DDF0] text-[#062B4F] ring-4 ring-[#50DDF0]/30 animate-pulse font-black'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {st.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-[#062B4F]">{st.title}</h5>
                        {st.time && <span className="text-[10px] font-mono text-slate-400">{st.time}</span>}
                      </div>
                      <p className="text-[11px] text-[#062B4F]/60">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Snapshot */}
            {activeOrder.items && activeOrder.items.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                <span className="font-bold text-[#062B4F] block">Items in this Parcel:</span>
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600 text-[11px]">
                    <span>{it.quantity}x {it.name?.split('—')[1] || it.name} ({it.variant || 'Standard'})</span>
                    <span className="font-mono font-bold">৳{((it.unit_price || it.price) * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#062B4F]">
                  <span>Total Authoritative Amount:</span>
                  <span className="font-mono text-[#0877C9]">৳{Number(activeOrder.total || 0).toLocaleString()} BDT ({activeOrder.payment_method})</span>
                </div>
              </div>
            )}

            {/* Audit Status History Log */}
            {activeOrder.history && activeOrder.history.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Status Audit Log:</span>
                {activeOrder.history.map((h, idx) => (
                  <div key={idx} className="text-[11px] text-slate-600 flex justify-between">
                    <span>
                      <strong className="text-slate-800">[{h.status_type}]</strong> {h.new_status} — {h.notes}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 ml-2">
                      {new Date(h.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Support Concierge Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#062B4F] text-white text-xs">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#50DDF0]" />
                <span>Concierge Helpline: <strong>+880 1851-172032</strong></span>
              </div>
              <a 
                href="https://wa.me/8801851172032" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-[#50DDF0] text-[#062B4F] text-[10px] font-bold hover:bg-[#69C5F5] transition-colors"
              >
                WhatsApp
              </a>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#062B4F]/60">
            {t("Enter your Order ID and phone number above to see real-time verified dispatch updates.", "লাইভ আপডেট দেখতে উপরে অর্ডার আইডি ও ফোন নম্বর দিন।")}
          </div>
        )}

      </div>
    </div>
  );
}
