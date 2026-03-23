const User = require('../models/User');

// @desc    Get all agents
// @route   GET /api/users/agents
// @access  Public
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json({ success: true, count: agents.length, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAgents,
};
