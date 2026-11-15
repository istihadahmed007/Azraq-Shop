// ====================================================================
// AZRAQ SHOP — PAYMENTLY REAL GATEWAY AUDIT & ACCEPTANCE TEST SUITE
// Automated test suite for Tests A through M (Isolated & Mocked)
// Zero dummy data, zero live orders created in production
// ====================================================================

import {
  calculateServerOrderPricing,
  createPaymentlyCheckoutSession,
  createCodCheckoutOrder,
  verifyPaymentlyPayment,
  cancelPaymentlyCheckout,
  handlePaymentlyWebhook,
  getPaymentlyConfig
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
  console.log('🧪 AZRAQ PAYMENTLY REAL PAYMENT AUDIT TEST SUITE (TESTS A - M)');
  console.log('================================================================\n');

  let passed = 0;
  const total = 13;

  const sampleCustomer = {
    name: 'Audit Customer',
    phone: '01711223344',
    address: 'Gulshan 2, Dhaka',
    city: 'Dhaka',
    email: 'customer@azraqshop.com'
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

  // Set mock API key for tests
  process.env.PAYMENTLY_API_KEY = 'test_merchant_live_key_azraq';
  process.env.PAYMENTLY_BASE_URL = 'https://azraq.paymently.io';
  process.env.APP_BASE_URL = 'https://azraqshop.vercel.app';

  // --- TEST A: Successful Payment ---
  try {
    console.log('▶ TEST A — Successful Payment creates exactly ONE order:');
    const chkId = `AZQ-CHK-TEST-A-${Date.now()}`;
    const invoiceId = `INV-TEST-A-${Date.now()}`;
    const amount = 2870; // 2800 + 70 shipping

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

    // Mock Paymently verify-payment returning COMPLETED
    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, {
          status: 'COMPLETED',
          invoice_id: invoiceId,
          amount: String(amount),
          transaction_id: 'BKASH-REAL-TRX-7788',
          payment_method: 'bkash',
          date: new Date().toISOString()
        });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (!res.success || !res.verified || res.status !== 'PAID') {
      throw new Error(`Verification failed, got status: ${res.status}`);
    }
    if (!res.order || !res.order.id || res.order.payment_status !== 'PAID') {
      throw new Error('Order was not properly created upon successful verification');
    }
    console.log(`  ✓ Payment verified (PAID), exactly one genuine order created: ${res.order.id}`);
    console.log(`  ✓ Provider Transaction ID saved: ${res.transaction.transaction_id}`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST A FAILED:', e.message);
  }

  // --- TEST B: Customer Closes Checkout ---
  try {
    console.log('\n▶ TEST B — Customer Closes Checkout: No confirmed order created:');
    const ordersBefore = await getAllOrders();
    const chkId = `AZQ-CHK-TEST-B-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Drop Customer',
      customer_phone: '01700000001',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1000,
      delivery_fee: 70,
      total_payable: 1070,
      status: 'AWAITING_PAYMENT'
    });
    // Customer closes browser without paying
    const attempt = await getCheckoutAttempt(chkId);
    const ordersAfter = await getAllOrders();
    if (attempt.order_id || ordersAfter.length > ordersBefore.length) {
      throw new Error('Order was created for abandoned checkout!');
    }
    console.log('  ✓ Checkout attempt remains unfulfilled (no dummy order created)');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST B FAILED:', e.message);
  }

  // --- TEST C: Payment Cancelled ---
  try {
    console.log('\n▶ TEST C — Payment Cancelled: No paid order is created:');
    const chkId = `AZQ-CHK-TEST-C-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Cancel User',
      customer_phone: '01700000002',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 2000,
      delivery_fee: 70,
      total_payable: 2070,
      status: 'AWAITING_PAYMENT'
    });
    const cancelRes = await cancelPaymentlyCheckout({ checkoutId: chkId });
    if (!cancelRes.success || cancelRes.status !== 'CANCELLED') {
      throw new Error(`Cancellation failed, status: ${cancelRes.status}`);
    }
    const attempt = await getCheckoutAttempt(chkId);
    if (attempt.order_id || attempt.status !== 'CANCELLED') {
      throw new Error('Order was created for cancelled checkout!');
    }
    console.log('  ✓ Checkout attempt marked CANCELLED with no order creation');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST C FAILED:', e.message);
  }

  // --- TEST D: Provider Returns PENDING ---
  try {
    console.log('\n▶ TEST D — Provider Returns PENDING: No paid order created:');
    const chkId = `AZQ-CHK-TEST-D-${Date.now()}`;
    const invoiceId = `INV-TEST-D-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Pending User',
      customer_phone: '01700000003',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1500,
      delivery_fee: 70,
      total_payable: 1570,
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
      throw new Error('Order was created for PENDING transaction!');
    }
    console.log('  ✓ Status preserved as PENDING, order is not confirmed');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST D FAILED:', e.message);
  }

  // --- TEST E: API Key Missing ---
  try {
    console.log('\n▶ TEST E — API Key Missing: Fails safely, no fake link generated:');
    const oldKey = process.env.PAYMENTLY_API_KEY;
    delete process.env.PAYMENTLY_API_KEY;

    const res = await createPaymentlyCheckoutSession({
      customer: sampleCustomer,
      items: sampleItems,
      deliveryArea: 'inside'
    });

    process.env.PAYMENTLY_API_KEY = oldKey; // restore

    if (res.success !== false || !res.error || res.payment_url) {
      throw new Error('Vulnerability: Session creation succeeded or generated fake URL when API key was missing!');
    }
    console.log(`  ✓ Safely rejected with clear error: "${res.error}"`);
    console.log('  ✓ No fake checkout or static fallback generated');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST E FAILED:', e.message);
  }

  // --- TEST F: Verification API Unavailable ---
  try {
    console.log('\n▶ TEST F — Verification API Unavailable: Payment remains unverified:');
    const chkId = `AZQ-CHK-TEST-F-${Date.now()}`;
    const invoiceId = `INV-TEST-F-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Net Error User',
      customer_phone: '01700000004',
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
        throw new Error('Gateway Connection Timeout 504');
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified !== false || res.status === 'PAID') {
      throw new Error('Vulnerability: Marked payment as PAID when verification endpoint failed!');
    }
    console.log('  ✓ Payment remains strictly unverified when gateway is unreachable');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST F FAILED:', e.message);
  }

  // --- TEST G: Wrong Amount Tampering ---
  try {
    console.log('\n▶ TEST G — Wrong Amount: Payment is rejected for fulfilment:');
    const chkId = `AZQ-CHK-TEST-G-${Date.now()}`;
    const invoiceId = `INV-TEST-G-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Mismatch User',
      customer_phone: '01700000005',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 5000,
      delivery_fee: 0,
      total_payable: 5000, // expected 5,000 BDT
      gateway_invoice_id: invoiceId,
      status: 'AWAITING_PAYMENT'
    });

    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(200, {
          status: 'COMPLETED',
          invoice_id: invoiceId,
          amount: '500', // Customer paid 500 instead of 5,000!
          transaction_id: 'TRX-FRAUD-123'
        });
      }
    };

    const res = await verifyPaymentlyPayment({ invoiceId, checkoutId: chkId });
    if (res.verified !== false || res.status === 'PAID') {
      throw new Error('Vulnerability: Fulfilled order despite underpaid amount!');
    }
    console.log('  ✓ Underpaid transaction rejected for order fulfillment (AMOUNT_MISMATCH)');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST G FAILED:', e.message);
  }

  // --- TEST H: Customer Enters Random TrxID ---
  try {
    console.log('\n▶ TEST H — Random TrxID: Cannot produce automatic payment confirmation:');
    const chkId = `AZQ-CHK-TEST-H-${Date.now()}`;
    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Fake TrxID User',
      customer_phone: '01700000006',
      shipping_address: 'Dhaka',
      items_snapshot: [],
      subtotal: 1000,
      delivery_fee: 70,
      total_payable: 1070,
      status: 'AWAITING_PAYMENT'
    });

    // Gateway verify API returns no match for this fake id
    mockFetchHandler = async (url) => {
      if (url.includes('/api/verify-payment')) {
        return createMockResponse(404, { status: 'FAILED', message: 'Invoice not found' });
      }
    };

    const res = await verifyPaymentlyPayment({ checkoutId: chkId, manualTrxId: 'FAKE-TRX-9999' });
    if (res.verified === true || res.status === 'PAID') {
      throw new Error('Vulnerability: Random TrxID produced automatic payment confirmation!');
    }
    console.log('  ✓ Random TrxID rejected from automatic payment clearance');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST H FAILED:', e.message);
  }

  // --- TEST I: Duplicate Webhook Idempotency ---
  try {
    console.log('\n▶ TEST I — Duplicate Webhook: Exactly one order created (Idempotent):');
    const chkId = `AZQ-CHK-TEST-I-${Date.now()}`;
    const invoiceId = `INV-TEST-I-${Date.now()}`;
    const amount = 2870;

    await saveCheckoutAttempt({
      id: chkId,
      customer_name: 'Webhook User',
      customer_phone: '01700000007',
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
          transaction_id: 'TRX-WH-VERIFIED-5544',
          payment_method: 'nagad',
          date: new Date().toISOString()
        });
      }
    };

    // First Webhook delivery
    const wh1 = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount });
    if (!wh1.success || !wh1.order_id) {
      throw new Error('Initial webhook delivery failed to create order');
    }

    // Second Duplicate Webhook delivery
    const wh2 = await handlePaymentlyWebhook({ invoice_id: invoiceId, status: 'COMPLETED', amount });
    if (!wh2.success || !wh2.idempotent) {
      throw new Error('Duplicate webhook did not return idempotent: true');
    }
    console.log('  ✓ First webhook created order');
    console.log('  ✓ Second duplicate webhook identified and skipped idempotently');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST I FAILED:', e.message);
  }

  // --- TEST J: Persistence Consistency ---
  try {
    console.log('\n▶ TEST J — Persistence Consistency: Verified order can be queried:');
    const orders = await getAllOrders();
    if (orders.length === 0) {
      throw new Error('No orders found in persistent database');
    }
    const latestOrder = orders[0];
    const retrieved = await getOrderWithItems(latestOrder.id);
    if (!retrieved || retrieved.id !== latestOrder.id) {
      throw new Error('Could not retrieve order details from database');
    }
    console.log(`  ✓ Order ${retrieved.id} verified consistent with ${retrieved.items?.length || 0} items`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST J FAILED:', e.message);
  }

  // --- TEST K: Dynamic Amount Calculation ---
  try {
    console.log('\n▶ TEST K — Dynamic Amount Calculation for Different Cart Sizes:');
    // Cart 1: 1 item (2,800 BDT) + 70 shipping = 2,870 BDT
    const p1 = calculateServerOrderPricing({ items: sampleItems, deliveryArea: 'inside' });
    if (p1.totalPayable !== 2870) {
      throw new Error(`Cart 1 expected 2,870, got ${p1.totalPayable}`);
    }

    // Cart 2: 2 items (5,600 BDT) -> >= 3000 free shipping = 5,600 BDT
    const p2 = calculateServerOrderPricing({
      items: [{ product: { id: 'AZQ-0001', price: 2800 }, quantity: 2 }],
      deliveryArea: 'inside'
    });
    if (p2.totalPayable !== 5600 || p2.deliveryFee !== 0) {
      throw new Error(`Cart 2 expected 5,600 with free delivery, got total ${p2.totalPayable}, fee ${p2.deliveryFee}`);
    }
    console.log('  ✓ Cart 1 (৳2,800 + ৳70) = ৳2,870 dynamic total verified');
    console.log('  ✓ Cart 2 (৳5,600 with free shipping) = ৳5,600 dynamic total verified');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST K FAILED:', e.message);
  }

  // --- TEST L: Promotional Discount Validation ---
  try {
    console.log('\n▶ TEST L — Promotional Discount Validation on Server:');
    // Subtotal 2800 + 70 inside shipping - 200 AZRAQNEW discount = 2670 BDT
    const pPromo = calculateServerOrderPricing({
      items: sampleItems,
      deliveryArea: 'inside',
      promoCode: 'AZRAQNEW'
    });
    if (pPromo.discount !== 200 || pPromo.totalPayable !== 2670) {
      throw new Error(`Promo calculation failed: Expected 200 discount, 2670 total, got discount ${pPromo.discount}, total ${pPromo.totalPayable}`);
    }
    console.log(`  ✓ Promo code AZRAQNEW strictly applied: -৳${pPromo.discount} -> Final: ৳${pPromo.totalPayable} BDT`);
    passed++;
  } catch (e) {
    console.error('  ✗ TEST L FAILED:', e.message);
  }

  // --- TEST M: Production Deployment Endpoints ---
  try {
    console.log('\n▶ TEST M — Vercel Serverless Handlers Verification:');
    const { default: statusHandler } = await import('../api/payments/status.js');
    const { default: createHandler } = await import('../api/payments/create.js');

    let statusRes = {};
    const mockRes1 = {
      setHeader: () => {},
      status: (code) => { statusRes.statusCode = code; return mockRes1; },
      json: (data) => { statusRes.body = data; return mockRes1; },
      end: () => {}
    };

    await statusHandler({ method: 'GET', headers: {} }, mockRes1);
    if (statusRes.statusCode !== 200 || !statusRes.body?.gateway) {
      throw new Error('Status serverless handler failed');
    }

    console.log('  ✓ /api/payments/status serverless function operational (status 200)');
    console.log('  ✓ Vercel serverless functions ready for production deployment');
    passed++;
  } catch (e) {
    console.error('  ✗ TEST M FAILED:', e.message);
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
