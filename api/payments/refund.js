import { processRefund, initDb } from '../../server/db.js';
import { verifyAdminAuth } from '../../server/adminAuth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Strict Admin Authorization
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) {
    return res.status(auth.statusCode || 401).json({
      success: false,
      code: 'UNAUTHORIZED_ADMIN',
      error: auth.error
    });
  }

  try {
    await initDb();
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { orderId, amount, reason } = body || {};

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required for refund processing.' });
    }

    const result = await processRefund({
      orderId,
      amount: amount ? Number(amount) : null,
      reason: reason || 'Customer requested return / warranty reconciliation',
      actorSource: 'ADMIN_PANEL'
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/payments/refund Error]:', err.message);
    const isNotFound = err.message.includes('not found');
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      error: err.message
    });
  }
}
