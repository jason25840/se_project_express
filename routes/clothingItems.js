const router = require("express").Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.get("/:itemId", getItem);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId", updateItem);

module.exports = router;
