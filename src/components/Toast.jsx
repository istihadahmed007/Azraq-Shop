import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { toast } = useShop();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500" />,
    info: <Info className="w-4 h-4 text-[#0877C9]" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="flex items-center gap-2.5 px-4.5 py-3 rounded-[20px] glass-modal text-[#101C35] text-xs font-bold shadow-2xl border border-white/90">
        {icons[toast.type] || icons.success}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
