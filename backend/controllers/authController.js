const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user or admin
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const Model = role === 'admin' ? Admin : User;
    const userExists = await Model.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await Model.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).select('+password');
    let Model = User;

    // If not found in User DB, check Admin DB
    if (!user) {
      user = await Admin.findOne({ email }).select('+password');
      Model = Admin;
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
