import React from 'react';
import { X, Volume2, VolumeX, Palette, Eye, Hash, RotateCw } from 'lucide-react';
import { soundManager } from '../utils/sound';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes = [
    { id: 'green', name: 'Classic Green', light: '#ebecd0', dark: '#739552' },
    { id: 'dark', name: 'Charcoal Dark', light: '#9aaab6', dark: '#4d5a63' },
    { id: 'wood', name: 'Tournament Wood', light: '#f0d9b5', dark: '#b58863' },
    { id: 'blue', name: 'Oceanic Blue', light: '#eaeff5', dark: '#4b7399' },
  ];

  const handleSoundTest = () => {
    soundManager.playMove();
    setTimeout(() => soundManager.playCapture(), 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#21201d] border border-[#3c3934] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1e1d1a] border-b border-[#302e2b]">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-[#81b64c]" />
            <h3 className="text-base font-bold text-gray-100">Board & Game Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2925] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-6">
          {/* Board Themes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Board Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const isSelected = settings.boardTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ boardTheme: t.id })}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#81b64c] bg-[#81b64c]/10 text-white font-semibold'
                        : 'border-[#383632] bg-[#2b2925] hover:bg-[#33312c] text-gray-300'
                    }`}
                  >
                    {/* 2x2 Mini Board Preview */}
                    <div className="w-8 h-8 rounded-md grid grid-cols-2 grid-rows-2 overflow-hidden border border-black/40 shrink-0">
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

          {/* Toggles */}
          <div className="space-y-3.5 pt-2 border-t border-[#302e2b]">
            {/* Sound FX */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? (
                  <Volume2 size={18} className="text-[#81b64c]" />
                ) : (
                  <VolumeX size={18} className="text-gray-500" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-200">Sound Effects</div>
                  <div className="text-xs text-gray-500">Audio feedback on moves and captures</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.soundEnabled && (
                  <button
                    onClick={handleSoundTest}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#33312c] text-gray-300 hover:text-white"
                  >
                    Test
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    soundManager.setEnabled(enabled);
                    onUpdateSettings({ soundEnabled: enabled });
                  }}
                  className="w-5 h-5 accent-[#81b64c] cursor-pointer"
                />
              </div>
            </div>

            {/* Legal Move Dots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye size={18} className="text-[#81b64c]" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Highlight Legal Moves</div>
                  <div className="text-xs text-gray-500">Show dots and rings on valid target squares</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLegalMoves}
                onChange={(e) => onUpdateSettings({ showLegalMoves: e.target.checked })}
                className="w-5 h-5 accent-[#81b64c] cursor-pointer"
              />
            </div>

            {/* Board Coordinates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Hash size={18} className="text-[#81b64c]" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Board Coordinates</div>
                  <div className="text-xs text-gray-500">Display rank (1-8) and file (a-h) labels</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={(e) => onUpdateSettings({ showCoordinates: e.target.checked })}
                className="w-5 h-5 accent-[#81b64c] cursor-pointer"
              />
            </div>

            {/* Auto-flip Board on Turn (for pass-and-play) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <RotateCw size={18} className="text-[#81b64c]" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Auto-Flip Board (Local)</div>
                  <div className="text-xs text-gray-500">Rotate board automatically on each turn in Pass & Play</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFlipBoard}
                onChange={(e) => onUpdateSettings({ autoFlipBoard: e.target.checked })}
                className="w-5 h-5 accent-[#81b64c] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1e1d1a] border-t border-[#302e2b] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#81b64c] hover:bg-[#90c558] text-white font-bold text-xs rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

