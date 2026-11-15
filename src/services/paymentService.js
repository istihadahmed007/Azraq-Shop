// AZRAQ Payment Gateway Client Service (Paymently Integration)
// Real dynamic checkout session creation and independent server verification
// STRICT: No simulated confirmations, no fake IDs, no unverified fallbacks.

const API_BASE = ''; // Same origin

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
 * 1. Request dynamic checkout session from backend
 */
export async function createCheckoutSession({ customer, items, deliveryArea, promoCode, paymentMethod = 'PAYMENTLY', notes = '' }) {
  const response = await fetch(`${API_BASE}/api/payments/create`, {
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

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment initiation failed. Please try again.');
  }

  // Safety check on client side for returned payment URL
  if (data.payment_url && !isTrustedPaymentUrl(data.payment_url)) {
    throw new Error('Received an untrusted payment URL. Session rejected for security.');
  }

  return data;
}

/**
 * 2. Verify payment status directly with backend & Paymently
 */
export async function verifyPaymentStatus({ invoiceId, checkoutId, manualTrxId = null, checkoutSnapshot = null }) {
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

  const data = await response.json();
  if (!response.ok && !data.status) {
    return {
      success: false,
      verified: false,
      status: 'FAILED',
      error: data.error || 'Payment could not be verified by the provider.'
    };
  }

  return data;
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
    if (response.ok) {
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

/**
 * 5. Fetch genuine transactions (for Admin Dashboard)
 */
export async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE}/api/payments/transactions`);
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
 * 6. Fetch genuine orders (for Admin Dashboard)
 */
export async function fetchOrders() {
  try {
    const response = await fetch(`${API_BASE}/api/orders`);
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
 * 7. Request a refund
 */
export async function requestRefund({ orderId, reason, amount }) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason, amount })
    });
    if (response.ok) return await response.json();
  } catch (e) {
    console.error('Refund request failed:', e);
  }
  return { success: false, error: 'Refund service unavailable' };
}

