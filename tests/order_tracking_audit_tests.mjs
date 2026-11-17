/**
 * AZRAQ Order Tracking, Authorization & Audit History Tests
 * Verifies backend database schema normalization, secure tracking API,
 * phone & token ownership verification, separate payment vs fulfillment states,
 * and PII masking.
 */

import assert from 'assert';
import {
  initDb,
  getOrderByTrackingAuth,
  getOrderStatusHistory,
  updateOrderFulfillmentStatus,
  updateOrderPaymentStatus,
  normalizeBdPhone,
  maskCustomerName,
  maskPhoneNumber,
  saveCheckoutAttempt,
  createOrderFromVerifiedPayment,
  createOrderWithManualTrx
} from '../server/db.js';
import { createCodCheckoutOrder } from '../server/paymentlyService.js';

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
console.log('📦 AZRAQ ORDER TRACKING & AUDIT HISTORY TEST SUITE');
console.log('='.repeat(64));

await initDb();

// 1. Phone number normalization
await runTest('Phone Normalization: correctly extracts last 11 digits of Bangladeshi numbers', () => {
  assert.strictEqual(normalizeBdPhone('01851172032'), '01851172032');
  assert.strictEqual(normalizeBdPhone('+8801851172032'), '01851172032');
  assert.strictEqual(normalizeBdPhone('8801851172032'), '01851172032');
  assert.strictEqual(normalizeBdPhone('018-5117-2032'), '01851172032');
  assert.strictEqual(normalizeBdPhone(' 01712345678 '), '01712345678');
});

// 2. PII Masking
await runTest('PII Masking: masks customer phone and name safely', () => {
  const maskedPhone = maskPhoneNumber('01851172032');
  assert.strictEqual(maskedPhone, '018****2032', 'Masked phone should hide intermediate digits');

  const maskedName = maskCustomerName('Istihad Ahmed');
  assert.ok(maskedName.includes('*'), 'Customer name should have masked characters');
  assert.ok(!maskedName.includes('stihad'), 'Private middle characters should be obscured');
});

// 3. COD Order creation assigns tracking token, currency, and audit history
const testCodCustomer = {
  name: 'Istihad Ahmed',
  phone: '01851172032',
  email: 'istihad@azraq.test',
  address: 'House 42, Road 11, Banani',
  city: 'Dhaka',
  thana: 'Banani'
};

const testItems = [
  {
    id: 'AZQ-0001',
    quantity: 1
  }
];

let createdCodOrder = null;

await runTest('COD Order Creation: assigns unique unguessable tracking_token and BDT currency', async () => {
  const res = await createCodCheckoutOrder({
    customer: testCodCustomer,
    items: testItems,
    deliveryArea: 'inside',
    promoCode: null,
    notes: 'Please ring bell'
  });

  assert.ok(res.order, 'Order record must be returned');
  assert.ok(res.order.id.startsWith('AZQ-ORD-'), 'Order ID must follow standard prefix');
  assert.ok(res.order.tracking_token.startsWith('trk_'), 'Tracking token must start with trk_');
  assert.ok(res.order.tracking_token.length >= 24, 'Tracking token must be cryptographically secure and unguessable');
  assert.strictEqual(res.order.currency, 'BDT');
  assert.strictEqual(res.order.payment_method, 'COD');
  assert.strictEqual(res.order.payment_status, 'PENDING_COD');
  assert.strictEqual(res.order.fulfillment_status, 'Processing');

  createdCodOrder = res.order;
});

// 4. Audit History Verification on Initial Creation
await runTest('Status Audit History: records initial fulfillment and payment states on order creation', async () => {
  const history = await getOrderStatusHistory(createdCodOrder.id);
  assert.ok(Array.isArray(history), 'History must be an array');
  assert.ok(history.length >= 2, 'Should contain both fulfillment and payment initial logs');

  const fulfillLog = history.find(h => h.status_type === 'fulfillment');
  assert.ok(fulfillLog, 'Must have fulfillment audit log');
  assert.strictEqual(fulfillLog.new_status, 'Processing');

  const payLog = history.find(h => h.status_type === 'payment');
  assert.ok(payLog, 'Must have payment audit log');
  assert.strictEqual(payLog.new_status, 'PENDING_COD');
});

// 5. Customer Tracking Authorization via Phone
await runTest('Tracking Auth: succeeds with correct Order ID + Customer Phone', async () => {
  const auth = await getOrderByTrackingAuth(createdCodOrder.id, { phone: '01851172032' });
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.order.id, createdCodOrder.id);
  assert.strictEqual(auth.order.customer_phone_masked, '018****2032');
  assert.strictEqual(auth.order.fulfillment_status, 'Processing');
  assert.strictEqual(auth.order.payment_status, 'PENDING_COD');
});

// 6. Customer Tracking Authorization via International Format Phone
await runTest('Tracking Auth: succeeds with +880 international phone format', async () => {
  const auth = await getOrderByTrackingAuth(createdCodOrder.id, { phone: '+8801851172032' });
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.order.id, createdCodOrder.id);
});

// 7. Customer Tracking Authorization via Tracking Token
await runTest('Tracking Auth: succeeds with unguessable tracking_token without phone', async () => {
  const auth = await getOrderByTrackingAuth(createdCodOrder.id, { trackingToken: createdCodOrder.tracking_token });
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.order.id, createdCodOrder.id);
});

// 8. Rejection when Phone Number does NOT match
await runTest('Tracking Auth: rejects access when phone number does not match order', async () => {
  const auth = await getOrderByTrackingAuth(createdCodOrder.id, { phone: '01799999999' });
  assert.strictEqual(auth.success, false);
  assert.ok(auth.error === 'UNAUTHORIZED' || auth.message.toLowerCase().includes('authentication'));
});

// 9. Rejection when Order ID does NOT exist
await runTest('Tracking Auth: returns not found for non-existent order ID', async () => {
  const auth = await getOrderByTrackingAuth('AZQ-ORD-NONEXISTENT', { phone: '01851172032' });
  assert.strictEqual(auth.success, false);
  assert.ok(auth.error === 'NOT_FOUND' || auth.message.toLowerCase().includes('no matching'));
});

// 10. Rejection when missing both phone and token (Guessable ID alone is unauthorized)
await runTest('Tracking Auth: rejects order tracking attempt with Order ID alone', async () => {
  const auth = await getOrderByTrackingAuth(createdCodOrder.id, {});
  assert.strictEqual(auth.success, false);
  assert.ok(auth.error === 'UNAUTHORIZED' || auth.message.toLowerCase().includes('authentication'));
});

// 11. State Separation & Audit History on Status Updates
await runTest('Fulfillment Transition: updates fulfillment state independently of payment state and logs audit trail', async () => {
  const updated = await updateOrderFulfillmentStatus(
    createdCodOrder.id,
    'Dispatched',
    {
      actorSource: 'LOGISTICS_OPS',
      notes: 'Handed to Steadfast Courier rider',
      courierName: 'Steadfast Courier BD',
      courierTrackingId: 'ST-882194'
    }
  );

  assert.strictEqual(updated.fulfillment_status, 'Dispatched');
  assert.strictEqual(updated.payment_status, 'PENDING_COD', 'Payment status must remain PENDING_COD until customer pays');
  assert.strictEqual(updated.courier_name, 'Steadfast Courier BD');
  assert.strictEqual(updated.courier_tracking_id, 'ST-882194');
  assert.ok(updated.dispatched_at, 'dispatched_at timestamp must be recorded');

  // Verify status history
  const history = await getOrderStatusHistory(createdCodOrder.id);
  const dispatchLog = history.find(h => h.new_status === 'Dispatched');
  assert.ok(dispatchLog, 'History must contain Dispatched entry');
  assert.strictEqual(dispatchLog.actor_source, 'LOGISTICS_OPS');
  assert.strictEqual(dispatchLog.previous_status, 'Processing');
});

// 12. Payment Status Transition on COD Delivery
await runTest('Payment Transition: marking COD delivered updates payment to PAID with audit log', async () => {
  const updatedPay = await updateOrderPaymentStatus(
    createdCodOrder.id,
    'PAID',
    {
      actorSource: 'COURIER_RECONCILIATION',
      notes: 'Cash collected by courier rider and reconciled',
      transactionId: 'COD-REC-7712'
    }
  );

  assert.strictEqual(updatedPay.payment_status, 'PAID');
  assert.ok(updatedPay.verified_at, 'verified_at timestamp must be set');

  const history = await getOrderStatusHistory(createdCodOrder.id);
  const paidLog = history.find(h => h.status_type === 'payment' && h.new_status === 'PAID');
  assert.ok(paidLog, 'History must contain PAID audit log entry');
  assert.strictEqual(paidLog.actor_source, 'COURIER_RECONCILIATION');
});

// 13. Verified Paymently Order Creation
await runTest('Paymently Verified Order: assigns PAID status and tracking token immediately upon provider verification', async () => {
  const checkoutId = `AZQ-CHK-TEST-${Date.now().toString(36)}`;
  const checkoutAttempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Sadia Rahman',
    customer_phone: '01711223344',
    customer_email: 'sadia@azraq.test',
    shipping_address: 'Road 5, Dhanmondi',
    city: 'Dhaka',
    thana: 'Dhanmondi',
    delivery_area: 'inside',
    items_snapshot: testItems,
    subtotal: 2450,
    delivery_fee: 70,
    discount: 0,
    total_payable: 2520,
    payment_method: 'PAYMENTLY',
    status: 'COMPLETED'
  });

  const res = await createOrderFromVerifiedPayment({
    checkoutAttempt,
    gatewayInvoiceId: 'INV-TEST-9988',
    transactionId: 'TRX-PAY-112233',
    paymentMethod: 'bKash',
    senderNumber: '01711223344'
  });

  assert.ok(res.order);
  assert.strictEqual(res.order.payment_status, 'PAID');
  assert.strictEqual(res.order.fulfillment_status, 'Processing');
  assert.ok(res.order.tracking_token.startsWith('trk_'));
  assert.strictEqual(res.order.gateway_transaction_id, 'TRX-PAY-112233');

  // Verify auth for this order
  const auth = await getOrderByTrackingAuth(res.order.id, { phone: '01711223344' });
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.order.payment_status, 'PAID');
});

// 14. Manual TrxID Order Creation
await runTest('Manual TrxID Order: starts as PENDING_VERIFICATION and requires admin verification', async () => {
  const checkoutId = `AZQ-CHK-TRX-${Date.now().toString(36)}`;
  const checkoutAttempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: 'Farhan Kabir',
    customer_phone: '01999887766',
    shipping_address: 'Uttara Sector 7',
    city: 'Dhaka',
    thana: 'Uttara',
    delivery_area: 'inside',
    items_snapshot: testItems,
    subtotal: 2450,
    delivery_fee: 70,
    discount: 0,
    total_payable: 2520,
    payment_method: 'PAYMENTLY',
    status: 'AWAITING_PAYMENT'
  });

  const res = await createOrderWithManualTrx({
    checkoutAttempt,
    transactionId: 'BKASH9871623'
  });

  assert.ok(res.order);
  assert.strictEqual(res.order.payment_status, 'PENDING_VERIFICATION');
  assert.strictEqual(res.order.fulfillment_status, 'Processing');
  assert.strictEqual(res.order.gateway_transaction_id, 'BKASH9871623');

  const history = await getOrderStatusHistory(res.order.id);
  const pendingLog = history.find(h => h.new_status === 'PENDING_VERIFICATION');
  assert.ok(pendingLog, 'Must log PENDING_VERIFICATION in history');
});

console.log('='.repeat(64));
console.log(`📊 ALL ${passed}/${total} ORDER TRACKING & AUDIT TESTS PASSED!`);
console.log('='.repeat(64));
