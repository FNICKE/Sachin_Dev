const express = require('express');
const { getAllSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillcontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/', getAllSkills);
router.post('/', protect, admin, createSkill);
router.put('/:id', protect, admin, updateSkill);
router.delete('/:id', protect, admin, deleteSkill);

module.exports = router;
