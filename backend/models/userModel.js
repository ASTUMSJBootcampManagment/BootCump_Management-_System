const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,

      enum: [
        "pending",
        "approved",
        "rejected",
      ],

      default: "pending",
    },

    fullname: {
      type: String,
      trim: true,
      default: "",
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,

      enum: [
        "Admin",
        "Mentor",
        "Student",
      ],

      default: "Student",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      default: "",
    },

    verificationCodeValidation: {
      type: Number,
      select: false,
    },

    forgotPasswordCode: {
      type: String,
      select: false,
    },

    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    githubAccount: {
      type: String,
      default: "",
    },

    leetcodeAccount: {
      type: String,
      default: "",
    },

    codeforcesAccount: {
      type: String,
      default: "",
    },

    telegramUsername: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.user ||
  mongoose.model("user", userSchema);