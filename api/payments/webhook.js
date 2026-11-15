import { handlePaymentlyWebhook } from '../../server/paymentlyService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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

    const webhookResult = await handlePaymentlyWebhook(payload, req.headers);
    if (webhookResult.success) {
      return res.status(200).json(webhookResult);
    } else {
      return res.status(400).json(webhookResult);
    }
  } catch (err) {
    console.error('[Webhook Error]:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}
