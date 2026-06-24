const express    = require('express');
const http       = require('http');
const mongoose   = require('mongoose');
const cors       = require('cors');
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async ({ username }) => {
    console.log(`${username} joined the chat`);
    try {
      const messages = await Message.find()
        .sort({ createdAt: 1 })
        .limit(100);
      socket.emit('load-messages', messages);
    } catch (err) {
      console.log('Error loading messages:', err);
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const msg = new Message({ text: data.text, sender: data.sender });
      await msg.save();
      io.emit('receive-message', msg);
    } catch (err) {
      console.log('Message save error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});