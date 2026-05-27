const express = require('express');
const { getUploadedImages } = require('../controllers/media.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/uploads', protect, admin, getUploadedImages);

module.exports = router;
