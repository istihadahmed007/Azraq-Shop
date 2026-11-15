import { 
  createPaymentlyCheckout, 
  verifyPaymentlyPayment, 
  cancelPaymentlyPayment,
  handlePaymentlyWebhook, 
  processRefund, 
  getAllTransactions, 
  getTransaction,
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

  // 3. GET /api/payments/session - Fetch session details by invoice_id or order_id
  if (pathname === '/api/payments/session' && method === 'GET') {
    const id = url.searchParams.get('id') || url.searchParams.get('invoice_id') || url.searchParams.get('order_id');
    const txn = id ? getTransaction(id) : null;
    res.setHeader('Content-Type', 'application/json');
    if (txn) {
      res.end(JSON.stringify({ success: true, session: txn }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ success: false, error: 'Payment session not found' }));
    }
    return true;
  }

  // 4. POST /api/payments/create - Create verified checkout session
  if (pathname === '/api/payments/create' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { orderId, amount, customer, items, deliveryArea, returnUrl, cancelUrl } = payload;

        if (!orderId || !customer) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Missing required checkout fields (orderId, customer)' }));
          return;
        }

        const session = await createPaymentlyCheckout({
          orderId,
          amount,
          customer,
          items,
          deliveryArea,
          returnUrl,
          cancelUrl
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

  // 5. POST /api/payments/verify - Server-side verification
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

  // 6. POST /api/payments/cancel - Cancel payment session (remains unpaid)
  if (pathname === '/api/payments/cancel' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { orderId, invoiceId } = payload;

        const cancelResult = await cancelPaymentlyPayment({ orderId, invoiceId });
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

  // 8. POST /api/payments/refund - Process a refund
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

  // 9. GET /payment-checkout - Responsive Glassy Azraq Dynamic Checkout Session UI
  if (pathname === '/payment-checkout' && method === 'GET') {
    const sessionId = url.searchParams.get('session_id') || '';
    const orderId = url.searchParams.get('order_id') || 'AZQ-BD-ORDER';
    const txn = sessionId ? getTransaction(sessionId) : (orderId ? getTransaction(orderId) : null);
    const amountVal = txn ? txn.amount : (Number(url.searchParams.get('amount')) || 7900);
    const customerName = txn?.customer_name || 'Valued Customer';
    const customerPhone = txn?.customer_phone || '017XXXXXXXX';
    const config = getGatewayConfig();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AZRAQ Secure Payment • Paymently Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            azraq: {
              navy: '#062B4F',
              azure: '#0877C9',
              glass: '#69C5F5',
              soft: '#D9F0FF',
              ice: '#F8FCFF',
              cyan: '#50DDF0'
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle at 15% 15%, #E9F4FE 0%, #F8FCFF 60%, #E3F0FC 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(105, 197, 245, 0.35);
      box-shadow: 0 20px 40px -15px rgba(6, 43, 79, 0.12), 0 0 20px rgba(80, 221, 240, 0.15);
    }
  </style>
</head>
<body class="min-h-screen text-azraq-navy flex items-center justify-center p-4">

  <div class="w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl border border-azraq-glass/40">
    <!-- Merchant Header -->
    <div class="p-6 bg-gradient-to-r from-azraq-navy via-[#0A3D6E] to-azraq-navy text-white relative">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-azraq-cyan shadow-[0_0_8px_#50DDF0] animate-pulse"></span>
          <span class="text-[11px] font-mono tracking-widest text-azraq-cyan uppercase font-bold">
            ${config.domain}
          </span>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20">
          BDT ৳ SECURED
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>AZRAQ</span>
            <span class="text-xs px-2 py-0.5 rounded bg-azraq-azure text-white font-mono font-medium">Paymently</span>
          </h1>
          <p class="text-xs text-white/70 mt-0.5">Official E-Commerce Payment Gateway Session</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-white/60 block font-mono">ORDER REF</span>
          <span class="text-xs font-mono font-bold text-azraq-cyan">${orderId}</span>
        </div>
      </div>
    </div>

    <!-- Main Payment Details & Locked Amount Area -->
    <div class="p-6 space-y-6">
      
      <!-- Locked Amount Banner -->
      <div class="p-4 rounded-xl bg-gradient-to-br from-azraq-soft/40 to-azraq-ice border border-azraq-glass/50 relative overflow-hidden">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold text-azraq-navy/70 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-azraq-azure" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke-width="2"/>
            </svg>
            Pre-Filled & Locked Amount
          </span>
          <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ Auto-Calculated
          </span>
        </div>

        <div class="flex items-baseline justify-between mt-2">
          <span class="text-3xl font-black text-azraq-navy font-mono tracking-tight" id="amountDisplay">
            ৳${amountVal.toLocaleString()} <span class="text-sm font-sans font-bold text-azraq-azure">BDT</span>
          </span>
          <span class="text-[11px] font-semibold text-azraq-navy/60">
            Invoice: <span class="font-mono text-azraq-navy">${sessionId || 'INV-AZQ-DYNAMIC'}</span>
          </span>
        </div>

        <p class="text-[11px] text-azraq-navy/65 mt-2 flex items-center gap-1.5">
          <svg class="w-3 h-3 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          Amount locked by AZRAQ Merchant Security. Customer manual typing disabled.
        </p>
      </div>

      <!-- Customer Summary -->
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <span class="text-[10px] text-gray-500 block">Customer Name</span>
          <span class="font-bold text-azraq-navy truncate block">${customerName}</span>
        </div>
        <div class="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <span class="text-[10px] text-gray-500 block">Contact Phone</span>
          <span class="font-bold text-azraq-navy font-mono">${customerPhone}</span>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-azraq-navy block">Select Payment Channel (Bangladeshi Taka):</label>
        <div class="grid grid-cols-3 gap-2">
          <label class="p-3 rounded-xl border-2 border-azraq-azure bg-azraq-ice cursor-pointer text-center hover:shadow-sm transition-all flex flex-col items-center">
            <input type="radio" name="paymethod" value="bKash" checked class="hidden">
            <span class="font-black text-xs text-[#E2136E]">bKash</span>
            <span class="text-[10px] text-gray-500">Instant</span>
          </label>
          <label class="p-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-center hover:border-azraq-azure transition-all flex flex-col items-center">
            <input type="radio" name="paymethod" value="Nagad" class="hidden">
            <span class="font-black text-xs text-[#F7941D]">Nagad</span>
            <span class="text-[10px] text-gray-500">Instant</span>
          </label>
          <label class="p-3 rounded-xl border border-gray-200 bg-white cursor-pointer text-center hover:border-azraq-azure transition-all flex flex-col items-center">
            <input type="radio" name="paymethod" value="Rocket" class="hidden">
            <span class="font-black text-xs text-[#8C3494]">Rocket</span>
            <span class="text-[10px] text-gray-500">Instant</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3 pt-2">
        <button
          id="confirmBtn"
          onclick="executePayment()"
          class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-azraq-navy to-azraq-azure hover:from-azraq-azure hover:to-azraq-navy text-white font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>CONFIRM & PAY ৳${amountVal.toLocaleString()} BDT</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>

        <div class="flex items-center justify-between text-xs pt-1">
          <button
            onclick="cancelPayment()"
            class="text-rose-600 hover:text-rose-800 font-semibold"
          >
            ✕ Cancel Payment
          </button>
          
          <a
            href="${config.default_link}"
            target="_blank"
            rel="noreferrer"
            class="text-azraq-azure hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open Default Link</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

    </div>

    <!-- Security Footer -->
    <div class="p-3 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-500 flex items-center justify-center gap-2">
      <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span>256-Bit SSL Encrypted • Powered by Paymently BD for AZRAQ</span>
    </div>

  </div>

  <script>
    async function executePayment() {
      const btn = document.getElementById('confirmBtn');
      btn.disabled = true;
      btn.innerText = 'Processing Payment Verification...';
      
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: '${sessionId}',
            orderId: '${orderId}',
            manualTrxId: 'PL-SIM-' + Math.floor(10000000 + Math.random() * 90000000)
          })
        });
        const data = await res.json();
        if (data.success && data.status === 'PAID') {
          window.location.href = '/?payment_status=success&order_id=${encodeURIComponent(orderId)}&invoice_id=${encodeURIComponent(sessionId)}';
        } else {
          alert('Payment verification failed: ' + (data.error || 'Please try again'));
          btn.disabled = false;
          btn.innerText = 'CONFIRM & PAY ৳${amountVal.toLocaleString()} BDT';
        }
      } catch (e) {
        alert('Network error connecting to payment server');
        btn.disabled = false;
        btn.innerText = 'CONFIRM & PAY ৳${amountVal.toLocaleString()} BDT';
      }
    }

    async function cancelPayment() {
      if (!confirm('Are you sure you want to cancel this payment? Your order will remain unpaid.')) return;
      try {
        await fetch('/api/payments/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: '${sessionId}',
            orderId: '${orderId}'
          })
        });
      } catch (e) {}
      window.location.href = '/?payment_status=cancelled&order_id=${encodeURIComponent(orderId)}';
    }
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
    return true;
  }

  return false;
}
