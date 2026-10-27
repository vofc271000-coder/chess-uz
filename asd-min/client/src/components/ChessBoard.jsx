import React, { useState } from 'react';
import { ChessPiece } from '../utils/chessPieces';

const THEMES = {
  green: {
    light: '#ebecd0',
    dark: '#739552',
    lightText: '#739552',
    darkText: '#ebecd0',
  },
  dark: {
    light: '#9aaab6',
    dark: '#4d5a63',
    lightText: '#4d5a63',
    darkText: '#9aaab6',
  },
  wood: {
    light: '#f0d9b5',
    dark: '#b58863',
    lightText: '#b58863',
    darkText: '#f0d9b5',
  },
  blue: {
    light: '#eaeff5',
    dark: '#4b7399',
    lightText: '#4b7399',
    darkText: '#eaeff5',
  },
};

export const ChessBoard = ({
  board, // 8x8 array from chess.board()
  turn, // 'w' | 'b'
  orientation = 'w', // 'w' | 'b'
  selectedSquare,
  legalMoves = [], // array of legal destination square strings, e.g. ['e4', 'e3']
  lastMove = null, // { from: 'e2', to: 'e4' } or null
  inCheckKingSquare = null, // square string e.g. 'e1' or null
  onSquareClick,
  onPieceDrop,
  theme = 'green',
  showLegalMoves = true,
  showCoordinates = true,
  isInteractive = true,
}) => {
  const [draggedSquare, setDraggedSquare] = useState(null);

  const colors = THEMES[theme] || THEMES.green;
  const isFlipped = orientation === 'b';

  // Files & Ranks for coordinates
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // Convert row & col index to square notation based on orientation
  const getSquareName = (r, c) => {
    const file = displayFiles[c];
    const rank = displayRanks[r];
    return `${file}${rank}`;
  };

  // Convert square notation to 8x8 board indices
  const getPieceAt = (r, c) => {
    const actualRow = isFlipped ? 7 - r : r;
    const actualCol = isFlipped ? 7 - c : c;
    return board[actualRow]?.[actualCol] || null;
  };

  const handleDragStart = (e, square, piece) => {
    if (!isInteractive || !piece) return;
    setDraggedSquare(square);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
    onSquareClick(square);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const sourceSquare = draggedSquare || e.dataTransfer.getData('text/plain');
    setDraggedSquare(null);

    if (sourceSquare && targetSquare && sourceSquare !== targetSquare) {
      onPieceDrop(sourceSquare, targetSquare);
    }
  };

  return (
    <div className="relative aspect-square w-full max-w-[600px] select-none rounded-lg overflow-hidden shadow-2xl border-4 border-[#2b2925] bg-[#21201d]">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {displayRanks.map((rank, r) =>
          displayFiles.map((file, c) => {
            const square = `${file}${rank}`;
            const piece = getPieceAt(r, c);

            // Chess coloring: (fileIdx + rankIdx) % 2 === 0 is light
            const fileIdx = files.indexOf(file);
            const rankIdx = parseInt(rank, 10);
            const isLight = (fileIdx + rankIdx) % 2 !== 0;

            const isSelected = selectedSquare === square;
            const isLegalDest = showLegalMoves && legalMoves.includes(square);
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isKingInCheck = inCheckKingSquare === square;

            const bgColor = isLight ? colors.light : colors.dark;
            const textColor = isLight ? colors.lightText : colors.darkText;

            return (
              <div
                key={square}
                onClick={() => isInteractive && onSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => isInteractive && handleDrop(e, square)}
                style={{ backgroundColor: bgColor }}
                className={`relative flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                  isSelected ? 'ring-inset ring-4 ring-yellow-400/80' : ''
                }`}
              >
                {/* Last Move Highlight */}
                {isLastMove && (
                  <div className="absolute inset-0 bg-yellow-300/35 pointer-events-none" />
                )}

                {/* Selected Square Highlight */}
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-400/40 pointer-events-none" />
                )}

                {/* King in Check Highlight */}
                {isKingInCheck && (
                  <div className="absolute inset-0 bg-red-600/60 animate-pulse pointer-events-none" />
                )}

                {/* Piece Vector */}
                {piece && (
                  <div
                    draggable={isInteractive && piece.color === turn}
                    onDragStart={(e) => handleDragStart(e, square, piece)}
                    className={`w-[85%] h-[85%] flex items-center justify-center transition-transform ${
                      piece.color === turn && isInteractive
                        ? 'cursor-grab active:cursor-grabbing hover:scale-105'
                        : 'cursor-default'
                    }`}
                  >
                    <ChessPiece type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Legal Move Indicators */}
                {isLegalDest && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {piece ? (
                      // Capture ring
                      <div className="w-[85%] h-[85%] rounded-full border-4 border-black/30 dark:border-black/40 scale-100 animate-in zoom-in-75 duration-150" />
                    ) : (
                      // Move dot
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/25 dark:bg-black/30 shadow-sm" />
                    )}
                  </div>
                )}

                {/* Coordinates */}
                {showCoordinates && (
                  <>
                    {/* Rank label on leftmost column */}
                    {c === 0 && (
                      <span
                        style={{ color: textColor }}
                        className="absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold leading-none pointer-events-none opacity-85"
                      >
                        {rank}
                      </span>
                    )}
                    {/* File label on bottom row */}
                    {r === 7 && (
                      <span
                        style={{ color: textColor }}
                        className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold leading-none pointer-events-none opacity-85"
                      >
                        {file}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

