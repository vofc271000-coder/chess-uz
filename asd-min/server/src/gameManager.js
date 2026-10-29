import { Chess } from 'chess.js';

export class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
    // Clock tick interval
    this.timerInterval = setInterval(() => this.tickClocks(), 500);
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom({ timeControlMinutes = 5, incrementSeconds = 0, preferredColor = 'random', creatorName = 'Player 1' }) {
    let roomId = this.generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = this.generateRoomCode();
    }

    const initialMs = timeControlMinutes > 0 ? timeControlMinutes * 60 * 1000 : null;

    const room = {
      id: roomId,
      chess: new Chess(),
      status: 'waiting', // waiting, active, finished
      preferredColor,
      timeControl: {
        minutes: timeControlMinutes,
        increment: incrementSeconds,
      },
      clocks: {
        w: initialMs,
        b: initialMs,
        lastTurnTimestamp: null,
      },
      players: {
        w: null,
        b: null,
      },
      spectators: [],
      moves: [],
      history: [],
      drawOfferedBy: null,
      rematchRequestedBy: new Set(),
      chat: [],
      result: null,
      createdAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  sanitizeRoom(room) {
    if (!room) return null;
    return {
      id: room.id,
      fen: room.chess.fen(),
      turn: room.chess.turn(),
      status: room.status,
      timeControl: room.timeControl,
      clocks: {
        w: room.clocks.w,
        b: room.clocks.b,
      },
      players: {
        w: room.players.w ? { name: room.players.w.name, connected: room.players.w.connected } : null,
        b: room.players.b ? { name: room.players.b.name, connected: room.players.b.connected } : null,
      },
      spectatorCount: room.spectators.length,
      moves: room.moves,
      history: room.history,
      result: room.result,
      isCheck: room.chess.isCheck(),
      drawOfferedBy: room.drawOfferedBy,
      createdAt: room.createdAt,
    };
  }

  joinRoom(roomId, socket, playerName = 'Player') {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { error: 'Room not found' };
    }

    // Check if player is reconnecting
    let assignedColor = null;
    let isReconnection = false;

    if (room.players.w && room.players.w.name === playerName) {
      room.players.w.socketId = socket.id;
      room.players.w.connected = true;
      assignedColor = 'w';
      isReconnection = true;
    } else if (room.players.b && room.players.b.name === playerName) {
      room.players.b.socketId = socket.id;
      room.players.b.connected = true;
      assignedColor = 'b';
      isReconnection = true;
    } else if (!room.players.w && !room.players.b) {
      // First player joining
      if (room.preferredColor === 'b') {
        assignedColor = 'b';
        room.players.b = { socketId: socket.id, name: playerName, connected: true };
      } else if (room.preferredColor === 'w') {
        assignedColor = 'w';
        room.players.w = { socketId: socket.id, name: playerName, connected: true };
      } else {
        // Random
        assignedColor = Math.random() < 0.5 ? 'w' : 'b';
        if (assignedColor === 'w') {
          room.players.w = { socketId: socket.id, name: playerName, connected: true };
        } else {
          room.players.b = { socketId: socket.id, name: playerName, connected: true };
        }
      }
    } else if (room.players.w && !room.players.b) {
      // White is taken, assign Black
      assignedColor = 'b';
      room.players.b = { socketId: socket.id, name: playerName, connected: true };
    } else if (!room.players.w && room.players.b) {
      // Black is taken, assign White
      assignedColor = 'w';
      room.players.w = { socketId: socket.id, name: playerName, connected: true };
    } else {
      // Room full, join as spectator
      room.spectators.push({ socketId: socket.id, name: playerName });
      assignedColor = 'spectator';
    }

    // If both players are present and status is waiting, start game
    if (room.players.w && room.players.b && room.status === 'waiting') {
      room.status = 'active';
      room.clocks.lastTurnTimestamp = Date.now();
    }

    socket.join(roomId);

    return {
      room: this.sanitizeRoom(room),
      assignedColor,
      isReconnection,
    };
  }

  makeMove(roomId, socketId, move) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.status !== 'active') return { error: 'Game is not active' };

    // Identify player color
    let playerColor = null;
    if (room.players.w && room.players.w.socketId === socketId) playerColor = 'w';
    if (room.players.b && room.players.b.socketId === socketId) playerColor = 'b';

    if (!playerColor) return { error: 'You are not a player in this game' };
    if (room.chess.turn() !== playerColor) return { error: "Not your turn" };

    // Update clocks
    if (room.clocks.lastTurnTimestamp && room.clocks[playerColor] !== null) {
      const now = Date.now();
      const elapsed = now - room.clocks.lastTurnTimestamp;
      room.clocks[playerColor] = Math.max(0, room.clocks[playerColor] - elapsed);

      // Check timeout
      if (room.clocks[playerColor] <= 0) {
        room.status = 'finished';
        room.result = {
          winner: playerColor === 'w' ? 'black' : 'white',
          reason: 'timeout',
          message: `${playerColor === 'w' ? 'White' : 'Black'} ran out of time`,
        };
        return { room: this.sanitizeRoom(room), gameOver: true };
      }

      // Add increment
      if (room.timeControl.increment > 0) {
        room.clocks[playerColor] += room.timeControl.increment * 1000;
      }

      room.clocks.lastTurnTimestamp = now;
    }

    // Attempt move in Chess.js
    let resultMove;
    try {
      resultMove = room.chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q',
      });
    } catch (err) {
      return { error: 'Illegal move: ' + err.message };
    }

    if (!resultMove) {
      return { error: 'Illegal move' };
    }

    // Reset draw offer when a move is made
    room.drawOfferedBy = null;

    // Record move
    const moveData = {
      san: resultMove.san,
      from: resultMove.from,
      to: resultMove.to,
      piece: resultMove.piece,
      color: resultMove.color,
      captured: resultMove.captured || null,
      flags: resultMove.flags,
      promotion: resultMove.promotion || null,
      fen: room.chess.fen(),
      clocks: {
        w: room.clocks.w,
        b: room.clocks.b,
      },
      timestamp: Date.now(),
    };

    room.moves.push(moveData);
    room.history.push(resultMove.san);

    // Check game over conditions
    let gameOver = false;
    if (room.chess.isGameOver()) {
      room.status = 'finished';
      gameOver = true;

      if (room.chess.isCheckmate()) {
        room.result = {
          winner: playerColor === 'w' ? 'white' : 'black',
          reason: 'checkmate',
          message: `Checkmate! ${playerColor === 'w' ? 'White' : 'Black'} wins`,
        };
      } else if (room.chess.isStalemate()) {
        room.result = {
          winner: 'draw',
          reason: 'stalemate',
          message: 'Draw by Stalemate',
        };
      } else if (room.chess.isThreefoldRepetition()) {
        room.result = {
          winner: 'draw',
          reason: 'threefold_repetition',
          message: 'Draw by Threefold Repetition',
        };
      } else if (room.chess.isInsufficientMaterial()) {
        room.result = {
          winner: 'draw',
          reason: 'insufficient_material',
          message: 'Draw by Insufficient Material',
        };
      } else if (room.chess.isDraw()) {
        room.result = {
          winner: 'draw',
          reason: '50_move_rule',
          message: 'Draw by 50-Move Rule',
        };
      }
    }

    return {
      move: moveData,
      room: this.sanitizeRoom(room),
      gameOver,
    };
  }

  resign(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'active') return null;

    let resigningColor = null;
    if (room.players.w && room.players.w.socketId === socketId) resigningColor = 'w';
    if (room.players.b && room.players.b.socketId === socketId) resigningColor = 'b';

    if (!resigningColor) return null;

    const winner = resigningColor === 'w' ? 'black' : 'white';
    room.status = 'finished';
    room.result = {
      winner,
      reason: 'resignation',
      message: `${resigningColor === 'w' ? 'White' : 'Black'} resigned. ${winner.toUpperCase()} wins!`,
    };

    return this.sanitizeRoom(room);
  }

  offerDraw(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'active') return null;

    let offeringColor = null;
    if (room.players.w && room.players.w.socketId === socketId) offeringColor = 'w';
    if (room.players.b && room.players.b.socketId === socketId) offeringColor = 'b';

    if (!offeringColor) return null;

    room.drawOfferedBy = offeringColor;
    return { room: this.sanitizeRoom(room), offeringColor };
  }

  acceptDraw(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'active' || !room.drawOfferedBy) return null;

    let acceptingColor = null;
    if (room.players.w && room.players.w.socketId === socketId) acceptingColor = 'w';
    if (room.players.b && room.players.b.socketId === socketId) acceptingColor = 'b';

    if (!acceptingColor || acceptingColor === room.drawOfferedBy) return null;

    room.status = 'finished';
    room.result = {
      winner: 'draw',
      reason: 'agreement',
      message: 'Draw agreed by mutual agreement',
    };
    room.drawOfferedBy = null;

    return this.sanitizeRoom(room);
  }

  declineDraw(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room || !room.drawOfferedBy) return null;

    let decliningColor = null;
    if (room.players.w && room.players.w.socketId === socketId) decliningColor = 'w';
    if (room.players.b && room.players.b.socketId === socketId) decliningColor = 'b';

    if (!decliningColor || decliningColor === room.drawOfferedBy) return null;

    const previousOffer = room.drawOfferedBy;
    room.drawOfferedBy = null;
    return { room: this.sanitizeRoom(room), declinedBy: decliningColor };
  }

  requestRematch(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.rematchRequestedBy.add(socketId);

    // If both players requested rematch, start new game and swap colors
    const whiteId = room.players.w?.socketId;
    const blackId = room.players.b?.socketId;

    if (whiteId && blackId && room.rematchRequestedBy.has(whiteId) && room.rematchRequestedBy.has(blackId)) {
      // Swap colors
      const oldWhite = room.players.w;
      const oldBlack = room.players.b;

      room.players.w = oldBlack;
      room.players.b = oldWhite;

      room.chess = new Chess();
      room.status = 'active';
      room.moves = [];
      room.history = [];
      room.result = null;
      room.drawOfferedBy = null;
      room.rematchRequestedBy.clear();

      const initialMs = room.timeControl.minutes > 0 ? room.timeControl.minutes * 60 * 1000 : null;
      room.clocks.w = initialMs;
      room.clocks.b = initialMs;
      room.clocks.lastTurnTimestamp = Date.now();

      return { room: this.sanitizeRoom(room), rematchStarted: true };
    }

    return { room: this.sanitizeRoom(room), rematchStarted: false };
  }

  handleDisconnect(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      let changed = false;
      if (room.players.w && room.players.w.socketId === socketId) {
        room.players.w.connected = false;
        changed = true;
      }
      if (room.players.b && room.players.b.socketId === socketId) {
        room.players.b.connected = false;
        changed = true;
      }

      const specIdx = room.spectators.findIndex(s => s.socketId === socketId);
      if (specIdx !== -1) {
        room.spectators.splice(specIdx, 1);
        changed = true;
      }

      if (changed) {
        this.io.to(roomId).emit('room_updated', this.sanitizeRoom(room));
      }
    }
  }

  tickClocks() {
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.status === 'active' && room.clocks.lastTurnTimestamp) {
        const turn = room.chess.turn();
        if (room.clocks[turn] !== null) {
          const elapsed = now - room.clocks.lastTurnTimestamp;
          const currentRemaining = room.clocks[turn] - elapsed;

          if (currentRemaining <= 0) {
            room.clocks[turn] = 0;
            room.status = 'finished';
            const winner = turn === 'w' ? 'black' : 'white';
            room.result = {
              winner,
              reason: 'timeout',
              message: `${turn === 'w' ? 'White' : 'Black'} ran out of time! ${winner.toUpperCase()} wins`,
            };
            this.io.to(roomId).emit('game_over', {
              room: this.sanitizeRoom(room),
              result: room.result,
            });
          }
        }
      }
    }
  }

  cleanupOldRooms() {
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > TWO_HOURS) {
        this.rooms.delete(roomId);
      }
    }
  }
}

