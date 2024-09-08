const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('the "imageUrl" field must be a valid URL');
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid URL',
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The "name" field must be at least 2 characters long',
      "string.max": 'The "name" field must be at most 30 characters long',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "String.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateToken = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer [a-fA-F0-9]{24}$/)
        .messages({
          "string.empty": 'The "authorization" header must be provided',
          "string.pattern.base":
            'The "authorization" header must be in the format: Bearer <24-character token>',
        }),
    })
    .unknown(true),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "id" field must be filled in',
      "string.hex": 'The "id" field must be a valid hex string',
      "string.length": 'The "id" field must be 24 characters long',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  validateLogin,
  validateToken,
  validateId,
};
