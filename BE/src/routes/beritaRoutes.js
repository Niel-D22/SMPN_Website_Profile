// file: routes/beritaRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { berita: upload } = require('../config/cloudinary');
const beritaController = require('../controllers/beritaController');

// ===== PUBLIC =====
router.get('/public', beritaController.getBeritaPublic);

// ===== ADMIN =====
router.get('/admin', verifyToken, beritaController.getBeritaAdmin);

// ===== BY ID (WAJIB PALING BAWAH DI ANTARA GET YANG LAIN) =====
router.get('/:id', beritaController.getBeritaById);

// ===== POST, PUT, DELETE =====
router.post('/', verifyToken, upload.single('gambar'), beritaController.addBerita);
router.put(
  '/:id',
  verifyToken,
  (req, res, next) => {
    console.log('PUT berita hit, id:', req.params.id);
    next();
  },
  upload.single('gambar'),
  (req, res, next) => {
    console.log('Setelah upload, file:', req.file);
    next();
  },
  beritaController.updateBerita
);
router.delete('/:id', verifyToken, beritaController.deleteBerita);

module.exports = router;
