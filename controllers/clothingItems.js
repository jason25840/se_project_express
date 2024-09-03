const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const { ERROR_MESSAGES } = require("../utils/errors");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/custom-errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!validator.isURL(imageUrl)) {
    return next(new BadRequestError(ERROR_MESSAGES.INVALID_URL));
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        returnnext(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }

      next(err);
    });
};

const getItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }

      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (!item) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
      }
      if (item.owner.toString() !== owner) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      return ClothingItem.findByIdAndRemove(itemId)
        .then((deletedItem) => res.status(200).send(deletedItem))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      next(err);
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
};
