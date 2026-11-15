import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, Phone, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function OrderTrackingModal() {
  const { orders, isTrackingOpen, setIsTrackingOpen, t } = useShop();

  const [searchCode, setSearchCode] = useState('');
  const [activeOrder, setActiveOrder] = useState(() => orders[0] || null);

  if (!isTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    const found = orders.find(
      o => o.id.toLowerCase().includes(query) || (o.customer && o.customer.phone.includes(query))
    );
    if (found) {
      setActiveOrder(found);
    } else {
      alert('No order found with that ID or Phone. You can view the demo order below.');
    }
  };

  const steps = [
    { title: t("Order Placed", "অর্ডার গৃহীত"), desc: "Order details verified & logged into AZRAQ system", status: "completed" },
    { title: t("Quality Inspected", "মান যাচাই"), desc: "Product checked by AZRAQ QC inspection team", status: "completed" },
    { title: t("Dispatched to Courier", "কুরিয়ারে হস্তান্তর"), desc: "Handed over to Steadfast Courier BD", status: activeOrder?.status === 'Pending' ? 'current' : 'completed' },
    { title: t("Out for Delivery", "ডেলিভারির পথে"), desc: "Rider on the way to recipient address", status: activeOrder?.status === 'Delivered' ? 'completed' : 'current' },
    { title: t("Delivered & Inspected", "ডেলিভারি সম্পন্ন"), desc: "Payment received and parcel handed to customer", status: activeOrder?.status === 'Delivered' ? 'completed' : 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-azraq-navy/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-azraq-purple/20 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-azraq-navy flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 bg-azraq-navy text-white">
          <span className="text-[10px] font-mono tracking-widest text-azraq-lime uppercase">
            {t("AZRAQ CONCIERGE & LOGISTICS", "আজরাক লজিস্টিকস ও ট্র্যাকিং")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {t("Track Your Order", "অর্ডারের লাইভ অবস্থান")}
          </h2>
          <p className="text-xs text-white/70 mt-1">
            {t("Enter your AZRAQ Tracking ID or 11-digit mobile number.", "আপনার ট্র্যাকিং আইডি অথবা ফোন নম্বর দিন।")}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. AZQ-BD-89241 or 017..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-azraq-charcoal text-white text-xs placeholder:text-white/40 border border-azraq-purple/40 focus:outline-none focus:border-azraq-lime"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-azraq-lime text-azraq-navy text-xs font-black hover:bg-[#bbf035] transition-colors"
            >
              {t("Track", "ট্র্যাক")}
            </button>
          </form>
        </div>

        {/* Order Details Body */}
        {activeOrder ? (
          <div className="p-6 space-y-6">
            
            {/* Order Meta Card */}
            <div className="p-4 rounded-2xl bg-azraq-cloud border border-azraq-purple/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-azraq-navy/50">Tracking Code</span>
                <p className="text-base font-mono font-black text-azraq-navy">{activeOrder.id}</p>
                <p className="text-xs text-azraq-navy/60">{activeOrder.customer.name} • {activeOrder.customer.phone}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-azraq-navy/50">Courier Partner</span>
                <p className="text-xs font-bold text-azraq-navy">{activeOrder.courierTracking || 'Steadfast BD'}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-azraq-lavender text-azraq-violet text-[10px] font-bold mt-1">
                  Status: {activeOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-azraq-navy">
                {t("Shipment Milestones", "ডেলিভারি ধাপসমূহ")}
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-azraq-purple/20">
                {steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                      st.status === 'completed'
                        ? 'bg-azraq-violet text-white shadow-sm'
                        : st.status === 'current'
                        ? 'bg-azraq-lime text-azraq-navy ring-4 ring-azraq-lime/20 animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {st.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-azraq-navy">{st.title}</h5>
                      <p className="text-[11px] text-azraq-navy/60">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
              <span className="font-bold text-azraq-navy block">Items in this Parcel:</span>
              {activeOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-gray-600 text-[11px]">
                  <span>{it.quantity}x {it.name.split('—')[1] || it.name} ({it.variant})</span>
                  <span className="font-mono font-bold">৳{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-azraq-navy">
                <span>Total Amount:</span>
                <span>৳{activeOrder.total.toLocaleString()} ({activeOrder.paymentMethod})</span>
              </div>
            </div>

            {/* Support Concierge Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-azraq-navy text-white text-xs">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-azraq-lime" />
                <span>Need delivery help? 24/7 Helpline: <strong>01700-000000</strong></span>
              </div>
              <a 
                href="https://wa.me/8801700000000" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-azraq-lime text-azraq-navy text-[10px] font-bold hover:bg-[#bbf035]"
              >
                WhatsApp Us
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">
            Please search for an order.
          </div>
        )}

      </div>
    </div>
  );
}

