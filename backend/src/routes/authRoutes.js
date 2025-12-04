const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../utils/validators');

// POST /api/auth/register
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

// POST /api/auth/logout
router.post('/logout', auth, authController.logout);

// GET /api/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;
