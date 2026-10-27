import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './gameManager.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow flexible dev and preview origins
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

const gameManager = new GameManager(io);

// Clean up stale rooms periodically
setInterval(() => gameManager.cleanupOldRooms(), 15 * 60 * 1000);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeRooms: gameManager.rooms.size,
    version: '1.0.0',
  });
});

app.post('/api/rooms/create', (req, res) => {
  try {
    const { timeControlMinutes = 5, incrementSeconds = 0, preferredColor = 'random', creatorName = 'Player' } = req.body || {};
    const room = gameManager.createRoom({
      timeControlMinutes: Number(timeControlMinutes),
      incrementSeconds: Number(incrementSeconds),
      preferredColor,
      creatorName,
    });
    res.status(201).json({
      success: true,
      room: gameManager.sanitizeRoom(room),
    });
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ success: false, error: 'Internal server error creating room' });
  }
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = gameManager.getRoom(roomId.toUpperCase());
  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found' });
  }
  res.json({
    success: true,
    room: gameManager.sanitizeRoom(room),
  });
});

// Socket.IO Events
io.on('connection', (socket) => {
  // Join Room
  socket.on('join_room', ({ roomId, playerName = 'Guest' }, callback) => {
    if (!roomId) {
      if (typeof callback === 'function') callback({ error: 'Room ID required' });
      return;
    }

    const result = gameManager.joinRoom(roomId.toUpperCase(), socket, playerName);
    if (result.error) {
      if (typeof callback === 'function') callback({ error: result.error });
      return;
    }

    // Broadcast room update to room
    io.to(roomId.toUpperCase()).emit('room_updated', result.room);

    if (result.room.status === 'active' && !result.isReconnection) {
      io.to(roomId.toUpperCase()).emit('game_started', result.room);
    }

    if (typeof callback === 'function') {
      callback({
        success: true,
        assignedColor: result.assignedColor,
        room: result.room,
      });
    }
  });

  // Make Move
  socket.on('make_move', ({ roomId, move }, callback) => {
    if (!roomId || !move) return;

    const result = gameManager.makeMove(roomId.toUpperCase(), socket.id, move);
    if (result.error) {
      if (typeof callback === 'function') callback({ error: result.error });
      return;
    }

    // Broadcast move to room
    io.to(roomId.toUpperCase()).emit('move_made', {
      move: result.move,
      room: result.room,
    });

    if (result.gameOver) {
      io.to(roomId.toUpperCase()).emit('game_over', {
        room: result.room,
        result: result.room.result,
      });
    }

    if (typeof callback === 'function') callback({ success: true });
  });

  // Draw Offer
  socket.on('offer_draw', ({ roomId }) => {
    if (!roomId) return;
    const res = gameManager.offerDraw(roomId.toUpperCase(), socket.id);
    if (res) {
      io.to(roomId.toUpperCase()).emit('draw_offered', {
        offeringColor: res.offeringColor,
        room: res.room,
      });
    }
  });

  socket.on('accept_draw', ({ roomId }) => {
    if (!roomId) return;
    const room = gameManager.acceptDraw(roomId.toUpperCase(), socket.id);
    if (room) {
      io.to(roomId.toUpperCase()).emit('game_over', {
        room,
        result: room.result,
      });
    }
  });

  socket.on('decline_draw', ({ roomId }) => {
    if (!roomId) return;
    const res = gameManager.declineDraw(roomId.toUpperCase(), socket.id);
    if (res) {
      io.to(roomId.toUpperCase()).emit('draw_declined', {
        declinedBy: res.declinedBy,
        room: res.room,
      });
    }
  });

  // Resignation
  socket.on('resign', ({ roomId }) => {
    if (!roomId) return;
    const room = gameManager.resign(roomId.toUpperCase(), socket.id);
    if (room) {
      io.to(roomId.toUpperCase()).emit('game_over', {
        room,
        result: room.result,
      });
    }
  });

  // Rematch
  socket.on('request_rematch', ({ roomId }) => {
    if (!roomId) return;
    const res = gameManager.requestRematch(roomId.toUpperCase(), socket.id);
    if (res) {
      if (res.rematchStarted) {
        io.to(roomId.toUpperCase()).emit('game_started', res.room);
      } else {
        socket.to(roomId.toUpperCase()).emit('rematch_requested');
      }
    }
  });

  // Chat message
  socket.on('send_message', ({ roomId, message, sender }) => {
    if (!roomId || !message || !message.trim()) return;
    const chatMsg = {
      id: Date.now().toString(),
      sender: sender || 'Player',
      message: message.trim().slice(0, 200),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    io.to(roomId.toUpperCase()).emit('new_message', chatMsg);
  });

  // Disconnection
  socket.on('disconnect', () => {
    gameManager.handleDisconnect(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`[Chess Server] Running on http://localhost:${PORT}`);
});

