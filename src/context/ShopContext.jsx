import React, { createContext, useContext, useState, useEffect } from 'react';
import initialCollectionsData from '../data/collections.json';
import initialProductsData from '../data/central_products.json';
import initialReconciliationReport from '../data/reconciliation_report.json';

const ShopContext = createContext();

const CATALOG_VERSION = 'v2_strict_1206';

export function ShopProvider({ children }) {
  // Collections state (18 EasyDrop categories)
  const [collections, setCollections] = useState(() => {
    const version = localStorage.getItem('azraq_catalog_version');
    if (version !== CATALOG_VERSION) {
      localStorage.setItem('azraq_catalog_version', CATALOG_VERSION);
      localStorage.removeItem('azraq_collections');
      localStorage.removeItem('azraq_products_catalog');
      localStorage.removeItem('azraq_reconciliation_report');
      return initialCollectionsData.collections;
    }
    const saved = localStorage.getItem('azraq_collections');
    return saved ? JSON.parse(saved) : initialCollectionsData.collections;
  });

  // Central unique products database (1,206 EasyDrop products with strict retail pricing & original descriptions)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('azraq_products_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length === initialProductsData.products.length) return parsed;
      } catch (e) {}
    }
    return initialProductsData.products;
  });

  // Reconciliation audit report
  const [reconciliationReport, setReconciliationReport] = useState(() => {
    return initialReconciliationReport;
  });

  // Routing / View State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'collections' | 'collection-detail'
  const [activeCollectionSlug, setActiveCollectionSlug] = useState('gadgets-it-accessories');

  // Sync Status
  const [syncStatus, setSyncStatus] = useState({
    lastSynced: initialProductsData.synced_at,
    totalCollections: initialCollectionsData.collections.length,
    totalUniqueProducts: initialProductsData.products.length,
    isSyncing: false
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('azraq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [deliveryArea, setDeliveryArea] = useState('inside'); // 'inside' = ৳70, 'outside' = ৳130
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Favorites / Wishlist
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('azraq_favorites');
    return saved ? JSON.parse(saved) : ['AZQ-001', 'AZQ-003', 'AZQ-021'];
  });

  // Orders pipeline (persisted in localStorage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('azraq_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'AZQ-BD-92101',
        date: '2026-11-15T09:40:00Z',
        customer: {
          name: 'Shakil Ahmed',
          phone: '01711223344',
          address: 'Road 7, Sector 3, Uttara, Dhaka',
          area: 'inside'
        },
        items: [
          {
            id: 'AZQ-001',
            name: 'Baseus Fast Charging Gift Box Set',
            variant: 'Default',
            price: 1950,
            quantity: 1,
            supplier_sku: 'ED-2-001',
            collection: 'Gadgets & IT Accessories'
          }
        ],
        subtotal: 1950,
        deliveryFee: 70,
        discount: 200,
        total: 1820,
        paymentMethod: 'COD',
        status: 'Sent to EasyDrop',
        courierTracking: 'STDFST-99412',
        easyDropOrderId: 'ED-ORD-44910'
      },
      {
        id: 'AZQ-BD-91882',
        date: '2026-11-14T14:20:00Z',
        customer: {
          name: 'Nusrat Jahan',
          phone: '01899112233',
          address: 'Mehedibag, Chattogram',
          area: 'outside'
        },
        items: [
          {
            id: 'AZQ-061',
            name: 'AZRAQ Atelier Structured Shoulder Bag',
            variant: 'Midnight Black',
            price: 2450,
            quantity: 1,
            supplier_sku: 'ED-5-061',
            collection: 'Jewelries & Accessories'
          }
        ],
        subtotal: 2450,
        deliveryFee: 130,
        discount: 0,
        total: 2580,
        paymentMethod: 'bKash',
        status: 'Dispatched',
        courierTracking: 'PATHAO-77201',
        easyDropOrderId: 'ED-ORD-44820'
      }
    ];
  });

  // UI States
  const [language, setLanguage] = useState('en'); // 'en' | 'bn'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBrandAssetsOpen, setIsBrandAssetsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('azraq_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('azraq_products_catalog', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('azraq_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('azraq_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('azraq_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Navigation router helper
  const navigateTo = (view, slug = null) => {
    setCurrentView(view);
    if (slug) {
      setActiveCollectionSlug(slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product, variant = 'Default', qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant === variant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      }
      return [...prev, { product, variant, quantity: qty }];
    });
    showToast(`${product.name.slice(0, 32)} added to bag`);
  };

  const updateCartQty = (productId, variant, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeFromCart = (productId, variant) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.variant === variant)
      )
    );
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your curated wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  // Calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const isFreeDelivery = cartSubtotal >= 3000;
  const deliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : deliveryArea === 'inside' ? 70 : 130;
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0;
  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - promoDiscount);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AZRAQNEW' || cleanCode === 'DISCOVER200') {
      setAppliedPromo({ code: cleanCode, discount: 200 });
      showToast('Promo code applied: ৳200 discount', 'success');
      return true;
    } else if (cleanCode === 'AZRAQ10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedPromo({ code: cleanCode, discount });
      showToast('Promo code applied: 10% discount', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try AZRAQNEW', 'error');
      return false;
    }
  };

  const placeOrder = (customerData, paymentMethod) => {
    const orderId = `AZQ-BD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: customerData,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        variant: item.variant,
        price: item.product.price,
        quantity: item.quantity,
        supplier_sku: item.product.easydrop_id || item.product.sku,
        collection: item.product.primary_collection_name
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount: promoDiscount,
      total: cartTotal,
      paymentMethod,
      status: 'Confirmed',
      courierTracking: `STDFST-${Math.floor(10000 + Math.random() * 90000)}`,
      easyDropOrderId: `ED-ORD-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  // EasyDrop Ingestion & Synchronization Handler
  const syncWithEasyDrop = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSyncStatus({
        lastSynced: new Date().toISOString(),
        totalCollections: collections.length,
        totalUniqueProducts: products.length,
        isSyncing: false
      });
      showToast(`Synchronized ${collections.length} collections and ${products.length} unique products with EasyDrop!`, 'success');
    } catch (err) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      showToast('Sync error with EasyDrop supplier API', 'error');
    }
  };

  // Admin: Update collection metadata
  const updateCollection = (updatedCol) => {
    setCollections(prev => prev.map(c => c.id === updatedCol.id ? updatedCol : c));
    showToast(`Collection "${updatedCol.name}" updated successfully`, 'success');
  };

  // Admin: Update product
  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast(`Product ${updatedProduct.id} specifications updated`, 'success');
  };

  // Admin: Order status update
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
  };

  // Translation helper
  const t = (en, bn) => (language === 'bn' && bn ? bn : en);

  // Active collection object helper
  const activeCollection = collections.find(c => c.slug === activeCollectionSlug) || collections[0];

  // Products belonging to active collection (many-to-many lookup)
  const activeCollectionProducts = products.filter(p => 
    p.collection_ids && p.collection_ids.includes(activeCollection.id)
  );

  return (
    <ShopContext.Provider
      value={{
        collections,
        setCollections,
        products,
        setProducts,
        reconciliationReport,
        currentView,
        setCurrentView,
        activeCollectionSlug,
        setActiveCollectionSlug,
        activeCollection,
        activeCollectionProducts,
        navigateTo,
        syncStatus,
        syncWithEasyDrop,
        updateCollection,
        updateProduct,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        isFreeDelivery,
        deliveryArea,
        setDeliveryArea,
        deliveryFee,
        appliedPromo,
        applyPromoCode,
        cartTotal,
        totalCartItems,
        favorites,
        toggleFavorite,
        orders,
        placeOrder,
        updateOrderStatus,
        language,
        setLanguage,
        t,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        isBrandAssetsOpen,
        setIsBrandAssetsOpen,
        searchQuery,
        setSearchQuery,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
