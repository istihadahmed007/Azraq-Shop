import { verifyPaymentlyPayment } from '../../server/paymentlyService.js';

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

    const { invoiceId, checkoutId, manualTrxId } = payload || {};

    if (!invoiceId && !checkoutId) {
      return res.status(400).json({ success: false, error: 'Invoice ID or Checkout ID is required for verification.' });
    }

    const verification = await verifyPaymentlyPayment({
      invoiceId,
      checkoutId,
      manualTrxId
    });

    if (verification.verified && verification.status === 'PAID') {
      return res.status(200).json(verification);
    } else if (
      verification.status === 'PENDING' || 
      verification.status === 'PENDING_VERIFICATION' || 
      verification.status === 'PENDING_MANUAL_REVIEW' ||
      verification.status === 'AWAITING_PAYMENT' ||
      verification.status === 'AWAITING_TRX_ID'
    ) {
      return res.status(200).json(verification);
    } else {
      return res.status(400).json(verification);
    }
  } catch (err) {
    console.error('[API /api/payments/verify Error]:', err.message);
    return res.status(500).json({ success: false, verified: false, error: err.message });
  }
}
