const router = require("express").Router();
const { getUsers, getUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", getUsers);
router.get("/:userId", getUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfile);

module.exports = router;
