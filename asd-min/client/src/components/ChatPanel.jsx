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
    <div className="flex flex-col h-full bg-[#21201d] rounded-xl border border-[#302e2b] shadow-xl overflow-hidden">
      {/* Header with Room Code and Connection Status */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#1e1d1a] border-b border-[#302e2b]">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#81b64c]" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Room Chat</span>
        </div>

        {/* Room Code Pill */}
        {roomCode && (
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-[#3c3934] text-xs font-mono font-bold text-gray-300 transition-colors"
            title="Click to copy Room Code"
          >
            <span>{roomCode}</span>
            {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {/* Opponent Connection Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181715] text-[11px] border-b border-[#292724]">
        <div className="flex items-center gap-1.5">
          {isOpponentConnected ? (
            <>
              <Wifi size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">{opponentName} is connected</span>
            </>
          ) : (
            <>
              <WifiOff size={13} className="text-amber-400 animate-pulse" />
              <span className="text-amber-400 font-medium">Waiting for opponent to join...</span>
            </>
          )}
        </div>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 text-xs max-h-[220px] lg:max-h-[280px] scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-6 italic text-[11px]">
            Say hi to your opponent!
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === playerName;
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-1 text-[10px] text-gray-500 mb-0.5">
                  <span className="font-semibold text-gray-400">{msg.sender}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg max-w-[85%] break-words ${
                    isMe
                      ? 'bg-[#81b64c] text-white font-medium rounded-tr-none'
                      : 'bg-[#2b2925] text-gray-200 border border-[#383632] rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Send Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1 p-2 bg-[#1c1b18] border-t border-[#302e2b]">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 bg-[#2b2925] border border-[#3a3833] rounded-lg px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#81b64c]"
          maxLength={150}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-1.5 bg-[#81b64c] hover:bg-[#90c558] disabled:opacity-40 rounded-lg text-white transition-colors"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

