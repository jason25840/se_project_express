const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data provided",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "An error has occurred on the server",
  VALIDATION_ERROR: "Validation failed",
  INVALID_URL: "Invalid image URL",
  INVALID_ITEM_ID: "Invalid itemId",
};

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
};
