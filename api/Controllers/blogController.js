const fs = require("fs");
const Blog = require("../models/Blog");
const { cloudinary } = require("../utils/cloudinary");

// Create
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, meta } = req.body;

    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs',
        transformation: { width: 1200, crop: "limit" },
      });

      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Clean up local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const blog = new Blog({
      title,
      content,
      author,
      image,
      meta: JSON.parse(meta || '{}'),
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author, meta, removeImage } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Remove old image
    if (removeImage === 'true' && blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
      blog.image = null;
    }

    // Upload new image
    if (req.file) {
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs',
        transformation: { width: 1200, crop: "limit" },
      });

      blog.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Update fields
    blog.title = title;
    blog.content = content;
    blog.author = author;
    blog.meta = JSON.parse(meta || '{}');
    blog.updatedAt = new Date();

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
