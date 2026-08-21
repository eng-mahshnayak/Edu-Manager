const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    data: { type: String, required: true }, // base64 image data or JSON
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawing", drawingSchema);