const { celebrate } = require("celebrate");

const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const NotFoundError = require("../utils/notFoundError");
const { validateLogin, validateUser } = require("../middlewares/validation");

router.post("/signin", celebrate({ body: validateLogin }), login);
router.post("/signup", celebrate({ body: validateUser }), createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("resource not found"));
});

module.exports = router;
