import React from 'react';
import {
  X,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  Hash,
  RotateCw,
  Zap,
  BarChart2,
  Keyboard,
  Crown,
} from 'lucide-react';
import { THEMES } from './ChessBoard';
import { soundManager } from '../utils/sound';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleSoundTest = () => {
    soundManager.playMove();
    setTimeout(() => soundManager.playCapture(), 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#182131] border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#111827] border-b border-[#1f293d]">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Platform Settings & Customization</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Board Themes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Board Theme Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(THEMES).map((t) => {
                const isSelected = settings.boardTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ boardTheme: t.id })}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 text-white font-bold shadow-glow-cyan'
                        : 'border-slate-800 bg-[#111827] hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {/* 2x2 Mini Board Preview */}
                    <div className="w-7 h-7 rounded-md grid grid-cols-2 grid-rows-2 overflow-hidden border border-black/40 shrink-0">
                      <div style={{ backgroundColor: t.light }} />
                      <div style={{ backgroundColor: t.dark }} />
                      <div style={{ backgroundColor: t.dark }} />
                      <div style={{ backgroundColor: t.light }} />
                    </div>
                    <span className="text-xs truncate">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Feedback Settings */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? (
                  <Volume2 size={18} className="text-violet-400" />
                ) : (
                  <VolumeX size={18} className="text-slate-500" />
                )}
                <div>
                  <div className="text-sm font-semibold text-white">Sound Effects</div>
                  <div className="text-xs text-slate-400">Audio feedback on moves, captures, checks & clocks</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.soundEnabled && (
                  <button
                    onClick={handleSoundTest}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700"
                  >
                    Test
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Gameplay & Board Display Toggles */}
          <div className="space-y-3.5 pt-3 border-t border-slate-800">
            {/* Legal Move Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye size={18} className="text-cyan-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Legal Move Indicators</div>
                  <div className="text-xs text-slate-400">Display valid destination dots and capture rings</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLegalMoves}
                onChange={(e) => onUpdateSettings({ showLegalMoves: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Board Coordinates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Hash size={18} className="text-cyan-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Board Coordinates</div>
                  <div className="text-xs text-slate-400">Display files (a-h) and ranks (1-8)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={(e) => onUpdateSettings({ showCoordinates: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Evaluation Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BarChart2 size={18} className="text-violet-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Live Evaluation Bar</div>
                  <div className="text-xs text-slate-400">Show Stockfish position advantage bar on board</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showEvaluationBar}
                onChange={(e) => onUpdateSettings({ showEvaluationBar: e.target.checked })}
                className="w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Auto-flip board in Pass & Play */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <RotateCw size={18} className="text-violet-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Pass & Play Auto-Flip</div>
                  <div className="text-xs text-slate-400">Rotate board automatically to face active player</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFlipBoard}
                onChange={(e) => onUpdateSettings({ autoFlipBoard: e.target.checked })}
                className="w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Auto-Queen */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Crown size={18} className="text-amber-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Auto-Promote to Queen</div>
                  <div className="text-xs text-slate-400">Always promote pawns to Queen without showing dialog</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoQueen}
                onChange={(e) => onUpdateSettings({ autoQueen: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              <Keyboard size={15} className="text-cyan-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center justify-between bg-[#111827] px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>Flip Board</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-300 border border-slate-700">Space</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#111827] px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>AI Hint</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-300 border border-slate-700">H</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#111827] px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>Undo Move</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-300 border border-slate-700">U</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#111827] px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>Navigate History</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-300 border border-slate-700">← / →</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
