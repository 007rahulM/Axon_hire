// backend/middleware/uploadMiddleware.js

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "axon_resumes",
      // 🎯 FIX 1: Force format to 'pdf' so browsers open it correctly
      format: 'pdf', 
      // 🎯 FIX 2: Use 'auto' so Cloudinary processes it as a viewable document, not a raw file
      resource_type: 'auto',
      // Optional: Keep original filename (clean up special characters)
      public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, "_"), 
    };
  },
});

// 3. Initialize Multer
const upload = multer({ storage: storage });

module.exports = upload;