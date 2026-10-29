import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import {
  Play,
  RotateCcw,
  Upload,
  Copy,
  Check,
  Cpu,
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  BookOpen,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { EvaluationBar } from './EvaluationBar';
import { stockfishEngine } from '../utils/stockfishEngine';
import { identifyOpening } from '../utils/openings';
import { soundManager } from '../utils/sound';

export const AnalysisView = ({ theme = 'violet', soundEnabled = true }) => {
  const [analysisGame, setAnalysisGame] = useState(() => new Chess());
  const [fen, setFen] = useState(() => new Chess().fen());
  const [orientation, setOrientation] = useState('w');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [historyMoves, setHistoryMoves] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);

  // Engine evaluation state
  const [isEngineActive, setIsEngineActive] = useState(true);
  const [engineEval, setEngineEval] = useState({ score: 0, isMate: false, mateIn: 0, depth: 0, pv: null });
  const [bestMoveHint, setBestMoveHint] = useState(null);

  // FEN input modal state
  const [fenInput, setFenInput] = useState('');
  const [fenError, setFenError] = useState(null);
  const [showFenDialog, setShowFenDialog] = useState(false);
  const [copiedFen, setCopiedFen] = useState(false);

  // Setup Stockfish evaluation listener
  useEffect(() => {
    stockfishEngine.onEvaluationUpdate = (evalData) => {
      setEngineEval(evalData);
      if (evalData.pv && evalData.pv.length >= 4) {
        const from = evalData.pv.slice(0, 2);
        const to = evalData.pv.slice(2, 4);
        setBestMoveHint({ from, to });
      }
    };

    return () => {
      stockfishEngine.onEvaluationUpdate = null;
      stockfishEngine.stop();
    };
  }, []);

  // Trigger evaluation when FEN changes
  useEffect(() => {
    if (isEngineActive) {
      stockfishEngine.evaluatePosition(fen, 14);
    } else {
      stockfishEngine.stop();
    }
  }, [fen, isEngineActive]);

  const detectedOpening = identifyOpening(historyMoves.map((m) => m.san));

  // Square Click Handler
  const handleSquareClick = (square) => {
    // If a piece is already selected and target is a legal move
    if (selectedSquare && legalMoves.includes(square)) {
      try {
        const piece = analysisGame.get(selectedSquare);
        const isPromotion =
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') ||
            (piece.color === 'b' && square[1] === '1'));

        const moveRes = analysisGame.move({
          from: selectedSquare,
          to: square,
          promotion: isPromotion ? 'q' : undefined,
        });

        if (moveRes) {
          setFen(analysisGame.fen());
          setLastMove({ from: selectedSquare, to: square });
          setHistoryMoves((prev) => [...prev, moveRes]);
          setSelectedSquare(null);
          setLegalMoves([]);
          setHistoryIndex(null);
          setBestMoveHint(null);

          if (moveRes.captured) soundManager.playCapture();
          else soundManager.playMove();
          return;
        }
      } catch (err) {
        console.error('Move error:', err);
      }
    }

    // Square selection
    const piece = analysisGame.get(square);
    if (piece && piece.color === analysisGame.turn()) {
      setSelectedSquare(square);
      const moves = analysisGame.moves({ square, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    try {
      const piece = analysisGame.get(sourceSquare);
      if (!piece || piece.color !== analysisGame.turn()) return;

      const isPromotion =
        piece.type === 'p' &&
        ((piece.color === 'w' && targetSquare[1] === '8') ||
          (piece.color === 'b' && targetSquare[1] === '1'));

      const moveRes = analysisGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: isPromotion ? 'q' : undefined,
      });

      if (moveRes) {
        setFen(analysisGame.fen());
        setLastMove({ from: sourceSquare, to: targetSquare });
        setHistoryMoves((prev) => [...prev, moveRes]);
        setSelectedSquare(null);
        setLegalMoves([]);
        setHistoryIndex(null);
        setBestMoveHint(null);

        if (moveRes.captured) soundManager.playCapture();
        else soundManager.playMove();
      }
    } catch {}
  };

  const handleResetToStart = () => {
    const newG = new Chess();
    setAnalysisGame(newG);
    setFen(newG.fen());
    setHistoryMoves([]);
    setHistoryIndex(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setBestMoveHint(null);
  };

  const handleLoadFen = (e) => {
    e.preventDefault();
    if (!fenInput.trim()) return;

    try {
      const g = new Chess(fenInput.trim());
      setAnalysisGame(g);
      setFen(g.fen());
      setHistoryMoves([]);
      setHistoryIndex(null);
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove(null);
      setShowFenDialog(false);
      setFenError(null);
      soundManager.playNotify();
    } catch (err) {
      setFenError('Invalid FEN position string. Please verify standard chess notation.');
    }
  };

  const copyCurrentFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6">
      {/* Left Column: Board + Evaluation Bar */}
      <div className="flex items-center gap-3 w-full max-w-[620px]">
        {/* Real-time Vertical Evaluation Bar */}
        <EvaluationBar
          score={engineEval.score}
          isMate={engineEval.isMate}
          mateIn={engineEval.mateIn}
          orientation={orientation}
        />

        {/* 8x8 Chessboard */}
        <div className="flex-1">
          <ChessBoard
            board={analysisGame.board()}
            turn={analysisGame.turn()}
            orientation={orientation}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            hintMove={bestMoveHint}
            inCheckKingSquare={analysisGame.isCheck() ? findKingSquare(analysisGame) : null}
            onSquareClick={handleSquareClick}
            onPieceDrop={handlePieceDrop}
            theme={theme}
            showLegalMoves={true}
            showCoordinates={true}
            isInteractive={true}
          />
        </div>
      </div>

      {/* Right Column: Engine Stats + Opening Explorer + Controls */}
      <div className="flex flex-col w-full max-w-[620px] lg:max-w-[380px] gap-3">
        {/* Engine Dashboard Card */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Stockfish 10 Engine</h3>
            </div>
            <button
              onClick={() => setIsEngineActive((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isEngineActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isEngineActive ? 'Calculating...' : 'Paused'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 text-center">
            <div className="bg-[#182131] p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Evaluation</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                {engineEval.isMate
                  ? `M${Math.abs(engineEval.mateIn)}`
                  : engineEval.score > 0
                  ? `+${engineEval.score.toFixed(2)}`
                  : engineEval.score.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#182131] p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Depth</span>
              <span className="text-base font-black text-violet-400 font-mono">
                {engineEval.depth || 0}
              </span>
            </div>
            <div className="bg-[#182131] p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Turn</span>
              <span className="text-base font-black text-slate-200 capitalize">
                {analysisGame.turn() === 'w' ? 'White' : 'Black'}
              </span>
            </div>
          </div>

          {bestMoveHint && (
            <div className="mt-2 p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-cyan-400" />
                <span className="text-slate-300">Best engine move:</span>
              </div>
              <span className="font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-black/40 border border-cyan-500/30">
                {bestMoveHint.from} → {bestMoveHint.to}
              </span>
            </div>
          )}
        </div>

        {/* Opening Detection Box */}
        {detectedOpening && (
          <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-3.5 shadow-xl">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold mb-1">
              <BookOpen size={16} />
              <span>Identified Opening</span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="text-cyan-400 font-mono">[{detectedOpening.eco}]</span>
              <span>{detectedOpening.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {detectedOpening.desc}
            </p>
          </div>
        )}

        {/* FEN Box & Tools */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FEN Notation</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyCurrentFen}
                className="px-2.5 py-1 rounded-lg bg-[#182131] hover:bg-[#222f46] text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {copiedFen ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>Copy</span>
              </button>
              <button
                onClick={() => setShowFenDialog(true)}
                className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-glow-subtle flex items-center gap-1 transition-colors"
              >
                <Upload size={12} />
                <span>Load FEN</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080B12] border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
            {fen}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setOrientation((prev) => (prev === 'w' ? 'b' : 'w'))}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-[#222f46] text-xs font-semibold text-slate-200 border border-[#1f293d]"
            >
              <RotateCcw size={14} />
              <span>Flip Orientation</span>
            </button>
            <button
              onClick={handleResetToStart}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-[#1f293d]"
            >
              <RefreshCw size={14} />
              <span>Reset Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Load FEN Dialog */}
      {showFenDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Load FEN Position</h4>
            <p className="text-xs text-slate-400 mb-3">
              Paste a Forsyth-Edwards Notation (FEN) string to explore and analyze any board setup:
            </p>
            <form onSubmit={handleLoadFen} className="space-y-3">
              <textarea
                rows={3}
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
                className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              {fenError && (
                <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2 rounded-lg">
                  {fenError}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFenDialog(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold text-white shadow-lg"
                >
                  Load Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function findKingSquare(chess) {
  const currentTurn = chess.turn();
  const board = chess.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === currentTurn) {
        return `${files[c]}${ranks[r]}`;
      }
    }
  }
  return null;
}

