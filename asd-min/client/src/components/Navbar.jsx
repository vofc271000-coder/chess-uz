import React from 'react';
import { Bot, Users, Globe, Settings, BarChart2, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { ChessPiece } from '../utils/chessPieces';

export const Navbar = ({
  activeMode, // 'ai' | 'local' | 'online'
  onSelectMode,
  onOpenSettings,
  onOpenStats,
  soundEnabled,
  onToggleSound,
  isOnlineConnected = false,
}) => {
  return (
    <header className="bg-[#1e1d1a] border-b border-[#302e2b] sticky top-0 z-40 select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectMode('ai')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2b2925] border border-[#3c3934] flex items-center justify-center p-1 group-hover:border-[#81b64c] transition-colors shadow-inner">
            <ChessPiece type="n" color="w" size="100%" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-gray-100 flex items-center gap-1.5 leading-none">
              <span>GrandMaster</span>
              <span className="text-[#81b64c]">Chess</span>
            </h1>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
              Tournament Platform
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#161512] p-1 rounded-xl border border-[#2b2925]">
          <button
            onClick={() => onSelectMode('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'ai'
                ? 'bg-[#81b64c] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21201d]'
            }`}
          >
            <Bot size={15} />
            <span className="hidden sm:inline">Play vs</span> Computer
          </button>

          <button
            onClick={() => onSelectMode('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'local'
                ? 'bg-[#81b64c] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21201d]'
            }`}
          >
            <Users size={15} />
            <span className="hidden sm:inline">Pass &</span> Play
          </button>

          <button
            onClick={() => onSelectMode('online')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeMode === 'online'
                ? 'bg-[#81b64c] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21201d]'
            }`}
          >
            <Globe size={15} />
            <span>Online</span>
            {activeMode === 'online' && isOnlineConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </nav>

        {/* Controls & Modals */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-[#262421] hover:bg-[#302e2a] text-gray-300 hover:text-white border border-[#383632] transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-gray-500" />}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-2 rounded-lg bg-[#262421] hover:bg-[#302e2a] text-gray-300 hover:text-white border border-[#383632] transition-colors"
            title="View Statistics"
          >
            <BarChart2 size={18} />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#262421] hover:bg-[#302e2a] text-gray-300 hover:text-white border border-[#383632] transition-colors"
            title="Board & Game Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

