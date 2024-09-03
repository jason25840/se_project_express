const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { ERROR_MESSAGES } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/custom-errors");

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  if (!token) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};

module.exports = auth;