import React, { useState } from 'react';
import { X, Clock, Zap, Flame, ShieldAlert, Infinity } from 'lucide-react';

export const TimeControlModal = ({
  isOpen,
  onClose,
  timeControl,
  onSelectTimeControl,
}) => {
  const [customMinutes, setCustomMinutes] = useState(timeControl.minutes || 5);
  const [customIncrement, setCustomIncrement] = useState(timeControl.increment || 0);

  if (!isOpen) return null;

  const presets = [
    { label: '1+0 Bullet', minutes: 1, increment: 0, category: 'bullet', icon: Zap },
    { label: '2+1 Bullet', minutes: 2, increment: 1, category: 'bullet', icon: Zap },
    { label: '3+0 Blitz', minutes: 3, increment: 0, category: 'blitz', icon: Flame },
    { label: '3+2 Blitz', minutes: 3, increment: 2, category: 'blitz', icon: Flame },
    { label: '5+0 Blitz', minutes: 5, increment: 0, category: 'blitz', icon: Flame },
    { label: '5+3 Blitz', minutes: 5, increment: 3, category: 'blitz', icon: Flame },
    { label: '10+0 Rapid', minutes: 10, increment: 0, category: 'rapid', icon: Clock },
    { label: '15+10 Rapid', minutes: 15, increment: 10, category: 'rapid', icon: Clock },
    { label: '30+0 Classical', minutes: 30, increment: 0, category: 'classical', icon: Clock },
    { label: 'Unlimited', minutes: 0, increment: 0, category: 'unlimited', icon: Infinity },
  ];

  const handleApplyPreset = (minutes, increment) => {
    onSelectTimeControl({ minutes, increment });
    onClose();
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    onSelectTimeControl({
      minutes: Number(customMinutes),
      increment: Number(customIncrement),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#182131] border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#111827] border-b border-[#1f293d]">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Select Time Control</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map((p) => {
              const isSelected =
                timeControl.minutes === p.minutes && timeControl.increment === p.increment;
              const Icon = p.icon;

              return (
                <button
                  key={p.label}
                  onClick={() => handleApplyPreset(p.minutes, p.increment)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 text-white font-bold shadow-glow-cyan'
                      : 'border-slate-800 bg-[#111827] hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon
                    size={16}
                    className={isSelected ? 'text-cyan-400' : 'text-slate-400'}
                  />
                  <span className="text-xs">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Time Control */}
          <form onSubmit={handleApplyCustom} className="pt-3 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Custom Time Control
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Minutes per side</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Increment (seconds)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={customIncrement}
                  onChange={(e) => setCustomIncrement(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs font-bold text-white shadow-lg transition-all"
            >
              Apply Custom Time
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

