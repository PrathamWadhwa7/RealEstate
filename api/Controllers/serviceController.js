// const Service = require("../models/Service");
// const {cloudinary} = require("../utils/cloudinary")

// // Create
// exports.createService = async (req, res) => {
//   try {
//     const { name, description, features, price } = req.body;

//     let image = null;
//     if (req.file) {
//       image = {
//         url: req.file.path,
//         public_id: req.file.filename
//       };
//     }

//     const service = new Service({ name, description, features, price, image });
//     await service.save();
//     res.status(201).json(service);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Read all
// exports.getAllServices = async (req, res) => {
//   try {
//     const services = await Service.find().sort({ createdAt: -1 });
//     res.json(services);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Read one
// exports.getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ error: "Service not found" });
//     res.json(service);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update
// exports.updateService = async (req, res) => {
//   try {
//     const { name, description, features, price } = req.body;

//     const existing = await Service.findById(req.params.id);
//     if (!existing) return res.status(404).json({ error: "Service not found" });

//     if (req.file && existing.image?.public_id) {
//       // delete old image from cloudinary
//       await cloudinary.uploader.destroy(existing.image.public_id);
//     }

//     const updatedData = {
//       name,
//       description,
//       features,
//       price,
//     };

//     if (req.file) {
//       updatedData.image = {
//         url: req.file.path,
//         public_id: req.file.filename
//       };
//     }

//     const updated = await Service.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true
//     });

//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete
// exports.deleteService = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ error: "Service not found" });

//     if (service.image?.public_id) {
//       await cloudinary.uploader.destroy(service.image.public_id);
//     }

//     await Service.findByIdAndDelete(req.params.id);
//     res.json({ message: "Service deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const Service = require("../models/Service");
const { cloudinary } = require("../utils/cloudinary");

// Create
exports.createService = async (req, res) => {
  try {
    const { name, description, features, price } = req.body;
    
    let image = null;
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'services',
        transformation: { width: 500, height: 500, crop: 'limit' }
      });
      
      image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const service = new Service({ 
      name, 
      description, 
      features: Array.isArray(features) ? features : JSON.parse(features || '[]'), 
      price, 
      image 
    });
    
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateService = async (req, res) => {
  try {
    const { name, description, features, price, removeImage } = req.body;
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Service not found" });

    // Handle image removal if requested
    if (removeImage === 'true' && existing.image?.public_id) {
      await cloudinary.uploader.destroy(existing.image.public_id);
      existing.image = null;
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (existing.image?.public_id) {
        await cloudinary.uploader.destroy(existing.image.public_id);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'services',
        transformation: { width: 500, height: 500, crop: 'limit' }
      });
      
      existing.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Update other fields
    existing.name = name;
    existing.description = description;
    existing.features = Array.isArray(features) ? features : JSON.parse(features || '[]');
    existing.price = price;

    const updated = await existing.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Delete image from Cloudinary if exists
    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};