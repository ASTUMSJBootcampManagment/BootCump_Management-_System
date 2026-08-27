const mongoose = require("mongoose");

const resourceSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: [
          "Link",
          "Video",
          "Document",
          "Other",
        ],
        default: "Link",
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        default: null,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.Resource ||
  mongoose.model(
    "Resource",
    resourceSchema
  );