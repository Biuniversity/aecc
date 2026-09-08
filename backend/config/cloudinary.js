const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists for local fallback
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let upload;

const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_KEY !== 'your_api_key';

if (hasCloudinary) {
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'chamcong_proofs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      }
    });

    upload = multer({ storage: storage });
    console.log('Using Cloudinary for image storage');
  } catch (err) {
    console.warn('Cloudinary init failed, falling back to local disk storage:', err.message);
  }
}

if (!upload) {
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  upload = multer({ 
    storage: localStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
  console.log('Using Local Disk Storage for uploads');
}

module.exports = upload;
