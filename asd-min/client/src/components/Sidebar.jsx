import React from 'react';
import {
  Swords,
  Search,
  Sparkles,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ChessPiece } from '../utils/chessPieces';

export const Sidebar = ({
  activeTab = 'play', // 'play' | 'analysis' | 'puzzles' | 'openings' | 'history'
  onSelectTab,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'play', label: 'Play Arena', icon: Swords, badge: 'Live' },
    { id: 'analysis', label: 'Analysis Board', icon: Search },
    { id: 'puzzles', label: 'Tactics & Puzzles', icon: Sparkles, badge: 'Trainer' },
    { id: 'openings', label: 'Openings Book', icon: BookOpen },
    { id: 'history', label: 'Game History', icon: History },
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on small mobile screens) */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-[#111827] border-r border-[#1f293d] transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-18' : 'w-60'
        }`}
      >
        {/* Top: Logo & Brand */}
        <div className="flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#1f293d]">
            <div
              onClick={() => onSelectTab('play')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-glow-violet shrink-0 transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center p-1">
                  <ChessPiece type="n" color="w" size="100%" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight leading-tight text-white flex items-center gap-1">
                    <span>GrandMaster</span>
                  </span>
                  <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
                    Chess Studio
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-white border border-violet-500/40 shadow-glow-subtle'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#182131]'
                  }`}
                  title={item.label}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-cyan-400' : 'text-slate-400'}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Settings & Sound Quick Controls */}
        <div className="p-3 border-t border-[#1f293d] space-y-1.5">
          <button
            onClick={onToggleSound}
            className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#182131] transition-colors`}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-violet-400" />
            ) : (
              <VolumeX size={18} className="text-slate-500" />
            )}
            {!isCollapsed && (
              <span>{soundEnabled ? 'Audio Active' : 'Muted'}</span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#182131] transition-colors"
            title="Settings"
          >
            <Settings size={18} className="text-slate-400" />
            {!isCollapsed && <span>Settings & Themes</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#111827]/95 backdrop-blur-md border-t border-[#1f293d] z-40 px-2 py-1.5 flex items-center justify-around select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={19} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
              <span className="text-[10px] mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <Settings size={19} />
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </nav>
    </>
  );
};

