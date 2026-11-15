import { 
  createPaymentlyCheckout, 
  verifyPaymentlyPayment, 
  handlePaymentlyWebhook, 
  processRefund, 
  getAllTransactions, 
  getGatewayConfig 
} from './paymentlyService.js';

export async function handlePaymentRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;
  const method = req.method;

  // 1. GET /api/payments/status - Gateway status & configuration
  if (pathname === '/api/payments/status' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, gateway: getGatewayConfig() }));
    return true;
  }

  // 2. GET /api/payments/transactions - List all transactions for Admin Panel
  if (pathname === '/api/payments/transactions' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, transactions: getAllTransactions() }));
    return true;
  }

  // 3. POST /api/payments/create - Create verified checkout session
  if (pathname === '/api/payments/create' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { orderId, amount, customer, items, deliveryArea } = payload;

        if (!orderId || !amount || !customer) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Missing required checkout fields (orderId, amount, customer)' }));
          return;
        }

        const session = await createPaymentlyCheckout({
          orderId,
          amount,
          customer,
          items,
          deliveryArea
        });

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

  // 4. POST /api/payments/verify - Server-side verification
  if (pathname === '/api/payments/verify' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { invoiceId, orderId, manualTrxId } = payload;

        if (!invoiceId && !orderId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Invoice ID or Order ID is required for verification' }));
          return;
        }

        const verification = await verifyPaymentlyPayment({
          invoiceId,
          orderId,
          manualTrxId
        });

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

  // 5. POST /api/payments/webhook - Server-to-server IPN notification
  if (pathname === '/api/payments/webhook' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const webhookResult = await handlePaymentlyWebhook(payload, req.headers);

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

  // 6. POST /api/payments/refund - Process a refund
  if (pathname === '/api/payments/refund' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { orderId, reason, amount } = payload;

        if (!orderId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Order ID is required' }));
          return;
        }

        const refundResult = await processRefund({ orderId, reason, amount });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(refundResult));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return true;
  }

  return false;
}

