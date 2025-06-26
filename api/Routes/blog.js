const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const auth = require('../middleware/auth');
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

router.post("/",upload.single("image"),auth, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", upload.single("image"),auth, blogController.updateBlog);
router.delete("/:id",auth, blogController.deleteBlog);

module.exports = router;
