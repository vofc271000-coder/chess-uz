import React, { useState } from 'react';
import { ChessPiece } from '../utils/chessPieces';

export const THEMES = {
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    light: '#ede9fe',
    dark: '#5b21b6',
    lightText: '#5b21b6',
    darkText: '#ede9fe',
    accent: '#8b5cf6',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    light: '#e0f2fe',
    dark: '#0369a1',
    lightText: '#0369a1',
    darkText: '#e0f2fe',
    accent: '#06b6d4',
  },
  green: {
    id: 'green',
    name: 'Tournament Emerald',
    light: '#ebecd0',
    dark: '#739552',
    lightText: '#739552',
    darkText: '#ebecd0',
    accent: '#84cc16',
  },
  wood: {
    id: 'wood',
    name: 'GrandMaster Wood',
    light: '#f0d9b5',
    dark: '#b58863',
    lightText: '#b58863',
    darkText: '#f0d9b5',
    accent: '#d97706',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Carbon Obsidian',
    light: '#cbd5e1',
    dark: '#334155',
    lightText: '#334155',
    darkText: '#cbd5e1',
    accent: '#64748b',
  },
};

export const ChessBoard = ({
  board, // 8x8 array from chess.board()
  turn, // 'w' | 'b'
  orientation = 'w', // 'w' | 'b'
  selectedSquare,
  legalMoves = [], // array of legal destination square strings, e.g. ['e4', 'e3']
  lastMove = null, // { from: 'e2', to: 'e4' } or null
  hintMove = null, // { from: 'e2', to: 'e4' } or null
  inCheckKingSquare = null, // square string e.g. 'e1' or null
  onSquareClick,
  onPieceDrop,
  theme = 'violet',
  showLegalMoves = true,
  showCoordinates = true,
  isInteractive = true,
}) => {
  const [draggedSquare, setDraggedSquare] = useState(null);

  const colors = THEMES[theme] || THEMES.violet;
  const isFlipped = orientation === 'b';

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

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
      if (onPieceDrop) {
        onPieceDrop(sourceSquare, targetSquare);
      } else {
        onSquareClick(targetSquare);
      }
    }
  };

  return (
    <div className="relative aspect-square w-full select-none rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/60 bg-[#0d121f] transition-all">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {displayRanks.map((rank, r) =>
          displayFiles.map((file, c) => {
            const square = `${file}${rank}`;
            const piece = getPieceAt(r, c);

            const fileIdx = files.indexOf(file);
            const rankIdx = parseInt(rank, 10);
            const isLight = (fileIdx + rankIdx) % 2 !== 0;

            const isSelected = selectedSquare === square;
            const isLegalDest = showLegalMoves && legalMoves.includes(square);
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isKingInCheck = inCheckKingSquare === square;
            const isHintFrom = hintMove && hintMove.from === square;
            const isHintTo = hintMove && hintMove.to === square;

            const bgColor = isLight ? colors.light : colors.dark;
            const textColor = isLight ? colors.lightText : colors.darkText;

            return (
              <div
                key={square}
                onClick={() => isInteractive && onSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => isInteractive && handleDrop(e, square)}
                style={{ backgroundColor: bgColor }}
                className={`relative flex items-center justify-center transition-colors duration-100 cursor-pointer ${
                  isSelected ? 'ring-inset ring-4 ring-cyan-400' : ''
                }`}
              >
                {/* Last Move Indicator */}
                {isLastMove && (
                  <div className="absolute inset-0 bg-amber-400/30 pointer-events-none" />
                )}

                {/* Selected Square Highlight */}
                {isSelected && (
                  <div className="absolute inset-0 bg-cyan-400/35 pointer-events-none" />
                )}

                {/* Hint Source and Destination Highlights */}
                {isHintFrom && (
                  <div className="absolute inset-0 bg-emerald-400/40 ring-inset ring-2 ring-emerald-400 pointer-events-none animate-pulse" />
                )}
                {isHintTo && (
                  <div className="absolute inset-0 bg-emerald-500/30 ring-inset ring-4 ring-emerald-400 pointer-events-none animate-pulse" />
                )}

                {/* King in Check Pulsing Glow */}
                {isKingInCheck && (
                  <div className="absolute inset-0 bg-red-600/70 animate-pulse pointer-events-none shadow-[inset_0_0_20px_rgba(239,68,68,0.9)]" />
                )}

                {/* Piece Vector Graphics */}
                {piece && (
                  <div
                    draggable={isInteractive && piece.color === turn}
                    onDragStart={(e) => handleDragStart(e, square, piece)}
                    className={`w-[86%] h-[86%] flex items-center justify-center filter drop-shadow transition-transform ${
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
                      <div className="w-[85%] h-[85%] rounded-full border-4 border-black/35 dark:border-black/50 scale-100 animate-in zoom-in-75 duration-100" />
                    ) : (
                      // Move destination dot
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/30 dark:bg-black/35 shadow-inner" />
                    )}
                  </div>
                )}

                {/* Algebraic Coordinates */}
                {showCoordinates && (
                  <>
                    {/* Rank number on leftmost column */}
                    {c === 0 && (
                      <span
                        style={{ color: textColor }}
                        className="absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold leading-none pointer-events-none opacity-80"
                      >
                        {rank}
                      </span>
                    )}
                    {/* File letter on bottom row */}
                    {r === 7 && (
                      <span
                        style={{ color: textColor }}
                        className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold leading-none pointer-events-none opacity-80"
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
