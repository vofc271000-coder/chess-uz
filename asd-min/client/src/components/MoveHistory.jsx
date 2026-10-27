import React, { useEffect, useRef, useState } from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, Copy, Check } from 'lucide-react';

export const MoveHistory = ({
  moves = [], // array of move objects: [{ san: 'e4', from, to, ... }, { san: 'e5' }]
  currentMoveIndex, // null for latest, or integer index (0-based) of viewed move
  onSelectMoveIndex,
  pgn = '',
  fen = '',
}) => {
  const containerRef = useRef(null);
  const [copiedType, setCopiedType] = useState(null);

  // Auto scroll to bottom when a new move is made if we are viewing the latest position
  useEffect(() => {
    if (containerRef.current && (currentMoveIndex === null || currentMoveIndex === moves.length - 1)) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves.length, currentMoveIndex]);

  // Group moves into pairs [ { number: 1, white: 'e4', black: 'e5', whiteIdx: 0, blackIdx: 1 }, ... ]
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i]?.san,
      whiteIdx: i,
      black: moves[i + 1]?.san || null,
      blackIdx: i + 1,
    });
  }

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const isAtStart = currentMoveIndex === -1;
  const isAtEnd = currentMoveIndex === null || currentMoveIndex === moves.length - 1;

  const handleFirst = () => onSelectMoveIndex(-1);
  const handlePrev = () => {
    const target = currentMoveIndex === null ? moves.length - 2 : currentMoveIndex - 1;
    onSelectMoveIndex(Math.max(-1, target));
  };
  const handleNext = () => {
    if (currentMoveIndex === null || currentMoveIndex >= moves.length - 1) return;
    onSelectMoveIndex(currentMoveIndex + 1);
  };
  const handleLast = () => onSelectMoveIndex(null);

  return (
    <div className="flex flex-col h-full bg-[#21201d] rounded-xl border border-[#302e2b] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e1d1a] border-b border-[#302e2b]">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Move History</h3>
        <span className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-0.5 rounded">
          {moves.length} moves
        </span>
      </div>

      {/* Move List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-sm max-h-[300px] lg:max-h-[380px] scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-28 text-gray-500 text-xs italic">
            Moves will appear here as you play
          </div>
        ) : (
          movePairs.map((pair) => {
            const isWhiteActive = currentMoveIndex === pair.whiteIdx;
            const isBlackActive = currentMoveIndex === pair.blackIdx;

            return (
              <div
                key={pair.number}
                className="grid grid-cols-[40px_1fr_1fr] items-center rounded hover:bg-[#2b2925] px-1 py-1 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-500 select-none">
                  {pair.number}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onSelectMoveIndex(pair.whiteIdx)}
                  className={`text-left px-2 py-0.5 rounded transition-all font-medium ${
                    isWhiteActive
                      ? 'bg-[#81b64c] text-white font-bold shadow-sm'
                      : 'text-gray-200 hover:text-white hover:bg-black/20'
                  }`}
                >
                  {pair.white}
                </button>

                {/* Black Move */}
                {pair.black ? (
                  <button
                    onClick={() => onSelectMoveIndex(pair.blackIdx)}
                    className={`text-left px-2 py-0.5 rounded transition-all font-medium ${
                      isBlackActive
                        ? 'bg-[#81b64c] text-white font-bold shadow-sm'
                        : 'text-gray-200 hover:text-white hover:bg-black/20'
                    }`}
                  >
                    {pair.black}
                  </button>
                ) : (
                  <span />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* History Navigation Buttons */}
      <div className="flex items-center justify-center gap-1 p-2 bg-[#1c1b18] border-t border-[#302e2b]">
        <button
          onClick={handleFirst}
          disabled={moves.length === 0 || isAtStart}
          className="p-1.5 rounded hover:bg-[#2e2c28] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
          title="Start of game"
        >
          <ChevronFirst size={18} />
        </button>
        <button
          onClick={handlePrev}
          disabled={moves.length === 0 || isAtStart}
          className="p-1.5 rounded hover:bg-[#2e2c28] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
          title="Previous move"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          disabled={moves.length === 0 || isAtEnd}
          className="p-1.5 rounded hover:bg-[#2e2c28] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
          title="Next move"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={handleLast}
          disabled={moves.length === 0 || isAtEnd}
          className="p-1.5 rounded hover:bg-[#2e2c28] disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
          title="Current move"
        >
          <ChevronLast size={18} />
        </button>
      </div>

      {/* Copy PGN / FEN Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#191816] border-t border-[#292724] text-xs text-gray-400">
        <button
          onClick={() => handleCopy(pgn, 'pgn')}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Copy PGN notation to clipboard"
        >
          {copiedType === 'pgn' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedType === 'pgn' ? 'PGN Copied!' : 'Copy PGN'}</span>
        </button>

        <button
          onClick={() => handleCopy(fen, 'fen')}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Copy FEN position to clipboard"
        >
          {copiedType === 'fen' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedType === 'fen' ? 'FEN Copied!' : 'Copy FEN'}</span>
        </button>
      </div>
    </div>
  );
};

