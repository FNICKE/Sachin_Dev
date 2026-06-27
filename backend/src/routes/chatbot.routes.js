const express = require('express');
const { chat } = require('../controllers/chatbot.controller');
const router = express.Router();

// POST /api/chat  — Public, no auth required
router.post('/', chat);

module.exports = router;
