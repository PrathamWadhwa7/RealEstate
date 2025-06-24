const Area = require("../models/Area");
const { cloudinary } = require("../utils/cloudinary");

// Helper to map uploaded files
const mapImages = (files) => files.map(file => ({
  url: file.path,
  public_id: file.filename
}));

exports.createArea = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Parse highlights and subAreas
    let highlights, subAreas;
    try {
      highlights = req.body.highlights ? JSON.parse(req.body.highlights) : {};
      subAreas = req.body.subAreas ? JSON.parse(req.body.subAreas) : [];
    } catch (e) {
      return res.status(400).json({ error: 'Invalid highlights or subAreas format' });
    }

    // Process images
    const images = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || [];

    // Create new area
    const area = new Area({
      name: req.body.name,
      description: req.body.description,
      images,
      highlights,
      subAreas
    });

    await area.save();
    res.status(201).json(area);
  } catch (error) {
    console.error('Error creating area:', error);
    res.status(500).json({ error: 'Server error creating area' });
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
    let updateData = { ...req.body };
    
    // Handle images from form data
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      
      // Merge with existing images if they were sent
      if (req.body.existingImages) {
        const existingImages = JSON.parse(req.body.existingImages);
        updateData.images = [...existingImages, ...newImages];
      } else {
        updateData.images = newImages;
      }
    } else if (req.body.existingImages) {
      // Only existing images were provided
      updateData.images = JSON.parse(req.body.existingImages);
    }

    // Parse stringified fields
    if (req.body.highlights) {
      updateData.highlights = JSON.parse(req.body.highlights);
    }
    
    if (req.body.subAreas) {
      updateData.subAreas = JSON.parse(req.body.subAreas);
    }

    const area = await Area.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(area);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ 
      error: err.message,
      details: err.errors 
    });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ error: "Area not found" });

    // Delete all area and subArea images from Cloudinary
    for (const img of area.images || []) {
      if(!img.public_id) break;
      await cloudinary.uploader.destroy(img.public_id);
    }
    for (const sub of area.subAreas || []) {
      for (const img of sub.images || []) {
        if(!img.public_id) break;
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Area.findByIdAndDelete(req.params.id);
    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add SubArea to Area
exports.addSubArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.areaId);
    if (!area) return res.status(404).json({ error: "Area not found" });

    const subArea = req.body;
    if (req.files?.length) {
      subArea.images = mapImages(req.files);
    }

    area.subAreas.push(subArea);
    await area.save();
    res.json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Area/SubArea Image
exports.deleteAreaImage = async (req, res) => {
  const { areaId, publicId } = req.params;

  try {
    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }

    // Find full image object by matching partial public_id
    const imageToDelete = area.images.find(img =>
      img.public_id.endsWith(publicId)
    );

    if (!imageToDelete) {
      return res.status(404).json({ error: "Image not found in Area" });
    }

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id);

    // 2. Remove from DB
    area.images = area.images.filter(
      img => img.public_id !== imageToDelete.public_id
    );

    await area.save();

    res.json({
      message: "Image deleted from Area successfully",
      images: area.images
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteSubAreaImage = async (req, res) => {
  const { areaId, subAreaIndex, publicId } = req.params;

  try {
    const area = await Area.findById(areaId);
    if (!area || !area.subAreas[subAreaIndex]) {
      return res.status(404).json({ error: "SubArea not found" });
    }

    const subArea = area.subAreas[subAreaIndex];

    // Find full image object using endsWith match
    const imageToDelete = subArea.images.find(img =>
      img.public_id.endsWith(publicId)
    );

    if (!imageToDelete) {
      return res.status(404).json({ error: "Image not found in subArea" });
    }

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id);

    // 2. Remove from images array
    subArea.images = subArea.images.filter(
      img => img.public_id !== imageToDelete.public_id
    );

    await area.save();

    res.json({
      message: "Image deleted from subArea successfully",
      subArea
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

