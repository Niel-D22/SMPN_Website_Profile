const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const galeriController = require('../controllers/galeriController');
const verifyToken = require('../middlewares/auth');

const uploadFoto = (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload file gagal' });
    next();
  });
};

// Publik bisa lihat foto
router.get('/', galeriController.getGaleri);

// Admin saja — field file FormData harus bernama 'foto'
router.post('/', verifyToken, uploadFoto, galeriController.addGaleri);
router.put('/:id', verifyToken, uploadFoto, galeriController.updateGaleri);
router.delete('/:id', verifyToken, galeriController.deleteGaleri);

module.exports = router;
