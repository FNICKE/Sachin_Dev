const express = require('express');
const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialcontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

router.get('/', getTestimonials);
router.get('/all', protect, admin, getAllTestimonials);
router.post('/', protect, admin, upload.single('avatar'), createTestimonial);
router.put('/:id', protect, admin, upload.single('avatar'), updateTestimonial);
router.delete('/:id', protect, admin, deleteTestimonial);

module.exports = router;
