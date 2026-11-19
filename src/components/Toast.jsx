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
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl glass-card text-azraq-deep text-xs font-bold shadow-[0_12px_32px_rgba(25,59,91,0.16)] border border-[rgba(130,170,205,0.35)] backdrop-blur-xl">
        {icons[toast.type] || icons.success}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
