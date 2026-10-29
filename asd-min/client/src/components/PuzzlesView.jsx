import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { TACTICAL_PUZZLES } from '../utils/puzzles';
import {
  loadPuzzleStats,
  updatePuzzleResult,
} from '../utils/storage';
import { soundManager } from '../utils/sound';

export const PuzzlesView = ({ theme = 'violet' }) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [stats, setStats] = useState(loadPuzzleStats);
  const currentPuzzle = TACTICAL_PUZZLES[puzzleIndex % TACTICAL_PUZZLES.length];

  const [puzzleGame, setPuzzleGame] = useState(() => new Chess(currentPuzzle.fen));
  const [moveStep, setMoveStep] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [hintMove, setHintMove] = useState(null);
  const [showHintText, setShowHintText] = useState(false);
  const [puzzleStatus, setPuzzleStatus] = useState('playing'); // 'playing' | 'solved' | 'failed'

  // Reset when puzzle changes
  useEffect(() => {
    const newG = new Chess(currentPuzzle.fen);
    setPuzzleGame(newG);
    setMoveStep(0);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintMove(null);
    setShowHintText(false);
    setPuzzleStatus('playing');
  }, [puzzleIndex]);

  const handleSquareClick = (square) => {
    if (puzzleStatus !== 'playing') return;

    // Execute move if destination is legal
    if (selectedSquare && legalMoves.includes(square)) {
      handleAttemptMove(selectedSquare, square);
      return;
    }

    const piece = puzzleGame.get(square);
    if (piece && piece.color === puzzleGame.turn()) {
      setSelectedSquare(square);
      setLegalMoves(puzzleGame.moves({ square, verbose: true }).map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handlePieceDrop = (from, to) => {
    if (puzzleStatus !== 'playing') return;
    handleAttemptMove(from, to);
  };

  const handleAttemptMove = (from, to) => {
    const expectedMove = currentPuzzle.solution[moveStep];

    try {
      const piece = puzzleGame.get(from);
      const isPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && to[1] === '8') ||
          (piece.color === 'b' && to[1] === '1'));

      const moveRes = puzzleGame.move({
        from,
        to,
        promotion: isPromotion ? (expectedMove?.promotion || 'q') : undefined,
      });

      if (!moveRes) return;

      setLastMove({ from, to });
      setSelectedSquare(null);
      setLegalMoves([]);

      // Check if move matches solution
      const isCorrect = expectedMove && from === expectedMove.from && to === expectedMove.to;

      if (isCorrect) {
        soundManager.playMove();
        const nextStep = moveStep + 1;

        if (nextStep >= currentPuzzle.solution.length) {
          // Solved!
          setPuzzleStatus('solved');
          soundManager.playGameOver(true);
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#8B5CF6', '#06B6D4', '#ffffff'],
            });
          } catch {}
          const updated = updatePuzzleResult(true, currentPuzzle.rating);
          setStats(updated);
        } else {
          setMoveStep(nextStep);
        }
      } else {
        // Wrong move
        setPuzzleStatus('failed');
        soundManager.playInvalid();
        const updated = updatePuzzleResult(false, currentPuzzle.rating);
        setStats(updated);
      }
    } catch {
      soundManager.playInvalid();
    }
  };

  const handleRetry = () => {
    const newG = new Chess(currentPuzzle.fen);
    setPuzzleGame(newG);
    setMoveStep(0);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintMove(null);
    setShowHintText(false);
    setPuzzleStatus('playing');
  };

  const handleNextPuzzle = () => {
    setPuzzleIndex((prev) => prev + 1);
  };

  const handleShowHint = () => {
    const expected = currentPuzzle.solution[moveStep];
    if (expected) {
      setHintMove({ from: expected.from, to: expected.to });
      setShowHintText(true);
      soundManager.playNotify();
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6">
      {/* Left Column: Chess Board */}
      <div className="flex flex-col w-full max-w-[600px] gap-3">
        <ChessBoard
          board={puzzleGame.board()}
          turn={puzzleGame.turn()}
          orientation={currentPuzzle.turn}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          hintMove={hintMove}
          onSquareClick={handleSquareClick}
          onPieceDrop={handlePieceDrop}
          theme={theme}
          showLegalMoves={true}
          showCoordinates={true}
          isInteractive={puzzleStatus === 'playing'}
        />
      </div>

      {/* Right Column: Puzzle Details & Stats */}
      <div className="flex flex-col w-full max-w-[600px] lg:max-w-[380px] gap-3.5">
        {/* User Stats Card */}
        <div className="grid grid-cols-3 gap-2.5 bg-[#111827] border border-[#1f293d] rounded-2xl p-3.5 shadow-xl text-center">
          <div className="bg-[#182131] p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tactics Rating</span>
            <span className="text-lg font-black text-cyan-400 font-mono flex items-center justify-center gap-1">
              <Trophy size={16} className="text-cyan-400" />
              {stats.rating}
            </span>
          </div>

          <div className="bg-[#182131] p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <span className="text-lg font-black text-amber-400 font-mono flex items-center justify-center gap-1">
              <Flame size={16} className="text-amber-400" />
              {stats.streak}
            </span>
          </div>

          <div className="bg-[#182131] p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Solved</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {stats.solved}
            </span>
          </div>
        </div>

        {/* Puzzle Mission Card */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                Puzzle #{puzzleIndex + 1}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{currentPuzzle.title}</h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#182131] text-cyan-300 border border-cyan-500/30">
              {currentPuzzle.rating} ELO
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30 font-semibold">
              {currentPuzzle.theme}
            </span>
            <span>
              Find the best move for{' '}
              <strong className="text-white capitalize">{currentPuzzle.turn === 'w' ? 'White' : 'Black'}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {currentPuzzle.description}
          </p>

          {/* Solution Feedback Notification */}
          {puzzleStatus === 'solved' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in zoom-in-95">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Brilliant! You found the winning continuation (+15 Rating).</span>
            </div>
          )}

          {puzzleStatus === 'failed' && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs font-semibold animate-in zoom-in-95">
              <XCircle size={18} className="text-red-400 shrink-0" />
              <span>Not the optimal move. Reset and try another idea.</span>
            </div>
          )}

          {showHintText && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 shrink-0" />
              <span>{currentPuzzle.hint}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {puzzleStatus === 'playing' ? (
              <button
                onClick={handleShowHint}
                className="flex-1 py-2.5 rounded-xl bg-[#182131] hover:bg-[#222f46] text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <HelpCircle size={15} className="text-cyan-400" />
                <span>Show Hint</span>
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 rounded-xl bg-[#182131] hover:bg-[#222f46] text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw size={15} />
                <span>Retry</span>
              </button>
            )}

            <button
              onClick={handleNextPuzzle}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs font-bold text-white shadow-glow-subtle flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Next Puzzle</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

