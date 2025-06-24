const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String, // eg. Residential, Commercial
  type: String,     // eg. Buy, Rent
  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
  highlights: {
    locality: String,
    subLocality: String,
    bedrooms: Number,
    bathrooms: Number,
    area: String, // e.g. "1200 sqft"
    otherFeatures: [String] // e.g. ["Swimming Pool", "Garden"]
  },
  price: {
    amount: Number,
    currency: { type: String, default: "INR" }
  },
  images: [{
    url: String,
    public_id: String
  }],
  postedAt: { type: Date, default: Date.now },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.models.Property || mongoose.model("Property", propertySchema);