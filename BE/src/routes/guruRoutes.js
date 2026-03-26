const express = require('express');
const router = express.Router();
const guruController = require('../controllers/guruController');
const verifyToken = require('../middlewares/auth');

// Publik bisa lihat daftar guru
router.get('/', guruController.getAllGuru);

// Hanya admin yang bisa kelola data guru
router.post('/', verifyToken, guruController.addGuru);
router.put('/:id', verifyToken, guruController.updateGuru);
router.delete('/:id', verifyToken, guruController.deleteGuru);

module.exports = router;
