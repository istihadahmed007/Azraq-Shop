import { cancelPaymentlyCheckout } from '../../server/paymentlyService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) {}
    }

    const { checkoutId, invoiceId, cancelToken, cancel_token, customerPhone, phone } = payload || {};
    const cancelResult = await cancelPaymentlyCheckout({
      checkoutId,
      invoiceId,
      cancelToken: cancelToken || cancel_token,
      customerPhone: customerPhone || phone,
      req
    });
    const statusCode = cancelResult.success ? 200 : (cancelResult.statusCode || 403);
    return res.status(statusCode).json(cancelResult);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
