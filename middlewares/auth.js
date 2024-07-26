const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  if (!token) {
    console.log("No token provided");
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log("Token verification failed", err);
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }

  req.user = payload;
  console.log("Token verified, user:", req.user);

 return next();
};

module.exports = auth;