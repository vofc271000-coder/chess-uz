import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import io from 'socket.io-client';

// Navigation & Layout Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ChessBoard } from './components/ChessBoard';
import { EvaluationBar } from './components/EvaluationBar';
import { PlayerCard } from './components/PlayerCard';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { ChatPanel } from './components/ChatPanel';

// Dedicated Views
import { AnalysisView } from './components/AnalysisView';
import { PuzzlesView } from './components/PuzzlesView';
import { OpeningsView } from './components/OpeningsView';
import { HistoryView } from './components/HistoryView';

// Modals
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { OnlineLobbyModal } from './components/OnlineLobbyModal';
import { TimeControlModal } from './components/TimeControlModal';

// Utilities & Engines
import { soundManager } from './utils/sound';
import { stockfishEngine } from './utils/stockfishEngine';
import {
  loadSettings,
  saveSettings,
  loadStats,
  recordGameResult,
  loadRecentGames,
  recordRecentGame,
} from './utils/storage';

export function App() {
  // Navigation View State: 'play' | 'analysis' | 'puzzles' | 'openings' | 'history'
  const [activeTab, setActiveTab] = useState('play');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Chess Game State
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(() => new Chess().fen());
  const [turn, setTurn] = useState('w');
  const [moveHistory, setMoveHistory] = useState([]); // array of move objects
  const [viewedMoveIndex, setViewedMoveIndex] = useState(null); // null = latest live

  // Undo / Redo Stack
  const [redoStack, setRedoStack] = useState([]);

  // Selection & Indicators
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [pendingPromotion, setPendingPromotion] = useState(null); // { from, to, color }
  const [hintMove, setHintMove] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Live Position Evaluation (Stockfish)
  const [evalData, setEvalData] = useState({ score: 0, isMate: false, mateIn: 0, depth: 0 });

  // Settings & Storage State
  const [settings, setSettings] = useState(loadSettings);
  const [stats, setStats] = useState(loadStats);
  const [recentGames, setRecentGames] = useState(loadRecentGames);
  const [orientation, setOrientation] = useState('w');

  // Game Modes: 'ai' | 'local' | 'online'
  const [mode, setMode] = useState('ai');
  const [aiLevel, setAiLevel] = useState(4); // 1-6
  const [playerColor, setPlayerColor] = useState('w');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Clocks / Timers
  const [timeControl, setTimeControl] = useState({ minutes: 5, increment: 0 });
  const [whiteTime, setWhiteTime] = useState(300000); // ms
  const [blackTime, setBlackTime] = useState(300000); // ms
  const [isClockRunning, setIsClockRunning] = useState(false);

  // Online Multiplayer State
  const [socket, setSocket] = useState(null);
  const [onlineRoom, setOnlineRoom] = useState(null);
  const [onlineAssignedColor, setOnlineAssignedColor] = useState('w');
  const [onlineMessages, setOnlineMessages] = useState([]);
  const [onlineError, setOnlineError] = useState(null);
  const [isOnlineCreating, setIsOnlineCreating] = useState(false);
  const [isOnlineJoining, setIsOnlineJoining] = useState(false);
  const [incomingDrawOffer, setIncomingDrawOffer] = useState(null);

  // Modals Visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);
  const [isTimeControlOpen, setIsTimeControlOpen] = useState(false);
  const [gameOverResult, setGameOverResult] = useState(null);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  // Sync sound settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Hook up Stockfish evaluation for live evaluation bar
  useEffect(() => {
    if (activeTab === 'play' && settings.showEvaluationBar) {
      stockfishEngine.onEvaluationUpdate = (data) => {
        setEvalData(data);
      };
      stockfishEngine.evaluatePosition(fen, 10);
    }

    return () => {
      stockfishEngine.onEvaluationUpdate = null;
    };
  }, [fen, activeTab, settings.showEvaluationBar]);

  // Socket.IO Initialization
  useEffect(() => {
    const socketUrl =
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : '/';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket.IO Event Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room_updated', (updatedRoom) => {
      setOnlineRoom(updatedRoom);
      if (updatedRoom.clocks) {
        if (updatedRoom.clocks.w !== null) setWhiteTime(updatedRoom.clocks.w);
        if (updatedRoom.clocks.b !== null) setBlackTime(updatedRoom.clocks.b);
      }
    });

    socket.on('game_started', (startedRoom) => {
      setOnlineRoom(startedRoom);
      const newGame = new Chess();
      setGame(newGame);
      setFen(newGame.fen());
      setTurn(newGame.turn());
      setMoveHistory([]);
      setViewedMoveIndex(null);
      setGameOverResult(null);
      setIsGameOverModalOpen(false);
      setIsClockRunning(true);
      soundManager.playNotify();
    });

    socket.on('move_made', ({ move, room }) => {
      setOnlineRoom(room);
      setGame((prevGame) => {
        try {
          const moveRes = prevGame.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || (move.flags && move.flags.includes('p') ? 'q' : undefined),
          });

          if (moveRes) {
            setFen(prevGame.fen());
            setTurn(prevGame.turn());
            setLastMove({ from: move.from, to: move.to });
            setMoveHistory((prev) => [...prev, moveRes]);

            if (prevGame.isCheck()) {
              soundManager.playCheck();
            } else if (moveRes.captured) {
              soundManager.playCapture();
            } else if (moveRes.flags.includes('k') || moveRes.flags.includes('q')) {
              soundManager.playCastle();
            } else {
              soundManager.playMove();
            }
          }
        } catch (e) {
          console.error('Socket move apply error:', e);
        }
        return prevGame;
      });

      if (room.clocks) {
        if (room.clocks.w !== null) setWhiteTime(room.clocks.w);
        if (room.clocks.b !== null) setBlackTime(room.clocks.b);
      }
    });

    socket.on('game_over', ({ room, result }) => {
      setOnlineRoom(room);
      setIsClockRunning(false);
      setGameOverResult(result);
      setIsGameOverModalOpen(true);

      const isWin =
        (result.winner === 'white' && onlineAssignedColor === 'w') ||
        (result.winner === 'black' && onlineAssignedColor === 'b');
      soundManager.playGameOver(isWin);

      const outcome = result.winner === 'draw' ? 'draw' : isWin ? 'win' : 'loss';
      const updatedStats = recordGameResult('online', outcome);
      setStats(updatedStats);
      recordRecentGame({
        mode: 'online',
        outcome,
        reason: result.message || result.reason,
        moves: room.history.length,
      });
      setRecentGames(loadRecentGames());
    });

    socket.on('draw_offered', ({ offeringColor }) => {
      if (offeringColor !== onlineAssignedColor) {
        setIncomingDrawOffer(offeringColor);
        soundManager.playNotify();
      }
    });

    socket.on('draw_declined', () => {
      alert('Your draw offer was declined.');
    });

    socket.on('new_message', (msg) => {
      setOnlineMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('room_updated');
      socket.off('game_started');
      socket.off('move_made');
      socket.off('game_over');
      socket.off('draw_offered');
      socket.off('draw_declined');
      socket.off('new_message');
    };
  }, [socket, onlineAssignedColor]);

  // Timeout Handler
  const handleTimeout = useCallback(
    (flaggedColor) => {
      setIsClockRunning(false);
      const winner = flaggedColor === 'w' ? 'black' : 'white';
      const result = {
        winner,
        reason: 'timeout',
        message: `${flaggedColor === 'w' ? 'White' : 'Black'} ran out of time! ${winner.toUpperCase()} wins`,
      };
      setGameOverResult(result);
      setIsGameOverModalOpen(true);

      const isWin =
        mode === 'local'
          ? true
          : (winner === 'white' && playerColor === 'w') ||
            (winner === 'black' && playerColor === 'b');
      soundManager.playGameOver(isWin);

      const outcome = isWin ? 'win' : 'loss';
      const updatedStats = recordGameResult(mode, outcome);
      setStats(updatedStats);
      recordRecentGame({
        mode,
        outcome,
        reason: `${flaggedColor === 'w' ? 'White' : 'Black'} timed out`,
        moves: moveHistory.length,
      });
      setRecentGames(loadRecentGames());
    },
    [mode, playerColor, moveHistory.length]
  );

  // Clock countdown tick
  useEffect(() => {
    if (!isClockRunning || gameOverResult) return;
    if (whiteTime === null || blackTime === null) return;

    const interval = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 100) {
            handleTimeout('w');
            return 0;
          }
          return prev - 100;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 100) {
            handleTimeout('b');
            return 0;
          }
          return prev - 100;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isClockRunning, turn, gameOverResult, whiteTime === null, blackTime === null, handleTimeout]);

  // Trigger AI move when it is AI's turn
  useEffect(() => {
    if (mode !== 'ai' || gameOverResult) return;

    const aiColor = playerColor === 'w' ? 'b' : 'w';

    if (turn === aiColor && !isAiThinking) {
      setIsAiThinking(true);

      stockfishEngine
        .getBestMove(game, aiLevel)
        .then((bestMove) => {
          if (!bestMove) {
            setIsAiThinking(false);
            return;
          }

          executeMove({
            from: bestMove.from,
            to: bestMove.to,
            promotion: bestMove.promotion || 'q',
          });
        })
        .catch((err) => {
          console.error('AI calculation error:', err);
        })
        .finally(() => {
          setIsAiThinking(false);
        });
    }
  }, [turn, mode, playerColor, game, aiLevel, gameOverResult, isAiThinking]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setOrientation((prev) => (prev === 'w' ? 'b' : 'w'));
      } else if (e.key === 'h' || e.key === 'H') {
        if (mode !== 'online' && !gameOverResult) {
          handleGetHint();
        }
      } else if (e.key === 'u' || e.key === 'U') {
        if (mode !== 'online' && moveHistory.length > 0 && !gameOverResult) {
          handleUndo();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const target = viewedMoveIndex === null ? moveHistory.length - 2 : viewedMoveIndex - 1;
        setViewedMoveIndex(Math.max(-1, target));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (viewedMoveIndex !== null && viewedMoveIndex < moveHistory.length - 1) {
          setViewedMoveIndex(viewedMoveIndex + 1);
        } else if (viewedMoveIndex === moveHistory.length - 1) {
          setViewedMoveIndex(null);
        }
      } else if (e.key === 'Escape') {
        setSelectedSquare(null);
        setLegalMoves([]);
        setHintMove(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, gameOverResult, moveHistory.length, viewedMoveIndex]);

  // Calculate captured pieces and material score
  const getCapturedData = () => {
    const initialCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    };

    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== 'k') {
          currentCounts[piece.color][piece.type] = (currentCounts[piece.color][piece.type] || 0) + 1;
        }
      }
    }

    const capturedByWhite = [];
    const capturedByBlack = [];
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let whiteScore = 0;
    let blackScore = 0;

    Object.keys(initialCounts).forEach((type) => {
      const missingBlack = Math.max(0, initialCounts[type] - currentCounts.b[type]);
      const missingWhite = Math.max(0, initialCounts[type] - currentCounts.w[type]);

      for (let i = 0; i < missingBlack; i++) {
        capturedByWhite.push(type);
        whiteScore += values[type];
      }
      for (let i = 0; i < missingWhite; i++) {
        capturedByBlack.push(type);
        blackScore += values[type];
      }
    });

    return {
      whiteCaptured: capturedByWhite,
      blackCaptured: capturedByBlack,
      whiteAdvantage: Math.max(0, whiteScore - blackScore),
      blackAdvantage: Math.max(0, blackScore - whiteScore),
    };
  };

  // Find square of king currently in check
  const getKingInCheckSquare = () => {
    if (!game.isCheck()) return null;
    const currentTurn = game.turn();
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
          return `${files[c]}${ranks[r]}`;
        }
      }
    }
    return null;
  };

  // Verify game-over conditions in chess.js
  const verifyGameOver = (chessInstance) => {
    if (!chessInstance.isGameOver()) return null;

    setIsClockRunning(false);

    let winner = 'draw';
    let reason = 'draw';
    let message = 'Game ended in a draw';

    if (chessInstance.isCheckmate()) {
      winner = chessInstance.turn() === 'w' ? 'black' : 'white';
      reason = 'checkmate';
      message = `Checkmate! ${winner.toUpperCase()} wins`;
    } else if (chessInstance.isStalemate()) {
      reason = 'stalemate';
      message = 'Draw by Stalemate';
    } else if (chessInstance.isThreefoldRepetition()) {
      reason = 'threefold_repetition';
      message = 'Draw by Threefold Repetition';
    } else if (chessInstance.isInsufficientMaterial()) {
      reason = 'insufficient_material';
      message = 'Draw by Insufficient Material';
    } else if (chessInstance.isDraw()) {
      reason = '50_move_rule';
      message = 'Draw by 50-Move Rule';
    }

    const res = { winner, reason, message };
    setGameOverResult(res);
    setIsGameOverModalOpen(true);

    const isWin =
      mode === 'local'
        ? winner !== 'draw'
        : (winner === 'white' && playerColor === 'w') ||
          (winner === 'black' && playerColor === 'b');

    soundManager.playGameOver(isWin);

    const outcome = winner === 'draw' ? 'draw' : isWin ? 'win' : 'loss';
    const updatedStats = recordGameResult(mode, outcome);
    setStats(updatedStats);
    recordRecentGame({
      mode,
      outcome,
      reason: message,
      moves: moveHistory.length + 1,
    });
    setRecentGames(loadRecentGames());

    return res;
  };

  // Execute a validated move
  const executeMove = ({ from, to, promotion = 'q' }) => {
    if (mode === 'online' && onlineRoom) {
      if (socket) {
        socket.emit('make_move', {
          roomId: onlineRoom.id,
          move: { from, to, promotion },
        });
      }
      setSelectedSquare(null);
      setLegalMoves([]);
      setHintMove(null);
      return;
    }

    let moveRes = null;
    try {
      moveRes = game.move({ from, to, promotion });
    } catch {
      return false;
    }

    if (!moveRes) return false;

    setRedoStack([]);
    setFen(game.fen());
    setTurn(game.turn());
    setLastMove({ from, to });
    setMoveHistory((prev) => [...prev, moveRes]);
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);

    // Auto-start clocks on first move
    if (!isClockRunning && (timeControl.minutes > 0 || whiteTime !== null)) {
      setIsClockRunning(true);
    }

    // Add increment if active
    if (timeControl.increment > 0) {
      if (moveRes.color === 'w') {
        setWhiteTime((prev) => (prev !== null ? prev + timeControl.increment * 1000 : null));
      } else {
        setBlackTime((prev) => (prev !== null ? prev + timeControl.increment * 1000 : null));
      }
    }

    // Pass & Play auto flip
    if (mode === 'local' && settings.autoFlipBoard) {
      setOrientation((prev) => (prev === 'w' ? 'b' : 'w'));
    }

    // Audio FX
    if (moveRes.flags.includes('p')) {
      soundManager.playPromote();
    } else if (game.isCheck()) {
      soundManager.playCheck();
    } else if (moveRes.captured) {
      soundManager.playCapture();
    } else if (moveRes.flags.includes('k') || moveRes.flags.includes('q')) {
      soundManager.playCastle();
    } else {
      soundManager.playMove();
    }

    verifyGameOver(game);
    return true;
  };

  // Click on square
  const handleSquareClick = (square) => {
    if (gameOverResult || viewedMoveIndex !== null) {
      if (viewedMoveIndex !== null) setViewedMoveIndex(null);
      return;
    }

    if (mode === 'online' && turn !== onlineAssignedColor) return;
    if (mode === 'ai' && (turn !== playerColor || isAiThinking)) return;

    // Legal move execution
    if (selectedSquare && legalMoves.includes(square)) {
      const piece = game.get(selectedSquare);
      const isPawnPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && square[1] === '8') ||
          (piece.color === 'b' && square[1] === '1'));

      if (isPawnPromotion) {
        if (settings.autoQueen) {
          executeMove({ from: selectedSquare, to: square, promotion: 'q' });
        } else {
          setPendingPromotion({ from: selectedSquare, to: square, color: piece.color });
        }
        return;
      }

      executeMove({ from: selectedSquare, to: square });
      return;
    }

    // Piece selection
    const piece = game.get(square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      setLegalMoves(game.moves({ square, verbose: true }).map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Drag and drop piece
  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (gameOverResult || viewedMoveIndex !== null) return;
    if (mode === 'online' && turn !== onlineAssignedColor) return;
    if (mode === 'ai' && (turn !== playerColor || isAiThinking)) return;

    const piece = game.get(sourceSquare);
    if (!piece || piece.color !== turn) return;

    const isLegal = game.moves({ square: sourceSquare, verbose: true }).some((m) => m.to === targetSquare);
    if (!isLegal) return;

    const isPawnPromotion =
      piece.type === 'p' &&
      ((piece.color === 'w' && targetSquare[1] === '8') ||
        (piece.color === 'b' && targetSquare[1] === '1'));

    if (isPawnPromotion) {
      if (settings.autoQueen) {
        executeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      } else {
        setPendingPromotion({ from: sourceSquare, to: targetSquare, color: piece.color });
      }
      return;
    }

    executeMove({ from: sourceSquare, to: targetSquare });
  };

  // Promotion piece selected
  const handlePromotionSelect = (chosenPiece) => {
    if (!pendingPromotion) return;
    executeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: chosenPiece,
    });
    setPendingPromotion(null);
  };

  // Calculate AI Hint
  const handleGetHint = async () => {
    if (gameOverResult || isHintLoading) return;
    setIsHintLoading(true);

    try {
      const best = await stockfishEngine.getBestMove(game, 4);
      if (best) {
        setHintMove({ from: best.from, to: best.to });
        soundManager.playNotify();
      }
    } catch (e) {
      console.warn('Hint calculation error:', e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (mode === 'online' || moveHistory.length === 0 || gameOverResult) return;

    const undoCount = mode === 'ai' ? (turn === playerColor ? 2 : 1) : 1;
    const undoneMoves = [];

    for (let i = 0; i < undoCount; i++) {
      const undone = game.undo();
      if (undone) undoneMoves.push(undone);
    }

    if (undoneMoves.length > 0) {
      setRedoStack((prev) => [...undoneMoves, ...prev]);
      setFen(game.fen());
      setTurn(game.turn());
      setMoveHistory((prev) => prev.slice(0, prev.length - undoneMoves.length));
      setSelectedSquare(null);
      setLegalMoves([]);
      setHintMove(null);

      const prevMove = game.history({ verbose: true }).slice(-1)[0];
      setLastMove(prevMove ? { from: prevMove.from, to: prevMove.to } : null);
      soundManager.playMove();
    }
  };

  // Redo Move
  const handleRedo = () => {
    if (mode === 'online' || redoStack.length === 0 || gameOverResult) return;

    const redoCount = mode === 'ai' ? 2 : 1;
    const movesToApply = redoStack.slice(0, redoCount);

    for (const m of movesToApply) {
      game.move(m);
    }

    setRedoStack((prev) => prev.slice(redoCount));
    setFen(game.fen());
    setTurn(game.turn());
    setMoveHistory(game.history({ verbose: true }));
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);

    const last = movesToApply[movesToApply.length - 1];
    if (last) setLastMove({ from: last.from, to: last.to });
    soundManager.playMove();
  };

  // Start New Game
  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setTurn('w');
    setMoveHistory([]);
    setViewedMoveIndex(null);
    setRedoStack([]);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintMove(null);
    setGameOverResult(null);
    setIsGameOverModalOpen(false);

    const initialMs = timeControl.minutes > 0 ? timeControl.minutes * 60 * 1000 : null;
    setWhiteTime(initialMs);
    setBlackTime(initialMs);
    setIsClockRunning(false);

    if (mode === 'online' && socket && onlineRoom) {
      socket.emit('request_rematch', { roomId: onlineRoom.id });
    }
  };

  // Resign
  const handleResign = () => {
    if (gameOverResult) return;

    if (mode === 'online' && socket && onlineRoom) {
      socket.emit('resign', { roomId: onlineRoom.id });
      return;
    }

    const resigningColor = mode === 'local' ? turn : playerColor;
    const winner = resigningColor === 'w' ? 'black' : 'white';
    const result = {
      winner,
      reason: 'resignation',
      message: `${resigningColor === 'w' ? 'White' : 'Black'} resigned. ${winner.toUpperCase()} wins!`,
    };

    setIsClockRunning(false);
    setGameOverResult(result);
    setIsGameOverModalOpen(true);

    const isWin = mode === 'local' || winner === playerColor;
    soundManager.playGameOver(isWin);

    const outcome = isWin ? 'win' : 'loss';
    const updatedStats = recordGameResult(mode, outcome);
    setStats(updatedStats);
    recordRecentGame({
      mode,
      outcome,
      reason: result.message,
      moves: moveHistory.length,
    });
    setRecentGames(loadRecentGames());
  };

  // Offer Draw
  const handleOfferDraw = () => {
    if (gameOverResult) return;

    if (mode === 'online' && socket && onlineRoom) {
      socket.emit('offer_draw', { roomId: onlineRoom.id });
      return;
    }

    const result = {
      winner: 'draw',
      reason: 'agreement',
      message: 'Draw agreed by mutual consent',
    };

    setIsClockRunning(false);
    setGameOverResult(result);
    setIsGameOverModalOpen(true);
    soundManager.playGameOver(false);

    const updatedStats = recordGameResult(mode, 'draw');
    setStats(updatedStats);
    recordRecentGame({
      mode,
      outcome: 'draw',
      reason: 'Draw by agreement',
      moves: moveHistory.length,
    });
    setRecentGames(loadRecentGames());
  };

  // Online Multiplayer: Create Room
  const handleCreateOnlineRoom = async (params) => {
    setIsOnlineCreating(true);
    setOnlineError(null);

    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      if (!data.success) {
        setOnlineError(data.error || 'Failed to create room');
        setIsOnlineCreating(false);
        return;
      }

      const room = data.room;
      socket.emit(
        'join_room',
        { roomId: room.id, playerName: params.creatorName },
        (joinRes) => {
          setIsOnlineCreating(false);
          if (joinRes.error) {
            setOnlineError(joinRes.error);
            return;
          }

          setOnlineRoom(joinRes.room);
          setOnlineAssignedColor(joinRes.assignedColor);
          setOrientation(joinRes.assignedColor === 'b' ? 'b' : 'w');
          setIsLobbyOpen(false);

          const initialMs = room.timeControl.minutes > 0 ? room.timeControl.minutes * 60 * 1000 : null;
          setWhiteTime(initialMs);
          setBlackTime(initialMs);
        }
      );
    } catch (err) {
      setOnlineError('Unable to connect to server: ' + err.message);
      setIsOnlineCreating(false);
    }
  };

  // Online Multiplayer: Join Room
  const handleJoinOnlineRoom = ({ roomId, playerName }) => {
    setIsOnlineJoining(true);
    setOnlineError(null);

    socket.emit('join_room', { roomId, playerName }, (res) => {
      setIsOnlineJoining(false);
      if (res.error) {
        setOnlineError(res.error);
        return;
      }

      setOnlineRoom(res.room);
      setOnlineAssignedColor(res.assignedColor);
      setOrientation(res.assignedColor === 'b' ? 'b' : 'w');
      setIsLobbyOpen(false);

      if (res.room.clocks) {
        if (res.room.clocks.w !== null) setWhiteTime(res.room.clocks.w);
        if (res.room.clocks.b !== null) setBlackTime(res.room.clocks.b);
      }
    });
  };

  // Send Chat Message
  const handleSendChatMessage = (text) => {
    if (!socket || !onlineRoom) return;
    const name = localStorage.getItem('grandmaster_player_name') || 'Player';
    socket.emit('send_message', {
      roomId: onlineRoom.id,
      message: text,
      sender: name,
    });
  };

  // Inspect past move on board
  const getDisplayBoard = () => {
    if (viewedMoveIndex === null || viewedMoveIndex === moveHistory.length - 1) {
      return game.board();
    }

    const tempGame = new Chess();
    for (let i = 0; i <= viewedMoveIndex; i++) {
      if (moveHistory[i]) {
        tempGame.move(moveHistory[i]);
      }
    }
    return tempGame.board();
  };

  const getDisplayLastMove = () => {
    if (viewedMoveIndex !== null && moveHistory[viewedMoveIndex]) {
      return {
        from: moveHistory[viewedMoveIndex].from,
        to: moveHistory[viewedMoveIndex].to,
      };
    }
    return lastMove;
  };

  const capturedData = getCapturedData();
  const kingInCheckSq = getKingInCheckSquare();

  // Players display details
  const getPlayerDetails = () => {
    if (mode === 'ai') {
      const isPlayerWhite = playerColor === 'w';
      return {
        top: {
          name: isPlayerWhite ? `Stockfish AI (Lvl ${aiLevel})` : 'You',
          isAi: isPlayerWhite,
          color: isPlayerWhite ? 'b' : 'w',
          time: isPlayerWhite ? blackTime : whiteTime,
          captured: isPlayerWhite ? capturedData.blackCaptured : capturedData.whiteCaptured,
          advantage: isPlayerWhite ? capturedData.blackAdvantage : capturedData.whiteAdvantage,
        },
        bottom: {
          name: isPlayerWhite ? 'You' : `Stockfish AI (Lvl ${aiLevel})`,
          isAi: !isPlayerWhite,
          color: isPlayerWhite ? 'w' : 'b',
          time: isPlayerWhite ? whiteTime : blackTime,
          captured: isPlayerWhite ? capturedData.whiteCaptured : capturedData.blackCaptured,
          advantage: isPlayerWhite ? capturedData.whiteAdvantage : capturedData.blackAdvantage,
        },
      };
    }

    if (mode === 'online') {
      const isWhite = onlineAssignedColor === 'w';
      const oppColor = isWhite ? 'b' : 'w';
      const myName = localStorage.getItem('grandmaster_player_name') || 'You';
      const oppName = onlineRoom?.players?.[oppColor]?.name || 'Waiting for opponent...';

      return {
        top: {
          name: oppName,
          isAi: false,
          color: oppColor,
          time: oppColor === 'w' ? whiteTime : blackTime,
          captured: oppColor === 'w' ? capturedData.whiteCaptured : capturedData.blackCaptured,
          advantage: oppColor === 'w' ? capturedData.whiteAdvantage : capturedData.blackAdvantage,
        },
        bottom: {
          name: myName,
          isAi: false,
          color: onlineAssignedColor,
          time: isWhite ? whiteTime : blackTime,
          captured: isWhite ? capturedData.whiteCaptured : capturedData.blackCaptured,
          advantage: isWhite ? capturedData.whiteAdvantage : capturedData.blackAdvantage,
        },
      };
    }

    // Pass & Play Local
    const isFlipped = orientation === 'b';
    return {
      top: {
        name: isFlipped ? 'White' : 'Black',
        isAi: false,
        color: isFlipped ? 'w' : 'b',
        time: isFlipped ? whiteTime : blackTime,
        captured: isFlipped ? capturedData.whiteCaptured : capturedData.blackCaptured,
        advantage: isFlipped ? capturedData.whiteAdvantage : capturedData.blackAdvantage,
      },
      bottom: {
        name: isFlipped ? 'Black' : 'White',
        isAi: false,
        color: isFlipped ? 'b' : 'w',
        time: isFlipped ? blackTime : whiteTime,
        captured: isFlipped ? capturedData.blackCaptured : capturedData.whiteCaptured,
        advantage: isFlipped ? capturedData.blackAdvantage : capturedData.whiteAdvantage,
      },
    };
  };

  const players = getPlayerDetails();

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-violet-600 selection:text-white">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'play' && mode === 'online') {
            setIsLobbyOpen(true);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundManager.setEnabled(next);
          const updated = { ...settings, soundEnabled: next };
          setSettings(updated);
          saveSettings(updated);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          activeMode={mode}
          onSelectMode={(newMode) => {
            if (newMode === 'online') {
              setIsLobbyOpen(true);
            }
            setMode(newMode);
          }}
          timeControl={timeControl}
          onOpenTimeControl={() => setIsTimeControlOpen(true)}
          onFlipBoard={() => setOrientation((prev) => (prev === 'w' ? 'b' : 'w'))}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => {
            const next = !settings.soundEnabled;
            soundManager.setEnabled(next);
            const updated = { ...settings, soundEnabled: next };
            setSettings(updated);
            saveSettings(updated);
          }}
          isOnlineConnected={Boolean(onlineRoom)}
        />

        {/* Dynamic View Router */}
        {activeTab === 'analysis' && (
          <AnalysisView
            theme={settings.boardTheme}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {activeTab === 'puzzles' && (
          <PuzzlesView theme={settings.boardTheme} />
        )}

        {activeTab === 'openings' && (
          <OpeningsView
            theme={settings.boardTheme}
            onOpenInAnalysis={(fenString) => {
              setActiveTab('analysis');
            }}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            stats={stats}
            recentGames={recentGames}
            onStatsReset={() => {
              setStats(loadStats());
              setRecentGames([]);
            }}
            onAnalyzeGame={(gameEntry) => {
              setActiveTab('analysis');
            }}
          />
        )}

        {/* Primary Play Arena */}
        {activeTab === 'play' && (
          <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6">
            {/* Left Arena Column: Opponent Card + Chessboard + Player Card */}
            <div className="flex items-center gap-3 w-full max-w-[620px]">
              {/* Optional Live Evaluation Bar */}
              {settings.showEvaluationBar && (
                <EvaluationBar
                  score={evalData.score}
                  isMate={evalData.isMate}
                  mateIn={evalData.mateIn}
                  orientation={orientation}
                />
              )}

              <div className="flex-1 flex flex-col gap-2 sm:gap-3">
                {/* Top Opponent Card */}
                <PlayerCard
                  player={players.top}
                  timeMs={players.top.time}
                  isActive={turn === players.top.color && !gameOverResult}
                  isThinking={mode === 'ai' && players.top.isAi && isAiThinking}
                  capturedPieces={players.top.captured}
                  materialScore={players.top.advantage}
                />

                {/* 8x8 Chessboard */}
                <div className="relative w-full">
                  <ChessBoard
                    board={getDisplayBoard()}
                    turn={turn}
                    orientation={orientation}
                    selectedSquare={selectedSquare}
                    legalMoves={legalMoves}
                    lastMove={getDisplayLastMove()}
                    hintMove={hintMove}
                    inCheckKingSquare={kingInCheckSq}
                    onSquareClick={handleSquareClick}
                    onPieceDrop={handlePieceDrop}
                    theme={settings.boardTheme}
                    showLegalMoves={settings.showLegalMoves}
                    showCoordinates={settings.showCoordinates}
                    isInteractive={viewedMoveIndex === null && !gameOverResult}
                  />

                  {/* Historical Move Exploration Banner */}
                  {viewedMoveIndex !== null && (
                    <div
                      onClick={() => setViewedMoveIndex(null)}
                      className="absolute top-3 left-1/2 -translate-x-1/2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg cursor-pointer flex items-center gap-1.5 backdrop-blur-sm transition-transform hover:scale-105"
                    >
                      <span>Viewing Move {viewedMoveIndex + 1}. Click to resume live game</span>
                    </div>
                  )}
                </div>

                {/* Bottom Player Card */}
                <PlayerCard
                  player={players.bottom}
                  timeMs={players.bottom.time}
                  isActive={turn === players.bottom.color && !gameOverResult}
                  isThinking={mode === 'ai' && players.bottom.isAi && isAiThinking}
                  capturedPieces={players.bottom.captured}
                  materialScore={players.bottom.advantage}
                />
              </div>
            </div>

            {/* Right Arena Column: Move History + Controls + Chat */}
            <div className="flex flex-col w-full max-w-[620px] lg:max-w-[360px] gap-3">
              {/* Algebraic Move Notation */}
              <MoveHistory
                moves={moveHistory}
                currentMoveIndex={viewedMoveIndex}
                onSelectMoveIndex={(idx) => setViewedMoveIndex(idx)}
                pgn={game.pgn()}
                fen={fen}
              />

              {/* Game Action Controls */}
              <GameControls
                mode={mode}
                canUndo={moveHistory.length > 0}
                canRedo={redoStack.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onFlipBoard={() => setOrientation((prev) => (prev === 'w' ? 'b' : 'w'))}
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                onNewGame={handleNewGame}
                onGetHint={handleGetHint}
                isHintLoading={isHintLoading}
                aiLevel={aiLevel}
                onChangeAiLevel={(lvl) => setAiLevel(lvl)}
                isGameOver={Boolean(gameOverResult)}
              />

              {/* Online Multiplayer Chat (Visible in Online Mode) */}
              {mode === 'online' && (
                <ChatPanel
                  messages={onlineMessages}
                  onSendMessage={handleSendChatMessage}
                  roomCode={onlineRoom?.id}
                  isOpponentConnected={Boolean(
                    onlineRoom?.players?.[onlineAssignedColor === 'w' ? 'b' : 'w']?.connected
                  )}
                  opponentName={
                    onlineRoom?.players?.[onlineAssignedColor === 'w' ? 'b' : 'w']?.name || 'Opponent'
                  }
                  playerName={localStorage.getItem('grandmaster_player_name') || 'You'}
                />
              )}
            </div>
          </main>
        )}
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={pendingPromotion.color}
          onSelect={handlePromotionSelect}
        />
      )}

      {/* Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={() => setIsGameOverModalOpen(false)}
        result={gameOverResult}
        playerColor={mode === 'online' ? onlineAssignedColor : playerColor}
        mode={mode}
        onRematch={handleNewGame}
        onNewGame={handleNewGame}
        onAnalyze={() => {
          setIsGameOverModalOpen(false);
          setActiveTab('analysis');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => {
          const next = { ...settings, ...updated };
          setSettings(next);
          saveSettings(next);
        }}
      />

      {/* Time Control Modal */}
      <TimeControlModal
        isOpen={isTimeControlOpen}
        onClose={() => setIsTimeControlOpen(false)}
        timeControl={timeControl}
        onSelectTimeControl={(tc) => {
          setTimeControl(tc);
          const ms = tc.minutes > 0 ? tc.minutes * 60 * 1000 : null;
          setWhiteTime(ms);
          setBlackTime(ms);
        }}
      />

      {/* Online Multiplayer Lobby Modal */}
      <OnlineLobbyModal
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        onCreateRoom={handleCreateOnlineRoom}
        onJoinRoom={handleJoinOnlineRoom}
        isCreating={isOnlineCreating}
        isJoining={isOnlineJoining}
        error={onlineError}
      />

      {/* Incoming Draw Offer Modal */}
      {incomingDrawOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-slate-700 rounded-2xl p-5 max-w-xs w-full text-center shadow-2xl">
            <h4 className="text-base font-bold text-white mb-1">Draw Offered</h4>
            <p className="text-xs text-slate-400 mb-4">
              Your opponent has offered a draw. Do you accept?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  socket.emit('decline_draw', { roomId: onlineRoom.id });
                  setIncomingDrawOffer(null);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  socket.emit('accept_draw', { roomId: onlineRoom.id });
                  setIncomingDrawOffer(null);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold text-white shadow-lg"
              >
                Accept Draw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
