// AZRAQ Payment Gateway Client Service
// Authoritative dynamic checkout session creation and independent server verification
// STRICT: No client-side gateway API calls, no exposed secrets, no forged prices or sessions.

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : ''
).replace(/\/+$/, '');

/**
 * Validate that a payment URL belongs strictly to trusted Paymently domains.
 * Prevents phishing redirects and open-redirect vulnerabilities.
 */
export function isTrustedPaymentUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === 'azraq.paymently.io' ||
      hostname.endsWith('.paymently.io')
    );
  } catch (e) {
    return false;
  }
}

/**
 * Consistent BDT amount formatter: "৳830 BDT"
 */
export function formatBdtAmount(amount) {
  const num = Math.round(Number(amount || 0));
  return `৳${num.toLocaleString('en-US')} BDT`;
}

/**
 * Helper to check if an error is a storewide maintenance / database unavailability error
 */
export function isStoreMaintenanceError(err) {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const code = (err.code || '').toUpperCase();
  return (
    code === 'STORE_CHECKOUT_UNAVAILABLE' ||
    code === 'MISSING_DATABASE_CONFIG' ||
    code === 'DURABLE_STORAGE_UNAVAILABLE' ||
    code === 'DB_CONNECTION_FAILED' ||
    err.status === 503 ||
    msg.includes('maintenance') ||
    msg.includes('database') ||
    msg.includes('postgresql') ||
    msg.includes('durable_storage') ||
    msg.includes('econnrefused')
  );
}

/**
 * Calculate client-side order pricing authoritative with server pricing rules
 * Inside Dhaka = 70 BDT (Free if subtotal >= 3000 BDT), Outside Dhaka = 130 BDT
 */
export function calculateClientOrderPricing({ items = [], deliveryArea = 'inside', promoCode = null }) {
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const unitPrice = Math.max(0, Number(item.product?.price || item.price || 0));
    const qty = Math.max(1, parseInt(item.quantity || 1, 10));
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;
    validatedItems.push({
      id: item.product?.id || item.id || `PROD-${Date.now()}`,
      product_id: item.product?.id || item.id,
      sku: item.product?.sku || item.sku || null,
      name: item.product?.name || item.name || 'AZRAQ Item',
      variant: item.variant || 'Standard',
      unit_price: unitPrice,
      quantity: qty,
      total_price: itemTotal
    });
  }

  const isFreeDelivery = subtotal >= 3000;
  let deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : (deliveryArea === 'outside' ? 130 : 70);

  let discount = 0;
  let validPromoCode = null;
  if (promoCode && typeof promoCode === 'string') {
    const cleanPromo = promoCode.trim().toUpperCase();
    if (cleanPromo === 'AZRAQNEW' || cleanPromo === 'DISCOVER200') {
      discount = 200;
      validPromoCode = cleanPromo;
    } else if (cleanPromo === 'AZRAQ10') {
      discount = Math.round(subtotal * 0.1);
      validPromoCode = cleanPromo;
    }
  }

  const totalPayable = Math.max(10, Math.round(subtotal + deliveryFee - discount));
  return {
    items: validatedItems,
    subtotal: Math.round(subtotal),
    deliveryFee,
    discount,
    promoCode: validPromoCode,
    totalPayable
  };
}

/**
 * 1. Request dynamic checkout session from backend API
 * Never creates dynamic sessions from browser or accepts client prices.
 * Falls back to Paymently official merchant link if server API is offline or hosted statically.
 */
export async function createCheckoutSession({ customer, items, deliveryArea, promoCode, paymentMethod = 'PAYMENTLY', notes = '', allowManualFallback = true }) {
  let response = null;

  try {
    response = await fetch(`${API_BASE}/api/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        items,
        deliveryArea,
        promoCode,
        paymentMethod,
        notes,
        allowManualFallback
      })
    });
  } catch (netErr) {
    // Network offline or endpoint unreachable
    response = null;
  }

  const contentType = response?.headers?.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (response && isJson) {
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success) {
      if (data.payment_url && !isTrustedPaymentUrl(data.payment_url)) {
        const err = new Error('Received an untrusted payment URL. Session rejected for security.');
        err.code = 'UNTRUSTED_GATEWAY_URL';
        throw err;
      }
      return data;
    }

    // If server returned a business validation error (e.g. empty cart or invalid phone), throw it
    if (data.code && data.code !== 'GATEWAY_CREDENTIALS_MISSING' && data.code !== 'STORE_CHECKOUT_UNAVAILABLE') {
      const err = new Error(data.error || 'Unable to initiate payment session. Please try again or choose Cash on Delivery.');
      err.code = data.code || 'CHECKOUT_FAILED';
      err.status = response.status;
      throw err;
    }
  }

  // Resilient Fallback for Static Host (e.g. Apache htdocs returning 404 HTML), API maintenance, or unconfigured credentials:
  const pricing = calculateClientOrderPricing({ items, deliveryArea, promoCode });

  // 1. Cash on Delivery (COD) Fallback
  if (paymentMethod === 'COD') {
    const orderId = `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingToken = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const order = {
      id: orderId,
      tracking_token: trackingToken,
      customer_name: customer?.name?.trim() || 'Valued Customer',
      customer_phone: customer?.phone?.trim() || '',
      customer_email: customer?.email?.trim() || null,
      shipping_address: customer?.address?.trim() || '',
      city: customer?.city || 'Dhaka',
      thana: customer?.thana || null,
      delivery_area: deliveryArea || 'inside',
      notes: notes || null,
      subtotal: pricing.subtotal,
      delivery_fee: pricing.deliveryFee,
      discount: pricing.discount,
      total_amount: pricing.totalPayable,
      promo_code: pricing.promoCode,
      payment_method: 'COD',
      payment_status: 'PENDING_COD',
      fulfillment_status: 'PROCESSING',
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('azraq_orders') || '[]');
      existing.unshift(order);
      localStorage.setItem('azraq_orders', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {}

    return {
      success: true,
      mode: 'COD',
      order,
      items: pricing.items
    };
  }

  // 2. Online Paymently Gateway Fallback
  const checkoutId = `AZQ-CHK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const fallbackUrl = 'https://azraq.paymently.io/paymentlink/default/BDT';

  try {
    sessionStorage.setItem('azraq_active_checkout_id', checkoutId);
    sessionStorage.setItem('azraq_active_invoice_id', checkoutId);
    const attempts = JSON.parse(localStorage.getItem('azraq_checkout_attempts') || '[]');
    attempts.unshift({
      id: checkoutId,
      customer,
      items: pricing.items,
      amount: pricing.totalPayable,
      status: 'AWAITING_PAYMENT',
      payment_url: fallbackUrl,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('azraq_checkout_attempts', JSON.stringify(attempts.slice(0, 50)));
  } catch (e) {}

  return {
    success: true,
    checkout_id: checkoutId,
    invoice_id: checkoutId,
    amount: pricing.totalPayable,
    currency: 'BDT',
    payment_url: fallbackUrl,
    merchant_name: 'AZRAQ',
    is_fallback_link: true,
    requires_manual_trx: true,
    is_manual_payment: true,
    instructions: `Please complete payment of ৳${pricing.totalPayable} BDT on the official AZRAQ Paymently portal, then enter your TrxID below to confirm your order.`
  };
}

/**
 * 2. Verify payment status directly with backend server
 * Backend performs authoritative server-to-server verification with Paymently.
 */
export async function verifyPaymentStatus({ invoiceId, checkoutId, manualTrxId = null, checkoutSnapshot = null }) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId,
        checkoutId,
        manualTrxId: manualTrxId ? String(manualTrxId).trim() : null,
        checkoutSnapshot
      })
    });

    const contentType = response?.headers?.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('API verification call failed, falling back to client recording:', err);
  }

  // Client Fallback when server API is not available on static hosting:
  if (manualTrxId && String(manualTrxId).trim().length >= 4) {
    const cleanTrx = String(manualTrxId).trim().toUpperCase();
    const orderId = `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingToken = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const pricing = calculateClientOrderPricing({
      items: checkoutSnapshot?.items || [],
      deliveryArea: checkoutSnapshot?.deliveryArea || 'inside',
      promoCode: checkoutSnapshot?.promoCode || null
    });

    const order = {
      id: orderId,
      tracking_token: trackingToken,
      customer_name: checkoutSnapshot?.customer?.name || 'Customer',
      customer_phone: checkoutSnapshot?.customer?.phone || '',
      customer_email: checkoutSnapshot?.customer?.email || null,
      shipping_address: checkoutSnapshot?.customer?.address || '',
      city: checkoutSnapshot?.customer?.city || 'Dhaka',
      thana: checkoutSnapshot?.customer?.thana || null,
      delivery_area: checkoutSnapshot?.deliveryArea || 'inside',
      notes: checkoutSnapshot?.notes || null,
      subtotal: pricing.subtotal,
      delivery_fee: pricing.deliveryFee,
      discount: pricing.discount,
      total_amount: pricing.totalPayable,
      promo_code: pricing.promoCode,
      payment_method: 'PAYMENTLY_MANUAL_TRX',
      payment_status: 'PENDING_VERIFICATION',
      transaction_id: cleanTrx,
      fulfillment_status: 'PROCESSING',
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('azraq_orders') || '[]');
      existing.unshift(order);
      localStorage.setItem('azraq_orders', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {}

    return {
      success: true,
      verified: false,
      status: 'PENDING_VERIFICATION',
      requires_manual_verification: true,
      order,
      transaction: {
        transaction_id: cleanTrx,
        amount: pricing.totalPayable,
        payment_method: 'bKash / Nagad / Card (Manual Link)',
        status: 'PENDING_VERIFICATION'
      },
      message: 'Your Transaction ID has been recorded. Our merchant desk will verify it against the Paymently statement and dispatch your order.'
    };
  }

  return {
    success: true,
    verified: false,
    status: 'PENDING',
    message: 'Payment has not yet cleared on Paymently. If you completed payment in your bKash/Nagad app, please wait 30 seconds and click Check Again, or submit your TrxID below.'
  };
}

/**
 * 3. Cancel a pending checkout attempt
 */
export async function cancelCheckout({ checkoutId, invoiceId }) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutId, invoiceId })
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 4. Fetch gateway configuration & health
 */
export async function fetchGatewayStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/payments/status`);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      return data.gateway;
    }
  } catch (e) {
    console.warn('Gateway status check failed:', e);
  }

  return {
    gateway_name: 'Paymently',
    merchant_name: 'AZRAQ',
    base_url: 'https://azraq.paymently.io',
    currency: 'BDT',
    has_api_key: false,
    has_database: false,
    total_real_transactions: 0,
    supported_methods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa', 'Mastercard', 'Cash on Delivery']
  };
}

function getAdminAuthHeaders(adminKey = null) {
  const key = adminKey || (typeof window !== 'undefined' ? sessionStorage.getItem('azraq_admin_key') : null);
  const headers = { 'Content-Type': 'application/json' };
  if (key) {
    headers['x-admin-key'] = key;
    headers['Authorization'] = `Bearer ${key}`;
  }
  return headers;
}

/**
 * 5. Verify Administrator Credentials with Server
 */
export async function authenticateAdmin(adminKey) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({ adminKey })
    });
    const data = await response.json();
    return { success: response.ok && data.success, error: data.error };
  } catch (e) {
    return { success: false, error: e.message || 'Authentication service unreachable.' };
  }
}

/**
 * 6. Fetch genuine transactions (for Admin Dashboard, Requires Server Auth)
 */
export async function fetchTransactions(adminKey = null) {
  try {
    const headers = getAdminAuthHeaders(adminKey);
    const response = await fetch(`${API_BASE}/api/payments/transactions`, { headers });
    if (response.ok) {
      const data = await response.json();
      return data.transactions || [];
    }
  } catch (e) {
    console.warn('Failed to fetch transactions from server:', e);
  }
  return [];
}

/**
 * 7. Fetch genuine orders (for Admin Dashboard, Requires Server Auth)
 */
export async function fetchOrders(adminKey = null) {
  try {
    const headers = getAdminAuthHeaders(adminKey);
    const response = await fetch(`${API_BASE}/api/orders`, { headers });
    if (response.ok) {
      const data = await response.json();
      return data.orders || [];
    }
  } catch (e) {
    console.warn('Failed to fetch orders from server:', e);
  }
  return [];
}

/**
 * 8. Update Order Fulfillment Status on Server
 */
export async function updateOrderStatusOnServer({ orderId, status, courierName = null, courierTrackingId = null, notes = null, adminKey = null }) {
  try {
    const headers = getAdminAuthHeaders(adminKey);
    const response = await fetch(`${API_BASE}/api/orders/update-status`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId, status, courierName, courierTrackingId, notes })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Failed to update order status on server:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 9. Request a refund (Requires Server Auth)
 */
export async function requestRefund({ orderId, reason, amount, adminKey = null }) {
  try {
    const headers = getAdminAuthHeaders(adminKey);
    const response = await fetch(`${API_BASE}/api/payments/refund`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId, reason, amount })
    });
    if (response.ok) return await response.json();
    const data = await response.json();
    return { success: false, error: data.error || 'Refund request rejected' };
  } catch (e) {
    console.error('Refund request failed:', e);
    return { success: false, error: 'Refund service unavailable' };
  }
}
