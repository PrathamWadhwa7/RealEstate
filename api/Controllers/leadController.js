const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("property")
    .populate('property')
    .populate('Area');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getLeadById = async (req, res) => {
  try {
    const leadById = await Lead.findById(req.params.id)
    .populate('property')
    .populate('Area');
    if (!leadById) return res.status(404).json({ error: "Lead not found" });
    res.json(leadById);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};