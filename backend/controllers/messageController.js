const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    })
    .populate('participants', 'name avatar role')
    .populate('property', 'title images')
    .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or get existing conversation
// @route   POST /api/messages/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    const { participantId, propertyId } = req.body;
    
    // Check if conversation already exists between these users
    // If propertyId is provided, check for that specific property
    let query = {
      participants: { $all: [req.user._id, participantId] }
    };
    if (propertyId) {
      query.property = propertyId;
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        property: propertyId || null
      });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getMessages
};
