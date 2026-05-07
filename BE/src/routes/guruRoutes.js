const express = require('express');
const router = express.Router();

const guruController = require('../controllers/guruController');
const verifyToken = require('../middlewares/auth');

// ================= PUBLIC =================

// Publik bisa lihat daftar guru
router.get('/', guruController.getAllGuru);

// ================= ADMIN =================

// Tambah guru
router.post('/', verifyToken, guruController.addGuru);

// Update guru
router.put('/:id', verifyToken, guruController.updateGuru);

// Nonaktifkan guru
router.put('/:id/nonaktif', verifyToken, guruController.nonaktifkanGuru);

// Aktifkan kembali guru
router.put('/:id/aktifkan', verifyToken, guruController.aktifkanGuru);

// Hapus permanen guru
router.delete('/:id', verifyToken, guruController.deleteGuru);

module.exports = router;
