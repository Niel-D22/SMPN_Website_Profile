const express = require('express');
const router = express.Router();
const { prestasi: upload } = require('../middlewares/upload'); // ← pakai prestasi
const prestasiController = require('../controllers/prestasiController');
const verifyToken = require('../middlewares/auth');

const handleUpload = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ message: 'File terlalu besar! Maksimal 10MB per foto.' });
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

router.get('/', prestasiController.getPrestasi);
// POST: bisa upload banyak foto sekaligus (maks 10)
router.post(
  '/',
  verifyToken,
  handleUpload(upload.array('foto', 10)),
  prestasiController.addPrestasi
);
// PUT: edit tetap 1 foto
router.put(
  '/:id',
  verifyToken,
  handleUpload(upload.array('foto')),
  prestasiController.updatePrestasi
);
router.delete('/:id', verifyToken, prestasiController.deletePrestasi);

module.exports = router;
