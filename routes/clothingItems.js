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
const { validateId } = require("../middlewares/validation");

const idValidationSchema = {
  params: Joi.object({
    itemId: Joi.string().hex().length(24).required(),
  }),
};

const createItemValidationSchema = {
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required(),
  }),
};

router.get("/", getItems);

router.use(auth);

router.get("/:itemId", celebrate(idValidationSchema), validateId, getItem);
router.post("/", celebrate(createItemValidationSchema), createItem);
router.delete("/:itemId", celebrate(idValidationSchema), deleteItem);
router.put("/:itemId/likes", celebrate(idValidationSchema), likeItem);
router.delete("/:itemId/likes", celebrate(idValidationSchema), dislikeItem);

module.exports = router;
