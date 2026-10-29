import React from 'react';

/**
 * Animated Chess Evaluation Bar
 * @param {number} score - numeric evaluation in pawns (e.g. +1.5, -0.8)
 * @param {boolean} isMate - whether a forced checkmate is detected
 * @param {number} mateIn - moves to mate (positive for white, negative for black)
 * @param {string} orientation - 'w' | 'b'
 */
export const EvaluationBar = ({
  score = 0,
  isMate = false,
  mateIn = 0,
  orientation = 'w',
}) => {
  // Convert score into percentage for White (0% = totally Black, 100% = totally White)
  let whitePercent = 50;

  if (isMate) {
    whitePercent = mateIn > 0 ? 100 : 0;
  } else {
    // Sigmoid curve mapping -10 to +10 pawns into 5% to 95%
    const cappedScore = Math.max(-10, Math.min(10, score));
    whitePercent = 50 + (cappedScore / 10) * 45;
  }

  // If board is flipped (Black at bottom), invert display
  const topPercent = orientation === 'b' ? whitePercent : 100 - whitePercent;

  let displayLabel = '0.0';
  if (isMate) {
    displayLabel = `M${Math.abs(mateIn)}`;
  } else {
    displayLabel = score > 0 ? `+${score.toFixed(1)}` : score < 0 ? score.toFixed(1) : '0.0';
  }

  return (
    <div className="relative w-4 sm:w-5 h-full min-h-[300px] sm:min-h-[400px] max-h-[600px] rounded-lg overflow-hidden bg-slate-900 border border-slate-700/80 flex flex-col shadow-lg select-none">
      {/* Black's share (top or bottom based on orientation) */}
      <div
        style={{ height: `${topPercent}%` }}
        className="w-full bg-[#111827] transition-all duration-300 ease-out"
      />

      {/* White's share */}
      <div
        style={{ height: `${100 - topPercent}%` }}
        className="w-full bg-slate-200 transition-all duration-300 ease-out"
      />

      {/* Evaluation Value Badge */}
      <div className="absolute inset-x-0 bottom-1 flex justify-center pointer-events-none">
        <span className="text-[10px] font-mono font-black px-1 rounded bg-black/75 text-cyan-400 border border-cyan-500/30 shadow">
          {displayLabel}
        </span>
      </div>
    </div>
  );
};

