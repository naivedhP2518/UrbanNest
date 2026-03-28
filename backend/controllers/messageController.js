const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar email role')
      .populate('property', 'title images')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
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
    const userId = req.user._id;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      property: propertyId,
    })
      .populate('participants', 'name avatar email role')
      .populate('property', 'title images');

    if (conversation) {
      return res.json({ success: true, data: conversation });
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [userId, participantId],
      property: propertyId,
    });

    conversation = await conversation.populate('participants', 'name avatar email role');
    conversation = await conversation.populate('property', 'title images');

    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  createConversation,
};
