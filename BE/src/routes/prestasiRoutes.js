const express = require('express');
const router = express.Router();
const prestasiController = require('../controllers/prestasiController');
const verifyToken = require('../middlewares/auth');

router.get('/', prestasiController.getPrestasi); // Publik
router.post('/', verifyToken, prestasiController.addPrestasi); // Admin
router.put('/:id', verifyToken, prestasiController.updatePrestasi); // Admin
router.delete('/:id', verifyToken, prestasiController.deletePrestasi); // Admin

module.exports = router;
