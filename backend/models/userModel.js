const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["Admin", "Mentor", "Student"],
      default: "Student",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    temporaryPasswordExpiresAt: {
      type: Date,
      default: null,
    },

    universityId: {
      type: String,
      trim: true,
      default: "",
    },

    codeforcesAccount: {
      type: String,
      trim: true,
      default: "",
    },

    leetcodeAccount: {
      type: String,
      trim: true,
      default: "",
    },

    githubAccount: {
      type: String,
      trim: true,
      default: "",
    },

    reasonToJoin: {
      type: String,
      default: "",
    },

    telegramUsername: {
      type: String,
      trim: true,
      default: "",
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: undefined,
    },

    hasConstantInternet: {
      type: Boolean,
      default: false,
    },

    hasPersonalLaptop: {
      type: Boolean,
      default: false,
    },

    applicationStatus: {
      type: String,
      enum: [
        "waiting",
        "approved",
        "rejected",
        "withdrawn",
      ],
      default: "waiting",
    },

    appliedBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    assignedBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports =
  mongoose.models.user ||
  mongoose.model("user", userSchema);