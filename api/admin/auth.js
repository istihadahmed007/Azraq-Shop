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

  // If key was provided in body, attach to headers for verifyAdminAuth
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  if (body?.adminKey && !req.headers['x-admin-key'] && !req.headers['authorization']) {
    req.headers['x-admin-key'] = String(body.adminKey).trim();
  }

  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) {
    return res.status(auth.statusCode || 401).json({
      success: false,
      code: 'UNAUTHORIZED_ADMIN',
      error: auth.error
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Administrator session authenticated successfully.'
  });
}
