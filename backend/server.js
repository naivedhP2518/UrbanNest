const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.io — JWT-Authenticated Connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected via WebSocket`);

  // Join a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`User ${socket.userId} joined conversation:${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Send a message
  socket.on('sendMessage', async ({ conversationId, content }) => {
    try {
      // Create message in DB
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        content,
      });

      const populatedMessage = await message.populate('sender', 'name avatar');

      // Update conversation's last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: content,
        lastMessageAt: new Date(),
      });

      // Emit message to everyone in the conversation room
      io.to(`conversation:${conversationId}`).emit('newMessage', {
        conversationId,
        message: populatedMessage,
      });

      // Also emit a conversation update for sidebar refresh
      const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'name avatar email role')
        .populate('property', 'title images');

      if (conversation) {
        conversation.participants.forEach((participant) => {
          io.to(`user:${participant._id}`).emit('conversationUpdated', conversation);
        });
      }
    } catch (err) {
      console.error('Socket Message Error:', err);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Join a personal room for receiving conversation updates
  socket.join(`user:${socket.userId}`);

  // Typing indicators
  socket.on('typing', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('userTyping', {
      userId: socket.userId,
      conversationId,
    });
  });

  socket.on('stopTyping', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('userStopTyping', {
      userId: socket.userId,
      conversationId,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('UrbanNest API v2.0 is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
