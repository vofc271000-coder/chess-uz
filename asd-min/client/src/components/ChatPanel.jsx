import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, MessageSquare, Wifi, WifiOff } from 'lucide-react';

export const ChatPanel = ({
  messages = [],
  onSendMessage,
  roomCode,
  isOpponentConnected = false,
  opponentName = 'Opponent',
  playerName = 'You',
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] rounded-2xl border border-[#1f293d] shadow-xl overflow-hidden select-none">
      {/* Header with Room Code and Connection Status */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#182131] border-b border-[#1f293d]">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Room Chat</span>
        </div>

        {/* Room Code Pill */}
        {roomCode && (
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#222f46] border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-colors"
            title="Click to copy Room Code"
          >
            <span>{roomCode}</span>
            {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {/* Opponent Connection Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0d121f] text-[11px] border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          {isOpponentConnected ? (
            <>
              <Wifi size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{opponentName} is connected</span>
            </>
          ) : (
            <>
              <WifiOff size={13} className="text-amber-400 animate-pulse" />
              <span className="text-amber-400 font-semibold">Waiting for opponent to connect...</span>
            </>
          )}
        </div>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 text-xs max-h-[200px] lg:max-h-[250px] scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-6 italic text-[11px]">
            Say hi to your opponent! Real-time messages will appear here.
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === playerName;
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-1 text-[10px] text-slate-500 mb-0.5">
                  <span className="font-semibold text-slate-400">{msg.sender}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl max-w-[85%] break-words ${
                    isMe
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-[#182131] text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-2 bg-[#182131] border-t border-[#1f293d] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a chat message..."
          className="flex-1 bg-[#111827] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-glow-subtle transition-colors"
          title="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
