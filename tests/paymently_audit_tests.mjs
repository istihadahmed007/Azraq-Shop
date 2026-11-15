// ====================================================================
// AZRAQ SHOP — PAYMENTLY REAL GATEWAY AUDIT & ACCEPTANCE TEST SUITE
// Comprehensive Verification of Payment Handoff, State Transitions,
// Webhook Authenticity, Idempotency, and Security Invariants.
// ====================================================================

import {
  calculateServerOrderPricing,
  createPaymentlyCheckoutSession,
  createCodCheckoutOrder,
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
  const total = 14;

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
  process.env.APP_BASE_URL = 'https://azraqshop.vercel.app';

  // --- TEST 1: PAID / Verified Success ---
  try {
    console.log('▶ TEST 1 — PAID/Verified Success: Creates genuine order with provider TrxID:');
    const chkId = `AZQ-CHK-TEST-1-${Date.now()}`;
    const invoiceId = `INV-TEST-1-${Date.now()}`;
    const amount = 2870; // 2800 + 70 inside shipping

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
    console.error('  ✗ TEST 1 FAILED:', e.message);
  }

  // --- TEST 2: Provider Returns PENDING (Pending State) ---
  try {
    console.log('\n▶ TEST 2 — Provider Returns PENDING: Status preserved, order is NOT confirmed:');
    const chkId = `AZQ-CHK-TEST-2-${Date.now()}`;
    const invoiceId = `INV-TEST-2-${Date.now()}`;

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
    console.error('  ✗ TEST 2 FAILED:', e.message);
  }

  // --- TEST 3: Manual TrxID Submitted (Pending Verification State) ---
  try {
    console.log('\n▶ TEST 3 — Manual TrxID Entry: Order marked PENDING_VERIFICATION (Never claimed PAID):');
    const chkId = `AZQ-CHK-TEST-3-${Date.now()}`;
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
    console.error('  ✗ TEST 3 FAILED:', e.message);
  }

  // --- TEST 4: Failed Verification & Retry Handling ---
  try {
    console.log('\n▶ TEST 4 — Failed Verification: Attempt marked FAILED, no order created, customer can retry:');
    const chkId = `AZQ-CHK-TEST-4-${Date.now()}`;
    const invoiceId = `INV-TEST-4-${Date.now()}`;

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
    console.error('  ✗ TEST 4 FAILED:', e.message);
  }

  // --- TEST 5: Amount Mismatch Rejection ---
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
          amount: '100', // Paid 100 instead of 4,000!
          transaction_id: 'TRX-FRAUD-555'
        });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified === true || res.status === 'PAID') {
      throw new Error('Vulnerability: Underpaid transaction was approved for fulfillment!');
    }
    console.log('  ✓ Underpaid transaction rejected for order fulfillment (AMOUNT_MISMATCH)');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 5 FAILED:', e.message);
  }

  // --- TEST 6: Unsafe Payment URL Rejection ---
  try {
    console.log('\n▶ TEST 6 — Unsafe Payment URL Rejection: Reject untrusted external links:');
    mockFetchHandler = async (url) => {
      if (url.includes('/api/checkout-v2')) {
        return createMockResponse(200, {
          status: true,
          payment_url: 'https://evil-phishing-site.com/steal-credentials',
          invoice_id: 'INV-FAKE-PHISH'
        });
      }
    };

    const res = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    if (res.success === true || res.payment_url?.includes('evil-phishing-site.com')) {
      throw new Error('Vulnerability: Untrusted payment URL was accepted and returned to client!');
    }
    console.log('  ✓ Untrusted payment URL rejected for security');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 6 FAILED:', e.message);
  }

  // --- TEST 7: Generic Fallback Payment Link Disclosure ---
  try {
    console.log('\n▶ TEST 7 — Generic Fallback Link: Discloses manual amount entry when API key absent:');
    const oldKey = process.env.PAYMENTLY_API_KEY;
    delete process.env.PAYMENTLY_API_KEY;

    const res = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    process.env.PAYMENTLY_API_KEY = oldKey; // restore

    if (!res.success || !res.is_fallback_link || !res.requires_manual_trx || !res.payment_url.includes('paymentlink/default/BDT')) {
      throw new Error(`Fallback session creation did not disclose fallback link: ${JSON.stringify(res)}`);
    }
    console.log('  ✓ Fallback payment link cleanly disclosed with instructions and manual TrxID requirement');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 7 FAILED:', e.message);
  }

  // --- TEST 8: Repeated Verification & Webhook Idempotency ---
  try {
    console.log('\n▶ TEST 8 — Repeated Webhook Idempotency: Exactly one order created on duplicates:');
    const chkId = `AZQ-CHK-TEST-8-${Date.now()}`;
    const invoiceId = `INV-TEST-8-${Date.now()}`;
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
    console.error('  ✗ TEST 8 FAILED:', e.message);
  }

  // --- TEST 9: Webhook Authenticity Check ---
  try {
    console.log('\n▶ TEST 9 — Webhook Authenticity: Reject unauthorized webhooks missing API key header:');
    const invoiceId = `INV-TEST-9-${Date.now()}`;

    // Webhook with invalid header
    const badHeaders = { 'RT-UDDOKTAPAY-API-KEY': 'fake_unauthorized_key' };
    const badWh = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount: 1000 }, badHeaders);
    if (badWh.success === true) {
      throw new Error('Vulnerability: Webhook with invalid API key was accepted!');
    }
    console.log('  ✓ Unauthorized webhook correctly rejected');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST 9 FAILED:', e.message);
  }

  // --- TEST 10: Cash on Delivery (COD) Order Behavior ---
  try {
    console.log('\n▶ TEST 10 — Cash on Delivery (COD): Marked PENDING_COD, never marked PAID:');
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
    console.error('  ✗ TEST 10 FAILED:', e.message);
  }

  // --- TEST 11: Server-Side Authoritative Pricing & Tampering Prevention ---
  try {
    console.log('\n▶ TEST 11 — Server-Side Pricing: Catalog price authoritative, client amount ignored:');
    // Client claims price is 1 BDT for a 2,800 BDT product
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
    console.error('  ✗ TEST 11 FAILED:', e.message);
  }

  // --- TEST 12: Promotional Discount Server Validation ---
  try {
    console.log('\n▶ TEST 12 — Promo Validation: Server strictly enforces valid discount codes:');
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
    console.error('  ✗ TEST 12 FAILED:', e.message);
  }

  // --- TEST 13: Checkout Cancellation ---
  try {
    console.log('\n▶ TEST 13 — Checkout Cancellation: Session marked CANCELLED, no order created:');
    const chkId = `AZQ-CHK-TEST-13-${Date.now()}`;
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
    console.error('  ✗ TEST 13 FAILED:', e.message);
  }

  // --- TEST 14: Trusted Payment URL Helper Verification ---
  try {
    console.log('\n▶ TEST 14 — Trusted Payment URL Helper: Rejects invalid or phishing protocols:');
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
    console.error('  ✗ TEST 14 FAILED:', e.message);
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
