const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["apartment", "villa", "plot", "commercial", "other"], required: true },

  highlights: {
    locality: String,
    bedrooms: Number,
    bathrooms: Number,
    areaSize: Number, // in sq ft
    facing: String,
    furnishing: String,
    floor: String,
    amenities: [String],
  },

  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
  price: {
    value: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },

  images: [String], // URLs of property images
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
