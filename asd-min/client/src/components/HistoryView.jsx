import React, { useState } from 'react';
import {
  History,
  Trophy,
  BarChart3,
  Calendar,
  ExternalLink,
  Trash2,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { clearAllStats } from '../utils/storage';

export const HistoryView = ({ stats, recentGames = [], onStatsReset, onAnalyzeGame }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalGames = stats.gamesPlayed || 0;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  const handleReset = () => {
    clearAllStats();
    setShowConfirmReset(false);
    onStatsReset();
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-cyan-400" />
            <span>Player Performance & Match Archives</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your lifetime win rates, historical outcomes, and game analytics.
          </p>
        </div>

        {totalGames > 0 && (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-800/40 text-xs font-bold transition-colors"
          >
            <Trash2 size={14} />
            <span>Reset Stats</span>
          </button>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl text-center">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Total Matches
          </span>
          <span className="text-3xl font-black text-white">{totalGames}</span>
        </div>

        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl text-center">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            Victories
          </span>
          <span className="text-3xl font-black text-emerald-400">{stats.wins || 0}</span>
        </div>

        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl text-center">
          <span className="text-xs text-red-400 font-bold uppercase tracking-wider block mb-1">
            Defeats
          </span>
          <span className="text-3xl font-black text-red-400">{stats.losses || 0}</span>
        </div>

        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl text-center">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">
            Draws
          </span>
          <span className="text-3xl font-black text-amber-400">{stats.draws || 0}</span>
        </div>
      </div>

      {/* Win Rate Progress Bar */}
      <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span className="flex items-center gap-2">
            <Trophy size={16} className="text-cyan-400" />
            <span>Overall Win Rate</span>
          </span>
          <span className="text-cyan-400 font-mono text-sm">{winRate}%</span>
        </div>
        <div className="w-full h-3 bg-[#080B12] rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${winRate}%` }}
            className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500 rounded-full shadow-glow-cyan"
          />
        </div>
      </div>

      {/* Mode Performance Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl">
          <div className="font-bold text-white text-sm mb-1">vs Computer AI</div>
          <div className="text-xs text-slate-400 mb-2">{stats.byMode?.ai?.played || 0} games played</div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-emerald-400">{stats.byMode?.ai?.wins || 0}W</span>
            <span className="text-slate-600">/</span>
            <span className="text-red-400">{stats.byMode?.ai?.losses || 0}L</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{stats.byMode?.ai?.draws || 0}D</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl">
          <div className="font-bold text-white text-sm mb-1">Pass & Play Local</div>
          <div className="text-xs text-slate-400 mb-2">{stats.byMode?.local?.played || 0} games played</div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-emerald-400">{stats.byMode?.local?.wins || 0}W</span>
            <span className="text-slate-600">/</span>
            <span className="text-red-400">{stats.byMode?.local?.losses || 0}L</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{stats.byMode?.local?.draws || 0}D</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f293d] p-4 rounded-2xl shadow-xl">
          <div className="font-bold text-white text-sm mb-1">Online Multiplayer</div>
          <div className="text-xs text-slate-400 mb-2">{stats.byMode?.online?.played || 0} games played</div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-emerald-400">{stats.byMode?.online?.wins || 0}W</span>
            <span className="text-slate-600">/</span>
            <span className="text-red-400">{stats.byMode?.online?.losses || 0}L</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{stats.byMode?.online?.draws || 0}D</span>
          </div>
        </div>
      </div>

      {/* Match History Table */}
      <div className="bg-[#111827] border border-[#1f293d] rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-[#182131] border-b border-[#1f293d] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History size={16} className="text-cyan-400" />
            <span>Recent Games Archive</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {recentGames.length} recorded
          </span>
        </div>

        {recentGames.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs italic">
            No completed games yet. Finish a match against Computer or Friends to log it here!
          </div>
        ) : (
          <div className="divide-y divide-slate-800 max-h-[420px] overflow-y-auto">
            {recentGames.map((game) => {
              const isWin = game.outcome === 'win';
              const isDraw = game.outcome === 'draw';

              return (
                <div
                  key={game.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[#182131] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                        isDraw
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isWin
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isDraw ? 'D' : isWin ? 'W' : 'L'}
                    </span>

                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>
                          {game.mode === 'ai' ? 'vs Stockfish AI' : game.mode === 'online' ? 'Online Multiplayer' : 'Pass & Play'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({game.moves || 0} moves)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{game.reason}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500">
                      {game.date}
                    </span>
                    {onAnalyzeGame && (
                      <button
                        onClick={() => onAnalyzeGame(game)}
                        className="px-2.5 py-1 rounded-lg bg-[#182131] hover:bg-[#222f46] text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
                        title="Review position in Analysis Board"
                      >
                        <span>Analyze</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#182131] border border-red-500/30 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <h4 className="text-base font-bold text-white mb-2">Reset All Stats?</h4>
            <p className="text-xs text-slate-400 mb-5">
              This will permanently clear your match history and win-loss statistics.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg"
              >
                Clear Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

