const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');
const verifyToken = require('../middlewares/auth');

// Public bisa lihat profil
router.get('/', profilController.getProfil);

// Hanya Admin yang bisa edit profil
router.put('/', verifyToken, profilController.updateProfil);

module.exports = router;
