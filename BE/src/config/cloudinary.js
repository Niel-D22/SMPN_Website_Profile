const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder, formats = ['jpg', 'jpeg', 'png', 'gif', 'webp']) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sekolah/${folder}`,
      allowed_formats: formats,
      resource_type: 'auto',
    },
  });

// ── Kurikulum ──────────────────────────────────────────────────────────────
const uploadKurikulumToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalname).replace('.', '');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sekolah/kurikulum',
        resource_type: 'raw',
        public_id: `${Date.now()}-kurikulum`,
        format: ext,
        type: 'upload',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// ── Akreditasi ─────────────────────────────────────────────────────────────
const uploadAkreditasiToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalname).replace('.', '');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sekolah/akreditasi',
        resource_type: 'raw',
        public_id: `${Date.now()}-akreditasi`,
        format: ext,
        type: 'upload',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,

  galeri: multer({ storage: createStorage('galeri') }),
  prestasi: multer({ storage: createStorage('prestasi') }),
  berita: multer({ storage: createStorage('berita') }),

  kurikulum: multer({ storage: multer.memoryStorage() }),
  akreditasi: multer({ storage: multer.memoryStorage() }),

  uploadKurikulumToCloudinary,
  uploadAkreditasiToCloudinary,
};
