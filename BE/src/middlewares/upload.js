const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folder) => {
  const uploadDir = path.join(__dirname, `../../uploads/${folder}`);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = ['.jpeg', '.jpg', '.jfif', '.png', '.gif', '.webp'];
  const mime = (file.mimetype || '').toLowerCase();
  const extOk = allowedExt.includes(ext);
  const mimeOk = mime.startsWith('image/') || mime === 'application/octet-stream';
  if (extOk && (mimeOk || !mime)) return cb(null, true);
  cb(new Error('Hanya file gambar yang diizinkan!'));
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

// Export dua instance: untuk galeri dan prestasi
module.exports = {
  galeri: multer({ storage: createStorage('galeri'), fileFilter, limits }),
  prestasi: multer({ storage: createStorage('prestasi'), fileFilter, limits }),
  berita: multer({ storage: createStorage('berita'), fileFilter, limits }),
};
