// ====================================================================
// AZRAQ SHOP — PAYMENTLY REAL GATEWAY AUDIT & ACCEPTANCE TEST SUITE
// Comprehensive Verification of Payment Handoff, State Transitions,
// Webhook Authenticity, Idempotency, and Security Invariants.
// ====================================================================

import {
  calculateServerOrderPricing,
  createPaymentlyCheckoutSession,
  createCodCheckoutOrder,
  createManualPortalCheckoutOrder,
  verifyPaymentlyPayment,
  cancelPaymentlyCheckout,
  handlePaymentlyWebhook,
  getPaymentlyConfig,
  isTrustedPaymentUrl
} from '../server/paymentlyService.js';
import { 
  getCheckoutAttempt, 
  getAllOrders, 
  getOrderWithItems,
  saveCheckoutAttempt 
} from '../server/db.js';

// Setup mock fetch for Paymently API
const originalFetch = global.fetch;
let mockFetchHandler = null;

global.fetch = async (url, options) => {
  if (mockFetchHandler) {
    const res = await mockFetchHandler(url, options);
    if (res !== undefined) return res;
  }
  return originalFetch(url, options);
};

function createMockResponse(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  };
}

async function runAuditSuite() {
  console.log('================================================================');
  console.log('🧪 AZRAQ PAYMENTLY COMPLETE AUDIT & VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  const total = 20;

  const sampleCustomer = {
    name: 'Istihad Ahmed',
    phone: '01711223344',
    address: 'Road 5, Block B, Banani, Dhaka',
    city: 'Dhaka',
    email: 'istihad@azraqshop.com'
  };

  const sampleItems = [
    {
      product: {
        id: 'AZQ-0001',
        name: 'Baseus Fast Charging Gift Box Set',
        price: 2800,
        sku: 'ED-SKU-3727'
      },
      quantity: 1
    }
  ];

  // Configure test environment
  process.env.PAYMENTLY_API_KEY = 'test_merchant_live_key_azraq';
  process.env.PAYMENTLY_BASE_URL = 'https://azraq.paymently.io';
  process.env.APP_BASE_URL = 'https://azraq.azraqtrips.com';

  // --- TEST 1: Successful Dynamic Session Creation ---
  try {
    console.log('▶ TEST 1 — Successful Dynamic Session Creation:');
    const invoiceToken = `INV-TOKEN-${Date.now()}`;
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        return createMockResponse(200, {
          status: true,
          message: 'Payment Initiated',
          payment_url: `https://azraq.paymently.io/checkout/${invoiceToken}`
        });
      }
    };

    const sessionRes = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (!sessionRes.success || !sessionRes.payment_url || sessionRes.is_fallback_link) {
      throw new Error(`Expected successful dynamic session, got: ${JSON.stringify(sessionRes)}`);
    }
    if (sessionRes.amount !== 2870 || sessionRes.invoice_id !== invoiceToken) {
      throw new Error(`Mismatch in amount or invoiceId: ${JSON.stringify(sessionRes)}`);
    }
    const attempt = await getCheckoutAttempt(sessionRes.checkout_id);
    if (!attempt || attempt.status !== 'AWAITING_PAYMENT') {
      throw new Error('Checkout attempt was not persisted with status AWAITING_PAYMENT');
    }
    console.log(`  ✓ Unique dynamic session created: ${sessionRes.checkout_id}`);
    console.log(`  ✓ Authoritative amount locked: ৳${sessionRes.amount} BDT, token: ${sessionRes.invoice_id}`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 1 FAILED:', e.message);
  }

  // --- TEST 2: Missing Credentials Handling ---
  try {
    console.log('\n▶ TEST 2 — Missing Credentials: Fails safely with diagnostic code:');
    const savedKey = process.env.PAYMENTLY_API_KEY;
    delete process.env.PAYMENTLY_API_KEY;

    const noKeyRes = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    process.env.PAYMENTLY_API_KEY = savedKey; // restore

    if (noKeyRes.success !== false || noKeyRes.code !== 'GATEWAY_CREDENTIALS_MISSING') {
      throw new Error(`Expected failure with GATEWAY_CREDENTIALS_MISSING, got: ${JSON.stringify(noKeyRes)}`);
    }
    const attempt = await getCheckoutAttempt(noKeyRes.checkout_id);
    if (!attempt || attempt.status !== 'FAILED') {
      throw new Error('Attempt status was not marked FAILED when credentials were missing');
    }
    console.log('  ✓ Missing API key fails closed with GATEWAY_CREDENTIALS_MISSING');
    console.log('  ✓ No unlinked fallback link pretended to be dynamic session');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 2 FAILED:', e.message);
  }

  // --- TEST 3: Provider Rejection Handling ---
  try {
    console.log('\n▶ TEST 3 — Provider Rejection: Records error code and keeps cart safe:');
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        return createMockResponse(400, {
          status: false,
          message: 'Merchant account currency mismatch'
        });
      }
    };

    const rejRes = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (rejRes.success !== false || rejRes.code !== 'GATEWAY_REJECTED') {
      throw new Error(`Expected GATEWAY_REJECTED, got: ${JSON.stringify(rejRes)}`);
    }
    const attempt = await getCheckoutAttempt(rejRes.checkout_id);
    if (!attempt || attempt.status !== 'FAILED') {
      throw new Error('Attempt was not marked FAILED on rejection');
    }
    console.log('  ✓ Provider rejection returned sanitized GATEWAY_REJECTED');
    console.log('  ✓ Attempt status updated to FAILED without corrupting cart');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 3 FAILED:', e.message);
  }

  // --- TEST 4: Provider Timeout Handling ---
  try {
    console.log('\n▶ TEST 4 — Provider Timeout: Handles abort / timeout safely:');
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        const timeoutErr = new Error('The operation was aborted due to timeout');
        timeoutErr.name = 'TimeoutError';
        throw timeoutErr;
      }
    };

    const timeoutRes = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (timeoutRes.success !== false || timeoutRes.code !== 'GATEWAY_TIMEOUT') {
      throw new Error(`Expected GATEWAY_TIMEOUT, got: ${JSON.stringify(timeoutRes)}`);
    }
    const attempt = await getCheckoutAttempt(timeoutRes.checkout_id);
    if (!attempt || attempt.status !== 'FAILED') {
      throw new Error('Attempt was not marked FAILED on timeout');
    }
    console.log('  ✓ Network timeout handled gracefully with GATEWAY_TIMEOUT');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 4 FAILED:', e.message);
  }

  // --- TEST 5: Underpayment / Amount Mismatch Rejection ---
  try {
    console.log('\n▶ TEST 5 — Amount Mismatch: Reject payment if customer paid less than required:');
    const chkId = `AZQ-CHK-TEST-5-${Date.now()}`;
    const invoiceId = `INV-TEST-5-${Date.now()}`;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Underpay User',
      customer_phone: '01711223305',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 4000,
      delivery_fee: 0,
      total_payable: 4000,
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, {
          status: 'COMPLETED',
          invoice_id: invoiceId,
          amount: '100', // Customer paid ৳100 instead of ৳4,000!
          transaction_id: 'TRX-FRAUD-555'
        });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified === true || res.status === 'PAID') {
      throw new Error('Vulnerability: Underpaid transaction was approved for fulfillment!');
    }
    if (res.status !== 'AMOUNT_MISMATCH') {
      throw new Error(`Expected status AMOUNT_MISMATCH, got ${res.status}`);
    }
    console.log('  ✓ Underpaid transaction rejected for order fulfillment (AMOUNT_MISMATCH)');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 5 FAILED:', e.message);
  }

  // --- TEST 6: Invalid Webhook Signature / Header Authenticity ---
  try {
    console.log('\n▶ TEST 6 — Webhook Authenticity: Reject unauthorized webhooks missing API key header:');
    const invoiceId = `INV-TEST-6-${Date.now()}`;
    const badHeaders = { 'RT-UDDOKTAPAY-API-KEY': 'fake_unauthorized_key' };
    const badWh = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount: 1000 }, badHeaders);
    if (badWh.success === true) {
      throw new Error('Vulnerability: Webhook with invalid API key was accepted!');
    }
    console.log('  ✓ Unauthorized webhook correctly rejected');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 6 FAILED:', e.message);
  }

  // --- TEST 7: Duplicate Webhook Idempotency ---
  try {
    console.log('\n▶ TEST 7 — Repeated Webhook Idempotency: Exactly one order created on duplicates:');
    const chkId = `AZQ-CHK-TEST-7-${Date.now()}`;
    const invoiceId = `INV-TEST-7-${Date.now()}`;
    const amount = 2870;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Webhook User',
      customer_phone: '01711223308',
      shipping_address: 'Dhaka',
      items_snapshot: [{ product_id: 'AZQ-0001', name: 'Baseus Set', unit_price: 2800, quantity: 1 }],
      subtotal: 2800,
      delivery_fee: 70,
      discount: 0,
      total_payable: amount,
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, {
          status: 'COMPLETED',
          invoice_id: invoiceId,
          amount: String(amount),
          transaction_id: 'TRX-IDEMPOTENT-4422',
          payment_method: 'nagad',
          date: new Date().toISOString()
        });
      }
    };

    const headers = { 'RT-UDDOKTAPAY-API-KEY': process.env.PAYMENTLY_API_KEY };

    // 1st webhook
    const wh1 = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount }, headers);
    if (!wh1.success || !wh1.order_id) {
      throw new Error('Initial webhook failed to create order');
    }

    // 2nd duplicate webhook
    const wh2 = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount }, headers);
    if (!wh2.success || !wh2.idempotent) {
      throw new Error('Duplicate webhook did not return idempotent: true');
    }
    console.log('  ✓ Initial webhook fulfilled order');
    console.log('  ✓ Repeated duplicate webhook skipped idempotently');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 7 FAILED:', e.message);
  }

  // --- TEST 8: Failed Verification Handling ---
  try {
    console.log('\n▶ TEST 8 — Failed Verification: Attempt marked FAILED, no order created, customer can retry:');
    const chkId = `AZQ-CHK-TEST-8-${Date.now()}`;
    const invoiceId = `INV-TEST-8-${Date.now()}`;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Failed User',
      customer_phone: '01711223304',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1200,
      delivery_fee: 70,
      total_payable: 1270,
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, { status: 'FAILED', invoice_id: invoiceId });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified === true || res.status !== 'FAILED') {
      throw new Error(`Expected status: FAILED, verified: false, got ${JSON.stringify(res)}`);
    }
    const attempt = await getCheckoutAttempt(chkId);
    if (attempt.order_id) {
      throw new Error('Order was incorrectly created for FAILED transaction!');
    }
    console.log('  ✓ Verification failure properly recorded without creating paid order');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 8 FAILED:', e.message);
  }

  // --- TEST 9: Retry Behavior ---
  try {
    console.log('\n▶ TEST 9 — Retry Behavior: Customer can retry without cart data corruption:');
    // First attempt fails (e.g. simulated network rejection)
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        return createMockResponse(500, { status: false, message: 'Temporary gateway hiccup' });
      }
    };

    const firstAttempt = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });
    if (firstAttempt.success !== false) {
      throw new Error('First attempt was expected to fail');
    }

    // Customer retries checkout after provider recovers
    const retryToken = `INV-RETRY-${Date.now()}`;
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        return createMockResponse(200, {
          status: true,
          message: 'Payment Initiated',
          payment_url: `https://azraq.paymently.io/checkout/${retryToken}`
        });
      }
    };

    const retryAttempt = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (!retryAttempt.success || retryAttempt.checkout_id === firstAttempt.checkout_id) {
      throw new Error('Retry did not create a fresh successful checkout attempt');
    }
    console.log(`  ✓ Initial failure cleanly preserved state`);
    console.log(`  ✓ Retry attempt generated fresh valid session: ${retryAttempt.checkout_id}`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 9 FAILED:', e.message);
  }

  // --- TEST 10: PAID / Verified Success ---
  try {
    console.log('\n▶ TEST 10 — PAID/Verified Success: Creates genuine order with provider TrxID:');
    const chkId = `AZQ-CHK-TEST-10-${Date.now()}`;
    const invoiceId = `INV-TEST-10-${Date.now()}`;
    const amount = 2870;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: sampleCustomer.name,
      customer_phone: sampleCustomer.phone,
      shipping_address: sampleCustomer.address,
      items_snapshot: [{ product_id: 'AZQ-0001', name: 'Baseus Set', unit_price: 2800, quantity: 1 }],
      subtotal: 2800,
      delivery_fee: 70,
      discount: 0,
      total_payable: amount,
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, {
          status: 'COMPLETED',
          invoice_id: invoiceId,
          amount: String(amount),
          transaction_id: 'BKASH-VERIFIED-TRX-9988',
          payment_method: 'bkash',
          date: new Date().toISOString()
        });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (!res.success || !res.verified || res.status !== 'PAID') {
      throw new Error(`Expected verified PAID, got: ${JSON.stringify(res)}`);
    }
    if (!res.order || res.order.payment_status !== 'PAID' || res.transaction.transaction_id !== 'BKASH-VERIFIED-TRX-9988') {
      throw new Error('Order or transaction record was not marked PAID with provider TrxID');
    }
    console.log(`  ✓ Payment verified (PAID), exactly one genuine order created: ${res.order.id}`);
    console.log(`  ✓ Authentic provider TrxID stored: ${res.transaction.transaction_id}`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 10 FAILED:', e.message);
  }

  // --- TEST 11: Provider Returns PENDING ---
  try {
    console.log('\n▶ TEST 11 — Provider Returns PENDING: Status preserved, order is NOT confirmed:');
    const chkId = `AZQ-CHK-TEST-11-${Date.now()}`;
    const invoiceId = `INV-TEST-11-${Date.now()}`;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Pending Customer',
      customer_phone: '01711223302',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1000,
      delivery_fee: 70,
      total_payable: 1070,
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, { status: 'PENDING', invoice_id: invoiceId });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified !== false || res.status !== 'PENDING') {
      throw new Error(`Expected verified: false, status: PENDING, got ${JSON.stringify(res)}`);
    }
    const attempt = await getCheckoutAttempt(chkId);
    if (attempt.order_id) {
      throw new Error('Order was incorrectly created for PENDING transaction!');
    }
    console.log('  ✓ Status preserved as PENDING, order is not confirmed');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 11 FAILED:', e.message);
  }

  // --- TEST 12: Manual TrxID Entry ---
  try {
    console.log('\n▶ TEST 12 — Manual TrxID Entry: Order marked PENDING_VERIFICATION (Never claimed PAID):');
    const chkId = `AZQ-CHK-TEST-12-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Manual Trx User',
      customer_phone: '01711223303',
      shipping_address: 'Dhaka',
      items_snapshot: [{ product_id: 'AZQ-0001', name: 'Item', unit_price: 1500, quantity: 1 }],
      subtotal: 1500,
      delivery_fee: 70,
      total_payable: 1570,
      status: 'AWAITING_PAYMENT'
    });

    const res = await verifyPaymentlyPayment({ checkoutId: chkId, manualTrxId: 'BKASH-MANUAL-7721' });
    if (res.verified === true || res.status === 'PAID') {
      throw new Error('Vulnerability: Manual TrxID was claimed as PAID without provider clearance!');
    }
    if (res.status !== 'PENDING_VERIFICATION' || res.order?.payment_status !== 'PENDING_VERIFICATION') {
      throw new Error(`Expected PENDING_VERIFICATION, got ${res.status}`);
    }
    console.log(`  ✓ Order created with status PENDING_VERIFICATION: ${res.order.id}`);
    console.log('  ✓ Manual TrxID recorded for accounting verification, not claimed PAID');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 12 FAILED:', e.message);
  }

  // --- TEST 13: Explicit Manual Portal Option ---
  try {
    console.log('\n▶ TEST 13 — Explicit Manual Portal Option: Clearly labeled as manual / pending verification:');
    const manRes = await createManualPortalCheckoutOrder({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (!manRes.success || !manRes.is_manual_payment || !manRes.requires_manual_trx) {
      throw new Error(`Expected manual payment flags, got ${JSON.stringify(manRes)}`);
    }
    console.log('  ✓ Manual payment option explicitly labeled as manual and pending verification');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 13 FAILED:', e.message);
  }

  // --- TEST 14: Cash on Delivery (COD) Order Behavior ---
  try {
    console.log('\n▶ TEST 14 — Cash on Delivery (COD): Marked PENDING_COD, never marked PAID:');
    const codRes = await createCodCheckoutOrder({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (!codRes.success || !codRes.order) {
      throw new Error('COD order creation failed');
    }
    if (codRes.order.payment_status !== 'PENDING_COD' || codRes.order.payment_method !== 'COD') {
      throw new Error(`COD order had invalid payment status: ${codRes.order.payment_status}`);
    }
    console.log(`  ✓ COD order created with status PENDING_COD: ${codRes.order.id}`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 14 FAILED:', e.message);
  }

  // --- TEST 15: Server-Side Authoritative Pricing & Tampering Prevention ---
  try {
    console.log('\n▶ TEST 15 — Server-Side Pricing: Catalog price authoritative, client amount ignored:');
    const pricing = calculateServerOrderPricing({
      items: [{ product: { id: 'AZQ-0001', price: 1 }, quantity: 1 }],
      deliveryArea: 'inside'
    });

    if (pricing.items[0].unit_price !== 2800 || pricing.totalPayable !== 2870) {
      throw new Error(`Price tampering not prevented! Got unit price ${pricing.items[0].unit_price}, total ${pricing.totalPayable}`);
    }
    console.log('  ✓ Client-tampered price ignored; authoritative catalog price ৳2,800 enforced');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 15 FAILED:', e.message);
  }

  // --- TEST 16: Promotional Discount Server Validation ---
  try {
    console.log('\n▶ TEST 16 — Promo Validation: Server strictly enforces valid discount codes:');
    const p1 = calculateServerOrderPricing({ items: sampleItems, promoCode: 'AZRAQNEW' });
    if (p1.discount !== 200 || p1.totalPayable !== 2670) {
      throw new Error(`AZRAQNEW expected discount 200, total 2670, got ${p1.discount}, ${p1.totalPayable}`);
    }

    const p2 = calculateServerOrderPricing({ items: sampleItems, promoCode: 'AZRAQ10' });
    if (p2.discount !== 280 || p2.totalPayable !== 2590) {
      throw new Error(`AZRAQ10 expected discount 280, total 2590, got ${p2.discount}, ${p2.totalPayable}`);
    }
    console.log('  ✓ Promo discounts validated server-side (AZRAQNEW: -৳200, AZRAQ10: -10%)');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 16 FAILED:', e.message);
  }

  // --- TEST 17: Checkout Cancellation ---
  try {
    console.log('\n▶ TEST 17 — Checkout Cancellation: Session marked CANCELLED, no order created:');
    const chkId = `AZQ-CHK-TEST-17-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Cancel User',
      customer_phone: '01711223313',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1000,
      delivery_fee: 70,
      total_payable: 1070,
      status: 'AWAITING_PAYMENT'
    });

    const cancelRes = await cancelPaymentlyCheckout({ checkoutId: chkId });
    if (!cancelRes.success || cancelRes.status !== 'CANCELLED') {
      throw new Error('Cancel checkout failed');
    }
    const attempt = await getCheckoutAttempt(chkId);
    if (attempt.status !== 'CANCELLED' || attempt.order_id) {
      throw new Error('Attempt status was not set to CANCELLED');
    }
    console.log('  ✓ Checkout attempt marked CANCELLED without creating confirmed order');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 17 FAILED:', e.message);
  }

  // --- TEST 18: Trusted Payment URL Helper Verification ---
  try {
    console.log('\n▶ TEST 18 — Trusted Payment URL Helper: Rejects invalid or phishing protocols:');
    const validUrl1 = 'https://azraq.paymently.io/checkout-v2/INV-12345';
    const validUrl2 = 'https://azraq.paymently.io/paymentlink/default/BDT';
    const invalidUrl1 = 'http://azraq.paymently.io/checkout'; // insecure http
    const invalidUrl2 = 'https://phishing-paymently.io/checkout';
    const invalidUrl3 = 'javascript:alert(1)';

    if (!isTrustedPaymentUrl(validUrl1) || !isTrustedPaymentUrl(validUrl2)) {
      throw new Error('Valid Paymently URLs were rejected');
    }
    if (isTrustedPaymentUrl(invalidUrl1) || isTrustedPaymentUrl(invalidUrl2) || isTrustedPaymentUrl(invalidUrl3)) {
      throw new Error('Invalid/phishing URLs were incorrectly approved');
    }
    console.log('  ✓ Official Paymently HTTPS URLs approved');
    console.log('  ✓ Insecure http, phishing domains, and javascript URLs rejected');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 18 FAILED:', e.message);
  }

  // --- TEST 19: Unknown Product Rejection ---
  try {
    console.log('\n▶ TEST 19 — Unknown Product Rejection: Reject products not in authoritative catalog:');
    let threw = false;
    try {
      calculateServerOrderPricing({
        items: [{ product: { id: 'NON-EXISTENT-SKU-9999' }, quantity: 1 }],
        deliveryArea: 'inside'
      });
    } catch (err) {
      threw = true;
      if (!err.message.includes('not found in the authoritative catalogue')) {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }
    if (!threw) {
      throw new Error('Server pricing allowed unknown product ID without throwing');
    }
    console.log('  ✓ Unknown product correctly rejected with error');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 19 FAILED:', e.message);
  }

  // --- TEST 20: Invalid Quantity Rejection ---
  try {
    console.log('\n▶ TEST 20 — Invalid Quantity Rejection: Reject negative, zero, or > 100 quantities:');
    let threwZero = false;
    try {
      calculateServerOrderPricing({
        items: [{ product: { id: 'AZQ-0001' }, quantity: 0 }],
        deliveryArea: 'inside'
      });
    } catch (err) {
      threwZero = true;
    }

    let threwLimit = false;
    try {
      calculateServerOrderPricing({
        items: [{ product: { id: 'AZQ-0001' }, quantity: 101 }],
        deliveryArea: 'inside'
      });
    } catch (err) {
      threwLimit = true;
    }

    if (!threwZero || !threwLimit) {
      throw new Error(`Quantity validation failed: threwZero=${threwZero}, threwLimit=${threwLimit}`);
    }
    console.log('  ✓ Invalid quantities (0 and 101) rejected safely');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 20 FAILED:', e.message);
  }

  console.log('\n================================================================');
  console.log(`📊 FINAL RESULTS: ${passed}/${total} AUDIT ACCEPTANCE TESTS PASSED`);
  console.log('================================================================\n');

  // Restore fetch
  global.fetch = originalFetch;

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAuditSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
