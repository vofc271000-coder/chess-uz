import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Eye, Award, XCircle, MinusCircle } from 'lucide-react';

export const GameOverModal = ({
  isOpen,
  onClose,
  result, // { winner: 'white' | 'black' | 'draw', reason: 'checkmate' | 'timeout' | ..., message: string }
  playerColor = 'w', // player's color if single player or online
  mode = 'ai',
  onRematch,
  onNewGame,
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
          colors: ['#81b64c', '#eab308', '#ffffff', '#3b82f6'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#21201d] border border-[#3c3934] rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isDraw ? 'bg-amber-400' : isWin ? 'bg-[#81b64c]' : 'bg-red-500'
          }`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
            isDraw
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : isWin
              ? 'bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {isDraw ? (
            <MinusCircle size={32} />
          ) : isWin ? (
            <Trophy size={32} />
          ) : (
            <XCircle size={32} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-100 tracking-tight mb-1">
          {title}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-sm font-medium text-gray-400 mb-6 px-2">
          {result.message || (isDraw ? 'Draw by mutual agreement' : `${result.winner} is victorious`)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRematch}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#81b64c] hover:bg-[#90c558] active:bg-[#6f9e40] text-white font-bold text-sm shadow-lg shadow-[#81b64c]/20 transition-all hover:scale-[1.02]"
          >
            <RefreshCw size={17} />
            <span>Rematch</span>
          </button>

          <button
            onClick={onNewGame}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b2925] hover:bg-[#383530] border border-[#3c3934] text-gray-200 font-semibold text-sm transition-colors"
          >
            <span>New Game</span>
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Eye size={14} />
            <span>Review Final Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};

