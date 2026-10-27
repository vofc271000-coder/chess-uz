import React from 'react';
import { ChessPiece } from '../utils/chessPieces';

export const PromotionModal = ({ color, onSelect }) => {
  const pieces = ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#21201d] border border-[#3c3934] rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center">
        <h3 className="text-xl font-bold text-gray-100 mb-2">Promote Pawn</h3>
        <p className="text-sm text-gray-400 mb-6">Choose a piece to replace your promoted pawn</p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="group flex flex-col items-center justify-center p-3 rounded-lg bg-[#2b2925] hover:bg-[#383530] border border-transparent hover:border-[#81b64c] transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-14 h-14 flex items-center justify-center">
                <ChessPiece type={pieceType} color={color} size="100%" />
              </div>
              <span className="text-xs uppercase font-semibold text-gray-300 mt-2 group-hover:text-[#81b64c]">
                {pieceType === 'q' ? 'Queen' : pieceType === 'r' ? 'Rook' : pieceType === 'b' ? 'Bishop' : 'Knight'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

