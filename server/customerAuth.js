/**
 * AZRAQ Shop — Genuine Customer Authentication Module
 * 
 * Powered by Google Identity Services (GIS), OAuth2Client token verification,
 * and cryptographically random session tokens with SHA-256 hashed database storage.
 */
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import {
  findCustomerByGoogleSub,
  findCustomerByEmail,
  findCustomerById,
  upsertGoogleCustomer,
  createCustomerWithPassword,
  saveCustomerSession,
  findSessionByTokenHash,
  revokeCustomerSession
} from './db.js';

const SESSION_COOKIE_NAME = 'azraq_session';
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 Days

/**
 * Resolve configured Google Client ID from environment
 */
export function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || null;
}

/**
 * Resolve configured Google Client Secret from environment
 */
export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || null;
}

/**
 * Cookie Parser Helper
 */
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [name, ...valParts] = part.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(valParts.join('='));
    }
  }
  return cookies;
}

/**
 * Format Session Cookie Header
 */
export function buildSessionCookie(token, maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000)) {
  const isProd = process.env.NODE_ENV === 'production';
  const directives = [
    `${SESSION_COOKIE_NAME}=${token || ''}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (isProd) {
    directives.push('Secure');
  }
  return directives.join('; ');
}

/**
 * Clear Session Cookie Header
 */
export function buildClearCookie() {
  const isProd = process.env.NODE_ENV === 'production';
  const directives = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];
  if (isProd) {
    directives.push('Secure');
  }
  return directives.join('; ');
}

/**
 * Parse JSON body helper
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Malformed JSON payload: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Password hashing helpers using native crypto.scrypt
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Validate Origin against allowed storefront URLs
 */
function isOriginAllowed(origin) {
  if (!origin) return true; // Direct same-origin requests or non-browser clients
  const appBaseUrl = process.env.APP_BASE_URL;
  if (appBaseUrl) {
    try {
      const allowedHost = new URL(appBaseUrl).host;
      const originHost = new URL(origin).host;
      if (allowedHost === originHost) return true;
    } catch (e) {
      // ignore
    }
  }

  try {
    const url = new URL(origin);
    const host = url.hostname;
    // Allow localhost, 127.0.0.1, or azraq domain in development & testing
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.azraqtrips.com') || host.endsWith('.paymently.io')) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * Primary HTTP Request Router for Customer Authentication (/api/auth/*)
 */
export async function handleCustomerAuthRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;
  const method = req.method;

  // Polyfill helper methods if missing (standard HTTP server compatibility)
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.end(JSON.stringify(data));
      return this;
    };
  }

  // Handle CORS & Origin Validation
  const origin = req.headers.origin;
  if (origin) {
    if (isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }
  }

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // =========================================================================
  // 1. POST /api/auth/google — Verify Genuine Google Credential
  // =========================================================================
  if (pathname === '/api/auth/google' && method === 'POST') {
    // CSRF Protection: check origin
    if (origin && !isOriginAllowed(origin)) {
      res.status(403).json({
        success: false,
        code: 'ORIGIN_FORBIDDEN',
        error: 'Unauthorized origin for authentication request.'
      });
      return true;
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      console.error('[Google Auth Error]: GOOGLE_CLIENT_ID or VITE_GOOGLE_CLIENT_ID is not configured.');
      res.status(500).json({
        success: false,
        code: 'GOOGLE_CONFIG_MISSING',
        error: 'Google Sign-In is not configured on the server. Please set GOOGLE_CLIENT_ID.'
      });
      return true;
    }

    try {
      const body = await readJsonBody(req);
      const { credential, nonce } = body;

      if (!credential || typeof credential !== 'string') {
        res.status(400).json({
          success: false,
          code: 'CREDENTIAL_REQUIRED',
          error: 'Missing Google ID token credential.'
        });
        return true;
      }

      // Verify Google ID Token with Google's official OAuth2Client
      const client = new OAuth2Client(clientId, getGoogleClientSecret());
      let ticket;
      try {
        ticket = await client.verifyIdToken({
          idToken: credential,
          audience: clientId
        });
      } catch (verifyErr) {
        console.warn('[Google Auth Verification Failed]:', verifyErr.message);
        res.status(401).json({
          success: false,
          code: 'INVALID_GOOGLE_TOKEN',
          error: 'Google token verification failed: ' + verifyErr.message
        });
        return true;
      }

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(401).json({
          success: false,
          code: 'EMPTY_TOKEN_PAYLOAD',
          error: 'Token payload could not be decoded.'
        });
        return true;
      }

      // Validate Issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (!validIssuers.includes(payload.iss)) {
        res.status(401).json({
          success: false,
          code: 'INVALID_ISSUER',
          error: 'Untrusted token issuer.'
        });
        return true;
      }

      // Validate Expiration
      if (!payload.exp || (payload.exp * 1000) <= Date.now()) {
        res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          error: 'Google ID token has expired.'
        });
        return true;
      }

      // Validate Audience
      if (payload.aud !== clientId) {
        res.status(401).json({
          success: false,
          code: 'AUDIENCE_MISMATCH',
          error: 'Token audience does not match configured Google Client ID.'
        });
        return true;
      }

      // Validate Nonce if provided
      if (nonce && payload.nonce && payload.nonce !== nonce) {
        res.status(401).json({
          success: false,
          code: 'NONCE_MISMATCH',
          error: 'Security nonce verification failed.'
        });
        return true;
      }

      // Validate Verified Email
      if (!payload.email_verified) {
        res.status(401).json({
          success: false,
          code: 'EMAIL_NOT_VERIFIED',
          error: 'Google account email address is not verified.'
        });
        return true;
      }

      // Use Google's sub as the authoritative immutable provider identifier
      const googleSub = payload.sub;
      if (!googleSub) {
        res.status(401).json({
          success: false,
          code: 'MISSING_SUB_IDENTIFIER',
          error: 'Google account missing unique subject identifier.'
        });
        return true;
      }

      // Atomically persist customer & Google identity
      const customer = await upsertGoogleCustomer({
        email: payload.email,
        name: payload.name || payload.given_name || 'Customer',
        avatarUrl: payload.picture || null,
        googleSub,
        profileData: {
          locale: payload.locale,
          family_name: payload.family_name,
          given_name: payload.given_name
        }
      });

      // Issue cryptographically random 32-byte session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await saveCustomerSession({
        customerId: customer.id,
        tokenHash,
        ipAddress: req.socket?.remoteAddress || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
        expiresAt
      });

      // Set HttpOnly, SameSite=Lax, Secure session cookie
      res.setHeader('Set-Cookie', buildSessionCookie(sessionToken));

      res.status(200).json({
        success: true,
        authenticated: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar_url,
          provider: 'google'
        }
      });
      return true;
    } catch (err) {
      console.error('[Google Auth Handler Error]:', err);
      res.status(500).json({
        success: false,
        code: 'GOOGLE_AUTH_ERROR',
        error: err.message || 'Authentication processing failure.'
      });
      return true;
    }
  }

  // =========================================================================
  // 2. GET /api/auth/me — Return Currently Authenticated Customer
  // =========================================================================
  if (pathname === '/api/auth/me' && method === 'GET') {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies[SESSION_COOKIE_NAME];

    if (!sessionToken || sessionToken.length < 32) {
      res.status(200).json({
        authenticated: false,
        customer: null
      });
      return true;
    }

    try {
      const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
      const sessionData = await findSessionByTokenHash(tokenHash);

      if (!sessionData || !sessionData.customer) {
        // Expired or revoked session: clear cookie
        res.setHeader('Set-Cookie', buildClearCookie());
        res.status(200).json({
          authenticated: false,
          customer: null
        });
        return true;
      }

      res.status(200).json({
        authenticated: true,
        customer: {
          id: sessionData.customer.id,
          name: sessionData.customer.name,
          email: sessionData.customer.email,
          phone: sessionData.customer.phone,
          avatar: sessionData.customer.avatar_url,
          provider: 'google'
        }
      });
      return true;
    } catch (err) {
      console.error('[Auth /me Error]:', err.message);
      res.status(500).json({
        authenticated: false,
        customer: null,
        error: 'Failed to verify session'
      });
      return true;
    }
  }

  // =========================================================================
  // 3. POST /api/auth/logout — Revoke Server Session & Clear Cookie
  // =========================================================================
  if (pathname === '/api/auth/logout' && method === 'POST') {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies[SESSION_COOKIE_NAME];

    if (sessionToken) {
      try {
        const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
        await revokeCustomerSession(tokenHash);
      } catch (e) {
        console.warn('[Logout Revoke Warning]:', e.message);
      }
    }

    res.setHeader('Set-Cookie', buildClearCookie());
    res.status(200).json({
      success: true,
      authenticated: false,
      message: 'Logged out successfully.'
    });
    return true;
  }

  // =========================================================================
  // 4. POST /api/auth/register — Server-side Credentials Registration
  // =========================================================================
  if (pathname === '/api/auth/register' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { name, identifier, password } = body;

      const cleanName = String(name || '').trim();
      const cleanId = String(identifier || '').trim();
      const cleanPass = String(password || '');

      if (!cleanName) {
        res.status(400).json({ success: false, error: 'Full name is required.' });
        return true;
      }
      if (!cleanId || !cleanId.includes('@')) {
        res.status(400).json({ success: false, error: 'A valid email address is required.' });
        return true;
      }
      if (cleanPass.length < 6) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
        return true;
      }

      const existing = await findCustomerByEmail(cleanId);
      if (existing) {
        res.status(409).json({ success: false, error: 'An account with this email already exists.' });
        return true;
      }

      const passwordHash = hashPassword(cleanPass);
      const customer = await createCustomerWithPassword({
        email: cleanId,
        name: cleanName,
        passwordHash
      });

      // Establish session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await saveCustomerSession({
        customerId: customer.id,
        tokenHash,
        ipAddress: req.socket?.remoteAddress || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
        expiresAt
      });

      res.setHeader('Set-Cookie', buildSessionCookie(sessionToken));
      res.status(201).json({
        success: true,
        authenticated: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar_url,
          provider: 'credentials'
        }
      });
      return true;
    } catch (err) {
      console.error('[Register Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to create customer account.' });
      return true;
    }
  }

  // =========================================================================
  // 5. POST /api/auth/login — Server-side Credentials Verification
  // =========================================================================
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { identifier, password } = body;

      const cleanId = String(identifier || '').trim();
      const cleanPass = String(password || '');

      if (!cleanId || !cleanPass) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return true;
      }

      const customer = await findCustomerByEmail(cleanId);
      if (!customer || !customer.password_hash) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return true;
      }

      const isValid = verifyPassword(cleanPass, customer.password_hash);
      if (!isValid) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return true;
      }

      // Establish session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await saveCustomerSession({
        customerId: customer.id,
        tokenHash,
        ipAddress: req.socket?.remoteAddress || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
        expiresAt
      });

      res.setHeader('Set-Cookie', buildSessionCookie(sessionToken));
      res.status(200).json({
        success: true,
        authenticated: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar_url,
          provider: 'credentials'
        }
      });
      return true;
    } catch (err) {
      console.error('[Login Error]:', err.message);
      res.status(500).json({ success: false, error: 'Authentication failed.' });
      return true;
    }
  }

  return false;
}
