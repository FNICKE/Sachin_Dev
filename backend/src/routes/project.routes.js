const express = require('express');
const { getAllProjects, getBySlug, getById, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.get('/', getAllProjects);
router.get('/id/:id', protect, admin, getById);
router.get('/:slug', getBySlug);
router.post('/', protect, admin, upload.single('thumbnail'), createProject);
router.put('/:id', protect, admin, upload.single('thumbnail'), updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
