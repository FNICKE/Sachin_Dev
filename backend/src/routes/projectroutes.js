const express = require('express');
const { getAllProjects, getBySlug, getById, createProject, updateProject, deleteProject } = require('../controllers/projectcontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware');
const router = express.Router();

router.get('/', getAllProjects);
router.get('/id/:id', protect, admin, getById);
router.get('/:slug', getBySlug);
router.post('/', protect, admin, upload.single('thumbnail'), createProject);
router.put('/:id', protect, admin, upload.single('thumbnail'), updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
