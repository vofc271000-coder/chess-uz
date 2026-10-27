import React, { useState } from 'react';
import { X, Globe, Plus, LogIn, Copy, Check, Users, Shield, Clock } from 'lucide-react';

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
    () => localStorage.getItem('grandmaster_player_name') || 'Player ' + Math.floor(100 + Math.random() * 900)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#21201d] border border-[#3c3934] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1e1d1a] border-b border-[#302e2b]">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-[#81b64c]" />
            <h3 className="text-base font-bold text-gray-100">Online Multiplayer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2925] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#302e2b] bg-[#1c1b18]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'text-[#81b64c] border-b-2 border-[#81b64c] bg-[#21201d]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#262421]'
            }`}
          >
            <Plus size={16} />
            Create Game
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'join'
                ? 'text-[#81b64c] border-b-2 border-[#81b64c] bg-[#21201d]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#262421]'
            }`}
          >
            <LogIn size={16} />
            Join Room
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="p-5">
          {/* Player Name Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Your Display Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. GrandMaster99"
              maxLength={20}
              className="w-full bg-[#2b2925] border border-[#3c3934] rounded-lg px-3.5 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#81b64c]"
              required
            />
          </div>

          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Time Control */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Time Control
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { label: '1 min Bullet', m: 1, inc: 0 },
                    { label: '3+2 Blitz', m: 3, inc: 2 },
                    { label: '5 min Rapid', m: 5, inc: 0 },
                    { label: '10 min Rapid', m: 10, inc: 0 },
                    { label: '15+10 Classical', m: 15, inc: 10 },
                    { label: 'Unlimited', m: 0, inc: 0 },
                  ].map((tc) => {
                    const isSelected = timeControlMinutes === tc.m && incrementSeconds === tc.inc;
                    return (
                      <button
                        key={tc.label}
                        type="button"
                        onClick={() => {
                          setTimeControlMinutes(tc.m);
                          setIncrementSeconds(tc.inc);
                        }}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'border-[#81b64c] bg-[#81b64c]/15 text-white font-bold'
                            : 'border-[#3c3934] bg-[#2b2925] hover:bg-[#34322d] text-gray-300'
                        }`}
                      >
                        {tc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Side / Color Choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Play As
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'w', label: 'White' },
                    { id: 'random', label: 'Random' },
                    { id: 'b', label: 'Black' },
                  ].map((side) => {
                    const isSelected = preferredColor === side.id;
                    return (
                      <button
                        key={side.id}
                        type="button"
                        onClick={() => setPreferredColor(side.id)}
                        className={`p-2 rounded-lg border text-center font-semibold transition-all ${
                          isSelected
                            ? 'border-[#81b64c] bg-[#81b64c]/15 text-white font-bold'
                            : 'border-[#3c3934] bg-[#2b2925] hover:bg-[#34322d] text-gray-300'
                        }`}
                      >
                        {side.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#81b64c] hover:bg-[#90c558] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all mt-2"
              >
                <Plus size={18} />
                <span>{isCreating ? 'Generating Room...' : 'Create Game Room'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  6-Letter Room Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. K9W4X2"
                  maxLength={6}
                  className="w-full bg-[#2b2925] border border-[#3c3934] rounded-lg px-3.5 py-3 text-center text-xl font-mono font-bold tracking-widest text-emerald-400 placeholder-gray-600 focus:outline-none focus:border-[#81b64c]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isJoining || joinCode.length < 4}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#81b64c] hover:bg-[#90c558] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all mt-2"
              >
                <LogIn size={18} />
                <span>{isJoining ? 'Joining Game...' : 'Join Game'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

