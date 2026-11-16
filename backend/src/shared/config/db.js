const { Pool } = require('pg');

function createPool(config) {
  const pool = new Pool({
    connectionString: config.databaseUrl, max: config.poolMax,
    connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000,
    statement_timeout: 10000, application_name: 'travora-backend',
  });
  pool.on('error', (error) => console.error('PostgreSQL connection error', { code: error.code }));
  return pool;
}

async function withTransaction(pool, work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally { client.release(); }
}

async function assertAuthSchema(pool) {
  await pool.query(`SELECT u.id, u.email, u.display_name, u.role, u.status, u.deleted_at,
    u.email_verified_at, u.created_at, u.last_login_at, a.provider, a.password_hash,
    s.token_hash, s.expires_at, s.revoked_at, s.last_seen_at, s.device_label, p.user_id
    FROM travora.users u LEFT JOIN travora.auth_identities a ON a.user_id = u.id
    LEFT JOIN travora.sessions s ON s.user_id = u.id
    LEFT JOIN travora.user_preferences p ON p.user_id = u.id LIMIT 0`);
  const result = await pool.query("SELECT code FROM travora.currencies WHERE code = 'EGP'");
  if (!result.rowCount) throw new Error('The Travora seed currency EGP is missing.');
}

let defaultPool = null;
function getDefaultPool() {
  if (!defaultPool) {
    const { loadConfig } = require('./env');
    defaultPool = createPool(loadConfig());
  }
  return defaultPool;
}

module.exports = {
  createPool,
  withTransaction,
  assertAuthSchema,
  query: (...args) => getDefaultPool().query(...args),
  get pool() { return getDefaultPool(); },
};
