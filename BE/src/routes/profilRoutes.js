const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');
const verifyToken = require('../middlewares/auth');
const { kurikulum, akreditasi } = require('../config/cloudinary');
const { uploadAkreditasi } = require('../controllers/profilController');

// Public bisa lihat profil
router.get('/', profilController.getProfil);

// Hanya Admin yang bisa edit profil
router.put('/', verifyToken, profilController.updateProfil);

// Upload kurikulum — khusus admin
router.post('/kurikulum', verifyToken, kurikulum.single('file'), profilController.uploadKurikulum);
router.post('/akreditasi', verifyToken, akreditasi.single('file'), uploadAkreditasi);

module.exports = router;
