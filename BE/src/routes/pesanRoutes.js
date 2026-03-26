const express = require('express');
const router = express.Router();
const pesanController = require('../controllers/pesanController');
const verifyToken = require('../middlewares/auth');

// Publik bisa kirim pesan
router.post('/', pesanController.kirimPesan);

// Admin saja yang bisa kelola
router.get('/', verifyToken, pesanController.getSemuaPesan);
router.delete('/:id', verifyToken, pesanController.hapusPesan);
router.get('/:id/read', pesanController.tandaiDibaca);

module.exports = router;
