const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { ERROR_MESSAGES } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The Avatar feild is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Avatar must be a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Email must be a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
