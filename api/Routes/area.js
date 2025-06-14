const express = require("express");
const router = express.Router();
const areaController = require("../Controllers/areaContoller");
const auth = require('../middleware/auth');

router.post("/",auth, areaController.createArea);
router.get("/", areaController.getAllAreas);
router.get("/:id", areaController.getAreaById);
router.put("/:id",auth, areaController.updateArea);
router.delete("/:id",auth, areaController.deleteArea);

module.exports = router;
