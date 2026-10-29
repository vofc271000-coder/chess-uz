import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Eye, Award, XCircle, MinusCircle, Search } from 'lucide-react';

export const GameOverModal = ({
  isOpen,
  onClose,
  result, // { winner: 'white' | 'black' | 'draw', reason: 'checkmate' | 'timeout' | ..., message: string }
  playerColor = 'w',
  mode = 'ai',
  onRematch,
  onNewGame,
  onAnalyze,
}) => {
  useEffect(() => {
    if (!isOpen || !result) return;

    const isWin =
      (result.winner === 'white' && playerColor === 'w') ||
      (result.winner === 'black' && playerColor === 'b') ||
      (mode === 'local' && result.winner !== 'draw');

    if (isWin) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#06B6D4', '#ffffff', '#eab308'],
        });
      } catch {}
    }
  }, [isOpen, result, playerColor, mode]);

  if (!isOpen || !result) return null;

  const isDraw = result.winner === 'draw';
  const isWin =
    mode === 'local'
      ? !isDraw
      : (result.winner === 'white' && playerColor === 'w') ||
        (result.winner === 'black' && playerColor === 'b');

  const title = isDraw
    ? 'Game Drawn'
    : mode === 'local'
    ? `${result.winner.toUpperCase()} Wins!`
    : isWin
    ? 'Victory!'
    : 'Defeat';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#182131] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none ${
            isDraw ? 'bg-amber-400' : isWin ? 'bg-cyan-400' : 'bg-red-500'
          }`}
        />

        {/* Outcome Icon */}
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
            isDraw
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : isWin
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {isDraw ? (
            <MinusCircle size={34} />
          ) : isWin ? (
            <Trophy size={34} />
          ) : (
            <XCircle size={34} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {title}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-sm font-medium text-slate-300 mb-6 px-2">
          {result.message || (isDraw ? 'Draw by mutual agreement' : `${result.winner} is victorious`)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRematch}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-subtle transition-all hover:scale-[1.02]"
          >
            <RefreshCw size={16} />
            <span>Rematch</span>
          </button>

          {onAnalyze && (
            <button
              onClick={onAnalyze}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-[#222f46] text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              <Search size={15} className="text-cyan-400" />
              <span>Review in Analysis Studio</span>
            </button>
          )}

          <button
            onClick={onNewGame}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close & New Match
          </button>
        </div>
      </div>
    </div>
  );
};
