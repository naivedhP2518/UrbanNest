const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Message = require('./models/Message');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

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

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  socket.on('join', ({ userId, propertyId }) => {
    socket.join(propertyId);
    console.log(`User ${userId} joined room ${propertyId}`);
  });

  socket.on('sendMessage', async ({ sender, receiver, property, content }) => {
    try {
      const message = await Message.create({
        sender,
        receiver,
        property,
        content
      });

      const populatedMessage = await message.populate('sender', 'name avatar');
      
      // Emit message to everyone in the property room
      io.to(property).emit('message', populatedMessage);
    } catch (err) {
      console.error('Socket Message Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
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

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
