const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { updateProfileValidationSchema } = require("../middlewares/validation");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch(
  "/me",
  celebrate({ body: updateProfileValidationSchema }),
  updateProfile
);

module.exports = router;
