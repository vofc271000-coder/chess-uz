import React from 'react';
import {
  Bot,
  Users,
  Globe,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ChessPiece } from '../utils/chessPieces';

export const Navbar = ({
  activeTab,
  activeMode, // 'ai' | 'local' | 'online'
  onSelectMode,
  timeControl,
  onOpenTimeControl,
  onFlipBoard,
  soundEnabled,
  onToggleSound,
  isOnlineConnected = false,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'analysis':
        return 'Deep Engine Analysis';
      case 'puzzles':
        return 'Tactics & Puzzle Studio';
      case 'openings':
        return 'Opening Encyclopedia';
      case 'history':
        return 'Match Archives & Stats';
      case 'play':
      default:
        return 'GrandMaster Chess Arena';
    }
  };

  const formatTimeControl = (tc) => {
    if (!tc || tc.minutes === 0) return 'Unlimited';
    return `${tc.minutes}m ${tc.increment > 0 ? `+${tc.increment}s` : ''}`;
  };

  return (
    <header className="bg-[#111827]/95 backdrop-blur-md border-b border-[#1f293d] sticky top-0 z-20 select-none shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: View Title / Mobile Brand */}
        <div className="flex items-center gap-2.5">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-[#111827] rounded-[6px] flex items-center justify-center p-0.5">
                <ChessPiece type="n" color="w" size="100%" />
              </div>
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">GrandMaster</span>
          </div>

          <div className="hidden md:flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{getTabTitle()}</span>
              {activeTab === 'play' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {activeMode === 'ai' ? 'vs Computer' : activeMode === 'local' ? 'Pass & Play' : 'Multiplayer'}
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Center: Game Mode Tabs (Only when on 'play' tab) */}
        {activeTab === 'play' && (
          <nav className="flex items-center gap-1 bg-[#080B12] p-1 rounded-xl border border-[#1f293d]">
            <button
              onClick={() => onSelectMode('ai')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'ai'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#182131]'
              }`}
            >
              <Bot size={15} />
              <span className="hidden sm:inline">Play</span> AI
            </button>

            <button
              onClick={() => onSelectMode('local')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'local'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#182131]'
              }`}
            >
              <Users size={15} />
              <span className="hidden sm:inline">Pass &</span> Play
            </button>

            <button
              onClick={() => onSelectMode('online')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                activeMode === 'online'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#182131]'
              }`}
            >
              <Globe size={15} />
              <span>Online</span>
              {activeMode === 'online' && isOnlineConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          </nav>
        )}

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Time Control Selector Pill (Active in Play view) */}
          {activeTab === 'play' && (
            <button
              onClick={onOpenTimeControl}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#182131] hover:bg-[#222f46] text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/30 transition-colors"
              title="Change Time Control"
            >
              <Clock size={14} className="text-cyan-400" />
              <span>{formatTimeControl(timeControl)}</span>
            </button>
          )}

          {/* Flip Board Button */}
          <button
            onClick={onFlipBoard}
            className="p-2 rounded-lg bg-[#182131] hover:bg-[#222f46] text-slate-300 hover:text-white border border-[#1f293d] transition-colors"
            title="Flip Board Orientation"
          >
            <RotateCcw size={16} />
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-[#182131] hover:bg-[#222f46] text-slate-300 hover:text-white border border-[#1f293d] transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? (
              <Volume2 size={16} className="text-violet-400" />
            ) : (
              <VolumeX size={16} className="text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
