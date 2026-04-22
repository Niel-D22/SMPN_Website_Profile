require('dotenv').config();
const cloudinary = require('cloudinary');

console.log('ENV:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'ADA' : 'KOSONG',
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.v2.api
  .ping()
  .then((result) => console.log('✅ OK:', result))
  .catch((err) => console.error('❌ ERROR:', err));
