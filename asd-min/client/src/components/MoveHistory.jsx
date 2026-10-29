import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  Copy,
  Check,
  Download,
  BookMarked,
} from 'lucide-react';
import { identifyOpening } from '../utils/openings';

export const MoveHistory = ({
  moves = [], // array of move objects: [{ san: 'e4', from, to, ... }]
  currentMoveIndex, // null for latest, or integer index (0-based) of viewed move
  onSelectMoveIndex,
  pgn = '',
  fen = '',
}) => {
  const containerRef = useRef(null);
  const [copiedType, setCopiedType] = useState(null);

  // Auto scroll to bottom when a new move is made if viewing latest
  useEffect(() => {
    if (
      containerRef.current &&
      (currentMoveIndex === null || currentMoveIndex === moves.length - 1)
    ) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves.length, currentMoveIndex]);

  // Group moves into pairs
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

  // Detect current opening
  const sanList = moves.map((m) => m.san);
  const detectedOpening = identifyOpening(sanList);

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadPgn = () => {
    const fullPgn = pgn || '';
    const blob = new Blob([fullPgn], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GrandMaster-Chess-${Date.now()}.pgn`;
    link.click();
    URL.revokeObjectURL(url);
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
    <div className="flex flex-col h-full bg-[#111827] rounded-xl border border-[#1f293d] shadow-xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#182131] border-b border-[#1f293d]">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Move Notation
          </h3>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-1.5 py-0.5 rounded">
            {moves.length}
          </span>
        </div>

        {/* Quick Tools: FEN, PGN, Download */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCopy(fen, 'fen')}
            className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#222f46] text-[10px] font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
            title="Copy current FEN position"
          >
            {copiedType === 'fen' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>FEN</span>
          </button>

          <button
            onClick={() => handleCopy(pgn, 'pgn')}
            className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#222f46] text-[10px] font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
            title="Copy PGN game notation"
          >
            {copiedType === 'pgn' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>PGN</span>
          </button>

          <button
            onClick={handleDownloadPgn}
            className="p-1 rounded bg-[#111827] hover:bg-[#222f46] text-slate-300 border border-slate-700 transition-colors"
            title="Download PGN File"
          >
            <Download size={12} />
          </button>
        </div>
      </div>

      {/* Opening Detector Badge */}
      {detectedOpening && (
        <div className="px-3 py-1.5 bg-violet-950/30 border-b border-violet-900/30 flex items-center gap-1.5 text-[11px]">
          <BookMarked size={13} className="text-violet-400 shrink-0" />
          <span className="font-mono font-bold text-violet-300 shrink-0">
            [{detectedOpening.eco}]
          </span>
          <span className="text-slate-300 font-medium truncate" title={detectedOpening.name}>
            {detectedOpening.name}
          </span>
        </div>
      )}

      {/* Move List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] scrollbar-thin"
      >
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-slate-500 text-xs italic">
            Play moves to view algebraic notation
          </div>
        ) : (
          movePairs.map((pair) => {
            const isWhiteActive = currentMoveIndex === pair.whiteIdx;
            const isBlackActive = currentMoveIndex === pair.blackIdx;

            return (
              <div
                key={pair.number}
                className="grid grid-cols-[36px_1fr_1fr] items-center rounded hover:bg-[#182131] px-1.5 py-0.5 transition-colors"
              >
                <span className="text-[11px] font-semibold text-slate-500 select-none">
                  {pair.number}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onSelectMoveIndex(pair.whiteIdx)}
                  className={`text-left px-2 py-0.5 rounded transition-all font-semibold ${
                    isWhiteActive
                      ? 'bg-violet-600 text-white font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {pair.white}
                </button>

                {/* Black Move */}
                {pair.black ? (
                  <button
                    onClick={() => onSelectMoveIndex(pair.blackIdx)}
                    className={`text-left px-2 py-0.5 rounded transition-all font-semibold ${
                      isBlackActive
                        ? 'bg-violet-600 text-white font-bold shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800'
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

      {/* History Navigation Bar */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-[#182131] border-t border-[#1f293d]">
        <button
          onClick={handleFirst}
          disabled={isAtStart || moves.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Start position"
        >
          <ChevronFirst size={16} />
        </button>

        <button
          onClick={handlePrev}
          disabled={isAtStart || moves.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Previous move"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={handleNext}
          disabled={isAtEnd || moves.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Next move"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={handleLast}
          disabled={isAtEnd || moves.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Current live move"
        >
          <ChevronLast size={16} />
        </button>
      </div>
    </div>
  );
};
