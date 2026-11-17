import { 
  createPaymentlyCheckoutSession, 
  createCodCheckoutOrder,
  createManualPortalCheckoutOrder
} from '../../server/paymentlyService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) {}
    }

    const { customer, items, deliveryArea, promoCode, paymentMethod, notes, allowManualFallback } = payload || {};

    if (!customer) {
      return res.status(400).json({ success: false, error: 'Missing customer information.' });
    }

    // 1. If Cash on Delivery (COD) explicitly selected
    if (paymentMethod === 'COD') {
      const codResult = await createCodCheckoutOrder({
        customer,
        items,
        deliveryArea: deliveryArea || 'inside',
        promoCode: promoCode || null,
        notes: notes || ''
      });
      return res.status(200).json({
        success: true,
        mode: 'COD',
        order: codResult.order,
        items: codResult.items
      });
    }

    // 1b. If Manual Payment Portal explicitly selected
    if (paymentMethod === 'MANUAL_PORTAL') {
      const manualResult = await createManualPortalCheckoutOrder({
        customer,
        items,
        deliveryArea: deliveryArea || 'inside',
        promoCode: promoCode || null,
        notes: notes || ''
      });
      return res.status(200).json(manualResult);
    }

    // 2. Real Paymently Dynamic Session Creation
    const session = await createPaymentlyCheckoutSession({
      customer,
      items,
      deliveryArea: deliveryArea || 'inside',
      promoCode: promoCode || null,
      notes: notes || '',
      allowManualFallback: allowManualFallback === true
    });

    if (!session.success) {
      const statusMap = {
        'GATEWAY_CREDENTIALS_MISSING': 503,
        'GATEWAY_TIMEOUT': 504,
        'GATEWAY_CONNECTION_FAILED': 502,
        'GATEWAY_UNTRUSTED_URL': 502,
        'GATEWAY_REJECTED': 400
      };
      const statusCode = statusMap[session.code] || 400;
      return res.status(statusCode).json(session);
    }

    return res.status(200).json(session);
  } catch (err) {
    console.error('[API /api/payments/create Error]:', err.message);

    const isDbOrStorage = 
      err.code === 'MISSING_DATABASE_CONFIG' ||
      err.code === 'DURABLE_STORAGE_FAILED' ||
      err.code === 'DURABLE_STORAGE_UNAVAILABLE' ||
      err.code === 'DB_CONNECTION_FAILED' ||
      err.message.includes('DATABASE_CONFIGURATION_REQUIRED') ||
      err.message.includes('PostgreSQL') ||
      err.message.includes('DURABLE_STORAGE');

    if (isDbOrStorage) {
      return res.status(503).json({
        success: false,
        code: 'STORE_CHECKOUT_UNAVAILABLE',
        error: 'Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.'
      });
    }

    const isClientValidation =
      err.message.includes('required') ||
      err.message.includes('invalid') ||
      err.message.includes('empty');

    if (isClientValidation) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        error: err.message
      });
    }

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: 'An unexpected error occurred while preparing your order. Please try again in a few moments.'
    });
  }
}
