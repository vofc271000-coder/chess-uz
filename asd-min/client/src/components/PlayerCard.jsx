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
  // Format milliseconds to MM:SS
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
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-[#272522] border-l-4 border-l-[#81b64c] shadow-md shadow-black/20'
          : 'bg-[#1e1d1a] border-l-4 border-l-transparent opacity-85'
      }`}
    >
      {/* Player info & captured pieces */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-inner ${
            player.isAi ? 'bg-amber-600/20 text-amber-400' : 'bg-emerald-600/20 text-emerald-400'
          }`}
        >
          {player.isAi ? <Bot size={22} /> : <User size={22} />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-100 text-sm sm:text-base leading-tight">
              {player.name}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-gray-400">
              {player.color === 'w' ? 'White' : 'Black'}
            </span>
            {isThinking && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 animate-pulse font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Thinking...
              </span>
            )}
          </div>

          {/* Captured pieces & Material Advantage */}
          <div className="flex items-center gap-1.5 mt-1 min-h-[20px]">
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
              <span className="text-xs font-bold text-emerald-400 ml-1">
                +{materialScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clock Display */}
      {timeMs !== null && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-lg sm:text-xl tracking-tight transition-colors shadow-inner ${
            isLowTime && isActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : isActive
              ? 'bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30'
              : 'bg-black/30 text-gray-300'
          }`}
        >
          <Clock size={16} className={isActive ? 'animate-spin' : 'opacity-50'} style={{ animationDuration: '4s' }} />
          <span>{formatTime(timeMs)}</span>
        </div>
      )}
    </div>
  );
};

