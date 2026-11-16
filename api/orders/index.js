import { getAdminOrders } from '../../server/paymentlyService.js';
import { verifyAdminAuth } from '../../server/adminAuth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Strict Admin Authentication Check
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) {
    return res.status(auth.statusCode || 401).json({
      success: false,
      code: 'UNAUTHORIZED_ADMIN',
      error: auth.error
    });
  }

  try {
    const orders = await getAdminOrders();
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('[API /api/orders Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
