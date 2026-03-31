const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/:conversationId', getMessages);

module.exports = router;
