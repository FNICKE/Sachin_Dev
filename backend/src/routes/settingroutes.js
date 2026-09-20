const express = require('express');
const { getResume, updateResume } = require('../controllers/settingcontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

router.get('/resume', getResume);
router.post('/resume', protect, admin, upload.single('resume'), updateResume);

module.exports = router;
