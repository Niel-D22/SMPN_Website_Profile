const express = require('express');
const router = express.Router();
const { galeri: upload } = require('../middlewares/upload'); // ← update destructure
const galeriController = require('../controllers/galeriController');
const verifyToken = require('../middlewares/auth');

const handleUpload = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ message: 'File terlalu besar! Maksimal 10MB.' });
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

router.get('/', galeriController.getGaleri);
router.post('/', verifyToken, handleUpload(upload.single('foto')), galeriController.addGaleri);
router.put('/:id', verifyToken, handleUpload(upload.single('foto')), galeriController.updateGaleri);
router.delete('/:id', verifyToken, galeriController.deleteGaleri);

module.exports = router;
