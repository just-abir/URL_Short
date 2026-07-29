const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    title: {
      type: String,
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    qrCode: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    shortUrl: {
      type: String,
      unique: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
    isReachable: {
      type: Boolean,
      default: true,
    },
    lastVisitedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const linkModel = mongoose.model("Link", linkSchema);

module.exports = linkModel;
