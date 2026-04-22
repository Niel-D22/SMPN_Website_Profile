const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // sesuaikan path

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sekolah/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });

module.exports = {
  galeri: multer({ storage: createStorage('galeri') }),
  prestasi: multer({ storage: createStorage('prestasi') }),
  berita: multer({ storage: createStorage('berita') }),
};
