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
    const leads = await Lead.find().populate("property");
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
