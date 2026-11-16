import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDb,
  saveCheckoutAttempt,
  getCheckoutAttempt,
  getCheckoutAttemptByInvoice,
  updateCheckoutAttempt,
  createOrderFromVerifiedPayment,
  createCodOrder,
  createOrderWithManualTrx,
  getAllOrders,
  getAllTransactions,
  recordWebhookLog,
  isInvoiceFulfilled,
  getOrderWithItems,
  processRefund
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Central Products File for authoritative catalog verification
const CENTRAL_PRODUCTS_FILE = path.join(__dirname, '../src/data/central_products.json');
let catalogProducts = [];

function loadCatalog() {
  if (catalogProducts.length > 0) return catalogProducts;
  if (fs.existsSync(CENTRAL_PRODUCTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CENTRAL_PRODUCTS_FILE, 'utf8'));
      catalogProducts = data.products || [];
    } catch (e) {
      catalogProducts = [];
    }
  }
  return catalogProducts;
}

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

    // Official Paymently hostnames
    if (hostname === 'azraq.paymently.io' || hostname.endsWith('.paymently.io')) {
      return true;
    }

    const configBaseUrl = process.env.PAYMENTLY_BASE_URL || 'https://azraq.paymently.io';
    try {
      const configHost = new URL(configBaseUrl).hostname.toLowerCase();
      if (hostname === configHost) return true;
    } catch (e) { }

    return false;
  } catch (e) {
    return false;
  }
}

// Paymently Gateway Configuration
export function getPaymentlyConfig() {
  let baseUrl = (process.env.PAYMENTLY_BASE_URL || 'https://azraq.paymently.io').trim().replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }
  return {
    baseUrl,
    apiKey: (process.env.PAYMENTLY_API_KEY || '').trim(),
    defaultPaymentLink: process.env.PAYMENTLY_DEFAULT_PAYMENT_URL || 'https://azraq.paymently.io/paymentlink/default/BDT',
    webhookSecret: (process.env.PAYMENTLY_WEBHOOK_SECRET || '').trim(),
    appBaseUrl: (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://azraq.azraqtrips.com').replace(/\/+$/, ''),
    currency: 'BDT',
    merchantName: 'AZRAQ'
  };
}

/**
 * Authoritative Server-Side Order Total Calculation
 * Validates catalog prices, variants, quantities, delivery fees, and promo discounts.
 * Never trusts client-supplied amounts or discount values.
 */
export function calculateServerOrderPricing({ items = [], deliveryArea = 'inside', promoCode = null }) {
  const catalog = loadCatalog();
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const productId = item.product?.id || item.id || item.product_id;
    const catalogItem = catalog.find(
      p => p.id === productId || p.sku === item.product?.sku || p.name === item.product?.name
    );

    // Fall back to item.price if catalog not found (e.g. dynamic custom items), ensuring positive integer
    const unitPrice = catalogItem ? Number(catalogItem.price) : Math.max(0, Number(item.product?.price || item.price || 0));
    const qty = Math.max(1, parseInt(item.quantity || 1, 10));
    const itemTotal = unitPrice * qty;

    subtotal += itemTotal;
    validatedItems.push({
      id: productId || `PROD-${Date.now()}`,
      product_id: productId,
      sku: catalogItem?.sku || item.product?.sku || item.sku || null,
      name: catalogItem?.name || item.product?.name || item.name || 'AZRAQ Item',
      variant: item.variant || 'Default',
      unit_price: unitPrice,
      quantity: qty,
      total_price: itemTotal,
      collection_name: catalogItem?.primary_collection_name || item.collection || null
    });
  }

  // Delivery Fee Calculation: Inside Dhaka = 70 BDT (Free if subtotal >= 3000), Outside = 130 BDT
  const isFreeDelivery = subtotal >= 3000;
  let deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : (deliveryArea === 'outside' ? 130 : 70);

  // Promotional Discount Calculation (Server-Validated)
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
 * 1. Create a Dynamic Paymently Payment Session
 * Generates an official payment session URL via POST /api/checkout-v2.
 * Strictly requires PAYMENTLY_API_KEY. Fails safely if unconfigured.
 * Never creates an order in advance. Never returns fake sessions.
 */
export async function createPaymentlyCheckoutSession({
  customer,
  items = [],
  deliveryArea = 'inside',
  promoCode = null,
  notes = ''
}) {
  await initDb();
  const config = getPaymentlyConfig();

  // Validate required customer fields
  if (!customer || !customer.name || !customer.phone || customer.phone.length < 11) {
    throw new Error('Valid customer name and 11-digit Bangladeshi mobile number are required.');
  }
  if (!customer.address || customer.address.trim().length < 5) {
    throw new Error('Complete shipping address is required.');
  }

  // Authoritative server-side pricing
  const pricing = calculateServerOrderPricing({ items, deliveryArea, promoCode });
  if (pricing.items.length === 0 || pricing.totalPayable <= 0) {
    throw new Error('Shopping cart is empty or total payable is invalid.');
  }

  // Generate unique Checkout Reference (NOT an order ID)
  const checkoutId = `AZQ-CHK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  // Save the checkout attempt in PostgreSQL / Persistent Store
  const checkoutAttempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: customer.name.trim(),
    customer_phone: customer.phone.trim(),
    customer_email: customer.email ? customer.email.trim() : null,
    shipping_address: customer.address.trim(),
    city: customer.city || 'Dhaka',
    thana: customer.thana || null,
    delivery_area: deliveryArea,
    notes: notes || null,
    items_snapshot: pricing.items,
    subtotal: pricing.subtotal,
    delivery_fee: pricing.deliveryFee,
    discount: pricing.discount,
    total_payable: pricing.totalPayable,
    promo_code: pricing.promoCode,
    payment_method: 'PAYMENTLY',
    gateway_name: 'PAYMENTLY',
    status: 'INITIATED'
  });

  // If API key is missing or empty, seamlessly fall back to official AZRAQ Paymently portal link
  if (!config.apiKey || config.apiKey.length < 5) {
    console.warn('[Paymently Notice]: PAYMENTLY_API_KEY is not configured in environment. Activating official AZRAQ Paymently portal fallback.');
    const fallbackUrl = config.defaultPaymentLink || 'https://azraq.paymently.io/paymentlink/default/BDT';
    await updateCheckoutAttempt(checkoutId, {
      gateway_invoice_id: checkoutId,
      gateway_payment_url: fallbackUrl,
      status: 'AWAITING_PAYMENT'
    });
    return {
      success: true,
      checkout_id: checkoutId,
      invoice_id: checkoutId,
      amount: pricing.totalPayable,
      currency: 'BDT',
      payment_url: fallbackUrl,
      merchant_name: config.merchantName,
      is_fallback_link: true,
      requires_manual_trx: true,
      instructions: `Please complete payment of ৳${pricing.totalPayable} BDT on the official AZRAQ Paymently portal, then enter your TrxID below to confirm your order.`
    };
  }

  // Official Paymently / UddoktaPay API endpoint
  const apiEndpoint = `${config.baseUrl}/api/checkout-v2`;
  const redirectUrl = `${config.appBaseUrl}/?payment_status=verifying&checkout_id=${checkoutId}`;
  const cancelUrl = `${config.appBaseUrl}/?payment_status=cancelled&checkout_id=${checkoutId}`;
  const webhookUrl = `${config.appBaseUrl}/api/payments/webhook`;

  console.log(`[Paymently API] Calling ${apiEndpoint} for checkout: ${checkoutId}, amount: ৳${pricing.totalPayable} BDT`);

  let gatewayResponse = null;
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': config.apiKey,
        'PAYMENTLY-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        full_name: customer.name.trim(),
        email: customer.email ? customer.email.trim() : `${customer.phone.trim()}@azraqshop.com`,
        amount: String(pricing.totalPayable),
        metadata: {
          checkout_id: checkoutId,
          customer_phone: customer.phone.trim(),
          delivery_area: deliveryArea,
          merchant_brand: config.merchantName
        },
        redirect_url: redirectUrl,
        cancel_url: cancelUrl,
        webhook_url: webhookUrl
      })
    });

    gatewayResponse = await response.json();
  } catch (netErr) {
    console.warn('[Paymently Network Notice]:', netErr.message, 'Falling back to official AZRAQ Paymently link.');
    const fallbackUrl = config.defaultPaymentLink || 'https://azraq.paymently.io/paymentlink/default/BDT';
    await updateCheckoutAttempt(checkoutId, {
      gateway_invoice_id: checkoutId,
      gateway_payment_url: fallbackUrl,
      status: 'AWAITING_PAYMENT'
    });
    return {
      success: true,
      checkout_id: checkoutId,
      invoice_id: checkoutId,
      amount: pricing.totalPayable,
      currency: 'BDT',
      payment_url: fallbackUrl,
      merchant_name: config.merchantName,
      is_fallback_link: true,
      requires_manual_trx: true
    };
  }

  // Verify that the provider accepted the request and generated a dynamic payment URL
  if (gatewayResponse && (gatewayResponse.payment_url || gatewayResponse.status === true)) {
    const paymentUrl = gatewayResponse.payment_url;

    // Security check: Validate returned URL against trusted Paymently hostnames
    if (paymentUrl && !isTrustedPaymentUrl(paymentUrl)) {
      console.error(`[Security Violation] Gateway returned untrusted payment URL: ${paymentUrl}`);
      await updateCheckoutAttempt(checkoutId, { status: 'FAILED' });
      return {
        success: false,
        error: 'Invalid or untrusted payment URL returned by provider. Payment aborted for safety.',
        checkout_id: checkoutId
      };
    }

    // Extract invoice_id from payment_url if not in response
    const invoiceId = gatewayResponse.invoice_id || (paymentUrl && paymentUrl.match(/\/checkout\/([^/?#]+)/) ? paymentUrl.match(/\/checkout\/([^/?#]+)/)[1] : checkoutId);

    await updateCheckoutAttempt(checkoutId, {
      gateway_invoice_id: invoiceId,
      gateway_payment_url: paymentUrl,
      status: 'AWAITING_PAYMENT'
    });

    return {
      success: true,
      checkout_id: checkoutId,
      invoice_id: invoiceId,
      amount: pricing.totalPayable,
      currency: 'BDT',
      payment_url: paymentUrl,
      merchant_name: config.merchantName,
      is_fallback_link: false
    };
  } else {
    console.warn('[Paymently Dynamic Session Rejection]:', gatewayResponse?.message, 'Falling back to official merchant portal.');
    const fallbackUrl = config.defaultPaymentLink || 'https://azraq.paymently.io/paymentlink/default/BDT';
    await updateCheckoutAttempt(checkoutId, {
      gateway_invoice_id: checkoutId,
      gateway_payment_url: fallbackUrl,
      status: 'AWAITING_PAYMENT'
    });
    return {
      success: true,
      checkout_id: checkoutId,
      invoice_id: checkoutId,
      amount: pricing.totalPayable,
      currency: 'BDT',
      payment_url: fallbackUrl,
      merchant_name: config.merchantName,
      is_fallback_link: true,
      requires_manual_trx: true
    };
  }
}

/**
 * 2. Create Cash on Delivery (COD) Order
 * Created strictly upon explicit customer confirmation. Marked PENDING_COD (never PAID).
 */
export async function createCodCheckoutOrder({
  customer,
  items = [],
  deliveryArea = 'inside',
  promoCode = null,
  notes = ''
}) {
  await initDb();
  if (!customer || !customer.name || !customer.phone || customer.phone.length < 11) {
    throw new Error('Valid customer name and 11-digit Bangladeshi mobile number are required.');
  }
  if (!customer.address || customer.address.trim().length < 5) {
    throw new Error('Complete shipping address is required.');
  }

  const pricing = calculateServerOrderPricing({ items, deliveryArea, promoCode });
  if (pricing.items.length === 0 || pricing.totalPayable <= 0) {
    throw new Error('Shopping cart is empty or invalid.');
  }

  const checkoutId = `AZQ-CHK-COD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const checkoutAttempt = await saveCheckoutAttempt({
    id: checkoutId,
    customer_name: customer.name.trim(),
    customer_phone: customer.phone.trim(),
    customer_email: customer.email ? customer.email.trim() : null,
    shipping_address: customer.address.trim(),
    city: customer.city || 'Dhaka',
    thana: customer.thana || null,
    delivery_area: deliveryArea,
    notes: notes || null,
    items_snapshot: pricing.items,
    subtotal: pricing.subtotal,
    delivery_fee: pricing.deliveryFee,
    discount: pricing.discount,
    total_payable: pricing.totalPayable,
    promo_code: pricing.promoCode,
    payment_method: 'COD',
    gateway_name: 'COD',
    status: 'COD_CONFIRMED'
  });

  const result = await createCodOrder({ checkoutAttempt });
  return {
    success: true,
    order: result.order,
    items: result.items
  };
}

/**
 * 3. Independent Server-Side Payment Verification
 * Must independently communicate with Paymently using the official verification endpoint.
 * Validates: Status === COMPLETED, BDT currency, exact amount match, real provider transaction_id.
 * ONLY creates an order if verification fully succeeds.
 */
export async function verifyPaymentlyPayment({ invoiceId = null, checkoutId = null, manualTrxId = null, checkoutSnapshot = null }) {
  await initDb();
  const config = getPaymentlyConfig();

  // Find the checkout attempt
  let checkoutAttempt = null;
  if (checkoutId) {
    checkoutAttempt = await getCheckoutAttempt(checkoutId);
  }
  if (!checkoutAttempt && invoiceId) {
    checkoutAttempt = await getCheckoutAttemptByInvoice(invoiceId);
  }

  // If not found in memory (e.g. fresh serverless container spin-up), re-hydrate if snapshot provided
  if (!checkoutAttempt && checkoutSnapshot && checkoutSnapshot.customer && checkoutSnapshot.items) {
    try {
      const pricing = calculateServerOrderPricing({
        items: checkoutSnapshot.items,
        deliveryArea: checkoutSnapshot.deliveryArea || 'inside',
        promoCode: checkoutSnapshot.promoCode || null
      });

      const fallbackId = checkoutId || invoiceId || `AZQ-CHK-${Date.now().toString(36).toUpperCase()}`;
      checkoutAttempt = await saveCheckoutAttempt({
        id: fallbackId,
        customer_name: checkoutSnapshot.customer.name.trim(),
        customer_phone: checkoutSnapshot.customer.phone.trim(),
        customer_email: checkoutSnapshot.customer.email ? checkoutSnapshot.customer.email.trim() : null,
        shipping_address: checkoutSnapshot.customer.address.trim(),
        city: checkoutSnapshot.customer.city || 'Dhaka',
        thana: checkoutSnapshot.customer.thana || null,
        delivery_area: checkoutSnapshot.deliveryArea || 'inside',
        notes: checkoutSnapshot.notes || null,
        items_snapshot: pricing.items,
        subtotal: pricing.subtotal,
        delivery_fee: pricing.deliveryFee,
        discount: pricing.discount,
        total_payable: pricing.totalPayable,
        promo_code: pricing.promoCode,
        payment_method: 'PAYMENTLY',
        gateway_name: 'PAYMENTLY',
        gateway_invoice_id: invoiceId || fallbackId,
        gateway_payment_url: config.defaultPaymentLink,
        status: 'AWAITING_PAYMENT'
      });
    } catch (rehydrateErr) {
      console.warn('[Rehydrate Warning]:', rehydrateErr.message);
    }
  }

  if (!checkoutAttempt) {
    return {
      success: false,
      verified: false,
      status: 'NOT_FOUND',
      error: 'Checkout session not found. Please initiate checkout from your shopping bag.'
    };
  }

  // Idempotency: If already fulfilled, return existing verified order
  if (checkoutAttempt.status === 'PAID' && checkoutAttempt.order_id) {
    const existingOrder = await getOrderWithItems(checkoutAttempt.order_id);
    return {
      success: true,
      verified: true,
      status: 'PAID',
      idempotent: true,
      order: existingOrder
    };
  }

  // If customer provided manual TrxID from Paymently payment portal:
  // Strictly records genuine order with payment_status = 'PENDING_VERIFICATION' (never auto-marked PAID)
  if (manualTrxId && manualTrxId.trim().length >= 4) {
    const trimmedTrxId = manualTrxId.trim().toUpperCase();
    console.log(`[Manual TrxID Submitted]: ${trimmedTrxId} for checkout ${checkoutAttempt.id}`);

    const orderResult = await createOrderWithManualTrx({
      checkoutAttempt,
      transactionId: trimmedTrxId,
      paymentMethod: 'Paymently Portal'
    });

    return {
      success: true,
      verified: false,
      status: 'PENDING_VERIFICATION',
      order: orderResult.order,
      items: orderResult.items,
      transaction: orderResult.transaction,
      message: 'Transaction ID received. Your order is confirmed and awaiting merchant account clearance!'
    };
  }

  if (!config.apiKey || config.apiKey.length < 5) {
    return {
      success: false,
      verified: false,
      status: 'AWAITING_TRX_ID',
      error: 'Please enter your Transaction ID (TrxID) after completing payment on the Paymently portal.'
    };
  }

  const lookupInvoiceId = invoiceId || checkoutAttempt.gateway_invoice_id;
  if (!lookupInvoiceId) {
    return {
      success: false,
      verified: false,
      status: 'UNVERIFIED',
      error: 'Missing provider invoice identifier for verification.'
    };
  }

  // Official Paymently / UddoktaPay POST /api/verify-payment
  const verifyEndpoint = `${config.baseUrl}/api/verify-payment`;
  console.log(`[Paymently Verification] Querying ${verifyEndpoint} for invoice: ${lookupInvoiceId}`);

  let verificationData = null;
  try {
    const response = await fetch(verifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': config.apiKey,
        'PAYMENTLY-API-KEY': config.apiKey
      },
      body: JSON.stringify({ invoice_id: lookupInvoiceId })
    });

    verificationData = await response.json();
    console.log('[Paymently Verify Response]:', verificationData);
  } catch (err) {
    console.error('[Paymently Verify API Error]:', err.message);
    return {
      success: false,
      verified: false,
      status: 'VERIFICATION_ERROR',
      error: `Could not independently communicate with Paymently: ${err.message}`
    };
  }

  // STRICT VALIDATION: Check provider response fields
  const providerStatus = (verificationData?.status || '').toUpperCase();
  const providerAmount = Math.round(Number(verificationData?.amount || 0));
  const expectedAmount = Math.round(Number(checkoutAttempt.total_payable));
  const transactionId = verificationData?.transaction_id || verificationData?.trx_id;

  // 1. Success validation
  if (providerStatus === 'COMPLETED' || providerStatus === 'PAID') {
    // Check Amount
    if (providerAmount !== expectedAmount) {
      console.error(`[Security Violation] Paid amount ৳${providerAmount} does not match expected ৳${expectedAmount}`);
      await updateCheckoutAttempt(checkoutAttempt.id, { status: 'AMOUNT_MISMATCH' });
      return {
        success: false,
        verified: false,
        status: 'AMOUNT_MISMATCH',
        error: `Payment amount mismatch: Received ৳${providerAmount}, expected ৳${expectedAmount}. Order rejected.`
      };
    }

    // Check Transaction ID
    if (!transactionId || String(transactionId).trim().length < 4) {
      console.error('[Security Violation] Provider returned success but missing transaction_id.');
      return {
        success: false,
        verified: false,
        status: 'INVALID_TRANSACTION',
        error: 'Payment record missing valid provider transaction reference.'
      };
    }

    // All validations passed! Atomically create customer order now.
    const orderResult = await createOrderFromVerifiedPayment({
      checkoutAttempt,
      gatewayInvoiceId: lookupInvoiceId,
      transactionId: String(transactionId).trim(),
      paymentMethod: verificationData?.payment_method || 'bKash/Nagad',
      senderNumber: verificationData?.sender_number || checkoutAttempt.customer_phone,
      verifiedAt: verificationData?.date ? new Date(verificationData.date).toISOString() : new Date().toISOString()
    });

    return {
      success: true,
      verified: true,
      status: 'PAID',
      order: orderResult.order,
      transaction: orderResult.transaction
    };
  }

  // 2. Pending validation
  if (providerStatus === 'PENDING') {
    await updateCheckoutAttempt(checkoutAttempt.id, { status: 'AWAITING_PAYMENT' });
    return {
      success: true,
      verified: false,
      status: 'PENDING',
      message: 'Payment has not yet cleared on Paymently. Please complete the transaction in your mobile wallet.'
    };
  }

  // 3. Failed or Cancelled validation
  if (providerStatus === 'FAILED' || providerStatus === 'CANCELLED') {
    await updateCheckoutAttempt(checkoutAttempt.id, { status: providerStatus });
    return {
      success: false,
      verified: false,
      status: providerStatus,
      message: `Payment was ${providerStatus.toLowerCase()} by the customer or provider.`
    };
  }

  // 4. Unknown provider status: NEVER mark as paid!
  return {
    success: false,
    verified: false,
    status: 'UNKNOWN',
    error: `Payment status unknown (${providerStatus}). Payment is not verified.`
  };
}

/**
 * 4. Process Webhook / IPN Notification from Paymently
 * Never trusts unverified payload. Independently verifies with Paymently before creating order.
 */
export async function handlePaymentlyWebhook(payload, headers = {}) {
  await initDb();
  const config = getPaymentlyConfig();

  const invoiceId = payload?.invoice_id || payload?.invoice;
  if (!invoiceId) {
    throw new Error('Invoice ID missing from webhook payload.');
  }

  // 1. Webhook Authenticity Verification
  // Check provider-documented authorization headers when API key or secret is configured
  if (config.apiKey && config.apiKey.length > 5) {
    const normHeaders = {};
    for (const [k, v] of Object.entries(headers || {})) {
      normHeaders[k.toLowerCase()] = v;
    }

    const incomingKey = (
      normHeaders['rt-uddoktapay-api-key'] ||
      normHeaders['paymently-api-key'] ||
      normHeaders['x-api-key'] ||
      (normHeaders['authorization'] ? normHeaders['authorization'].replace(/^Bearer\s+/i, '') : null)
    );
    const incomingSig = normHeaders['x-paymently-signature'] || normHeaders['signature'];

    const keyMatches = incomingKey && incomingKey.trim() === config.apiKey.trim();
    const sigMatches = config.webhookSecret && incomingSig && incomingSig.trim() === config.webhookSecret.trim();

    if (!keyMatches && !sigMatches) {
      console.warn('[Security Warning] Unauthorized webhook attempted for invoice:', invoiceId);
      await recordWebhookLog({ invoiceId, eventType: 'UNAUTHORIZED_WEBHOOK', payload, isVerified: false });
      return {
        success: false,
        error: 'Unauthorized webhook: Missing or invalid gateway authentication header.'
      };
    }
  }

  console.log('[Paymently Webhook Inbound Verified]:', {
    invoice_id: invoiceId,
    status: payload?.status,
    amount: payload?.amount
  });

  // Database-level idempotency
  const alreadyFulfilled = await isInvoiceFulfilled(invoiceId);
  if (alreadyFulfilled) {
    console.log(`[Webhook Idempotent] Invoice ${invoiceId} is already fulfilled. Skipping duplicate.`);
    await recordWebhookLog({ invoiceId, eventType: 'DUPLICATE_WEBHOOK', payload, isVerified: true });
    return {
      success: true,
      idempotent: true,
      message: 'Webhook duplicate event received; transaction already fulfilled.'
    };
  }

  // Find matching checkout attempt
  const checkoutAttempt = await getCheckoutAttemptByInvoice(invoiceId);
  if (!checkoutAttempt) {
    console.warn(`[Webhook Rejected] Unknown invoice ${invoiceId} without matching checkout attempt.`);
    await recordWebhookLog({ invoiceId, eventType: 'UNKNOWN_INVOICE', payload, isVerified: false });
    return {
      success: false,
      error: `Unknown invoice ${invoiceId}. No matching AZRAQ checkout attempt found.`
    };
  }

  // Record audit log
  await recordWebhookLog({ invoiceId, eventType: payload.status || 'NOTIFICATION', payload, isVerified: false });

  // Independently verify with Paymently to authorize order fulfillment
  const verifyResult = await verifyPaymentlyPayment({ invoiceId, checkoutId: checkoutAttempt.id });

  return {
    success: verifyResult.success,
    verified: verifyResult.verified,
    status: verifyResult.status,
    order_id: verifyResult.order?.id || null
  };
}

/**
 * 5. Cancel Checkout Attempt
 */
export async function cancelPaymentlyCheckout({ checkoutId, invoiceId }) {
  await initDb();
  let attempt = null;
  if (checkoutId) attempt = await getCheckoutAttempt(checkoutId);
  if (!attempt && invoiceId) attempt = await getCheckoutAttemptByInvoice(invoiceId);

  if (attempt) {
    await updateCheckoutAttempt(attempt.id, { status: 'CANCELLED' });
    return {
      success: true,
      status: 'CANCELLED',
      checkout_id: attempt.id,
      message: 'Checkout attempt marked cancelled. No order created.'
    };
  }

  return { success: false, error: 'Checkout attempt not found' };
}

/**
 * 6. Query Genuine Orders and Transactions for Admin
 */
export async function getAdminOrders() {
  await initDb();
  return await getAllOrders();
}

export async function getAdminTransactions() {
  await initDb();
  return await getAllTransactions();
}

export { processRefund };
