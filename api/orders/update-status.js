import { updateOrderFulfillmentStatus, initDb } from '../../server/db.js';
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

    const { orderId, status, courierName, courierTrackingId, notes } = body || {};

    if (!orderId || !status) {
      return res.status(400).json({ success: false, error: 'Order ID and status are required.' });
    }

    const allowedStatuses = ['Processing', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const updatedOrder = await updateOrderFulfillmentStatus(orderId, status, {
      actorSource: 'ADMIN_PANEL',
      notes: notes || `Admin updated order status to ${status}`,
      courierName: courierName || null,
      courierTrackingId: courierTrackingId || null
    });

    return res.status(200).json({
      success: true,
      message: `Order ${orderId} status updated to ${status}`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('[API /api/orders/update-status Error]:', err.message);
    const isNotFound = err.message.includes('not found');
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      error: err.message
    });
  }
}
