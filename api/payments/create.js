import { 
  createPaymentlyCheckoutSession, 
  createCodCheckoutOrder 
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

    const { customer, items, deliveryArea, promoCode, paymentMethod, notes } = payload || {};

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

    // 2. Real Paymently Dynamic Session Creation
    const session = await createPaymentlyCheckoutSession({
      customer,
      items,
      deliveryArea: deliveryArea || 'inside',
      promoCode: promoCode || null,
      notes: notes || ''
    });

    if (!session.success) {
      return res.status(400).json(session);
    }

    return res.status(200).json(session);
  } catch (err) {
    console.error('[API /api/payments/create Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
