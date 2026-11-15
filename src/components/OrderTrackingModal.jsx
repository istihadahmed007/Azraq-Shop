import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, Phone, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function OrderTrackingModal() {
  const { orders, isTrackingOpen, setIsTrackingOpen, t } = useShop();

  const [searchCode, setSearchCode] = useState('');
  const [activeOrder, setActiveOrder] = useState(() => orders[0] || null);
  const [searchError, setSearchError] = useState('');

  if (!isTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    const query = searchCode.trim().toLowerCase();
    if (!query) {
      setSearchError(t("Please enter your Order ID or phone number.", "অনুগ্রহ করে আপনার অর্ডার আইডি বা ফোন নম্বর দিন।"));
      return;
    }
    const found = orders.find(
      o => o.id?.toLowerCase().includes(query) || (o.customer && o.customer.phone?.includes(query))
    );
    if (found) {
      setActiveOrder(found);
      setSearchError('');
    } else {
      setSearchError(
        t(
          "No order found with that ID or Phone number. Please check your order confirmation details or contact customer care.",
          "এই আইডি বা ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন অথবা কাস্টমার কেয়ারে যোগাযোগ করুন।"
        )
      );
    }
  };

  const steps = [
    { title: t("Order Placed", "অর্ডার গৃহীত"), desc: "Order details verified & logged into AZRAQ system", status: "completed" },
    { title: t("Quality Inspected", "মান যাচাই"), desc: "Product checked by AZRAQ QC inspection team", status: "completed" },
    { title: t("Dispatched to Courier", "কুরিয়ারে হস্তান্তর"), desc: "Handed over to Steadfast Courier BD", status: activeOrder?.status === 'Processing' || activeOrder?.order_status === 'Processing' ? 'current' : 'completed' },
    { title: t("Out for Delivery", "ডেলিভারির পথে"), desc: "Rider on the way to recipient address", status: activeOrder?.status === 'Delivered' || activeOrder?.order_status === 'Delivered' ? 'completed' : 'current' },
    { title: t("Delivered & Inspected", "ডেলিভারি সম্পন্ন"), desc: "Payment received and parcel handed to customer", status: activeOrder?.status === 'Delivered' || activeOrder?.order_status === 'Delivered' ? 'completed' : 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#062B4F]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9F0FF] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-[#062B4F] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 bg-[#062B4F] text-white">
          <span className="text-[10px] font-mono tracking-widest text-[#50DDF0] uppercase">
            {t("AZRAQ CONCIERGE & LOGISTICS", "আজরাক লজিস্টিকস ও ট্র্যাকিং")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {t("Track Your Order", "অর্ডারের লাইভ অবস্থান")}
          </h2>
          <p className="text-xs text-white/70 mt-1">
            {t("Enter your AZRAQ Order ID (e.g. AZQ-ORD-...) or 11-digit mobile number.", "আপনার ট্র্যাকিং আইডি অথবা ফোন নম্বর দিন।")}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. AZQ-ORD-MWI... or 018..."
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  if (searchError) setSearchError('');
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 text-white text-xs placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-[#50DDF0]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#50DDF0] text-[#062B4F] text-xs font-black hover:bg-[#69C5F5] transition-colors"
            >
              {t("Track", "ট্র্যাক")}
            </button>
          </form>

          {searchError && (
            <p className="mt-2 text-xs text-rose-300 font-medium">
              {searchError}
            </p>
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
                  {activeOrder.customer?.name || activeOrder.customer_name} • {activeOrder.customer?.phone || activeOrder.customer_phone}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#062B4F]/50">Courier Partner</span>
                <p className="text-xs font-bold text-[#062B4F]">{activeOrder.courierTracking || activeOrder.courier_name || 'Steadfast BD'}</p>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D9F0FF] text-[#0877C9] text-[10px] font-bold">
                    {activeOrder.order_status || activeOrder.status || 'Processing'}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeOrder.payment_status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-700'
                      : activeOrder.payment_status === 'PENDING_VERIFICATION'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activeOrder.payment_status || 'CONFIRMED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#062B4F]">
                {t("Shipment Milestones", "ডেলিভারি ধাপসমূহ")}
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D9F0FF]">
                {steps.map((st, i) => (
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
                    <div>
                      <h5 className="text-xs font-bold text-[#062B4F]">{st.title}</h5>
                      <p className="text-[11px] text-[#062B4F]/60">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
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
                  <span>Total Payable:</span>
                  <span>৳{(activeOrder.total || activeOrder.total_payable || 0).toLocaleString()} ({activeOrder.payment_method || activeOrder.paymentMethod})</span>
                </div>
              </div>
            )}

            {/* Support Concierge Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#062B4F] text-white text-xs">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#50DDF0]" />
                <span>Need delivery assistance? Helpline: <strong>+880 1711-223344</strong></span>
              </div>
              <a 
                href="https://wa.me/8801851172032" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-[#50DDF0] text-[#062B4F] text-[10px] font-bold hover:bg-[#69C5F5] transition-colors"
              >
                WhatsApp Support
              </a>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#062B4F]/60">
            {t("Enter your order tracking ID above to see live dispatch updates.", "লাইভ আপডেট দেখতে উপরে অর্ডার আইডি দিয়ে ট্র্যাক করুন।")}
          </div>
        )}

      </div>
    </div>
  );
}

