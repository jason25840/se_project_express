const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const { NotFoundError } = require("../utils/notFoundError");
const { validateURL } = require("../middlewares/validation");

const signinValidationSchema = {
  body: Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email addresss",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
};

const signupValidationSchema = {
  body: Joi.object({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email addresss",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar is required",
      "string.uri": "Avatar must be a valid URL",
    }),
  }),
};

router.post("/signin", celebrate(signinValidationSchema), login);
router.post("/signup", celebrate(signupValidationSchema), createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("resource not found"));
});

module.exports = router;
