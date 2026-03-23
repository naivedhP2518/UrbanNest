const Message = require('../models/Message');

// @desc    Get chat history for a property between two users
// @route   GET /api/messages/:propertyId/:userId
// @access  Private (though simplified for now)
const getChatHistory = async (req, res) => {
  try {
    const { propertyId, userId } = req.params;
    // For simplicity, we fetch all messages for this property. 
    // In a real app, you'd filter by sender/receiver specifically.
    const messages = await Message.find({ property: propertyId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChatHistory,
};
