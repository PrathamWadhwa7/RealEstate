const Property = require("../models/Property");
const {cloudinary} = require("../utils/cloudinary");

exports.createProperty = async (req, res) => {
  try {
    const images = (req.files || []).map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const property = new Property({ 
      ...req.body, 
      images,
      postedBy: req.user.id 
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("area postedBy");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("area postedBy");
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteImageFromProperty = async (req, res) => {
  const { id, publicId } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    const imageToDelete = property.images.find(img =>
      img.public_id.endsWith(publicId)
    );

    if (!imageToDelete) {
      return res.status(404).json({ error: "Image not found in property" });
    }

    await cloudinary.uploader.destroy(imageToDelete.public_id);

    await Property.findByIdAndUpdate(
      id,
      { $pull: { images: { public_id: imageToDelete.public_id } } },
      { new: true }
    );

    const updated = await Property.findById(id);
    res.json({ message: "Image deleted successfully", property: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
