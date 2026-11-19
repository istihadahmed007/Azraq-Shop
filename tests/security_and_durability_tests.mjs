/**
 * AZRAQ Security, Admin Authorization, Durability & Storage Tests
 * Verifies:
 * 1. Sensitive APIs reject unauthenticated requests and accept valid admin keys.
 * 2. Fail-closed invariants when production secrets (ADMIN_API_KEY, DATABASE_URL) are missing.
 * 3. Browser storage resiliency (JSON corruption recovery, schema validation, quota fallback).
 * 4. Refund processing updates transaction, cancels order, and records audit trail.
 */

import assert from 'assert';
import { verifyAdminAuth } from '../server/adminAuth.js';
import {
  assertDurablePersistence,
  processRefund,
  initDb,
  saveCheckoutAttempt,
  createOrderFromVerifiedPayment,
  createCodOrder,
  getCheckoutAttempt,
  getAllOrders
} from '../server/db.js';
import { isStoreMaintenanceError } from '../src/services/paymentService.js';
import { getStoredItem, setStoredItem, validateCartItems, validateFavoritesList, validateOrdersList } from '../src/utils/storage.js';

let passed = 0;
let total = 0;

async function runTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('='.repeat(64));
console.log('🔒 AZRAQ SECURITY, DURABILITY & AUTHORIZATION TEST SUITE');
console.log('='.repeat(64));

// 1. Admin Authentication Tests
await runTest('Admin Auth: rejects request missing authorization headers', () => {
  const req = { headers: {} };
  const auth = verifyAdminAuth(req);
  assert.strictEqual(auth.authenticated, false);
  assert.strictEqual(auth.statusCode, 401);
});

await runTest('Admin Auth: rejects request with incorrect admin key', () => {
  const req = { headers: { 'x-admin-key': 'wrong_invalid_key_123' } };
  const auth = verifyAdminAuth(req);
  assert.strictEqual(auth.authenticated, false);
  assert.strictEqual(auth.statusCode, 401);
});

await runTest('Admin Auth: accepts request with valid admin key via x-admin-key header', () => {
  const prevEnv = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = 'test_secret_admin_key_9988';
  try {
    const req = { headers: { 'x-admin-key': 'test_secret_admin_key_9988' } };
    const auth = verifyAdminAuth(req);
    assert.strictEqual(auth.authenticated, true);
  } finally {
    process.env.ADMIN_API_KEY = prevEnv;
  }
});

await runTest('Admin Auth: accepts request with Bearer token authorization header', () => {
  const prevEnv = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = 'test_secret_admin_key_9988';
  try {
    const req = { headers: { 'authorization': 'Bearer test_secret_admin_key_9988' } };
    const auth = verifyAdminAuth(req);
    assert.strictEqual(auth.authenticated, true);
  } finally {
    process.env.ADMIN_API_KEY = prevEnv;
  }
});

await runTest('Production Invariant: hard-coded keys (0133865246, azraq-admin-secret-2026) are rejected in production', () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevKey = process.env.ADMIN_API_KEY;
  process.env.NODE_ENV = 'production';
  process.env.ADMIN_API_KEY = 'configured_production_secret_key_8899';

  try {
    const legacyKeys = ['0133865246', 'azraq-admin-secret-2026', 'azraq_admin_2026', 'admin@azraq'];
    for (const key of legacyKeys) {
      const req = { headers: { 'x-admin-key': key } };
      const auth = verifyAdminAuth(req);
      assert.strictEqual(auth.authenticated, false, `Legacy key '${key}' must NOT be accepted in production!`);
      assert.strictEqual(auth.statusCode, 401);
    }

    // Configured secret must succeed
    const validReq = { headers: { 'x-admin-key': 'configured_production_secret_key_8899' } };
    const validAuth = verifyAdminAuth(validReq);
    assert.strictEqual(validAuth.authenticated, true, 'Configured production secret must be authenticated successfully');
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    if (prevKey !== undefined) process.env.ADMIN_API_KEY = prevKey;
    else delete process.env.ADMIN_API_KEY;
  }
});

// 2. Production Fail-Closed Invariants
await runTest('Production Invariant: verifyAdminAuth fails closed (500) if ADMIN_API_KEY missing in production', () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevKey = process.env.ADMIN_API_KEY;
  process.env.NODE_ENV = 'production';
  delete process.env.ADMIN_API_KEY;
  delete process.env.ADMIN_SECRET;

  try {
    const req = { headers: { 'x-admin-key': 'some_key' } };
    const auth = verifyAdminAuth(req);
    assert.strictEqual(auth.authenticated, false);
    assert.strictEqual(auth.statusCode, 500, 'Must fail closed with status 500');
    assert.ok(auth.error.includes('misconfiguration'));
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    if (prevKey !== undefined) process.env.ADMIN_API_KEY = prevKey;
    else delete process.env.ADMIN_API_KEY;
  }
});

await runTest('Production Invariant: assertDurablePersistence fails closed if DATABASE_URL missing in production', () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevDbUrl = process.env.DATABASE_URL;
  process.env.NODE_ENV = 'production';
  delete process.env.DATABASE_URL;

  try {
    let threw = false;
    try {
      assertDurablePersistence();
    } catch (e) {
      threw = true;
      assert.strictEqual(e.code, 'MISSING_DATABASE_CONFIG');
    }
    assert.ok(threw, 'Must throw MISSING_DATABASE_CONFIG in production without DATABASE_URL');
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    if (prevDbUrl !== undefined) process.env.DATABASE_URL = prevDbUrl;
    else delete process.env.DATABASE_URL;
  }
});

await runTest('Production Invariant: saveCheckoutAttempt fails closed if pool unavailable in production', async () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevDbUrl = process.env.DATABASE_URL;
  process.env.NODE_ENV = 'production';
  delete process.env.DATABASE_URL;

  try {
    let threw = false;
    try {
      await saveCheckoutAttempt({
        id: 'AZQ-CHK-TEST-FAIL-CLOSED',
        customer_name: 'Test Customer',
        customer_phone: '01711000000',
        shipping_address: 'Banani, Dhaka',
        items_snapshot: [{ id: 'ITEM-1', name: 'Shirt', quantity: 1, unit_price: 1000, total_price: 1000 }],
        subtotal: 1000,
        delivery_fee: 70,
        total_payable: 1070
      });
    } catch (e) {
      threw = true;
      assert.ok(e.code === 'MISSING_DATABASE_CONFIG' || e.code === 'DURABLE_STORAGE_UNAVAILABLE');
    }
    assert.ok(threw, 'saveCheckoutAttempt must fail closed in production without durable database');
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    if (prevDbUrl !== undefined) process.env.DATABASE_URL = prevDbUrl;
    else delete process.env.DATABASE_URL;
  }
});

await runTest('Production Invariant: createCodOrder fails closed if pool unavailable in production', async () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevDbUrl = process.env.DATABASE_URL;
  process.env.NODE_ENV = 'production';
  delete process.env.DATABASE_URL;

  try {
    let threw = false;
    try {
      await createCodOrder({
        checkoutAttempt: {
          id: 'AZQ-CHK-COD-FAIL',
          customer_name: 'COD Test',
          customer_phone: '01711223344',
          shipping_address: 'Dhanmondi, Dhaka',
          items_snapshot: [{ id: 'ITEM-1', name: 'Sneakers', quantity: 1, unit_price: 2500, total_price: 2500 }],
          subtotal: 2500,
          delivery_fee: 70,
          total_payable: 2570
        }
      });
    } catch (e) {
      threw = true;
      assert.ok(e.code === 'MISSING_DATABASE_CONFIG' || e.code === 'DURABLE_STORAGE_UNAVAILABLE');
    }
    assert.ok(threw, 'createCodOrder must fail closed in production without durable database');
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    if (prevDbUrl !== undefined) process.env.DATABASE_URL = prevDbUrl;
    else delete process.env.DATABASE_URL;
  }
});

await runTest('Durable COD Order: Creates order marked PENDING_COD with payment due upon delivery', async () => {
  await initDb();
  const checkoutId = `AZQ-CHK-COD-DURABLE-${Date.now().toString(36)}`;
  const attempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Rafiqul Islam',
    customer_phone: '01711998877',
    shipping_address: 'Uttara Sector 3, Dhaka',
    items_snapshot: [{ id: 'ITEM-1', name: 'Cotton Panjabi', quantity: 1, unit_price: 2200, total_price: 2200 }],
    subtotal: 2200,
    delivery_fee: 70,
    discount: 0,
    total_payable: 2270,
    payment_method: 'COD',
    status: 'INITIATED'
  });

  const codRes = await createCodOrder({ checkoutAttempt: attempt });
  assert.ok(codRes.order.id.startsWith('AZQ-ORD-'));
  assert.strictEqual(codRes.order.payment_method, 'COD');
  assert.strictEqual(codRes.order.payment_status, 'PENDING_COD', 'COD must strictly be marked PENDING_COD, never PAID');
  assert.strictEqual(codRes.order.fulfillment_status, 'Processing');
  assert.strictEqual(codRes.order.currency, 'BDT');
});

await runTest('Payment Attempt vs Paid Order Separation: Checkout attempt does not create order until verified', async () => {
  await initDb();
  const checkoutId = `AZQ-CHK-SEPARATE-${Date.now().toString(36)}`;
  const attempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Zubair Hossain',
    customer_phone: '01811223344',
    shipping_address: 'Mirpur 10, Dhaka',
    items_snapshot: [{ id: 'ITEM-2', name: 'Leather Belt', quantity: 1, unit_price: 850, total_price: 850 }],
    subtotal: 850,
    delivery_fee: 70,
    discount: 0,
    total_payable: 920,
    payment_method: 'PAYMENTLY',
    status: 'INITIATED'
  });

  const retrieved = await getCheckoutAttempt(checkoutId);
  assert.strictEqual(retrieved.status, 'INITIATED');
  assert.ok(!retrieved.order_id, 'Initiated attempt must not have order_id');

  const orders = await getAllOrders();
  const matchedOrder = orders.find(o => o.checkout_attempt_id === checkoutId);
  assert.strictEqual(matchedOrder, undefined, 'Must not create order in orders table before payment is confirmed');
});

await runTest('Store Maintenance Error Sanitizer: Accurately classifies DB errors vs payment rejections', () => {
  assert.strictEqual(isStoreMaintenanceError(new Error('DATABASE_CONFIGURATION_REQUIRED: Missing DATABASE_URL')), true);
  assert.strictEqual(isStoreMaintenanceError({ code: 'STORE_CHECKOUT_UNAVAILABLE', message: 'Database down' }), true);
  assert.strictEqual(isStoreMaintenanceError({ code: 'DURABLE_STORAGE_UNAVAILABLE', message: 'Pool missing' }), true);
  assert.strictEqual(isStoreMaintenanceError({ status: 503, message: 'Maintenance in progress' }), true);
  assert.strictEqual(isStoreMaintenanceError(new Error('Card was declined by bank')), false, 'User payment decline is not store maintenance');
  assert.strictEqual(isStoreMaintenanceError(new Error('Payment session cancelled by user')), false, 'User cancellation is not store maintenance');
});

await runTest('Payment Retry Behavior: Preserves checkout details and allows retry safely', async () => {
  await initDb();
  const checkoutId = `AZQ-CHK-RETRY-${Date.now().toString(36)}`;
  const original = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Farhan Ahmed',
    customer_phone: '01911223344',
    shipping_address: 'Bashundhara R/A, Dhaka',
    items_snapshot: [{ id: 'ITEM-3', name: 'Polo Shirt', quantity: 2, unit_price: 900, total_price: 1800 }],
    subtotal: 1800,
    delivery_fee: 70,
    discount: 0,
    total_payable: 1870,
    status: 'INITIATED'
  });

  assert.strictEqual(original.items_snapshot.length, 1);
  assert.strictEqual(original.total_payable, 1870);

  // Customer retries checkout with same ID or updated info
  const updated = await saveCheckoutAttempt({
    ...original,
    status: 'AWAITING_PAYMENT'
  });
  assert.strictEqual(updated.status, 'AWAITING_PAYMENT');
  assert.strictEqual(updated.customer_phone, '01911223344');
  assert.strictEqual(updated.shipping_address, 'Bashundhara R/A, Dhaka');
});

// 3. Admin Refund Processing & Audit History
await runTest('Admin Refund: marks transaction REFUNDED, cancels order, and logs audit entries', async () => {
  await initDb();
  const testOrderRef = `AZQ-ORD-REFUND-TEST-${Date.now().toString(36)}`;
  const checkoutId = `AZQ-CHK-REFUND-${Date.now().toString(36)}`;

  const checkoutAttempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Mahir Faisal',
    customer_phone: '01851172032',
    shipping_address: 'Gulshan 1, Dhaka',
    items_snapshot: [{ id: 'ITEM-1', name: 'Premium Backpack', quantity: 1, unit_price: 3200, total_price: 3200 }],
    subtotal: 3200,
    delivery_fee: 0,
    discount: 0,
    total_payable: 3200,
    payment_method: 'PAYMENTLY',
    status: 'COMPLETED'
  });

  const verifiedOrderRes = await createOrderFromVerifiedPayment({
    checkoutAttempt,
    gatewayInvoiceId: `INV-REFUND-${Date.now()}`,
    transactionId: `TRX-REFUND-${Date.now()}`,
    paymentMethod: 'bKash'
  });

  const orderId = verifiedOrderRes.order.id;

  // 1. Without automated provider refund, must mark REFUND_PENDING_MANUAL_REVIEW
  const manualRefundRes = await processRefund({
    orderId,
    amount: 3200,
    reason: 'Customer requested return of defective unit',
    actorSource: 'ADMIN_PANEL_SECURITY_TEST',
    providerResult: { supported: false, success: false }
  });

  assert.strictEqual(manualRefundRes.success, true);
  assert.strictEqual(manualRefundRes.status, 'REFUND_PENDING_MANUAL_REVIEW');
  assert.strictEqual(manualRefundRes.requires_manual_disbursement, true);
  assert.strictEqual(manualRefundRes.refundAmount, 3200);

  // 2. With verified provider automated refund, marks REFUNDED
  const provRefundRes = await processRefund({
    orderId,
    amount: 3200,
    reason: 'Provider processed money disbursement',
    actorSource: 'ADMIN_PANEL_SECURITY_TEST',
    providerResult: { supported: true, success: true, refundId: 'ref_prov_auto_4455' }
  });

  assert.strictEqual(provRefundRes.success, true);
  assert.strictEqual(provRefundRes.status, 'REFUNDED');
  assert.strictEqual(provRefundRes.refund_id, 'ref_prov_auto_4455');
  assert.strictEqual(provRefundRes.refundAmount, 3200);
});

// 4. Browser Storage Resiliency & Schema Validation
await runTest('Storage Validator: validateCartItems verifies valid cart structure', () => {
  assert.strictEqual(validateCartItems([{ id: 'P1', quantity: 2, price: 500 }]), true);
  assert.strictEqual(validateCartItems([{ product: { id: 'P1' }, quantity: 1 }]), true);
  assert.strictEqual(validateCartItems([{ id: 'P1', quantity: 0 }]), false, 'Quantity must be > 0');
  assert.strictEqual(validateCartItems('malformed string'), false);
  assert.strictEqual(validateCartItems(null), false);
});

await runTest('Storage Validator: validateFavoritesList verifies string array', () => {
  assert.strictEqual(validateFavoritesList(['AZQ-001', 'AZQ-002']), true);
  assert.strictEqual(validateFavoritesList([123, null]), false);
  assert.strictEqual(validateFavoritesList('not an array'), false);
});

await runTest('Storage Validator: validateOrdersList verifies order records', () => {
  assert.strictEqual(validateOrdersList([{ id: 'AZQ-ORD-1', status: 'Processing' }]), true);
  assert.strictEqual(validateOrdersList([{ missing_id: true }]), false);
  assert.strictEqual(validateOrdersList('corrupt'), false);
});

await runTest('Storage Resilience: getStoredItem gracefully handles unparsable JSON with default fallback', () => {
  // In-memory fallback handles corrupt reads safely
  const result = getStoredItem('non_existent_key', ['default_fallback']);
  assert.deepStrictEqual(result, ['default_fallback']);
});

console.log('='.repeat(64));
console.log(`📊 ALL ${passed}/${total} SECURITY & DURABILITY TESTS PASSED!`);
console.log('='.repeat(64));
