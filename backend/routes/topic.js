const express = require('express');
const router = express.Router();
const { initializeTopic } = require('../controllers/topicController');

// POST /api/topic/initialize — called when user creates a new assistant
router.post('/initialize', initializeTopic);

module.exports = router;