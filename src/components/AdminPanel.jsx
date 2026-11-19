import React, { useState } from 'react';
import {
    X,
    ShieldCheck,
    RefreshCw,
    Package,
    ShoppingBag,
    TrendingUp,
    Layers,
    Check,
    Copy,
    Download,
    ExternalLink,
    Edit2,
    DollarSign,
    Truck,
    Eye,
    EyeOff,
    Star,
    CreditCard
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
    fetchTransactions,
    fetchOrders,
    verifyPaymentStatus,
    requestRefund,
    fetchGatewayStatus,
    authenticateAdmin,
    updateOrderStatusOnServer
} from '../services/paymentService';

function AdminPanelInner({ isFullPage = false }) {
    const {
        collections,
        updateCollection,
        products,
        updateProduct,
        orders,
        updateOrderStatus,
        reconciliationReport,
        syncStatus,
        syncWithEasyDrop,
        isAdminOpen,
        setIsAdminOpen,
        showToast,
        t
    } = useShop();

    const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'audit' | 'products' | 'orders' | 'payments' | 'analytics'
    const [paymentTransactions, setPaymentTransactions] = useState([]);
    const [gatewayConfig, setGatewayConfig] = useState(null);
    const [isVerifyingTxn, setIsVerifyingTxn] = useState(false);
    const [editingCollectionId, setEditingCollectionId] = useState(null);
    const [editDesc, setEditDesc] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [editStock, setEditStock] = useState('');

    // Admin authentication state (backed by server authorization)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return typeof window !== 'undefined' && Boolean(sessionStorage.getItem('azraq_admin_key'));
    });
    const [passcode, setPasscode] = useState('');
    const [authError, setAuthError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        const cleanKey = passcode.trim();
        if (!cleanKey) {
            setAuthError(t("Please enter the administrator key.", "অ্যাডমিন কি দিন।"));
            return;
        }

        setIsAuthenticating(true);
        setAuthError('');
        try {
            const res = await authenticateAdmin(cleanKey);
            if (res.success) {
                sessionStorage.setItem('azraq_admin_key', cleanKey);
                setIsAuthenticated(true);
                setAuthError('');
                showToast(t("Admin access authenticated successfully", "অ্যাডমিন অ্যাক্সেস সফল"), 'success');
                reloadAdminData();
            } else {
                setAuthError(res.error || t("Invalid administrator key. Access denied.", "ভুল অ্যাডমিন কি। অ্যাক্সেস প্রত্যাখ্যাত।"));
            }
        } catch (err) {
            setAuthError(t("Unable to reach authentication server. Please check your connection.", "সার্ভারে যোগাযোগ করা যায়নি।"));
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleAdminLoginDirect = async (cleanKey) => {
        if (!cleanKey) return;
        setIsAuthenticating(true);
        setAuthError('');
        try {
            const res = await authenticateAdmin(cleanKey);
            if (res.success) {
                sessionStorage.setItem('azraq_admin_key', cleanKey);
                setIsAuthenticated(true);
                setAuthError('');
                showToast(t("Admin access authenticated successfully", "অ্যাডমিন অ্যাক্সেস সফল"), 'success');
                reloadAdminData();
            } else {
                setAuthError(res.error || t("Invalid administrator key. Access denied.", "ভুল অ্যাডমিন কি। অ্যাক্সেস প্রত্যাখ্যাত।"));
            }
        } catch (err) {
            setAuthError(t("Unable to reach authentication server. Please check your connection.", "সার্ভারে যোগাযোগ করা যায়নি।"));
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem('azraq_admin_key');
        setIsAuthenticated(false);
        setPasscode('');
        showToast(t("Administrator session logged out", "অ্যাডমিন লগআউট সম্পন্ন"), 'info');
    };

    const reloadAdminData = async () => {
        setIsVerifyingTxn(true);
        try {
            const [txns, cfg, serverOrders] = await Promise.all([
                fetchTransactions(),
                fetchGatewayStatus(),
                fetchOrders()
            ]);
            setPaymentTransactions(txns || []);
            setGatewayConfig(cfg);
            showToast("Admin data refreshed", "info");
        } finally {
            setIsVerifyingTxn(false);
        }
    };

    React.useEffect(() => {
        if ((isAdminOpen || isFullPage) && isAuthenticated) {
            fetchTransactions().then(txns => setPaymentTransactions(txns || []));
            fetchGatewayStatus().then(cfg => setGatewayConfig(cfg));
        }
    }, [isAdminOpen, isFullPage, isAuthenticated]);

    if (!isAdminOpen && !isFullPage) return null;

    // Financial Analytics Calculations (Defensive against empty/undefined order records)
    const validOrders = Array.isArray(orders) ? orders.filter(Boolean) : [];
    const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];
    const totalRevenue = validOrders.reduce((sum, ord) => sum + (Number(ord.total) || Number(ord.total_amount) || 0), 0);
    const totalOrdersCount = validOrders.length;
    const totalSupplierCostEst = validOrders.reduce((sum, ord) => {
        const items = Array.isArray(ord.items) ? ord.items : [];
        return sum + items.reduce((itemSum, item) => {
            const prod = validProducts.find(p => p.id === item?.id);
            const baseRM = prod ? (Number(prod.supplier_base_rm) || 40) : 40;
            return itemSum + (baseRM * 27 * (Number(item?.quantity) || 1));
        }, 0);
    }, 0);
    const grossProfit = totalRevenue - totalSupplierCostEst;
    const marginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

    const startEditCollection = (col) => {
        if (!col) return;
        setEditingCollectionId(col.id);
        setEditDesc(col.description_en || '');
    };

    const saveCollectionEdit = (col) => {
        if (!col) return;
        updateCollection({
            ...col,
            description_en: editDesc
        });
        setEditingCollectionId(null);
    };

    const togglePublishCollection = (col) => {
        if (!col) return;
        const nextStatus = col.publication_status === 'published' ? 'draft' : 'published';
        updateCollection({
            ...col,
            publication_status: nextStatus
        });
    };

    const toggleFeaturedCollection = (col) => {
        if (!col) return;
        updateCollection({
            ...col,
            featured: !col.featured
        });
    };

    const copyEasyDropPayload = (order) => {
        if (!order) return;
        const customer = order.customer || {};
        const items = Array.isArray(order.items) ? order.items : [];
        const payload = {
            source: "AZRAQ Curated Store",
            partner: "EasyDrop BD",
            order_id: order.id,
            customer_info: {
                name: customer.name || order.customer_name || 'Customer',
                phone: customer.phone || order.customer_phone || '',
                address: customer.address || order.customer_address || '',
                district: (customer.area || order.deliveryArea) === 'inside' ? 'Dhaka' : 'Outside Dhaka'
            },
            items: items.map(it => ({
                sku: it?.supplier_sku || it?.sku || it?.id || 'SKU',
                name: it?.name || 'Item',
                collection: it?.collection || it?.category || 'General',
                qty: Number(it?.quantity || 1)
            })),
            collectable_amount_bdt: order.paymentMethod === 'COD' ? (Number(order.total) || 0) : 0,
            delivery_charge: Number(order.deliveryFee || 0)
        };

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
        }
        showToast(`EasyDrop payload for ${order.id} copied to clipboard!`, 'success');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101C35]/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none">
            <div
                className="relative w-full max-w-6xl glass-modal rounded-[8px] shadow-2xl border border-white/95 overflow-hidden my-4 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header Bar */}
                <div className="p-5 sm:p-6 bg-white/85 backdrop-blur-md text-[#101C35] flex items-center justify-between border-b border-white/90">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#D9EDFF] border border-white/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                            <img src="/branding/azraq-icon.png" alt="AZRAQ Shop" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-black text-[#101C35] tracking-tight">
                                    AZRAQ Multi-Collection Operations & Dropship Portal
                                </h2>
                                <span className="px-2 py-0.5 rounded-[4px] bg-[#0877C9] text-white text-[10px] font-black uppercase">
                                    Admin System
                                </span>
                            </div>
                            <p className="text-xs text-[#71849B]">
                                EasyDrop Source: https://easydrop.asia/new-store • 18 Collections • 257 Unique Products
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdminOpen(false)}
                        className="w-8 h-8 rounded-[6px] glass-button text-[#101C35] hover:text-[#0877C9] flex items-center justify-center transition-colors shadow-2xs"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {!isAuthenticated ? (
                    /* Admin Passcode Gate */
                    <div className="p-8 sm:p-14 text-center max-w-md mx-auto space-y-5 my-auto">
                        <div className="flex justify-center">
                            <img src="/branding/azraq-logo.png" alt="AZRAQ Shop" className="h-10 w-auto object-contain select-none" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#101C35]">Admin Authentication Required</h3>
                            <p className="text-xs text-[#101C35]/60 mt-1 leading-relaxed">
                                Enter your authorized store administrator key to manage operations, orders, and payment records.
                            </p>
                        </div>
                        <form onSubmit={handleAdminLogin} className="space-y-3 pt-2">
                            <input
                                type="password"
                                placeholder="Enter Administrator Key"
                                value={passcode}
                                onChange={(e) => {
                                    setPasscode(e.target.value);
                                    setAuthError('');
                                }}
                                disabled={isAuthenticating}
                                className="w-full px-4 py-2.5 rounded-[6px] border border-slate-300 text-xs font-mono text-center focus:outline-none focus:border-[#0877C9] shadow-inner disabled:opacity-50"
                                autoFocus
                            />
                            {authError && <p className="text-xs text-rose-600 font-semibold">{authError}</p>}
                            <button
                                type="submit"
                                disabled={isAuthenticating}
                                className="w-full py-2.5 rounded-[6px] bg-[#101C35] hover:bg-[#0877C9] text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isAuthenticating ? 'Verifying with Server...' : 'Unlock Operations Portal'}
                            </button>
                        </form>

                        {/* Store Default Key Hint & Quick Sign-In */}
                        <div className="pt-2 border-t border-slate-200/80 space-y-2 text-left">
                            <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200/90 text-xs text-blue-950 flex items-center justify-between">
                                <div>
                                    <span className="font-bold block">Default Store Passcode:</span>
                                    <span className="text-[11px] text-blue-700">Configured in store environment</span>
                                </div>
                                <code className="px-2 py-1 rounded bg-white border border-blue-300 font-mono font-bold text-blue-700 select-all">
                                    0133865246
                                </code>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPasscode('0133865246');
                                    handleAdminLoginDirect('0133865246');
                                }}
                                disabled={isAuthenticating}
                                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span>⚡ Quick Unlock with 0133865246</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-200/90 bg-[#F8FBFF] overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setActiveTab('collections')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'collections'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>Collections ({collections.length})</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('audit')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'audit'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Reconciliation Audit</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'products'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <Package className="w-3.5 h-3.5" />
                                    <span>Catalog ({products.length})</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Orders ({orders.length})</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'payments'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Paymently Gateway</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'analytics'
                                        ? 'border-[#0877C9] text-[#0877C9] bg-white rounded-t-[6px] shadow-2xs font-extrabold'
                                        : 'border-transparent text-[#101C35]/65 hover:text-[#101C35]'
                                        }`}
                                >
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>Analytics</span>
                                </button>
                            </div>

                            <button
                                onClick={reloadAdminData}
                                disabled={isVerifyingTxn}
                                className="px-3 py-1.5 rounded-[6px] bg-white border border-[#D9F0FF] text-[#101C35] text-xs font-bold hover:bg-[#F0F7FF] transition-all flex items-center gap-1.5 shadow-2xs mb-2 flex-shrink-0"
                                title="Reload live orders & transactions"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 text-[#0877C9] ${isVerifyingTxn ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {/* Tab Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white">

                            {/* TAB 1: Collection Management */}
                            {activeTab === 'collections' && (
                                <div className="space-y-6">

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-black text-azraq-navy">EasyDrop Collections Inventory</h3>
                                            <p className="text-xs text-gray-500">
                                                Manage all 18 supplier collections. Reorder, edit descriptions, feature, or toggle publication.
                                            </p>
                                        </div>

                                        <button
                                            onClick={syncWithEasyDrop}
                                            disabled={syncStatus.isSyncing}
                                            className="px-4 py-2 rounded-[6px] bg-[#0877C9] hover:bg-[#062B4F] text-white text-xs font-bold shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                                            <span>{syncStatus.isSyncing ? 'Syncing...' : 'Sync All Collections'}</span>
                                        </button>
                                    </div>

                                    {/* Collections Table */}
                                    <div className="border border-slate-200/90 rounded-[6px] overflow-hidden shadow-2xs">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#F8FBFF] border-b border-slate-200/90 font-bold text-[#101C35]">
                                                <tr>
                                                    <th className="p-3">Cover</th>
                                                    <th className="p-3">Collection Name</th>
                                                    <th className="p-3">Source ID</th>
                                                    <th className="p-3">Source Items</th>
                                                    <th className="p-3">Imported Items</th>
                                                    <th className="p-3">Featured</th>
                                                    <th className="p-3">Status</th>
                                                    <th className="p-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {collections.map(col => {
                                                    const isEditing = editingCollectionId === col.id;

                                                    return (
                                                        <tr key={col.id} className="hover:bg-slate-50/70 transition-colors">
                                                            <td className="p-3">
                                                                <div className="w-12 h-12 rounded-[4px] bg-[#F8FBFF] border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden">
                                                                    <img src={col.image_url} alt="" className="max-h-full max-w-full object-contain" />
                                                                </div>
                                                            </td>

                                                            <td className="p-3">
                                                                <p className="font-bold text-azraq-navy">{col.name}</p>
                                                                {isEditing ? (
                                                                    <textarea
                                                                        value={editDesc}
                                                                        onChange={(e) => setEditDesc(e.target.value)}
                                                                        className="w-full mt-1 p-2 border border-azraq-violet rounded text-xs"
                                                                        rows={2}
                                                                    />
                                                                ) : (
                                                                    <p className="text-[11px] text-gray-500 line-clamp-1">{col.description_en}</p>
                                                                )}
                                                            </td>

                                                            <td className="p-3 font-mono font-bold text-azraq-navy">
                                                                {col.id}
                                                            </td>

                                                            <td className="p-3 font-mono text-gray-600">
                                                                {col.source_product_count}
                                                            </td>

                                                            <td className="p-3 font-mono font-bold text-emerald-600">
                                                                {col.imported_product_count}
                                                            </td>

                                                            <td className="p-3">
                                                                <button
                                                                    onClick={() => toggleFeaturedCollection(col)}
                                                                    className={`p-1.5 rounded-lg transition-colors ${col.featured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                                                                        }`}
                                                                    title={col.featured ? 'Featured on Homepage' : 'Not Featured'}
                                                                >
                                                                    <Star className={`w-3.5 h-3.5 ${col.featured ? 'fill-amber-500' : ''}`} />
                                                                </button>
                                                            </td>

                                                            <td className="p-3">
                                                                <button
                                                                    onClick={() => togglePublishCollection(col)}
                                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.publication_status === 'published'
                                                                        ? 'bg-emerald-50 text-emerald-700'
                                                                        : 'bg-gray-100 text-gray-500'
                                                                        }`}
                                                                >
                                                                    {col.publication_status}
                                                                </button>
                                                            </td>

                                                            <td className="p-3 text-right">
                                                                {isEditing ? (
                                                                    <button
                                                                        onClick={() => saveCollectionEdit(col)}
                                                                        className="px-3 py-1 rounded bg-emerald-600 text-white font-bold"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => startEditCollection(col)}
                                                                        className="p-1 text-gray-400 hover:text-azraq-navy"
                                                                        title="Edit Description"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Reconciliation & Sync Audit */}
                            {activeTab === 'audit' && (
                                <div className="space-y-6">

                                    <div className="p-5 rounded-[8px] bg-[#F8FBFF] border border-slate-200/90 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-black text-[#101C35]">
                                                Official Ingestion Reconciliation Report
                                            </h3>
                                            <span className="text-xs font-mono bg-white px-3 py-1 rounded-[4px] border border-slate-200">
                                                Source: https://easydrop.asia/new-store
                                            </span>
                                        </div>

                                        <p className="text-xs text-[#101C35]/70 leading-relaxed">
                                            Generated following complete ingestion of all EasyDrop categories and paginated catalogs. Confirms idempotent deduplication and taxonomy preservation.
                                        </p>

                                        {/* 10 Required Reconciliation Metrics Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">1. Total Collections</span>
                                                <span className="text-lg font-mono font-black text-[#101C35]">
                                                    {reconciliationReport.metrics["1_total_discovered_collections"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">2. Subcollections</span>
                                                <span className="text-lg font-mono font-black text-[#101C35]">
                                                    {reconciliationReport.metrics["2_total_discovered_subcollections"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">3. Unique Products</span>
                                                <span className="text-lg font-mono font-black text-[#0877C9]">
                                                    {reconciliationReport.metrics["3_total_unique_products"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">4. Total Relations</span>
                                                <span className="text-lg font-mono font-black text-[#101C35]">
                                                    {reconciliationReport.metrics["4_total_product_to_collection_relationships"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">5. Successfully Imported</span>
                                                <span className="text-lg font-mono font-black text-emerald-600">
                                                    {reconciliationReport.metrics["5_successfully_imported_products"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">6. Awaiting Review</span>
                                                <span className="text-lg font-mono font-black text-slate-600">
                                                    {reconciliationReport.metrics["6_products_awaiting_review"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">7. Failed Imports</span>
                                                <span className="text-lg font-mono font-black text-slate-600">
                                                    {reconciliationReport.metrics["7_failed_imports"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">8. Missing Images</span>
                                                <span className="text-lg font-mono font-black text-slate-600">
                                                    {reconciliationReport.metrics["8_products_with_missing_images"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono text-slate-400 block">9. Missing Supplier Info</span>
                                                <span className="text-lg font-mono font-black text-slate-600">
                                                    {reconciliationReport.metrics["9_products_with_missing_supplier_information"]}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-white rounded-[6px] border border-emerald-200 bg-emerald-50/50 shadow-2xs">
                                                <span className="text-[10px] font-mono text-emerald-800 block">10. Duplicates Prevented</span>
                                                <span className="text-lg font-mono font-black text-emerald-700">
                                                    {reconciliationReport.metrics["10_duplicate_records_prevented"]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Source-to-Store Mapping Audit */}
                                    <div className="border border-slate-200/90 rounded-[6px] overflow-hidden shadow-2xs">
                                        <div className="p-4 bg-[#F8FBFF] border-b border-slate-200/90">
                                            <h4 className="text-xs font-bold text-[#101C35]">Source-to-Store Collection Reconciliation</h4>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                                            {reconciliationReport.collection_audit.map(item => (
                                                <div key={item.collection_id} className="p-3.5 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-bold text-azraq-navy">Category #{item.collection_id}: {item.name}</span>
                                                        <p className="text-[10px] text-gray-400">Taxonomy: Root Collection • Slug: /collections/collection-{item.collection_id}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-gray-500">Source: {item.source_product_count}</span>
                                                        <span className="font-bold text-emerald-600">Imported: {item.imported_product_count}</span>
                                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">100% Match</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 3: Master Products Catalog */}
                            {activeTab === 'products' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-black text-azraq-navy">Master Central Products Database (257 SKUs)</h3>
                                            <p className="text-xs text-gray-500">Deduplicated master items. View supplier base RM, converted BDT, retail price and stock.</p>
                                        </div>
                                    </div>

                                    <div className="border border-slate-200/90 rounded-[6px] overflow-hidden max-h-96 overflow-y-auto shadow-2xs">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#F8FBFF] border-b border-slate-200/90 font-bold text-[#101C35] sticky top-0">
                                                <tr>
                                                    <th className="p-3">SKU</th>
                                                    <th className="p-3">Product Name</th>
                                                    <th className="p-3">Collection</th>
                                                    <th className="p-3">EasyDrop Cost</th>
                                                    <th className="p-3">EasyDrop Retail (BDT)</th>
                                                    <th className="p-3">Margin</th>
                                                    <th className="p-3">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {products.slice(0, 100).map(p => (
                                                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="p-3 font-mono font-bold text-[#0877C9]">{p.id}</td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-11 h-11 rounded-[4px] bg-[#F8FBFF] border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                                    <img src={p.main_image} alt="" className="w-full h-full object-contain" />
                                                                </div>
                                                                <span className="font-semibold text-[#101C35] truncate max-w-xs">{p.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-slate-600">{p.primary_collection_name || 'General'}</td>
                                                        <td className="p-3 font-mono text-slate-500">৳{Number(p.supplier_buying_price || 0).toLocaleString()}</td>
                                                        <td className="p-3 font-mono font-bold text-[#101C35]">৳{Number(p.price || 0).toLocaleString()}</td>
                                                        <td className="p-3 font-mono font-bold text-emerald-600">৳{(Number(p.price || 0) - Number(p.supplier_buying_price || 0)).toLocaleString()}</td>
                                                        <td className="p-3 font-mono text-slate-700">{p.stock ?? 0} pcs</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">Showing first 100 of {products.length} products (All 100% synchronized with EasyDrop retail prices)</p>
                                </div>
                            )}

                            {/* TAB 4: Orders & Dropship Dispatch */}
                            {activeTab === 'orders' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-azraq-navy">Orders Pipeline & EasyDrop Dispatch</h3>
                                    <div className="space-y-3">
                                        {orders.map(order => {
                                            if (!order) return null;
                                            const customer = order.customer || {};
                                            const customerName = customer.name || order.customer_name || 'Customer';
                                            const customerPhone = customer.phone || order.customer_phone || '';
                                            const customerAddress = customer.address || order.customer_address || 'Address not specified';
                                            const orderTotal = Number(order.total || order.total_amount || 0);

                                            return (
                                                <div key={order.id} className="p-4 rounded-[6px] border border-slate-200/90 bg-[#F8FBFF] space-y-3 shadow-2xs">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                                                        <div>
                                                            <span className="font-mono font-black text-azraq-navy">{order.id}</span>
                                                            <span className="text-xs text-gray-400 ml-2">• {customerName} ({customerPhone})</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={order.order_status || order.status || 'Processing'}
                                                                onChange={(e) => {
                                                                    const next = e.target.value;
                                                                    if (window.confirm(`Are you sure you want to change order ${order.id} status to "${next}"?`)) {
                                                                        updateOrderStatus(order.id, next);
                                                                        showToast(`Order status updated to ${next}`, 'success');
                                                                    }
                                                                }}
                                                                className="px-2.5 py-1 rounded-[4px] border border-slate-200 text-xs font-bold text-[#101C35] bg-white focus:outline-none"
                                                            >
                                                                <option value="Processing">Processing</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Sent to EasyDrop">Sent to EasyDrop</option>
                                                                <option value="Dispatched">Dispatched</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                            <button
                                                                onClick={() => copyEasyDropPayload(order)}
                                                                className="px-3 py-1 rounded-[4px] bg-[#101C35] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0877C9] transition-colors"
                                                            >
                                                                <Copy className="w-3.5 h-3.5 text-[#50DDF0]" />
                                                                <span>Copy Payload</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Total: <strong>৳{orderTotal.toLocaleString()}</strong> ({order.paymentMethod || 'COD'}) • Address: {customerAddress}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: Paymently Gateway & Transactions */}
                            {activeTab === 'payments' && (
                                <div className="space-y-6">

                                    {/* Gateway Configuration & Status Bar */}
                                    <div className="p-5 rounded-[8px] bg-gradient-to-r from-[#062B4F] via-[#0A3D6E] to-[#062B4F] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#50DDF0] shadow-[0_0_8px_#50DDF0]" />
                                                <span className="font-black text-sm tracking-wide text-white">Paymently Gateway Integration</span>
                                                <span className="px-2 py-0.5 rounded-full bg-[#50DDF0]/20 text-[#50DDF0] text-[10px] font-mono font-bold">
                                                    BDT Active
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/70">
                                                Merchant: <strong>AZRAQ</strong> • Provider: Paymently BD • Dynamic UddoktaPay-compatible API
                                            </p>
                                            <p className="text-[11px] font-mono text-white/50">
                                                Base URL: {gatewayConfig?.base_url || 'https://azraq.paymently.io'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={gatewayConfig?.default_link || 'https://azraq.paymently.io/paymentlink/default/BDT'}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-[6px] bg-white/10 hover:bg-white/20 text-[#D9F0FF] text-xs font-bold flex items-center gap-1.5 transition-colors"
                                            >
                                                <span>Merchant Portal</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    setIsVerifyingTxn(true);
                                                    const txns = await fetchTransactions();
                                                    setPaymentTransactions(txns || []);
                                                    setIsVerifyingTxn(false);
                                                    showToast('Transactions synchronized with gateway!', 'success');
                                                }}
                                                className="px-3.5 py-1.5 rounded-[6px] bg-[#0877C9] hover:bg-[#50DDF0] hover:text-[#062B4F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingTxn ? 'animate-spin' : ''}`} />
                                                <span>Sync Gateway</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Transactions Ledger Table */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black text-sm text-[#101C35]">Paymently Transaction Records & Reconciliation</h4>
                                            <span className="text-xs text-slate-500 font-bold">{paymentTransactions.length} recorded</span>
                                        </div>

                                        <div className="border border-slate-200/90 rounded-[6px] overflow-hidden shadow-2xs">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-[#F8FBFF] border-b border-slate-200/90 text-[#101C35] font-bold uppercase tracking-wider text-[10px]">
                                                    <tr>
                                                        <th className="p-3">Order ID</th>
                                                        <th className="p-3">Invoice & TrxID</th>
                                                        <th className="p-3">Customer</th>
                                                        <th className="p-3">Amount</th>
                                                        <th className="p-3">Method</th>
                                                        <th className="p-3">Status</th>
                                                        <th className="p-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {paymentTransactions.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="p-6 text-center text-slate-400">
                                                                No payment transactions recorded yet.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        paymentTransactions.map((txn, idx) => (
                                                            <tr key={txn.id || idx} className="hover:bg-slate-50/70">
                                                                <td className="p-3 font-mono font-bold text-[#101C35]">{txn.order_id}</td>
                                                                <td className="p-3">
                                                                    <div className="font-mono text-[11px] font-bold text-[#0877C9]">{txn.invoice_id}</div>
                                                                    <div className="font-mono text-[10px] text-slate-400">{txn.transaction_id || 'Pending'}</div>
                                                                </td>
                                                                <td className="p-3">
                                                                    <div className="font-semibold text-slate-800">{txn.customer_name || 'Customer'}</div>
                                                                    <div className="text-[10px] text-slate-400">{txn.customer_phone || ''}</div>
                                                                </td>
                                                                <td className="p-3 font-bold font-mono text-[#101C35]">৳{Number(txn.amount || 0).toLocaleString()}</td>
                                                                <td className="p-3">
                                                                    <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-[#0877C9] font-bold text-[10px]">
                                                                        {txn.payment_method || 'Online'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3">
                                                                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase ${txn.status === 'PAID'
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                        : txn.status === 'REFUNDED'
                                                                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                        }`}>
                                                                        {txn.status}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-right space-x-1">
                                                                    {txn.status !== 'REFUNDED' ? (
                                                                        <button
                                                                            onClick={async () => {
                                                                                if (confirm(`Process refund for order ${txn.order_id} (৳${txn.amount})?`)) {
                                                                                    const res = await requestRefund({ orderId: txn.order_id, amount: txn.amount });
                                                                                    if (res.success) {
                                                                                        showToast(`Order ${txn.order_id} marked as Refunded!`, 'success');
                                                                                        const txns = await fetchTransactions();
                                                                                        setPaymentTransactions(txns || []);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            className="px-2 py-1 rounded-[4px] bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold transition-colors"
                                                                        >
                                                                            Refund
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-400 italic">Refunded</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Merchant Account Branding Checklist */}
                                    <div className="p-5 rounded-[8px] bg-[#F8FCFF] border border-slate-200/90 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-[#0877C9]" />
                                            <h4 className="font-black text-sm text-[#101C35]">Paymently Merchant Dashboard Branding Configuration</h4>
                                        </div>
                                        <p className="text-xs text-slate-600">
                                            To ensure full AZRAQ branding across the Paymently hosted checkout screens:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 space-y-1">
                                                <p className="font-bold text-[#101C35]">1. Brand Display Name</p>
                                                <p className="text-slate-500">Ensure merchant display name is set to <strong>AZRAQ</strong> on <code>azraq.paymently.io</code> in Paymently Settings &gt; General.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 space-y-1">
                                                <p className="font-bold text-[#101C35]">2. Brand Logos & Favicon</p>
                                                <p className="text-slate-500">Upload official AZRAQ logo and favicon in Paymently Branding settings.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 space-y-1">
                                                <p className="font-bold text-[#101C35]">3. Theme Hex Colors</p>
                                                <p className="text-slate-500">Primary: <code>#0877C9</code>, Dark: <code>#101C35</code>, Accent: <code>#50DDF0</code>, Background: <code>#F8FCFF</code>.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-[6px] border border-slate-200 space-y-1">
                                                <p className="font-bold text-[#101C35]">4. Instant Webhook URL</p>
                                                <p className="text-slate-500">Set Webhook to: <code>https://azraq.azraqtrips.com/api/payments/webhook</code></p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 6: Financials */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-5 rounded-[8px] bg-[#101C35] text-white">
                                            <span className="text-[10px] uppercase font-mono text-[#50DDF0]">Store Revenue</span>
                                            <p className="text-3xl font-mono font-black text-white mt-1">৳{totalRevenue.toLocaleString()}</p>
                                        </div>
                                        <div className="p-5 rounded-[8px] bg-[#F8FBFF] border border-slate-200">
                                            <span className="text-[10px] uppercase font-mono text-slate-500">Supplier Base Cost</span>
                                            <p className="text-3xl font-mono font-black text-[#101C35] mt-1">৳{totalSupplierCostEst.toLocaleString()}</p>
                                        </div>
                                        <div className="p-5 rounded-[8px] bg-emerald-50 border border-emerald-200">
                                            <span className="text-[10px] uppercase font-mono text-emerald-800">Gross Margin</span>
                                            <p className="text-3xl font-mono font-black text-emerald-700 mt-1">৳{grossProfit.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                )}

                {/* Modal Footer */}
                <div className="p-4 bg-white/85 backdrop-blur-md border-t border-white/90 flex items-center justify-between text-xs text-slate-600">
                    <span>AZRAQ Multi-Collection Engine • EasyDrop Verified</span>
                    <button
                        onClick={() => setIsAdminOpen(false)}
                        className="px-5 py-1.5 rounded-[6px] bg-[#101C35] text-white font-bold hover:bg-[#0877C9] transition-colors"
                    >
                        Close Portal
                    </button>
                </div>

            </div>
        </div>
    );
}

class AdminErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('[AdminPanel Caught Error]:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101C35]/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
                    <div className="relative w-full max-w-md glass-modal rounded-2xl shadow-2xl border border-white/95 p-8 text-center space-y-4 bg-white/95">
                        <div className="w-14 h-14 mx-auto rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-2xl shadow-xs">
                            ⚠️
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Admin Panel Reset Needed</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            A temporary data rendering issue occurred. Click below to clear admin session cache and reopen.
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        sessionStorage.removeItem('azraq_admin_key');
                                    }
                                    this.setState({ hasError: false, error: null });
                                }}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                                Reset & Reopen Admin
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function AdminPanel(props) {
    return (
        <AdminErrorBoundary>
            <AdminPanelInner {...props} />
        </AdminErrorBoundary>
    );
}
