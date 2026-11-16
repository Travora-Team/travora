const argon2 = require('argon2');
const { randomBytes } = require('node:crypto');

function hashPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
}
// Unknown emails still perform password verification to reduce timing differences.
const dummyHash = hashPassword(randomBytes(32).toString('base64url'));
async function verifyPassword(hash, password) {
  return argon2.verify(hash || await dummyHash, password);
}
module.exports = { hashPassword, verifyPassword, comparePassword: verifyPassword, passwordReady: dummyHash };
