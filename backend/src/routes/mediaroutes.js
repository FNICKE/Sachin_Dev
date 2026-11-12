const express = require('express');
const { getUploadedImages, getStorageUsage } = require('../controllers/mediacontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/uploads', protect, admin, getUploadedImages);
router.get('/usage', protect, admin, getStorageUsage);

module.exports = router;
