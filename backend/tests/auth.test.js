const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID, randomBytes, createHash } = require('node:crypto');
const { Pool } = require('pg');
const { loadConfig } = require('../src/config/env');
const { createPool } = require('../src/config/db');
const { installSchema } = require('../scripts/setup-db');
const { passwordReady } = require('../src/utils/password');
const createApp = require('../src/app');

const password = 'Travel@2026Safe!';
const email = () => `test-${randomUUID()}@example.test`;
let admin, pool, config, url, database, primaryUser, primaryCookie;
const servers = [];

async function serve(overrides = {}, databasePool = pool) {
  const server = createApp({ pool: databasePool, config: { ...config, ...overrides } }).listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}

async function request(path, { method = 'GET', body, cookie, headers = {}, base = url } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, headers: response.headers,
    body: text ? JSON.parse(text) : null,
    cookie: response.headers.get('set-cookie')?.split(';')[0] };
}

async function register(overrides = {}, options = {}) {
  return request('/api/auth/register', {
    method: 'POST', body: { name: 'مسافر اختبار', email: email(), password, ...overrides }, ...options,
  });
}

describe('Travora authentication against isolated PostgreSQL', { concurrency: false }, () => {
  before(async () => {
    const original = loadConfig();
    admin = new Pool({ connectionString: original.databaseUrl, connectionTimeoutMillis: 5000 });
    // Only this randomly named database is created and dropped; the configured database is never reset.
    database = `travora_auth_test_${randomUUID().replaceAll('-', '')}`;
    await admin.query(`CREATE DATABASE "${database}" TEMPLATE template0`);
    const testUrl = new URL(original.databaseUrl);
    testUrl.pathname = `/${database}`;
    config = { ...original, databaseUrl: testUrl.toString(), environment: 'test',
      secureCookies: false, cookieName: 'travora_session', registerLimit: 1000, loginLimit: 1000,
      otpDevFallback: true };
    pool = createPool(config);
    await installSchema(pool);
    await passwordReady;
    url = await serve();
  });

  after(async () => {
    for (const server of servers) {
      await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
    }
    if (pool) await pool.end();
    if (admin) {
      if (database) await admin.query(`DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`);
      await admin.end();
    }
  });

  it('health checks the actual PostgreSQL connection', async () => {
    const result = await request('/api/health');
    assert.equal(result.status, 200);
    assert.equal(result.body.data.database, 'connected');
    assert.equal(result.headers.get('x-powered-by'), null);
  });

  it('registers a traveler atomically and stores hashes rather than secrets', async () => {
    const mail = email();
    const result = await register({ email: `  ${mail.toUpperCase()}  `, name: '  أحمد مسافر  ' });
    assert.equal(result.status, 201);
    primaryUser = result.body.data.user;
    primaryCookie = result.cookie;
    assert.match(primaryUser.id, /^[0-9a-f-]{36}$/);
    assert.equal(primaryUser.email, mail);
    assert.equal(primaryUser.name, 'أحمد مسافر');
    assert.equal(primaryUser.role, 'traveler');
    assert.equal(primaryUser.emailVerified, false);
    assert.equal(JSON.stringify(result.body).includes(password), false);
    assert.equal('password_hash' in primaryUser, false);
    const setCookie = result.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Lax/);
    assert.match(setCookie, /Path=\//);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    const records = await pool.query(`SELECT a.password_hash, p.currency, s.token_hash
      FROM travora.users u JOIN travora.auth_identities a ON a.user_id=u.id
      JOIN travora.user_preferences p ON p.user_id=u.id JOIN travora.sessions s ON s.user_id=u.id
      WHERE u.id=$1`, [primaryUser.id]);
    assert.equal(records.rowCount, 1);
    assert.match(records.rows[0].password_hash, /^\$argon2id\$/);
    assert.notEqual(records.rows[0].password_hash, password);
    assert.equal(records.rows[0].currency, 'EGP');
    assert.deepEqual(records.rows[0].token_hash,
      createHash('sha256').update(primaryCookie.split('=')[1]).digest());
  });

  it('me returns only the authenticated account', async () => {
    const result = await request('/api/auth/me', { cookie: primaryCookie });
    assert.equal(result.status, 200);
    assert.equal(result.body.data.user.id, primaryUser.id);
    assert.equal(result.headers.get('cache-control'), 'no-store');
  });

  it('sessions survive a new application instance', async () => {
    const restarted = await serve();
    const result = await request('/api/auth/me', { cookie: primaryCookie, base: restarted });
    assert.equal(result.status, 200);
    assert.equal(result.body.data.user.id, primaryUser.id);
  });

  it('duplicate normalized email returns 409 without partial rows', async () => {
    const result = await register({ email: primaryUser.email.toUpperCase() });
    assert.equal(result.status, 409);
    assert.equal(result.body.error.code, 'EMAIL_ALREADY_EXISTS');
    const identities = await pool.query('SELECT count(*)::int AS n FROM travora.auth_identities WHERE user_id=$1', [primaryUser.id]);
    assert.equal(identities.rows[0].n, 1);
  });

  it('concurrent registrations of one email create exactly one account', async () => {
    const mail = email();
    const results = await Promise.all([register({ email: mail }), register({ email: mail })]);
    assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
    const users = await pool.query('SELECT count(*)::int AS n FROM travora.users WHERE email=$1', [mail]);
    assert.equal(users.rows[0].n, 1);
  });

  it('login rotates the current session and updates last_login_at', async () => {
    const previous = primaryCookie;
    const result = await request('/api/auth/login', { method: 'POST', cookie: previous,
      body: { email: primaryUser.email, password } });
    assert.equal(result.status, 200);
    assert.notEqual(result.cookie, previous);
    primaryCookie = result.cookie;
    assert.equal((await request('/api/auth/me', { cookie: previous })).status, 401);
    assert.equal((await request('/api/auth/me', { cookie: primaryCookie })).status, 200);
    const user = await pool.query('SELECT last_login_at FROM travora.users WHERE id=$1', [primaryUser.id]);
    assert.ok(user.rows[0].last_login_at);
  });

  it('wrong password and unknown email have the same generic 401 response', async () => {
    const wrong = await request('/api/auth/login', { method: 'POST', body: { email: primaryUser.email, password: 'WrongPassword123!' } });
    const unknown = await request('/api/auth/login', { method: 'POST', body: { email: email(), password } });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(wrong.body, unknown.body);
    assert.equal(wrong.headers.get('set-cookie'), null);
  });

  const invalidInputs = [
    ['missing name', { name: '' }], ['invalid email', { email: 'invalid' }],
    ['weak password', { password: 'short' }], ['non-string password', { password: 123 }],
    ['oversized password', { password: 'a'.repeat(129) }], ['control character in name', { name: 'bad\u0000name' }],
  ];
  for (const [label, input] of invalidInputs) {
    it(`rejects ${label} with a validation error`, async () => {
      const result = await register(input);
      assert.equal(result.status, 400);
      assert.equal(result.body.error.code, 'VALIDATION_ERROR');
      assert.equal(result.headers.get('set-cookie'), null);
    });
  }

  it('rejects malformed JSON without exposing parser details', async () => {
    const response = await fetch(`${url}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, 'INVALID_JSON');
  });

  it('limits request size and rejects form submissions', async () => {
    const huge = await register({ name: 'a'.repeat(20000) });
    assert.equal(huge.status, 413);
    const response = await fetch(`${url}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'email=a&password=b' });
    assert.equal(response.status, 415);
    assert.equal((await response.json()).error.code, 'UNSUPPORTED_MEDIA_TYPE');
  });

  it('rejects missing, malformed, and forged session cookies', async () => {
    for (const cookie of [undefined, 'travora_session=invalid', `travora_session=${randomBytes(32).toString('base64url')}`]) {
      const result = await request('/api/auth/me', { cookie });
      assert.equal(result.status, 401);
      assert.equal(result.body.error.code, 'UNAUTHENTICATED');
    }
    assert.equal((await request('/api/auth/logout', { method: 'POST', body: {} })).status, 401);
  });

  it('rejects expired and revoked sessions', async () => {
    for (const mode of ['expired', 'revoked']) {
      const result = await register();
      if (mode === 'expired') {
        await pool.query(`UPDATE travora.sessions SET created_at=now()-interval '2 days',
          last_seen_at=now()-interval '2 days', expires_at=now()-interval '1 second'
          WHERE token_hash=$1`, [createHash('sha256').update(result.cookie.split('=')[1]).digest()]);
      } else {
        await pool.query(`UPDATE travora.sessions SET revoked_at=now()
          WHERE token_hash=$1`, [createHash('sha256').update(result.cookie.split('=')[1]).digest()]);
      }
      assert.equal((await request('/api/auth/me', { cookie: result.cookie })).status, 401);
    }
  });

  it('rejects cross-site requests without invalidating the session', async () => {
    for (const headers of [{ Origin: 'https://untrusted.example' }, { 'Sec-Fetch-Site': 'cross-site' }]) {
      const result = await request('/api/auth/logout', { method: 'POST', body: {}, cookie: primaryCookie, headers });
      assert.equal(result.status, 403);
      assert.equal(result.body.error.code, 'ORIGIN_NOT_ALLOWED');
    }
    assert.equal((await request('/api/auth/me', { cookie: primaryCookie })).status, 200);
  });

  it('production sessions use Secure host-only HttpOnly cookies', async () => {
    const secure = await serve({ secureCookies: true, cookieName: '__Host-travora_session' });
    const result = await register({}, { base: secure });
    assert.equal(result.status, 201);
    const cookie = result.headers.get('set-cookie');
    assert.match(cookie, /^__Host-travora_session=/);
    assert.match(cookie, /; Secure/);
    assert.match(cookie, /; HttpOnly/);
    assert.equal(/Domain=/i.test(cookie), false);
  });

  it('logout clears the cookie and makes the captured session token unusable', async () => {
    const result = await request('/api/auth/logout', { method: 'POST', body: {}, cookie: primaryCookie });
    assert.equal(result.status, 204);
    assert.equal(result.body, null);
    assert.match(result.headers.get('set-cookie'), /^travora_session=;/);
    assert.equal((await request('/api/auth/me', { cookie: primaryCookie })).status, 401);
    const sessions = await pool.query('SELECT revoked_at FROM travora.sessions WHERE token_hash=$1',
      [createHash('sha256').update(primaryCookie.split('=')[1]).digest()]);
    assert.ok(sessions.rows[0].revoked_at);
  });

  it('database outages yield JSON 503 rather than a false healthy response', async () => {
    const failing = { query: async () => { throw Object.assign(new Error('private connection detail'), { code: 'ECONNREFUSED' }); } };
    const base = await serve({}, failing);
    const result = await request('/api/health', { base });
    assert.equal(result.status, 503);
    assert.equal(result.body.error.code, 'DATABASE_UNAVAILABLE');
    assert.equal(JSON.stringify(result.body).includes('private connection detail'), false);
  });

  it('unknown routes return the same JSON error format', async () => {
    const result = await request('/api/does-not-exist');
    assert.equal(result.status, 404);
    assert.equal(result.body.error.code, 'NOT_FOUND');
  });

  it('database setup is repeatable and preserves existing accounts', async () => {
    const beforeCount = (await pool.query('SELECT count(*)::int AS n FROM travora.users')).rows[0].n;
    assert.deepEqual(await installSchema(pool), { applied: false, tables: 107 });
    assert.equal((await pool.query('SELECT count(*)::int AS n FROM travora.users')).rows[0].n, beforeCount);
  });

  // ---- OTP Tests ----
  describe('OTP verification and multi-factor login flows', () => {
    let otpUserId, otpUserEmail, otpCode;

    it('registers user with verifyChannel EMAIL and issues OTP', async () => {
      otpUserEmail = email();
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'مستخدم تحقق',
          email: otpUserEmail,
          password,
          verifyChannel: 'EMAIL',
        },
      });

      assert.equal(res.status, 201);
      assert.ok(res.body.userId);
      assert.ok(res.body.verification);
      assert.equal(res.body.verification.channel, 'EMAIL');
      otpUserId = res.body.userId;
      otpCode = res.body.verification.devCode;
    });

    it('rejects wrong OTP code with 400', async () => {
      const res = await request('/api/auth/register/verify-otp', {
        method: 'POST',
        body: {
          userId: otpUserId,
          channel: 'EMAIL',
          code: '000000',
        },
      });
      assert.equal(res.status, 400);
      assert.equal(res.body.error.code, 'INVALID_OTP');
    });

    it('verifies registration OTP with correct code, sets session cookie and marks user verified', async () => {
      assert.ok(otpCode, 'devCode should be present in development/test');
      const res = await request('/api/auth/register/verify-otp', {
        method: 'POST',
        body: {
          userId: otpUserId,
          channel: 'EMAIL',
          code: otpCode,
        },
      });

      assert.equal(res.status, 200);
      assert.ok(res.cookie);
      assert.equal(res.body.user.is_email_verified, true);
      assert.equal(res.body.user.account_status, 'ACTIVE');

      const me = await request('/api/auth/me', { cookie: res.cookie });
      assert.equal(me.status, 200);
      assert.equal(me.body.data.user.id, otpUserId);
    });

    it('initiates OTP login and verifies to complete session', async () => {
      // Clear cooldown lock before testing login OTP initiation
      await pool.query(
        `UPDATE travora.otp_verifications SET next_resend_at = NOW() - INTERVAL '1 second' WHERE user_id = $1`,
        [otpUserId]
      );

      const initRes = await request('/api/auth/login/initiate', {
        method: 'POST',
        body: {
          identifier: otpUserEmail,
          password,
          channel: 'EMAIL',
        },
      });

      assert.equal(initRes.status, 200);
      assert.ok(initRes.body.verification);
      const loginOtp = initRes.body.verification.devCode;
      assert.ok(loginOtp);

      const verifyRes = await request('/api/auth/login/verify-otp', {
        method: 'POST',
        body: {
          userId: otpUserId,
          channel: 'EMAIL',
          code: loginOtp,
        },
      });

      assert.equal(verifyRes.status, 200);
      assert.ok(verifyRes.cookie);
      assert.equal(verifyRes.body.user.id, otpUserId);

      const me = await request('/api/auth/me', { cookie: verifyRes.cookie });
      assert.equal(me.status, 200);
    });

    it('rejects OTP resend if cooldown is active, and succeeds after cooldown', async () => {
      // First resend immediately -> should be blocked by cooldown (429)
      const earlyResend = await request('/api/auth/otp/resend', {
        method: 'POST',
        body: {
          userId: otpUserId,
          channel: 'EMAIL',
          purpose: 'LOGIN_OTP',
        },
      });
      assert.equal(earlyResend.status, 429);
      assert.equal(earlyResend.body.error.code, 'COOLDOWN_ACTIVE');

      // Fast-forward cooldown in test database
      await pool.query(
        `UPDATE travora.otp_verifications SET next_resend_at = NOW() - INTERVAL '1 second' WHERE user_id = $1`,
        [otpUserId]
      );

      const resendRes = await request('/api/auth/otp/resend', {
        method: 'POST',
        body: {
          userId: otpUserId,
          channel: 'EMAIL',
          purpose: 'LOGIN_OTP',
        },
      });
      assert.equal(resendRes.status, 200);
      assert.ok(resendRes.body.verification);
      assert.ok(resendRes.body.verification.cooldownSeconds >= 60);
    });
  });
});
