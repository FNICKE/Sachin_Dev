const express = require('express');
const { getUploadedImages } = require('../controllers/mediacontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/uploads', protect, admin, getUploadedImages);

module.exports = router;
