const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const {
  createItem,
  getItems,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.get("/:itemId", celebrate(validateId), getItem);
router.post("/", celebrate(validateClothingItem), createItem);
router.delete("/:itemId", celebrate(validateId), deleteItem);
router.put("/:itemId/likes", celebrate(validateId), likeItem);
router.delete("/:itemId/likes", celebrate(validateId), dislikeItem);

module.exports = router;
