const User = require("../models/user");
const validator = require("validator");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR, err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  if (!name || !avatar) {
    return res.status(ERROR_CODES.BAD_REQUEST).send({
      errors: {
        ...(name ? {} : { name: { message: "Path `name` is required." } }),
        ...(avatar
          ? {}
          : { avatar: { message: "Path `avatar` is required." } }),
      },
      _message: ERROR_MESSAGES.VALIDATION_FAILED,
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
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.VALIDATION_FAILED, err });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR, err });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error(ERROR_MESSAGES.NOT_FOUND))
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_USER_ID });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR, err });
    });
};

module.exports = { getUsers, createUser, getUser };
