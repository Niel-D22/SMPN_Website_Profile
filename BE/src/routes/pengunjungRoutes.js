const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  recordVisit,
  getStats7Hari,
  getStatsBulanIni,
} = require('../controllers/pengunjungController');

router.post('/record', recordVisit); // public — dipanggil FE
router.get('/7hari', verifyToken, getStats7Hari); // admin only
router.get('/bulanini', verifyToken, getStatsBulanIni); // admin only

module.exports = router;
