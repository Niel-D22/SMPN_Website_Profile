// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/auth'); // Pastikan ini mengarah ke file auth.js kamu

// Endpoint: GET /api/dashboard/stats
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
