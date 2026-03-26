const express = require('express');
const router = express.Router();
const galeriController = require('../controllers/galeriController');
const verifyToken = require('../middlewares/auth');

// Publik bisa lihat foto
router.get('/', galeriController.getGaleri);

// Admin saja yang bisa kelola
router.post('/', verifyToken, galeriController.addGaleri);
router.put('/:id', verifyToken, galeriController.updateGaleri);
router.delete('/:id', verifyToken, galeriController.deleteGaleri);

module.exports = router;
