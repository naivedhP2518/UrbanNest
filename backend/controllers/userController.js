const User = require('../models/User');
const Property = require('../models/Property');

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

// @desc    Get single agent by ID
// @route   GET /api/users/agents/:id
// @access  Public
const getAgentById = async (req, res) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'agent' }).select('-password');
    if (agent) {
      res.json({ success: true, data: agent });
    } else {
      res.status(404).json({ success: false, message: 'Agent not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get global stats for home page
// @route   GET /api/users/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const properties = await Property.countDocuments();
    const agents = await User.countDocuments({ role: 'agent' });
    const clients = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      data: { properties, agents, clients }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
      user.happyClients = req.body.happyClients !== undefined ? req.body.happyClients : user.happyClients;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      
      if (req.body.role) {
        user.role = req.body.role;
      }
      if (req.body.profileCompleted) {
        user.profileCompleted = req.body.profileCompleted;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      // Save user (pre-save hook will hash password if it changed)
      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          experience: updatedUser.experience,
          happyClients: updatedUser.happyClients,
          phone: updatedUser.phone,
          profileCompleted: updatedUser.profileCompleted
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAgents,
  getAgentById,
  getStats,
  getUserProfile,
  updateUserProfile,
};
