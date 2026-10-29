import React from 'react';
import { User, Bot, Clock } from 'lucide-react';
import { ChessPiece } from '../utils/chessPieces';

export const PlayerCard = ({
  player, // { name: 'Stockfish AI', isAi: true, color: 'b' }
  timeMs, // time in milliseconds or null (unlimited)
  isActive,
  isThinking = false,
  capturedPieces = [], // array of piece type characters ['p', 'p', 'n']
  materialScore = 0, // e.g. +3
}) => {
  const formatTime = (ms) => {
    if (ms === null || ms === undefined) return '∞';
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (totalSeconds < 10) {
      const tenths = Math.floor((ms % 1000) / 100);
      return `${seconds}.${tenths}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeMs !== null && timeMs < 30000;

  return (
    <div
      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all duration-200 select-none ${
        isActive
          ? 'bg-[#182131] border-l-4 border-l-cyan-400 shadow-glow-subtle border-y border-r border-slate-700/60'
          : 'bg-[#111827] border-l-4 border-l-transparent opacity-80 border-y border-r border-[#1f293d]'
      }`}
    >
      {/* Player Identity & Captured Pieces */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold shadow-inner ${
            player.isAi
              ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
              : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
          }`}
        >
          {player.isAi ? <Bot size={20} /> : <User size={20} />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-xs sm:text-sm tracking-tight leading-tight">
              {player.name}
            </span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                player.color === 'w'
                  ? 'bg-slate-200 text-slate-900 font-black'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {player.color === 'w' ? 'White' : 'Black'}
            </span>
            {isThinking && (
              <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Thinking...
              </span>
            )}
          </div>

          {/* Captured Pieces & Material Advantage */}
          <div className="flex items-center gap-1 mt-1 min-h-[18px]">
            <div className="flex items-center -space-x-1">
              {capturedPieces.map((pieceType, idx) => (
                <div key={idx} className="w-4 h-4 opacity-80 hover:opacity-100 transition-opacity">
                  <ChessPiece
                    type={pieceType}
                    color={player.color === 'w' ? 'b' : 'w'}
                    size="100%"
                  />
                </div>
              ))}
            </div>
            {materialScore > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 ml-1.5 px-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                +{materialScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Digital Tournament Clock */}
      {timeMs !== null && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-base sm:text-lg tracking-tight transition-all shadow-inner ${
            isLowTime && isActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/60 animate-pulse'
              : isActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
              : 'bg-[#080B12] text-slate-400 border border-[#1f293d]'
          }`}
        >
          <Clock size={15} className={isActive ? 'animate-spin-slow text-cyan-400' : 'opacity-40'} />
          <span>{formatTime(timeMs)}</span>
        </div>
      )}
    </div>
  );
};
