const express = require('express');
const router = express.Router();
const ppdbController = require('../controllers/ppdbController');
const verifyToken = require('../middlewares/auth'); // Import Satpam

// PUBLIC: Siapa saja bisa lihat timeline (Tampil di Frontend)
router.get('/timeline', ppdbController.getTimeline);

// ADMIN ONLY: Harus pakai Token (Tampil di Dashboard Admin)
router.post('/timeline', verifyToken, ppdbController.addTimeline);
router.put('/timeline/:id', verifyToken, ppdbController.updateTimeline);
router.delete('/timeline/:id', verifyToken, ppdbController.deleteTimeline);

module.exports = router;
