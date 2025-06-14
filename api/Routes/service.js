const express = require("express");
const router = express.Router();
const serviceController = require("../Controllers/serviceController");
const verifyToken = require("../middleware/auth"); // optional
const auth = require("../middleware/auth");

router.post("/",auth, verifyToken, serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.put("/:id",auth, verifyToken, serviceController.updateService);
router.delete("/:id",auth, verifyToken, serviceController.deleteService);

module.exports = router;
