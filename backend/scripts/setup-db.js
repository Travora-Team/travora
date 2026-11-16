const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { loadConfig } = require('../src/config/env');
const { createPool, assertAuthSchema } = require('../src/config/db');
const schemaPath = path.resolve(__dirname, '../database/schema.sql');
async function installSchema(pool) {
  const sql = await readFile(schemaPath, 'utf8');
  const expected = [...sql.matchAll(/^CREATE TABLE\s+(\w+)/gm)].map((match) => match[1]);
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('travora-schema-v1'))");
    const existing = await client.query("SELECT 1 FROM pg_namespace WHERE nspname = 'travora'");
    if (existing.rowCount) {
      const present = await client.query(`SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'travora' AND table_name = ANY($1::text[])`, [expected]);
      if (present.rowCount !== expected.length) throw new Error('Existing travora schema is incomplete. Prepare a migration; no tables were changed.');
      await assertAuthSchema(client);
      return { applied: false, tables: present.rowCount };
    }
    // The supplied SQL wraps installation in a transaction; failure rolls back the new schema.
    try { await client.query(sql); }
    catch (error) { await client.query('ROLLBACK').catch(() => {}); throw error; }
    await assertAuthSchema(client);
    return { applied: true, tables: expected.length };
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('travora-schema-v1'))").catch(() => {});
    client.release();
  }
}
if (require.main === module) {
  const pool = createPool(loadConfig());
  installSchema(pool)
    .then((result) => console.log(`${result.applied ? 'Installed' : 'Verified existing'} travora schema (${result.tables} tables). Public tables were preserved.`))
    .catch((error) => { console.error('Database setup failed', { code: error.code, message: error.message }); process.exitCode = 1; })
    .finally(() => pool.end());
}
module.exports = { installSchema };
