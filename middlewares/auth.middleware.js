const JWT = require('jsonwebtoken');
const { statusCodes } = require('../utils/response/response.handler');
const { jwt } = require('../development.config.json');

async function validateAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw { code: statusCodes.STATUS_CODE_UNAUTHORIZED, message: 'Unauthorized Access!' };
    }
    const authToken = req.headers.authorization;
    const authDecode = JWT.verify(authToken, jwt.secret, { ignoreExpiration: true });
    req.userId = authDecode._id;
    req.email = authDecode.email;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  validateAuth,
};
