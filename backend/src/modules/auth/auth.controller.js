const {
  readToken,
  setSessionCookie,
  clearSessionCookie,
} = require('../../shared/utils/session');
const defaultAuthService = require('./auth.service')();
const { loadConfig } = require('../../shared/config/env');

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || null;
}

function createAuthController(service = defaultAuthService, config = loadConfig()) {
  return {
    register: async (req, res, next) => {
      try {
        const input = req.authInput || req.body;
        const ipAddress = getClientIp(req);
        const deviceLabel = req.get('User-Agent');
        const previousToken = readToken(req, config);

        const result = await service.register(input, deviceLabel, previousToken, ipAddress);

        if (result.session) {
          setSessionCookie(res, result.session, config);
        }

        return res.status(201).json({
          status: 'success',
          data: { user: result.user },
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },

    verifyRegistration: async (req, res, next) => {
      try {
        const { userId, channel = 'EMAIL', code } = req.body;
        const deviceLabel = req.get('User-Agent');
        const previousToken = readToken(req, config);

        const result = await service.verifyAccountRegistration({
          userId,
          channel,
          code,
          deviceLabel,
          previousToken,
        });

        if (result.session) {
          setSessionCookie(res, result.session, config);
        }

        return res.status(200).json({
          status: 'success',
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },

    initiateLogin: async (req, res, next) => {
      try {
        const { identifier, password, channel = 'EMAIL' } = req.authInput || req.body;
        const ipAddress = getClientIp(req);

        const result = await service.initiateLoginWithOTP({
          identifier,
          password,
          channel,
          ipAddress,
        });

        return res.status(200).json({
          status: 'success',
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },

    verifyLogin: async (req, res, next) => {
      try {
        const { userId, channel = 'EMAIL', code } = req.body;
        const deviceLabel = req.get('User-Agent');
        const previousToken = readToken(req, config);

        const result = await service.completeLoginWithOTP({
          userId,
          channel,
          code,
          deviceLabel,
          previousToken,
        });

        if (result.session) {
          setSessionCookie(res, result.session, config);
        }

        return res.status(200).json({
          status: 'success',
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },

    resendOTP: async (req, res, next) => {
      try {
        const { userId, channel, purpose } = req.body;
        const ipAddress = getClientIp(req);

        const result = await service.resendOTP({
          userId,
          channel,
          purpose,
          ipAddress,
        });

        return res.status(200).json({
          status: 'success',
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },

    login: async (req, res, next) => {
      try {
        const input = req.authInput || req.body;
        const deviceLabel = req.get('User-Agent');
        const previousToken = readToken(req, config);

        const result = await service.login(input, deviceLabel, previousToken);
        setSessionCookie(res, result.session, config);

        return res.status(200).json({
          status: 'success',
          data: { user: result.user },
        });
      } catch (error) {
        return next(error);
      }
    },

    me: (req, res) => {
      res.json({
        status: 'success',
        data: { user: req.auth.user },
      });
    },

    logout: async (req, res, next) => {
      try {
        await service.logout(req.auth);
        clearSessionCookie(res, config);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
}

const defaultController = createAuthController();

module.exports = createAuthController;
module.exports.createAuthController = createAuthController;
module.exports.register = defaultController.register;
module.exports.verifyRegistration = defaultController.verifyRegistration;
module.exports.initiateLogin = defaultController.initiateLogin;
module.exports.verifyLogin = defaultController.verifyLogin;
module.exports.resendOTP = defaultController.resendOTP;
module.exports.login = defaultController.login;
module.exports.me = defaultController.me;
module.exports.logout = defaultController.logout;
