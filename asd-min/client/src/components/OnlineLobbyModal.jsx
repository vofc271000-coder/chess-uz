import React, { useState } from 'react';
import {
  X,
  Globe,
  Plus,
  LogIn,
  Users,
  Shield,
  Clock,
  Zap,
  Flame,
  Infinity,
} from 'lucide-react';

export const OnlineLobbyModal = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  isCreating = false,
  isJoining = false,
  error = null,
}) => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'join'
  const [playerName, setPlayerName] = useState(
    () =>
      localStorage.getItem('grandmaster_player_name') ||
      'GrandMaster ' + Math.floor(100 + Math.random() * 900)
  );
  const [timeControlMinutes, setTimeControlMinutes] = useState(5);
  const [incrementSeconds, setIncrementSeconds] = useState(0);
  const [preferredColor, setPreferredColor] = useState('random'); // 'w' | 'b' | 'random'
  const [joinCode, setJoinCode] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    setPlayerName(val);
    try {
      localStorage.setItem('grandmaster_player_name', val);
    } catch {}
  };

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateRoom({
      creatorName: playerName.trim() || 'Player',
      timeControlMinutes: Number(timeControlMinutes),
      incrementSeconds: Number(incrementSeconds),
      preferredColor,
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    onJoinRoom({
      playerName: playerName.trim() || 'Player',
      roomId: joinCode.trim().toUpperCase(),
    });
  };

  const timePresets = [
    { label: '1+0 Bullet', min: 1, inc: 0, icon: Zap },
    { label: '3+0 Blitz', min: 3, inc: 0, icon: Flame },
    { label: '3+2 Blitz', min: 3, inc: 2, icon: Flame },
    { label: '5+0 Rapid', min: 5, inc: 0, icon: Clock },
    { label: '10+0 Rapid', min: 10, inc: 0, icon: Clock },
    { label: 'Unlimited', min: 0, inc: 0, icon: Infinity },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#182131] border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#111827] border-b border-[#1f293d]">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Online Real-Time Arena</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1f293d] bg-[#0d121f]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-[#182131]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus size={16} />
            <span>Create Match</span>
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'join'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-[#182131]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn size={16} />
            <span>Join with Code</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="p-5">
          {/* Player Display Name */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Player Handle
            </label>
            <input
              type="text"
              value={playerName}
              maxLength={20}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="Enter your name"
            />
          </div>

          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Time Control Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Time Control
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timePresets.map((tp) => {
                    const isSelected =
                      timeControlMinutes === tp.min && incrementSeconds === tp.inc;
                    const Icon = tp.icon;
                    return (
                      <button
                        type="button"
                        key={tp.label}
                        onClick={() => {
                          setTimeControlMinutes(tp.min);
                          setIncrementSeconds(tp.inc);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 text-white font-bold shadow-glow-cyan'
                            : 'border-slate-800 bg-[#111827] hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Icon size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-400'} />
                        <span className="text-[11px] mt-1">{tp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Preferred Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'w', label: 'White' },
                    { id: 'random', label: 'Random' },
                    { id: 'b', label: 'Black' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setPreferredColor(c.id)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        preferredColor === c.id
                          ? 'border-violet-500 bg-violet-600/20 text-white shadow-glow-violet'
                          : 'border-slate-800 bg-[#111827] hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-sm font-bold text-white shadow-glow-subtle flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isCreating ? 'Generating Room...' : 'Create Match Room'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  6-Character Room Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. K9W4X2"
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3.5 py-3 text-center text-lg font-mono font-bold tracking-widest text-cyan-400 uppercase focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isJoining || joinCode.length < 3}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-sm font-bold text-white shadow-glow-subtle flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isJoining ? 'Connecting to Room...' : 'Join Match'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
