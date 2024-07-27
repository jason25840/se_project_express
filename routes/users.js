const router = require("express").Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:userId", auth, getUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
