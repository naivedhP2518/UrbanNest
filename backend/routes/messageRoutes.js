const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/messageController');

router.get('/:propertyId/:userId', getChatHistory);

module.exports = router;
