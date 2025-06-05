// models/Area.js
const mongoose = require("mongoose");

const subAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
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
  highlights: {
    totalPopulation: Number,
    averagePricePerSqft: Number,
    majorAttractions: [String],
    hasMetroConnectivity: Boolean
  },
  subAreas: [subAreaSchema]
});

module.exports = mongoose.model("Area", areaSchema);

