const express = require('express');
const { login, register, getMe, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
