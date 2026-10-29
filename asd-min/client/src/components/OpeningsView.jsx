import React, { useState } from 'react';
import { Chess } from 'chess.js';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { OPENINGS_DATABASE } from '../utils/openings';
import { soundManager } from '../utils/sound';

export const OpeningsView = ({ theme = 'violet', onOpenInAnalysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEcoGroup, setSelectedEcoGroup] = useState('all'); // 'all' | 'A' | 'B' | 'C' | 'D' | 'E'
  const [selectedOpening, setSelectedOpening] = useState(OPENINGS_DATABASE[0]);
  const [currentStep, setCurrentStep] = useState(selectedOpening.moves.length);

  // Compute chess board for selected opening up to currentStep
  const getBoardForOpening = (opening, step) => {
    const g = new Chess();
    for (let i = 0; i < step && i < opening.moves.length; i++) {
      try {
        g.move(opening.moves[i]);
      } catch {}
    }
    return g;
  };

  const previewGame = getBoardForOpening(selectedOpening, currentStep);

  const filteredOpenings = OPENINGS_DATABASE.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.eco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.moves.join(' ').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedEcoGroup === 'all' || op.eco.startsWith(selectedEcoGroup);

    return matchesSearch && matchesGroup;
  });

  const handleSelectOpening = (op) => {
    setSelectedOpening(op);
    setCurrentStep(op.moves.length);
    soundManager.playMove();
  };

  const handleStepPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      soundManager.playMove();
    }
  };

  const handleStepNext = () => {
    if (currentStep < selectedOpening.moves.length) {
      setCurrentStep((prev) => prev + 1);
      soundManager.playMove();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6">
      {/* Left Column: Interactive Opening Board */}
      <div className="flex flex-col w-full max-w-[560px] gap-3">
        <ChessBoard
          board={previewGame.board()}
          turn={previewGame.turn()}
          orientation="w"
          selectedSquare={null}
          legalMoves={[]}
          lastMove={null}
          theme={theme}
          showLegalMoves={false}
          showCoordinates={true}
          isInteractive={false}
        />

        {/* Step-by-Step Navigator */}
        <div className="flex items-center justify-between p-3 bg-[#111827] border border-[#1f293d] rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-[#182131] hover:bg-[#222f46] text-slate-300"
              title="Reset to Start"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={handleStepPrev}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-[#182131] hover:bg-[#222f46] text-slate-300 disabled:opacity-40"
              title="Previous Move"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleStepNext}
              disabled={currentStep >= selectedOpening.moves.length}
              className="p-2 rounded-xl bg-[#182131] hover:bg-[#222f46] text-slate-300 disabled:opacity-40"
              title="Next Move"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 ml-1">
              Move {currentStep} / {selectedOpening.moves.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-lg">
              {selectedOpening.eco}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Opening Selector & Theory */}
      <div className="flex flex-col w-full max-w-[560px] lg:max-w-[460px] gap-3.5">
        {/* Selected Opening Overview Card */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
            <div>
              <span className="text-xs font-mono font-bold text-violet-400">
                ECO {selectedOpening.eco}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {selectedOpening.name}
              </h3>
            </div>
            {onOpenInAnalysis && (
              <button
                onClick={() => onOpenInAnalysis(previewGame.fen())}
                className="px-2.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Send position to Analysis Board"
              >
                <span>Analyze</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>

          {/* Moves SAN String */}
          <div className="p-2.5 rounded-xl bg-[#182131] border border-slate-800 font-mono text-xs text-cyan-300">
            {selectedOpening.moves.map((m, idx) => (
              <span
                key={idx}
                className={`mr-2 ${
                  idx < currentStep ? 'text-white font-bold' : 'text-slate-500'
                }`}
              >
                {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                {m}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedOpening.desc}
          </p>
        </div>

        {/* Search & ECO Filter Bar */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-3 shadow-xl space-y-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ECO code, or moves..."
              className="w-full bg-[#182131] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {['all', 'A', 'B', 'C', 'D', 'E'].map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedEcoGroup(grp)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all uppercase ${
                  selectedEcoGroup === grp
                    ? 'bg-violet-600 text-white shadow-glow-violet'
                    : 'bg-[#182131] text-slate-400 hover:text-white'
                }`}
              >
                {grp === 'all' ? 'All' : `Volume ${grp}`}
              </button>
            ))}
          </div>

          {/* Openings List */}
          <div className="overflow-y-auto max-h-[240px] space-y-1 pr-1 scrollbar-thin">
            {filteredOpenings.map((op) => {
              const isSelected = selectedOpening.name === op.name;
              return (
                <button
                  key={op.name}
                  onClick={() => handleSelectOpening(op)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-violet-600/20 text-white border border-violet-500/40 font-bold'
                      : 'bg-[#182131] text-slate-300 hover:bg-[#222f46]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[11px] text-cyan-400 font-bold shrink-0">
                      {op.eco}
                    </span>
                    <span className="truncate">{op.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                    {op.moves.length} moves
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

