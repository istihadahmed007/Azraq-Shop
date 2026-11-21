/**
 * AZRAQ Shop — Genuine Customer Authentication & Google Identity Services (GIS) Tests
 * 
 * Verifies:
 * 1. Missing server Google Client ID configuration fails safely.
 * 2. Missing credential parameter is rejected.
 * 3. Invalid Google token signature is rejected (HTTP 401).
 * 4. Expired Google token is rejected.
 * 5. Wrong audience (client ID mismatch) is rejected.
 * 6. Unverified email address from Google is rejected.
 * 7. Valid Google ID token succeeds, creates customer & federated identity, and sets HttpOnly cookie.
 * 8. Duplicate Google login deduplicates identity to same customer and updates last_login_at.
 * 9. GET /api/auth/me authenticates customer via session cookie.
 * 10. POST /api/auth/logout revokes session in database and clears cookie.
 * 11. Revoked or expired session returns authenticated: false.
 * 12. Fake localStorage user cannot authenticate; /api/auth/me requires valid hashed session.
 * 13. Origin validation protects against cross-origin CSRF tampering.
 */

import assert from 'assert';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { handleCustomerAuthRoutes, parseCookies } from '../server/customerAuth.js';
import {
  findCustomerByGoogleSub,
  findCustomerByEmail,
  findSessionByTokenHash,
  memoryStore
} from '../server/db.js';

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  process.stdout.write(`\n▶ TEST ${total} — ${name}:\n`);
  try {
    fn();
    passed++;
    console.log(`  ✓ Passed`);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    process.exitCode = 1;
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  total++;
  process.stdout.write(`\n▶ TEST ${total} — ${name}:\n`);
  try {
    await fn();
    passed++;
    console.log(`  ✓ Passed`);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    process.exitCode = 1;
    throw err;
  }
}

console.log('='.repeat(64));
console.log('🧪 AZRAQ GENUINE GOOGLE AUTHENTICATION & SESSION AUDIT TESTS');
console.log('='.repeat(64));

// Mock Request & Response helpers
function createMockReq({ method = 'GET', url = '/api/auth/me', headers = {}, body = null }) {
  const req = {
    method,
    url,
    headers: {
      host: 'localhost:3000',
      ...headers
    },
    body,
    socket: { remoteAddress: '127.0.0.1' },
    on: function(event, callback) {
      if (event === 'data' && body) {
        callback(typeof body === 'string' ? body : JSON.stringify(body));
      }
      if (event === 'end') {
        callback();
      }
      return this;
    }
  };
  return req;
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    setHeader: function(key, val) {
      this.headers[key.toLowerCase()] = val;
      return this;
    },
    json: function(data) {
      this.body = data;
      this.setHeader('content-type', 'application/json');
      return this;
    },
    end: function(data) {
      if (data && !this.body) {
        try {
          this.body = JSON.parse(data);
        } catch (e) {
          this.body = data;
        }
      }
      return this;
    }
  };
  return res;
}

const TEST_CLIENT_ID = 'test-client-id-12345.apps.googleusercontent.com';

(async () => {
  // Save original env
  const origGoogleClientId = process.env.GOOGLE_CLIENT_ID;
  const origViteClientId = process.env.VITE_GOOGLE_CLIENT_ID;

  // 1. Missing server configuration fails safely
  await runAsyncTest('Missing GOOGLE_CLIENT_ID rejects authentication with GOOGLE_CONFIG_MISSING', async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.VITE_GOOGLE_CLIENT_ID;

    const req = createMockReq({
      method: 'POST',
      url: '/api/auth/google',
      body: { credential: 'dummy-token' }
    });
    const res = createMockRes();

    await handleCustomerAuthRoutes(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.code, 'GOOGLE_CONFIG_MISSING');
  });

  // Set test environment client id
  process.env.GOOGLE_CLIENT_ID = TEST_CLIENT_ID;

  // 2. Missing credential parameter is rejected
  await runAsyncTest('Missing credential payload returns 400 CREDENTIAL_REQUIRED', async () => {
    const req = createMockReq({
      method: 'POST',
      url: '/api/auth/google',
      body: {}
    });
    const res = createMockRes();

    await handleCustomerAuthRoutes(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.code, 'CREDENTIAL_REQUIRED');
  });

  // 3. Invalid token signature
  await runAsyncTest('Invalid Google token signature fails verification with 401 INVALID_GOOGLE_TOKEN', async () => {
    const req = createMockReq({
      method: 'POST',
      url: '/api/auth/google',
      body: { credential: 'malformed.jwt.token' }
    });
    const res = createMockRes();

    await handleCustomerAuthRoutes(req, res);
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.code, 'INVALID_GOOGLE_TOKEN');
  });

  // Mock verifyIdToken for scenario testing
  const originalVerify = OAuth2Client.prototype.verifyIdToken;

  try {
    // 4. Expired token rejection
    await runAsyncTest('Expired Google token is rejected with 401 TOKEN_EXPIRED', async () => {
      OAuth2Client.prototype.verifyIdToken = async function() {
        return {
          getPayload: () => ({
            iss: 'https://accounts.google.com',
            aud: TEST_CLIENT_ID,
            sub: 'goog_expired_1',
            email: 'expired@azraq.com',
            email_verified: true,
            exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hr ago
          })
        };
      };

      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        body: { credential: 'valid.looking.jwt' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.code, 'TOKEN_EXPIRED');
    });

    // 5. Wrong audience
    await runAsyncTest('Wrong audience is rejected with 401 AUDIENCE_MISMATCH', async () => {
      OAuth2Client.prototype.verifyIdToken = async function() {
        return {
          getPayload: () => ({
            iss: 'https://accounts.google.com',
            aud: 'wrong-attacker-client-id.apps.googleusercontent.com',
            sub: 'goog_attacker_1',
            email: 'victim@azraq.com',
            email_verified: true,
            exp: Math.floor(Date.now() / 1000) + 3600
          })
        };
      };

      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        body: { credential: 'valid.jwt' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.code, 'AUDIENCE_MISMATCH');
    });

    // 6. Unverified email
    await runAsyncTest('Unverified email address from Google is rejected with 401 EMAIL_NOT_VERIFIED', async () => {
      OAuth2Client.prototype.verifyIdToken = async function() {
        return {
          getPayload: () => ({
            iss: 'https://accounts.google.com',
            aud: TEST_CLIENT_ID,
            sub: 'goog_unverified_1',
            email: 'unverified@azraq.com',
            email_verified: false,
            exp: Math.floor(Date.now() / 1000) + 3600
          })
        };
      };

      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        body: { credential: 'valid.jwt' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.code, 'EMAIL_NOT_VERIFIED');
    });

    // 7. Valid Google ID token establishes authentic session & sets secure cookie
    let activeSessionToken = null;
    let customerUserId = null;

    await runAsyncTest('Valid Google ID token creates customer, stores identity, and issues HttpOnly session cookie', async () => {
      OAuth2Client.prototype.verifyIdToken = async function() {
        return {
          getPayload: () => ({
            iss: 'https://accounts.google.com',
            aud: TEST_CLIENT_ID,
            sub: 'google_sub_998877665544',
            email: 'tahmid.hassan@example.com',
            email_verified: true,
            name: 'Tahmid Hassan',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocLt=s96-c',
            exp: Math.floor(Date.now() / 1000) + 3600
          })
        };
      };

      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        body: { credential: 'legit.google.jwt' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.customer.name, 'Tahmid Hassan');
      assert.strictEqual(res.body.customer.email, 'tahmid.hassan@example.com');
      assert.strictEqual(res.body.customer.provider, 'google');

      customerUserId = res.body.customer.id;

      // Verify Set-Cookie header
      const cookieHeader = res.headers['set-cookie'];
      assert.ok(cookieHeader, 'Set-Cookie header must be present');
      assert.ok(cookieHeader.includes('azraq_session='), 'Must set azraq_session cookie');
      assert.ok(cookieHeader.includes('HttpOnly'), 'Cookie must be HttpOnly');
      assert.ok(cookieHeader.includes('SameSite=Lax'), 'Cookie must be SameSite=Lax');

      // Extract raw session token
      const match = cookieHeader.match(/azraq_session=([a-f0-9]{64})/);
      assert.ok(match, 'Must generate 32-byte (64 hex char) random session token');
      activeSessionToken = match[1];

      // Verify DB storage: token stored as SHA-256 hash
      const tokenHash = crypto.createHash('sha256').update(activeSessionToken).digest('hex');
      const stored = await findSessionByTokenHash(tokenHash);
      assert.ok(stored, 'Session must be queryable by SHA-256 token hash');
      assert.strictEqual(stored.customer.email, 'tahmid.hassan@example.com');
    });

    // 8. Duplicate Google identity does NOT create duplicate customer
    await runAsyncTest('Repeated login with same Google sub updates existing customer without duplicate records', async () => {
      const countBefore = memoryStore.customer_users.size;

      OAuth2Client.prototype.verifyIdToken = async function() {
        return {
          getPayload: () => ({
            iss: 'https://accounts.google.com',
            aud: TEST_CLIENT_ID,
            sub: 'google_sub_998877665544', // Identical Google sub
            email: 'tahmid.hassan@example.com',
            email_verified: true,
            name: 'Tahmid Hassan Updated',
            picture: 'https://lh3.googleusercontent.com/new_pic',
            exp: Math.floor(Date.now() / 1000) + 3600
          })
        };
      };

      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        body: { credential: 'legit.google.jwt.2' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.customer.id, customerUserId, 'Customer ID must remain identical');
      assert.strictEqual(res.body.customer.name, 'Tahmid Hassan Updated');

      const countAfter = memoryStore.customer_users.size;
      assert.strictEqual(countAfter, countBefore, 'Zero duplicate customer records created');
    });

    // 9. GET /api/auth/me authenticates customer from session cookie
    await runAsyncTest('GET /api/auth/me verifies session cookie and returns authenticated customer', async () => {
      const req = createMockReq({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          cookie: `azraq_session=${activeSessionToken}; other=123`
        }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.authenticated, true);
      assert.strictEqual(res.body.customer.id, customerUserId);
      assert.strictEqual(res.body.customer.email, 'tahmid.hassan@example.com');
    });

    // 10. POST /api/auth/logout revokes session in DB and clears cookie
    await runAsyncTest('POST /api/auth/logout revokes session in DB and sets Max-Age=0 cookie', async () => {
      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/logout',
        headers: {
          cookie: `azraq_session=${activeSessionToken}`
        }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.authenticated, false);

      // Verify clear cookie header
      const clearCookie = res.headers['set-cookie'];
      assert.ok(clearCookie.includes('Max-Age=0'), 'Must clear cookie with Max-Age=0');

      // Verify session is marked revoked in DB
      const tokenHash = crypto.createHash('sha256').update(activeSessionToken).digest('hex');
      const sessionAfter = await findSessionByTokenHash(tokenHash);
      assert.strictEqual(sessionAfter, null, 'Revoked session cannot be found as active session');
    });

    // 11. Subsequent GET /api/auth/me with revoked session returns unauthenticated
    await runAsyncTest('Subsequent /api/auth/me with revoked session token returns authenticated: false', async () => {
      const req = createMockReq({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          cookie: `azraq_session=${activeSessionToken}`
        }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.authenticated, false);
      assert.strictEqual(res.body.customer, null);
    });

    // 12. Fake localStorage objects cannot authenticate
    await runAsyncTest('Fake client-side authorization without valid server cookie returns authenticated: false', async () => {
      const fakeToken = 'fabricated_client_session_xyz_' + Date.now();
      const req = createMockReq({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          cookie: `azraq_session=${fakeToken}`
        }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.authenticated, false);
      assert.strictEqual(res.body.customer, null);
    });

    // 13. Origin validation
    await runAsyncTest('Unauthorized cross-origin request is rejected with 403 ORIGIN_FORBIDDEN', async () => {
      const req = createMockReq({
        method: 'POST',
        url: '/api/auth/google',
        headers: {
          origin: 'https://evil-phishing-attacker.com'
        },
        body: { credential: 'some-token' }
      });
      const res = createMockRes();

      await handleCustomerAuthRoutes(req, res);
      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.code, 'ORIGIN_FORBIDDEN');
    });

  } finally {
    // Restore original verify method and env
    OAuth2Client.prototype.verifyIdToken = originalVerify;
    if (origGoogleClientId) process.env.GOOGLE_CLIENT_ID = origGoogleClientId;
    else delete process.env.GOOGLE_CLIENT_ID;
    if (origViteClientId) process.env.VITE_GOOGLE_CLIENT_ID = origViteClientId;
    else delete process.env.VITE_GOOGLE_CLIENT_ID;
  }

  console.log('\n' + '='.repeat(64));
  console.log(`🎉 ALL ${passed}/${total} AUTHENTICATION & GOOGLE GIS AUDIT TESTS PASSED!`);
  console.log('='.repeat(64));
})();
