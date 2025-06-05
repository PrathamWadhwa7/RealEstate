const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  content: { type: String, required: true }, // Markdown-supported
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  shareableLink: String,
  views: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ],
  readDuration: String,
  images: [String],
  videos: [String],
  meta: {
    keywords: [String],
    description: String
  }
});

module.exports = mongoose.model("Blog", blogSchema);
