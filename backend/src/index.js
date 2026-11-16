const { loadConfig } = require('./config/env');
const { createPool, assertAuthSchema } = require('./config/db');
const { passwordReady } = require('./utils/password');
const createApp = require('./app');

async function start() {
  const config = loadConfig();
  const pool = createPool(config);
  try {
    await assertAuthSchema(pool);
    await passwordReady;
    const server = createApp({ pool, config }).listen(config.port, config.host);
    await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    console.log(`Travora backend is running at http://${config.host}:${config.port}`);
    console.log('PostgreSQL connected; authentication schema is ready.');
    let stopping = false;
    const stop = () => {
      if (stopping) return;
      stopping = true;
      const timer = setTimeout(() => process.exit(1), 10000).unref();
      server.close(async () => { await pool.end(); clearTimeout(timer); });
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
    return { server, pool };
  } catch (error) { await pool.end(); throw error; }
}
if (require.main === module) {
  start().catch((error) => {
    console.error('Backend startup failed', { code: error.code, message: error.message });
    console.error('Check PostgreSQL and DATABASE_URL, then run npm run db:setup.');
    process.exitCode = 1;
  });
}
module.exports = { start };
