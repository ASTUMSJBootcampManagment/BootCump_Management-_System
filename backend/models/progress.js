const mongoose = require("mongoose");

const progressSchema =
  new mongoose.Schema(
    {
      topic: {
        type: String,
        required: true,
        trim: true,
      },

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
      },

      batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true,
      },

      group: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      status: {
        type: String,
        enum: [
          "NotStarted",
          "InProgress",
          "Completed",
          "NeedsImprovement",
        ],
        default: "NotStarted",
      },

      notes: {
        type: String,
        default: "",
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

progressSchema.index({
  student: 1,
  batch: 1,
  group: 1,
  topic: 1,
});

module.exports =
  mongoose.models.progress ||
  mongoose.model(
    "progress",
    progressSchema
  );
