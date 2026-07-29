import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    linkID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    ipAddress: String,

    country: String,

    city: String,

    browser: String,

    operatingSystem: String,

    device: String,

    referrer: String,

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
