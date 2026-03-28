const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createConversation } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(protect);

router.route('/conversations')
  .get(getConversations)
  .post(createConversation);

router.get('/:conversationId', getMessages);

module.exports = router;
