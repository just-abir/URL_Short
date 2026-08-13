const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    linkID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    browser: {
      type: String,
      default: "Unknown",
    },

    operatingSystem: {
      type: String,
      default: "Unknown",
    },

    device: {
      type: String,
      default: "Desktop",
    },

    country: {
      type: String,
      default: "Unknown",
    },

    city: {
      type: String,
      default: "Unknown",
    },

    referrer: {
      type: String,
      default: "Direct",
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

const clickModel = mongoose.model("Click", clickSchema);
module.exports = clickModel;
