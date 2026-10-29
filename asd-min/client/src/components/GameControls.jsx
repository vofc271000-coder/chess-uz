import React, { useState } from 'react';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Flag,
  Handshake,
  Plus,
  Cpu,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

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
  onGetHint,
  isHintLoading = false,
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
    <div className="flex flex-col gap-2.5 p-3 bg-[#111827] rounded-xl border border-[#1f293d] shadow-xl select-none">
      {/* AI Difficulty Selector (When in AI mode) */}
      {mode === 'ai' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#182131] rounded-xl border border-slate-700/60 mb-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 shrink-0">
            <Cpu size={15} className="text-violet-400" />
            <span>AI Level:</span>
          </div>
          <div className="relative flex-1 min-w-0">
            <select
              value={aiLevel}
              onChange={(e) => onChangeAiLevel(Number(e.target.value))}
              className="w-full bg-[#111827] border border-violet-500/30 rounded-lg pl-2.5 pr-7 py-1 text-xs text-violet-300 font-bold focus:outline-none focus:border-violet-400 cursor-pointer appearance-none truncate"
            >
              <option value={1}>Lvl 1: Novice (800)</option>
              <option value={2}>Lvl 2: Casual (1200)</option>
              <option value={3}>Lvl 3: Intermediate (1600)</option>
              <option value={4}>Lvl 4: Advanced (1900)</option>
              <option value={5}>Lvl 5: Master (2200)</option>
              <option value={6}>Lvl 6: GrandMaster (2500+)</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none"
            />
          </div>
        </div>
      )}

      {/* Primary Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Flip Board */}
        <button
          onClick={onFlipBoard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-[#222f46] border border-[#1f293d] text-xs font-semibold text-slate-200 transition-colors"
          title="Flip Board"
        >
          <RotateCcw size={15} />
          <span>Flip</span>
        </button>

        {/* Hint Button (AI or Local) */}
        {mode !== 'online' && (
          <button
            onClick={onGetHint}
            disabled={isHintLoading || isGameOver}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/40 text-xs font-bold text-violet-300 transition-colors disabled:opacity-40"
            title="Get AI Best Move Hint"
          >
            <Lightbulb size={15} className={isHintLoading ? 'animate-spin text-cyan-400' : 'text-violet-400'} />
            <span>{isHintLoading ? 'Thinking...' : 'Hint'}</span>
          </button>
        )}

        {/* Undo (Local & AI mode) */}
        {mode !== 'online' ? (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo || isGameOver}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-[#222f46] disabled:opacity-40 border border-[#1f293d] text-xs font-semibold text-slate-200 transition-colors"
              title="Undo Move"
            >
              <Undo2 size={15} />
              <span>Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo || isGameOver}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-[#222f46] disabled:opacity-40 border border-[#1f293d] text-xs font-semibold text-slate-200 transition-colors"
              title="Redo Move"
            >
              <Redo2 size={15} />
              <span>Redo</span>
            </button>
          </>
        ) : (
          /* Offer Draw (Online Mode) */
          <button
            onClick={() => setShowDrawConfirm(true)}
            disabled={isGameOver}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#182131] hover:bg-[#222f46] disabled:opacity-40 border border-[#1f293d] text-xs font-semibold text-slate-200 transition-colors col-span-2"
            title="Offer Draw"
          >
            <Handshake size={15} />
            <span>Offer Draw</span>
          </button>
        )}
      </div>

      {/* Secondary Controls (Draw, Resign, Restart) */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#1f293d]">
        {/* In non-online mode, offer draw or restart */}
        {mode !== 'online' && (
          <button
            onClick={() => setShowDrawConfirm(true)}
            disabled={isGameOver}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#182131] hover:bg-[#222f46] disabled:opacity-40 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Handshake size={14} />
            <span>Draw</span>
          </button>
        )}

        {/* Resign Button */}
        <button
          onClick={() => setShowResignConfirm(true)}
          disabled={isGameOver}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#182131] hover:bg-red-950/40 hover:text-red-400 disabled:opacity-40 text-xs font-semibold text-slate-400 transition-colors border border-transparent hover:border-red-900/40"
        >
          <Flag size={14} />
          <span>Resign</span>
        </button>

        {/* New Game Button */}
        <button
          onClick={() => setShowRestartConfirm(true)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-subtle transition-all"
        >
          <Plus size={14} />
          <span>New Game</span>
        </button>
      </div>

      {/* Resign Confirmation Modal */}
      {showResignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-red-500/30 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Confirm Resignation</h4>
            <p className="text-xs text-slate-400 mb-5">
              Are you sure you want to resign this match? It will count as a loss.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmResign}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg"
              >
                Yes, Resign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draw Confirmation Modal */}
      {showDrawConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-slate-700 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <h4 className="text-base font-bold text-white mb-1">Offer Draw?</h4>
            <p className="text-xs text-slate-400 mb-5">
              End the game in a mutual draw. Do you wish to continue?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDrawConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDraw}
                className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-lg"
              >
                Confirm Draw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-slate-700 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <h4 className="text-base font-bold text-white mb-1">Start New Match?</h4>
            <p className="text-xs text-slate-400 mb-5">
              Starting a new game will reset the current position and clocks.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestart}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold text-white shadow-lg"
              >
                Start New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
