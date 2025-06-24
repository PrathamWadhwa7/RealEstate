const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String
}, { _id: false });

const subAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: [imageSchema],
  highlights: {
    roads: String,
    metroAccess: String,
    safetyRating: Number,
    greenZones: Boolean
  }
});

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: [imageSchema],
  highlights: {
    totalPopulation: Number,
    averagePricePerSqft: Number,
    majorAttractions: [String],
    hasMetroConnectivity: Boolean
  },
  subAreas: [subAreaSchema]
});

module.exports = mongoose.model("Area", areaSchema);
