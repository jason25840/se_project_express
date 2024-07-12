const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  if (!name || !avatar) {
    return res.status(400).send({
      errors: {
        ...(name ? {} : { name: { message: "Path `name` is required." } }),
        ...(avatar
          ? {}
          : { avatar: { message: "Path `avatar` is required." } }),
      },
      _message: "Validation failed",
      name: "ValidationError",
      message: `Validation failed: ${
        name ? "" : "name: Path `name` is required."
      }${!name && !avatar ? ", " : ""}${
        avatar ? "" : "avatar: Path `avatar` is required."
      }`,
    });
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId") {
        return res.status(400).send({ message: "Invalid userId" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid userId" });
      }
      return res.status(500).send(err);
    });
};

module.exports = { getUsers, createUser, getUser };
