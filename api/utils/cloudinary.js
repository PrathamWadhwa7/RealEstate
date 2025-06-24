const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name:'dovkxkufe',
  api_key:'497649511978923',
  api_secret:'vaGcu6v_szqzD4VBUgYbzuRQNy4',
  secure: true
});

// Set up storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    timeout: 60000 // 1 minute timeout
  }
});

module.exports = {
  cloudinary,
  storage
};