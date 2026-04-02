const express = require('express');
const { sendMessage, getAllMessages, updateStatus, deleteMessage } = require('../controllers/contact.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, admin, getAllMessages);
router.patch('/:id/status', protect, admin, updateStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
