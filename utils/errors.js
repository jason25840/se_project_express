const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data provided",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "An error has occurred on the server",
  VALIDATION_ERROR: "Validation failed",
  INVALID_URL: "Invalid image URL",
  INVALID_ITEM_ID: "Invalid itemId",
  INVALID_CREDENTIALS: "Incorrect email or password",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  FORBIDDEN: "You don't have access to this resource",
  UNAUTHORIZED: "Unauthorized",
};

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
};
