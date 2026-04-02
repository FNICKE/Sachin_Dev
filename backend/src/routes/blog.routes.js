const express = require('express');
const { getAllBlogs, getBySlug, getById, createBlog, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.get('/', getAllBlogs);
router.get('/id/:id', protect, admin, getById);
router.get('/:slug', getBySlug);
router.post('/', protect, admin, upload.single('cover'), createBlog);
router.put('/:id', protect, admin, upload.single('cover'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
