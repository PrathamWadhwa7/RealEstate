const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  content: { type: String, required: true }, // Markdown-supported
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  shareableLink: String,
 image: {
    url: String,
    public_id: String
  },
  meta: {
    keywords: [String],
    description: String
  }
});

module.exports = mongoose.model("Blog", blogSchema);
