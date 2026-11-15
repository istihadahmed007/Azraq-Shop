import { getOrderByTrackingAuth, getOrderStatusHistory, initDb } from '../../server/db.js';

// Sliding window in-memory rate limiter: max 25 requests per 5 minutes per IP
const trackingRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;

function isRateLimited(clientIp) {
  const now = Date.now();
  const entry = trackingRateLimits.get(clientIp);

  if (!entry) {
    trackingRateLimits.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (now > entry.resetAt) {
    trackingRateLimits.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Rate Limiting by IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMITED',
      error: 'Too many tracking attempts. Please wait 5 minutes before trying again.'
    });
  }

  try {
    await initDb();

    // Extract parameters from query or body
    let params = {};
    if (req.method === 'GET') {
      params = req.query || {};
    } else {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      params = body || {};
    }

    const orderId = (params.orderId || params.order_id || params.id || '').trim();
    const phone = (params.phone || params.customerPhone || params.customer_phone || '').trim();
    const trackingToken = (params.token || params.trackingToken || params.tracking_token || '').trim();

    // Invariant: Order ID is required
    if (!orderId) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_ORDER_ID',
        error: 'Order ID or invoice reference is required.'
      });
    }

    // Invariant: Guessable order ID alone is NEVER sufficient authorization.
    // Must provide either customer phone or secure unguessable tracking token.
    if (!phone && !trackingToken) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        error: 'Customer phone number or secure tracking token is required to view order status.'
      });
    }

    const authResult = await getOrderByTrackingAuth(orderId, { phone, trackingToken });

    if (!authResult.success) {
      const statusCode = authResult.error?.includes('Unauthorized') ? 403 : 404;
      return res.status(statusCode).json({
        success: false,
        code: statusCode === 403 ? 'FORBIDDEN' : 'ORDER_NOT_FOUND',
        error: authResult.error || 'Unable to locate order with provided details.'
      });
    }

    const order = authResult.order;
    const history = await getOrderStatusHistory(order.id);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        tracking_token: order.tracking_token,
        fulfillment_status: order.fulfillment_status || order.order_status || 'Processing',
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        currency: order.currency || 'BDT',
        total: Number(order.total || 0),
        subtotal: Number(order.subtotal || 0),
        delivery_fee: Number(order.delivery_fee || 0),
        discount: Number(order.discount || 0),
        delivery_area: order.delivery_area,
        city: order.city,
        customer_name_masked: order.customer_name_masked,
        customer_phone_masked: order.customer_phone_masked,
        shipping_address_masked: order.shipping_address_masked,
        courier_name: order.courier_name || null,
        courier_tracking_id: order.courier_tracking_id || null,
        created_at: order.created_at,
        verified_at: order.verified_at || null,
        dispatched_at: order.dispatched_at || null,
        delivered_at: order.delivered_at || null,
        items: (order.items || []).map(item => ({
          name: item.name,
          variant: item.variant || 'Standard',
          quantity: item.quantity,
          unit_price: Number(item.unit_price || 0),
          total_price: Number(item.total_price || 0)
        })),
        history: (history || []).map(h => ({
          id: h.id,
          status_type: h.status_type,
          previous_status: h.previous_status,
          new_status: h.new_status,
          notes: h.notes,
          created_at: h.created_at
        }))
      }
    });

  } catch (err) {
    console.error('[API /api/orders/track Error]:', err.message);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      error: 'An internal error occurred while retrieving order tracking information.'
    });
  }
}

