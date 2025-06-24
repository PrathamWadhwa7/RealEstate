const express = require("express");
const router = express.Router();
const areaController = require("../Controllers/areaContoller");
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

// Area routes
router.post("/", auth, upload.array("images", 10), areaController.createArea);
router.get("/", areaController.getAllAreas);
router.get("/:id", areaController.getAreaById);
router.put("/:id",  upload.array("images", 10), areaController.updateArea);
router.delete("/:id", areaController.deleteArea);

// SubArea image delete
router.post("/:areaId/subareas", upload.array("images", 10), areaController.addSubArea);

// Delete specific images
router.delete("/:areaId/images/:publicId", areaController.deleteAreaImage);
router.delete("/:areaId/subareas/:subAreaIndex/images/:publicId", areaController.deleteSubAreaImage);

module.exports = router;
