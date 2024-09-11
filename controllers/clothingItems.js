const validator = require("validator");
const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/badRequestError");
const NotFoundError = require("../utils/notFoundError");
const ForbiddenError = require("../utils/forbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!validator.isURL(imageUrl)) {
    return next(new BadRequestError("Invalid image URL"));
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
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

const getItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Resource not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }

      return next(err);
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
    .orFail(() => new NotFoundError("Resource not found"))
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Resource not found");
      }
      if (item.owner.toString() !== owner) {
        throw new ForbiddenError("You don't have access to this resource");
      }
      return ClothingItem.findByIdAndRemove(itemId)
        .then((deletedItem) => res.status(200).send(deletedItem))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Resource not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Resource not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
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
