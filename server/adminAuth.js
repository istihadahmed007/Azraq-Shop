import crypto from 'crypto';

/**
 * Server-Side Admin Authentication Middleware / Helper
 * Enforces strict authentication for all administrative, order export, and refund endpoints.
 * Fails closed in production if ADMIN_API_KEY is not configured.
 */
export function verifyAdminAuth(req) {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminSecret = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET;

  // Invariant 1: Fail closed if production secret is missing
  if (isProduction && (!adminSecret || adminSecret.length < 8)) {
    console.error('[Security Critical]: ADMIN_API_KEY is missing or invalid in production environment. Failing closed.');
    return {
      authenticated: false,
      statusCode: 500,
      error: 'Administrative endpoints are temporarily disabled due to server misconfiguration. Contact system administrator.'
    };
  }

  // Development fallback key (strictly disallowed in production)
  const expectedSecret = adminSecret || (!isProduction ? 'azraq_dev_admin_key' : null);

  if (!expectedSecret) {
    return {
      authenticated: false,
      statusCode: 500,
      error: 'Administrative authentication is not configured.'
    };
  }

  // Extract key from headers
  const authHeader = req.headers['authorization'] || req.headers['x-admin-key'];
  let providedKey = '';

  if (authHeader) {
    if (typeof authHeader === 'string') {
      providedKey = authHeader.replace(/^Bearer\s+/i, '').trim();
    }
  }

  if (!providedKey) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Administrative authentication credentials are required.'
    };
  }

  // Timing-safe constant-time comparison
  const expectedBuffer = Buffer.from(expectedSecret);
  const providedBuffer = Buffer.from(providedKey);

  if (expectedBuffer.length !== providedBuffer.length) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Invalid administrative credentials.'
    };
  }

  const isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  if (!isValid) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Invalid administrative credentials.'
    };
  }

  return { authenticated: true };
}
