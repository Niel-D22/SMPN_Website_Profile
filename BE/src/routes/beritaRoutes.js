const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/beritaController');
const verifyToken = require('../middlewares/auth'); // Import satpam di sini

// 1. PUBLIC (Siapa saja bisa lihat daftar berita)
// Tidak pakai verifyToken
router.get('/public', beritaController.getBeritaPublic); // Untuk pengunjung

// 2. ADMIN (Hanya admin yang bisa lihat semua berita)
router.get('/admin', verifyToken, beritaController.getBeritaAdmin); // Untuk tabel admin

// 3. PUBLIC (Siapa saja bisa lihat detail satu berita)
router.get('/:id', beritaController.getBeritaById);

// 4. ADMIN (Hanya admin yang bisa tambah berita)
router.post('/', verifyToken, beritaController.addBerita);

// 5. edit berita (ADMIN only)
router.put('/:id', verifyToken, beritaController.updateBerita);

// 6. hapus berita (ADMIN only)
router.delete('/:id', verifyToken, beritaController.deleteBerita);

module.exports = router;
