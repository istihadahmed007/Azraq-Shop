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
 * 1. Request dynamic checkout session from backend API
 * Never creates dynamic sessions from browser or accepts client prices.
 */
export async function createCheckoutSession({ customer, items, deliveryArea, promoCode, paymentMethod = 'PAYMENTLY', notes = '' }) {
  let response;
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
        notes
      })
    });
  } catch (netErr) {
    const err = new Error('Unable to connect to the checkout server. Please check your internet connection or choose Cash on Delivery.');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const err = new Error('Checkout service is temporarily unreachable. Please try again or choose Cash on Delivery.');
    err.code = 'ENDPOINT_UNREACHABLE';
    err.status = response.status;
    throw err;
  }

  const data = await response.json().catch(() => ({}));

  if (response.ok && data.success) {
    if (data.payment_url && !isTrustedPaymentUrl(data.payment_url)) {
      const err = new Error('Received an untrusted payment URL. Session rejected for security.');
      err.code = 'UNTRUSTED_GATEWAY_URL';
      throw err;
    }
    return data;
  }

  // Server returned an error code or validation issue
  const err = new Error(data.error || 'Unable to initiate payment session. Please try again or choose Cash on Delivery.');
  err.code = data.code || 'CHECKOUT_FAILED';
  err.status = response.status;
  throw err;
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

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }

    return {
      success: false,
      verified: false,
      status: 'VERIFICATION_UNAVAILABLE',
      error: 'Payment verification service temporarily unreachable. Please try checking again in a few moments.'
    };
  } catch (err) {
    return {
      success: false,
      verified: false,
      status: 'NETWORK_ERROR',
      error: 'Unable to reach payment verification server. Please check your connection and retry.'
    };
  }
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
