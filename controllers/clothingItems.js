const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req.body);
  console.log("POST request to create item");

  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => {
      console.log(item);
      res.status(201).json(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Validation failed", err });
      }
      return res.status(500).send(err);
    });
};

const getItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return res.status(400).send({ message: "Invalid itemId" });
      }
      return res.status(500).send({ message: "Error from getItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl, owner } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (weather) updateFields.weather = weather;
  if (imageUrl) {
    if (!validator.isURL(imageUrl)) {
      return res.status(400).send({ message: "Invalid image URL" });
    }
    updateFields.imageUrl = imageUrl;
  }
  if (owner) updateFields.owner = owner;

  console.log("PUT request to update item");
  console.log("itemId:", itemId);
  console.log("updateFields:", updateFields);

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updateFields },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return res.status(400).send({ message: "Invalid itemId" });
      }
      return res.status(500).send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return res.status(400).send({ message: "Invalid itemId" });
      }
      return res.status(500).send({ message: "Error from deleteItem", err });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem, getItem };
