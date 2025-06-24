const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const propertyController = require("../Controllers/propertyController");
const { storage } = require("../utils/cloudinary");
const multer = require("multer");

const upload = multer({ storage });

router.post("/", auth, upload.array('images', 10), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", upload.array('images', 10), propertyController.updateProperty);
router.delete("/:id", auth, propertyController.deleteProperty);
router.delete("/:id/images/:publicId", auth, propertyController.deleteImageFromProperty);
router.post("/upload",auth,upload.array('images', 10), async (req, res) => {
  try {
    const images = (req.files || []).map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json({ images });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;