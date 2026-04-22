// file: routes/beritaRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { berita: upload } = require('../config/claudinaryConfig');
const beritaController = require('../controllers/beritaController');

// ===== PUBLIC =====
router.get('/public', beritaController.getBeritaPublic);

// ===== ADMIN =====
router.get('/admin', verifyToken, beritaController.getBeritaAdmin);

// ===== BY ID (WAJIB PALING BAWAH DI ANTARA GET YANG LAIN) =====
router.get('/:id', beritaController.getBeritaById);

// ===== POST, PUT, DELETE =====
router.post('/', verifyToken, upload.single('gambar'), beritaController.addBerita);
router.put('/:id', verifyToken, upload.single('gambar'), beritaController.updateBerita);
router.delete('/:id', verifyToken, beritaController.deleteBerita);

module.exports = router;
