import { 
  createPaymentlyCheckoutSession, 
  createCodCheckoutOrder,
  verifyPaymentlyPayment, 
  cancelPaymentlyCheckout,
  handlePaymentlyWebhook, 
  getAdminTransactions, 
  getAdminOrders,
  getPaymentlyConfig 
} from './paymentlyService.js';
import { getAllTransactions, getAllOrders, processRefund, updateOrderFulfillmentStatus } from './db.js';
import orderTrackingHandler from '../api/orders/track.js';
import { verifyAdminAuth } from './adminAuth.js';

export async function handlePaymentRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;
  const method = req.method;

  // 1. GET /api/payments/status - Gateway status & configuration
  if (pathname === '/api/payments/status' && method === 'GET') {
    const config = getPaymentlyConfig();
    const txns = await getAllTransactions();
    const orders = await getAllOrders();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      gateway: {
        gateway_name: 'Paymently',
        merchant_name: config.merchantName,
        domain: 'azraq.paymently.io',
        base_url: config.baseUrl,
        currency: config.currency,
        has_api_key: Boolean(config.apiKey && config.apiKey.length > 5),
        has_database: Boolean(process.env.DATABASE_URL),
        total_real_transactions: txns.length,
        total_real_orders: orders.length,
        supported_methods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa', 'Mastercard', 'Cash on Delivery'],
        brand_palette: {
          primary: '#0877C9',
          dark: '#062B4F',
          accent: '#50DDF0',
          light: '#F8FCFF'
        }
      }
    }));
    return true;
  }

  // 2. GET /api/payments/transactions - List genuine transactions for Admin Panel (Requires Admin Auth)
  if (pathname === '/api/payments/transactions' && method === 'GET') {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      res.statusCode = auth.statusCode || 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, code: 'UNAUTHORIZED_ADMIN', error: auth.error }));
      return true;
    }

    const transactions = await getAdminTransactions();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, transactions }));
    return true;
  }

  // 3. GET /api/orders - List genuine customer orders (Requires Admin Auth)
  if (pathname === '/api/orders' && method === 'GET') {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      res.statusCode = auth.statusCode || 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, code: 'UNAUTHORIZED_ADMIN', error: auth.error }));
      return true;
    }

    const orders = await getAdminOrders();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, orders }));
    return true;
  }

  // 3a. POST /api/admin/auth - Authenticate Admin Session
  if (pathname === '/api/admin/auth' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (payload.adminKey && !req.headers['x-admin-key'] && !req.headers['authorization']) {
          req.headers['x-admin-key'] = String(payload.adminKey).trim();
        }
        const auth = verifyAdminAuth(req);
        if (!auth.authenticated) {
          res.statusCode = auth.statusCode || 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, code: 'UNAUTHORIZED_ADMIN', error: auth.error }));
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Administrator session authenticated successfully.' }));
      } catch (err) {
        console.error('[paymentRoutes /api/admin/auth Error]:', err.message);
        const isDbOrStorage = 
          err.code === 'MISSING_DATABASE_CONFIG' ||
          err.code === 'DURABLE_STORAGE_FAILED' ||
          err.code === 'DURABLE_STORAGE_UNAVAILABLE' ||
          err.code === 'DB_CONNECTION_FAILED' ||
          err.message.includes('DATABASE_CONFIGURATION_REQUIRED') ||
          err.message.includes('PostgreSQL') ||
          err.message.includes('DURABLE_STORAGE');

        res.statusCode = isDbOrStorage ? 503 : (err.message.includes('required') ? 400 : 500);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          code: isDbOrStorage ? 'STORE_CHECKOUT_UNAVAILABLE' : 'CHECKOUT_ERROR',
          error: isDbOrStorage
            ? 'Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.'
            : (err.message.includes('required') ? err.message : 'An unexpected error occurred while preparing your order. Please try again in a few moments.')
        }));
      }
    });
    return true;
  }

  // 3b. POST /api/orders/update-status - Admin Update Order Status
  if (pathname === '/api/orders/update-status' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const auth = verifyAdminAuth(req);
        if (!auth.authenticated) {
          res.statusCode = auth.statusCode || 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, code: 'UNAUTHORIZED_ADMIN', error: auth.error }));
          return;
        }

        const payload = JSON.parse(body || '{}');
        const { orderId, status, courierName, courierTrackingId, notes } = payload;
        if (!orderId || !status) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Order ID and status are required.' }));
          return;
        }

        const updatedOrder = await updateOrderFulfillmentStatus(orderId, status, {
          actorSource: 'ADMIN_PANEL',
          notes: notes || `Admin updated order status to ${status}`,
          courierName,
          courierTrackingId
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, order: updatedOrder }));
      } catch (err) {
        res.statusCode = err.message.includes('not found') ? 404 : 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return true;
  }

  // 3c. POST /api/payments/refund - Admin Process Refund
  if (pathname === '/api/payments/refund' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const auth = verifyAdminAuth(req);
        if (!auth.authenticated) {
          res.statusCode = auth.statusCode || 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, code: 'UNAUTHORIZED_ADMIN', error: auth.error }));
          return;
        }

        const payload = JSON.parse(body || '{}');
        const { orderId, amount, reason } = payload;
        if (!orderId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Order ID is required for refund.' }));
          return;
        }

        const refundResult = await processRefund({
          orderId,
          amount: amount ? Number(amount) : null,
          reason: reason || 'Customer requested return / refund',
          actorSource: 'ADMIN_PANEL'
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(refundResult));
      } catch (err) {
        res.statusCode = err.message.includes('not found') ? 404 : 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return true;
  }

  // 3b. Customer Order Tracking (GET or POST /api/orders/track)
  if (pathname === '/api/orders/track') {
    if (method === 'GET') {
      req.query = Object.fromEntries(url.searchParams);
      await orderTrackingHandler(req, res);
      return true;
    }
    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          req.body = JSON.parse(body || '{}');
        } catch (e) {
          req.body = {};
        }
        await orderTrackingHandler(req, res);
      });
      return true;
    }
  }

  // 4. POST /api/payments/create - Create verified checkout session (or COD)
  if (pathname === '/api/payments/create' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { customer, items, deliveryArea, promoCode, paymentMethod, notes } = payload;

        if (!customer) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Missing customer information.' }));
          return;
        }

        if (paymentMethod === 'COD') {
          const codResult = await createCodCheckoutOrder({
            customer,
            items,
            deliveryArea: deliveryArea || 'inside',
            promoCode: promoCode || null,
            notes: notes || ''
          });
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            mode: 'COD',
            order: codResult.order,
            items: codResult.items
          }));
          return;
        }

        const session = await createPaymentlyCheckoutSession({
          customer,
          items,
          deliveryArea: deliveryArea || 'inside',
          promoCode: promoCode || null,
          notes: notes || ''
        });

        if (!session.success) {
          res.statusCode = 400;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(session));
      } catch (err) {
        console.error('[paymentRoutes /api/payments/create Error]:', err.message);
        const isDbOrStorage = 
          err.code === 'MISSING_DATABASE_CONFIG' ||
          err.code === 'DURABLE_STORAGE_FAILED' ||
          err.code === 'DURABLE_STORAGE_UNAVAILABLE' ||
          err.code === 'DB_CONNECTION_FAILED' ||
          err.message.includes('DATABASE_CONFIGURATION_REQUIRED') ||
          err.message.includes('PostgreSQL') ||
          err.message.includes('DURABLE_STORAGE');

        res.statusCode = isDbOrStorage ? 503 : (err.message.includes('required') ? 400 : 500);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          code: isDbOrStorage ? 'STORE_CHECKOUT_UNAVAILABLE' : 'CHECKOUT_ERROR',
          error: isDbOrStorage
            ? 'Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.'
            : (err.message.includes('required') ? err.message : 'An unexpected error occurred while preparing your order. Please try again in a few moments.')
        }));
      }
    });
    return true;
  }

  // 5. POST /api/payments/verify - Server-side verification with Paymently
  if (pathname === '/api/payments/verify' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { invoiceId, checkoutId, manualTrxId } = payload;

        if (!invoiceId && !checkoutId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Invoice ID or Checkout ID is required for verification.' }));
          return;
        }

        const verification = await verifyPaymentlyPayment({
          invoiceId,
          checkoutId,
          manualTrxId
        });

        if (
          !verification.verified && 
          verification.status !== 'PENDING' && 
          verification.status !== 'PENDING_VERIFICATION' &&
          verification.status !== 'PENDING_MANUAL_REVIEW' &&
          verification.status !== 'AWAITING_PAYMENT' &&
          verification.status !== 'AWAITING_TRX_ID'
        ) {
          res.statusCode = 400;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(verification));
      } catch (err) {
        console.error('[paymentRoutes /api/payments/verify Error]:', err.message);
        const isDbOrStorage = 
          err.code === 'MISSING_DATABASE_CONFIG' ||
          err.code === 'DURABLE_STORAGE_FAILED' ||
          err.code === 'DURABLE_STORAGE_UNAVAILABLE' ||
          err.code === 'DB_CONNECTION_FAILED' ||
          err.message.includes('DATABASE_CONFIGURATION_REQUIRED') ||
          err.message.includes('PostgreSQL') ||
          err.message.includes('DURABLE_STORAGE');

        res.statusCode = isDbOrStorage ? 503 : (err.message.includes('required') ? 400 : 500);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          code: isDbOrStorage ? 'STORE_CHECKOUT_UNAVAILABLE' : 'CHECKOUT_ERROR',
          error: isDbOrStorage
            ? 'Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.'
            : (err.message.includes('required') ? err.message : 'An unexpected error occurred while preparing your order. Please try again in a few moments.')
        }));
      }
    });
    return true;
  }

  // 6. POST /api/payments/cancel - Cancel checkout attempt
  if (pathname === '/api/payments/cancel' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { checkoutId, invoiceId } = payload;

        const cancelResult = await cancelPaymentlyCheckout({ checkoutId, invoiceId });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(cancelResult));
      } catch (err) {
        console.error('[paymentRoutes /api/payments/cancel Error]:', err.message);
        const isDbOrStorage = 
          err.code === 'MISSING_DATABASE_CONFIG' ||
          err.code === 'DURABLE_STORAGE_FAILED' ||
          err.code === 'DURABLE_STORAGE_UNAVAILABLE' ||
          err.code === 'DB_CONNECTION_FAILED' ||
          err.message.includes('DATABASE_CONFIGURATION_REQUIRED') ||
          err.message.includes('PostgreSQL') ||
          err.message.includes('DURABLE_STORAGE');

        res.statusCode = isDbOrStorage ? 503 : (err.message.includes('required') ? 400 : 500);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          code: isDbOrStorage ? 'STORE_CHECKOUT_UNAVAILABLE' : 'CHECKOUT_ERROR',
          error: isDbOrStorage
            ? 'Our checkout system is temporarily unavailable due to scheduled database maintenance. Your cart items are safe. Please try again shortly or contact our store concierge.'
            : (err.message.includes('required') ? err.message : 'An unexpected error occurred while preparing your order. Please try again in a few moments.')
        }));
      }
    });
    return true;
  }

  // 7. POST /api/payments/webhook - Server-to-server IPN notification
  if (pathname === '/api/payments/webhook' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const webhookResult = await handlePaymentlyWebhook(payload, req.headers);

        if (!webhookResult.success) {
          res.statusCode = 400;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(webhookResult));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return true;
  }

  return false;
}
