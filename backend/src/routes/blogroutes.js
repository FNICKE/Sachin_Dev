const express = require('express');
const { getAllBlogs, getBySlug, getById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogcontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

router.get('/', getAllBlogs);
router.get('/id/:id', protect, admin, getById);
router.get('/:slug', getBySlug);
router.post('/', protect, admin, upload.single('cover'), createBlog);
router.put('/:id', protect, admin, upload.single('cover'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
