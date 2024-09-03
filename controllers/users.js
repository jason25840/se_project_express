const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ERROR_MESSAGES } = require("../utils/errors");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/custom-errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
    }

    next(err);
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
       return next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
     }

      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
      }

      next(err);
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
