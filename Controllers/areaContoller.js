const Area = require("../models/Area");

exports.createArea = async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    res.json(area);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArea = async (req, res) => {
  try {
    const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedArea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
