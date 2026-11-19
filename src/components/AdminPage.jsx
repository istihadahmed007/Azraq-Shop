import React, { useEffect } from 'react';
import AdminPanel from './AdminPanel';
import { useShop } from '../context/ShopContext';

export default function AdminPage() {
  const { setIsAdminOpen } = useShop();

  useEffect(() => {
    setIsAdminOpen(true);
    return () => {
      setIsAdminOpen(false);
    };
  }, [setIsAdminOpen]);

  return (
    <div className="w-full min-h-[90vh] py-6">
      <AdminPanel isFullPage={true} />
    </div>
  );
}
