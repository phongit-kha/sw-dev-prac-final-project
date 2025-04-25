const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  method: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rawBody: {
    type: String,
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", LogSchema);
