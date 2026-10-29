import React, { useState } from 'react';
import { X, BarChart3, Trophy, Trash2, Award, Zap } from 'lucide-react';
import { clearAllStats } from '../utils/storage';

export const StatsModal = ({
  isOpen,
  onClose,
  stats,
  recentGames = [],
  onStatsReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const totalGames = stats.gamesPlayed || 0;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  const handleReset = () => {
    clearAllStats();
    setShowConfirmReset(false);
    onStatsReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#21201d] border border-[#3c3934] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1e1d1a] border-b border-[#302e2b]">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#81b64c]" />
            <h3 className="text-base font-bold text-gray-100">Player Statistics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2925] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-zinc-700">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-[#2b2925] p-3 rounded-xl border border-[#3c3934] text-center">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block">Played</span>
              <span className="text-xl font-black text-gray-100">{totalGames}</span>
            </div>
            <div className="bg-[#2b2925] p-3 rounded-xl border border-[#3c3934] text-center">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">Wins</span>
              <span className="text-xl font-black text-emerald-400">{stats.wins || 0}</span>
            </div>
            <div className="bg-[#2b2925] p-3 rounded-xl border border-[#3c3934] text-center">
              <span className="text-[11px] text-red-400 font-semibold uppercase tracking-wider block">Losses</span>
              <span className="text-xl font-black text-red-400">{stats.losses || 0}</span>
            </div>
            <div className="bg-[#2b2925] p-3 rounded-xl border border-[#3c3934] text-center">
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">Draws</span>
              <span className="text-xl font-black text-amber-400">{stats.draws || 0}</span>
            </div>
          </div>

          {/* Win Rate Progress Bar */}
          <div className="bg-[#2b2925] p-4 rounded-xl border border-[#3c3934]">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Trophy size={15} className="text-amber-400" />
                Overall Win Rate
              </span>
              <span className="text-[#81b64c] text-sm">{winRate}%</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${winRate}%` }}
                className="h-full bg-[#81b64c] transition-all duration-500 rounded-full"
              />
            </div>
          </div>

          {/* Mode Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Performance by Mode</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#1e1d1a] p-3 rounded-lg border border-[#302e2b]">
                <div className="font-bold text-gray-200 mb-1">vs Computer</div>
                <div className="text-gray-400 text-[11px]">
                  {stats.byMode?.ai?.played || 0} games
                </div>
                <div className="text-[#81b64c] font-semibold mt-1">
                  {stats.byMode?.ai?.wins || 0}W / {stats.byMode?.ai?.losses || 0}L
                </div>
              </div>

              <div className="bg-[#1e1d1a] p-3 rounded-lg border border-[#302e2b]">
                <div className="font-bold text-gray-200 mb-1">Pass & Play</div>
                <div className="text-gray-400 text-[11px]">
                  {stats.byMode?.local?.played || 0} games
                </div>
                <div className="text-[#81b64c] font-semibold mt-1">
                  {stats.byMode?.local?.wins || 0}W / {stats.byMode?.local?.draws || 0}D
                </div>
              </div>

              <div className="bg-[#1e1d1a] p-3 rounded-lg border border-[#302e2b]">
                <div className="font-bold text-gray-200 mb-1">Online</div>
                <div className="text-gray-400 text-[11px]">
                  {stats.byMode?.online?.played || 0} games
                </div>
                <div className="text-[#81b64c] font-semibold mt-1">
                  {stats.byMode?.online?.wins || 0}W / {stats.byMode?.online?.losses || 0}L
                </div>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Recent Matches</h4>
            {recentGames.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-xs italic bg-[#1e1d1a] rounded-lg border border-[#302e2b]">
                No recorded games yet. Play a match to see it here!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#1e1d1a] border border-[#302e2b] text-xs"
                  >
                    <div>
                      <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                        <span className="capitalize">{game.mode}</span>
                        <span className="text-[10px] text-gray-500 font-normal">({game.date})</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{game.reason}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider ${
                        game.outcome === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : game.outcome === 'loss'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {game.outcome}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1e1d1a] border-t border-[#302e2b] flex items-center justify-between">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Clear all stats?</span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 bg-[#33312c] text-gray-300 text-xs rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
              <span>Reset Stats</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#81b64c] hover:bg-[#90c558] text-white font-bold text-xs rounded-lg transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

