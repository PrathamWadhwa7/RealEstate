const express = require("express");
const router = express.Router();
const serviceController = require("../Controllers/serviceController");
const verifyToken = require("../middleware/auth"); // optional
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

router.post("/", auth, upload.single("image"), serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.put("/:id", auth, upload.single("image"), serviceController.updateService);
router.delete("/:id", auth, serviceController.deleteService);

module.exports = router;
