const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    registrationOpen: {
      type: Boolean,
      default: false,
    },

    registrationBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    registrationOpenedAt: {
      type: Date,
      default: null,
    },

    registrationClosedAt: {
      type: Date,
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SystemSettings ||
  mongoose.model(
    "SystemSettings",
    systemSettingsSchema
  );