const express = require('express');
const { getResume, updateResume } = require('../controllers/setting.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.get('/resume', getResume);
router.post('/resume', protect, admin, upload.single('resume'), updateResume);

module.exports = router;
