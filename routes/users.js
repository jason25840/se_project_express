const router = require("express").Router();
const { getUsers, getUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { updateProfile } = require("../controllers/users");

router.get("/", auth, getUsers);
router.get("/:userId", auth, getUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfile);

module.exports = router;
