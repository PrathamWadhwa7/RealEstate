const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const propertyController = require("../controllers/propertyController");

router.post("/", auth, propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", auth, propertyController.updateProperty);
router.delete("/:id", auth, propertyController.deleteProperty);

module.exports = router;
