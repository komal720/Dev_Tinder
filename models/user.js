
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },

    photoUrl: {
      type: String,
      default: "https://placehold.co/200x200",
    },

    about: {
      type: String,
      default: "This is my default profile",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ================= GENERATE JWT =================

userSchema.methods.getJWT = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET || "DEV#@!infw%$87",
    { expiresIn: "7d" }
  );
};

// ================= VALIDATE PASSWORD =================

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("User", userSchema);
