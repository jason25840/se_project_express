const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/clothingItems", clothingItemRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Not found" });
});

module.exports = router;
