const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const auth = require("../middleware/auth");

router.post("/",auth, leadController.createLead);
router.post("/",auth, leadController.createLead);
router.get("/", leadController.getAllLeads);
router.get("/:id", leadController.getLeadById);
router.delete("/:id",auth, leadController.deleteLead);

module.exports = router;
