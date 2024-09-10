const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateURL } = require("../middlewares/validation");

const updateProfileValidationSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).optional().messages({
      "string.min": 'The "name" field must be at least 2 characters long',
      "string.max": 'The "name" field must be at most 30 characters long',
    }),
    avatar: Joi.string().optional().custom(validateURL).messages({
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfileValidationSchema, updateProfile);

module.exports = router;
