const express = require('express');
const router = express.Router();
const { chat, resetSession } = require('../controllers/chatController');

// POST /api/chat — send message and get AI reply
router.post('/chat', chat);

// POST /api/reset — clear session
router.post('/reset', resetSession);

module.exports = router;