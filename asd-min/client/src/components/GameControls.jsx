import React, { useState } from 'react';
import { RotateCcw, Undo2, Redo2, Flag, Handshake, Plus, Cpu, ChevronDown } from 'lucide-react';

export const GameControls = ({
  mode, // 'local' | 'ai' | 'online'
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onFlipBoard,
  onResign,
  onOfferDraw,
  onNewGame,
  aiLevel = 3,
  onChangeAiLevel,
  isGameOver = false,
}) => {
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showDrawConfirm, setShowDrawConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const confirmResign = () => {
    setShowResignConfirm(false);
    onResign();
  };

  const confirmDraw = () => {
    setShowDrawConfirm(false);
    onOfferDraw();
  };

  const confirmRestart = () => {
    setShowRestartConfirm(false);
    onNewGame();
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-[#21201d] rounded-xl border border-[#302e2b] shadow-xl">
      {/* AI Difficulty Selector (When in AI mode) */}
      {mode === 'ai' && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#2b2925] rounded-lg border border-[#3c3934] mb-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Cpu size={16} className="text-amber-400" />
            <span>AI Level:</span>
          </div>
          <select
            value={aiLevel}
            onChange={(e) => onChangeAiLevel(Number(e.target.value))}
            className="bg-[#1e1d1a] border border-[#3c3934] rounded px-2 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value={1}>Level 1: Beginner (~800)</option>
            <option value={2}>Level 2: Casual (~1200)</option>
            <option value={3}>Level 3: Intermediate (~1600)</option>
            <option value={4}>Level 4: Master (~2000)</option>
          </select>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Flip Board */}
        <button
          onClick={onFlipBoard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#2b2925] hover:bg-[#383530] border border-[#3a3833] text-xs font-semibold text-gray-200 transition-colors"
          title="Flip board orientation"
        >
          <RotateCcw size={15} />
          <span>Flip</span>
        </button>

        {/* Undo (Local & AI modes) */}
        {mode !== 'online' ? (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#2b2925] hover:bg-[#383530] disabled:opacity-40 disabled:hover:bg-[#2b2925] border border-[#3a3833] text-xs font-semibold text-gray-200 transition-colors"
              title="Undo move"
            >
              <Undo2 size={15} />
              <span>Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#2b2925] hover:bg-[#383530] disabled:opacity-40 disabled:hover:bg-[#2b2925] border border-[#3a3833] text-xs font-semibold text-gray-200 transition-colors"
              title="Redo move"
            >
              <Redo2 size={15} />
              <span>Redo</span>
            </button>
          </>
        ) : (
          /* Offer Draw (Online mode) */
          <button
            onClick={() => setShowDrawConfirm(true)}
            disabled={isGameOver}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#2b2925] hover:bg-[#383530] disabled:opacity-40 border border-[#3a3833] text-xs font-semibold text-gray-200 transition-colors"
            title="Offer draw"
          >
            <Handshake size={15} />
            <span>Draw</span>
          </button>
        )}

        {/* Resign */}
        <button
          onClick={() => setShowResignConfirm(true)}
          disabled={isGameOver}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#2b2925] hover:bg-red-950/40 hover:border-red-800 disabled:opacity-40 border border-[#3a3833] text-xs font-semibold text-red-300 transition-colors"
          title="Resign game"
        >
          <Flag size={15} />
          <span>Resign</span>
        </button>
      </div>

      {/* New Game / Rematch Button */}
      <button
        onClick={() => {
          if (!isGameOver) {
            setShowRestartConfirm(true);
          } else {
            onNewGame();
          }
        }}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#81b64c] hover:bg-[#90c558] active:bg-[#6f9e40] text-white font-bold text-sm shadow-md transition-all mt-1"
      >
        <Plus size={18} />
        <span>{isGameOver ? 'Play Again' : 'New Game'}</span>
      </button>

      {/* Resign Confirmation Dialog */}
      {showResignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#24221e] border border-[#3c3934] rounded-xl p-5 max-w-xs w-full text-center shadow-2xl">
            <h4 className="text-base font-bold text-gray-100 mb-1">Resign Game?</h4>
            <p className="text-xs text-gray-400 mb-4">Are you sure you want to resign and forfeit the match?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#302e2a] hover:bg-[#3a3833] text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmResign}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md"
              >
                Resign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draw Offer Confirmation Dialog */}
      {showDrawConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#24221e] border border-[#3c3934] rounded-xl p-5 max-w-xs w-full text-center shadow-2xl">
            <h4 className="text-base font-bold text-gray-100 mb-1">Offer Draw?</h4>
            <p className="text-xs text-gray-400 mb-4">Your opponent will receive a prompt to accept or decline the draw.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDrawConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#302e2a] hover:bg-[#3a3833] text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDraw}
                className="flex-1 py-2 rounded-lg bg-[#81b64c] hover:bg-[#90c558] text-xs font-bold text-white shadow-md"
              >
                Offer Draw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Active Game Confirmation */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#24221e] border border-[#3c3934] rounded-xl p-5 max-w-xs w-full text-center shadow-2xl">
            <h4 className="text-base font-bold text-gray-100 mb-1">Restart Game?</h4>
            <p className="text-xs text-gray-400 mb-4">This will abandon the current game and set up a fresh board.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#302e2a] hover:bg-[#3a3833] text-xs font-semibold text-gray-300"
              >
                Continue Playing
              </button>
              <button
                onClick={confirmRestart}
                className="flex-1 py-2 rounded-lg bg-[#81b64c] hover:bg-[#90c558] text-xs font-bold text-white shadow-md"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

