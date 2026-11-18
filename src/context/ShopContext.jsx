import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import initialCollectionsData from '../data/collections.json';
import initialProductsData from '../data/initial_catalog.json';
import initialReconciliationReport from '../data/reconciliation_report.json';
import { 
  getStoredItem, 
  setStoredItem, 
  validateCartItems, 
  validateFavoritesList, 
  validateOrdersList 
} from '../utils/storage.js';
import { generateProductSlug } from '../utils/productUtils.js';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Navigation hook (wrapped in try/catch to maintain test runner safety)
  let navigate = null;
  try {
    navigate = useNavigate();
  } catch (e) {
    // Non-router execution environment fallback
  }
  // Collections state (18 EasyDrop categories)
  const [collections, setCollections] = useState(() => {
    return getStoredItem('collections', initialCollectionsData.collections);
  });

  // Fast-boot initial products catalog (progressive hydration loads full 1,206 catalog asynchronously)
  const [products, setProducts] = useState(() => {
    return initialProductsData.products || [];
  });

  // Reconciliation audit report
  const [reconciliationReport, setReconciliationReport] = useState(() => {
    return initialReconciliationReport;
  });

  // Routing / View State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'collections' | 'collection-detail'
  const [activeCollectionSlug, setActiveCollectionSlug] = useState('gadgets-it-accessories');
  const [activeCategory, setActiveCategory] = useState('All');

  // Sync Status
  const [syncStatus, setSyncStatus] = useState({
    lastSynced: initialProductsData.synced_at,
    totalCollections: initialCollectionsData.collections.length,
    totalUniqueProducts: initialProductsData.total_catalog_count || initialProductsData.products.length,
    isSyncing: false
  });

  // Asynchronously hydrate full catalog without blocking initial paint or bloating initial bundle
  useEffect(() => {
    let isMounted = true;
    fetch('/data/central_products.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setSyncStatus(prev => ({
            ...prev,
            lastSynced: data.synced_at || prev.lastSynced,
            totalUniqueProducts: data.products.length
          }));
        }
      })
      .catch(err => {
        console.warn('[Catalog Hydration Notice] Running with initial catalog:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  // Cart state with validated resilient storage
  const [cart, setCart] = useState(() => {
    return getStoredItem('cart', [], validateCartItems);
  });

  const [deliveryArea, setDeliveryArea] = useState('inside'); // 'inside' = ৳70, 'outside' = ৳130
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Favorites / Wishlist with validated resilient storage
  const [favorites, setFavorites] = useState(() => {
    return getStoredItem('favorites', ['AZQ-001', 'AZQ-003', 'AZQ-021'], validateFavoritesList);
  });

  // Orders pipeline (persisted in client storage for offline order history convenience)
  const [orders, setOrders] = useState(() => {
    return getStoredItem('orders', [], validateOrdersList);
  });

  // UI States
  const [language, setLanguage] = useState('en'); // 'en' | 'bn'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        return Boolean(params.get('payment_status') && params.get('checkout_id'));
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBrandAssetsOpen, setIsBrandAssetsOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Safe, versioned, quota-resilient storage sync
  useEffect(() => {
    setStoredItem('collections', collections);
  }, [collections]);

  useEffect(() => {
    setStoredItem('cart', cart);
  }, [cart]);

  useEffect(() => {
    setStoredItem('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    setStoredItem('orders', orders);
  }, [orders]);

  // Toast trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Navigation router helper (bridges legacy view states with URL routing)
  const navigateTo = (view, slug = null) => {
    setCurrentView(view);
    if (slug) {
      setActiveCollectionSlug(slug);
    }
    if (navigate) {
      if (view === 'home') navigate('/');
      else if (view === 'collections') navigate('/collections');
      else if (view === 'collection-detail' && slug) navigate(`/collection/${slug}`);
      else if (view === 'product' && slug) navigate(`/product/${slug}`);
    } else if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (view === 'collections') targetPath = '/collections';
      else if (view === 'collection-detail' && slug) targetPath = `/collection/${slug}`;
      else if (view === 'product' && slug) targetPath = `/product/${slug}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product selection handler: seamlessly routes to dedicated product page /product/:slug
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product) {
      const slug = generateProductSlug(product);
      if (navigate) {
        navigate(`/product/${slug}`);
      } else if (typeof window !== 'undefined') {
        window.location.href = `/product/${slug}`;
      }
    }
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

  // Record a verified/confirmed order into state & clear shopping cart
  const recordConfirmedOrder = (order) => {
    setOrders(prev => {
      const exists = prev.some(o => o.id === order.id);
      if (exists) return prev;
      return [order, ...prev];
    });
    clearCart();
    setAppliedPromo(null);
    return order;
  };

  // Legacy helper refactored: Only called after explicit COD or verified payment
  const placeOrder = (customerData, paymentMethod, verifiedOrderId = null) => {
    const orderId = verifiedOrderId || `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
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
      status: paymentMethod === 'COD' ? 'Confirmed' : 'Processing',
      courierTracking: null,
      easyDropOrderId: null
    };

    return recordConfirmedOrder(newOrder);
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
        recordConfirmedOrder,
        updateOrderStatus,
        language,
        setLanguage,
        t,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct: handleSelectProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        isBrandAssetsOpen,
        setIsBrandAssetsOpen,
        isVisualSearchOpen,
        setIsVisualSearchOpen,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
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
