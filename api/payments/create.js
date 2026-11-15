import { createPaymentlyCheckout } from '../../server/paymentlyService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    const { orderId, amount, customer, items, deliveryArea, returnUrl, cancelUrl } = payload || {};

    if (!orderId || !customer) {
      return res.status(400).json({ success: false, error: 'Missing required checkout fields (orderId, customer)' });
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

    return res.status(200).json(session);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
