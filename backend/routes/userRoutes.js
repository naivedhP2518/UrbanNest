const express = require('express');
const { getAgents, getAgentById, getStats, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/stats', getStats);
router.get('/agents', getAgents);
router.get('/agents/:id', getAgentById);

module.exports = router;
