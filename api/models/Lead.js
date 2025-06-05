const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  message: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property"},
  Area: { type: mongoose.Schema.Types.ObjectId, ref: "Area"},
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);
