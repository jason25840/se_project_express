const router = require("express").Router();
const { getUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", auth, getCurrentUser);
router.get("/:userId", auth, getUser);

module.exports = router;
