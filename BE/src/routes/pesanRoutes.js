const express = require('express');
const router = express.Router();
const pesanController = require('../controllers/pesanController');
const verifyToken = require('../middlewares/auth');

// Publik bisa kirim pesan
router.post('/', pesanController.kirimPesan);

// Admin saja yang bisa kelola
router.get('/', verifyToken, pesanController.getSemuaPesan);
router.delete('/:id', verifyToken, pesanController.hapusPesan);
router.put('/:id/read', pesanController.tandaiDibaca);
router.post('/:id/balas', pesanController.balasPesan);
module.exports = router;
