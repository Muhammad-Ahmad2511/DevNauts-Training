const express    = require('express');
const http       = require('http');
const mongoose   = require('mongoose');
const cors       = require('cors');
const jwt        = require('jsonwebtoken');
const { Server } = require('socket.io');
const Message    = require('./models/message');
require('dotenv').config();

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function setupDatabaseMonitoring() {
  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected');
  });
}

function connectDatabase() {
  setupDatabaseMonitoring();
  return mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message));
}

function verifySocketToken(token) {
  if (!token) {
    const err = new Error('Authentication required');
    err.data = { code: 'AUTH_REQUIRED' };
    throw err;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const expiredErr = new Error('Token expired');
      expiredErr.data = { code: 'TOKEN_EXPIRED' };
      throw expiredErr;
    }

    const invalidErr = new Error('Invalid token');
    invalidErr.data = { code: 'INVALID_TOKEN' };
    throw invalidErr;
  }
}

function emitSocketError(socket, code, message, ack) {
  const payload = { ok: false, code, message };
  socket.emit('app-error', payload);
  if (typeof ack === 'function') ack(payload);
}

connectDatabase();

io.use((socket, next) => {
  try {
    socket.user = verifySocketToken(socket.handshake.auth.token);
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, socket.user.username);

  socket.on('join', async (ack) => {
    console.log(`${socket.user.username} joined the chat`);

    if (!isDbConnected()) {
      console.warn('[MongoDB] join rejected: database not connected');
      return emitSocketError(socket, 'DB_UNAVAILABLE', 'Database unavailable', ack);
    }

    try {
      const messages = await Message.find()
        .sort({ createdAt: 1 })
        .limit(100);
      socket.emit('load-messages', messages);
      if (typeof ack === 'function') ack({ ok: true });
    } catch (err) {
      console.error('Error loading messages:', err.message);
      emitSocketError(socket, 'LOAD_MESSAGES_FAILED', 'Failed to load messages', ack);
    }
  });

  socket.on('send-message', async (data, ack) => {
    if (!isDbConnected()) {
      console.warn('[MongoDB] send-message rejected: database not connected');
      return emitSocketError(socket, 'DB_UNAVAILABLE', 'Database unavailable', ack);
    }

    if (typeof data?.text !== 'string' || !data.text.trim()) {
      return emitSocketError(socket, 'INVALID_MESSAGE', 'Message text must be a non-empty string', ack);
    }

    try {
      const msg = new Message({ text: data.text.trim(), sender: socket.user.username });
      await msg.save();
      io.emit('receive-message', msg);
      if (typeof ack === 'function') ack({ ok: true, messageId: msg._id });
    } catch (err) {
      console.error('Message save error:', err.message);
      emitSocketError(socket, 'SAVE_MESSAGE_FAILED', 'Failed to save message', ack);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

module.exports = { app, server, io };
