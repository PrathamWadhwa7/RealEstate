const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true,    lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "agent", "user"], default: "user" },
}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);