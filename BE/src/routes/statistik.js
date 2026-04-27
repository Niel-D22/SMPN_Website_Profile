// routes/statistik.js
const express = require('express');
const router = express.Router();
const { getStatistik } = require('../controllers/statistikController');

router.get('/statistik', getStatistik);

module.exports = router;
