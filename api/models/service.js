const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  features: [String],
  price: Number,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("Service", serviceSchema);
module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);
