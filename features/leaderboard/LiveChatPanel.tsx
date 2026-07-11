"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "@/features/chat/hooks/useChat";  
import { useAuthStore } from "@/features/auth/store/auth.store";

interface LiveChatPanelProps {
  gameRoomId?: string;     // Pass this from MatchArena
  isSpectator?: boolean;
}

export default function LiveChatPanel({ gameRoomId, isSpectator = false }: LiveChatPanelProps) {
  const { user } = useAuthStore();

  const defaultRoom = gameRoomId || "lobby";
  const { messages, sendMessage, joinRoom } = useChat(defaultRoom);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const chatTitle = gameRoomId 
    ? (isSpectator ? "Spectator Chat" : "Match Chat") 
    : "Squad Chat";

  return (
    <div className="flex-1 min-h-[400px] flex flex-col rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-300 uppercase font-mono truncate">
            {chatTitle}
          </h3>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider truncate">
            {gameRoomId ? `Room ${gameRoomId.slice(0,8)}...` : "Squad Channel"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-2.5 overflow-y-auto text-xs pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-mono text-center mt-8">
            No messages yet. Be the first to speak!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className={`text-[9px] font-mono font-bold mb-0.5 ${isMe ? "text-cyan-400" : "text-indigo-400"}`}>
                  {isMe ? "You" : msg.username}
                </span>
                <div className={`max-w-[85%] px-3 py-1.5 rounded-xl text-[11px] leading-relaxed ${
                  isMe 
                    ? "bg-cyan-950/30 border border-cyan-500/20 text-cyan-100" 
                    : "bg-slate-800/60 border border-slate-700/40 text-slate-300"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-slate-800 bg-[#07090e] py-2 px-3 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-slate-700 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-3 py-2 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/50 transition-colors disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}