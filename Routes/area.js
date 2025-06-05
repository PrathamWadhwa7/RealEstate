const express = require("express");
const router = express.Router();
const areaController = require("../Controllers/areaContoller");

router.post("/", areaController.createArea);
router.get("/", areaController.getAllAreas);
router.get("/:id", areaController.getAreaById);
router.put("/:id", areaController.updateArea);
router.delete("/:id", areaController.deleteArea);

module.exports = router;
