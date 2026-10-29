import React from 'react';
import { ChessPiece } from '../utils/chessPieces';

export const PromotionModal = ({ color, onSelect }) => {
  const pieces = ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#182131] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center">
        <h3 className="text-xl font-black text-white mb-1.5 tracking-tight">Pawn Promotion</h3>
        <p className="text-xs text-slate-400 mb-6">Select a piece to promote your pawn to</p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#111827] hover:bg-[#222f46] border border-slate-700/80 hover:border-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="w-13 h-13 flex items-center justify-center">
                <ChessPiece type={pieceType} color={color} size="100%" />
              </div>
              <span className="text-[11px] uppercase font-bold text-slate-300 mt-2 group-hover:text-cyan-400">
                {pieceType === 'q' ? 'Queen' : pieceType === 'r' ? 'Rook' : pieceType === 'b' ? 'Bishop' : 'Knight'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
