const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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
    },

    hasConstantInternet: {
      type: Boolean,
      default: false,
    },

    hasPersonalLaptop: {
      type: Boolean,
      default: false,
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

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    temporaryPasswordExpiresAt: {
      type: Date,
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

/*
|--------------------------------------------------------------------------
| Hash password before saving
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.user || mongoose.model("user", userSchema);