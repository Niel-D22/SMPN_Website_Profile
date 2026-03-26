const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

// Jalur untuk Login: http://localhost:3000/api/auth/login
router.post('/', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/update-profile', verifyToken, authController.updateProfile);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
