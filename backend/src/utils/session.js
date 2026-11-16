const { createHash, randomBytes } = require('node:crypto');
function hashToken(token) { return createHash('sha256').update(token).digest(); }
function newToken() { return randomBytes(32).toString('base64url'); }
function readToken(req, config) {
  const token = req.cookies[config.cookieName];
  return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
function cookieOptions(config) {
  return { httpOnly: true, secure: config.secureCookies, sameSite: 'lax', path: '/' };
}
function setSessionCookie(res, session, config) {
  res.cookie(config.cookieName, session.token, {
    ...cookieOptions(config), maxAge: config.sessionTtlDays * 24 * 60 * 60 * 1000,
  });
}
async function createSession(poolOrClient, userId, deviceLabel, previousToken, ttlDays = 7) {
  if (previousToken) {
    await poolOrClient.query(
      'UPDATE travora.sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL',
      [hashToken(previousToken)]
    );
  }
  const token = newToken();
  const { rows } = await poolOrClient.query(
    `INSERT INTO travora.sessions (user_id, token_hash, device_label, expires_at)
     VALUES ($1, $2, $3, now() + $4 * interval '1 day') RETURNING expires_at`,
    [userId, hashToken(token), deviceLabel?.slice(0, 160) || null, ttlDays]
  );
  return { token, expiresAt: rows[0].expires_at };
}

function clearSessionCookie(res, config) { res.clearCookie(config.cookieName, cookieOptions(config)); }
module.exports = { hashToken, newToken, readToken, setSessionCookie, clearSessionCookie, createSession };
