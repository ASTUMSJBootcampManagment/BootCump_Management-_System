const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { _id: true }
);

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
    },

    track: {
      type: String,
      default: "Full-Stack MERN Development",
      trim: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Active",
        "Completed",
      ],
      default: "Upcoming",
    },

    registrationEnabled: {
      type: Boolean,
      default: false,
    },

    registrationOpenedAt: {
      type: Date,
      default: null,
    },

    registrationClosedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    mentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    groups: {
      type: [groupSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Batch ||
  mongoose.model("Batch", batchSchema);
