import { getAdminTransactions } from '../../server/paymentlyService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authorization check for admin transaction audit
  const adminKey = req.headers['x-admin-key'] || (req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s+/i, '') : null);
  const expectedKey = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || 'azraq_secure_admin';

  // If in production and adminKey does not match, restrict
  if (process.env.NODE_ENV === 'production' && process.env.ADMIN_API_KEY && adminKey !== expectedKey) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrative access.' });
  }

  try {
    const transactions = await getAdminTransactions();
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
