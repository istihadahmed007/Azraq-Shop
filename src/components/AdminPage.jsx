import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { setIsAdminOpen } = useShop();

  useEffect(() => {
    setIsAdminOpen(true);
  }, [setIsAdminOpen]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-16 text-center select-none">
      <div className="max-w-md w-full mx-auto p-8 glass-card rounded-2xl border border-white/90 shadow-lg space-y-4">
        <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            AZRAQ Operations & Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Manage your catalog, orders, EasyDrop dropship dispatch, and Paymently transactions securely.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
