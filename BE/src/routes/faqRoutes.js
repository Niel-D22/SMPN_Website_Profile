const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const verifyToken = require('../middlewares/auth');

// Public: Bisa lihat semua FAQ
router.get('/', faqController.getFaq);

// Admin Only: Tambah, Edit, Hapus
router.post('/', verifyToken, faqController.addFaq);
router.put('/:id', verifyToken, faqController.updateFaq);
router.delete('/:id', verifyToken, faqController.deleteFaq);

module.exports = router;
