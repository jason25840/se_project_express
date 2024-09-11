const { celebrate } = require("celebrate");

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

router.get("/:itemId", celebrate({ params: validateId }), getItem);
router.post("/", celebrate({ body: validateClothingItem }), createItem);
router.delete("/:itemId", celebrate({ params: validateId }), deleteItem);
router.put("/:itemId/likes", celebrate({ params: validateId }), likeItem);
router.delete("/:itemId/likes", celebrate({ params: validateId }), dislikeItem);

module.exports = router;
