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
import { getAllTransactions, getAllOrders } from './db.js';
import orderTrackingHandler from '../api/orders/track.js';

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

  // 2. GET /api/payments/transactions - List genuine transactions for Admin Panel
  if (pathname === '/api/payments/transactions' && method === 'GET') {
    const transactions = await getAdminTransactions();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, transactions }));
    return true;
  }

  // 3. GET /api/orders - List genuine customer orders
  if (pathname === '/api/orders' && method === 'GET') {
    const orders = await getAdminOrders();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, orders }));
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
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
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
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
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
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
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
